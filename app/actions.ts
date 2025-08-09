"use server"

import { getDb } from "@/db"
import { categories, ecosystems, projects } from "@/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Types for form data
export type CreateCategoryData = {
  name: string
  slug: string
  description?: string
  sortOrder: number
}

export type UpdateCategoryData = CreateCategoryData & {
  id: string
}

export type CreateEcosystemData = {
  categoryId: string
  name: string
  slug: string
  logoUrl?: string
  description?: string
}

export type UpdateEcosystemData = CreateEcosystemData & {
  id: string
}

export type CreateProjectData = {
  ecosystemId: string
  name: string
  logoUrl?: string
  description?: string
  websiteUrl?: string
}

export type UpdateProjectData = CreateProjectData & {
  id: string
}

// Action result type for consistent error handling
export type ActionResult<T = unknown> = {
  success: boolean
  error?: string
  data?: T
}

export type CategoryWithEcosystems = {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  ecosystems: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    description: string | null
  }[]
}

export async function getCategoriesWithEcosystems(): Promise<
  CategoryWithEcosystems[]
> {
  try {
    const db = getDb()
    const result = await db.query.categories.findMany({
      orderBy: [asc(categories.sortOrder)],
      with: {
        ecosystems: {
          orderBy: [asc(ecosystems.name)]
        }
      }
    })

    return result.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      ecosystems: category.ecosystems.map(ecosystem => ({
        id: ecosystem.id,
        name: ecosystem.name,
        slug: ecosystem.slug,
        logoUrl: ecosystem.logoUrl,
        description: ecosystem.description
      }))
    }))
  } catch (error) {
    console.error("Error fetching categories with ecosystems:", error)
    return []
  }
}

export type EcosystemWithProjects = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  description: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  projects: {
    id: string
    name: string
    logoUrl: string | null
    description: string | null
    websiteUrl: string | null
  }[]
}

export async function getEcosystemDetails(
  slug: string
): Promise<EcosystemWithProjects | null> {
  try {
    const db = getDb()
    const result = await db.query.ecosystems.findFirst({
      where: eq(ecosystems.slug, slug),
      with: {
        category: true,
        projects: {
          orderBy: [asc(projects.name)]
        }
      }
    })

    if (!result) {
      return null
    }

    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      logoUrl: result.logoUrl,
      description: result.description,
      category: {
        id: result.category.id,
        name: result.category.name,
        slug: result.category.slug
      },
      projects: result.projects.map(project => ({
        id: project.id,
        name: project.name,
        logoUrl: project.logoUrl,
        description: project.description,
        websiteUrl: project.websiteUrl
      }))
    }
  } catch (error) {
    console.error("Error fetching ecosystem details:", error)
    return null
  }
}

// =============================================================================
// ADMIN READ OPERATIONS
// =============================================================================

export async function getAllCategories() {
  try {
    const db = getDb()
    const result = await db.query.categories.findMany({
      orderBy: [asc(categories.sortOrder)]
    })
    return result
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategoryById(id: string) {
  try {
    const db = getDb()
    const result = await db.query.categories.findFirst({
      where: eq(categories.id, id)
    })
    return result
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

export async function getAllEcosystems() {
  try {
    const db = getDb()
    const result = await db.query.ecosystems.findMany({
      orderBy: [asc(ecosystems.name)],
      with: {
        category: true
      }
    })
    return result
  } catch (error) {
    console.error("Error fetching ecosystems:", error)
    return []
  }
}

export async function getEcosystemById(id: string) {
  try {
    const db = getDb()
    const result = await db.query.ecosystems.findFirst({
      where: eq(ecosystems.id, id),
      with: {
        category: true
      }
    })
    return result
  } catch (error) {
    console.error("Error fetching ecosystem:", error)
    return null
  }
}

export async function getAllProjects() {
  try {
    const db = getDb()
    const result = await db.query.projects.findMany({
      orderBy: [asc(projects.name)],
      with: {
        ecosystem: {
          with: {
            category: true
          }
        }
      }
    })
    return result
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getProjectById(id: string) {
  try {
    const db = getDb()
    const result = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        ecosystem: {
          with: {
            category: true
          }
        }
      }
    })
    return result
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

// =============================================================================
// CATEGORY CRUD OPERATIONS
// =============================================================================

export async function createCategory(
  data: CreateCategoryData
): Promise<ActionResult> {
  try {
    console.log("Creating category with data:", data)

    const db = getDb()
    console.log("Database connection established")

    // Check for duplicate slug
    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.slug, data.slug)
    })

    if (existingCategory) {
      console.log("Category with slug already exists:", data.slug)
      return {
        success: false,
        error: "A category with this slug already exists"
      }
    }

    console.log("Inserting new category...")
    const [newCategory] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        sortOrder: data.sortOrder,
        updatedAt: new Date()
      })
      .returning()

    console.log("Category created successfully:", newCategory)

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      data: newCategory
    }
  } catch (error) {
    console.error("Error creating category:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      data
    })

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category"
    }
  }
}

export async function updateCategory(
  data: UpdateCategoryData
): Promise<ActionResult> {
  try {
    const db = getDb()
    // Check for duplicate slug (excluding current category)
    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.slug, data.slug)
    })

    if (existingCategory && existingCategory.id !== data.id) {
      return {
        success: false,
        error: "A category with this slug already exists"
      }
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        sortOrder: data.sortOrder,
        updatedAt: new Date()
      })
      .where(eq(categories.id, data.id))
      .returning()

    if (!updatedCategory) {
      return {
        success: false,
        error: "Category not found"
      }
    }

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      data: updatedCategory
    }
  } catch (error) {
    console.error("Error updating category:", error)
    return {
      success: false,
      error: "Failed to update category"
    }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const db = getDb()
    // Check if category has ecosystems
    const categoryWithEcosystems = await db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: {
        ecosystems: true
      }
    })

    if (
      categoryWithEcosystems?.ecosystems &&
      categoryWithEcosystems.ecosystems.length > 0
    ) {
      return {
        success: false,
        error: "Cannot delete category that contains ecosystems"
      }
    }

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    if (!deletedCategory) {
      return {
        success: false,
        error: "Category not found"
      }
    }

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      data: deletedCategory
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    return {
      success: false,
      error: "Failed to delete category"
    }
  }
}

// =============================================================================
// ECOSYSTEM CRUD OPERATIONS
// =============================================================================

export async function createEcosystem(
  data: CreateEcosystemData
): Promise<ActionResult> {
  try {
    const db = getDb()
    // Check for duplicate slug
    const existingEcosystem = await db.query.ecosystems.findFirst({
      where: eq(ecosystems.slug, data.slug)
    })

    if (existingEcosystem) {
      return {
        success: false,
        error: "An ecosystem with this slug already exists"
      }
    }

    // Verify category exists
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, data.categoryId)
    })

    if (!category) {
      return {
        success: false,
        error: "Selected category does not exist"
      }
    }

    const [newEcosystem] = await db
      .insert(ecosystems)
      .values({
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl || null,
        description: data.description || null,
        updatedAt: new Date()
      })
      .returning()

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/ecosystem/${data.slug}`)

    return {
      success: true,
      data: newEcosystem
    }
  } catch (error) {
    console.error("Error creating ecosystem:", error)
    return {
      success: false,
      error: "Failed to create ecosystem"
    }
  }
}

export async function updateEcosystem(
  data: UpdateEcosystemData
): Promise<ActionResult> {
  try {
    const db = getDb()
    // Check for duplicate slug (excluding current ecosystem)
    const existingEcosystem = await db.query.ecosystems.findFirst({
      where: eq(ecosystems.slug, data.slug)
    })

    if (existingEcosystem && existingEcosystem.id !== data.id) {
      return {
        success: false,
        error: "An ecosystem with this slug already exists"
      }
    }

    // Verify category exists
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, data.categoryId)
    })

    if (!category) {
      return {
        success: false,
        error: "Selected category does not exist"
      }
    }

    const [updatedEcosystem] = await db
      .update(ecosystems)
      .set({
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl || null,
        description: data.description || null,
        updatedAt: new Date()
      })
      .where(eq(ecosystems.id, data.id))
      .returning()

    if (!updatedEcosystem) {
      return {
        success: false,
        error: "Ecosystem not found"
      }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/ecosystem/${data.slug}`)

    return {
      success: true,
      data: updatedEcosystem
    }
  } catch (error) {
    console.error("Error updating ecosystem:", error)
    return {
      success: false,
      error: "Failed to update ecosystem"
    }
  }
}

export async function deleteEcosystem(id: string): Promise<ActionResult> {
  try {
    const db = getDb()
    // Check if ecosystem has projects
    const ecosystemWithProjects = await db.query.ecosystems.findFirst({
      where: eq(ecosystems.id, id),
      with: {
        projects: true
      }
    })

    if (
      ecosystemWithProjects?.projects &&
      ecosystemWithProjects.projects.length > 0
    ) {
      return {
        success: false,
        error: "Cannot delete ecosystem that contains projects"
      }
    }

    const [deletedEcosystem] = await db
      .delete(ecosystems)
      .where(eq(ecosystems.id, id))
      .returning()

    if (!deletedEcosystem) {
      return {
        success: false,
        error: "Ecosystem not found"
      }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/ecosystem/${deletedEcosystem.slug}`)

    return {
      success: true,
      data: deletedEcosystem
    }
  } catch (error) {
    console.error("Error deleting ecosystem:", error)
    return {
      success: false,
      error: "Failed to delete ecosystem"
    }
  }
}

// =============================================================================
// PROJECT CRUD OPERATIONS
// =============================================================================

export async function createProject(
  data: CreateProjectData
): Promise<ActionResult> {
  try {
    const db = getDb()
    // Verify ecosystem exists
    const ecosystem = await db.query.ecosystems.findFirst({
      where: eq(ecosystems.id, data.ecosystemId)
    })

    if (!ecosystem) {
      return {
        success: false,
        error: "Selected ecosystem does not exist"
      }
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        ecosystemId: data.ecosystemId,
        name: data.name,
        logoUrl: data.logoUrl || null,
        description: data.description || null,
        websiteUrl: data.websiteUrl || null,
        updatedAt: new Date()
      })
      .returning()

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/ecosystem/${ecosystem.slug}`)

    return {
      success: true,
      data: newProject
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      error: "Failed to create project"
    }
  }
}

export async function updateProject(
  data: UpdateProjectData
): Promise<ActionResult> {
  try {
    const db = getDb()
    // Verify ecosystem exists
    const ecosystem = await db.query.ecosystems.findFirst({
      where: eq(ecosystems.id, data.ecosystemId)
    })

    if (!ecosystem) {
      return {
        success: false,
        error: "Selected ecosystem does not exist"
      }
    }

    const [updatedProject] = await db
      .update(projects)
      .set({
        ecosystemId: data.ecosystemId,
        name: data.name,
        logoUrl: data.logoUrl || null,
        description: data.description || null,
        websiteUrl: data.websiteUrl || null,
        updatedAt: new Date()
      })
      .where(eq(projects.id, data.id))
      .returning()

    if (!updatedProject) {
      return {
        success: false,
        error: "Project not found"
      }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/ecosystem/${ecosystem.slug}`)

    return {
      success: true,
      data: updatedProject
    }
  } catch (error) {
    console.error("Error updating project:", error)
    return {
      success: false,
      error: "Failed to update project"
    }
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const db = getDb()
    // Get project with ecosystem info for cache revalidation
    const projectWithEcosystem = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        ecosystem: true
      }
    })

    if (!projectWithEcosystem) {
      return {
        success: false,
        error: "Project not found"
      }
    }

    const [deletedProject] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning()

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/ecosystem/${projectWithEcosystem.ecosystem.slug}`)

    return {
      success: true,
      data: deletedProject
    }
  } catch (error) {
    console.error("Error deleting project:", error)
    return {
      success: false,
      error: "Failed to delete project"
    }
  }
}

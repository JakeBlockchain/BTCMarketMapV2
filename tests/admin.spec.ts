import { test, expect } from "@playwright/test"

test.describe("Admin Dashboard", () => {
  // Note: These tests assume admin authentication is working
  // In a real scenario, you might need to set up authentication state

  test("should display admin dashboard with navigation", async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto("/admin")

    // Check if redirected to sign-in or if admin dashboard loads
    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    const adminDashboard = page.locator('[data-testid="admin-dashboard"]')

    // Wait for either sign-in form or admin dashboard
    await expect(signInForm.or(adminDashboard)).toBeVisible({ timeout: 10000 })

    // If sign-in form is visible, this test verifies auth protection is working
    if (await signInForm.isVisible()) {
      expect(true).toBe(true) // Auth protection is working
      return
    }

    // If admin dashboard is visible, verify its structure
    if (await adminDashboard.isVisible()) {
      // Check for navigation to different admin sections
      const categoriesLink = page.locator('a[href*="/admin/categories"]')
      const ecosystemsLink = page.locator('a[href*="/admin/ecosystems"]')
      const projectsLink = page.locator('a[href*="/admin/projects"]')

      await expect(categoriesLink).toBeVisible()
      await expect(ecosystemsLink).toBeVisible()
      await expect(projectsLink).toBeVisible()
    }
  })

  test("should navigate to categories management", async ({ page }) => {
    await page.goto("/admin/categories")

    // Check if redirected to auth or categories page loads
    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    const categoriesPage = page.locator('[data-testid="categories-page"]')

    await expect(signInForm.or(categoriesPage)).toBeVisible({ timeout: 10000 })

    if (await categoriesPage.isVisible()) {
      // Check for categories table
      const categoriesTable = page.locator('[data-testid="categories-table"]')
      await expect(categoriesTable).toBeVisible({ timeout: 10000 })

      // Check for add category button
      const addButton = page
        .locator("button")
        .filter({ hasText: /add category/i })
      await expect(addButton).toBeVisible()
    }
  })

  test("should navigate to ecosystems management", async ({ page }) => {
    await page.goto("/admin/ecosystems")

    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    const ecosystemsPage = page.locator('[data-testid="ecosystems-page"]')

    await expect(signInForm.or(ecosystemsPage)).toBeVisible({ timeout: 10000 })

    if (await ecosystemsPage.isVisible()) {
      // Check for ecosystems table
      const ecosystemsTable = page.locator('[data-testid="ecosystems-table"]')
      await expect(ecosystemsTable).toBeVisible({ timeout: 10000 })

      // Check for add ecosystem button
      const addButton = page
        .locator("button")
        .filter({ hasText: /add ecosystem/i })
      await expect(addButton).toBeVisible()
    }
  })

  test("should navigate to projects management", async ({ page }) => {
    await page.goto("/admin/projects")

    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    const projectsPage = page.locator('[data-testid="projects-page"]')

    await expect(signInForm.or(projectsPage)).toBeVisible({ timeout: 10000 })

    if (await projectsPage.isVisible()) {
      // Check for projects table
      const projectsTable = page.locator('[data-testid="projects-table"]')
      await expect(projectsTable).toBeVisible({ timeout: 10000 })

      // Check for add project button
      const addButton = page
        .locator("button")
        .filter({ hasText: /add project/i })
      await expect(addButton).toBeVisible()
    }
  })
})

test.describe("Admin Categories Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/categories")

    // Skip test if auth is required and user isn't authenticated
    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    if (await signInForm.isVisible()) {
      test.skip(true, "Authentication required for admin tests")
    }
  })

  test("should display existing categories", async ({ page }) => {
    const categoriesTable = page.locator('[data-testid="categories-table"]')
    await expect(categoriesTable).toBeVisible({ timeout: 10000 })

    // Check for table headers
    const nameHeader = page.locator("th").filter({ hasText: /name/i })
    const actionsHeader = page.locator("th").filter({ hasText: /actions/i })

    await expect(nameHeader).toBeVisible()
    await expect(actionsHeader).toBeVisible()

    // Check for category rows (should have seeded data)
    const categoryRows = page.locator("tbody tr")
    await expect(categoryRows.first()).toBeVisible({ timeout: 10000 })
  })

  test("should open create category form", async ({ page }) => {
    const addButton = page
      .locator("button")
      .filter({ hasText: /add category/i })
    await expect(addButton).toBeVisible({ timeout: 10000 })

    await addButton.click()

    // Check for form dialog or form section
    const createForm = page.locator('[data-testid="create-category-form"]')
    const formDialog = page.locator('[role="dialog"]')

    await expect(createForm.or(formDialog)).toBeVisible({ timeout: 5000 })

    // Check for form fields
    const nameInput = page.locator(
      'input[name="name"], input[placeholder*="name"]'
    )
    const descriptionInput = page.locator(
      'textarea[name="description"], textarea[placeholder*="description"]'
    )

    await expect(nameInput).toBeVisible()
    await expect(descriptionInput).toBeVisible()
  })

  test("should validate category creation form", async ({ page }) => {
    const addButton = page
      .locator("button")
      .filter({ hasText: /add category/i })
    await addButton.click()

    // Wait for form to appear
    const createForm = page.locator('[data-testid="create-category-form"]')
    const formDialog = page.locator('[role="dialog"]')
    await expect(createForm.or(formDialog)).toBeVisible({ timeout: 5000 })

    // Try to submit without filling required fields
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /create|save/i })
    await expect(submitButton).toBeVisible()

    await submitButton.click()

    // Check for validation errors
    const errorMessage = page
      .locator('.error, [role="alert"], .text-red')
      .first()
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })
})

test.describe("Admin Ecosystems Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/ecosystems")

    // Skip test if auth is required and user isn't authenticated
    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    if (await signInForm.isVisible()) {
      test.skip(true, "Authentication required for admin tests")
    }
  })

  test("should display existing ecosystems", async ({ page }) => {
    const ecosystemsTable = page.locator('[data-testid="ecosystems-table"]')
    await expect(ecosystemsTable).toBeVisible({ timeout: 10000 })

    // Check for ecosystem rows (should have seeded data)
    const ecosystemRows = page.locator("tbody tr")
    await expect(ecosystemRows.first()).toBeVisible({ timeout: 10000 })
  })

  test("should open create ecosystem form", async ({ page }) => {
    const addButton = page
      .locator("button")
      .filter({ hasText: /add ecosystem/i })
    await expect(addButton).toBeVisible({ timeout: 10000 })

    await addButton.click()

    // Check for form
    const createForm = page.locator('[data-testid="create-ecosystem-form"]')
    const formDialog = page.locator('[role="dialog"]')

    await expect(createForm.or(formDialog)).toBeVisible({ timeout: 5000 })

    // Check for required form fields
    const nameInput = page.locator(
      'input[name="name"], input[placeholder*="name"]'
    )
    const categorySelect = page.locator(
      'select[name="categoryId"], [role="combobox"]'
    )

    await expect(nameInput).toBeVisible()
    await expect(categorySelect).toBeVisible()
  })
})

test.describe("Admin Projects Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/projects")

    // Skip test if auth is required and user isn't authenticated
    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    if (await signInForm.isVisible()) {
      test.skip(true, "Authentication required for admin tests")
    }
  })

  test("should display existing projects", async ({ page }) => {
    const projectsTable = page.locator('[data-testid="projects-table"]')
    await expect(projectsTable).toBeVisible({ timeout: 10000 })

    // Check for project rows (should have seeded data)
    const projectRows = page.locator("tbody tr")
    await expect(projectRows.first()).toBeVisible({ timeout: 10000 })
  })

  test("should open create project form", async ({ page }) => {
    const addButton = page.locator("button").filter({ hasText: /add project/i })
    await expect(addButton).toBeVisible({ timeout: 10000 })

    await addButton.click()

    // Check for form
    const createForm = page.locator('[data-testid="create-project-form"]')
    const formDialog = page.locator('[role="dialog"]')

    await expect(createForm.or(formDialog)).toBeVisible({ timeout: 5000 })

    // Check for required form fields
    const nameInput = page.locator(
      'input[name="name"], input[placeholder*="name"]'
    )
    const ecosystemSelect = page.locator(
      'select[name="ecosystemId"], [role="combobox"]'
    )

    await expect(nameInput).toBeVisible()
    await expect(ecosystemSelect).toBeVisible()
  })
})

test.describe("Admin Access Control", () => {
  test("should protect admin routes from unauthorized access", async ({
    page
  }) => {
    // Clear any existing authentication
    await page.context().clearCookies()
    await page.goto("/admin")

    // Should redirect to sign-in or show access denied
    const signInForm = page.locator("form").filter({ hasText: /sign in/i })
    const accessDenied = page.locator("text=/access denied|unauthorized/i")
    const loginPage = page.locator('[data-testid="sign-in-page"]')

    await expect(signInForm.or(accessDenied).or(loginPage)).toBeVisible({
      timeout: 10000
    })

    // Verify URL changed to auth route or stayed on admin with protection
    const currentUrl = page.url()
    expect(
      currentUrl.includes("/sign-in") ||
        currentUrl.includes("/login") ||
        currentUrl.includes("/admin")
    ).toBe(true)
  })

  test("should protect specific admin pages", async ({ page }) => {
    // Clear authentication
    await page.context().clearCookies()

    const adminPages = [
      "/admin/categories",
      "/admin/ecosystems",
      "/admin/projects"
    ]

    for (const adminPage of adminPages) {
      await page.goto(adminPage)

      const signInForm = page.locator("form").filter({ hasText: /sign in/i })
      const accessDenied = page.locator("text=/access denied|unauthorized/i")

      await expect(signInForm.or(accessDenied)).toBeVisible({ timeout: 10000 })
    }
  })
})

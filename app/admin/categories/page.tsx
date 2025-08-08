import { getAllCategories } from "@/app/actions"
import { CategoriesTable } from "./_components/categories-table"
import { CreateCategoryForm } from "./_components/create-category-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-2">
          Manage the main Bitcoin ecosystem categories. These are the top-level
          groupings that organize ecosystems.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>
                View and manage existing categories. Categories are ordered by
                their sort order value.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriesTable categories={categories} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
              <CardDescription>
                Create a new category for organizing ecosystems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCategoryForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

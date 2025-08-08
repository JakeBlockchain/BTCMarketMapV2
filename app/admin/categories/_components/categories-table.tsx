"use client"

import { useState } from "react"
import { SelectCategory } from "@/db/schema"
import { deleteCategory } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { EditCategoryForm } from "./edit-category-form"
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

interface CategoriesTableProps {
  categories: SelectCategory[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<SelectCategory | null>(
    null
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const result = await deleteCategory(id)
      if (result.success) {
        toast.success("Category deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete category")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the category")
    } finally {
      setDeletingId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No categories found. Create your first category to get started.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{category.slug}</Badge>
                </TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">
                    {category.description || (
                      <span className="text-muted-foreground italic">
                        No description
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the category "
                            {category.name}"? This action cannot be undone and
                            will also remove all ecosystems in this category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            disabled={deletingId === category.id}
                          >
                            {deletingId === category.id
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </>
  )
}

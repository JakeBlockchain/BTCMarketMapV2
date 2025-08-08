"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { EditEcosystemForm } from "./edit-ecosystem-form"
import { deleteEcosystem } from "@/app/actions"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
}

type Ecosystem = {
  id: string
  categoryId: string
  name: string
  slug: string
  logoUrl: string | null
  description: string | null
  category: Category
}

interface EcosystemsTableProps {
  ecosystems: Ecosystem[]
  categories: Category[]
}

export function EcosystemsTable({
  ecosystems,
  categories
}: EcosystemsTableProps) {
  const [editingEcosystem, setEditingEcosystem] = useState<Ecosystem | null>(
    null
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const result = await deleteEcosystem(id)
      if (result.success) {
        toast.success("Ecosystem deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete ecosystem")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the ecosystem")
    } finally {
      setDeletingId(null)
    }
  }

  if (ecosystems.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No ecosystems found.</p>
        <p className="text-muted-foreground text-sm">
          Create your first ecosystem using the form on the right.
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
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[150px]">Slug</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ecosystems.map(ecosystem => (
              <TableRow key={ecosystem.id}>
                <TableCell className="w-[200px] font-medium">
                  <div className="flex items-center gap-2">
                    {ecosystem.logoUrl && (
                      <img
                        src={ecosystem.logoUrl}
                        alt={`${ecosystem.name} logo`}
                        className="h-6 w-6 flex-shrink-0 rounded object-cover"
                      />
                    )}
                    <span className="truncate">{ecosystem.name}</span>
                  </div>
                </TableCell>
                <TableCell className="w-[150px]">
                  <Badge variant="secondary" className="truncate">
                    {ecosystem.slug}
                  </Badge>
                </TableCell>
                <TableCell className="w-[120px] truncate">
                  {ecosystem.category.name}
                </TableCell>
                <TableCell className="w-[300px]">
                  {ecosystem.description ? (
                    <span className="block truncate text-sm">
                      {ecosystem.description.length > 50
                        ? `${ecosystem.description.substring(0, 50)}...`
                        : ecosystem.description}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">
                      No description
                    </span>
                  )}
                </TableCell>
                <TableCell className="w-[100px] text-right">
                  <div className="flex flex-shrink-0 justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEcosystem(ecosystem)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deletingId === ecosystem.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Ecosystem</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{ecosystem.name}"?
                            This action cannot be undone and will also delete
                            all projects associated with this ecosystem.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(ecosystem.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deletingId === ecosystem.id}
                          >
                            {deletingId === ecosystem.id
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

      {editingEcosystem && (
        <EditEcosystemForm
          ecosystem={editingEcosystem}
          categories={categories}
          open={!!editingEcosystem}
          onOpenChange={(open: boolean) => !open && setEditingEcosystem(null)}
        />
      )}
    </>
  )
}

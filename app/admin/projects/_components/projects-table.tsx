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
import { EditProjectForm } from "./edit-project-form"
import { deleteProject } from "@/app/actions"
import { toast } from "sonner"
import { Pencil, Trash2, ExternalLink } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
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

type Project = {
  id: string
  ecosystemId: string
  name: string
  logoUrl: string | null
  description: string | null
  websiteUrl: string | null
  ecosystem: Ecosystem
}

interface ProjectsTableProps {
  projects: Project[]
  ecosystems: Ecosystem[]
}

export function ProjectsTable({ projects, ecosystems }: ProjectsTableProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const result = await deleteProject(id)
      if (result.success) {
        toast.success("Project deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete project")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the project")
    } finally {
      setDeletingId(null)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No projects found.</p>
        <p className="text-muted-foreground text-sm">
          Create your first project using the form on the right.
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
              <TableHead>Ecosystem</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map(project => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {project.logoUrl && (
                      <img
                        src={project.logoUrl}
                        alt={`${project.name} logo`}
                        className="h-6 w-6 rounded object-cover"
                      />
                    )}
                    {project.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.ecosystem.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {project.ecosystem.category.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.websiteUrl ? (
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">
                      No website
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {project.description ? (
                    <span className="text-sm">
                      {project.description.length > 80
                        ? `${project.description.substring(0, 80)}...`
                        : project.description}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">
                      No description
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deletingId === project.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(project.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deletingId === project.id}
                          >
                            {deletingId === project.id
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

      {editingProject && (
        <EditProjectForm
          project={editingProject}
          ecosystems={ecosystems}
          open={!!editingProject}
          onOpenChange={open => !open && setEditingProject(null)}
        />
      )}
    </>
  )
}

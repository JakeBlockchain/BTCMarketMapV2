"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { updateProject } from "@/app/actions"
import { toast } from "sonner"

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

interface EditProjectFormProps {
  project: Project
  ecosystems: Ecosystem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProjectForm({
  project,
  ecosystems,
  open,
  onOpenChange
}: EditProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    ecosystemId: project.ecosystemId,
    name: project.name,
    logoUrl: project.logoUrl || "",
    description: project.description || "",
    websiteUrl: project.websiteUrl || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.ecosystemId || !formData.name) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateProject({
        id: project.id,
        ecosystemId: formData.ecosystemId,
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
        websiteUrl: formData.websiteUrl.trim() || undefined
      })

      if (result.success) {
        toast.success("Project updated successfully")
        onOpenChange(false)
      } else {
        toast.error(result.error || "Failed to update project")
      }
    } catch (error) {
      toast.error("An error occurred while updating the project")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group ecosystems by category for better UX
  const ecosystemsByCategory = ecosystems.reduce(
    (acc, ecosystem) => {
      const categoryName = ecosystem.category.name
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(ecosystem)
      return acc
    },
    {} as Record<string, Ecosystem[]>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to the project details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-ecosystem">Ecosystem *</Label>
            <Select
              value={formData.ecosystemId}
              onValueChange={(value: string) =>
                setFormData(prev => ({ ...prev, ecosystemId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an ecosystem" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ecosystemsByCategory).map(
                  ([categoryName, categoryEcosystems]) => (
                    <div key={categoryName}>
                      <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
                        {categoryName}
                      </div>
                      {categoryEcosystems.map(ecosystem => (
                        <SelectItem key={ecosystem.id} value={ecosystem.id}>
                          {ecosystem.name}
                        </SelectItem>
                      ))}
                    </div>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="e.g., Xverse Wallet, Alex Protocol"
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-logoUrl">Logo URL</Label>
            <Input
              id="edit-logoUrl"
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logoUrl}
              onChange={e =>
                setFormData(prev => ({ ...prev, logoUrl: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-websiteUrl">Website URL</Label>
            <Input
              id="edit-websiteUrl"
              type="url"
              placeholder="https://example.com"
              value={formData.websiteUrl}
              onChange={e =>
                setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Brief description of the project..."
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

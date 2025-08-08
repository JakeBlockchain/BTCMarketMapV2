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
import { updateEcosystem } from "@/app/actions"
import { toast } from "sonner"

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

interface EditEcosystemFormProps {
  ecosystem: Ecosystem
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function EditEcosystemForm({
  ecosystem,
  categories,
  open,
  onOpenChange
}: EditEcosystemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    categoryId: ecosystem.categoryId,
    name: ecosystem.name,
    slug: ecosystem.slug,
    logoUrl: ecosystem.logoUrl || "",
    description: ecosystem.description || ""
  })

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Only auto-generate slug if it matches the original slug or is empty
      slug:
        prev.slug === ecosystem.slug || !prev.slug
          ? generateSlug(name)
          : prev.slug
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.categoryId || !formData.name || !formData.slug) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateEcosystem({
        id: ecosystem.id,
        categoryId: formData.categoryId,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        logoUrl: formData.logoUrl.trim() || undefined,
        description: formData.description.trim() || undefined
      })

      if (result.success) {
        toast.success("Ecosystem updated successfully")
        onOpenChange(false)
      } else {
        toast.error(result.error || "Failed to update ecosystem")
      }
    } catch (error) {
      toast.error("An error occurred while updating the ecosystem")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Ecosystem</DialogTitle>
          <DialogDescription>
            Make changes to the ecosystem details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value: string) =>
                setFormData(prev => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="e.g., Stacks, Lightning Network"
              value={formData.name}
              onChange={e => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-slug">Slug *</Label>
            <Input
              id="edit-slug"
              type="text"
              placeholder="e.g., stacks, lightning-network"
              value={formData.slug}
              onChange={e =>
                setFormData(prev => ({ ...prev, slug: e.target.value }))
              }
              required
            />
            <p className="text-muted-foreground text-sm">
              URL-friendly version of the name.
            </p>
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
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Brief description of the ecosystem..."
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
              {isSubmitting ? "Updating..." : "Update Ecosystem"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

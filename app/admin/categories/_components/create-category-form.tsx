"use client"

import { useState } from "react"
import { createCategory } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function CreateCategoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sortOrder: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        sortOrder: formData.sortOrder
      })

      if (result.success) {
        toast.success("Category created successfully")
        setFormData({
          name: "",
          slug: "",
          description: "",
          sortOrder: 0
        })
      } else {
        toast.error(result.error || "Failed to create category")
      }
    } catch (error) {
      toast.error("An error occurred while creating the category")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="e.g., Lightning Network"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={e => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., lightning-network"
          required
        />
        <p className="text-muted-foreground text-xs">
          Auto-generated from name. Used in URLs.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input
          id="sortOrder"
          type="number"
          value={formData.sortOrder}
          onChange={e =>
            setFormData({
              ...formData,
              sortOrder: parseInt(e.target.value) || 0
            })
          }
          placeholder="0"
          min="0"
          required
        />
        <p className="text-muted-foreground text-xs">
          Lower numbers appear first.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of this category..."
          rows={3}
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Category"}
      </Button>
    </form>
  )
}

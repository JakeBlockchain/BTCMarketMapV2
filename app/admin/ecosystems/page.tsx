import { getAllEcosystems, getAllCategories } from "@/app/actions"
import { EcosystemsTable } from "./_components/ecosystems-table"
import { CreateEcosystemForm } from "./_components/create-ecosystem-form"

export default async function EcosystemsPage() {
  const [ecosystems, categories] = await Promise.all([
    getAllEcosystems(),
    getAllCategories()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Ecosystems Management
        </h1>
        <p className="text-muted-foreground">
          Manage Bitcoin ecosystem platforms and protocols. Ecosystems are the
          major platforms or protocols within categories.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Existing Ecosystems</h2>
            <p className="text-muted-foreground text-sm">
              View, edit, and delete existing ecosystems
            </p>
          </div>
          <EcosystemsTable ecosystems={ecosystems} categories={categories} />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Create New Ecosystem</h2>
            <p className="text-muted-foreground text-sm">
              Add a new ecosystem platform or protocol
            </p>
          </div>
          <CreateEcosystemForm categories={categories} />
        </div>
      </div>
    </div>
  )
}

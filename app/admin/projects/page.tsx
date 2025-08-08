import { getAllProjects, getAllEcosystems } from "@/app/actions"
import { ProjectsTable } from "./_components/projects-table"
import { CreateProjectForm } from "./_components/create-project-form"

export default async function ProjectsPage() {
  const [projects, ecosystems] = await Promise.all([
    getAllProjects(),
    getAllEcosystems()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Projects Management
        </h1>
        <p className="text-muted-foreground">
          Manage individual Bitcoin projects and applications. Projects are
          specific applications built on ecosystem platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Existing Projects</h2>
            <p className="text-muted-foreground text-sm">
              View, edit, and delete existing projects
            </p>
          </div>
          <ProjectsTable projects={projects} ecosystems={ecosystems} />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Create New Project</h2>
            <p className="text-muted-foreground text-sm">
              Add a new project or application
            </p>
          </div>
          <CreateProjectForm ecosystems={ecosystems} />
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage categories, ecosystems, and projects for the Bitcoin Market
          Map.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Categories</span>
            </CardTitle>
            <CardDescription>
              Manage the main Bitcoin ecosystem categories (Lightning,
              Sidechains, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/categories">Manage Categories</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Ecosystems</span>
            </CardTitle>
            <CardDescription>
              Manage ecosystem platforms within each category (Stacks, Liquid,
              etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/ecosystems">Manage Ecosystems</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Projects</span>
            </CardTitle>
            <CardDescription>
              Manage individual projects built on each ecosystem platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/projects">Manage Projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>
            Overview of the current data in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-2xl font-bold">6</p>
              <p className="text-muted-foreground text-sm">Categories</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">12</p>
              <p className="text-muted-foreground text-sm">Ecosystems</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">24</p>
              <p className="text-muted-foreground text-sm">Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Recent changes and updates to the market map data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Database seeded successfully</p>
                <p className="text-muted-foreground text-sm">
                  Initial categories and ecosystems added
                </p>
              </div>
              <p className="text-muted-foreground text-sm">Just now</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

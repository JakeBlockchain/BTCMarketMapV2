import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // For demo purposes, we'll show the admin interface without authentication
  // In production, you would implement proper authentication here

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Bitcoin Market Map Admin</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-muted-foreground text-sm">
              Demo Mode - Authentication Disabled
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container py-6">{children}</div>
    </div>
  )
}

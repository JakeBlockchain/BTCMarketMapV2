import { currentUser } from "@clerk/nextjs/server"
import { SignOutButton } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

// For now, we'll check if the user is authenticated and has a specific email domain
// In a production app, you might want to add a role field to your database
const ADMIN_EMAILS = [
  "admin@bitcoinmarketmap.com",
  "jbrownvisuals@gmail.com"
  // Add more admin emails here as needed
]

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is an admin
  const userEmail = user.emailAddresses[0]?.emailAddress
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())

  if (!isAdmin) {
    // Redirect non-admin users to the homepage
    redirect("/?error=access-denied")
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Bitcoin Market Map Admin</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-muted-foreground text-sm">
              Welcome, {user.firstName || user.username || "Admin"}
            </span>
            <SignOutButton>
              <Button variant="outline" size="sm">
                Log Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
      <div className="container py-6">{children}</div>
    </div>
  )
}

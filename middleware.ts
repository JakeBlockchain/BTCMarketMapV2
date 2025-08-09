import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // For protected routes, check authentication
  if (isProtectedRoute(req)) {
    try {
      const { userId, redirectToSignIn } = await auth()

      if (!userId) {
        return redirectToSignIn()
      }
    } catch (error) {
      // If auth fails, redirect to login
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  try {
    // Check if Clerk is properly configured
    if (
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      !process.env.CLERK_SECRET_KEY
    ) {
      // If no Clerk config, just redirect protected routes to login
      if (isProtectedRoute(req)) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      return NextResponse.next()
    }

    const { userId, redirectToSignIn } = await auth()

    if (!userId && isProtectedRoute(req)) {
      return redirectToSignIn()
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // If middleware fails, allow the request to continue for non-protected routes
    if (isProtectedRoute(req)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
}

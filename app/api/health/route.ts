import { NextResponse } from "next/server"
import { getDb } from "@/db"

export async function GET() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "not_configured",
          build: "success"
        },
        version: process.env.npm_package_version || "unknown",
        message: "Database not configured - this is expected during build time"
      })
    }

    // Test database connection
    const db = getDb()
    await db.execute("SELECT 1")

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        build: "success"
      },
      version: process.env.npm_package_version || "unknown"
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          database: "disconnected",
          build: "success"
        }
      },
      { status: 500 }
    )
  }
}

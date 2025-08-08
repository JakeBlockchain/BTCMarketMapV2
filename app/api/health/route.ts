import { NextResponse } from "next/server"
import { db } from "@/db"

export async function GET() {
  try {
    // Test database connection
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

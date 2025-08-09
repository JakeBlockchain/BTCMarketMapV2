import { config } from "dotenv"
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { customers } from "./schema/customers"
import {
  categories,
  ecosystems,
  projects,
  subscriptions,
  categoriesRelations,
  ecosystemsRelations,
  projectsRelations
} from "./schema/index"

config({ path: ".env.local" })

const dbSchema = {
  // tables
  customers,
  categories,
  ecosystems,
  projects,
  subscriptions,
  // relations
  categoriesRelations,
  ecosystemsRelations,
  projectsRelations
}

function initializeDb(url: string) {
  const client = postgres(url, { prepare: false })
  return drizzlePostgres(client, { schema: dbSchema })
}

// Create a lazy-initialized database connection
let _db: ReturnType<typeof initializeDb> | null = null

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please check your environment configuration."
    )
  }

  if (!_db) {
    try {
      _db = initializeDb(databaseUrl)
    } catch (error) {
      console.error("Failed to initialize database connection:", error)
      throw new Error(
        `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  return _db
}

// For backward compatibility, but only initialize if DATABASE_URL is available
export const db = process.env.DATABASE_URL ? getDb() : (null as any)

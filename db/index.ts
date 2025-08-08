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

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

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

export const db = initializeDb(databaseUrl)

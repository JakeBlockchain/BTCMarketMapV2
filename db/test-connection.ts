import { db } from "./index"
import { sql } from "drizzle-orm"
import { config } from "dotenv"

config({ path: ".env.local" })

async function testConnection() {
  console.log("Testing database connection...")
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL?.replace(/:[^:]*@/, ":***@")
  )

  try {
    // Try a simple query
    const result = await db.execute(sql`SELECT 1 as test`)
    console.log("✅ Database connection successful!")
    console.log("Result:", result)
  } catch (error) {
    console.error("❌ Database connection failed:")
    console.error(error)
  }
}

testConnection()

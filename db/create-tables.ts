import { db } from "./index"
import { config } from "dotenv"
import { sql } from "drizzle-orm"

config({ path: ".env.local" })

async function fixCustomersTable() {
  console.log("🔧 Fixing customers table schema...")

  try {
    // First, drop the existing customers table if it exists
    console.log("Dropping existing customers table...")
    try {
      await db.execute(sql`DROP TABLE IF EXISTS customers CASCADE;`)
    } catch (error) {
      console.log("Note: customers table might not exist, continuing...")
    }

    // Create the membership enum type
    console.log("Creating membership enum type...")
    try {
      await db.execute(sql`
        DO $$ BEGIN
          CREATE TYPE membership AS ENUM('free', 'pro');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `)
    } catch (error) {
      console.log("Note: membership enum might already exist, continuing...")
    }

    // Create the new customers table with correct schema
    console.log("Creating customers table with correct schema...")
    await db.execute(sql`
      CREATE TABLE customers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id TEXT NOT NULL,
        membership membership DEFAULT 'free' NOT NULL,
        stripe_customer_id TEXT UNIQUE,
        stripe_subscription_id TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT customers_user_id_unique UNIQUE(user_id),
        CONSTRAINT customers_stripe_customer_id_unique UNIQUE(stripe_customer_id),
        CONSTRAINT customers_stripe_subscription_id_unique UNIQUE(stripe_subscription_id)
      );
    `)

    console.log("✅ Customers table fixed successfully!")
  } catch (error) {
    console.error("❌ Failed to fix customers table:", error)
    throw error
  }
}

async function createTables() {
  console.log("🏗️  Creating/updating database tables...")

  try {
    // Fix customers table first
    await fixCustomersTable()

    console.log("✅ All tables created/updated successfully!")
  } catch (error) {
    console.error("❌ Failed to create tables:", error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log("Table creation completed!")
      process.exit(0)
    })
    .catch(error => {
      console.error("Table creation failed:", error)
      process.exit(1)
    })
}

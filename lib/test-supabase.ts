import { config } from "dotenv"
import { createClient } from "@supabase/supabase-js"

// Load environment variables from .env.local
config({ path: ".env.local" })

/**
 * Test script to verify Supabase client initialization
 * Run this after setting up your environment variables
 */
export async function testSupabaseConnection() {
  // Create Supabase client with loaded environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables!")
    console.error(
      "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
    )
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  try {
    // Test if we can initialize the client without errors
    console.log("Testing Supabase client initialization...")

    // Simple test query to check connection
    const { data, error } = await supabase.from("_test").select("*").limit(1)

    if (error && error.code !== "42P01" && error.code !== "PGRST205") {
      // 42P01 is "relation does not exist" (PostgreSQL)
      // PGRST205 is "Could not find the table" (PostgREST)
      // Both are expected for a test table that doesn't exist
      console.error("Supabase connection error:", error)
      return false
    }

    console.log("✅ Supabase client initialized successfully!")
    console.log("✅ Connection to Supabase database is working!")
    return true
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:", error)
    return false
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testSupabaseConnection()
}

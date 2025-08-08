import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"

config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function seedBitcoinEcosystemSupabase() {
  console.log("🌱 Seeding Bitcoin ecosystem data via Supabase...")

  try {
    // First, create tables if they don't exist
    console.log("🏗️  Creating tables if they don't exist...")

    const createTablesSQL = `
      -- Create categories table
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      -- Create ecosystems table
      CREATE TABLE IF NOT EXISTS ecosystems (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        category_id UUID REFERENCES categories(id) NOT NULL,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        logo_url TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      -- Create projects table
      CREATE TABLE IF NOT EXISTS projects (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ecosystem_id UUID REFERENCES ecosystems(id) NOT NULL,
        name TEXT NOT NULL,
        logo_url TEXT,
        description TEXT,
        website_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `

    // Execute table creation using raw SQL
    const { error: createError } = await supabase.rpc("exec_sql", {
      sql: createTablesSQL
    })

    if (createError) {
      console.log(
        "Note: Could not create tables via RPC, they may already exist or need to be created manually"
      )
      console.log("Proceeding with seeding...")
    } else {
      console.log("✅ Tables created successfully!")
    }

    // Clear existing data in reverse order of dependencies
    console.log("🧹 Clearing existing data...")
    await supabase
      .from("projects")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase
      .from("ecosystems")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase
      .from("categories")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    // Insert categories
    const categoryData = [
      {
        name: "Bitcoin L1",
        slug: "bitcoin-l1",
        description: "The base Bitcoin blockchain layer",
        sort_order: 1
      },
      {
        name: "Lightning Network",
        slug: "lightning",
        description:
          "Layer 2 payment channels for instant Bitcoin transactions",
        sort_order: 2
      },
      {
        name: "Meta-Protocols",
        slug: "meta-protocols",
        description:
          "Protocols built on top of Bitcoin using inscriptions and ordinals",
        sort_order: 3
      },
      {
        name: "Sidechains",
        slug: "sidechains",
        description: "Independent blockchains pegged to Bitcoin",
        sort_order: 4
      },
      {
        name: "Rollups",
        slug: "rollups",
        description: "Layer 2 scaling solutions that settle on Bitcoin",
        sort_order: 5
      },
      {
        name: "Off-chain",
        slug: "off-chain",
        description: "Solutions that operate outside the Bitcoin blockchain",
        sort_order: 6
      }
    ]

    const { data: insertedCategories, error: categoriesError } = await supabase
      .from("categories")
      .insert(categoryData)
      .select()

    if (categoriesError) {
      throw new Error(`Failed to insert categories: ${categoriesError.message}`)
    }

    console.log(`✅ Inserted ${insertedCategories.length} categories`)

    // Create a map for easy category lookup
    const categoryMap = insertedCategories.reduce(
      (acc, cat) => {
        acc[cat.slug] = cat.id
        return acc
      },
      {} as Record<string, string>
    )

    // Insert ecosystems
    const ecosystemData = [
      // Bitcoin L1
      {
        category_id: categoryMap["bitcoin-l1"],
        name: "Bitcoin Core",
        slug: "bitcoin-core",
        description: "The original Bitcoin implementation",
        logo_url: "https://bitcoin.org/img/icons/opengraph.png"
      },

      // Lightning Network
      {
        category_id: categoryMap["lightning"],
        name: "Lightning Network",
        slug: "lightning-network",
        description: "The Lightning Network protocol",
        logo_url: "https://lightning.network/img/lightning-network-logo.svg"
      },

      // Meta-Protocols
      {
        category_id: categoryMap["meta-protocols"],
        name: "Ordinals",
        slug: "ordinals",
        description: "A protocol for inscribing data on Bitcoin",
        logo_url: null
      },
      {
        category_id: categoryMap["meta-protocols"],
        name: "BRC-20",
        slug: "brc-20",
        description: "Fungible token standard using ordinals",
        logo_url: null
      },

      // Sidechains
      {
        category_id: categoryMap["sidechains"],
        name: "Liquid Network",
        slug: "liquid",
        description:
          "A Bitcoin sidechain for faster, confidential transactions",
        logo_url: "https://liquid.net/img/liquid-logo.svg"
      },
      {
        category_id: categoryMap["sidechains"],
        name: "Stacks",
        slug: "stacks",
        description: "A Bitcoin layer for smart contracts and DeFi",
        logo_url: "https://www.stacks.co/images/stacks-logo.svg"
      },

      // Rollups
      {
        category_id: categoryMap["rollups"],
        name: "Merlin Chain",
        slug: "merlin-chain",
        description: "A Bitcoin Layer 2 solution",
        logo_url: null
      },

      // Off-chain
      {
        category_id: categoryMap["off-chain"],
        name: "Fedimint",
        slug: "fedimint",
        description: "Federated e-cash system for Bitcoin",
        logo_url: null
      }
    ]

    const { data: insertedEcosystems, error: ecosystemsError } = await supabase
      .from("ecosystems")
      .insert(ecosystemData)
      .select()

    if (ecosystemsError) {
      throw new Error(`Failed to insert ecosystems: ${ecosystemsError.message}`)
    }

    console.log(`✅ Inserted ${insertedEcosystems.length} ecosystems`)

    // Create ecosystem map for projects
    const ecosystemMap = insertedEcosystems.reduce(
      (acc, eco) => {
        acc[eco.slug] = eco.id
        return acc
      },
      {} as Record<string, string>
    )

    // Insert sample projects
    const projectData = [
      // Lightning Network projects
      {
        ecosystem_id: ecosystemMap["lightning-network"],
        name: "Strike",
        description: "Lightning-powered payments app",
        website_url: "https://strike.me",
        logo_url: null
      },
      {
        ecosystem_id: ecosystemMap["lightning-network"],
        name: "Phoenix Wallet",
        description: "Self-custodial Lightning wallet",
        website_url: "https://phoenix.acinq.co",
        logo_url: null
      },

      // Stacks projects
      {
        ecosystem_id: ecosystemMap["stacks"],
        name: "Xverse Wallet",
        description: "Bitcoin and Stacks wallet",
        website_url: "https://www.xverse.app",
        logo_url: null
      },
      {
        ecosystem_id: ecosystemMap["stacks"],
        name: "Alex Lab",
        description: "DeFi platform on Stacks",
        website_url: "https://alexlab.co",
        logo_url: null
      },

      // Liquid projects
      {
        ecosystem_id: ecosystemMap["liquid"],
        name: "SideSwap",
        description: "Liquid Network wallet and DEX",
        website_url: "https://sideswap.io",
        logo_url: null
      }
    ]

    const { data: insertedProjects, error: projectsError } = await supabase
      .from("projects")
      .insert(projectData)
      .select()

    if (projectsError) {
      throw new Error(`Failed to insert projects: ${projectsError.message}`)
    }

    console.log(`✅ Inserted ${insertedProjects.length} projects`)
    console.log("🎉 Bitcoin ecosystem seeding completed!")

    return {
      categories: insertedCategories.length,
      ecosystems: insertedEcosystems.length,
      projects: insertedProjects.length
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedBitcoinEcosystemSupabase()
    .then(result => {
      console.log("Seed completed:", result)
      process.exit(0)
    })
    .catch(error => {
      console.error("Seed failed:", error)
      process.exit(1)
    })
}

import { getDb } from "../index"
import { categories, ecosystems, projects } from "../schema/index"

export async function seedBitcoinEcosystem() {
  console.log("🌱 Seeding Bitcoin ecosystem data...")

  const db = getDb()

  // Insert categories
  const categoryData = [
    {
      name: "Bitcoin L1",
      slug: "bitcoin-l1",
      description: "The base Bitcoin blockchain layer",
      sortOrder: 1
    },
    {
      name: "Lightning Network",
      slug: "lightning",
      description: "Layer 2 payment channels for instant Bitcoin transactions",
      sortOrder: 2
    },
    {
      name: "Meta-Protocols",
      slug: "meta-protocols",
      description:
        "Protocols built on top of Bitcoin using inscriptions and ordinals",
      sortOrder: 3
    },
    {
      name: "Sidechains",
      slug: "sidechains",
      description: "Independent blockchains pegged to Bitcoin",
      sortOrder: 4
    },
    {
      name: "Rollups",
      slug: "rollups",
      description: "Layer 2 scaling solutions that settle on Bitcoin",
      sortOrder: 5
    },
    {
      name: "Off-chain",
      slug: "off-chain",
      description: "Solutions that operate outside the Bitcoin blockchain",
      sortOrder: 6
    }
  ]

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning()
  console.log(`✅ Inserted ${insertedCategories.length} categories`)

  // Create a map for easy category lookup
  const categoryMap = insertedCategories.reduce(
    (acc: Record<string, string>, cat) => {
      acc[cat.slug] = cat.id
      return acc
    },
    {} as Record<string, string>
  )

  // Insert ecosystems
  const ecosystemData = [
    // Bitcoin L1
    {
      categoryId: categoryMap["bitcoin-l1"],
      name: "Bitcoin Core",
      slug: "bitcoin-core",
      description: "The original Bitcoin implementation",
      logoUrl: "https://bitcoin.org/img/icons/opengraph.png"
    },

    // Lightning Network
    {
      categoryId: categoryMap["lightning"],
      name: "Lightning Network",
      slug: "lightning-network",
      description: "The Lightning Network protocol",
      logoUrl: "https://lightning.network/img/lightning-network-logo.svg"
    },

    // Meta-Protocols
    {
      categoryId: categoryMap["meta-protocols"],
      name: "Ordinals",
      slug: "ordinals",
      description: "A protocol for inscribing data on Bitcoin",
      logoUrl: null
    },
    {
      categoryId: categoryMap["meta-protocols"],
      name: "BRC-20",
      slug: "brc-20",
      description: "Fungible token standard using ordinals",
      logoUrl: null
    },

    // Sidechains
    {
      categoryId: categoryMap["sidechains"],
      name: "Liquid Network",
      slug: "liquid",
      description: "A Bitcoin sidechain for faster, confidential transactions",
      logoUrl: "https://liquid.net/img/liquid-logo.svg"
    },
    {
      categoryId: categoryMap["sidechains"],
      name: "Stacks",
      slug: "stacks",
      description: "A Bitcoin layer for smart contracts and DeFi",
      logoUrl: "https://www.stacks.co/images/stacks-logo.svg"
    },

    // Rollups
    {
      categoryId: categoryMap["rollups"],
      name: "Merlin Chain",
      slug: "merlin-chain",
      description: "A Bitcoin Layer 2 solution",
      logoUrl: null
    },

    // Off-chain
    {
      categoryId: categoryMap["off-chain"],
      name: "Fedimint",
      slug: "fedimint",
      description: "Federated e-cash system for Bitcoin",
      logoUrl: null
    }
  ]

  const insertedEcosystems = await db
    .insert(ecosystems)
    .values(ecosystemData)
    .returning()
  console.log(`✅ Inserted ${insertedEcosystems.length} ecosystems`)

  // Create ecosystem map for projects
  const ecosystemMap = insertedEcosystems.reduce(
    (acc: Record<string, string>, eco) => {
      acc[eco.slug] = eco.id
      return acc
    },
    {} as Record<string, string>
  )

  // Insert sample projects
  const projectData = [
    // Lightning Network projects
    {
      ecosystemId: ecosystemMap["lightning-network"],
      name: "Strike",
      description: "Lightning-powered payments app",
      websiteUrl: "https://strike.me",
      logoUrl: null
    },
    {
      ecosystemId: ecosystemMap["lightning-network"],
      name: "Phoenix Wallet",
      description: "Self-custodial Lightning wallet",
      websiteUrl: "https://phoenix.acinq.co",
      logoUrl: null
    },

    // Stacks projects
    {
      ecosystemId: ecosystemMap["stacks"],
      name: "Xverse Wallet",
      description: "Bitcoin and Stacks wallet",
      websiteUrl: "https://www.xverse.app",
      logoUrl: null
    },
    {
      ecosystemId: ecosystemMap["stacks"],
      name: "Alex Lab",
      description: "DeFi platform on Stacks",
      websiteUrl: "https://alexlab.co",
      logoUrl: null
    },

    // Liquid projects
    {
      ecosystemId: ecosystemMap["liquid"],
      name: "SideSwap",
      description: "Liquid Network wallet and DEX",
      websiteUrl: "https://sideswap.io",
      logoUrl: null
    }
  ]

  const insertedProjects = await db
    .insert(projects)
    .values(projectData)
    .returning()
  console.log(`✅ Inserted ${insertedProjects.length} projects`)

  console.log("🎉 Bitcoin ecosystem seeding completed!")

  return {
    categories: insertedCategories.length,
    ecosystems: insertedEcosystems.length,
    projects: insertedProjects.length
  }
}

// Run if called directly
if (require.main === module) {
  seedBitcoinEcosystem()
    .then(result => {
      console.log("Seed completed:", result)
      process.exit(0)
    })
    .catch(error => {
      console.error("Seed failed:", error)
      process.exit(1)
    })
}

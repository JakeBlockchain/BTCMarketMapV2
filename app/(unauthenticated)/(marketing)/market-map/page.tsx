import { getCategoriesWithEcosystems } from "@/app/actions"
import { MarketMapClient } from "./market-map-client"

export async function generateMetadata() {
  return {
    title: "Bitcoin Ecosystem Market Map - Comprehensive Overview",
    description:
      "Explore the comprehensive landscape of Bitcoin development across different layers and protocols. Discover projects, ecosystems, and innovations in the Bitcoin space.",
    openGraph: {
      title: "Bitcoin Ecosystem Market Map - Comprehensive Overview",
      description:
        "Explore the comprehensive landscape of Bitcoin development across different layers and protocols.",
      type: "website"
    }
  }
}

export default async function MarketMapPage() {
  const categoriesWithEcosystems = await getCategoriesWithEcosystems()

  return <MarketMapClient categoriesWithEcosystems={categoriesWithEcosystems} />
}

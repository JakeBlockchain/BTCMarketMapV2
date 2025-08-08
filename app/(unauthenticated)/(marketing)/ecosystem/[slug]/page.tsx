import { getEcosystemDetails } from "@/app/actions"
import { notFound } from "next/navigation"
import { EcosystemDetailClient } from "./ecosystem-detail-client"

interface EcosystemDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EcosystemDetailPage({
  params
}: EcosystemDetailPageProps) {
  const { slug } = await params
  const ecosystem = await getEcosystemDetails(slug)

  if (!ecosystem) {
    notFound()
  }

  return <EcosystemDetailClient ecosystem={ecosystem} />
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EcosystemDetailPageProps) {
  const { slug } = await params
  const ecosystem = await getEcosystemDetails(slug)

  if (!ecosystem) {
    return {
      title: "Ecosystem Not Found"
    }
  }

  return {
    title: `${ecosystem.name} - Bitcoin Ecosystem Projects`,
    description:
      ecosystem.description ||
      `Explore projects built on ${ecosystem.name} in the Bitcoin ecosystem.`,
    openGraph: {
      title: `${ecosystem.name} - Bitcoin Ecosystem Projects`,
      description:
        ecosystem.description ||
        `Explore projects built on ${ecosystem.name} in the Bitcoin ecosystem.`,
      type: "website"
    }
  }
}

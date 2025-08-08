import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function EcosystemNotFound() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mb-8">
        <Search className="text-muted-foreground mx-auto h-16 w-16" />
      </div>

      <h1 className="mb-4 text-3xl font-bold">Ecosystem Not Found</h1>

      <p className="text-muted-foreground mb-8 text-lg">
        The ecosystem you're looking for doesn't exist or may have been moved.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/market-map">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Market Map
          </Button>
        </Link>

        <Link href="/">
          <Button variant="outline">Go to Homepage</Button>
        </Link>
      </div>
    </div>
  )
}

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Link href="/" className="text-xl font-bold">
            Bitcoin Market Map
          </Link>
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Bitcoin Market Map. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

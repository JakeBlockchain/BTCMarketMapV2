import { Suspense } from "react"
import { Footer } from "./_components/footer"
import { HeaderWrapper } from "./_components/header-wrapper"
import { ScrollIndicator } from "./_components/scroll-indicator"
import { SiteBanner } from "./_components/site-banner"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteBanner />
      <HeaderWrapper />
      {children}
      <Footer />
      <ScrollIndicator />
    </>
  )
}

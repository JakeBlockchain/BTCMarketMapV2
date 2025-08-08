# Page snapshot

```yaml
- alert
- button "Open issues overlay":
  - img
  - text: 1 Issue
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 15.3.3 (stale) Turbopack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 15.3.3 (stale) Turbopack
- img
- dialog "Build Error":
  - text: Build Error
  - button "Copy Stack Trace":
    - img
  - link "Go to related documentation":
    - /url: https://nextjs.org/docs/app/api-reference/directives/use-client
    - img
  - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools":
    - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
    - img
  - paragraph: Ecmascript file had an error
  - img
  - text: ./app/(unauthenticated)/(marketing)/ecosystem/[slug]/page.tsx (299:23)
  - button "Open in editor":
    - img
  - text: "Ecmascript file had an error 297 | 298 | // Generate metadata for SEO > 299 | export async function generateMetadata({ params }: EcosystemDetailPageProps) { | ^^^^^^^^^^^^^^^^ 300 | const ecosystem = await getEcosystemDetails(params.slug) 301 | 302 | if (!ecosystem) { You are attempting to export \"generateMetadata\" from a component marked with \"use client\", which is disallowed. Either remove the export, or the \"use client\" directive. Read more:"
  - link "https://nextjs.org/docs/app/api-reference/directives/use-client":
    - /url: https://nextjs.org/docs/app/api-reference/directives/use-client
- contentinfo:
  - paragraph: This error occurred during the build process and can only be dismissed by fixing the error.
```
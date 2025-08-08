import { test, expect } from "@playwright/test"

test.describe("Performance Tests", () => {
  test("should load homepage within acceptable time", async ({ page }) => {
    const startTime = Date.now()

    await page.goto("/")

    // Wait for main content to be visible
    const mainContent = page.locator("main, [role='main']").first()
    await expect(mainContent).toBeVisible({ timeout: 10000 })

    const loadTime = Date.now() - startTime

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test("should load market map within acceptable time", async ({ page }) => {
    const startTime = Date.now()

    await page.goto("/market-map")

    // Wait for category cards to be visible
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    const loadTime = Date.now() - startTime

    // Should load within 10 seconds (allowing for data fetching)
    expect(loadTime).toBeLessThan(10000)
  })

  test("should have reasonable bundle size impact", async ({ page }) => {
    // Navigate to page and wait for load
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check that JavaScript execution time is reasonable
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.startTime,
        loadComplete: navigation.loadEventEnd - navigation.startTime
      }
    })

    // DOM should be ready within 3 seconds
    expect(metrics.domContentLoaded).toBeLessThan(3000)

    // Complete load should happen within 8 seconds
    expect(metrics.loadComplete).toBeLessThan(8000)
  })

  test("should handle large datasets efficiently", async ({ page }) => {
    // This test checks that the page can handle the full dataset
    await page.goto("/market-map")

    // Wait for all categories to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Count total ecosystem items rendered
    const ecosystemItems = page.locator('[data-testid="ecosystem-item"]')
    const count = await ecosystemItems.count()

    // Should render all seeded ecosystems without performance issues
    expect(count).toBeGreaterThan(0)

    // Page should still be responsive after loading all data
    const startTime = Date.now()
    await page.locator("h1").first().click()
    const clickResponseTime = Date.now() - startTime

    // Click response should be immediate (< 100ms)
    expect(clickResponseTime).toBeLessThan(100)
  })
})

test.describe("Accessibility Tests", () => {
  test("should have proper heading hierarchy on homepage", async ({ page }) => {
    await page.goto("/")

    // Should have exactly one h1
    const h1Elements = page.locator("h1")
    await expect(h1Elements).toHaveCount(1)

    // Check that h1 is visible and has meaningful content
    const h1Text = await h1Elements.first().textContent()
    expect(h1Text?.length).toBeGreaterThan(0)
  })

  test("should have proper heading hierarchy on market map", async ({
    page
  }) => {
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Should have exactly one h1
    const h1Elements = page.locator("h1")
    await expect(h1Elements).toHaveCount(1)

    // Category cards should use h2 or h3
    const categoryHeadings = page.locator(
      '[data-testid="category-card"] h2, [data-testid="category-card"] h3'
    )
    const headingCount = await categoryHeadings.count()
    expect(headingCount).toBeGreaterThan(0)
  })

  test("should have keyboard navigation support", async ({ page }) => {
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check that ecosystem links are keyboard accessible
    const firstEcosystemLink = page
      .locator('[data-testid="ecosystem-item"] a')
      .first()
    await expect(firstEcosystemLink).toBeVisible()

    // Should be focusable
    await firstEcosystemLink.focus()
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    )
    expect(focusedElement).toBe("A")

    // Should be navigable with Enter key
    await firstEcosystemLink.press("Enter")

    // Should navigate to ecosystem page
    await expect(page).toHaveURL(/\/ecosystem\//)
  })

  test("should have proper alt text for images", async ({ page }) => {
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check ecosystem logos have alt text
    const logoImages = page.locator('[data-testid="ecosystem-item"] img')
    const imageCount = await logoImages.count()

    if (imageCount > 0) {
      // All images should have alt attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = logoImages.nth(i)
        await expect(img).toHaveAttribute("alt")

        const altText = await img.getAttribute("alt")
        expect(altText?.length).toBeGreaterThan(0)
      }
    }
  })

  test("should have proper link accessibility", async ({ page }) => {
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check that links have meaningful text
    const ecosystemLinks = page.locator('[data-testid="ecosystem-item"] a')
    const linkCount = await ecosystemLinks.count()

    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = ecosystemLinks.nth(i)
        const linkText = await link.textContent()

        // Links should have meaningful text (not just "click here" etc.)
        expect(linkText?.length).toBeGreaterThan(2)
        expect(linkText?.toLowerCase()).not.toContain("click here")
        expect(linkText?.toLowerCase()).not.toContain("read more")
      }
    }
  })

  test("should have proper color contrast", async ({ page }) => {
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // This is a basic check - in a real app you'd use axe-playwright or similar
    // Check that text is not using very light colors on light backgrounds
    const cardTitles = page.locator(
      '[data-testid="category-card"] h2, [data-testid="category-card"] h3'
    )

    if ((await cardTitles.count()) > 0) {
      const titleStyles = await cardTitles.first().evaluate(element => {
        const styles = window.getComputedStyle(element)
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor
        }
      })

      // Basic check - color should not be transparent or inherit
      expect(titleStyles.color).not.toBe("transparent")
      expect(titleStyles.color).not.toBe("inherit")
    }
  })

  test("should be responsive and accessible on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check that content is still accessible on mobile
    const firstEcosystemLink = page
      .locator('[data-testid="ecosystem-item"] a')
      .first()

    if (await firstEcosystemLink.isVisible()) {
      // Links should still be tappable (minimum 44px touch target)
      const linkBox = await firstEcosystemLink.boundingBox()

      if (linkBox) {
        // Touch targets should be at least 44px in one dimension
        expect(Math.max(linkBox.width, linkBox.height)).toBeGreaterThanOrEqual(
          44
        )
      }
    }
  })

  test("should have proper ARIA labels where needed", async ({ page }) => {
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check for loading spinners with proper ARIA labels
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]')

    if (await loadingSpinner.isVisible()) {
      // Should have aria-label or aria-labelledby
      const hasAriaLabel = await loadingSpinner.getAttribute("aria-label")
      const hasAriaLabelledBy =
        await loadingSpinner.getAttribute("aria-labelledby")

      expect(hasAriaLabel || hasAriaLabelledBy).toBeTruthy()
    }

    // Check for proper main content area
    const mainContent = page.locator("main, [role='main']")
    await expect(mainContent).toBeVisible()
  })
})

test.describe("SEO Tests", () => {
  test("should have proper meta tags on homepage", async ({ page }) => {
    await page.goto("/")

    // Check title
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
    expect(title.length).toBeLessThan(60) // SEO best practice

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute("content", /.+/)

    const description = await metaDescription.getAttribute("content")
    expect(description?.length).toBeGreaterThan(120) // Should be descriptive
    expect(description?.length).toBeLessThan(160) // SEO best practice
  })

  test("should have proper meta tags on market map", async ({ page }) => {
    await page.goto("/market-map")

    // Check title
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
    expect(title.toLowerCase()).toContain("market")

    // Check canonical URL if present
    const canonicalLink = page.locator('link[rel="canonical"]')
    if ((await canonicalLink.count()) > 0) {
      await expect(canonicalLink).toHaveAttribute("href", /.+/)
    }
  })

  test("should have proper meta tags on ecosystem pages", async ({ page }) => {
    await page.goto("/ecosystem/bitcoin")

    // Wait for page to load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 15000 })

    // Check that title includes ecosystem name
    const title = await page.title()
    expect(title.toLowerCase()).toContain("bitcoin")

    // Check meta description includes ecosystem info
    const metaDescription = page.locator('meta[name="description"]')
    if ((await metaDescription.count()) > 0) {
      const description = await metaDescription.getAttribute("content")
      expect(description?.toLowerCase()).toContain("bitcoin")
    }
  })
})

import { test, expect } from "@playwright/test"

test.describe("Ecosystem Detail Page", () => {
  test("should display ecosystem details for a valid slug", async ({
    page
  }) => {
    // Navigate to a known ecosystem (based on seeded data)
    await page.goto("/ecosystem/bitcoin")

    // Wait for page to load
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]')
    const ecosystemTitle = page.locator("h1").first()

    // Wait for either loading to complete or content to appear
    await expect(loadingSpinner.or(ecosystemTitle)).toBeVisible({
      timeout: 10000
    })

    // If loading spinner was visible, wait for it to disappear
    if (await loadingSpinner.isVisible()) {
      await expect(loadingSpinner).not.toBeVisible({ timeout: 15000 })
    }

    // Check that ecosystem title is visible
    await expect(ecosystemTitle).toBeVisible({ timeout: 10000 })

    // Check for ecosystem description
    const description = page.locator("p").first()
    await expect(description).toBeVisible()

    // Check for projects section
    const projectsSection = page.locator('[data-testid="projects-section"]')
    await expect(projectsSection).toBeVisible({ timeout: 10000 })
  })

  test("should display projects associated with the ecosystem", async ({
    page
  }) => {
    await page.goto("/ecosystem/bitcoin")

    // Wait for page to load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 15000 })

    // Check for project cards
    const projectCards = page.locator('[data-testid="project-card"]')

    // Either project cards should be visible, or empty state should be shown
    const emptyState = page.locator('[data-testid="empty-projects"]')
    await expect(projectCards.first().or(emptyState)).toBeVisible({
      timeout: 10000
    })

    // If projects exist, verify their structure
    if ((await projectCards.count()) > 0) {
      const firstProject = projectCards.first()

      // Each project should have a name
      const projectName = firstProject.locator("h2, h3").first()
      await expect(projectName).toBeVisible()

      // Projects should have links to their websites
      const projectLink = firstProject.locator("a[href]").first()
      await expect(projectLink).toBeVisible()
    }
  })

  test("should have working back navigation", async ({ page }) => {
    // First go to market map
    await page.goto("/market-map")

    // Wait for category cards to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Click on an ecosystem link
    const firstEcosystemLink = page
      .locator('[data-testid="ecosystem-item"] a')
      .first()
    await firstEcosystemLink.click()

    // Verify we're on ecosystem page
    await expect(page).toHaveURL(/\/ecosystem\//)

    // Look for back navigation
    const backLink = page.locator('a[href="/market-map"]').first()
    await expect(backLink).toBeVisible({ timeout: 10000 })

    // Click back link
    await backLink.click()

    // Verify we're back on market map
    await expect(page).toHaveURL(/\/market-map/)
    await expect(categoryCards.first()).toBeVisible({ timeout: 10000 })
  })

  test("should show 404 for invalid ecosystem slug", async ({ page }) => {
    // Navigate to non-existent ecosystem
    await page.goto("/ecosystem/non-existent-ecosystem")

    // Should show 404 or not found page
    const notFoundText = page.locator("text=/not found/i")
    const notFoundHeading = page
      .locator("h1")
      .filter({ hasText: /404|not found/i })

    await expect(notFoundText.or(notFoundHeading)).toBeVisible({
      timeout: 10000
    })
  })

  test("should handle project links correctly", async ({ page }) => {
    await page.goto("/ecosystem/bitcoin")

    // Wait for page to load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 15000 })

    // Check for project cards with links
    const projectCards = page.locator('[data-testid="project-card"]')

    if ((await projectCards.count()) > 0) {
      const firstProjectLink = projectCards
        .first()
        .locator("a[href^='http']")
        .first()

      if (await firstProjectLink.isVisible()) {
        // Verify link opens in new tab
        await expect(firstProjectLink).toHaveAttribute("target", "_blank")

        // Verify link has security attributes
        await expect(firstProjectLink).toHaveAttribute(
          "rel",
          /noopener|noreferrer/
        )
      }
    }
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/ecosystem/bitcoin")

    // Wait for content to load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 15000 })

    // Check that content is properly laid out on mobile
    const projectCards = page.locator('[data-testid="project-card"]')

    if ((await projectCards.count()) > 1) {
      // Verify cards stack vertically on mobile
      const firstCard = projectCards.first()
      const secondCard = projectCards.nth(1)

      const firstCardBox = await firstCard.boundingBox()
      const secondCardBox = await secondCard.boundingBox()

      if (firstCardBox && secondCardBox) {
        // On mobile, cards should stack vertically
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y)
      }
    }
  })

  test("should have proper meta tags and SEO", async ({ page }) => {
    await page.goto("/ecosystem/bitcoin")

    // Wait for content to load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 15000 })

    // Check page title includes ecosystem name
    const title = await page.title()
    expect(title.toLowerCase()).toContain("bitcoin")

    // Check for proper heading hierarchy
    const h1Elements = page.locator("h1")
    await expect(h1Elements).toHaveCount(1)

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute("content", /.+/)
  })

  test("should handle loading states gracefully", async ({ page }) => {
    // Navigate with network delay simulation
    await page.route("**/*", route => {
      setTimeout(() => route.continue(), 100)
    })

    await page.goto("/ecosystem/bitcoin")

    // Check for loading spinner initially
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]')

    // Content should eventually load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 15000 })
  })

  test("should display breadcrumb navigation", async ({ page }) => {
    await page.goto("/ecosystem/bitcoin")

    // Wait for page to load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 15000 })

    // Check for breadcrumb navigation
    const breadcrumb = page.locator('[data-testid="breadcrumb"]')
    await expect(breadcrumb).toBeVisible({ timeout: 10000 })

    // Breadcrumb should contain link back to market map
    const marketMapLink = breadcrumb.locator('a[href*="market-map"]')
    await expect(marketMapLink).toBeVisible()
  })
})

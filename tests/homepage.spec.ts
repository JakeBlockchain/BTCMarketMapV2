import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the homepage with correct title and heading", async ({
    page
  }) => {
    // Check page title
    await expect(page).toHaveTitle(/Bitcoin Ecosystem/i)

    // Check for main heading or navigation
    const mainHeading = page.locator("h1").first()
    await expect(mainHeading).toBeVisible()

    // Check for navigation elements
    const header = page.locator("header")
    await expect(header).toBeVisible()
  })

  test("should load market map page successfully", async ({ page }) => {
    // Navigate to market map
    await page.goto("/market-map")

    // Wait for page to load
    await expect(page).toHaveURL(/market-map/)

    // Check for loading state or content
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]')
    const categoryCards = page.locator('[data-testid="category-card"]')

    // Wait for either loading to complete or content to appear
    await expect(loadingSpinner.or(categoryCards.first())).toBeVisible({
      timeout: 10000
    })

    // If loading spinner was visible, wait for it to disappear
    if (await loadingSpinner.isVisible()) {
      await expect(loadingSpinner).not.toBeVisible({ timeout: 15000 })
    }

    // Check that category cards are visible
    await expect(categoryCards.first()).toBeVisible({ timeout: 10000 })
  })

  test("should display category cards with ecosystems", async ({ page }) => {
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check that we have multiple categories
    await expect(categoryCards).toHaveCount(6) // Based on seeded data

    // Check first category card structure
    const firstCard = categoryCards.first()
    const cardTitle = firstCard.locator("h2, h3").first()
    await expect(cardTitle).toBeVisible()

    // Check for ecosystem items in the first card
    const ecosystemItems = firstCard.locator('[data-testid="ecosystem-item"]')
    await expect(ecosystemItems.first()).toBeVisible({ timeout: 10000 })
  })

  test("should navigate to ecosystem detail page when clicking ecosystem link", async ({
    page
  }) => {
    await page.goto("/market-map")

    // Wait for category cards to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Find and click the first ecosystem link
    const firstEcosystemLink = page
      .locator('[data-testid="ecosystem-item"] a')
      .first()
    await expect(firstEcosystemLink).toBeVisible({ timeout: 10000 })

    // Get the href to verify navigation
    const href = await firstEcosystemLink.getAttribute("href")
    expect(href).toMatch(/^\/ecosystem\//)

    // Click the link
    await firstEcosystemLink.click()

    // Verify navigation to ecosystem page
    await expect(page).toHaveURL(/\/ecosystem\//)

    // Wait for ecosystem detail page to load
    const ecosystemTitle = page.locator("h1").first()
    await expect(ecosystemTitle).toBeVisible({ timeout: 10000 })
  })

  test("should handle empty state gracefully", async ({ page }) => {
    // This test would require a way to mock empty data
    // For now, we'll just verify the page doesn't crash with current data
    await page.goto("/market-map")

    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Check that page renders without JavaScript errors
    const errors: string[] = []
    page.on("pageerror", error => {
      errors.push(error.message)
    })

    // Wait a bit to catch any runtime errors
    await page.waitForTimeout(2000)

    expect(errors).toHaveLength(0)
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/market-map")

    // Wait for content to load
    const categoryCards = page.locator('[data-testid="category-card"]')
    await expect(categoryCards.first()).toBeVisible({ timeout: 15000 })

    // Verify cards stack vertically on mobile
    const firstCard = categoryCards.first()
    const secondCard = categoryCards.nth(1)

    if ((await categoryCards.count()) > 1) {
      const firstCardBox = await firstCard.boundingBox()
      const secondCardBox = await secondCard.boundingBox()

      if (firstCardBox && secondCardBox) {
        // On mobile, cards should stack vertically
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y)
      }
    }
  })

  test("should have proper SEO elements", async ({ page }) => {
    await page.goto("/market-map")

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute("content", /.+/)

    // Check for proper heading hierarchy
    const h1 = page.locator("h1")
    await expect(h1).toHaveCount(1)

    // Check that page title is set
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })
})

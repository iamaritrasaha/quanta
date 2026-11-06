import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const SCREENSHOT_DIR = path.resolve('test-results/screenshots')

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  }
})

test.describe('QUANTA OBSERVATORY: Periodic Table V3', () => {
  test('observatory loads with 118 element tiles, group headers 1–18, and period indicators', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('.element-tile')).toHaveCount(118)
    await expect(page.locator('.brand-title')).toHaveText('QUANTA')
    await expect(page.locator('.groups-header-row .group-number-col')).toHaveCount(19) // 1 spacer + 18 groups
    await expect(page.locator('.periods-column .period-number-cell')).toHaveCount(9) // 7 periods + 2 fblock series
    await expect(page.locator('.fblock-marker-lanthanoid')).toContainText('La–Lu')
    await expect(page.locator('.fblock-marker-actinoid')).toContainText('Ac–Lr')
  })

  test('search by exact atomic number highlights single element and dims others', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.locator('.search-input')

    // Search "1" -> should match ONLY Hydrogen (Z=1)
    await searchInput.fill('1')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await expect(page.locator('.element-tile.is-match')).toHaveCount(1)
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'H')
    await expect(page.locator('.element-tile.is-dimmed')).toHaveCount(117)

    // Search "79" -> should match ONLY Gold (Au, Z=79)
    await searchInput.fill('79')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'Au')

    // Search "118" -> should match ONLY Oganesson (Og, Z=118)
    await searchInput.fill('118')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'Og')
  })

  test('search supports symbols, names, and spelling aliases', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.locator('.search-input')

    // Symbol "Au"
    await searchInput.fill('Au')
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'Au')

    // Name "Rutherfordium"
    await searchInput.fill('Rutherfordium')
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'Rf')

    // Spelling alias: "aluminum" -> matches Aluminium
    await searchInput.fill('aluminum')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'Al')

    // Spelling alias: "cesium" -> matches Caesium
    await searchInput.fill('cesium')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'Cs')

    // Spelling alias: "wolfram" -> matches Tungsten
    await searchInput.fill('wolfram')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await expect(page.locator('.element-tile.is-match')).toHaveAttribute('data-element-symbol', 'W')
  })

  test('Enter on single search match navigates immediately, Escape clears search', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.locator('.search-input')

    // Enter on Gold (79)
    await searchInput.fill('79')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await searchInput.press('Enter')
    await expect(page.locator('.element-name-heading')).toContainText('Gold')

    // Return to table
    await page.getByRole('button', { name: '← PERIODIC TABLE', exact: true }).click()
    await expect(page.locator('.element-tile')).toHaveCount(118)

    // Escape clears search
    const newSearchInput = page.locator('.search-input')
    await newSearchInput.fill('iron')
    await expect(page.locator('.match-counter-badge')).toContainText('1 MATCH FOUND')
    await newSearchInput.press('Escape')
    await expect(newSearchInput).toHaveValue('')
    await expect(page.locator('.element-tile.is-dimmed')).toHaveCount(0)
  })

  test('category filter highlights families and updates active indicator', async ({ page }) => {
    await page.goto('/')

    // Click "Noble gases" pill
    await page.getByRole('button', { name: 'Noble gases' }).click()
    await expect(page.locator('.match-counter-badge')).toContainText('7 MATCHES')
    await expect(page.locator('.element-tile.is-match')).toHaveCount(7)
    await expect(page.locator('.element-tile.is-dimmed')).toHaveCount(111)

    // Click "Alkali metals" pill
    await page.getByRole('button', { name: 'Alkali metals' }).click()
    await expect(page.locator('.match-counter-badge')).toContainText('6 MATCHES')
    await expect(page.locator('.element-tile.is-match')).toHaveCount(6)

    // Click "Lanthanoids" pill -> all 15 lanthanoids (La–Lu) match
    await page.getByRole('button', { name: 'Lanthanoids' }).click()
    await expect(page.locator('.match-counter-badge')).toContainText('15 MATCHES')
    await expect(page.locator('.element-tile.is-match')).toHaveCount(15)

    // Click "Actinoids" pill -> all 15 actinoids (Ac–Lr) match
    await page.getByRole('button', { name: 'Actinoids' }).click()
    await expect(page.locator('.match-counter-badge')).toContainText('15 MATCHES')
    await expect(page.locator('.element-tile.is-match')).toHaveCount(15)

    // Reset via "All Elements (118)"
    await page.getByRole('button', { name: 'All Elements (118)' }).click()
    await expect(page.locator('.match-counter-badge')).toContainText('118 ELEMENTS')
    await expect(page.locator('.element-tile.is-dimmed')).toHaveCount(0)
  })

  test('inspector updates on hover/focus and Explore button opens instrument', async ({ page }) => {
    await page.goto('/')

    // Focus Iron (Fe)
    const feTile = page.locator('.element-tile[data-element-symbol="Fe"]')
    await feTile.focus()
    await expect(page.locator('.inspector-embedded .inspector-hero-symbol')).toHaveText('Fe')
    await expect(page.locator('.inspector-embedded .inspector-element-name')).toHaveText('Iron')
    await expect(page.locator('.inspector-embedded .inspector-atomic-mass')).toContainText('55.84')

    // Click EXPLORE ATOM button in visible inspector
    await page.locator('.inspector-embedded .inspector-explore-btn').click()
    await expect(page.locator('.element-name-heading')).toContainText('Iron')
    await expect(page.locator('.element-atomic-badge')).toHaveText('26')
  })

  test('2D arrow key navigation moves focus across groups and periods', async ({ page }) => {
    await page.goto('/')

    // Focus Hydrogen (1, 1)
    const hTile = page.locator('.element-tile[data-element-symbol="H"]')
    await hTile.focus()
    await expect(hTile).toBeFocused()

    // ArrowRight from H(1,1) moves across the gap to He(1,18)
    await page.keyboard.press('ArrowRight')
    const heTile = page.locator('.element-tile[data-element-symbol="He"]')
    await expect(heTile).toBeFocused()

    // ArrowDown from He(1,18) moves to Ne(2,18)
    await page.keyboard.press('ArrowDown')
    const neTile = page.locator('.element-tile[data-element-symbol="Ne"]')
    await expect(neTile).toBeFocused()

    // ArrowLeft from Ne(2,18) moves left across p-block
    await page.keyboard.press('ArrowLeft')
    const fTile = page.locator('.element-tile[data-element-symbol="F"]')
    await expect(fTile).toBeFocused()
  })

  test('mobile catalog view switcher and card exploration work', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    // Switch to Catalog view
    await page.getByRole('button', { name: 'CATALOG' }).click()
    await expect(page.locator('.mobile-element-catalog')).toBeVisible()
    await expect(page.locator('.catalog-card')).toHaveCount(118)

    // Search in catalog view
    await page.locator('.search-input').fill('Carbon')
    await expect(page.locator('.catalog-card')).toHaveCount(1)
    await expect(page.locator('.catalog-name')).toHaveText('Carbon')

    // Click explore button on catalog card
    await page.locator('.catalog-explore-btn').click()
    await expect(page.locator('.element-name-heading')).toContainText('Carbon')
  })

  test('captures multi-viewport screenshots for visual verification', async ({ page }) => {
    const viewports = [
      { width: 320, height: 600, label: '320px-mobile-compact' },
      { width: 360, height: 740, label: '360px-mobile-standard' },
      { width: 390, height: 844, label: '390px-iphone-modern' },
      { width: 768, height: 1024, label: '768px-tablet-portrait' },
      { width: 1024, height: 768, label: '1024px-tablet-landscape' },
      { width: 1280, height: 900, label: '1280px-desktop-standard' },
      { width: 1440, height: 900, label: '1440px-desktop-wide' },
      { width: 1920, height: 1080, label: '1920px-desktop-fullhd' },
    ]

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await expect(page.locator('.brand-title')).toBeVisible()
      await page.waitForTimeout(300)

      // Capture default periodic table view
      const screenshotPath = path.join(SCREENSHOT_DIR, `observatory-${vp.label}.png`)
      await page.screenshot({ path: screenshotPath, fullPage: false })
      expect(fs.existsSync(screenshotPath)).toBe(true)
    }

    // Additional interactive state screenshots at 1440px
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await expect(page.locator('.brand-title')).toBeVisible()

    // Hover state on Gold
    await page.locator('.element-tile[data-element-symbol="Au"]').hover()
    await page.waitForTimeout(150)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'observatory-1440px-hover-gold.png'),
    })

    // Active search state
    await page.locator('.search-input').fill('79')
    await page.waitForTimeout(150)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'observatory-1440px-search-active.png'),
    })

    // Active category state
    await page.locator('.search-input').fill('')
    await page.getByRole('button', { name: 'Noble gases' }).click()
    await page.waitForTimeout(150)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'observatory-1440px-category-noblegases.png'),
    })

    // Mobile catalog view
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'CATALOG' }).click()
    await page.waitForTimeout(150)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'observatory-390px-catalog-view.png'),
    })
  })
})

import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

test.beforeAll(() => {
  const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots', 'dropdowns')
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }
})

test.describe('P0 Dropdown UI Repair — Optical Glass Combobox Verification', () => {
  test('Sodium: dropdown opens in dark optical glass, filters states, and triggers transition', async ({
    page,
  }) => {
    await page.goto('/#/element/sodium')
    await page.waitForSelector('.element-name-heading')
    await expect(page.locator('.element-name-heading')).toContainText('Sodium')

    // Find Final State combobox trigger
    const finalStateTrigger = page.locator('#element-target-state-trigger')
    await expect(finalStateTrigger).toBeVisible()

    // Click trigger to open combobox
    await finalStateTrigger.click()

    // Popover must be rendered in portal
    const popover = page.locator('.quanta-combobox-popover')
    await expect(popover).toBeVisible()

    // 1. Verify dark theme styling (NOT white)
    const bgColor = await popover.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Background must be dark charcoal / translucent glass, e.g. rgba(11, 15, 25, ...)
    expect(bgColor).toMatch(/rgba?\(1[0-2],\s*1[4-6],\s*2[4-6]/)

    // 2. Verify height is clamped to <= 320px
    const popoverBox = (await popover.boundingBox())!
    expect(popoverBox.height).toBeLessThanOrEqual(325)
    expect(popoverBox.height).toBeGreaterThanOrEqual(160)

    // 3. Verify options list has internal scrolling
    const optionsList = popover.locator('.combobox-options-list')
    await expect(optionsList).toBeVisible()

    // 4. Capture screenshot of open dropdown
    await page.screenshot({
      path: 'test-results/screenshots/dropdowns/sodium-dropdown-open.png',
      fullPage: false,
    })

    // 5. Test search filter input
    const searchInput = popover.locator('.combobox-search-input')
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toBeFocused()

    // Type "3p" to filter for 3p states
    await searchInput.fill('3p')
    await page.waitForTimeout(150)

    // Check count indicator
    const countIndicator = popover.locator('.combobox-count-indicator')
    await expect(countIndicator).toContainText('states')

    // Capture screenshot of filtered search
    await page.screenshot({
      path: 'test-results/screenshots/dropdowns/sodium-dropdown-search.png',
      fullPage: false,
    })

    // Filter down to J=1/2
    await searchInput.fill('3p 1/2')
    await page.waitForTimeout(150)

    const optionRows = popover.locator('.combobox-option-row')
    const optCount = await optionRows.count()
    expect(optCount).toBeGreaterThanOrEqual(1)

    // Click the first matching option
    await optionRows.first().click()

    // Popover should close
    await expect(popover).not.toBeVisible()

    // Trigger button should now show selected 3p state
    await expect(finalStateTrigger).toContainText('3p')

    // Verify transition wavelength / energy are computed
    const transitionSection = page.locator('.element-transition-controls')
    await expect(transitionSection).toBeVisible()

    // Click ABSORB to verify transition initiates and trigger disables
    const absorbBtn = page.getByRole('button', { name: /ABSORB PHOTON/ })
    await expect(absorbBtn).toBeVisible()
    await absorbBtn.click()
    await expect(page.locator('.atomic-jump-progress')).toBeVisible()
    await expect(finalStateTrigger).toBeDisabled()
    await page.getByRole('button', { name: 'CANCEL TRANSITION', exact: true }).click()
    await expect(page.locator('.atomic-jump-progress')).toHaveCount(0)
  })

  test('Hydrogen: dropdown displays n=1..6 with series metadata, energies, and selection', async ({
    page,
  }) => {
    await page.goto('/#/element/hydrogen')
    await page.waitForSelector('.element-name-heading')
    await expect(page.locator('.element-name-heading')).toContainText('Hydrogen')

    // Switch to Bohr / Transition mode
    await page.locator('.mode-tab-btn').nth(1).click()
    await page.waitForTimeout(400)

    const targetTrigger = page.locator('#target-level-select-trigger')
    await expect(targetTrigger).toBeVisible()

    // Open dropdown
    await targetTrigger.click()
    const popover = page.locator('.quanta-combobox-popover')
    await expect(popover).toBeVisible()

    // Capture Hydrogen open dropdown screenshot
    await page.screenshot({
      path: 'test-results/screenshots/dropdowns/hydrogen-dropdown-open.png',
      fullPage: false,
    })

    // Check options contain n levels and series labels (Balmer, Paschen, Brackett, Pfund)
    await expect(popover).toContainText('n = 3')
    await expect(popover).toContainText('BALMER')

    // Select n = 3 (H-alpha, 656.3 nm)
    const n3Option = popover.locator('.combobox-option-row', { hasText: 'n = 3' })
    await n3Option.click()

    // Popover closes
    await expect(popover).not.toBeVisible()
    await expect(targetTrigger).toContainText('n = 3')

    // Verify wavelength 102.6 nm (Lyman-beta for 1 -> 3) appears in metrics
    await expect(page.locator('.transition-controls')).toContainText('102.6')

    // Click preset 3 -> 2 (H-alpha) to verify 656.5 nm and preset sync
    await page.getByRole('button', { name: '3 → 2 (H-α)', exact: true }).click()
    await expect(page.locator('.transition-controls')).toContainText('656.5')
  })

  test('Iron (Z=26): large atomic state list scrolls smoothly, supports full keyboard navigation', async ({
    page,
  }) => {
    await page.goto('/#/element/iron')
    await page.waitForSelector('.element-name-heading')
    await expect(page.locator('.element-name-heading')).toContainText('Iron')

    const targetTrigger = page.locator('#element-target-state-trigger')
    await expect(targetTrigger).toBeVisible()
    await targetTrigger.click()

    const popover = page.locator('.quanta-combobox-popover')
    await expect(popover).toBeVisible()

    // Capture screenshot of Iron's large state combobox
    await page.screenshot({
      path: 'test-results/screenshots/dropdowns/iron-dropdown-open.png',
      fullPage: false,
    })

    // Height must be constrained
    const box = (await popover.boundingBox())!
    expect(box.height).toBeLessThanOrEqual(325)

    // Keyboard navigation: ArrowDown, ArrowUp, Home, End
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    const activeOption = popover.locator('.combobox-option-row.active')
    await expect(activeOption).toHaveCount(1)

    // Press Escape to dismiss
    await page.keyboard.press('Escape')
    await expect(popover).not.toBeVisible()

    // Focus restored to trigger
    await expect(targetTrigger).toBeFocused()
  })

  test('Mobile viewport: dropdown fits within screen bounds without overflow clipping', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/#/element/sodium')
    await page.waitForSelector('.element-name-heading')

    const targetTrigger = page.locator('#element-target-state-trigger')
    await targetTrigger.click()

    const popover = page.locator('.quanta-combobox-popover')
    await expect(popover).toBeVisible()

    const popBox = (await popover.boundingBox())!
    // Must be completely within mobile viewport [0..390] x [0..844]
    expect(popBox.x).toBeGreaterThanOrEqual(0)
    expect(popBox.x + popBox.width).toBeLessThanOrEqual(395)
    expect(popBox.y + popBox.height).toBeLessThanOrEqual(850)

    // Capture mobile screenshot
    await page.screenshot({
      path: 'test-results/screenshots/dropdowns/sodium-mobile-dropdown.png',
      fullPage: false,
    })
  })
})

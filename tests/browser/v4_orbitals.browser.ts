import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const SCREENSHOT_DIR = path.resolve('test-results/screenshots/v4_orbitals')

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  }
})

test.describe('QUANTA V4: Universal Atomic Orbital Engine (Browser Verification)', () => {
  test('Hydrogen Quantum Explorer: 1s, 2p, 3d, 4f with Phase Coloring & Radial Curves', async ({ page }) => {
    await page.goto('/#/element/hydrogen')
    await expect(page.locator('.element-name-heading')).toContainText('Hydrogen')

    // Navigate to Quantum mode (tab index 2)
    await page.locator('.mode-tab-btn').nth(2).click()
    await page.waitForTimeout(300)

    // Verify Hydrogenic Quantum header
    await expect(page.locator('.quantum-title')).toContainText('HYDROGENIC ORBITALS')

    // 1. Verify 1s Ground State
    await page.locator('.orbital-pill-btn').nth(0).click()
    await page.waitForTimeout(400)
    await expect(page.locator('.radial-plot-card')).toBeVisible()
    await expect(page.locator('.phase-legend-card')).toBeVisible()
    await expect(page.locator('.phase-pedagogy-note')).toContainText('Phase colors represent opposite algebraic signs')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'hydrogen-1s.png'),
      fullPage: true,
    })

    // 2. Verify 2p State
    await page.locator('.orbital-pill-btn').nth(2).click() // 2p
    await page.waitForTimeout(400)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'hydrogen-2p.png'),
      fullPage: true,
    })

    // 3. Verify 3d State via Quick Jump
    await page.locator('.quick-jump-btn').nth(0).click() // 3d
    await page.waitForTimeout(400)
    await expect(page.locator('.orbital-info-box')).toContainText('3d_{z²}')
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'hydrogen-3d.png'),
      fullPage: true,
    })

    // 4. Verify 4f State via Quick Jump
    await page.locator('.quick-jump-btn').nth(1).click() // 4f
    await page.waitForTimeout(400)
    await expect(page.locator('.orbital-info-box')).toContainText('4f_{z³}')
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'hydrogen-4f.png'),
      fullPage: true,
    })
  })

  test('Multi-Element Quantum Explorer: Carbon (Z=6) 2p with Occupancy & XY Slice Plane', async ({ page }) => {
    await page.goto('/#/element/carbon')
    await expect(page.locator('.element-name-heading')).toContainText('Carbon')

    // Switch to Quantum Mode
    await page.locator('.mode-tab-btn').nth(2).click()
    await page.waitForTimeout(300)

    // Verify Universal Quantum Controls card
    await expect(page.locator('.card-title')).toContainText('Carbon Quantum Architecture')

    // Verify Ground State Occupied badge for 2s/2p
    await page.locator('.family-pill-btn').nth(1).click() // p-family
    await page.waitForTimeout(300)
    await expect(page.locator('.occupancy-badge.occupied')).toBeVisible()
    await expect(page.locator('.occupancy-badge.occupied')).toContainText('2p contains 2 of 6 electrons')

    // Select px orientation
    await page.locator('.orient-pill-btn').nth(1).click()
    await page.waitForTimeout(200)

    // Select XY Cross-Section Slice
    await page.locator('.slice-plane-group .segment-btn').nth(1).click()
    await page.waitForTimeout(300)

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'carbon-2p-slice-xy.png'),
      fullPage: true,
    })
  })

  test('Transition Metal & Superheavy Orbital Explorer: Iron (3d), Uranium (5f), Oganesson (7p)', async ({
    page,
  }) => {
    // 1. Iron (Fe, Z=26)
    await page.goto('/#/element/iron')
    await page.locator('.mode-tab-btn').nth(2).click()
    await page.waitForTimeout(300)

    // Select d-orbitals
    await page.locator('.family-pill-btn').nth(2).click() // d
    await page.locator('.shell-pill-btn').filter({ hasText: 'n = 3' }).click()
    await page.waitForTimeout(300)
    await expect(page.locator('.occupancy-badge.occupied')).toContainText('3d contains 6 of 10 electrons')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'iron-3d.png'),
      fullPage: true,
    })

    // 2. Uranium (U, Z=92)
    await page.goto('/#/element/uranium')
    await page.locator('.mode-tab-btn').nth(2).click()
    await page.waitForTimeout(300)

    // Select f-orbitals
    await page.locator('.family-pill-btn').nth(3).click() // f
    await page.locator('.shell-pill-btn').filter({ hasText: 'n = 5' }).click()
    await page.waitForTimeout(300)
    await expect(page.locator('.occupancy-badge.occupied')).toContainText('5f contains 3 of 14 electrons')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'uranium-5f.png'),
      fullPage: true,
    })

    // 3. Oganesson (Og, Z=118)
    await page.goto('/#/element/oganesson')
    await page.locator('.mode-tab-btn').nth(2).click()
    await page.waitForTimeout(300)
    await expect(page.locator('.card-title')).toContainText('Oganesson Quantum Architecture')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'oganesson-quantum.png'),
      fullPage: true,
    })
  })
})

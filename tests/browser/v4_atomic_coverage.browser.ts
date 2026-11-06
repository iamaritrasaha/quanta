import { test, expect, type Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const SCREENSHOT_DIR = path.resolve('test-results/screenshots/v4')

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  }
})

const REPRESENTATIVE_ELEMENTS = [
  // Wave 1: Dedicated Light Elements (Benchmark)
  { number: 1, symbol: 'H', name: 'Hydrogen' },
  { number: 2, symbol: 'He', name: 'Helium' },
  { number: 3, symbol: 'Li', name: 'Lithium' },
  { number: 4, symbol: 'Be', name: 'Beryllium' },
  { number: 5, symbol: 'B', name: 'Boron' },

  // Wave 2: Period 2 & 3 Nonmetals and Noble Gases
  { number: 6, symbol: 'C', name: 'Carbon' },
  { number: 7, symbol: 'N', name: 'Nitrogen' },
  { number: 8, symbol: 'O', name: 'Oxygen' },
  { number: 10, symbol: 'Ne', name: 'Neon' },
  { number: 11, symbol: 'Na', name: 'Sodium' },
  { number: 18, symbol: 'Ar', name: 'Argon' },

  // Wave 3: First Transition Series
  { number: 19, symbol: 'K', name: 'Potassium' },
  { number: 26, symbol: 'Fe', name: 'Iron' },
  { number: 29, symbol: 'Cu', name: 'Copper' },
  { number: 36, symbol: 'Kr', name: 'Krypton' },

  // Wave 4: Second Transition Series & Heavy Noble Gases
  { number: 37, symbol: 'Rb', name: 'Rubidium' },
  { number: 47, symbol: 'Ag', name: 'Silver' },
  { number: 54, symbol: 'Xe', name: 'Xenon' },

  // Wave 5: Lanthanoids, Coinage & Relativistic Heavy Elements
  { number: 55, symbol: 'Cs', name: 'Caesium' },
  { number: 79, symbol: 'Au', name: 'Gold' },
  { number: 86, symbol: 'Rn', name: 'Radon' },

  // Wave 6: Actinoids & Superheavy Synthetics
  { number: 87, symbol: 'Fr', name: 'Francium' },
  { number: 92, symbol: 'U', name: 'Uranium' },
  { number: 118, symbol: 'Og', name: 'Oganesson' },
]

test.describe('QUANTA V4 — Comprehensive Atomic Exploration (Hydrogen Standard Across Waves)', () => {
  test('Typography verification: Google Sans for UI and JetBrains Mono for Technical Readouts', async ({
    page,
  }) => {
    await page.goto('/#/element/carbon')
    await expect(page.locator('.element-name-heading')).toContainText('Carbon')

    // Verify UI font token resolves to Google Sans
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily
    })
    expect(bodyFont.toLowerCase()).toContain('google sans')

    // Verify Monospace font token resolves to JetBrains Mono
    const monoLocator = page.locator('.mono-config').first()
    await expect(monoLocator).toBeVisible()
    const monoFont = await monoLocator.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily
    })
    expect(monoFont.toLowerCase()).toContain('jetbrains mono')

    // Verify KaTeX math typography
    await page.locator('.mode-tab-btn').nth(5).click() // Equations mode
    const katexEl = page.locator('.katex').first()
    await expect(katexEl).toBeVisible()
    const katexFont = await katexEl.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily
    })
    expect(katexFont.toLowerCase()).toContain('katex')
  })

  for (const el of REPRESENTATIVE_ELEMENTS) {
    test(`Element ${el.number} (${el.name}, ${el.symbol}): all 6 modes render with Hydrogen-grade depth`, async ({
      page,
    }) => {
      await page.goto(`/#/element/${el.name.toLowerCase()}`)
      await expect(page.locator('.element-name-heading')).toContainText(el.name)
      await expect(page.locator('.element-atomic-badge')).toHaveText(String(el.number))

      // Mode 0: Overview
      await page.locator('.mode-tab-btn').nth(0).click()
      await expect(page.locator('.overview-card')).toBeVisible()
      await expect(page.locator('.card-title')).toContainText(el.name)
      await expect(page.locator('.data-table')).toBeVisible()

      // Mode 1: Shell / Bohr Model
      await page.locator('.mode-tab-btn').nth(1).click()
      await expect(page.locator('.contextual-rail')).not.toBeEmpty()

      // Mode 2: Quantum Mode
      await page.locator('.mode-tab-btn').nth(2).click()
      await expect(page.locator('.contextual-rail')).not.toBeEmpty()

      // Mode 3: Energy Levels
      await page.locator('.mode-tab-btn').nth(3).click()
      await expect(page.locator('.levels-diagram')).toBeVisible()

      // Mode 4: Spectra
      await page.locator('.mode-tab-btn').nth(4).click()
      await expect(page.locator('.spectrum-visualizer')).toBeVisible()

      // Mode 5: Equations
      await page.locator('.mode-tab-btn').nth(5).click()
      await expect(page.locator('.equation-inspector')).toBeVisible()
      await expect(page.locator('.katex').first()).toBeVisible()
    })
  }

  test('Visual capture of representative atomic instruments across periodic families', async ({
    page,
  }) => {
    const visualSamples = ['hydrogen', 'carbon', 'iron', 'gold', 'uranium', 'oganesson']

    for (const name of visualSamples) {
      await page.goto(`/#/element/${name}`)
      await page.waitForTimeout(500)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${name}-overview.png`),
        fullPage: true,
      })

      // Equations view screenshot
      await page.locator('.mode-tab-btn').nth(5).click()
      await page.waitForTimeout(400)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${name}-equations.png`),
        fullPage: true,
      })
    }
  })
})

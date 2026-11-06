import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const viewports = [
  { name: '320x500_extreme_small', width: 320, height: 500 },
  { name: '320x600_narrow_short', width: 320, height: 600 },
  { name: '375x500_se_short', width: 375, height: 500 },
  { name: '375x667_iphone_se', width: 375, height: 667 },
  { name: '390x600_iphone_short', width: 390, height: 600 },
  { name: '390x844_iphone_standard', width: 390, height: 844 },
  { name: '768x500_tablet_short', width: 768, height: 500 },
  { name: '768x1024_ipad_portrait', width: 768, height: 1024 },
]

test.beforeAll(() => {
  const dir = path.join(process.cwd(), 'test-results', 'screenshots', 'viewports')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

for (const vp of viewports) {
  test.describe(`Viewport ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({
      viewport: { width: vp.width, height: vp.height },
    })

    test(`StateCombobox placement, bounds, and interaction on ${vp.name}`, async ({ page }, testInfo) => {
      const browserName = testInfo.project.name || 'chromium'
      await page.goto('/#/element/sodium')
      await page.waitForSelector('.element-name-heading')

      const trigger = page.locator('#element-target-state-trigger')
      await expect(trigger).toBeVisible()
      const triggerBox = (await trigger.boundingBox())!

      // Scroll trigger into view if needed
      await trigger.scrollIntoViewIfNeeded()

      // Click trigger to open combobox
      await trigger.click()

      const popover = page.locator('.quanta-combobox-popover')
      await expect(popover).toBeVisible()

      const popBox = (await popover.boundingBox())!

      // Check placement relative to trigger: is it above (flipped) or below?
      const placement = popBox.y < triggerBox.y ? 'top' : 'bottom'

      console.log(
        `[${browserName}] [${vp.name}] Trigger: y=${Math.round(triggerBox.y)}, h=${Math.round(triggerBox.height)} | Popover: x=${Math.round(popBox.x)}, y=${Math.round(popBox.y)}, w=${Math.round(popBox.width)}, h=${Math.round(popBox.height)} | Placement: ${placement}`
      )

      // Bounds verification: popover must fit within viewport horizontally and vertically
      // Allow 2px sub-pixel tolerance
      expect(popBox.x).toBeGreaterThanOrEqual(-1)
      expect(popBox.x + popBox.width).toBeLessThanOrEqual(vp.width + 2)
      expect(popBox.y).toBeGreaterThanOrEqual(-1)
      expect(popBox.y + popBox.height).toBeLessThanOrEqual(vp.height + 2)

      // Verify maxHeight clamp is respected (max 320px)
      expect(popBox.height).toBeLessThanOrEqual(325)
      expect(popBox.height).toBeGreaterThanOrEqual(140)

      // Verify search input is visible and usable
      const searchInput = popover.locator('.combobox-search-input')
      if (await searchInput.isVisible()) {
        await searchInput.fill('3p')
        await page.waitForTimeout(100)
        const optionRows = popover.locator('.combobox-option-row')
        expect(await optionRows.count()).toBeGreaterThanOrEqual(1)
      }

      // Capture screenshot
      const ssPath = path.join(
        'test-results',
        'screenshots',
        'viewports',
        `${browserName}_${vp.name}.png`
      )
      await page.screenshot({ path: ssPath })

      // Select an option to confirm selection works
      const firstOpt = popover.locator('.combobox-option-row').first()
      await firstOpt.click()
      await expect(popover).not.toBeVisible()
    })
  })
}

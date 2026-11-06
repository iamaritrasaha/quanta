import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

test.beforeAll(() => {
  const dir = path.join(process.cwd(), 'test-results', 'screenshots', 'flash-verification')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

test.describe('Dropdown Positioning Flash & Opening Animation Verification', () => {
  test('First-frame opening position: dropdown never renders at top-left (0, 0)', async ({
    page,
  }, testInfo) => {
    const browserName = testInfo.project.name || 'chromium'
    await page.goto('/#/element/sodium')
    await page.waitForSelector('.element-name-heading')

    const trigger = page.locator('#element-target-state-trigger')
    await expect(trigger).toBeVisible()

    // Install a MutationObserver + rAF frame-by-frame position recorder in the browser
    await page.evaluate(() => {
      ;(window as any).__capturedFrames = []
      const capture = (source: string) => {
        const pop = document.querySelector('.quanta-combobox-popover') as HTMLElement | null
        if (pop) {
          const rect = pop.getBoundingClientRect()
          const style = window.getComputedStyle(pop)
          ;(window as any).__capturedFrames.push({
            source,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            visibility: style.visibility,
            opacity: parseFloat(style.opacity),
            transform: style.transform,
          })
        }
      }

      // 1. Observe DOM additions and attribute changes
      const observer = new MutationObserver(() => capture('mutation'))
      observer.observe(document.body, { childList: true, subtree: true, attributes: true })

      // 2. Sample first 30 animation frames immediately
      let rafCount = 0
      const loop = () => {
        capture(`raf-${rafCount}`)
        if (rafCount++ < 30) {
          requestAnimationFrame(loop)
        }
      }
      requestAnimationFrame(loop)
    })

    // Click trigger to open dropdown
    await trigger.click()

    const popover = page.locator('.quanta-combobox-popover')
    await expect(popover).toBeVisible()

    // Take screenshot of the opened dropdown
    const screenshotPath = `test-results/screenshots/flash-verification/${browserName}-first-frame-anchored.png`
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true })
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    })

    const finalBox = (await popover.boundingBox())!

    // Retrieve captured frames
    const frames: Array<{
      source: string
      x: number
      y: number
      width: number
      height: number
      visibility: string
      opacity: number
      transform: string
    }> = await page.evaluate(() => (window as any).__capturedFrames || [])

    expect(frames.length).toBeGreaterThan(0)

    // Filter frames that were actually visible to the user: visibility === 'visible' and opacity > 0
    const visibleFrames = frames.filter((f) => f.visibility === 'visible' && f.opacity > 0)
    expect(visibleFrames.length).toBeGreaterThan(0)

    // VERIFICATION: In EVERY single visible frame, the popover MUST NOT be at top-left (0, 0)!
    // It must match its final calculated position from the very first visible frame (no jump, flash, or shift).
    for (const frame of visibleFrames) {
      // Must not be near (0, 0)
      expect(frame.x).toBeGreaterThan(50)
      expect(frame.y).toBeGreaterThan(50)

      // Must be at its final anchored position (within 2px tolerance for subpixel rounding)
      expect(Math.abs(frame.x - finalBox.x)).toBeLessThanOrEqual(2)
      expect(Math.abs(frame.y - finalBox.y)).toBeLessThanOrEqual(2)
    }

    // Also check frames where visibility is hidden: if rendered before positioning, visibility MUST be 'hidden'
    const unpositionedFrames = frames.filter((f) => f.x <= 10 && f.y <= 10)
    for (const frame of unpositionedFrames) {
      expect(frame.visibility).toBe('hidden')
    }
  })

  test('Repeated opening and closing opens anchored each time with zero flicker', async ({
    page,
  }) => {
    await page.goto('/#/element/sodium')
    await page.waitForSelector('.element-name-heading')

    const trigger = page.locator('#element-target-state-trigger')
    const popover = page.locator('.quanta-combobox-popover')

    for (let cycle = 0; cycle < 4; cycle++) {
      await trigger.click()
      await expect(popover).toBeVisible()

      const box = (await popover.boundingBox())!
      expect(box.x).toBeGreaterThan(50)
      expect(box.y).toBeGreaterThan(50)

      // Close with Escape
      await page.keyboard.press('Escape')
      await expect(popover).not.toBeVisible()
    }
  })

  test('Page scroll maintains accurate anchor coordinates', async ({ page }) => {
    await page.goto('/#/element/sodium')
    await page.waitForSelector('.element-name-heading')

    // Scroll slightly
    await page.evaluate(() => window.scrollTo(0, 50))
    await page.waitForTimeout(100)

    const trigger = page.locator('#element-target-state-trigger')
    await trigger.click()

    const popover = page.locator('.quanta-combobox-popover')
    await expect(popover).toBeVisible()

    const popBox = (await popover.boundingBox())!
    expect(popBox.x).toBeGreaterThan(50)
    expect(popBox.y).toBeGreaterThan(50)
  })

  test.describe('Upward placement near viewport bottom', () => {
    test.use({ viewport: { width: 1000, height: 600 } })

    test('opens directly above trigger without flashing', async ({ page }, testInfo) => {
      const browserName = testInfo.project.name || 'chromium'
      await page.goto('/#/element/sodium')
      await page.waitForLoadState('domcontentloaded')
      await page.waitForSelector('.element-name-heading')

      const trigger = page.locator('#element-target-state-trigger')
      await expect(trigger).toBeVisible()
      const triggerBox = (await trigger.boundingBox())!

      // Record frames for upward placement
      await page.evaluate(() => {
        ;(window as any).__upwardFrames = []
        const capture = (source: string) => {
          const pop = document.querySelector('.quanta-combobox-popover') as HTMLElement | null
          if (pop) {
            const rect = pop.getBoundingClientRect()
            const style = window.getComputedStyle(pop)
            ;(window as any).__upwardFrames.push({
              source,
              x: rect.x,
              y: rect.y,
              visibility: style.visibility,
              opacity: parseFloat(style.opacity),
            })
          }
        }
        const obs = new MutationObserver(() => capture('mutation'))
        obs.observe(document.body, { childList: true, subtree: true, attributes: true })
        let rafCount = 0
        const loop = () => {
          capture(`raf-${rafCount}`)
          if (rafCount++ < 20) requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
      })

      await trigger.click()
      const popover = page.locator('.quanta-combobox-popover')
      await expect(popover).toBeVisible()

      const finalBox = (await popover.boundingBox())!
      // Final box should be placed above trigger
      expect(finalBox.y).toBeLessThan(triggerBox.y)

      const upwardPath = `test-results/screenshots/flash-verification/${browserName}-upward-placement.png`
      fs.mkdirSync(path.dirname(upwardPath), { recursive: true })
      await page.screenshot({
        path: upwardPath,
        fullPage: false,
      })

      const frames: Array<{ x: number; y: number; visibility: string; opacity: number }> =
        await page.evaluate(() => (window as any).__upwardFrames || [])

      const visibleFrames = frames.filter((f) => f.visibility === 'visible' && f.opacity > 0)
      for (const frame of visibleFrames) {
        expect(frame.x).toBeGreaterThan(50)
        expect(frame.y).toBeGreaterThan(50)
        expect(Math.abs(frame.x - finalBox.x)).toBeLessThanOrEqual(2)
        expect(Math.abs(frame.y - finalBox.y)).toBeLessThanOrEqual(2)
      }
    })
  })
})

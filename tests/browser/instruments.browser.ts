import { test, expect, type Page } from '@playwright/test'
import { elements } from '../../src/data/elements'

async function openElement(page: Page, name: string) {
  await page.goto(`/#/element/${name.toLowerCase()}`)
  await expect(page.locator('.element-name-heading')).toContainText(name)
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.locator('.scene-loader-fallback')).toHaveCount(0)
  // Wait for an actual rendered frame before starting a timed interaction.
  await page.locator('canvas').screenshot()
}

async function mode(page: Page, index: number) {
  await page.locator('.mode-tab-btn').nth(index).click()
  await expect(page.locator('.mode-tab-btn').nth(index)).toHaveAttribute('aria-current', 'page')
}

async function photon(page: Page, direction: 'ABSORB' | 'EMIT') {
  await page.getByRole('button', { name: new RegExp(`${direction} PHOTON`) }).click()
}

async function progress(page: Page) {
  return page.evaluate(() => {
    const meter = document.querySelector<HTMLProgressElement>('.atomic-jump-progress')
    return meter ? meter.value : Number.parseFloat(document.querySelector('.progress-percent')?.textContent ?? 'NaN') / 100
  })
}

async function pauseJump(page: Page) {
  await page.waitForFunction(() => {
    const meter = document.querySelector<HTMLProgressElement>('.atomic-jump-progress')
    const p = meter ? meter.value : Number.parseFloat(document.querySelector('.progress-percent')?.textContent ?? 'NaN') / 100
    if (p >= 0.15 && p < 0.95) {
      const button = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'PAUSE')
      button?.click()
      return Boolean(button)
    }
    return false
  })
  await expect(page.getByRole('button', { name: 'PLAY', exact: true })).toBeVisible()
}

async function finishJump(page: Page) {
  await expect(page.getByRole('button', { name: 'CANCEL TRANSITION', exact: true })).toHaveCount(0)
}

// Compare rendered pixels without platform-dependent committed screenshot baselines.
async function imageDifference(page: Page, first: Buffer, second: Buffer) {
  return page.evaluate(async ([a, b]) => {
    const decode = (data: string) => new Promise<HTMLImageElement>((resolve) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.src = `data:image/png;base64,${data}`
    })
    const [x, y] = await Promise.all([decode(a), decode(b)])
    if (x.width !== y.width || x.height !== y.height) return Infinity
    const canvas = document.createElement('canvas')
    canvas.width = x.width; canvas.height = x.height
    const context = canvas.getContext('2d')!
    context.drawImage(x, 0, 0)
    const px = context.getImageData(0, 0, x.width, x.height).data
    context.clearRect(0, 0, x.width, x.height)
    context.drawImage(y, 0, 0)
    const py = context.getImageData(0, 0, y.width, y.height).data
    let difference = 0
    for (let i = 0; i < px.length; i++) difference += Math.abs(px[i] - py[i])
    return difference / px.length
  }, [first.toString('base64'), second.toString('base64')])
}

const pageErrors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('requestfailed', (request) => {
    if (!request.failure()?.errorText.includes('ERR_ABORTED')) errors.push(`${request.url()}: ${request.failure()?.errorText}`)
  })
  pageErrors.set(page, errors)
})

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page), 'Browser errors or failed requests').toEqual([])
})

test('all 118 routes and all 113 shared transition controllers work', async ({ page }) => {
  test.setTimeout(300_000)
  await page.goto('/')
  await expect(page.locator('.element-tile')).toHaveCount(118)
  await page.locator('.element-tile[aria-label^="Carbon,"]').click()
  await expect(page.locator('.element-name-heading')).toContainText('Carbon')
  for (const element of elements) {
    await page.evaluate((name) => { location.hash = `/element/${name.toLowerCase()}` }, element.name)
    await expect(page.locator('.element-name-heading')).toContainText(element.name)
    await expect(page.locator('.element-atomic-badge')).toHaveText(String(element.number))
    if (element.number > 5) {
      await expect(page.locator('#element-initial-state')).toHaveValue('ground')
      await photon(page, 'ABSORB')
      await expect(page.locator('.atomic-jump-progress')).toBeVisible()
      await page.getByRole('button', { name: 'CANCEL TRANSITION', exact: true }).click()
      await expect(page.locator('.atomic-jump-progress')).toHaveCount(0)
    }
  }
  await page.getByRole('button', { name: '← PERIODIC TABLE', exact: true }).click()
  await expect(page.locator('.element-tile')).toHaveCount(118)
  await page.goBack()
  await expect(page.locator('.element-name-heading')).toContainText('Oganesson')
  await page.goForward()
  await expect(page.locator('.element-tile')).toHaveCount(118)
  for (const hash of ['#/element/%', '#/element/unknown']) {
    await page.evaluate((value) => { location.hash = value }, hash)
    await expect(page.locator('.element-tile')).toHaveCount(118)
  }
})

for (const name of ['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron']) {
  test(`${name}: photon pause, speed, resume, emission, cancel, reset, modes and idle pause`, async ({ page }) => {
    await openElement(page, name)
    await mode(page, 1)
    await page.getByRole('button', { name: '0.5×', exact: true }).click()
    await page.getByRole('button', { name: 'PAUSE', exact: true }).click()
    await photon(page, 'ABSORB')
    await pauseJump(page)
    const paused = await progress(page)
    await page.waitForTimeout(650)
    expect(await progress(page)).toBe(paused)
    await expect(page.locator('.phase-text')).toContainText('Transition paused')
    await page.getByRole('button', { name: '2×', exact: true }).click()
    await page.waitForTimeout(300)
    expect(await progress(page)).toBe(paused)
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    await finishJump(page)
    const upper = await page.locator('.quick-state-val').innerText()
    await page.getByRole('button', { name: '0.5×', exact: true }).click()
    await photon(page, 'EMIT')
    await expect(page.locator('.progress-percent')).toBeVisible()
    await finishJump(page)
    expect(await page.locator('.quick-state-val').innerText()).not.toBe(upper)
    await page.getByRole('button', { name: 'RESET ATOM', exact: true }).click()
    await photon(page, 'ABSORB')
    await expect(page.locator('.progress-percent')).toBeVisible()
    await page.getByRole('button', { name: 'CANCEL TRANSITION', exact: true }).click()
    await finishJump(page)
    await photon(page, 'ABSORB')
    await expect(page.locator('.progress-percent')).toBeVisible()
    await page.getByRole('button', { name: 'RESET ATOM', exact: true }).click()
    await finishJump(page)
    for (let index = 0; index < 6; index++) {
      await mode(page, index)
      await expect(page.locator('.contextual-rail')).not.toBeEmpty()
    }
    await page.getByRole('button', { name: '2×', exact: true }).click()
    await mode(page, 0)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.getByRole('button', { name: 'PAUSE', exact: true }).click()
    // Let any display-mode crossfade settle before comparing stationary frames.
    await page.waitForTimeout(1200)
    const before = await page.locator('canvas').screenshot()
    await page.waitForTimeout(500)
    const after = await page.locator('canvas').screenshot()
    expect(await imageDifference(page, before, after)).toBeLessThan(0.02)
  })
}

test('shared reference and schematic transitions, clouds and missing data', async ({ page }) => {
  await openElement(page, 'Carbon')
  await mode(page, 1)
  const shell = await page.locator('canvas').screenshot()
  await mode(page, 2)
  expect(await imageDifference(page, shell, await page.locator('canvas').screenshot())).toBeGreaterThan(0.1)
  await mode(page, 1)
  await photon(page, 'ABSORB')
  await pauseJump(page)
  const paused = await progress(page)
  await page.waitForTimeout(600)
  expect(await progress(page)).toBe(paused)
  await page.getByRole('button', { name: 'PLAY', exact: true }).click()
  await expect(page.locator('#element-initial-state')).toHaveValue('nist-7')
  await photon(page, 'EMIT')
  await expect(page.locator('#element-initial-state')).toHaveValue('ground')
  await mode(page, 3)
  await page.locator('.atomic-level-button').nth(1).click()
  await expect(page.locator('#element-initial-state')).toHaveValue('nist-1')
  await mode(page, 4)
  await page.selectOption('#atomic-lower-level', '0')
  await page.selectOption('#atomic-upper-level', '7')
  await page.getByRole('button', { name: 'ANIMATE ABSORPTION', exact: true }).click()
  await expect(page.locator('#element-initial-state')).toHaveValue('nist-7')
  await page.getByRole('button', { name: 'ANIMATE EMISSION', exact: true }).click()
  await expect(page.locator('#element-initial-state')).toHaveValue('ground')
  for (const name of ['Iron', 'Cerium', 'Lawrencium', 'Oganesson']) {
    await openElement(page, name)
    const target = await page.locator('#element-target-state').inputValue()
    await photon(page, 'ABSORB')
    await expect(page.locator('#element-initial-state')).toHaveValue(target)
    await photon(page, 'EMIT')
    await expect(page.locator('#element-initial-state')).toHaveValue('ground')
  }
  await expect(page.locator('.element-transition-controls')).toContainText('No measured energy or wavelength')
  await expect(page.locator('.atomic-jump-energy')).toHaveCount(0)
  await mode(page, 4)
  await expect(page.locator('.atomic-data-notice')).toContainText('not listed')
})

test('mouse rotation, zoom, and camera reset work on Hydrogen and Carbon', async ({ page }) => {
  for (const name of ['Hydrogen', 'Carbon']) {
    await openElement(page, name)
    const pause = page.getByRole('button', { name: 'PAUSE', exact: true })
    if (await pause.count()) await pause.click()
    const original = await page.locator('canvas').screenshot()
    const box = (await page.locator('canvas').boundingBox())!
    const x = box.x + box.width / 2, y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 120, y + 60, { steps: 12 })
    await page.mouse.up()
    await page.waitForTimeout(800)
    const rotated = await page.locator('canvas').screenshot()
    expect(await imageDifference(page, original, rotated)).toBeGreaterThan(0.02)
    await page.mouse.wheel(0, -450)
    await page.waitForTimeout(800)
    expect(await imageDifference(page, rotated, await page.locator('canvas').screenshot())).toBeGreaterThan(0.02)
    await page.getByRole('button', { name: 'RESET VIEW', exact: true }).click()
    await page.waitForTimeout(600)
    expect(await imageDifference(page, original, await page.locator('canvas').screenshot())).toBeLessThan(0.05)
  }
})

for (const width of [320, 390, 768]) {
  test(`${width}px: shared controls, modes and layout fit`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await openElement(page, 'Oganesson')
    await page.selectOption('#element-target-state', 'promotion-2')
    await photon(page, 'ABSORB')
    await expect(page.locator('#element-initial-state')).toHaveValue('promotion-2')
    for (let index = 0; index < 6; index++) await mode(page, index)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}

test('touch drag and pinch rotate and zoom the camera', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await openElement(page, 'Carbon')
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click()
  const original = await page.locator('canvas').screenshot()
  const box = (await page.locator('canvas').boundingBox())!
  const x = box.x + box.width * 0.45, y = box.y + box.height * 0.5
  const session = await context.newCDPSession(page)
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] })
  for (let i = 1; i <= 10; i++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + i * 8, y: y + i * 2, id: 1 }] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(800)
  const rotated = await page.locator('canvas').screenshot()
  expect(await imageDifference(page, original, rotated)).toBeGreaterThan(0.02)
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x - 30, y, id: 1 }, { x: x + 30, y, id: 2 }] })
  for (let i = 1; i <= 8; i++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 30 - i * 5, y, id: 1 }, { x: x + 30 + i * 5, y, id: 2 }] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(700)
  expect(await imageDifference(page, rotated, await page.locator('canvas').screenshot())).toBeGreaterThan(0.02)
  expect(await page.evaluate(() => window.visualViewport?.scale)).toBe(1)
  await context.close()
})

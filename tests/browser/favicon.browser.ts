import { test, expect } from '@playwright/test'

test.describe('Favicon & Asset Verification', () => {
  test('Favicon link tags are properly configured in index.html', async ({ page }) => {
    await page.goto('/')

    // 1. Check SVG icon link
    const svgIcon = page.locator('link[rel="icon"][type="image/svg+xml"]')
    await expect(svgIcon).toHaveCount(1)
    const svgHref = await svgIcon.getAttribute('href')
    expect(svgHref).toMatch(/favicon\.svg\?v=4$/)

    // 2. Check 32x32 PNG alternate icon
    const png32Icon = page.locator('link[rel="alternate icon"][sizes="32x32"]')
    await expect(png32Icon).toHaveCount(1)
    const png32Href = await png32Icon.getAttribute('href')
    expect(png32Href).toMatch(/favicon-32x32\.png\?v=4$/)

    // 3. Check 16x16 PNG alternate icon
    const png16Icon = page.locator('link[rel="alternate icon"][sizes="16x16"]')
    await expect(png16Icon).toHaveCount(1)
    const png16Href = await png16Icon.getAttribute('href')
    expect(png16Href).toMatch(/favicon-16x16\.png\?v=4$/)

    // 4. Check Apple Touch Icon
    const appleIcon = page.locator('link[rel="apple-touch-icon"][sizes="180x180"]')
    await expect(appleIcon).toHaveCount(1)
    const appleHref = await appleIcon.getAttribute('href')
    expect(appleHref).toMatch(/apple-touch-icon\.png\?v=4$/)
  })

  test('All favicon assets return HTTP 200 with correct content types', async ({ page, request }) => {
    await page.goto('/')

    const links = await page.evaluate(() => {
      const iconLinks = Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]'))
      return iconLinks.map((link) => ({
        rel: link.getAttribute('rel'),
        href: link.getAttribute('href') || '',
        absoluteHref: (link as HTMLLinkElement).href,
        type: link.getAttribute('type'),
        sizes: link.getAttribute('sizes'),
      }))
    })

    expect(links.length).toBeGreaterThanOrEqual(4)

    for (const link of links) {
      const response = await request.get(link.absoluteHref)
      expect(response.status(), `Status 200 for ${link.href}`).toBe(200)

      const contentType = response.headers()['content-type'] || ''
      if (link.href.includes('.svg')) {
        expect(contentType).toContain('image/svg+xml')
      } else if (link.href.includes('.png')) {
        expect(contentType).toContain('image/png')
      }

      const body = await response.body()
      expect(body.length, `Non-empty payload for ${link.href}`).toBeGreaterThan(100)
    }
  })

  test('Favicon images render crisply without clipping or decoding errors', async ({ page }) => {
    await page.goto('/')

    const renderResults = await page.evaluate(async () => {
      const linkElements = Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]'))
      const results: Array<{
        href: string
        naturalWidth: number
        naturalHeight: number
        complete: boolean
        cornerAlpha: number
        centerAlpha: number
      }> = []

      for (const el of linkElements) {
        const fullHref = (el as HTMLLinkElement).href
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = fullHref

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error(`Failed to load ${fullHref}`))
        })

        // Draw onto offscreen canvas to verify transparency and rendering
        const canvas = document.createElement('canvas')
        const width = img.naturalWidth || 64
        const height = img.naturalHeight || 64
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        const topLeftPixel = ctx.getImageData(0, 0, 1, 1).data
        const centerPixel = ctx.getImageData(Math.floor(width / 2), Math.floor(height / 2), 1, 1).data

        results.push({
          href: (el as HTMLLinkElement).getAttribute('href') || '',
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          cornerAlpha: topLeftPixel[3],
          centerAlpha: centerPixel[3],
        })
      }

      return results
    })

    console.log('Render results in browser:', JSON.stringify(renderResults, null, 2))

    for (const res of renderResults) {
      expect(res.complete).toBe(true)
      // Transparent background: corner pixel must have alpha === 0
      expect(res.cornerAlpha, `Top-left corner must be transparent for ${res.href}`).toBe(0)

      if (res.href.includes('favicon-32x32')) {
        expect(res.naturalWidth).toBe(32)
        expect(res.naturalHeight).toBe(32)
      } else if (res.href.includes('favicon-16x16')) {
        expect(res.naturalWidth).toBe(16)
        expect(res.naturalHeight).toBe(16)
      } else if (res.href.includes('apple-touch-icon')) {
        expect(res.naturalWidth).toBe(180)
        expect(res.naturalHeight).toBe(180)
      }
    }
  })
})

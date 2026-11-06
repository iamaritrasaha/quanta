import { chromium } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const SVG_PATH = path.resolve('public/favicon.svg')
const svgContent = fs.readFileSync(SVG_PATH, 'utf8')

// Screenshots inspection directory
const SCREENSHOTS_DIR = 'C:\\Users\\Aritra Saha\\.gemini\\antigravity\\brain\\1ba612ea-7c0f-4247-adab-2ca80b790a67\\screenshots'
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

// Target public assets
const PUBLIC_DIR = path.resolve('public')

async function main() {
  console.log('Inspecting SVG structure...')

  // Check 1: 100% vector SVG without embedded base64 bitmaps
  const hasBase64 = /data:image\/[^;]+;base64/i.test(svgContent)
  const hasImageTag = /<image\b/i.test(svgContent)
  const hasRectBackground = /<rect[^>]+fill="(?!none)[^"]+"[^>]*>/i.test(svgContent)
  console.log(`- Has embedded base64 bitmaps: ${hasBase64}`)
  console.log(`- Has <image> tags: ${hasImageTag}`)
  console.log(`- Has opaque <rect> background: ${hasRectBackground}`)

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Measure bounding box in browser
  await page.setContent(`<!DOCTYPE html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; background: transparent; }
  svg { display: block; }
</style>
</head>
<body>
${svgContent}
</body>
</html>`)

  const bboxInfo = await page.evaluate(() => {
    const svg = document.querySelector('svg')
    const paths = Array.from(document.querySelectorAll('path'))
    const svgBBox = svg.getBBox()
    return {
      svgAttr: {
        width: svg.getAttribute('width'),
        height: svg.getAttribute('height'),
        viewBox: svg.getAttribute('viewBox'),
      },
      svgBBox: {
        x: Math.round(svgBBox.x),
        y: Math.round(svgBBox.y),
        width: Math.round(svgBBox.width),
        height: Math.round(svgBBox.height),
      },
      paths: paths.map((p, i) => {
        const box = p.getBBox()
        return {
          index: i,
          fill: p.getAttribute('fill'),
          fillRule: p.getAttribute('fill-rule'),
          box: {
            x: Math.round(box.x),
            y: Math.round(box.y),
            width: Math.round(box.width),
            height: Math.round(box.height),
          },
        }
      }),
    }
  })

  console.log('SVG Inspection Results:', JSON.stringify(bboxInfo, null, 2))

  // Render sizes for inspection
  const inspectionSizes = [16, 32, 48, 64, 256]
  for (const size of inspectionSizes) {
    const outPath = path.join(SCREENSHOTS_DIR, `favicon-${size}.png`)
    await page.setViewportSize({ width: size, height: size })
    await page.setContent(`<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    width: ${size}px;
    height: ${size}px;
    background: transparent;
    overflow: hidden;
  }
  svg {
    display: block;
    width: ${size}px;
    height: ${size}px;
  }
</style>
</head>
<body>
${svgContent}
</body>
</html>`)

    const svg = page.locator('svg')
    await svg.screenshot({
      path: outPath,
      omitBackground: true,
    })
    console.log(`Rendered inspection screenshot: ${outPath} (${size}x${size})`)
  }

  // Render target public assets
  const publicAssets = [
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'apple-touch-icon.png', size: 180 },
  ]

  for (const asset of publicAssets) {
    const outPath = path.join(PUBLIC_DIR, asset.name)
    await page.setViewportSize({ width: asset.size, height: asset.size })
    await page.setContent(`<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    width: ${asset.size}px;
    height: ${asset.size}px;
    background: transparent;
    overflow: hidden;
  }
  svg {
    display: block;
    width: ${asset.size}px;
    height: ${asset.size}px;
  }
</style>
</head>
<body>
${svgContent}
</body>
</html>`)

    const svg = page.locator('svg')
    await svg.screenshot({
      path: outPath,
      omitBackground: true,
    })
    console.log(`Generated public asset: ${outPath} (${asset.size}x${asset.size})`)
  }

  await browser.close()
  console.log('All favicons rendered and saved successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

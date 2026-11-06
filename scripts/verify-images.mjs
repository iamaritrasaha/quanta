import { chromium } from '@playwright/test'
import * as fs from 'fs'

async function check() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const files = [
    'public/favicon-16x16.png',
    'public/favicon-32x32.png',
    'public/apple-touch-icon.png',
  ]

  for (const file of files) {
    const b64 = fs.readFileSync(file).toString('base64')
    const dataUrl = `data:image/png;base64,${b64}`
    await page.setContent('<html><body><canvas id="c"></canvas></body></html>')
    const info = await page.evaluate(async (src) => {
      const img = new Image()
      img.src = src
      await new Promise((r) => { img.onload = r })
      const canvas = document.getElementById('c')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const pTopLeft = ctx.getImageData(0, 0, 1, 1).data
      const pCenter = ctx.getImageData(Math.floor(img.width / 2), Math.floor(img.height / 2), 1, 1).data
      return {
        width: img.width,
        height: img.height,
        topLeftPixel: Array.from(pTopLeft),
        centerPixel: Array.from(pCenter),
      }
    }, dataUrl)
    console.log(file, JSON.stringify(info))
  }
  await browser.close()
}

check().catch(console.error)

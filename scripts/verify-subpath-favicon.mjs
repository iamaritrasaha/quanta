import http from 'http'
import fs from 'fs'
import path from 'path'
import { chromium, firefox } from '@playwright/test'

const DIST_DIR = path.resolve('dist')
const PORT = 5173
const BASE_PATH = '/quanta'

// Simple static server serving dist/ at /quanta/
function startServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.json': 'application/json',
  }

  const server = http.createServer((req, res) => {
    let reqUrl = req.url || '/'
    // Strip query string
    const [pathname, queryString] = reqUrl.split('?')

    if (!pathname.startsWith(BASE_PATH)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      return res.end('Not found (must start with ' + BASE_PATH + ')')
    }

    let relativePath = pathname.slice(BASE_PATH.length)
    if (relativePath === '' || relativePath === '/') {
      relativePath = '/index.html'
    }

    const filePath = path.join(DIST_DIR, relativePath)
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      return res.end(`File not found: ${filePath}`)
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    const content = fs.readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  })

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Test subpath server listening at http://localhost:${PORT}${BASE_PATH}/`)
      resolve(server)
    })
  })
}

async function verifyBrowser(browserType, browserName) {
  console.log(`\n========================================`)
  console.log(`Testing isolated context in ${browserName}...`)
  console.log(`========================================`)

  const browser = await browserType.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  const targetUrl = `http://localhost:${PORT}${BASE_PATH}/`
  const response = await page.goto(targetUrl)
  console.log(`Loaded ${targetUrl} (Status: ${response.status()})`)

  // 1. Inspect DOM favicon links
  const links = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]'))
    return list.map((l) => ({
      rel: l.getAttribute('rel'),
      href: l.getAttribute('href'),
      resolvedHref: l.href,
      type: l.getAttribute('type'),
      sizes: l.getAttribute('sizes'),
    }))
  })

  console.log(`Found ${links.length} favicon/icon link elements:`)
  for (const l of links) {
    console.log(`  - rel="${l.rel}" href="${l.href}" type="${l.type}" sizes="${l.sizes}" -> resolved: ${l.resolvedHref}`)
  }

  // 2. Fetch each asset directly and verify status & content type
  console.log(`\nVerifying HTTP response for each asset in ${browserName}:`)
  for (const l of links) {
    const assetResp = await page.request.get(l.resolvedHref)
    const status = assetResp.status()
    const contentType = assetResp.headers()['content-type']
    const body = await assetResp.body()
    console.log(`  - [${status}] ${l.resolvedHref}`)
    console.log(`    Content-Type: ${contentType}, Size: ${body.length} bytes`)

    if (status !== 200) {
      throw new Error(`Failed to load ${l.resolvedHref}: HTTP ${status}`)
    }
    if (l.href.includes('.svg') && !contentType.includes('image/svg+xml')) {
      throw new Error(`Expected image/svg+xml for ${l.resolvedHref}, got ${contentType}`)
    }
    if (l.href.includes('.png') && !contentType.includes('image/png')) {
      throw new Error(`Expected image/png for ${l.resolvedHref}, got ${contentType}`)
    }
  }

  // 3. Render assets in browser DOM to verify transparency and no clipping
  console.log(`\nVerifying image decoding, dimensions, and alpha transparency in ${browserName}:`)
  const renderResults = await page.evaluate(async () => {
    const list = Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]'))
    const details = []

    for (const item of list) {
      const src = item.href
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src

      await new Promise((res, rej) => {
        img.onload = res
        img.onerror = () => rej(new Error('Failed to decode image ' + src))
      })

      const w = img.naturalWidth || 64
      const h = img.naturalHeight || 64
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)

      const corner = ctx.getImageData(0, 0, 1, 1).data
      const center = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data

      details.push({
        href: item.getAttribute('href'),
        width: w,
        height: h,
        complete: img.complete,
        cornerAlpha: corner[3],
        centerAlpha: center[3],
      })
    }
    return details
  })

  for (const r of renderResults) {
    console.log(`  - Asset: ${r.href}`)
    console.log(`    Dimensions: ${r.width}x${r.height}, complete: ${r.complete}`)
    console.log(`    Corner alpha: ${r.cornerAlpha} (0 is transparent), Center alpha: ${r.centerAlpha}`)
    if (r.cornerAlpha !== 0) {
      throw new Error(`Corner is not transparent for ${r.href}: alpha=${r.cornerAlpha}`)
    }
  }

  await context.close()
  await browser.close()
  console.log(`SUCCESS: ${browserName} passed all favicon and asset checks.`)
}

async function run() {
  const server = await startServer()
  try {
    await verifyBrowser(chromium, 'Chromium')
    await verifyBrowser(firefox, 'Firefox')
    console.log('\nAll browser verification tests passed successfully!')
  } finally {
    server.close()
  }
}

run().catch((err) => {
  console.error('Verification failed:', err)
  process.exit(1)
})

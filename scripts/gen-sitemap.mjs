/**
 * Postbuild sitemap generator.
 *
 * Reads the local blog manifest at dist/posts/index.json (produced by Vite
 * copying public/posts/index.json) and emits dist/sitemap.xml pointing at:
 *
 *   - the homepage
 *   - each hash-anchored section (#about, #projects, #skills, #writing, #contact)
 *   - each blog post as #post/<slug>
 *
 * Google crawls hash routes for JS-rendered SPAs and will follow these
 * fragments to the client-rendered content.  Override the base URL by
 * setting SITE_URL in the environment (defaults to https://lalitm.in).
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('dist')
const SITE_URL = (process.env.SITE_URL || 'https://lalitm.in').replace(
  /\/+$/,
  '',
)

function readPosts() {
  const p = path.join(DIST, 'posts', 'index.json')
  if (!fs.existsSync(p)) return []
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch (err) {
    console.warn('[sitemap] failed to parse posts/index.json:', err.message)
    return []
  }
}

function iso(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

function url({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('[sitemap] dist/ does not exist - run vite build first')
    process.exit(1)
  }
  const posts = readPosts()
  const today = new Date().toISOString().slice(0, 10)

  const entries = [
    {
      loc: `${SITE_URL}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0',
    },
    ...['about', 'projects', 'skills', 'writing', 'contact'].map((h) => ({
      loc: `${SITE_URL}/#${h}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...posts.map((p) => ({
      loc: `${SITE_URL}/#post/${p.slug}`,
      lastmod: iso(p.date),
      changefreq: 'yearly',
      priority: '0.8',
    })),
  ]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.map(url).join('\n'),
    '</urlset>',
    '',
  ].join('\n')

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml)
  console.log(
    `[sitemap] wrote dist/sitemap.xml (${entries.length} URLs, ${posts.length} posts)`,
  )
}

main()
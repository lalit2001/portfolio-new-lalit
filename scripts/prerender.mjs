/**
 * Postbuild prerender for SEO.
 *
 * Problem:
 *   The SPA shell arrives empty.  Crawlers see `<title>` and no body text,
 *   and the blog's hash routes (#post/<slug>) collapse all posts into the
 *   homepage.  Real indexable URLs with real text in the HTML fix both.
 *
 * What this writes:
 *   dist/post/<slug>/index.html   - one real HTML file per post, with the
 *                                   post rendered inside <main id="prerender">
 *                                   (hidden once React mounts), plus per-post
 *                                   <title>, meta description, canonical URL,
 *                                   OG + Twitter tags and JSON-LD BlogPosting.
 *   dist/index.html               - same shell, augmented with a hidden
 *                                   <main id="prerender"> listing the latest
 *                                   posts so Googlebot sees content on the
 *                                   very first fetch, pre-JS.
 *   dist/404.html                 - copy of dist/index.html, so hosts that
 *                                   fall back to 404.html on unknown paths
 *                                   (GitHub Pages, many static hosts) still
 *                                   boot the SPA for /post/<slug>.
 *   dist/_redirects               - "/* /index.html 200" fallback for
 *                                   Netlify / Cloudflare Pages-style hosts.
 *
 * MDX note:
 *   The posts in this repo are plain markdown with frontmatter - no JSX
 *   components imported.  So we parse frontmatter and run the body through
 *   `marked` (GFM) to get HTML suitable for a crawler-visible preview.
 *   The runtime still re-renders with full @mdx-js/mdx fidelity once React
 *   takes over.
 */
import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

const DIST = path.resolve('dist')
const SITE_URL = (process.env.SITE_URL || 'https://lalitm.in').replace(
  /\/+$/,
  '',
)

marked.setOptions({ gfm: true, breaks: false })

/* ---------- utilities ---------- */

function readPosts() {
  const p = path.join(DIST, 'posts', 'index.json')
  if (!fs.existsSync(p)) return []
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function readShell() {
  const p = path.join(DIST, 'index.html')
  if (!fs.existsSync(p)) {
    throw new Error('[prerender] dist/index.html missing - run vite build first')
  }
  return fs.readFileSync(p, 'utf8')
}

/** Minimal YAML frontmatter parser (mirrors src/lib/frontmatter.ts). */
function parseFrontmatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!m) return { data: {}, content: src }
  const [, yaml, content] = m
  const data = {}
  yaml.split('\n').forEach((line) => {
    const kv = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/)
    if (!kv) return
    const [, key, raw] = kv
    const v = raw.trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      data[key] = v.slice(1, -1)
    } else if (v.startsWith('[') && v.endsWith(']')) {
      const inner = v.slice(1, -1).trim()
      data[key] = inner
        ? inner.split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, ''))
        : []
    } else if (/^-?\d+(\.\d+)?$/.test(v)) {
      data[key] = Number(v)
    } else if (v === 'true' || v === 'false') {
      data[key] = v === 'true'
    } else {
      data[key] = v
    }
  })
  return { data, content }
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Strip markdown so an excerpt stays plain-text for meta description. */
function toPlain(md, max = 300) {
  const t = String(md)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>#-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + '…'
}

function fmtDate(d) {
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return new Date().toISOString().slice(0, 10)
  return dt.toISOString().slice(0, 10)
}

/* ---------- head rewriting ----------
 * Replace specific head meta tags in the Vite-emitted shell with
 * per-post equivalents.  We work with string replace rather than a DOM
 * parser - the shell structure is stable and this keeps the script
 * dependency-free beyond `marked`.
 */

function rewriteHead(html, post, { excerpt, canonical, coverAbs }) {
  const titleFull = `${post.title} - Lalit Moharana`
  const desc = excerpt
  let out = html

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(titleFull)}</title>`)

  // meta name="description"
  out = out.replace(
    /<meta\s+name="description"[\s\S]*?\/?>/i,
    `<meta name="description" content="${esc(desc)}" />`,
  )

  // canonical
  out = out.replace(
    /<link\s+rel="canonical"[^>]*\/?>/i,
    `<link rel="canonical" href="${esc(canonical)}" />`,
  )
  // alternate hreflang - point at the same canonical
  out = out.replace(
    /<link\s+rel="alternate"\s+hreflang="en"[^>]*\/?>/i,
    `<link rel="alternate" hreflang="en" href="${esc(canonical)}" />`,
  )
  out = out.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"[^>]*\/?>/i,
    `<link rel="alternate" hreflang="x-default" href="${esc(canonical)}" />`,
  )

  // OG
  out = out.replace(
    /<meta\s+property="og:type"[^>]*\/?>/i,
    `<meta property="og:type" content="article" />`,
  )
  out = out.replace(
    /<meta\s+property="og:url"[^>]*\/?>/i,
    `<meta property="og:url" content="${esc(canonical)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:title"[^>]*\/?>/i,
    `<meta property="og:title" content="${esc(titleFull)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:description"[^>]*\/?>/i,
    `<meta property="og:description" content="${esc(desc)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:image"[^>]*\/?>/i,
    `<meta property="og:image" content="${esc(coverAbs)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:image:secure_url"[^>]*\/?>/i,
    `<meta property="og:image:secure_url" content="${esc(coverAbs)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:image:alt"[^>]*\/?>/i,
    `<meta property="og:image:alt" content="${esc(post.title)}" />`,
  )

  // Twitter
  out = out.replace(
    /<meta\s+name="twitter:title"[^>]*\/?>/i,
    `<meta name="twitter:title" content="${esc(titleFull)}" />`,
  )
  out = out.replace(
    /<meta\s+name="twitter:description"[^>]*\/?>/i,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
  )
  out = out.replace(
    /<meta\s+name="twitter:image"[^>]*\/?>/i,
    `<meta name="twitter:image" content="${esc(coverAbs)}" />`,
  )

  return out
}

/** JSON-LD BlogPosting block appended just before </head>. */
function articleJsonLd(post, { canonical, coverAbs }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: post.title,
    datePublished: fmtDate(post.date),
    dateModified: fmtDate(post.date),
    author: {
      '@type': 'Person',
      name: 'Lalit Moharana',
      url: SITE_URL + '/',
    },
    publisher: {
      '@type': 'Person',
      name: 'Lalit Moharana',
      url: SITE_URL + '/',
    },
    description: post.excerpt || '',
    image: coverAbs,
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
    url: canonical,
  }
  return `<script type="application/ld+json">${JSON.stringify(json)}</script>`
}

function injectJsonLd(html, block) {
  return html.replace(/<\/head>/i, `${block}\n  </head>`)
}

/* ---------- body prerender ----------
 * Insert a <main id="prerender"> block right after the SPA root.  CSS
 * hides it once React has mounted (#root populated), so humans never see
 * it but crawlers reading the raw HTML do.
 */

const PRERENDER_HIDE_STYLE = `
    <style>
      /* Prerendered content serves crawlers AND no-JS visitors.
         By default we keep it off-screen so JS users never see FOUC
         before React mounts.  Once #root is populated we hide it fully.
         The <noscript> block below promotes it back to a readable layout
         when JavaScript is disabled, so no-JS visitors still get the
         full homepage / post content instead of a blank page. */
      #prerender { position: absolute; left: -99999px; top: 0; width: 1px; height: 1px; overflow: hidden; }
      #root:not(:empty) ~ #prerender { display: none; }
    </style>
    <noscript>
      <style>
        /* No-JS fallback — show the prerendered content as a real
           document, cream on black, matching the site palette. */
        #prerender {
          position: static !important;
          left: auto !important;
          width: auto !important;
          height: auto !important;
          overflow: visible !important;
          display: block !important;
          max-width: 46rem;
          margin: 3rem auto 6rem;
          padding: 0 1.5rem;
          color: #DEDBC8;
          font-family: 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.65;
        }
        #prerender h1 { font-size: 2rem; line-height: 1.15; margin: 0 0 1rem; }
        #prerender h2 { font-size: 1.4rem; line-height: 1.2; margin: 2.4em 0 0.6em; }
        #prerender h3 { font-size: 1.15rem; margin: 1.8em 0 0.5em; }
        #prerender h4 { font-size: 1rem; margin: 1.4em 0 0.4em; }
        #prerender p  { margin: 0 0 1em; color: rgba(222,219,200,0.82); }
        #prerender a  { color: #DEDBC8; text-decoration: underline; text-underline-offset: 3px; }
        #prerender ul, #prerender ol { padding-left: 1.4em; margin: 0 0 1em; }
        #prerender li { margin: 0.35em 0; }
        #prerender img, #prerender svg {
          display: block; max-width: 100%; height: auto;
          margin: 2em auto; border-radius: 14px;
        }
        #prerender code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          background: rgba(255,255,255,0.06); padding: 0.15em 0.4em;
          border-radius: 4px; font-size: 0.9em;
        }
        #prerender pre {
          background: #0a0a0a; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 1.1em 1.3em; overflow-x: auto;
          font-size: 0.85em; line-height: 1.55;
        }
        #prerender pre code { background: transparent; padding: 0; border-radius: 0; }
        #prerender blockquote {
          border-left: 2px solid rgba(222,219,200,0.25);
          padding: 0.2em 0 0.2em 1.2em;
          color: rgba(222,219,200,0.72); margin: 0 0 1em;
        }
        #prerender table { width: 100%; border-collapse: collapse; margin: 2em 0; font-size: 0.9em; }
        #prerender th, #prerender td { padding: 0.6em 0.9em; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left; }
        #prerender th { color: #DEDBC8; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.78em; }
        #prerender hr { border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 2em 0; }
      </style>
    </noscript>`

function injectHeadStyle(html) {
  if (html.includes('Prerendered content serves crawlers')) return html
  return html.replace(/<\/head>/i, `${PRERENDER_HIDE_STYLE}\n  </head>`)
}

function injectBody(html, mainHtml) {
  // Insert right after the SPA root
  return html.replace(
    /(<div id="root"[^>]*><\/div>)/,
    `$1\n    ${mainHtml}`,
  )
}

function postBodyHtml(post, { canonical, coverAbs, contentHtml }) {
  const tags = (post.tags || [])
    .map((t) => `<span>#${esc(t)}</span>`)
    .join(' ')
  return [
    '<main id="prerender">',
    '  <article>',
    `    <header>`,
    `      <p><a href="${esc(SITE_URL)}/">Lalit Moharana</a> &rarr; <a href="${esc(SITE_URL)}/#writing">Writing</a></p>`,
    `      <h1>${esc(post.title)}</h1>`,
    post.excerpt ? `      <p>${esc(post.excerpt)}</p>` : '',
    `      <p><time datetime="${esc(fmtDate(post.date))}">${esc(fmtDate(post.date))}</time>${tags ? ' &middot; ' + tags : ''}</p>`,
    coverAbs ? `      <img src="${esc(coverAbs)}" alt="${esc(post.title)}" />` : '',
    `    </header>`,
    `    ${contentHtml}`,
    `    <p><a href="${esc(canonical)}">Canonical URL</a></p>`,
    '  </article>',
    '</main>',
  ]
    .filter(Boolean)
    .join('\n    ')
}

function homepageBodyHtml(posts) {
  const items = posts
    .slice(0, 20)
    .map(
      (p) =>
        `      <li><a href="${esc(SITE_URL)}/post/${esc(p.slug)}">${esc(p.title)}</a> &mdash; <time datetime="${esc(fmtDate(p.date))}">${esc(fmtDate(p.date))}</time>${p.excerpt ? ` &mdash; ${esc(p.excerpt)}` : ''}</li>`,
    )
    .join('\n')
  return [
    '<main id="prerender">',
    '  <h1>Lalit Moharana - Builder of systems that think</h1>',
    `  <p>Independent engineer and CTO at StriveSteam. I build agentic AI, LLM infrastructure, and data-native platforms for messy, real-world data: emails, PDFs, SAP exports, social streams. Creator of OmniQuery, the Agent Platform, and an AI research newsletter. AWS Community Builder in Data Engineering (2025, 2026).</p>`,
    '  <h2>Recent writing</h2>',
    '  <ul>',
    items,
    '  </ul>',
    '  <h2>Sections</h2>',
    '  <ul>',
    `    <li><a href="${esc(SITE_URL)}/#about">About</a></li>`,
    `    <li><a href="${esc(SITE_URL)}/#projects">Projects</a></li>`,
    `    <li><a href="${esc(SITE_URL)}/#skills">Skills</a></li>`,
    `    <li><a href="${esc(SITE_URL)}/#engagements">Clients</a></li>`,
    `    <li><a href="${esc(SITE_URL)}/#writing">Writing</a></li>`,
    `    <li><a href="${esc(SITE_URL)}/#contact">Contact</a></li>`,
    '  </ul>',
    '</main>',
  ].join('\n    ')
}

/* ---------- main ---------- */

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('[prerender] dist/ does not exist - run vite build first')
    process.exit(1)
  }
  const shell = readShell()
  const posts = readPosts()

  if (posts.length === 0) {
    console.warn('[prerender] no posts in dist/posts/index.json, skipping')
    return
  }

  // Per-post HTML
  let written = 0
  for (const post of posts) {
    const mdxPath = path.join(DIST, 'posts', `${post.slug}.mdx`)
    if (!fs.existsSync(mdxPath)) {
      console.warn(`[prerender] missing MDX for ${post.slug}, skipping`)
      continue
    }
    const raw = fs.readFileSync(mdxPath, 'utf8')
    const { content } = parseFrontmatter(raw)
    const contentHtml = marked.parse(content)
    const canonical = `${SITE_URL}/post/${post.slug}`
    const coverAbs = post.cover
      ? post.cover.startsWith('http')
        ? post.cover
        : SITE_URL + post.cover
      : `${SITE_URL}/og.png`
    const excerpt = post.excerpt && post.excerpt.length > 0
      ? post.excerpt
      : toPlain(content, 240)

    let html = shell
    html = rewriteHead(html, post, { excerpt, canonical, coverAbs })
    html = injectJsonLd(html, articleJsonLd(post, { canonical, coverAbs }))
    html = injectHeadStyle(html)
    html = injectBody(
      html,
      postBodyHtml(post, { canonical, coverAbs, contentHtml }),
    )

    const outDir = path.join(DIST, 'post', post.slug)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)
    written += 1
  }

  // Homepage: augment the shell in place with a hidden crawler-visible list.
  let home = shell
  home = injectHeadStyle(home)
  home = injectBody(home, homepageBodyHtml(posts))
  fs.writeFileSync(path.join(DIST, 'index.html'), home)

  // 404 fallback for SPA on hosts that fall through unknown routes.
  fs.writeFileSync(path.join(DIST, '404.html'), home)

  // Netlify / Cloudflare Pages style redirects.
  fs.writeFileSync(path.join(DIST, '_redirects'), '/* /index.html 200\n')

  console.log(
    `[prerender] wrote ${written} per-post pages, augmented homepage + 404 fallback`,
  )
}

main()

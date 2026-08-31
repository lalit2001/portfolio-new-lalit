---
name: portfolio-blog
description: How Lalit's portfolio blog is architected, styled, and grown. Use whenever adding, editing, styling, debugging, or reasoning about blog posts, MDX rendering, cover art, prose CSS, the Writing section, the PostReader, or the WritingArchive.
---

# Portfolio blog system

The blog is a **runtime-rendered MDX pipeline**. Posts live either in `public/posts/` (local dev) or in a separate GitHub repo. There is no build step to publish - push a new `.mdx` and it appears within one refresh + cache TTL.

## Files that matter

| Path | Purpose |
| --- | --- |
| `src/config/blog.ts` | Single source of truth: source mode, GitHub owner/repo/branch/folder, cache TTL |
| `src/hooks/useBlogPosts.ts` | Fetches the manifest. Local: reads `index.json`. GitHub + autoIndex: lists via Contents API + parses YAML frontmatter |
| `src/hooks/useMdxPost.ts` | Fetches a single `.mdx`, strips frontmatter, `@mdx-js/mdx` `evaluate` with `remark-gfm` |
| `src/lib/frontmatter.ts` | Tiny YAML parser (scalars, quoted strings, `[a, b, c]` arrays, booleans, numbers) |
| `src/lib/cache.ts` | sessionStorage read/write with 5-minute TTL |
| `src/components/PostCard.tsx` | The card used everywhere (Writing homepage, Archive) |
| `src/components/PostReader.tsx` | Full-page fixed overlay. Lazy-loaded so MDX runtime does not ship with main bundle |
| `src/components/WritingArchive.tsx` | Full-page overlay listing every post, grouped by year, with search |
| `src/sections/Writing.tsx` | Homepage section. Shows top 5 posts + "View all N" CTA when there are more |
| `src/index.css` | `.prose-post` styles for MDX output (tables, images, code, blockquote, lists, headings) |
| `public/posts/index.json` | Local mode manifest |
| `public/posts/*.mdx` | Local mode posts |
| `public/posts/images/*.svg` | Cover art + inline figures |

## Config knobs (`src/config/blog.ts`)

```ts
BLOG_CONFIG = {
  source: 'local',              // 'local' | 'github'
  local:  { folder: '/posts' }, // relative to origin (Vite serves public/)
  github: {
    owner: 'lalit2001',
    repo:  'writing',
    branch: 'main',
    folder: 'posts',
    autoIndex: true,            // list folder via Contents API, no manual index.json
  },
  cacheTtlMs: 5 * 60 * 1000,
}
```

Flip `source` to `'github'` and posts start coming from `raw.githubusercontent.com`. With `autoIndex: true`, no `index.json` is required - the site walks the folder and reads frontmatter from each `.mdx`.

**Rate limits.** GitHub Contents API is 60/hr unauthenticated per IP. The session cache (5-min TTL) means one manifest fetch per visitor per 5 minutes. Fine for a portfolio; add an auth token if it ever becomes a problem.

## Post shape

### Local mode (`public/posts/index.json`)

Manual manifest. Each entry:

```json
{
  "slug": "my-post",
  "title": "My post",
  "date": "2026-08-30",
  "excerpt": "One-liner shown on the card.",
  "tags": ["agents", "mcp"],
  "cover": "/posts/images/my-post.svg"
}
```

Then `public/posts/my-post.mdx` is the body (no frontmatter needed in local mode, but including it is harmless - it will be stripped).

### GitHub mode (`autoIndex: true`)

No manifest. Every `.mdx` needs YAML frontmatter:

```mdx
---
title: My post
date: 2026-08-30
excerpt: One-liner shown on the card.
tags: [agents, mcp]
cover: /posts/images/my-post.svg
---

# Body starts here
```

Slug = filename without `.mdx`. Sort key = `date` (descending).

## Adding a new post - checklist

1. Pick a `slug-in-kebab-case`.
2. Add the file:
   - Local: create `public/posts/<slug>.mdx` AND add an entry to `public/posts/index.json`.
   - GitHub: push `<slug>.mdx` with frontmatter to the configured repo/folder.
3. If you want a cover, add an SVG at `public/posts/images/<slug>.svg` (or the equivalent path in the GitHub repo) and reference it in `cover:`.
4. Inline images/SVGs use the same folder pattern - `![alt](/posts/images/<name>.svg)`.
5. Refresh. New post appears in "Notes from the workbench." within one manifest cache TTL.

Nothing else to touch. No route to add, no import to update.

## Design context - global site tokens

The blog inherits the site design system. When making anything for a post, stay inside these tokens.

### Colors

- Background: `#000000` (page), `#0a0a0a` (deep tiles), `#0e0e0e` (elevated tiles), `#101010` (About card, some Footer surfaces).
- **Primary (cream)**: Tailwind `primary: #DEDBC8`. Also inline `#E1E0CC` in a few hero spots and `#F4F1DE` for the Hero name.
- Muted text: `text-gray-400`, `text-gray-500`; primary/70, primary/60, primary/40 for cream at reduced opacity.
- Ambient accents (used sparingly as radial glows):
  - Warm gold: `rgba(245, 195, 105, X)` - shows up in ProjectsGrid, Footer CTA, About top, and blog card fallback.
  - Sky blue: `#A9E9FB`
  - Mint green: `#88E7C2`
  - Warm butter: `#FED792`
  - Soft pink: `#FCD7ED` - used for the Writing section ambient tint (top center) and NL2SQL post cover.
  - Lavender: `#B8B4E0`
- Rings/borders: `ring-1 ring-white/[0.06]` for tiles, `border-white/[0.08]` for hairlines, `ring-white/[0.18]` on hover.

### Typography

Three fonts, all loaded in `index.html`:

- **Almarai** (300/400/700/800) - `font-family: 'Almarai', ...` set globally. Body sans.
- **Instrument Serif italic** - Tailwind `font-serif`. Used for tagline accents (`italic font-serif`) - e.g. "systems that think", "self-taught systems builder", "the workbench.", "for agentic AI", "when the problem is real."
- **Bodoni Moda** bold - Tailwind `font-display`. Used for display wordmarks (Hero "Lalit", Footer "Lalit Moharana"). High-contrast serif with dramatic thicks/thins.

Type scale for sections:
- Section eyebrow: `text-[10px] sm:text-xs tracking-[0.25em] uppercase text-primary/60`.
- Section H2 (Writing, Skills, About): `text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] font-medium tracking-tight` with a serif italic accent on the last word.
- Blog title (in reader): `text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight`.
- Body: `text-primary/70 text-sm md:text-base leading-relaxed`.

### Patterns that repeat

- **Radial cone from top or bottom** for section backdrops. Example: `radial-gradient(ellipse 70% 65% at 50% -3%, rgba(245, 195, 105, 0.55) 0%, ..., transparent 68%)`. Vary the palette per section but keep the geometry.
- **`.noise-overlay`** SVG turbulence layer at `opacity-30` to `opacity-40` with `mix-blend-screen` for film grain.
- **Card**: `bg-[#0e0e0e] ring-1 ring-white/[0.06] rounded-2xl`. Hover: `ring-white/[0.18]`.
- **Pill CTA**: cream primary button with a black circular ArrowUpRight capsule inside; hover expands the gap and scales the circle. See Hero "See the work" and Writing "View all N posts".

## Prose CSS (`.prose-post` in `src/index.css`)

Every MDX post is wrapped in `<div className="prose-post">`. The CSS handles all the tags:

| Tag | Styling |
| --- | --- |
| `h1..h4` | Cream, medium, tight tracking, ~2em top margin |
| `p` | `text-primary/82`, 1.7 line-height |
| `a` | Cream with 3px underline offset; underline brightens on hover |
| `strong` | Cream, weight 600 |
| `em` | **Instrument Serif italic** (font swap, not just italic) |
| `ul, ol, li` | Cream markers at 45% |
| `blockquote` | Left cream border, Instrument Serif italic body, 1.1em size |
| `code` (inline) | Monospace, subtle white bg, cream text |
| `pre code` | Dark tile bg, hairline border, 12px radius |
| `hr` | 1px white/8% |
| `img, svg` | 14px radius, hairline ring, deep soft shadow, centered with 2em vertical margin |
| `figcaption` OR `<em>` after image | Instrument Serif italic, centered, cream/60 |
| `table` | Rounded 14px, ring, big shadow. Header row has a subtle gold tint. Header cells are uppercase tracked labels. First column bolded. Row hover brightens. |

Everything is tuned for the dark palette. Nothing needs `!important` or scoped overrides.

## Cover art conventions

Covers live in `public/posts/images/*.svg` (or the GitHub equivalent). They render at 16:10 on cards and 16:9 in the reader, both `object-cover`.

Rules that make covers feel native:

- **Base**: `#0a0a0a` rectangle at full canvas.
- **A single radial gradient** in the post's dominant palette accent, positioned to feel like light from an edge (bottom-up cone, side-in glow, or top-down wash).
- **Sparse geometric or typographic content** - concentric rings, floating documents, monospace snippets, glyph fragments. Match the topic without being literal.
- **`feTurbulence` noise filter** at ~0.04 alpha at the end so the SVG gets the same grain as the rest of the site.
- **Cream `#DEDBC8` at 0.35 to 0.55 opacity** for structural lines and outlines.

Look at the three existing covers as templates:
- `mcp-pooling.svg` - three nodes + connector lines, gold cone.
- `self-rag.svg` - three overlapping document rectangles with highlighted lines, sky/mint tint, retrieval halo at bottom.
- `nl2sql.svg` - monospace SQL fading into an italic serif quote, pink accent underline.

Do not import raster photos as covers - they will look out of place. Everything cinematic on this site is either video or SVG.

## Growth - pagination and archive

The Writing homepage shows **only the top 3 posts** (`HOMEPAGE_LIMIT = 3` in `Writing.tsx`). When there are more:

- The bottom of the Writing section shows a pill CTA: "View all N posts".
- Clicking sets `#writing/all` in the URL.
- A lazy-loaded **`WritingArchive`** overlay opens (fixed inset-0, `z-70`, body-scroll-locked, escape closes).
- Archive shows all posts **grouped by year** with a header per year and a section divider.
- A search input filters across title, excerpt, and tags in real time.
- Clicking a card from the archive opens `PostReader` (`z-80`, on top of the archive). Closing the reader returns you to the archive (via `#writing/all` hash), not the homepage.
- Escape at the archive level or clicking the X returns to `#writing`.

Both `WritingArchive` and `PostReader` are **lazy-loaded** (`React.lazy` + `Suspense`), so the main bundle stays under 100 kB gz. Only opening either downloads its chunk.

If posts grow past ~50 and search alone stops being enough, add:
- Tag chips at the top of the archive that filter grouped view.
- A pinned "recent 10" row above the year sections.
- Server-side pagination (fetch older years on scroll) - would need a real backend or a per-year manifest.

Do not paginate the *homepage* with a "Load more" that just appends inline - it fights the section rhythm of the rest of the site. The archive-as-fullscreen-overlay pattern matches how PostReader works and keeps the homepage compact.

## URL scheme (hash-based, no router)

- `#about`, `#projects`, `#skills`, `#writing`, `#contact` - anchor to sections.
- `#writing/all` - opens the archive overlay.
- `#post/<slug>` - opens the reader for that post.

`Writing.tsx` listens for `hashchange` and reconciles overlay state on every change (including back/forward buttons). Deep links are shareable: `https://.../#post/mcp-connector-pooling` opens the reader immediately after the manifest loads.

## Caching + freshness

- All fetches use `cache: 'no-store'` at the HTTP layer.
- Manifest cached in sessionStorage under `blog:manifest:<source>` for 5 minutes.
- Each post source cached under `blog:post:<slug>` for 5 minutes.
- `raw.githubusercontent.com` has its own ~5-minute CDN cache. Combined worst-case: a new post shows up ~10 minutes after push, usually sooner.
- Hard-refresh always bypasses sessionStorage TTL check because the app re-initializes.

If you need faster propagation, drop `cacheTtlMs` to 60s. Do not add a webhook or ISR for this scale of blog.

## SEO

- `document.title` swaps to the post title while a reader is open, then restores.
- `index.html` head has full OG + Twitter Card + JSON-LD Person schema for the homepage.
- **Per-post OG images and canonical URLs are not wired yet** (would need SSR or a build-time prerender). If it matters, add a small `og-image.png` per post + a Vite prerender plugin later.

## Importing from Medium

Medium's RSS at `https://medium.com/feed/@<username>` returns the ~10 most recent public posts (member-only stories are excluded). To bulk-import:

1. `curl -s https://medium.com/feed/@lalitmaharana2001 > /tmp/medium.rss`
2. Parse each `<item>` with Python (regex on `<content:encoded><![CDATA[...]]>`).
3. Pre-process the HTML: convert `<pre>...<br>...</pre>` blocks into fenced Python code by inlining `<br>` as real newlines and wrapping in `<code class="language-python">`. Medium's default `<pre>` markup does not survive pandoc otherwise.
4. Run `pandoc -f html -t gfm --wrap=none` per post.
5. Post-process the markdown: strip pandoc backslash escapes, replace `<figure><img src=X/></figure>` with `![](X)`, dedupe blank lines, drop the auto-emitted `# Title` (frontmatter title supersedes).
6. Download every `cdn-images-1.medium.com` URL locally with `curl -sSL` (Python urllib fails on macOS SSL). Rewrite the image `src`s in the MDX to `/posts/images/<slug>-hero.png` etc.
7. Write MDX with frontmatter (title, date from `<pubDate>` parsed via `email.utils.parsedate_to_datetime`, tags from `<category>` CDATA, cover pointing to the generated SVG).
8. Generate a cover SVG per post via one of the templates in the script (`grid`, `flow`, `pipes`, `constellation`, `code`) using an accent color from the site palette (`#88E7C2`, `#FED792`, `#A9E9FB`, `#FCD7ED`, `#DEDBC8`).
9. Sort the resulting manifest by date descending and write `public/posts/index.json`.

The ingest scripts used the first time live at `/tmp/ingest-medium.py` and `/tmp/download-images.py` - not committed to the repo (they were one-shot). If this needs to become recurring, move them to `scripts/` and wire a GitHub Actions cron.

## Debugging tips

- **Post not appearing**: check the fetch URL in devtools Network. Local mode expects `/posts/index.json` and `/posts/<slug>.mdx` under the site origin. If either 404s, `EmptyState` renders in Writing.
- **MDX fails to render**: `useMdxPost` returns an `error` string; the reader shows a red banner with the error. Usually a syntax issue in the `.mdx` (unclosed JSX, bad expression). `@mdx-js/mdx` errors are pretty specific.
- **Frontmatter not parsed**: the parser is intentionally minimal. Nested objects and multi-line values do not work. Stick to `key: value` pairs and inline arrays. If you need more, upgrade to `gray-matter`.
- **Rate-limit banner from GitHub API**: means `autoIndex` hit the 60/hr limit. Wait or add a `Authorization: token <PAT>` header in `useBlogPosts.ts::fetchGitHubManifest`.
- **Archive not opening from hash on cold load**: `applyHash()` runs when posts finish loading, so deep links wait for the manifest.
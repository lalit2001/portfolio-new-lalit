import { useEffect } from 'react'
import { BlogPostMeta } from '../config/blog'

/**
 * While a blog post is open, swap the page-level SEO metadata so the URL
 * `#post/<slug>` looks like a real article to Google / social crawlers:
 *
 *  - Title, description
 *  - canonical <link>
 *  - Open Graph + Twitter tags
 *  - BlogPosting JSON-LD
 *
 * On unmount everything reverts to whatever was in the document before,
 * preserving the site-level defaults from index.html.
 */
export function usePostSeo(post: BlogPostMeta | null) {
  useEffect(() => {
    if (!post) return

    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://lalitm.in'
    const url = `${origin}/#post/${post.slug}`
    const cover = post.cover
      ? post.cover.startsWith('http')
        ? post.cover
        : `${origin}${post.cover}`
      : `${origin}/og.png`
    const description =
      post.excerpt ?? `Notes by Lalit Moharana on ${post.tags?.join(', ')}.`

    const revert: Array<() => void> = []

    const setMeta = (
      selector: string,
      attr: 'name' | 'property',
      key: string,
      value: string,
    ) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector)
      const created = !el
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      const prev = el.getAttribute('content')
      el.setAttribute('content', value)
      revert.push(() => {
        if (created) el!.remove()
        else if (prev !== null) el!.setAttribute('content', prev)
      })
    }

    // Title
    const prevTitle = document.title
    document.title = `${post.title} - Lalit Moharana`
    revert.push(() => {
      document.title = prevTitle
    })

    // Canonical
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    const canonicalCreated = !canonical
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    const prevCanonical = canonical.getAttribute('href')
    canonical.setAttribute('href', url)
    revert.push(() => {
      if (canonicalCreated) canonical!.remove()
      else if (prevCanonical !== null) canonical!.setAttribute('href', prevCanonical)
    })

    // Standard meta
    setMeta('meta[name="description"]', 'name', 'description', description)

    // Open Graph
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'article')
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:title"]', 'property', 'og:title', post.title)
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      description,
    )
    setMeta('meta[property="og:image"]', 'property', 'og:image', cover)
    setMeta(
      'meta[property="article:author"]',
      'property',
      'article:author',
      'Lalit Moharana',
    )
    if (post.date) {
      setMeta(
        'meta[property="article:published_time"]',
        'property',
        'article:published_time',
        new Date(post.date).toISOString(),
      )
    }
    if (post.tags?.length) {
      // Remove any previous article:tag entries we added
      const existing = document.head.querySelectorAll(
        'meta[property="article:tag"]',
      )
      existing.forEach((el) => el.remove())
      post.tags.forEach((tag) => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'article:tag')
        el.setAttribute('content', tag)
        document.head.appendChild(el)
        revert.push(() => el.remove())
      })
    }

    // Twitter
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', post.title)
    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      description,
    )
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', cover)

    // JSON-LD BlogPosting
    const jsonLd = document.createElement('script')
    jsonLd.type = 'application/ld+json'
    jsonLd.dataset.postSlug = post.slug
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      image: cover,
      datePublished: post.date
        ? new Date(post.date).toISOString()
        : undefined,
      dateModified: post.date
        ? new Date(post.date).toISOString()
        : undefined,
      author: { '@type': 'Person', '@id': `${origin}/#person` },
      publisher: { '@type': 'Person', '@id': `${origin}/#person` },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      url,
      keywords: post.tags?.join(', '),
      inLanguage: 'en',
    })
    document.head.appendChild(jsonLd)
    revert.push(() => jsonLd.remove())

    return () => {
      // Revert in reverse order so wrapper mutations unwind cleanly.
      for (let i = revert.length - 1; i >= 0; i--) revert[i]()
    }
  }, [post])
}
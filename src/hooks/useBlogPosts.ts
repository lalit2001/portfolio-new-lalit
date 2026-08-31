import { useEffect, useState } from 'react'
import {
  manifestUrl,
  contentsApiUrl,
  BlogPostMeta,
  BLOG_CONFIG,
} from '../config/blog'
import { parseFrontmatter } from '../lib/frontmatter'
import { readCache, writeCache } from '../lib/cache'

interface State {
  posts: BlogPostMeta[]
  loading: boolean
  error: string | null
}

interface GhFile {
  name: string
  type: string
  download_url: string
}

function sortByDateDesc(list: BlogPostMeta[]): BlogPostMeta[] {
  return [...list].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

async function fetchLocalManifest(): Promise<BlogPostMeta[]> {
  const res = await fetch(manifestUrl(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Manifest HTTP ${res.status}`)
  return (await res.json()) as BlogPostMeta[]
}

async function fetchGitHubManifest(): Promise<BlogPostMeta[]> {
  if (!BLOG_CONFIG.github.autoIndex) {
    return fetchLocalManifest()
  }
  const listRes = await fetch(contentsApiUrl(), {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!listRes.ok) throw new Error(`GitHub API HTTP ${listRes.status}`)
  const files = (await listRes.json()) as GhFile[]
  const mdxFiles = files.filter(
    (f) => f.type === 'file' && f.name.endsWith('.mdx'),
  )
  const posts = await Promise.all(
    mdxFiles.map(async (f) => {
      const raw = await fetch(f.download_url).then((r) => r.text())
      const { data } = parseFrontmatter(raw)
      return {
        slug: f.name.replace(/\.mdx$/, ''),
        title: (data.title as string) ?? f.name,
        date: (data.date as string) ?? '',
        excerpt: data.excerpt as string | undefined,
        tags: data.tags as string[] | undefined,
        cover: data.cover as string | undefined,
      } as BlogPostMeta
    }),
  )
  return posts
}

const CACHE_KEY = `blog:manifest:${BLOG_CONFIG.source}`

export function useBlogPosts(): State {
  const [state, setState] = useState<State>(() => {
    const cached = readCache<BlogPostMeta[]>(CACHE_KEY)
    if (cached) return { posts: cached, loading: false, error: null }
    return { posts: [], loading: true, error: null }
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const posts =
          BLOG_CONFIG.source === 'github'
            ? await fetchGitHubManifest()
            : await fetchLocalManifest()
        if (cancelled) return
        const sorted = sortByDateDesc(posts)
        writeCache(CACHE_KEY, sorted)
        setState({ posts: sorted, loading: false, error: null })
      } catch (err) {
        if (cancelled) return
        setState((s) => ({
          posts: s.posts,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load posts',
        }))
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

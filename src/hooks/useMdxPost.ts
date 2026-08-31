import { useEffect, useState, ComponentType } from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import { postUrl } from '../config/blog'
import { readCache, writeCache } from '../lib/cache'
import { parseFrontmatter } from '../lib/frontmatter'

interface State {
  Content: ComponentType | null
  loading: boolean
  error: string | null
}

export function useMdxPost(slug: string | null): State {
  const [state, setState] = useState<State>({
    Content: null,
    loading: !!slug,
    error: null,
  })

  useEffect(() => {
    if (!slug) {
      setState({ Content: null, loading: false, error: null })
      return
    }

    let cancelled = false
    setState({ Content: null, loading: true, error: null })

    async function load() {
      try {
        const cacheKey = `blog:post:${slug}`
        let source = readCache<string>(cacheKey)
        if (source === null) {
          const res = await fetch(postUrl(slug!), { cache: 'no-store' })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          source = await res.text()
          writeCache(cacheKey, source)
        }
        const { content } = parseFrontmatter(source)
        const evaluated = await evaluate(content, {
          ...(runtime as unknown as Parameters<typeof evaluate>[1]),
          remarkPlugins: [remarkGfm],
        })
        if (cancelled) return
        setState({
          Content: evaluated.default as ComponentType,
          loading: false,
          error: null,
        })
      } catch (err) {
        if (cancelled) return
        setState({
          Content: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load post',
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return state
}

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { BlogPostMeta } from '../config/blog'
import { PostCard } from './PostCard'

interface Props {
  posts: BlogPostMeta[]
  onClose: () => void
  onOpenPost: (p: BlogPostMeta) => void
}

function groupByYear(posts: BlogPostMeta[]): Record<string, BlogPostMeta[]> {
  const out: Record<string, BlogPostMeta[]> = {}
  posts.forEach((p) => {
    const y = p.date ? new Date(p.date).getFullYear().toString() : 'Undated'
    out[y] = out[y] ?? []
    out[y].push(p)
  })
  return out
}

export function WritingArchive({ posts, onClose, onOpenPost }: Props) {
  const [q, setQ] = useState('')

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const filtered = useMemo(() => {
    if (!q.trim()) return posts
    const needle = q.trim().toLowerCase()
    return posts.filter((p) => {
      const hay = [p.title, p.excerpt, ...(p.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(needle)
    })
  }, [posts, q])

  const grouped = useMemo(() => groupByYear(filtered), [filtered])
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md overflow-y-auto"
      >
        <div className="sticky top-0 z-30 bg-black/85 backdrop-blur-md border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 md:py-5 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <span className="text-primary/60 text-[10px] tracking-[0.25em] uppercase">
                Writing
              </span>
              <span className="text-primary text-lg md:text-xl font-medium tracking-tight">
                All posts{' '}
                <span className="text-primary/40 text-sm font-normal">
                  ({posts.length})
                </span>
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-primary flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-5 md:px-10 pb-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title, excerpt, or tag"
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/[0.2] rounded-full pl-9 pr-4 py-2 text-sm text-primary placeholder-primary/40 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-16"
        >
          {filtered.length === 0 ? (
            <div className="text-primary/50 text-sm py-16 text-center">
              No posts match "{q}".
            </div>
          ) : (
            years.map((year) => (
              <section key={year} className="mb-14 md:mb-20">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="text-primary text-2xl md:text-3xl font-medium tracking-tight">
                    {year}
                  </div>
                  <div className="text-primary/40 text-xs tracking-[0.25em] uppercase">
                    {grouped[year].length}{' '}
                    {grouped[year].length === 1 ? 'post' : 'posts'}
                  </div>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {grouped[year].map((p, i) => (
                    <PostCard
                      key={p.slug}
                      post={p}
                      onOpen={onOpenPost}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

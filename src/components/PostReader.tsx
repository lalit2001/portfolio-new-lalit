import { useEffect } from 'react'
import { X, ExternalLink, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMdxPost } from '../hooks/useMdxPost'
import { BlogPostMeta, postUrl } from '../config/blog'

interface Props {
  post: BlogPostMeta
  onBack: () => void
}

export function PostReader({ post, onBack }: Props) {
  const { Content, loading, error } = useMdxPost(post.slug)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onBack])

  useEffect(() => {
    const prev = document.title
    document.title = `${post.title} — Lalit Moharana`
    return () => {
      document.title = prev
    }
  }, [post.title])

  return (
    <AnimatePresence>
      <motion.div
        key={post.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onBack()
        }}
      >
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-3xl min-h-screen bg-[#0a0a0a] md:my-10 md:min-h-0 md:rounded-3xl md:ring-1 md:ring-white/[0.06] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 md:px-8 py-3 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/[0.05]">
            <div className="text-primary/60 text-[10px] tracking-[0.25em] uppercase truncate">
              Writing / {post.slug}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={postUrl(post.slug)}
                target="_blank"
                rel="noreferrer"
                aria-label="View source"
                className="inline-flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors text-xs px-2 py-1 rounded-md hover:bg-white/[0.04]"
              >
                Source
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onBack}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-primary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {post.cover && (
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <img
                src={post.cover}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
            </div>
          )}

          <header className="px-6 md:px-12 pt-10 md:pt-14 pb-8">
            <div className="text-primary/60 text-[10px] tracking-[0.25em] uppercase mb-4">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <h1 className="text-primary text-3xl sm:text-4xl md:text-5xl leading-[1.05] font-medium tracking-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-primary/70 text-base md:text-lg leading-relaxed">
                {post.excerpt}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] tracking-wide px-2 py-0.5 rounded-full border border-white/[0.08] text-primary/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="px-6 md:px-12 pb-20 md:pb-28">
            <div className="prose-post">
              {loading && (
                <div className="flex items-center gap-2 text-primary/60 text-sm py-12">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading post...
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5 text-sm text-red-200/80">
                  Couldn&apos;t load this post - {error}. Check that{' '}
                  <code className="text-red-200">{post.slug}.mdx</code> exists
                  in the configured repo.
                </div>
              )}
              {Content && <Content />}
            </div>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  )
}

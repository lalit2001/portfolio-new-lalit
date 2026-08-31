import { useState, useEffect, lazy, Suspense, useCallback } from 'react'
import { ArrowUpRight, BookOpen, Loader2 } from 'lucide-react'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle'
import { PostCard } from '../components/PostCard'
import { BLOG_CONFIG, BlogPostMeta, sourceRepoUrl } from '../config/blog'

const PostReader = lazy(() =>
  import('../components/PostReader').then((m) => ({ default: m.PostReader })),
)
const WritingArchive = lazy(() =>
  import('../components/WritingArchive').then((m) => ({
    default: m.WritingArchive,
  })),
)

const HOMEPAGE_LIMIT = 3

function readHash(): { archive: boolean; slug: string | null } {
  const h = window.location.hash
  if (h === '#writing/all') return { archive: true, slug: null }
  const m = h.match(/^#post\/([\w-]+)$/)
  return { archive: false, slug: m ? m[1] : null }
}

function EmptyState({ error }: { error: string | null }) {
  return (
    <div className="rounded-2xl bg-[#0e0e0e] ring-1 ring-white/[0.06] p-8 md:p-12 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/60 mb-5">
        <BookOpen className="w-5 h-5" />
      </div>
      <div className="text-primary text-lg md:text-xl mb-2">
        Nothing published yet.
      </div>
      <p className="text-primary/60 text-sm max-w-md mx-auto leading-relaxed">
        {BLOG_CONFIG.source === 'local' ? (
          <>
            Drop MDX files into{' '}
            <code className="text-primary/80">public/posts/</code> and list
            them in{' '}
            <code className="text-primary/80">public/posts/index.json</code>.
          </>
        ) : (
          <>
            Posts render from{' '}
            <code className="text-primary/80">
              github.com/{BLOG_CONFIG.github.owner}/{BLOG_CONFIG.github.repo}
            </code>
            . New MDX files with YAML frontmatter are picked up automatically.
          </>
        )}
      </p>
      {error && (
        <div className="mt-5 text-xs text-primary/40">Fetch error: {error}</div>
      )}
    </div>
  )
}

export function Writing() {
  const { posts, loading, error } = useBlogPosts()
  const [active, setActive] = useState<BlogPostMeta | null>(null)
  const [archiveOpen, setArchiveOpen] = useState(false)

  const applyHash = useCallback(() => {
    const { archive, slug } = readHash()
    setArchiveOpen(archive)
    if (slug) {
      const found = posts.find((p) => p.slug === slug)
      setActive(found ?? null)
    } else {
      setActive(null)
    }
  }, [posts])

  useEffect(() => {
    applyHash()
  }, [applyHash])

  useEffect(() => {
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [applyHash])

  const openPost = (p: BlogPostMeta) => {
    setActive(p)
    history.pushState(null, '', `#post/${p.slug}`)
  }

  const closePost = () => {
    setActive(null)
    if (archiveOpen) {
      history.pushState(null, '', '#writing/all')
    } else if (window.location.hash.startsWith('#post/')) {
      history.pushState(null, '', '#writing')
    }
  }

  const openArchive = () => {
    setArchiveOpen(true)
    history.pushState(null, '', '#writing/all')
  }

  const closeArchive = () => {
    setArchiveOpen(false)
    history.pushState(null, '', '#writing')
  }

  const visible = posts.slice(0, HOMEPAGE_LIMIT)
  const hasMore = posts.length > HOMEPAGE_LIMIT

  return (
    <section
      id="writing"
      className="relative bg-black py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(252, 215, 237, 0.08) 0%, rgba(184, 180, 224, 0.04) 30%, transparent 60%)',
        }}
      />
      <div className="noise-overlay opacity-25 mix-blend-screen pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-14 md:mb-20">
          <div className="text-primary/60 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4">
            Writing
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] font-medium tracking-tight max-w-3xl">
              <WordsPullUpMultiStyle
                justify="start"
                segments={[
                  { text: 'Notes from', className: 'text-primary' },
                  {
                    text: 'the workbench.',
                    className: 'italic font-serif text-primary',
                  },
                ]}
              />
            </h2>
            {BLOG_CONFIG.source === 'github' && (
              <a
                href={sourceRepoUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors text-sm"
              >
                All posts on GitHub
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-primary/60 text-sm py-12">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <EmptyState error={error} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {visible.map((p, i) => (
                <PostCard key={p.slug} post={p} onOpen={openPost} index={i} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-primary/50 text-sm">
                  Showing {visible.length} of {posts.length}. Older writing sits
                  in the archive.
                </p>
                <button
                  type="button"
                  onClick={openArchive}
                  className="group inline-flex items-center gap-2 bg-primary text-black rounded-full pl-5 pr-1.5 py-1.5 font-medium text-sm hover:gap-3 transition-all"
                >
                  View all {posts.length} posts
                  <span className="bg-black rounded-full w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowUpRight
                      className="w-4 h-4"
                      style={{ color: '#E1E0CC' }}
                    />
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {archiveOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center text-primary/60 text-sm">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading archive...
            </div>
          }
        >
          <WritingArchive
            posts={posts}
            onClose={closeArchive}
            onOpenPost={openPost}
          />
        </Suspense>
      )}

      {active && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center text-primary/60 text-sm">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading reader...
            </div>
          }
        >
          <PostReader post={active} onBack={closePost} />
        </Suspense>
      )}
    </section>
  )
}

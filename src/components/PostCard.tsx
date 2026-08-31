import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { BlogPostMeta } from '../config/blog'

interface Props {
  post: BlogPostMeta
  onOpen: (p: BlogPostMeta) => void
  index?: number
}

export function PostCard({ post, onOpen, index = 0 }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(post)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: Math.min(index, 8) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col text-left rounded-2xl bg-[#0e0e0e] ring-1 ring-white/[0.06] hover:ring-white/[0.18] transition-all overflow-hidden"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-black">
        {post.cover ? (
          <img
            src={post.cover}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 90% at 50% 110%, rgba(245,195,105,0.35) 0%, rgba(220,160,70,0.15) 30%, transparent 65%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />

        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-black/50 text-primary/80 backdrop-blur-[3px] border border-white/[0.12]"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="text-primary/50 text-[10px] tracking-[0.25em] uppercase">
            {post.date
              ? new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '-'}
          </div>
          <div className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-primary/70 group-hover:text-primary group-hover:border-white/[0.28] transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>

        <h3 className="text-primary text-lg md:text-xl leading-tight mb-3">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-primary/60 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>
    </motion.button>
  )
}

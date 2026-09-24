import { useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'

/**
 * PortraitReveal
 * ----------------------------------------------------------------------
 * Scroll-driven "portrait reveal" section (the effect in the reference video):
 *   - portrait starts small, grayscale and tilted in 3D
 *   - as you scroll it grows, un-tilts and colorises, then pins centre-stage
 *   - copy on the left and right blurs in, word by word, as it settles
 *
 * Drop it right after the hero:  <Hero /> <PortraitReveal /> <About />
 * Colours / type match the site: black, #DEDBC8 cream, Almarai + Instrument Serif.
 */

interface Cta {
  label: string
  href: string
}

interface Props {
  src: string
  alt?: string
  eyebrow?: string
  /** first line, plain */
  greeting?: string
  /** second line, serif italic */
  tagline?: string
  /** right column paragraph — revealed word by word */
  paragraph?: string
  ctas?: Cta[]
  /** total scroll length of the section, in viewport heights */
  scrollHeight?: number
}

export function PortraitReveal({
  src,
  alt = 'Portrait',
  eyebrow = 'Data · AI · Systems',
  greeting = "Hi, I'm Lalit",
  tagline = 'a self-taught systems builder.',
  paragraph = 'I turn messy, unstructured, real-world data — emails, PDFs, SAP exports, social streams — into agentic infrastructure that scales. Five-plus years shipping data and AI systems across Life Sciences, Automotive and Fintech.',
  ctas = [
    { label: 'Get in touch', href: '#contact' },
    { label: 'View projects', href: '#projects' },
  ],
  scrollHeight = 2.4,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // 0 → section top hits viewport top, 1 → section bottom hits viewport bottom
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /* ---------------- portrait ---------------- */
  const p = scrollYProgress
  const scale = useTransform(p, [0, 0.55], reduce ? [1, 1] : [0.36, 1])
  const rotateY = useTransform(p, [0, 0.55], reduce ? [0, 0] : [-34, 0])
  const rotateZ = useTransform(p, [0, 0.55], reduce ? [0, 0] : [-7, 0])
  const y = useTransform(p, [0, 0.55], reduce ? ['0vh', '0vh'] : ['-14vh', '0vh'])
  const gray = useTransform(p, [0.12, 0.58], reduce ? [0, 0] : [1, 0])
  const contrast = useTransform(p, [0.12, 0.58], [1.15, 1])
  const filter = useMotionTemplate`grayscale(${gray}) contrast(${contrast})`
  const radius = useTransform(p, [0, 0.55], [14, 28])
  const glow = useTransform(p, [0.3, 0.7], [0, 1])
  // Static box-shadow. The animated red glow lives on a sibling div
  // driven by opacity only — much cheaper than re-stringing box-shadow
  // per frame.
  const shadow =
    '0 40px 90px -30px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.06)'

  /* ---------------- side copy ---------------- */
  const leftOpacity = useTransform(p, [0.48, 0.68], [0, 1])
  const leftX = useTransform(p, [0.48, 0.68], reduce ? [0, 0] : [-28, 0])
  const leftBlur = useTransform(p, [0.48, 0.68], reduce ? [0, 0] : [14, 0])
  const leftFilter = useMotionTemplate`blur(${leftBlur}px)`

  const rightOpacity = useTransform(p, [0.56, 0.74], [0, 1])
  const rightX = useTransform(p, [0.56, 0.74], reduce ? [0, 0] : [28, 0])

  const ctaOpacity = useTransform(p, [0.8, 0.92], [0, 1])
  const ctaY = useTransform(p, [0.8, 0.92], reduce ? [0, 0] : [12, 0])

  const hintOpacity = useTransform(p, [0, 0.12], [1, 0])

  return (
    <section
      ref={ref}
      id="about"
      className="relative bg-black"
      style={{ height: `${scrollHeight * 100}vh` }}
    >
      {/* pinned stage */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ambient */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(224,60,60,.10) 0%, transparent 65%)',
          }}
        />
        <div className="noise-overlay opacity-20 mix-blend-screen pointer-events-none" />

        {/* scroll hint while the portrait is still small */}
        <motion.div
          aria-hidden
          style={{ opacity: hintOpacity }}
          className="absolute left-1/2 -translate-x-1/2 bottom-10 text-[10px] tracking-[0.3em] uppercase text-[#DEDBC8]/40"
        >
          scroll
        </motion.div>

        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-14">
          {/* ---------- left ---------- */}
          <motion.div
            style={{ opacity: leftOpacity, x: leftX, filter: leftFilter }}
            className="order-2 lg:order-1 lg:text-right"
          >
            <div className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#DEDBC8]/55 mb-4">
              {eyebrow}
            </div>
            <h2 className="text-[#DEDBC8] font-medium tracking-tight leading-[1.02] text-4xl sm:text-5xl lg:text-[3.4rem]">
              {greeting}
              <span className="block italic font-serif font-normal text-[#DEDBC8]/90">
                {tagline}
              </span>
            </h2>
          </motion.div>

          {/* ---------- portrait ---------- */}
          <div
            className="order-1 lg:order-2 justify-self-center relative"
            style={{ perspective: 1400 }}
          >
            {/* Cheap red glow — opacity-only. Sits under the portrait. */}
            <motion.div
              aria-hidden
              style={{ opacity: glow }}
              className="absolute inset-0 -m-10 rounded-[40px] pointer-events-none"
            >
              <div
                className="w-full h-full rounded-[40px]"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(224,60,60,0.35), transparent 70%)',
                  filter: 'blur(24px)',
                }}
              />
            </motion.div>

            <motion.div
              style={{
                scale,
                rotateY,
                rotateZ,
                y,
                filter,
                borderRadius: radius,
                boxShadow: shadow,
                transformStyle: 'preserve-3d',
              }}
              className="relative overflow-hidden w-[62vw] max-w-[340px] lg:w-[26vw] lg:max-w-[400px] aspect-[3/4] bg-[#0e0e0e] will-change-transform"
            >
              <img
                src={src}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              {/* glass sheen */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(120deg, rgba(255,255,255,.10) 0%, transparent 35%, transparent 70%, rgba(255,255,255,.04) 100%)',
                }}
              />
            </motion.div>
          </div>

          {/* ---------- right ---------- */}
          <motion.div
            style={{ opacity: rightOpacity, x: rightX }}
            className="order-3 max-w-md"
          >
            <p className="text-[#DEDBC8]/85 text-base sm:text-lg leading-relaxed">
              <RevealWords text={paragraph} progress={p} start={0.58} end={0.98} />
            </p>

            <motion.div
              style={{ opacity: ctaOpacity, y: ctaY }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {ctas.map((c, i) => (
                <a
                  key={c.label}
                  href={c.href}
                  className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors ${
                    i === 0
                      ? 'bg-[#DEDBC8] text-black hover:bg-white'
                      : 'text-[#DEDBC8] ring-1 ring-white/15 hover:ring-white/40'
                  }`}
                >
                  {c.label}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Word-by-word blur reveal driven by scroll progress                 */
/* ---------------------------------------------------------------- */
function RevealWords({
  text,
  progress,
  start,
  end,
}: {
  text: string
  progress: MotionValue<number>
  start: number
  end: number
}) {
  const words = text.split(' ')
  const step = (end - start) / words.length
  return (
    <>
      {words.map((w, i) => {
        const s = start + i * step
        return (
          <Word
            key={i}
            progress={progress}
            range={[s, Math.min(s + step * 2.2, end)]}
          >
            {w}
          </Word>
        )
      })}
    </>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}) {
  const reduce = useReducedMotion()
  const opacity = useTransform(progress, range, [0.12, 1])
  const y = useTransform(progress, range, reduce ? [0, 0] : [6, 0])
  // Small blur radius keeps the paint cost per word affordable across
  // 80+ spans; larger values (7-14px) tank frame rate on Retina.
  const blur = useTransform(progress, range, reduce ? [0, 0] : [4, 0])
  const filter = useMotionTemplate`blur(${blur}px)`
  return (
    <motion.span style={{ opacity, y, filter }} className="inline-block mr-[0.3em]">
      {children}
    </motion.span>
  )
}

export default PortraitReveal

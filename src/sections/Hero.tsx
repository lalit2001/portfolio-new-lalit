import { motion } from 'framer-motion'
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { WordsPullUp } from '../components/WordsPullUp'

const NAV: { label: string; href: string }[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
]

const CHIPS = [
  { label: 'CTO · StriveSteam' },
  { label: 'AWS Community Builder' },
  { label: 'Agentic AI · Data · Cloud' },
  { label: 'Gurugram', icon: MapPin },
]

const REVERSE_STEP = 1 / 25

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    let direction: 'forward' | 'backward' = 'forward'
    let seeking = false
    let raf = 0
    let cancelled = false

    const onSeeked = () => {
      seeking = false
    }

    const reverseStep = () => {
      if (cancelled || direction !== 'backward') return
      if (seeking) {
        raf = requestAnimationFrame(reverseStep)
        return
      }
      const next = v.currentTime - REVERSE_STEP
      if (next <= 0.02) {
        direction = 'forward'
        v.currentTime = 0
        v.play().catch(() => {})
        return
      }
      seeking = true
      v.currentTime = next
      raf = requestAnimationFrame(reverseStep)
    }

    const onEnded = () => {
      direction = 'backward'
      v.pause()
      seeking = false
      raf = requestAnimationFrame(reverseStep)
    }

    v.addEventListener('ended', onEnded)
    v.addEventListener('seeked', onSeeked)
    v.play().catch(() => {})

    return () => {
      cancelled = true
      v.removeEventListener('ended', onEnded)
      v.removeEventListener('seeked', onSeeked)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="h-screen w-full p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero.mp4"
        />

        <div className="noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/85 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-[70vw] h-[55vh] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 100%, rgba(245, 195, 105, 0.18) 0%, rgba(220, 160, 70, 0.08) 30%, transparent 60%)',
          }}
        />

        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-[220px] md:w-[300px] pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, transparent 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-0 w-[420px] h-[280px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 55%, transparent 80%)',
          }}
        />

        <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 md:py-3 flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-[10px] sm:text-xs md:text-sm text-primary/80 hover:text-primary transition-colors"
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1 h-px bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-6 md:pb-10 z-10">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-display font-bold text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] leading-[0.85] tracking-[-0.04em]"
                style={{
                  color: '#F4F1DE',
                  textShadow:
                    '0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.35)',
                }}
              >
                <WordsPullUp text="Lalit" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 pb-4 lg:pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-1.5"
              >
                {CHIPS.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary/90 bg-black/30 backdrop-blur-[3px]"
                  >
                    {chip.icon ? (
                      <chip.icon className="w-3 h-3 opacity-80" />
                    ) : (
                      <span
                        aria-hidden
                        className="w-1 h-1 rounded-full bg-primary/70"
                      />
                    )}
                    {chip.label}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary/85 text-sm sm:text-base md:text-lg"
                style={{ lineHeight: 1.35 }}
              >
                Independent engineer &amp; builder of{' '}
                <span className="italic font-serif text-primary">
                  systems that think.
                </span>{' '}
                I turn messy, unstructured, real-world data - emails, PDFs, SAP
                exports, social streams - into agentic infrastructure that
                scales.
              </motion.p>

              <motion.a
                href="#projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-2 hover:gap-3 transition-all bg-primary rounded-full pl-5 pr-1.5 py-1.5 w-fit text-black font-medium text-sm sm:text-base"
              >
                See the work
                <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#E1E0CC' }} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>

        <motion.a
          href="#about"
          aria-label="Scroll to About"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 text-primary/70 hover:text-primary transition-colors"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <span className="block w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </motion.a>
      </div>
    </section>
  )
}

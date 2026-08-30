import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { WordsPullUp } from '../components/WordsPullUp'

const NAV = ['About', 'Projects', 'Writing', 'Talks', 'Contact']

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
          className="absolute bottom-0 right-0 w-[360px] h-[220px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at bottom right, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.45) 60%, transparent 80%)',
          }}
        />

        <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 md:py-3 flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {NAV.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] sm:text-xs md:text-sm transition-colors"
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-6 md:pb-10 z-10">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-semibold leading-[0.85] tracking-[-0.07em]"
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
                {[
                  'CTO · StriveSteam',
                  'AWS Community Builder',
                  'Agentic AI · Data · Cloud',
                ].map((chip) => (
                  <span
                    key={chip}
                    className="text-[10px] sm:text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-primary/25 text-primary/90 bg-black/25 backdrop-blur-[2px]"
                  >
                    {chip}
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
                Independent engineer &amp; builder of systems that think. I turn messy,
                unstructured, real-world data — emails, PDFs, SAP exports, social streams —
                into agentic infrastructure that scales.
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
      </div>
    </section>
  )
}

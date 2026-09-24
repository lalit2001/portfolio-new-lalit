import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle'
import { PortraitCollage } from '../components/PortraitCollage'

const BODY =
  "Five-plus years shipping data and AI systems across Life Sciences, Automotive, FinTech and Insurtech - from lakehouses that power bank underwriting to multi-agentic platforms in production. Today I'm CTO at StriveSteam. On the side I'm building OmniQuery, a data fabric you can talk to, and the Agent Platform, a self-hostable Claude-style runtime with git-versioned Skills. AWS Community Builder in Data and AI, 2025 & 2026 ."

function ProgressiveChar({
  char,
  progress,
  charProgress,
}: {
  char: string
  progress: MotionValue<number>
  charProgress: number
}) {
  const opacity = useTransform(
    progress,
    [charProgress - 0.008, charProgress + 0.008],
    [0.15, 1],
  )
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

function ProgressiveBody({ progress }: { progress: MotionValue<number> }) {
  const chars = Array.from(BODY)
  const start = 0.12
  const end = 0.92
  return (
    <p className="text-[#DEDBC8] text-sm md:text-base leading-relaxed">
      {chars.map((c, i) => {
        const charProgress =
          start + (end - start) * (i / Math.max(chars.length - 1, 1))
        return (
          <ProgressiveChar
            key={i}
            char={c}
            progress={progress}
            charProgress={charProgress}
          />
        )
      })}
    </p>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: '320vh' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(222, 219, 200, 0.08) 1px, transparent 1.4px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 85%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(245, 195, 105, 0.08) 0%, rgba(220, 160, 70, 0.03) 35%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 90% at 50% 100%, rgba(169, 233, 251, 0.06) 0%, transparent 60%)',
        }}
      />
      <div className="noise-overlay opacity-[0.12] mix-blend-screen pointer-events-none" />

      <div className="sticky top-0 h-screen w-full flex items-center px-6 md:px-10 z-10">
        <div className="mx-auto max-w-4xl w-full bg-[#141414] ring-1 ring-white/[0.08] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] rounded-2xl md:rounded-[2rem] px-6 md:px-12 py-10 md:py-14 text-center">
          <div className="mb-6 md:mb-8">
            <PortraitCollage progress={scrollYProgress} maxWidth={160} />
          </div>

          <div className="text-primary text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-5">
            Data - AI - Systems
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-2xl mx-auto leading-[1.05]">
            <WordsPullUpMultiStyle
              segments={[
                { text: 'I am Lalit Moharana,', className: 'font-normal' },
                {
                  text: 'a self-taught systems builder.',
                  className: 'italic font-serif',
                },
                {
                  text: 'I have skills in agentic AI, data engineering, and cloud-native architecture.',
                  className: 'font-normal',
                },
              ]}
            />
          </h2>

          <div className="mt-6 md:mt-8 max-w-xl mx-auto">
            <ProgressiveBody progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}

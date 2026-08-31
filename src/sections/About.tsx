import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle'

const BODY =
  "Over the last five-plus years, I have worked with Ernst & Young as a Senior Consultant in Data & AI - deploying Genome, a Life Sciences agents marketplace, and leading SMART, a multi-agentic social analytics platform for one of the world's largest automotive manufacturers. Before that, I led data engineering at ByteIQ Analytics on FinTech lakehouses powering bank underwriting decisions, and shipped agentic NL-to-SQL pipelines at InvoLead. Today I am CTO at StriveSteam and, on the side, building OmniQuery (a context-augmented data fabric you can talk to), the Agent Platform (a self-hostable, Claude-style runtime with git-versioned Skills and MCP connector pooling), and an AI research newsletter distilled from the LLM and agents frontier. Recognized as an AWS Community Builder in Data Engineering (2025), and an architecture advisor to open-source projects like Olake."

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
    <p className="text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed">
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
        <div className="mx-auto max-w-6xl w-full bg-[#101010] rounded-2xl md:rounded-[2rem] px-6 md:px-16 py-20 md:py-28 text-center">
          <div className="text-primary text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-8">
            Data - AI - Systems
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9]">
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

          <div className="mt-10 md:mt-14 max-w-2xl mx-auto">
            <ProgressiveBody progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}

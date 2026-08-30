import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle'

interface LabelPos {
  label: string
  top: string
  left: string
}

interface Project {
  name: string
  tag: string
  href: string
  screenshot: string
  thesis: string
  sources: LabelPos[]
  actions: LabelPos[]
}

const PROJECTS: Project[] = [
  {
    name: 'OmniQuery',
    tag: 'Talk to your data',
    href: 'https://www.omniquery.in/',
    screenshot: '/omniquery.png',
    thesis: 'Your data lives in ten places. Ask it one question.',
    sources: [
      { label: 'Postgres', top: '20%', left: '20%' },
      { label: 'Snowflake', top: '24%', left: '66%' },
      { label: 'Mongo', top: '38%', left: '30%' },
      { label: 'Trino', top: '42%', left: '72%' },
      { label: 'Slack', top: '56%', left: '22%' },
      { label: 'S3', top: '60%', left: '60%' },
      { label: 'Jira', top: '72%', left: '42%' },
    ],
    actions: [
      { label: 'SQL written', top: '26%', left: '26%' },
      { label: 'Chart rendered', top: '32%', left: '68%' },
      { label: 'RBAC honored', top: '48%', left: '20%' },
      { label: 'Reasoning trace', top: '54%', left: '62%' },
      { label: 'One question', top: '68%', left: '40%' },
    ],
  },
  {
    name: 'Agent Platform',
    tag: 'Self-hostable agentic runtime',
    href: 'https://agent-dot.omniquery.in/',
    screenshot: '/agent-dot.png',
    thesis: 'One container per connector. Every session, one pipe. Zero queueing.',
    sources: [
      { label: 'Skills', top: '20%', left: '22%' },
      { label: 'Sessions', top: '24%', left: '64%' },
      { label: 'MCP servers', top: '38%', left: '30%' },
      { label: 'Prompts', top: '42%', left: '70%' },
      { label: 'Memory', top: '56%', left: '25%' },
      { label: 'Git playbooks', top: '60%', left: '60%' },
      { label: 'Docker', top: '72%', left: '42%' },
    ],
    actions: [
      { label: 'Skill matched', top: '26%', left: '26%' },
      { label: 'Container spawned', top: '32%', left: '68%' },
      { label: 'Tool multiplexed', top: '48%', left: '22%' },
      { label: 'State versioned', top: '54%', left: '64%' },
      { label: 'Agent shipped', top: '68%', left: '40%' },
    ],
  },
  {
    name: 'AI Newsletter',
    tag: 'Signal from the frontier',
    href: 'https://ai-newsletter.omniquery.in/',
    screenshot: '/ai-newsletter.png',
    thesis: 'Forty feeds a day. Distilled into one weekly signal.',
    sources: [
      { label: 'arXiv', top: '22%', left: '22%' },
      { label: 'Anthropic', top: '26%', left: '65%' },
      { label: 'OpenAI', top: '38%', left: '28%' },
      { label: 'DeepMind', top: '42%', left: '70%' },
      { label: 'HN', top: '54%', left: '24%' },
      { label: 'X threads', top: '58%', left: '60%' },
      { label: 'GitHub', top: '72%', left: '42%' },
    ],
    actions: [
      { label: 'Curated', top: '28%', left: '28%' },
      { label: 'Summarised', top: '34%', left: '66%' },
      { label: 'Weekly', top: '50%', left: '22%' },
      { label: 'In your inbox', top: '56%', left: '62%' },
      { label: 'No hot takes', top: '70%', left: '40%' },
    ],
  },
]

const N = PROJECTS.length

function segmentRange(i: number) {
  return { start: i / N, end: (i + 1) / N }
}

function useLayerOpacity(
  progress: MotionValue<number>,
  index: number,
) {
  const { start, end } = segmentRange(index)
  const isFirst = index === 0
  const isLast = index === N - 1
  const fade = 0.04
  return useTransform(
    progress,
    [start - fade, start + fade, end - fade, end + fade],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
  )
}

function ProjectLayer({
  progress,
  index,
  children,
}: {
  progress: MotionValue<number>
  index: number
  children: ReactNode
}) {
  const opacity = useLayerOpacity(progress, index)
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {children}
    </motion.div>
  )
}

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

function ProgressiveText({
  text,
  progress,
  start,
  end,
  className,
}: {
  text: string
  progress: MotionValue<number>
  start: number
  end: number
  className?: string
}) {
  const chars = Array.from(text)
  return (
    <p className={className}>
      {chars.map((c, i) => {
        const charProgress = start + (end - start) * (i / chars.length)
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

function TextTile({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative h-full bg-[#0e0e0e] ring-1 ring-white/[0.06] rounded-2xl overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-noise opacity-[0.08] pointer-events-none"
      />
      <div className="absolute top-4 left-6 text-[10px] tracking-[0.25em] uppercase text-primary/45 z-10">
        Thesis
      </div>
      {PROJECTS.map((p, i) => {
        const { start, end } = segmentRange(i)
        const textStart = start + 0.05
        const textEnd = end - 0.06
        return (
          <ProjectLayer key={p.name} progress={progress} index={i}>
            <div className="w-full h-full flex items-center p-6 md:p-10 lg:p-14">
              <div className="relative w-full max-w-lg">
                <div className="text-primary/50 text-[11px] tracking-[0.25em] uppercase mb-4">
                  {p.name}
                </div>
                <ProgressiveText
                  text={p.thesis}
                  progress={progress}
                  start={textStart}
                  end={textEnd}
                  className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.1] tracking-tight"
                />
              </div>
            </div>
          </ProjectLayer>
        )
      })}
    </div>
  )
}

function FloatingLabel({
  label,
  top,
  left,
  progress,
  fadeStart,
  fadeEnd,
}: {
  label: string
  top: string
  left: string
  progress: MotionValue<number>
  fadeStart: number
  fadeEnd: number
}) {
  const opacity = useTransform(progress, [fadeStart, fadeEnd], [0, 1])
  const y = useTransform(progress, [fadeStart, fadeEnd], [10, 0])
  return (
    <motion.div
      style={{ opacity, y, top, left }}
      className="absolute -translate-x-1/2 -translate-y-1/2 text-white text-[10px] md:text-xs px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-[2px] border border-white/[0.12] whitespace-nowrap shadow-[0_0_20px_rgba(0,0,0,0.4)]"
    >
      {label}
    </motion.div>
  )
}

function ConeTile({
  variant,
  eyebrow,
  progress,
  labelsFor,
  ordering,
}: {
  variant: 'gold' | 'blue'
  eyebrow: string
  progress: MotionValue<number>
  labelsFor: (p: Project) => LabelPos[]
  ordering: 'front' | 'back'
}) {
  const cone =
    variant === 'gold'
      ? 'radial-gradient(ellipse 65% 100% at 50% 108%, rgba(245, 195, 105, 0.92) 0%, rgba(220, 160, 70, 0.55) 22%, rgba(170, 115, 45, 0.22) 45%, transparent 68%)'
      : 'radial-gradient(ellipse 65% 100% at 50% 108%, rgba(130, 195, 255, 0.88) 0%, rgba(95, 155, 225, 0.5) 22%, rgba(65, 110, 190, 0.2) 45%, transparent 68%)'

  return (
    <div className="relative h-full bg-[#0a0a0a] ring-1 ring-white/[0.06] rounded-2xl overflow-hidden">
      <div className="absolute inset-0" style={{ background: cone }} />
      <div className="noise-overlay opacity-50 mix-blend-screen pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 100%, transparent 55%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {PROJECTS.map((p, i) => {
        const { start, end } = segmentRange(i)
        const labels = labelsFor(p)
        return (
          <ProjectLayer key={p.name} progress={progress} index={i}>
            {labels.map((l, li) => {
              const segLen = end - start
              const inner = ordering === 'front' ? 0.5 : 0.55
              const localStart = start + segLen * 0.1 + segLen * inner * (li / labels.length)
              const localEnd = localStart + segLen * 0.22
              return (
                <FloatingLabel
                  key={l.label}
                  label={l.label}
                  top={l.top}
                  left={l.left}
                  progress={progress}
                  fadeStart={localStart}
                  fadeEnd={localEnd}
                />
              )
            })}
          </ProjectLayer>
        )
      })}

      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] uppercase z-10 ${
          variant === 'gold' ? 'text-amber-100/70' : 'text-sky-100/70'
        }`}
      >
        {eyebrow}
      </div>
    </div>
  )
}

function ScreenshotBadge({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 flex items-end justify-between gap-4 z-10"
    >
      <div>
        <div className="text-[10px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
          {project.tag}
        </div>
        <div className="text-white text-lg md:text-2xl leading-tight font-normal">
          {project.name}
        </div>
      </div>
      <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </a>
  )
}

function ScreenshotTile({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative h-full bg-[#0a0a0a] ring-1 ring-white/[0.06] rounded-2xl overflow-hidden">
      {PROJECTS.map((p, i) => (
        <ProjectLayer key={`bg-${p.name}`} progress={progress} index={i}>
          <img
            src={p.screenshot}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-top blur-3xl scale-125 opacity-75"
          />
        </ProjectLayer>
      ))}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/85 pointer-events-none"
      />
      <div className="noise-overlay opacity-[0.12] mix-blend-overlay pointer-events-none" />

      <div className="absolute top-4 left-6 text-[10px] tracking-[0.25em] uppercase text-white/60 z-20">
        Shipped
      </div>

      {PROJECTS.map((p, i) => (
        <ProjectLayer key={`sharp-${p.name}`} progress={progress} index={i}>
          <div className="absolute inset-x-6 md:inset-x-10 top-14 bottom-24 flex items-center justify-center">
            <img
              src={p.screenshot}
              alt=""
              aria-hidden
              className="max-w-full max-h-full object-contain rounded-md shadow-[0_30px_60px_-10px_rgba(0,0,0,0.7),0_10px_30px_-5px_rgba(0,0,0,0.4)]"
            />
          </div>
        </ProjectLayer>
      ))}

      {PROJECTS.map((p, i) => (
        <ProjectLayer key={`badge-${p.name}`} progress={progress} index={i}>
          <ScreenshotBadge project={p} />
        </ProjectLayer>
      ))}
    </div>
  )
}

export function ProjectsGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: '360vh' }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 pt-8 md:pt-12">
          <div className="text-primary/70 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3">
            The work
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight max-w-4xl">
            <WordsPullUpMultiStyle
              justify="start"
              segments={[
                { text: 'Production-grade infrastructure', className: 'text-primary' },
                { text: 'for agentic AI.', className: 'italic font-serif text-primary' },
              ]}
            />
          </h2>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 pt-6 pb-6 md:pb-10 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-2 md:gap-3 h-full">
            <div className="md:col-span-3 md:row-span-1 min-h-[220px] md:min-h-0">
              <TextTile progress={scrollYProgress} />
            </div>
            <div className="md:col-span-2 md:row-span-1 min-h-[220px] md:min-h-0">
              <ConeTile
                variant="gold"
                eyebrow="Signal in"
                progress={scrollYProgress}
                labelsFor={(p) => p.sources}
                ordering="front"
              />
            </div>
            <div className="md:col-span-3 md:row-span-1 min-h-[280px] md:min-h-0">
              <ScreenshotTile progress={scrollYProgress} />
            </div>
            <div className="md:col-span-2 md:row-span-1 min-h-[220px] md:min-h-0">
              <ConeTile
                variant="blue"
                eyebrow="Answers out"
                progress={scrollYProgress}
                labelsFor={(p) => p.actions}
                ordering="back"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

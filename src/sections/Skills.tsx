import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from 'framer-motion'
import { useRef, ReactNode } from 'react'
import {
  Cloud,
  Server,
  Database,
  Sparkles,
  LucideIcon,
} from 'lucide-react'
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle'

interface Tech {
  name: string
  monogram: string
  top: string
  left: string
  size?: 'sm' | 'md' | 'lg'
}

interface Category {
  name: string
  serifTail: string
  eyebrow: string
  description: string
  Icon: LucideIcon
  accent: string
  accentSoft: string
  items: Tech[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Cloud &',
    serifTail: 'Infra',
    eyebrow: 'The ground floor',
    description:
      'Containers, orchestrators, cloud primitives. The stuff that has to be right at 3 a.m.',
    Icon: Cloud,
    accent: '#A9E9FB',
    accentSoft: 'rgba(169, 233, 251, 0.16)',
    items: [
      { name: 'AWS',       monogram: 'A',  top: '12%', left: '22%', size: 'lg' },
      { name: 'ECS',       monogram: 'EC', top: '20%', left: '68%' },
      { name: 'Lambda',    monogram: 'λ',  top: '30%', left: '38%', size: 'md' },
      { name: 'Docker',    monogram: 'D',  top: '38%', left: '78%', size: 'md' },
      { name: 'Terraform', monogram: 'T',  top: '46%', left: '18%' },
      { name: 'GKE',       monogram: 'K',  top: '52%', left: '52%' },
      { name: 'Glue',      monogram: 'G',  top: '62%', left: '72%' },
      { name: 'EMR',       monogram: 'EM', top: '68%', left: '30%' },
      { name: 'Batch',     monogram: 'B',  top: '78%', left: '58%' },
      { name: 'GCP',       monogram: 'G',  top: '85%', left: '20%' },
    ],
  },
  {
    name: 'Backend',
    serifTail: 'services',
    eyebrow: 'Boring for a reason',
    description:
      'Event-driven microservices, type systems, contracts. The stuff that has to hold up under load.',
    Icon: Server,
    accent: '#88E7C2',
    accentSoft: 'rgba(136, 231, 194, 0.16)',
    items: [
      { name: 'Spring Boot', monogram: 'SB', top: '15%', left: '25%', size: 'lg' },
      { name: 'FastAPI',     monogram: 'F',  top: '22%', left: '65%', size: 'md' },
      { name: 'Quarkus',     monogram: 'Q',  top: '38%', left: '20%' },
      { name: 'Go',          monogram: 'GO', top: '45%', left: '55%', size: 'md' },
      { name: 'Next.js',     monogram: 'N',  top: '58%', left: '78%' },
      { name: 'gRPC',        monogram: 'g',  top: '68%', left: '32%' },
      { name: 'Kafka',       monogram: 'K',  top: '80%', left: '60%' },
    ],
  },
  {
    name: 'Data',
    serifTail: 'engineering',
    eyebrow: 'Lakehouses to warehouses',
    description:
      'Streams, batches, tables, catalogs. The plumbing of every intelligent system I ship.',
    Icon: Database,
    accent: '#FED792',
    accentSoft: 'rgba(254, 215, 146, 0.16)',
    items: [
      { name: 'Snowflake',  monogram: '❄',  top: '10%', left: '55%', size: 'lg' },
      { name: 'Iceberg',    monogram: 'IC', top: '18%', left: '22%' },
      { name: 'Trino',      monogram: 'T',  top: '28%', left: '75%' },
      { name: 'Flink',      monogram: 'F',  top: '35%', left: '42%', size: 'md' },
      { name: 'Kafka',      monogram: 'K',  top: '46%', left: '18%' },
      { name: 'Airflow',    monogram: 'A',  top: '52%', left: '62%' },
      { name: 'Hudi',       monogram: 'H',  top: '62%', left: '30%' },
      { name: 'ClickHouse', monogram: 'CH', top: '70%', left: '72%', size: 'md' },
      { name: 'Paimon',     monogram: 'P',  top: '80%', left: '48%' },
      { name: 'Doris',      monogram: 'D',  top: '86%', left: '22%' },
    ],
  },
  {
    name: 'Agentic',
    serifTail: 'AI',
    eyebrow: 'Systems that think',
    description:
      'The runtime, the memory, the connectors. Everything between the model and the user.',
    Icon: Sparkles,
    accent: '#FCD7ED',
    accentSoft: 'rgba(252, 215, 237, 0.16)',
    items: [
      { name: 'LangChain',  monogram: 'LC', top: '12%', left: '30%', size: 'lg' },
      { name: 'LangGraph',  monogram: 'LG', top: '22%', left: '68%' },
      { name: 'LlamaIndex', monogram: 'LI', top: '32%', left: '18%' },
      { name: 'MCP',        monogram: 'M',  top: '38%', left: '52%', size: 'md' },
      { name: 'A2A',        monogram: 'A',  top: '48%', left: '78%' },
      { name: 'RAG',        monogram: 'R',  top: '56%', left: '25%', size: 'md' },
      { name: 'Self-RAG',   monogram: 'sR', top: '64%', left: '58%' },
      { name: 'Bedrock',    monogram: 'B',  top: '72%', left: '80%' },
      { name: 'Langfuse',   monogram: 'LF', top: '80%', left: '32%' },
      { name: 'NL2SQL',     monogram: 'NL', top: '88%', left: '62%' },
    ],
  },
]

const HEX_TO_RGB: Record<string, string> = {
  '#A9E9FB': '169, 233, 251',
  '#88E7C2': '136, 231, 194',
  '#FED792': '254, 215, 146',
  '#FCD7ED': '252, 215, 237',
}

const N = CATEGORIES.length

function segmentRange(i: number) {
  return { start: i / N, end: (i + 1) / N }
}

function useLayerOpacity(progress: MotionValue<number>, index: number) {
  const { start, end } = segmentRange(index)
  const fade = 0.03
  const isFirst = index === 0
  const isLast = index === N - 1
  return useTransform(
    progress,
    [start - fade, start + fade, end - fade, end + fade],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
  )
}

function CategoryLayer({
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

function FloatingPill({
  tech,
  accent,
  progress,
  start,
  end,
  index,
  total,
}: {
  tech: Tech
  accent: string
  progress: MotionValue<number>
  start: number
  end: number
  index: number
  total: number
}) {
  const segLen = end - start
  const t = start + segLen * 0.08 + segLen * 0.75 * (index / Math.max(total - 1, 1))
  const opacity = useTransform(progress, [t - 0.006, t + 0.025], [0, 1])
  const y = useTransform(progress, [t - 0.006, t + 0.025], [14, 0])
  const rgb = HEX_TO_RGB[accent] ?? '255, 255, 255'
  const size = tech.size ?? 'sm'

  const textSize =
    size === 'lg' ? 'text-sm md:text-base' : size === 'md' ? 'text-xs md:text-sm' : 'text-[11px] md:text-xs'
  const padding =
    size === 'lg' ? 'px-3.5 py-2 md:px-4 md:py-2.5' : size === 'md' ? 'px-3 py-1.5 md:py-2' : 'px-2.5 py-1.5'
  const dotSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  const dotText = size === 'lg' ? 'text-[10px]' : size === 'md' ? 'text-[9px]' : 'text-[8px]'

  return (
    <motion.div
      style={{
        opacity,
        y,
        top: tech.top,
        left: tech.left,
        background: `rgba(0, 0, 0, 0.55)`,
        borderColor: `rgba(${rgb}, 0.35)`,
        boxShadow: `0 8px 24px -8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 24px -8px rgba(${rgb}, 0.35)`,
      }}
      className={`group absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full border backdrop-blur-[3px] whitespace-nowrap will-change-transform ${padding}`}
    >
      <span
        className={`rounded-full ${dotSize} flex items-center justify-center font-semibold ${dotText}`}
        style={{
          background: `rgba(${rgb}, 0.18)`,
          color: accent,
          boxShadow: `inset 0 0 0 1px rgba(${rgb}, 0.55)`,
        }}
      >
        {tech.monogram}
      </span>
      <span className={`text-primary/90 ${textSize} leading-none`}>
        {tech.name}
      </span>
    </motion.div>
  )
}

function CategoryPane({
  category,
  progress,
  index,
}: {
  category: Category
  progress: MotionValue<number>
  index: number
}) {
  const { start, end } = segmentRange(index)
  const iconOpacity = useTransform(
    progress,
    [start, start + 0.03],
    [0, 1],
  )
  const iconScale = useTransform(progress, [start, start + 0.06], [0.92, 1])
  const iconRotate = useTransform(progress, [start, end], [-4, 4])

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-8 md:gap-14 items-start md:items-center">
      <div className="w-full md:w-2/5 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            style={{
              opacity: iconOpacity,
              scale: iconScale,
              rotate: iconRotate,
              background: category.accentSoft,
              color: category.accent,
              borderColor: category.accent,
            }}
            className="w-14 h-14 rounded-2xl border ring-1 ring-white/[0.05] flex items-center justify-center will-change-transform"
          >
            <category.Icon className="w-6 h-6" strokeWidth={1.5} />
          </motion.div>
          <div className="text-primary/40 text-[10px] tracking-[0.3em] uppercase">
            {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </div>
        </div>

        <div
          className="text-primary/70 text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-4"
          style={{ color: category.accent }}
        >
          {category.eyebrow}
        </div>

        <h3 className="text-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-medium tracking-tight">
          {category.name}{' '}
          <span className="italic font-serif">{category.serifTail}</span>
        </h3>

        <p className="mt-6 text-primary/70 text-sm md:text-base leading-relaxed max-w-md">
          {category.description}
        </p>

        <div className="mt-6 text-primary/40 text-xs">
          {category.items.length} tools
        </div>
      </div>

      <div className="relative w-full md:w-3/5 h-[360px] sm:h-[420px] md:h-full min-h-[380px] rounded-2xl overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 90% at 50% 110%, rgba(${HEX_TO_RGB[category.accent] ?? '255,255,255'}, 0.28) 0%, rgba(${HEX_TO_RGB[category.accent] ?? '255,255,255'}, 0.1) 30%, transparent 65%)`,
          }}
        />
        <div className="noise-overlay opacity-30 mix-blend-screen pointer-events-none" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 100% 100% at 50% 100%, transparent 55%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        <div className="relative w-full h-full">
          {category.items.map((tech, i) => (
            <FloatingPill
              key={tech.name}
              tech={tech}
              accent={category.accent}
              progress={progress}
              start={start}
              end={end}
              index={i}
              total={category.items.length}
            />
          ))}
        </div>

        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase z-10"
          style={{ color: category.accent, opacity: 0.7 }}
        >
          {category.name.replace(/[&\s]+$/, '')} {category.serifTail}
        </div>
      </div>
    </div>
  )
}

function ProgressDots({
  progress,
}: {
  progress: MotionValue<number>
}) {
  return (
    <div className="flex items-center gap-2">
      {CATEGORIES.map((cat, i) => (
        <ProgressDot key={cat.name} progress={progress} index={i} />
      ))}
    </div>
  )
}

function ProgressDot({
  progress,
  index,
}: {
  progress: MotionValue<number>
  index: number
}) {
  const { start, end } = segmentRange(index)
  const opacity = useTransform(
    progress,
    [start - 0.02, start + 0.02, end - 0.02, end + 0.02],
    [0.25, 1, 1, 0.25],
  )
  const width = useTransform(
    progress,
    [start - 0.02, start + 0.02, end - 0.02, end + 0.02],
    ['8px', '28px', '28px', '8px'],
  )
  const color = CATEGORIES[index].accent
  return (
    <motion.div
      style={{ opacity, width, background: color }}
      className="h-1 rounded-full transition-colors"
    />
  )
}

function CategoryBackdrop({
  progress,
  index,
  rgb,
}: {
  progress: MotionValue<number>
  index: number
  rgb: string
}) {
  const opacity = useLayerOpacity(progress, index)
  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="absolute inset-0 pointer-events-none"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 65% at 50% -3%, rgba(${rgb}, 0.28) 0%, rgba(${rgb}, 0.12) 25%, rgba(${rgb}, 0.04) 45%, transparent 68%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 55% 60% at 15% 105%, rgba(${rgb}, 0.14) 0%, transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 45% 60% at 100% 60%, rgba(${rgb}, 0.08) 0%, transparent 55%)`,
        }}
      />
    </motion.div>
  )
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: '340vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {CATEGORIES.map((cat, i) => (
          <CategoryBackdrop
            key={`bg-${cat.name}`}
            progress={scrollYProgress}
            index={i}
            rgb={HEX_TO_RGB[cat.accent] ?? '255, 255, 255'}
          />
        ))}
        <div className="noise-overlay opacity-30 mix-blend-screen pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col max-w-7xl mx-auto px-6 md:px-10">
          <div className="pt-14 md:pt-20 pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div>
                <div className="text-primary/60 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3">
                  The stack I dream in
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[0.95] font-medium tracking-tight max-w-2xl">
                  <WordsPullUpMultiStyle
                    justify="start"
                    segments={[
                      { text: 'Tools I reach for', className: 'text-primary' },
                      {
                        text: 'when the problem is real.',
                        className: 'italic font-serif text-primary',
                      },
                    ]}
                  />
                </h2>
              </div>
              <ProgressDots progress={scrollYProgress} />
            </div>
          </div>

          <div className="relative flex-1 min-h-0">
            {CATEGORIES.map((cat, i) => (
              <CategoryLayer
                key={cat.name}
                progress={scrollYProgress}
                index={i}
              >
                <div className="w-full h-full py-6 md:py-10">
                  <CategoryPane
                    category={cat}
                    progress={scrollYProgress}
                    index={i}
                  />
                </div>
              </CategoryLayer>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

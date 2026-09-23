import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  animate,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  Cloud,
  Server,
  Database,
  HardDrive,
  Sparkles,
  LucideIcon,
} from 'lucide-react'
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle'
import { BrandIcon } from '../components/BrandIcon'

interface Tool {
  slug: string
  label: string
}

interface Category {
  name: string
  serifTail: string
  eyebrow: string
  description: string
  Icon: LucideIcon
  accent: string
  accentRgb: string
  visual: 'stack' | 'window' | 'wave' | 'shelves' | 'graph'
  tools: Tool[]
  span?: 'wide'
}

const CATEGORIES: Category[] = [
  {
    name: 'Cloud &',
    serifTail: 'Infrastructure',
    eyebrow: 'The ground floor',
    description:
      'From EC2 to Batch, the primitives that hold up production at 3 a.m.',
    Icon: Cloud,
    accent: '#A9E9FB',
    accentRgb: '169, 233, 251',
    visual: 'stack',
    tools: [
      { slug: 'aws', label: 'AWS' },
      { slug: 'ec2', label: 'EC2' },
      { slug: 's3', label: 'S3' },
      { slug: 'ecs', label: 'ECS' },
      { slug: 'ecr', label: 'ECR' },
      { slug: 'lambda', label: 'Lambda' },
      { slug: 'kubernetes', label: 'Kubernetes' },
      { slug: 'api-gateway', label: 'API Gateway' },
      { slug: 'secrets-manager', label: 'Secrets' },
      { slug: 'glue', label: 'Glue' },
      { slug: 'emr', label: 'EMR' },
      { slug: 'batch', label: 'Batch' },
      { slug: 'docker', label: 'Docker' },
      { slug: 'terraform', label: 'Terraform' },
      { slug: 'github-actions', label: 'GitHub Actions' },
      { slug: 'gitlab-ci', label: 'GitLab CI' },
      { slug: 'argo', label: 'Argo CD' },
      { slug: 'grafana', label: 'Grafana' },
      { slug: 'prometheus', label: 'Prometheus' },
    ],
  },
  {
    name: 'Backend &',
    serifTail: 'APIs',
    eyebrow: 'Boring for a reason',
    description:
      'Event-driven microservices, type systems, contracts. The stuff that has to hold up under load.',
    Icon: Server,
    accent: '#88E7C2',
    accentRgb: '136, 231, 194',
    visual: 'window',
    tools: [
      { slug: 'java-spring-boot', label: 'Spring Boot' },
      { slug: 'quarkus', label: 'Quarkus' },
      { slug: 'fastapi', label: 'FastAPI' },
      { slug: 'nextjs', label: 'Next.js' },
      { slug: 'nodejs', label: 'Node.js' },
      { slug: 'go', label: 'Go' },
      { slug: 'graphql', label: 'GraphQL' },
      { slug: 'grpc', label: 'gRPC' },
      { slug: 'microservices', label: 'Microservices' },
      { slug: 'rest', label: 'REST' },
      { slug: 'eda', label: 'Event-Driven' },
      { slug: 'rabbitmq', label: 'RabbitMQ' },
      { slug: 'aws-sqs', label: 'AWS SQS' },
      { slug: 'ibm-mq', label: 'IBM MQ' },
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
    accentRgb: '254, 215, 146',
    visual: 'wave',
    tools: [
      { slug: 'apache-hudi', label: 'Hudi' },
      { slug: 'iceberg', label: 'Iceberg' },
      { slug: 'apache-paimon', label: 'Paimon' },
      { slug: 'kafka', label: 'Kafka' },
      { slug: 'flink', label: 'Flink' },
      { slug: 'apache-spark', label: 'Spark' },
      { slug: 'apache-nifi', label: 'NiFi' },
      { slug: 'debezium', label: 'Debezium' },
      { slug: 'airflow', label: 'Airflow' },
      { slug: 'dbt', label: 'dbt' },
      { slug: 'apache-arrow', label: 'Arrow' },
      { slug: 'datafusion', label: 'DataFusion' },
      { slug: 'trino', label: 'Trino' },
    ],
  },
  {
    name: 'Databases',
    serifTail: '& stores',
    eyebrow: 'Rows, columns, graphs, docs',
    description:
      'Warehouses, OLTP, cache, graph. The right store for the shape of the question.',
    Icon: HardDrive,
    accent: '#FCD7ED',
    accentRgb: '252, 215, 237',
    visual: 'shelves',
    tools: [
      { slug: 'redshift', label: 'Redshift' },
      { slug: 'clickhouse', label: 'ClickHouse' },
      { slug: 'snowflake', label: 'Snowflake' },
      { slug: 'apache-doris', label: 'Doris' },
      { slug: 'duckdb', label: 'DuckDB' },
      { slug: 'postgres', label: 'PostgreSQL' },
      { slug: 'mongo', label: 'MongoDB' },
      { slug: 'documentdb', label: 'DocumentDB' },
      { slug: 'dynamodb', label: 'DynamoDB' },
      { slug: 'cassandra', label: 'Cassandra' },
      { slug: 'redis', label: 'Redis' },
      { slug: 'neo4j', label: 'Neo4j' },
      { slug: 'elasticsearch', label: 'Elasticsearch' },
      { slug: 'qdrant', label: 'Qdrant' },
      { slug: 'pinecone', label: 'Pinecone' },
    ],
  },
  {
    name: 'GenAI &',
    serifTail: 'LLM systems',
    eyebrow: 'Systems that think',
    description:
      'The runtime, the memory, the connectors. Everything between the model and the user.',
    Icon: Sparkles,
    accent: '#B8B4E0',
    accentRgb: '184, 180, 224',
    visual: 'graph',
    span: 'wide',
    tools: [
      { slug: 'langchain', label: 'LangChain' },
      { slug: 'langgraph', label: 'LangGraph' },
      { slug: 'llamaindex', label: 'LlamaIndex' },
      { slug: 'crewai', label: 'CrewAI' },
      { slug: 'semantic-kernel', label: 'Semantic Kernel' },
      { slug: 'mcp', label: 'MCP' },
      { slug: 'mcp-web', label: 'MCP Web' },
      { slug: 'a2a', label: 'A2A' },
      { slug: 'rag', label: 'RAG' },
      { slug: 'self-rag', label: 'Self-RAG' },
      { slug: 'nl2sql', label: 'NL2SQL' },
      { slug: 'claude', label: 'Claude' },
      { slug: 'anthropic', label: 'Anthropic' },
      { slug: 'openai', label: 'OpenAI' },
      { slug: 'gemini', label: 'Gemini' },
      { slug: 'aws-bedrock', label: 'AWS Bedrock' },
      { slug: 'vertex-ai', label: 'Vertex AI' },
      { slug: 'azure-ai-studio', label: 'Azure AI' },
      { slug: 'ollama', label: 'Ollama' },
      { slug: 'huggingface', label: 'Hugging Face' },
      { slug: 'langfuse', label: 'Langfuse' },
    ],
  },
]

const TOTAL_TOOLS = CATEGORIES.reduce((n, c) => n + c.tools.length, 0)

function hexToRgb(hex: string) {
  const m = hex.replace('#', '')
  return `${parseInt(m.slice(0, 2), 16)}, ${parseInt(m.slice(2, 4), 16)}, ${parseInt(m.slice(4, 6), 16)}`
}

/* ------------------------------------------------------------------ */
/* Shared reveal wrapper: bands / windows / columns blur-in staggered  */
/* ------------------------------------------------------------------ */
function BandReveal({
  i,
  className = '',
  children,
}: {
  i: number
  className?: string
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(8px)' }
      }
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function IconTile({
  tool,
  accent,
  className = '',
  style,
  size = 'md',
  index = 0,
}: {
  tool: Tool
  accent: string
  className?: string
  style?: React.CSSProperties
  size?: 'sm' | 'md'
  index?: number
}) {
  const reduce = useReducedMotion()
  const rgb = hexToRgb(accent)
  const iconSize = size === 'sm' ? 12 : 14
  const padding =
    size === 'sm' ? 'px-1.5 py-1 sm:px-2 sm:py-1.5' : 'px-2 py-1.5 sm:px-2.5 sm:py-2'
  const textSize = size === 'sm' ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-[11px]'
  return (
    <motion.div
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 10, scale: 0.9, filter: 'blur(4px)' }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -3,
              scale: 1.06,
              borderColor: `rgba(${rgb}, 0.55)`,
              boxShadow: `0 8px 24px -8px rgba(${rgb}, 0.35), 0 0 0 1px rgba(${rgb}, 0.15)`,
              transition: { duration: 0.18, ease: 'easeOut' },
            }
      }
      transition={{
        duration: 0.5,
        delay: 0.15 + Math.min(index, 14) * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group/tile relative flex items-center gap-2 rounded-xl border border-white/[0.1] bg-black/60 backdrop-blur-[2px] shadow-[0_10px_28px_-10px_rgba(0,0,0,0.7)] whitespace-nowrap cursor-default ${padding} ${className}`}
      style={style}
    >
      <BrandIcon slug={tool.slug} label={tool.label} size={iconSize} color={accent} />
      <span className={`text-primary/90 ${textSize} leading-none`}>{tool.label}</span>
    </motion.div>
  )
}

/** Cloud & Infrastructure - horizontal infra tiers, each labeled */
function LayeredVisual({ tools, accent }: { tools: Tool[]; accent: string }) {
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug)
  const bands = [
    { label: 'compute', items: ['aws', 'ec2', 'ecs', 'lambda', 'kubernetes'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'storage & api', items: ['s3', 'ecr', 'api-gateway', 'secrets-manager'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'deploy · iac · ci', items: ['docker', 'terraform', 'github-actions', 'gitlab-ci', 'argo'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'observe', items: ['grafana', 'prometheus'].map(bySlug).filter(Boolean) as Tool[] },
  ]
  let index = 0
  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-4">
      {bands.map((band, bi) => (
        <BandReveal
          key={band.label}
          i={bi}
          className="flex-1 rounded-xl bg-black/40 border border-white/[0.05] relative overflow-hidden"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(90deg, rgba(${hexToRgb(accent)}, 0.06) 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute top-2 left-3 text-[9px] tracking-[0.25em] uppercase"
            style={{ color: accent, opacity: 0.55 }}
          >
            {band.label}
          </div>
          <div className="absolute inset-0 pt-6 pl-3 pr-3 flex flex-wrap gap-1.5 items-center content-center">
            {band.items.map((t) => {
              const i = index++
              return <IconTile key={t.slug} tool={t} accent={accent} size="sm" index={i} />
            })}
          </div>
        </BandReveal>
      ))}
    </div>
  )
}

function WindowVisual({ tools, accent }: { tools: Tool[]; accent: string }) {
  const groups = [
    { tools: tools.slice(0, 4), pos: 'md:absolute md:top-[6%] md:left-[6%] md:w-[62%]' },
    { tools: tools.slice(4, 8), pos: 'md:absolute md:top-[30%] md:left-[30%] md:w-[62%]' },
    { tools: tools.slice(8, tools.length), pos: 'md:absolute md:top-[54%] md:left-[10%] md:w-[60%]' },
  ]
  let index = 0
  return (
    <div className="md:absolute md:inset-0 flex flex-col gap-2 p-4 md:p-0">
      {groups.map((g, i) => (
        <BandReveal
          key={i}
          i={i}
          className={`rounded-xl bg-[#151515] border border-white/[0.08] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)] overflow-hidden ${g.pos}`}
        >
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/[0.05] bg-black/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
          <div className="p-2 flex flex-wrap gap-1.5">
            {g.tools.map((t) => {
              const idx = index++
              return <IconTile key={t.slug} tool={t} accent={accent} size="sm" index={idx} />
            })}
          </div>
        </BandReveal>
      ))}
    </div>
  )
}

/** Data engineering - 3-column pipeline: ingest → transform → serve */
function PipelineVisual({ tools, accent }: { tools: Tool[]; accent: string }) {
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug)
  const cols = [
    { label: 'ingest', items: ['kafka', 'apache-nifi', 'debezium'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'transform', items: ['apache-spark', 'flink', 'airflow', 'dbt', 'apache-arrow', 'datafusion'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'store & serve', items: ['apache-hudi', 'iceberg', 'apache-paimon', 'trino'].map(bySlug).filter(Boolean) as Tool[] },
  ]
  let index = 0
  return (
    <div className="absolute inset-0 p-4">
      {/* flowing connectors between the columns */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-4 pointer-events-none hidden sm:block"
      >
        {[33, 66].map((x) => (
          <g key={x}>
            <line x1={x} y1="50" x2={x + 2} y2="50" stroke={accent} strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="1 1" />
            <line x1={x} y1="50" x2={x + 2} y2="50" stroke={accent} strokeOpacity="0.9" strokeWidth="0.7" strokeDasharray="0.6 2.4" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" from="3" to="0" dur="1.2s" repeatCount="indefinite" />
            </line>
          </g>
        ))}
      </svg>
      <div className="relative h-full grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cols.map((c, ci) => (
          <BandReveal
            key={c.label}
            i={ci}
            className="rounded-xl bg-black/40 border border-white/[0.05] p-2 pt-6 flex flex-col gap-1.5 items-stretch relative"
          >
            <div
              className="absolute top-2 left-2 text-[9px] tracking-[0.2em] uppercase"
              style={{ color: accent, opacity: 0.55 }}
            >
              {c.label}
            </div>
            {c.items.map((t) => {
              const i = index++
              return (
                <IconTile key={t.slug} tool={t} accent={accent} size="sm" index={i} className="justify-start" />
              )
            })}
          </BandReveal>
        ))}
      </div>
    </div>
  )
}

function ShelvesVisual({ tools, accent }: { tools: Tool[]; accent: string }) {
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug)
  const rows = [
    { label: 'warehouse · olap', items: ['redshift', 'clickhouse', 'snowflake', 'apache-doris', 'duckdb'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'oltp · document', items: ['postgres', 'mongo', 'documentdb', 'dynamodb'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'cache · graph · wide', items: ['redis', 'neo4j', 'cassandra'].map(bySlug).filter(Boolean) as Tool[] },
    { label: 'search · vector', items: ['elasticsearch', 'qdrant', 'pinecone'].map(bySlug).filter(Boolean) as Tool[] },
  ]
  let index = 0
  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-4">
      {rows.map((row, ri) => (
        <BandReveal
          key={row.label}
          i={ri}
          className="flex-1 rounded-xl bg-black/40 border border-white/[0.05] relative overflow-hidden"
        >
          <div
            className="absolute top-2 left-3 text-[9px] tracking-[0.25em] uppercase"
            style={{ color: accent, opacity: 0.55 }}
          >
            {row.label}
          </div>
          <div className="absolute inset-0 pt-6 pl-3 pr-3 flex flex-wrap gap-1.5 items-center content-center">
            {row.items.map((t) => {
              const i = index++
              return <IconTile key={t.slug} tool={t} accent={accent} size="sm" index={i} />
            })}
          </div>
        </BandReveal>
      ))}
    </div>
  )
}

/** GenAI - orchestrator card at the center + 3 labeled satellite groups */
function OrchestratorVisual({
  tools,
  accent,
  wide = false,
}: {
  tools: Tool[]
  accent: string
  wide?: boolean
}) {
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug)
  const framework = ['langchain', 'langgraph', 'llamaindex', 'crewai', 'semantic-kernel']
    .map(bySlug).filter(Boolean) as Tool[]
  const retrieval = ['rag', 'self-rag', 'nl2sql', 'mcp', 'mcp-web', 'a2a']
    .map(bySlug).filter(Boolean) as Tool[]
  const providers = ['claude', 'anthropic', 'openai', 'gemini', 'aws-bedrock', 'vertex-ai', 'azure-ai-studio', 'ollama', 'huggingface', 'langfuse']
    .map(bySlug).filter(Boolean) as Tool[]

  return (
    <div className="absolute inset-0 p-4">
      <div
        className={`relative h-full ${
          wide ? 'flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-3' : 'flex flex-col gap-2'
        }`}
      >
        <SatelliteGroup label="framework" items={framework} accent={accent} startIndex={0} groupIndex={0} />
        <SatelliteGroup label="retrieval · protocol" items={retrieval} accent={accent} startIndex={framework.length} groupIndex={1} highlight />
        <SatelliteGroup label="providers · observe" items={providers} accent={accent} startIndex={framework.length + retrieval.length} groupIndex={2} />
      </div>
    </div>
  )
}

function SatelliteGroup({
  label,
  items,
  accent,
  startIndex,
  groupIndex,
  highlight = false,
}: {
  label: string
  items: Tool[]
  accent: string
  startIndex: number
  groupIndex: number
  highlight?: boolean
}) {
  return (
    <BandReveal
      i={groupIndex}
      className={`rounded-xl border p-3 pt-6 flex flex-col gap-1.5 relative overflow-hidden ${
        highlight ? 'bg-black/60 border-white/[0.08]' : 'bg-black/35 border-white/[0.05]'
      }`}
    >
      {highlight && (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 50%, rgba(184, 180, 224, 0.12) 0%, transparent 65%)`,
          }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className="absolute top-2 left-3 text-[9px] tracking-[0.25em] uppercase"
        style={{ color: accent, opacity: 0.6 }}
      >
        {label}
      </div>
      <div className="relative flex flex-wrap gap-1.5">
        {items.map((t, i) => (
          <IconTile key={t.slug} tool={t} accent={accent} size="sm" index={startIndex + i} />
        ))}
      </div>
    </BandReveal>
  )
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const rgb = category.accentRgb
  const wide = category.span === 'wide'

  /* scroll parallax for the visual half */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [26, -26])

  /* cursor spotlight */
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.98 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex ${
        wide ? 'flex-col lg:flex-row' : 'flex-col'
      } rounded-3xl bg-[#0e0e0e] ring-1 ring-white/[0.06] hover:ring-white/[0.15] transition-all overflow-hidden ${
        wide ? 'md:col-span-2' : ''
      }`}
    >
      {/* slow border-beam on the wide card */}
      {wide && !reduce && (
        <div aria-hidden className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div
            className="absolute inset-[-150%] animate-[spin_9s_linear_infinite] opacity-60"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg 300deg, rgba(${rgb}, 0.55) 340deg, transparent 360deg)`,
            }}
          />
          <div className="absolute inset-px rounded-3xl bg-[#0e0e0e]" />
        </div>
      )}

      {/* ambient accent wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% -5%, rgba(${rgb}, 0.14) 0%, rgba(${rgb}, 0.05) 30%, transparent 65%)`,
        }}
      />
      {/* cursor spotlight - accent tinted, only on hover */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(480px circle at var(--mx, 50%) var(--my, 50%), rgba(${rgb}, 0.1), transparent 65%)`,
        }}
      />
      <div className="noise-overlay opacity-30 mix-blend-screen pointer-events-none" />

      {/* accent hairline that draws across the top on reveal */}
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px origin-left z-10"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.7), transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      <div
        className={`relative overflow-hidden ${
          wide
            ? 'min-h-[360px] lg:min-h-0 lg:h-auto lg:w-3/5 lg:border-b-0 lg:border-r border-b border-white/[0.05]'
            : 'min-h-[340px] md:h-72 md:min-h-0 border-b border-white/[0.05]'
        }`}
      >
        {/* parallax layer: the visual drifts slower than the page */}
        <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
          {category.visual === 'stack' && <LayeredVisual tools={category.tools} accent={category.accent} />}
          {category.visual === 'window' && <WindowVisual tools={category.tools} accent={category.accent} />}
          {category.visual === 'wave' && <PipelineVisual tools={category.tools} accent={category.accent} />}
          {category.visual === 'shelves' && <ShelvesVisual tools={category.tools} accent={category.accent} />}
          {category.visual === 'graph' && (
            <OrchestratorVisual tools={category.tools} accent={category.accent} wide={wide} />
          )}
        </motion.div>

        <div
          aria-hidden
          className={`absolute pointer-events-none ${
            wide
              ? 'inset-y-0 right-0 w-1/4 lg:bg-gradient-to-l lg:from-[#0e0e0e]'
              : 'inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#0e0e0e]/90'
          }`}
        />
      </div>

      <div className={`relative p-6 md:p-8 ${wide ? 'lg:w-2/5 lg:flex lg:flex-col lg:justify-center' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center border ring-1 ring-white/[0.05]"
            style={{
              background: `rgba(${rgb}, 0.12)`,
              color: category.accent,
              borderColor: category.accent,
            }}
            whileHover={reduce ? undefined : { rotate: -6, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <category.Icon className="w-5 h-5" strokeWidth={1.5} />
          </motion.div>
          <div
            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase"
            style={{ color: category.accent }}
          >
            {category.eyebrow}
          </div>
        </div>

        <h3 className="text-primary text-2xl md:text-3xl leading-tight font-medium tracking-tight mb-3">
          {category.name}{' '}
          <span className="italic font-serif">{category.serifTail}</span>
        </h3>

        <p className="text-primary/65 text-sm md:text-base leading-relaxed max-w-md">
          {category.description}
        </p>

        <div className="mt-6 flex items-center gap-4 text-primary/40 text-xs">
          <span>{category.tools.length} tools</span>
          <motion.span
            className="h-px flex-1 origin-left"
            style={{ background: `rgba(${rgb}, 0.25)` }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="tracking-[0.2em]">{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>
    </motion.div>
  )
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target])
  return <span ref={ref}>{n}</span>
}

export function Skills() {
  return (
    <section
      id="skills"
      className="relative bg-black py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(169, 233, 251, 0.06) 0%, transparent 65%)',
        }}
      />
      <div className="noise-overlay opacity-20 mix-blend-screen pointer-events-none" />

      {/* oversized dotted ghost word behind the grid */}
      <div
        aria-hidden
        className="dotted-text pointer-events-none select-none hidden md:block absolute -top-6 right-0 text-[18vw] leading-none font-medium tracking-tight"
      >
        stack
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-14 md:mb-20">
          <div className="text-primary/60 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4 flex items-center gap-3">
            <motion.span
              className="h-px w-8 origin-left bg-primary/40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            The stack I dream in
            <span className="text-primary/35 normal-case tracking-normal">
              · <CountUp target={TOTAL_TOOLS} /> tools
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] font-medium tracking-tight max-w-3xl">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
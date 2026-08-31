import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
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
  // Icon and typography scale down on narrow viewports so cards do not overflow.
  const iconSize = size === 'sm' ? 12 : 14
  const padding =
    size === 'sm' ? 'px-1.5 py-1 sm:px-2 sm:py-1.5' : 'px-2 py-1.5 sm:px-2.5 sm:py-2'
  const textSize = size === 'sm' ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-[11px]'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: 0.15 + Math.min(index, 14) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group/tile relative flex items-center gap-2 rounded-xl border border-white/[0.1] bg-black/60 backdrop-blur-[2px] shadow-[0_10px_28px_-10px_rgba(0,0,0,0.7)] whitespace-nowrap ${padding} ${className}`}
      style={style}
    >
      <BrandIcon
        slug={tool.slug}
        label={tool.label}
        size={iconSize}
        color={accent}
      />
      <span className={`text-primary/90 ${textSize} leading-none`}>
        {tool.label}
      </span>
    </motion.div>
  )
}

/** Cloud & Infrastructure - horizontal infra tiers, each labeled */
function LayeredVisual({
  tools,
  accent,
}: {
  tools: Tool[]
  accent: string
}) {
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug)
  const bands = [
    {
      label: 'compute',
      items: ['aws', 'ec2', 'ecs', 'lambda', 'kubernetes'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'storage & api',
      items: ['s3', 'ecr', 'api-gateway', 'secrets-manager'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'deploy · iac · ci',
      items: ['docker', 'terraform', 'github-actions', 'gitlab-ci', 'argo'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'observe',
      items: ['grafana', 'prometheus'].map(bySlug).filter(Boolean) as Tool[],
    },
  ]
  let index = 0
  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-4">
      {bands.map((band, bi) => (
        <div
          key={band.label}
          className="flex-1 rounded-xl bg-black/40 border border-white/[0.05] relative overflow-hidden"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(90deg, rgba(${
                bi === 0 ? '169, 233, 251' : bi === 1 ? '169, 233, 251' : '169, 233, 251'
              }, 0.06) 0%, transparent 60%)`,
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
              return (
                <IconTile
                  key={t.slug}
                  tool={t}
                  accent={accent}
                  size="sm"
                  index={i}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function WindowVisual({ tools, accent }: { tools: Tool[]; accent: string }) {
  const groups = [
    {
      tools: tools.slice(0, 4),
      pos: 'md:absolute md:top-[6%] md:left-[6%] md:w-[62%]',
    },
    {
      tools: tools.slice(4, 8),
      pos: 'md:absolute md:top-[30%] md:left-[30%] md:w-[62%]',
    },
    {
      tools: tools.slice(8, tools.length),
      pos: 'md:absolute md:top-[54%] md:left-[10%] md:w-[60%]',
    },
  ]
  let index = 0
  return (
    <div className="md:absolute md:inset-0 flex flex-col gap-2 p-4 md:p-0">
      {groups.map((g, i) => (
        <div
          key={i}
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
              return (
                <IconTile
                  key={t.slug}
                  tool={t}
                  accent={accent}
                  size="sm"
                  index={idx}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Data engineering - 3-column pipeline: ingest → transform → serve */
function PipelineVisual({
  tools,
  accent,
}: {
  tools: Tool[]
  accent: string
}) {
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug)
  const cols = [
    {
      label: 'ingest',
      items: ['kafka', 'apache-nifi', 'debezium'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'transform',
      items: ['apache-spark', 'flink', 'airflow', 'dbt', 'apache-arrow', 'datafusion'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'store & serve',
      items: ['apache-hudi', 'iceberg', 'apache-paimon', 'trino'].map(bySlug).filter(Boolean) as Tool[],
    },
  ]
  let index = 0
  return (
    <div className="absolute inset-0 p-4">
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-4 pointer-events-none hidden sm:block"
      >
        <line x1="33" y1="50" x2="35" y2="50" stroke={accent} strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="1 1" />
        <line x1="66" y1="50" x2="68" y2="50" stroke={accent} strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="1 1" />
      </svg>
      <div className="relative h-full grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cols.map((c) => (
          <div
            key={c.label}
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
                <IconTile
                  key={t.slug}
                  tool={t}
                  accent={accent}
                  size="sm"
                  index={i}
                  className="justify-start"
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function ShelvesVisual({ tools, accent }: { tools: Tool[]; accent: string }) {
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug)
  const rows = [
    {
      label: 'warehouse · olap',
      items: ['redshift', 'clickhouse', 'snowflake', 'apache-doris', 'duckdb'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'oltp · document',
      items: ['postgres', 'mongo', 'documentdb', 'dynamodb'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'cache · graph · wide',
      items: ['redis', 'neo4j', 'cassandra'].map(bySlug).filter(Boolean) as Tool[],
    },
    {
      label: 'search · vector',
      items: ['elasticsearch', 'qdrant', 'pinecone'].map(bySlug).filter(Boolean) as Tool[],
    },
  ]
  let index = 0
  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-4">
      {rows.map((row) => (
        <div
          key={row.label}
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
              return (
                <IconTile
                  key={t.slug}
                  tool={t}
                  accent={accent}
                  size="sm"
                  index={i}
                />
              )
            })}
          </div>
        </div>
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
  const framework = [
    'langchain',
    'langgraph',
    'llamaindex',
    'crewai',
    'semantic-kernel',
  ]
    .map(bySlug)
    .filter(Boolean) as Tool[]
  const retrieval = ['rag', 'self-rag', 'nl2sql', 'mcp', 'mcp-web', 'a2a']
    .map(bySlug)
    .filter(Boolean) as Tool[]
  const providers = [
    'claude',
    'anthropic',
    'openai',
    'gemini',
    'aws-bedrock',
    'vertex-ai',
    'azure-ai-studio',
    'ollama',
    'huggingface',
    'langfuse',
  ]
    .map(bySlug)
    .filter(Boolean) as Tool[]

  return (
    <div className="absolute inset-0 p-4">
      <div
        className={`relative h-full ${
          wide
            ? 'flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-3'
            : 'flex flex-col gap-2'
        }`}
      >
        <SatelliteGroup
          label="framework"
          items={framework}
          accent={accent}
          startIndex={0}
        />
        <SatelliteGroup
          label="retrieval · protocol"
          items={retrieval}
          accent={accent}
          startIndex={framework.length}
          highlight
        />
        <SatelliteGroup
          label="providers · observe"
          items={providers}
          accent={accent}
          startIndex={framework.length + retrieval.length}
        />
      </div>
    </div>
  )
}

function SatelliteGroup({
  label,
  items,
  accent,
  startIndex,
  highlight = false,
}: {
  label: string
  items: Tool[]
  accent: string
  startIndex: number
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-3 pt-6 flex flex-col gap-1.5 relative overflow-hidden ${
        highlight
          ? 'bg-black/60 border-white/[0.08]'
          : 'bg-black/35 border-white/[0.05]'
      }`}
    >
      {highlight && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 50%, rgba(184, 180, 224, 0.12) 0%, transparent 65%)`,
          }}
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
          <IconTile
            key={t.slug}
            tool={t}
            accent={accent}
            size="sm"
            index={startIndex + i}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryCard({
  category,
  index,
}: {
  category: Category
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const rgb = category.accentRgb
  const wide = category.span === 'wide'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative flex ${
        wide ? 'flex-col lg:flex-row' : 'flex-col'
      } rounded-3xl bg-[#0e0e0e] ring-1 ring-white/[0.06] hover:ring-white/[0.15] transition-all overflow-hidden ${
        wide ? 'md:col-span-2' : ''
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% -5%, rgba(${rgb}, 0.14) 0%, rgba(${rgb}, 0.05) 30%, transparent 65%)`,
        }}
      />
      <div className="noise-overlay opacity-30 mix-blend-screen pointer-events-none" />

      <div
        className={`relative overflow-hidden ${
          wide
            ? 'min-h-[360px] lg:min-h-0 lg:h-auto lg:w-3/5 lg:border-b-0 lg:border-r border-b border-white/[0.05]'
            : 'min-h-[340px] md:h-72 md:min-h-0 border-b border-white/[0.05]'
        }`}
      >
        {category.visual === 'stack' && (
          <LayeredVisual tools={category.tools} accent={category.accent} />
        )}
        {category.visual === 'window' && (
          <WindowVisual tools={category.tools} accent={category.accent} />
        )}
        {category.visual === 'wave' && (
          <PipelineVisual tools={category.tools} accent={category.accent} />
        )}
        {category.visual === 'shelves' && (
          <ShelvesVisual tools={category.tools} accent={category.accent} />
        )}
        {category.visual === 'graph' && (
          <OrchestratorVisual
            tools={category.tools}
            accent={category.accent}
            wide={wide}
          />
        )}

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
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border ring-1 ring-white/[0.05]"
            style={{
              background: `rgba(${rgb}, 0.12)`,
              color: category.accent,
              borderColor: category.accent,
            }}
          >
            <category.Icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
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
          <span className="h-px flex-1 bg-white/[0.05]" />
          <span className="tracking-[0.2em]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </motion.div>
  )
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

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-14 md:mb-20">
          <div className="text-primary/60 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4">
            The stack I dream in
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

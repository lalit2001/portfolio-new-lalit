import { motion } from 'framer-motion'

/**
 * Ported from super-agent/landing-page HeroFlow.
 * Live animated dataflow: user → matcher → agent → (sandbox / connectors /
 * memory) → artifact. Packets travel every edge on staggered loops so the
 * whole thing reads as a running platform, not a static screenshot.
 */

const NODES = {
  user: { x: 60, y: 180 },
  matcher: { x: 240, y: 180 },
  agent: { x: 420, y: 180 },
  sandbox: { x: 620, y: 80 },
  connectors: { x: 620, y: 180 },
  memory: { x: 620, y: 280 },
  artifact: { x: 830, y: 180 },
} as const

const EDGES = [
  { d: 'M120 180 L200 180', delay: 0 },
  { d: 'M300 180 L380 180', delay: 0.4 },
  { d: 'M470 180 C 510 180, 540 80, 580 80', delay: 0.8 },
  { d: 'M470 180 L580 180', delay: 0.8 },
  { d: 'M470 180 C 510 180, 540 280, 580 280', delay: 0.8 },
  { d: 'M660 80 C 710 80, 730 180, 790 180', delay: 1.6 },
  { d: 'M660 180 L790 180', delay: 1.6 },
  { d: 'M660 280 C 710 280, 730 180, 790 180', delay: 1.6 },
]

export function AgentPlatformFlow() {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 900 360"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {EDGES.map((e, i) => (
          <motion.path
            key={i}
            d={e.d}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.2"
            strokeDasharray="4 5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.05 }}
          />
        ))}

        {EDGES.map((e, i) => (
          <motion.circle
            key={i}
            r="3.5"
            fill="#ffdba0"
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6 + e.delay + (i % 3) * 0.15,
              repeatDelay: 2.4,
            }}
          >
            <animateMotion
              dur="1.6s"
              repeatCount="indefinite"
              begin={`${0.6 + e.delay + (i % 3) * 0.15}s`}
              path={e.d}
            />
          </motion.circle>
        ))}

        <ChatNode {...NODES.user} label="you" hint="Build me a deck" delay={0} />
        <ServiceNode
          {...NODES.matcher}
          label="matcher"
          glyph={<MatcherGlyph />}
          tag="finds skills"
          delay={0.15}
        />
        <AgentNode {...NODES.agent} label="agent" delay={0.3} />
        <ServiceNode
          {...NODES.sandbox}
          label="sandbox"
          glyph={<SandboxGlyph />}
          tag="runs code"
          delay={0.45}
        />
        <ServiceNode
          {...NODES.connectors}
          label="connectors"
          glyph={<ConnectorGlyph />}
          tag="mcp / postgres"
          delay={0.55}
        />
        <ServiceNode
          {...NODES.memory}
          label="memory"
          glyph={<MemoryGlyph />}
          tag="writes fact"
          delay={0.65}
        />
        <ArtifactNode
          {...NODES.artifact}
          label="artifact"
          hint="deck.pptx"
          delay={0.9}
        />
      </svg>
    </div>
  )
}

// ── Nodes ──────────────────────────────────────────────────

function ChatNode({
  x,
  y,
  label,
  hint,
  delay,
}: {
  x: number
  y: number
  label: string
  hint: string
  delay: number
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <rect
        x={x}
        y={y - 30}
        width="130"
        height="60"
        rx="14"
        fill="#faf7f0"
        stroke="#0e2f4a"
        strokeWidth="1.4"
      />
      <text
        x={x + 14}
        y={y - 8}
        fill="#0e2f4a"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
      >
        {label}
      </text>
      <text
        x={x + 14}
        y={y + 8}
        fill="#0e2f4a"
        opacity="0.7"
        fontFamily="Inter, sans-serif"
        fontSize="11"
      >
        {hint}
      </text>
      <rect
        x={x + 14}
        y={y + 15}
        width="80"
        height="4"
        rx="2"
        fill="#0e2f4a"
        opacity="0.35"
      />
    </motion.g>
  )
}

function AgentNode({
  x,
  y,
  delay,
  label,
}: {
  x: number
  y: number
  delay: number
  label: string
}) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 260,
        damping: 22,
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <motion.circle
        cx={x}
        cy={y}
        r="42"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1"
        fill="none"
        animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      <circle
        cx={x}
        cy={y}
        r="42"
        fill="#faf7f0"
        stroke="#0e2f4a"
        strokeWidth="1.6"
      />
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fill="#0e2f4a"
        fontFamily="'Instrument Serif', serif"
        fontSize="20"
        fontStyle="italic"
      >
        {label}
      </text>
    </motion.g>
  )
}

function ServiceNode({
  x,
  y,
  label,
  glyph,
  tag,
  delay,
}: {
  x: number
  y: number
  label: string
  glyph: React.ReactNode
  tag: string
  delay: number
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.rect
        x={x - 40}
        y={y - 24}
        width="120"
        height="48"
        rx="12"
        fill="#faf7f0"
        stroke="#0e2f4a"
        strokeWidth="1.4"
        animate={{ y: [y - 24, y - 26, y - 24] }}
        transition={{
          duration: 4 + delay * 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <g transform={`translate(${x - 30}, ${y - 12}) scale(1)`}>{glyph}</g>
      <text
        x={x - 8}
        y={y - 3}
        fill="#0e2f4a"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
      >
        {label}
      </text>
      <text
        x={x - 8}
        y={y + 11}
        fill="#0e2f4a"
        opacity="0.6"
        fontFamily="Inter, sans-serif"
        fontSize="10"
      >
        {tag}
      </text>
    </motion.g>
  )
}

function ArtifactNode({
  x,
  y,
  label,
  hint,
  delay,
}: {
  x: number
  y: number
  label: string
  hint: string
  delay: number
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <rect
        x={x}
        y={y - 30}
        width="60"
        height="60"
        rx="14"
        fill="#0e2f4a"
        stroke="#0e2f4a"
      />
      <text
        x={x + 30}
        y={y - 10}
        textAnchor="middle"
        fill="#ffdba0"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
      >
        {label}
      </text>
      <motion.circle
        cx={x + 30}
        cy={y + 6}
        r="10"
        fill="#ffdba0"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ transformOrigin: `${x + 30}px ${y + 6}px` }}
      />
      <text
        x={x + 30}
        y={y + 10}
        textAnchor="middle"
        fill="#0e2f4a"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
      >
        ↓
      </text>
      <text
        x={x + 30}
        y={y + 46}
        textAnchor="middle"
        fill="rgba(255, 255, 255, 0.9)"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
      >
        {hint}
      </text>
    </motion.g>
  )
}

// ── Glyphs ─────────────────────────────────────────────────

function MatcherGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0e2f4a"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="17" y1="17" x2="21" y2="21" />
    </svg>
  )
}

function SandboxGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0e2f4a"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
    </svg>
  )
}

function ConnectorGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0e2f4a"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 2v6" />
      <path d="M15 2v6" />
      <path d="M6 8h12v3a6 6 0 01-12 0V8z" />
      <path d="M12 17v4" />
    </svg>
  )
}

function MemoryGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0e2f4a"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3a3 3 0 00-3 3v.5A3 3 0 005 9a3 3 0 000 6a3 3 0 002 3v0a3 3 0 003 3h1V3z" />
      <path d="M14 3a3 3 0 013 3v.5A3 3 0 0119 9a3 3 0 010 6a3 3 0 01-2 3v0a3 3 0 01-3 3h-1V3z" />
    </svg>
  )
}

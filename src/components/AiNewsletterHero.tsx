import { useEffect, useState } from 'react'

/**
 * Ported from ai-newsletter/app/(public)/HomeClient.tsx - just the hero
 * masthead. Same monospaced display type + character-scramble reveal on
 * "AI SIGNAL / TECHNICAL / NEWSLETTER { }", plus the label row above and
 * the lead paragraph below. No CTAs, no stats strip.
 */

const GLYPHS = '/{}[]<>=+-*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function useScramble(text: string, active: boolean, speed = 32) {
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (!active) return
    let frame = 0
    const total = text.length
    let raf: ReturnType<typeof setTimeout>
    const tick = () => {
      const revealed = Math.floor(frame / 2)
      let s = ''
      for (let i = 0; i < total; i++) {
        if (text[i] === ' ' || text[i] === '\n') {
          s += text[i]
          continue
        }
        s += i < revealed
          ? text[i]
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setOut(s)
      frame++
      if (revealed <= total) {
        raf = setTimeout(() => requestAnimationFrame(tick), speed)
      }
    }
    tick()
    return () => clearTimeout(raf)
  }, [text, active, speed])
  return out
}

export function AiNewsletterHero() {
  const [go, setGo] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGo(true), 120)
    return () => clearTimeout(t)
  }, [])

  const h1 = useScramble('AI SIGNAL', go)
  const h2 = useScramble('TECHNICAL', go)
  const h3 = useScramble('NEWSLETTER', go)

  return (
    <div
      className="relative w-full h-full flex flex-col justify-center overflow-hidden"
      style={{
        background: '#0a0a0a',
        color: '#f0ede6',
        fontFamily:
          "'Space Mono', 'IBM Plex Mono', ui-monospace, monospace",
        containerType: 'inline-size',
      }}
    >
      <div className="relative z-10 w-full px-[5%] py-[4%]">
        {/* Top label row */}
        <div className="flex items-baseline justify-between mb-[4%] gap-2">
          <span
            className="uppercase truncate"
            style={{
              color: '#8a857c',
              fontSize: 'clamp(7px, 1.3cqw, 11px)',
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: '#8a857c' }}>{'{ 01 }'}</span>
            &nbsp;&nbsp;AI DEVELOPER NEWSLETTER
          </span>
          <span
            className="uppercase truncate"
            style={{
              color: '#5a564f',
              fontSize: 'clamp(6px, 1.1cqw, 10px)',
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
            }}
          >
            AI-GENERATED - EST 2024
          </span>
        </div>

        {/* Big display type - scales to container width via cqw units */}
        <h1
          className="m-0"
          style={{
            lineHeight: 0.9,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(20px, 10cqw, 96px)',
            color: '#f0ede6',
          }}
        >
          <span className="block whitespace-nowrap">{h1}</span>
          <span
            className="block whitespace-nowrap"
            style={{ color: '#e8e4dc' }}
          >
            {h2}
          </span>
          <span className="block whitespace-nowrap">
            {h3}
            <span style={{ color: '#8a857c' }}>{' { }'}</span>
          </span>
        </h1>

        {/* Lead */}
        <p
          className="mt-[4%]"
          style={{
            color: '#e8e4dc',
            fontSize: 'clamp(9px, 1.5cqw, 14px)',
            lineHeight: 1.5,
            maxWidth: '80%',
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          }}
        >
          Deep technical coverage of LLMs, AI agents, and developer tooling -
          crawled from 20+ sources, written by AI agents, reviewed for
          accuracy.
        </p>
      </div>

      {/* Grain overlay to match the source's dark editorial feel */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}

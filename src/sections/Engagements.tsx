import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'

/**
 * Testimonials - center-highlighted infinite carousel.
 *
 * Ported from the standalone HTML mock. Three cards are visible at once
 * (one on mobile), the middle one is scaled up with an accent bloom and
 * the sides dim. Cards orbit as a true loop - when the last card is
 * reached, subsequent cards wrap in from the opposite edge without a
 * visible snap (position math via `norm()` + a temporary `no-anim` class
 * for the wrapping slide).
 *
 * QUOTES ARE DRAFTS - replace once each client approves their wording.
 */

type AccentKey = 'sky' | 'mint' | 'gold' | 'lav' | 'pink'

interface Testimonial {
  name: string
  initials?: string
  role: string
  company: string
  companyUrl: string
  linkedin?: string
  photo?: string
  anon?: boolean
  accent: AccentKey
  tag: string
  /** HTML string; wrap emphasis phrases in <em> for italic serif accent. */
  quoteHtml: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rakesh Jena',
    initials: 'RJ',
    role: 'CTO',
    company: 'Groov',
    companyUrl: 'https://www.wearegroov.io/',
    linkedin: 'https://www.linkedin.com/in/rakesh-jena-a114921/',
    photo: '/clients/rakesh-jena.png',
    accent: 'sky',
    tag: 'Data Platform',
    quoteHtml:
      "He was one of the first engineers on our backend and stood up the whole thing on Spring Boot - a scalable <em>analytics platform and framework</em> we still extend today. On top of that, the fintech AI agents he shipped cut our underwriting time down sharply and consistently make better calls than a human doing it manually. Solid platform work plus applied AI in one person is rare.",
  },
  {
    name: 'Name withheld',
    anon: true,
    role: 'CTO',
    company: 'Yoloh',
    companyUrl: 'https://www.yoloh.com/',
    accent: 'mint',
    tag: 'OCR · Graph RAG',
    quoteHtml:
      "I can't share specifics, but two things I can. Pre-LLM, he built the OCR engine that pulls meaningful data out of any insurance policy document, whatever the format. When LLMs landed, he was one of the first people I've seen ship production <em>Graph RAG</em> - plus an LLM copilot for our team - when those ideas were still fringe. Two eras of AI, both shipped without drama, and my team is sharper for it.",
  },
  {
    name: 'Rahul Chahar',
    initials: 'RC',
    role: 'CTO',
    company: 'PullLogic',
    companyUrl: 'https://pulllogic.com/',
    linkedin: 'https://www.linkedin.com/in/rahul-chahar-5876a49/',
    photo: '/clients/rahul-chahar.png',
    accent: 'gold',
    tag: 'Lakehouse',
    quoteHtml:
      "When he joined, we were on an old-school MySQL setup held together by cron jobs. He designed, built and scaled a <em>config-driven lakehouse</em> on Iceberg and Apache Doris - fully open-source, any cloud - and it's still running the business without him touching it. The migration was the least dramatic part. That's the compliment.",
  },
  {
    name: 'Prajwal Kr',
    initials: 'PK',
    role: 'Head of Validation & Innovation',
    company: 'Merck',
    companyUrl: 'https://www.merckgroup.com/en',
    linkedin: 'https://www.linkedin.com/in/prajwal-kr-7005ab20/',
    photo: '/clients/prajwal-kr.png',
    accent: 'lav',
    tag: 'PRAX AI',
    quoteHtml:
      "Periodic reviews used to cost our teams weeks - hundreds of tables, lakhs of documents, all manual. <em>PRAX AI</em>, the tool he built with us, automates the ingestion and the AI analysis and hands reviewers answers with evidence attached. Doing that in a validated pharma environment is the hard part. He got that from day one.",
  },
  {
    name: 'Sanjeeb Mohapatra',
    initials: 'SM',
    role: 'Technical Data Lead · Mentor',
    company: 'Syngenta',
    companyUrl: 'https://www.syngenta.com/',
    linkedin: 'https://www.linkedin.com/in/sanjeeb-mohapatra/',
    photo: '/clients/sanjeeb.png',
    accent: 'pink',
    tag: 'Mentor',
    quoteHtml:
      "Lalit is exceptional across data, AI and Gen AI - his scalable pipelines, architectures and enterprise AI systems are truly impressive. What sets him apart is <em>bridging technical complexity with business acumen</em> to deliver solutions that drive tangible value. A game-changer in data engineering and AI. Highly recommended.",
  },
]

const AUTO_MS = 5500
const SLIDE_MS = 750

/**
 * Normalise a raw offset into the range [-N/2, N/2] so any two indices
 * always resolve to a shortest circular distance.
 */
const norm = (o: number, N: number) => {
  let n = ((o % N) + N) % N
  if (n > N / 2) n -= N
  return n
}

function Carousel() {
  const N = TESTIMONIALS.length
  const rootRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])
  const positions = useRef<number[]>(TESTIMONIALS.map((_, i) => norm(i, N)))
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [visible, setVisible] = useState(false)
  const [height, setHeight] = useState<number | null>(null)
  const jumpingRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduced(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  const applyState = useCallback((el: HTMLDivElement, o: number) => {
    el.style.setProperty('--o', String(o))
    const a = Math.abs(o)
    el.classList.toggle('is-center', a === 0)
    el.classList.toggle('is-side', a === 1)
    el.classList.toggle('is-hidden', a >= 2)
    el.setAttribute('aria-hidden', a === 0 ? 'false' : 'true')
    el.querySelectorAll<HTMLAnchorElement>('a').forEach((l) => {
      l.tabIndex = a === 0 ? 0 : -1
    })
  }, [])

  const restartCenter = useCallback((el: HTMLElement) => {
    el.querySelectorAll<HTMLElement>('.eng-quote, .eng-bar > i').forEach((n) => {
      n.style.animation = 'none'
      // Force reflow so setting animation back to '' re-triggers.
      void n.offsetWidth
      n.style.animation = ''
    })
  }, [])

  const step = useCallback(
    (delta: -1 | 1) => {
      slideRefs.current.forEach((el, i) => {
        if (!el) return
        const raw = positions.current[i] + delta
        const n = norm(raw, N)
        if (raw === n) {
          applyState(el, n)
        } else if (Math.abs(n) <= 1) {
          // wraps INTO view: snap to entry side (no anim) then glide in
          el.classList.add('no-anim')
          applyState(el, n - delta)
          void el.offsetWidth
          el.classList.remove('no-anim')
          applyState(el, n)
        } else {
          // wraps OUT of view: glide off, then snap around silently
          applyState(el, raw)
          window.setTimeout(() => {
            el.classList.add('no-anim')
            applyState(el, n)
            void el.offsetWidth
            el.classList.remove('no-anim')
          }, SLIDE_MS + 30)
        }
        positions.current[i] = n
      })
      setActive((a) => (a - delta + N) % N)
    },
    [N, applyState],
  )

  const next = useCallback(() => step(-1), [step])
  const prev = useCallback(() => step(1), [step])

  const goTo = useCallback(
    (k: number) => {
      if (k === active || jumpingRef.current) return
      const diff = norm(k - active, N)
      if (diff === 0) return
      jumpingRef.current = true
      let left = Math.abs(diff)
      const tick = () => {
        if (diff > 0) next()
        else prev()
        left -= 1
        if (left > 0) window.setTimeout(tick, 260)
        else jumpingRef.current = false
      }
      tick()
    },
    [active, N, next, prev],
  )

  // Restart the quote + progress bar animation each time the center changes.
  useEffect(() => {
    const idx = positions.current.findIndex((p) => p === 0)
    const el = idx >= 0 ? slideRefs.current[idx] : null
    if (el) restartCenter(el)
  }, [active, restartCenter])

  useEffect(() => {
    if (paused || reduced || !visible) return
    const id = window.setInterval(next, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused, reduced, visible, next])

  // Match container height to the tallest card so absolute-positioned
  // slides don't collapse the layout.
  useEffect(() => {
    const measure = () => {
      let h = 0
      slideRefs.current.forEach((el) => {
        if (!el) return
        const c = el.firstElementChild as HTMLElement | null
        if (!c) return
        const priorMinH = c.style.minHeight
        c.style.minHeight = '0'
        h = Math.max(h, c.offsetHeight)
        c.style.minHeight = priorMinH
      })
      if (h > 0) setHeight(h)
    }
    measure()
    window.addEventListener('resize', measure)
    // Re-measure once web fonts are ready (Instrument Serif shifts widths).
    const fonts = (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts
    fonts?.ready?.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setVisible(e.isIntersecting)
          if (e.isIntersecting) revealRef.current?.classList.add('in')
        })
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (!el) return
      applyState(el, positions.current[i])
    })
  }, [applyState])

  const swipeStart = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStart.current == null) return
    const dx = e.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(dx) > 45) {
      if (dx < 0) next()
      else prev()
    }
  }

  return (
    <div
      ref={rootRef}
      className={`eng-tst${paused ? ' paused' : ''}`}
      style={{ ['--dur' as string]: `${AUTO_MS}ms` } as CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ScopedStyles />

      <div className="eng-noise" aria-hidden />
      <div className="eng-canopy" aria-hidden>
        <div className="eng-wash" />
        <div className="eng-lines" />
        <div
          className="eng-cell"
          style={{
            ['--c' as string]: 'var(--lav)',
            left: 'calc(50% + 1px)',
            top: '65px',
            animationDelay: '0s',
          } as CSSProperties}
        />
        <div
          className="eng-cell"
          style={{
            ['--c' as string]: 'var(--sky)',
            left: 'calc(50% - 191px)',
            top: '129px',
            animationDelay: '2.3s',
          } as CSSProperties}
        />
        <div
          className="eng-cell"
          style={{
            ['--c' as string]: 'var(--mint)',
            left: 'calc(50% + 193px)',
            top: '1px',
            animationDelay: '4.6s',
          } as CSSProperties}
        />
        <div
          className="eng-cell"
          style={{
            ['--c' as string]: 'var(--gold)',
            left: 'calc(50% - 63px)',
            top: '1px',
            animationDelay: '3.4s',
          } as CSSProperties}
        />
        <div className="eng-streak" />
        <div className="eng-streak v" style={{ left: 'calc(50% + 128px)' }} />
      </div>

      <div className="eng-reveal" ref={revealRef}>
        <div className="eng-head">
          <div className="eng-eyebrow">
            <span className="eng-rule" />
            People I&apos;ve shipped with
            <span className="eng-rule" />
          </div>
          <h2>
            <span className="eng-w"><span>What</span></span>{' '}
            <span className="eng-w"><span>people</span></span>{' '}
            <span className="eng-w"><span className="eng-serif">say</span></span>
          </h2>
          <p className="eng-sub">
            CTOs and leaders I&apos;ve built data platforms, AI systems and
            architecture with &mdash; in their own words.
          </p>
        </div>

        <div className="eng-stage">
          <div
            className="eng-track"
            style={{ height: height ? `${height}px` : undefined }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                ref={(el) => {
                  slideRefs.current[i] = el
                }}
                className="eng-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${N}`}
                style={{ ['--acc' as string]: `var(--${t.accent})` } as CSSProperties}
                onClick={(e) => {
                  const el = e.currentTarget
                  if (
                    el.classList.contains('is-side') &&
                    !(e.target as HTMLElement).closest('a')
                  ) {
                    goTo(i)
                  }
                }}
              >
                <article className="eng-card">
                  <span className="eng-cnoise" aria-hidden />
                  <span className="eng-hair" aria-hidden />

                  {t.anon ? (
                    <span className="eng-pic anon" aria-hidden>
                      <span className="eng-sil" />
                    </span>
                  ) : (
                    <span className="eng-pic">
                      <span aria-hidden>{t.initials}</span>
                      {t.photo && (
                        <img
                          src={t.photo}
                          alt={t.name}
                          onError={(e) => e.currentTarget.classList.add('missing')}
                        />
                      )}
                    </span>
                  )}

                  <div className="eng-who">
                    <div className="eng-n">
                      {t.linkedin ? (
                        <a href={t.linkedin} target="_blank" rel="noreferrer">
                          {t.name}
                        </a>
                      ) : (
                        t.name
                      )}
                      {t.anon && (
                        <span className="eng-lock">
                          <Lock size={9} strokeWidth={2.4} /> NDA
                        </span>
                      )}
                    </div>
                    <div className="eng-r">
                      {t.role} ·{' '}
                      <a href={t.companyUrl} target="_blank" rel="noreferrer">
                        {t.company}
                      </a>
                    </div>
                  </div>

                  <p
                    className="eng-quote"
                    dangerouslySetInnerHTML={{
                      __html: `“${t.quoteHtml}”`,
                    }}
                  />

                  <div className="eng-meta">
                    <span className="eng-tag">{t.tag}</span>
                    <span className="eng-bar"><i /></span>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="eng-controls">
            <button
              className="eng-btn"
              aria-label="Previous testimonial"
              onClick={prev}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="eng-dots" role="tablist">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={`eng-dot${i === active ? ' on' : ''}`}
                  style={{ ['--acc' as string]: `var(--${t.accent})` } as CSSProperties}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-selected={i === active}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <span className="eng-count">
              <b>{String(active + 1).padStart(2, '0')}</b> /{' '}
              {String(N).padStart(2, '0')}
            </span>
            <button
              className="eng-btn"
              aria-label="Next testimonial"
              onClick={next}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="eng-also">
            Also embedded with{' '}
            <span>Ernst &amp; Young</span> (Life Sciences &amp; Automotive AI),{' '}
            <span>ByteIQ Analytics</span> (FinTech lakehouses), and{' '}
            <span>InvoLead</span> (agentic NL-to-SQL).
          </div>
        </div>
      </div>
    </div>
  )
}

function ScopedStyles() {
  return (
    <style>{`
      .eng-tst {
        --cream: #DEDBC8;
        --sky: 169,233,251;
        --mint: 136,231,194;
        --gold: 254,215,146;
        --lav: 184,180,224;
        --pink: 252,215,237;
        --ease: cubic-bezier(.22,1,.36,1);
        --cw: 360px;
        --gap: 22px;
        position: relative;
        overflow: hidden;
        background: #000;
        padding: 0 0 7rem;
        color: var(--cream);
      }
      @media (max-width: 1140px) { .eng-tst { --cw: 320px; --gap: 18px; } }
      @media (max-width: 760px)  { .eng-tst { --cw: min(84vw, 340px); --gap: 14px; } }

      .eng-noise {
        position: absolute; inset: 0; pointer-events: none;
        opacity: .2; mix-blend-mode: screen; z-index: 3;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      }

      .eng-canopy {
        position: absolute; left: 50%; top: 0;
        width: min(1100px, 120vw); height: 460px;
        transform: translateX(-50%);
        pointer-events: none; z-index: 0;
      }
      .eng-lines {
        position: absolute; inset: 0;
        background-image:
          linear-gradient(to right, rgba(var(--lav),.16) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(var(--lav),.16) 1px, transparent 1px);
        background-size: 64px 64px;
        background-position: center top;
        -webkit-mask-image: radial-gradient(ellipse 55% 75% at 50% 0%, #000 0%, rgba(0,0,0,.5) 45%, transparent 75%);
        mask-image: radial-gradient(ellipse 55% 75% at 50% 0%, #000 0%, rgba(0,0,0,.5) 45%, transparent 75%);
      }
      .eng-wash {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse 50% 70% at 50% 0%, rgba(var(--lav),.22) 0%, rgba(var(--sky),.06) 40%, transparent 70%);
      }
      .eng-cell {
        position: absolute; width: 63px; height: 63px;
        background: radial-gradient(circle at 50% 50%, rgba(var(--c),.35), rgba(var(--c),.08) 70%);
        box-shadow: 0 0 40px rgba(var(--c),.25);
        opacity: 0;
        animation: eng-cellpulse 7s var(--ease) infinite;
      }
      @keyframes eng-cellpulse { 0%, 100% { opacity: 0; } 35%, 55% { opacity: 1; } }
      .eng-streak {
        position: absolute; height: 1px; width: 140px; top: 128px; left: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent);
        animation: eng-streak 6s linear infinite;
        opacity: .7;
      }
      .eng-streak.v {
        width: 1px; height: 140px; top: 0; left: auto;
        background: linear-gradient(180deg, transparent, rgba(255,255,255,.8), transparent);
        animation: eng-streakv 7.5s linear infinite 2s;
      }
      @keyframes eng-streak { from { transform: translateX(0); } to { transform: translateX(1100px); } }
      @keyframes eng-streakv {
        0%   { transform: translateY(-140px); opacity: .7; }
        70%  { opacity: .7; }
        100% { transform: translateY(120px); opacity: 0; }
      }

      .eng-head {
        position: relative; z-index: 2; text-align: center;
        padding: 9rem 1.5rem 0; max-width: 46rem; margin: 0 auto;
      }
      .eng-eyebrow {
        display: inline-flex; align-items: center; gap: .8rem;
        font-size: .7rem; letter-spacing: .25em; text-transform: uppercase;
        color: rgba(222,219,200,.6); margin-bottom: 1.2rem;
      }
      .eng-rule {
        display: inline-block;
        height: 1px; width: 1.8rem;
        background: rgba(222,219,200,.4);
        transform: scaleX(0);
        transition: transform .8s var(--ease) .15s;
      }
      .eng-eyebrow > .eng-rule:first-child { transform-origin: right; }
      .eng-eyebrow > .eng-rule:last-child  { transform-origin: left; }
      .eng-reveal.in .eng-rule { transform: scaleX(1); }
      .eng-head h2 {
        margin: 0; font-weight: 400; letter-spacing: -.025em; line-height: 1;
        font-size: clamp(2.4rem, 6vw, 4.4rem); color: var(--cream);
      }
      .eng-w { display: inline-block; overflow: hidden; vertical-align: bottom; padding-bottom: .08em; }
      .eng-w > span { display: inline-block; transform: translateY(110%); transition: transform .8s var(--ease); }
      .eng-w:nth-child(2) > span { transition-delay: .08s; }
      .eng-w:nth-child(3) > span { transition-delay: .16s; }
      .eng-reveal.in .eng-w > span { transform: none; }
      .eng-serif { font-family: 'Instrument Serif', serif; font-style: italic; }
      .eng-sub {
        margin: 1.3rem auto 0; max-width: 30rem;
        color: rgba(222,219,200,.55);
        font-size: .95rem; line-height: 1.65;
        opacity: 0; transform: translateY(12px);
        transition: all .8s var(--ease) .35s;
      }
      .eng-reveal.in .eng-sub { opacity: 1; transform: none; }

      .eng-stage {
        position: relative; z-index: 2; margin: 4rem auto 0;
        opacity: 0; transform: translateY(30px); filter: blur(8px);
        transition:
          opacity .9s var(--ease) .45s,
          transform .9s var(--ease) .45s,
          filter .9s var(--ease) .45s;
      }
      .eng-reveal.in .eng-stage { opacity: 1; transform: none; filter: none; }

      .eng-track {
        position: relative; min-height: 360px;
        touch-action: pan-y; user-select: none;
      }
      .eng-track::before, .eng-track::after {
        content: ''; position: absolute; top: -20px; bottom: -20px;
        width: 14vw; z-index: 5; pointer-events: none;
      }
      .eng-track::before { left: 0;  background: linear-gradient(90deg, #000 10%, transparent); }
      .eng-track::after  { right: 0; background: linear-gradient(-90deg, #000 10%, transparent); }

      .eng-slide {
        --o: 0;
        position: absolute; top: 0; left: 50%;
        width: var(--cw);
        transform: translateX(calc(-50% + var(--o) * (var(--cw) + var(--gap)))) scale(var(--s, 1));
        transition:
          transform .75s var(--ease),
          opacity .75s var(--ease),
          filter .75s var(--ease);
        will-change: transform;
      }
      .eng-slide.no-anim { transition: none !important; }
      .eng-slide.is-side   { --s: .93; opacity: .55; filter: saturate(.7); }
      .eng-slide.is-side .eng-card { cursor: pointer; }
      .eng-slide.is-hidden { --s: .88; opacity: 0; pointer-events: none; }
      .eng-slide.is-center { --s: 1;   opacity: 1; z-index: 2; }

      .eng-card {
        position: relative; height: 100%; min-height: 360px;
        border-radius: 1.25rem; overflow: hidden;
        padding: 1.8rem 1.7rem 1.7rem;
        display: flex; flex-direction: column;
        background:
          linear-gradient(180deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.015) 100%),
          #0b0b0c;
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.08),
          0 30px 60px -30px rgba(0,0,0,.9);
        transition: box-shadow .6s var(--ease);
      }
      .eng-cnoise {
        position: absolute; inset: 0; pointer-events: none;
        opacity: .28; mix-blend-mode: screen;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      }
      .eng-card::before {
        content: ''; position: absolute; inset: 0; pointer-events: none;
        opacity: .55; transition: opacity .6s var(--ease);
        background: radial-gradient(ellipse 80% 60% at 30% -10%, rgba(var(--acc),.14), transparent 60%);
      }
      .eng-card::after {
        content: ''; position: absolute; left: -10%; right: -10%; bottom: -40%; height: 80%;
        pointer-events: none;
        background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(var(--acc),.34), rgba(var(--acc),.08) 45%, transparent 70%);
        opacity: 0; transform: translateY(20px);
        transition: opacity .8s var(--ease), transform .8s var(--ease);
      }
      .eng-slide.is-center .eng-card {
        box-shadow:
          inset 0 0 0 1px rgba(var(--acc),.38),
          0 0 0 1px rgba(var(--acc),.06),
          0 40px 80px -30px rgba(var(--acc),.28);
      }
      .eng-slide.is-center .eng-card::before { opacity: 1; }
      .eng-slide.is-center .eng-card::after  { opacity: 1; transform: none; }

      .eng-hair {
        position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(var(--acc),.9), transparent);
        transform: scaleX(0);
        transition: transform .9s var(--ease) .15s;
      }
      .eng-slide.is-center .eng-hair { transform: scaleX(1); }

      .eng-pic {
        position: relative; width: 4.2rem; height: 4.2rem;
        border-radius: 50%; flex: none;
        display: grid; place-items: center;
        background: rgba(var(--acc),.12);
        color: rgb(var(--acc));
        font-weight: 700; font-size: 1.05rem; letter-spacing: .05em;
      }
      .eng-pic::before {
        content: ''; position: absolute; inset: -4px; border-radius: 50%;
        background: conic-gradient(from 200deg, rgba(var(--acc),.95), rgba(var(--acc),.08) 40%, rgba(var(--acc),.6) 70%, rgba(var(--acc),.95));
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
        mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
        transition: transform 1.2s var(--ease);
      }
      .eng-slide.is-center .eng-pic::before { transform: rotate(180deg); }
      .eng-pic img {
        position: absolute; inset: 0; width: 100%; height: 100%;
        object-fit: cover; border-radius: 50%;
        filter: grayscale(22%);
      }
      .eng-pic img.missing { display: none; }
      .eng-pic.anon { overflow: visible; }
      .eng-sil {
        position: absolute; inset: 0; border-radius: 50%; overflow: hidden;
        background:
          radial-gradient(circle at 50% 36%, rgba(var(--acc),.6) 0 21%, transparent 22%),
          radial-gradient(ellipse 44% 30% at 50% 82%, rgba(var(--acc),.5) 0 62%, transparent 63%),
          rgba(var(--acc),.07);
        filter: blur(1.2px);
      }

      .eng-who { position: relative; margin-top: 1.25rem; }
      .eng-n {
        font-size: 1.02rem; font-weight: 700; color: var(--cream);
        display: flex; align-items: center; gap: .5rem;
      }
      .eng-n a {
        color: inherit; text-decoration: none;
        border-bottom: 1px solid rgba(var(--acc),.35);
        transition: border-color .2s;
      }
      .eng-n a:hover { border-color: rgb(var(--acc)); }
      .eng-r {
        margin-top: .35rem; font-size: .78rem;
        color: rgba(222,219,200,.5); line-height: 1.45;
      }
      .eng-r a { color: rgba(var(--acc),.9); text-decoration: none; }
      .eng-lock {
        font-size: .56rem; letter-spacing: .12em; text-transform: uppercase;
        color: rgb(var(--acc));
        border: 1px solid rgba(var(--acc),.4);
        background: rgba(var(--acc),.08);
        border-radius: 99px; padding: .18rem .45rem;
        font-weight: 400;
        display: inline-flex; align-items: center; gap: .25rem;
      }

      .eng-quote {
        position: relative; margin: 1.15rem 0 0;
        font-size: .9rem; line-height: 1.65;
        color: rgba(222,219,200,.8);
        flex: 1;
      }
      .eng-quote em {
        font-family: 'Instrument Serif', serif;
        font-style: italic;
        font-size: 1.1em;
        color: rgb(var(--acc));
      }
      .eng-slide.is-center .eng-quote { animation: eng-qin .8s var(--ease) both .15s; }
      @keyframes eng-qin {
        from { opacity: .25; transform: translateY(8px); filter: blur(3px); }
        to   { opacity: 1;   transform: none;             filter: none; }
      }

      .eng-meta {
        position: relative; display: flex; align-items: center; gap: .6rem;
        margin-top: 1.3rem; padding-top: 1rem;
        border-top: 1px solid rgba(255,255,255,.06);
        font-size: .62rem; letter-spacing: .18em; text-transform: uppercase;
        color: rgba(222,219,200,.38);
      }
      .eng-tag {
        color: rgb(var(--acc));
        border: 1px solid rgba(var(--acc),.35);
        background: rgba(var(--acc),.07);
        border-radius: .5rem; padding: .26rem .5rem;
      }
      .eng-bar {
        position: relative; flex: 1; height: 2px;
        border-radius: 2px; background: rgba(255,255,255,.07); overflow: hidden;
      }
      .eng-bar i {
        position: absolute; inset: 0;
        transform: scaleX(0); transform-origin: left;
        background: rgba(var(--acc),.85);
      }
      .eng-slide.is-center .eng-bar i {
        animation: eng-fill var(--dur, 5000ms) linear forwards;
      }
      .eng-tst.paused .eng-slide.is-center .eng-bar i { animation-play-state: paused; }
      @keyframes eng-fill { to { transform: scaleX(1); } }

      .eng-controls {
        position: relative; z-index: 6;
        display: flex; align-items: center; justify-content: center;
        gap: 1.4rem; margin-top: 2.6rem;
      }
      .eng-btn {
        width: 2.7rem; height: 2.7rem; border-radius: 50%;
        display: grid; place-items: center; cursor: pointer;
        background: rgba(255,255,255,.03);
        border: 1px solid rgba(255,255,255,.1);
        color: var(--cream);
        transition: background .25s, border-color .25s, transform .25s var(--ease);
      }
      .eng-btn:hover { background: rgba(255,255,255,.07); border-color: rgba(222,219,200,.35); transform: scale(1.06); }
      .eng-btn:active { transform: scale(.96); }
      .eng-btn svg { width: 16px; height: 16px; }
      .eng-dots { display: flex; gap: .5rem; align-items: center; }
      .eng-dot {
        width: .45rem; height: .45rem; border-radius: 99px;
        border: 0; padding: 0; cursor: pointer;
        background: rgba(222,219,200,.22);
        transition: width .5s var(--ease), background .5s var(--ease);
      }
      .eng-dot.on { width: 1.7rem; background: rgb(var(--acc)); }
      .eng-count {
        font-size: .7rem; letter-spacing: .2em;
        color: rgba(222,219,200,.4);
        min-width: 3.4rem; text-align: center;
      }
      .eng-count b { color: var(--cream); font-weight: 400; }

      .eng-also {
        position: relative; z-index: 2;
        text-align: center; margin: 3.5rem auto 0;
        max-width: 46rem; padding: 0 1.5rem;
        font-size: .78rem; line-height: 1.7;
        color: rgba(222,219,200,.4);
      }
      .eng-also span { color: rgba(222,219,200,.65); }

      @media (prefers-reduced-motion: reduce) {
        .eng-slide { transition: opacity .3s ease; }
        .eng-cell, .eng-streak, .eng-slide.is-center .eng-quote { animation: none; }
        .eng-cell { opacity: .6; }
      }
    `}</style>
  )
}

export function Engagements() {
  return (
    <section id="engagements">
      <Carousel />
    </section>
  )
}

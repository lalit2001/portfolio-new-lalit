import { Github, Linkedin, Twitter, Mail, Calendar } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const WORK = [
  { label: 'OmniQuery', href: 'https://www.omniquery.in/' },
  { label: 'Agent Platform', href: 'https://agent-dot.omniquery.in/' },
  { label: 'AI Newsletter', href: 'https://ai-newsletter.omniquery.in/' },
  { label: 'Olake (OSS)', href: 'https://github.com/datazip-inc/olake' },
]

const ELSEWHERE = [
  { label: 'GitHub', href: 'https://github.com/lalit2001' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lalit-moharana-987516191' },
  { label: 'X / Twitter', href: 'https://x.com/moharanalalit' },
  { label: 'Newsletter', href: 'https://ai-newsletter.omniquery.in/' },
]

const CONTACT = [
  { label: 'Email', href: 'mailto:lalit.moharana@ticketwhiz.com' },
  { label: 'Talks & advisory', href: 'mailto:lalit.moharana@ticketwhiz.com' },
  { label: 'AWS Community Builder', href: '#' },
]

const METRICS = [
  { value: '+5', label: 'Yrs shipping AI infra' },
  { value: '+3', label: 'Products live' },
  { value: 'AWS', label: 'Community Builder' },
  { value: '+5', label: 'Industries served' },
]

function SkillCard({
  label,
  index,
  gradient,
  rotate,
  translateY,
}: {
  label: string
  index: string
  gradient: string
  rotate: number
  translateY: number
}) {
  return (
    <div
      className="absolute w-20 h-28 md:w-24 md:h-32 lg:w-28 lg:h-36 rounded-2xl overflow-hidden border border-white/15 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:-translate-y-1"
      style={{
        background: gradient,
        transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/40" />
      <div className="relative h-full flex flex-col justify-between p-3 text-white">
        <div className="text-[9px] uppercase tracking-[0.15em] font-semibold opacity-80">
          {index}
        </div>
        <div className="text-base md:text-lg font-semibold leading-none">
          {label}
        </div>
      </div>
    </div>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="col-span-6 md:col-span-4">
      <div className="text-primary text-sm mb-4">{title}</div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              className="text-gray-400 text-sm hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  })
  const bigNameY = useTransform(scrollYProgress, [0, 1], ['30%', '-8%'])
  const bigNameScale = useTransform(scrollYProgress, [0, 1], [1.05, 1])

  return (
    <footer ref={sectionRef} className="relative bg-black overflow-hidden pt-16 md:pt-24">
      <div className="relative px-6 md:px-10 pb-[38vw] md:pb-[26vw] lg:pb-[22vw]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div
            id="contact"
            className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] ring-1 ring-white/[0.08] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] scroll-mt-24"
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 70% 65% at 50% -3%, rgba(245, 195, 105, 0.55) 0%, rgba(220, 160, 70, 0.28) 22%, rgba(170, 115, 45, 0.1) 45%, transparent 68%)',
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 60% 60% at 15% 60%, rgba(190, 150, 220, 0.1) 0%, transparent 55%)',
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 60% 60% at 85% 60%, rgba(120, 180, 220, 0.09) 0%, transparent 55%)',
              }}
            />
            <div className="noise-overlay opacity-40 mix-blend-screen pointer-events-none" />

            <div className="hidden md:block absolute left-6 lg:left-10 top-32 md:top-40 lg:top-44 w-36 lg:w-40 h-56 z-10">
              <SkillCard
                index="01"
                label="Data"
                gradient="linear-gradient(160deg, #C77D3A, #7A3E1F)"
                rotate={-14}
                translateY={-24}
              />
              <SkillCard
                index="02"
                label="Cloud"
                gradient="linear-gradient(160deg, #4A6B8A, #24384F)"
                rotate={-2}
                translateY={12}
              />
              <SkillCard
                index="03"
                label="Agents"
                gradient="linear-gradient(160deg, #7A6D3A, #3A331A)"
                rotate={10}
                translateY={48}
              />
            </div>

            <div className="hidden md:block absolute right-6 lg:right-10 top-32 md:top-40 lg:top-44 w-36 lg:w-40 h-56 z-10">
              <SkillCard
                index="01"
                label="Query"
                gradient="linear-gradient(200deg, #8A5B7A, #3F2B45)"
                rotate={14}
                translateY={-24}
              />
              <SkillCard
                index="02"
                label="Ship"
                gradient="linear-gradient(200deg, #D8A05A, #8A5A20)"
                rotate={2}
                translateY={12}
              />
              <SkillCard
                index="03"
                label="Signal"
                gradient="linear-gradient(200deg, #5F7BA5, #2B3E5A)"
                rotate={-10}
                translateY={48}
              />
            </div>

            <div className="relative z-20 pt-14 md:pt-20 pb-10 md:pb-14 px-6 md:px-16 lg:px-24 text-center">
              <div className="text-primary/70 text-[10px] md:text-xs tracking-[0.25em] uppercase mb-3">
                Available for select engagements
              </div>
              <h3 className="text-primary text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] font-medium tracking-tight max-w-2xl mx-auto">
                Let&apos;s build{' '}
                <span className="italic font-serif">systems that think.</span>
              </h3>
              <p className="text-primary/70 text-sm md:text-base mt-4 max-w-md mx-auto leading-relaxed">
                Infrastructure, agents, and data - from lakehouses to
                self-hostable runtimes. I take a small number of engagements a
                year.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                <a
                  href="mailto:lalit.moharana@ticketwhiz.com"
                  className="inline-flex items-center gap-2 bg-primary text-black rounded-full px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email me
                </a>
                <a
                  href="mailto:lalit.moharana@ticketwhiz.com?subject=Intro%20call"
                  className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm text-primary border border-primary/25 rounded-full px-4 py-2.5 text-sm font-medium hover:bg-black/60 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book a call
                </a>
              </div>

              <div className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
                {METRICS.map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="text-primary text-2xl md:text-4xl font-medium leading-none">
                      {m.value}
                    </div>
                    <div className="text-primary/60 text-[10px] md:text-xs tracking-wide mt-2">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              aria-hidden
              className="relative z-20 mx-6 md:mx-12 border-t border-white/[0.06]"
            />

            <div className="relative z-20 px-6 md:px-12 py-10 md:py-14 bg-black/30 backdrop-blur-[2px]">
              <div className="grid grid-cols-12 gap-8 md:gap-10">
                <FooterCol title="Work" links={WORK} />
                <FooterCol title="Elsewhere" links={ELSEWHERE} />
                <FooterCol title="Contact" links={CONTACT} />
              </div>

              <div className="mt-10 md:mt-12 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <p className="text-gray-500 text-xs">
                  &copy; {new Date().getFullYear()} Lalit Moharana. Built from
                  first principles.
                </p>

                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/lalit2001"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-primary/70 hover:text-primary hover:border-white/[0.2] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/lalit-moharana-987516191"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-primary/70 hover:text-primary hover:border-white/[0.2] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://x.com/moharanalalit"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X"
                    className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-primary/70 hover:text-primary hover:border-white/[0.2] transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="mailto:lalit.moharana@ticketwhiz.com"
                    aria-label="Email"
                    className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-primary/70 hover:text-primary hover:border-white/[0.2] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors underline underline-offset-4 decoration-white/20"
                  >
                    Colophon
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors underline underline-offset-4 decoration-white/20"
                  >
                    Uses
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors underline underline-offset-4 decoration-white/20"
                  >
                    Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          aria-hidden
          style={{ y: bigNameY, scale: bigNameScale }}
          className="pointer-events-none absolute inset-x-0 bottom-0 md:-bottom-2 lg:-bottom-4 flex justify-center will-change-transform"
        >
          <span className="font-display font-bold leading-[0.9] tracking-[-0.015em] whitespace-nowrap select-none text-[50vw] sm:text-[50vw] md:text-[40vw] lg:text-[40vw] dotted-text">
            Lalit
          </span>
        </motion.div>
      </div>
    </footer>
  )
}

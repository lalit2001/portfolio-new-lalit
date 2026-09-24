import { Hero } from './sections/Hero'
import { PortraitReveal } from './sections/PortraitReveal'
import { ProjectsGrid } from './sections/ProjectsGrid'
import { Skills } from './sections/Skills'
import { Engagements } from './sections/Engagements'
import { Writing } from './sections/Writing'
import { Footer } from './sections/Footer'
import { ScrollProgress } from './components/ScrollProgress'

export default function App() {
  return (
    <main className="bg-black text-primary min-h-screen">
      <ScrollProgress />
      <Hero />
      <PortraitReveal
        src="/new-me-image.jpg"
        alt="Portrait of Lalit Moharana"
        eyebrow="Data - AI - Systems"
        greeting="I am Lalit Moharana,"
        tagline="a self-taught systems builder."
        paragraph="Five-plus years shipping data and AI systems across Life Sciences, Automotive, FinTech and Insurtech - from lakehouses that power bank underwriting to multi-agentic platforms in production. On the side I'm building OmniQuery, a data fabric you can talk to, and the Agent Platform, a self-hostable Claude-style runtime with git-versioned Skills. AWS Community Builder in Data and AI, 2025 & 2026."
        ctas={[
          { label: 'Get in touch', href: '#contact' },
          { label: 'Chat on WhatsApp', href: 'https://wa.me/919114813691' },
        ]}
      />
      <ProjectsGrid />
      <Skills />
      <Engagements />
      <Writing />
      <Footer />
    </main>
  )
}

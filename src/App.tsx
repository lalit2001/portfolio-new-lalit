import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { ProjectsGrid } from './sections/ProjectsGrid'
import { Skills } from './sections/Skills'
import { Footer } from './sections/Footer'
import { ScrollProgress } from './components/ScrollProgress'

export default function App() {
  return (
    <main className="bg-black text-primary min-h-screen">
      <ScrollProgress />
      <Hero />
      <About />
      <ProjectsGrid />
      <Skills />
      <Footer />
    </main>
  )
}

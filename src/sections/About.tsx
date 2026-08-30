import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle'
import { AnimatedParagraph } from '../components/AnimatedParagraph'

export function About() {
  return (
    <section
      id="about"
      className="relative bg-black py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(169, 233, 251, 0.12) 0%, rgba(136, 231, 194, 0.05) 35%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(252, 215, 237, 0.08) 0%, transparent 55%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 0% 100%, rgba(254, 215, 146, 0.06) 0%, transparent 55%)',
        }}
      />
      <div className="noise-overlay opacity-20 mix-blend-screen pointer-events-none" />

      <div className="relative mx-auto max-w-6xl bg-[#101010]/85 backdrop-blur-sm ring-1 ring-white/[0.06] rounded-2xl md:rounded-[2rem] px-6 md:px-16 py-20 md:py-28 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 65% at 50% -10%, rgba(169, 233, 251, 0.14) 0%, transparent 60%)',
          }}
        />

        <div className="relative">
          <div className="text-primary text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-8">
            Data · AI · Systems
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9]">
            <WordsPullUpMultiStyle
              segments={[
                { text: 'I am Lalit Moharana,', className: 'font-normal' },
                { text: 'a self-taught systems builder.', className: 'italic font-serif' },
                {
                  text: 'I have skills in agentic AI, data engineering, and cloud-native architecture.',
                  className: 'font-normal',
                },
              ]}
            />
          </h2>

          <div className="mt-10 md:mt-14 max-w-2xl mx-auto text-[#DEDBC8]">
            <AnimatedParagraph
              text="Over the last five-plus years, I have partnered with Ernst & Young on Life Sciences and Automotive AI platforms, led data engineering at ByteIQ Analytics on FinTech lakehouses, and shipped agentic NL-to-SQL pipelines at InvoLead. Today I am CTO at StriveSteam and building OmniQuery, the Agent Platform, and an AI research newsletter."
              className="text-xs sm:text-sm md:text-base leading-relaxed"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface WordsPullUpProps {
  text: string
  className?: string
  showAsterisk?: boolean
  delayOffset?: number
}

export function WordsPullUp({ text, className = '', showAsterisk = false, delayOffset = 0 }: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const isLastWord = i === words.length - 1
        const lastChar = word.slice(-1)
        const rest = word.slice(0, -1)

        return (
          <motion.span
            key={`${word}-${i}`}
            className="relative inline-block mr-[0.25em]"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.7,
              delay: delayOffset + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {showAsterisk && isLastWord ? (
              <span className="relative inline-block">
                {rest}
                <span className="relative inline-block">
                  {lastChar}
                  <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] opacity-80">
                    *
                  </span>
                </span>
              </span>
            ) : (
              word
            )}
          </motion.span>
        )
      })}
    </span>
  )
}

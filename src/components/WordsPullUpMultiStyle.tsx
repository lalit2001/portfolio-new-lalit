import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export interface Segment {
  text: string
  className?: string
}

interface Props {
  segments: Segment[]
  className?: string
  wordDelay?: number
  justify?: 'center' | 'start'
}

export function WordsPullUpMultiStyle({
  segments,
  className = '',
  wordDelay = 0.08,
  justify = 'center',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const flat: { text: string; className?: string }[] = []
  segments.forEach((seg) => {
    const parts = seg.text.split(' ').filter(Boolean)
    parts.forEach((word) => flat.push({ text: word, className: seg.className }))
  })

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap ${justify === 'center' ? 'justify-center' : 'justify-start'} ${className}`}
    >
      {flat.map((w, i) => (
        <motion.span
          key={`${w.text}-${i}`}
          className={`inline-block mr-[0.25em] ${w.className ?? ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.7,
            delay: i * wordDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {w.text}
        </motion.span>
      ))}
    </span>
  )
}

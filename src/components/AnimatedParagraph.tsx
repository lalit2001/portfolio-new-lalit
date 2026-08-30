import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedLetterProps {
  char: string
  progress: MotionValue<number>
  charProgress: number
}

function AnimatedLetter({ char, progress, charProgress }: AnimatedLetterProps) {
  const opacity = useTransform(
    progress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1],
  )
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

interface Props {
  text: string
  className?: string
}

export function AnimatedParagraph({ text, className = '' }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = Array.from(text)

  return (
    <p ref={ref} className={className}>
      {chars.map((c, i) => (
        <AnimatedLetter
          key={i}
          char={c}
          progress={scrollYProgress}
          charProgress={i / chars.length}
        />
      ))}
    </p>
  )
}

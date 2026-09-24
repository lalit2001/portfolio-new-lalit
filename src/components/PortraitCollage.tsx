import { motion, useTransform, MotionValue } from 'framer-motion'

/**
 * Scroll-linked portrait reveal.
 *
 * As the About section's scroll progress moves 0 -> ~0.35, the portrait
 * card grows from a small monochrome thumbnail into a full-size colour
 * card, with a subtle Y-axis tilt that eases out to zero.  Beyond 0.35
 * the card holds at final state while the About text keeps revealing.
 */
export function PortraitCollage({
  progress,
  maxWidth = 260,
}: {
  progress: MotionValue<number>
  maxWidth?: number
}) {
  const REVEAL_END = 0.35

  const scale = useTransform(progress, [0, REVEAL_END], [0.45, 1])
  const grayscale = useTransform(progress, [0, REVEAL_END], [1, 0])
  const rotateY = useTransform(progress, [0, REVEAL_END], [22, 0])
  const y = useTransform(progress, [0, REVEAL_END], [16, 0])
  const shadowIntensity = useTransform(progress, [0, REVEAL_END], [0.25, 0.7])

  const filter = useTransform(grayscale, (g) => `grayscale(${g})`)
  const boxShadow = useTransform(
    shadowIntensity,
    (v) => `0 40px 80px -25px rgba(0,0,0,${v}), 0 12px 30px -12px rgba(0,0,0,${v * 0.6})`,
  )

  return (
    <div
      style={{ perspective: 1600, width: maxWidth }}
      className="relative mx-auto"
    >
      {/* Ambient accent glow behind the card */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 60%, rgba(169, 233, 251, 0.14) 0%, rgba(252, 215, 237, 0.06) 40%, transparent 70%)',
          filter: 'blur(28px)',
          transform: 'scale(1.25)',
        }}
      />

      <motion.div
        style={{
          scale,
          rotateY,
          y,
          filter,
          boxShadow,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          aspectRatio: '3 / 4',
        }}
        className="relative w-full rounded-3xl overflow-hidden ring-1 ring-white/10 bg-[#0a0a0a]"
      >
        <img
          src="/new-me-image.jpg"
          alt="Portrait of Lalit Moharana"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Subtle inner highlight along the top edge */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        />
      </motion.div>

    </div>
  )
}

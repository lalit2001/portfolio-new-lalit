import { useEffect, useState, useRef, memo } from 'react'
import {
  useInView,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion'

interface CommonProps {
  src: string
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
  once?: boolean
}

/**
 * Inlines an external SVG and re-triggers its CSS keyframe animations
 * whenever the element becomes "active".
 *
 * Two activation modes:
 *
 *   1. **Scroll-into-view** (default) - fires when the wrapper enters the
 *      viewport via `useInView`.  Works for one-shot placements.
 *
 *   2. **Scroll-progress segment** - pass `progress` (a scrollYProgress
 *      MotionValue) plus `activeStart` / `activeEnd` in [0..1].  The SVG
 *      remounts whenever progress crosses INTO that band from outside.
 *      This is what you want inside a sticky-scroll section like the
 *      ProjectsGrid, where the SVG tile never actually leaves the
 *      viewport - the ACTIVE PROJECT is what changes as the user scrolls.
 *
 * Why remount?  `<img src="…svg">` decodes `@keyframes` once on load and
 * `forwards`-terminated animations are done by the time you scroll to
 * that section.  Browsers won't restart CSS animations on scroll for
 * `<img>` / `<object>` / `<iframe>`.  Inlining the SVG into the DOM and
 * bumping a React `key` on every re-entry restarts every `@keyframes`
 * from t=0.
 */
export function RevealSvg(
  props: CommonProps & {
    progress?: MotionValue<number>
    activeStart?: number
    activeEnd?: number
  },
) {
  if (
    props.progress &&
    props.activeStart !== undefined &&
    props.activeEnd !== undefined
  ) {
    return (
      <SegmentReveal
        {...props}
        progress={props.progress}
        activeStart={props.activeStart}
        activeEnd={props.activeEnd}
      />
    )
  }
  return <InViewReveal {...props} />
}

function useFetchedSvg(src: string) {
  const [markup, setMarkup] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return
        const cleaned = text
          .replace(/\swidth="[^"]+"/, ' width="100%"')
          .replace(/\sheight="[^"]+"/, ' height="100%"')
          // "slice" (cover) crops landscape SVGs badly on narrow
          // portrait containers - swap to "meet" (contain) so the whole
          // SVG stays visible on all viewport widths.
          .replace(
            /preserveAspectRatio="[^"]*slice"/,
            'preserveAspectRatio="xMidYMid meet"',
          )
        setMarkup(cleaned)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [src])
  return markup
}

function Frame({
  markup,
  playCount,
  ariaLabel,
  className,
  style,
  rootRef,
}: {
  markup: string | null
  playCount: number
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
  rootRef?: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={rootRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
      aria-label={ariaLabel}
      role="img"
    >
      {markup && (
        <div
          key={playCount}
          className="[&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          dangerouslySetInnerHTML={{ __html: markup }}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}

const InViewReveal = memo(function InViewReveal({
  src,
  ariaLabel,
  className,
  style,
  once = false,
}: CommonProps) {
  const markup = useFetchedSvg(src)
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, {
    margin: '-15% 0px -15% 0px',
    once,
  })
  const [playCount, setPlayCount] = useState(0)

  useEffect(() => {
    if (!markup) return
    if (once && playCount > 0) return
    if (inView) setPlayCount((c) => c + 1)
  }, [inView, markup, once, playCount])

  return (
    <Frame
      rootRef={rootRef}
      markup={markup}
      playCount={playCount}
      ariaLabel={ariaLabel}
      className={className}
      style={style}
    />
  )
})

const SegmentReveal = memo(function SegmentReveal({
  src,
  ariaLabel,
  className,
  style,
  progress,
  activeStart,
  activeEnd,
  once = false,
}: CommonProps & {
  progress: MotionValue<number>
  activeStart: number
  activeEnd: number
}) {
  const markup = useFetchedSvg(src)
  const rootRef = useRef<HTMLDivElement>(null)
  // Gate: the reveal must never fire before the tile is actually near the
  // viewport. Without this, on page refresh the mount-time progress.get()
  // reads 0 (section is far below the fold), immediately looks "inside" the
  // OmniQuery band, and the CSS keyframes burn out invisibly before the
  // user ever scrolls to the section.
  const inViewport = useInView(rootRef, {
    margin: '0px 0px -20% 0px',
  })
  const segActive = useRef(false)
  const [playCount, setPlayCount] = useState(0)

  useMotionValueEvent(progress, 'change', (v: number) => {
    if (!markup) return
    if (!inViewport) return
    const inside = v >= activeStart && v <= activeEnd
    if (inside && !segActive.current) {
      segActive.current = true
      if (!once || playCount === 0) {
        setPlayCount((c) => c + 1)
      }
    } else if (!inside && segActive.current) {
      segActive.current = false
    }
  })

  // When the tile first enters the viewport, if progress happens to be
  // inside the band, fire once. Covers the "scroll straight into the
  // active project" path and hash-deep-links like #projects.
  useEffect(() => {
    if (!markup) return
    if (!inViewport) {
      // Reset when we leave so the next viewport entry can fire again.
      segActive.current = false
      return
    }
    const v = progress.get()
    if (v >= activeStart && v <= activeEnd && !segActive.current) {
      segActive.current = true
      setPlayCount((c) => c + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markup, inViewport])

  return (
    <Frame
      rootRef={rootRef}
      markup={markup}
      playCount={playCount}
      ariaLabel={ariaLabel}
      className={className}
      style={style}
    />
  )
})

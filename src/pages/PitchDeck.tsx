import { useEffect, useRef } from 'react'

/**
 * /pitch-deck-me - full-screen investor deck.
 *
 * The deck itself is a self-contained presentation at
 * public/pitch-deck-me/deck.html (generated from the super-agent repo's
 * pitch-deck/build pipeline). This route just frames it so the URL stays
 * clean and the portfolio's SPA fallback keeps working on static hosts.
 */
// Bump when deck.html changes so browsers do not serve a stale copy.
const DECK_VERSION = '2026-10-10-14'

export function PitchDeck() {
  const ref = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    const prev = document.title
    document.title = 'OmniQuery - Investor deck'
    // Keyboard events land on the outer document; forward them to the deck.
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const nav = ['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End', 'Enter', 'Backspace']
      if (nav.includes(e.key)) e.preventDefault()
      ref.current?.contentWindow?.postMessage({ type: 'deck-key', key: e.key }, '*')
    }
    window.addEventListener('keydown', onKey)
    const focus = () => ref.current?.contentWindow?.focus()
    const t = window.setTimeout(focus, 300)
    return () => {
      document.title = prev
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [])
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  return (
    <iframe
      ref={ref}
      title="OmniQuery investor deck"
      src={`/pitch-deck-me/deck.html?v=${DECK_VERSION}${hash}`}
      allow="fullscreen"
      allowFullScreen
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 0,
        background: '#040308',
      }}
    />
  )
}

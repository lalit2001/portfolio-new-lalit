/**
 * Displays the pre-processed halftone portrait inside a circular frame.
 * The source at /my-portrait-halftone.png is already halftoned, so we just
 * present it with the site's polish (glow, ring, caption pill).
 */
export function PortraitCollage() {
  return (
    <div className="relative aspect-square w-full max-w-[340px] mx-auto">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(169, 233, 251, 0.12) 0%, rgba(252, 215, 237, 0.06) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative aspect-square w-full rounded-full overflow-hidden ring-1 ring-primary/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] bg-[#0a0a0a]">
        <img
          src="/my-image.png"
          alt="Portrait of Lalit Moharana"
          className="absolute inset-0 w-full h-full object-cover object-[center_38%] scale-[1.05]"
        />

        <div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
          }}
        />
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.3em] uppercase text-primary/60 bg-[#101010] px-3 py-1 rounded-full ring-1 ring-white/[0.06]">
        Lalit M. · 2026
      </div>
    </div>
  )
}

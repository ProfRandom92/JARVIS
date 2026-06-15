/**
 * ScanlineOverlay — a full-screen, very subtle moving scanline layer.
 * Intentionally pointer-events: none so it never blocks touches.
 */
export function ScanlineOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-50" />
      <div
        className="absolute -inset-y-px left-0 right-0 h-24 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent"
        style={{ animation: 'scanline 8s linear infinite' }}
      />
    </div>
  )
}

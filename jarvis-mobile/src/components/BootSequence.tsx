import { useEffect, useState } from 'react'

interface BootSequenceProps {
  onComplete: () => void
  /** Minimum visible time even if audio finishes earlier. */
  minMs?: number
  /** Show only on first session (defaults to true). */
  once?: boolean
}

const STEPS = [
  '> LINK ESTABLISHED',
  '> INITIALISING SUBSYSTEMS',
  '> LOADING VOICE CORTEX',
  '> CALIBRATING TELEMETRY',
  '> SYNCING NEURAL MESH',
  '> J.A.R.V.I.S. ONLINE',
]

const STORAGE_KEY = 'jarvis.booted'

/**
 * BootSequence — a short cinematic intro shown the first time the app is
 * opened in a given browser. Each step is revealed with a subtle type-on
 * effect. When done, calls onComplete().
 */
export function BootSequence({ onComplete, minMs = 1800, once = true }: BootSequenceProps) {
  const [step, setStep] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (once && typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY)) {
      setHidden(true)
      onComplete()
      return
    }
    const start = performance.now()
    const interval = window.setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          window.clearInterval(interval)
          const elapsed = performance.now() - start
          const wait = Math.max(0, minMs - elapsed)
          window.setTimeout(() => {
            if (once && typeof window !== 'undefined') {
              window.localStorage.setItem(STORAGE_KEY, '1')
            }
            setHidden(true)
            onComplete()
          }, wait)
          return s
        }
        return s + 1
      })
    }, 280)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (hidden) return null

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-void-900"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 scanlines opacity-60 pointer-events-none" />
      <div className="relative w-64 max-w-[80vw] text-center font-mono">
        {/* Core glyph */}
        <div className="mx-auto mb-6 h-24 w-24 relative">
          <div className="absolute inset-0 rounded-full border border-neon-cyan/60 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border border-neon-cyan/40 animate-spin-reverse" />
          <div className="absolute inset-4 rounded-full border border-neon-cyan/30 animate-spin-slower" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-6 w-6 rounded-full bg-neon-cyan shadow-[0_0_20px_rgba(34,224,255,.9)] animate-pulse-glow" />
          </div>
        </div>
        <div className="space-y-1 min-h-[6.5rem]">
          {STEPS.slice(0, step + 1).map((s, i) => (
            <div
              key={s}
              className={`text-[11px] tracking-[.25em] text-neon-cyan/90 ${
                i === step ? 'text-glow animate-slide-up' : 'opacity-60'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="mt-4 hud-divider" />
        <div className="mt-3 text-[10px] tracking-[.3em] text-steel-400">
          STARK INDUSTRIES · OS 6.3
        </div>
      </div>
    </div>
  )
}

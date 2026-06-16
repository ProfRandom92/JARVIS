import { useEffect, useMemo, useState } from 'react'
import { useAssistantStore } from '../stores/assistant'
import type { AssistantStatus } from '../types'

interface JarvisCoreProps {
  size?: number
  /** When true, the orb scans continuously (idle animation). */
  scanning?: boolean
}

/**
 * JarvisCore — the centerpiece animated SVG. The composition is layered:
 *  1. Outer arc ring (slow, large dashes) — outermost sweep
 *  2. Middle concentric arcs (reverse spin, different speeds)
 *  3. Tick marks around the perimeter
 *  4. Hex markers at the cardinal directions
 *  5. Cross-hair lines
 *  6. AI face: a glowing orb with a scanning horizontal line and a small
 *     pupil-like dot that drifts on speech/listening status
 *  7. Status text overlay
 *
 * The whole composition responds to the assistant status (idle / listening
 * / thinking / speaking).
 */
export function JarvisCore({ size = 240, scanning = true }: JarvisCoreProps) {
  const status = useAssistantStore((s) => s.status)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 80)
    return () => window.clearInterval(id)
  }, [])

  const accent = accentForStatus(status)
  const r = size / 2
  const c = r

  const arcs = useMemo(
    () => [
      { r: r * 0.96, w: 1.5, dur: 16, dir: 1, dash: '4 12' },
      { r: r * 0.84, w: 1.2, dur: 22, dir: -1, dash: '8 18' },
      { r: r * 0.70, w: 1.0, dur: 12, dir: 1, dash: '20 30' },
      { r: r * 0.58, w: 0.8, dur: 18, dir: -1, dash: '14 24' },
    ],
    [r],
  )

  // Pupil drift based on status — looks "alive".
  const t = tick * 0.08
  const pupilX = Math.cos(t) * (status === 'listening' ? 4 : 2)
  const pupilY = Math.sin(t * 1.3) * (status === 'listening' ? 3 : 1.5)
  const pulse = 0.5 + 0.5 * Math.sin(t)
  const scanY = (Math.sin(t * 0.6) + 1) * 0.5 // 0..1

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 14px ${accent.glow})` }}
      >
        <defs>
          <radialGradient id="core-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent.fill} stopOpacity="0.95" />
            <stop offset="55%" stopColor={accent.fill} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent.fill} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent.stroke} stopOpacity="0" />
            <stop offset="50%" stopColor={accent.stroke} stopOpacity="1" />
            <stop offset="100%" stopColor={accent.stroke} stopOpacity="0" />
          </linearGradient>
          <clipPath id="face-clip">
            <circle cx={c} cy={c} r={r * 0.34} />
          </clipPath>
        </defs>

        {/* Background ambient disc */}
        <circle cx={c} cy={c} r={r * 0.97} fill="url(#core-fill)" />

        {/* Tick marks (60 around the perimeter) */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i / 60) * Math.PI * 2
          const inner = r * 0.93
          const outer = r * 0.99
          const x1 = c + Math.cos(angle) * inner
          const y1 = c + Math.sin(angle) * inner
          const x2 = c + Math.cos(angle) * outer
          const y2 = c + Math.sin(angle) * outer
          const long = i % 5 === 0
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={accent.stroke}
              strokeOpacity={long ? 0.55 : 0.18}
              strokeWidth={long ? 1.2 : 0.5}
            />
          )
        })}

        {/* Rotating arcs */}
        {arcs.map((a, idx) => (
          <g
            key={idx}
            style={{
              transformOrigin: `${c}px ${c}px`,
              animation: `${a.dir > 0 ? 'spinSlow' : 'spinReverse'} ${a.dur}s linear infinite`,
            }}
          >
            <circle
              cx={c}
              cy={c}
              r={a.r}
              fill="none"
              stroke="url(#arc-grad)"
              strokeWidth={a.w}
              strokeDasharray={a.dash}
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Static cross-hair lines */}
        <line x1={c - r * 0.55} y1={c} x2={c + r * 0.55} y2={c} stroke={accent.stroke} strokeOpacity="0.18" strokeWidth="0.6" />
        <line x1={c} y1={c - r * 0.55} x2={c} y2={c + r * 0.55} stroke={accent.stroke} strokeOpacity="0.18" strokeWidth="0.6" />

        {/* Hex markers at cardinal points */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x = c + Math.cos(rad) * r * 0.78
          const y = c + Math.sin(rad) * r * 0.78
          return <circle key={deg} cx={x} cy={y} r={2.2} fill={accent.stroke} opacity={0.9} />
        })}

        {/* ===== AI FACE ===== */}
        <g
          style={{
            transformOrigin: `${c}px ${c}px`,
            transform: `scale(${0.94 + 0.06 * pulse})`,
          }}
        >
          {/* Outer ring */}
          <circle
            cx={c}
            cy={c}
            r={r * 0.34}
            fill={accent.stroke}
            fillOpacity="0.04"
            stroke={accent.stroke}
            strokeOpacity="0.7"
            strokeWidth="1.4"
          />
          {/* Halo */}
          <circle cx={c} cy={c} r={r * 0.40} fill="url(#core-fill)" />
          {/* Body fill */}
          <circle cx={c} cy={c} r={r * 0.30} fill={accent.stroke} fillOpacity="0.08" />

          {/* Pupil — drifts with sine, brighter when listening/speaking */}
          <g clipPath="url(#face-clip)">
            {/* Scanning line */}
            {scanning && (
              <line
                x1={c - r * 0.34}
                x2={c + r * 0.34}
                y1={c - r * 0.30 + scanY * r * 0.6}
                y2={c - r * 0.30 + scanY * r * 0.6}
                stroke={accent.stroke}
                strokeOpacity="0.55"
                strokeWidth="0.8"
              />
            )}
            {/* Pupil glow */}
            <circle
              cx={c + pupilX}
              cy={c + pupilY}
              r={r * (status === 'listening' ? 0.10 : 0.075)}
              fill={accent.fill}
              opacity={0.4 + pulse * 0.3}
              style={{ filter: `blur(${r * 0.02}px)` }}
            />
            <circle
              cx={c + pupilX}
              cy={c + pupilY}
              r={r * 0.05}
              fill={accent.fill}
              style={{ filter: `drop-shadow(0 0 4px ${accent.glow})` }}
            />
            <circle
              cx={c + pupilX + r * 0.012}
              cy={c + pupilY - r * 0.012}
              r={r * 0.012}
              fill="#fff"
              opacity={0.85}
            />
          </g>
        </g>
      </svg>

      {/* Status text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono text-[10px] tracking-[.35em] text-neon-cyan/70 text-glow">
          {labelForStatus(status).kicker}
        </div>
        <div className="mt-1 font-display text-base font-semibold text-steel-50 text-glow">
          {labelForStatus(status).title}
        </div>
        <div className="mt-1 font-mono text-[9px] tracking-[.2em] text-steel-400">
          {labelForStatus(status).sub}
        </div>
      </div>
    </div>
  )
}

function labelForStatus(status: AssistantStatus): { kicker: string; title: string; sub: string } {
  switch (status) {
    case 'listening':
      return { kicker: '> IN', title: 'LISTENING', sub: 'transcribe stream' }
    case 'thinking':
      return { kicker: '> PROC', title: 'THINKING', sub: 'reasoning engine' }
    case 'speaking':
      return { kicker: '> OUT', title: 'SPEAKING', sub: 'streaming reply' }
    case 'idle':
    default:
      return { kicker: '> STDBY', title: 'ONLINE', sub: 'awaiting input' }
  }
}

function accentForStatus(status: AssistantStatus): { stroke: string; fill: string; glow: string } {
  if (status === 'listening') return { stroke: '#FFB347', fill: '#FFB347', glow: 'rgba(255,179,71,.55)' }
  if (status === 'speaking' || status === 'thinking') return { stroke: '#22E0FF', fill: '#22E0FF', glow: 'rgba(34,224,255,.6)' }
  return { stroke: '#22E0FF', fill: '#22E0FF', glow: 'rgba(34,224,255,.5)' }
}

import { useEffect, useMemo, useState } from 'react'
import { useAssistantStore } from '../stores/assistant'
import type { AssistantStatus } from '../types'

interface JarvisCoreProps {
  size?: number
}

/**
 * JarvisCore — the centerpiece animated SVG. Three concentric arcs rotate at
 * different speeds and directions, with a central pulsing orb. The whole
 * composition responds to the assistant status (idle / listening / thinking / speaking).
 */
export function JarvisCore({ size = 240 }: JarvisCoreProps) {
  const status = useAssistantStore((s) => s.status)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 100)
    return () => clearInterval(id)
  }, [])

  const accent = accentForStatus(status)
  const arcs = useMemo(
    () => [
      { r: size * 0.46, w: 2, dur: 14, dir: 1, dash: '40 60' },
      { r: size * 0.38, w: 1.5, dur: 18, dir: -1, dash: '60 40' },
      { r: size * 0.30, w: 1, dur: 10, dir: 1, dash: '12 88' },
      { r: size * 0.22, w: 1, dur: 8, dir: -1, dash: '4 96' },
    ],
    [size],
  )

  // 12 tick marks around the perimeter
  const ticks = Array.from({ length: 36 }, (_, i) => i)
  const r = size / 2
  const c = r

  const orbScale = 0.5 + 0.5 * Math.sin(tick * 0.18)
  const listeningPulse = status === 'listening' ? 1.15 : 1
  const statusLabel = labelForStatus(status)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer hex frame */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 12px ${accent.glow})` }}
      >
        <defs>
          <radialGradient id="core-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent.fill} stopOpacity="0.9" />
            <stop offset="55%" stopColor={accent.fill} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent.fill} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent.stroke} stopOpacity="0.0" />
            <stop offset="50%" stopColor={accent.stroke} stopOpacity="1" />
            <stop offset="100%" stopColor={accent.stroke} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Tick marks */}
        {ticks.map((i) => {
          const angle = (i / ticks.length) * Math.PI * 2
          const inner = r * 0.95
          const outer = r * 0.99
          const x1 = c + Math.cos(angle) * inner
          const y1 = c + Math.sin(angle) * inner
          const x2 = c + Math.cos(angle) * outer
          const y2 = c + Math.sin(angle) * outer
          const long = i % 3 === 0
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={accent.stroke}
              strokeOpacity={long ? 0.55 : 0.18}
              strokeWidth={long ? 1.2 : 0.6}
            />
          )
        })}

        {/* Background disc */}
        <circle cx={c} cy={c} r={r * 0.96} fill="url(#core-fill)" />

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
            {idx === 0 && (
              <circle
                cx={c}
                cy={c}
                r={a.r}
                fill="none"
                stroke={accent.stroke}
                strokeOpacity="0.12"
                strokeWidth="0.6"
              />
            )}
          </g>
        ))}

        {/* Hex markers at cardinal points */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x = c + Math.cos(rad) * r * 0.78
          const y = c + Math.sin(rad) * r * 0.78
          return (
            <circle
              key={deg}
              cx={x}
              cy={y}
              r={2}
              fill={accent.stroke}
              opacity={0.9}
            />
          )
        })}

        {/* Central orb */}
        <g
          style={{
            transformOrigin: `${c}px ${c}px`,
            transform: `scale(${(0.94 + 0.06 * orbScale) * listeningPulse})`,
          }}
        >
          <circle cx={c} cy={c} r={r * 0.16} fill={accent.stroke} fillOpacity="0.08" />
          <circle cx={c} cy={c} r={r * 0.10} fill="url(#core-fill)" />
          <circle
            cx={c}
            cy={c}
            r={r * 0.06}
            fill={accent.fill}
            style={{ filter: `drop-shadow(0 0 6px ${accent.glow})` }}
          />
        </g>

        {/* Crosshair lines */}
        <line
          x1={c - r * 0.5}
          y1={c}
          x2={c + r * 0.5}
          y2={c}
          stroke={accent.stroke}
          strokeOpacity="0.18"
          strokeWidth="0.6"
        />
        <line
          x1={c}
          y1={c - r * 0.5}
          x2={c}
          y2={c + r * 0.5}
          stroke={accent.stroke}
          strokeOpacity="0.18"
          strokeWidth="0.6"
        />
      </svg>

      {/* Status text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono text-[10px] tracking-[.35em] text-neon-cyan/70 text-glow">
          {statusLabel.kicker}
        </div>
        <div className="mt-1 font-display text-base font-semibold text-steel-50 text-glow">
          {statusLabel.title}
        </div>
        <div className="mt-1 font-mono text-[9px] tracking-[.2em] text-steel-400">
          {statusLabel.sub}
        </div>
      </div>
    </div>
  )
}

function labelForStatus(status: AssistantStatus): {
  kicker: string
  title: string
  sub: string
} {
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

function accentForStatus(status: AssistantStatus): {
  stroke: string
  fill: string
  glow: string
} {
  if (status === 'listening') {
    return { stroke: '#FFB347', fill: '#FFB347', glow: 'rgba(255,179,71,.55)' }
  }
  if (status === 'speaking' || status === 'thinking') {
    return { stroke: '#22E0FF', fill: '#22E0FF', glow: 'rgba(34,224,255,.6)' }
  }
  return { stroke: '#22E0FF', fill: '#22E0FF', glow: 'rgba(34,224,255,.5)' }
}

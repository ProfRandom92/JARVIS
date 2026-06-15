import type { Vital } from '../types'
import { Sparkline } from './Sparkline'
import { formatNumber } from '../utils/format'

interface VitalsCardProps {
  vital: Vital
  color?: string
}

/**
 * VitalsCard — a small telemetry tile with a label, large value, unit, and
 * a sparkline of recent samples. The border colour and sparkline tint adapt
 * to the current value's band.
 */
export function VitalsCard({ vital, color }: VitalsCardProps) {
  const ratio = vital.value / vital.max
  const accent =
    color ?? (ratio > 0.85 ? '#FF4D6D' : ratio > 0.7 ? '#FFB347' : '#22E0FF')
  return (
    <div className="hud-panel relative px-3 py-2.5 flex flex-col gap-1.5 min-h-[92px]">
      <div className="flex items-center justify-between">
        <span className="hud-label">[{vital.label}]</span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
        />
      </div>
      <div className="flex items-end gap-1.5">
        <span
          className="font-display text-2xl font-semibold leading-none"
          style={{ color: accent, textShadow: `0 0 8px ${accent}55` }}
        >
          {formatNumber(vital.value, vital.key === 'net' ? 1 : 0)}
        </span>
        <span className="font-mono text-[10px] text-steel-400 mb-0.5">{vital.unit}</span>
      </div>
      <div className="mt-auto">
        <Sparkline samples={vital.series} color={accent} width={120} height={26} />
      </div>
    </div>
  )
}

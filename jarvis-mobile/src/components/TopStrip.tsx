import { useEffect, useState } from 'react'
import { useAssistantStore } from '../stores/assistant'
import { useUiStore } from '../stores/ui'
import { formatTime } from '../utils/format'

const NETWORK_BARS = [1, 1, 1, 0.55, 0.2] // last bar weak for realism

/**
 * TopStrip — time, date, network and battery. Mirrors a status bar in a
 * sci-fi HUD. Re-renders once per second to keep the time fresh.
 */
export function TopStrip() {
  const persona = useAssistantStore((s) => s.prefs.personaName)
  const [now, setNow] = useState(() => Date.now())
  const tab = useUiStore((s) => s.tab)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const d = new Date(now)
  const dateStr = d
    .toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
    .toUpperCase()

  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-1 font-mono text-[11px] text-steel-200">
      <div className="flex items-center gap-2">
        <span className="text-neon-cyan/90 text-glow tracking-[.2em]">
          {formatTime(now)}
        </span>
        <span className="h-3 w-px bg-neon-cyan/30" />
        <span className="tracking-[.18em] text-steel-400">{dateStr}</span>
      </div>
      <div className="flex items-center gap-3 text-neon-cyan/80">
        <span className="tracking-[.2em]">
          {tab === 'home' ? `[${persona.toUpperCase()}]` : `[${tab.toUpperCase()}]`}
        </span>
        <div className="flex items-end gap-[2px] h-3">
          {NETWORK_BARS.map((h, i) => (
            <div
              key={i}
              className="w-[3px] bg-neon-cyan/80"
              style={{ height: `${h * 100}%`, boxShadow: '0 0 4px rgba(34,224,255,.7)' }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <div className="relative h-3 w-5 border border-neon-cyan/70 rounded-[1px]">
            <div className="absolute inset-[1px] bg-neon-cyan/80" style={{ width: '74%' }} />
            <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 h-1 w-[2px] bg-neon-cyan/70" />
          </div>
          <span className="text-[10px] tracking-wider">74</span>
        </div>
      </div>
    </div>
  )
}

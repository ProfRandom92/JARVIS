import { Activity, Cpu, MemoryStick, Network, BatteryFull, Server } from 'lucide-react'
import { useSystemStore } from '../stores/system'
import { useUptime } from '../hooks/useTelemetry'
import { VitalsCard } from './VitalsCard'
import { HexPanel } from './HexPanel'
import { formatUptime, relativeTime } from '../utils/format'

/**
 * TelemetryView — the system vitals screen. Shows a 2x2 grid of live data
 * cards followed by a per-module health roster.
 */
export function TelemetryView() {
  const vitals = useSystemStore((s) => s.vitals)
  const modules = useSystemStore((s) => s.modules)
  const ping = useSystemStore((s) => s.pingModule)
  const uptime = useUptime()

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="hud-label">SYSTEM VITALS</div>
          <div className="font-display text-sm tracking-[.25em] text-steel-50 text-glow">TELEMETRY</div>
        </div>
        <div className="text-right font-mono text-[10px] text-steel-400">
          <div>UPTIME</div>
          <div className="text-neon-cyan text-glow tracking-[.2em]">{formatUptime(uptime)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {vitals.map((v) => (
          <VitalsCard key={v.key} vital={v} />
        ))}
      </div>

      <div className="hud-divider my-1" />

      <div className="flex items-center justify-between">
        <div className="hud-label">SUBSYSTEMS</div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-steel-400">
          <Server className="w-3 h-3" />
          {modules.filter((m) => m.status === 'online').length}/{modules.length} ONLINE
        </div>
      </div>

      <HexPanel className="px-3 py-1 divide-y divide-neon-cyan/10" brackets={false}>
        {modules.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => ping(m.id)}
            className="w-full flex items-center gap-3 py-2.5 text-left focus-ring rounded-sm"
          >
            <span className="relative inline-flex h-2.5 w-2.5">
              <span
                className={`absolute inset-0 rounded-full ${
                  m.status === 'online' ? 'bg-neon-mint' : m.status === 'degraded' ? 'bg-neon-amber' : 'bg-neon-red'
                }`}
                style={{
                  boxShadow:
                    m.status === 'online'
                      ? '0 0 8px rgba(111,255,209,.7)'
                      : m.status === 'degraded'
                        ? '0 0 8px rgba(255,179,71,.7)'
                        : '0 0 8px rgba(255,77,109,.7)',
                }}
              />
              {m.status === 'online' && (
                <span className="absolute inset-0 rounded-full bg-neon-mint/40 animate-ping" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[12px] text-steel-50 tracking-[.05em]">
                {m.name}
              </div>
              <div className="font-mono text-[10px] text-steel-400 truncate">
                {m.description}
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-steel-400">
              <div className="text-neon-cyan/80 text-glow">{m.latencyMs.toFixed(0)}ms</div>
              <div>{relativeTime(m.lastCheck)}</div>
            </div>
          </button>
        ))}
      </HexPanel>

      <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-steel-400">
        <div className="hud-panel px-2 py-2 flex flex-col items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{(vitals.find((v) => v.key === 'cpu')?.value ?? 0).toFixed(0)}% CPU</span>
        </div>
        <div className="hud-panel px-2 py-2 flex flex-col items-center gap-1">
          <MemoryStick className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{(vitals.find((v) => v.key === 'mem')?.value ?? 0).toFixed(0)}% MEM</span>
        </div>
        <div className="hud-panel px-2 py-2 flex flex-col items-center gap-1">
          <Network className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{(vitals.find((v) => v.key === 'net')?.value ?? 0).toFixed(1)} MB/s</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px] text-steel-400">
        <div className="hud-panel px-2 py-2 flex items-center justify-center gap-1.5">
          <BatteryFull className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{(vitals.find((v) => v.key === 'batt')?.value ?? 0).toFixed(0)}% BATTERY</span>
        </div>
        <div className="hud-panel px-2 py-2 flex items-center justify-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-neon-cyan" />
          <span>LATENCY NOMINAL</span>
        </div>
      </div>
    </div>
  )
}

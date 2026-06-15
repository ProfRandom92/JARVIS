import { Moon, Volume2, Vibrate, Type, RotateCcw, Trash2, Shield, Cpu } from 'lucide-react'
import { useAssistantStore } from '../stores/assistant'
import { useSystemStore } from '../stores/system'
import { formatUptime } from '../utils/format'
import { useUptime } from '../hooks/useTelemetry'
import { HexPanel } from './HexPanel'

/**
 * SettingsPanel — preferences and housekeeping. All changes persist via the
 * assistant store to localStorage. Includes a destructive "clear history"
 * action with a confirmation step.
 */
export function SettingsPanel() {
  const prefs = useAssistantStore((s) => s.prefs)
  const updatePrefs = useAssistantStore((s) => s.updatePrefs)
  const resetPrefs = useAssistantStore((s) => s.resetPrefs)
  const clearHistory = useAssistantStore((s) => s.clearHistory)
  const modules = useSystemStore((s) => s.modules)
  const startedAt = useSystemStore((s) => s.startedAt)
  const uptime = useUptime()

  return (
    <div className="px-4 pt-3 pb-6 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="hud-label">PREFERENCES</div>
          <div className="font-display text-sm tracking-[.25em] text-steel-50 text-glow">SETTINGS</div>
        </div>
        <span className="hud-chip">v1.0</span>
      </div>

      <HexPanel className="divide-y divide-neon-cyan/10" brackets={false}>
        <Row icon={<Type className="w-4 h-4" />} label="Persona" sub="How Jarvis addresses you">
          <input
            value={prefs.personaName}
            onChange={(e) => updatePrefs({ personaName: e.target.value })}
            maxLength={16}
            className="bg-transparent text-right font-mono text-sm text-neon-cyan outline-none border-b border-neon-cyan/40 focus:border-neon-cyan w-32 py-1"
          />
        </Row>
        <Row icon={<Volume2 className="w-4 h-4" />} label="Voice output" sub="Speak assistant replies">
          <Toggle
            checked={prefs.voice}
            onChange={(v) => updatePrefs({ voice: v })}
          />
        </Row>
        <Row icon={<Vibrate className="w-4 h-4" />} label="Haptic feedback" sub="Vibrate on key actions">
          <Toggle
            checked={prefs.haptics}
            onChange={(v) => updatePrefs({ haptics: v })}
          />
        </Row>
        <Row icon={<Moon className="w-4 h-4" />} label="Density" sub="Comfortable or compact">
          <Segmented
            value={prefs.density}
            options={[
              { value: 'compact', label: 'COMPACT' },
              { value: 'comfortable', label: 'COMFY' },
            ]}
            onChange={(v) => updatePrefs({ density: v as 'compact' | 'comfortable' })}
          />
        </Row>
      </HexPanel>

      <HexPanel className="px-3 py-3 space-y-1.5" brackets>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-neon-cyan" />
          <span className="font-display text-xs tracking-[.2em] text-steel-50">SYSTEM</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-steel-200">
          <div className="text-steel-400">VERSION</div><div className="text-right text-neon-cyan text-glow">1.0.0</div>
          <div className="text-steel-400">UPTIME</div><div className="text-right">{formatUptime(uptime)}</div>
          <div className="text-steel-400">STARTED</div><div className="text-right">{new Date(startedAt).toLocaleTimeString('en-GB')}</div>
          <div className="text-steel-400">MODULES</div><div className="text-right">{modules.length} loaded</div>
        </div>
      </HexPanel>

      <HexPanel className="px-3 py-3 space-y-2" brackets>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neon-cyan" />
          <span className="font-display text-xs tracking-[.2em] text-steel-50">DATA</span>
        </div>
        <p className="font-mono text-[10.5px] leading-relaxed text-steel-400">
          Conversation history and preferences are stored in this device&apos;s local storage.
          Nothing is uploaded. You can clear history at any time.
        </p>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all conversation history? This cannot be undone.')) {
                clearHistory()
              }
            }}
            className="flex-1 hud-panel px-3 py-2 flex items-center justify-center gap-2 text-neon-red/80
              border-neon-red/40 hover:border-neon-red/70 active:scale-[.98] transition-all focus-ring"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] tracking-[.2em]">CLEAR HISTORY</span>
          </button>
          <button
            type="button"
            onClick={() => resetPrefs()}
            className="flex-1 hud-panel px-3 py-2 flex items-center justify-center gap-2 text-neon-cyan/80
              hover:border-neon-cyan/70 active:scale-[.98] transition-all focus-ring"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] tracking-[.2em]">RESET PREFS</span>
          </button>
        </div>
      </HexPanel>

      <p className="text-center font-mono text-[10px] text-steel-400 pt-1">
        J.A.R.V.I.S. — MOBILE COMMAND DECK · BUILD 2026.06
      </p>
    </div>
  )
}

interface RowProps {
  icon: React.ReactNode
  label: string
  sub?: string
  children: React.ReactNode
}

function Row({ icon, label, sub, children }: RowProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <span className="text-neon-cyan">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[12px] text-steel-50 tracking-[.05em]">{label}</div>
        {sub && <div className="font-mono text-[10px] text-steel-400">{sub}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition-colors focus-ring
        ${checked ? 'bg-neon-cyan/30 border-neon-cyan/70 shadow-neon-cyan' : 'bg-void-700 border-steel-600'}`}
    >
      <span
        className={`absolute top-[2px] h-4 w-4 rounded-full transition-transform
          ${checked ? 'translate-x-[22px] bg-neon-cyan shadow-[0_0_8px_rgba(34,224,255,.8)]' : 'translate-x-[2px] bg-steel-200'}`}
      />
    </button>
  )
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="hud-panel inline-flex p-0.5 border-neon-cyan/30">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 font-mono text-[10px] tracking-[.18em] rounded-sm transition-all
            ${value === o.value
              ? 'bg-neon-cyan/20 text-neon-cyan text-glow'
              : 'text-steel-400 hover:text-steel-200'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

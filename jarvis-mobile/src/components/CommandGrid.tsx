import { useState } from 'react'
import {
  Lightbulb,
  Music,
  CloudSun,
  CalendarClock,
  Radar,
  ShieldCheck,
  Stethoscope,
  Satellite,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { COMMANDS } from '../data/commands'
import { useAssistantStore } from '../stores/assistant'
import { useMockStream } from '../hooks/useMockStream'
import type { Command } from '../types'
import { HexPanel } from './HexPanel'
import { useToastStore } from '../stores/toast'
import { playSfx } from '../utils/sound'
import { tapStrong } from '../utils/haptics'

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Music,
  CloudSun,
  CalendarClock,
  Radar,
  ShieldCheck,
  Stethoscope,
  Satellite,
  Sparkles,
}

interface CommandCardProps {
  cmd: Command
  onRun: (cmd: Command) => void
  busy: boolean
}

function CommandCard({ cmd, onRun, busy }: CommandCardProps) {
  const Icon = ICON_MAP[cmd.icon] ?? Sparkles
  return (
    <button
      type="button"
      onClick={() => onRun(cmd)}
      disabled={busy}
      className="hud-panel relative group px-3 py-3 flex flex-col items-start gap-2 text-left
        active:scale-[.98] transition-transform focus-ring disabled:opacity-60"
    >
      <div className="absolute top-2 right-2 hud-label opacity-60">{cmd.category}</div>
      <div
        className="h-9 w-9 grid place-items-center rounded-md border border-neon-cyan/30 bg-neon-cyan/5
          group-hover:border-neon-cyan/60 transition-colors"
        style={{ boxShadow: '0 0 10px rgba(34,224,255,.2)' }}
      >
        <Icon className="w-4 h-4 text-neon-cyan" />
      </div>
      <div>
        <div className="font-display text-sm tracking-[.18em] text-steel-50 text-glow">
          {cmd.label.toUpperCase()}
        </div>
        <div className="mt-0.5 font-mono text-[10px] leading-relaxed text-steel-400 line-clamp-2">
          {cmd.description}
        </div>
      </div>
      <div className="mt-auto self-end font-mono text-[9px] tracking-[.2em] text-neon-cyan/60 group-hover:text-neon-cyan">
        {busy ? 'EXECUTING…' : '> RUN'}
      </div>
    </button>
  )
}

/**
 * CommandGrid — quick actions palette. Tap a card to inject a system message
 * and stream a canned response, optionally switching to the chat tab.
 */
export function CommandGrid({ onClose }: { onClose?: () => void }) {
  const addMessage = useAssistantStore((s) => s.addMessage)
  const haptics = useAssistantStore((s) => s.prefs.haptics)
  const { stream } = useMockStream()
  const [busyId, setBusyId] = useState<string | null>(null)
  const pushToast = useToastStore((s) => s.push)

  const run = (cmd: Command) => {
    if (busyId) return
    setBusyId(cmd.id)
    if (haptics) tapStrong()
    playSfx('success')
    pushToast({
      tone: cmd.id === 'lock' || cmd.id === 'alert' ? 'alert' : 'success',
      title: `${cmd.label.toUpperCase()} EXECUTED`,
      body: cmd.description,
    })
    addMessage({ role: 'system', content: `> EXECUTING ${cmd.label.toUpperCase()}` })
    const id = addMessage({ role: 'assistant', content: '', pending: true, command: cmd.label })
    stream(id, cmd.response, { cps: 32, prefix: '' })
    setTimeout(() => setBusyId(null), Math.max(800, cmd.response.length * 30))
    onClose?.()
  }

  return (
    <div className="px-4 pt-3 pb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="hud-label">QUICK ACTIONS</div>
          <div className="font-display text-sm tracking-[.25em] text-steel-50 text-glow">COMMANDS</div>
        </div>
        <span className="hud-chip">8 LOADED</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {COMMANDS.map((c) => (
          <CommandCard key={c.id} cmd={c} onRun={run} busy={busyId !== null} />
        ))}
      </div>
      <HexPanel className="mt-3 px-3 py-2.5" brackets>
        <div className="flex items-center gap-2">
          <span className="hud-chip">TIP</span>
          <span className="font-mono text-[11px] text-steel-200">
            Tap a tile to broadcast the response to the chat stream.
          </span>
        </div>
      </HexPanel>
    </div>
  )
}

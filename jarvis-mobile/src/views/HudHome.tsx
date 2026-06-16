import { useEffect, useRef, useState } from 'react'
import { JarvisCore } from '../components/JarvisCore'
import { MissionFeed } from '../components/MissionFeed'
import { ChatStream } from '../components/ChatStream'
import { VoiceOrb } from '../components/VoiceOrb'
import { useAssistantStore } from '../stores/assistant'
import { useMockStream } from '../hooks/useMockStream'
import { formatGreeting, formatNumber } from '../utils/format'
import { useUiStore } from '../stores/ui'
import { useSystemStore } from '../stores/system'
import { ChevronRight, Cpu, Zap, MessageSquare, Power } from 'lucide-react'
import { generateReply } from '../data/replies'
import { useTilt } from '../hooks/useTilt'
import { useToastStore } from '../stores/toast'
import { playSfx } from '../utils/sound'
import { tapStrong } from '../utils/haptics'

/**
 * HudHome — the default landing view. Features a large JarvisCore (tap to
 * greet), a rotating mission feed, a quick greeting, a compact telemetry
 * strip, and quick links to the other tabs. The core has a subtle 3D
 * parallax tilt on touch/mouse.
 */
export function HudHome() {
  const persona = useAssistantStore((s) => s.prefs.personaName)
  const setTab = useUiStore((s) => s.setTab)
  const haptics = useAssistantStore((s) => s.prefs.haptics)
  const messagesLen = useAssistantStore((s) => s.messages.length)
  const vitals = useSystemStore((s) => s.vitals)
  const modules = useSystemStore((s) => s.modules)
  const addMessage = useAssistantStore((s) => s.addMessage)
  const { stream } = useMockStream()
  const pushToast = useToastStore((s) => s.push)
  const [now, setNow] = useState(() => new Date())
  const chatRef = useRef<HTMLDivElement | null>(null)
  const { ref: coreRef, tilt } = useTilt<HTMLButtonElement>(6)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const handleCoreTap = () => {
    if (pulse) return
    setPulse(true)
    setTimeout(() => setPulse(false), 600)
    if (haptics) tapStrong()
    playSfx('tap')
    pushToast({ tone: 'info', title: 'STATUS REQUEST', body: 'Querying systems…', ttl: 1800 })
    const prompt = 'Jarvis, status report'
    addMessage({ role: 'user', content: prompt })
    const id = addMessage({ role: 'assistant', content: '', pending: true })
    stream(id, generateReply(prompt, { persona, historyTurns: messagesLen }), { cps: 42 })
  }

  const cpu = vitals.find((v) => v.key === 'cpu')?.value ?? 0
  const mem = vitals.find((v) => v.key === 'mem')?.value ?? 0
  const net = vitals.find((v) => v.key === 'net')?.value ?? 0
  const batt = vitals.find((v) => v.key === 'batt')?.value ?? 0
  const online = modules.filter((m) => m.status === 'online').length

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-2 pb-3">
        <div className="hud-label">STATUS · {formatGreeting(now).toUpperCase()}</div>
        <div className="mt-0.5 font-display text-lg tracking-[.18em] text-steel-50 text-glow">
          {formatGreeting(now)}, {persona}
        </div>
        <div className="mt-1 font-mono text-[10px] tracking-[.22em] text-neon-cyan/70">
          {'> '}
          {online === modules.length
            ? 'ALL SYSTEMS NOMINAL'
            : `${online}/${modules.length} MODULES ONLINE`}
        </div>
      </div>

      <div className="relative mx-auto my-1" style={{ perspective: 800 }}>
        <div
          className="absolute inset-0 -m-12 rounded-full blur-3xl opacity-60 pointer-events-none"
          style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(34,224,255,.25) 0%, rgba(34,224,255,0) 70%)' }}
        />
        <button
          ref={coreRef}
          type="button"
          onClick={handleCoreTap}
          aria-label="Request status"
          className={`relative focus-ring rounded-full transition-transform active:scale-[.98] ${pulse ? 'animate-shake' : ''}`}
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <JarvisCore size={260} />
        </button>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 hud-chip">TAP CORE · GREET</div>
      </div>

      <div className="px-4 mt-3">
        <MissionFeed />
      </div>

      <div className="px-4 mt-2 grid grid-cols-4 gap-1.5">
        <Stat label="CPU" value={`${formatNumber(cpu, 0)}%`} />
        <Stat label="MEM" value={`${formatNumber(mem, 0)}%`} />
        <Stat label="NET" value={`${formatNumber(net, 1)}`} />
        <Stat label="BAT" value={`${formatNumber(batt, 0)}%`} />
      </div>

      <div className="px-4 mt-2 grid grid-cols-3 gap-2">
        <QuickLink icon={<MessageSquare className="w-3.5 h-3.5" />} label="CHAT" onClick={() => setTab('chat')} />
        <QuickLink icon={<Cpu className="w-3.5 h-3.5" />} label="VITALS" onClick={() => setTab('telemetry')} />
        <QuickLink icon={<Zap className="w-3.5 h-3.5" />} label="CMDS" onClick={() => setTab('commands')} />
      </div>

      <div className="mt-3 mx-4 hud-panel p-3 flex items-center justify-between">
        <div>
          <div className="hud-label flex items-center gap-1">
            <Power className="w-3 h-3" /> VOICE INTERFACE
          </div>
          <div className="font-mono text-[11px] text-steel-200 mt-0.5">Tap the orb to begin.</div>
        </div>
        <VoiceOrb size={56} />
      </div>

      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-1">
          <div className="hud-label">RECENT TRANSMISSIONS</div>
          <button
            type="button"
            onClick={() => setTab('chat')}
            className="font-mono text-[9px] tracking-[.2em] text-neon-cyan/80 hover:text-neon-cyan focus-ring"
          >
            OPEN <ChevronRight className="w-3 h-3 inline -mt-0.5" />
          </button>
        </div>
        <div className="hud-panel p-0 overflow-hidden">
          <ChatStream bottomRef={chatRef} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-panel px-2 py-2 flex flex-col items-center">
      <span className="hud-label">[{label}]</span>
      <span className="font-display text-sm tracking-[.05em] text-neon-cyan text-glow mt-0.5">
        {value}
      </span>
    </div>
  )
}

function QuickLink({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hud-panel px-2 py-2.5 flex flex-col items-center gap-1
        hover:border-neon-cyan/60 hover:bg-neon-cyan/5 transition-all active:scale-95 focus-ring"
    >
      <span className="text-neon-cyan">{icon}</span>
      <span className="font-mono text-[9px] tracking-[.2em] text-steel-200">{label}</span>
    </button>
  )
}

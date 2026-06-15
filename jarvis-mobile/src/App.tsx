import { useEffect, useMemo } from 'react'
import { TopStrip } from './components/TopStrip'
import { BottomNav } from './components/BottomNav'
import { ScanlineOverlay } from './components/ScanlineOverlay'
import { useUiStore } from './stores/ui'
import { useTelemetry } from './hooks/useTelemetry'
import { HudHome } from './views/HudHome'
import { ChatView } from './views/ChatView'
import { TelemetryView } from './components/TelemetryView'
import { CommandGrid } from './components/CommandGrid'
import { SettingsPanel } from './components/SettingsPanel'
import { useAssistantStore } from './stores/assistant'
import type { TabId } from './types'

const TAB_TITLES: Record<TabId, string> = {
  home: 'CORE',
  chat: 'CHAT',
  telemetry: 'TELEMETRY',
  commands: 'COMMANDS',
  settings: 'SETTINGS',
}

function useAmbientParticles(count = 14) {
  // Stable particle set for the ambient floating dots in the background.
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        size: 1 + Math.random() * 2,
        opacity: 0.25 + Math.random() * 0.45,
      })),
    [count],
  )
}

function AmbientParticles() {
  const particles = useAmbientParticles(18)
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 block rounded-full bg-neon-cyan"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: '0 0 4px rgba(34,224,255,.7)',
            animation: `floatUp ${14 + p.delay}s linear infinite`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function ViewHost() {
  const tab = useUiStore((s) => s.tab)
  return (
    <main
      key={tab}
      className="flex-1 min-h-0 overflow-y-auto animate-slide-up"
      role="tabpanel"
      aria-label={TAB_TITLES[tab]}
    >
      {tab === 'home' && <HudHome />}
      {tab === 'chat' && <ChatView />}
      {tab === 'telemetry' && <TelemetryView />}
      {tab === 'commands' && <CommandGrid />}
      {tab === 'settings' && <SettingsPanel />}
    </main>
  )
}

function App() {
  // Drive live telemetry.
  useTelemetry()

  // Pre-warm SpeechSynthesis voices (Chrome lazy-loads).
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
    }
  }, [])

  // Seed the chat with a single welcome system bubble on first run.
  const messagesLen = useAssistantStore((s) => s.messages.length)
  const addMessage = useAssistantStore((s) => s.addMessage)
  useEffect(() => {
    if (messagesLen > 0) return
    addMessage({ role: 'system', content: 'CHANNEL READY · AWAITING INPUT' })
  }, [messagesLen, addMessage])

  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      <AmbientParticles />
      <ScanlineOverlay />
      <TopStrip />
      <ViewHost />
      <BottomNav />
    </div>
  )
}

export default App

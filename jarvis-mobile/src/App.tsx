import { lazy, Suspense, useEffect, useState } from 'react'
import { TopStrip } from './components/TopStrip'
import { BottomNav } from './components/BottomNav'
import { ScanlineOverlay } from './components/ScanlineOverlay'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BootSequence } from './components/BootSequence'
import { ToastHost } from './components/ToastHost'
import { useUiStore } from './stores/ui'
import { useTelemetry } from './hooks/useTelemetry'
import { useAssistantStore } from './stores/assistant'
import { useSwipeTabs } from './hooks/useSwipeTabs'
import { isSoundEnabled, playSfx } from './utils/sound'
import { tapSoft, tapStrong } from './utils/haptics'
import { useToastStore } from './stores/toast'
import type { TabId } from './types'

// Lazy-load each view to keep the initial bundle small. They split into
// separate chunks because Vite's manualChunks + React.lazy cooperate.
const HudHome = lazy(() => import('./views/HudHome').then((m) => ({ default: m.HudHome })))
const ChatView = lazy(() => import('./views/ChatView').then((m) => ({ default: m.ChatView })))
const TelemetryView = lazy(() => import('./components/TelemetryView').then((m) => ({ default: m.TelemetryView })))
const CommandGrid = lazy(() => import('./components/CommandGrid').then((m) => ({ default: m.CommandGrid })))
const SettingsPanel = lazy(() => import('./components/SettingsPanel').then((m) => ({ default: m.SettingsPanel })))

const TAB_TITLES: Record<TabId, string> = {
  home: 'CORE',
  chat: 'CHAT',
  telemetry: 'TELEMETRY',
  commands: 'COMMANDS',
  settings: 'SETTINGS',
}

function AmbientParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: (i * 0.7) % 14,
    size: 1 + ((i * 13) % 5) * 0.4,
    opacity: 0.25 + ((i * 7) % 5) * 0.08,
  }))
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
  const setTab = useUiStore((s) => s.setTab)
  useSwipeTabs()
  return (
    <main
      key={tab}
      className="flex-1 min-h-0 overflow-y-auto animate-slide-up"
      role="tabpanel"
      aria-label={TAB_TITLES[tab]}
    >
      <Suspense fallback={<ViewSkeleton label={TAB_TITLES[tab]} />}>
        {tab === 'home' && <HudHome />}
        {tab === 'chat' && <ChatView />}
        {tab === 'telemetry' && <TelemetryView />}
        {tab === 'commands' && <CommandGrid onClose={() => setTab('chat')} />}
        {tab === 'settings' && <SettingsPanel />}
      </Suspense>
    </main>
  )
}

function ViewSkeleton({ label }: { label: string }) {
  return (
    <div className="px-4 pt-6 space-y-3" role="status" aria-label={`Loading ${label}`}>
      <div className="h-3 w-32 hud-panel animate-pulse" />
      <div className="h-32 w-full hud-panel animate-pulse" />
      <div className="h-20 w-full hud-panel animate-pulse" />
    </div>
  )
}

function App() {
  // Drive live telemetry.
  useTelemetry()

  // Wire side-effects: sound on tab change, haptics on first user gesture.
  const tab = useUiStore((s) => s.tab)
  const haptics = useAssistantStore((s) => s.prefs.haptics)
  const voice = useAssistantStore((s) => s.prefs.voice)
  const clearToasts = useToastStore((s) => s.clear)

  useEffect(() => {
    if (isSoundEnabled()) playSfx('tap')
    if (haptics) tapSoft()
  }, [tab, haptics])

  useEffect(() => {
    const onFirstGesture = () => {
      if (haptics) tapStrong()
      window.removeEventListener('pointerdown', onFirstGesture)
    }
    window.addEventListener('pointerdown', onFirstGesture, { once: true })
    return () => window.removeEventListener('pointerdown', onFirstGesture)
  }, [haptics])

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

  // Boot sequence on first launch.
  const [booted, setBooted] = useState(false)
  useEffect(() => {
    if (booted) return
    const t = window.setTimeout(() => {
      setBooted(true)
      clearToasts()
      if (isSoundEnabled()) playSfx('boot')
      if (haptics) tapStrong()
    }, 2400)
    return () => window.clearTimeout(t)
  }, [booted, haptics, clearToasts])

  // Respect voice preference: cancel any TTS on unmount.
  useEffect(() => {
    if (!voice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [voice])

  return (
    <ErrorBoundary>
      <div className="relative min-h-[100dvh] flex flex-col">
        <AmbientParticles />
        <ScanlineOverlay />
        <TopStrip />
        <ViewHost />
        <BottomNav />
        <ToastHost />
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </div>
    </ErrorBoundary>
  )
}

export default App

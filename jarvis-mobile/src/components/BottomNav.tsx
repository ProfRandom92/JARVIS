import { Home, MessageSquare, Activity, Zap, Settings as Cog } from 'lucide-react'
import { useUiStore } from '../stores/ui'
import type { TabId } from '../types'

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'CORE', Icon: Home },
  { id: 'chat', label: 'CHAT', Icon: MessageSquare },
  { id: 'telemetry', label: 'VITALS', Icon: Activity },
  { id: 'commands', label: 'CMDS', Icon: Zap },
  { id: 'settings', label: 'SETUP', Icon: Cog },
]

/**
 * BottomNav — the primary tab bar. Uses a fixed-position strip with
 * chamfered bracket markers and an active-tab indicator dot.
 */
export function BottomNav() {
  const tab = useUiStore((s) => s.tab)
  const setTab = useUiStore((s) => s.setTab)

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 safe-pb"
      role="tablist"
      aria-label="Primary"
    >
      <div className="mx-3 mb-2 hud-panel relative">
        <div className="grid grid-cols-5">
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={`group relative flex flex-col items-center gap-0.5 py-2.5 transition-colors focus-ring
                  ${active ? 'text-neon-cyan text-glow' : 'text-steel-400 hover:text-steel-200'}`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.6} />
                <span className="font-mono text-[9px] tracking-[.2em]">{label}</span>
                {active && (
                  <>
                    <span className="absolute top-1 h-1 w-1 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(34,224,255,.9)]" />
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

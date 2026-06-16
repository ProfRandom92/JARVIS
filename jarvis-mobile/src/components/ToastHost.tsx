import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { useToastStore, type ToastTone } from '../stores/toast'

const ICONS: Record<ToastTone, typeof CheckCircle2> = {
  info: Info,
  success: CheckCircle2,
  alert: AlertTriangle,
  amber: AlertTriangle,
}

const COLORS: Record<ToastTone, { text: string; border: string; glow: string }> = {
  info: { text: 'text-neon-cyan', border: 'border-neon-cyan/50', glow: 'shadow-neon-cyan' },
  success: { text: 'text-neon-mint', border: 'border-neon-mint/50', glow: '' },
  alert: { text: 'text-neon-red', border: 'border-neon-red/60', glow: 'shadow-neon-red' },
  amber: { text: 'text-neon-amber', border: 'border-neon-amber/60', glow: 'shadow-neon-amber' },
}

/**
 * ToastHost — fixed-position stack of floating notifications. Reads from the
 * toast store and renders one card per toast with an explicit dismiss button.
 */
export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed top-2 inset-x-0 z-[60] flex flex-col items-center gap-2 px-3 safe-pt"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone]
        const c = COLORS[t.tone]
        return (
          <div
            key={t.id}
            className={`pointer-events-auto animate-slide-up w-full max-w-sm hud-panel ${c.border} ${c.glow} px-3 py-2.5 flex items-start gap-2.5`}
            role="status"
          >
            <Icon className={`w-4 h-4 ${c.text} mt-0.5 shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className={`font-mono text-[12px] tracking-[.05em] ${c.text}`}>{t.title}</div>
              {t.body && (
                <div className="mt-0.5 font-mono text-[10.5px] text-steel-200 leading-snug">
                  {t.body}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="text-steel-400 hover:text-steel-200 p-1 -m-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

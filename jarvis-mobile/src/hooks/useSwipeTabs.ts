import { useEffect, useRef } from 'react'
import type { TabId } from '../types'
import { useUiStore } from '../stores/ui'

const TAB_ORDER: TabId[] = ['home', 'chat', 'telemetry', 'commands', 'settings']

interface UseSwipeTabsOptions {
  /** Pixel threshold to trigger a navigation. */
  threshold?: number
  /** Maximum horizontal pixel offset allowed without swallowing the event. */
  horizontalTolerance?: number
}

/**
 * useSwipeTabs — attach to the main scroll container to navigate between
 * the bottom-nav tabs with horizontal swipe gestures. Returns the props you
 * spread on the scroll element.
 */
export function useSwipeTabs({
  threshold = 60,
  horizontalTolerance = 12,
}: UseSwipeTabsOptions = {}) {
  const tab = useUiStore((s) => s.tab)
  const setTab = useUiStore((s) => s.setTab)
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null)

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      startRef.current = { x: t.clientX, y: t.clientY, t: Date.now() }
    }
    const onEnd = (e: TouchEvent) => {
      const start = startRef.current
      startRef.current = null
      if (!start) return
      const t = e.changedTouches[0]
      if (!t) return
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      if (Math.abs(dy) > Math.abs(dx) + horizontalTolerance) return
      if (Math.abs(dx) < threshold) return
      const idx = TAB_ORDER.indexOf(tab)
      if (idx < 0) return
      const dir = dx < 0 ? 1 : -1 // swipe left → next tab
      const next = TAB_ORDER[idx + dir]
      if (next) setTab(next)
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [tab, setTab, threshold, horizontalTolerance])
}

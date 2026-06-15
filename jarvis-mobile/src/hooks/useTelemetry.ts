import { useEffect, useState } from 'react'
import { useSystemStore } from '../stores/system'

/**
 * Continuously generate believable telemetry samples.
 * Each vital has its own oscillation pattern so the HUD looks alive.
 */
export function useTelemetry(): void {
  const pushSample = useSystemStore((s) => s.pushSample)

  useEffect(() => {
    let cpu = 32
    let mem = 41
    let net = 12
    let batt = 78
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      if (now - last >= 750) {
        last = now
        cpu = clampTarget(cpu + (Math.random() - 0.5) * 6, 30, 46)
        mem = clampTarget(mem + (Math.random() - 0.5) * 3, 38, 52)
        net = clampTarget(net + (Math.random() - 0.5) * 5, 6, 22)
        batt = clampTarget(batt - 0.05 + (Math.random() - 0.5) * 0.2, 64, 82)
        pushSample('cpu', cpu)
        pushSample('mem', mem)
        pushSample('net', net)
        pushSample('batt', batt)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pushSample])
}

function clampTarget(v: number, min: number, max: number): number {
  if (v < min) return min + (min - v) * 0.3
  if (v > max) return max - (v - max) * 0.3
  return v
}

/** Hook returning the elapsed seconds since the app started. */
export function useUptime(): number {
  const startedAt = useSystemStore((s) => s.startedAt)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return Math.floor((now - startedAt) / 1000)
}

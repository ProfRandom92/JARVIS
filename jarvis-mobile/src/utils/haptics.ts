// Tiny haptic helper. Falls back to a silent no-op where Vibration API is
// missing (most desktops, iOS Safari).

export function tap(pattern: number | number[] = 10): void {
  if (typeof navigator === 'undefined') return
  if (typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(pattern)
  } catch {
    /* ignore */
  }
}

export function tapSoft(): void {
  tap(8)
}

export function tapStrong(): void {
  tap([12, 30, 16])
}

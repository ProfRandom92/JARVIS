// Lightweight WebAudio sound effects — no external library.
// Each effect is a short, soft beep built from oscillators.

type Sfx = 'tap' | 'success' | 'alert' | 'boot'

let ctx: AudioContext | null = null
let enabled = true

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setSoundEnabled(v: boolean): void {
  enabled = v
}

export function isSoundEnabled(): boolean {
  return enabled
}

function tone(freq: number, durMs: number, gain = 0.05, type: OscillatorType = 'sine', delayMs = 0): void {
  if (!enabled) return
  const c = audio()
  if (!c) return
  const t0 = c.currentTime + delayMs / 1000
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + durMs / 1000 + 0.02)
}

export function playSfx(name: Sfx): void {
  switch (name) {
    case 'tap':
      tone(660, 80, 0.04, 'square')
      break
    case 'success':
      tone(523.25, 90, 0.05, 'sine')
      tone(783.99, 110, 0.05, 'sine', 90)
      break
    case 'alert':
      tone(220, 140, 0.06, 'sawtooth')
      tone(196, 140, 0.06, 'sawtooth', 100)
      break
    case 'boot':
      tone(392, 90, 0.05, 'sine')
      tone(523.25, 90, 0.05, 'sine', 100)
      tone(659.25, 120, 0.05, 'sine', 200)
      break
  }
}

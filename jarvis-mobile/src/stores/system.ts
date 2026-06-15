import { create } from 'zustand'
import type { ModuleHealth, Vital } from '../types'
import { clamp, uid } from '../utils/format'

interface SystemState {
  vitals: Vital[]
  modules: ModuleHealth[]
  startedAt: number
  setVitals: (vitals: Vital[]) => void
  pushSample: (key: Vital['key'], v: number) => void
  setModules: (modules: ModuleHealth[]) => void
  pingModule: (id: string) => void
}

const SAMPLE_LEN = 36

function makeSeries(): { t: number; v: number }[] {
  const out: { t: number; v: number }[] = []
  const now = Date.now()
  for (let i = SAMPLE_LEN - 1; i >= 0; i -= 1) {
    out.push({ t: now - i * 750, v: 0 })
  }
  return out
}

const INITIAL_VITALS: Vital[] = [
  { key: 'cpu', label: 'CPU', unit: '%', value: 32, max: 100, series: makeSeries() },
  { key: 'mem', label: 'MEM', unit: '%', value: 41, max: 100, series: makeSeries() },
  { key: 'net', label: 'NET', unit: 'MB/s', value: 12, max: 80, series: makeSeries() },
  { key: 'batt', label: 'BATT', unit: '%', value: 78, max: 100, series: makeSeries() },
]

const INITIAL_MODULES: ModuleHealth[] = [
  { id: uid('mod'), name: 'Voice Cortex', description: 'Speech recognition + synthesis', status: 'online', lastCheck: Date.now(), latencyMs: 38 },
  { id: uid('mod'), name: 'Vision Array', description: 'Camera + scene analysis', status: 'online', lastCheck: Date.now(), latencyMs: 52 },
  { id: uid('mod'), name: 'Network Mesh', description: 'Perimeter + satellite uplink', status: 'online', lastCheck: Date.now(), latencyMs: 21 },
  { id: uid('mod'), name: 'Memory Bank', description: 'Long-term context storage', status: 'online', lastCheck: Date.now(), latencyMs: 12 },
  { id: uid('mod'), name: 'Inference Core', description: 'Reasoning + planning', status: 'online', lastCheck: Date.now(), latencyMs: 84 },
  { id: uid('mod'), name: 'Power Grid', description: 'Energy + battery management', status: 'online', lastCheck: Date.now(), latencyMs: 9 },
]

export const useSystemStore = create<SystemState>((set, get) => ({
  vitals: INITIAL_VITALS,
  modules: INITIAL_MODULES,
  startedAt: Date.now(),

  setVitals: (vitals) => set({ vitals }),

  pushSample: (key, v) => {
    const next = get().vitals.map((vt) => {
      if (vt.key !== key) return vt
      const series = [...vt.series, { t: Date.now(), v }]
      if (series.length > SAMPLE_LEN) series.shift()
      return { ...vt, value: clamp(v, 0, vt.max), series }
    })
    set({ vitals: next })
  },

  setModules: (modules) => set({ modules }),

  pingModule: (id) => {
    const next = get().modules.map((m) =>
      m.id === id
        ? {
            ...m,
            lastCheck: Date.now(),
            latencyMs: clamp(m.latencyMs + (Math.random() - 0.5) * 8, 4, 240),
          }
        : m,
    )
    set({ modules: next })
  },
}))

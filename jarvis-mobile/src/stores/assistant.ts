import { create } from 'zustand'
import type { AssistantStatus, Message, Prefs } from '../types'
import { uid } from '../utils/format'

const HISTORY_KEY = 'jarvis.history'
const PREFS_KEY = 'jarvis.prefs'

function loadHistory(): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Message[]
    return Array.isArray(parsed) ? parsed.slice(-200) : []
  } catch {
    return []
  }
}

function saveHistory(messages: Message[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-200)))
  } catch {
    /* quota / privacy mode — ignore */
  }
}

const DEFAULT_PREFS: Prefs = {
  personaName: 'Sir',
  voice: true,
  haptics: true,
  density: 'comfortable',
}

function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) }
  } catch {
    return DEFAULT_PREFS
  }
}

function savePrefs(prefs: Prefs): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    /* ignore */
  }
}

interface AssistantState {
  messages: Message[]
  status: AssistantStatus
  transcript: string
  partialReply: string
  prefs: Prefs

  addMessage: (msg: Omit<Message, 'id' | 'createdAt'>) => string
  appendPartial: (id: string, content: string) => void
  finalizeMessage: (id: string, content: string) => void
  clearHistory: () => void
  setStatus: (status: AssistantStatus) => void
  setTranscript: (transcript: string) => void
  setPartialReply: (content: string) => void
  updatePrefs: (patch: Partial<Prefs>) => void
  resetPrefs: () => void
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  messages: loadHistory(),
  status: 'idle',
  transcript: '',
  partialReply: '',
  prefs: loadPrefs(),

  addMessage: (msg) => {
    const m: Message = { id: uid('msg'), createdAt: Date.now(), ...msg }
    const next = [...get().messages, m]
    set({ messages: next })
    saveHistory(next)
    return m.id
  },

  appendPartial: (id, content) => {
    const next = get().messages.map((m) => (m.id === id ? { ...m, content } : m))
    set({ messages: next })
    saveHistory(next)
  },

  finalizeMessage: (id, content) => {
    const next = get().messages.map((m) =>
      m.id === id ? { ...m, content, pending: false } : m,
    )
    set({ messages: next, partialReply: '' })
    saveHistory(next)
  },

  clearHistory: () => {
    set({ messages: [] })
    saveHistory([])
  },

  setStatus: (status) => set({ status }),
  setTranscript: (transcript) => set({ transcript }),
  setPartialReply: (partialReply) => set({ partialReply }),

  updatePrefs: (patch) => {
    const next = { ...get().prefs, ...patch }
    set({ prefs: next })
    savePrefs(next)
  },

  resetPrefs: () => {
    set({ prefs: DEFAULT_PREFS })
    savePrefs(DEFAULT_PREFS)
  },
}))

import { create } from 'zustand'
import { uid } from '../utils/format'

export type ToastTone = 'info' | 'success' | 'alert' | 'amber'

export interface Toast {
  id: string
  tone: ToastTone
  title: string
  body?: string
  /** Auto-dismiss in ms. 0 means it stays until manually dismissed. */
  ttl: number
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id' | 'ttl'> & { ttl?: number }) => string
  dismiss: (id: string) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = uid('toast')
    const ttl = t.ttl ?? 3500
    const next: Toast = { id, ttl, ...t }
    set({ toasts: [...get().toasts, next] })
    if (ttl > 0) {
      window.setTimeout(() => get().dismiss(id), ttl)
    }
    return id
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  clear: () => set({ toasts: [] }),
}))

export function toast(input: { tone?: ToastTone; title: string; body?: string; ttl?: number }): string {
  return useToastStore.getState().push({ tone: 'info', ...input })
}

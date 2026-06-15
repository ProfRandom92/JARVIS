import { create } from 'zustand'
import type { TabId } from '../types'

interface UiState {
  tab: TabId
  sheet: TabId | null
  setTab: (tab: TabId) => void
  openSheet: (sheet: TabId | null) => void
  toggleSheet: (sheet: TabId) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  tab: 'home',
  sheet: null,
  setTab: (tab) => set({ tab, sheet: null }),
  openSheet: (sheet) => set({ sheet }),
  toggleSheet: (sheet) => set({ sheet: get().sheet === sheet ? null : sheet }),
}))

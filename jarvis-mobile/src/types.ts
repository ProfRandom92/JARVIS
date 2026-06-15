// Domain types for the Mobile Jarvis app.

export type Role = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: Role
  content: string
  createdAt: number
  pending?: boolean
  /** Optional simulated side-effect for command bubbles. */
  command?: string
}

export type AssistantStatus = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface VitalSample {
  t: number
  v: number
}

export interface Vital {
  key: 'cpu' | 'mem' | 'net' | 'batt'
  label: string
  unit: string
  value: number
  series: VitalSample[]
  max: number
}

export type ModuleStatus = 'online' | 'degraded' | 'offline'

export interface ModuleHealth {
  id: string
  name: string
  description: string
  status: ModuleStatus
  lastCheck: number
  latencyMs: number
}

export interface Command {
  id: string
  label: string
  description: string
  icon: string
  response: string
  category: 'home' | 'system' | 'intel'
}

export type TabId = 'home' | 'chat' | 'telemetry' | 'commands' | 'settings'

export interface Prefs {
  personaName: string
  voice: boolean
  haptics: boolean
  density: 'compact' | 'comfortable'
}

import type { ReactNode } from 'react'

interface HexPanelProps {
  children: ReactNode
  className?: string
  amber?: boolean
  brackets?: boolean
}

/**
 * HexPanel — a glass HUD container with subtle neon border and optional
 * chamfered corner brackets. Used as the base "card" across the app.
 */
export function HexPanel({ children, className = '', amber = false, brackets = true }: HexPanelProps) {
  return (
    <div className={`relative ${amber ? 'hud-panel-amber' : 'hud-panel'} ${brackets ? 'hud-bracket' : ''} ${className}`}>
      {children}
    </div>
  )
}

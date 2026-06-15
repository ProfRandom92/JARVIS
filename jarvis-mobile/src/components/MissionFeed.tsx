import { useEffect, useState } from 'react'

const TIPS = [
  '> Stand by for daily brief at 09:00 local',
  '> 3 authorised devices on the local mesh',
  '> Weather uplink stable, last sync 14s ago',
  '> Memory bank at 41% — within nominal range',
  '> All perimeter sensors report green',
  '> Voice cortex warm — ready for input',
]

/**
 * MissionFeed — a crossfading single-line ticker of rotating system tips.
 * Mimics a news ticker at the bottom of a sci-fi HUD.
 */
export function MissionFeed() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % TIPS.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-6 overflow-hidden font-mono text-[10px] tracking-[.2em] text-neon-cyan/80">
      <div
        key={i}
        className="animate-slide-up whitespace-nowrap"
        style={{ animation: 'slideUp .5s cubic-bezier(.2,.8,.2,1) forwards' }}
      >
        {TIPS[i]}
      </div>
    </div>
  )
}

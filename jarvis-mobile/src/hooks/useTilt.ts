import { useEffect, useRef, useState, type RefObject } from 'react'

interface TiltState {
  rotateX: number
  rotateY: number
  glowX: number
  glowY: number
}

/**
 * useTilt — produces a subtle 3D parallax tilt based on touch/mouse position
 * relative to the element. Used to make the JarvisCore feel holographic.
 * Returns a ref object that can be attached to any HTMLElement.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 8) {
  const ref = useRef<T | null>(null) as RefObject<T>
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width - 0.5
      const y = (clientY - rect.top) / rect.height - 0.5
      setTilt({
        rotateX: -y * max,
        rotateY: x * max,
        glowX: (x + 0.5) * 100,
        glowY: (y + 0.5) * 100,
      })
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) handle(t.clientX, t.clientY)
    }
    const onMove = (e: MouseEvent) => handle(e.clientX, e.clientY)
    const reset = () => setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', reset)
    el.addEventListener('touchmove', onTouch, { passive: true })
    el.addEventListener('touchend', reset)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', reset)
      el.removeEventListener('touchmove', onTouch)
      el.removeEventListener('touchend', reset)
    }
  }, [max])

  return { ref, tilt }
}

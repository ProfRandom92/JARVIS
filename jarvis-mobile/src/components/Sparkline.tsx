import { useEffect, useRef } from 'react'
import type { VitalSample } from '../types'

interface SparklineProps {
  samples: VitalSample[]
  color?: string
  height?: number
  width?: number
  fill?: boolean
}

/**
 * Sparkline — a compact canvas-based line chart for live telemetry data.
 * Memoized by parent to avoid re-creating the canvas on every sample.
 */
export function Sparkline({
  samples,
  color = '#22E0FF',
  height = 36,
  width = 120,
  fill = true,
}: SparklineProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    if (samples.length < 2) return

    const max = Math.max(...samples.map((s) => s.v), 1)
    const min = Math.min(...samples.map((s) => s.v), 0)
    const range = Math.max(1, max - min)
    const stepX = width / (samples.length - 1)

    // Grid
    ctx.strokeStyle = 'rgba(34,224,255,.08)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 4; i += 1) {
      const y = (height / 3) * i + 1
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    const points = samples.map((s, i) => {
      const x = i * stepX
      const y = height - ((s.v - min) / range) * (height - 4) - 2
      return [x, y] as const
    })

    if (fill) {
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, color + '55')
      grad.addColorStop(1, color + '00')
      ctx.beginPath()
      ctx.moveTo(points[0]![0], height)
      points.forEach(([x, y]) => ctx.lineTo(x, y))
      ctx.lineTo(points[points.length - 1]![0], height)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()
    }

    ctx.beginPath()
    points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 1.4
    ctx.shadowColor = color
    ctx.shadowBlur = 4
    ctx.stroke()
    ctx.shadowBlur = 0

    // Last point dot
    const last = points[points.length - 1]!
    ctx.beginPath()
    ctx.arc(last[0], last[1], 1.8, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }, [samples, color, height, width, fill])

  return <canvas ref={ref} className="block" aria-hidden />
}

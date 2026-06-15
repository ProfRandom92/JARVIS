import { useCallback, useEffect, useRef } from 'react'
import { useAssistantStore } from '../stores/assistant'

/**
 * Mock streaming — emulates a token-by-token LLM response so the UI feels alive
 * even without a real backend. The "speed" of the stream is deterministic.
 */
export function useMockStream() {
  const appendPartial = useAssistantStore((s) => s.appendPartial)
  const finalizeMessage = useAssistantStore((s) => s.finalizeMessage)
  const setStatus = useAssistantStore((s) => s.setStatus)
  const setPartialReply = useAssistantStore((s) => s.setPartialReply)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const stream = useCallback(
    (id: string, text: string, opts: { cps?: number; prefix?: string } = {}) => {
      clearTimers()
      setStatus('thinking')
      const cps = opts.cps ?? 38 // characters per second
      const full = (opts.prefix ?? '') + text
      const interval = 1000 / cps
      let i = 0
      const start = () => {
        setStatus('speaking')
        const step = () => {
          i = Math.min(full.length, i + 1)
          const slice = full.slice(0, i)
          appendPartial(id, slice)
          setPartialReply(slice)
          if (i < full.length) {
            timers.current.push(window.setTimeout(step, interval))
          } else {
            finalizeMessage(id, full)
            setPartialReply('')
            setStatus('idle')
          }
        }
        step()
      }
      timers.current.push(window.setTimeout(start, 350))
    },
    [appendPartial, clearTimers, finalizeMessage, setPartialReply, setStatus],
  )

  return { stream, cancel: clearTimers }
}

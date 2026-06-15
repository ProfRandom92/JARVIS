import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssistantStore } from '../stores/assistant'

// Minimal shape of the browser speech recognition API. We avoid pulling
// @types/webkit via tsconfig lib by declaring what we need locally.
interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: { resultIndex: number; results: { 0: { transcript: string }; length: number; isFinal: boolean }[] & { isFinal: boolean }[] }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}

export interface UseVoiceResult {
  supported: boolean
  listening: boolean
  transcript: string
  start: () => void
  stop: () => void
  reset: () => void
  speak: (text: string) => void
  speaking: boolean
  cancelSpeak: () => void
}

/**
 * Voice hook using the Web Speech API. Gracefully no-ops if the browser
 * doesn't support it (e.g. iOS Safari without flags).
 */
export function useVoice(): UseVoiceResult {
  const setStatus = useAssistantStore((s) => s.setStatus)
  const setTranscript = useAssistantStore((s) => s.setTranscript)
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setLocalTranscript] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setSupported(Boolean(SR))
    if (!SR) return
    const r = new SR()
    r.lang = 'en-US'
    r.continuous = false
    r.interimResults = true
    r.onresult = (event) => {
      let final = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i]
        if (!res) continue
        if (res.isFinal) final += res[0].transcript
        else interim += res[0].transcript
      }
      const text = (final + interim).trim()
      setLocalTranscript(text)
      setTranscript(text)
    }
    r.onerror = () => {
      setListening(false)
      setStatus('idle')
    }
    r.onend = () => {
      setListening(false)
      setStatus('idle')
    }
    recognitionRef.current = r
    return () => {
      try { r.abort() } catch { /* ignore */ }
    }
  }, [setStatus, setTranscript])

  const start = useCallback(() => {
    const r = recognitionRef.current
    if (!r || listening) return
    try {
      setLocalTranscript('')
      setTranscript('')
      setListening(true)
      setStatus('listening')
      r.start()
    } catch {
      setListening(false)
      setStatus('idle')
    }
  }, [listening, setStatus, setTranscript])

  const stop = useCallback(() => {
    const r = recognitionRef.current
    if (!r) return
    try { r.stop() } catch { /* ignore */ }
  }, [])

  const reset = useCallback(() => {
    setLocalTranscript('')
    setTranscript('')
  }, [setTranscript])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 1
    u.pitch = 1
    u.volume = 0.85
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find((v) => /en-GB/i.test(v.lang)) || voices.find((v) => /en/i.test(v.lang))
    if (preferred) u.voice = preferred
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }, [])

  const cancelSpeak = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [])

  return { supported, listening, transcript, start, stop, reset, speak, speaking, cancelSpeak }
}

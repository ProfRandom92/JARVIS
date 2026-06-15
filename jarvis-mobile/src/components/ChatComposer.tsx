import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { useAssistantStore } from '../stores/assistant'
import { useMockStream } from '../hooks/useMockStream'
import { useVoice } from '../hooks/useVoice'
import { generateReply } from '../data/replies'
import { VoiceOrb } from './VoiceOrb'

interface ChatComposerProps {
  onSent?: () => void
}

/**
 * ChatComposer — input row for sending a message to Jarvis. Supports typed
 * text, send-on-enter, and shows the live voice transcript while listening.
 */
export function ChatComposer({ onSent }: ChatComposerProps) {
  const [text, setText] = useState('')
  const addMessage = useAssistantStore((s) => s.addMessage)
  const { stream } = useMockStream()
  const voice = useVoice()
  const prefs = useAssistantStore((s) => s.prefs)

  const send = (raw: string) => {
    const content = raw.trim()
    if (!content) return
    addMessage({ role: 'user', content })
    const id = addMessage({ role: 'assistant', content: '', pending: true })
    const reply = generateReply(content)
    stream(id, reply, { cps: 40 })
    if (prefs.voice) {
      // small delay so the user hears the response after the typing animation
      setTimeout(() => voice.speak(reply), Math.min(1800, reply.length * 30))
    }
    setText('')
    voice.reset()
    onSent?.()
  }

  return (
    <div className="px-3 pt-2 pb-3 safe-pb">
      {voice.transcript && (
        <div className="mb-2 hud-panel-amber px-3 py-1.5 font-mono text-[10.5px] text-neon-amber/90 text-glow-amber truncate">
          <span className="tracking-[.2em] text-neon-amber/70">{'> TRANSCRIPT'}</span>
          <span className="ml-2 text-neon-amber">{voice.transcript}</span>
        </div>
      )}
      <div className="hud-panel flex items-center gap-2 px-2 py-2">
        <VoiceOrb size={44} />
        <div className="flex-1 relative">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(text)
              }
            }}
            placeholder={voice.listening ? 'Listening…' : 'Type a message or tap the orb…'}
            className="w-full bg-transparent font-mono text-[12.5px] text-steel-50 placeholder:text-steel-400/60
              outline-none px-2 py-1.5 border-b border-neon-cyan/20 focus:border-neon-cyan/70"
            aria-label="Message Jarvis"
          />
          {text && (
            <Sparkles className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neon-cyan/40" />
          )}
        </div>
        <button
          type="button"
          onClick={() => send(text)}
          disabled={!text.trim()}
          className="grid place-items-center h-9 w-9 rounded-md border border-neon-cyan/60 bg-neon-cyan/10
            text-neon-cyan text-glow disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-neon-cyan/20 active:scale-95 transition-all focus-ring"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] tracking-[.2em] text-steel-400 px-1">
        <span>&gt; CHANNEL ENCRYPTED · LOCAL</span>
        <span>{voice.supported ? 'VOICE READY' : 'VOICE OFFLINE'}</span>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { useAssistantStore } from '../stores/assistant'
import { formatShortTime } from '../utils/format'
import { Copy, Volume2 } from 'lucide-react'
import { useVoice } from '../hooks/useVoice'

interface MessageBubbleProps {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
  pending?: boolean
  command?: string
}

/**
 * MessageBubble — individual chat entry. User bubbles align right in a
 * cyan-ice panel; assistant bubbles align left with a leading core dot and
 * a terminal-style caret.
 */
export function MessageBubble({ id, role, content, createdAt, pending, command }: MessageBubbleProps) {
  const voice = useVoice()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [content])

  const isUser = role === 'user'
  const isSystem = role === 'system'

  if (isSystem) {
    return (
      <div className="my-2 flex justify-center">
        <span className="hud-chip">{content}</span>
      </div>
    )
  }

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          ref={ref}
          className={`relative px-3 py-2 text-sm leading-relaxed backdrop-blur-md
            ${isUser
              ? 'rounded-2xl rounded-br-sm border border-neon-ice/40 bg-neon-ice/5 text-steel-50'
              : 'rounded-2xl rounded-bl-sm border border-neon-cyan/30 bg-neon-cyan/[.04] text-steel-50'}
            ${pending ? 'animate-pulse' : ''}`}
        >
          {!isUser && (
            <div className="absolute -left-[7px] top-3 h-2.5 w-2.5 rotate-45 border-l border-b border-neon-cyan/40 bg-void-800" />
          )}
          <div className="flex items-start gap-2">
            {!isUser && (
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(34,224,255,.7)]" />
            )}
            <div className="flex-1">
              {!isUser && (
                <div className="mb-0.5 font-mono text-[9px] tracking-[.25em] text-neon-cyan/70 text-glow">
                  {command ? `> ${command.toUpperCase()}` : '> JARVIS'}
                </div>
              )}
              <div className={`whitespace-pre-wrap break-words ${isUser ? 'text-right' : ''}`}>
                {content}
                {pending && (
                  <span className="ml-0.5 inline-block w-1.5 h-3 align-middle bg-neon-cyan/80 animate-typing-blink" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 text-[10px] font-mono text-steel-400 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="tracking-[.2em]">{formatShortTime(createdAt)}</span>
          <span className="hidden" data-id={id} />
          {!isUser && !pending && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(content).catch(() => undefined)}
                className="hover:text-neon-cyan transition-colors focus-ring"
                aria-label="Copy"
              >
                <Copy className="w-3 h-3" />
              </button>
              {voice.supported && (
                <button
                  type="button"
                  onClick={() => voice.speak(content)}
                  className="hover:text-neon-cyan transition-colors focus-ring"
                  aria-label="Speak"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ChatStreamProps {
  bottomRef?: React.RefObject<HTMLDivElement>
}

export function ChatStream({ bottomRef }: ChatStreamProps) {
  const messages = useAssistantStore((s) => s.messages)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <div className="font-display text-sm tracking-[.3em] text-neon-cyan/80 text-glow">
            SECURE CHANNEL ESTABLISHED
          </div>
          <div className="mt-2 font-mono text-[11px] leading-relaxed text-steel-400">
            Type a command or tap the voice orb to begin. All processing happens locally on this device.
          </div>
        </div>
      )}
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          id={m.id}
          role={m.role}
          content={m.content}
          createdAt={m.createdAt}
          pending={m.pending}
          command={m.command}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

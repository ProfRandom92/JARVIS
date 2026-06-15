import { ChatStream } from '../components/ChatStream'
import { ChatComposer } from '../components/ChatComposer'
import { useRef } from 'react'

/**
 * ChatView — full-screen chat with composer pinned at the bottom.
 */
export function ChatView() {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  return (
    <div className="flex flex-col h-[calc(100dvh-160px)]">
      <div className="px-4 pt-3">
        <div className="hud-label">SECURE LINK</div>
        <div className="font-display text-sm tracking-[.25em] text-steel-50 text-glow">CONVERSATION</div>
      </div>
      <ChatStream bottomRef={bottomRef} />
      <ChatComposer />
    </div>
  )
}

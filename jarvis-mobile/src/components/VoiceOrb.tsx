import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useVoice } from '../hooks/useVoice'

interface VoiceOrbProps {
  size?: number
}

/**
 * VoiceOrb — tap-to-talk button with a waveform ring. Renders an animated
 * circle with bars around it that scale with the listening state. Uses the
 * browser's SpeechRecognition if available, otherwise a no-op.
 */
export function VoiceOrb({ size = 76 }: VoiceOrbProps) {
  const voice = useVoice()
  const bars = 5

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => (voice.listening ? voice.stop() : voice.start())}
        className={`focus-ring relative grid place-items-center rounded-full border transition-all
          ${voice.listening
            ? 'border-neon-amber/80 bg-neon-amber/10 shadow-neon-amber animate-pulse-glow'
            : 'border-neon-cyan/70 bg-void-800/60 shadow-neon-cyan active:scale-95'}
        `}
        style={{ width: size, height: size }}
        aria-label={voice.listening ? 'Stop listening' : 'Start listening'}
        aria-pressed={voice.listening}
      >
        {/* Waveform bars */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="flex items-end gap-1 h-6">
            {Array.from({ length: bars }).map((_, i) => (
              <div
                key={i}
                className={`w-[3px] rounded-sm ${voice.listening ? 'bg-neon-amber' : 'bg-neon-cyan/80'}`}
                style={{
                  height: voice.listening ? `${30 + Math.abs(Math.sin((Date.now() / 220) + i)) * 70}%` : '40%',
                  boxShadow: voice.listening
                    ? '0 0 6px rgba(255,179,71,.7)'
                    : '0 0 6px rgba(34,224,255,.6)',
                  animation: voice.listening ? `wave ${0.7 + i * 0.1}s ease-in-out infinite` : 'none',
                  animationDelay: voice.listening ? `${i * 0.08}s` : '0s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Center icon */}
        <div className="relative z-10">
          {voice.listening ? (
            <MicOff className="w-6 h-6 text-neon-amber" />
          ) : (
            <Mic className="w-6 h-6 text-neon-cyan" />
          )}
        </div>

        {/* Outer ring */}
        <div
          className={`absolute inset-[-6px] rounded-full border ${
            voice.listening ? 'border-neon-amber/40' : 'border-neon-cyan/30'
          }`}
        />
        <div
          className={`absolute inset-[-14px] rounded-full border ${
            voice.listening ? 'border-neon-amber/15' : 'border-neon-cyan/10'
          }`}
        />
      </button>
      <div className="font-mono text-[9px] tracking-[.25em] text-steel-400">
        {voice.listening
          ? '> LISTENING'
          : voice.supported
            ? '> TAP TO TALK'
            : '> VOICE UNAVAILABLE'}
      </div>
      {voice.speaking && (
        <div className="flex items-center gap-1 text-[10px] font-mono text-neon-cyan/80">
          <Volume2 className="w-3 h-3" />
          <span className="tracking-[.2em]">SPEAKING</span>
        </div>
      )}
    </div>
  )
}

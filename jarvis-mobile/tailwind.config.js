/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // JARVIS HUD palette
        void: {
          900: '#02060B',
          800: '#06121B',
          700: '#0A1A26',
        },
        neon: {
          cyan: '#22E0FF',
          ice: '#7AB8FF',
          amber: '#FFB347',
          red: '#FF4D6D',
          mint: '#6FFFD1',
        },
        steel: {
          50: '#D7F3FF',
          200: '#A8D5EC',
          400: '#5B7A91',
          600: '#2C4A60',
          800: '#0E2333',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 12px rgba(34,224,255,.45), inset 0 0 8px rgba(34,224,255,.18)',
        'neon-amber': '0 0 14px rgba(255,179,71,.55), inset 0 0 8px rgba(255,179,71,.18)',
        'neon-red': '0 0 14px rgba(255,77,109,.6), inset 0 0 8px rgba(255,77,109,.2)',
        'inner-line': 'inset 0 0 0 1px rgba(34,224,255,.35)',
      },
      keyframes: {
        spinSlow: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        spinReverse: { '0%': { transform: 'rotate(360deg)' }, '100%': { transform: 'rotate(0deg)' } },
        pulseGlow: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.65', transform: 'scale(1.06)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(110vh)', opacity: '0' },
          '10%': { opacity: '.7' },
          '90%': { opacity: '.7' },
          '100%': { transform: 'translateY(-10vh)', opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(8px)' },
        },
        typingBlink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        arcCharge: {
          '0%': { strokeDashoffset: '999' },
          '100%': { strokeDashoffset: '0' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-3px)' },
          '40%': { transform: 'translateX(3px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        wave: {
          '0%,100%': { transform: 'scaleY(.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'spin-slow': 'spinSlow 14s linear infinite',
        'spin-slower': 'spinSlow 28s linear infinite',
        'spin-reverse': 'spinReverse 18s linear infinite',
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
        'float-up': 'floatUp 14s linear infinite',
        'scanline': 'scanline .8s linear infinite',
        'typing-blink': 'typingBlink 1s steps(2) infinite',
        'slide-up': 'slideUp .35s cubic-bezier(.2,.8,.2,1)',
        'arc-charge': 'arcCharge 1.2s ease-out forwards',
        'shake': 'shake .4s ease-in-out',
        'ticker': 'ticker 22s linear infinite',
        'wave': 'wave 1.1s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(34,224,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,224,255,.05) 1px, transparent 1px)',
        'radial-spot':
          'radial-gradient(60% 60% at 50% 30%, rgba(34,224,255,.18) 0%, rgba(34,224,255,0) 70%)',
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      },
    },
  },
  plugins: [],
}

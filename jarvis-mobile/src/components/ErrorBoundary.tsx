import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Top-level error boundary. Catches uncaught render errors and shows a
 * full-screen, on-brand recovery panel instead of a blank page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[Jarvis] Uncaught error:', error, info)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[100dvh] flex items-center justify-center p-6">
          <div className="hud-panel-amber max-w-sm w-full p-5 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto text-neon-amber text-glow-amber" />
            <div className="mt-3 font-display text-sm tracking-[.25em] text-steel-50 text-glow">
              SUBSYSTEM OFFLINE
            </div>
            <div className="mt-2 font-mono text-[11px] text-steel-200 break-words">
              {this.state.error.message}
            </div>
            <button
              type="button"
              onClick={this.reset}
              className="mt-4 inline-flex items-center gap-2 hud-panel px-3 py-2 font-mono text-[11px] tracking-[.2em] text-neon-cyan hover:border-neon-cyan/70 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" /> REINITIALISE
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

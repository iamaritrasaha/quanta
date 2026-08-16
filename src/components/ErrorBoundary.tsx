import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('QUANTA instrument crashed:', error, errorInfo)
    }
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="instrument-crash-screen">
          <div className="instrument-crash-card glass-instrument">
            <span className="card-kicker">INSTRUMENT FAULT</span>
            <h2 className="crash-title">QUANTA encountered an unexpected error</h2>
            <p className="crash-desc">
              The visualization instrument has stopped responding. Your progress in this session
              may be lost, but no data was corrupted.
            </p>
            <button className="scene-ctrl-btn reset-btn" onClick={this.handleReload}>
              RELOAD INSTRUMENT
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

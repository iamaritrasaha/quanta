import { lazy, Suspense, useEffect, useState } from 'react'
import { useQuantaStore } from './state/quantaStore'
import { bohrRadius, hydrogenEnergy } from './physics/hydrogen'
import { PeriodicTable } from './components/PeriodicTable'
import { ModeNavigation } from './components/ModeNavigation'
import { LevelDiagram } from './components/LevelDiagram'
import { TransitionControls } from './components/TransitionControls'
import { SpectrumVisualizer } from './components/SpectrumVisualizer'
import { QuantumControls } from './components/QuantumControls'
import { EquationInspector } from './components/EquationInspector'
import './styles.css'

const AtomScene = lazy(() =>
  import('./rendering/AtomScene').then((m) => ({ default: m.AtomScene }))
)

function Explorer({ onBackToTable }: { onBackToTable: () => void }) {
  const mode = useQuantaStore((s) => s.mode)
  const level = useQuantaStore((s) => s.level)
  const orbital = useQuantaStore((s) => s.orbital)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const togglePlaying = useQuantaStore((s) => s.togglePlaying)
  const setAnimationSpeed = useQuantaStore((s) => s.setAnimationSpeed)
  const reset = useQuantaStore((s) => s.reset)

  const [resetCameraCount, setResetCameraCount] = useState(0)

  const modeDescriptions: Record<string, { title: string; subtitle: string; badge: string }> = {
    overview: {
      title: 'HYDROGEN OVERVIEW',
      subtitle: 'Fundamental constants and baseline properties of the simplest atom',
      badge: 'ELEMENT 01',
    },
    bohr: {
      title: 'BOHR QUANTIZATION MODEL',
      subtitle: 'Quantized electron orbits with discrete radius rₙ = a₀·n² and electronic state transitions',
      badge: 'HISTORICAL / CONCEPTUAL MODEL',
    },
    quantum: {
      title: 'SCHRÖDINGER EIGENFUNCTIONS',
      subtitle: 'Exact wave function probability distributions |ψ(r,θ,φ)|² — not classical electron orbits',
      badge: 'MODERN QUANTUM MECHANICS',
    },
    energy: {
      title: 'ENERGY LEVEL EIGENVALUES',
      subtitle: 'Quantized energy rungs approaching the 0 eV ionization boundary',
      badge: 'SPECTRAL STRUCTURE',
    },
    spectra: {
      title: 'EMISSION SPECTROSCOPY',
      subtitle: 'Continuous UV-Visible-IR spectrum mapping and Rydberg series line classification',
      badge: 'SPECTRAL SIGNAL',
    },
    equations: {
      title: 'MATHEMATICAL DERIVATION INSPECTOR',
      subtitle: 'Step-by-step physical equations, state substitutions, and exact numerical results',
      badge: 'ANALYTIC ENGINE',
    },
  }

  const currentModeInfo = modeDescriptions[mode] ?? modeDescriptions.overview
  const energyEv = hydrogenEnergy(level)
  const radiusPm = bohrRadius(level) * 1e12

  return (
    <main className="explorer-screen">
      {/* Top Header Bar */}
      <header className="explorer-top-bar glass-surface">
        <div className="bar-left">
          <button className="back-to-table-btn" onClick={onBackToTable}>
            ← PERIODIC TABLE
          </button>
          <div className="element-heading">
            <span className="element-atomic-badge">1</span>
            <div className="element-title-group">
              <h2 className="element-name-heading">
                Hydrogen <span className="element-symbol-tag">H</span>
              </h2>
              <span className="element-sub-heading">Protium · 1p⁺ 1e⁻ · ~1.008 u</span>
            </div>
          </div>
        </div>

        {/* Central Mode Navigation Bar */}
        <ModeNavigation />

        {/* Right Info Metric */}
        <div className="bar-right">
          <div className="quick-state-card">
            <span className="quick-state-label">CURRENT STATE</span>
            <strong className="quick-state-val">
              {mode === 'quantum' ? (orbital ? `${orbital} State` : `n = ${level}`) : `n = ${level}`}
            </strong>
            <span className="quick-state-sub">{energyEv.toFixed(3)} eV</span>
          </div>
        </div>
      </header>

      {/* Main Scientific Visualization Workspace */}
      <div className="explorer-workspace">
        {/* 3D Scene Viewport */}
        <section className="scene-container" aria-label="3D Atomic Visualization">
          <Suspense
            fallback={
              <div className="scene-loader-fallback">
                <div className="loader-spinner" />
                <span>INITIALIZING QUANTUM ATOMIC FIELD…</span>
              </div>
            }
          >
            <AtomScene resetCameraTrigger={resetCameraCount} />
          </Suspense>

          {/* Floating Scene Header Caption */}
          <div className="scene-overlay-caption glass-floating">
            <span className="scene-mode-badge">{currentModeInfo.badge}</span>
            <strong className="scene-caption-title">{currentModeInfo.title}</strong>
            <p className="scene-caption-desc">{currentModeInfo.subtitle}</p>
          </div>

          {/* Scale Disclaimer Note */}
          <div className="scene-scale-disclaimer">
            <span>VISUAL SCALE COMPRESSED · PHOTON WAVE PACKET IS A PEDAGOGICAL VISUALIZATION</span>
          </div>

          {/* Floating Interactive Scene Controls */}
          <div className="floating-scene-controls glass-floating">
            {/* Speed Multiplier Pill */}
            <div className="speed-selector" title="Animation time scale">
              <button
                className={`speed-btn ${speed === 0.5 ? 'active' : ''}`}
                onClick={() => setAnimationSpeed(0.5)}
              >
                0.5×
              </button>
              <button
                className={`speed-btn ${speed === 1.0 ? 'active' : ''}`}
                onClick={() => setAnimationSpeed(1.0)}
              >
                1×
              </button>
              <button
                className={`speed-btn ${speed === 2.0 ? 'active' : ''}`}
                onClick={() => setAnimationSpeed(2.0)}
              >
                2×
              </button>
            </div>

            <div className="ctrl-separator" />

            {/* Play / Pause Toggle */}
            <button
              className={`scene-ctrl-btn ${playing ? 'playing' : 'paused'}`}
              onClick={togglePlaying}
              title={playing ? 'Pause motion' : 'Play motion'}
            >
              {playing ? 'PAUSE' : 'PLAY'}
            </button>

            {/* Reset Camera */}
            <button
              className="scene-ctrl-btn"
              onClick={() => setResetCameraCount((c) => c + 1)}
              title="Reset camera viewpoint"
            >
              RESET VIEW
            </button>

            {/* Reset Full State */}
            <button className="scene-ctrl-btn reset-btn" onClick={reset} title="Reset to ground state">
              RESET ATOM
            </button>
          </div>
        </section>

        {/* Dynamic Contextual Scientific Rail */}
        <aside className="contextual-rail" aria-label="Scientific Context and Controls">
          {mode === 'overview' && (
            <div className="overview-pane">
              <div className="overview-card glass-instrument">
                <span className="card-kicker">ELEMENT IDENTITY</span>
                <h3 className="card-title">Hydrogen (H · 1)</h3>
                <p className="card-desc">
                  Hydrogen is the most abundant chemical substance in the universe, constituting roughly
                  75% of all baryonic mass. It serves as the exact analytic testing ground for quantum
                  mechanics because its single-electron potential has exact mathematical solutions.
                </p>
                <div className="data-table">
                  <div className="data-row">
                    <span className="data-key">Atomic Number</span>
                    <strong className="data-val">1</strong>
                  </div>
                  <div className="data-row">
                    <span className="data-key">Standard Mass</span>
                    <strong className="data-val">1.0080 u</strong>
                  </div>
                  <div className="data-row">
                    <span className="data-key">Ground State</span>
                    <strong className="data-val">1s¹</strong>
                  </div>
                  <div className="data-row">
                    <span className="data-key">Bohr Radius (a₀)</span>
                    <strong className="data-val">52.9177 pm</strong>
                  </div>
                  <div className="data-row">
                    <span className="data-key">Ionization Energy</span>
                    <strong className="data-val">13.5984 eV</strong>
                  </div>
                </div>
              </div>
              <TransitionControls />
            </div>
          )}

          {mode === 'bohr' && (
            <div className="bohr-pane">
              <div className="bohr-state-card glass-instrument">
                <span className="card-kicker">STATIONARY ORBIT STATUS</span>
                <div className="bohr-metrics-grid">
                  <div className="b-metric">
                    <span className="b-label">Orbit Level</span>
                    <strong className="b-val">n = {level}</strong>
                  </div>
                  <div className="b-metric">
                    <span className="b-label">Binding Energy</span>
                    <strong className="b-val">{energyEv.toFixed(3)} eV</strong>
                  </div>
                  <div className="b-metric">
                    <span className="b-label">Bohr Radius</span>
                    <strong className="b-val">{radiusPm.toFixed(1)} pm</strong>
                  </div>
                </div>
              </div>
              <TransitionControls />
              <LevelDiagram />
            </div>
          )}

          {mode === 'quantum' && (
            <div className="quantum-pane">
              <QuantumControls />
            </div>
          )}

          {mode === 'energy' && (
            <div className="energy-pane">
              <LevelDiagram />
              <TransitionControls />
            </div>
          )}

          {mode === 'spectra' && (
            <div className="spectra-pane">
              <SpectrumVisualizer />
              <TransitionControls />
            </div>
          )}

          {mode === 'equations' && (
            <div className="equations-pane">
              <EquationInspector />
            </div>
          )}
        </aside>
      </div>

      {/* Global Explorer Footer */}
      <footer className="explorer-bottom-footer glass-surface">
        <div className="footer-left">
          <span className="footer-brand">QUANTA — Matter, visualized.</span>
          <span className="footer-meta">
            Created by{' '}
            <a
              href="https://github.com/iamaritrasaha"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-author-link"
            >
              Aritra Saha
            </a>{' '}
            · A Foresight Labs project
          </span>
        </div>
        <div className="footer-right">
          <span>Bohr orbits represent conceptual quantization · Wavefunctions represent exact |ψ|² densities</span>
          <span className="footer-copyright">© 2026 Aritra Saha</span>
        </div>
      </footer>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState<'table' | 'hydrogen'>(() =>
    window.location.hash.includes('/element/hydrogen') ? 'hydrogen' : 'table'
  )

  useEffect(() => {
    const handleHashChange = () => {
      setView(window.location.hash.includes('/element/hydrogen') ? 'hydrogen' : 'table')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const enterHydrogen = () => {
    window.location.hash = '/element/hydrogen'
  }

  const returnToTable = () => {
    window.location.hash = '/'
  }

  return view === 'hydrogen' ? (
    <Explorer onBackToTable={returnToTable} />
  ) : (
    <PeriodicTable onSelectHydrogen={enterHydrogen} />
  )
}

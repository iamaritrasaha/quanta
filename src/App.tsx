import { lazy, Suspense, useEffect, useState } from 'react'
import { useQuantaStore, type ElementKey } from './state/quantaStore'
import { bohrRadius, hydrogenEnergy } from './physics/hydrogen'
import { getHeliumLevel } from './physics/helium'
import { getLithiumLevel } from './physics/lithium'
import { PeriodicTable } from './components/PeriodicTable'
import { ModeNavigation } from './components/ModeNavigation'
import { LevelDiagram } from './components/LevelDiagram'
import { TransitionControls } from './components/TransitionControls'
import { SpectrumVisualizer } from './components/SpectrumVisualizer'
import { QuantumControls } from './components/QuantumControls'
import { EquationInspector } from './components/EquationInspector'
import { HeliumOverview } from './components/HeliumOverview'
import { HeliumShellControls } from './components/HeliumShellControls'
import { HeliumQuantumControls } from './components/HeliumQuantumControls'
import { HeliumLevelDiagram } from './components/HeliumLevelDiagram'
import { HeliumSpectrumVisualizer } from './components/HeliumSpectrumVisualizer'
import { HeliumTransitionControls } from './components/HeliumTransitionControls'
import { HeliumEquationInspector } from './components/HeliumEquationInspector'
import { LithiumOverview } from './components/LithiumOverview'
import { LithiumShellControls } from './components/LithiumShellControls'
import { LithiumQuantumControls } from './components/LithiumQuantumControls'
import { LithiumLevelDiagram } from './components/LithiumLevelDiagram'
import { LithiumSpectrumVisualizer } from './components/LithiumSpectrumVisualizer'
import { LithiumTransitionControls } from './components/LithiumTransitionControls'
import { LithiumEquationInspector } from './components/LithiumEquationInspector'
import './styles.css'

const AtomScene = lazy(() =>
  import('./rendering/AtomScene').then((m) => ({ default: m.AtomScene }))
)

function Explorer({ onBackToTable }: { onBackToTable: () => void }) {
  const activeElement = useQuantaStore((s) => s.activeElement)
  const mode = useQuantaStore((s) => s.mode)
  const level = useQuantaStore((s) => s.level)
  const orbital = useQuantaStore((s) => s.orbital)
  const heliumState = useQuantaStore((s) => s.helium)
  const lithiumState = useQuantaStore((s) => s.lithium)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const togglePlaying = useQuantaStore((s) => s.togglePlaying)
  const setAnimationSpeed = useQuantaStore((s) => s.setAnimationSpeed)
  const reset = useQuantaStore((s) => s.reset)

  const [resetCameraCount, setResetCameraCount] = useState(0)

  const isHydrogen = activeElement === 'hydrogen'
  const isHelium = activeElement === 'helium'
  const isLithium = activeElement === 'lithium'

  const hydrogenModeDescriptions: Record<string, { title: string; subtitle: string; badge: string }> = {
    overview: {
      title: 'HYDROGEN OVERVIEW',
      subtitle: 'Fundamental constants and baseline properties of the simplest atom',
      badge: 'ELEMENT 01 / AVAILABLE',
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

  const heliumModeDescriptions: Record<string, { title: string; subtitle: string; badge: string }> = {
    overview: {
      title: 'HELIUM OVERVIEW',
      subtitle: 'Helium is where the one-electron picture ends · Many-body quantum physics',
      badge: 'ELEMENT 02 / AVAILABLE',
    },
    bohr: {
      title: 'SHELL OCCUPANCY MODEL',
      subtitle: 'Paired electrons in quantized energy shells — illustrative point markers',
      badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
    },
    quantum: {
      title: 'SCHRÖDINGER MANY-BODY DENSITY',
      subtitle: 'Reduced one-electron density ρ(r) derived from effective-charge approximation',
      badge: 'REDUCED PROBABILITY DENSITY',
    },
    energy: {
      title: 'HELIUM I TERM EIGENVALUES',
      subtitle: 'Singlet (S=0) and Triplet (S=1) levels approaching the 24.587 eV ionization threshold',
      badge: 'NIST ASD TERM DIAGRAM',
    },
    spectra: {
      title: 'EMISSION SPECTROSCOPY',
      subtitle: 'Continuous EUV-UV-Visible-IR spectrum mapping and authoritative NIST line transitions',
      badge: 'HELIUM I SPECTROSCOPY',
    },
    equations: {
      title: 'MATHEMATICAL DERIVATION INSPECTOR',
      subtitle: 'Two-electron Hamiltonian with r₁₂ Coulomb repulsion and Pauli singlet spin coupling',
      badge: 'TWO-ELECTRON DERIVATION',
    },
  }

  const lithiumModeDescriptions: Record<string, { title: string; subtitle: string; badge: string }> = {
    overview: {
      title: 'LITHIUM OVERVIEW',
      subtitle: 'Closed 1s² core + 1 outer valence electron · Alkali metal physics',
      badge: 'ELEMENT 03 / AVAILABLE',
    },
    bohr: {
      title: 'SHELL OCCUPANCY MODEL',
      subtitle: 'K-shell (1s²) core pair + L/M/N-shell outer valence electron transitions',
      badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
    },
    quantum: {
      title: 'SCHRÖDINGER REDUCED DENSITY & QUANTUM DEFECT',
      subtitle: 'Reduced one-electron density ρ(r) with core screening and penetration analysis',
      badge: 'REDUCED PROBABILITY DENSITY',
    },
    energy: {
      title: 'LITHIUM I TERM EIGENVALUES',
      subtitle: '²S, ²P°, ²D, ²F° series approaching the 5.392 eV ionization threshold',
      badge: 'NIST ASD TERM DIAGRAM',
    },
    spectra: {
      title: 'EMISSION SPECTROSCOPY',
      subtitle: '670.8 nm resonance doublet and persistent spectral transitions in air',
      badge: 'LITHIUM I SPECTROSCOPY',
    },
    equations: {
      title: 'MATHEMATICAL DERIVATION INSPECTOR',
      subtitle: 'Three-electron Hamiltonian with r₁₂, r₁₃, r₂₃ pair repulsions and core screening',
      badge: 'THREE-ELECTRON DERIVATION',
    },
  }

  const currentModeInfo = isHydrogen
    ? hydrogenModeDescriptions[mode] ?? hydrogenModeDescriptions.overview
    : isHelium
    ? heliumModeDescriptions[mode] ?? heliumModeDescriptions.overview
    : lithiumModeDescriptions[mode] ?? lithiumModeDescriptions.overview

  const hydrogenEnergyEv = hydrogenEnergy(level)
  const currentHeliumLevel = getHeliumLevel(heliumState.selectedLevelId) ?? getHeliumLevel('1s2_1S0')!
  const currentLithiumLevel = getLithiumLevel(lithiumState.selectedLevelId) ?? getLithiumLevel('1s2_2s_2S1_2')!

  return (
    <main className="explorer-screen">
      {/* Top Header Bar */}
      <header className="explorer-top-bar glass-surface">
        <div className="bar-left">
          <button className="back-to-table-btn" onClick={onBackToTable}>
            ← PERIODIC TABLE
          </button>
          <div className="element-heading">
            <span className="element-atomic-badge">{isHydrogen ? '1' : isHelium ? '2' : '3'}</span>
            <div className="element-title-group">
              <h2 className="element-name-heading">
                {isHydrogen ? 'Hydrogen' : isHelium ? 'Helium' : 'Lithium'}{' '}
                <span className="element-symbol-tag">{isHydrogen ? 'H' : isHelium ? 'He' : 'Li'}</span>
              </h2>
              <span className="element-sub-heading">
                {isHydrogen
                  ? 'Protium · 1p⁺ 1e⁻ · ~1.008 u'
                  : isHelium
                  ? '⁴He · 2p⁺ 2n⁰ 2e⁻ · ~4.0026 u'
                  : '⁷Li · 3p⁺ 4n⁰ 3e⁻ · [6.938, 6.997] u'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Mode Navigation Bar */}
        <ModeNavigation />

        {/* Right Info Metric */}
        <div className="bar-right">
          <div className="quick-state-card">
            <span className="quick-state-label">CURRENT STATE</span>
            {isHydrogen ? (
              <>
                <strong className="quick-state-val">
                  {mode === 'quantum' ? (orbital ? `${orbital} State` : `n = ${level}`) : `n = ${level}`}
                </strong>
                <span className="quick-state-sub">{hydrogenEnergyEv.toFixed(3)} eV</span>
              </>
            ) : isHelium ? (
              <>
                <strong className="quick-state-val">
                  {currentHeliumLevel.configuration} {currentHeliumLevel.termSymbol}
                </strong>
                <span className="quick-state-sub">{currentHeliumLevel.energyEv.toFixed(3)} eV</span>
              </>
            ) : (
              <>
                <strong className="quick-state-val">
                  {currentLithiumLevel.configuration} {currentLithiumLevel.termSymbol}
                </strong>
                <span className="quick-state-sub">{currentLithiumLevel.energyEv.toFixed(3)} eV</span>
              </>
            )}
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
            <span>
              {isHydrogen
                ? 'VISUAL SCALE COMPRESSED · PHOTON WAVE PACKET IS A PEDAGOGICAL VISUALIZATION'
                : isHelium
                ? 'NUCLEAR AND ATOMIC SCALES EXAGGERATED FOR CLARITY · ⁴He (2p⁺ 2n⁰)'
                : 'NUCLEAR AND ATOMIC SCALES EXAGGERATED FOR CLARITY · ⁷Li (3p⁺ 4n⁰)'}
            </span>
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
          {isHydrogen ? (
            /* Hydrogen Exploration Rail */
            <>
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
                        <strong className="b-val">{hydrogenEnergyEv.toFixed(3)} eV</strong>
                      </div>
                      <div className="b-metric">
                        <span className="b-label">Bohr Radius</span>
                        <strong className="b-val">{(bohrRadius(level) * 1e12).toFixed(1)} pm</strong>
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
            </>
          ) : isHelium ? (
            /* Helium Exploration Rail */
            <>
              {mode === 'overview' && <HeliumOverview />}
              {mode === 'bohr' && <HeliumShellControls />}
              {mode === 'quantum' && (
                <div className="quantum-pane">
                  <HeliumQuantumControls />
                </div>
              )}
              {mode === 'energy' && (
                <div className="energy-pane">
                  <HeliumLevelDiagram />
                  <HeliumTransitionControls />
                </div>
              )}
              {mode === 'spectra' && (
                <div className="spectra-pane">
                  <HeliumSpectrumVisualizer />
                  <HeliumTransitionControls />
                </div>
              )}
              {mode === 'equations' && (
                <div className="equations-pane">
                  <HeliumEquationInspector />
                </div>
              )}
            </>
          ) : (
            /* Lithium Exploration Rail */
            <>
              {mode === 'overview' && <LithiumOverview />}
              {mode === 'bohr' && <LithiumShellControls />}
              {mode === 'quantum' && (
                <div className="quantum-pane">
                  <LithiumQuantumControls />
                </div>
              )}
              {mode === 'energy' && (
                <div className="energy-pane">
                  <LithiumLevelDiagram />
                  <LithiumTransitionControls />
                </div>
              )}
              {mode === 'spectra' && (
                <div className="spectra-pane">
                  <LithiumSpectrumVisualizer />
                  <LithiumTransitionControls />
                </div>
              )}
              {mode === 'equations' && (
                <div className="equations-pane">
                  <LithiumEquationInspector />
                </div>
              )}
            </>
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
          <span>
            {isHydrogen
              ? 'Bohr orbits represent conceptual quantization · Wavefunctions represent exact |ψ|² densities'
              : isHelium
              ? 'Shell models represent pedagogical occupancy · Quantum views represent reduced |ψ|² densities · NIST ASD He I data'
              : 'Shell models represent pedagogical occupancy · Quantum views represent reduced |ψ|² densities · NIST ASD Li I compilation'}
          </span>
          <span className="footer-copyright">© 2026 Aritra Saha</span>
        </div>
      </footer>
    </main>
  )
}

export default function App() {
  const setActiveElement = useQuantaStore((s) => s.setActiveElement)

  const [view, setView] = useState<'table' | 'explorer'>(() => {
    const hash = window.location.hash
    if (hash.includes('/element/lithium')) return 'explorer'
    if (hash.includes('/element/helium')) return 'explorer'
    if (hash.includes('/element/hydrogen')) return 'explorer'
    return 'table'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.includes('/element/lithium')) {
        setActiveElement('lithium')
        setView('explorer')
      } else if (hash.includes('/element/helium')) {
        setActiveElement('helium')
        setView('explorer')
      } else if (hash.includes('/element/hydrogen')) {
        setActiveElement('hydrogen')
        setView('explorer')
      } else {
        setView('table')
      }
    }

    // Set initial element based on hash
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [setActiveElement])

  const selectElement = (elementKey: ElementKey) => {
    setActiveElement(elementKey)
    window.location.hash = `/element/${elementKey}`
  }

  const returnToTable = () => {
    window.location.hash = '/'
  }

  return view === 'explorer' ? (
    <Explorer onBackToTable={returnToTable} />
  ) : (
    <PeriodicTable onSelectElement={selectElement} onSelectHydrogen={() => selectElement('hydrogen')} />
  )
}

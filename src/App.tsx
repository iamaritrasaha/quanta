import { lazy, Suspense, useEffect, useState } from 'react'
import { useQuantaStore, type ElementKey } from './state/quantaStore'
import { hydrogenEnergy } from './physics/hydrogen'
import { getHeliumLevel } from './physics/helium'
import { getLithiumLevel } from './physics/lithium'
import { getBerylliumLevel } from './physics/beryllium'
import { getBoronLevel } from './physics/boron'
import { PeriodicTable } from './components/PeriodicTable'
import { ModeNavigation } from './components/ModeNavigation'
import { InstrumentRail } from './components/InstrumentRail'
import { getAtomicProperties } from './data/atomicData'
import { getInstrumentModeDescription } from './data/instrumentDescriptions'
import { elementKey, getElementByKey, getElementKeyFromHash } from './data/elements'
import './styles.css'

const AtomScene = lazy(() =>
  import('./rendering/AtomScene').then((m) => ({ default: m.AtomScene }))
)

function readRouteElement() {
  const key = getElementKeyFromHash(window.location.hash)
  return key ? getElementByKey(key) : undefined
}

function Explorer({ onBackToTable }: { onBackToTable: () => void }) {
  const activeElement = useQuantaStore((s) => s.activeElement)
  const mode = useQuantaStore((s) => s.mode)
  const level = useQuantaStore((s) => s.level)
  const orbital = useQuantaStore((s) => s.orbital)
  const heliumState = useQuantaStore((s) => s.helium)
  const lithiumState = useQuantaStore((s) => s.lithium)
  const berylliumState = useQuantaStore((s) => s.beryllium)
  const boronState = useQuantaStore((s) => s.boron)
  const selectedSharedState = useQuantaStore((s) => s.sharedElement.selected)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const togglePlaying = useQuantaStore((s) => s.togglePlaying)
  const setAnimationSpeed = useQuantaStore((s) => s.setAnimationSpeed)
  const reset = useQuantaStore((s) => s.reset)

  const [resetCameraCount, setResetCameraCount] = useState(0)

  const isHydrogen = activeElement === 'hydrogen'
  const isHelium = activeElement === 'helium'
  const isLithium = activeElement === 'lithium'
  const isBeryllium = activeElement === 'beryllium'
  const isBoron = activeElement === 'boron'
  const selectedElement = getElementByKey(activeElement)
  const selectedProperties = selectedElement ? getAtomicProperties(selectedElement.symbol) : undefined

  const currentModeInfo = getInstrumentModeDescription(activeElement, mode)

  const hydrogenEnergyEv = hydrogenEnergy(level)
  const currentHeliumLevel = getHeliumLevel(heliumState.selectedLevelId) ?? getHeliumLevel('1s2_1S0')!
  const currentLithiumLevel = getLithiumLevel(lithiumState.selectedLevelId) ?? getLithiumLevel('1s2_2s_2S1_2')!
  const currentBerylliumLevel = getBerylliumLevel(berylliumState.selectedLevelId) ?? getBerylliumLevel('2s2_1S0')!
  const currentBoronLevel = getBoronLevel(boronState.selectedLevelId) ?? getBoronLevel('2p_2P1_2')!

  return (
    <main className="explorer-screen">
      {/* Top Header Bar */}
      <header className="explorer-top-bar glass-surface">
        <div className="bar-left">
          <button className="back-to-table-btn" onClick={onBackToTable}>
            ← PERIODIC TABLE
          </button>
          <div className="element-heading">
            <span className="element-atomic-badge">{selectedElement?.number ?? 1}</span>
            <div className="element-title-group">
              <h2 className="element-name-heading">
                {selectedElement?.name ?? 'Hydrogen'}{' '}
                <span className="element-symbol-tag">{selectedElement?.symbol ?? 'H'}</span>
              </h2>
              <span className="element-sub-heading">
                {isHydrogen
                  ? 'Protium · 1p⁺ 1e⁻ · ~1.008 u'
                  : isHelium
                  ? '⁴He · 2p⁺ 2n⁰ 2e⁻ · ~4.0026 u'
                  : isLithium
                  ? '⁷Li · 3p⁺ 4n⁰ 3e⁻ · [6.938, 6.997] u'
                  : isBeryllium
                  ? '⁹Be · 4p⁺ 5n⁰ 4e⁻ · 9.0121831(5) u'
                  : isBoron
                  ? '¹¹B · 5p⁺ 6n⁰ 5e⁻ · [10.806, 10.821] u'
                  : `Neutral atom · ${selectedElement?.number ?? ''}p⁺ ${selectedElement?.number ?? ''}e⁻ · ~${selectedProperties?.atomicMassU ? `${selectedProperties.atomicMassU} u` : ''} · ${selectedElement?.category ?? 'Element'}`}
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
            ) : isLithium ? (
              <>
                <strong className="quick-state-val">
                  {currentLithiumLevel.configuration} {currentLithiumLevel.termSymbol}
                </strong>
                <span className="quick-state-sub">{currentLithiumLevel.energyEv.toFixed(3)} eV</span>
              </>
            ) : isBeryllium ? (
              <>
                <strong className="quick-state-val">
                  {currentBerylliumLevel.configuration} {currentBerylliumLevel.termSymbol}
                </strong>
                <span className="quick-state-sub">{currentBerylliumLevel.energyEv.toFixed(3)} eV</span>
              </>
            ) : isBoron ? (
              <>
                <strong className="quick-state-val">
                  {currentBoronLevel.configuration} {currentBoronLevel.termSymbol}
                </strong>
                <span className="quick-state-sub">{currentBoronLevel.energyEv.toFixed(3)} eV</span>
              </>
            ) : (
              <>
                <strong className="quick-state-val">
                  {selectedSharedState && selectedSharedState.id !== 'ground'
                    ? selectedSharedState.label
                    : `Ground state · ${selectedProperties?.electronConfiguration ?? ''}`}
                </strong>
                <span className="quick-state-sub">
                  NEUTRAL ATOM · {selectedElement?.number ?? 0} e⁻
                </span>
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
                : isLithium
                ? 'NUCLEAR AND ATOMIC SCALES EXAGGERATED FOR CLARITY · ⁷Li (3p⁺ 4n⁰)'
                : isBeryllium
                ? 'NUCLEAR AND ATOMIC SCALES EXAGGERATED FOR CLARITY · ⁹Be (4p⁺ 5n⁰) · PEDAGOGICAL NUCLEAR REPRESENTATION'
                : isBoron
                ? 'NUCLEAR AND ATOMIC SCALES EXAGGERATED FOR CLARITY · ¹¹B (5p⁺ 6n⁰) DEFAULT ISOTOPE VISUALIZATION · PEDAGOGICAL NUCLEAR REPRESENTATION'
                : 'ATOMIC AND ELECTRON SCALE COMPRESSED FOR CLARITY · ELECTRON SHELLS ARE IDEALIZED REPRESENTATIONS'}
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

        <InstrumentRail
          activeElement={activeElement}
          mode={mode}
          level={level}
          hydrogenEnergyEv={hydrogenEnergyEv}
          selectedElement={selectedElement}
        />
      </div>

      {/* Global Explorer Footer */}
      <footer className="explorer-bottom-footer glass-surface">
        <div className="footer-left">
          <span className="footer-brand">QUANTA: Matter, visualized.</span>
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
              : isLithium
              ? 'Shell models represent pedagogical occupancy · Quantum views represent reduced |ψ|² densities · NIST ASD Li I compilation'
              : isBeryllium
              ? 'Shell models represent pedagogical occupancy · Quantum views represent reduced |ψ|² densities · NIST ASD Be I data'
              : isBoron
              ? 'Shell models represent pedagogical occupancy · Quantum views represent reduced |ψ|² densities · NIST ASD B I data'
              : 'Shell diagrams show idealized occupancy · NIST ASD levels are shown where available · wavelengths are derived'}
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
    return readRouteElement() ? 'explorer' : 'table'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const element = readRouteElement()
      if (element) {
        setActiveElement(elementKey(element))
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
    <PeriodicTable onSelectElement={selectElement} />
  )
}

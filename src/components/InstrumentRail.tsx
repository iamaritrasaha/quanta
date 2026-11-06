import { lazy, Suspense } from 'react'
import { LevelDiagram } from './LevelDiagram'
import { TransitionControls } from './TransitionControls'
import { SpectrumVisualizer } from './SpectrumVisualizer'
import { QuantumControls } from './QuantumControls'
import { EquationInspector } from './EquationInspector'
import { HeliumOverview } from './HeliumOverview'
import { HeliumShellControls } from './HeliumShellControls'
import { HeliumQuantumControls } from './HeliumQuantumControls'
import { HeliumLevelDiagram } from './HeliumLevelDiagram'
import { HeliumSpectrumVisualizer } from './HeliumSpectrumVisualizer'
import { HeliumTransitionControls } from './HeliumTransitionControls'
import { HeliumEquationInspector } from './HeliumEquationInspector'
import { LithiumOverview } from './LithiumOverview'
import { LithiumShellControls } from './LithiumShellControls'
import { LithiumQuantumControls } from './LithiumQuantumControls'
import { LithiumLevelDiagram } from './LithiumLevelDiagram'
import { LithiumSpectrumVisualizer } from './LithiumSpectrumVisualizer'
import { LithiumTransitionControls } from './LithiumTransitionControls'
import { LithiumEquationInspector } from './LithiumEquationInspector'
import { BerylliumOverview } from './BerylliumOverview'
import { BerylliumShellControls } from './BerylliumShellControls'
import { BerylliumQuantumControls } from './BerylliumQuantumControls'
import { BerylliumLevelDiagram } from './BerylliumLevelDiagram'
import { BerylliumSpectrumVisualizer } from './BerylliumSpectrumVisualizer'
import { BerylliumTransitionControls } from './BerylliumTransitionControls'
import { BerylliumEquationInspector } from './BerylliumEquationInspector'
import { BoronOverview } from './BoronOverview'
import { BoronShellControls } from './BoronShellControls'
import { BoronQuantumControls } from './BoronQuantumControls'
import { BoronLevelDiagram } from './BoronLevelDiagram'
import { BoronSpectrumVisualizer } from './BoronSpectrumVisualizer'
import { BoronTransitionControls } from './BoronTransitionControls'
import { BoronEquationInspector } from './BoronEquationInspector'
import { bohrRadius } from '../physics/hydrogen'
import type { Element, ElementKey } from '../data/elements'
import type { ViewMode } from '../state/quantaStore'

const MultiElementInstrument = lazy(() =>
  import('./MultiElementInstrument').then((module) => ({ default: module.MultiElementInstrument }))
)

type InstrumentRailProps = {
  activeElement: ElementKey
  mode: ViewMode
  level: number
  hydrogenEnergyEv: number
  selectedElement: Element | undefined
}

export function InstrumentRail({
  activeElement,
  mode,
  level,
  hydrogenEnergyEv,
  selectedElement,
}: InstrumentRailProps) {
  const isHydrogen = activeElement === 'hydrogen'
  const isHelium = activeElement === 'helium'
  const isLithium = activeElement === 'lithium'
  const isBeryllium = activeElement === 'beryllium'
  const isBoron = activeElement === 'boron'

  return (
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
      ) : isLithium ? (
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
      ) : isBeryllium ? (
        /* Beryllium Exploration Rail */
        <>
          {mode === 'overview' && <BerylliumOverview />}
          {mode === 'bohr' && <BerylliumShellControls />}
          {mode === 'quantum' && (
            <div className="quantum-pane">
              <BerylliumQuantumControls />
            </div>
          )}
          {mode === 'energy' && (
            <div className="energy-pane">
              <BerylliumLevelDiagram />
              <BerylliumTransitionControls />
            </div>
          )}
          {mode === 'spectra' && (
            <div className="spectra-pane">
              <BerylliumSpectrumVisualizer />
              <BerylliumTransitionControls />
            </div>
          )}
          {mode === 'equations' && (
            <div className="equations-pane">
              <BerylliumEquationInspector />
            </div>
          )}
        </>
      ) : isBoron ? (
        /* Boron Exploration Rail */
        <>
          {mode === 'overview' && <BoronOverview />}
          {mode === 'bohr' && <BoronShellControls />}
          {mode === 'quantum' && (
            <div className="quantum-pane">
              <BoronQuantumControls />
            </div>
          )}
          {mode === 'energy' && (
            <div className="energy-pane">
              <BoronLevelDiagram />
              <BoronTransitionControls />
            </div>
          )}
          {mode === 'spectra' && (
            <div className="spectra-pane">
              <BoronSpectrumVisualizer />
              <BoronTransitionControls />
            </div>
          )}
          {mode === 'equations' && (
            <div className="equations-pane">
              <BoronEquationInspector />
            </div>
          )}
        </>
      ) : selectedElement ? (
        <Suspense fallback={<div className="overview-card glass-instrument" role="status">Loading reference data…</div>}>
          <MultiElementInstrument key={selectedElement.symbol} element={selectedElement} mode={mode} />
        </Suspense>
      ) : null}
    </aside>
  )
}

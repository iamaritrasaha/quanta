import { useQuantaStore } from '../state/quantaStore'
import { getBoronLevel } from '../physics/boron'
import { BoronTransitionControls } from './BoronTransitionControls'
import { BoronLevelDiagram } from './BoronLevelDiagram'

export function BoronShellControls() {
  const selectedLevelId = useQuantaStore((s) => s.boron.selectedLevelId)
  const currentLevel = getBoronLevel(selectedLevelId) ?? getBoronLevel('2p_2P1_2')!

  const config = currentLevel.configuration
  const occupies2p = config.includes('2p')
  const occupiesHigher = config.includes('3') || config.includes('4')

  return (
    <div className="bohr-pane" aria-label="Boron Shell Model Status">
      <div className="bohr-state-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">SHELL & SUBSHELL OCCUPANCY STATUS</span>
          <span className="provenance-tag">PEDAGOGICAL MODEL</span>
        </div>

        <div className="bohr-metrics-grid">
          <div className="b-metric">
            <span className="b-label">Configuration</span>
            <strong className="b-val">{currentLevel.configuration}</strong>
          </div>
          <div className="b-metric">
            <span className="b-label">Term Symbol</span>
            <strong className="b-val">{currentLevel.termSymbol}</strong>
          </div>
          <div className="b-metric">
            <span className="b-label">Excitation Energy</span>
            <strong className="b-val">{currentLevel.energyEv.toFixed(3)} eV</strong>
          </div>
        </div>

        <div className="quantum-numbers-card">
          <div className="q-num-box">
            <span className="q-label">1s (Core)</span>
            <strong className="q-val">↑↓ Filled</strong>
            <span className="q-sub">Stable during ordinary transitions</span>
          </div>
          <div className="q-num-box">
            <span className="q-label">2s (n=2 Subshell)</span>
            <strong className="q-val">{config.includes('2s2') ? '↑↓ Filled' : config.startsWith('2s2p') ? '↑ Occupied' : 'Empty (excited)'}</strong>
            <span className="q-sub">Closed subshell in ground state</span>
          </div>
          <div className="q-num-box">
            <span className="q-label">2p (n=2 Subshell)</span>
            <strong className="q-val">
              {occupies2p ? (config === '2s2p²' ? '↑↑ Occupied ×2' : '↑ Occupied ×1') : 'Empty (excited)'}
            </strong>
            <span className="q-sub">OPEN subshell in the ground state — n=2 shell also incomplete</span>
          </div>
          <div className="q-num-box">
            <span className="q-label">3s/3p/3d/4s/4p/4f (Valence)</span>
            <strong className="q-val">{occupiesHigher ? 'Occupied (excited)' : 'Empty'}</strong>
            <span className="q-sub">Populated only in higher excited configurations</span>
          </div>
        </div>

        <div className="shell-pedagogical-banner">
          <span className="banner-icon">ℹ</span>
          <p className="banner-text">
            <strong>Shell occupancy visualization:</strong> electron markers and paths are pedagogical, not
            exact trajectories. The closed <strong>1s² core</strong> and filled <strong>2s² pair</strong>{' '}
            occupy the inner region. Boron's <strong>single 2p valence electron</strong> is rendered as
            visually distinct from the 2s pair — its marker and orbit are tagged as the OPEN p-subshell
            electron, not a third identical dot, and the readout above distinguishes n=2 SHELL occupancy
            (4 of 8 possible slots filled) from 2s/2p SUBSHELL occupancy (2s filled, 2p open).
          </p>
        </div>
      </div>

      <BoronTransitionControls />
      <BoronLevelDiagram />
    </div>
  )
}

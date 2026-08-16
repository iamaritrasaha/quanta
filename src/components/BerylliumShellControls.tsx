import { useQuantaStore } from '../state/quantaStore'
import { getBerylliumLevel } from '../physics/beryllium'
import { BerylliumTransitionControls } from './BerylliumTransitionControls'
import { BerylliumLevelDiagram } from './BerylliumLevelDiagram'

export function BerylliumShellControls() {
  const selectedLevelId = useQuantaStore((s) => s.beryllium.selectedLevelId)
  const currentLevel = getBerylliumLevel(selectedLevelId) ?? getBerylliumLevel('2s2_1S0')!

  return (
    <div className="bohr-pane" aria-label="Beryllium Shell Model Status">
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
            <span className="q-label">2s (Valence)</span>
            <strong className="q-val">
              {currentLevel.configuration === '2s²' ? '↑↓ Filled' : currentLevel.configuration.includes('2s') ? '↑ Occupied' : 'Empty'}
            </strong>
            <span className="q-sub">Closed subshell in ground state</span>
          </div>
          <div className="q-num-box">
            <span className="q-label">2p (Valence)</span>
            <strong className="q-val">
              {currentLevel.configuration.includes('2p') ? (currentLevel.configuration === '2p²' ? '↑↑ Occupied ×2' : '↑ Occupied') : 'Empty'}
            </strong>
            <span className="q-sub">Empty in the ground state — n=2 shell is NOT complete</span>
          </div>
          <div className="q-num-box">
            <span className="q-label">3s/3p/3d (Valence)</span>
            <strong className="q-val">
              {currentLevel.configuration.includes('3') ? 'Occupied (excited)' : 'Empty'}
            </strong>
            <span className="q-sub">Populated only in higher excited configurations</span>
          </div>
        </div>

        <div className="shell-pedagogical-banner">
          <span className="banner-icon">ℹ</span>
          <p className="banner-text">
            <strong>Shell occupancy visualization:</strong> electron markers and paths are pedagogical, not
            exact trajectories. The closed <strong>1s² core</strong> occupies the inner K shell. Beryllium's
            <strong> two valence electrons</strong> are tracked independently in the outer shell(s); their
            radius reflects principal quantum number n only — configurations sharing n (e.g. 2s2p vs 2p²)
            are visually similar in this model but remain scientifically distinct, as shown by the
            subshell occupancy readout above.
          </p>
        </div>
      </div>

      <BerylliumTransitionControls />
      <BerylliumLevelDiagram />
    </div>
  )
}

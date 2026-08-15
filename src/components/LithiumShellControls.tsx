import { useQuantaStore } from '../state/quantaStore'
import { getLithiumLevel } from '../physics/lithium'
import { LithiumTransitionControls } from './LithiumTransitionControls'
import { LithiumLevelDiagram } from './LithiumLevelDiagram'

export function LithiumShellControls() {
  const selectedLevelId = useQuantaStore((s) => s.lithium.selectedLevelId)
  const currentLevel = getLithiumLevel(selectedLevelId) ?? getLithiumLevel('1s2_2s_2S1_2')!

  return (
    <div className="bohr-pane" aria-label="Lithium Shell Model Status">
      <div className="bohr-state-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">SHELL OCCUPANCY STATUS</span>
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

        <div className="shell-pedagogical-banner">
          <span className="banner-icon">ℹ</span>
          <p className="banner-text">
            <strong>Shell occupancy visualization:</strong> electron markers and paths are pedagogical, not exact trajectories.
            The closed <strong>1s² core</strong> (2 electrons) occupies the inner K shell, while the single <strong>valence electron</strong> occupies the outer shell.
          </p>
        </div>
      </div>

      <LithiumTransitionControls />
      <LithiumLevelDiagram />
    </div>
  )
}

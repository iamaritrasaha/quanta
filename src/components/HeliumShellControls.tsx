import { useQuantaStore } from '../state/quantaStore'
import { getHeliumLevel } from '../physics/helium'
import { HeliumTransitionControls } from './HeliumTransitionControls'
import { HeliumLevelDiagram } from './HeliumLevelDiagram'

export function HeliumShellControls() {
  const selectedLevelId = useQuantaStore((s) => s.helium.selectedLevelId)
  const currentLevel = getHeliumLevel(selectedLevelId) ?? getHeliumLevel('1s2_1S0')!

  return (
    <div className="bohr-pane" aria-label="Helium Shell Model Status">
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
            <strong>Shell occupancy visualization:</strong> electron marker positions and classical angular separations
            are illustrative pedagogical representations. Neutral Helium has no exact classical orbits.
          </p>
        </div>
      </div>

      <HeliumTransitionControls />
      <HeliumLevelDiagram />
    </div>
  )
}

import {
  BERYLLIUM_IONIZATION_ENERGY_FORMATTED_EV,
  BERYLLIUM_IONIZATION_LIMIT_CM1,
  BERYLLIUM_ATOMIC_WEIGHT_FORMATTED,
} from '../physics/constants'
import { BerylliumTransitionControls } from './BerylliumTransitionControls'

export function BerylliumOverview() {
  return (
    <div className="overview-pane" aria-label="Beryllium Element Profile">
      <div className="overview-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">ELEMENT 04 · ALKALINE EARTH</span>
          <span className="provenance-tag">NIST ASD REFERENCE DATA</span>
        </div>
        <h3 className="card-title">Beryllium (Be · 4)</h3>
        <p className="card-desc">
          The first QUANTA atom with <strong>two interacting valence electrons</strong> above a compact
          1s² core. Beryllium is <em>not</em> "Lithium plus another electron" — its defining conceptual
          jump is a closed 1s² core plus a filled 2s² valence subshell, which enables singlet/triplet
          spin coupling, exchange splitting, and metastable excited states.
        </p>

        {/* Conceptual Contrast Banner */}
        <div className="many-body-contrast-box">
          <div className="contrast-item">
            <span className="contrast-label">1s² CORE</span>
            <span className="contrast-val">Closed shell · Visually stable during ordinary transitions</span>
          </div>
          <div className="contrast-divider">+</div>
          <div className="contrast-item highlight">
            <span className="contrast-label">2s² VALENCE SUBSHELL</span>
            <span className="contrast-val">Two interacting electrons · Filled 2s, but 2p remains empty</span>
          </div>
        </div>

        {/* Reference Data Table */}
        <div className="data-table">
          <div className="data-row">
            <span className="data-key">Atomic Number (Z)</span>
            <strong className="data-val">4</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Electronic Configuration</span>
            <strong className="data-val">1s² 2s²</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Spectroscopic Term</span>
            <strong className="data-val">¹S₀ (Singlet, S = 0, L = 0, J = 0)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Core</span>
            <strong className="data-val">1s² (2 electrons)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Valence Subshell</span>
            <strong className="data-val">2s² (2 electrons) · 2p empty</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Standard Atomic Weight [CIAAW]</span>
            <strong className="data-val scientific-number">Aᵣ(Be) = {BERYLLIUM_ATOMIC_WEIGHT_FORMATTED}</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Default / Normal Isotope</span>
            <strong className="data-val">⁹Be (4p⁺, 5n⁰) · Monoisotopic Element</strong>
          </div>
          <div className="data-row">
            <span className="data-key">First Ionization Potential (Be I → Be II)</span>
            <strong className="data-val scientific-number">{BERYLLIUM_IONIZATION_ENERGY_FORMATTED_EV}</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Reference Level-Table Limit (Be II ²S₁/₂)</span>
            <strong className="data-val scientific-number">{BERYLLIUM_IONIZATION_LIMIT_CM1.toFixed(2)} cm⁻¹</strong>
          </div>
        </div>

        <div className="overview-disclaimer">
          <span>
            MONOISOTOPIC ELEMENT · NORMAL MATERIAL: Beryllium is essentially monoisotopic (⁹Be).
            Trace cosmogenic ¹⁰Be is a radionuclide, not resolved in V1.
            The reference level-table ionization limit above and the current NIST ASD ionization
            energy are drawn from different dataset provenances and are kept explicitly separate.
          </span>
        </div>
      </div>

      <BerylliumTransitionControls />
    </div>
  )
}

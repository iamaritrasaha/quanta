import {
  LITHIUM_IONIZATION_ENERGY_EV,
  LITHIUM_IONIZATION_ENERGY_FORMATTED_EV,
  LITHIUM_IONIZATION_LIMIT_CM1,
  LITHIUM_ATOMIC_WEIGHT_RANGE,
  LITHIUM_6_ISOTOPE_FRACTION_RANGE,
  LITHIUM_7_ISOTOPE_FRACTION_RANGE,
} from '../physics/constants'
import { LithiumTransitionControls } from './LithiumTransitionControls'

export function LithiumOverview() {
  return (
    <div className="overview-pane" aria-label="Lithium Element Profile">
      <div className="overview-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">ELEMENT 03 · ALKALI METAL</span>
          <span className="provenance-tag">NIST ASD REFERENCE DATA</span>
        </div>
        <h3 className="card-title">Lithium (Li · 3)</h3>
        <p className="card-desc">
          The first atom in QUANTA with a <strong>closed inner shell</strong> and a <strong>single outer valence electron</strong>.
          Its chemistry and optical spectroscopy are governed by the loosely-bound 2s valence electron orbiting outside a tight helium-like 1s² core.
        </p>

        {/* Conceptual Contrast Banner */}
        <div className="many-body-contrast-box alkali-contrast-box">
          <div className="contrast-item">
            <span className="contrast-label">HELIUM CORE (1s²)</span>
            <span className="contrast-val">Closed shell · Tightly bound · Screens nuclear charge</span>
          </div>
          <div className="contrast-divider">+</div>
          <div className="contrast-item highlight">
            <span className="contrast-label">VALENCE ELECTRON (2s¹)</span>
            <span className="contrast-val">Low binding energy (5.39 eV) · Core penetration in s states</span>
          </div>
        </div>

        {/* Reference Data Table */}
        <div className="data-table">
          <div className="data-row">
            <span className="data-key">Atomic Number (Z)</span>
            <strong className="data-val">3</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Electronic Configuration</span>
            <strong className="data-val">1s² 2s</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Spectroscopic Term</span>
            <strong className="data-val">²S₁/₂ (Doublet, S = ½, L = 0)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Closed Inner Core</span>
            <strong className="data-val">1s² (2 electrons)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Outer Valence Electron</span>
            <strong className="data-val">2s¹ (1 electron)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Standard Atomic Weight [CIAAW]</span>
            <strong className="data-val">[{LITHIUM_ATOMIC_WEIGHT_RANGE[0]}, {LITHIUM_ATOMIC_WEIGHT_RANGE[1]}]</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Normal-Material Isotopic Composition [CIAAW]</span>
            <strong className="data-val">
              ⁷Li ({(LITHIUM_7_ISOTOPE_FRACTION_RANGE[0] * 100).toFixed(1)}–{(LITHIUM_7_ISOTOPE_FRACTION_RANGE[1] * 100).toFixed(1)}%) · ⁶Li ({(LITHIUM_6_ISOTOPE_FRACTION_RANGE[0] * 100).toFixed(1)}–{(LITHIUM_6_ISOTOPE_FRACTION_RANGE[1] * 100).toFixed(1)}%)
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Default Isotope Visualization</span>
            <strong className="data-val">⁷Li (3p⁺, 4n⁰) · Dominant Natural Isotope</strong>
          </div>
          <div className="data-row">
            <span className="data-key">First Ionization Potential (Li I → Li II)</span>
            <strong className="data-val scientific-number">{LITHIUM_IONIZATION_ENERGY_FORMATTED_EV}</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ionization Limit (NIST ASD)</span>
            <strong className="data-val scientific-number">{LITHIUM_IONIZATION_LIMIT_CM1.toFixed(2)} cm⁻¹</strong>
          </div>
        </div>

        <div className="overview-disclaimer">
          <span>
            DEFAULT ISOTOPE VISUALIZATION: ⁷Li (3p⁺, 4n⁰) as the dominant isotope.
            Isotope shift and hyperfine splitting not resolved in V1.
            NIST ASD Provenance: Li I level compilation in ASD is not critically evaluated by NIST.
          </span>
        </div>
      </div>

      <LithiumTransitionControls />
    </div>
  )
}

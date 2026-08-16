import {
  BORON_IONIZATION_ENERGY_FORMATTED_EV,
  BORON_IONIZATION_LIMIT_CM1,
  BORON_ATOMIC_WEIGHT_RANGE,
  BORON_10_ISOTOPE_FRACTION_RANGE,
  BORON_11_ISOTOPE_FRACTION_RANGE,
} from '../physics/constants'
import { BoronTransitionControls } from './BoronTransitionControls'

export function BoronOverview() {
  return (
    <div className="overview-pane" aria-label="Boron Element Profile">
      <div className="overview-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">ELEMENT 05 · METALLOID</span>
          <span className="provenance-tag">NIST ASD REFERENCE DATA</span>
        </div>
        <h3 className="card-title">Boron (B · 5)</h3>
        <p className="card-desc">
          QUANTA's <strong>first atom with an open p subshell in the ground state</strong>. Boron is{' '}
          <em>not</em> "Beryllium plus another orbiting dot" — its single 2p valence electron gives the
          ground configuration nonzero orbital angular momentum (L = 1) and odd parity, producing genuine
          fine-structure splitting in the ground term itself.
        </p>

        {/* Conceptual Contrast Banner */}
        <div className="many-body-contrast-box">
          <div className="contrast-item">
            <span className="contrast-label">1s² 2s² CORE + INNER PAIR</span>
            <span className="contrast-val">Closed 1s² core · Filled 2s² pair · Visually stable</span>
          </div>
          <div className="contrast-divider">+</div>
          <div className="contrast-item highlight">
            <span className="contrast-label">2p¹ VALENCE ELECTRON</span>
            <span className="contrast-val">Open p subshell · Directional density · Nonzero L, odd parity</span>
          </div>
        </div>

        {/* Reference Data Table */}
        <div className="data-table">
          <div className="data-row">
            <span className="data-key">Atomic Number (Z)</span>
            <strong className="data-val">5</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Electronic Configuration</span>
            <strong className="data-val">1s² 2s² 2p</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Spectroscopic Term</span>
            <strong className="data-val">²P°₁/₂ (Doublet, S = ½, L = 1, Odd Parity)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Fine-Structure Partner</span>
            <strong className="data-val">²P°₃/₂ (+15.287 cm⁻¹ above ²P°₁/₂)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Core</span>
            <strong className="data-val">1s² 2s² (4 electrons)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Valence Electron</span>
            <strong className="data-val">2p¹ (1 electron) · Open subshell</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Standard Atomic Weight [CIAAW]</span>
            <strong className="data-val">
              [{BORON_ATOMIC_WEIGHT_RANGE[0]}, {BORON_ATOMIC_WEIGHT_RANGE[1]}]
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Normal-Material Isotopic Composition [CIAAW]</span>
            <strong className="data-val">
              ¹¹B ({(BORON_11_ISOTOPE_FRACTION_RANGE[0] * 100).toFixed(1)}–{(BORON_11_ISOTOPE_FRACTION_RANGE[1] * 100).toFixed(1)}%) · ¹⁰B (
              {(BORON_10_ISOTOPE_FRACTION_RANGE[0] * 100).toFixed(1)}–{(BORON_10_ISOTOPE_FRACTION_RANGE[1] * 100).toFixed(1)}%)
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Default Isotope Visualization</span>
            <strong className="data-val">¹¹B (5p⁺, 6n⁰) · Dominant Natural Isotope</strong>
          </div>
          <div className="data-row">
            <span className="data-key">First Ionization Potential (B I → B II)</span>
            <strong className="data-val scientific-number">{BORON_IONIZATION_ENERGY_FORMATTED_EV}</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Reference Level-Table Limit (B II ¹S₀)</span>
            <strong className="data-val scientific-number">{BORON_IONIZATION_LIMIT_CM1.toFixed(2)} cm⁻¹</strong>
          </div>
        </div>

        <div className="overview-disclaimer">
          <span>
            DEFAULT ISOTOPE VISUALIZATION · ¹¹B: Not every Boron atom is ¹¹B — normal terrestrial material
            is a mixture of ¹⁰B and ¹¹B across the disclosed CIAAW composition ranges above. Isotope shift
            and hyperfine splitting are not resolved in V1. The reference level-table ionization limit
            above and the current NIST ASD ionization energy are drawn from different dataset provenances
            and are kept explicitly separate.
          </span>
        </div>
      </div>

      <BoronTransitionControls />
    </div>
  )
}

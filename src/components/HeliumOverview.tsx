import { HELIUM_IONIZATION_ENERGY_EV, HELIUM_IONIZATION_LIMIT_CM1 } from '../physics/constants'
import { HeliumTransitionControls } from './HeliumTransitionControls'

export function HeliumOverview() {
  return (
    <div className="overview-pane" aria-label="Helium Element Profile">
      <div className="overview-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">ELEMENT 02 · NOBLE GAS</span>
          <span className="provenance-tag">NIST REFERENCE</span>
        </div>
        <h3 className="card-title">Helium (He · 2)</h3>
        <p className="card-desc">
          <strong>Helium is where the one-electron picture ends.</strong> With two interacting electrons,
          electron–electron Coulomb repulsion and quantum exchange symmetry become intrinsic to the atomic problem.
        </p>

        {/* Conceptual Contrast Banner */}
        <div className="many-body-contrast-box">
          <div className="contrast-item">
            <span className="contrast-label">HYDROGEN (Z = 1)</span>
            <span className="contrast-val">1 electron · Exact analytic solution</span>
          </div>
          <div className="contrast-divider">vs</div>
          <div className="contrast-item highlight">
            <span className="contrast-label">HELIUM (Z = 2)</span>
            <span className="contrast-val">2 interacting electrons · Many-body problem</span>
          </div>
        </div>

        {/* Authoritative Data Table */}
        <div className="data-table">
          <div className="data-row">
            <span className="data-key">Atomic Number (Z)</span>
            <strong className="data-val">2</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Default Isotope</span>
            <strong className="data-val">⁴He (2p⁺, 2n⁰, 2e⁻)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Standard Mass</span>
            <strong className="data-val">~4.002602 u</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Electronic Configuration</span>
            <strong className="data-val">1s²</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Spectroscopic Term</span>
            <strong className="data-val">¹S₀ (Total Spin S = 0)</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ionization Energy (He I → He II)</span>
            <strong className="data-val">{HELIUM_IONIZATION_ENERGY_EV.toFixed(6)} eV</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ionization Limit (NIST ASD)</span>
            <strong className="data-val">{HELIUM_IONIZATION_LIMIT_CM1.toFixed(2)} cm⁻¹</strong>
          </div>
        </div>

        <div className="overview-disclaimer">
          <span>
            ⁴He is the default reference isotope. Singly-ionized He⁺ becomes a 1-electron Hydrogen-like ion.
          </span>
        </div>
      </div>

      <HeliumTransitionControls />
    </div>
  )
}

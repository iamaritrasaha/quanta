import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  getLithiumLevel,
  getLithiumTransition,
  calculateLithiumStateEnergyDelta,
  LITHIUM_CORE_ZEFF,
  LITHIUM_VALENCE_2S_ZEFF,
} from '../physics/lithium'
import { formatFrequency } from '../physics/hydrogen'
import { LITHIUM_IONIZATION_ENERGY_EV, LITHIUM_ATOMIC_WEIGHT_RANGE } from '../physics/constants'
import { Equation } from './Equation'

export function LithiumEquationInspector() {
  const mode = useQuantaStore((s) => s.mode)
  const selectedLevelId = useQuantaStore((s) => s.lithium.selectedLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.lithium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.lithium.activeTransition)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getLithiumTransition(selectedTransitionId)
    return getLithiumTransition('670.8nm')!
  }, [activeTransition, selectedTransitionId])

  const currentLevel = getLithiumLevel(selectedLevelId) ?? getLithiumLevel('1s2_2s_2S1_2')!
  const lowerLevel = transition ? getLithiumLevel(transition.lowerLevelId) : null
  const upperLevel = transition ? getLithiumLevel(transition.upperLevelId) : null

  const isTransitionView = mode === 'spectra' || mode === 'energy' || Boolean(activeTransition)
  const isEmission = activeTransition
    ? activeTransition.type === 'emission'
    : selectedLevelId === upperLevel?.id

  const direction = isEmission ? 'emission' : 'absorption'
  const initialLevel = isEmission ? upperLevel : lowerLevel
  const finalLevel = isEmission ? lowerLevel : upperLevel

  const { deltaEStateEv, photonEnergyEv } = transition
    ? calculateLithiumStateEnergyDelta(transition, direction)
    : { deltaEStateEv: 0, photonEnergyEv: 0 }

  return (
    <div className="equation-inspector glass-equation" aria-label="Lithium Mathematical Inspector">
      <div className="inspector-header">
        <div className="inspector-badge">MATHEMATICAL DERIVATION</div>
        <div className="inspector-mode-tag">
          {isTransitionView && transition
            ? `NIST TRANSITION (${transition.lineName} · ${direction.toUpperCase()})`
            : `THREE-ELECTRON HAMILTONIAN (${currentLevel.configuration} ${currentLevel.termSymbol})`}
        </div>
      </div>

      {isTransitionView && transition && lowerLevel && upperLevel && initialLevel && finalLevel ? (
        /* Spectral Transition Derivation */
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT ({direction.toUpperCase()})</span>
            <p className="stage-text">
              {direction === 'absorption' ? (
                <>
                  Neutral Lithium absorbs a photon of discrete quantum energy <Equation>{`E_\\gamma`}</Equation>,
                  exciting its outer valence electron from <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong> to{' '}
                  <strong>{finalLevel.configuration} {finalLevel.termSymbol}</strong> with positive state energy change{' '}
                  <Equation>{`\\Delta E_{\\text{state}} > 0`}</Equation>. The closed 1s² core remains visually stable.
                </>
              ) : (
                <>
                  Neutral Lithium undergoes a radiative relaxation from excited state{' '}
                  <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong> down to lower state{' '}
                  <strong>{finalLevel.configuration} {finalLevel.termSymbol}</strong> (<Equation>{`\\Delta E_{\\text{state}} < 0`}</Equation>),
                  emitting a discrete photon of strictly positive energy <Equation>{`E_\\gamma = |\\Delta E_{\\text{state}}|`}</Equation>.
                </>
              )}
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / GOVERNING EQUATIONS & SIGN CONVENTIONS</span>
            <div className="math-display-group">
              <Equation block>{`\\Delta E_{\\text{state}} = E_{\\text{final}} - E_{\\text{initial}}`}</Equation>
              <Equation block>{`E_\\gamma = |\\Delta E_{\\text{state}}| = hc\\,\\Delta\\tilde{\\nu} = h\\nu > 0`}</Equation>
              <Equation block>{`\\lambda_{\\text{vac}} = \\frac{10^7\\,\\text{nm}\\cdot\\text{cm}^{-1}}{\\Delta\\tilde{\\nu}\\,[\\text{cm}^{-1}]},\\quad \\lambda_{\\text{air}} = \\frac{\\lambda_{\\text{vac}}}{n_{\\text{air}}(\\lambda)}`}</Equation>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / NIST LEVEL SUBSTITUTION & WAVELENGTH DERIVATION</span>
            <div className="math-display-group substitution-group">
              <Equation block>{`E_{\\text{initial}}\\,(${initialLevel.termSymbol}) = ${initialLevel.energyEv.toFixed(4)}\\,\\text{eV}\\quad (${initialLevel.wavenumberCm1.toFixed(2)}\\,\\text{cm}^{-1})`}</Equation>
              <Equation block>{`E_{\\text{final}}\\,(${finalLevel.termSymbol}) = ${finalLevel.energyEv.toFixed(4)}\\,\\text{eV}\\quad (${finalLevel.wavenumberCm1.toFixed(2)}\\,\\text{cm}^{-1})`}</Equation>
              <Equation block>{`\\Delta E_{\\text{state}} = ${finalLevel.energyEv.toFixed(4)} - ${initialLevel.energyEv.toFixed(4)} = ${deltaEStateEv > 0 ? `+${deltaEStateEv.toFixed(4)}` : deltaEStateEv.toFixed(4)}\\,\\text{eV}`}</Equation>
              <Equation block>{`E_\\gamma = |\\Delta E_{\\text{state}}| = ${photonEnergyEv.toFixed(4)}\\,\\text{eV}`}</Equation>
              <Equation block>{`\\lambda_{\\text{vac}}\\,[\\text{derived}] = \\frac{10^7}{${(upperLevel.wavenumberCm1 - lowerLevel.wavenumberCm1).toFixed(2)}\\,\\text{cm}^{-1}} = ${transition.derivedVacuumWavelengthNm.toFixed(4)}\\,\\text{nm}`}</Equation>
              <Equation block>{`\\lambda_{\\text{air}}\\,[\\text{derived}] = \\frac{\\lambda_{\\text{vac}}}{n_{\\text{air}}} = ${transition.derivedAirWavelengthNm.toFixed(4)}\\,\\text{nm}\\quad (\\text{STANDARD AIR})`}</Equation>
              <Equation block>{`\\lambda_{\\text{air}}\\,[\\text{reference line}] = ${transition.referenceWavelengthNm.toFixed(4)}\\,\\text{nm}\\quad (\\text{NIST ASD PERSISTENT LINE})`}</Equation>
            </div>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / RESULT & PROVENANCE BREAKDOWN</span>
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">State Energy Change (ΔE_state)</span>
                <span className="hero-metric-val">
                  {deltaEStateEv > 0 ? `+${deltaEStateEv.toFixed(3)}` : deltaEStateEv.toFixed(3)} eV
                </span>
                <span className="hero-metric-sub">{direction.toUpperCase()}</span>
              </div>
              <div
                className="hero-metric highlight-metric"
                style={{ borderColor: transition.displayColor }}
              >
                <span className="hero-metric-label">Photon Energy (Eγ)</span>
                <span className="hero-metric-val" style={{ color: transition.displayColor }}>
                  {photonEnergyEv.toFixed(3)} eV
                </span>
                <span className="hero-metric-sub">Strictly Positive Quantum</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Reference Line (Air)</span>
                <span className="hero-metric-val">
                  {transition.referenceWavelengthNm.toFixed(4)} nm
                </span>
                <span className="hero-metric-sub">NIST PERSISTENT LINE · {transition.region}</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Level-Derived (Air)</span>
                <span className="hero-metric-val">
                  {transition.derivedAirWavelengthNm.toFixed(4)} nm
                </span>
                <span className="hero-metric-sub">FROM ASD LEVEL DIFFERENCE</span>
              </div>
            </div>
            <div className="provenance-indicator-bar">
              <span>PROVENANCE: NIST ASD REFERENCE DATA (UNCRITICALLY EVALUATED LEVEL LIST) · CIAAW ISOTOPE INTERVALS · DERIVED AIR MEDIUM</span>
            </div>
          </section>
        </div>
      ) : (
        /* Many-Body Three-Electron Hamiltonian Derivation */
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT</span>
            <p className="stage-text">
              Neutral Lithium (Z = 3) is a four-body quantum system (nucleus + 3 electrons).
              The inner two electrons form a tightly-bound, closed <strong>1s² core</strong> that screens the Z=3 nuclear charge,
              while the outer <strong>valence electron</strong> experiences an effective central potential modified by core penetration.
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / THREE-ELECTRON HAMILTONIAN</span>
            <div className="math-display-group">
              <Equation block>{`\\hat{H} = \\sum_{i=1}^{3} \\left( -\\frac{\\hbar^2}{2m_e}\\nabla_i^2 - \\frac{3e^2}{4\\pi\\varepsilon_0 r_i} \\right) + \\sum_{1 \\le i < j \\le 3} \\frac{e^2}{4\\pi\\varepsilon_0 r_{ij}}`}</Equation>
            </div>
            <div className="vee-highlight-card">
              <span className="vee-title">THREE ELECTRON–ELECTRON COULOMB PAIR REPULSIONS</span>
              <Equation block>{`V_{ee} = \\frac{e^2}{4\\pi\\varepsilon_0} \\left( \\frac{1}{r_{12}} + \\frac{1}{r_{13}} + \\frac{1}{r_{23}} \\right)`}</Equation>
              <p className="vee-desc">
                Mutual repulsion prevents exact analytic separation into independent hydrogenic equations.
                Neutral Li energies do not follow <Equation>{`E_n = -13.6\\,Z^2/n^2`}</Equation>.
              </p>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / EFFECTIVE CORE SCREENING & PENETRATION</span>
            <div className="math-display-group">
              <Equation block>{`V_{\\text{eff}}(r) = -\\frac{Z_{\\text{eff}}(r)\\,e^2}{4\\pi\\varepsilon_0 r},\\quad Z_{\\text{eff}}(r) \\to \\begin{cases} 3, & r \\to 0\\;(\\text{penetration}) \\\\ 1, & r \\to \\infty\\;(\\text{screening}) \\end{cases}`}</Equation>
              <Equation block>{`E_{n,l} = -\\frac{R_\\infty hc}{(n - \\delta_l)^2} = -\\frac{R_\\infty hc}{(n^*)^2}`}</Equation>
            </div>
            <p className="stage-subtext">
              The quantum defect <Equation>{`\\delta_l`}</Equation> lifts the l-degeneracy: 2s penetrates deeper than 2p, resulting in <Equation>{`E(2\\text{s}) < E(2\\text{p})`}</Equation> and <Equation>{`E(3\\text{s}) < E(3\\text{p}) < E(3\\text{d})`}</Equation>.
            </p>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / ATOMIC PROPERTIES & PROVENANCE</span>
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">Ionization Energy</span>
                <span className="hero-metric-val">{LITHIUM_IONIZATION_ENERGY_EV.toFixed(9)} eV</span>
                <span className="hero-metric-sub">5.391714996(22) eV · ±0.000000022 eV</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Atomic Weight Interval</span>
                <span className="hero-metric-val">[{LITHIUM_ATOMIC_WEIGHT_RANGE[0]}, {LITHIUM_ATOMIC_WEIGHT_RANGE[1]}]</span>
                <span className="hero-metric-sub">CIAAW Standard Interval</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Ground State Term</span>
                <span className="hero-metric-val">1s²2s ²S₁/₂</span>
                <span className="hero-metric-sub">Doublet (S = ½)</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Visual Screening Model</span>
                <span className="hero-metric-val">Z_core={LITHIUM_CORE_ZEFF}, Z_val={LITHIUM_VALENCE_2S_ZEFF}</span>
                <span className="hero-metric-sub">Reduced 3D Density</span>
              </div>
            </div>
            <div className="provenance-indicator-bar">
              <span>REFERENCE: NIST ASD & CIAAW · DERIVED: QUANTUM DEFECTS & FREQUENCIES · VISUAL MODEL: 1-ELECTRON REDUCED DENSITY</span>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

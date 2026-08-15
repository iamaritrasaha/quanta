import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  getHeliumLevel,
  getHeliumTransition,
  calculateStateEnergyDelta,
  HELIUM_GROUND_ZEFF,
} from '../physics/helium'
import { formatFrequency } from '../physics/hydrogen'
import { HELIUM_IONIZATION_ENERGY_EV } from '../physics/constants'
import { Equation } from './Equation'

export function HeliumEquationInspector() {
  const mode = useQuantaStore((s) => s.mode)
  const selectedLevelId = useQuantaStore((s) => s.helium.selectedLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.helium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.helium.activeTransition)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getHeliumTransition(selectedTransitionId)
    return getHeliumTransition('587.6nm')!
  }, [activeTransition, selectedTransitionId])

  const currentLevel = getHeliumLevel(selectedLevelId) ?? getHeliumLevel('1s2_1S0')!
  const lowerLevel = transition ? getHeliumLevel(transition.lowerLevelId) : null
  const upperLevel = transition ? getHeliumLevel(transition.upperLevelId) : null

  const isTransitionView = mode === 'spectra' || mode === 'energy' || Boolean(activeTransition)
  const isEmission = activeTransition
    ? activeTransition.type === 'emission'
    : selectedLevelId === upperLevel?.id

  const direction = isEmission ? 'emission' : 'absorption'
  const initialLevel = isEmission ? upperLevel : lowerLevel
  const finalLevel = isEmission ? lowerLevel : upperLevel

  const { deltaEStateEv, photonEnergyEv } = transition
    ? calculateStateEnergyDelta(transition, direction)
    : { deltaEStateEv: 0, photonEnergyEv: 0 }

  return (
    <div className="equation-inspector glass-equation" aria-label="Helium Mathematical Inspector">
      <div className="inspector-header">
        <div className="inspector-badge">MATHEMATICAL DERIVATION</div>
        <div className="inspector-mode-tag">
          {isTransitionView && transition
            ? `NIST TRANSITION (${transition.lineName} · ${direction.toUpperCase()})`
            : `TWO-ELECTRON HAMILTONIAN (${currentLevel.configuration} ${currentLevel.termSymbol})`}
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
                  Helium absorbs a photon of energy <Equation>{`E_\\gamma`}</Equation>, causing the atom to undergo an upward
                  transition from <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong> to{' '}
                  <strong>{finalLevel.configuration} {finalLevel.termSymbol}</strong> with positive state energy change{' '}
                  <Equation>{`\\Delta E_{\\text{state}} > 0`}</Equation>.
                </>
              ) : (
                <>
                  Helium undergoes a spontaneous/stimulated relaxation from higher state{' '}
                  <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong> down to lower state{' '}
                  <strong>{finalLevel.configuration} {finalLevel.termSymbol}</strong> (<Equation>{`\\Delta E_{\\text{state}} < 0`}</Equation>),
                  liberating a discrete photon of strictly positive energy <Equation>{`E_\\gamma = |\\Delta E_{\\text{state}}|`}</Equation>.
                </>
              )}
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / GOVERNING EQUATIONS & SIGN CONVENTIONS</span>
            <div className="math-display-group">
              <Equation block>{`\\Delta E_{\\text{state}} = E_{\\text{final}} - E_{\\text{initial}}`}</Equation>
              <Equation block>{`E_\\gamma = |\\Delta E_{\\text{state}}| = h\\nu = \\frac{hc}{\\lambda} > 0`}</Equation>
              <Equation block>{`\\lambda = \\frac{hc}{E_\\gamma} = \\frac{1239.842\\,\\text{eV}\\cdot\\text{nm}}{E_\\gamma\\,[\\text{eV}]}`}</Equation>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / NIST LEVEL SUBSTITUTION</span>
            <div className="math-display-group substitution-group">
              <Equation block>{`E_{\\text{initial}}\\,(${initialLevel.termSymbol}) = ${initialLevel.energyEv.toFixed(4)}\\,\\text{eV}\\quad (${initialLevel.wavenumberCm1.toFixed(2)}\\,\\text{cm}^{-1})`}</Equation>
              <Equation block>{`E_{\\text{final}}\\,(${finalLevel.termSymbol}) = ${finalLevel.energyEv.toFixed(4)}\\,\\text{eV}\\quad (${finalLevel.wavenumberCm1.toFixed(2)}\\,\\text{cm}^{-1})`}</Equation>
              <Equation block>{`\\Delta E_{\\text{state}} = ${finalLevel.energyEv.toFixed(4)} - ${initialLevel.energyEv.toFixed(4)} = ${deltaEStateEv > 0 ? `+${deltaEStateEv.toFixed(4)}` : deltaEStateEv.toFixed(4)}\\,\\text{eV}`}</Equation>
              <Equation block>{`E_\\gamma = |\\Delta E_{\\text{state}}| = ${photonEnergyEv.toFixed(4)}\\,\\text{eV}`}</Equation>
              <Equation block>{`\\lambda = \\frac{1239.842\\,\\text{eV}\\cdot\\text{nm}}{${photonEnergyEv.toFixed(4)}\\,\\text{eV}} = ${transition.wavelengthNm.toFixed(3)}\\,\\text{nm}\\quad (\\text{${transition.wavelengthMedium}})`}</Equation>
            </div>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / SPECTRAL RESULT</span>
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
                <span className="hero-metric-sub">Positive Quantum |ΔE|</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Wavelength (λ)</span>
                <span className="hero-metric-val">
                  {transition.wavelengthNm.toFixed(3)} nm
                </span>
                <span className="hero-metric-sub">{transition.wavelengthMedium.toUpperCase()} MEDIUM · {transition.region}</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Frequency (ν)</span>
                <span className="hero-metric-val">{formatFrequency(transition.frequencyHz)}</span>
                <span className="hero-metric-sub">{transition.classification}</span>
              </div>
            </div>
            <div className="provenance-indicator-bar">
              <span>PROVENANCE: NIST ASD He I · {transition.colorDescription}</span>
            </div>
          </section>
        </div>
      ) : (
        /* Many-Body Two-Electron Hamiltonian & Pauli Singlet Derivation */
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT</span>
            <p className="stage-text">
              Neutral Helium (Z = 2) is a non-separable three-body quantum system (nucleus + 2 electrons).
              The electron–electron repulsion term{' '}
              <Equation>{`V_{ee} = \\frac{e^2}{4\\pi\\varepsilon_0 r_{12}}`}</Equation> prevents separation
              into two independent Hydrogenic wavefunctions.
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / TWO-ELECTRON HAMILTONIAN</span>
            <div className="math-display-group">
              <Equation block>{`\\hat{H} = -\\frac{\\hbar^2}{2m_e}\\nabla_1^2 - \\frac{\\hbar^2}{2m_e}\\nabla_2^2 - \\frac{2e^2}{4\\pi\\varepsilon_0 r_1} - \\frac{2e^2}{4\\pi\\varepsilon_0 r_2} + \\frac{e^2}{4\\pi\\varepsilon_0 r_{12}}`}</Equation>
            </div>
            <div className="vee-highlight-card">
              <span className="vee-title">ELECTRON–ELECTRON REPULSION (r₁₂ Term)</span>
              <Equation block>{`V_{ee} = \\frac{e^2}{4\\pi\\varepsilon_0 |\\mathbf{r}_1 - \\mathbf{r}_2|}`}</Equation>
              <p className="vee-desc">
                This Coulomb repulsion prevents exact analytic factorization into independent single-electron
                orbitals.
              </p>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / PAULI EXCLUSION & SPIN EIGENSTATE</span>
            <div className="math-display-group">
              <Equation block>{`\\Psi(1, 2) = \\psi_{\\text{space}}(\\mathbf{r}_1, \\mathbf{r}_2)\\, \\chi_{\\text{spin}}(s_1, s_2)`}</Equation>
              <Equation block>{`\\chi_{\\text{singlet}} = \\frac{|\\uparrow\\downarrow\\rangle - |\\downarrow\\uparrow\\rangle}{\\sqrt{2}}`}</Equation>
              <Equation block>{`\\hat{P}_{12}\\,\\Psi(1, 2) = -\\Psi(1, 2)`}</Equation>
            </div>
            <p className="stage-subtext">
              Fermionic total state must remain antisymmetric under electron coordinate exchange{' '}
              <code>P₁₂</code>. In the ground state ¹S₀, spatial state is symmetric and spin state is antisymmetric.
            </p>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / ATOMIC PROPERTIES & APPROXIMATIONS</span>
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">Ionization Energy</span>
                <span className="hero-metric-val">{HELIUM_IONIZATION_ENERGY_EV.toFixed(4)} eV</span>
                <span className="hero-metric-sub">NIST ASD Reference Data</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Effective Nuclear Charge</span>
                <span className="hero-metric-val">Z_eff = {HELIUM_GROUND_ZEFF}</span>
                <span className="hero-metric-sub">Slater Visual Model</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Ground State Term</span>
                <span className="hero-metric-val">1s² ¹S₀</span>
                <span className="hero-metric-sub">Total Spin S = 0</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Dimensionality</span>
                <span className="hero-metric-val">6D Spatial</span>
                <span className="hero-metric-sub">Reduced to 3D density</span>
              </div>
            </div>
            <div className="provenance-indicator-bar">
              <span>PROVENANCE: NIST ASD (MEASURED ENERGIES) · SLATER / INDEPENDENT-PARTICLE MODEL (3D DENSITY)</span>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

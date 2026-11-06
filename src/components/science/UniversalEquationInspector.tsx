import { useMemo } from 'react'
import type { Element } from '../../data/elements'
import {
  calculateLevelSeparation,
  getNistLevels,
  type AtomicLevel,
} from '../../data/atomicLevels'
import { getAtomicProperties } from '../../data/atomicData'
import { getElementProfile } from '../../data/elementProfiles'
import { calculateSlaterScreening } from '../../physics/slater'
import { groundModel } from '../../physics/elementModel'
import { useQuantaStore } from '../../state/quantaStore'
import { Equation } from '../Equation'

interface UniversalEquationInspectorProps {
  element: Element
}

export function UniversalEquationInspector({ element }: UniversalEquationInspectorProps) {
  const mode = useQuantaStore((s) => s.mode)
  const selectedState = useQuantaStore((s) => s.sharedElement.selected)
  const jump = useQuantaStore((s) => s.sharedElement.activeTransition)

  const selected = selectedState ?? groundModel(element.symbol)
  const properties = getAtomicProperties(element.symbol)
  const profile = getElementProfile(element.symbol)
  const nist = getNistLevels(element.symbol)

  const config = properties?.electronConfiguration ?? selected.configuration
  const slater = calculateSlaterScreening(element.number, config)

  const levels = useMemo(
    () => [...nist.levels].sort((a, b) => a.energyCm - b.energyCm),
    [nist.levels]
  )

  const lowerLevel: AtomicLevel | undefined = levels[0]
  const upperLevel: AtomicLevel | undefined =
    levels.length > 1
      ? levels.find((l) => l.energyCm > 100) ?? levels[1]
      : undefined

  const separation = calculateLevelSeparation(lowerLevel, upperLevel)

  const isTransitionView =
    mode === 'spectra' || mode === 'energy' || Boolean(jump)

  const direction = jump ? jump.type : 'absorption'
  const deltaE = jump
    ? jump.type === 'emission'
      ? -((jump.initial.energyCm ?? 0) - (jump.target.energyCm ?? 0)) * 1.239841984e-4
      : ((jump.target.energyCm ?? 0) - (jump.initial.energyCm ?? 0)) * 1.239841984e-4
    : separation?.energyEv ?? 0

  const wavelengthNm = separation?.wavelengthNm ?? 0
  const wavenumberCm = separation?.wavenumberCm ?? 0

  return (
    <div
      className="equation-inspector glass-equation"
      aria-label={`${element.name} Mathematical Derivations`}
    >
      <div className="inspector-header">
        <div className="inspector-badge">MATHEMATICAL DERIVATION</div>
        <div className="inspector-mode-tag">
          {isTransitionView && separation
            ? `LEVEL DIFFERENCE (${upperLevel?.term ?? 'Excited'} ↔ ${lowerLevel?.term ?? 'Ground'})`
            : `${element.number}-ELECTRON HAMILTONIAN (${config})`}
        </div>
      </div>

      <div className="inspector-stages">
        {/* Stage 01: Concept */}
        <section className="stage-block">
          <span className="stage-label">01 / CONCEPT</span>
          <p className="stage-text">
            {isTransitionView ? (
              <>
                A photon transition occurs when the neutral atom changes energy states.
                For absorption, photon energy <Equation>{`E_\\gamma > 0`}</Equation> elevates an electron
                to a higher configuration. For relaxation, energy conservation liberates a photon of
                strictly positive energy <Equation>{`E_\\gamma = |\\Delta E_{\\text{state}}|`}</Equation>.
              </>
            ) : (
              <>
                {element.name} possesses <Equation>{`Z = ${element.number}`}</Equation> protons attracting{' '}
                <Equation>{`N_e = ${element.number}`}</Equation> electrons. Electrons experience mutual
                Coulomb repulsion <Equation>{`e^2 / 4\\pi\\varepsilon_0 r_{ij}`}</Equation>, which screens the
                nuclear charge down to an effective value <Equation>{`Z_{\\text{eff}} = Z - \\sigma`}</Equation>.
              </>
            )}
          </p>
        </section>

        {/* Stage 02: Formulation */}
        <section className="stage-block">
          <span className="stage-label">02 / FORMULATION</span>
          <div className="math-display-group">
            {isTransitionView ? (
              <>
                <Equation block>{`\\Delta E = E_{\\text{upper}} - E_{\\text{lower}}`}</Equation>
                <Equation block>{`E_\\gamma = h\\nu = \\frac{hc}{\\lambda_{\\text{vac}}}`}</Equation>
                <Equation block>{`\\lambda_{\\text{vac}}\\text{ (nm)} = \\frac{10^7}{\\Delta\\tilde{\\nu}\\text{ (cm}^{-1}\\text{)}}`}</Equation>
              </>
            ) : (
              <>
                <Equation block>{`\\hat{H} = \\sum_{i=1}^{${element.number}} \\left( -\\frac{\\hbar^2}{2m_e}\\nabla_i^2 - \\frac{${element.number}e^2}{4\\pi\\varepsilon_0 r_i} \\right) + \\sum_{i<j}^{${element.number}} \\frac{e^2}{4\\pi\\varepsilon_0 r_{ij}}`}</Equation>
                <Equation block>{`Z_{\\text{eff}} = Z - \\sigma`}</Equation>
                <Equation block>{`V_{\\text{eff}}(r) \\approx -\\frac{Z_{\\text{eff}}\\,e^2}{4\\pi\\varepsilon_0 r}`}</Equation>
              </>
            )}
          </div>
        </section>

        {/* Stage 03: Parameters & Substitution */}
        <section className="stage-block">
          <span className="stage-label">03 / STATE SUBSTITUTION</span>
          <div className="quantum-params-grid">
            <div className="param-item">
              <span className="param-title">Atomic Number (Z)</span>
              <strong className="param-val">{element.number}</strong>
              <span className="param-sub">Nuclear charge</span>
            </div>
            <div className="param-item">
              <span className="param-title">Electron Count (Nₑ)</span>
              <strong className="param-val">{element.number}</strong>
              <span className="param-sub">Neutral atom</span>
            </div>
            <div className="param-item">
              <span className="param-title">Slater Screening (σ)</span>
              <strong className="param-val">{slater.screeningConstant.toFixed(2)}</strong>
              <span className="param-sub">{slater.targetSubshell} shielding</span>
            </div>
            <div className="param-item">
              <span className="param-title">Effective Charge (Z_eff)</span>
              <strong className="param-val" style={{ color: 'var(--accent-optic)' }}>
                +{slater.zEffective.toFixed(2)}
              </strong>
              <span className="param-sub">Net core pull</span>
            </div>
          </div>
        </section>

        {/* Stage 04: Calculated Result */}
        <section className="stage-block result-block">
          <span className="stage-label">04 / CALCULATED RESULT</span>
          {separation ? (
            <div className="hero-metric-row">
              <div className="hero-metric">
                <span className="hero-metric-label">Separation (ΔE)</span>
                <strong className="hero-metric-val">{separation.energyEv.toFixed(4)} eV</strong>
                <span className="hero-metric-sub">NIST reference level difference</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Vacuum Wavelength (λ)</span>
                <strong className="hero-metric-val" style={{ color: 'var(--accent-optic)' }}>
                  {wavelengthNm.toFixed(2)} nm
                </strong>
                <span className="hero-metric-sub">Δν̃ = {wavenumberCm.toFixed(1)} cm⁻¹</span>
              </div>
            </div>
          ) : (
            <div className="hero-metric-row">
              <div className="hero-metric">
                <span className="hero-metric-label">Estimated Binding (E_b)</span>
                <strong className="hero-metric-val">{slater.bindingEnergyEv.toFixed(2)} eV</strong>
                <span className="hero-metric-sub">Slater effective one-electron potential</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">First Ionization (I₁)</span>
                <strong className="hero-metric-val" style={{ color: 'var(--accent-optic)' }}>
                  {properties?.ionizationEnergyEv ? `${properties.ionizationEnergyEv} eV` : 'Not available'}
                </strong>
                <span className="hero-metric-sub">Published reference threshold</span>
              </div>
            </div>
          )}

          <p className="atomic-source-note" style={{ marginTop: '0.8rem' }}>
            Calculations are derived from documented Slater parameters and NIST ASD level separations.
            Many-electron atoms cannot be solved analytically; independent-particle models represent
            pedagogical approximations.
          </p>
        </section>
      </div>
    </div>
  )
}

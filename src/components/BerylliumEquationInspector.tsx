import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  getBerylliumLevel,
  getBerylliumTransition,
  calculateBerylliumStateEnergyDelta,
  evaluateE1SelectionRule,
  BERYLLIUM_VISUAL_CORE_ZEFF,
  BERYLLIUM_VALENCE_2S_ZEFF,
  berylliumElectronPairCount,
} from '../physics/beryllium'
import { BERYLLIUM_IONIZATION_ENERGY_FORMATTED_EV, BERYLLIUM_ATOMIC_WEIGHT_FORMATTED } from '../physics/constants'
import { Equation } from './Equation'

export function BerylliumEquationInspector() {
  const mode = useQuantaStore((s) => s.mode)
  const selectedLevelId = useQuantaStore((s) => s.beryllium.selectedLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.beryllium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.beryllium.activeTransition)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getBerylliumTransition(selectedTransitionId)
    return getBerylliumTransition('234.9nm')!
  }, [activeTransition, selectedTransitionId])

  const currentLevel = getBerylliumLevel(selectedLevelId) ?? getBerylliumLevel('2s2_1S0')!
  const lowerLevel = transition ? getBerylliumLevel(transition.lowerLevelId) : null
  const upperLevel = transition ? getBerylliumLevel(transition.upperLevelId) : null

  const isTransitionView = mode === 'spectra' || mode === 'energy' || Boolean(activeTransition)
  const isEmission = activeTransition ? activeTransition.type === 'emission' : selectedLevelId === upperLevel?.id

  const direction = isEmission ? 'emission' : 'absorption'
  const initialLevel = isEmission ? upperLevel : lowerLevel
  const finalLevel = isEmission ? lowerLevel : upperLevel

  const { deltaEStateEv, photonEnergyEv } = transition
    ? calculateBerylliumStateEnergyDelta(transition, direction)
    : { deltaEStateEv: 0, photonEnergyEv: 0 }

  const selectionRule = lowerLevel && upperLevel ? evaluateE1SelectionRule(lowerLevel, upperLevel) : 'indeterminate'

  return (
    <div className="equation-inspector glass-equation" aria-label="Beryllium Mathematical Inspector">
      <div className="inspector-header">
        <div className="inspector-badge">MATHEMATICAL DERIVATION</div>
        <div className="inspector-mode-tag">
          {isTransitionView && transition
            ? `NIST TRANSITION (${transition.lineName} · ${direction.toUpperCase()})`
            : `FOUR-ELECTRON HAMILTONIAN (${currentLevel.configuration} ${currentLevel.termSymbol})`}
        </div>
      </div>

      {isTransitionView && transition && lowerLevel && upperLevel && initialLevel && finalLevel ? (
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT ({direction.toUpperCase()})</span>
            <p className="stage-text">
              {direction === 'absorption' ? (
                <>
                  Neutral Beryllium absorbs a photon of discrete quantum energy <Equation>{`E_\\gamma`}</Equation>,
                  reorganizing its two valence electrons from <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong> to{' '}
                  <strong>{finalLevel.configuration} {finalLevel.termSymbol}</strong> with positive state energy change{' '}
                  <Equation>{`\\Delta E_{\\text{state}} > 0`}</Equation>. The 1s² core remains visually stable.
                </>
              ) : (
                <>
                  Neutral Beryllium undergoes a radiative relaxation from <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong>{' '}
                  down to <strong>{finalLevel.configuration} {finalLevel.termSymbol}</strong> (<Equation>{`\\Delta E_{\\text{state}} < 0`}</Equation>),
                  emitting a discrete photon of strictly positive energy <Equation>{`E_\\gamma = |\\Delta E_{\\text{state}}|`}</Equation>.
                </>
              )}
            </p>
            <p className="stage-subtext">
              Electric-dipole selection rule (simplified LS-coupling teaching model):{' '}
              <strong>
                {selectionRule === 'allowed' && 'E1 ALLOWED'}
                {selectionRule === 'spin-forbidden' && 'E1 SPIN-FORBIDDEN (ΔS ≠ 0)'}
                {selectionRule === 'parity-forbidden' && 'PARITY FORBIDDEN'}
                {selectionRule === 'delta-j-forbidden' && 'ΔJ RULE FORBIDDEN'}
                {selectionRule === 'indeterminate' && 'INDETERMINATE (grouped/centroid level)'}
              </strong>
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
              <Equation block>{`\\lambda\\,[\\text{derived}] = ${transition.derivedAirWavelengthNm.toFixed(4)}\\,\\text{nm}\\quad (\\text{STANDARD AIR})`}</Equation>
              <Equation block>{`\\lambda\\,[\\text{reference line}] = ${transition.referenceWavelengthNm.toFixed(4)}\\,\\text{nm}\\quad (\\text{NIST PERSISTENT LINE}, ${transition.referenceWavelengthMedium.toUpperCase()})`}</Equation>
            </div>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / RESULT & PROVENANCE BREAKDOWN</span>
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">State Energy Change (ΔE_state)</span>
                <span className="hero-metric-val">{deltaEStateEv > 0 ? `+${deltaEStateEv.toFixed(3)}` : deltaEStateEv.toFixed(3)} eV</span>
                <span className="hero-metric-sub">{direction.toUpperCase()}</span>
              </div>
              <div className="hero-metric highlight-metric" style={{ borderColor: transition.displayColor }}>
                <span className="hero-metric-label">Photon Energy (Eγ)</span>
                <span className="hero-metric-val" style={{ color: transition.displayColor }}>{photonEnergyEv.toFixed(3)} eV</span>
                <span className="hero-metric-sub">Strictly Positive Quantum</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Reference Line</span>
                <span className="hero-metric-val">{transition.referenceWavelengthNm.toFixed(4)} nm</span>
                <span className="hero-metric-sub">NIST PERSISTENT LINE · {transition.region}</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Level-Derived</span>
                <span className="hero-metric-val">{transition.derivedAirWavelengthNm.toFixed(4)} nm</span>
                <span className="hero-metric-sub">FROM ASD LEVEL DIFFERENCE</span>
              </div>
            </div>
            <div className="provenance-indicator-bar">
              <span>PROVENANCE: NIST ASD REFERENCE DATA · CIAAW ATOMIC WEIGHT · DERIVED WAVELENGTHS · VISUAL MODEL DENSITY</span>
            </div>
          </section>
        </div>
      ) : (
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT</span>
            <p className="stage-text">
              Neutral Beryllium (Z = 4) is a four-electron interacting quantum system. A closed <strong>1s² core</strong> screens
              the Z=4 nuclear charge, above which a <strong>filled 2s² valence subshell</strong> sits — the 2p subshell remains
              entirely empty, so the n=2 shell is NOT complete. This is the first QUANTA atom with two mutually interacting
              valence electrons, enabling singlet/triplet spin coupling and exchange splitting.
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / FOUR-ELECTRON HAMILTONIAN</span>
            <div className="math-display-group">
              <Equation block>{`\\hat{H} = \\sum_{i=1}^{4} \\left( -\\frac{\\hbar^2}{2m_e}\\nabla_i^2 - \\frac{4e^2}{4\\pi\\varepsilon_0 r_i} \\right) + \\sum_{1 \\le i < j \\le 4} \\frac{e^2}{4\\pi\\varepsilon_0 r_{ij}}`}</Equation>
            </div>
            <div className="vee-highlight-card">
              <span className="vee-title">SIX ELECTRON–ELECTRON COULOMB PAIR REPULSIONS (C(4,2) = {berylliumElectronPairCount()})</span>
              <Equation block>{`V_{ee} = \\frac{e^2}{4\\pi\\varepsilon_0} \\left( \\frac{1}{r_{12}} + \\frac{1}{r_{13}} + \\frac{1}{r_{14}} + \\frac{1}{r_{23}} + \\frac{1}{r_{24}} + \\frac{1}{r_{34}} \\right)`}</Equation>
              <p className="vee-desc">
                Six mutual pair terms prevent exact analytic separation. Neutral Be I energies do not follow{' '}
                <Equation>{`E_n = -13.6\\,Z^2/n^2`}</Equation>.
              </p>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / PAULI PRINCIPLE & GROUND SPIN-ORBITAL OCCUPANCY</span>
            <div className="math-display-group">
              <Equation block>{`\\text{Ground occupancy: } 1\\text{s}\\uparrow,\\ 1\\text{s}\\downarrow,\\ 2\\text{s}\\uparrow,\\ 2\\text{s}\\downarrow`}</Equation>
            </div>
            <p className="stage-subtext">
              No two electrons share a complete set of one-electron quantum numbers (n, l, mₗ, mₛ). The 2s2p excited manifold
              splits into <Equation>{`{}^3\\text{P}^\\circ`}</Equation> (triplet, lower) and <Equation>{`{}^1\\text{P}^\\circ`}</Equation> (singlet,
              higher) via exchange — the antisymmetric spatial triplet state reduces electron-electron repulsion, so{' '}
              <strong>triplet 2s2p lies substantially below singlet 2s2p</strong>. The 2s2p ³P° manifold is{' '}
              <strong>E1 SPIN-FORBIDDEN / METASTABLE</strong> relative to the ¹S₀ ground state (ΔS ≠ 0), not strictly impossible.
            </p>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / ATOMIC PROPERTIES & PROVENANCE</span>
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">Ionization Energy</span>
                <span className="hero-metric-val">{BERYLLIUM_IONIZATION_ENERGY_FORMATTED_EV}</span>
                <span className="hero-metric-sub">NIST ASD Current Result</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Standard Atomic Weight</span>
                <span className="hero-metric-val">Aᵣ(Be) = {BERYLLIUM_ATOMIC_WEIGHT_FORMATTED}</span>
                <span className="hero-metric-sub">CIAAW · Monoisotopic (⁹Be)</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Ground State Term</span>
                <span className="hero-metric-val">1s²2s² ¹S₀</span>
                <span className="hero-metric-sub">Singlet (S = 0)</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Visual Screening Model</span>
                <span className="hero-metric-val">Z_core={BERYLLIUM_VISUAL_CORE_ZEFF}, Z_2s={BERYLLIUM_VALENCE_2S_ZEFF}</span>
                <span className="hero-metric-sub">Slater's Rules · Reduced 3D Density</span>
              </div>
            </div>
            <div className="provenance-indicator-bar">
              <span>REFERENCE: NIST ASD & CIAAW · DERIVED: PAIR COUNT & SELECTION RULES · VISUAL MODEL: 1-ELECTRON REDUCED DENSITY</span>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  getBoronLevel,
  getBoronTransition,
  calculateBoronStateEnergyDelta,
  evaluateE1SelectionRule,
  BORON_VISUAL_CORE_ZEFF,
  BORON_VALENCE_2S_ZEFF,
  BORON_VALENCE_2P_ZEFF,
  boronElectronPairCount,
} from '../physics/boron'
import { BORON_IONIZATION_ENERGY_FORMATTED_EV, BORON_ATOMIC_WEIGHT_RANGE } from '../physics/constants'
import { Equation } from './Equation'

export function BoronEquationInspector() {
  const mode = useQuantaStore((s) => s.mode)
  const selectedLevelId = useQuantaStore((s) => s.boron.selectedLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.boron.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.boron.activeTransition)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getBoronTransition(selectedTransitionId)
    return getBoronTransition('249.77nm')!
  }, [activeTransition, selectedTransitionId])

  const currentLevel = getBoronLevel(selectedLevelId) ?? getBoronLevel('2p_2P1_2')!
  const lowerLevel = transition ? getBoronLevel(transition.lowerLevelId) : null
  const upperLevel = transition ? getBoronLevel(transition.upperLevelId) : null

  const isTransitionView = mode === 'spectra' || mode === 'energy' || Boolean(activeTransition)
  const isEmission = activeTransition ? activeTransition.type === 'emission' : selectedLevelId === upperLevel?.id

  const direction = isEmission ? 'emission' : 'absorption'
  const initialLevel = isEmission ? upperLevel : lowerLevel
  const finalLevel = isEmission ? lowerLevel : upperLevel

  const { deltaEStateEv, photonEnergyEv } = transition
    ? calculateBoronStateEnergyDelta(transition, direction)
    : { deltaEStateEv: 0, photonEnergyEv: 0 }

  const selectionRule = lowerLevel && upperLevel ? evaluateE1SelectionRule(lowerLevel, upperLevel) : 'indeterminate'

  return (
    <div className="equation-inspector glass-equation" aria-label="Boron Mathematical Inspector">
      <div className="inspector-header">
        <div className="inspector-badge">MATHEMATICAL DERIVATION</div>
        <div className="inspector-mode-tag">
          {isTransitionView && transition
            ? `NIST TRANSITION (${transition.lineName} · ${direction.toUpperCase()})`
            : `FIVE-ELECTRON HAMILTONIAN (${currentLevel.configuration} ${currentLevel.termSymbol})`}
        </div>
      </div>

      {isTransitionView && transition && lowerLevel && upperLevel && initialLevel && finalLevel ? (
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT ({direction.toUpperCase()})</span>
            <p className="stage-text">
              {direction === 'absorption' ? (
                <>
                  Neutral Boron absorbs a photon of discrete quantum energy <Equation>{`E_\\gamma`}</Equation>,
                  reorganizing its valence electron(s) from <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong> to{' '}
                  <strong>{finalLevel.configuration} {finalLevel.termSymbol}</strong> with positive state energy change{' '}
                  <Equation>{`\\Delta E_{\\text{state}} > 0`}</Equation>. The 1s²2s² core remains visually stable.
                </>
              ) : (
                <>
                  Neutral Boron undergoes a radiative relaxation from <strong>{initialLevel.configuration} {initialLevel.termSymbol}</strong>{' '}
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
              <Equation block>{`E_{\\text{initial}}\\,(${initialLevel.termSymbol}) = ${initialLevel.energyEv.toFixed(4)}\\,\\text{eV}\\quad (${initialLevel.wavenumberCm1.toFixed(3)}\\,\\text{cm}^{-1})`}</Equation>
              <Equation block>{`E_{\\text{final}}\\,(${finalLevel.termSymbol}) = ${finalLevel.energyEv.toFixed(4)}\\,\\text{eV}\\quad (${finalLevel.wavenumberCm1.toFixed(3)}\\,\\text{cm}^{-1})`}</Equation>
              <Equation block>{`\\Delta E_{\\text{state}} = ${finalLevel.energyEv.toFixed(4)} - ${initialLevel.energyEv.toFixed(4)} = ${deltaEStateEv > 0 ? `+${deltaEStateEv.toFixed(4)}` : deltaEStateEv.toFixed(4)}\\,\\text{eV}`}</Equation>
              <Equation block>{`E_\\gamma = |\\Delta E_{\\text{state}}| = ${photonEnergyEv.toFixed(4)}\\,\\text{eV}`}</Equation>
              <Equation block>{`\\lambda_{\\text{vac}}\\,[\\text{derived}] = \\frac{10^7}{${(upperLevel.wavenumberCm1 - lowerLevel.wavenumberCm1).toFixed(3)}\\,\\text{cm}^{-1}} = ${transition.derivedVacuumWavelengthNm.toFixed(4)}\\,\\text{nm}`}</Equation>
              <Equation block>{`\\lambda\\,[\\text{derived}] = ${transition.derivedAirWavelengthNm.toFixed(4)}\\,\\text{nm}\\quad (\\text{STANDARD AIR})`}</Equation>
              <Equation block>{`\\lambda\\,[\\text{reference line}] = ${transition.referenceWavelengthNm.toFixed(4)}\\,\\text{nm}\\quad (\\text{NIST REFERENCE LINE}, ${transition.referenceWavelengthMedium.toUpperCase()})`}</Equation>
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
                <span className="hero-metric-sub">NIST REFERENCE LINE · {transition.region}</span>
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
              Neutral Boron (Z = 5) is a five-electron interacting quantum system. A closed{' '}
              <strong>1s² core</strong> and filled <strong>2s² pair</strong> screen the Z=5 nuclear charge,
              above which sits a single valence electron in an <strong>OPEN 2p subshell</strong>. This is
              QUANTA's <strong>first atom with a nonzero-L, odd-parity ground state</strong> — Boron is NOT
              Hydrogenic, and it is NOT "Beryllium plus another orbiting dot": the open p subshell gives the
              ground term genuine directional character and fine structure (²P°₁/₂, ²P°₃/₂).
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / FIVE-ELECTRON HAMILTONIAN</span>
            <div className="math-display-group">
              <Equation block>{`\\hat{H} = \\sum_{i=1}^{5} \\left( -\\frac{\\hbar^2}{2m_e}\\nabla_i^2 - \\frac{5e^2}{4\\pi\\varepsilon_0 r_i} \\right) + \\sum_{1 \\le i < j \\le 5} \\frac{e^2}{4\\pi\\varepsilon_0 r_{ij}}`}</Equation>
            </div>
            <div className="vee-highlight-card">
              <span className="vee-title">TEN ELECTRON–ELECTRON COULOMB PAIR REPULSIONS (C(5,2) = {boronElectronPairCount()})</span>
              <Equation block>{`V_{ee} = \\frac{e^2}{4\\pi\\varepsilon_0} \\left( \\frac{1}{r_{12}} + \\frac{1}{r_{13}} + \\frac{1}{r_{14}} + \\frac{1}{r_{15}} + \\frac{1}{r_{23}} + \\frac{1}{r_{24}} + \\frac{1}{r_{25}} + \\frac{1}{r_{34}} + \\frac{1}{r_{35}} + \\frac{1}{r_{45}} \\right)`}</Equation>
              <p className="vee-desc">
                Ten mutual pair terms prevent exact analytic separation. Neutral B I energies never follow{' '}
                <Equation>{`E_n = -13.6\\,Z^2/n^2`}</Equation> — that Hydrogenic formula applies only to
                single-electron systems and is explicitly wrong for a 5-electron atom.
              </p>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / PAULI PRINCIPLE & OPEN 2p GROUND OCCUPANCY</span>
            <div className="math-display-group">
              <Equation block>{`\\text{Ground occupancy: } 1\\text{s}\\uparrow,\\ 1\\text{s}\\downarrow,\\ 2\\text{s}\\uparrow,\\ 2\\text{s}\\downarrow,\\ 2\\text{p}(n{=}2,\\ell{=}1,m_\\ell{=}-1,m_s{=}+\\tfrac{1}{2})`}</Equation>
            </div>
            <p className="stage-subtext">
              No two electrons share a complete set of one-electron quantum numbers (n, l, mₗ, mₛ). This is
              ONE valid ground Pauli-consistent occupancy — any mₗ ∈ {'{-1, 0, +1}'} for the single 2p
              electron is equally valid; QUANTA picks one definite representative for display. Spin-orbit
              coupling of this single p electron splits the ground term into{' '}
              <Equation>{`{}^2\\text{P}^\\circ_{1/2}`}</Equation> (lower) and{' '}
              <Equation>{`{}^2\\text{P}^\\circ_{3/2}`}</Equation> (higher, +15.287 cm⁻¹) — a genuine
              fine-structure splitting present already in the ground state, unlike Beryllium's closed-shell{' '}
              <Equation>{`{}^1\\text{S}_0`}</Equation> ground term.
            </p>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / ATOMIC PROPERTIES & PROVENANCE</span>
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">Ionization Energy</span>
                <span className="hero-metric-val">{BORON_IONIZATION_ENERGY_FORMATTED_EV}</span>
                <span className="hero-metric-sub">NIST ASD Current Result</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Standard Atomic Weight</span>
                <span className="hero-metric-val">
                  [{BORON_ATOMIC_WEIGHT_RANGE[0]}, {BORON_ATOMIC_WEIGHT_RANGE[1]}]
                </span>
                <span className="hero-metric-sub">CIAAW · Two-Isotope Interval</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Ground State Term</span>
                <span className="hero-metric-val">1s²2s²2p ²P°₁/₂</span>
                <span className="hero-metric-sub">Doublet (S = ½), L = 1, Odd Parity</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Visual Screening Model</span>
                <span className="hero-metric-val">
                  Z_core={BORON_VISUAL_CORE_ZEFF}, Z_2s={BORON_VALENCE_2S_ZEFF}, Z_2p={BORON_VALENCE_2P_ZEFF}
                </span>
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

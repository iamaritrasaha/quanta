import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  bohrRadius,
  bohrVelocity,
  formatFrequency,
  hydrogenEnergy,
  safeHydrogenTransition,
} from '../physics/hydrogen'
import { ORBITALS } from '../physics/quantum'
import { Equation } from './Equation'

export function EquationInspector() {
  const mode = useQuantaStore((s) => s.mode)
  const level = useQuantaStore((s) => s.level)
  const initialLevel = useQuantaStore((s) => s.initialLevel)
  const targetLevel = useQuantaStore((s) => s.targetLevel)
  const orbital = useQuantaStore((s) => s.orbital)
  const activeTransition = useQuantaStore((s) => s.activeTransition)

  const transition = useMemo(() => {
    return activeTransition?.physics ?? safeHydrogenTransition(initialLevel, targetLevel)
  }, [activeTransition, initialLevel, targetLevel])

  const currentEnergy = hydrogenEnergy(level)
  const currentRadiusPm = bohrRadius(level) * 1e12
  const currentVelocity = bohrVelocity(level)
  const q = orbital && ORBITALS[orbital] ? ORBITALS[orbital] : { n: level, l: 0, m: 0 }

  const phase = activeTransition?.phase ?? 'idle'
  const isEnergyPhase = phase === 'photonIncoming' || phase === 'interaction' || phase === 'electronTransition'
  const isWavelengthPhase = phase === 'photonOutgoing' || phase === 'settle'

  return (
    <div className="equation-inspector glass-equation" aria-label="Equation Inspector">
      <div className="inspector-header">
        <div className="inspector-badge">MATHEMATICAL DERIVATION</div>
        <div className="inspector-mode-tag">
          {mode === 'quantum'
            ? orbital
              ? `SCHRÖDINGER PROBABILITY (${orbital.toUpperCase()})`
              : `SCHRÖDINGER EIGENSTATE (n = ${level})`
            : mode === 'spectra' || mode === 'energy' || transition
            ? `RYDBERG TRANSITION (${initialLevel} → ${targetLevel})`
            : `BOHR QUANTIZATION (n = ${level})`}
        </div>
      </div>

      {mode === 'quantum' ? (
        /* Quantum Mechanics Derivation */
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT</span>
            <p className="stage-text">
              The electron state is described by a continuous probability amplitude wave function{' '}
              <Equation>{`\\psi_{nlm}(r,\\theta,\\phi)`}</Equation>. The measurable presence in space is given by
              the Born probability density <Equation>{`P = |\\psi|^2`}</Equation>.
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / FORMULATION</span>
            <div className="math-display-group">
              <Equation block>{`\\hat{H}\\psi = E\\psi`}</Equation>
              <Equation block>{`\\psi_{nlm}(r,\\theta,\\phi) = R_{nl}(r)\\, Y_l^m(\\theta,\\phi)`}</Equation>
              <Equation block>{`P(r,\\theta,\\phi) = |\\psi_{nlm}(r,\\theta,\\phi)|^2`}</Equation>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / QUANTUM NUMBERS & STATE</span>
            <div className="quantum-params-grid">
              <div className="param-item">
                <span className="param-title">Principal (n)</span>
                <strong className="param-val">{q.n}</strong>
                <span className="param-sub">Energy shell</span>
              </div>
              <div className="param-item">
                <span className="param-title">Azimuthal (l)</span>
                <strong className="param-val">{q.l}</strong>
                <span className="param-sub">{q.l === 0 ? 's (spherical)' : q.l === 1 ? 'p (polar)' : 'd (diffuse)'}</span>
              </div>
              <div className="param-item">
                <span className="param-title">Magnetic (mₗ)</span>
                <strong className="param-val">{q.m}</strong>
                <span className="param-sub">Spatial orientation</span>
              </div>
              <div className="param-item">
                <span className="param-title">Spin (mₛ)</span>
                <strong className="param-val">+½</strong>
                <span className="param-sub">Intrinsic spin</span>
              </div>
            </div>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / EIGENSTATE RESULT</span>
            <div className="hero-metric-row">
              <div className="hero-metric">
                <span className="hero-metric-label">Eigen-Energy (Eₙ)</span>
                <span className="hero-metric-val">{hydrogenEnergy(q.n).toFixed(3)} eV</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Orbital Symmetry</span>
                <span className="hero-metric-val">
                  {orbital === '1s'
                    ? 'Spherical, 0 nodes'
                    : orbital === '2s'
                    ? 'Spherical, 1 radial node'
                    : orbital === '2p'
                    ? 'Bipolar, 1 nodal plane'
                    : `Principal shell n = ${level}`}
                </span>
              </div>
            </div>
          </section>
        </div>
      ) : transition ? (
        /* Transition Derivation */
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT</span>
            <p className="stage-text">
              {transition.direction === 'absorption'
                ? `Electron absorbs an incoming discrete photon, exciting from n = ${transition.initialN} up to n = ${transition.finalN}.`
                : `Electron relaxes from n = ${transition.initialN} down to n = ${transition.finalN}, liberating energy as a discrete photon.`}
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / GOVERNING EQUATIONS</span>
            <div className={`math-display-group ${isEnergyPhase ? 'active-derivation-highlight' : ''}`}>
              <Equation block>{`\\Delta E = E_f - E_i`}</Equation>
              <Equation block>{`E_\\gamma = |\\Delta E| = h\\nu = \\frac{hc}{\\lambda}`}</Equation>
              <Equation block>{`\\frac{1}{\\lambda} = R_H \\left( \\frac{1}{n_f^2} - \\frac{1}{n_i^2} \\right)`}</Equation>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / NUMERICAL SUBSTITUTION</span>
            <div className="math-display-group substitution-group">
              <Equation block>{`E_{${transition.initialN}} = -\\frac{13.598}{${transition.initialN}^2} = ${hydrogenEnergy(transition.initialN).toFixed(3)}\\,\\text{eV}`}</Equation>
              <Equation block>{`E_{${transition.finalN}} = -\\frac{13.598}{${transition.finalN}^2} = ${hydrogenEnergy(transition.finalN).toFixed(3)}\\,\\text{eV}`}</Equation>
              <Equation block>{`|\\Delta E| = |${hydrogenEnergy(transition.finalN).toFixed(3)} - (${hydrogenEnergy(transition.initialN).toFixed(3)})| = ${transition.photonEnergyEv.toFixed(3)}\\,\\text{eV}`}</Equation>
              <Equation block>{`\\lambda = \\frac{1239.84\\,\\text{eV}\\cdot\\text{nm}}{${transition.photonEnergyEv.toFixed(3)}\\,\\text{eV}} = ${transition.wavelengthNm.toFixed(2)}\\,\\text{nm}`}</Equation>
            </div>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / SPECTRAL RESULT</span>
            <div className="hero-metric-grid">
              <div className={`hero-metric ${isEnergyPhase ? 'highlight-metric' : ''}`}>
                <span className="hero-metric-label">Photon Energy</span>
                <span className="hero-metric-val">{transition.photonEnergyEv.toFixed(3)} eV</span>
              </div>
              <div
                className={`hero-metric highlight-metric ${isWavelengthPhase ? 'hero-pulse-highlight' : ''}`}
                style={{ borderColor: transition.displayColor }}
              >
                <span className="hero-metric-label">Wavelength (λ)</span>
                <span className="hero-metric-val" style={{ color: transition.displayColor }}>
                  {transition.wavelengthNm.toFixed(1)} nm
                </span>
                <span className="hero-metric-sub">{transition.band.toUpperCase()}</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Frequency (ν)</span>
                <span className="hero-metric-val">{formatFrequency(transition.frequencyHz)}</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Spectral Line</span>
                <span className="hero-metric-val">{transition.series} ({transition.lineName})</span>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Stationary Bohr State Derivation */
        <div className="inspector-stages">
          <section className="stage-block">
            <span className="stage-label">01 / CONCEPT</span>
            <p className="stage-text">
              Under Bohr quantization, electron angular momentum is constrained to discrete multiples of{' '}
              <Equation>{`\\hbar`}</Equation>, yielding non-radiating stationary orbits.
            </p>
          </section>

          <section className="stage-block">
            <span className="stage-label">02 / BOHR FORMULAS</span>
            <div className="math-display-group">
              <Equation block>{`E_n = -\\frac{13.598}{n^2}\\,\\text{eV}`}</Equation>
              <Equation block>{`r_n = a_0 \\cdot n^2 = 52.92\\,\\text{pm} \\cdot n^2`}</Equation>
              <Equation block>{`v_n = \\frac{\\alpha c}{n} = \\frac{2.188 \\times 10^6\\,\\text{m/s}}{n}`}</Equation>
            </div>
          </section>

          <section className="stage-block">
            <span className="stage-label">03 / LEVEL SUBSTITUTION (n = {level})</span>
            <div className="math-display-group substitution-group">
              <Equation block>{`E_{${level}} = -\\frac{13.598}{${level}^2} = ${currentEnergy.toFixed(3)}\\,\\text{eV}`}</Equation>
              <Equation block>{`r_{${level}} = 52.92\\,\\text{pm} \\times ${level * level} = ${currentRadiusPm.toFixed(1)}\\,\\text{pm}`}</Equation>
              <Equation block>{`v_{${level}} = \\frac{2.188 \\times 10^6}{${level}} = ${(currentVelocity / 1e6).toFixed(3)} \\times 10^6\\,\\text{m/s}`}</Equation>
            </div>
          </section>

          <section className="stage-block result-block">
            <span className="stage-label">04 / STATIONARY STATE VALUES</span>
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">Binding Energy</span>
                <span className="hero-metric-val">{currentEnergy.toFixed(3)} eV</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Physical Radius</span>
                <span className="hero-metric-val">{currentRadiusPm.toFixed(1)} pm</span>
                <span className="hero-metric-sub">{(currentRadiusPm / 100).toFixed(3)} Å</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Orbital Speed</span>
                <span className="hero-metric-val">{(currentVelocity / 1e3).toFixed(0)} km/s</span>
                <span className="hero-metric-sub">{((currentVelocity / 299792458) * 100).toFixed(2)}% c</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

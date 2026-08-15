import { useQuantaStore } from '../state/quantaStore'
import { ORBITALS, UI_ORBITALS, type UiOrbitalKey } from '../physics/quantum'
import { hydrogenEnergy } from '../physics/hydrogen'

export function QuantumControls() {
  const level = useQuantaStore((s) => s.level)
  const orbital = useQuantaStore((s) => s.orbital)
  const setOrbital = useQuantaStore((s) => s.setOrbital)
  const setMode = useQuantaStore((s) => s.setMode)

  const isAvailable = orbital !== null && Boolean(ORBITALS[orbital])
  const currentEnergy = hydrogenEnergy(level)

  const orbitalDescriptions: Record<UiOrbitalKey, { title: string; desc: string }> = {
    '1s': {
      title: 'Ground State (1s)',
      desc: 'Spherically symmetric probability distribution with maximum density at the nucleus. 0 radial nodes, 0 angular nodes.',
    },
    '2s': {
      title: 'First Excited s-Orbital (2s)',
      desc: 'Spherically symmetric state with an inner density sphere separated from an outer shell by a spherical radial node at r = 2 a₀.',
    },
    '2p': {
      title: 'First Excited p-Orbital (2p, m=0)',
      desc: 'Bipolar lobe oriented along the z-axis, exhibiting an exact planar node at the xy-equator (z = 0) where density is identically zero.',
    },
  }

  // If n >= 3, quantum probability visualization is not yet exposed, but electronic state is preserved
  if (!isAvailable) {
    return (
      <div className="quantum-controls glass-instrument" aria-label="Quantum State Controls">
        <div className="quantum-header">
          <span className="quantum-title">HYDROGENIC ORBITALS</span>
          <span className="quantum-tag state-preserved-badge">STATE PRESERVED (n = {level})</span>
        </div>

        <div className="unsupported-quantum-card">
          <div className="unsupported-icon">⚛</div>
          <h4 className="unsupported-title">n = {level} quantum visualization is not enabled yet.</h4>
          <p className="unsupported-desc">
            The electronic state has been preserved (E<sub>{level}</sub> = {currentEnergy.toFixed(3)} eV).
            QUANTA currently exposes validated 1s, 2s and 2p probability visualizations.
          </p>

          <div className="unsupported-actions">
            <button className="unsupported-btn primary" onClick={() => setOrbital('2s')}>
              VIEW n = 2 QUANTUM STATE (2s)
            </button>
            <button className="unsupported-btn primary" onClick={() => setOrbital('1s')}>
              VIEW 1s GROUND STATE
            </button>
            <button className="unsupported-btn secondary" onClick={() => setMode('bohr')}>
              RETURN TO BOHR (n = {level})
            </button>
          </div>
        </div>

        <div className="quantum-scientific-note">
          <span>
            Physical binding energy E<sub>{level}</sub> = {currentEnergy.toFixed(3)} eV remains exact and
            unmodified across the mathematical engine.
          </span>
        </div>
      </div>
    )
  }

  const q = ORBITALS[orbital]
  const energy = hydrogenEnergy(q.n)

  return (
    <div className="quantum-controls glass-instrument" aria-label="Quantum State Controls">
      <div className="quantum-header">
        <span className="quantum-title">HYDROGENIC ORBITALS</span>
        <span className="quantum-tag">SCHRÖDINGER EIGENSTATES</span>
      </div>

      {/* Orbital Selector Pills */}
      <div className="orbital-pill-selector">
        {UI_ORBITALS.map((orb) => (
          <button
            key={orb}
            className={`orbital-pill-btn ${orb === orbital ? 'active' : ''}`}
            onClick={() => setOrbital(orb)}
          >
            <span className="pill-name">{orb}</span>
            <span className="pill-sub">
              {orb === '1s' ? 'Ground' : orb === '2s' ? 'Radial Node' : 'Nodal Plane'}
            </span>
          </button>
        ))}
      </div>

      {/* Quantum Numbers Grid */}
      <div className="quantum-numbers-card">
        <div className="q-num-box">
          <span className="q-label">n (principal)</span>
          <strong className="q-val">{q.n}</strong>
          <span className="q-sub">Energy shell</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">l (azimuthal)</span>
          <strong className="q-val">{q.l}</strong>
          <span className="q-sub">{q.l === 0 ? 's-orbital' : 'p-orbital'}</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">mₗ (magnetic)</span>
          <strong className="q-val">{q.m}</strong>
          <span className="q-sub">Orientation</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Eₙ (energy)</span>
          <strong className="q-val">{energy.toFixed(3)}</strong>
          <span className="q-sub">eV</span>
        </div>
      </div>

      {/* Orbital Structural Details */}
      <div className="orbital-info-box">
        <strong className="info-title">{orbitalDescriptions[orbital].title}</strong>
        <p className="info-desc">{orbitalDescriptions[orbital].desc}</p>
      </div>

      <div className="quantum-scientific-note">
        <span>
          Probability-density field sampled directly from the exact Hydrogenic analytic solution{' '}
          <code>|ψ(r,θ,φ)|²</code>. Points represent spatial probability amplitude, not classical trajectories.
        </span>
      </div>
    </div>
  )
}

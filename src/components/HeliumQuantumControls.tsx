import { useQuantaStore } from '../state/quantaStore'
import { getHeliumLevel, HELIUM_GROUND_ZEFF } from '../physics/helium'
import { Equation } from './Equation'

export function HeliumQuantumControls() {
  const selectedLevelId = useQuantaStore((s) => s.helium.selectedLevelId)
  const densityView = useQuantaStore((s) => s.helium.densityView)
  const setHeliumLevel = useQuantaStore((s) => s.setHeliumLevel)
  const setHeliumDensityView = useQuantaStore((s) => s.setHeliumDensityView)

  const currentLevel = getHeliumLevel(selectedLevelId) ?? getHeliumLevel('1s2_1S0')!

  const quantumPills: { id: string; label: string; sub: string }[] = [
    { id: '1s2_1S0', label: '1s² ¹S₀', sub: 'Ground Singlet' },
    { id: '1s2s_3S1', label: '1s2s ³S₁', sub: 'Triplet (19.82 eV)' },
    { id: '1s2s_1S0', label: '1s2s ¹S₀', sub: 'Singlet (20.62 eV)' },
    { id: '1s2p_3P2', label: '1s2p ³P°₂', sub: 'Triplet (20.96 eV)' },
    { id: '1s2p_1P1', label: '1s2p ¹P°₁', sub: 'Singlet (21.22 eV)' },
    { id: '1s3d_3D', label: '1s3d ³D', sub: 'Triplet (23.07 eV)' },
  ]

  const isGround = currentLevel.id === '1s2_1S0'

  return (
    <div className="quantum-controls glass-instrument" aria-label="Helium Quantum Controls">
      <div className="quantum-header">
        <span className="quantum-title">HELIUM QUANTUM EIGENSTATES</span>
        <span className="provenance-tag">REDUCED DENSITY MODEL</span>
      </div>

      {/* State Selector Pills */}
      <div className="orbital-pill-selector">
        {quantumPills.map((pill) => (
          <button
            key={pill.id}
            className={`orbital-pill-btn ${pill.id === currentLevel.id ? 'active' : ''}`}
            onClick={() => setHeliumLevel(pill.id)}
          >
            <span className="pill-name">{pill.label}</span>
            <span className="pill-sub">{pill.sub}</span>
          </button>
        ))}
      </div>

      {/* Density Mode Toggle */}
      <div className="density-toggle-group">
        <span className="toggle-group-label">VISUALIZATION VIEW:</span>
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${densityView === 'total' ? 'active' : ''}`}
            onClick={() => setHeliumDensityView('total')}
          >
            TOTAL DENSITY ρ(r)
          </button>
          <button
            className={`toggle-btn ${densityView === 'components' ? 'active' : ''}`}
            onClick={() => setHeliumDensityView('components')}
          >
            ORBITAL COMPONENTS
          </button>
        </div>
      </div>

      {/* Pauli Principle & Quantum Parameters */}
      <div className="quantum-numbers-card">
        <div className="q-num-box">
          <span className="q-label">Configuration</span>
          <strong className="q-val">{currentLevel.configuration}</strong>
          <span className="q-sub">{currentLevel.multiplicity === 'singlet' ? 'Singlet (S=0)' : 'Triplet (S=1)'}</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Term Symbol</span>
          <strong className="q-val">{currentLevel.termSymbol}</strong>
          <span className="q-sub">Total J = {currentLevel.J}</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Spin State (χ)</span>
          <strong className="q-val">{isGround ? '↑↓ (Singlet)' : currentLevel.multiplicity === 'triplet' ? '↑↑ (Triplet)' : '↑↓ (Singlet)'}</strong>
          <span className="q-sub">Antisymmetric total state</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Excitation Energy</span>
          <strong className="q-val">{currentLevel.energyEv.toFixed(3)}</strong>
          <span className="q-sub">eV (NIST ASD)</span>
        </div>
      </div>

      {/* Pauli & Ground State Spin Coupling Explanation */}
      <div className="orbital-info-box">
        <strong className="info-title">
          {isGround ? 'Pauli Exclusion & Singlet Ground State (1s² ¹S₀)' : `${currentLevel.termSymbol} Excited State`}
        </strong>
        {isGround ? (
          <div className="info-math-detail">
            <p className="info-desc">
              Both electrons occupy the spatial 1s orbital with anti-parallel spin projections:
              <br />
              • Electron A: <code>(n=1, l=0, mₗ=0, mₛ=+½)</code>
              <br />
              • Electron B: <code>(n=1, l=0, mₗ=0, mₛ=-½)</code>
            </p>
            <div className="spin-formula-box">
              <Equation block>{`\\chi_{\\text{singlet}} = \\frac{|\\uparrow\\downarrow\\rangle - |\\downarrow\\uparrow\\rangle}{\\sqrt{2}}`}</Equation>
            </div>
            <p className="info-subtext">
              The spatial ground wavefunction is symmetric, while the spin wavefunction is antisymmetric,
              satisfying Fermi-Dirac antisymmetry under electron exchange.
            </p>
          </div>
        ) : (
          <p className="info-desc">
            One electron remains in the inner 1s core, while the second electron occupies the higher{' '}
            <code>{currentLevel.configuration.replace('1s', '')}</code> state. Triplet states lie lower in energy
            than corresponding singlets due to the quantum exchange hole.
          </p>
        )}
      </div>

      {/* Critical 6D Wavefunction Disclaimer */}
      <div className="quantum-scientific-note">
        <span className="note-badge">6D WAVEFUNCTION APPROXIMATION</span>
        <p className="note-text">
          The full two-electron wavefunction depends on <strong>six spatial coordinates</strong>{' '}
          <code>Ψ(r₁, r₂)</code>. This 3D view renders a reduced one-electron probability density{' '}
          <code>ρ(r)</code> using an effective-charge screening model (Z<sub>eff</sub> = {HELIUM_GROUND_ZEFF}).
        </p>
      </div>
    </div>
  )
}

import { useQuantaStore } from '../state/quantaStore'
import {
  getBerylliumLevel,
  BERYLLIUM_VISUAL_CORE_ZEFF,
  BERYLLIUM_VALENCE_2S_ZEFF,
  berylliumElectronPairCount,
} from '../physics/beryllium'
import { Equation } from './Equation'

export function BerylliumQuantumControls() {
  const selectedLevelId = useQuantaStore((s) => s.beryllium.selectedLevelId)
  const densityView = useQuantaStore((s) => s.beryllium.densityView)
  const setBerylliumLevel = useQuantaStore((s) => s.setBerylliumLevel)
  const setBerylliumDensityView = useQuantaStore((s) => s.setBerylliumDensityView)

  const currentLevel = getBerylliumLevel(selectedLevelId) ?? getBerylliumLevel('2s2_1S0')!

  const quantumPills: { id: string; label: string; sub: string }[] = [
    { id: '2s2_1S0', label: '2s² ¹S₀', sub: 'Ground Singlet' },
    { id: '2s2p_3P1', label: '2s2p ³P°₁', sub: 'Metastable Triplet' },
    { id: '2s2p_1P1', label: '2s2p ¹P°₁', sub: 'Resonance Singlet' },
    { id: '2p2_1D2', label: '2p² ¹D₂', sub: 'Both Valence in 2p' },
    { id: '2s3s_3S1', label: '2s3s ³S₁', sub: 'Triplet Rydberg-like' },
    { id: '2s3d_1D2', label: '2s3d ¹D₂', sub: 'Singlet Rydberg-like' },
  ]

  const isGround = currentLevel.id === '2s2_1S0'

  return (
    <div className="quantum-controls glass-instrument" aria-label="Beryllium Quantum Controls">
      <div className="quantum-header">
        <span className="quantum-title">BERYLLIUM QUANTUM REDUCED DENSITY</span>
        <span className="provenance-tag">REDUCED DENSITY MODEL</span>
      </div>

      <div className="orbital-pill-selector">
        {quantumPills.map((pill) => (
          <button
            key={pill.id}
            className={`orbital-pill-btn ${pill.id === currentLevel.id ? 'active' : ''}`}
            onClick={() => setBerylliumLevel(pill.id)}
          >
            <span className="pill-name">{pill.label}</span>
            <span className="pill-sub">{pill.sub}</span>
          </button>
        ))}
      </div>

      <div className="density-toggle-group">
        <span className="toggle-group-label">VISUALIZATION VIEW:</span>
        <div className="toggle-buttons">
          <button className={`toggle-btn ${densityView === 'total' ? 'active' : ''}`} onClick={() => setBerylliumDensityView('total')}>
            TOTAL DENSITY ρ(r)
          </button>
          <button className={`toggle-btn ${densityView === 'components' ? 'active' : ''}`} onClick={() => setBerylliumDensityView('components')}>
            CORE / VALENCE COMPONENTS
          </button>
        </div>
      </div>

      <div className="quantum-numbers-card">
        <div className="q-num-box">
          <span className="q-label">Configuration</span>
          <strong className="q-val">{currentLevel.configuration}</strong>
          <span className="q-sub">{currentLevel.multiplicity === 'singlet' ? 'Singlet (S=0)' : 'Triplet (S=1)'}</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Term Symbol</span>
          <strong className="q-val">{currentLevel.termSymbol}</strong>
          <span className="q-sub">J = {currentLevel.J}</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Spin Coupling (χ)</span>
          <strong className="q-val">{isGround ? '↑↓ (Singlet)' : currentLevel.multiplicity === 'triplet' ? '↑↑ (Triplet)' : '↑↓ (Singlet)'}</strong>
          <span className="q-sub">Antisymmetric total 4-electron state</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Excitation Energy</span>
          <strong className="q-val">{currentLevel.energyEv.toFixed(3)}</strong>
          <span className="q-sub">eV (NIST ASD)</span>
        </div>
      </div>

      <div className="orbital-info-box">
        <div className="card-kicker-row">
          <strong className="info-title">
            {isGround ? 'Pauli Exclusion & Filled 2s² Ground Subshell' : `${currentLevel.termSymbol} Excited-State Spin Coupling`}
          </strong>
          <span className="provenance-tag">DERIVED MODEL QUANTITY</span>
        </div>

        {isGround ? (
          <div className="info-math-detail">
            <p className="info-desc">
              Ground-state spin-orbital occupancy: <code>1s↑ 1s↓ 2s↑ 2s↓</code>. The 2s subshell is completely
              filled, but the n = 2 <em>shell</em> is not complete — the 2p subshell remains entirely empty.
            </p>
            <div className="spin-formula-box">
              <Equation block>{`\\chi_{\\text{singlet}} = \\frac{|\\uparrow\\downarrow\\rangle - |\\downarrow\\uparrow\\rangle}{\\sqrt{2}}`}</Equation>
            </div>
          </div>
        ) : (
          <p className="info-desc">
            In this excited configuration, one or both valence electrons occupy a higher subshell.
            Triplet couplings (parallel spins) place the exchange-antisymmetric spatial wavefunction below
            the corresponding singlet in energy — <strong>TERM / SPIN COUPLING IS NOT FULLY ENCODED BY A
            SINGLE 3D ORBITAL SHAPE.</strong>
          </p>
        )}
      </div>

      <div className="quantum-scientific-note">
        <span className="note-badge">REDUCED DENSITY APPROXIMATION</span>
        <p className="note-text">
          The full four-electron wavefunction depends on <strong>twelve spatial coordinates</strong>{' '}
          <Equation>{`\\Psi(\\mathbf{r}_1, \\mathbf{r}_2, \\mathbf{r}_3, \\mathbf{r}_4)`}</Equation> and contains{' '}
          {berylliumElectronPairCount()} unique electron-electron pair terms. This instrument visualizes a{' '}
          REDUCED ONE-ELECTRON DENSITY <Equation>{`\\rho(\\mathbf{r}) = 2\\rho_{1\\text{s}}(\\mathbf{r}) + \\rho_{\\text{valence}}(\\mathbf{r})`}</Equation>{' '}
          using APPROXIMATE EFFECTIVE CHARGES derived via Slater's Rules (Z<sub>core</sub> = {BERYLLIUM_VISUAL_CORE_ZEFF},
          Z<sub>2s</sub> = {BERYLLIUM_VALENCE_2S_ZEFF}). This VISUAL MODEL PARAMETER set is used solely for 3D
          density rendering and is strictly decoupled from NIST ASD energy eigenvalues.
        </p>
      </div>
    </div>
  )
}

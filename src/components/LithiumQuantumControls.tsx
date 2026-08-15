import { useQuantaStore } from '../state/quantaStore'
import {
  getLithiumLevel,
  calculateQuantumDefect,
  LITHIUM_CORE_ZEFF,
  LITHIUM_VALENCE_2S_ZEFF,
} from '../physics/lithium'
import { Equation } from './Equation'

export function LithiumQuantumControls() {
  const selectedLevelId = useQuantaStore((s) => s.lithium.selectedLevelId)
  const densityView = useQuantaStore((s) => s.lithium.densityView)
  const setLithiumLevel = useQuantaStore((s) => s.setLithiumLevel)
  const setLithiumDensityView = useQuantaStore((s) => s.setLithiumDensityView)

  const currentLevel = getLithiumLevel(selectedLevelId) ?? getLithiumLevel('1s2_2s_2S1_2')!
  const { effectiveN, quantumDefect } = calculateQuantumDefect(currentLevel)

  const quantumPills: { id: string; label: string; sub: string }[] = [
    { id: '1s2_2s_2S1_2', label: '1s²2s ²S₁/₂', sub: 'Ground (0.00 eV)' },
    { id: '1s2_2p_2P3_2', label: '1s²2p ²P°', sub: 'Resonance (1.85 eV)' },
    { id: '1s2_3s_2S1_2', label: '1s²3s ²S₁/₂', sub: 'Sharp (3.37 eV)' },
    { id: '1s2_3p_2P3_2', label: '1s²3p ²P°', sub: 'Principal (3.83 eV)' },
    { id: '1s2_3d_2D5_2', label: '1s²3d ²D', sub: 'Diffuse (3.88 eV)' },
    { id: '1s2_4s_2S1_2', label: '1s²4s ²S₁/₂', sub: '4s State (4.34 eV)' },
    { id: '1s2_4d_2D5_2', label: '1s²4d ²D', sub: '4d State (4.54 eV)' },
    { id: '1s2_4f_2F5_2', label: '1s²4f ²F°', sub: '4f State (4.54 eV)' },
  ]

  const isGround = currentLevel.id === '1s2_2s_2S1_2'

  return (
    <div className="quantum-controls glass-instrument" aria-label="Lithium Quantum Controls">
      <div className="quantum-header">
        <span className="quantum-title">LITHIUM QUANTUM DENSITY & DEFECT</span>
        <span className="provenance-tag">REDUCED DENSITY MODEL</span>
      </div>

      {/* State Selector Pills */}
      <div className="orbital-pill-selector">
        {quantumPills.map((pill) => (
          <button
            key={pill.id}
            className={`orbital-pill-btn ${pill.id === currentLevel.id ? 'active' : ''}`}
            onClick={() => setLithiumLevel(pill.id)}
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
            onClick={() => setLithiumDensityView('total')}
          >
            TOTAL DENSITY ρ(r)
          </button>
          <button
            className={`toggle-btn ${densityView === 'components' ? 'active' : ''}`}
            onClick={() => setLithiumDensityView('components')}
          >
            CORE / VALENCE COMPONENTS
          </button>
        </div>
      </div>

      {/* Quantum Parameters & Pauli Occupancy */}
      <div className="quantum-numbers-card">
        <div className="q-num-box">
          <span className="q-label">Configuration</span>
          <strong className="q-val">{currentLevel.configuration}</strong>
          <span className="q-sub">1s² core + valence</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Term Symbol</span>
          <strong className="q-val">{currentLevel.termSymbol}</strong>
          <span className="q-sub">Total J = {typeof currentLevel.J === 'number' ? (currentLevel.J === 0.5 ? '½' : currentLevel.J === 1.5 ? '3/2' : currentLevel.J === 2.5 ? '5/2' : '7/2') : currentLevel.J}</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Spin State (χ)</span>
          <strong className="q-val">1s↑ 1s↓ {currentLevel.configuration.replace('1s²', '')}↑</strong>
          <span className="q-sub">Doublet (S = ½)</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Excitation Energy</span>
          <strong className="q-val">{currentLevel.energyEv.toFixed(3)}</strong>
          <span className="q-sub">eV (NIST ASD)</span>
        </div>
      </div>

      {/* Core Penetration & Quantum Defect Card */}
      <div className="orbital-info-box">
        <div className="card-kicker-row">
          <strong className="info-title">
            {isGround ? 'Ground State Core Screening & Penetration' : `${currentLevel.termSymbol} Valence Quantum Defect`}
          </strong>
          <span className="provenance-tag">DERIVED MODEL QUANTITY</span>
        </div>

        <div className="defect-metrics-grid">
          <div className="defect-item">
            <span className="defect-label">Principal n</span>
            <strong className="defect-val">{currentLevel.n}</strong>
          </div>
          <div className="defect-item">
            <span className="defect-label">Effective n*</span>
            <strong className="defect-val scientific-number">{effectiveN.toFixed(4)}</strong>
          </div>
          <div className="defect-item highlight">
            <span className="defect-label">Quantum Defect (δ_l)</span>
            <strong className="defect-val scientific-number">{quantumDefect.toFixed(4)}</strong>
          </div>
        </div>

        <div className="info-math-detail">
          <p className="info-desc">
            The quantum defect <Equation>{`\\delta_l = n - n^*`}</Equation> quantifies the deviation from an ideal Hydrogenic atom caused by core penetration and incomplete screening:
          </p>
          <div className="spin-formula-box">
            <Equation block>{`n^* = \\sqrt{\\frac{R_\\infty}{T_\\infty - T_n}},\\quad \\delta_l = n - n^*`}</Equation>
          </div>
          <p className="info-subtext">
            • <strong>s orbitals (l=0)</strong> penetrate the 1s² core deeply, seeing higher nuclear charge (<Equation>{`\\delta \\approx 0.41`}</Equation>).
            <br />
            • <strong>d, f orbitals (l≥2)</strong> remain outside the core (<Equation>{`\\delta \\to 0`}</Equation>) and behave nearly hydrogenically.
          </p>
        </div>
      </div>

      {/* Reduced Density Disclaimer */}
      <div className="quantum-scientific-note">
        <span className="note-badge">REDUCED DENSITY APPROXIMATION</span>
        <p className="note-text">
          The full three-electron wavefunction depends on <strong>nine spatial coordinates</strong> <Equation>{`\\Psi(\\mathbf{r}_1, \\mathbf{r}_2, \\mathbf{r}_3)`}</Equation>.
          This instrument visualizes a reduced one-electron density <Equation>{`\\rho(\\mathbf{r}) = 2\\rho_{1\\text{s}}(\\mathbf{r}) + \\rho_{\\text{valence}}(\\mathbf{r})`}</Equation> using approximate visual model parameters (variational core Z<sub>core</sub> = Z - 5/16 = {LITHIUM_CORE_ZEFF}, valence Z<sub>2s</sub> = {LITHIUM_VALENCE_2S_ZEFF}).
          Visual model parameters are used solely for 3D density rendering and are strictly decoupled from NIST ASD energy eigenvalues.
        </p>
      </div>
    </div>
  )
}

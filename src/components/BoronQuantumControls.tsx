import { useQuantaStore } from '../state/quantaStore'
import {
  getBoronLevel,
  BORON_VISUAL_CORE_ZEFF,
  BORON_VALENCE_2S_ZEFF,
  BORON_VALENCE_2P_ZEFF,
  boronElectronPairCount,
} from '../physics/boron'
import { Equation } from './Equation'

export function BoronQuantumControls() {
  const selectedLevelId = useQuantaStore((s) => s.boron.selectedLevelId)
  const densityView = useQuantaStore((s) => s.boron.densityView)
  const setBoronLevel = useQuantaStore((s) => s.setBoronLevel)
  const setBoronDensityView = useQuantaStore((s) => s.setBoronDensityView)

  const currentLevel = getBoronLevel(selectedLevelId) ?? getBoronLevel('2p_2P1_2')!

  const quantumPills: { id: string; label: string; sub: string }[] = [
    { id: '2p_2P1_2', label: '2s²2p ²P°₁/₂', sub: 'Ground (0.00 eV)' },
    { id: '2p_2P3_2', label: '2s²2p ²P°₃/₂', sub: 'Ground fine structure' },
    { id: '3s_2S1_2', label: '2s²3s ²S₁/₂', sub: 'UV Multiplet Partner' },
    { id: '2p2_2D5_2', label: '2s2p² ²D₅/₂', sub: 'Two electrons in n=2' },
    { id: '3d_2D3_2', label: '2s²3d ²D₃/₂', sub: 'Deep-UV Rydberg-like' },
    { id: '4f_2F', label: '2s²4f ²F°', sub: 'High-L grouped state' },
  ]

  const isGround = currentLevel.id === '2p_2P1_2'

  return (
    <div className="quantum-controls glass-instrument" aria-label="Boron Quantum Controls">
      <div className="quantum-header">
        <span className="quantum-title">BORON QUANTUM REDUCED DENSITY</span>
        <span className="provenance-tag">REDUCED DENSITY MODEL</span>
      </div>

      <div className="orbital-pill-selector">
        {quantumPills.map((pill) => (
          <button
            key={pill.id}
            className={`orbital-pill-btn ${pill.id === currentLevel.id ? 'active' : ''}`}
            onClick={() => setBoronLevel(pill.id)}
          >
            <span className="pill-name">{pill.label}</span>
            <span className="pill-sub">{pill.sub}</span>
          </button>
        ))}
      </div>

      <div className="density-toggle-group">
        <span className="toggle-group-label">VISUALIZATION VIEW:</span>
        <div className="toggle-buttons">
          <button className={`toggle-btn ${densityView === 'total' ? 'active' : ''}`} onClick={() => setBoronDensityView('total')}>
            TOTAL DENSITY ρ(r)
          </button>
          <button className={`toggle-btn ${densityView === 'components' ? 'active' : ''}`} onClick={() => setBoronDensityView('components')}>
            CORE / VALENCE COMPONENTS
          </button>
        </div>
      </div>

      <div className="quantum-numbers-card">
        <div className="q-num-box">
          <span className="q-label">Configuration</span>
          <strong className="q-val">{currentLevel.configuration}</strong>
          <span className="q-sub">Doublet (S = ½)</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Term Symbol</span>
          <strong className="q-val">{currentLevel.termSymbol}</strong>
          <span className="q-sub">J = {currentLevel.J}</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Orbital Angular Momentum</span>
          <strong className="q-val">L = {currentLevel.L}</strong>
          <span className="q-sub">{currentLevel.parity === 'odd' ? 'Odd parity' : 'Even parity'}</span>
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
            {isGround ? 'Pauli Exclusion & Open 2p Ground Subshell' : `${currentLevel.termSymbol} Excited-State Occupancy`}
          </strong>
          <span className="provenance-tag">DERIVED MODEL QUANTITY</span>
        </div>

        {isGround ? (
          <div className="info-math-detail">
            <p className="info-desc">
              Ground-state spin-orbital occupancy (one valid choice of the single 2p electron's
              magnetic quantum number): <code>1s↑ 1s↓ 2s↑ 2s↓ 2p(n=2, l=1, mₗ=−1, mₛ=+½)</code>. Unlike
              Beryllium's filled, spherically-symmetric 2s², Boron's fifth electron occupies an{' '}
              <strong>open p subshell</strong> — the ground-state density carries a genuine directional
              lobe, not a spherically-symmetric shape.
            </p>
            <div className="spin-formula-box">
              <Equation block>{`\\Psi_{\\text{ground}} \\ne \\text{spherically symmetric} \\quad (\\ell = 1 \\text{ valence electron})`}</Equation>
            </div>
          </div>
        ) : (
          <p className="info-desc">
            In this excited configuration, the valence electron(s) occupy a different subshell than the
            ground 2p. <strong>TERM STRUCTURE IS NOT FULLY ENCODED BY A SINGLE 3D ORBITAL SHAPE</strong> —
            the diagrams shown here visualize a reduced one-electron density, not the exact many-electron
            wavefunction.
          </p>
        )}
      </div>

      <div className="quantum-scientific-note">
        <span className="note-badge">REDUCED DENSITY APPROXIMATION</span>
        <p className="note-text">
          The full five-electron wavefunction depends on <strong>fifteen spatial coordinates</strong>{' '}
          <Equation>{`\\Psi(\\mathbf{r}_1, \\ldots, \\mathbf{r}_5)`}</Equation> and contains{' '}
          {boronElectronPairCount()} unique electron-electron pair terms. This instrument visualizes a{' '}
          REDUCED ONE-ELECTRON DENSITY{' '}
          <Equation>{`\\rho(\\mathbf{r}) = 2\\rho_{1\\text{s}}(\\mathbf{r}) + 2\\rho_{2\\text{s}}(\\mathbf{r}) + \\rho_{2\\text{p}}(\\mathbf{r})`}</Equation>{' '}
          using APPROXIMATE EFFECTIVE CHARGES derived via Slater's Rules (Z<sub>core</sub> ={' '}
          {BORON_VISUAL_CORE_ZEFF}, Z<sub>2s</sub> = {BORON_VALENCE_2S_ZEFF}, Z<sub>2p</sub> ={' '}
          {BORON_VALENCE_2P_ZEFF}). The 2p contribution carries real single-lobe directional angular
          dependence. This VISUAL MODEL PARAMETER set is used solely for 3D density rendering and is
          strictly decoupled from NIST ASD energy eigenvalues.
        </p>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { ORBITALS, UI_ORBITALS, type UiOrbitalKey } from '../physics/quantum'
import { hydrogenEnergy } from '../physics/hydrogen'
import {
  ORBITAL_ORIENTATIONS,
  FAMILY_ORIENTATIONS,
  FAMILY_TO_L,
  getOrbitalMetadata,
  type OrbitalFamily,
  type RealOrientationKey,
} from '../physics/orbitals'
import { RadialProbabilityPlot } from './science/RadialProbabilityPlot'
import { Equation } from './Equation'

const FAMILIES: OrbitalFamily[] = ['s', 'p', 'd', 'f']

export function QuantumControls() {
  const level = useQuantaStore((s) => s.level)
  const orbital = useQuantaStore((s) => s.orbital)
  const setOrbital = useQuantaStore((s) => s.setOrbital)
  const setMode = useQuantaStore((s) => s.setMode)
  const orbitalSelection = useQuantaStore((s) => s.orbitalSelection)
  const setOrbitalSelection = useQuantaStore((s) => s.setOrbitalSelection)

  const currentFamily = orbitalSelection.family
  const currentL = FAMILY_TO_L[currentFamily]
  const currentN = Math.max(currentL + 1, orbitalSelection.n)
  const currentOrientation = orbitalSelection.orientation
  const slicePlane = orbitalSelection.slicePlane
  const viewMode = orbitalSelection.viewMode

  const currentEnergy = hydrogenEnergy(currentN)

  // Valid shells for the selected family: n > l (up to n = 6 for Hydrogen)
  const availableShells = useMemo(() => {
    const list: number[] = []
    for (let n = currentL + 1; n <= 6; n++) {
      list.push(n)
    }
    return list
  }, [currentL])

  // Get full scientific metadata for Hydrogen (Z = 1, exact analytic tier)
  const metadata = useMemo(() => {
    return getOrbitalMetadata(1, currentN, currentOrientation)
  }, [currentN, currentOrientation])

  const handleFamilyChange = (fam: OrbitalFamily) => {
    const minN = FAMILY_TO_L[fam] + 1
    const nextN = currentN < minN ? minN : currentN
    const defaultOrient = FAMILY_ORIENTATIONS[fam][0]
    setOrbitalSelection({
      family: fam,
      n: nextN,
      orientation: defaultOrient,
    })
  }

  const handleShellChange = (n: number) => {
    setOrbitalSelection({ n })
  }

  const handleOrientationChange = (orient: RealOrientationKey) => {
    setOrbitalSelection({ orientation: orient })
  }

  return (
    <div className="quantum-controls glass-instrument" aria-label="Quantum State Controls">
      <div className="quantum-header">
        <span className="quantum-title">HYDROGENIC ORBITALS</span>
        <span className="quantum-tag">EXACT SCHRÖDINGER EIGENSTATES</span>
      </div>

      {/* Quick Preset Orbital Pills (Hydrogen Benchmark) */}
      <div className="orbital-pill-selector">
        {UI_ORBITALS.map((orb) => {
          const isActive = orbital === orb
          return (
            <button
              key={orb}
              className={`orbital-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => setOrbital(orb)}
            >
              <span className="pill-name">{orb}</span>
              <span className="pill-sub">
                {orb === '1s' ? 'Ground' : orb === '2s' ? 'Radial Node' : 'Planar Node'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Quick High-Shell Jumps (3d, 4f) */}
      <div className="high-shell-jumps-row">
        <button
          className={`quick-jump-btn ${currentN === 3 && currentFamily === 'd' ? 'active' : ''}`}
          onClick={() => {
            setOrbitalSelection({ n: 3, family: 'd', orientation: 'dz2' })
          }}
        >
          3d (d_z² Quadrupole)
        </button>
        <button
          className={`quick-jump-btn ${currentN === 4 && currentFamily === 'f' ? 'active' : ''}`}
          onClick={() => {
            setOrbitalSelection({ n: 4, family: 'f', orientation: 'fz3' })
          }}
        >
          4f (f_z³ Octupole)
        </button>
      </div>

      {/* State Preserved Banner if transitioned from higher Bohr level */}
      {orbital === null && (
        <div className="preserved-state-banner">
          <span className="preserved-dot" />
          <span>
            Bohr level <strong>n = {level}</strong> preserved (E_{level} = {hydrogenEnergy(level).toFixed(3)} eV).
            Exploring n = {currentN} quantum eigenstates.
          </span>
        </div>
      )}

      {/* Orbital Family Selector (s, p, d, f) */}
      <div className="orbital-family-section">
        <span className="section-label">ORBITAL FAMILY (AZIMUTHAL QUANTUM NUMBER ℓ)</span>
        <div className="family-pill-selector">
          {FAMILIES.map((fam) => {
            const l = FAMILY_TO_L[fam]
            const isActive = fam === currentFamily
            return (
              <button
                key={fam}
                className={`family-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleFamilyChange(fam)}
              >
                <span className="pill-name">{fam}</span>
                <span className="pill-sub">ℓ = {l}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Principal Shell Selector (n) */}
      <div className="quantum-shell-section">
        <div className="section-label-row">
          <span className="section-label">PRINCIPAL QUANTUM SHELL (n)</span>
          <span className="shell-constraint">Allowed: n &gt; ℓ (n ≥ {currentL + 1})</span>
        </div>
        <div className="shell-pill-selector">
          {availableShells.map((n) => (
            <button
              key={n}
              className={`shell-pill-btn ${n === currentN ? 'active' : ''}`}
              onClick={() => handleShellChange(n)}
            >
              n = {n}
            </button>
          ))}
        </div>
      </div>

      {/* Real Basis Orientations Grid */}
      <div className="quantum-orientations-section">
        <span className="section-label">
          REAL BASIS ORIENTATION ({FAMILY_ORIENTATIONS[currentFamily].length} STATES)
        </span>
        <div className="orientation-pills-grid">
          {FAMILY_ORIENTATIONS[currentFamily].map((orientKey) => {
            const info = ORBITAL_ORIENTATIONS[orientKey]
            const isActive = orientKey === currentOrientation
            return (
              <button
                key={orientKey}
                className={`orient-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleOrientationChange(orientKey)}
                title={`${info.formula} — ${info.angularNodesDesc}`}
              >
                <span className="orient-label">{info.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* View Mode & Cross-Section Slice Controls */}
      <div className="view-mode-controls-grid">
        <div className="view-mode-group">
          <span className="section-label">VIEW RENDERING MODE</span>
          <div className="segmented-control">
            <button
              className={`segment-btn ${viewMode === 'phase' ? 'active' : ''}`}
              onClick={() => setOrbitalSelection({ viewMode: 'phase' })}
            >
              Signed Phase (ψ)
            </button>
            <button
              className={`segment-btn ${viewMode === 'density' ? 'active' : ''}`}
              onClick={() => setOrbitalSelection({ viewMode: 'density' })}
            >
              Density (|ψ|²)
            </button>
          </div>
        </div>

        <div className="slice-plane-group">
          <span className="section-label">CROSS-SECTION SLICE</span>
          <div className="segmented-control">
            <button
              className={`segment-btn ${slicePlane === 'none' ? 'active' : ''}`}
              onClick={() => setOrbitalSelection({ slicePlane: 'none' })}
            >
              3D Vol
            </button>
            <button
              className={`segment-btn ${slicePlane === 'xy' ? 'active' : ''}`}
              onClick={() => setOrbitalSelection({ slicePlane: 'xy' })}
              title="Slice along XY plane (z = 0)"
            >
              XY
            </button>
            <button
              className={`segment-btn ${slicePlane === 'xz' ? 'active' : ''}`}
              onClick={() => setOrbitalSelection({ slicePlane: 'xz' })}
              title="Slice along XZ plane (y = 0)"
            >
              XZ
            </button>
            <button
              className={`segment-btn ${slicePlane === 'yz' ? 'active' : ''}`}
              onClick={() => setOrbitalSelection({ slicePlane: 'yz' })}
              title="Slice along YZ plane (x = 0)"
            >
              YZ
            </button>
          </div>
        </div>
      </div>

      {/* Wavefunction Phase Legend & Scientific Callout */}
      <div className="phase-legend-card">
        {viewMode === 'phase' ? (
          <>
            <div className="phase-swatches-row">
              <div className="phase-swatch-item">
                <span className="phase-dot pos-phase" />
                <span className="phase-text">ψ &gt; 0 (Positive Algebraic Phase)</span>
              </div>
              <div className="phase-swatch-item">
                <span className="phase-dot neg-phase" />
                <span className="phase-text">ψ &lt; 0 (Negative Algebraic Phase)</span>
              </div>
            </div>
            <p className="phase-pedagogy-note">
              <strong>Critical distinction:</strong> Phase colors represent opposite algebraic signs
              of the mathematical wavefunction ψ(r,θ,φ), <em>not positive and negative electrical charges</em>.
            </p>
          </>
        ) : (
          <div className="density-legend-row">
            <span className="density-gradient-bar" />
            <div className="density-labels">
              <span>0 (Nodal Surface)</span>
              <span>|ψ|²_max (Maximum Probability)</span>
            </div>
          </div>
        )}
      </div>

      {/* Radial Probability Curve SVG Mini-Chart */}
      <RadialProbabilityPlot
        n={currentN}
        l={currentL}
        zEffective={1.0}
        rPeak={metadata.rPeakBoher}
        radialNodes={metadata.radialNodes}
      />

      {/* Quantum Numbers & Energy Grid */}
      <div className="quantum-numbers-card" style={{ marginTop: '0.8rem' }}>
        <div className="q-num-box">
          <span className="q-label">Radial Nodes</span>
          <strong className="q-val">{metadata.radialNodes}</strong>
          <span className="q-sub">n − ℓ − 1</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Angular Nodes</span>
          <strong className="q-val">{metadata.angularNodes}</strong>
          <span className="q-sub">ℓ</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Total Nodes</span>
          <strong className="q-val">{metadata.totalNodes}</strong>
          <span className="q-sub">n − 1</span>
        </div>
        <div className="q-num-box">
          <span className="q-label">Binding Eₙ</span>
          <strong className="q-val">{currentEnergy.toFixed(3)}</strong>
          <span className="q-sub">eV</span>
        </div>
      </div>

      {/* Orbital Structural Details */}
      <div className="orbital-info-box">
        <strong className="info-title">
          {currentN}
          {metadata.orientationInfo.label} Symmetry &amp; Nodal Surfaces
        </strong>
        <p className="info-desc">{metadata.orientationInfo.angularNodesDesc}</p>
        {metadata.orientationInfo.mEquivalent && (
          <p className="info-sub-desc">
            <em>Spherical harmonic relationship:</em> {metadata.orientationInfo.mEquivalent}
          </p>
        )}
      </div>

      {/* Live KaTeX Formula */}
      <div className="orbital-equation-box">
        <span className="equation-label">EXACT HYDROGENIC EIGENSTATE</span>
        <Equation block={true}>
          {`\\psi_{${currentN}${currentFamily}}(r, \\theta, \\phi) = R_{${currentN},${currentL}}(r) \\cdot Y_{${metadata.orientationInfo.label}}(\\theta, \\phi)`}
        </Equation>
      </div>

      {/* Return to Bohr / Quick Actions */}
      <div className="quantum-quick-actions-row">
        <button className="unsupported-btn secondary" onClick={() => setMode('bohr')}>
          RETURN TO BOHR (n = {level})
        </button>
      </div>

      <div className="quantum-scientific-note">
        <span>
          Hydrogenic spatial density field sampled from the exact analytical Schrödinger solution{' '}
          <code>|ψ(r,θ,φ)|²</code>. Points represent quantum probability amplitude, not classical planetary orbits.
        </span>
      </div>
    </div>
  )
}

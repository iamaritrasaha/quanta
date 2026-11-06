import { useMemo } from 'react'
import type { Element } from '../../data/elements'
import { getAtomicProperties } from '../../data/atomicData'
import { getElementProfile } from '../../data/elementProfiles'
import { calculateSlaterScreening, parseConfiguration } from '../../physics/slater'
import { groundModel } from '../../physics/elementModel'
import { useQuantaStore } from '../../state/quantaStore'
import {
  ORBITAL_ORIENTATIONS,
  FAMILY_ORIENTATIONS,
  FAMILY_TO_L,
  getOrbitalMetadata,
  type OrbitalFamily,
  type RealOrientationKey,
} from '../../physics/orbitals'
import { RadialProbabilityPlot } from './RadialProbabilityPlot'
import { Equation } from '../Equation'

interface UniversalQuantumControlsProps {
  element: Element
}

const FAMILIES: OrbitalFamily[] = ['s', 'p', 'd', 'f']

export function UniversalQuantumControls({ element }: UniversalQuantumControlsProps) {
  const selectedState = useQuantaStore((s) => s.sharedElement.selected)
  const selected = selectedState ?? groundModel(element.symbol)
  const properties = getAtomicProperties(element.symbol)
  const profile = getElementProfile(element.symbol)

  const config = properties?.electronConfiguration ?? selected.configuration
  const subshells = parseConfiguration(config)
  const slater = calculateSlaterScreening(element.number, config)

  const orbitalSelection = useQuantaStore((s) => s.orbitalSelection)
  const setOrbitalSelection = useQuantaStore((s) => s.setOrbitalSelection)

  const currentFamily = orbitalSelection.family
  const currentL = FAMILY_TO_L[currentFamily]
  const currentN = Math.max(currentL + 1, orbitalSelection.n)
  const currentOrientation = orbitalSelection.orientation
  const slicePlane = orbitalSelection.slicePlane
  const viewMode = orbitalSelection.viewMode
  const displayType = orbitalSelection.displayType

  // Valid shells for the selected family: n > l (e.g., s: 1-7, p: 2-7, d: 3-7, f: 4-7)
  const availableShells = useMemo(() => {
    const list: number[] = []
    for (let n = currentL + 1; n <= 7; n++) {
      list.push(n)
    }
    return list
  }, [currentL])

  // Get full metadata for active orbital
  const metadata = useMemo(() => {
    return getOrbitalMetadata(element.number, currentN, currentOrientation, config)
  }, [element.number, currentN, currentOrientation, config])

  // Subshell totals for total density view
  const sCount = subshells.filter((s) => s.l === 's').reduce((sum, s) => sum + s.count, 0)
  const pCount = subshells.filter((s) => s.l === 'p').reduce((sum, s) => sum + s.count, 0)
  const dCount = subshells.filter((s) => s.l === 'd').reduce((sum, s) => sum + s.count, 0)
  const fCount = subshells.filter((s) => s.l === 'f').reduce((sum, s) => sum + s.count, 0)

  const modelTierTitle =
    profile.modelTier === 'tierD'
      ? 'TIER D: RELATIVISTIC APPROXIMATION & SCREENING'
      : 'TIER C: SCREENED HYDROGENIC ORBITALS (SLATER Z_EFF)'

  // Handle changing family
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

  // Handle changing shell n
  const handleShellChange = (n: number) => {
    setOrbitalSelection({ n })
  }

  // Handle changing orientation
  const handleOrientationChange = (orient: RealOrientationKey) => {
    setOrbitalSelection({ orientation: orient })
  }

  return (
    <div className="quantum-pane" aria-label={`${element.name} Quantum Controls`}>
      <div className="quantum-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">QUANTUM ORBITAL ENGINE</span>
          <span className="provenance-tag">{modelTierTitle}</span>
        </div>

        <h3 className="card-title">{element.name} Quantum Architecture</h3>

        <p className="card-desc">
          For multi-electron atoms ({element.symbol}, Z = {element.number}), exact closed-form analytic
          solutions do not exist due to e⁻–e⁻ Coulomb repulsion. QUANTA evaluates exact hydrogenic angular
          harmonics coupled to Slater-screened radial functions (Z_eff = +{metadata.zEffective.toFixed(2)}).
        </p>

        {/* Display Type Switcher */}
        <div className="quantum-display-toggle-row">
          <button
            className={`display-toggle-btn ${displayType === 'orbital' ? 'active' : ''}`}
            onClick={() => setOrbitalSelection({ displayType: 'orbital' })}
          >
            Individual Orbital (s/p/d/f)
          </button>
          <button
            className={`display-toggle-btn ${displayType === 'totalShell' ? 'active' : ''}`}
            onClick={() => setOrbitalSelection({ displayType: 'totalShell' })}
          >
            Total Shell Density (Schematic)
          </button>
        </div>

        {displayType === 'orbital' ? (
          <>
            {/* Orbital Family Tabs (s, p, d, f) */}
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

            {/* Real Orbital Orientations Grid */}
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

            {/* Ground State Occupancy Status */}
            <div className="occupancy-status-bar">
              {metadata.isGroundOccupied ? (
                <div className="occupancy-badge occupied">
                  <span className="badge-dot" />
                  <strong>Ground-State Occupied:</strong> {currentN}
                  {currentFamily} contains {metadata.groundOccupancy} of {metadata.capacity} electrons in {element.name}.
                </div>
              ) : (
                <div className="occupancy-badge virtual">
                  <span className="badge-dot" />
                  <strong>Unoccupied in Ground State:</strong> Excited / virtual orbital for educational exploration.
                </div>
              )}
            </div>

            {/* Visualization Mode & Slice Plane Controls */}
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
                    The electron possesses a negative charge across all regions.
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

            {/* Radial Probability Density Curve SVG Mini-Chart */}
            <RadialProbabilityPlot
              n={currentN}
              l={currentL}
              zEffective={metadata.zEffective}
              rPeak={metadata.rPeakBoher}
              radialNodes={metadata.radialNodes}
            />

            {/* Nodal Structure & Quantum Numbers Grid */}
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
                <span className="q-label">Screened Z_eff</span>
                <strong className="q-val">+{metadata.zEffective.toFixed(2)}</strong>
                <span className="q-sub">Effective charge</span>
              </div>
            </div>

            {/* Angular Geometry Description */}
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
              <span className="equation-label">ORBITAL WAVEFUNCTION FORMULATION</span>
              <Equation block={true}>
                {`\\psi_{${currentN}${currentFamily}}(r, \\theta, \\phi) = R_{${currentN},${currentL}}(r; Z_{\\text{eff}}) \\cdot Y_{${metadata.orientationInfo.label}}(\\theta, \\phi)`}
              </Equation>
            </div>
          </>
        ) : (
          <>
            {/* Total Multi-Electron Cloud Metrics (Slater Screening) */}
            <div className="quantum-params-grid" style={{ marginBottom: '1rem', marginTop: '0.8rem' }}>
              <div className="param-item">
                <span className="param-title">Atomic Number (Z)</span>
                <strong className="param-val">{element.number}</strong>
                <span className="param-sub">Nuclear charge</span>
              </div>
              <div className="param-item">
                <span className="param-title">Screening (σ)</span>
                <strong className="param-val">{slater.screeningConstant.toFixed(2)}</strong>
                <span className="param-sub">Slater core shielding</span>
              </div>
              <div className="param-item">
                <span className="param-title">Effective Z (Z_eff)</span>
                <strong className="param-val" style={{ color: 'var(--accent-optic)' }}>
                  +{slater.zEffective.toFixed(2)}
                </strong>
                <span className="param-sub">Valence attraction</span>
              </div>
              <div className="param-item">
                <span className="param-title">Valence Group</span>
                <strong className="param-val">{slater.targetSubshell}</strong>
                <span className="param-sub">Outer electron group</span>
              </div>
            </div>

            {/* Subshell Population Table */}
            <div className="data-table" style={{ marginBottom: '1rem' }}>
              <div className="data-row">
                <span className="data-key">s-subshells (ℓ = 0)</span>
                <strong className="data-val">{sCount} electrons</strong>
              </div>
              <div className="data-row">
                <span className="data-key">p-subshells (ℓ = 1)</span>
                <strong className="data-val">{pCount} electrons</strong>
              </div>
              {dCount > 0 && (
                <div className="data-row">
                  <span className="data-key">d-subshells (ℓ = 2)</span>
                  <strong className="data-val">{dCount} electrons</strong>
                </div>
              )}
              {fCount > 0 && (
                <div className="data-row">
                  <span className="data-key">f-subshells (ℓ = 3)</span>
                  <strong className="data-val">{fCount} electrons</strong>
                </div>
              )}
              <div className="data-row">
                <span className="data-key">Ground Term Coupling</span>
                <strong className="data-val">{profile.groundTerm}</strong>
              </div>
            </div>

            {/* Quantum Principles Note */}
            <div className="atomic-model-note">
              <strong>Pauli Exclusion &amp; Hund's Rule:</strong> No two electrons can share all four
              quantum numbers (n, ℓ, m_ℓ, m_s). In degenerate subshells, electrons occupy separate
              orbitals with parallel spins to maximize exchange stability and minimize inter-electron
              repulsion.
            </div>
          </>
        )}
      </div>
    </div>
  )
}

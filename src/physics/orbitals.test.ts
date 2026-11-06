import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import {
  ORBITAL_ORIENTATIONS,
  FAMILY_ORIENTATIONS,
  FAMILY_CAPACITY,
  evaluateRealSphericalHarmonic,
  evaluateAssociatedLaguerre,
  evaluateRadialWavefunction,
  evaluateRadialProbability,
  evaluateOrbitalWavefunction,
  getOrbitalMetadata,
  sampleOrbitalField,
  getOrbitalZeff,
  findRadialNodes,
  findRadialMaxima,
  getMaxRadialWavefunctionDensity,
  getMaxSpatialDensity,
  computeSliceRejectionEnvelope,
  goldenSectionMax,
  type RealOrientationKey,
  type OrbitalFamily,
} from './orbitals'

describe('QUANTA V4: Quantum Orbital Physics Engine', () => {
  describe('1. Orbital Basis & Orientation Completeness', () => {
    it('defines exactly 16 distinct real orbital basis functions across s, p, d, f', () => {
      const allKeys = Object.keys(ORBITAL_ORIENTATIONS)
      expect(allKeys.length).toBe(16)
    })

    it('contains exactly 1 s, 3 p, 5 d, and 7 f orientations', () => {
      expect(FAMILY_ORIENTATIONS.s).toEqual(['s'])
      expect(FAMILY_ORIENTATIONS.p).toEqual(['pz', 'px', 'py'])
      expect(FAMILY_ORIENTATIONS.d).toEqual(['dz2', 'dxz', 'dyz', 'dxy', 'dx2-y2'])
      expect(FAMILY_ORIENTATIONS.f).toEqual([
        'fz3',
        'fxz2',
        'fyz2',
        'fxyz',
        'fz(x2-y2)',
        'fx(x2-3y2)',
        'fy(3x2-y2)',
      ])
    })

    it('specifies correct electron capacities for all orbital families', () => {
      expect(FAMILY_CAPACITY.s).toBe(2)
      expect(FAMILY_CAPACITY.p).toBe(6)
      expect(FAMILY_CAPACITY.d).toBe(10)
      expect(FAMILY_CAPACITY.f).toBe(14)
    })
  })

  describe('2. Real Spherical Harmonics & Angular Geometries', () => {
    it('s-orbital has spherical symmetry (independent of direction)', () => {
      const val1 = evaluateRealSphericalHarmonic('s', 1, 0, 0)
      const val2 = evaluateRealSphericalHarmonic('s', 0, 1, 0)
      const val3 = evaluateRealSphericalHarmonic('s', 0, 0, 1)
      const val4 = evaluateRealSphericalHarmonic('s', 1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3))

      expect(val1).toBeCloseTo(0.28209, 4)
      expect(val2).toBeCloseTo(val1, 5)
      expect(val3).toBeCloseTo(val1, 5)
      expect(val4).toBeCloseTo(val1, 5)
    })

    it('p-orbitals exhibit exact orthogonal nodal planes and opposite phase lobes', () => {
      // pz: node at z = 0
      expect(evaluateRealSphericalHarmonic('pz', 1, 0, 0)).toBe(0)
      expect(evaluateRealSphericalHarmonic('pz', 0, 1, 0)).toBe(0)
      expect(evaluateRealSphericalHarmonic('pz', 0, 0, 1)).toBeGreaterThan(0) // North lobe (+ phase)
      expect(evaluateRealSphericalHarmonic('pz', 0, 0, -1)).toBeLessThan(0) // South lobe (- phase)

      // px: node at x = 0
      expect(evaluateRealSphericalHarmonic('px', 0, 1, 0)).toBe(0)
      expect(evaluateRealSphericalHarmonic('px', 0, 0, 1)).toBe(0)
      expect(evaluateRealSphericalHarmonic('px', 1, 0, 0)).toBeGreaterThan(0)
      expect(evaluateRealSphericalHarmonic('px', -1, 0, 0)).toBeLessThan(0)

      // py: node at y = 0
      expect(evaluateRealSphericalHarmonic('py', 1, 0, 0)).toBe(0)
      expect(evaluateRealSphericalHarmonic('py', 0, 0, 1)).toBe(0)
      expect(evaluateRealSphericalHarmonic('py', 0, 1, 0)).toBeGreaterThan(0)
      expect(evaluateRealSphericalHarmonic('py', 0, -1, 0)).toBeLessThan(0)
    })

    it('dz² orbital exhibits two conical nodal surfaces and positive z-lobes with negative donut ring', () => {
      // Poles: 3(1)² - 1 = 2 > 0 (positive phase lobes along z-axis)
      const pole = evaluateRealSphericalHarmonic('dz2', 0, 0, 1)
      expect(pole).toBeGreaterThan(0)

      // Equator (z = 0, x = 1, y = 0): 3(0) - 1 = -1 < 0 (negative phase ring)
      const equator = evaluateRealSphericalHarmonic('dz2', 1, 0, 0)
      expect(equator).toBeLessThan(0)

      // Conical node: cos²θ = 1/3 => uz = 1/√3, ux = √(2/3)
      const uzNode = 1 / Math.sqrt(3)
      const uxNode = Math.sqrt(2 / 3)
      const atNode = evaluateRealSphericalHarmonic('dz2', uxNode, 0, uzNode)
      expect(Math.abs(atNode)).toBeLessThan(1e-7)
    })

    it('dxy, dxz, dyz have correct mutually orthogonal cloverleaf geometries', () => {
      // dxy: zero on x=0 and y=0 planes, maximum along x=y diagonal in xy plane
      expect(evaluateRealSphericalHarmonic('dxy', 0, 1, 0)).toBe(0)
      expect(evaluateRealSphericalHarmonic('dxy', 1, 0, 0)).toBe(0)
      const diag1 = evaluateRealSphericalHarmonic('dxy', 1 / Math.sqrt(2), 1 / Math.sqrt(2), 0)
      const diag2 = evaluateRealSphericalHarmonic('dxy', -1 / Math.sqrt(2), 1 / Math.sqrt(2), 0)
      expect(diag1).toBeGreaterThan(0)
      expect(diag2).toBeLessThan(0)
      expect(diag1).toBeCloseTo(-diag2, 5)

      // dxz: zero on x=0 and z=0 planes
      expect(evaluateRealSphericalHarmonic('dxz', 0, 1, 1)).toBe(0)
      expect(evaluateRealSphericalHarmonic('dxz', 1, 1, 0)).toBe(0)

      // dyz: zero on y=0 and z=0 planes
      expect(evaluateRealSphericalHarmonic('dyz', 1, 0, 1)).toBe(0)
      expect(evaluateRealSphericalHarmonic('dyz', 1, 1, 0)).toBe(0)
    })

    it('fxyz orbital exhibits 8 alternating octants separated by 3 coordinate nodal planes', () => {
      // Coordinate planes x=0, y=0, z=0 are nodes
      expect(evaluateRealSphericalHarmonic('fxyz', 0, 1, 1)).toBe(0)
      expect(evaluateRealSphericalHarmonic('fxyz', 1, 0, 1)).toBe(0)
      expect(evaluateRealSphericalHarmonic('fxyz', 1, 1, 0)).toBe(0)

      const u = 1 / Math.sqrt(3)
      // (+, +, +) octant: positive phase
      expect(evaluateRealSphericalHarmonic('fxyz', u, u, u)).toBeGreaterThan(0)
      // (-, +, +) octant: negative phase
      expect(evaluateRealSphericalHarmonic('fxyz', -u, u, u)).toBeLessThan(0)
      // (-, -, +) octant: positive phase
      expect(evaluateRealSphericalHarmonic('fxyz', -u, -u, u)).toBeGreaterThan(0)
      // (-, -, -) octant: negative phase
      expect(evaluateRealSphericalHarmonic('fxyz', -u, -u, -u)).toBeLessThan(0)
    })

    it('fz³ orbital exhibits equatorial node and conical nodal surfaces', () => {
      // Equatorial plane z = 0 is a nodal plane
      expect(evaluateRealSphericalHarmonic('fz3', 1, 0, 0)).toBe(0)
      expect(evaluateRealSphericalHarmonic('fz3', 0, 1, 0)).toBe(0)

      // Polar lobes: positive at north, negative at south
      expect(evaluateRealSphericalHarmonic('fz3', 0, 0, 1)).toBeGreaterThan(0)
      expect(evaluateRealSphericalHarmonic('fz3', 0, 0, -1)).toBeLessThan(0)

      // Conical node at cos θ = ±√(3/5)
      const uzNode = Math.sqrt(3 / 5)
      const uxNode = Math.sqrt(2 / 5)
      expect(Math.abs(evaluateRealSphericalHarmonic('fz3', uxNode, 0, uzNode))).toBeLessThan(1e-7)
    })
  })

  describe('3. Radial Wavefunctions & Laguerre Recurrence', () => {
    it('computes generalized Laguerre polynomials correctly', () => {
      // L_0^alpha(x) = 1
      expect(evaluateAssociatedLaguerre(0, 1, 2.5)).toBe(1.0)
      expect(evaluateAssociatedLaguerre(0, 3, 5.0)).toBe(1.0)

      // L_1^alpha(x) = 1 + alpha - x
      expect(evaluateAssociatedLaguerre(1, 1, 2.0)).toBeCloseTo(1 + 1 - 2.0, 6)
      expect(evaluateAssociatedLaguerre(1, 3, 1.5)).toBeCloseTo(1 + 3 - 1.5, 6)

      // L_2^alpha(x) = 0.5 * [(x - alpha - 2)(x - alpha - 1) - (alpha + 1)] = 0.5*(x² - 2(alpha+2)x + (alpha+1)(alpha+2))
      const alpha = 2
      const x = 3.0
      const expectedL2 = 0.5 * (x * x - 2 * (alpha + 2) * x + (alpha + 1) * (alpha + 2))
      expect(evaluateAssociatedLaguerre(2, alpha, x)).toBeCloseTo(expectedL2, 6)
    })

    it('1s radial wavefunction has 0 radial nodes and exponential decay', () => {
      // R_10(r) = 2 * e^(-r) for Z = 1
      const r0 = evaluateRadialWavefunction(1, 0, 0, 1.0)
      expect(r0).toBeCloseTo(2.0, 5)

      const r1 = evaluateRadialWavefunction(1, 0, 1.0, 1.0)
      expect(r1).toBeCloseTo(2.0 * Math.exp(-1.0), 5)

      // Strictly positive for all r >= 0
      for (let r = 0.1; r <= 10.0; r += 0.5) {
        expect(evaluateRadialWavefunction(1, 0, r, 1.0)).toBeGreaterThan(0)
      }
    })

    it('2s radial wavefunction has exactly 1 radial node at r = 2 a₀ (for Z=1)', () => {
      // R_20(r) = (1 / (2*sqrt(2))) * (2 - r) * e^(-r/2)
      // At r = 2, R_20(2) = 0 (exact node)
      const atNode = evaluateRadialWavefunction(2, 0, 2.0, 1.0)
      expect(Math.abs(atNode)).toBeLessThan(1e-10)

      // Inside node (r < 2): positive
      expect(evaluateRadialWavefunction(2, 0, 1.0, 1.0)).toBeGreaterThan(0)

      // Outside node (r > 2): negative
      expect(evaluateRadialWavefunction(2, 0, 3.0, 1.0)).toBeLessThan(0)
    })

    it('3s radial wavefunction has exactly 2 radial nodes (for Z=1)', () => {
      // R_30(r) proportional to 27 - 18r + 2r²
      // Roots: r = (18 ± sqrt(324 - 216)) / 4 = (18 ± sqrt(108)) / 4 = 4.5 ± 1.5*sqrt(3)
      // r1 ≈ 1.9019 a0, r2 ≈ 7.0981 a0
      const r1 = 4.5 - 1.5 * Math.sqrt(3)
      const r2 = 4.5 + 1.5 * Math.sqrt(3)

      expect(Math.abs(evaluateRadialWavefunction(3, 0, r1, 1.0))).toBeLessThan(1e-6)
      expect(Math.abs(evaluateRadialWavefunction(3, 0, r2, 1.0))).toBeLessThan(1e-6)

      // Signs between intervals
      expect(evaluateRadialWavefunction(3, 0, 0.5, 1.0)).toBeGreaterThan(0) // [0, r1)
      expect(evaluateRadialWavefunction(3, 0, 4.0, 1.0)).toBeLessThan(0) // (r1, r2)
      expect(evaluateRadialWavefunction(3, 0, 10.0, 1.0)).toBeGreaterThan(0) // (r2, inf)
    })

    it('4f radial wavefunction has 0 radial nodes (n-l-1 = 4-3-1 = 0)', () => {
      // 4f (n=4, l=3): strictly positive everywhere for r > 0
      for (let r = 0.5; r <= 25.0; r += 1.0) {
        const val = evaluateRadialWavefunction(4, 3, r, 1.0)
        expect(val).toBeGreaterThan(0)
      }
    })

    it('radial probability distribution P(r) integrates to 1.0 numerically', () => {
      // Numerical integration of P(r) = r² |R_20(r)|² for 2s state
      let sum = 0
      const dr = 0.01
      for (let r = 0; r <= 35.0; r += dr) {
        sum += evaluateRadialProbability(2, 0, r, 1.0) * dr
      }
      expect(sum).toBeCloseTo(1.0, 2)
    })
  })

  describe('4. Full Spatial Wavefunctions & Node Counting', () => {
    it('evaluates orbital metadata correctly for representative orbitals', () => {
      const meta2p = getOrbitalMetadata(6, 2, 'pz') // Carbon 2p_z
      expect(meta2p.n).toBe(2)
      expect(meta2p.family).toBe('p')
      expect(meta2p.l).toBe(1)
      expect(meta2p.radialNodes).toBe(0) // 2 - 1 - 1 = 0
      expect(meta2p.angularNodes).toBe(1) // l = 1
      expect(meta2p.totalNodes).toBe(1) // n - 1 = 1
      expect(meta2p.isGroundOccupied).toBe(true)

      const meta3d = getOrbitalMetadata(26, 3, 'dz2') // Iron 3d_z²
      expect(meta3d.n).toBe(3)
      expect(meta3d.family).toBe('d')
      expect(meta3d.l).toBe(2)
      expect(meta3d.radialNodes).toBe(0) // 3 - 2 - 1 = 0
      expect(meta3d.angularNodes).toBe(2) // l = 2
      expect(meta3d.totalNodes).toBe(2) // n - 1 = 2
      expect(meta3d.isGroundOccupied).toBe(true)

      const meta4f = getOrbitalMetadata(58, 4, 'fxyz') // Cerium 4f_xyz
      expect(meta4f.n).toBe(4)
      expect(meta4f.family).toBe('f')
      expect(meta4f.l).toBe(3)
      expect(meta4f.radialNodes).toBe(0) // 4 - 3 - 1 = 0
      expect(meta4f.angularNodes).toBe(3) // l = 3
      expect(meta4f.totalNodes).toBe(3) // n - 1 = 3
      expect(meta4f.isGroundOccupied).toBe(true)

      const meta5f = getOrbitalMetadata(92, 5, 'fz3') // Uranium 5f_z³
      expect(meta5f.n).toBe(5)
      expect(meta5f.family).toBe('f')
      expect(meta5f.l).toBe(3)
      expect(meta5f.radialNodes).toBe(1) // 5 - 3 - 1 = 1 radial node
      expect(meta5f.angularNodes).toBe(3)
      expect(meta5f.totalNodes).toBe(4)
      expect(meta5f.isGroundOccupied).toBe(true)
    })
  })

  describe('5. 3D Rejection Sampling & Phase Point Buffers', () => {
    it('samples point cloud deterministically with seed', () => {
      const sample1 = sampleOrbitalField(2, 'pz', 500, 1.0, 777)
      const sample2 = sampleOrbitalField(2, 'pz', 500, 1.0, 777)

      expect(sample1.positions.length).toBe(1500)
      expect(sample1.phases.length).toBe(500)
      expect(sample1.positions[0]).toBe(sample2.positions[0])
      expect(sample1.positions[1]).toBe(sample2.positions[1])
      expect(sample1.phases[0]).toBe(sample2.phases[0])
    })

    it('tags points with opposite phase signs (+1 and -1) for p and d orbitals', () => {
      const sample = sampleOrbitalField(2, 'pz', 1000, 1.0, 42)
      let positivePhases = 0
      let negativePhases = 0

      for (let i = 0; i < sample.phases.length; i++) {
        if (sample.phases[i] > 0) positivePhases++
        if (sample.phases[i] < 0) negativePhases++
      }

      // Both lobes should be populated roughly equally by symmetry
      expect(positivePhases).toBeGreaterThan(300)
      expect(negativePhases).toBeGreaterThan(300)
      expect(positivePhases + negativePhases).toBe(1000)
    })

    it('contains no NaN, null, or infinite coordinates across all 16 orientations', () => {
      const allOrientations = Object.keys(ORBITAL_ORIENTATIONS) as RealOrientationKey[]
      allOrientations.forEach((orient) => {
        const info = ORBITAL_ORIENTATIONS[orient]
        const n = info.family === 's' ? 1 : info.family === 'p' ? 2 : info.family === 'd' ? 3 : 4
        const sample = sampleOrbitalField(n, orient, 200, 2.0, 99)

        for (let i = 0; i < sample.positions.length; i++) {
          expect(Number.isFinite(sample.positions[i])).toBe(true)
          expect(Number.isNaN(sample.positions[i])).toBe(false)
        }
        for (let i = 0; i < sample.phases.length; i++) {
          expect(Math.abs(sample.phases[i])).toBe(1.0)
        }
      })
    })

    it('correctly flattens coordinates along slice plane when cross-section requested', () => {
      const sampleXY = sampleOrbitalField(2, 'pz', 300, 1.0, 123, 'xy')
      for (let i = 0; i < sampleXY.pointCount; i++) {
        const zCoord = sampleXY.positions[i * 3 + 2]
        expect(Math.abs(zCoord)).toBeLessThan(0.3) // constrained near z = 0
      }
    })
  })

  describe('6. Slater Group Targeting & Core vs Valence Screening', () => {
    it('calculates physically distinct screening for core vs valence in Carbon (Z=6)', () => {
      const zeff1s = getOrbitalZeff(6, 1, 's')
      const zeff2s = getOrbitalZeff(6, 2, 's')
      const zeff2p = getOrbitalZeff(6, 2, 'p')

      // 1s electron: screened only by other 1s electron (0.30) => Zeff = 6 - 0.30 = 5.70
      expect(zeff1s).toBeCloseTo(5.70, 2)

      // 2s and 2p belong to the same [2s,2p] group:
      // Screened by 2 electrons in 1s (0.85 each = 1.70) and 3 other electrons in 2s,2p (0.35 each = 1.05)
      // Total sigma = 2.75 => Zeff = 6 - 2.75 = 3.25
      expect(zeff2s).toBeCloseTo(3.25, 2)
      expect(zeff2p).toBeCloseTo(3.25, 2)

      // Core orbital must experience much higher Z_eff than valence
      expect(zeff1s).toBeGreaterThan(zeff2s + 2.0)
    })

    it('calculates distinct shell screening for all groups in Iron (Z=26)', () => {
      // Iron [Ar] 3d6 4s2
      const zeff1s = getOrbitalZeff(26, 1, 's')
      const zeff2p = getOrbitalZeff(26, 2, 'p')
      const zeff3p = getOrbitalZeff(26, 3, 'p')
      const zeff3d = getOrbitalZeff(26, 3, 'd')
      const zeff4s = getOrbitalZeff(26, 4, 's')

      // 1s: Zeff = 26 - 0.30 = 25.70
      expect(zeff1s).toBeCloseTo(25.70, 2)
      // 2s,2p: sigma = 2(0.85) + 7(0.35) = 4.15 => Zeff = 21.85
      expect(zeff2p).toBeCloseTo(21.85, 2)
      // 3s,3p: sigma = 2(1.00) + 8(0.85) + 7(0.35) = 11.25 => Zeff = 14.75
      expect(zeff3p).toBeCloseTo(14.75, 2)
      // 3d: all 18 electrons in lower shells contribute 1.00; 5 other 3d electrons contribute 0.35 => sigma = 19.75 => Zeff = 6.25
      expect(zeff3d).toBeCloseTo(6.25, 2)
      // 4s: 10 electrons in n<=2 contribute 1.00; 14 electrons in n=3 contribute 0.85; 1 other 4s electron contributes 0.35 => sigma = 22.25 => Zeff = 3.75
      expect(zeff4s).toBeCloseTo(3.75, 2)

      // Strict core-to-valence hierarchy: 1s > 2p > 3p > 3d > 4s
      expect(zeff1s).toBeGreaterThan(zeff2p)
      expect(zeff2p).toBeGreaterThan(zeff3p)
      expect(zeff3p).toBeGreaterThan(zeff3d)
      expect(zeff3d).toBeGreaterThan(zeff4s)
    })

    it('calculates core vs valence screening for Sodium (Z=11)', () => {
      const zeff1s = getOrbitalZeff(11, 1, 's')
      const zeff2p = getOrbitalZeff(11, 2, 'p')
      const zeff3s = getOrbitalZeff(11, 3, 's')

      // 1s: 11 - 0.30 = 10.70
      expect(zeff1s).toBeCloseTo(10.70, 2)
      // 2p: 11 - 4.15 = 6.85
      expect(zeff2p).toBeCloseTo(6.85, 2)
      // 3s: 11 - [2(1.00) + 8(0.85)] = 11 - 8.80 = 2.20
      expect(zeff3s).toBeCloseTo(2.20, 2)
    })
  })

  describe('7. Exact Radial Nodes Matching Associated Laguerre Roots', () => {
    it('returns empty nodes for circular states with k = n - l - 1 = 0', () => {
      expect(findRadialNodes(1, 0, 1.0)).toEqual([]) // 1s
      expect(findRadialNodes(2, 1, 1.0)).toEqual([]) // 2p
      expect(findRadialNodes(3, 2, 1.0)).toEqual([]) // 3d
      expect(findRadialNodes(4, 3, 1.0)).toEqual([]) // 4f
    })

    it('computes exact closed-form root for k = 1 states (2s, 3p, 4d, 5f)', () => {
      // For k = 1, r = n * (l + 1) / zeff
      const node2s = findRadialNodes(2, 0, 1.0)
      expect(node2s).toHaveLength(1)
      expect(node2s[0]).toBeCloseTo(2.0, 6)

      const node3p = findRadialNodes(3, 1, 1.0)
      expect(node3p).toHaveLength(1)
      expect(node3p[0]).toBeCloseTo(6.0, 6)

      const node4d = findRadialNodes(4, 2, 1.0)
      expect(node4d).toHaveLength(1)
      expect(node4d[0]).toBeCloseTo(12.0, 6)

      const node5f = findRadialNodes(5, 3, 1.0)
      expect(node5f).toHaveLength(1)
      expect(node5f[0]).toBeCloseTo(20.0, 6)
    })

    it('computes exact closed-form roots for k = 2 states (3s, 4p, 5d)', () => {
      // 3s (n=3, l=0): roots of L_2^1(rho) => rho = 3 ± sqrt(3) => r = 1.5 * (3 ± sqrt(3))
      const node3s = findRadialNodes(3, 0, 1.0)
      expect(node3s).toHaveLength(2)
      expect(node3s[0]).toBeCloseTo(1.5 * (3 - Math.sqrt(3)), 6)
      expect(node3s[1]).toBeCloseTo(1.5 * (3 + Math.sqrt(3)), 6)

      // Verify wavefunction evaluates to zero at both node radii
      expect(Math.abs(evaluateRadialWavefunction(3, 0, node3s[0], 1.0))).toBeLessThan(1e-7)
      expect(Math.abs(evaluateRadialWavefunction(3, 0, node3s[1], 1.0))).toBeLessThan(1e-7)
    })

    it('computes roots for high-n states via tridiagonal eigensolver (4s has 3 nodes)', () => {
      const node4s = findRadialNodes(4, 0, 1.0)
      expect(node4s).toHaveLength(3)
      for (const r of node4s) {
        expect(Math.abs(evaluateRadialWavefunction(4, 0, r, 1.0))).toBeLessThan(1e-6)
      }
    })
  })

  describe('8. Exact Radial Probability Maxima & Peak Radii', () => {
    it('computes exact peak for 1s (r_peak = 1.0 a₀ for Z=1)', () => {
      const res = findRadialMaxima(1, 0, 1.0)
      expect(res.principalPeak).toBeCloseTo(1.0, 5)
      expect(res.allPeaks).toHaveLength(1)
    })

    it('computes exact principal peak for 2s (r_peak = 3 + √5 ≈ 5.2361 a₀)', () => {
      const res = findRadialMaxima(2, 0, 1.0)
      const expectedPeak = 3.0 + Math.sqrt(5.0) // 5.2360679...
      expect(res.principalPeak).toBeCloseTo(expectedPeak, 4)
      expect(res.allPeaks).toHaveLength(2)

      // Inner peak at 3 - √5 ≈ 0.7639
      expect(res.allPeaks[0].radius).toBeCloseTo(3.0 - Math.sqrt(5.0), 4)
      // Outermost principal peak
      expect(res.allPeaks[1].radius).toBeCloseTo(expectedPeak, 4)

      // Demonstrates that the naive formula n²/Z = 4.0 was off by > 30%
      expect(Math.abs(res.principalPeak - 4.0)).toBeGreaterThan(1.2)
    })

    it('computes exact peak for 2p (r_peak = 4.0 a₀)', () => {
      const res = findRadialMaxima(2, 1, 1.0)
      expect(res.principalPeak).toBeCloseTo(4.0, 5)
    })

    it('computes exact peak for 3d (r_peak = 9.0 a₀)', () => {
      const res = findRadialMaxima(3, 2, 1.0)
      expect(res.principalPeak).toBeCloseTo(9.0, 5)
    })

    it('computes exact peak for 4f (r_peak = 16.0 a₀)', () => {
      const res = findRadialMaxima(4, 3, 1.0)
      expect(res.principalPeak).toBeCloseTo(16.0, 4)
    })
  })

  describe('9. Statistical Expectation Values & Moment Analysis', () => {
    it('validates 1s sample moments against analytical expectation values: <r>=1.5, <r²>=3.0', () => {
      const sample = sampleOrbitalField(1, 's', 8000, 1.0, 42)
      let sumR = 0
      let sumR2 = 0

      // For n=1, sceneScale is visualScale / max(1.0, 1.2) = 1 / 1.2
      // Recover physical radius in a0 by multiplying by 1.2
      const invScale = 1.2

      for (let i = 0; i < sample.pointCount; i++) {
        const x = sample.positions[i * 3] * invScale
        const y = sample.positions[i * 3 + 1] * invScale
        const z = sample.positions[i * 3 + 2] * invScale
        const r = Math.sqrt(x * x + y * y + z * z)
        sumR += r
        sumR2 += r * r
      }

      const meanR = sumR / sample.pointCount
      const meanR2 = sumR2 / sample.pointCount

      // Theory: <r> = 1.5 a0, <r²> = 3.0 a0²
      expect(meanR).toBeGreaterThan(1.42)
      expect(meanR).toBeLessThan(1.58)
      expect(meanR2).toBeGreaterThan(2.7)
      expect(meanR2).toBeLessThan(3.3)
    })

    it('validates 2p sample moments against analytical expectation values: <r>=5.0, <r²>=30.0', () => {
      const sample = sampleOrbitalField(2, 'pz', 8000, 1.0, 101)
      let sumR = 0
      let sumR2 = 0

      // For n=2, l=1, sceneScale is visualScale / max(1.0, (2*1.2)/1) = 1 / 2.4
      // To recover physical radius in a0, multiply by 2.4
      const invScale = 2.4

      for (let i = 0; i < sample.pointCount; i++) {
        const x = sample.positions[i * 3] * invScale
        const y = sample.positions[i * 3 + 1] * invScale
        const z = sample.positions[i * 3 + 2] * invScale
        const r = Math.sqrt(x * x + y * y + z * z)
        sumR += r
        sumR2 += r * r
      }

      const meanR = sumR / sample.pointCount
      const meanR2 = sumR2 / sample.pointCount

      // Theory: <r> = (3n² - l(l+1)) / 2 = (12 - 2) / 2 = 5.0 a0
      // Theory: <r²> = (n²/2)*(5n² + 1 - 3l(l+1)) = (4/2)*(20 + 1 - 6) = 2 * 15 = 30.0 a0²
      expect(meanR).toBeGreaterThan(4.7)
      expect(meanR).toBeLessThan(5.3)
      expect(meanR2).toBeGreaterThan(27.0)
      expect(meanR2).toBeLessThan(33.0)
    })
  })

  describe('10. Numerical Integration of All 16 Real Spherical Harmonics on S²', () => {
    it('verifies ∫ |Y_l,orient(θ, φ)|² dΩ = 1.000 for all 16 orientations', () => {
      const allKeys = Object.keys(ORBITAL_ORIENTATIONS) as RealOrientationKey[]
      const nTheta = 100
      const nPhi = 200
      const dTheta = Math.PI / nTheta
      const dPhi = (2.0 * Math.PI) / nPhi

      allKeys.forEach((key) => {
        let integral = 0
        for (let i = 0; i < nTheta; i++) {
          const theta = (i + 0.5) * dTheta
          const sinTheta = Math.sin(theta)
          const cosTheta = Math.cos(theta)

          for (let j = 0; j < nPhi; j++) {
            const phi = (j + 0.5) * dPhi
            const ux = sinTheta * Math.cos(phi)
            const uy = sinTheta * Math.sin(phi)
            const uz = cosTheta

            const y = evaluateRealSphericalHarmonic(key, ux, uy, uz)
            integral += y * y * sinTheta * dTheta * dPhi
          }
        }

        expect(integral).toBeGreaterThan(0.98)
        expect(integral).toBeLessThan(1.02)
      })
    })
  })

  describe('11. Exact Spatial Density vs Radial Probability Separation', () => {
    it('computes exact analytical values for getMaxRadialWavefunctionDensity', () => {
      // 1s: R_10(0) = 2 -> R(0)² = 4.0
      expect(getMaxRadialWavefunctionDensity(1, 0, 1.0)).toBeCloseTo(4.0, 5)

      // 2s: R_20(0) = 2*(1/2)^(3/2) = 1/√2 -> R(0)² = 0.5
      expect(getMaxRadialWavefunctionDensity(2, 0, 1.0)).toBeCloseTo(0.5, 5)

      // 3s: R_30(0) = 2*(1/3)^(3/2) -> R(0)² = 4/27 ≈ 0.148148
      expect(getMaxRadialWavefunctionDensity(3, 0, 1.0)).toBeCloseTo(4.0 / 27.0, 5)

      // 4s: R_40(0) = 2*(1/4)^(3/2) -> R(0)² = 4/64 = 0.0625
      expect(getMaxRadialWavefunctionDensity(4, 0, 1.0)).toBeCloseTo(0.0625, 5)

      // 2p: R_21(r) peak at r = 2.0 a0 -> R(2)² = 1/(6 e²) ≈ 0.022556
      const expected2p = 1.0 / (6.0 * Math.E * Math.E)
      expect(getMaxRadialWavefunctionDensity(2, 1, 1.0)).toBeCloseTo(expected2p, 5)
    })

    it('verifies 1s spatial density is maximal (1.0) at the origin while radial probability P(0) = 0', () => {
      const maxSpatial1s = getMaxSpatialDensity(1, 's', 1.0)
      const psiOrigin = evaluateOrbitalWavefunction(1, 's', 0, 0, 0, 1.0)
      const spatialDensityOrigin = (psiOrigin * psiOrigin) / maxSpatial1s

      // Spatial density must be 1.0 at nucleus (cusp of 1s orbital)
      expect(spatialDensityOrigin).toBeCloseTo(1.0, 5)

      // Radial probability P(r) = r² |R(r)|² must be exactly 0 at nucleus due to r² volume Jacobian
      const pradOrigin = evaluateRadialProbability(1, 0, 0, 1.0)
      expect(pradOrigin).toBe(0.0)
    })

    it('evaluates spatial density to identically 0 on angular nodal surfaces', () => {
      const maxSpatial2pz = getMaxSpatialDensity(2, 'pz', 1.0)

      // On xy-plane (z = 0), 2pz wavefunction and spatial density are identically 0
      for (const [x, y] of [
        [1.0, 0],
        [0, 1.0],
        [2.0, 3.0],
        [-1.5, 2.5],
      ]) {
        const psi = evaluateOrbitalWavefunction(2, 'pz', x, y, 0, 1.0)
        expect(psi).toBe(0.0)
        expect((psi * psi) / maxSpatial2pz).toBe(0.0)
      }
    })

    it('samples 1s 3D point cloud with non-zero spatial densities near origin', () => {
      const sample = sampleOrbitalField(1, 's', 2000, 1.0, 999)
      expect(sample.pointCount).toBe(2000)

      // All densities must be strictly bounded in [0, 1]
      let maxSampledDensity = 0
      for (let i = 0; i < sample.pointCount; i++) {
        const d = sample.densities[i]
        expect(d).toBeGreaterThanOrEqual(0.0)
        expect(d).toBeLessThanOrEqual(1.0)
        if (d > maxSampledDensity) maxSampledDensity = d
      }

      // 1s point cloud must contain points with high spatial density near nucleus
      expect(maxSampledDensity).toBeGreaterThan(0.85)
    })
  })

  describe('12. Rejection Envelope Safety Across All 16 Orientations & 3 Slice Planes', () => {
    it('strictly guarantees 0 exceedances across all 48 orbital/slice-plane combinations', () => {
      const allKeys = Object.keys(ORBITAL_ORIENTATIONS) as RealOrientationKey[]
      const planes: ('xy' | 'xz' | 'yz')[] = ['xy', 'xz', 'yz']
      const delta = 0.18

      let totalEvaluated = 0
      let totalExceeded = 0

      // Pseudo-random generator for reproducible thorough testing
      let rng = 8888
      const testRand = () => {
        rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0
        return rng / 4294967296
      }

      for (const key of allKeys) {
        const info = ORBITAL_ORIENTATIONS[key]
        const n = info.family === 's' ? 1 : info.family === 'p' ? 2 : info.family === 'd' ? 3 : 4
        const maxima = findRadialMaxima(n, FAMILY_CAPACITY[info.family] > 2 ? 1 : 0, 1.0)
        const rCutoff = Math.max(maxima.principalPeak * 2.2, 3.5)

        for (const plane of planes) {
          const envelope = computeSliceRejectionEnvelope(n, key, plane, 1.0, rCutoff, delta)
          expect(envelope).toBeGreaterThan(0)

          // Test 1,000 random points inside the slice cylinder
          for (let i = 0; i < 1000; i++) {
            totalEvaluated++
            const r = testRand() * rCutoff
            const phi = testRand() * 2.0 * Math.PI
            const u = (testRand() * 2.0 - 1.0) * delta

            let x = 0, y = 0, z = 0
            if (plane === 'xy') { x = r * Math.cos(phi); y = r * Math.sin(phi); z = u }
            else if (plane === 'xz') { x = r * Math.cos(phi); y = u; z = r * Math.sin(phi) }
            else { x = u; y = r * Math.cos(phi); z = r * Math.sin(phi) }

            const psi = evaluateOrbitalWavefunction(n, key, x, y, z, 1.0)
            const g = r * psi * psi
            if (g > envelope) {
              totalExceeded++
            }
          }
        }
      }

      expect(totalEvaluated).toBe(48000)
      expect(totalExceeded).toBe(0)
    })
  })

  describe('13. Sampling Completion for Difficult Cases & Nodal Slices', () => {
    it('accepts full sample count for planar nodal slice (2pz on xy)', () => {
      const sample = sampleOrbitalField(2, 'pz', 2500, 1.0, 42, 'xy')
      expect(sample.pointCount).toBe(2500)
      expect(sample.positions.length).toBe(7500)
      expect(sample.phases.length).toBe(2500)
      expect(sample.densities.length).toBe(2500)

      // Coordinates along z must be strictly confined to slice
      for (let i = 0; i < sample.pointCount; i++) {
        const z = sample.positions[i * 3 + 2]
        expect(Math.abs(z)).toBeLessThan(0.25)
      }
    })

    it('accepts full sample count for multi-nodal slice (4fxyz on xy)', () => {
      const sample = sampleOrbitalField(4, 'fxyz', 2500, 1.0, 123, 'xy')
      expect(sample.pointCount).toBe(2500)
      expect(sample.positions.length).toBe(7500)
    })

    it('accepts full sample count for high-n orbital states (n=5 s and n=6 pz on xy)', () => {
      const sample5s = sampleOrbitalField(5, 's', 2000, 1.0, 777, 'xy')
      expect(sample5s.pointCount).toBe(2000)

      const sample6pz = sampleOrbitalField(6, 'pz', 2000, 1.0, 888, 'xy')
      expect(sample6pz.pointCount).toBe(2000)
    })
  })

  describe('14. Buffer Length Safety & Zero Uninitialized Vertices', () => {
    it('guarantees positions, phases, and densities arrays are strictly sliced to pointCount', () => {
      const sample = sampleOrbitalField(3, 'dz2', 1500, 1.0, 314, 'xy')

      expect(sample.positions.length).toBe(sample.pointCount * 3)
      expect(sample.phases.length).toBe(sample.pointCount)
      expect(sample.densities.length).toBe(sample.pointCount)

      // Ensure no trailing uninitialized elements (all elements must be finite and non-NaN)
      for (let i = 0; i < sample.positions.length; i++) {
        expect(Number.isFinite(sample.positions[i])).toBe(true)
      }
      for (let i = 0; i < sample.phases.length; i++) {
        expect(Math.abs(sample.phases[i])).toBe(1.0)
      }
      for (let i = 0; i < sample.densities.length; i++) {
        expect(sample.densities[i]).toBeGreaterThanOrEqual(0.0)
        expect(sample.densities[i]).toBeLessThanOrEqual(1.0)
      }
    })

    it('creates matching BufferGeometry position and color attributes with identical counts', () => {
      const sample = sampleOrbitalField(2, 'px', 1200, 1.0, 555, 'xz')

      const geom = new THREE.BufferGeometry()
      geom.setAttribute('position', new THREE.BufferAttribute(sample.positions, 3))

      const colors = new Float32Array(sample.pointCount * 3)
      for (let i = 0; i < sample.pointCount; i++) {
        colors[i * 3] = 0.22
        colors[i * 3 + 1] = 0.74
        colors[i * 3 + 2] = 0.97
      }
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geom.setDrawRange(0, sample.pointCount)

      // Strict attribute integrity checks
      expect(geom.attributes.position.count).toBe(sample.pointCount)
      expect(geom.attributes.color.count).toBe(sample.pointCount)
      expect(geom.drawRange.count).toBe(sample.pointCount)
      expect(geom.drawRange.start).toBe(0)
    })
  })
})

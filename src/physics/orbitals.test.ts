import { describe, it, expect } from 'vitest'
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
  type RealOrientationKey,
  type OrbitalFamily,
} from './orbitals'

describe('QUANTA V4 — Quantum Orbital Physics Engine', () => {
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
      expect(diag2).toBeLessThan(0) // alternating phase cloverleaf

      // dx²-y²: zero along x = ±y diagonals, maximum along coordinate axes
      const dX2Y2_x = evaluateRealSphericalHarmonic('dx2-y2', 1, 0, 0)
      const dX2Y2_y = evaluateRealSphericalHarmonic('dx2-y2', 0, 1, 0)
      const dX2Y2_diag = evaluateRealSphericalHarmonic('dx2-y2', 1 / Math.sqrt(2), 1 / Math.sqrt(2), 0)
      expect(dX2Y2_x).toBeGreaterThan(0)
      expect(dX2Y2_y).toBeLessThan(0)
      expect(dX2Y2_diag).toBe(0)
    })

    it('fxyz orbital exhibits 8 alternating octants separated by 3 coordinate nodal planes', () => {
      // Zero on any coordinate plane
      expect(evaluateRealSphericalHarmonic('fxyz', 0, 0.5, 0.5)).toBe(0)
      expect(evaluateRealSphericalHarmonic('fxyz', 0.5, 0, 0.5)).toBe(0)
      expect(evaluateRealSphericalHarmonic('fxyz', 0.5, 0.5, 0)).toBe(0)

      // Octant (+, +, +) has positive phase
      const octantPPP = evaluateRealSphericalHarmonic('fxyz', 1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3))
      expect(octantPPP).toBeGreaterThan(0)

      // Octant (-, +, +) has negative phase
      const octantMPP = evaluateRealSphericalHarmonic('fxyz', -1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3))
      expect(octantMPP).toBeLessThan(0)

      // Octant (-, -, +) has positive phase
      const octantMMP = evaluateRealSphericalHarmonic('fxyz', -1 / Math.sqrt(3), -1 / Math.sqrt(3), 1 / Math.sqrt(3))
      expect(octantMMP).toBeGreaterThan(0)

      // Octant (-, -, -) has negative phase
      const octantMMM = evaluateRealSphericalHarmonic('fxyz', -1 / Math.sqrt(3), -1 / Math.sqrt(3), -1 / Math.sqrt(3))
      expect(octantMMM).toBeLessThan(0)
    })

    it('fz³ orbital exhibits equatorial node and conical nodal surfaces', () => {
      // Equator (z = 0): exactly zero
      expect(evaluateRealSphericalHarmonic('fz3', 1, 0, 0)).toBe(0)

      // Poles: 5(1)² - 3 = 2 > 0 for +z, < 0 for -z
      expect(evaluateRealSphericalHarmonic('fz3', 0, 0, 1)).toBeGreaterThan(0)
      expect(evaluateRealSphericalHarmonic('fz3', 0, 0, -1)).toBeLessThan(0)

      // Conical node at cos²θ = 3/5 => uz = √(3/5)
      const uzCone = Math.sqrt(3 / 5)
      const uxCone = Math.sqrt(2 / 5)
      const atCone = evaluateRealSphericalHarmonic('fz3', uxCone, 0, uzCone)
      expect(Math.abs(atCone)).toBeLessThan(1e-7)
    })
  })

  describe('3. Radial Wavefunctions & Laguerre Recurrence', () => {
    it('computes generalized Laguerre polynomials correctly', () => {
      // L_0^alpha(x) = 1
      expect(evaluateAssociatedLaguerre(0, 1, 5)).toBe(1.0)
      // L_1^alpha(x) = 1 + alpha - x
      expect(evaluateAssociatedLaguerre(1, 1, 2)).toBe(1 + 1 - 2) // = 0 (node at x = 2)
      expect(evaluateAssociatedLaguerre(1, 3, 4)).toBe(1 + 3 - 4) // = 0
    })

    it('1s radial wavefunction has 0 radial nodes and exponential decay', () => {
      // R_10(r) = 2 Z^(3/2) exp(-Zr)
      const r0 = evaluateRadialWavefunction(1, 0, 0, 1.0)
      expect(r0).toBeCloseTo(2.0, 5)

      const r1 = evaluateRadialWavefunction(1, 0, 1.0, 1.0)
      expect(r1).toBeCloseTo(2.0 * Math.exp(-1.0), 5)
      expect(r1).toBeGreaterThan(0) // always positive (0 radial nodes)
    })

    it('2s radial wavefunction has exactly 1 radial node at r = 2 a₀ (for Z=1)', () => {
      // R_20(r) = (1/2√2) (2 - r) exp(-r/2)
      const inner = evaluateRadialWavefunction(2, 0, 1.0, 1.0)
      expect(inner).toBeGreaterThan(0) // inside radial node

      const node = evaluateRadialWavefunction(2, 0, 2.0, 1.0)
      expect(Math.abs(node)).toBeLessThan(1e-7) // radial node at r = 2.0

      const outer = evaluateRadialWavefunction(2, 0, 3.0, 1.0)
      expect(outer).toBeLessThan(0) // phase reversal outside radial node!
    })

    it('3s radial wavefunction has exactly 2 radial nodes (for Z=1)', () => {
      // R_30(r) has nodes where 27 - 18(2r/3) + 2(2r/3)² = 0
      // 27 - 12r + (8/9)r² = 0 => roots at r ≈ 1.9019 and 7.098
      const rInner = evaluateRadialWavefunction(3, 0, 0.5, 1.0)
      expect(rInner).toBeGreaterThan(0)

      const rMiddle = evaluateRadialWavefunction(3, 0, 4.0, 1.0)
      expect(rMiddle).toBeLessThan(0) // sign flip between node 1 and 2

      const rOuter = evaluateRadialWavefunction(3, 0, 10.0, 1.0)
      expect(rOuter).toBeGreaterThan(0) // second sign flip
    })

    it('4f radial wavefunction has 0 radial nodes (n-l-1 = 4-3-1 = 0)', () => {
      for (let r = 0.5; r <= 15; r += 1.0) {
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
})

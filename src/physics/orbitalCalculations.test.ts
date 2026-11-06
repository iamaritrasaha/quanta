import { describe, expect, it } from 'vitest'
import {
  evaluateRadialWavefunction,
  evaluateRadialProbability,
  evaluateOrbitalWavefunction,
  getOrbitalMetadata,
  ORBITAL_ORIENTATIONS,
  FAMILY_ORIENTATIONS,
  FAMILY_TO_L,
} from './orbitals'
import { useQuantaStore } from '../state/quantaStore'

describe('QUANTA V4 — Orbital Wavefunction Rigor & Metadata', () => {
  it('confirms all 16 orientations exist across s (1), p (3), d (5), and f (7)', () => {
    expect(FAMILY_ORIENTATIONS.s).toHaveLength(1)
    expect(FAMILY_ORIENTATIONS.p).toHaveLength(3)
    expect(FAMILY_ORIENTATIONS.d).toHaveLength(5)
    expect(FAMILY_ORIENTATIONS.f).toHaveLength(7)

    const total =
      FAMILY_ORIENTATIONS.s.length +
      FAMILY_ORIENTATIONS.p.length +
      FAMILY_ORIENTATIONS.d.length +
      FAMILY_ORIENTATIONS.f.length
    expect(total).toBe(16)
  })

  it('verifies radial probability density P(r) is strictly non-negative and finite', () => {
    for (const n of [1, 2, 3, 4, 5]) {
      for (let l = 0; l < n; l++) {
        for (let r = 0; r <= 30; r += 0.5) {
          const p = evaluateRadialProbability(n, l, r, 1.0)
          expect(Number.isFinite(p)).toBe(true)
          expect(p).toBeGreaterThanOrEqual(0)
          expect(isNaN(p)).toBe(false)
        }
      }
    }
  })

  it('verifies radial node counts match n - l - 1 exactly', () => {
    // 1s: n=1, l=0 -> 0 radial nodes
    expect(getOrbitalMetadata(1, 1, 's').radialNodes).toBe(0)
    // 2s: n=2, l=0 -> 1 radial node
    expect(getOrbitalMetadata(1, 2, 's').radialNodes).toBe(1)
    // 2p: n=2, l=1 -> 0 radial nodes
    expect(getOrbitalMetadata(1, 2, 'pz').radialNodes).toBe(0)
    // 3s: n=3, l=0 -> 2 radial nodes
    expect(getOrbitalMetadata(1, 3, 's').radialNodes).toBe(2)
    // 3p: n=3, l=1 -> 1 radial node
    expect(getOrbitalMetadata(1, 3, 'pz').radialNodes).toBe(1)
    // 3d: n=3, l=2 -> 0 radial nodes
    expect(getOrbitalMetadata(1, 3, 'dz2').radialNodes).toBe(0)
    // 4f: n=4, l=3 -> 0 radial nodes
    expect(getOrbitalMetadata(1, 4, 'fz3').radialNodes).toBe(0)
    // 5f: n=5, l=3 -> 1 radial node
    expect(getOrbitalMetadata(1, 5, 'fz3').radialNodes).toBe(1)
  })

  it('verifies angular node counts match l exactly', () => {
    expect(getOrbitalMetadata(1, 1, 's').angularNodes).toBe(0)
    expect(getOrbitalMetadata(1, 2, 'pz').angularNodes).toBe(1)
    expect(getOrbitalMetadata(1, 3, 'dz2').angularNodes).toBe(2)
    expect(getOrbitalMetadata(1, 4, 'fz3').angularNodes).toBe(3)
  })

  it('evaluates 3D wavefunction with positive and negative phase domains', () => {
    // 2pz along z-axis: z > 0 should be positive, z < 0 should be negative
    const psiPosZ = evaluateOrbitalWavefunction(2, 'pz', 0, 0, 2.0, 1.0)
    const psiNegZ = evaluateOrbitalWavefunction(2, 'pz', 0, 0, -2.0, 1.0)
    expect(psiPosZ).toBeGreaterThan(0)
    expect(psiNegZ).toBeLessThan(0)
    expect(psiPosZ).toBeCloseTo(-psiNegZ, 6)

    // On xy-plane (z = 0), pz wavefunction is identically 0
    const psiEquator = evaluateOrbitalWavefunction(2, 'pz', 1.5, 1.5, 0, 1.0)
    expect(psiEquator).toBe(0)
  })

  it('correctly tracks ground state occupancy for multi-electron atoms', () => {
    // Carbon (Z=6): 1s2 2s2 2p2
    // 1s should be occupied (2 e⁻)
    const c1s = getOrbitalMetadata(6, 1, 's')
    expect(c1s.isGroundOccupied).toBe(true)
    expect(c1s.groundOccupancy).toBe(2)

    // 2p should be occupied (2 e⁻)
    const c2p = getOrbitalMetadata(6, 2, 'pz')
    expect(c2p.isGroundOccupied).toBe(true)
    expect(c2p.groundOccupancy).toBe(2)

    // 3d should be unoccupied in ground state (virtual/excited)
    const c3d = getOrbitalMetadata(6, 3, 'dz2')
    expect(c3d.isGroundOccupied).toBe(false)
    expect(c3d.groundOccupancy).toBe(0)

    // Iron (Z=26): [Ar] 3d6 4s2
    const fe3d = getOrbitalMetadata(26, 3, 'dz2')
    expect(fe3d.isGroundOccupied).toBe(true)
    expect(fe3d.groundOccupancy).toBe(6)

    // Uranium (Z=92): [Rn] 5f3 6d1 7s2
    const u5f = getOrbitalMetadata(92, 5, 'fz3')
    expect(u5f.isGroundOccupied).toBe(true)
    expect(u5f.groundOccupancy).toBe(3)
  })

  it('synchronizes universal orbital selection in quantaStore', () => {
    const store = useQuantaStore.getState()
    store.setActiveElement('carbon')
    store.setOrbitalSelection({ family: 'p', n: 2, orientation: 'px', viewMode: 'density', slicePlane: 'xy' })

    const updated = useQuantaStore.getState().orbitalSelection
    expect(updated.family).toBe('p')
    expect(updated.n).toBe(2)
    expect(updated.orientation).toBe('px')
    expect(updated.viewMode).toBe('density')
    expect(updated.slicePlane).toBe('xy')
  })
})

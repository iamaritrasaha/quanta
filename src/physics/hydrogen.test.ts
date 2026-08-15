import { describe, expect, it } from 'vitest'
import {
  bohrRadius,
  bohrVelocity,
  classifySpectralSeries,
  getSpectralLineName,
  hydrogenEnergy,
  hydrogenTransition,
  safeHydrogenTransition,
  wavelengthToDisplayColor,
} from './hydrogen'
import {
  orbitalDensity,
  sampleOrbital,
  UI_ORBITALS,
  validateQuantumNumbers,
} from './quantum'

describe('Hydrogen physics', () => {
  it('calculates energy levels from the Rydberg-like level equation', () => {
    expect(hydrogenEnergy(1)).toBeCloseTo(-13.6, 1)
    expect(hydrogenEnergy(2)).toBeCloseTo(-3.4, 1)
    expect(hydrogenEnergy(3)).toBeCloseTo(-1.511, 2)
    expect(hydrogenEnergy(4)).toBeCloseTo(-0.85, 2)
  })

  it('matches landmark transition wavelengths', () => {
    // Lyman series (UV)
    expect(hydrogenTransition(2, 1).wavelengthNm).toBeCloseTo(121.57, 1) // Lyman-α
    expect(hydrogenTransition(3, 1).wavelengthNm).toBeCloseTo(102.57, 1) // Lyman-β

    // Balmer series (Visible)
    expect(hydrogenTransition(3, 2).wavelengthNm).toBeCloseTo(656.47, 1) // Hα (Red)
    expect(hydrogenTransition(4, 2).wavelengthNm).toBeCloseTo(486.27, 1) // Hβ (Cyan)
    expect(hydrogenTransition(5, 2).wavelengthNm).toBeCloseTo(434.17, 1) // Hγ (Blue)

    // Paschen series (IR)
    expect(hydrogenTransition(4, 3).wavelengthNm).toBeCloseTo(1875.6, 0) // Paschen-α
  })

  it('classifies spectral series and line names', () => {
    expect(classifySpectralSeries(2, 1)).toBe('Lyman')
    expect(classifySpectralSeries(3, 2)).toBe('Balmer')
    expect(classifySpectralSeries(4, 3)).toBe('Paschen')
    expect(classifySpectralSeries(5, 4)).toBe('Brackett')
    expect(classifySpectralSeries(6, 5)).toBe('Pfund')

    expect(getSpectralLineName(2, 1)).toBe('Ly-α')
    expect(getSpectralLineName(3, 2)).toBe('H-α')
    expect(getSpectralLineName(4, 2)).toBe('H-β')
    expect(getSpectralLineName(4, 3)).toBe('Pa-α')
  })

  it('rejects same-level transitions in hydrogenTransition and handles them safely in safeHydrogenTransition', () => {
    // Throwing variant
    expect(() => hydrogenTransition(1, 1)).toThrow(RangeError)
    expect(() => hydrogenTransition(3, 3)).toThrow(RangeError)
    expect(() => hydrogenTransition(0, 2)).toThrow(RangeError)

    // Safe helper variant returning null without crashing
    expect(safeHydrogenTransition(1, 1)).toBeNull()
    expect(safeHydrogenTransition(2, 2)).toBeNull()
    expect(safeHydrogenTransition(0, 3)).toBeNull()

    // Safe helper returning valid transition for valid inputs
    const t = safeHydrogenTransition(3, 2)
    expect(t).not.toBeNull()
    expect(t?.wavelengthNm).toBeCloseTo(656.47, 1)
  })

  it('calculates Bohr radius and velocity scaling', () => {
    expect(bohrRadius(1)).toBeCloseTo(5.29177e-11, 15)
    expect(bohrRadius(2)).toBeCloseTo(5.29177e-11 * 4, 15)
    expect(bohrVelocity(1)).toBeGreaterThan(2e6)
    expect(bohrVelocity(2)).toBeCloseTo(bohrVelocity(1) / 2, 0)
  })

  it('provides appropriate visible and visualization false-colors', () => {
    // H-alpha (656 nm) is visible red
    const redColor = wavelengthToDisplayColor(656.5)
    expect(redColor).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/)

    // UV (121.6 nm) uses visualization false-color
    const uvColor = wavelengthToDisplayColor(121.6)
    expect(uvColor).toBe('#818cf8')

    // IR (1875 nm) uses visualization false-color
    const irColor = wavelengthToDisplayColor(1875.6)
    expect(irColor).toBe('#f43f5e')
  })

  it('rejects invalid quantum-number combinations', () => {
    expect(validateQuantumNumbers({ n: 2, l: 2, m: 0, spin: 0.5 })).toBe(false)
    expect(validateQuantumNumbers({ n: 2, l: 1, m: 2, spin: 0.5 })).toBe(false)
    expect(validateQuantumNumbers({ n: 2, l: 1, m: 0, spin: 0.5 })).toBe(true)
  })

  it('samples orbital densities and returns a fully populated coordinate buffer without zero padding', () => {
    const count = 500
    const points = sampleOrbital('1s', count, 42)
    expect(points.length).toBe(count * 3)

    // Check that positions are populated and non-degenerate
    let nonZeroCount = 0
    for (let i = 0; i < points.length; i += 3) {
      const x = points[i]
      const y = points[i + 1]
      const z = points[i + 2]
      const r = Math.sqrt(x * x + y * y + z * z)
      if (r > 0.0001) {
        nonZeroCount++
      }
    }
    // At least 98% of points should be well outside origin
    expect(nonZeroCount / count).toBeGreaterThan(0.98)
  })

  it('exhibits correct physical nodal structures for quantum states', () => {
    // 2p_z has a nodal plane at z = 0
    expect(orbitalDensity('2p', 1.5, 1.5, 0)).toBe(0)
    expect(orbitalDensity('2p', 0, 0, 2)).toBeGreaterThan(0)

    // 2s has a spherical radial node at r = 2
    // At x=2, y=0, z=0 => r=2
    expect(orbitalDensity('2s', 2, 0, 0)).toBeCloseTo(0, 5)
    expect(orbitalDensity('2s', 0, 2, 0)).toBeCloseTo(0, 5)
    expect(orbitalDensity('2s', 0, 0, 2)).toBeCloseTo(0, 5)
    // Away from node
    expect(orbitalDensity('2s', 0.5, 0, 0)).toBeGreaterThan(0)
    expect(orbitalDensity('2s', 4, 0, 0)).toBeGreaterThan(0)

    // 3d (m=0) has conical angular node at 2z² = x² + y² (i.e. 3cos²θ - 1 = 0)
    // For example, if z = 1, then x² + y² = 2 (e.g. x = 1, y = 1 => r² = 3, 3z² - r² = 0)
    expect(orbitalDensity('3d', 1, 1, 1)).toBeCloseTo(0, 5)
    // On z-axis (x=0, y=0, z=3): density is positive and strong
    expect(orbitalDensity('3d', 0, 0, 3)).toBeGreaterThan(0)
  })

  it('exposes only validated orbitals in UI_ORBITALS', () => {
    expect(UI_ORBITALS).toEqual(['1s', '2s', '2p'])
  })
})

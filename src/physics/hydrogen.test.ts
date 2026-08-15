import { describe, expect, it } from 'vitest'
import { classifySpectralSeries, hydrogenEnergy, hydrogenTransition } from './hydrogen'
import { validateQuantumNumbers } from './quantum'

describe('Hydrogen physics', () => {
  it('calculates energy levels from the Rydberg-like level equation', () => {
    expect(hydrogenEnergy(1)).toBeCloseTo(-13.6, 1)
    expect(hydrogenEnergy(2)).toBeCloseTo(-3.4, 1)
  })
  it('matches landmark transition wavelengths', () => {
    expect(hydrogenTransition(2, 1).wavelengthNm).toBeCloseTo(121.57, 1) // Lyman-α
    expect(hydrogenTransition(3, 2).wavelengthNm).toBeCloseTo(656.47, 1) // Hα
    expect(hydrogenTransition(4, 2).wavelengthNm).toBeCloseTo(486.27, 1) // Hβ
  })
  it('classifies spectral series', () => {
    expect(classifySpectralSeries(2, 1)).toBe('Lyman')
    expect(classifySpectralSeries(3, 2)).toBe('Balmer')
    expect(classifySpectralSeries(4, 3)).toBe('Paschen')
  })
  it('rejects invalid quantum-number combinations', () => {
    expect(validateQuantumNumbers({ n: 2, l: 2, m: 0, spin: .5 })).toBe(false)
    expect(validateQuantumNumbers({ n: 2, l: 1, m: 2, spin: .5 })).toBe(false)
    expect(validateQuantumNumbers({ n: 2, l: 1, m: 0, spin: .5 })).toBe(true)
  })
})

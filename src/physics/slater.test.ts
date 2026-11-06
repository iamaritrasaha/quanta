import { describe, it, expect } from 'vitest'
import {
  parseConfiguration,
  buildSlaterGroups,
  calculateSlaterScreening,
} from './slater'

describe('Slater Screening Engine', () => {
  it('parses noble-gas core configurations correctly', () => {
    const carbon = parseConfiguration('[He]2s2 2p2')
    expect(carbon).toEqual([
      { n: 1, l: 's', count: 2 },
      { n: 2, l: 's', count: 2 },
      { n: 2, l: 'p', count: 2 },
    ])

    const iron = parseConfiguration('[Ar]3d6 4s2')
    expect(iron.length).toBe(7) // 1s, 2s, 2p, 3s, 3p, 3d, 4s
  })

  it('correctly calculates screening and Z_eff for Carbon (Z=6)', () => {
    const res = calculateSlaterScreening(6, '[He]2s2 2p2')
    // 3 electrons in (2s,2p) * 0.35 = 1.05
    // 2 electrons in 1s * 0.85 = 1.70
    // sigma = 2.75, Z_eff = 6 - 2.75 = 3.25
    expect(res.screeningConstant).toBe(2.75)
    expect(res.zEffective).toBe(3.25)
  })

  it('correctly calculates screening and Z_eff for Oxygen (Z=8)', () => {
    const res = calculateSlaterScreening(8, '[He]2s2 2p4')
    // 5 electrons in (2s,2p) * 0.35 = 1.75
    // 2 electrons in 1s * 0.85 = 1.70
    // sigma = 3.45, Z_eff = 8 - 3.45 = 4.55
    expect(res.screeningConstant).toBe(3.45)
    expect(res.zEffective).toBe(4.55)
  })

  it('correctly calculates screening for Iron 4s and 3d electrons (Z=26)', () => {
    // 4s electron:
    const res4s = calculateSlaterScreening(26, '[Ar]3d6 4s2')
    expect(res4s.targetSubshell).toBe('4s,4p')
    expect(res4s.screeningConstant).toBe(22.25)
    expect(res4s.zEffective).toBe(3.75)

    // 3d electron:
    const res3d = calculateSlaterScreening(26, '[Ar]3d6 4s2', '3d')
    expect(res3d.targetSubshell).toBe('3d')
    expect(res3d.screeningConstant).toBe(19.75)
    expect(res3d.zEffective).toBe(6.25)
  })

  it('computes positive, finite effective charge for all 118 elements', () => {
    for (let z = 1; z <= 118; z++) {
      const res = calculateSlaterScreening(z, '1s1')
      expect(res.zEffective).toBeGreaterThan(0)
      expect(Number.isFinite(res.zEffective)).toBe(true)
    }
  })
})

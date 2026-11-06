import { describe, it, expect } from 'vitest'
import {
  parseConfiguration,
  buildSlaterGroups,
  calculateSlaterScreening,
  parseSlaterGroupLabel,
  getSlaterGroupRank,
} from './slater'

describe('Slater Screening Engine — Rigorous Numerical Validation', () => {
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

  it('correctly calculates screening and Z_eff for Carbon (Z=6) valence vs core', () => {
    // 1s core electron: other 1s electron contributes 0.30
    const res1s = calculateSlaterScreening(6, '[He]2s2 2p2', '1s')
    expect(res1s.targetSubshell).toBe('1s')
    expect(res1s.screeningConstant).toBe(0.3)
    expect(res1s.zEffective).toBe(5.7)

    // 2s,2p valence electron:
    // 3 electrons in (2s,2p) * 0.35 = 1.05
    // 2 electrons in 1s * 0.85 = 1.70
    // sigma = 2.75, Z_eff = 6 - 2.75 = 3.25
    const res2p = calculateSlaterScreening(6, '[He]2s2 2p2', '2s,2p')
    expect(res2p.targetSubshell).toBe('2s,2p')
    expect(res2p.screeningConstant).toBe(2.75)
    expect(res2p.zEffective).toBe(3.25)

    // Core is significantly less screened than valence:
    expect(res1s.zEffective).toBeGreaterThan(res2p.zEffective)
  })

  it('correctly calculates screening and Z_eff for Nitrogen (Z=7) and Oxygen (Z=8)', () => {
    // Nitrogen: [He] 2s2 2p3
    const n1s = calculateSlaterScreening(7, '[He]2s2 2p3', '1s')
    expect(n1s.screeningConstant).toBe(0.3)
    expect(n1s.zEffective).toBe(6.7)

    const n2p = calculateSlaterScreening(7, '[He]2s2 2p3', '2s,2p')
    // 4 peers in (2s,2p) * 0.35 = 1.40; 2 in 1s * 0.85 = 1.70; sigma = 3.10
    expect(n2p.screeningConstant).toBe(3.1)
    expect(n2p.zEffective).toBe(3.9)

    // Oxygen: [He] 2s2 2p4
    const o1s = calculateSlaterScreening(8, '[He]2s2 2p4', '1s')
    expect(o1s.screeningConstant).toBe(0.3)
    expect(o1s.zEffective).toBe(7.7)

    const o2p = calculateSlaterScreening(8, '[He]2s2 2p4', '2s,2p')
    // 5 peers in (2s,2p) * 0.35 = 1.75; 2 in 1s * 0.85 = 1.70; sigma = 3.45
    expect(o2p.screeningConstant).toBe(3.45)
    expect(o2p.zEffective).toBe(4.55)
  })

  it('correctly calculates screening for Sodium (Z=11) across 1s, 2s/2p, and 3s', () => {
    const config = '[Ne]3s1'
    // 1s core:
    const na1s = calculateSlaterScreening(11, config, '1s')
    expect(na1s.screeningConstant).toBe(0.3)
    expect(na1s.zEffective).toBe(10.7)

    // 2s,2p intermediate core:
    // 7 peers in (2s,2p) * 0.35 = 2.45; 2 in 1s * 0.85 = 1.70; sigma = 4.15
    const na2p = calculateSlaterScreening(11, config, '2s,2p')
    expect(na2p.screeningConstant).toBe(4.15)
    expect(na2p.zEffective).toBe(6.85)

    // 3s valence:
    // 0 peers in 3s; 8 in n=2 * 0.85 = 6.80; 2 in n=1 * 1.00 = 2.00; sigma = 8.80
    const na3s = calculateSlaterScreening(11, config, '3s')
    expect(na3s.screeningConstant).toBe(8.8)
    expect(na3s.zEffective).toBe(2.2)

    // Monotonic screening decrease outward: Z_eff(1s) > Z_eff(2p) > Z_eff(3s)
    expect(na1s.zEffective).toBeGreaterThan(na2p.zEffective)
    expect(na2p.zEffective).toBeGreaterThan(na3s.zEffective)
  })

  it('correctly calculates screening for Iron (Z=26) across 1s, 2s/2p, 3s/3p, 3d, and 4s', () => {
    const feConfig = '[Ar]3d6 4s2'

    // 1s core:
    const fe1s = calculateSlaterScreening(26, feConfig, '1s')
    expect(fe1s.screeningConstant).toBe(0.3)
    expect(fe1s.zEffective).toBe(25.7)

    // 2s,2p core:
    const fe2p = calculateSlaterScreening(26, feConfig, '2s,2p')
    expect(fe2p.screeningConstant).toBe(4.15)
    expect(fe2p.zEffective).toBe(21.85)

    // 3s,3p core:
    // 7 peers in (3s,3p) * 0.35 = 2.45; 8 in n=2 * 0.85 = 6.80; 2 in n=1 * 1.00 = 2.00; sigma = 11.25
    const fe3sp = calculateSlaterScreening(26, feConfig, '3s,3p')
    expect(fe3sp.screeningConstant).toBe(11.25)
    expect(fe3sp.zEffective).toBe(14.75)

    // 3d electron:
    // 5 peers in 3d * 0.35 = 1.75; 18 in groups lying to left * 1.00 = 18.00; sigma = 19.75
    const fe3d = calculateSlaterScreening(26, feConfig, '3d')
    expect(fe3d.targetSubshell).toBe('3d')
    expect(fe3d.screeningConstant).toBe(19.75)
    expect(fe3d.zEffective).toBe(6.25)

    // 4s electron:
    // 1 peer in 4s * 0.35 = 0.35; 14 in n=3 * 0.85 = 11.90; 10 in n<=2 * 1.00 = 10.00; sigma = 22.25
    const fe4s = calculateSlaterScreening(26, feConfig, '4s')
    expect(fe4s.targetSubshell).toBe('4s,4p')
    expect(fe4s.screeningConstant).toBe(22.25)
    expect(fe4s.zEffective).toBe(3.75)

    // Physical hierarchy verification:
    // 1s (25.70) > 2p (21.85) > 3p (14.75) > 3d (6.25) > 4s (3.75)
    expect(fe1s.zEffective).toBeGreaterThan(fe2p.zEffective)
    expect(fe2p.zEffective).toBeGreaterThan(fe3sp.zEffective)
    expect(fe3sp.zEffective).toBeGreaterThan(fe3d.zEffective)
    expect(fe3d.zEffective).toBeGreaterThan(fe4s.zEffective)
  })

  it('correctly handles virtual/unoccupied subshells in Slater calculations', () => {
    // Carbon (Z=6): test electron placed in virtual 3d orbital
    const c3d = calculateSlaterScreening(6, '[He]2s2 2p2', '3d')
    // 6 electrons lie below 3d, each contributing 1.00 -> sigma = 6.00
    expect(c3d.screeningConstant).toBe(6.0)
    // Z - sigma = 6 - 6 = 0, bounded by 0.1 / 1.0 floor
    expect(c3d.zEffective).toBe(0.1)
  })

  it('computes positive, finite effective charge for all 118 elements', () => {
    for (let z = 1; z <= 118; z++) {
      const res = calculateSlaterScreening(z, '1s1')
      expect(res.zEffective).toBeGreaterThan(0)
      expect(Number.isFinite(res.zEffective)).toBe(true)
    }
  })
})

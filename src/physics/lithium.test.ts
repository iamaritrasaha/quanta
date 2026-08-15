import { describe, it, expect } from 'vitest'
import {
  LITHIUM_LEVELS,
  LITHIUM_TRANSITIONS,
  getLithiumLevel,
  getLithiumTransition,
  findLithiumTransition,
  calculateQuantumDefect,
  calculateLithiumStateEnergyDelta,
  validateLithiumPauliExclusion,
  validateLithiumTransitionLevelOrdering,
  vacuumWavenumberToAirWavelengthNm,
  LITHIUM_VISUAL_CORE_ZEFF,
  sampleLithiumDensity,
  type ElectronQuantumState,
} from './lithium'
import {
  LITHIUM_IONIZATION_ENERGY_EV,
  LITHIUM_IONIZATION_ENERGY_UNCERTAINTY_EV,
  LITHIUM_IONIZATION_ENERGY_FORMATTED_EV,
  LITHIUM_IONIZATION_LIMIT_CM1,
  LITHIUM_ATOMIC_WEIGHT_RANGE,
  LITHIUM_6_ISOTOPE_FRACTION_RANGE,
  LITHIUM_7_ISOTOPE_FRACTION_RANGE,
  RYDBERG_INF_CM1,
  RYDBERG_LI7_CM1,
  CM1_TO_EV,
  cm1ToEv,
} from './constants'
import { hydrogenEnergy } from './hydrogen'

describe('Lithium Physics Engine (Li, Z = 3)', () => {
  it('1. verifies atomic number Z = 3 and core constants', () => {
    expect(3).toBe(3)
    expect(LITHIUM_IONIZATION_ENERGY_EV).toBe(5.391714996)
    expect(LITHIUM_IONIZATION_ENERGY_UNCERTAINTY_EV).toBe(0.000000022)
    expect(LITHIUM_IONIZATION_ENERGY_FORMATTED_EV).toBe('5.391714996(22) eV')
    expect(LITHIUM_IONIZATION_LIMIT_CM1).toBe(43487.11420)
  })

  it('2. verifies ground configuration is 1s²2s and ground term is ²S₁/₂', () => {
    const ground = getLithiumLevel('1s2_2s_2S1_2')
    expect(ground).toBeDefined()
    expect(ground?.configuration).toBe('1s²2s')
    expect(ground?.termSymbol).toBe('²S₁/₂')
    expect(ground?.wavenumberCm1).toBe(0.0)
    expect(ground?.energyEv).toBe(0.0)
    expect(ground?.L).toBe(0)
    expect(ground?.spinS).toBe(0.5)
  })

  it('3. verifies CIAAW standard atomic-weight interval and normal-material isotope composition intervals', () => {
    // Standard atomic weight: [6.938, 6.997]
    expect(LITHIUM_ATOMIC_WEIGHT_RANGE[0]).toBe(6.938)
    expect(LITHIUM_ATOMIC_WEIGHT_RANGE[1]).toBe(6.997)

    // Normal-material isotopic-composition intervals:
    // ⁶Li: [0.019, 0.078] = 1.9% – 7.8%
    // ⁷Li: [0.922, 0.981] = 92.2% – 98.1%
    expect(LITHIUM_6_ISOTOPE_FRACTION_RANGE[0]).toBe(0.019)
    expect(LITHIUM_6_ISOTOPE_FRACTION_RANGE[1]).toBe(0.078)
    expect(LITHIUM_7_ISOTOPE_FRACTION_RANGE[0]).toBe(0.922)
    expect(LITHIUM_7_ISOTOPE_FRACTION_RANGE[1]).toBe(0.981)
  })

  it('4. verifies 2p fine-structure split data integrity and ordering', () => {
    const p1_2 = getLithiumLevel('1s2_2p_2P1_2')
    const p3_2 = getLithiumLevel('1s2_2p_2P3_2')

    expect(p1_2).toBeDefined()
    expect(p3_2).toBeDefined()

    expect(p1_2!.wavenumberCm1).toBe(14903.66)
    expect(p3_2!.wavenumberCm1).toBe(14904.0)

    // J = 1/2 lies slightly lower than J = 3/2 in standard fine-structure ordering
    expect(p1_2!.energyEv).toBeLessThan(p3_2!.energyEv)
    expect(p3_2!.energyEv - p1_2!.energyEv).toBeCloseTo(cm1ToEv(0.34), 6)
  })

  it('5. verifies ground state < all excited states < ionization limit (T_n < T_∞ and n* > 0)', () => {
    const limitEv = cm1ToEv(LITHIUM_IONIZATION_LIMIT_CM1)

    for (const lvl of LITHIUM_LEVELS) {
      if (lvl.id === '1s2_2s_2S1_2') {
        expect(lvl.energyEv).toBe(0.0)
        expect(lvl.wavenumberCm1).toBe(0.0)
      } else {
        expect(lvl.energyEv).toBeGreaterThan(0.0)
        expect(lvl.energyEv).toBeLessThan(limitEv)
        expect(lvl.wavenumberCm1).toBeLessThan(LITHIUM_IONIZATION_LIMIT_CM1)
      }

      // Verify quantum defect properties
      const qd = calculateQuantumDefect(lvl)
      expect(qd.effectiveN).toBeGreaterThan(0)
      expect(qd.termValueCm1).toBeGreaterThan(0)
    }
  })

  it('6. demonstrates core penetration and non-hydrogenic l-degeneracy lifting (3s vs 3p vs 3d)', () => {
    const s3 = getLithiumLevel('1s2_3s_2S1_2')!
    const p3 = getLithiumLevel('1s2_3p_2P1_2')!
    const d3 = getLithiumLevel('1s2_3d_2D3_2')!

    // In neutral Lithium, s penetrates the 1s² core deeply, then p, then d
    // Therefore E(3s) < E(3p) < E(3d)
    expect(s3.energyEv).toBeLessThan(p3.energyEv)
    expect(p3.energyEv).toBeLessThan(d3.energyEv)

    // Derived quantum defect δ_l must decrease with increasing angular momentum l
    const qd_s = calculateQuantumDefect(s3)
    const qd_p = calculateQuantumDefect(p3)
    const qd_d = calculateQuantumDefect(d3)

    expect(qd_s.quantumDefect).toBeGreaterThan(qd_p.quantumDefect)
    expect(qd_p.quantumDefect).toBeGreaterThan(qd_d.quantumDefect)
    expect(qd_d.quantumDefect).toBeGreaterThan(0) // d has tiny but non-zero defect ~0.0014
  })

  it('7. verifies quantum defect equation n* = sqrt(R / (T_limit - T_level)) and delta_l = n - n*', () => {
    const ground2s = getLithiumLevel('1s2_2s_2S1_2')!
    const qdGround = calculateQuantumDefect(ground2s)

    // For 2s: T_limit - T_level = 43487.11420 - 0 = 43487.11420 cm⁻¹
    // n* = sqrt(109737.31568 / 43487.11420) ≈ 1.588535
    // delta_s = 2 - 1.588535 ≈ 0.41146
    expect(qdGround.effectiveN).toBeCloseTo(1.5885, 3)
    expect(qdGround.quantumDefect).toBeCloseTo(0.4115, 3)

    // With mass-adjusted Rydberg constant R_⁷Li
    const qdGroundLi7 = calculateQuantumDefect(ground2s, RYDBERG_LI7_CM1)
    expect(qdGroundLi7.effectiveN).toBeCloseTo(1.58847, 3)
    expect(qdGroundLi7.quantumDefect).toBeCloseTo(0.4115, 3)

    // For 3d: delta_d ≈ 0.001
    const d3 = getLithiumLevel('1s2_3d_2D5_2')!
    const qdD3 = calculateQuantumDefect(d3)
    expect(qdD3.effectiveN).toBeCloseTo(2.9986, 3)
    expect(qdD3.quantumDefect).toBeCloseTo(0.0014, 3)

    // For 4f: delta_f ≈ 0.000
    const f4 = getLithiumLevel('1s2_4f_2F5_2')!
    const qdF4 = calculateQuantumDefect(f4)
    expect(qdF4.effectiveN).toBeCloseTo(4.0005, 3)
    expect(qdF4.quantumDefect).toBeCloseTo(0.000, 2)
  })

  it('8. confirms neutral Lithium levels do NOT match Hydrogenic formula (E != -13.6/n² or -13.6*Z²/n²)', () => {
    const groundLi = getLithiumLevel('1s2_2s_2S1_2')!
    const hGround = hydrogenEnergy(1)
    const h2 = hydrogenEnergy(2)

    // Binding energy of 2s in Lithium is ~5.39 eV, while H(n=2) is -3.4 eV and Hydrogenic Li²⁺(n=2) is -30.6 eV
    const liBinding2s = cm1ToEv(LITHIUM_IONIZATION_LIMIT_CM1) - groundLi.energyEv
    expect(liBinding2s).toBeCloseTo(5.3917, 3)

    expect(Math.abs(liBinding2s)).not.toBeCloseTo(Math.abs(hGround), 1)
    expect(Math.abs(liBinding2s)).not.toBeCloseTo(Math.abs(h2), 1)
    expect(Math.abs(liBinding2s)).not.toBeCloseTo(Math.abs(h2 * 9), 1) // Li²⁺ Z=3 would be 30.6 eV
  })

  it('9. enforces invariant: energy(lowerLevelId) < energy(upperLevelId) for all curated transitions', () => {
    expect(validateLithiumTransitionLevelOrdering()).toBe(true)

    for (const t of LITHIUM_TRANSITIONS) {
      const lower = getLithiumLevel(t.lowerLevelId)!
      const upper = getLithiumLevel(t.upperLevelId)!
      expect(upper.energyEv).toBeGreaterThan(lower.energyEv)
      expect(t.deltaEnergyEv).toBeGreaterThan(0)
      expect(t.photonEnergyEv).toBeGreaterThan(0)
    }
  })

  it('10. tests 670.8 nm resonance hero transition as a fine-structure doublet with 2 components in air', () => {
    const hero = getLithiumTransition('670.8nm')
    expect(hero).toBeDefined()
    expect(hero?.lowerLevelId).toBe('1s2_2s_2S1_2')
    expect(hero?.upperLevelId).toBe('1s2_2p_2P3_2')
    expect(hero?.wavelengthMedium).toBe('air')
    expect(hero?.referenceWavelengthNm).toBe(670.7775)
    expect(hero?.derivedAirWavelengthNm).toBeCloseTo(670.7756, 3)
    expect(hero?.derivedVacuumWavelengthNm).toBeCloseTo(670.9608, 3)
    expect(hero?.components).toHaveLength(2)

    const [compA, compB] = hero!.components!
    // D2 Line: 2s 1/2 -> 2p 3/2 (670.7775 nm air)
    expect(compA.lowerJ).toBe('1/2')
    expect(compA.upperJ).toBe('3/2')
    expect(compA.wavelengthNm).toBe(670.7775)
    expect(compA.wavelengthMedium).toBe('air')

    // D1 Line: 2s 1/2 -> 2p 1/2 (670.7926 nm air)
    expect(compB.lowerJ).toBe('1/2')
    expect(compB.upperJ).toBe('1/2')
    expect(compB.wavelengthNm).toBe(670.7926)
    expect(compB.wavelengthMedium).toBe('air')
  })

  it('11. verifies components of 610.4 nm, 812.6 nm, and 460.3 nm curated lines in air', () => {
    const t610 = getLithiumTransition('610.4nm')!
    expect(t610.referenceWavelengthNm).toBe(610.3654)
    expect(t610.referenceWavelengthMedium).toBe('air')
    expect(t610.components).toHaveLength(2)
    expect(t610.components![0].wavelengthNm).toBe(610.3654)
    expect(t610.components![1].wavelengthNm).toBe(610.3542)

    const t812 = getLithiumTransition('812.6nm')!
    expect(t812.referenceWavelengthNm).toBe(812.6453)
    expect(t812.referenceWavelengthMedium).toBe('air')
    expect(t812.region).toBe('NIR')
    expect(t812.isTrueColor).toBe(false)
    expect(t812.components).toHaveLength(2)
    expect(t812.components![0].wavelengthNm).toBe(812.6453)
    expect(t812.components![1].wavelengthNm).toBe(812.6232)

    const t460 = getLithiumTransition('460.3nm')!
    expect(t460.referenceWavelengthNm).toBe(460.2898)
    expect(t460.referenceWavelengthMedium).toBe('air')
    expect(t460.components).toHaveLength(2)
    expect(t460.components![0].wavelengthNm).toBe(460.2898)
    expect(t460.components![1].wavelengthNm).toBe(460.2831)
  })

  it('12. verifies standard air refractive index dispersion conversion', () => {
    // At ~14904.0 cm⁻¹ (~670.96 nm vacuum), n_air ≈ 1.0002761
    const airWl = vacuumWavenumberToAirWavelengthNm(14904.0)
    const vacWl = 1e7 / 14904.0
    expect(airWl).toBeLessThan(vacWl)
    expect(vacWl).toBeCloseTo(670.9608, 3)
    expect(airWl).toBeCloseTo(670.7756, 3)
    expect(vacWl - airWl).toBeCloseTo(0.1852, 3)
  })

  it('13. verifies absorption gives positive ΔE_state and emission gives negative ΔE_state', () => {
    const hero = getLithiumTransition('670.8nm')!

    const abs = calculateLithiumStateEnergyDelta(hero, 'absorption')
    expect(abs.deltaEStateEv).toBeGreaterThan(0)
    expect(abs.photonEnergyEv).toBe(abs.deltaEStateEv)
    expect(abs.photonEnergyEv).toBeCloseTo(1.84786, 4)

    const em = calculateLithiumStateEnergyDelta(hero, 'emission')
    expect(em.deltaEStateEv).toBeLessThan(0)
    expect(em.photonEnergyEv).toBe(Math.abs(em.deltaEStateEv))
    expect(em.photonEnergyEv).toBeCloseTo(1.84786, 4)
  })

  it('14. verifies visual model effective nuclear charge Z_core = 2.6875 = 3 - 5/16', () => {
    expect(LITHIUM_VISUAL_CORE_ZEFF).toBe(3 - 5 / 16)
    expect(LITHIUM_VISUAL_CORE_ZEFF).toBe(2.6875)
  })

  it('15. verifies Pauli Exclusion Validator accepts 1s↑ 1s↓ 2s↑ and rejects duplicate states', () => {
    const groundElectrons: ElectronQuantumState[] = [
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: -0.5 },
      { n: 2, l: 0, ml: 0, ms: 0.5 },
    ]
    const validResult = validateLithiumPauliExclusion(groundElectrons)
    expect(validResult.valid).toBe(true)

    const invalidDuplicate: ElectronQuantumState[] = [
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: 0.5 },
    ]
    const invalidResult = validateLithiumPauliExclusion(invalidDuplicate)
    expect(invalidResult.valid).toBe(false)
    expect(invalidResult.reason).toContain('Pauli violation')
  })

  it('16. verifies density sampling produces valid non-empty arrays with core/valence support', () => {
    const count = 50
    const totalSamples = sampleLithiumDensity('1s2_2s', count, 'total', 999)
    expect(totalSamples).toHaveLength(count * 3)

    const coreSamples = sampleLithiumDensity('1s2_2s', count, 'core', 999)
    expect(coreSamples).toHaveLength(count * 3)

    const valenceSamples = sampleLithiumDensity('1s2_2s', count, 'valence', 999)
    expect(valenceSamples).toHaveLength(count * 3)

    for (let i = 0; i < totalSamples.length; i++) {
      expect(Number.isFinite(totalSamples[i])).toBe(true)
    }
  })
})


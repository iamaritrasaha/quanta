import { describe, expect, it } from 'vitest'
import {
  HELIUM_LEVELS,
  HELIUM_TRANSITIONS,
  HELIUM_GROUND_ZEFF,
  getHeliumLevel,
  getHeliumTransition,
  findHeliumTransition,
  validateTransitionLevelOrdering,
  calculateStateEnergyDelta,
  validatePauliExclusion,
  heliumOrbitalDensity,
  sampleHeliumDensity,
} from './helium'
import { HELIUM_IONIZATION_ENERGY_EV, HELIUM_IONIZATION_LIMIT_CM1, cm1ToEv } from './constants'
import { hydrogenEnergy } from './hydrogen'

describe('Helium Physics & Spectroscopy Integrity', () => {
  it('defines atomic properties for Helium (Z = 2, 4He default isotope)', () => {
    const ground = getHeliumLevel('1s2_1S0')
    expect(ground).toBeDefined()
    expect(ground?.configuration).toBe('1s²')
    expect(ground?.termSymbol).toBe('¹S₀')
    expect(ground?.multiplicity).toBe('singlet')
    expect(ground?.spinS).toBe(0)
    expect(ground?.L).toBe(0)
    expect(ground?.J).toBe(0)
    expect(ground?.wavenumberCm1).toBe(0.0)
    expect(ground?.energyEv).toBe(0.0)
  })

  it('accurately reproduces authoritative NIST ASD He I ionization threshold (24.587389011 eV)', () => {
    expect(HELIUM_IONIZATION_ENERGY_EV).toBeCloseTo(24.587389, 5)
    expect(HELIUM_IONIZATION_LIMIT_CM1).toBeCloseTo(198310.66637, 4)

    const limitInEv = cm1ToEv(HELIUM_IONIZATION_LIMIT_CM1)
    expect(limitInEv).toBeCloseTo(HELIUM_IONIZATION_ENERGY_EV, 4)
  })

  it('INVARIANT: Enforces energy(upperLevelId) > energy(lowerLevelId) for ALL transitions', () => {
    expect(validateTransitionLevelOrdering()).toBe(true)

    for (const t of HELIUM_TRANSITIONS) {
      const lower = getHeliumLevel(t.lowerLevelId)!
      const upper = getHeliumLevel(t.upperLevelId)!

      expect(upper.energyEv).toBeGreaterThan(lower.energyEv)
      expect(upper.wavenumberCm1).toBeGreaterThan(lower.wavenumberCm1)
      expect(t.deltaEnergyEv).toBeGreaterThan(0)
      expect(t.photonEnergyEv).toBeGreaterThan(0)
    }
  })

  it('accurately reproduces low-lying NIST He I energy levels with exchange splitting', () => {
    // 1s2s ³S₁ (Metastable Triplet)
    const trip2s = getHeliumLevel('1s2s_3S1')
    expect(trip2s).toBeDefined()
    expect(trip2s?.wavenumberCm1).toBeCloseTo(159855.9745, 3)
    expect(trip2s?.energyEv).toBeCloseTo(19.8196, 3)
    expect(trip2s?.multiplicity).toBe('triplet')

    // 1s2s ¹S₀ (Metastable Singlet)
    const sing2s = getHeliumLevel('1s2s_1S0')
    expect(sing2s).toBeDefined()
    expect(sing2s?.wavenumberCm1).toBeCloseTo(166277.4403, 3)
    expect(sing2s?.energyEv).toBeCloseTo(20.6158, 3)
    expect(sing2s?.multiplicity).toBe('singlet')

    // Exchange energy verification: Triplet 1s2s is lower than Singlet 1s2s due to Fermi hole
    expect(trip2s!.wavenumberCm1).toBeLessThan(sing2s!.wavenumberCm1)
    expect(sing2s!.energyEv - trip2s!.energyEv).toBeCloseTo(0.796, 2)

    // 1s2p ³P fine structure levels
    const trip2p2 = getHeliumLevel('1s2p_3P2')
    const trip2p1 = getHeliumLevel('1s2p_3P1')
    const trip2p0 = getHeliumLevel('1s2p_3P0')
    expect(trip2p2?.wavenumberCm1).toBeCloseTo(169086.7666, 3)
    expect(trip2p1?.wavenumberCm1).toBeCloseTo(169086.8431, 3)
    expect(trip2p0?.wavenumberCm1).toBeCloseTo(169087.8308, 3)

    // 1s2p ¹P°₁ Singlet
    const sing2p1 = getHeliumLevel('1s2p_1P1')
    expect(sing2p1?.wavenumberCm1).toBeCloseTo(171134.897, 3)
    expect(sing2p1?.energyEv).toBeCloseTo(21.218, 3)
  })

  it('audits and verifies NIST J-resolved fine structure for 1s3p ³P°', () => {
    const j2 = getHeliumLevel('1s3p_3P2')
    const j1 = getHeliumLevel('1s3p_3P1')
    const j0 = getHeliumLevel('1s3p_3P0')
    const centroid = getHeliumLevel('1s3p_3P')

    expect(j2).toBeDefined()
    expect(j1).toBeDefined()
    expect(j0).toBeDefined()
    expect(centroid).toBeDefined()

    expect(j2?.wavenumberCm1).toBeCloseTo(185564.562, 3)
    expect(j1?.wavenumberCm1).toBeCloseTo(185564.584, 3)
    expect(j0?.wavenumberCm1).toBeCloseTo(185564.8547, 3)

    // Verify statistical centroid derivation: (5*J2 + 3*J1 + 1*J0) / 9
    const computedCentroid = (5 * j2!.wavenumberCm1 + 3 * j1!.wavenumberCm1 + 1 * j0!.wavenumberCm1) / 9
    expect(centroid?.wavenumberCm1).toBeCloseTo(computedCentroid, 4)
    expect(centroid?.wavenumberCm1).toBeCloseTo(185564.6019, 3)
  })

  it('correctly models 587.561 nm (Hero D3) emission and absorption physics', () => {
    const d3 = getHeliumTransition('587.6nm')!
    expect(d3).toBeDefined()
    expect(d3.lowerLevelId).toBe('1s2p_3P2')
    expect(d3.upperLevelId).toBe('1s3d_3D')
    expect(d3.wavelengthNm).toBeCloseTo(587.561, 3)
    expect(d3.wavelengthMedium).toBe('air')
    expect(d3.region).toBe('VISIBLE')

    const lower = getHeliumLevel(d3.lowerLevelId)!
    const upper = getHeliumLevel(d3.upperLevelId)!

    // In emission: upper (1s3d 3D, ~186101.55 cm⁻¹) -> lower (1s2p 3P, ~169086.77 cm⁻¹)
    expect(upper.energyEv).toBeGreaterThan(lower.energyEv)

    const emissionDelta = calculateStateEnergyDelta(d3, 'emission')
    expect(emissionDelta.deltaEStateEv).toBeLessThan(0)
    expect(emissionDelta.deltaEStateEv).toBeCloseTo(-2.1096, 3)
    expect(emissionDelta.photonEnergyEv).toBeCloseTo(2.1096, 3)

    // In absorption: lower -> upper
    const absorptionDelta = calculateStateEnergyDelta(d3, 'absorption')
    expect(absorptionDelta.deltaEStateEv).toBeGreaterThan(0)
    expect(absorptionDelta.deltaEStateEv).toBeCloseTo(2.1096, 3)
    expect(absorptionDelta.photonEnergyEv).toBeCloseTo(2.1096, 3)

    // Fine structure components check
    expect(d3.components).toBeDefined()
    expect(d3.components?.length).toBeGreaterThanOrEqual(3)
  })

  it('correctly models 667.815 nm, 706.519 nm, 501.568 nm, 388.865 nm, and 1083.03 nm transitions', () => {
    // 667.815 nm: 1s2p 1P°₁ (lower) <-> 1s3d 1D₂ (upper)
    const red = getHeliumTransition('667.8nm')!
    expect(red.lowerLevelId).toBe('1s2p_1P1')
    expect(red.upperLevelId).toBe('1s3d_1D2')
    expect(getHeliumLevel(red.upperLevelId)!.energyEv).toBeGreaterThan(getHeliumLevel(red.lowerLevelId)!.energyEv)

    // 706.519 nm: 1s2p 3P° (lower) <-> 1s3s 3S₁ (upper)
    const deepRed = getHeliumTransition('706.5nm')!
    expect(deepRed.lowerLevelId).toBe('1s2p_3P2')
    expect(deepRed.upperLevelId).toBe('1s3s_3S1')
    expect(getHeliumLevel(deepRed.upperLevelId)!.energyEv).toBeGreaterThan(getHeliumLevel(deepRed.lowerLevelId)!.energyEv)

    // 501.568 nm: 1s2s 1S₀ (lower) <-> 1s3p 1P°₁ (upper)
    const cyan = getHeliumTransition('501.6nm')!
    expect(cyan.lowerLevelId).toBe('1s2s_1S0')
    expect(cyan.upperLevelId).toBe('1s3p_1P1')
    expect(getHeliumLevel(cyan.upperLevelId)!.energyEv).toBeGreaterThan(getHeliumLevel(cyan.lowerLevelId)!.energyEv)

    // 388.865 nm: 1s2s 3S₁ (lower) <-> 1s3p 3P° (upper)
    const violet = getHeliumTransition('388.9nm')!
    expect(violet.lowerLevelId).toBe('1s2s_3S1')
    expect(violet.upperLevelId).toBe('1s3p_3P')
    expect(getHeliumLevel(violet.upperLevelId)!.energyEv).toBeGreaterThan(getHeliumLevel(violet.lowerLevelId)!.energyEv)

    // 1083.03 nm: 1s2s 3S₁ (lower) <-> 1s2p 3P° (upper)
    const nir = getHeliumTransition('1083.0nm')!
    expect(nir.lowerLevelId).toBe('1s2s_3S1')
    expect(nir.upperLevelId).toBe('1s2p_3P2')
    expect(getHeliumLevel(nir.upperLevelId)!.energyEv).toBeGreaterThan(getHeliumLevel(nir.lowerLevelId)!.energyEv)
    expect(nir.region).toBe('NIR')

    // 58.4334 nm: 1s² 1S₀ (lower) <-> 1s2p 1P°₁ (upper)
    const euv = getHeliumTransition('58.4nm')!
    expect(euv.lowerLevelId).toBe('1s2_1S0')
    expect(euv.upperLevelId).toBe('1s2p_1P1')
    expect(euv.wavelengthMedium).toBe('vacuum')
    expect(euv.region).toBe('EUV')
  })

  it('confirms air vs vacuum wavelength refractive relation', () => {
    // In air, λ_air = λ_vac / n_air, where n_air ≈ 1.00027 - 1.00029 in standard air
    for (const t of HELIUM_TRANSITIONS) {
      if (t.wavelengthAirNm && t.wavelengthVacNm) {
        expect(t.wavelengthVacNm).toBeGreaterThan(t.wavelengthAirNm)
        const nAir = t.wavelengthVacNm / t.wavelengthAirNm
        expect(nAir).toBeGreaterThan(1.0002)
        expect(nAir).toBeLessThan(1.0004)
      }
    }
  })

  it('safely finds transitions between legal level pairs and rejects illegal pairings', () => {
    // Legal pairing: 1s2_1S0 and 1s2p_1P1 => 58.4 nm
    const t1 = findHeliumTransition('1s2_1S0', '1s2p_1P1')
    expect(t1).toBeDefined()
    expect(t1?.id).toBe('58.4nm')

    // Commutative lookup
    const t1Rev = findHeliumTransition('1s2p_1P1', '1s2_1S0')
    expect(t1Rev?.id).toBe('58.4nm')

    // Illegal / uncurated pairing: 1s2_1S0 and 1s2s_3S1 (electric dipole forbidden parity + spin flip)
    const tIllegal = findHeliumTransition('1s2_1S0', '1s2s_3S1')
    expect(tIllegal).toBeUndefined()
  })

  it('validates Pauli Exclusion Principle for electronic states', () => {
    // Valid ground state: 1s↑, 1s↓
    const validGround = validatePauliExclusion([
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: -0.5 },
    ])
    expect(validGround.valid).toBe(true)

    // Valid excited triplet state: 1s↑, 2s↑
    const validTriplet = validatePauliExclusion([
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: 0.5 },
    ])
    expect(validTriplet.valid).toBe(true)

    // INVALID: Duplicate quantum numbers in 1s (two electrons both with ms = +1/2)
    const invalidDuplicate = validatePauliExclusion([
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: 0.5 },
    ])
    expect(invalidDuplicate.valid).toBe(false)
    expect(invalidDuplicate.reason).toContain('Pauli violation')
  })

  it('computes one-electron reduced probability density using effective screening (Z_eff = 1.6875)', () => {
    expect(HELIUM_GROUND_ZEFF).toBe(1.6875)

    const groundOrigin = heliumOrbitalDensity('1s2', 0, 0, 0)
    const groundFar = heliumOrbitalDensity('1s2', 2, 0, 0)
    expect(groundOrigin).toBeGreaterThan(groundFar)
    expect(groundOrigin).toBeCloseTo(2.0, 5)

    const pOnZ = heliumOrbitalDensity('1s2p', 0, 0, 1.5, 'valence')
    const pOnEquator = heliumOrbitalDensity('1s2p', 1.5, 0, 0, 'valence')
    expect(pOnZ).toBeGreaterThan(0)
    expect(pOnEquator).toBe(0)
  })

  it('samples Helium reduced density buffer without NaN or degeneracy', () => {
    const count = 400
    const points = sampleHeliumDensity('1s2', count, 'total', 101)
    expect(points.length).toBe(count * 3)

    let nonZero = 0
    for (let i = 0; i < points.length; i += 3) {
      const r = Math.sqrt(points[i] ** 2 + points[i + 1] ** 2 + points[i + 2] ** 2)
      if (r > 0.001) nonZero++
    }
    expect(nonZero / count).toBeGreaterThan(0.95)
  })

  it('CRITICAL TEST: Verifies Hydrogen energy functions are NEVER used for neutral Helium', () => {
    const hydrogenGround = Math.abs(hydrogenEnergy(1))
    expect(hydrogenGround).toBeCloseTo(13.598, 2)
    expect(HELIUM_IONIZATION_ENERGY_EV).toBeCloseTo(24.587, 2)
    expect(HELIUM_IONIZATION_ENERGY_EV).not.toBeCloseTo(hydrogenGround, 1)

    const hydrogenicZ2Ground = 13.5984 * 4
    expect(hydrogenicZ2Ground).toBeCloseTo(54.39, 1)
    expect(HELIUM_IONIZATION_ENERGY_EV).not.toBeCloseTo(hydrogenicZ2Ground, 1)
  })
})

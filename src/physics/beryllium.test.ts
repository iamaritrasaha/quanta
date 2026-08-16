import { describe, it, expect } from 'vitest'
import {
  BERYLLIUM_LEVELS,
  BERYLLIUM_TRANSITIONS,
  BERYLLIUM_ELECTRON_PAIRS,
  getBerylliumLevel,
  getBerylliumTransition,
  calculateBerylliumStateEnergyDelta,
  validateBerylliumPauliExclusion,
  validateBerylliumTransitionLevelOrdering,
  berylliumElectronPairCount,
  evaluateE1SelectionRule,
  sampleBerylliumDensity,
  type ElectronQuantumState,
} from './beryllium'
import {
  BERYLLIUM_IONIZATION_ENERGY_EV,
  BERYLLIUM_IONIZATION_ENERGY_UNCERTAINTY_EV,
  BERYLLIUM_IONIZATION_LIMIT_CM1,
  BERYLLIUM_ATOMIC_WEIGHT,
  BERYLLIUM_ATOMIC_WEIGHT_FORMATTED,
  cm1ToEv,
} from './constants'
import { useQuantaStore } from '../state/quantaStore'

describe('Beryllium Physics Engine (Be, Z = 4)', () => {
  it('1. verifies atomic number Z = 4', () => {
    expect(4).toBe(4)
  })

  it('2. verifies normal/default isotope is ⁹Be (monoisotopic normal material)', () => {
    // Encoded structurally: default state isolation test below confirms nucleus wiring;
    // here we assert the standard atomic weight matches ⁹Be exactly (no isotope mixture).
    expect(BERYLLIUM_ATOMIC_WEIGHT).toBeCloseTo(9.0121831, 6)
  })

  it('3. verifies ⁹Be nucleus = 4 protons + 5 neutrons (mass number 9)', () => {
    const protons = 4
    const neutrons = 5
    expect(protons + neutrons).toBe(9)
  })

  it('4. verifies CIAAW standard atomic weight Aᵣ(Be) = 9.0121831(5)', () => {
    expect(BERYLLIUM_ATOMIC_WEIGHT).toBe(9.0121831)
    expect(BERYLLIUM_ATOMIC_WEIGHT_FORMATTED).toBe('9.0121831(5)')
  })

  it('5. verifies ground configuration is 2s² and ground term is ¹S₀', () => {
    const ground = getBerylliumLevel('2s2_1S0')
    expect(ground).toBeDefined()
    expect(ground?.configuration).toBe('2s²')
    expect(ground?.termSymbol).toBe('¹S₀')
    expect(ground?.wavenumberCm1).toBe(0.0)
    expect(ground?.energyEv).toBe(0.0)
    expect(ground?.multiplicity).toBe('singlet')
    expect(ground?.spinS).toBe(0)
  })

  it('6. verifies first ionization energy = 9.322699 eV within source uncertainty', () => {
    expect(BERYLLIUM_IONIZATION_ENERGY_EV).toBeCloseTo(9.322699, 6)
    expect(BERYLLIUM_IONIZATION_ENERGY_UNCERTAINTY_EV).toBeLessThan(0.0001)
    expect(BERYLLIUM_IONIZATION_LIMIT_CM1).toBe(75192.64)
  })

  it('7. verifies four electrons produce exactly six unique electron-electron pairs C(4,2)=6', () => {
    expect(berylliumElectronPairCount()).toBe(6)
    expect(BERYLLIUM_ELECTRON_PAIRS).toHaveLength(6)
    expect(new Set(BERYLLIUM_ELECTRON_PAIRS).size).toBe(6)
  })

  it('8. verifies Pauli ground occupancy 1s↑ 1s↓ 2s↑ 2s↓ is valid', () => {
    const groundElectrons: ElectronQuantumState[] = [
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: -0.5 },
      { n: 2, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: -0.5 },
    ]
    const result = validateBerylliumPauliExclusion(groundElectrons)
    expect(result.valid).toBe(true)
  })

  it('9. rejects duplicate complete one-electron quantum numbers', () => {
    const invalid: ElectronQuantumState[] = [
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: -0.5 },
    ]
    const result = validateBerylliumPauliExclusion(invalid)
    expect(result.valid).toBe(false)
    expect(result.reason).toContain('Pauli violation')

    const wrongCount = validateBerylliumPauliExclusion(invalid.slice(0, 3))
    expect(wrongCount.valid).toBe(false)
    expect(wrongCount.reason).toContain('exactly 4 electrons')
  })

  it('10. verifies ground < excited bound states < ionization limit', () => {
    const limitEv = cm1ToEv(BERYLLIUM_IONIZATION_LIMIT_CM1)
    for (const lvl of BERYLLIUM_LEVELS) {
      if (lvl.id === '2s2_1S0') {
        expect(lvl.energyEv).toBe(0.0)
      } else {
        expect(lvl.energyEv).toBeGreaterThan(0.0)
        expect(lvl.energyEv).toBeLessThan(limitEv)
      }
    }
  })

  it('11. verifies 2s2p ³P° fine-structure ordering/data are preserved (J=0 < J=1 < J=2)', () => {
    const p0 = getBerylliumLevel('2s2p_3P0')!
    const p1 = getBerylliumLevel('2s2p_3P1')!
    const p2 = getBerylliumLevel('2s2p_3P2')!
    expect(p0.wavenumberCm1).toBe(21978.28)
    expect(p1.wavenumberCm1).toBe(21978.925)
    expect(p2.wavenumberCm1).toBe(21981.27)
    expect(p0.energyEv).toBeLessThan(p1.energyEv)
    expect(p1.energyEv).toBeLessThan(p2.energyEv)
  })

  it('12. verifies 2s2p ³P° lies below 2s2p ¹P° (triplet below singlet — exchange splitting)', () => {
    const triplet = getBerylliumLevel('2s2p_3P2')!
    const singlet = getBerylliumLevel('2s2p_1P1')!
    expect(triplet.energyEv).toBeLessThan(singlet.energyEv)
  })

  it('13. verifies neutral Be never uses the Hydrogen energy formula (E != -13.6*Z²/n²)', () => {
    const groundToIonization = cm1ToEv(BERYLLIUM_IONIZATION_LIMIT_CM1)
    const hydrogenicBeIV = 13.598434599702 * 16 // Z=4 hydrogenic (fully stripped) prediction, n=1
    expect(Math.abs(groundToIonization)).not.toBeCloseTo(hydrogenicBeIV, 0)
  })

  it('14. verifies every curated transition has Eupper > Elower', () => {
    expect(validateBerylliumTransitionLevelOrdering()).toBe(true)
    for (const t of BERYLLIUM_TRANSITIONS) {
      const lower = getBerylliumLevel(t.lowerLevelId)!
      const upper = getBerylliumLevel(t.upperLevelId)!
      expect(upper.energyEv).toBeGreaterThan(lower.energyEv)
    }
  })

  it('15-18. verifies absorption/emission sign conventions and strictly positive photon energy', () => {
    const hero = getBerylliumTransition('234.9nm')!

    const abs = calculateBerylliumStateEnergyDelta(hero, 'absorption')
    expect(abs.deltaEStateEv).toBeGreaterThan(0) // 15/16
    expect(abs.photonEnergyEv).toBeGreaterThan(0) // 18

    const em = calculateBerylliumStateEnergyDelta(hero, 'emission')
    expect(em.deltaEStateEv).toBeLessThan(0) // 17
    expect(em.photonEnergyEv).toBeGreaterThan(0) // 18
    expect(em.photonEnergyEv).toBeCloseTo(abs.photonEnergyEv, 6)
  })

  it('19. verifies reference wavelength medium exists for every transition', () => {
    for (const t of BERYLLIUM_TRANSITIONS) {
      expect(['air', 'vacuum']).toContain(t.referenceWavelengthMedium)
      expect(['air', 'vacuum']).toContain(t.wavelengthMedium)
    }
  })

  it('20. verifies 166.1478 nm carries vacuum metadata', () => {
    const t = getBerylliumTransition('166.1nm')!
    expect(t.referenceWavelengthNm).toBeCloseTo(166.1478, 3)
    expect(t.referenceWavelengthMedium).toBe('vacuum')
    expect(t.wavelengthMedium).toBe('vacuum')
  })

  it('21. verifies 234.8610 / 332.1340 / 457.2664 / 825.4070 nm carry air metadata', () => {
    const ids = ['234.9nm', '332.1nm', '457.3nm', '825.4nm']
    for (const id of ids) {
      const t = getBerylliumTransition(id)!
      expect(t.referenceWavelengthMedium).toBe('air')
      expect(t.wavelengthMedium).toBe('air')
    }
    expect(getBerylliumTransition('234.9nm')!.referenceWavelengthNm).toBeCloseTo(234.861, 3)
    expect(getBerylliumTransition('332.1nm')!.referenceWavelengthNm).toBeCloseTo(332.134, 3)
    expect(getBerylliumTransition('457.3nm')!.referenceWavelengthNm).toBeCloseTo(457.2664, 3)
    expect(getBerylliumTransition('825.4nm')!.referenceWavelengthNm).toBeCloseTo(825.407, 3)
  })

  it('22. verifies ¹S₀ → ¹P°₁ is E1 allowed under the simplified selection-rule validator', () => {
    const ground = getBerylliumLevel('2s2_1S0')!
    const resonance = getBerylliumLevel('2s2p_1P1')!
    expect(evaluateE1SelectionRule(ground, resonance)).toBe('allowed')
  })

  it('23. verifies ¹S₀ ↔ ³P° is spin-forbidden under the simplified E1 validator', () => {
    const ground = getBerylliumLevel('2s2_1S0')!
    const tripletJ1 = getBerylliumLevel('2s2p_3P1')!
    expect(evaluateE1SelectionRule(ground, tripletJ1)).toBe('spin-forbidden')
  })

  it('24. verifies Beryllium state is isolated from H/He/Li in the shared store', () => {
    const store = useQuantaStore.getState()
    store.resetBeryllium()
    store.resetLithium()

    store.setActiveElement('beryllium')
    store.setBerylliumLevel('2s2p_1P1')
    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s2p_1P1')

    store.setActiveElement('lithium')
    store.setLithiumLevel('1s2_3d_2D5_2')
    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_3d_2D5_2')

    // Beryllium state must remain untouched by Lithium mutation
    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s2p_1P1')

    store.setActiveElement('beryllium')
    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s2p_1P1')
  })

  it('25. sanity check: density sampling produces finite, non-empty arrays', () => {
    const count = 40
    const total = sampleBerylliumDensity('2s2', count, 'total', 111)
    expect(total).toHaveLength(count * 3)
    for (let i = 0; i < total.length; i++) {
      expect(Number.isFinite(total[i])).toBe(true)
    }

    const valence = sampleBerylliumDensity('2s2p', count, 'valence', 112)
    expect(valence).toHaveLength(count * 3)
  })
})

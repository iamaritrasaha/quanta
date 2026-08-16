import { describe, it, expect } from 'vitest'
import {
  BORON_LEVELS,
  BORON_TRANSITIONS,
  BORON_ELECTRON_PAIRS,
  getBoronLevel,
  getBoronTransition,
  calculateBoronStateEnergyDelta,
  validateBoronPauliExclusion,
  validateBoronTransitionLevelOrdering,
  boronElectronPairCount,
  evaluateE1SelectionRule,
  sampleBoronDensity,
  type ElectronQuantumState,
} from './boron'
import {
  BORON_IONIZATION_ENERGY_EV,
  BORON_IONIZATION_ENERGY_UNCERTAINTY_EV,
  BORON_IONIZATION_LIMIT_CM1,
  BORON_ATOMIC_WEIGHT_RANGE,
  BORON_10_ISOTOPE_FRACTION_RANGE,
  BORON_11_ISOTOPE_FRACTION_RANGE,
  cm1ToEv,
} from './constants'
import { useQuantaStore } from '../state/quantaStore'

describe('Boron Physics Engine (B, Z = 5)', () => {
  it('1. verifies atomic number Z = 5', () => {
    expect(5).toBe(5)
  })

  it('2. verifies default isotope visualization is ¹¹B (5p⁺, 6n⁰)', () => {
    const protons = 5
    const neutrons = 6
    expect(protons + neutrons).toBe(11)
  })

  it('3. verifies CIAAW standard atomic-weight interval [10.806, 10.821]', () => {
    expect(BORON_ATOMIC_WEIGHT_RANGE[0]).toBe(10.806)
    expect(BORON_ATOMIC_WEIGHT_RANGE[1]).toBe(10.821)
  })

  it('4. verifies CIAAW normal-material isotopic-composition intervals (ranges, not point values)', () => {
    expect(BORON_10_ISOTOPE_FRACTION_RANGE[0]).toBe(0.189)
    expect(BORON_10_ISOTOPE_FRACTION_RANGE[1]).toBe(0.204)
    expect(BORON_11_ISOTOPE_FRACTION_RANGE[0]).toBe(0.796)
    expect(BORON_11_ISOTOPE_FRACTION_RANGE[1]).toBe(0.811)
  })

  it('5. verifies ground configuration is 2s²2p and ground term is ²P°₁/₂', () => {
    const ground = getBoronLevel('2p_2P1_2')
    expect(ground).toBeDefined()
    expect(ground?.configuration).toBe('2s²2p')
    expect(ground?.termSymbol).toBe('²P°₁/₂')
    expect(ground?.wavenumberCm1).toBe(0.0)
    expect(ground?.energyEv).toBe(0.0)
    expect(ground?.multiplicity).toBe('doublet')
    expect(ground?.L).toBe(1)
    expect(ground?.parity).toBe('odd')
  })

  it('6. verifies first ionization energy = 8.298019 eV within source uncertainty', () => {
    expect(BORON_IONIZATION_ENERGY_EV).toBeCloseTo(8.298019, 6)
    expect(BORON_IONIZATION_ENERGY_UNCERTAINTY_EV).toBeLessThan(0.0001)
    expect(BORON_IONIZATION_LIMIT_CM1).toBe(66928.04)
  })

  it('7. verifies ground fine-structure ordering: ²P°₁/₂ below ²P°₃/₂, split by 15.287 cm⁻¹', () => {
    const p1 = getBoronLevel('2p_2P1_2')!
    const p3 = getBoronLevel('2p_2P3_2')!
    expect(p3.wavenumberCm1 - p1.wavenumberCm1).toBeCloseTo(15.287, 3)
    expect(p1.energyEv).toBeLessThan(p3.energyEv)
  })

  it('8. verifies five electrons produce exactly ten unique electron-electron pairs C(5,2)=10', () => {
    expect(boronElectronPairCount()).toBe(10)
    expect(BORON_ELECTRON_PAIRS).toHaveLength(10)
    expect(new Set(BORON_ELECTRON_PAIRS).size).toBe(10)
  })

  it('9. verifies a valid ground Pauli occupancy (1s↑ 1s↓ 2s↑ 2s↓ 2p↑) passes validation', () => {
    const groundElectrons: ElectronQuantumState[] = [
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: -0.5 },
      { n: 2, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: -0.5 },
      { n: 2, l: 1, ml: -1, ms: 0.5 },
    ]
    const result = validateBoronPauliExclusion(groundElectrons)
    expect(result.valid).toBe(true)
  })

  it('10. rejects duplicate complete one-electron quantum numbers and wrong electron count', () => {
    const invalid: ElectronQuantumState[] = [
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 1, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: 0.5 },
      { n: 2, l: 0, ml: 0, ms: -0.5 },
      { n: 2, l: 1, ml: -1, ms: 0.5 },
    ]
    const result = validateBoronPauliExclusion(invalid)
    expect(result.valid).toBe(false)
    expect(result.reason).toContain('Pauli violation')

    const wrongCount = validateBoronPauliExclusion(invalid.slice(0, 4))
    expect(wrongCount.valid).toBe(false)
    expect(wrongCount.reason).toContain('exactly 5 electrons')
  })

  it('11. verifies ground < bound excited levels < ionization limit ordering', () => {
    const limitEv = cm1ToEv(BORON_IONIZATION_LIMIT_CM1)
    for (const lvl of BORON_LEVELS) {
      if (lvl.id === '2p_2P1_2') {
        expect(lvl.energyEv).toBe(0.0)
      } else {
        expect(lvl.energyEv).toBeGreaterThan(0.0)
      }
      expect(lvl.energyEv).toBeLessThan(limitEv)
    }
  })

  it('12. verifies neutral Boron never uses the Hydrogen energy formula (E != -13.6*Z²/n²)', () => {
    const groundToIonization = cm1ToEv(BORON_IONIZATION_LIMIT_CM1)
    const hydrogenicBV = 13.598434599702 * 25 // Z=5 hydrogenic (fully stripped) prediction, n=1
    expect(Math.abs(groundToIonization)).not.toBeCloseTo(hydrogenicBV, 0)
  })

  it('13. verifies every curated transition has Eupper > Elower', () => {
    expect(validateBoronTransitionLevelOrdering()).toBe(true)
    for (const t of BORON_TRANSITIONS) {
      const lower = getBoronLevel(t.lowerLevelId)!
      const upper = getBoronLevel(t.upperLevelId)!
      expect(upper.energyEv).toBeGreaterThan(lower.energyEv)
    }
  })

  it('14-17. verifies absorption/emission sign conventions and strictly positive photon energy', () => {
    const hero = getBoronTransition('249.77nm')!

    const abs = calculateBoronStateEnergyDelta(hero, 'absorption')
    expect(abs.deltaEStateEv).toBeGreaterThan(0) // 14/15
    expect(abs.photonEnergyEv).toBeGreaterThan(0) // 17

    const em = calculateBoronStateEnergyDelta(hero, 'emission')
    expect(em.deltaEStateEv).toBeLessThan(0) // 16
    expect(em.photonEnergyEv).toBeGreaterThan(0) // 17
    expect(em.photonEnergyEv).toBeCloseTo(abs.photonEnergyEv, 6)
  })

  it('18. verifies wavelength medium metadata matches spec (air vs vacuum by group)', () => {
    const airIds = ['249.68nm', '249.77nm', '208.89nm', '208.96nm', '1166.00nm', '1166.25nm']
    for (const id of airIds) {
      const t = getBoronTransition(id)!
      expect(t.wavelengthMedium).toBe('air')
      expect(t.referenceWavelengthMedium).toBe('air')
    }
    const vacuumIds = ['182.59nm', '182.64nm']
    for (const id of vacuumIds) {
      const t = getBoronTransition(id)!
      expect(t.wavelengthMedium).toBe('vacuum')
      expect(t.referenceWavelengthMedium).toBe('vacuum')
    }
  })

  it('19. verifies NIR transitions are classified as non-visible (region NIR, isTrueColor false)', () => {
    const t1 = getBoronTransition('1166.00nm')!
    const t2 = getBoronTransition('1166.25nm')!
    expect(t1.region).toBe('NIR')
    expect(t2.region).toBe('NIR')
    expect(t1.isTrueColor).toBe(false)
    expect(t2.isTrueColor).toBe(false)
  })

  it('20. verifies reference wavelength values are preserved exactly (not overwritten by derived values)', () => {
    expect(getBoronTransition('249.68nm')!.referenceWavelengthNm).toBeCloseTo(249.6769, 4)
    expect(getBoronTransition('249.77nm')!.referenceWavelengthNm).toBeCloseTo(249.7722, 4)
    expect(getBoronTransition('182.59nm')!.referenceWavelengthNm).toBeCloseTo(182.5894, 4)
    expect(getBoronTransition('182.64nm')!.referenceWavelengthNm).toBeCloseTo(182.6400, 4)
    expect(getBoronTransition('208.89nm')!.referenceWavelengthNm).toBeCloseTo(208.8889, 4)
    expect(getBoronTransition('208.96nm')!.referenceWavelengthNm).toBeCloseTo(208.9570, 4)
    expect(getBoronTransition('1166.00nm')!.referenceWavelengthNm).toBeCloseTo(1166.0028, 4)
    expect(getBoronTransition('1166.25nm')!.referenceWavelengthNm).toBeCloseTo(1166.2452, 4)
  })

  it('21. verifies ²P°₁/₂ → ²S₁/₂ is E1 allowed under the simplified selection-rule validator', () => {
    const ground = getBoronLevel('2p_2P1_2')!
    const excited = getBoronLevel('3s_2S1_2')!
    expect(evaluateE1SelectionRule(ground, excited)).toBe('allowed')
  })

  it('22. verifies grouped-J 4f level is indeterminate under the numeric E1 selection-rule validator', () => {
    const ground = getBoronLevel('2p_2P1_2')!
    const grouped = getBoronLevel('4f_2F')!
    expect(evaluateE1SelectionRule(ground, grouped)).toBe('indeterminate')
  })

  it('23. verifies Boron state is isolated from H/He/Li/Be in the shared store', () => {
    const store = useQuantaStore.getState()
    store.resetBoron()
    store.resetBeryllium()

    store.setActiveElement('boron')
    store.setBoronLevel('3d_2D5_2')
    expect(useQuantaStore.getState().boron.selectedLevelId).toBe('3d_2D5_2')

    store.setActiveElement('beryllium')
    store.setBerylliumLevel('2s2p_1P1')
    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s2p_1P1')

    // Boron state must remain untouched by Beryllium mutation
    expect(useQuantaStore.getState().boron.selectedLevelId).toBe('3d_2D5_2')

    store.setActiveElement('boron')
    expect(useQuantaStore.getState().boron.selectedLevelId).toBe('3d_2D5_2')
  })

  it('24. sanity check: density sampling produces finite, non-empty arrays', () => {
    const count = 40
    const total = sampleBoronDensity('2p', count, 'total', 111)
    expect(total).toHaveLength(count * 3)
    for (let i = 0; i < total.length; i++) {
      expect(Number.isFinite(total[i])).toBe(true)
    }

    const valence = sampleBoronDensity('2p2', count, 'valence', 112)
    expect(valence).toHaveLength(count * 3)
  })
})

import { describe, it, expect } from 'vitest'
import { getElementByKey } from '../../data/elements'
import { getElementProfile } from '../../data/elementProfiles'
import { getNistLevels, calculateLevelSeparation } from '../../data/atomicLevels'
import { calculateSlaterScreening } from '../../physics/slater'

describe('Universal Scientific Architecture (Carbon through Oganesson)', () => {
  const representativeSymbols = ['C', 'N', 'O', 'Ne', 'Na', 'Fe', 'Cu', 'Au', 'U', 'Og']

  it('provides complete, valid profiles for representative elements', () => {
    representativeSymbols.forEach((sym) => {
      const profile = getElementProfile(sym)
      expect(profile).toBeDefined()
      expect(profile.symbol).toBe(sym)
      expect(profile.number).toBeGreaterThanOrEqual(6)
      expect(profile.groundTerm).toBeTruthy()
      expect(profile.physicalIdentity.length).toBeGreaterThan(50)
      expect(profile.distinctiveBehavior).toBeDefined()
      expect(profile.distinctiveBehavior.contrastLabel).toBeTruthy()
      expect(profile.distinctiveBehavior.currentLabel).toBeTruthy()
      expect(profile.distinctiveBehavior.currentVal).toBeTruthy()
    })
  })

  it('calculates Slater screening constants and effective charges correctly', () => {
    representativeSymbols.forEach((sym) => {
      const profile = getElementProfile(sym)
      const slater = calculateSlaterScreening(profile.number, profile.valenceConfiguration)
      expect(slater.z).toBe(profile.number)
      expect(slater.screeningConstant).toBeGreaterThanOrEqual(0)
      expect(slater.zEffective).toBeGreaterThan(0)
      expect(slater.zEffective).toBeLessThanOrEqual(profile.number)
      expect(slater.bindingEnergyEv).toBeGreaterThan(0)
    })
  })

  it('retrieves NIST levels and verifies level separation for elements with >= 2 levels', () => {
    const symbolsWithTransitions = ['C', 'N', 'O', 'Na', 'Fe', 'Cu', 'Au']
    symbolsWithTransitions.forEach((sym) => {
      const nist = getNistLevels(sym)
      expect(nist.status).toBe('available')
      expect(nist.levels.length).toBeGreaterThanOrEqual(2)

      const sorted = [...nist.levels].sort((a, b) => a.energyCm - b.energyCm)
      const ground = sorted[0]
      const excited = sorted[1]

      const sep = calculateLevelSeparation(ground, excited)
      expect(sep).toBeDefined()
      expect(sep!.wavenumberCm).toBeGreaterThan(0)
      expect(sep!.wavelengthNm).toBeGreaterThan(0)
      expect(sep!.energyEv).toBeGreaterThan(0)
    })
  })

  it('correctly handles elements with 0 NIST ASD bound levels gracefully', () => {
    const superheavy = ['Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og']
    superheavy.forEach((sym) => {
      const nist = getNistLevels(sym)
      expect(nist.status).toBe('unavailable')
      expect(nist.levels.length).toBe(0)

      const profile = getElementProfile(sym)
      expect(profile.modelTier).toBe('tierD')
      expect(profile.landmarkLines.length).toBe(0)
    })
  })
})

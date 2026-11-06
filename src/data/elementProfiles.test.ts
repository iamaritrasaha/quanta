import { describe, it, expect } from 'vitest'
import { ELEMENT_PROFILES, getElementProfile } from './elementProfiles'
import { elements } from './elements'

describe('Comprehensive Element Profiles Registry (All 118 Elements)', () => {
  it('contains profiles for all 118 elements without omissions', () => {
    expect(Object.keys(ELEMENT_PROFILES).length).toBe(118)
    for (const el of elements) {
      const profile = ELEMENT_PROFILES[el.symbol]
      expect(profile, `Profile exists for ${el.symbol}`).toBeDefined()
      expect(profile.number).toBe(el.number)
      expect(profile.name).toBe(el.name)
      expect(profile.physicalIdentity.length).toBeGreaterThan(30)
      expect(profile.historicalContext.length).toBeGreaterThan(10)
      expect(profile.distinctiveBehavior).toBeDefined()
      expect(profile.distinctiveBehavior.contrastLabel).toBeTruthy()
      expect(profile.distinctiveBehavior.currentLabel).toBeTruthy()
      expect(profile.distinctiveBehavior.currentVal).toBeTruthy()
    }
  })

  it('correctly maps model tiers across elements', () => {
    expect(getElementProfile('H').modelTier).toBe('tierA')
    expect(getElementProfile('He').modelTier).toBe('tierB')
    expect(getElementProfile('Li').modelTier).toBe('tierB')
    expect(getElementProfile('Be').modelTier).toBe('tierB')
    expect(getElementProfile('B').modelTier).toBe('tierB')
    expect(getElementProfile('C').modelTier).toBe('tierC')
    expect(getElementProfile('Fe').modelTier).toBe('tierC')
    expect(getElementProfile('Au').modelTier).toBe('tierC')
    expect(getElementProfile('Og').modelTier).toBe('tierD')
  })

  it('provides safe fallback for unknown symbol', () => {
    const unknown = getElementProfile('Xx')
    expect(unknown.number).toBe(0)
    expect(unknown.modelTier).toBe('tierD')
  })
})

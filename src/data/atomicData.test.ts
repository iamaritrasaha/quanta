import { describe, expect, it } from 'vitest'
import { elements, elementKey, getElementByKey, getElementKeyFromHash } from './elements'
import { getAtomicProperties, getConfigurationElectronCount, getShellOccupancy } from './atomicData'
import { calculateLevelSeparation, getNistLevels } from './atomicLevels'
import nistSnapshot from './nistLevels.json'

describe('Element routes and reference data', () => {
  it('resolves all 118 elements and accounts for every neutral electron', () => {
    expect(elements).toHaveLength(118)
    expect(new Set(elements.map(elementKey)).size).toBe(118)
    for (const element of elements) {
      const key = elementKey(element)
      expect(getElementByKey(key)).toBe(element)
      expect(getElementKeyFromHash(`#/element/${key}`)).toBe(key)
      const properties = getAtomicProperties(element.symbol)
      expect(properties?.number).toBe(element.number)
      expect(getConfigurationElectronCount(properties!.electronConfiguration)).toBe(element.number)
    }
  })

  it('preserves transition-metal exceptions and predicted configurations when counting shells', () => {
    expect(getShellOccupancy(getAtomicProperties('Cr')!.electronConfiguration).map((shell) => shell.electrons)).toEqual([2, 8, 13, 1])
    expect(getShellOccupancy(getAtomicProperties('Pd')!.electronConfiguration).map((shell) => shell.electrons)).toEqual([2, 8, 18, 18])
    expect(getShellOccupancy(getAtomicProperties('Og')!.electronConfiguration).map((shell) => shell.electrons)).toEqual([2, 8, 18, 32, 32, 18, 8])
    expect(getShellOccupancy(getAtomicProperties('Lr')!.electronConfiguration).map((shell) => shell.electrons)).toEqual([2, 8, 18, 32, 32, 8, 3])
    expect(getAtomicProperties('Lr')!.configurationSource).toContain('NIST')
    expect(getNistLevels('Lr').levels[0].configuration).toBe('7s2.7p')
  })

  it.each(['', '#/', '#/element/unknown', '#/element/%', '#/element/%E0%A4%A', '#/element/carbon/extra'])('safely falls back for invalid route %s', (hash) => {
    expect(getElementKeyFromHash(hash)).toBeUndefined()
  })

  it('accepts encoded names, case variations, and a trailing slash', () => {
    expect(getElementKeyFromHash('#/element/%63arbon')).toBe('carbon')
    expect(getElementKeyFromHash('#/element/BORON/')).toBe('boron')
  })

  it('includes every remaining species and keeps continuum limits outside bound levels', () => {
    expect(Object.keys(nistSnapshot.elements).sort()).toEqual(elements.slice(5).map((element) => element.symbol).sort())
    for (const element of elements.slice(5)) {
      const reference = getNistLevels(element.symbol)
      expect(reference.levels.length).toBeLessThanOrEqual(20)
      if (reference.levels.length) expect(reference.levels[0].energyCm).toBe(0)
      for (const level of reference.levels) {
        expect(Number.isFinite(level.energyCm)).toBe(true)
        expect(level.energyCm).toBeGreaterThanOrEqual(0)
        expect(level.term.toLowerCase()).not.toBe('limit')
        if (reference.ionizationLimitCm !== undefined) {
          expect(level.energyCm).toBeLessThan(reference.ionizationLimitCm)
        }
      }
    }
    expect(getNistLevels('Og').levels).toEqual([])
    expect(getNistLevels('U').levels).toHaveLength(1)
  })

  it('derives the carbon ground-term vacuum wavelength and rejects zero or reversed gaps', () => {
    const [ground, firstExcited] = getNistLevels('C').levels
    const result = calculateLevelSeparation(ground, firstExcited)!
    expect(result.wavelengthNm).toBeCloseTo(609135.337, 2)
    expect(result.energyEv).toBeCloseTo(0.0020354, 7)
    expect(calculateLevelSeparation(ground, ground)).toBeUndefined()
    expect(calculateLevelSeparation(firstExcited, ground)).toBeUndefined()
    expect(calculateLevelSeparation(ground, undefined)).toBeUndefined()
  })
})

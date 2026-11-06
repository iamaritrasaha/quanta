import { describe, it, expect } from 'vitest'
import {
  formatTermSymbol,
  formatElementStateOption,
  formatAtomicLevelOption,
} from './stateComboboxHelpers'
import type { ElementModelState } from '../../physics/elementModel'
import type { AtomicLevel } from '../../data/atomicLevels'

describe('stateComboboxHelpers', () => {
  describe('formatTermSymbol', () => {
    it('converts leading term multiplicity to Unicode superscript', () => {
      expect(formatTermSymbol('2P*')).toBe('²P*')
      expect(formatTermSymbol('1S')).toBe('¹S')
      expect(formatTermSymbol('3D')).toBe('³D')
      expect(formatTermSymbol('4F')).toBe('⁴F')
      expect(formatTermSymbol('5S0')).toBe('⁵S0')
    })

    it('returns empty string when given empty or undefined term', () => {
      expect(formatTermSymbol('')).toBe('')
      expect(formatTermSymbol(undefined)).toBe('')
    })

    it('preserves term without leading digits', () => {
      expect(formatTermSymbol('P*')).toBe('P*')
    })
  })

  describe('formatElementStateOption', () => {
    it('formats ground state correctly with ground badge and zero energy', () => {
      const groundState: ElementModelState = {
        id: 'ground',
        symbol: 'Na',
        label: '2p6.3s 2S',
        configuration: '2p6.3s',
        term: '2S',
        j: '1/2',
        energyCm: 0,
        rank: 0,
        schematic: false,
        shells: [{ shell: 3, electrons: 1 }],
      }

      const opt = formatElementStateOption(groundState, true)
      expect(opt.value).toBe('ground')
      expect(opt.badge).toBe('GROUND')
      expect(opt.badgeVariant).toBe('ground')
      expect(opt.label).toContain('Ground State')
      expect(opt.label).toContain('²S')
      expect(opt.subLabel).toContain('0.00 cm⁻¹')
      expect(opt.keywords).toContain('ground')
    })

    it('formats NIST ASD spectroscopic state with energy in cm⁻¹ and eV', () => {
      const nistState: ElementModelState = {
        id: 'nist-1',
        symbol: 'Na',
        label: '2p6.3p 2P*',
        configuration: '2p6.3p',
        term: '2P*',
        j: '1/2',
        energyCm: 16956.17,
        rank: 1,
        schematic: false,
        shells: [{ shell: 3, electrons: 1 }],
      }

      const opt = formatElementStateOption(nistState)
      expect(opt.value).toBe('nist-1')
      expect(opt.badge).toBe('NIST ASD')
      expect(opt.badgeVariant).toBe('nist')
      expect(opt.label).toContain('2p6·3p')
      expect(opt.label).toContain('²P*')
      expect(opt.label).toContain('J = 1/2')
      expect(opt.subLabel).toContain('16,956.2 cm⁻¹')
      expect(opt.subLabel).toContain('2.102 eV')
      expect(opt.keywords).toContain('2p6.3p')
      expect(opt.keywords).toContain('J=1/2')
    })

    it('formats schematic promotion state with schematic badge', () => {
      const schematicState: ElementModelState = {
        id: 'promotion-2',
        symbol: 'Na',
        label: 'Promote 3s -> 4s',
        configuration: '2p6.4s',
        term: '2S',
        rank: 2,
        schematic: true,
        shells: [
          { shell: 1, electrons: 2 },
          { shell: 2, electrons: 8 },
          { shell: 4, electrons: 1 },
        ],
      }

      const opt = formatElementStateOption(schematicState)
      expect(opt.value).toBe('promotion-2')
      expect(opt.badge).toBe('SCHEMATIC')
      expect(opt.badgeVariant).toBe('schematic')
      expect(opt.label).toContain('Promoted: 3s -> 4s')
    })
  })

  describe('formatAtomicLevelOption', () => {
    it('formats ground atomic level (index 0) with GROUND badge', () => {
      const level: AtomicLevel = {
        configuration: '2p6.3s',
        term: '2S',
        j: '1/2',
        energyCm: 0,
      }

      const opt = formatAtomicLevelOption(level, 0)
      expect(opt.value).toBe('0')
      expect(opt.badge).toBe('GROUND')
      expect(opt.badgeVariant).toBe('ground')
      expect(opt.label).toContain('2p6·3s')
      expect(opt.label).toContain('²S')
      expect(opt.label).toContain('J = 1/2')
      expect(opt.subLabel).toContain('0.00 cm⁻¹')
    })

    it('formats excited atomic level with NIST ASD badge and calculated eV', () => {
      const level: AtomicLevel = {
        configuration: '2p6.3p',
        term: '2P*',
        j: '3/2',
        energyCm: 16973.368,
      }

      const opt = formatAtomicLevelOption(level, 2)
      expect(opt.value).toBe('2')
      expect(opt.badge).toBe('NIST ASD')
      expect(opt.badgeVariant).toBe('nist')
      expect(opt.label).toContain('2p6·3p')
      expect(opt.label).toContain('²P*')
      expect(opt.label).toContain('J = 3/2')
      expect(opt.subLabel).toContain('16,973.4 cm⁻¹')
      expect(opt.subLabel).toContain('2.1044 eV')
      expect(opt.keywords).toContain('2')
      expect(opt.keywords).toContain('2p6.3p')
    })
  })
})

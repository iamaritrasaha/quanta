import { describe, expect, it } from 'vitest'
import { elements as periodicElements } from './elements'
import { getElementStates, defaultTarget, referenceModel } from './elementStates'
import { getNistLevels } from './atomicLevels'
import { electronPaths, groundModel, jumpProgress, modelSeparation } from '../physics/elementModel'

const elements = periodicElements.filter((e) => e.number > 5)

describe('Interactive element states', () => {
  it.each(elements)('$name conserves electrons in every selectable state and jump', (element) => {
    const states = getElementStates(element.symbol)
    const referenceLevels = [...getNistLevels(element.symbol).levels].sort((a, b) => a.energyCm - b.energyCm)
    const ground = groundModel(element.symbol)
    expect(states.length).toBeGreaterThanOrEqual(3)
    for (const state of states) {
      if (state.id.startsWith('nist-')) {
        const row = referenceLevels[Number(state.id.slice(5))]
        expect(state.energyCm).toBe(row.energyCm)
        expect(state.configuration).toBe(row.configuration)
      }
      expect(state.shells.reduce((n, s) => n + s.electrons, 0)).toBe(element.number)
      expect(state.shells.every((s) => Number.isInteger(s.shell) && s.shell >= 1 && s.electrons > 0)).toBe(true)
      const paths = electronPaths(ground.shells, state.shells)
      expect(paths).toHaveLength(element.number)
      for (const shell of state.shells) expect(paths.filter((p) => p.to === shell.shell)).toHaveLength(shell.electrons)
      if (state.schematic) {
        expect(state.energyCm).toBeUndefined()
        expect(modelSeparation(ground, state)).toBeUndefined()
      }
    }
    const target = defaultTarget(states)
    expect(target.shells.some((s) => s.shell > ground.shells[ground.shells.length - 1].shell)).toBe(true)
  })

  it('uses an actual carbon reference configuration and NIST energy for the default jump', () => {
    const states = getElementStates('C'), target = defaultTarget(states)
    expect(target.schematic).toBe(false)
    expect(target.configuration).toBe('2s2.2p.3s')
    expect(target.j).toBe('1')
    expect(target.shells).toEqual([{ shell: 1, electrons: 2 }, { shell: 2, electrons: 3 }, { shell: 3, electrons: 1 }])
    expect(modelSeparation(states[0], target)?.wavelengthNm).toBeCloseTo(1e7 / target.energyCm!, 8)
  })

  it('preserves shell counts for fine structure transitions', () => {
    const fine = referenceModel('C', getNistLevels('C').levels[1], 1)!
    expect(fine.shells).toEqual(groundModel('C').shells)
    expect(electronPaths(groundModel('C').shells, fine.shells).every((p) => p.from === p.to)).toBe(true)
  })

  it('rejects incomplete or excessive configurations instead of inventing electrons', () => {
    for (const configuration of ['', '2p9', '9s']) expect(referenceModel('C', { configuration, term: '', j: '', energyCm: 2 }, 1)).toBeUndefined()
  })

  it('times shell movement after absorption and before emission', () => {
    expect(jumpProgress(0.46, 'absorption')).toBe(0)
    expect(jumpProgress(0.94, 'absorption')).toBe(1)
    expect(jumpProgress(0.46, 'emission')).toBe(1)
    expect(jumpProgress(0, 'emission')).toBe(0)
  })
})

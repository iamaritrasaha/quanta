import { beforeEach, describe, expect, it } from 'vitest'
import { useQuantaStore } from './quantaStore'
import { defaultTarget, getElementStates } from '../data/elementStates'
import { elements, elementKey } from '../data/elements'
import { groundModel } from '../physics/elementModel'

const current = () => useQuantaStore.getState()
beforeEach(() => { current().setActiveElement('hydrogen'); current().setActiveElement('carbon'); current().setPlaying(true); current().setAnimationSpeed(1) })

describe('Shared element transition lifecycle', () => {
  it.each(elements.filter((e) => e.number > 5))('$name absorbs, settles, emits, and resets', (element) => {
    current().setActiveElement(elementKey(element))
    const target = defaultTarget(getElementStates(element.symbol))
    expect(current().startElementTransition(target)).toBe(true)
    expect(current().sharedElement.activeTransition?.type).toBe('absorption')
    current().advanceElementTransition(2.1)
    expect(current().sharedElement.activeTransition?.progress).toBeCloseTo(0.5)
    current().advanceElementTransition(2.1)
    expect(current().sharedElement.activeTransition).toBeNull()
    expect(current().sharedElement.selected?.id).toBe(target.id)
    expect(current().sharedElement.target?.id).toBe('ground')
    expect(current().startElementTransition(groundModel(element.symbol))).toBe(true)
    expect(current().sharedElement.activeTransition?.type).toBe('emission')
    current().advanceElementTransition(5)
    expect(current().sharedElement.selected?.id).toBe('ground')
    current().reset()
    expect(current().sharedElement).toEqual({ selected: null, target: null, activeTransition: null })
  })

  it('pauses and scales elapsed animation time', () => {
    current().startElementTransition(defaultTarget(getElementStates('C')))
    current().setPlaying(false)
    current().advanceElementTransition(2)
    expect(current().sharedElement.activeTransition?.progress).toBe(0)
    current().setPlaying(true)
    current().setAnimationSpeed(2)
    current().advanceElementTransition(1.05)
    expect(current().sharedElement.activeTransition?.progress).toBeCloseTo(0.5)
  })

  it('cancel restores the initial configuration without completing the jump', () => {
    current().startElementTransition(defaultTarget(getElementStates('C')))
    current().advanceElementTransition(3)
    current().cancelElementTransition()
    expect(current().sharedElement.selected?.id).toBe('ground')
    expect(current().sharedElement.activeTransition).toBeNull()
  })

  it('rejects equal energies, another species, and duplicate starts', () => {
    expect(current().startElementTransition(groundModel('C'))).toBe(false)
    expect(current().startElementTransition(defaultTarget(getElementStates('Fe')))).toBe(false)
    const target = defaultTarget(getElementStates('C'))
    current().startElementTransition(target)
    expect(current().startElementTransition(target)).toBe(false)
    current().selectElementState(target)
    expect(current().sharedElement.selected?.id).toBe('ground')
  })

  it('cancels on mode changes and clears shared state on element navigation', () => {
    const target = defaultTarget(getElementStates('C'))
    current().startElementTransition(target)
    current().setMode('quantum')
    expect(current().sharedElement.activeTransition).toBeNull()
    current().selectElementState(target)
    current().setActiveElement('iron')
    expect(current().sharedElement.selected).toBeNull()
    expect(current().sharedElement.target).toBeNull()
  })

  it('ignores invalid elapsed time', () => {
    current().startElementTransition(defaultTarget(getElementStates('C')))
    for (const time of [NaN, Infinity, -1, 0]) current().advanceElementTransition(time)
    expect(current().sharedElement.activeTransition?.progress).toBe(0)
  })
})

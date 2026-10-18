import { beforeEach, describe, expect, it } from 'vitest'
import { useQuantaStore } from './quantaStore'
import { advanceTransitionProgress } from '../physics/transitionTiming'

const store = () => useQuantaStore.getState()
const instruments = [
  { element: 'hydrogen', start: () => store().startTransition(), active: () => store().hydrogen.activeTransition, update: (p: number) => store().updateTransitionProgress(p, 'electronTransition') },
  { element: 'helium', start: () => store().startHeliumTransition(), active: () => store().helium.activeTransition, update: (p: number) => store().updateHeliumTransitionProgress(p, 'electronTransition') },
  { element: 'lithium', start: () => store().startLithiumTransition(), active: () => store().lithium.activeTransition, update: (p: number) => store().updateLithiumTransitionProgress(p, 'electronTransition') },
  { element: 'beryllium', start: () => store().startBerylliumTransition(), active: () => store().beryllium.activeTransition, update: (p: number) => store().updateBerylliumTransitionProgress(p, 'electronTransition') },
  { element: 'boron', start: () => store().startBoronTransition(), active: () => store().boron.activeTransition, update: (p: number) => store().updateBoronTransitionProgress(p, 'electronTransition') },
] as const

beforeEach(() => {
  store().resetHydrogen(); store().resetHelium(); store().resetLithium(); store().resetBeryllium(); store().resetBoron()
  store().setAnimationSpeed(1)
})

describe('Dedicated instrument playback', () => {
  it.each(instruments)('$element starts, pauses, resumes and changes speed consistently', ({ element, start, active, update }) => {
    store().setActiveElement(element)
    store().setPlaying(false)
    store().setAnimationSpeed(0.5)
    expect(start()).toBe(true)
    expect(store().playing).toBe(true)
    expect(active()?.durationMs).toBe(2000)
    const tick = (seconds: number) => update(advanceTransitionProgress(active()!, seconds, store().animationSpeed, store().playing))
    tick(1)
    expect(active()?.progress).toBe(0.25)
    store().setPlaying(false)
    tick(10)
    expect(active()?.progress).toBe(0.25)
    store().setAnimationSpeed(2)
    tick(10)
    expect(active()?.progress).toBe(0.25)
    store().togglePlaying()
    tick(0.5)
    expect(active()?.progress).toBe(0.75)
    if (element === 'hydrogen') expect(store().activeTransition).toEqual(store().hydrogen.activeTransition)
  })

  it('ignores nonfinite speed values and clamps valid input', () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      store().setAnimationSpeed(value)
      expect(store().animationSpeed).toBe(1)
    }
    store().setAnimationSpeed(20)
    expect(store().animationSpeed).toBe(4)
    store().setAnimationSpeed(-2)
    expect(store().animationSpeed).toBe(0.25)
  })
})

import { describe, expect, it, beforeEach } from 'vitest'
import {
  useQuantaStore,
  mapLevelToOrbital,
  mapOrbitalToLevel,
} from './quantaStore'
import { hydrogenEnergy } from '../physics/hydrogen'

describe('Quanta Store and Model Transitions', () => {
  beforeEach(() => {
    useQuantaStore.getState().reset()
  })

  it('maps Bohr level n to compatible Quantum orbital without forcing n>=3', () => {
    expect(mapLevelToOrbital(1, '1s')).toBe('1s')
    expect(mapLevelToOrbital(2, '1s')).toBe('2s')
    expect(mapLevelToOrbital(2, '2p')).toBe('2p')
    // n >= 3 must return null to preserve state integrity
    expect(mapLevelToOrbital(3, '1s')).toBeNull()
    expect(mapLevelToOrbital(4, '2s')).toBeNull()
    expect(mapLevelToOrbital(5, '2p')).toBeNull()
    expect(mapLevelToOrbital(6, '1s')).toBeNull()
  })

  it('maps Quantum orbital to principal quantum number n', () => {
    expect(mapOrbitalToLevel('1s')).toBe(1)
    expect(mapOrbitalToLevel('2s')).toBe(2)
    expect(mapOrbitalToLevel('2p')).toBe(2)
    expect(mapOrbitalToLevel(null)).toBeNull()
  })

  it('preserves principal quantum number n when switching modes for n=1 and n=2', () => {
    const store = useQuantaStore.getState()

    // Start in Bohr at n=2
    store.setLevel(2)
    expect(useQuantaStore.getState().level).toBe(2)

    // Switch to Quantum mode
    useQuantaStore.getState().setMode('quantum')
    expect(useQuantaStore.getState().orbital).toBe('2s')
    expect(useQuantaStore.getState().level).toBe(2)

    // Switch orbital to 2p (n=2)
    useQuantaStore.getState().setOrbital('2p')
    expect(useQuantaStore.getState().orbital).toBe('2p')
    expect(useQuantaStore.getState().level).toBe(2)

    // Switch back to Bohr
    useQuantaStore.getState().setMode('bohr')
    expect(useQuantaStore.getState().level).toBe(2)

    // Switch orbital to 1s (n=1)
    useQuantaStore.getState().setOrbital('1s')
    expect(useQuantaStore.getState().level).toBe(1)
    expect(useQuantaStore.getState().orbital).toBe('1s')
  })

  it('CRITICAL: Bohr n=3, 4, 5, 6 to Quantum does NOT become n=2 and preserves Hydrogen energy', () => {
    const store = useQuantaStore.getState()

    // Test for n = 3
    store.setLevel(3)
    const e3 = hydrogenEnergy(3)
    expect(useQuantaStore.getState().level).toBe(3)

    useQuantaStore.getState().setMode('quantum')
    expect(useQuantaStore.getState().level).toBe(3)
    expect(useQuantaStore.getState().orbital).toBeNull()
    expect(hydrogenEnergy(useQuantaStore.getState().level)).toBeCloseTo(e3, 5)

    // Return to Bohr
    useQuantaStore.getState().setMode('bohr')
    expect(useQuantaStore.getState().level).toBe(3)

    // Test for n = 4, 5, 6
    for (const n of [4, 5, 6]) {
      useQuantaStore.getState().setLevel(n)
      useQuantaStore.getState().setMode('quantum')
      expect(useQuantaStore.getState().level).toBe(n)
      expect(useQuantaStore.getState().orbital).toBeNull()

      useQuantaStore.getState().setMode('bohr')
      expect(useQuantaStore.getState().level).toBe(n)
    }
  })

  it('handles transition lifecycle and safe cancellation', () => {
    const store = useQuantaStore.getState()
    store.setInitialLevel(1)
    store.setTargetLevel(3)

    // Start absorption transition
    const started = useQuantaStore.getState().startTransition('absorption')
    expect(started).toBe(true)
    expect(useQuantaStore.getState().activeTransition).not.toBeNull()
    expect(useQuantaStore.getState().activeTransition?.type).toBe('absorption')
    expect(useQuantaStore.getState().activeTransition?.phase).toBe('photonIncoming')

    // Cancelling transition resets activeTransition cleanly
    useQuantaStore.getState().cancelTransition()
    expect(useQuantaStore.getState().activeTransition).toBeNull()

    // Starting emission transition
    store.setInitialLevel(3)
    store.setTargetLevel(2)
    const emitStarted = useQuantaStore.getState().startTransition('emission')
    expect(emitStarted).toBe(true)
    expect(useQuantaStore.getState().activeTransition?.type).toBe('emission')

    // Complete transition
    useQuantaStore.getState().completeTransition()
    expect(useQuantaStore.getState().activeTransition).toBeNull()
    expect(useQuantaStore.getState().level).toBe(2)
    expect(useQuantaStore.getState().orbital).toBe('2s')
  })

  it('safely cancels running electronic transitions when mode changes', () => {
    useQuantaStore.getState().setInitialLevel(1)
    useQuantaStore.getState().setTargetLevel(3)
    useQuantaStore.getState().startTransition('absorption')
    expect(useQuantaStore.getState().activeTransition).not.toBeNull()

    // User switches to quantum mode while transition is running
    useQuantaStore.getState().setMode('quantum')
    expect(useQuantaStore.getState().activeTransition).toBeNull()
    expect(useQuantaStore.getState().mode).toBe('quantum')
  })

  it('rejects duplicate concurrent transitions', () => {
    useQuantaStore.getState().setInitialLevel(1)
    useQuantaStore.getState().setTargetLevel(3)
    const first = useQuantaStore.getState().startTransition()
    expect(first).toBe(true)

    // Second call while first is active should return false
    const second = useQuantaStore.getState().startTransition()
    expect(second).toBe(false)
  })
})

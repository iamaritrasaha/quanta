import { describe, expect, it, beforeEach } from 'vitest'
import {
  useQuantaStore,
  mapLevelToOrbital,
  mapOrbitalToLevel,
} from './quantaStore'
import { hydrogenEnergy } from '../physics/hydrogen'

describe('Quanta Store and Model Transitions', () => {
  beforeEach(() => {
    useQuantaStore.getState().resetHydrogen()
    useQuantaStore.getState().resetHelium()
    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().setMode('overview')
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

  // --------------------------------------------------------------------------
  // MULTI-ELEMENT & HELIUM ISOLATION TESTS
  // --------------------------------------------------------------------------

  it('preserves Hydrogen state cleanly when navigating to Helium and back', () => {
    // Set Hydrogen to a custom state (n = 4)
    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().setLevel(4)
    useQuantaStore.getState().setInitialLevel(4)
    useQuantaStore.getState().setTargetLevel(2)

    expect(useQuantaStore.getState().hydrogen.level).toBe(4)
    expect(useQuantaStore.getState().hydrogen.initialLevel).toBe(4)
    expect(useQuantaStore.getState().hydrogen.targetLevel).toBe(2)

    // Navigate to Helium
    useQuantaStore.getState().setActiveElement('helium')
    expect(useQuantaStore.getState().activeElement).toBe('helium')

    // Modify Helium state
    useQuantaStore.getState().setHeliumLevel('1s2s_3S1')
    useQuantaStore.getState().setHeliumTransition('587.6nm')
    useQuantaStore.getState().setHeliumDensityView('components')

    expect(useQuantaStore.getState().helium.selectedLevelId).toBe('1s2p_3P2')
    expect(useQuantaStore.getState().helium.selectedTransitionId).toBe('587.6nm')
    expect(useQuantaStore.getState().helium.densityView).toBe('components')

    // Verify Hydrogen state was NOT corrupted
    expect(useQuantaStore.getState().hydrogen.level).toBe(4)
    expect(useQuantaStore.getState().hydrogen.initialLevel).toBe(4)
    expect(useQuantaStore.getState().hydrogen.targetLevel).toBe(2)

    // Navigate back to Hydrogen
    useQuantaStore.getState().setActiveElement('hydrogen')
    expect(useQuantaStore.getState().level).toBe(4)
    expect(useQuantaStore.getState().hydrogen.level).toBe(4)

    // Verify Helium state remained intact
    expect(useQuantaStore.getState().helium.selectedTransitionId).toBe('587.6nm')
    expect(useQuantaStore.getState().helium.densityView).toBe('components')
  })

  it('manages Helium transition lifecycle and directional execution (absorption vs emission)', () => {
    useQuantaStore.getState().setActiveElement('helium')
    useQuantaStore.getState().setHeliumTransition('587.6nm')

    // 1. Start ABSORPTION transition (1s2p 3P -> 1s3d 3D)
    const absorbStarted = useQuantaStore.getState().startHeliumTransition('587.6nm', 'absorption')
    expect(absorbStarted).toBe(true)
    expect(useQuantaStore.getState().helium.activeTransition).not.toBeNull()
    expect(useQuantaStore.getState().helium.activeTransition?.physics.id).toBe('587.6nm')
    expect(useQuantaStore.getState().helium.activeTransition?.type).toBe('absorption')
    expect(useQuantaStore.getState().helium.activeTransition?.initialLevelId).toBe('1s2p_3P2')
    expect(useQuantaStore.getState().helium.activeTransition?.targetLevelId).toBe('1s3d_3D')

    // Update progress
    useQuantaStore.getState().updateHeliumTransitionProgress(0.5, 'interaction')
    expect(useQuantaStore.getState().helium.activeTransition?.progress).toBe(0.5)
    expect(useQuantaStore.getState().helium.activeTransition?.phase).toBe('interaction')

    // Complete absorption -> atom is now in upper state 1s3d 3D
    useQuantaStore.getState().completeHeliumTransition()
    expect(useQuantaStore.getState().helium.activeTransition).toBeNull()
    expect(useQuantaStore.getState().helium.selectedLevelId).toBe('1s3d_3D')

    // 2. Start EMISSION transition (1s3d 3D -> 1s2p 3P)
    const emitStarted = useQuantaStore.getState().startHeliumTransition('587.6nm', 'emission')
    expect(emitStarted).toBe(true)
    expect(useQuantaStore.getState().helium.activeTransition?.type).toBe('emission')
    expect(useQuantaStore.getState().helium.activeTransition?.initialLevelId).toBe('1s3d_3D')
    expect(useQuantaStore.getState().helium.activeTransition?.targetLevelId).toBe('1s2p_3P2')

    // Complete emission -> atom is back in lower state 1s2p 3P2
    useQuantaStore.getState().completeHeliumTransition()
    expect(useQuantaStore.getState().helium.activeTransition).toBeNull()
    expect(useQuantaStore.getState().helium.selectedLevelId).toBe('1s2p_3P2')
  })

  it('resets only the active element when calling reset()', () => {
    // Set both to custom states
    useQuantaStore.getState().setLevel(5)
    useQuantaStore.getState().setHeliumDensityView('components')
    useQuantaStore.getState().setHeliumLevel('1s2s_3S1')

    // Reset while activeElement is hydrogen
    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().reset()

    expect(useQuantaStore.getState().hydrogen.level).toBe(1)
    // Helium densityView was untouched
    expect(useQuantaStore.getState().helium.densityView).toBe('components')
  })
})

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
    useQuantaStore.getState().resetLithium()
    useQuantaStore.getState().resetBeryllium()
    useQuantaStore.getState().resetBoron()
    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().setMode('overview')
  })

  it('cancels dedicated transitions when entering a shared element instrument', () => {
    const store = useQuantaStore.getState()
    store.setActiveElement('boron')
    expect(store.startBoronTransition()).toBe(true)
    expect(useQuantaStore.getState().boron.activeTransition).not.toBeNull()
    store.setActiveElement('carbon')
    expect(useQuantaStore.getState().activeElement).toBe('carbon')
    expect(useQuantaStore.getState().boron.activeTransition).toBeNull()
  })

  it('keeps dedicated element state isolated while browsing and resetting shared instruments', () => {
    const store = useQuantaStore.getState()
    store.setBoronLevel('3s_2S1_2')
    const savedBoron = useQuantaStore.getState().boron
    store.setActiveElement('oganesson')
    store.setMode('spectra')
    store.reset()
    expect(useQuantaStore.getState().boron).toBe(savedBoron)
    store.setActiveElement('boron')
    expect(useQuantaStore.getState().boron.selectedLevelId).toBe('3s_2S1_2')
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
    // Set all to custom states
    useQuantaStore.getState().setLevel(5)
    useQuantaStore.getState().setHeliumDensityView('components')
    useQuantaStore.getState().setHeliumLevel('1s2s_3S1')
    useQuantaStore.getState().setLithiumLevel('1s2_3d_2D5_2')
    useQuantaStore.getState().setLithiumDensityView('components')

    // Reset while activeElement is hydrogen
    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().reset()

    expect(useQuantaStore.getState().hydrogen.level).toBe(1)
    // Helium & Lithium state were untouched
    expect(useQuantaStore.getState().helium.densityView).toBe('components')
    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_3d_2D5_2')
    expect(useQuantaStore.getState().lithium.densityView).toBe('components')

    // Reset while activeElement is lithium
    useQuantaStore.getState().setActiveElement('lithium')
    useQuantaStore.getState().reset()
    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_2s_2S1_2')
    expect(useQuantaStore.getState().lithium.densityView).toBe('total')
  })

  // --------------------------------------------------------------------------
  // LITHIUM STATE ISOLATION & LIFECYCLE TESTS
  // --------------------------------------------------------------------------

  it('preserves Lithium state cleanly across H -> He -> Li -> Table -> Li transitions', () => {
    // Modify Hydrogen
    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().setLevel(3)

    // Modify Helium
    useQuantaStore.getState().setActiveElement('helium')
    useQuantaStore.getState().setHeliumLevel('1s2s_1S0')

    // Modify Lithium
    useQuantaStore.getState().setActiveElement('lithium')
    useQuantaStore.getState().setLithiumLevel('1s2_3s_2S1_2')
    useQuantaStore.getState().setLithiumTransition('812.6nm')
    useQuantaStore.getState().setLithiumDensityView('components')

    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_2p_2P3_2')
    expect(useQuantaStore.getState().lithium.selectedTransitionId).toBe('812.6nm')
    expect(useQuantaStore.getState().lithium.densityView).toBe('components')

    // Switch to Hydrogen
    useQuantaStore.getState().setActiveElement('hydrogen')
    expect(useQuantaStore.getState().hydrogen.level).toBe(3)

    // Switch to Helium
    useQuantaStore.getState().setActiveElement('helium')
    expect(useQuantaStore.getState().helium.selectedLevelId).toBe('1s2s_1S0')

    // Switch back to Lithium
    useQuantaStore.getState().setActiveElement('lithium')
    expect(useQuantaStore.getState().lithium.selectedTransitionId).toBe('812.6nm')
    expect(useQuantaStore.getState().lithium.densityView).toBe('components')
  })

  it('manages Lithium transition lifecycle for 670.8 nm resonance doublet (absorption vs emission)', () => {
    useQuantaStore.getState().setActiveElement('lithium')
    useQuantaStore.getState().setLithiumTransition('670.8nm')

    // 1. Start ABSORPTION transition (2s ²S₁/₂ -> 2p ²P°₃/₂)
    const absorbStarted = useQuantaStore.getState().startLithiumTransition('670.8nm', 'absorption')
    expect(absorbStarted).toBe(true)
    expect(useQuantaStore.getState().lithium.activeTransition).not.toBeNull()
    expect(useQuantaStore.getState().lithium.activeTransition?.physics.id).toBe('670.8nm')
    expect(useQuantaStore.getState().lithium.activeTransition?.type).toBe('absorption')
    expect(useQuantaStore.getState().lithium.activeTransition?.initialLevelId).toBe('1s2_2s_2S1_2')
    expect(useQuantaStore.getState().lithium.activeTransition?.targetLevelId).toBe('1s2_2p_2P3_2')

    // Update progress
    useQuantaStore.getState().updateLithiumTransitionProgress(0.5, 'interaction')
    expect(useQuantaStore.getState().lithium.activeTransition?.progress).toBe(0.5)
    expect(useQuantaStore.getState().lithium.activeTransition?.phase).toBe('interaction')

    // Complete absorption -> atom is in upper state 2p ²P°₃/₂
    useQuantaStore.getState().completeLithiumTransition()
    expect(useQuantaStore.getState().lithium.activeTransition).toBeNull()
    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_2p_2P3_2')

    // 2. Start EMISSION transition (2p ²P°₃/₂ -> 2s ²S₁/₂)
    const emitStarted = useQuantaStore.getState().startLithiumTransition('670.8nm', 'emission')
    expect(emitStarted).toBe(true)
    expect(useQuantaStore.getState().lithium.activeTransition?.type).toBe('emission')
    expect(useQuantaStore.getState().lithium.activeTransition?.initialLevelId).toBe('1s2_2p_2P3_2')
    expect(useQuantaStore.getState().lithium.activeTransition?.targetLevelId).toBe('1s2_2s_2S1_2')

    // Complete emission -> atom is back in ground state 2s ²S₁/₂
    useQuantaStore.getState().completeLithiumTransition()
    expect(useQuantaStore.getState().lithium.activeTransition).toBeNull()
    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_2s_2S1_2')
  })

  it('cancels running Lithium transition when switching elements or modes', () => {
    useQuantaStore.getState().setActiveElement('lithium')
    useQuantaStore.getState().startLithiumTransition('670.8nm', 'absorption')
    expect(useQuantaStore.getState().lithium.activeTransition).not.toBeNull()

    // Switch element
    useQuantaStore.getState().setActiveElement('helium')
    expect(useQuantaStore.getState().lithium.activeTransition).toBeNull()

    // Switch back and start transition, then switch mode
    useQuantaStore.getState().setActiveElement('lithium')
    useQuantaStore.getState().startLithiumTransition('670.8nm', 'absorption')
    expect(useQuantaStore.getState().lithium.activeTransition).not.toBeNull()

    useQuantaStore.getState().setMode('quantum')
    expect(useQuantaStore.getState().lithium.activeTransition).toBeNull()
  })

  // --------------------------------------------------------------------------
  // BERYLLIUM STATE ISOLATION & LIFECYCLE TESTS
  // --------------------------------------------------------------------------

  it('preserves Beryllium state cleanly across H -> He -> Li -> Be -> Table -> Be transitions', () => {
    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().setLevel(3)

    useQuantaStore.getState().setActiveElement('helium')
    useQuantaStore.getState().setHeliumLevel('1s2s_1S0')

    useQuantaStore.getState().setActiveElement('lithium')
    useQuantaStore.getState().setLithiumLevel('1s2_3s_2S1_2')

    useQuantaStore.getState().setActiveElement('beryllium')
    useQuantaStore.getState().setBerylliumLevel('2s3d_1D2')
    useQuantaStore.getState().setBerylliumTransition('457.3nm')
    useQuantaStore.getState().setBerylliumDensityView('components')

    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s2p_1P1')
    expect(useQuantaStore.getState().beryllium.selectedTransitionId).toBe('457.3nm')
    expect(useQuantaStore.getState().beryllium.densityView).toBe('components')

    useQuantaStore.getState().setActiveElement('hydrogen')
    expect(useQuantaStore.getState().hydrogen.level).toBe(3)

    useQuantaStore.getState().setActiveElement('lithium')
    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_3s_2S1_2')

    useQuantaStore.getState().setActiveElement('beryllium')
    expect(useQuantaStore.getState().beryllium.selectedTransitionId).toBe('457.3nm')
    expect(useQuantaStore.getState().beryllium.densityView).toBe('components')
  })

  it('manages Beryllium transition lifecycle for 234.9 nm ground-state resonance (absorption vs emission)', () => {
    useQuantaStore.getState().setActiveElement('beryllium')
    useQuantaStore.getState().setBerylliumTransition('234.9nm')

    const absorbStarted = useQuantaStore.getState().startBerylliumTransition('234.9nm', 'absorption')
    expect(absorbStarted).toBe(true)
    expect(useQuantaStore.getState().beryllium.activeTransition).not.toBeNull()
    expect(useQuantaStore.getState().beryllium.activeTransition?.physics.id).toBe('234.9nm')
    expect(useQuantaStore.getState().beryllium.activeTransition?.type).toBe('absorption')
    expect(useQuantaStore.getState().beryllium.activeTransition?.initialLevelId).toBe('2s2_1S0')
    expect(useQuantaStore.getState().beryllium.activeTransition?.targetLevelId).toBe('2s2p_1P1')

    useQuantaStore.getState().updateBerylliumTransitionProgress(0.5, 'interaction')
    expect(useQuantaStore.getState().beryllium.activeTransition?.progress).toBe(0.5)
    expect(useQuantaStore.getState().beryllium.activeTransition?.phase).toBe('interaction')

    useQuantaStore.getState().completeBerylliumTransition()
    expect(useQuantaStore.getState().beryllium.activeTransition).toBeNull()
    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s2p_1P1')

    const emitStarted = useQuantaStore.getState().startBerylliumTransition('234.9nm', 'emission')
    expect(emitStarted).toBe(true)
    expect(useQuantaStore.getState().beryllium.activeTransition?.type).toBe('emission')
    expect(useQuantaStore.getState().beryllium.activeTransition?.initialLevelId).toBe('2s2p_1P1')
    expect(useQuantaStore.getState().beryllium.activeTransition?.targetLevelId).toBe('2s2_1S0')

    useQuantaStore.getState().completeBerylliumTransition()
    expect(useQuantaStore.getState().beryllium.activeTransition).toBeNull()
    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s2_1S0')
  })

  it('cancels running Beryllium transition when switching elements or modes', () => {
    useQuantaStore.getState().setActiveElement('beryllium')
    useQuantaStore.getState().startBerylliumTransition('234.9nm', 'absorption')
    expect(useQuantaStore.getState().beryllium.activeTransition).not.toBeNull()

    useQuantaStore.getState().setActiveElement('lithium')
    expect(useQuantaStore.getState().beryllium.activeTransition).toBeNull()

    useQuantaStore.getState().setActiveElement('beryllium')
    useQuantaStore.getState().startBerylliumTransition('234.9nm', 'absorption')
    expect(useQuantaStore.getState().beryllium.activeTransition).not.toBeNull()

    useQuantaStore.getState().setMode('quantum')
    expect(useQuantaStore.getState().beryllium.activeTransition).toBeNull()
  })

  // --------------------------------------------------------------------------
  // BORON STATE ISOLATION & LIFECYCLE TESTS
  // --------------------------------------------------------------------------

  it('preserves Boron state cleanly across B -> H -> B and B -> Be -> Li -> B transitions', () => {
    useQuantaStore.getState().setActiveElement('boron')
    useQuantaStore.getState().setBoronLevel('3d_2D5_2')
    useQuantaStore.getState().setBoronTransition('182.64nm')
    useQuantaStore.getState().setBoronDensityView('components')

    expect(useQuantaStore.getState().boron.selectedTransitionId).toBe('182.64nm')
    expect(useQuantaStore.getState().boron.densityView).toBe('components')

    useQuantaStore.getState().setActiveElement('hydrogen')
    useQuantaStore.getState().setLevel(4)
    useQuantaStore.getState().setActiveElement('boron')
    expect(useQuantaStore.getState().boron.selectedTransitionId).toBe('182.64nm')
    expect(useQuantaStore.getState().boron.densityView).toBe('components')

    useQuantaStore.getState().setActiveElement('beryllium')
    useQuantaStore.getState().setBerylliumLevel('2s3s_3S1')
    useQuantaStore.getState().setActiveElement('lithium')
    useQuantaStore.getState().setLithiumLevel('1s2_3p_2P3_2')

    useQuantaStore.getState().setActiveElement('boron')
    expect(useQuantaStore.getState().boron.selectedTransitionId).toBe('182.64nm')
    expect(useQuantaStore.getState().boron.densityView).toBe('components')
    expect(useQuantaStore.getState().beryllium.selectedLevelId).toBe('2s3s_3S1')
    expect(useQuantaStore.getState().lithium.selectedLevelId).toBe('1s2_3p_2P3_2')
  })

  it('manages Boron transition lifecycle for the 249.77 nm hero line (absorption vs emission)', () => {
    useQuantaStore.getState().setActiveElement('boron')
    useQuantaStore.getState().setBoronTransition('249.77nm')

    const absorbStarted = useQuantaStore.getState().startBoronTransition('249.77nm', 'absorption')
    expect(absorbStarted).toBe(true)
    expect(useQuantaStore.getState().boron.activeTransition).not.toBeNull()
    expect(useQuantaStore.getState().boron.activeTransition?.physics.id).toBe('249.77nm')
    expect(useQuantaStore.getState().boron.activeTransition?.type).toBe('absorption')
    expect(useQuantaStore.getState().boron.activeTransition?.initialLevelId).toBe('2p_2P3_2')
    expect(useQuantaStore.getState().boron.activeTransition?.targetLevelId).toBe('3s_2S1_2')

    useQuantaStore.getState().updateBoronTransitionProgress(0.5, 'interaction')
    expect(useQuantaStore.getState().boron.activeTransition?.progress).toBe(0.5)
    expect(useQuantaStore.getState().boron.activeTransition?.phase).toBe('interaction')

    useQuantaStore.getState().completeBoronTransition()
    expect(useQuantaStore.getState().boron.activeTransition).toBeNull()
    expect(useQuantaStore.getState().boron.selectedLevelId).toBe('3s_2S1_2')

    const emitStarted = useQuantaStore.getState().startBoronTransition('249.77nm', 'emission')
    expect(emitStarted).toBe(true)
    expect(useQuantaStore.getState().boron.activeTransition?.type).toBe('emission')
    expect(useQuantaStore.getState().boron.activeTransition?.initialLevelId).toBe('3s_2S1_2')
    expect(useQuantaStore.getState().boron.activeTransition?.targetLevelId).toBe('2p_2P3_2')

    useQuantaStore.getState().completeBoronTransition()
    expect(useQuantaStore.getState().boron.activeTransition).toBeNull()
    expect(useQuantaStore.getState().boron.selectedLevelId).toBe('2p_2P3_2')
  })

  it('cancels running Boron transition when switching elements or modes', () => {
    useQuantaStore.getState().setActiveElement('boron')
    useQuantaStore.getState().startBoronTransition('249.77nm', 'absorption')
    expect(useQuantaStore.getState().boron.activeTransition).not.toBeNull()

    useQuantaStore.getState().setActiveElement('helium')
    expect(useQuantaStore.getState().boron.activeTransition).toBeNull()

    useQuantaStore.getState().setActiveElement('boron')
    useQuantaStore.getState().startBoronTransition('249.77nm', 'absorption')
    expect(useQuantaStore.getState().boron.activeTransition).not.toBeNull()

    useQuantaStore.getState().setMode('quantum')
    expect(useQuantaStore.getState().boron.activeTransition).toBeNull()
  })
})

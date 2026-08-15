import { create } from 'zustand'
import { ORBITALS, type UiOrbitalKey } from '../physics/quantum'
import { safeHydrogenTransition, type HydrogenTransition } from '../physics/hydrogen'

export type ViewMode = 'overview' | 'bohr' | 'quantum' | 'energy' | 'spectra' | 'equations'

export type TransitionPhase =
  | 'idle'
  | 'photonIncoming'
  | 'interaction'
  | 'electronTransition'
  | 'photonOutgoing'
  | 'settle'

export interface ActiveTransition {
  type: 'absorption' | 'emission'
  initialLevel: number
  targetLevel: number
  startTime: number
  durationMs: number
  progress: number
  phase: TransitionPhase
  physics: HydrogenTransition
}

interface QuantaState {
  mode: ViewMode
  level: number
  initialLevel: number
  targetLevel: number
  orbital: UiOrbitalKey | null
  playing: boolean
  animationSpeed: number
  activeTransition: ActiveTransition | null
  transitionEventSeq: number

  setMode: (mode: ViewMode) => void
  setLevel: (level: number) => void
  setInitialLevel: (level: number) => void
  setTargetLevel: (level: number) => void
  setOrbital: (orbital: UiOrbitalKey) => void
  setAnimationSpeed: (speed: number) => void
  togglePlaying: () => void
  setPlaying: (playing: boolean) => void

  startTransition: (overrideType?: 'absorption' | 'emission') => boolean
  updateTransitionProgress: (progress: number, phase: TransitionPhase) => void
  completeTransition: () => void
  cancelTransition: () => void
  reset: () => void
}

/**
 * Maps a Bohr principal quantum number n to a validated UI orbital if available.
 * Returns null for n >= 3 to preserve scientific state integrity without silent substitution.
 */
export function mapLevelToOrbital(n: number, currentOrbital: UiOrbitalKey | null): UiOrbitalKey | null {
  if (n === 1) return '1s'
  if (n === 2) {
    return currentOrbital === '2p' ? '2p' : '2s'
  }
  // For n >= 3, do not substitute an n=2 orbital; return null to signal visualization unavailability
  return null
}

/**
 * Maps a Quantum orbital to its corresponding principal quantum number n.
 */
export function mapOrbitalToLevel(orbital: UiOrbitalKey | null): number | null {
  if (!orbital) return null
  return ORBITALS[orbital]?.n ?? null
}

export const useQuantaStore = create<QuantaState>((set, get) => ({
  mode: 'overview',
  level: 1,
  initialLevel: 1,
  targetLevel: 3,
  orbital: '1s',
  playing: true,
  animationSpeed: 1,
  activeTransition: null,
  transitionEventSeq: 0,

  setMode: (mode) => {
    const current = get()

    // Safely cancel any active pedagogical transitions upon model switch
    if (current.activeTransition) {
      current.cancelTransition()
    }

    if (mode === 'quantum') {
      // Switching to Quantum mode: preserve exact principal quantum number
      const compatibleOrbital = mapLevelToOrbital(current.level, current.orbital)
      set({ mode, orbital: compatibleOrbital })
    } else {
      // Switching to Bohr / classical instrumentation: preserve principal quantum state
      if (current.mode === 'quantum' && current.orbital !== null) {
        const compatibleLevel = mapOrbitalToLevel(current.orbital)
        if (compatibleLevel !== null) {
          set({ mode, level: compatibleLevel })
          return
        }
      }
      set({ mode })
    }
  },

  setLevel: (level) => {
    const validLevel = Math.max(1, Math.min(6, Math.round(level)))
    const currentOrbital = get().orbital
    const updatedOrbital = mapLevelToOrbital(validLevel, currentOrbital)
    set({ level: validLevel, orbital: updatedOrbital })
  },

  setInitialLevel: (initialLevel) => {
    const valid = Math.max(1, Math.min(6, Math.round(initialLevel)))
    set({ initialLevel: valid })
  },

  setTargetLevel: (targetLevel) => {
    const valid = Math.max(1, Math.min(6, Math.round(targetLevel)))
    set({ targetLevel: valid })
  },

  setOrbital: (orbital) => {
    const principalN = mapOrbitalToLevel(orbital) ?? 1
    set({ orbital, level: principalN })
  },

  setAnimationSpeed: (speed) => set({ animationSpeed: Math.max(0.25, Math.min(4, speed)) }),

  togglePlaying: () => set((state) => ({ playing: !state.playing })),

  setPlaying: (playing) => set({ playing }),

  startTransition: (overrideType) => {
    const state = get()
    if (state.activeTransition) return false

    const initial = state.initialLevel
    const target = state.targetLevel
    const physics = safeHydrogenTransition(initial, target)
    if (!physics) return false

    const transitionType = overrideType ?? (target > initial ? 'absorption' : 'emission')
    const baseDurationMs = 2000
    const durationMs = baseDurationMs / state.animationSpeed

    set({
      level: initial,
      activeTransition: {
        type: transitionType,
        initialLevel: initial,
        targetLevel: target,
        startTime: performance.now(),
        durationMs,
        progress: 0,
        phase: transitionType === 'absorption' ? 'photonIncoming' : 'electronTransition',
        physics,
      },
      transitionEventSeq: state.transitionEventSeq + 1,
    })
    return true
  },

  updateTransitionProgress: (progress, phase) => {
    set((state) => {
      if (!state.activeTransition) return state
      return {
        activeTransition: {
          ...state.activeTransition,
          progress: Math.min(1, Math.max(0, progress)),
          phase,
        },
      }
    })
  },

  completeTransition: () => {
    set((state) => {
      if (!state.activeTransition) return state
      const finalLevel = state.activeTransition.targetLevel
      const finalOrbital = mapLevelToOrbital(finalLevel, state.orbital)
      return {
        level: finalLevel,
        orbital: finalOrbital,
        initialLevel: finalLevel,
        targetLevel: finalLevel === 1 ? 2 : finalLevel === 6 ? 5 : finalLevel > 2 ? 2 : 1,
        activeTransition: null,
      }
    })
  },

  cancelTransition: () => {
    set({ activeTransition: null })
  },

  reset: () => {
    set({
      level: 1,
      initialLevel: 1,
      targetLevel: 3,
      orbital: '1s',
      playing: true,
      animationSpeed: 1,
      activeTransition: null,
    })
  },
}))

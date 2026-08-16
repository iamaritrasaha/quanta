import { create } from 'zustand'
import { ORBITALS, type UiOrbitalKey } from '../physics/quantum'
import { safeHydrogenTransition, type HydrogenTransition } from '../physics/hydrogen'
import {
  findHeliumTransition,
  getHeliumLevel,
  getHeliumTransition,
  type HeliumTransition,
} from '../physics/helium'
import {
  findLithiumTransition,
  getLithiumLevel,
  getLithiumTransition,
  type LithiumTransition,
} from '../physics/lithium'
import {
  findBerylliumTransition,
  getBerylliumLevel,
  getBerylliumTransition,
  type BerylliumTransition,
} from '../physics/beryllium'

export type ElementKey = 'hydrogen' | 'helium' | 'lithium' | 'beryllium'

export type ViewMode = 'overview' | 'bohr' | 'quantum' | 'energy' | 'spectra' | 'equations'

export type TransitionPhase =
  | 'idle'
  | 'photonIncoming'
  | 'interaction'
  | 'electronTransition'
  | 'photonOutgoing'
  | 'settle'

export interface ActiveHydrogenTransition {
  type: 'absorption' | 'emission'
  initialLevel: number
  targetLevel: number
  startTime: number
  durationMs: number
  progress: number
  phase: TransitionPhase
  physics: HydrogenTransition
}

export interface ActiveHeliumTransition {
  type: 'absorption' | 'emission'
  initialLevelId: string
  targetLevelId: string
  startTime: number
  durationMs: number
  progress: number
  phase: TransitionPhase
  physics: HeliumTransition
}

export interface ActiveLithiumTransition {
  type: 'absorption' | 'emission'
  initialLevelId: string
  targetLevelId: string
  startTime: number
  durationMs: number
  progress: number
  phase: TransitionPhase
  physics: LithiumTransition
}

export interface ActiveBerylliumTransition {
  type: 'absorption' | 'emission'
  initialLevelId: string
  targetLevelId: string
  startTime: number
  durationMs: number
  progress: number
  phase: TransitionPhase
  physics: BerylliumTransition
}

// Backwards-compatible alias for existing Hydrogen components
export type ActiveTransition = ActiveHydrogenTransition

export interface HydrogenState {
  level: number
  initialLevel: number
  targetLevel: number
  orbital: UiOrbitalKey | null
  activeTransition: ActiveHydrogenTransition | null
}

export interface HeliumState {
  selectedLevelId: string
  initialLevelId: string
  targetLevelId: string
  selectedTransitionId: string | null
  densityView: 'total' | 'components'
  activeTransition: ActiveHeliumTransition | null
}

export interface LithiumState {
  selectedLevelId: string
  initialLevelId: string
  targetLevelId: string
  selectedTransitionId: string | null
  densityView: 'total' | 'components'
  activeTransition: ActiveLithiumTransition | null
}

export interface BerylliumState {
  selectedLevelId: string
  initialLevelId: string
  targetLevelId: string
  selectedTransitionId: string | null
  densityView: 'total' | 'components'
  activeTransition: ActiveBerylliumTransition | null
}

interface QuantaState {
  activeElement: ElementKey
  mode: ViewMode
  playing: boolean
  animationSpeed: number
  transitionEventSeq: number

  // Hydrogen Sub-State
  hydrogen: HydrogenState
  // Helium Sub-State
  helium: HeliumState
  // Lithium Sub-State
  lithium: LithiumState
  // Beryllium Sub-State
  beryllium: BerylliumState

  // Legacy/Direct Accessors for Hydrogen (Preserves regression benchmark)
  level: number
  initialLevel: number
  targetLevel: number
  orbital: UiOrbitalKey | null
  activeTransition: ActiveHydrogenTransition | null

  // Global Actions
  setActiveElement: (element: ElementKey) => void
  setMode: (mode: ViewMode) => void
  setAnimationSpeed: (speed: number) => void
  togglePlaying: () => void
  setPlaying: (playing: boolean) => void

  // Hydrogen Actions
  setLevel: (level: number) => void
  setInitialLevel: (level: number) => void
  setTargetLevel: (level: number) => void
  setOrbital: (orbital: UiOrbitalKey) => void
  startTransition: (overrideType?: 'absorption' | 'emission') => boolean
  updateTransitionProgress: (progress: number, phase: TransitionPhase) => void
  completeTransition: () => void
  cancelTransition: () => void
  resetHydrogen: () => void

  // Helium Actions
  setHeliumLevel: (levelId: string) => void
  setHeliumInitialLevel: (levelId: string) => void
  setHeliumTargetLevel: (levelId: string) => void
  setHeliumTransition: (transitionId: string) => void
  setHeliumDensityView: (view: 'total' | 'components') => void
  startHeliumTransition: (transitionId?: string, overrideType?: 'absorption' | 'emission') => boolean
  updateHeliumTransitionProgress: (progress: number, phase: TransitionPhase) => void
  completeHeliumTransition: () => void
  cancelHeliumTransition: () => void
  resetHelium: () => void

  // Lithium Actions
  setLithiumLevel: (levelId: string) => void
  setLithiumInitialLevel: (levelId: string) => void
  setLithiumTargetLevel: (levelId: string) => void
  setLithiumTransition: (transitionId: string) => void
  setLithiumDensityView: (view: 'total' | 'components') => void
  startLithiumTransition: (transitionId?: string, overrideType?: 'absorption' | 'emission') => boolean
  updateLithiumTransitionProgress: (progress: number, phase: TransitionPhase) => void
  completeLithiumTransition: () => void
  cancelLithiumTransition: () => void
  resetLithium: () => void

  // Beryllium Actions
  setBerylliumLevel: (levelId: string) => void
  setBerylliumInitialLevel: (levelId: string) => void
  setBerylliumTargetLevel: (levelId: string) => void
  setBerylliumTransition: (transitionId: string) => void
  setBerylliumDensityView: (view: 'total' | 'components') => void
  startBerylliumTransition: (transitionId?: string, overrideType?: 'absorption' | 'emission') => boolean
  updateBerylliumTransitionProgress: (progress: number, phase: TransitionPhase) => void
  completeBerylliumTransition: () => void
  cancelBerylliumTransition: () => void
  resetBeryllium: () => void

  // Context-aware reset
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
  return null
}

/**
 * Maps a Quantum orbital to its corresponding principal quantum number n.
 */
export function mapOrbitalToLevel(orbital: UiOrbitalKey | null): number | null {
  if (!orbital) return null
  return ORBITALS[orbital]?.n ?? null
}

const defaultHydrogenState: HydrogenState = {
  level: 1,
  initialLevel: 1,
  targetLevel: 3,
  orbital: '1s',
  activeTransition: null,
}

const defaultHeliumState: HeliumState = {
  selectedLevelId: '1s2_1S0',
  initialLevelId: '1s2_1S0',
  targetLevelId: '1s2p_1P1',
  selectedTransitionId: '58.4nm',
  densityView: 'total',
  activeTransition: null,
}

const defaultLithiumState: LithiumState = {
  selectedLevelId: '1s2_2s_2S1_2',
  initialLevelId: '1s2_2s_2S1_2',
  targetLevelId: '1s2_2p_2P3_2',
  selectedTransitionId: '670.8nm',
  densityView: 'total',
  activeTransition: null,
}

const defaultBerylliumState: BerylliumState = {
  selectedLevelId: '2s2_1S0',
  initialLevelId: '2s2_1S0',
  targetLevelId: '2s2p_1P1',
  selectedTransitionId: '234.9nm',
  densityView: 'total',
  activeTransition: null,
}

export const useQuantaStore = create<QuantaState>((set, get) => ({
  activeElement: 'hydrogen',
  mode: 'overview',
  playing: true,
  animationSpeed: 1,
  transitionEventSeq: 0,

  hydrogen: { ...defaultHydrogenState },
  helium: { ...defaultHeliumState },
  lithium: { ...defaultLithiumState },
  beryllium: { ...defaultBerylliumState },

  // Mirror legacy Hydrogen accessors to prevent any breaking changes
  level: defaultHydrogenState.level,
  initialLevel: defaultHydrogenState.initialLevel,
  targetLevel: defaultHydrogenState.targetLevel,
  orbital: defaultHydrogenState.orbital,
  activeTransition: defaultHydrogenState.activeTransition,

  setActiveElement: (element) => {
    const current = get()
    if (current.activeElement === element) return

    // Cancel running transitions on previous element to prevent phantom ticks
    if (current.hydrogen.activeTransition) {
      current.cancelTransition()
    }
    if (current.helium.activeTransition) {
      current.cancelHeliumTransition()
    }
    if (current.lithium.activeTransition) {
      current.cancelLithiumTransition()
    }
    if (current.beryllium.activeTransition) {
      current.cancelBerylliumTransition()
    }

    set({ activeElement: element })
  },

  setMode: (mode) => {
    const current = get()

    // Safely cancel active transitions upon model switch
    if (current.hydrogen.activeTransition) {
      current.cancelTransition()
    }
    if (current.helium.activeTransition) {
      current.cancelHeliumTransition()
    }
    if (current.lithium.activeTransition) {
      current.cancelLithiumTransition()
    }
    if (current.beryllium.activeTransition) {
      current.cancelBerylliumTransition()
    }

    if (current.activeElement === 'hydrogen') {
      if (mode === 'quantum') {
        const compatibleOrbital = mapLevelToOrbital(current.hydrogen.level, current.hydrogen.orbital)
        set((state) => ({
          mode,
          orbital: compatibleOrbital,
          hydrogen: { ...state.hydrogen, orbital: compatibleOrbital },
        }))
      } else {
        if (current.mode === 'quantum' && current.hydrogen.orbital !== null) {
          const compatibleLevel = mapOrbitalToLevel(current.hydrogen.orbital)
          if (compatibleLevel !== null) {
            set((state) => ({
              mode,
              level: compatibleLevel,
              hydrogen: { ...state.hydrogen, level: compatibleLevel },
            }))
            return
          }
        }
        set({ mode })
      }
    } else {
      set({ mode })
    }
  },

  setAnimationSpeed: (speed) => set({ animationSpeed: Math.max(0.25, Math.min(4, speed)) }),

  togglePlaying: () => set((state) => ({ playing: !state.playing })),

  setPlaying: (playing) => set({ playing }),

  // --------------------------------------------------------------------------
  // Hydrogen State Actions (Full backwards-compatibility & isolated scope)
  // --------------------------------------------------------------------------

  setLevel: (level) => {
    const validLevel = Math.max(1, Math.min(6, Math.round(level)))
    const currentOrbital = get().hydrogen.orbital
    const updatedOrbital = mapLevelToOrbital(validLevel, currentOrbital)
    set((state) => ({
      level: validLevel,
      orbital: updatedOrbital,
      hydrogen: {
        ...state.hydrogen,
        level: validLevel,
        orbital: updatedOrbital,
      },
    }))
  },

  setInitialLevel: (initialLevel) => {
    const valid = Math.max(1, Math.min(6, Math.round(initialLevel)))
    set((state) => ({
      initialLevel: valid,
      hydrogen: { ...state.hydrogen, initialLevel: valid },
    }))
  },

  setTargetLevel: (targetLevel) => {
    const valid = Math.max(1, Math.min(6, Math.round(targetLevel)))
    set((state) => ({
      targetLevel: valid,
      hydrogen: { ...state.hydrogen, targetLevel: valid },
    }))
  },

  setOrbital: (orbital) => {
    const principalN = mapOrbitalToLevel(orbital) ?? 1
    set((state) => ({
      orbital,
      level: principalN,
      hydrogen: {
        ...state.hydrogen,
        orbital,
        level: principalN,
      },
    }))
  },

  startTransition: (overrideType) => {
    const state = get()
    if (state.hydrogen.activeTransition) return false

    const initial = state.hydrogen.initialLevel
    const target = state.hydrogen.targetLevel
    const physics = safeHydrogenTransition(initial, target)
    if (!physics) return false

    const transitionType = overrideType ?? (target > initial ? 'absorption' : 'emission')
    const baseDurationMs = 2000
    const durationMs = baseDurationMs / state.animationSpeed

    const transition: ActiveHydrogenTransition = {
      type: transitionType,
      initialLevel: initial,
      targetLevel: target,
      startTime: performance.now(),
      durationMs,
      progress: 0,
      phase: transitionType === 'absorption' ? 'photonIncoming' : 'electronTransition',
      physics,
    }

    set((s) => ({
      level: initial,
      activeTransition: transition,
      transitionEventSeq: s.transitionEventSeq + 1,
      hydrogen: {
        ...s.hydrogen,
        level: initial,
        activeTransition: transition,
      },
    }))
    return true
  },

  updateTransitionProgress: (progress, phase) => {
    set((state) => {
      if (!state.hydrogen.activeTransition) return state
      const updatedTransition: ActiveHydrogenTransition = {
        ...state.hydrogen.activeTransition,
        progress: Math.min(1, Math.max(0, progress)),
        phase,
      }
      return {
        activeTransition: updatedTransition,
        hydrogen: {
          ...state.hydrogen,
          activeTransition: updatedTransition,
        },
      }
    })
  },

  completeTransition: () => {
    set((state) => {
      if (!state.hydrogen.activeTransition) return state
      const finalLevel = state.hydrogen.activeTransition.targetLevel
      const finalOrbital = mapLevelToOrbital(finalLevel, state.hydrogen.orbital)
      const nextTarget = finalLevel === 1 ? 2 : finalLevel === 6 ? 5 : finalLevel > 2 ? 2 : 1
      return {
        level: finalLevel,
        orbital: finalOrbital,
        initialLevel: finalLevel,
        targetLevel: nextTarget,
        activeTransition: null,
        hydrogen: {
          ...state.hydrogen,
          level: finalLevel,
          orbital: finalOrbital,
          initialLevel: finalLevel,
          targetLevel: nextTarget,
          activeTransition: null,
        },
      }
    })
  },

  cancelTransition: () => {
    set((state) => ({
      activeTransition: null,
      hydrogen: { ...state.hydrogen, activeTransition: null },
    }))
  },

  resetHydrogen: () => {
    set({
      level: defaultHydrogenState.level,
      initialLevel: defaultHydrogenState.initialLevel,
      targetLevel: defaultHydrogenState.targetLevel,
      orbital: defaultHydrogenState.orbital,
      activeTransition: null,
      hydrogen: { ...defaultHydrogenState },
    })
  },

  // --------------------------------------------------------------------------
  // Helium State Actions (Isolated scope & NIST model driven)
  // --------------------------------------------------------------------------

  setHeliumLevel: (levelId) => {
    const level = getHeliumLevel(levelId)
    if (!level) return
    set((state) => ({
      helium: {
        ...state.helium,
        selectedLevelId: levelId,
      },
    }))
  },

  setHeliumInitialLevel: (levelId) => {
    set((state) => {
      const match = findHeliumTransition(levelId, state.helium.targetLevelId)
      return {
        helium: {
          ...state.helium,
          initialLevelId: levelId,
          selectedTransitionId: match ? match.id : state.helium.selectedTransitionId,
        },
      }
    })
  },

  setHeliumTargetLevel: (levelId) => {
    set((state) => {
      const match = findHeliumTransition(state.helium.initialLevelId, levelId)
      return {
        helium: {
          ...state.helium,
          targetLevelId: levelId,
          selectedTransitionId: match ? match.id : state.helium.selectedTransitionId,
        },
      }
    })
  },

  setHeliumTransition: (transitionId) => {
    const t = getHeliumTransition(transitionId)
    if (!t) return
    set((state) => ({
      helium: {
        ...state.helium,
        selectedTransitionId: transitionId,
        initialLevelId: t.lowerLevelId,
        targetLevelId: t.upperLevelId,
        selectedLevelId: t.lowerLevelId,
      },
    }))
  },

  setHeliumDensityView: (densityView) => {
    set((state) => ({
      helium: {
        ...state.helium,
        densityView,
      },
    }))
  },

  startHeliumTransition: (transitionId, overrideType) => {
    const state = get()
    if (state.helium.activeTransition) return false

    const targetTransitionId = transitionId ?? state.helium.selectedTransitionId
    let physics = targetTransitionId ? getHeliumTransition(targetTransitionId) : undefined

    if (!physics) {
      physics = findHeliumTransition(state.helium.initialLevelId, state.helium.targetLevelId)
    }
    if (!physics) return false

    const lower = getHeliumLevel(physics.lowerLevelId)
    const upper = getHeliumLevel(physics.upperLevelId)
    if (!lower || !upper) return false

    // Determine direction
    const currentIsUpper = state.helium.selectedLevelId === upper.id
    const type = overrideType ?? (currentIsUpper ? 'emission' : 'absorption')

    const initialId = type === 'absorption' ? lower.id : upper.id
    const targetId = type === 'absorption' ? upper.id : lower.id

    const baseDurationMs = 2000
    const durationMs = baseDurationMs / state.animationSpeed

    const activeTransition: ActiveHeliumTransition = {
      type,
      initialLevelId: initialId,
      targetLevelId: targetId,
      startTime: performance.now(),
      durationMs,
      progress: 0,
      phase: type === 'absorption' ? 'photonIncoming' : 'electronTransition',
      physics,
    }

    set((s) => ({
      transitionEventSeq: s.transitionEventSeq + 1,
      helium: {
        ...s.helium,
        selectedLevelId: initialId,
        initialLevelId: initialId,
        targetLevelId: targetId,
        selectedTransitionId: physics.id,
        activeTransition,
      },
    }))
    return true
  },

  updateHeliumTransitionProgress: (progress, phase) => {
    set((state) => {
      if (!state.helium.activeTransition) return state
      return {
        helium: {
          ...state.helium,
          activeTransition: {
            ...state.helium.activeTransition,
            progress: Math.min(1, Math.max(0, progress)),
            phase,
          },
        },
      }
    })
  },

  completeHeliumTransition: () => {
    set((state) => {
      if (!state.helium.activeTransition) return state
      const finalId = state.helium.activeTransition.targetLevelId
      return {
        helium: {
          ...state.helium,
          selectedLevelId: finalId,
          initialLevelId: finalId,
          activeTransition: null,
        },
      }
    })
  },

  cancelHeliumTransition: () => {
    set((state) => ({
      helium: {
        ...state.helium,
        activeTransition: null,
      },
    }))
  },

  resetHelium: () => {
    set({
      helium: { ...defaultHeliumState },
    })
  },

  // --------------------------------------------------------------------------
  // Lithium State Actions (Isolated scope & NIST model driven)
  // --------------------------------------------------------------------------

  setLithiumLevel: (levelId) => {
    const level = getLithiumLevel(levelId)
    if (!level) return
    set((state) => ({
      lithium: {
        ...state.lithium,
        selectedLevelId: levelId,
      },
    }))
  },

  setLithiumInitialLevel: (levelId) => {
    set((state) => {
      const match = findLithiumTransition(levelId, state.lithium.targetLevelId)
      return {
        lithium: {
          ...state.lithium,
          initialLevelId: levelId,
          selectedTransitionId: match ? match.id : state.lithium.selectedTransitionId,
        },
      }
    })
  },

  setLithiumTargetLevel: (levelId) => {
    set((state) => {
      const match = findLithiumTransition(state.lithium.initialLevelId, levelId)
      return {
        lithium: {
          ...state.lithium,
          targetLevelId: levelId,
          selectedTransitionId: match ? match.id : state.lithium.selectedTransitionId,
        },
      }
    })
  },

  setLithiumTransition: (transitionId) => {
    const t = getLithiumTransition(transitionId)
    if (!t) return
    set((state) => ({
      lithium: {
        ...state.lithium,
        selectedTransitionId: transitionId,
        initialLevelId: t.lowerLevelId,
        targetLevelId: t.upperLevelId,
        selectedLevelId: t.lowerLevelId,
      },
    }))
  },

  setLithiumDensityView: (densityView) => {
    set((state) => ({
      lithium: {
        ...state.lithium,
        densityView,
      },
    }))
  },

  startLithiumTransition: (transitionId, overrideType) => {
    const state = get()
    if (state.lithium.activeTransition) return false

    const targetTransitionId = transitionId ?? state.lithium.selectedTransitionId
    let physics = targetTransitionId ? getLithiumTransition(targetTransitionId) : undefined

    if (!physics) {
      physics = findLithiumTransition(state.lithium.initialLevelId, state.lithium.targetLevelId)
    }
    if (!physics) return false

    const lower = getLithiumLevel(physics.lowerLevelId)
    const upper = getLithiumLevel(physics.upperLevelId)
    if (!lower || !upper) return false

    // Determine direction
    const currentIsUpper = state.lithium.selectedLevelId === upper.id
    const type = overrideType ?? (currentIsUpper ? 'emission' : 'absorption')

    const initialId = type === 'absorption' ? lower.id : upper.id
    const targetId = type === 'absorption' ? upper.id : lower.id

    const baseDurationMs = 2000
    const durationMs = baseDurationMs / state.animationSpeed

    const activeTransition: ActiveLithiumTransition = {
      type,
      initialLevelId: initialId,
      targetLevelId: targetId,
      startTime: performance.now(),
      durationMs,
      progress: 0,
      phase: type === 'absorption' ? 'photonIncoming' : 'electronTransition',
      physics,
    }

    set((s) => ({
      transitionEventSeq: s.transitionEventSeq + 1,
      lithium: {
        ...s.lithium,
        selectedLevelId: initialId,
        initialLevelId: initialId,
        targetLevelId: targetId,
        selectedTransitionId: physics.id,
        activeTransition,
      },
    }))
    return true
  },

  updateLithiumTransitionProgress: (progress, phase) => {
    set((state) => {
      if (!state.lithium.activeTransition) return state
      return {
        lithium: {
          ...state.lithium,
          activeTransition: {
            ...state.lithium.activeTransition,
            progress: Math.min(1, Math.max(0, progress)),
            phase,
          },
        },
      }
    })
  },

  completeLithiumTransition: () => {
    set((state) => {
      if (!state.lithium.activeTransition) return state
      const finalId = state.lithium.activeTransition.targetLevelId
      return {
        lithium: {
          ...state.lithium,
          selectedLevelId: finalId,
          initialLevelId: finalId,
          activeTransition: null,
        },
      }
    })
  },

  cancelLithiumTransition: () => {
    set((state) => ({
      lithium: {
        ...state.lithium,
        activeTransition: null,
      },
    }))
  },

  resetLithium: () => {
    set({
      lithium: { ...defaultLithiumState },
    })
  },

  // --------------------------------------------------------------------------
  // Beryllium State Actions (Isolated scope & NIST model driven)
  // --------------------------------------------------------------------------

  setBerylliumLevel: (levelId) => {
    const level = getBerylliumLevel(levelId)
    if (!level) return
    set((state) => ({
      beryllium: {
        ...state.beryllium,
        selectedLevelId: levelId,
      },
    }))
  },

  setBerylliumInitialLevel: (levelId) => {
    set((state) => {
      const match = findBerylliumTransition(levelId, state.beryllium.targetLevelId)
      return {
        beryllium: {
          ...state.beryllium,
          initialLevelId: levelId,
          selectedTransitionId: match ? match.id : state.beryllium.selectedTransitionId,
        },
      }
    })
  },

  setBerylliumTargetLevel: (levelId) => {
    set((state) => {
      const match = findBerylliumTransition(state.beryllium.initialLevelId, levelId)
      return {
        beryllium: {
          ...state.beryllium,
          targetLevelId: levelId,
          selectedTransitionId: match ? match.id : state.beryllium.selectedTransitionId,
        },
      }
    })
  },

  setBerylliumTransition: (transitionId) => {
    const t = getBerylliumTransition(transitionId)
    if (!t) return
    set((state) => ({
      beryllium: {
        ...state.beryllium,
        selectedTransitionId: transitionId,
        initialLevelId: t.lowerLevelId,
        targetLevelId: t.upperLevelId,
        selectedLevelId: t.lowerLevelId,
      },
    }))
  },

  setBerylliumDensityView: (densityView) => {
    set((state) => ({
      beryllium: {
        ...state.beryllium,
        densityView,
      },
    }))
  },

  startBerylliumTransition: (transitionId, overrideType) => {
    const state = get()
    if (state.beryllium.activeTransition) return false

    const targetTransitionId = transitionId ?? state.beryllium.selectedTransitionId
    let physics = targetTransitionId ? getBerylliumTransition(targetTransitionId) : undefined

    if (!physics) {
      physics = findBerylliumTransition(state.beryllium.initialLevelId, state.beryllium.targetLevelId)
    }
    if (!physics) return false

    const lower = getBerylliumLevel(physics.lowerLevelId)
    const upper = getBerylliumLevel(physics.upperLevelId)
    if (!lower || !upper) return false

    const currentIsUpper = state.beryllium.selectedLevelId === upper.id
    const type = overrideType ?? (currentIsUpper ? 'emission' : 'absorption')

    const initialId = type === 'absorption' ? lower.id : upper.id
    const targetId = type === 'absorption' ? upper.id : lower.id

    const baseDurationMs = 2000
    const durationMs = baseDurationMs / state.animationSpeed

    const activeTransition: ActiveBerylliumTransition = {
      type,
      initialLevelId: initialId,
      targetLevelId: targetId,
      startTime: performance.now(),
      durationMs,
      progress: 0,
      phase: type === 'absorption' ? 'photonIncoming' : 'electronTransition',
      physics,
    }

    set((s) => ({
      transitionEventSeq: s.transitionEventSeq + 1,
      beryllium: {
        ...s.beryllium,
        selectedLevelId: initialId,
        initialLevelId: initialId,
        targetLevelId: targetId,
        selectedTransitionId: physics.id,
        activeTransition,
      },
    }))
    return true
  },

  updateBerylliumTransitionProgress: (progress, phase) => {
    set((state) => {
      if (!state.beryllium.activeTransition) return state
      return {
        beryllium: {
          ...state.beryllium,
          activeTransition: {
            ...state.beryllium.activeTransition,
            progress: Math.min(1, Math.max(0, progress)),
            phase,
          },
        },
      }
    })
  },

  completeBerylliumTransition: () => {
    set((state) => {
      if (!state.beryllium.activeTransition) return state
      const finalId = state.beryllium.activeTransition.targetLevelId
      return {
        beryllium: {
          ...state.beryllium,
          selectedLevelId: finalId,
          initialLevelId: finalId,
          activeTransition: null,
        },
      }
    })
  },

  cancelBerylliumTransition: () => {
    set((state) => ({
      beryllium: {
        ...state.beryllium,
        activeTransition: null,
      },
    }))
  },

  resetBeryllium: () => {
    set({
      beryllium: { ...defaultBerylliumState },
    })
  },

  // --------------------------------------------------------------------------
  // Context-Aware Global Reset
  // --------------------------------------------------------------------------

  reset: () => {
    const element = get().activeElement
    if (element === 'hydrogen') {
      get().resetHydrogen()
    } else if (element === 'helium') {
      get().resetHelium()
    } else if (element === 'lithium') {
      get().resetLithium()
    } else {
      get().resetBeryllium()
    }
  },
}))

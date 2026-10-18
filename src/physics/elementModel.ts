import { getAtomicProperties, getShellOccupancy } from '../data/atomicData'

export interface ModelShell { shell: number; electrons: number }
export interface ElementModelState {
  id: string
  symbol: string
  label: string
  configuration: string
  shells: ModelShell[]
  energyCm?: number
  term?: string
  j?: string
  rank: number
  schematic: boolean
}

export function shellRadius(shell: number): number { return 1.15 + (shell - 1) * 0.7 }

export function groundModel(symbol: string): ElementModelState {
  const configuration = getAtomicProperties(symbol)?.electronConfiguration ?? ''
  return { id: 'ground', symbol, label: 'Ground state', configuration,
    shells: getShellOccupancy(configuration), energyCm: 0, rank: 0, schematic: false }
}

/** A teaching model only: no measured energy or wavelength is assigned to these states. */
export function promotionModels(symbol: string): ElementModelState[] {
  const ground = groundModel(symbol)
  const outer = ground.shells[ground.shells.length - 1]?.shell ?? 1
  return [1, 2].map((step) => ({
    ...ground, id: `promotion-${step}`, label: `Shell promotion n=${outer} → ${outer + step} (schematic)`,
    configuration: `One outer electron promoted to n=${outer + step}`,
    shells: [...ground.shells.map((s) => ({ ...s, electrons: s.electrons - (s.shell === outer ? 1 : 0) })),
      { shell: outer + step, electrons: 1 }].filter((s) => s.electrons > 0),
    energyCm: undefined, rank: 1e8 + step, schematic: true,
  }))
}

export function modelSeparation(initial: ElementModelState, target: ElementModelState) {
  if (initial.schematic || target.schematic || initial.energyCm === undefined || target.energyCm === undefined) return undefined
  const gap = Math.abs(target.energyCm - initial.energyCm)
  return gap > 0 ? { energyEv: gap * 1.2398419843320026e-4, wavelengthNm: 1e7 / gap } : undefined
}

/** Pair stationary electrons first, then move only the electrons whose principal shell changes. */
export function electronPaths(initial: ModelShell[], target: ModelShell[]) {
  const stationary: Array<{ from: number; to: number }> = []
  const removed: number[] = [], added: number[] = []
  const shells = [...new Set([...initial, ...target].map((s) => s.shell))].sort((a, b) => a - b)
  for (const n of shells) {
    const a = initial.find((s) => s.shell === n)?.electrons ?? 0
    const b = target.find((s) => s.shell === n)?.electrons ?? 0
    for (let i = 0; i < Math.min(a, b); i++) stationary.push({ from: n, to: n })
    for (let i = b; i < a; i++) removed.push(n)
    for (let i = a; i < b; i++) added.push(n)
  }
  return [...stationary, ...removed.map((from, i) => ({ from, to: added[i] ?? from }))]
}

export function jumpProgress(progress: number, type: 'absorption' | 'emission') {
  const start = type === 'absorption' ? 0.56 : 0
  const end = type === 'absorption' ? 0.94 : 0.46
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)))
  return t * t * (3 - 2 * t)
}

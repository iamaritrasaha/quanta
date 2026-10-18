import { getAtomicProperties } from './atomicData'
import { getNistLevels, type AtomicLevel } from './atomicLevels'
import { groundModel, promotionModels, type ElementModelState } from '../physics/elementModel'

type Subshell = { n: number; l: string; count: number }
const capacities: Record<string, number> = { s: 2, p: 6, d: 10, f: 14 }

function parse(configuration: string): Subshell[] {
  // NIST parent terms such as (3P) describe coupling, not electron occupations.
  return [...configuration.replace(/\([^)]*\)/g, '').matchAll(/([1-9])([spdf])(\d{1,2})?/g)]
    .map((m) => ({ n: Number(m[1]), l: m[2], count: Number(m[3] ?? 1) }))
}

function groundSubshells(symbol: string): Subshell[] {
  const configuration = getAtomicProperties(symbol)?.electronConfiguration ?? ''
  const core = configuration.match(/\[([A-Za-z]+)\]/)?.[1]
  return [...(core ? groundSubshells(core) : []), ...parse(configuration.replace(/\[[^\]]*\]/g, ''))]
}

/** Restore only omitted closed core subshells; reject configurations that cannot conserve Z. */
export function referenceModel(symbol: string, level: AtomicLevel, index: number): ElementModelState | undefined {
  const z = getAtomicProperties(symbol)?.number
  const subshells = parse(level.configuration)
  if (!z || !subshells.length || subshells.some((s) => s.count > capacities[s.l])) return undefined
  const core = groundSubshells(symbol).sort((a, b) => a.n - b.n || 'spdf'.indexOf(a.l) - 'spdf'.indexOf(b.l))
  let count = subshells.reduce((n, s) => n + s.count, 0)
  for (const s of core) {
    if (count >= z) break
    if (s.count !== capacities[s.l] || subshells.some((t) => s.n === t.n && s.l === t.l)) continue
    if (count + s.count > z) return undefined
    subshells.push(s)
    count += s.count
  }
  if (count !== z) return undefined
  const totals = new Map<number, number>()
  subshells.forEach((s) => totals.set(s.n, (totals.get(s.n) ?? 0) + s.count))
  return { id: `nist-${index}`, symbol, label: `${level.configuration} ${level.term}, J=${level.j}`,
    configuration: level.configuration, energyCm: level.energyCm, term: level.term, j: level.j, rank: level.energyCm, schematic: false,
    shells: [...totals].sort(([a], [b]) => a - b).map(([shell, electrons]) => ({ shell, electrons })) }
}

export function getElementStates(symbol: string): ElementModelState[] {
  const levels = [...getNistLevels(symbol).levels].sort((a, b) => a.energyCm - b.energyCm)
  const references = levels
    .map((level, i) => referenceModel(symbol, level, i))
    .filter((s): s is ElementModelState => Boolean(s))
  return [{ ...groundModel(symbol), term: levels[0]?.term, j: levels[0]?.j },
    ...references.filter((s) => (s.energyCm ?? 0) > 0), ...promotionModels(symbol)]
}

export function defaultTarget(states: ElementModelState[]): ElementModelState {
  const outer = states[0].shells[states[0].shells.length - 1].shell
  const candidates = states.filter((s) => !s.schematic && s.shells.some((shell) => shell.shell > outer))
  // Prefer an LS term pair consistent with basic electric-dipole rules when those
  // labels are available. Arbitrary user-selected pairs remain schematic.
  const term = (s: ElementModelState) => s.term?.match(/^(\d+)([SPDFGHIK])(\*)?$/)
  const j = (value?: string) => {
    if (!value || !/^\d+(?:\/\d+)?$/.test(value)) return NaN
    const [a, b = '1'] = value.split('/')
    return Number(a) / Number(b)
  }
  const a = term(states[0]), ja = j(states[0].j)
  const preferred = candidates.find((s) => {
    const b = term(s), jb = j(s.j)
    if (!a || !b || a[1] !== b[1] || Boolean(a[3]) === Boolean(b[3])) return false
    const la = 'SPDFGHIK'.indexOf(a[2]), lb = 'SPDFGHIK'.indexOf(b[2])
    return Math.abs(ja - jb) <= 1 && ja + jb > 0 && Math.abs(la - lb) <= 1 && la + lb > 0
  })
  return preferred ?? candidates[0]
    ?? states.find((s) => s.schematic)!
}

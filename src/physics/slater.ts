/**
 * Slater's Rules Engine for Atomic Screening and Effective Nuclear Charge (Z_eff)
 *
 * Implements John C. Slater's empirical rules (Phys. Rev. 36, 57, 1930) for calculating
 * screening constants (sigma) and effective nuclear charges (Z_eff = Z - sigma)
 * in neutral atoms and ions.
 */

export interface SubshellPopulation {
  n: number
  l: 's' | 'p' | 'd' | 'f'
  count: number
}

export interface SlaterGroup {
  label: string
  n: number
  type: 'sp' | 'd' | 'f'
  electrons: number
}

export interface SlaterResult {
  z: number
  targetSubshell: string
  screeningConstant: number
  zEffective: number
  groups: SlaterGroup[]
  bindingEnergyEv: number
}

const SUBSHELL_CAPACITY: Record<string, number> = { s: 2, p: 6, d: 10, f: 14 }

/**
 * Parses an electron configuration string (e.g. "[Ar] 3d10 4s2 4p2" or "1s2 2s2 2p6")
 * into discrete subshells, expanding noble gas cores if present.
 */
export function parseConfiguration(config: string): SubshellPopulation[] {
  const result: SubshellPopulation[] = []
  const coreMatch = config.match(/\[([A-Za-z]+)\]/)
  const core = coreMatch ? coreMatch[1] : null

  if (core) {
    const coreConfigs: Record<string, SubshellPopulation[]> = {
      He: [{ n: 1, l: 's', count: 2 }],
      Ne: [
        { n: 1, l: 's', count: 2 },
        { n: 2, l: 's', count: 2 },
        { n: 2, l: 'p', count: 6 },
      ],
      Ar: [
        { n: 1, l: 's', count: 2 },
        { n: 2, l: 's', count: 2 },
        { n: 2, l: 'p', count: 6 },
        { n: 3, l: 's', count: 2 },
        { n: 3, l: 'p', count: 6 },
      ],
      Kr: [
        { n: 1, l: 's', count: 2 },
        { n: 2, l: 's', count: 2 },
        { n: 2, l: 'p', count: 6 },
        { n: 3, l: 's', count: 2 },
        { n: 3, l: 'p', count: 6 },
        { n: 3, l: 'd', count: 10 },
        { n: 4, l: 's', count: 2 },
        { n: 4, l: 'p', count: 6 },
      ],
      Xe: [
        { n: 1, l: 's', count: 2 },
        { n: 2, l: 's', count: 2 },
        { n: 2, l: 'p', count: 6 },
        { n: 3, l: 's', count: 2 },
        { n: 3, l: 'p', count: 6 },
        { n: 3, l: 'd', count: 10 },
        { n: 4, l: 's', count: 2 },
        { n: 4, l: 'p', count: 6 },
        { n: 4, l: 'd', count: 10 },
        { n: 5, l: 's', count: 2 },
        { n: 5, l: 'p', count: 6 },
      ],
      Rn: [
        { n: 1, l: 's', count: 2 },
        { n: 2, l: 's', count: 2 },
        { n: 2, l: 'p', count: 6 },
        { n: 3, l: 's', count: 2 },
        { n: 3, l: 'p', count: 6 },
        { n: 3, l: 'd', count: 10 },
        { n: 4, l: 's', count: 2 },
        { n: 4, l: 'p', count: 6 },
        { n: 4, l: 'd', count: 10 },
        { n: 4, l: 'f', count: 14 },
        { n: 5, l: 's', count: 2 },
        { n: 5, l: 'p', count: 6 },
        { n: 5, l: 'd', count: 10 },
        { n: 6, l: 's', count: 2 },
        { n: 6, l: 'p', count: 6 },
      ],
      Og: [
        { n: 1, l: 's', count: 2 },
        { n: 2, l: 's', count: 2 },
        { n: 2, l: 'p', count: 6 },
        { n: 3, l: 's', count: 2 },
        { n: 3, l: 'p', count: 6 },
        { n: 3, l: 'd', count: 10 },
        { n: 4, l: 's', count: 2 },
        { n: 4, l: 'p', count: 6 },
        { n: 4, l: 'd', count: 10 },
        { n: 4, l: 'f', count: 14 },
        { n: 5, l: 's', count: 2 },
        { n: 5, l: 'p', count: 6 },
        { n: 5, l: 'd', count: 10 },
        { n: 5, l: 'f', count: 14 },
        { n: 6, l: 's', count: 2 },
        { n: 6, l: 'p', count: 6 },
        { n: 6, l: 'd', count: 10 },
        { n: 7, l: 's', count: 2 },
        { n: 7, l: 'p', count: 6 },
      ],
    }
    if (coreConfigs[core]) {
      result.push(...coreConfigs[core])
    }
  }

  const remainder = config.replace(/\[[A-Za-z]+\]/g, '').trim()
  const regex = /([1-7])([spdf])(\d{1,2})?/g
  for (const match of remainder.matchAll(regex)) {
    const n = Number(match[1])
    const l = match[2] as 's' | 'p' | 'd' | 'f'
    const count = match[3] ? Number(match[3]) : 1
    result.push({ n, l, count })
  }

  return result
}

/**
 * Organizes subshells into Slater's groups:
 * [1s], [2s,2p], [3s,3p], [3d], [4s,4p], [4d], [4f], [5s,5p], etc.
 */
export function buildSlaterGroups(subshells: SubshellPopulation[]): SlaterGroup[] {
  const groups: SlaterGroup[] = []

  // Track max n
  const maxN = Math.max(...subshells.map((s) => s.n), 1)

  for (let n = 1; n <= maxN; n++) {
    // 1. (ns, np)
    const spCount = subshells
      .filter((s) => s.n === n && (s.l === 's' || s.l === 'p'))
      .reduce((sum, s) => sum + s.count, 0)
    if (spCount > 0) {
      groups.push({
        label: n === 1 ? '1s' : `${n}s,${n}p`,
        n,
        type: 'sp',
        electrons: spCount,
      })
    }

    // 2. (nd)
    const dCount = subshells
      .filter((s) => s.n === n && s.l === 'd')
      .reduce((sum, s) => sum + s.count, 0)
    if (dCount > 0) {
      groups.push({
        label: `${n}d`,
        n,
        type: 'd',
        electrons: dCount,
      })
    }

    // 3. (nf)
    const fCount = subshells
      .filter((s) => s.n === n && s.l === 'f')
      .reduce((sum, s) => sum + s.count, 0)
    if (fCount > 0) {
      groups.push({
        label: `${n}f`,
        n,
        type: 'f',
        electrons: fCount,
      })
    }
  }

  return groups
}

/**
 * Returns the canonical Slater group label for a given principal shell n and subshell type.
 * e.g., (1, 's') -> '1s', (2, 'p') -> '2s,2p', (3, 'd') -> '3d', (4, 'f') -> '4f'
 */
export function getSlaterGroupLabel(n: number, subshellType: 's' | 'p' | 'd' | 'f'): string {
  if (subshellType === 's' || subshellType === 'p') {
    return n === 1 ? '1s' : `${n}s,${n}p`
  }
  return `${n}${subshellType}`
}

/**
 * Ranks Slater groups in strict energy/distance order according to John C. Slater (Phys. Rev. 36, 57, 1930):
 * (1s) < (2s,2p) < (3s,3p) < (3d) < (4s,4p) < (4d) < (4f) < (5s,5p) < (5d) < (5f) < ...
 */
export function getSlaterGroupRank(n: number, type: 'sp' | 'd' | 'f'): number {
  const base = (n - 1) * 3
  if (type === 'sp') return base + 1
  if (type === 'd') return base + 2
  return base + 3 // 'f'
}

/**
 * Parses any orbital/subshell designation (e.g. '1s', '2s,2p', '2p', '3d', '4f') into
 * its standard Slater group label, principal quantum number n, and group type ('sp' | 'd' | 'f').
 */
export function parseSlaterGroupLabel(label: string): { standardLabel: string; n: number; type: 'sp' | 'd' | 'f' } {
  const clean = label.trim().toLowerCase()
  if (clean === '1s' || clean.startsWith('1s')) {
    return { standardLabel: '1s', n: 1, type: 'sp' }
  }
  const dMatch = clean.match(/^(\d+)d$/)
  if (dMatch) {
    const n = parseInt(dMatch[1], 10)
    return { standardLabel: `${n}d`, n, type: 'd' }
  }
  const fMatch = clean.match(/^(\d+)f$/)
  if (fMatch) {
    const n = parseInt(fMatch[1], 10)
    return { standardLabel: `${n}f`, n, type: 'f' }
  }
  const spMatch = clean.match(/^(\d+)(?:s|p|s,\d+p)$/)
  if (spMatch) {
    const n = parseInt(spMatch[1], 10)
    return { standardLabel: n === 1 ? '1s' : `${n}s,${n}p`, n, type: 'sp' }
  }
  const genMatch = clean.match(/^(\d+)([spdf])/)
  if (genMatch) {
    const n = parseInt(genMatch[1], 10)
    const l = genMatch[2]
    if (l === 'd') return { standardLabel: `${n}d`, n, type: 'd' }
    if (l === 'f') return { standardLabel: `${n}f`, n, type: 'f' }
    return { standardLabel: n === 1 ? '1s' : `${n}s,${n}p`, n, type: 'sp' }
  }
  return { standardLabel: clean, n: 1, type: 'sp' }
}

/**
 * Calculates Slater screening (sigma) and effective nuclear charge (Z_eff)
 * for a test electron in the valence (or specified) group.
 */
export function calculateSlaterScreening(
  z: number,
  configuration: string,
  targetGroupLabel?: string
): SlaterResult {
  const subshells = parseConfiguration(configuration)
  const groups = buildSlaterGroups(subshells)

  if (groups.length === 0) {
    return {
      z,
      targetSubshell: '1s',
      screeningConstant: 0,
      zEffective: z,
      groups: [],
      bindingEnergyEv: 13.6 * z * z,
    }
  }

  let targetGroup: SlaterGroup
  let targetRank: number

  if (targetGroupLabel) {
    const parsed = parseSlaterGroupLabel(targetGroupLabel)
    targetRank = getSlaterGroupRank(parsed.n, parsed.type)
    const existing = groups.find((g) => g.label === parsed.standardLabel)
    if (existing) {
      targetGroup = existing
    } else {
      // Virtual/unoccupied group: test electron has zero peers in target shell
      targetGroup = {
        label: parsed.standardLabel,
        n: parsed.n,
        type: parsed.type,
        electrons: 1,
      }
    }
  } else {
    targetGroup = groups[groups.length - 1]
    targetRank = getSlaterGroupRank(targetGroup.n, targetGroup.type)
  }

  let sigma = 0

  if (targetGroup.type === 'sp') {
    // Case 1: [1s] group
    if (targetGroup.n === 1) {
      // For 1s, other 1s electron contributes 0.30
      sigma += (targetGroup.electrons - 1) * 0.30
    } else {
      // (a) Other electrons in the same (ns, np) group contribute 0.35 each
      sigma += (targetGroup.electrons - 1) * 0.35

      // (b) Groups lying to the left (lower rank in Slater's order)
      for (const g of groups) {
        if (getSlaterGroupRank(g.n, g.type) < targetRank) {
          if (g.n === targetGroup.n - 1) {
            sigma += g.electrons * 0.85
          } else if (g.n < targetGroup.n - 1) {
            sigma += g.electrons * 1.00
          }
        }
      }
    }
  } else {
    // Case 2: [nd] or [nf] group
    // (a) Other electrons in the same group contribute 0.35 each
    sigma += (targetGroup.electrons - 1) * 0.35

    // (b) All electrons in groups lying to the left contribute 1.00 each
    for (const g of groups) {
      if (getSlaterGroupRank(g.n, g.type) < targetRank) {
        sigma += g.electrons * 1.00
      }
    }
  }

  const zEffective = Math.max(0.1, z - sigma)

  // Slater's effective quantum number n* for energy estimation:
  // n = 1 -> 1, 2 -> 2, 3 -> 3, 4 -> 3.7, 5 -> 4.0, 6 -> 4.2, 7 -> 4.4
  const nStarMap: Record<number, number> = {
    1: 1.0,
    2: 2.0,
    3: 3.0,
    4: 3.7,
    5: 4.0,
    6: 4.2,
    7: 4.4,
  }
  const nStar = nStarMap[targetGroup.n] ?? targetGroup.n
  const bindingEnergyEv = 13.6057 * Math.pow(zEffective / nStar, 2)

  return {
    z,
    targetSubshell: targetGroup.label,
    screeningConstant: Number(sigma.toFixed(3)),
    zEffective: Number(zEffective.toFixed(3)),
    groups,
    bindingEnergyEv: Number(bindingEnergyEv.toFixed(3)),
  }
}

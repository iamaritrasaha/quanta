import { elements, type Element, type ElementCategory } from './elements'

/**
 * Common English and alternate spelling variants for elements.
 */
export const SPELLING_ALIASES: Record<string, string> = {
  aluminum: 'aluminium',
  aluminium: 'aluminium',
  cesium: 'caesium',
  caesium: 'caesium',
  wolfram: 'tungsten',
  tungsten: 'tungsten',
}

/**
 * Matches an element against a query string.
 *
 * Requirements:
 * - Empty query matches all elements.
 * - Purely numeric query matches EXACT atomic number (e.g. "1" matches H, not 11 or 21).
 * - Matches chemical symbol (exact or prefix, case-insensitive).
 * - Matches element name (exact, prefix, or substring, case-insensitive).
 * - Supports common spelling aliases (e.g. aluminum -> aluminium, cesium -> caesium).
 */
export function matchElement(element: Element, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return true

  // Purely numeric query -> exact atomic number match
  if (/^\d+$/.test(q)) {
    return element.number === Number.parseInt(q, 10)
  }

  const nameLower = element.name.toLowerCase()
  const symbolLower = element.symbol.toLowerCase()

  // Exact symbol or name match
  if (symbolLower === q || nameLower === q) return true

  // Direct alias resolution (e.g., query "aluminum" matches element "Aluminium")
  const canonical = SPELLING_ALIASES[q]
  if (canonical && nameLower === canonical) return true

  // Partial match on aliases (e.g. "alumin" matches "aluminium", "cesi" matches "caesium")
  for (const [alias, targetName] of Object.entries(SPELLING_ALIASES)) {
    if (alias.startsWith(q) && nameLower === targetName) return true
    if (targetName.startsWith(q) && nameLower === targetName) return true
  }

  // Symbol prefix (e.g. "c" matches C, Cl, Cr, Co, Cu, Cd, Cs, Ce, Cf, Cn)
  if (symbolLower.startsWith(q)) return true

  // Substring match in element name
  if (nameLower.includes(q)) return true

  return false
}

/**
 * Filters the 118 elements by a search query and optional chemical category.
 */
export function filterElements(
  query: string,
  categoryFilter?: ElementCategory | 'all'
): Element[] {
  return elements.filter((element) => {
    if (categoryFilter && categoryFilter !== 'all' && element.category !== categoryFilter) {
      return false
    }
    return matchElement(element, query)
  })
}

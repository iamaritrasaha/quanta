import type { ElementModelState } from '../../physics/elementModel'
import type { ComboboxOption } from './StateCombobox'

// CM-1 to eV conversion factor: 1 eV = 8065.54429 cm-1
const CM_TO_EV = 1 / 8065.54429

/**
 * Converts standard term symbol digits to superscript Unicode:
 * e.g. "2P*" -> "²P*", "1S" -> "¹S", "3D" -> "³D", "4F" -> "⁴F"
 */
export function formatTermSymbol(term?: string): string {
  if (!term) return ''
  const superscripts: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  }

  return term.replace(/^(\d+)/, (m) =>
    m
      .split('')
      .map((d) => superscripts[d] ?? d)
      .join('')
  )
}

/**
 * Formats an ElementModelState into a rich, searchable ComboboxOption.
 */
export function formatElementStateOption(
  state: ElementModelState,
  isGroundState = false
): ComboboxOption {
  const isGround = isGroundState || state.id === 'ground' || state.id.startsWith('ground-')
  const isSchematic = state.schematic

  if (isGround) {
    const termFormatted = formatTermSymbol(state.term)
    const jPart = state.j ? ` (J = ${state.j})` : ''
    const configPart = state.configuration ? `${state.configuration} ` : ''
    const label = `${configPart}${termFormatted}${jPart}`.trim() || 'Ground State'

    return {
      value: state.id,
      label: `Ground State · ${label}`,
      subLabel: 'E = 0.00 cm⁻¹ (0.000 eV) · Lowest energy electronic ground state',
      badge: 'GROUND',
      badgeVariant: 'ground',
      keywords: ['ground', '0', 'lowest', state.configuration, state.term ?? '', state.j ?? ''],
    }
  }

  if (isSchematic) {
    const outerShell = state.shells[state.shells.length - 1]
    const label = state.label || `Promoted shell n=${outerShell?.shell ?? '?'}`

    return {
      value: state.id,
      label: label.replace(/^Promote\s+/, 'Promoted: '),
      subLabel: 'Schematic orbital promotion · Pedagogical shell visualization',
      badge: 'SCHEMATIC',
      badgeVariant: 'schematic',
      keywords: ['schematic', 'promote', 'shell', String(outerShell?.shell ?? '')],
    }
  }

  // NIST ASD Spectroscopic Level
  const cleanConfig = state.configuration.replace(/\./g, '·')
  const termFormatted = formatTermSymbol(state.term)
  const jPart = state.j ? ` (J = ${state.j})` : ''
  const primaryLabel = `${cleanConfig}  ${termFormatted}${jPart}`.trim()

  const energyCm = state.energyCm ?? state.rank
  const energyEv = energyCm * CM_TO_EV
  const subLabel = `E = ${energyCm.toLocaleString('en-US', {
    maximumFractionDigits: 1,
  })} cm⁻¹ · ${energyEv.toFixed(3)} eV`

  return {
    value: state.id,
    label: primaryLabel,
    subLabel,
    badge: 'NIST ASD',
    badgeVariant: 'nist',
    keywords: [
      state.configuration,
      cleanConfig,
      state.term ?? '',
      termFormatted,
      state.j ?? '',
      `J=${state.j ?? ''}`,
      `${energyEv.toFixed(2)}eV`,
      `${Math.round(energyCm)}cm`,
    ],
  }
}

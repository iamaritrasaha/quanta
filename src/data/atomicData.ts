import atomicProperties from './atomicProperties.json'

export interface AtomicProperties {
  number: number
  symbol: string
  name: string
  atomicMassU: string
  cpkHexColor: string
  electronConfiguration: string
  electronegativityPauling: string
  atomicRadiusPm: string
  ionizationEnergyEv: string
  electronAffinityEv: string
  oxidationStates: string
  standardState: string
  meltingPointK: string
  boilingPointK: string
  densityGPerCm3: string
  yearDiscovered: string
  configurationSource?: string
  configurationSourceUrl?: string
}

const propertyData = atomicProperties as { elements: AtomicProperties[] }

// The PubChem snapshot retains an older 6d assignment for Lr. NIST ASD lists 7s²7p.
// Keep the raw snapshot intact and apply this explicitly attributed correction at lookup.
const propertiesBySymbol = new Map(propertyData.elements.map((element): [string, AtomicProperties] => [
  element.symbol,
  element.symbol === 'Lr'
    ? {
        ...element,
        electronConfiguration: '[Rn]5f14 7s2 7p1',
        configurationSource: 'NIST ASD Lr I ground configuration',
        configurationSourceUrl: 'https://physics.nist.gov/cgi-bin/ASD/energy1.pl?spectrum=Lr+I&units=0&format=0&conf_out=on&term_out=on&level_out=on&j_out=on',
      }
    : element,
]))

export function getAtomicProperties(symbol: string): AtomicProperties | undefined {
  return propertiesBySymbol.get(symbol)
}

const NOBLE_GAS_SHELLS: Record<string, Record<number, number>> = {
  He: { 1: 2 },
  Ne: { 1: 2, 2: 8 },
  Ar: { 1: 2, 2: 8, 3: 8 },
  Kr: { 1: 2, 2: 8, 3: 18, 4: 8 },
  Xe: { 1: 2, 2: 8, 3: 18, 4: 18, 5: 8 },
  Rn: { 1: 2, 2: 8, 3: 18, 4: 32, 5: 18, 6: 8 },
  Og: { 1: 2, 2: 8, 3: 18, 4: 32, 5: 32, 6: 18, 7: 8 },
}

/** Shell totals are parsed from the published configuration, including its noble-gas core. */
export function getShellOccupancy(configuration: string): Array<{ shell: number; electrons: number }> {
  const occupancy = new Map<number, number>()
  const core = configuration.match(/\[([A-Za-z]+)\]/)?.[1]

  if (core) {
    Object.entries(NOBLE_GAS_SHELLS[core] ?? {}).forEach(([shell, count]) => {
      occupancy.set(Number(shell), count)
    })
  }

  const valenceConfiguration = configuration.replace(/\[[A-Za-z]+\]/g, '')
  const subshells = /([1-7])([spdf])\s*(\d{1,2})/g
  for (const match of valenceConfiguration.matchAll(subshells)) {
    const shell = Number(match[1])
    occupancy.set(shell, (occupancy.get(shell) ?? 0) + Number(match[3]))
  }

  return [...occupancy.entries()]
    .filter(([, electrons]) => electrons > 0)
    .sort(([a], [b]) => a - b)
    .map(([shell, electrons]) => ({ shell, electrons }))
}

export function getConfigurationElectronCount(configuration: string): number {
  return getShellOccupancy(configuration).reduce((total, shell) => total + shell.electrons, 0)
}

export function getElementColor(properties: AtomicProperties): string {
  return /^([0-9a-f]{6})$/i.test(properties.cpkHexColor)
    ? `#${properties.cpkHexColor}`
    : '#60a5fa'
}

export const ATOMIC_PROPERTIES_SOURCE = 'PubChem Periodic Table (PUG REST)'
export const ATOMIC_PROPERTIES_SOURCE_URL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON'

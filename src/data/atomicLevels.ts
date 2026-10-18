import nistLevels from './nistLevels.json'

export interface AtomicLevel {
  configuration: string
  term: string
  j: string
  energyCm: number
}

interface NistElementLevels {
  levels: AtomicLevel[]
  status: 'available' | 'unavailable'
  ionizationLimitCm?: number
  note?: string
}

const levelData = nistLevels as { elements: Record<string, NistElementLevels> }
const UNAVAILABLE: NistElementLevels = { levels: [], status: 'unavailable' }
const CM_TO_EV = 1.2398419843320026e-4

export function getNistLevels(symbol: string): NistElementLevels {
  return levelData.elements[symbol] ?? UNAVAILABLE
}

/** A positive energy separation gives a vacuum wavelength, without asserting an allowed line. */
export function calculateLevelSeparation(lower: AtomicLevel | undefined, upper: AtomicLevel | undefined) {
  if (!lower || !upper) return undefined
  const wavenumberCm = upper.energyCm - lower.energyCm
  if (!Number.isFinite(wavenumberCm) || wavenumberCm <= 0) return undefined
  return { wavenumberCm, wavelengthNm: 1e7 / wavenumberCm, energyEv: wavenumberCm * CM_TO_EV }
}

export const NIST_LEVELS_SOURCE = 'NIST Atomic Spectra Database (ASD)'
export const NIST_LEVELS_SOURCE_URL = 'https://physics.nist.gov/asd'

import { BOHR_RADIUS, ELECTRON_VOLT, HYDROGEN_GROUND_ENERGY_EV, LIGHT_SPEED, PLANCK, RYDBERG_H, evToJoules, metresToNm } from './constants'

export type SpectralSeries = 'Lyman' | 'Balmer' | 'Paschen' | 'Brackett' | 'Pfund' | 'Other'
export type RadiationBand = 'ultraviolet' | 'visible' | 'infrared'

export const FINE_STRUCTURE_CONSTANT = 7.297_352_5693e-3
export const BOHR_VELOCITY_GROUND = FINE_STRUCTURE_CONSTANT * LIGHT_SPEED // ~2.18769e6 m/s

export function validatePrincipalNumber(n: number): boolean {
  return Number.isInteger(n) && n >= 1
}

export function hydrogenEnergy(n: number): number {
  if (!validatePrincipalNumber(n)) throw new RangeError('Principal quantum number must be an integer ≥ 1')
  return HYDROGEN_GROUND_ENERGY_EV / (n * n)
}

export function bohrRadius(n: number): number {
  if (!validatePrincipalNumber(n)) throw new RangeError('Principal quantum number must be an integer ≥ 1')
  return BOHR_RADIUS * n * n
}

export function bohrVelocity(n: number): number {
  if (!validatePrincipalNumber(n)) throw new RangeError('Principal quantum number must be an integer ≥ 1')
  return BOHR_VELOCITY_GROUND / n
}

export function classifySpectralSeries(initialN: number, finalN: number): SpectralSeries {
  const lower = Math.min(initialN, finalN)
  const upper = Math.max(initialN, finalN)
  if (lower === upper || lower < 1) return 'Other'
  const map: Record<number, SpectralSeries> = { 1: 'Lyman', 2: 'Balmer', 3: 'Paschen', 4: 'Brackett', 5: 'Pfund' }
  return map[lower] ?? 'Other'
}

export function getSpectralLineName(initialN: number, finalN: number): string {
  const lower = Math.min(initialN, finalN)
  const upper = Math.max(initialN, finalN)
  const delta = upper - lower
  const greekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ']
  const greek = greekLetters[delta - 1] ?? `(Δn=${delta})`

  if (lower === 1) return `Ly-${greek}`
  if (lower === 2) return `H-${greek}`
  if (lower === 3) return `Pa-${greek}`
  if (lower === 4) return `Br-${greek}`
  if (lower === 5) return `Pf-${greek}`
  return `n=${upper}→${lower}`
}

export function classifyRadiation(wavelengthNm: number): RadiationBand {
  if (wavelengthNm < 380) return 'ultraviolet'
  if (wavelengthNm <= 740) return 'visible'
  return 'infrared'
}

export interface HydrogenTransition {
  initialN: number
  finalN: number
  deltaEnergyEv: number
  photonEnergyEv: number
  frequencyHz: number
  wavelengthM: number
  wavelengthNm: number
  rydbergWavelengthNm: number
  direction: 'absorption' | 'emission'
  series: SpectralSeries
  lineName: string
  band: RadiationBand
  displayColor: string
  isTrueColor: boolean
}

/**
 * Validates whether two quantum levels form a legal transition.
 */
export function isValidTransition(initialN: number, finalN: number): boolean {
  return validatePrincipalNumber(initialN) && validatePrincipalNumber(finalN) && initialN !== finalN
}

/**
 * Safe transition calculation that returns null on identical or invalid levels,
 * preventing unhandled exceptions in UI and rendering components.
 */
export function safeHydrogenTransition(initialN: number, finalN: number): HydrogenTransition | null {
  if (!isValidTransition(initialN, finalN)) {
    return null
  }
  return hydrogenTransition(initialN, finalN)
}

/**
 * Values are derived from the foundational Rydberg / Bohr level equation.
 * Rydberg output is exposed as an analytic cross-check.
 */
export function hydrogenTransition(initialN: number, finalN: number): HydrogenTransition {
  if (!isValidTransition(initialN, finalN)) {
    throw new RangeError('A transition requires two different positive integer levels (initial !== final)')
  }
  const deltaEnergyEv = hydrogenEnergy(finalN) - hydrogenEnergy(initialN)
  const photonEnergyEv = Math.abs(deltaEnergyEv)
  const frequencyHz = evToJoules(photonEnergyEv) / PLANCK
  const wavelengthM = LIGHT_SPEED / frequencyHz
  const rydbergWavelengthNm = metresToNm(1 / (RYDBERG_H * Math.abs(1 / (finalN ** 2) - 1 / (initialN ** 2))))
  const wavelengthNm = metresToNm(wavelengthM)
  const band = classifyRadiation(wavelengthNm)
  const displayColor = wavelengthToDisplayColor(wavelengthNm)
  const isTrueColor = band === 'visible'

  return {
    initialN,
    finalN,
    deltaEnergyEv,
    photonEnergyEv,
    frequencyHz,
    wavelengthM,
    wavelengthNm,
    rydbergWavelengthNm,
    direction: deltaEnergyEv > 0 ? 'absorption' : 'emission',
    series: classifySpectralSeries(initialN, finalN),
    lineName: getSpectralLineName(initialN, finalN),
    band,
    displayColor,
    isTrueColor,
  }
}

/**
 * Physically calibrated visible-spectrum color mapping with continuous falloff.
 * Non-visible radiation bands (UV/IR) use distinctly styled false-color representations.
 */
export function wavelengthToDisplayColor(wavelengthNm: number): string {
  // UV visualization color: ethereal indigo-violet
  if (wavelengthNm < 380) return '#818cf8'
  // IR visualization color: deep infrared rose-crimson
  if (wavelengthNm > 740) return '#f43f5e'

  let r = 0
  let g = 0
  let b = 0

  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    r = -(wavelengthNm - 440) / (440 - 380)
    g = 0.0
    b = 1.0
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    r = 0.0
    g = (wavelengthNm - 440) / (490 - 440)
    b = 1.0
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    r = 0.0
    g = 1.0
    b = -(wavelengthNm - 510) / (510 - 490)
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    r = (wavelengthNm - 510) / (580 - 510)
    g = 1.0
    b = 0.0
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    r = 1.0
    g = -(wavelengthNm - 645) / (645 - 580)
    b = 0.0
  } else if (wavelengthNm >= 645 && wavelengthNm <= 740) {
    r = 1.0
    g = 0.0
    b = 0.0
  }

  // Intensity falloff at the human vision limits
  let intensity = 1.0
  if (wavelengthNm < 420) {
    intensity = 0.3 + (0.7 * (wavelengthNm - 380)) / (420 - 380)
  } else if (wavelengthNm > 700) {
    intensity = 0.3 + (0.7 * (740 - wavelengthNm)) / (740 - 700)
  }

  const red = Math.round(r * intensity * 255)
  const green = Math.round(g * intensity * 255)
  const blue = Math.round(b * intensity * 255)

  return `rgb(${red}, ${green}, ${blue})`
}

export function formatFrequency(hz: number): string {
  if (hz >= 1e15) return `${(hz / 1e15).toFixed(3)} PHz`
  if (hz >= 1e12) return `${(hz / 1e12).toFixed(2)} THz`
  return `${(hz / 1e9).toFixed(2)} GHz`
}

export const electronVoltInJoules = ELECTRON_VOLT

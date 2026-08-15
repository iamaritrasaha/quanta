import { BOHR_RADIUS, ELECTRON_VOLT, HYDROGEN_GROUND_ENERGY_EV, LIGHT_SPEED, PLANCK, RYDBERG_H, evToJoules, metresToNm } from './constants'

export type SpectralSeries = 'Lyman' | 'Balmer' | 'Paschen' | 'Brackett' | 'Pfund' | 'Other'
export type RadiationBand = 'ultraviolet' | 'visible' | 'infrared'

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

export function classifySpectralSeries(initialN: number, finalN: number): SpectralSeries {
  if (initialN <= finalN || finalN < 1) return 'Other'
  return ({ 1: 'Lyman', 2: 'Balmer', 3: 'Paschen', 4: 'Brackett', 5: 'Pfund' } as Record<number, SpectralSeries>)[finalN] ?? 'Other'
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
  band: RadiationBand
}

/** Values are derived from the same level equation; Rydberg output is exposed as a cross-check. */
export function hydrogenTransition(initialN: number, finalN: number): HydrogenTransition {
  if (!validatePrincipalNumber(initialN) || !validatePrincipalNumber(finalN) || initialN === finalN) {
    throw new RangeError('A transition requires two different positive integer levels')
  }
  const deltaEnergyEv = hydrogenEnergy(finalN) - hydrogenEnergy(initialN)
  const photonEnergyEv = Math.abs(deltaEnergyEv)
  const frequencyHz = evToJoules(photonEnergyEv) / PLANCK
  const wavelengthM = LIGHT_SPEED / frequencyHz
  const rydbergWavelengthNm = metresToNm(1 / (RYDBERG_H * Math.abs(1 / (finalN ** 2) - 1 / (initialN ** 2))))
  const wavelengthNm = metresToNm(wavelengthM)
  return {
    initialN, finalN, deltaEnergyEv, photonEnergyEv, frequencyHz, wavelengthM, wavelengthNm, rydbergWavelengthNm,
    direction: deltaEnergyEv > 0 ? 'absorption' : 'emission',
    series: classifySpectralSeries(Math.max(initialN, finalN), Math.min(initialN, finalN)),
    band: classifyRadiation(wavelengthNm),
  }
}

export function wavelengthToDisplayColor(wavelengthNm: number): string {
  // Approximate visible-light mapping. UV/IR use deliberately non-physical UI colors.
  if (wavelengthNm < 380) return '#9b7cff'
  if (wavelengthNm > 740) return '#ff5f94'
  let r = 0, g = 0, b = 0
  if (wavelengthNm < 440) { r = -(wavelengthNm - 440) / 60; b = 1 }
  else if (wavelengthNm < 490) { g = (wavelengthNm - 440) / 50; b = 1 }
  else if (wavelengthNm < 510) { g = 1; b = -(wavelengthNm - 510) / 20 }
  else if (wavelengthNm < 580) { r = (wavelengthNm - 510) / 70; g = 1 }
  else if (wavelengthNm < 645) { r = 1; g = -(wavelengthNm - 645) / 65 }
  else r = 1
  const factor = wavelengthNm < 420 ? .45 + .55 * (wavelengthNm - 380) / 40 : wavelengthNm > 700 ? .45 + .55 * (740 - wavelengthNm) / 40 : 1
  return `rgb(${Math.round(255 * r * factor)}, ${Math.round(255 * g * factor)}, ${Math.round(255 * b * factor)})`
}

export const formatFrequency = (hz: number) => hz >= 1e15 ? `${(hz / 1e15).toFixed(3)} PHz` : `${(hz / 1e12).toFixed(2)} THz`
export const electronVoltInJoules = ELECTRON_VOLT

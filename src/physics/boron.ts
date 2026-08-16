import { cm1ToEv } from './constants'
import { type RadiationBand } from './hydrogen'

export type Multiplicity = 'doublet'

export interface BoronLevel {
  id: string
  configuration: string // e.g. "2s²2p", "2s2p²", "2s²3s"
  term: string
  termSymbol: string // e.g. "²P°₁/₂", "²D₅/₂", "²F°₅/₂,₇/₂" (grouped fine-structure)
  multiplicity: Multiplicity
  spinS: number // 0.5 for all neutral B I doublet states
  L: number // 0 for S, 1 for P, 2 for D, 3 for F
  J: number | string // Total angular momentum, or grouped string e.g. "5/2,7/2"
  parity: 'even' | 'odd'
  series: 'S' | 'P' | 'D' | 'F'
  wavenumberCm1: number // NIST ASD excitation wavenumber above 2s²2p ²P°₁/₂ ground state (cm⁻¹)
  energyEv: number // Derived from wavenumberCm1: wavenumberCm1 * CM1_TO_EV
  isMultipletCentroid?: boolean
  source: string
}

export interface FineStructureComponent {
  lowerJ: number | string
  upperJ: number | string
  wavelengthNm: number
  wavelengthMedium: 'air' | 'vacuum'
  wavenumberCm1?: number
  relativeIntensity?: number
  comment?: string
}

export interface BoronTransition {
  id: string
  lowerLevelId: string
  upperLevelId: string
  wavelengthNm: number // Reference persistent-line wavelength
  wavelengthMedium: 'air' | 'vacuum'
  referenceWavelengthNm: number // Explicit NIST reference line value
  referenceWavelengthMedium: 'air' | 'vacuum'
  derivedVacuumWavelengthNm: number // Level-difference derived vacuum wavelength: 10^7 / Δṽ
  derivedAirWavelengthNm: number // Level-difference derived air wavelength via standard refractive index
  components?: FineStructureComponent[]
  deltaEnergyEv: number // E(upper) - E(lower) > 0
  photonEnergyEv: number // Strictly positive photon quantum energy
  frequencyHz: number
  region: 'UV' | 'VISIBLE' | 'NIR'
  band: RadiationBand
  displayColor: string
  colorDescription: string
  isTrueColor: boolean
  classification: string
  lineName: string
  description: string
  source: string
}

export interface ElectronQuantumState {
  n: number
  l: number
  ml: number
  ms: 0.5 | -0.5
}

/**
 * Standard Refractive Index of Dry Air at 15°C, 101.325 kPa (NIST ASD standard convention / Peck & Reeder 1972).
 * Shared conversion contract with Lithium/Beryllium — reused rather than re-derived per element.
 */
export function vacuumWavenumberToAirWavelengthNm(wavenumberCm1: number): number {
  if (wavenumberCm1 <= 0) return 0
  const vacWavelengthNm = 1e7 / wavenumberCm1
  if (vacWavelengthNm < 200) {
    return vacWavelengthNm
  }
  const sigma = wavenumberCm1 * 1e-4
  const sigma2 = sigma * sigma
  const nMinus1 = 1e-8 * (8342.54 + 2406147.0 / (130.0 - sigma2) + 15998.0 / (38.9 - sigma2))
  const nAir = 1.0 + nMinus1
  return vacWavelengthNm / nAir
}

/**
 * Curated NIST Atomic Spectra Database (ASD) B I Energy Levels.
 * Primary Source: NIST ASD Level Database (Kramida et al., 2024).
 *
 * Boron is QUANTA's FIRST element with an OPEN p SUBSHELL in the ground state
 * (1s²2s²2p, ground term ²P°₁/₂ — nonzero orbital angular momentum L=1, odd parity).
 * Boron is NOT "Beryllium plus another orbiting dot": the ground state already carries
 * directional p-character and genuine fine-structure splitting in the ground term itself.
 *
 * The 2s²4f level is reported by the source compilation as a single grouped-J value
 * spanning both fine-structure components (²F°₅/₂,₇/₂) — individual splitting is not
 * resolved in this curated set, mirroring the grouped-J convention used for Beryllium's
 * 2s3d ³D manifold.
 */
export const BORON_LEVELS: BoronLevel[] = [
  // Ground fine-structure doublet: 2s²2p ²P°
  {
    id: '2p_2P1_2',
    configuration: '2s²2p',
    term: '2s²2p ²P°',
    termSymbol: '²P°₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 0.5,
    parity: 'odd',
    series: 'P',
    wavenumberCm1: 0.0,
    energyEv: 0.0,
    source: 'NIST ASD Reference Data (Ground State Reference)',
  },
  {
    id: '2p_2P3_2',
    configuration: '2s²2p',
    term: '2s²2p ²P°',
    termSymbol: '²P°₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 1.5,
    parity: 'odd',
    series: 'P',
    wavenumberCm1: 15.287,
    energyEv: cm1ToEv(15.287),
    source: 'NIST ASD Reference Data',
  },

  // 2s²3s ²S₁/₂
  {
    id: '3s_2S1_2',
    configuration: '2s²3s',
    term: '2s²3s ²S',
    termSymbol: '²S₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 0,
    J: 0.5,
    parity: 'even',
    series: 'S',
    wavenumberCm1: 40039.695,
    energyEv: cm1ToEv(40039.695),
    source: 'NIST ASD Reference Data',
  },

  // 2s2p² ²D fine-structure doublet (both valence electrons in n=2, one promoted to 2p)
  {
    id: '2p2_2D5_2',
    configuration: '2s2p²',
    term: '2s2p² ²D',
    termSymbol: '²D₅/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 2.5,
    parity: 'even',
    series: 'D',
    wavenumberCm1: 47856.807,
    energyEv: cm1ToEv(47856.807),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2p2_2D3_2',
    configuration: '2s2p²',
    term: '2s2p² ²D',
    termSymbol: '²D₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 1.5,
    parity: 'even',
    series: 'D',
    wavenumberCm1: 47857.127,
    energyEv: cm1ToEv(47857.127),
    source: 'NIST ASD Reference Data',
  },

  // 2s²3p ²P° fine-structure doublet
  {
    id: '3p_2P1_2',
    configuration: '2s²3p',
    term: '2s²3p ²P°',
    termSymbol: '²P°₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 0.5,
    parity: 'odd',
    series: 'P',
    wavenumberCm1: 48611.872,
    energyEv: cm1ToEv(48611.872),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '3p_2P3_2',
    configuration: '2s²3p',
    term: '2s²3p ²P°',
    termSymbol: '²P°₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 1.5,
    parity: 'odd',
    series: 'P',
    wavenumberCm1: 48613.655,
    energyEv: cm1ToEv(48613.655),
    source: 'NIST ASD Reference Data',
  },

  // 2s²3d ²D fine-structure doublet
  {
    id: '3d_2D3_2',
    configuration: '2s²3d',
    term: '2s²3d ²D',
    termSymbol: '²D₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 1.5,
    parity: 'even',
    series: 'D',
    wavenumberCm1: 54767.698,
    energyEv: cm1ToEv(54767.698),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '3d_2D5_2',
    configuration: '2s²3d',
    term: '2s²3d ²D',
    termSymbol: '²D₅/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 2.5,
    parity: 'even',
    series: 'D',
    wavenumberCm1: 54767.844,
    energyEv: cm1ToEv(54767.844),
    source: 'NIST ASD Reference Data',
  },

  // 2s²4s ²S₁/₂
  {
    id: '4s_2S1_2',
    configuration: '2s²4s',
    term: '2s²4s ²S',
    termSymbol: '²S₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 0,
    J: 0.5,
    parity: 'even',
    series: 'S',
    wavenumberCm1: 55010.236,
    energyEv: cm1ToEv(55010.236),
    source: 'NIST ASD Reference Data',
  },

  // 2s²4p ²P° fine-structure doublet
  {
    id: '4p_2P1_2',
    configuration: '2s²4p',
    term: '2s²4p ²P°',
    termSymbol: '²P°₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 0.5,
    parity: 'odd',
    series: 'P',
    wavenumberCm1: 57786.436,
    energyEv: cm1ToEv(57786.436),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '4p_2P3_2',
    configuration: '2s²4p',
    term: '2s²4p ²P°',
    termSymbol: '²P°₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 1.5,
    parity: 'odd',
    series: 'P',
    wavenumberCm1: 57787.071,
    energyEv: cm1ToEv(57787.071),
    source: 'NIST ASD Reference Data',
  },

  // 2s²4f ²F° grouped fine-structure (J=5/2, 7/2 reported at a single wavenumber)
  {
    id: '4f_2F',
    configuration: '2s²4f',
    term: '2s²4f ²F°',
    termSymbol: '²F°₅/₂,₇/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 3,
    J: '5/2,7/2',
    parity: 'odd',
    series: 'F',
    wavenumberCm1: 60031.085,
    energyEv: cm1ToEv(60031.085),
    source: 'NIST ASD Reference Data (single reported value spanning J=5/2, 7/2 — individual fine-structure splitting not resolved in this compilation)',
  },
]

/**
 * Curated NIST B I Persistent Spectral Transitions (small, scientifically meaningful set).
 * Strictly maintains invariant: energy(upperLevelId) > energy(lowerLevelId).
 *
 * Architecture explicitly separates:
 * - referenceWavelengthNm (stored NIST reference-line measurement)
 * - derivedVacuumWavelengthNm (10^7 / Δṽ calculated from currently stored level excitation wavenumbers)
 * - derivedAirWavelengthNm (derived vacuum wavelength converted via standard refractive index of air)
 */
export const BORON_TRANSITIONS: BoronTransition[] = [
  // A1. UV Ground-State Multiplet: 249.6769 nm (Air) — ²P°₁/₂ → ²S₁/₂
  {
    id: '249.68nm',
    lowerLevelId: '2p_2P1_2',
    upperLevelId: '3s_2S1_2',
    wavelengthNm: 249.6769,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 249.6769,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / 40039.695,
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(40039.695),
    deltaEnergyEv: cm1ToEv(40039.695),
    photonEnergyEv: cm1ToEv(40039.695),
    frequencyHz: 40039.695 * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#a855f7',
    colorDescription: 'False-color visualization (non-visible ultraviolet radiation)',
    isTrueColor: false,
    classification: 'UV Ground-State Multiplet (2s²2p ²P°₁/₂ ↔ 2s²3s ²S₁/₂)',
    lineName: 'B I 249.7 nm (Ground-State Multiplet)',
    description:
      'One of the two ground-state resonance lines of neutral Boron, connecting the ²P°₁/₂ fine-structure ground component to the 2s²3s ²S₁/₂ state.',
    source: 'NIST ASD Reference Data / NIST Persistent Lines (Air wavelength)',
  },

  // A2. UV Ground-State Multiplet (hero line): 249.7722 nm (Air) — ²P°₃/₂ → ²S₁/₂
  {
    id: '249.77nm',
    lowerLevelId: '2p_2P3_2',
    upperLevelId: '3s_2S1_2',
    wavelengthNm: 249.7722,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 249.7722,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (40039.695 - 15.287),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(40039.695 - 15.287),
    deltaEnergyEv: cm1ToEv(40039.695 - 15.287),
    photonEnergyEv: cm1ToEv(40039.695 - 15.287),
    frequencyHz: (40039.695 - 15.287) * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#c084fc',
    colorDescription: 'False-color visualization (non-visible ultraviolet radiation)',
    isTrueColor: false,
    classification: '~249.7 nm UV Ground-State Multiplet (2s²2p ²P°₃/₂ ↔ 2s²3s ²S₁/₂)',
    lineName: 'B I 249.7 nm (UV Ground-State Multiplet)',
    description:
      'Principal ground-state resonance line of neutral Boron, connecting the ²P°₃/₂ fine-structure ground component to the 2s²3s ²S₁/₂ state.',
    source: 'NIST ASD Reference Data / NIST Persistent Lines (Air wavelength)',
  },

  // B1. Deep-UV Ground → 3d: 182.5894 nm (Vacuum) — ²P°₁/₂ → ²D₃/₂
  {
    id: '182.59nm',
    lowerLevelId: '2p_2P1_2',
    upperLevelId: '3d_2D3_2',
    wavelengthNm: 182.5894,
    wavelengthMedium: 'vacuum',
    referenceWavelengthNm: 182.5894,
    referenceWavelengthMedium: 'vacuum',
    derivedVacuumWavelengthNm: 1e7 / 54767.698,
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(54767.698),
    deltaEnergyEv: cm1ToEv(54767.698),
    photonEnergyEv: cm1ToEv(54767.698),
    frequencyHz: 54767.698 * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#818cf8',
    colorDescription: 'False-color visualization (non-visible deep-ultraviolet radiation)',
    isTrueColor: false,
    classification: 'Deep-UV Ground Transition (2s²2p ²P°₁/₂ ↔ 2s²3d ²D₃/₂)',
    lineName: 'B I 182.6 nm (Deep-UV)',
    description: 'Deep-ultraviolet ground-state transition into the 2s²3d ²D₃/₂ Rydberg-like state, below the standard 200 nm air/vacuum reporting threshold.',
    source: 'NIST ASD Reference Data (Vacuum wavelength)',
  },

  // B2. Deep-UV Ground → 3d: 182.6400 nm (Vacuum) — ²P°₃/₂ → ²D₅/₂
  {
    id: '182.64nm',
    lowerLevelId: '2p_2P3_2',
    upperLevelId: '3d_2D5_2',
    wavelengthNm: 182.6400,
    wavelengthMedium: 'vacuum',
    referenceWavelengthNm: 182.6400,
    referenceWavelengthMedium: 'vacuum',
    derivedVacuumWavelengthNm: 1e7 / (54767.844 - 15.287),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(54767.844 - 15.287),
    deltaEnergyEv: cm1ToEv(54767.844 - 15.287),
    photonEnergyEv: cm1ToEv(54767.844 - 15.287),
    frequencyHz: (54767.844 - 15.287) * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#818cf8',
    colorDescription: 'False-color visualization (non-visible deep-ultraviolet radiation)',
    isTrueColor: false,
    classification: 'Deep-UV Ground Transition (2s²2p ²P°₃/₂ ↔ 2s²3d ²D₅/₂)',
    lineName: 'B I 182.6 nm (Deep-UV)',
    description: 'Deep-ultraviolet ground-state transition into the 2s²3d ²D₅/₂ Rydberg-like state, below the standard 200 nm air/vacuum reporting threshold.',
    source: 'NIST ASD Reference Data (Vacuum wavelength)',
  },

  // C1. UV Ground → 2s2p² ²D: 208.8889 nm (Air) — ²P°₁/₂ → ²D₃/₂
  {
    id: '208.89nm',
    lowerLevelId: '2p_2P1_2',
    upperLevelId: '2p2_2D3_2',
    wavelengthNm: 208.8889,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 208.8889,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / 47857.127,
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(47857.127),
    deltaEnergyEv: cm1ToEv(47857.127),
    photonEnergyEv: cm1ToEv(47857.127),
    frequencyHz: 47857.127 * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#e879f9',
    colorDescription: 'False-color visualization (non-visible ultraviolet radiation)',
    isTrueColor: false,
    classification: 'UV Ground Transition (2s²2p ²P°₁/₂ ↔ 2s2p² ²D₃/₂)',
    lineName: 'B I 208.9 nm (UV, 2s2p² ²D)',
    description: 'Ultraviolet transition from the ground fine-structure component into the doubly-excited-valence 2s2p² ²D₃/₂ state.',
    source: 'NIST ASD Reference Data (Air wavelength)',
  },

  // C2. UV Ground → 2s2p² ²D: 208.9570 nm (Air) — ²P°₃/₂ → ²D₅/₂
  {
    id: '208.96nm',
    lowerLevelId: '2p_2P3_2',
    upperLevelId: '2p2_2D5_2',
    wavelengthNm: 208.9570,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 208.9570,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (47856.807 - 15.287),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(47856.807 - 15.287),
    deltaEnergyEv: cm1ToEv(47856.807 - 15.287),
    photonEnergyEv: cm1ToEv(47856.807 - 15.287),
    frequencyHz: (47856.807 - 15.287) * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#e879f9',
    colorDescription: 'False-color visualization (non-visible ultraviolet radiation)',
    isTrueColor: false,
    classification: 'UV Ground Transition (2s²2p ²P°₃/₂ ↔ 2s2p² ²D₅/₂)',
    lineName: 'B I 209.0 nm (UV, 2s2p² ²D)',
    description: 'Ultraviolet transition from the ground fine-structure component into the doubly-excited-valence 2s2p² ²D₅/₂ state.',
    source: 'NIST ASD Reference Data (Air wavelength)',
  },

  // D1. Near-IR Excited-State Pair: 1166.0028 nm (Air) — ²S₁/₂ ↔ ²P°₃/₂
  {
    id: '1166.00nm',
    lowerLevelId: '3s_2S1_2',
    upperLevelId: '3p_2P3_2',
    wavelengthNm: 1166.0028,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 1166.0028,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (48613.655 - 40039.695),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(48613.655 - 40039.695),
    deltaEnergyEv: cm1ToEv(48613.655 - 40039.695),
    photonEnergyEv: cm1ToEv(48613.655 - 40039.695),
    frequencyHz: (48613.655 - 40039.695) * 100 * 299792458,
    region: 'NIR',
    band: 'infrared',
    displayColor: '#fb7185',
    colorDescription: 'False-color visualization (non-visible near-infrared radiation)',
    isTrueColor: false,
    classification: 'Near-Infrared Excited-State Pair (2s²3s ²S₁/₂ ↔ 2s²3p ²P°₃/₂)',
    lineName: 'B I 1166.0 nm (Near-IR)',
    description: 'Near-infrared transition between excited 3s and 3p Rydberg-like states, entirely above the ground fine-structure doublet.',
    source: 'NIST ASD Reference Data (Air wavelength)',
  },

  // D2. Near-IR Excited-State Pair: 1166.2452 nm (Air) — ²S₁/₂ ↔ ²P°₁/₂
  {
    id: '1166.25nm',
    lowerLevelId: '3s_2S1_2',
    upperLevelId: '3p_2P1_2',
    wavelengthNm: 1166.2452,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 1166.2452,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (48611.872 - 40039.695),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(48611.872 - 40039.695),
    deltaEnergyEv: cm1ToEv(48611.872 - 40039.695),
    photonEnergyEv: cm1ToEv(48611.872 - 40039.695),
    frequencyHz: (48611.872 - 40039.695) * 100 * 299792458,
    region: 'NIR',
    band: 'infrared',
    displayColor: '#fda4af',
    colorDescription: 'False-color visualization (non-visible near-infrared radiation)',
    isTrueColor: false,
    classification: 'Near-Infrared Excited-State Pair (2s²3s ²S₁/₂ ↔ 2s²3p ²P°₁/₂)',
    lineName: 'B I 1166.2 nm (Near-IR)',
    description: 'Near-infrared transition between excited 3s and 3p Rydberg-like states, entirely above the ground fine-structure doublet.',
    source: 'NIST ASD Reference Data (Air wavelength)',
  },
]

export function getBoronLevel(id: string): BoronLevel | undefined {
  return BORON_LEVELS.find((l) => l.id === id)
}

export function getBoronTransition(id: string): BoronTransition | undefined {
  return BORON_TRANSITIONS.find((t) => t.id === id)
}

export function findBoronTransition(levelIdA: string, levelIdB: string): BoronTransition | undefined {
  return BORON_TRANSITIONS.find(
    (t) =>
      (t.lowerLevelId === levelIdA && t.upperLevelId === levelIdB) ||
      (t.lowerLevelId === levelIdB && t.upperLevelId === levelIdA)
  )
}

/**
 * Reusable runtime validator enforcing the fundamental invariant:
 * For every stored Boron transition: energy(upperLevelId) > energy(lowerLevelId).
 */
export function validateBoronTransitionLevelOrdering(): boolean {
  for (const t of BORON_TRANSITIONS) {
    const lower = getBoronLevel(t.lowerLevelId)
    const upper = getBoronLevel(t.upperLevelId)
    if (!lower) {
      throw new Error(`Transition ${t.id} references missing lower level: ${t.lowerLevelId}`)
    }
    if (!upper) {
      throw new Error(`Transition ${t.id} references missing upper level: ${t.upperLevelId}`)
    }
    if (upper.energyEv <= lower.energyEv) {
      throw new Error(
        `Transition ${t.id} violates invariant: upper level ${upper.id} (${upper.energyEv} eV) <= lower level ${lower.id} (${lower.energyEv} eV)`
      )
    }
    if (t.deltaEnergyEv <= 0 || t.photonEnergyEv <= 0) {
      throw new Error(`Transition ${t.id} has non-positive photon energy: ${t.photonEnergyEv} eV`)
    }
  }
  return true
}

// Execute validation on module initialization
validateBoronTransitionLevelOrdering()

/**
 * Calculates physical signed state energy difference vs strictly positive photon energy.
 * ABSORPTION: ΔE_state = E_upper - E_lower > 0, E_γ = ΔE_state
 * EMISSION:   ΔE_state = E_lower - E_upper < 0, E_γ = |ΔE_state|
 */
export function calculateBoronStateEnergyDelta(
  transition: BoronTransition,
  direction: 'absorption' | 'emission'
): { deltaEStateEv: number; photonEnergyEv: number } {
  const lower = getBoronLevel(transition.lowerLevelId)!
  const upper = getBoronLevel(transition.upperLevelId)!
  if (direction === 'absorption') {
    const deltaEStateEv = upper.energyEv - lower.energyEv
    return { deltaEStateEv, photonEnergyEv: deltaEStateEv }
  } else {
    const deltaEStateEv = lower.energyEv - upper.energyEv
    return { deltaEStateEv, photonEnergyEv: Math.abs(deltaEStateEv) }
  }
}

/**
 * Validates electronic configuration against the Pauli Exclusion Principle for the 5
 * electrons of neutral Boron: "No two electrons may share the same complete set of
 * one-electron quantum numbers (n, l, ml, ms)."
 * One valid ground-state conceptual spin-orbital occupancy (NOT the only valid choice of
 * the single 2p electron's magnetic quantum number): 1s↑ 1s↓ 2s↑ 2s↓ 2p(n=2,l=1,ml=-1,ms=+½).
 */
export function validateBoronPauliExclusion(electrons: ElectronQuantumState[]): {
  valid: boolean
  reason?: string
} {
  if (electrons.length !== 5) {
    return { valid: false, reason: `Neutral Boron requires exactly 5 electrons (received ${electrons.length})` }
  }

  const seen = new Set<string>()
  for (const e of electrons) {
    if (!Number.isInteger(e.n) || e.n < 1) {
      return { valid: false, reason: `Invalid principal quantum number n=${e.n}` }
    }
    if (!Number.isInteger(e.l) || e.l < 0 || e.l >= e.n) {
      return { valid: false, reason: `Invalid orbital quantum number l=${e.l} for n=${e.n}` }
    }
    if (!Number.isInteger(e.ml) || Math.abs(e.ml) > e.l) {
      return { valid: false, reason: `Invalid magnetic quantum number ml=${e.ml} for l=${e.l}` }
    }
    if (e.ms !== 0.5 && e.ms !== -0.5) {
      return { valid: false, reason: `Invalid spin quantum number ms=${e.ms}` }
    }

    const key = `${e.n}:${e.l}:${e.ml}:${e.ms}`
    if (seen.has(key)) {
      return {
        valid: false,
        reason: `Pauli violation: multiple electrons share identical quantum numbers (n=${e.n}, l=${e.l}, ml=${e.ml}, ms=${e.ms > 0 ? '+½' : '-½'})`,
      }
    }
    seen.add(key)
  }
  return { valid: true }
}

/**
 * The five-electron Hamiltonian for neutral Boron (fixed-nucleus, non-relativistic
 * approximation) contains exactly one electron-electron Coulomb pair term per unique
 * pair of the 5 electrons: C(5,2) = 10.
 */
export const BORON_ELECTRON_PAIRS = [
  'r₁₂', 'r₁₃', 'r₁₄', 'r₁₅', 'r₂₃', 'r₂₄', 'r₂₅', 'r₃₄', 'r₃₅', 'r₄₅',
] as const

export function boronElectronPairCount(): number {
  return BORON_ELECTRON_PAIRS.length
}

/**
 * Simplified LS-coupling Electric Dipole (E1) selection-rule validator.
 * In LS-coupling language, an ordinary spin-allowed E1 transition requires:
 *   - parity change (Laporte rule)
 *   - ΔJ = 0, ±1, excluding J=0 → J=0
 *   - ΔS = 0
 * Levels whose J is a grouped/centroid string are not evaluated numerically (returns 'indeterminate').
 * NOTE: This is a simplified teaching approximation, not a universal law covering every
 * relativistic or intermediate-coupling weak transition.
 */
export type E1SelectionResult = 'allowed' | 'spin-forbidden' | 'parity-forbidden' | 'delta-j-forbidden' | 'indeterminate'

export function evaluateE1SelectionRule(lower: BoronLevel, upper: BoronLevel): E1SelectionResult {
  if (typeof lower.J !== 'number' || typeof upper.J !== 'number') {
    return 'indeterminate'
  }
  if (lower.parity === upper.parity) {
    return 'parity-forbidden'
  }
  const deltaJ = Math.abs(upper.J - lower.J)
  if (deltaJ > 1) {
    return 'delta-j-forbidden'
  }
  if (lower.J === 0 && upper.J === 0) {
    return 'delta-j-forbidden'
  }
  if (lower.spinS !== upper.spinS) {
    return 'spin-forbidden'
  }
  return 'allowed'
}

/**
 * Visual Orbital Model Effective Nuclear Charges (independent-particle screened picture),
 * derived via Slater's Rules for the 1s²2s²2p¹ ground configuration (Z = 5):
 *
 *   Z_eff(1s) = Z - 0.30 (same-shell 1s partner)                        = 5 - 0.30 = 4.70
 *   Z_eff(2s) = Z - [0.35 (same n=2 group ×2 partners) + 2×0.85 (1s shielding)]
 *             = 5 - (0.35 + 1.70) = 5 - 2.05 = 2.95
 *   Z_eff(2p) = Same n=2 group shielding constants as 2s in Slater's Rules (simple
 *             approximation): 5 - (0.35 + 1.70) = 2.95
 *
 * NOTE: Explicitly designated as VISUAL MODEL PARAMETERS used ONLY for 3D reduced density
 * rejection sampling. They do NOT alter or replace authoritative NIST ASD energy eigenvalues.
 * Excited-subshell parameters (3s, 3p, 3d, 4s, 4p, 4f) below are approximate visualization
 * parameters extrapolated from the same screening trend (not individually Slater-derived).
 */
export const BORON_VISUAL_CORE_ZEFF = 4.7
export const BORON_VALENCE_2S_ZEFF = 2.95
export const BORON_VALENCE_2P_ZEFF = 2.95
export const BORON_VALENCE_3S_ZEFF = 1.75
export const BORON_VALENCE_3P_ZEFF = 1.65
export const BORON_VALENCE_3D_ZEFF = 1.35
export const BORON_VALENCE_4S_ZEFF = 1.3
export const BORON_VALENCE_4P_ZEFF = 1.2
export const BORON_VALENCE_4F_ZEFF = 1.05

type ValenceSubshell = '2s' | '2p' | '3s' | '3p' | '3d' | '4s' | '4p' | '4f'

const VALENCE_ZEFF: Record<ValenceSubshell, number> = {
  '2s': BORON_VALENCE_2S_ZEFF,
  '2p': BORON_VALENCE_2P_ZEFF,
  '3s': BORON_VALENCE_3S_ZEFF,
  '3p': BORON_VALENCE_3P_ZEFF,
  '3d': BORON_VALENCE_3D_ZEFF,
  '4s': BORON_VALENCE_4S_ZEFF,
  '4p': BORON_VALENCE_4P_ZEFF,
  '4f': BORON_VALENCE_4F_ZEFF,
}

/**
 * Parses a compact Boron density key (e.g. "2p", "2p2", "3s", "3p", "3d", "4s", "4p", "4f")
 * into the valence-subshell composition of the THREE valence electrons (1s² core excluded).
 * Ground state ("2p"): 2×2s + 1×2p. Excited configurations move one or both of the n=2
 * valence electrons into higher subshells, mirroring the curated BORON_LEVELS configurations.
 */
function parseValenceComposition(densityKey: string): { label: ValenceSubshell; count: number }[] {
  if (densityKey === '2p2') return [{ label: '2s', count: 1 }, { label: '2p', count: 2 }]
  if (densityKey === '3s') return [{ label: '2s', count: 2 }, { label: '3s', count: 1 }]
  if (densityKey === '3p') return [{ label: '2s', count: 2 }, { label: '3p', count: 1 }]
  if (densityKey === '3d') return [{ label: '2s', count: 2 }, { label: '3d', count: 1 }]
  if (densityKey === '4s') return [{ label: '2s', count: 2 }, { label: '4s', count: 1 }]
  if (densityKey === '4p') return [{ label: '2s', count: 2 }, { label: '4p', count: 1 }]
  if (densityKey === '4f') return [{ label: '2s', count: 2 }, { label: '4f', count: 1 }]
  // Default / ground state: 2s²2p
  return [{ label: '2s', count: 2 }, { label: '2p', count: 1 }]
}

function singleElectronValenceDensity(label: ValenceSubshell, x: number, y: number, z: number, r: number, r2: number): number {
  const zVal = VALENCE_ZEFF[label]
  switch (label) {
    case '2s': {
      const rho = zVal * r
      const radial = (2 - rho) * Math.exp(-rho / 2)
      return radial * radial * 0.12
    }
    case '2p': {
      // Directional single-lobe (dumbbell) p-orbital angular dependence, proportional to z².
      // Mirrors the p-orbital angular-factor pattern used for Lithium's 2p density term.
      const rho = zVal * r
      return z * z * Math.exp(-rho) * 0.2
    }
    case '3s': {
      const rho = (2 * zVal * r) / 3
      const radial = (27 - 18 * rho + 2 * rho * rho) * Math.exp(-rho / 2)
      return radial * radial * 0.0006
    }
    case '3p': {
      const rho = (2 * zVal * r) / 3
      const radial = (6 - rho) * rho * Math.exp(-rho / 2)
      return z * z * (radial * radial) * 0.0008
    }
    case '3d': {
      const rho = (2 * zVal * r) / 3
      const angular = 3 * z * z - r2
      return angular * angular * Math.exp(-rho) * 0.005
    }
    case '4s': {
      const rho = (zVal * r) / 2
      const radial = (192 - 144 * rho + 24 * rho * rho - rho * rho * rho) * Math.exp(-rho / 2)
      return radial * radial * 0.0000015
    }
    case '4p': {
      const rho = (zVal * r) / 2
      const radial = (80 - 20 * rho + rho * rho) * rho * Math.exp(-rho / 2)
      return z * z * (radial * radial) * 0.000002
    }
    case '4f': {
      // Approximate high-l directional visualization: reuses the cloverleaf angular
      // factor at a longer radial decay length. Not individually Slater-derived.
      const rho = (zVal * r) / 2
      const angular = 3 * z * z - r2
      return angular * angular * Math.exp(-rho) * 0.0009
    }
  }
}

/**
 * Computes the approximate reduced one-electron density ρ(r) for Boron.
 * ρ(r) = ρ_core(1s²) + Σ (single-electron valence contributions for the 3 valence electrons).
 * Ground state: ρ(r) ≈ 2×(1s) + 2×(2s) + 1×(2p), where the 2p contribution carries real
 * directional p-like angular dependence — the key visual difference from Beryllium's
 * spherically-symmetric ground density.
 * atomic units: r in Bohr radii a₀.
 */
export function boronOrbitalDensity(
  densityKey: string,
  x: number,
  y: number,
  z: number,
  component: 'total' | 'core' | 'valence' = 'total'
): number {
  const r2 = x * x + y * y + z * z
  const r = Math.sqrt(r2)

  // 1s² Core Density: 2 electrons in the compact, visually stable core
  const zCore = BORON_VISUAL_CORE_ZEFF
  const coreDensity = 2.0 * Math.exp(-2 * zCore * r)

  if (component === 'core') {
    return coreDensity
  }

  const composition = parseValenceComposition(densityKey)
  let valenceDensity = 0.0
  for (const { label, count } of composition) {
    valenceDensity += count * singleElectronValenceDensity(label, x, y, z, r, r2)
  }

  if (component === 'valence') {
    return valenceDensity
  }

  return coreDensity + valenceDensity
}

/**
 * Samples 3D points for Boron one-electron reduced density using rejection sampling.
 */
export function sampleBoronDensity(
  densityKey: string,
  count: number,
  component: 'total' | 'core' | 'valence' = 'total',
  seed = 5005
): Float32Array {
  const positions = new Float32Array(count * 3)
  let state = (seed >>> 0) || 5005

  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }

  const extent = densityKey.includes('4') ? 9.5 : densityKey.includes('3') ? 8.5 : 5.8
  const maxDensity = component === 'valence' ? 0.4 : 2.0

  let accepted = 0
  let attempts = 0
  const maxAttempts = count * 250

  while (accepted < count && attempts < maxAttempts) {
    attempts++
    const x = (random() * 2 - 1) * extent
    const y = (random() * 2 - 1) * extent
    const z = (random() * 2 - 1) * extent

    const density = boronOrbitalDensity(densityKey, x, y, z, component)
    const prob = Math.min(1.0, density / maxDensity)

    if (random() < prob) {
      const idx = accepted * 3
      positions[idx] = x
      positions[idx + 1] = y
      positions[idx + 2] = z
      accepted++
    }
  }

  if (accepted < count && accepted > 0) {
    for (let i = accepted; i < count; i++) {
      const srcIdx = (i % accepted) * 3
      const dstIdx = i * 3
      positions[dstIdx] = positions[srcIdx] + (random() - 0.5) * 0.05
      positions[dstIdx + 1] = positions[srcIdx + 1] + (random() - 0.5) * 0.05
      positions[dstIdx + 2] = positions[srcIdx + 2] + (random() - 0.5) * 0.05
    }
  }

  return positions
}

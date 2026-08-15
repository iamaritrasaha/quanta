import {
  CM1_TO_EV,
  LITHIUM_IONIZATION_ENERGY_EV,
  LITHIUM_IONIZATION_LIMIT_CM1,
  LITHIUM_ATOMIC_WEIGHT_RANGE,
  LITHIUM_6_ISOTOPE_FRACTION_RANGE,
  LITHIUM_7_ISOTOPE_FRACTION_RANGE,
  RYDBERG_INF_CM1,
  RYDBERG_LI7_CM1,
  cm1ToEv,
} from './constants'
import { type RadiationBand } from './hydrogen'

export type SeriesCategory = 'S' | 'P' | 'D' | 'F'

export interface LithiumLevel {
  id: string
  configuration: string
  term: string
  termSymbol: string // e.g. "²S₁/₂", "²P°₁/₂", "²P°₃/₂", "²D₅/₂"
  multiplicity: 'doublet'
  spinS: number // 0.5 for all neutral doublet states
  L: number // 0 for S, 1 for P, 2 for D, 3 for F
  J: number | string // Total angular momentum: 0.5 (1/2), 1.5 (3/2), 2.5 (5/2), 3.5 (7/2)
  parity: 'even' | 'odd'
  wavenumberCm1: number // NIST ASD excitation wavenumber above 1s²2s ²S₁/₂ ground state (cm⁻¹)
  energyEv: number // Derived from wavenumberCm1: wavenumberCm1 * CM1_TO_EV
  series: SeriesCategory
  n: number // Principal quantum number of outer valence electron
  isMultipletCentroid?: boolean
  source: string
}

export interface FineStructureComponent {
  lowerJ: number | string
  upperJ: number | string
  wavelengthNm: number // Reference wavelength in standard medium
  wavelengthMedium: 'air' | 'vacuum'
  wavenumberCm1?: number
  relativeIntensity?: number
  comment?: string
}

export interface LithiumTransition {
  id: string
  lowerLevelId: string
  upperLevelId: string
  wavelengthNm: number // Reference persistent line wavelength (standard air for λ >= 200 nm)
  wavelengthMedium: 'air' | 'vacuum'
  referenceWavelengthNm: number // Explicit reference line value from persistent line tables
  referenceWavelengthMedium: 'air' | 'vacuum'
  derivedVacuumWavelengthNm: number // Level-difference derived vacuum wavelength: 10^7 / Δṽ
  derivedAirWavelengthNm: number // Level-difference derived air wavelength via standard refractive index
  components?: FineStructureComponent[]
  deltaEnergyEv: number // E(upper) - E(lower) > 0
  photonEnergyEv: number // Strictly positive photon quantum energy: E(upper) - E(lower)
  frequencyHz: number
  region: 'VISIBLE' | 'NIR' | 'UV'
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
 * Converts vacuum wavenumber / wavelength to standard air wavelength.
 */
export function vacuumWavenumberToAirWavelengthNm(wavenumberCm1: number): number {
  if (wavenumberCm1 <= 0) return 0
  const vacWavelengthNm = 1e7 / wavenumberCm1
  if (vacWavelengthNm < 200) {
    // Below 200 nm standard spectroscopy reports vacuum wavelengths
    return vacWavelengthNm
  }
  const sigma = wavenumberCm1 * 1e-4 // σ in μm⁻¹
  const sigma2 = sigma * sigma
  // Peck and Reeder (1972) dispersion formula for standard air
  const nMinus1 = 1e-8 * (8342.54 + 2406147.0 / (130.0 - sigma2) + 15998.0 / (38.9 - sigma2))
  const nAir = 1.0 + nMinus1
  return vacWavelengthNm / nAir
}

/**
 * Reference NIST Atomic Spectra Database (ASD) Li I Energy Levels.
 * Primary Source: NIST ASD Level Database (Kramida et al., 2024).
 *
 * Provenance Note:
 * NIST explicitly states that the Li I energy-level list is compiled from an unpublished level list
 * (prepared for Kelly 1987 classifications) and that these level data are not critically evaluated by NIST.
 * QUANTA preserves this reference compilation while clearly disclosing this nuance.
 */
export const LITHIUM_LEVELS: LithiumLevel[] = [
  // 1. Ground state: 1s²2s ²S₁/₂
  {
    id: '1s2_2s_2S1_2',
    configuration: '1s²2s',
    term: '1s²2s ²S',
    termSymbol: '²S₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 0,
    J: 0.5,
    parity: 'even',
    wavenumberCm1: 0.0,
    energyEv: 0.0,
    series: 'S',
    n: 2,
    source: 'NIST ASD Reference Data (ASD Li I compilation; not critically evaluated by NIST)',
  },

  // 2. n=2 P manifold (Fine-structure doublet components)
  {
    id: '1s2_2p_2P1_2',
    configuration: '1s²2p',
    term: '1s²2p ²P°',
    termSymbol: '²P°₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 0.5,
    parity: 'odd',
    wavenumberCm1: 14903.66,
    energyEv: cm1ToEv(14903.66),
    series: 'P',
    n: 2,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_2p_2P3_2',
    configuration: '1s²2p',
    term: '1s²2p ²P°',
    termSymbol: '²P°₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 1.5,
    parity: 'odd',
    wavenumberCm1: 14904.0,
    energyEv: cm1ToEv(14904.0),
    series: 'P',
    n: 2,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },

  // 3. n=3 states
  {
    id: '1s2_3s_2S1_2',
    configuration: '1s²3s',
    term: '1s²3s ²S',
    termSymbol: '²S₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 0,
    J: 0.5,
    parity: 'even',
    wavenumberCm1: 27206.12,
    energyEv: cm1ToEv(27206.12),
    series: 'S',
    n: 3,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_3p_2P1_2',
    configuration: '1s²3p',
    term: '1s²3p ²P°',
    termSymbol: '²P°₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 0.5,
    parity: 'odd',
    wavenumberCm1: 30925.38,
    energyEv: cm1ToEv(30925.38),
    series: 'P',
    n: 3,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_3p_2P3_2',
    configuration: '1s²3p',
    term: '1s²3p ²P°',
    termSymbol: '²P°₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 1.5,
    parity: 'odd',
    wavenumberCm1: 30925.38,
    energyEv: cm1ToEv(30925.38),
    series: 'P',
    n: 3,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_3d_2D3_2',
    configuration: '1s²3d',
    term: '1s²3d ²D',
    termSymbol: '²D₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 1.5,
    parity: 'even',
    wavenumberCm1: 31283.08,
    energyEv: cm1ToEv(31283.08),
    series: 'D',
    n: 3,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_3d_2D5_2',
    configuration: '1s²3d',
    term: '1s²3d ²D',
    termSymbol: '²D₅/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 2.5,
    parity: 'even',
    wavenumberCm1: 31283.12,
    energyEv: cm1ToEv(31283.12),
    series: 'D',
    n: 3,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },

  // 4. n=4 states
  {
    id: '1s2_4s_2S1_2',
    configuration: '1s²4s',
    term: '1s²4s ²S',
    termSymbol: '²S₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 0,
    J: 0.5,
    parity: 'even',
    wavenumberCm1: 35012.06,
    energyEv: cm1ToEv(35012.06),
    series: 'S',
    n: 4,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_4p_2P1_2',
    configuration: '1s²4p',
    term: '1s²4p ²P°',
    termSymbol: '²P°₁/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 0.5,
    parity: 'odd',
    wavenumberCm1: 36469.55,
    energyEv: cm1ToEv(36469.55),
    series: 'P',
    n: 4,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_4p_2P3_2',
    configuration: '1s²4p',
    term: '1s²4p ²P°',
    termSymbol: '²P°₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 1,
    J: 1.5,
    parity: 'odd',
    wavenumberCm1: 36469.55,
    energyEv: cm1ToEv(36469.55),
    series: 'P',
    n: 4,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_4d_2D3_2',
    configuration: '1s²4d',
    term: '1s²4d ²D',
    termSymbol: '²D₃/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 1.5,
    parity: 'even',
    wavenumberCm1: 36623.38,
    energyEv: cm1ToEv(36623.38),
    series: 'D',
    n: 4,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_4d_2D5_2',
    configuration: '1s²4d',
    term: '1s²4d ²D',
    termSymbol: '²D₅/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 2,
    J: 2.5,
    parity: 'even',
    wavenumberCm1: 36623.4,
    energyEv: cm1ToEv(36623.4),
    series: 'D',
    n: 4,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_4f_2F5_2',
    configuration: '1s²4f',
    term: '1s²4f ²F°',
    termSymbol: '²F°₅/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 3,
    J: 2.5,
    parity: 'odd',
    wavenumberCm1: 36630.2,
    energyEv: cm1ToEv(36630.2),
    series: 'F',
    n: 4,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
  {
    id: '1s2_4f_2F7_2',
    configuration: '1s²4f',
    term: '1s²4f ²F°',
    termSymbol: '²F°₇/₂',
    multiplicity: 'doublet',
    spinS: 0.5,
    L: 3,
    J: 3.5,
    parity: 'odd',
    wavenumberCm1: 36630.2,
    energyEv: cm1ToEv(36630.2),
    series: 'F',
    n: 4,
    source: 'NIST ASD Reference Data (ASD Li I compilation)',
  },
]

/**
 * Curated NIST Li I Persistent Spectral Transitions.
 * Strictly maintains lowerLevelId < upperLevelId (invariant: energy(upper) > energy(lower)).
 *
 * Architecture explicitly separates:
 * - referenceWavelengthNm (stored NIST persistent-line measurement in standard air)
 * - derivedVacuumWavelengthNm (10^7 / Δṽ calculated from currently stored level excitation wavenumbers)
 * - derivedAirWavelengthNm (derived vacuum wavelength converted via standard refractive index of air)
 */
export const LITHIUM_TRANSITIONS: LithiumTransition[] = [
  // 1. Hero Transition: 670.8 nm Resonance Fine-Structure Doublet (Air)
  {
    id: '670.8nm',
    lowerLevelId: '1s2_2s_2S1_2',
    upperLevelId: '1s2_2p_2P3_2',
    wavelengthNm: 670.7775,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 670.7775,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / 14904.0, // ~670.9608 nm
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(14904.0), // ~670.7756 nm
    deltaEnergyEv: cm1ToEv(14904.0),
    photonEnergyEv: cm1ToEv(14904.0), // ~1.84786 eV
    frequencyHz: 14904.0 * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#ef4444',
    colorDescription: 'Approximate display color: deep red (wavelength-derived visualization)',
    isTrueColor: true,
    classification: 'Resonance Doublet (1s²2s ²S₁/₂ ↔ 1s²2p ²P°)',
    lineName: 'Li I 670.8 nm (Resonance Doublet)',
    description:
      'Principal ground-state resonance doublet of neutral Lithium, defining its characteristic deep crimson flame emission.',
    source: 'NIST ASD Reference Data / NIST Persistent Lines (Air wavelength)',
    components: [
      {
        lowerJ: '1/2',
        upperJ: '3/2',
        wavelengthNm: 670.7775,
        wavelengthMedium: 'air',
        wavenumberCm1: 14904.0,
        relativeIntensity: 100,
        comment: '2s ²S₁/₂ ↔ 2p ²P°₃/₂ (D₂ line component)',
      },
      {
        lowerJ: '1/2',
        upperJ: '1/2',
        wavelengthNm: 670.7926,
        wavelengthMedium: 'air',
        wavenumberCm1: 14903.66,
        relativeIntensity: 50,
        comment: '2s ²S₁/₂ ↔ 2p ²P°₁/₂ (D₁ line component)',
      },
    ],
  },

  // 2. Diffuse Series Hero Line: 610.36 nm (Air) Multiplet
  {
    id: '610.4nm',
    lowerLevelId: '1s2_2p_2P3_2',
    upperLevelId: '1s2_3d_2D5_2',
    wavelengthNm: 610.3654,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 610.3654,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (31283.12 - 14904.0), // ~610.5332 nm
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(31283.12 - 14904.0), // ~610.3654 nm
    deltaEnergyEv: cm1ToEv(31283.12 - 14904.0),
    photonEnergyEv: cm1ToEv(31283.12 - 14904.0), // ~2.0308 eV
    frequencyHz: (31283.12 - 14904.0) * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#f97316',
    colorDescription: 'Approximate display color: orange-red (wavelength-derived visualization)',
    isTrueColor: true,
    classification: 'Diffuse Series (1s²2p ²P° ↔ 1s²3d ²D)',
    lineName: 'Li I 610.4 nm (Diffuse Line)',
    description: 'Prominent orange-red transition connecting the 2p state to the 3d orbital manifold.',
    source: 'NIST ASD Reference Data (Air wavelength)',
    components: [
      {
        lowerJ: '3/2',
        upperJ: '5/2',
        wavelengthNm: 610.3654,
        wavelengthMedium: 'air',
        wavenumberCm1: 16379.12,
        relativeIntensity: 100,
        comment: '2p ²P°₃/₂ ↔ 3d ²D₅/₂',
      },
      {
        lowerJ: '1/2',
        upperJ: '3/2',
        wavelengthNm: 610.3542,
        wavelengthMedium: 'air',
        wavenumberCm1: 16379.42,
        relativeIntensity: 60,
        comment: '2p ²P°₁/₂ ↔ 3d ²D₃/₂',
      },
    ],
  },

  // 3. Sharp Series Line: 812.65 nm (Air) Multiplet
  {
    id: '812.6nm',
    lowerLevelId: '1s2_2p_2P3_2',
    upperLevelId: '1s2_3s_2S1_2',
    wavelengthNm: 812.6453,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 812.6453,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (27206.12 - 14904.0), // ~812.8687 nm
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(27206.12 - 14904.0), // ~812.6452 nm
    deltaEnergyEv: cm1ToEv(27206.12 - 14904.0),
    photonEnergyEv: cm1ToEv(27206.12 - 14904.0), // ~1.5253 eV
    frequencyHz: (27206.12 - 14904.0) * 100 * 299792458,
    region: 'NIR',
    band: 'infrared',
    displayColor: '#e11d48',
    colorDescription: 'False color (non-visible near-infrared radiation)',
    isTrueColor: false,
    classification: 'Sharp Series (1s²2p ²P° ↔ 1s²3s ²S)',
    lineName: 'Li I 812.6 nm (Sharp Series)',
    description: 'Near-infrared transition from penetrating valence 3s state down to 2p.',
    source: 'NIST ASD Reference Data (Air wavelength)',
    components: [
      {
        lowerJ: '3/2',
        upperJ: '1/2',
        wavelengthNm: 812.6453,
        wavelengthMedium: 'air',
        wavenumberCm1: 12302.12,
        relativeIntensity: 100,
        comment: '2p ²P°₃/₂ ↔ 3s ²S₁/₂',
      },
      {
        lowerJ: '1/2',
        upperJ: '1/2',
        wavelengthNm: 812.6232,
        wavelengthMedium: 'air',
        wavenumberCm1: 12302.46,
        relativeIntensity: 50,
        comment: '2p ²P°₁/₂ ↔ 3s ²S₁/₂',
      },
    ],
  },

  // 4. Higher Diffuse Line: 460.29 nm (Air) Multiplet
  {
    id: '460.3nm',
    lowerLevelId: '1s2_2p_2P3_2',
    upperLevelId: '1s2_4d_2D5_2',
    wavelengthNm: 460.2898,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 460.2898,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (36623.4 - 14904.0), // ~460.4168 nm
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(36623.4 - 14904.0), // ~460.2898 nm
    deltaEnergyEv: cm1ToEv(36623.4 - 14904.0),
    photonEnergyEv: cm1ToEv(36623.4 - 14904.0), // ~2.6928 eV
    frequencyHz: (36623.4 - 14904.0) * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#38bdf8',
    colorDescription: 'Approximate display color: cyan-blue (wavelength-derived visualization)',
    isTrueColor: true,
    classification: 'Diffuse Series (1s²2p ²P° ↔ 1s²4d ²D)',
    lineName: 'Li I 460.3 nm (Blue Diffuse)',
    description: 'Higher visible diffuse line connecting the 2p level to the 4d Rydberg manifold.',
    source: 'NIST ASD Reference Data (Air wavelength)',
    components: [
      {
        lowerJ: '3/2',
        upperJ: '5/2',
        wavelengthNm: 460.2898,
        wavelengthMedium: 'air',
        wavenumberCm1: 21719.4,
        relativeIntensity: 100,
        comment: '2p ²P°₃/₂ ↔ 4d ²D₅/₂',
      },
      {
        lowerJ: '1/2',
        upperJ: '3/2',
        wavelengthNm: 460.2831,
        wavelengthMedium: 'air',
        wavenumberCm1: 21719.72,
        relativeIntensity: 60,
        comment: '2p ²P°₁/₂ ↔ 4d ²D₃/₂',
      },
    ],
  },
]

export function getLithiumLevel(id: string): LithiumLevel | undefined {
  return LITHIUM_LEVELS.find((l) => l.id === id)
}

export function getLithiumTransition(id: string): LithiumTransition | undefined {
  return LITHIUM_TRANSITIONS.find((t) => t.id === id)
}

export function findLithiumTransition(levelIdA: string, levelIdB: string): LithiumTransition | undefined {
  return LITHIUM_TRANSITIONS.find(
    (t) =>
      (t.lowerLevelId === levelIdA && t.upperLevelId === levelIdB) ||
      (t.lowerLevelId === levelIdB && t.upperLevelId === levelIdA)
  )
}

/**
 * Calculates the theoretical derived Quantum Defect δ_l:
 *
 *   n^* = sqrt( R_M / (T_limit - T_level) )
 *   δ_l = n - n^*
 *
 * where:
 *   T_limit = ionization threshold (43,487.11420 cm⁻¹)
 *   T_level = excitation wavenumber of the bound state (cm⁻¹)
 *   R_M = Rydberg constant (defaults to RYDBERG_INF_CM1; optionally RYDBERG_LI7_CM1)
 *
 * NOTE: Explicitly tagged as DERIVED MODEL QUANTITY, not a NIST-measured field.
 */
export function calculateQuantumDefect(
  level: LithiumLevel,
  rydbergConstantCm1: number = RYDBERG_INF_CM1
): {
  effectiveN: number
  quantumDefect: number
  termValueCm1: number
  rydbergUsedCm1: number
} {
  const termValueCm1 = LITHIUM_IONIZATION_LIMIT_CM1 - level.wavenumberCm1
  if (termValueCm1 <= 0) {
    return { effectiveN: level.n, quantumDefect: 0, termValueCm1: 0, rydbergUsedCm1: rydbergConstantCm1 }
  }

  const effectiveN = Math.sqrt(rydbergConstantCm1 / termValueCm1)
  const quantumDefect = level.n - effectiveN
  return { effectiveN, quantumDefect, termValueCm1, rydbergUsedCm1: rydbergConstantCm1 }
}

/**
 * Reusable runtime validator enforcing the fundamental invariant:
 * For every stored Lithium transition: energy(upperLevelId) > energy(lowerLevelId).
 */
export function validateLithiumTransitionLevelOrdering(): boolean {
  for (const t of LITHIUM_TRANSITIONS) {
    const lower = getLithiumLevel(t.lowerLevelId)
    const upper = getLithiumLevel(t.upperLevelId)
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
validateLithiumTransitionLevelOrdering()

/**
 * Calculates physical signed state energy difference vs strictly positive photon energy.
 * ABSORPTION: ΔE_state = E_upper - E_lower > 0, E_γ = ΔE_state
 * EMISSION:   ΔE_state = E_lower - E_upper < 0, E_γ = |ΔE_state|
 */
export function calculateLithiumStateEnergyDelta(
  transition: LithiumTransition,
  direction: 'absorption' | 'emission'
): { deltaEStateEv: number; photonEnergyEv: number } {
  const lower = getLithiumLevel(transition.lowerLevelId)!
  const upper = getLithiumLevel(transition.upperLevelId)!
  if (direction === 'absorption') {
    const deltaEStateEv = upper.energyEv - lower.energyEv
    return { deltaEStateEv, photonEnergyEv: deltaEStateEv }
  } else {
    const deltaEStateEv = lower.energyEv - upper.energyEv
    return { deltaEStateEv, photonEnergyEv: Math.abs(deltaEStateEv) }
  }
}

/**
 * Validates electronic configuration against the Pauli Exclusion Principle for 3 electrons:
 * "No two electrons in an atom may share the same complete set of quantum numbers (n, l, ml, ms)."
 */
export function validateLithiumPauliExclusion(electrons: ElectronQuantumState[]): {
  valid: boolean
  reason?: string
} {
  if (electrons.length !== 3) {
    return { valid: false, reason: `Neutral Lithium requires exactly 3 electrons (received ${electrons.length})` }
  }

  const seen = new Set<string>()
  for (let i = 0; i < electrons.length; i++) {
    const e = electrons[i]
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
 * Visual Orbital Model Effective Nuclear Charges (Screened independent-particle visual picture):
 *
 * Derivation/Source:
 * For a two-electron 1s² core around a Z=3 nucleus, first-order variational screening gives:
 * Z_eff(core 1s) = Z - 5/16 = 3 - 0.3125 = 2.6875.
 *
 * NOTE: Explicitly designated as a VISUAL MODEL PARAMETER / APPROXIMATE EFFECTIVE CHARGE.
 * This parameter is used ONLY for 3D reduced density cloud rejection sampling and does NOT
 * alter or replace authoritative NIST ASD energy eigenvalues or spectroscopic line data.
 */
export const LITHIUM_VISUAL_CORE_ZEFF = 2.6875
export const LITHIUM_CORE_ZEFF = LITHIUM_VISUAL_CORE_ZEFF // Backward compatibility alias
export const LITHIUM_VALENCE_2S_ZEFF = 1.28 // Approximate visual parameter for penetrating 2s valence electron

/**
 * Computes the approximate one-electron reduced density ρ(r) for Lithium.
 * atomic units: r in Bohr radii a₀.
 */
export function lithiumOrbitalDensity(
  configuration: string,
  x: number,
  y: number,
  z: number,
  component: 'total' | 'core' | 'valence' = 'total'
): number {
  const r2 = x * x + y * y + z * z
  const r = Math.sqrt(r2)

  // 1s² Core Density: 2 electrons in compact core
  // ρ_core(r) = 2 * (Z_core³ / π) * exp(-2 * Z_core * r)
  const zCore = LITHIUM_VISUAL_CORE_ZEFF
  const coreDensity = 2.0 * Math.exp(-2 * zCore * r)

  if (component === 'core') {
    return coreDensity
  }

  let valenceDensity = 0.0

  if (configuration.includes('2s')) {
    // 2s radial profile with inner node
    const zVal = LITHIUM_VALENCE_2S_ZEFF
    const rho = zVal * r
    const radial = (2 - rho) * Math.exp(-rho / 2)
    valenceDensity = radial * radial * 0.12
  } else if (configuration.includes('2p')) {
    // 2p directional lobe
    const zVal = 1.05
    const rho = zVal * r
    valenceDensity = z * z * Math.exp(-rho) * 0.2
  } else if (configuration.includes('3s')) {
    // 3s with two radial nodes
    const zVal = 1.02
    const rho = (2 * zVal * r) / 3
    const radial = (27 - 18 * rho + 2 * rho * rho) * Math.exp(-rho / 2)
    valenceDensity = radial * radial * 0.0006
  } else if (configuration.includes('3p')) {
    const zVal = 1.01
    const rho = (2 * zVal * r) / 3
    const radial = (6 - rho) * rho * Math.exp(-rho / 2)
    valenceDensity = (z * z) * (radial * radial) * 0.0008
  } else if (configuration.includes('3d')) {
    // 3d cloverleaf lobe
    const zVal = 1.0
    const angular = 3 * z * z - r2
    valenceDensity = angular * angular * Math.exp((-2 * zVal * r) / 3) * 0.005
  } else if (configuration.includes('4d') || configuration.includes('4f')) {
    const zVal = 1.0
    const angular = 3 * z * z - r2
    valenceDensity = angular * angular * Math.exp((-zVal * r) / 2) * 0.002
  } else {
    // Default to ground 2s
    const zVal = LITHIUM_VALENCE_2S_ZEFF
    const rho = zVal * r
    const radial = (2 - rho) * Math.exp(-rho / 2)
    valenceDensity = radial * radial * 0.12
  }

  if (component === 'valence') {
    return valenceDensity * 2.0
  }

  // Total reduced density
  return coreDensity + valenceDensity
}

/**
 * Samples 3D points for Lithium one-electron reduced density using rejection sampling.
 */
export function sampleLithiumDensity(
  configuration: string,
  count: number,
  component: 'total' | 'core' | 'valence' = 'total',
  seed = 3003
): Float32Array {
  const positions = new Float32Array(count * 3)
  let state = (seed >>> 0) || 3003

  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }

  const extent = configuration.includes('3') || configuration.includes('4') ? 8.5 : 5.8
  const maxDensity = component === 'valence' ? 0.35 : 2.0

  let accepted = 0
  let attempts = 0
  const maxAttempts = count * 250

  while (accepted < count && attempts < maxAttempts) {
    attempts++
    const x = (random() * 2 - 1) * extent
    const y = (random() * 2 - 1) * extent
    const z = (random() * 2 - 1) * extent

    const density = lithiumOrbitalDensity(configuration, x, y, z, component)
    const prob = Math.min(1.0, density / maxDensity)

    if (random() < prob) {
      const idx = accepted * 3
      positions[idx] = x
      positions[idx + 1] = y
      positions[idx + 2] = z
      accepted++
    }
  }

  // Jitter duplicate fallback if needed
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

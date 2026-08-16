import { cm1ToEv } from './constants'
import { type RadiationBand } from './hydrogen'

export type Multiplicity = 'singlet' | 'triplet'

export interface BerylliumLevel {
  id: string
  configuration: string // e.g. "2s²", "2s2p", "2p²"
  term: string
  termSymbol: string // e.g. "¹S₀", "³P°₁", "³P°₀,₁,₂" (grouped fine-structure)
  multiplicity: Multiplicity
  spinS: number // 0 for singlet, 1 for triplet
  L: number // 0 for S, 1 for P, 2 for D
  J: number | string // Total angular momentum, or grouped string e.g. "0,1,2"
  parity: 'even' | 'odd'
  wavenumberCm1: number // NIST excitation wavenumber above 2s² ¹S₀ ground state (cm⁻¹)
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

export interface BerylliumTransition {
  id: string
  lowerLevelId: string
  upperLevelId: string
  wavelengthNm: number // Reference persistent-line wavelength
  wavelengthMedium: 'air' | 'vacuum'
  referenceWavelengthNm: number // Explicit NIST persistent-line reference value
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
 * Shared conversion contract with Lithium — reused rather than re-derived per element.
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
 * Curated NIST Atomic Spectra Database (ASD) Be I Energy Levels.
 * Primary Source: NIST ASD Level Database (Kramida et al., 2024).
 *
 * Fine-structure multiplets (2s2p ³P°, 2s3p ³P°, 2p² ³P) store individually resolved
 * J components PLUS a grouped statistical-centroid entry (isMultipletCentroid: true) used
 * for compact overview presentation, mirroring the QUANTA Helium architecture. Centroid
 * values are explicitly labeled DERIVED (statistical (2J+1)-weighted average), not a
 * separately measured NIST quantity.
 */
export const BERYLLIUM_LEVELS: BerylliumLevel[] = [
  // Ground state: 2s² ¹S₀
  {
    id: '2s2_1S0',
    configuration: '2s²',
    term: '2s² ¹S',
    termSymbol: '¹S₀',
    multiplicity: 'singlet',
    spinS: 0,
    L: 0,
    J: 0,
    parity: 'even',
    wavenumberCm1: 0.0,
    energyEv: 0.0,
    source: 'NIST ASD Reference Data (Ground State Reference)',
  },

  // 2s2p ³P° fine-structure triplet
  {
    id: '2s2p_3P0',
    configuration: '2s2p',
    term: '2s2p ³P°',
    termSymbol: '³P°₀',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 0,
    parity: 'odd',
    wavenumberCm1: 21978.28,
    energyEv: cm1ToEv(21978.28),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2s2p_3P1',
    configuration: '2s2p',
    term: '2s2p ³P°',
    termSymbol: '³P°₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 1,
    parity: 'odd',
    wavenumberCm1: 21978.925,
    energyEv: cm1ToEv(21978.925),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2s2p_3P2',
    configuration: '2s2p',
    term: '2s2p ³P°',
    termSymbol: '³P°₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 2,
    parity: 'odd',
    wavenumberCm1: 21981.27,
    energyEv: cm1ToEv(21981.27),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2s2p_3P',
    configuration: '2s2p',
    term: '2s2p ³P°',
    termSymbol: '³P°₀,₁,₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: '0,1,2',
    parity: 'odd',
    wavenumberCm1: 21980.1561,
    energyEv: cm1ToEv(21980.1561),
    isMultipletCentroid: true,
    source: 'DERIVED (statistical centroid [1×J0 + 3×J1 + 5×J2] / 9 = 21980.1561 cm⁻¹) — this is the metastable manifold, E1 spin-forbidden from the ¹S₀ ground state',
  },

  // 2s2p ¹P° resonance singlet
  {
    id: '2s2p_1P1',
    configuration: '2s2p',
    term: '2s2p ¹P°',
    termSymbol: '¹P°₁',
    multiplicity: 'singlet',
    spinS: 0,
    L: 1,
    J: 1,
    parity: 'odd',
    wavenumberCm1: 42565.35,
    energyEv: cm1ToEv(42565.35),
    source: 'NIST ASD Reference Data',
  },

  // 2s3s states
  {
    id: '2s3s_3S1',
    configuration: '2s3s',
    term: '2s3s ³S',
    termSymbol: '³S₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 0,
    J: 1,
    parity: 'even',
    wavenumberCm1: 52080.94,
    energyEv: cm1ToEv(52080.94),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2s3s_1S0',
    configuration: '2s3s',
    term: '2s3s ¹S',
    termSymbol: '¹S₀',
    multiplicity: 'singlet',
    spinS: 0,
    L: 0,
    J: 0,
    parity: 'even',
    wavenumberCm1: 54677.26,
    energyEv: cm1ToEv(54677.26),
    source: 'NIST ASD Reference Data',
  },

  // 2p² ¹D₂
  {
    id: '2p2_1D2',
    configuration: '2p²',
    term: '2p² ¹D',
    termSymbol: '¹D₂',
    multiplicity: 'singlet',
    spinS: 0,
    L: 2,
    J: 2,
    parity: 'even',
    wavenumberCm1: 56882.43,
    energyEv: cm1ToEv(56882.43),
    source: 'NIST ASD Reference Data',
  },

  // 2s3p ³P° (J=0,1 share reported wavenumber; J=2 distinct)
  {
    id: '2s3p_3P01',
    configuration: '2s3p',
    term: '2s3p ³P°',
    termSymbol: '³P°₀,₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: '0,1',
    parity: 'odd',
    wavenumberCm1: 58907.45,
    energyEv: cm1ToEv(58907.45),
    source: 'NIST ASD Reference Data (J=0 and J=1 reported at shared wavenumber)',
  },
  {
    id: '2s3p_3P2',
    configuration: '2s3p',
    term: '2s3p ³P°',
    termSymbol: '³P°₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 2,
    parity: 'odd',
    wavenumberCm1: 58907.83,
    energyEv: cm1ToEv(58907.83),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2s3p_3P',
    configuration: '2s3p',
    term: '2s3p ³P°',
    termSymbol: '³P°₀,₁,₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: '0,1,2',
    parity: 'odd',
    wavenumberCm1: 58907.6611,
    energyEv: cm1ToEv(58907.6611),
    isMultipletCentroid: true,
    source: 'DERIVED (statistical centroid [1×J0 + 3×J1 + 5×J2] / 9 = 58907.6611 cm⁻¹)',
  },

  // 2p² ³P fine-structure triplet
  {
    id: '2p2_3P0',
    configuration: '2p²',
    term: '2p² ³P',
    termSymbol: '³P₀',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 0,
    parity: 'even',
    wavenumberCm1: 59693.65,
    energyEv: cm1ToEv(59693.65),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2p2_3P1',
    configuration: '2p²',
    term: '2p² ³P',
    termSymbol: '³P₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 1,
    parity: 'even',
    wavenumberCm1: 59695.07,
    energyEv: cm1ToEv(59695.07),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2p2_3P2',
    configuration: '2p²',
    term: '2p² ³P',
    termSymbol: '³P₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 2,
    parity: 'even',
    wavenumberCm1: 59697.08,
    energyEv: cm1ToEv(59697.08),
    source: 'NIST ASD Reference Data',
  },
  {
    id: '2p2_3P',
    configuration: '2p²',
    term: '2p² ³P',
    termSymbol: '³P₀,₁,₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: '0,1,2',
    parity: 'even',
    wavenumberCm1: 59696.0289,
    energyEv: cm1ToEv(59696.0289),
    isMultipletCentroid: true,
    source: 'DERIVED (statistical centroid [1×J0 + 3×J1 + 5×J2] / 9 = 59696.0289 cm⁻¹)',
  },

  // 2s3p ¹P°₁
  {
    id: '2s3p_1P1',
    configuration: '2s3p',
    term: '2s3p ¹P°',
    termSymbol: '¹P°₁',
    multiplicity: 'singlet',
    spinS: 0,
    L: 1,
    J: 1,
    parity: 'odd',
    wavenumberCm1: 60187.34,
    energyEv: cm1ToEv(60187.34),
    source: 'NIST ASD Reference Data',
  },

  // 2s3d ³D₁,₂,₃ (source reports a single combined value across all three J components)
  {
    id: '2s3d_3D',
    configuration: '2s3d',
    term: '2s3d ³D',
    termSymbol: '³D₁,₂,₃',
    multiplicity: 'triplet',
    spinS: 1,
    L: 2,
    J: '1,2,3',
    parity: 'even',
    wavenumberCm1: 62053.72,
    energyEv: cm1ToEv(62053.72),
    source: 'NIST ASD Reference Data (single reported value spanning J=1,2,3 — individual fine-structure splitting not resolved in this compilation)',
  },

  // 2s3d ¹D₂
  {
    id: '2s3d_1D2',
    configuration: '2s3d',
    term: '2s3d ¹D',
    termSymbol: '¹D₂',
    multiplicity: 'singlet',
    spinS: 0,
    L: 2,
    J: 2,
    parity: 'even',
    wavenumberCm1: 64428.31,
    energyEv: cm1ToEv(64428.31),
    source: 'NIST ASD Reference Data',
  },
]

/**
 * Curated NIST Be I Persistent Spectral Transitions (small, scientifically meaningful set).
 * Strictly maintains invariant: energy(upperLevelId) > energy(lowerLevelId).
 *
 * Architecture explicitly separates:
 * - referenceWavelengthNm (stored NIST persistent-line measurement)
 * - derivedVacuumWavelengthNm (10^7 / Δṽ calculated from currently stored level excitation wavenumbers)
 * - derivedAirWavelengthNm (derived vacuum wavelength converted via standard refractive index of air)
 */
export const BERYLLIUM_TRANSITIONS: BerylliumTransition[] = [
  // 1. Ground-State Resonance: 234.8610 nm (Air) — hero transition
  {
    id: '234.9nm',
    lowerLevelId: '2s2_1S0',
    upperLevelId: '2s2p_1P1',
    wavelengthNm: 234.861,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 234.861,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / 42565.35,
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(42565.35),
    deltaEnergyEv: cm1ToEv(42565.35),
    photonEnergyEv: cm1ToEv(42565.35),
    frequencyHz: 42565.35 * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#a855f7',
    colorDescription: 'False-color visualization (non-visible ultraviolet radiation)',
    isTrueColor: false,
    classification: 'Ground-State Resonance (2s² ¹S₀ ↔ 2s2p ¹P°₁)',
    lineName: 'Be I 234.9 nm (Ground-State Resonance)',
    description:
      'Principal ground-state resonance transition of neutral Beryllium, connecting the closed-shell ground state directly to the singlet 2s2p manifold.',
    source: 'NIST ASD Reference Data / NIST Persistent Lines (Air wavelength)',
  },

  // 2. Far-UV Ground Transition: 166.1478 nm (Vacuum)
  {
    id: '166.1nm',
    lowerLevelId: '2s2_1S0',
    upperLevelId: '2s3p_1P1',
    wavelengthNm: 166.1478,
    wavelengthMedium: 'vacuum',
    referenceWavelengthNm: 166.1478,
    referenceWavelengthMedium: 'vacuum',
    derivedVacuumWavelengthNm: 1e7 / 60187.34,
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(60187.34),
    deltaEnergyEv: cm1ToEv(60187.34),
    photonEnergyEv: cm1ToEv(60187.34),
    frequencyHz: 60187.34 * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#818cf8',
    colorDescription: 'False-color visualization (non-visible far-ultraviolet radiation)',
    isTrueColor: false,
    classification: 'Far-UV Ground Transition (2s² ¹S₀ ↔ 2s3p ¹P°₁)',
    lineName: 'Be I 166.1 nm (Far-UV)',
    description: 'Higher-energy ground-state transition into the 2s3p ¹P°₁ Rydberg-like singlet state, below the standard 200 nm air/vacuum reporting threshold.',
    source: 'NIST ASD Reference Data (Vacuum wavelength)',
  },

  // 3. Triplet UV Transition: 332.1340 nm (Air)
  {
    id: '332.1nm',
    lowerLevelId: '2s2p_3P2',
    upperLevelId: '2s3s_3S1',
    wavelengthNm: 332.134,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 332.134,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (52080.94 - 21981.27),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(52080.94 - 21981.27),
    deltaEnergyEv: cm1ToEv(52080.94 - 21981.27),
    photonEnergyEv: cm1ToEv(52080.94 - 21981.27),
    frequencyHz: (52080.94 - 21981.27) * 100 * 299792458,
    region: 'UV',
    band: 'ultraviolet',
    displayColor: '#c084fc',
    colorDescription: 'False-color visualization (non-visible near-ultraviolet radiation)',
    isTrueColor: false,
    classification: 'Triplet UV Transition (2s2p ³P°₂ ↔ 2s3s ³S₁)',
    lineName: 'Be I 332.1 nm (Triplet UV)',
    description: 'Transition within the triplet manifold, connecting the metastable 2s2p ³P° state to 2s3s ³S₁.',
    source: 'NIST ASD Reference Data (Air wavelength)',
  },

  // 4. Visible Blue Singlet Line: 457.2664 nm (Air)
  {
    id: '457.3nm',
    lowerLevelId: '2s2p_1P1',
    upperLevelId: '2s3d_1D2',
    wavelengthNm: 457.2664,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 457.2664,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (64428.31 - 42565.35),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(64428.31 - 42565.35),
    deltaEnergyEv: cm1ToEv(64428.31 - 42565.35),
    photonEnergyEv: cm1ToEv(64428.31 - 42565.35),
    frequencyHz: (64428.31 - 42565.35) * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#3b82f6',
    colorDescription: 'Approximate display color: blue (wavelength-derived visualization)',
    isTrueColor: true,
    classification: 'Blue Singlet Line (2s2p ¹P°₁ ↔ 2s3d ¹D₂)',
    lineName: 'Be I 457.3 nm (Blue Singlet)',
    description: 'Visible blue emission line within the singlet system, connecting 2s2p ¹P°₁ to 2s3d ¹D₂.',
    source: 'NIST ASD Reference Data (Air wavelength)',
  },

  // 5. Near-Infrared Line: 825.4070 nm (Air)
  {
    id: '825.4nm',
    lowerLevelId: '2s2p_1P1',
    upperLevelId: '2s3s_1S0',
    wavelengthNm: 825.407,
    wavelengthMedium: 'air',
    referenceWavelengthNm: 825.407,
    referenceWavelengthMedium: 'air',
    derivedVacuumWavelengthNm: 1e7 / (54677.26 - 42565.35),
    derivedAirWavelengthNm: vacuumWavenumberToAirWavelengthNm(54677.26 - 42565.35),
    deltaEnergyEv: cm1ToEv(54677.26 - 42565.35),
    photonEnergyEv: cm1ToEv(54677.26 - 42565.35),
    frequencyHz: (54677.26 - 42565.35) * 100 * 299792458,
    region: 'NIR',
    band: 'infrared',
    displayColor: '#fb7185',
    colorDescription: 'False-color visualization (non-visible near-infrared radiation)',
    isTrueColor: false,
    classification: 'Near-Infrared Line (2s2p ¹P°₁ ↔ 2s3s ¹S₀)',
    lineName: 'Be I 825.4 nm (Near-IR)',
    description: 'Near-infrared singlet transition connecting 2s2p ¹P°₁ down to 2s3s ¹S₀.',
    source: 'NIST ASD Reference Data (Air wavelength)',
  },
]

export function getBerylliumLevel(id: string): BerylliumLevel | undefined {
  return BERYLLIUM_LEVELS.find((l) => l.id === id)
}

export function getBerylliumTransition(id: string): BerylliumTransition | undefined {
  return BERYLLIUM_TRANSITIONS.find((t) => t.id === id)
}

export function findBerylliumTransition(levelIdA: string, levelIdB: string): BerylliumTransition | undefined {
  return BERYLLIUM_TRANSITIONS.find(
    (t) =>
      (t.lowerLevelId === levelIdA && t.upperLevelId === levelIdB) ||
      (t.lowerLevelId === levelIdB && t.upperLevelId === levelIdA)
  )
}

/**
 * Reusable runtime validator enforcing the fundamental invariant:
 * For every stored Beryllium transition: energy(upperLevelId) > energy(lowerLevelId).
 */
export function validateBerylliumTransitionLevelOrdering(): boolean {
  for (const t of BERYLLIUM_TRANSITIONS) {
    const lower = getBerylliumLevel(t.lowerLevelId)
    const upper = getBerylliumLevel(t.upperLevelId)
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
validateBerylliumTransitionLevelOrdering()

/**
 * Calculates physical signed state energy difference vs strictly positive photon energy.
 * ABSORPTION: ΔE_state = E_upper - E_lower > 0, E_γ = ΔE_state
 * EMISSION:   ΔE_state = E_lower - E_upper < 0, E_γ = |ΔE_state|
 */
export function calculateBerylliumStateEnergyDelta(
  transition: BerylliumTransition,
  direction: 'absorption' | 'emission'
): { deltaEStateEv: number; photonEnergyEv: number } {
  const lower = getBerylliumLevel(transition.lowerLevelId)!
  const upper = getBerylliumLevel(transition.upperLevelId)!
  if (direction === 'absorption') {
    const deltaEStateEv = upper.energyEv - lower.energyEv
    return { deltaEStateEv, photonEnergyEv: deltaEStateEv }
  } else {
    const deltaEStateEv = lower.energyEv - upper.energyEv
    return { deltaEStateEv, photonEnergyEv: Math.abs(deltaEStateEv) }
  }
}

/**
 * Validates electronic configuration against the Pauli Exclusion Principle for the 4
 * electrons of neutral Beryllium: "No two electrons may share the same complete set of
 * one-electron quantum numbers (n, l, ml, ms)."
 * Ground-state conceptual spin-orbital occupancy: 1s↑ 1s↓ 2s↑ 2s↓.
 */
export function validateBerylliumPauliExclusion(electrons: ElectronQuantumState[]): {
  valid: boolean
  reason?: string
} {
  if (electrons.length !== 4) {
    return { valid: false, reason: `Neutral Beryllium requires exactly 4 electrons (received ${electrons.length})` }
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
 * The four-electron Hamiltonian for neutral Beryllium (fixed-nucleus, non-relativistic
 * approximation) contains exactly one electron-electron Coulomb pair term per unique
 * pair of the 4 electrons: C(4,2) = 6.
 */
export const BERYLLIUM_ELECTRON_PAIRS = ['r₁₂', 'r₁₃', 'r₁₄', 'r₂₃', 'r₂₄', 'r₃₄'] as const

export function berylliumElectronPairCount(): number {
  return BERYLLIUM_ELECTRON_PAIRS.length
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

export function evaluateE1SelectionRule(lower: BerylliumLevel, upper: BerylliumLevel): E1SelectionResult {
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
 * derived via Slater's Rules for the 1s²2s² ground configuration (Z = 4):
 *
 *   Z_eff(1s) = Z - 0.30 (same-shell 1s partner)              = 4 - 0.30 = 3.70
 *   Z_eff(2s) = Z - [0.35 (same-shell 2s partner) + 2×0.85 (1s shielding)]
 *             = 4 - (0.35 + 1.70) = 4 - 2.05 = 1.95
 *
 * NOTE: Explicitly designated as VISUAL MODEL PARAMETERS used ONLY for 3D reduced density
 * rejection sampling. They do NOT alter or replace authoritative NIST ASD energy eigenvalues.
 * Excited-subshell parameters (2p, 3s, 3p, 3d) below are approximate visualization
 * parameters extrapolated from the same screening trend (not individually Slater-derived).
 */
export const BERYLLIUM_VISUAL_CORE_ZEFF = 3.7
export const BERYLLIUM_VALENCE_2S_ZEFF = 1.95
export const BERYLLIUM_VALENCE_2P_ZEFF = 1.55
export const BERYLLIUM_VALENCE_3S_ZEFF = 1.25
export const BERYLLIUM_VALENCE_3P_ZEFF = 1.2
export const BERYLLIUM_VALENCE_3D_ZEFF = 1.05

type ValenceSubshell = '2s' | '2p' | '3s' | '3p' | '3d'

const VALENCE_ZEFF: Record<ValenceSubshell, number> = {
  '2s': BERYLLIUM_VALENCE_2S_ZEFF,
  '2p': BERYLLIUM_VALENCE_2P_ZEFF,
  '3s': BERYLLIUM_VALENCE_3S_ZEFF,
  '3p': BERYLLIUM_VALENCE_3P_ZEFF,
  '3d': BERYLLIUM_VALENCE_3D_ZEFF,
}

/**
 * Parses a compact Beryllium density key (e.g. "2s2", "2s2p", "2p2", "2s3s", "2s3p", "2s3d")
 * into the two valence-subshell labels occupied by the two valence electrons.
 */
function parseValenceSubshells(densityKey: string): [ValenceSubshell, ValenceSubshell] {
  if (densityKey === '2s2') return ['2s', '2s']
  if (densityKey === '2s2p') return ['2s', '2p']
  if (densityKey === '2p2') return ['2p', '2p']
  if (densityKey === '2s3s') return ['2s', '3s']
  if (densityKey === '2s3p') return ['2s', '3p']
  if (densityKey === '2s3d') return ['2s', '3d']
  return ['2s', '2s']
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
  }
}

/**
 * Computes the approximate reduced one-electron density ρ(r) for Beryllium.
 * ρ(r) = ρ_core(1s²) + Σ (single-electron valence contributions for the 2 valence electrons).
 * atomic units: r in Bohr radii a₀.
 */
export function berylliumOrbitalDensity(
  densityKey: string,
  x: number,
  y: number,
  z: number,
  component: 'total' | 'core' | 'valence' = 'total'
): number {
  const r2 = x * x + y * y + z * z
  const r = Math.sqrt(r2)

  // 1s² Core Density: 2 electrons in the compact, visually stable core
  const zCore = BERYLLIUM_VISUAL_CORE_ZEFF
  const coreDensity = 2.0 * Math.exp(-2 * zCore * r)

  if (component === 'core') {
    return coreDensity
  }

  const [subA, subB] = parseValenceSubshells(densityKey)
  const valenceDensity =
    singleElectronValenceDensity(subA, x, y, z, r, r2) + singleElectronValenceDensity(subB, x, y, z, r, r2)

  if (component === 'valence') {
    return valenceDensity
  }

  return coreDensity + valenceDensity
}

/**
 * Samples 3D points for Beryllium one-electron reduced density using rejection sampling.
 */
export function sampleBerylliumDensity(
  densityKey: string,
  count: number,
  component: 'total' | 'core' | 'valence' = 'total',
  seed = 4004
): Float32Array {
  const positions = new Float32Array(count * 3)
  let state = (seed >>> 0) || 4004

  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }

  const extent = densityKey.includes('3') ? 8.5 : 5.8
  const maxDensity = component === 'valence' ? 0.4 : 2.0

  let accepted = 0
  let attempts = 0
  const maxAttempts = count * 250

  while (accepted < count && attempts < maxAttempts) {
    attempts++
    const x = (random() * 2 - 1) * extent
    const y = (random() * 2 - 1) * extent
    const z = (random() * 2 - 1) * extent

    const density = berylliumOrbitalDensity(densityKey, x, y, z, component)
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

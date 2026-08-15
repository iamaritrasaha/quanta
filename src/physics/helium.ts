import { CM1_TO_EV, HELIUM_IONIZATION_ENERGY_EV, HELIUM_IONIZATION_LIMIT_CM1, cm1ToEv } from './constants'
import { classifyRadiation, type RadiationBand } from './hydrogen'

export type Multiplicity = 'singlet' | 'triplet'

export interface HeliumLevel {
  id: string
  configuration: string
  term: string
  termSymbol: string // e.g. "¹S₀", "³S₁", "³P°₂"
  multiplicity: Multiplicity
  spinS: number // 0 for singlet, 1 for triplet
  L: number // 0 for S, 1 for P, 2 for D
  J: number | string // Total angular momentum
  parity: 'even' | 'odd'
  wavenumberCm1: number // Authoritative NIST level excitation energy above 1s² ¹S₀ (cm⁻¹)
  energyEv: number // Derived: wavenumberCm1 * CM1_TO_EV
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

export interface HeliumTransition {
  id: string
  lowerLevelId: string
  upperLevelId: string
  wavelengthNm: number
  wavelengthMedium: 'air' | 'vacuum'
  wavelengthAirNm?: number
  wavelengthVacNm?: number
  components?: FineStructureComponent[]
  deltaEnergyEv: number // E(upper) - E(lower) > 0
  photonEnergyEv: number // Strictly positive photon energy: hc/λ or E(upper) - E(lower)
  frequencyHz: number
  region: 'EUV' | 'VISIBLE' | 'NIR' | 'IR'
  band: RadiationBand | 'euv'
  displayColor: string
  colorDescription: string
  isTrueColor: boolean
  multiplicity: Multiplicity
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
 * Authoritative NIST Atomic Spectra Database (ASD) He I Energy Levels.
 * Primary Source: NIST ASD Level Database (Kramida, A., Ralchenko, Yu., Reader, J., and NIST ASD Team, 2024).
 * All levels are stored in excitation wavenumbers (cm⁻¹) relative to the 1s² ¹S₀ ground state (0.0 cm⁻¹).
 */
export const HELIUM_LEVELS: HeliumLevel[] = [
  // 1. Ground state (Singlet)
  {
    id: '1s2_1S0',
    configuration: '1s²',
    term: '1s² 1S',
    termSymbol: '¹S₀',
    multiplicity: 'singlet',
    spinS: 0,
    L: 0,
    J: 0,
    parity: 'even',
    wavenumberCm1: 0.0,
    energyEv: 0.0,
    source: 'NIST ASD (Ground State Reference)',
  },

  // 2. n=2 states
  {
    id: '1s2s_3S1',
    configuration: '1s2s',
    term: '1s2s 3S',
    termSymbol: '³S₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 0,
    J: 1,
    parity: 'even',
    wavenumberCm1: 159855.9745,
    energyEv: cm1ToEv(159855.9745),
    source: 'NIST ASD',
  },
  {
    id: '1s2s_1S0',
    configuration: '1s2s',
    term: '1s2s 1S',
    termSymbol: '¹S₀',
    multiplicity: 'singlet',
    spinS: 0,
    L: 0,
    J: 0,
    parity: 'even',
    wavenumberCm1: 166277.4403,
    energyEv: cm1ToEv(166277.4403),
    source: 'NIST ASD',
  },
  {
    id: '1s2p_3P2',
    configuration: '1s2p',
    term: '1s2p 3P°',
    termSymbol: '³P°₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 2,
    parity: 'odd',
    wavenumberCm1: 169086.7666,
    energyEv: cm1ToEv(169086.7666),
    source: 'NIST ASD',
  },
  {
    id: '1s2p_3P1',
    configuration: '1s2p',
    term: '1s2p 3P°',
    termSymbol: '³P°₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 1,
    parity: 'odd',
    wavenumberCm1: 169086.8431,
    energyEv: cm1ToEv(169086.8431),
    source: 'NIST ASD',
  },
  {
    id: '1s2p_3P0',
    configuration: '1s2p',
    term: '1s2p 3P°',
    termSymbol: '³P°₀',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 0,
    parity: 'odd',
    wavenumberCm1: 169087.8308,
    energyEv: cm1ToEv(169087.8308),
    source: 'NIST ASD',
  },
  {
    id: '1s2p_1P1',
    configuration: '1s2p',
    term: '1s2p 1P°',
    termSymbol: '¹P°₁',
    multiplicity: 'singlet',
    spinS: 0,
    L: 1,
    J: 1,
    parity: 'odd',
    wavenumberCm1: 171134.897,
    energyEv: cm1ToEv(171134.897),
    source: 'NIST ASD',
  },

  // 3. n=3 states
  {
    id: '1s3s_3S1',
    configuration: '1s3s',
    term: '1s3s 3S',
    termSymbol: '³S₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 0,
    J: 1,
    parity: 'even',
    wavenumberCm1: 183236.7918,
    energyEv: cm1ToEv(183236.7918),
    source: 'NIST ASD',
  },
  {
    id: '1s3s_1S0',
    configuration: '1s3s',
    term: '1s3s 1S',
    termSymbol: '¹S₀',
    multiplicity: 'singlet',
    spinS: 0,
    L: 0,
    J: 0,
    parity: 'even',
    wavenumberCm1: 184864.8294,
    energyEv: cm1ToEv(184864.8294),
    source: 'NIST ASD',
  },
  {
    id: '1s3p_3P2',
    configuration: '1s3p',
    term: '1s3p 3P°',
    termSymbol: '³P°₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 2,
    parity: 'odd',
    wavenumberCm1: 185564.562,
    energyEv: cm1ToEv(185564.562),
    source: 'NIST ASD',
  },
  {
    id: '1s3p_3P1',
    configuration: '1s3p',
    term: '1s3p 3P°',
    termSymbol: '³P°₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 1,
    parity: 'odd',
    wavenumberCm1: 185564.584,
    energyEv: cm1ToEv(185564.584),
    source: 'NIST ASD',
  },
  {
    id: '1s3p_3P0',
    configuration: '1s3p',
    term: '1s3p 3P°',
    termSymbol: '³P°₀',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: 0,
    parity: 'odd',
    wavenumberCm1: 185564.8547,
    energyEv: cm1ToEv(185564.8547),
    source: 'NIST ASD',
  },
  {
    id: '1s3p_3P',
    configuration: '1s3p',
    term: '1s3p 3P°',
    termSymbol: '³P°₀,₁,₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 1,
    J: '0,1,2',
    parity: 'odd',
    wavenumberCm1: 185564.6019,
    energyEv: cm1ToEv(185564.6019),
    isMultipletCentroid: true,
    source: 'NIST ASD (Statistical centroid: [5×J2 + 3×J1 + 1×J0]/9 = 185564.6019 cm⁻¹)',
  },
  {
    id: '1s3p_1P1',
    configuration: '1s3p',
    term: '1s3p 1P°',
    termSymbol: '¹P°₁',
    multiplicity: 'singlet',
    spinS: 0,
    L: 1,
    J: 1,
    parity: 'odd',
    wavenumberCm1: 186209.365,
    energyEv: cm1ToEv(186209.365),
    source: 'NIST ASD',
  },
  {
    id: '1s3d_3D3',
    configuration: '1s3d',
    term: '1s3d 3D',
    termSymbol: '³D₃',
    multiplicity: 'triplet',
    spinS: 1,
    L: 2,
    J: 3,
    parity: 'even',
    wavenumberCm1: 186101.5463,
    energyEv: cm1ToEv(186101.5463),
    source: 'NIST ASD',
  },
  {
    id: '1s3d_3D2',
    configuration: '1s3d',
    term: '1s3d 3D',
    termSymbol: '³D₂',
    multiplicity: 'triplet',
    spinS: 1,
    L: 2,
    J: 2,
    parity: 'even',
    wavenumberCm1: 186101.5488,
    energyEv: cm1ToEv(186101.5488),
    source: 'NIST ASD',
  },
  {
    id: '1s3d_3D1',
    configuration: '1s3d',
    term: '1s3d 3D',
    termSymbol: '³D₁',
    multiplicity: 'triplet',
    spinS: 1,
    L: 2,
    J: 1,
    parity: 'even',
    wavenumberCm1: 186101.593,
    energyEv: cm1ToEv(186101.593),
    source: 'NIST ASD',
  },
  {
    id: '1s3d_3D',
    configuration: '1s3d',
    term: '1s3d 3D',
    termSymbol: '³D₁,₂,₃',
    multiplicity: 'triplet',
    spinS: 1,
    L: 2,
    J: '1,2,3',
    parity: 'even',
    wavenumberCm1: 186101.5518,
    energyEv: cm1ToEv(186101.5518),
    isMultipletCentroid: true,
    source: 'NIST ASD (Statistical centroid: [7×J3 + 5×J2 + 3×J1]/15 = 186101.5518 cm⁻¹)',
  },
  {
    id: '1s3d_1D2',
    configuration: '1s3d',
    term: '1s3d 1D',
    termSymbol: '¹D₂',
    multiplicity: 'singlet',
    spinS: 0,
    L: 2,
    J: 2,
    parity: 'even',
    wavenumberCm1: 186104.967,
    energyEv: cm1ToEv(186104.967),
    source: 'NIST ASD',
  },
]

/**
 * Curated NIST He I Spectral Transitions.
 * IMPORTANT: Invariant lowerLevelId < upperLevelId holds for every entry.
 * Physical interaction direction (Absorption vs Emission) is evaluated dynamically.
 */
export const HELIUM_TRANSITIONS: HeliumTransition[] = [
  // 1. Extreme Ultraviolet Ground-State Resonance Line: 58.4334 nm (Vacuum)
  {
    id: '58.4nm',
    lowerLevelId: '1s2_1S0',
    upperLevelId: '1s2p_1P1',
    wavelengthNm: 58.4334,
    wavelengthMedium: 'vacuum',
    wavelengthVacNm: 58.4334,
    deltaEnergyEv: cm1ToEv(171134.897),
    photonEnergyEv: cm1ToEv(171134.897), // ~21.2180 eV
    frequencyHz: 171134.897 * 100 * 299792458,
    region: 'EUV',
    band: 'euv',
    displayColor: '#818cf8',
    colorDescription: 'False color (non-visible extreme ultraviolet radiation)',
    isTrueColor: false,
    multiplicity: 'singlet',
    classification: 'Resonance Singlet (1s² ¹S₀ ↔ 1s2p ¹P°₁)',
    lineName: 'He I 58.4 nm (Resonance)',
    description: 'Principal ground-state resonance transition in the extreme ultraviolet (EUV).',
    source: 'NIST ASD He I (Vacuum wavelength)',
    components: [
      {
        lowerJ: 0,
        upperJ: 1,
        wavelengthNm: 58.4334,
        wavelengthMedium: 'vacuum',
        wavenumberCm1: 171134.897,
        comment: '1s² ¹S₀ ↔ 1s2p ¹P°₁',
      },
    ],
  },

  // 2. Solar Eclipse Hero Line: 587.561 nm (Air) Multiplet
  {
    id: '587.6nm',
    lowerLevelId: '1s2p_3P2',
    upperLevelId: '1s3d_3D',
    wavelengthNm: 587.561,
    wavelengthMedium: 'air',
    wavelengthAirNm: 587.561,
    wavelengthVacNm: 587.725,
    deltaEnergyEv: cm1ToEv(186101.5463 - 169086.7666),
    photonEnergyEv: cm1ToEv(186101.5463 - 169086.7666), // ~2.1096 eV
    frequencyHz: 17014.78 * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#fbbf24',
    colorDescription: 'Approximate display color: yellow (wavelength-derived visualization)',
    isTrueColor: true,
    multiplicity: 'triplet',
    classification: 'Triplet Multiplet (1s2p ³P° ↔ 1s3d ³D)',
    lineName: 'He I 587.6 nm (D₃ line)',
    description:
      'Discovered during the 1868 solar eclipse by Pierre Janssen & Norman Lockyer in the solar chromosphere emission spectrum.',
    source: 'NIST ASD He I (Air wavelength)',
    components: [
      {
        lowerJ: 2,
        upperJ: 3,
        wavelengthNm: 587.5614,
        wavelengthMedium: 'air',
        wavenumberCm1: 17014.7797,
        relativeIntensity: 100,
        comment: '1s2p ³P°₂ ↔ 1s3d ³D₃ (Primary component)',
      },
      {
        lowerJ: 2,
        upperJ: 2,
        wavelengthNm: 587.5644,
        wavelengthMedium: 'air',
        wavenumberCm1: 17014.7822,
        relativeIntensity: 14,
        comment: '1s2p ³P°₂ ↔ 1s3d ³D₂',
      },
      {
        lowerJ: 1,
        upperJ: 2,
        wavelengthNm: 587.5599,
        wavelengthMedium: 'air',
        wavenumberCm1: 17014.7057,
        relativeIntensity: 42,
        comment: '1s2p ³P°₁ ↔ 1s3d ³D₂',
      },
      {
        lowerJ: 1,
        upperJ: 1,
        wavelengthNm: 587.5966,
        wavelengthMedium: 'air',
        wavenumberCm1: 17014.7499,
        relativeIntensity: 14,
        comment: '1s2p ³P°₁ ↔ 1s3d ³D₁',
      },
      {
        lowerJ: 0,
        upperJ: 1,
        wavelengthNm: 587.5989,
        wavelengthMedium: 'air',
        wavenumberCm1: 17013.7622,
        relativeIntensity: 14,
        comment: '1s2p ³P°₀ ↔ 1s3d ³D₁',
      },
    ],
  },

  // 3. Singlet Red Line: 667.815 nm (Air)
  {
    id: '667.8nm',
    lowerLevelId: '1s2p_1P1',
    upperLevelId: '1s3d_1D2',
    wavelengthNm: 667.815,
    wavelengthMedium: 'air',
    wavelengthAirNm: 667.815,
    wavelengthVacNm: 668.0,
    deltaEnergyEv: cm1ToEv(186104.967 - 171134.897),
    photonEnergyEv: cm1ToEv(186104.967 - 171134.897), // ~1.8560 eV
    frequencyHz: 14970.07 * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#ef4444',
    colorDescription: 'Approximate display color: red (wavelength-derived visualization)',
    isTrueColor: true,
    multiplicity: 'singlet',
    classification: 'Singlet (1s2p ¹P°₁ ↔ 1s3d ¹D₂)',
    lineName: 'He I 667.8 nm (Singlet Red)',
    description: 'Prominent visible red emission line in laboratory Helium discharge tubes.',
    source: 'NIST ASD He I (Air wavelength)',
    components: [
      {
        lowerJ: 1,
        upperJ: 2,
        wavelengthNm: 667.815,
        wavelengthMedium: 'air',
        wavenumberCm1: 14970.07,
        comment: '1s2p ¹P°₁ ↔ 1s3d ¹D₂',
      },
    ],
  },

  // 4. Triplet Deep Red Line: 706.519 nm (Air) Multiplet
  {
    id: '706.5nm',
    lowerLevelId: '1s2p_3P2',
    upperLevelId: '1s3s_3S1',
    wavelengthNm: 706.519,
    wavelengthMedium: 'air',
    wavelengthAirNm: 706.519,
    wavelengthVacNm: 706.714,
    deltaEnergyEv: cm1ToEv(183236.7918 - 169086.7666),
    photonEnergyEv: cm1ToEv(183236.7918 - 169086.7666), // ~1.7544 eV
    frequencyHz: 14150.02 * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#dc2626',
    colorDescription: 'Approximate display color: deep red (wavelength-derived visualization)',
    isTrueColor: true,
    multiplicity: 'triplet',
    classification: 'Triplet Multiplet (1s2p ³P° ↔ 1s3s ³S₁)',
    lineName: 'He I 706.5 nm (Deep Red)',
    description: 'Diagnostic triplet emission line used for measuring laboratory and astrophysical plasma density.',
    source: 'NIST ASD He I (Air wavelength)',
    components: [
      {
        lowerJ: 2,
        upperJ: 1,
        wavelengthNm: 706.519,
        wavelengthMedium: 'air',
        wavenumberCm1: 14150.0252,
        relativeIntensity: 100,
        comment: '1s2p ³P°₂ ↔ 1s3s ³S₁',
      },
      {
        lowerJ: 1,
        upperJ: 1,
        wavelengthNm: 706.5228,
        wavelengthMedium: 'air',
        wavenumberCm1: 14149.9487,
        relativeIntensity: 60,
        comment: '1s2p ³P°₁ ↔ 1s3s ³S₁',
      },
      {
        lowerJ: 0,
        upperJ: 1,
        wavelengthNm: 706.571,
        wavelengthMedium: 'air',
        wavenumberCm1: 14148.961,
        relativeIntensity: 20,
        comment: '1s2p ³P°₀ ↔ 1s3s ³S₁',
      },
    ],
  },

  // 5. Singlet Cyan-Green Line: 501.568 nm (Air)
  {
    id: '501.6nm',
    lowerLevelId: '1s2s_1S0',
    upperLevelId: '1s3p_1P1',
    wavelengthNm: 501.568,
    wavelengthMedium: 'air',
    wavelengthAirNm: 501.568,
    wavelengthVacNm: 501.708,
    deltaEnergyEv: cm1ToEv(186209.365 - 166277.4403),
    photonEnergyEv: cm1ToEv(186209.365 - 166277.4403), // ~2.4712 eV
    frequencyHz: 19931.92 * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#10b981',
    colorDescription: 'Approximate display color: cyan-green (wavelength-derived visualization)',
    isTrueColor: true,
    multiplicity: 'singlet',
    classification: 'Singlet (1s2s ¹S₀ ↔ 1s3p ¹P°₁)',
    lineName: 'He I 501.6 nm (Cyan-Green)',
    description: 'Bright singlet emission originating from the 1s3p ¹P°₁ state to the metastable 1s2s ¹S₀ state.',
    source: 'NIST ASD He I (Air wavelength)',
    components: [
      {
        lowerJ: 0,
        upperJ: 1,
        wavelengthNm: 501.568,
        wavelengthMedium: 'air',
        wavenumberCm1: 19931.9247,
        comment: '1s2s ¹S₀ ↔ 1s3p ¹P°₁',
      },
    ],
  },

  // 6. Triplet Violet / Near-UV Line: 388.865 nm (Air) Multiplet
  {
    id: '388.9nm',
    lowerLevelId: '1s2s_3S1',
    upperLevelId: '1s3p_3P',
    wavelengthNm: 388.865,
    wavelengthMedium: 'air',
    wavelengthAirNm: 388.865,
    wavelengthVacNm: 388.975,
    deltaEnergyEv: cm1ToEv(185564.6019 - 159855.9745),
    photonEnergyEv: cm1ToEv(185564.6019 - 159855.9745), // ~3.1874 eV
    frequencyHz: 25708.63 * 100 * 299792458,
    region: 'VISIBLE',
    band: 'visible',
    displayColor: '#8b5cf6',
    colorDescription: 'Approximate display color: violet (wavelength-derived visualization)',
    isTrueColor: true,
    multiplicity: 'triplet',
    classification: 'Triplet Multiplet (1s2s ³S₁ ↔ 1s3p ³P°)',
    lineName: 'He I 388.9 nm (Violet)',
    description:
      'Intense near-ultraviolet / violet transition terminating on the long-lived metastable 1s2s ³S₁ state.',
    source: 'NIST ASD He I (Air wavelength)',
    components: [
      {
        lowerJ: 1,
        upperJ: 2,
        wavelengthNm: 388.8646,
        wavelengthMedium: 'air',
        wavenumberCm1: 25708.5875,
        relativeIntensity: 100,
        comment: '1s2s ³S₁ ↔ 1s3p ³P°₂',
      },
      {
        lowerJ: 1,
        upperJ: 1,
        wavelengthNm: 388.8649,
        wavelengthMedium: 'air',
        wavenumberCm1: 25708.6095,
        relativeIntensity: 60,
        comment: '1s2s ³S₁ ↔ 1s3p ³P°₁',
      },
      {
        lowerJ: 1,
        upperJ: 0,
        wavelengthNm: 388.8608,
        wavelengthMedium: 'air',
        wavenumberCm1: 25708.8802,
        relativeIntensity: 20,
        comment: '1s2s ³S₁ ↔ 1s3p ³P°₀',
      },
    ],
  },

  // 7. Near-Infrared Triplet Line: 1083.03 nm (Air) Multiplet
  {
    id: '1083.0nm',
    lowerLevelId: '1s2s_3S1',
    upperLevelId: '1s2p_3P2',
    wavelengthNm: 1083.03,
    wavelengthMedium: 'air',
    wavelengthAirNm: 1083.03,
    wavelengthVacNm: 1083.33,
    deltaEnergyEv: cm1ToEv(169086.7666 - 159855.9745),
    photonEnergyEv: cm1ToEv(169086.7666 - 159855.9745), // ~1.1445 eV
    frequencyHz: 9230.79 * 100 * 299792458,
    region: 'NIR',
    band: 'infrared',
    displayColor: '#f43f5e',
    colorDescription: 'False color (non-visible near-infrared radiation)',
    isTrueColor: false,
    multiplicity: 'triplet',
    classification: 'Triplet Multiplet (1s2s ³S₁ ↔ 1s2p ³P°)',
    lineName: 'He I 1083.0 nm (Near-IR)',
    description:
      'Key astrophysical near-IR line used to map solar magnetic chromospheric activity and exoplanetary atmospheric escape.',
    source: 'NIST ASD He I (Air wavelength)',
    components: [
      {
        lowerJ: 1,
        upperJ: 2,
        wavelengthNm: 1083.034,
        wavelengthMedium: 'air',
        wavenumberCm1: 9230.7921,
        relativeIntensity: 100,
        comment: '1s2s ³S₁ ↔ 1s2p ³P°₂',
      },
      {
        lowerJ: 1,
        upperJ: 1,
        wavelengthNm: 1083.025,
        wavelengthMedium: 'air',
        wavenumberCm1: 9230.8686,
        relativeIntensity: 60,
        comment: '1s2s ³S₁ ↔ 1s2p ³P°₁',
      },
      {
        lowerJ: 1,
        upperJ: 0,
        wavelengthNm: 1082.908,
        wavelengthMedium: 'air',
        wavenumberCm1: 9231.8563,
        relativeIntensity: 20,
        comment: '1s2s ³S₁ ↔ 1s2p ³P°₀',
      },
    ],
  },
]

export function getHeliumLevel(id: string): HeliumLevel | undefined {
  return HELIUM_LEVELS.find((l) => l.id === id)
}

export function getHeliumTransition(id: string): HeliumTransition | undefined {
  return HELIUM_TRANSITIONS.find((t) => t.id === id)
}

export function findHeliumTransition(levelIdA: string, levelIdB: string): HeliumTransition | undefined {
  return HELIUM_TRANSITIONS.find(
    (t) =>
      (t.lowerLevelId === levelIdA && t.upperLevelId === levelIdB) ||
      (t.lowerLevelId === levelIdB && t.upperLevelId === levelIdA)
  )
}

export function wavenumberToEv(cm1: number): number {
  return cm1ToEv(cm1)
}

/**
 * Reusable runtime validator enforcing the fundamental invariant:
 * For every stored Helium transition: energy(upperLevelId) > energy(lowerLevelId).
 */
export function validateTransitionLevelOrdering(): boolean {
  for (const t of HELIUM_TRANSITIONS) {
    const lower = getHeliumLevel(t.lowerLevelId)
    const upper = getHeliumLevel(t.upperLevelId)
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
validateTransitionLevelOrdering()

/**
 * Calculates physical signed state energy difference vs strictly positive photon energy.
 * ABSORPTION: ΔE_state = E_upper - E_lower > 0, E_γ = ΔE_state
 * EMISSION:   ΔE_state = E_lower - E_upper < 0, E_γ = |ΔE_state|
 */
export function calculateStateEnergyDelta(
  transition: HeliumTransition,
  direction: 'absorption' | 'emission'
): { deltaEStateEv: number; photonEnergyEv: number } {
  const lower = getHeliumLevel(transition.lowerLevelId)!
  const upper = getHeliumLevel(transition.upperLevelId)!
  if (direction === 'absorption') {
    const deltaEStateEv = upper.energyEv - lower.energyEv
    return { deltaEStateEv, photonEnergyEv: deltaEStateEv }
  } else {
    const deltaEStateEv = lower.energyEv - upper.energyEv
    return { deltaEStateEv, photonEnergyEv: Math.abs(deltaEStateEv) }
  }
}

/**
 * Validates electronic configuration against the Pauli Exclusion Principle:
 * "No two electrons in an atom may share the same complete set of quantum numbers (n, l, ml, ms)."
 */
export function validatePauliExclusion(electrons: ElectronQuantumState[]): { valid: boolean; reason?: string } {
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
        reason: `Pauli violation: multiple electrons share quantum numbers (n=${e.n}, l=${e.l}, ml=${e.ml}, ms=${e.ms > 0 ? '+½' : '-½'})`,
      }
    }
    seen.add(key)
  }
  return { valid: true }
}

/**
 * Standard Helium Ground-State Effective Nuclear Charge (Slater / Variational):
 * Z_eff = 2 - 5/16 = 1.6875 (accounts for screening of one electron by the other).
 *
 * NOTE: This is an independent-particle visual approximation for the 1-electron reduced density,
 * NOT the full 6-dimensional correlated wavefunction Ψ(r₁, r₂).
 */
export const HELIUM_GROUND_ZEFF = 1.6875

/**
 * Computes the approximate one-electron probability density ρ(r) for Helium.
 * atomic units: r in Bohr radii a₀.
 */
export function heliumOrbitalDensity(
  configuration: string,
  x: number,
  y: number,
  z: number,
  component: 'total' | 'core' | 'valence' = 'total'
): number {
  const r2 = x * x + y * y + z * z
  const r = Math.sqrt(r2)

  // 1. Ground state 1s² (two paired electrons in screened 1s)
  if (configuration === '1s2' || configuration === '1s2_1S0') {
    // ρ_1s(r) ∝ exp(-2 * Z_eff * r)
    const zeff = HELIUM_GROUND_ZEFF
    return 2.0 * Math.exp(-2 * zeff * r)
  }

  // 2. Excited 1s2s state (one 1s core electron with Z ≈ 2, one 2s valence electron with Z_eff ≈ 1)
  if (configuration.startsWith('1s2s')) {
    const coreDensity = Math.exp(-2 * 2.0 * r) // 1s core (Z=2)
    const radial2s = 2 - r
    const valenceDensity = radial2s * radial2s * Math.exp(-r) * 0.15 // 2s valence (Z_eff ≈ 1)

    if (component === 'core') return coreDensity * 2.0
    if (component === 'valence') return valenceDensity * 2.0
    return coreDensity + valenceDensity
  }

  // 3. Excited 1s2p state (one 1s core electron with Z ≈ 2, one 2p valence electron with Z_eff ≈ 1)
  if (configuration.startsWith('1s2p')) {
    const coreDensity = Math.exp(-2 * 2.0 * r) // 1s core
    const valenceDensity = z * z * Math.exp(-r) * 0.22 // 2p_z lobe

    if (component === 'core') return coreDensity * 2.0
    if (component === 'valence') return valenceDensity * 2.0
    return coreDensity + valenceDensity
  }

  // 4. Excited 1s3d state (one 1s core electron + 3d valence electron)
  if (configuration.startsWith('1s3d')) {
    const coreDensity = Math.exp(-2 * 2.0 * r)
    const angular3d = 3 * z * z - r2
    const valenceDensity = angular3d * angular3d * Math.exp((-2 * r) / 3) * 0.008

    if (component === 'core') return coreDensity * 2.0
    if (component === 'valence') return valenceDensity * 2.0
    return coreDensity + valenceDensity
  }

  // Fallback to ground 1s²
  return 2.0 * Math.exp(-2 * HELIUM_GROUND_ZEFF * r)
}

/**
 * Samples 3D points for Helium one-electron reduced density using rejection sampling.
 */
export function sampleHeliumDensity(
  configuration: string,
  count: number,
  component: 'total' | 'core' | 'valence' = 'total',
  seed = 2024
): Float32Array {
  const positions = new Float32Array(count * 3)
  let state = (seed >>> 0) || 2024

  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }

  const extent = configuration.startsWith('1s2p') || configuration.startsWith('1s2s') ? 7.5 : 4.2
  const maxDensity = 2.0

  let accepted = 0
  let attempts = 0
  const maxAttempts = count * 250

  while (accepted < count && attempts < maxAttempts) {
    attempts++
    const x = (random() * 2 - 1) * extent
    const y = (random() * 2 - 1) * extent
    const z = (random() * 2 - 1) * extent

    const density = heliumOrbitalDensity(configuration, x, y, z, component)
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

import type { ElementKey } from './elements'
import { getElementByKey } from './elements'
import type { ViewMode } from '../state/quantaStore'

export interface InstrumentModeDescription {
  title: string
  subtitle: string
  badge: string
}

type ModeDescriptions = Record<ViewMode, InstrumentModeDescription>

const hydrogenModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'HYDROGEN OVERVIEW',
    subtitle: 'Fundamental constants and baseline properties of the simplest atom',
    badge: 'ELEMENT 01 / AVAILABLE',
  },
  bohr: {
    title: 'BOHR QUANTIZATION MODEL',
    subtitle: 'Quantized electron orbits with discrete radius rₙ = a₀·n² and electronic state transitions',
    badge: 'HISTORICAL / CONCEPTUAL MODEL',
  },
  quantum: {
    title: 'SCHRÖDINGER EIGENFUNCTIONS',
    subtitle: 'Exact wave function probability distributions |ψ(r,θ,φ)|² · not classical electron orbits',
    badge: 'MODERN QUANTUM MECHANICS',
  },
  energy: {
    title: 'ENERGY LEVEL EIGENVALUES',
    subtitle: 'Quantized energy rungs approaching the 0 eV ionization boundary',
    badge: 'SPECTRAL STRUCTURE',
  },
  spectra: {
    title: 'EMISSION SPECTROSCOPY',
    subtitle: 'Continuous UV-Visible-IR spectrum mapping and Rydberg series line classification',
    badge: 'SPECTRAL SIGNAL',
  },
  equations: {
    title: 'MATHEMATICAL DERIVATION INSPECTOR',
    subtitle: 'Step-by-step physical equations, state substitutions, and exact numerical results',
    badge: 'ANALYTIC ENGINE',
  },
}

const heliumModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'HELIUM OVERVIEW',
    subtitle: 'Helium is where the one-electron picture ends · Many-body quantum physics',
    badge: 'ELEMENT 02 / AVAILABLE',
  },
  bohr: {
    title: 'SHELL OCCUPANCY MODEL',
    subtitle: 'Paired electrons in quantized energy shells · illustrative point markers',
    badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
  },
  quantum: {
    title: 'SCHRÖDINGER MANY-BODY DENSITY',
    subtitle: 'Reduced one-electron density ρ(r) derived from effective-charge approximation',
    badge: 'REDUCED PROBABILITY DENSITY',
  },
  energy: {
    title: 'HELIUM I TERM EIGENVALUES',
    subtitle: 'Singlet (S=0) and Triplet (S=1) levels approaching the 24.587 eV ionization threshold',
    badge: 'NIST ASD TERM DIAGRAM',
  },
  spectra: {
    title: 'EMISSION SPECTROSCOPY',
    subtitle: 'Continuous EUV-UV-Visible-IR spectrum mapping and authoritative NIST line transitions',
    badge: 'HELIUM I SPECTROSCOPY',
  },
  equations: {
    title: 'MATHEMATICAL DERIVATION INSPECTOR',
    subtitle: 'Two-electron Hamiltonian with inter-electronic Coulomb repulsion and exchange splitting',
    badge: 'TWO-ELECTRON DERIVATION',
  },
}

const lithiumModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'LITHIUM OVERVIEW',
    subtitle: 'First alkali metal · 1s² closed core + lone 2s valence electron',
    badge: 'ELEMENT 03 / AVAILABLE',
  },
  bohr: {
    title: 'SHELL OCCUPANCY MODEL',
    subtitle: 'K-shell core pair + open L-shell valence electron with core shielding',
    badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
  },
  quantum: {
    title: 'SCHRÖDINGER REDUCED DENSITY (3-ELECTRON)',
    subtitle: 'Reduced one-electron density ρ(r) with core-penetrating valence density',
    badge: 'REDUCED PROBABILITY DENSITY',
  },
  energy: {
    title: 'LITHIUM I TERM EIGENVALUES',
    subtitle: '²S, ²P°, ²D, ²F° series approaching the 5.392 eV ionization threshold',
    badge: 'NIST ASD TERM DIAGRAM',
  },
  spectra: {
    title: 'EMISSION SPECTROSCOPY',
    subtitle: 'Iconic 670.8 nm crimson resonance doublet and NIST ASD reference series lines',
    badge: 'LITHIUM I SPECTROSCOPY',
  },
  equations: {
    title: 'MATHEMATICAL DERIVATION INSPECTOR',
    subtitle: 'Three-electron Hamiltonian with non-hydrogenic quantum defects and core polarization',
    badge: 'THREE-ELECTRON DERIVATION',
  },
}

const berylliumModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'BERYLLIUM OVERVIEW',
    subtitle: 'Lightest alkaline-earth metal · Closed 1s² 2s² configuration with low excitation energy',
    badge: 'ELEMENT 04 / AVAILABLE',
  },
  bohr: {
    title: 'SHELL OCCUPANCY MODEL',
    subtitle: 'K-shell core pair + L-shell 2s² valence pair',
    badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
  },
  quantum: {
    title: 'SCHRÖDINGER REDUCED DENSITY (4-ELECTRON)',
    subtitle: 'Reduced one-electron density ρ(r) derived from multi-electron effective-charge screening',
    badge: 'REDUCED PROBABILITY DENSITY',
  },
  energy: {
    title: 'BERYLLIUM I TERM EIGENVALUES',
    subtitle: 'Singlet (S=0) and Triplet (S=1) terms approaching the 9.323 eV ionization limit',
    badge: 'NIST ASD TERM DIAGRAM',
  },
  spectra: {
    title: 'EMISSION SPECTROSCOPY',
    subtitle: '234.9 nm resonance singlet line and Be I reference transitions',
    badge: 'BERYLLIUM I SPECTROSCOPY',
  },
  equations: {
    title: 'MATHEMATICAL DERIVATION INSPECTOR',
    subtitle: 'Four-electron Hamiltonian with six pairwise Coulomb repulsion terms',
    badge: 'FOUR-ELECTRON DERIVATION',
  },
}

const boronModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'BORON OVERVIEW',
    subtitle: 'First p-block element · Trivalent electron configuration [He]2s²2p¹',
    badge: 'ELEMENT 05 / AVAILABLE',
  },
  bohr: {
    title: 'SHELL & SUBSHELL OCCUPANCY MODEL',
    subtitle: 'K-shell (1s²) core + 2s² anchor pair + one visually distinct open-subshell 2p electron',
    badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
  },
  quantum: {
    title: 'SCHRÖDINGER REDUCED DENSITY (5-ELECTRON)',
    subtitle: 'Reduced one-electron density ρ(r) with a directional p-like valence lobe, not spherically symmetric',
    badge: 'REDUCED PROBABILITY DENSITY',
  },
  energy: {
    title: 'BORON I TERM EIGENVALUES',
    subtitle: '²S, ²P°, ²D, ²F° series approaching the reference ionization limit',
    badge: 'NIST ASD TERM DIAGRAM',
  },
  spectra: {
    title: 'EMISSION SPECTROSCOPY',
    subtitle: '~249.7 nm UV ground-state multiplet and curated B I reference-line transitions',
    badge: 'BORON I SPECTROSCOPY',
  },
  equations: {
    title: 'MATHEMATICAL DERIVATION INSPECTOR',
    subtitle: 'Five-electron Hamiltonian with ten pairwise Coulomb repulsion terms',
    badge: 'FIVE-ELECTRON DERIVATION',
  },
}

const elementModeDescriptions: Partial<Record<ElementKey, ModeDescriptions>> = {
  hydrogen: hydrogenModeDescriptions,
  helium: heliumModeDescriptions,
  lithium: lithiumModeDescriptions,
  beryllium: berylliumModeDescriptions,
  boron: boronModeDescriptions,
}

export function getInstrumentModeDescription(
  elementKey: ElementKey,
  mode: ViewMode,
): InstrumentModeDescription {
  const specific = elementModeDescriptions[elementKey]
  if (specific) {
    return specific[mode] ?? specific.overview
  }

  const el = getElementByKey(elementKey)
  if (!el) {
    return {
      title: 'ATOMIC REFERENCE INSTRUMENT',
      subtitle: 'Complete 6-mode atomic physics exploration',
      badge: 'QUANTA V4',
    }
  }

  const nameUpper = el.name.toUpperCase()
  const numPad = String(el.number).padStart(2, '0')

  switch (mode) {
    case 'overview':
      return {
        title: `${nameUpper} OVERVIEW`,
        subtitle: `${el.category} · Period ${el.period}${el.group ? ` · Group ${el.group}` : ''} · Atomic profile`,
        badge: `ELEMENT ${numPad} / AVAILABLE`,
      }
    case 'bohr':
      return {
        title: `${nameUpper} SHELL OCCUPANCY MODEL`,
        subtitle: `Pedagogical principal shells K through Q with ${el.number} electrons`,
        badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
      }
    case 'quantum':
      return {
        title: `${nameUpper} QUANTUM PROBABILITY & SCREENING`,
        subtitle: `Reduced one-electron density with Slater effective nuclear charge Z_eff`,
        badge: 'REDUCED PROBABILITY DENSITY',
      }
    case 'energy':
      return {
        title: `${el.symbol.toUpperCase()} I TERM EIGENVALUES`,
        subtitle: `NIST ASD bound energy levels, term symbols, and ionization limit`,
        badge: 'NIST ASD TERM DIAGRAM',
      }
    case 'spectra':
      return {
        title: `${nameUpper} EMISSION SPECTROSCOPY`,
        subtitle: `Continuous UV-Visible-IR multi-band spectral strip and derived transition wavelengths`,
        badge: `${el.symbol.toUpperCase()} I SPECTROSCOPY`,
      }
    case 'equations':
      return {
        title: `${nameUpper} MATHEMATICAL DERIVATION INSPECTOR`,
        subtitle: `${el.number}-electron Hamiltonian, Slater screening rules, and transition energetics`,
        badge: `${el.number}-ELECTRON DERIVATION`,
      }
    default:
      return {
        title: `${nameUpper} OVERVIEW`,
        subtitle: `Neutral atom atomic physics exploration`,
        badge: `ELEMENT ${numPad}`,
      }
  }
}

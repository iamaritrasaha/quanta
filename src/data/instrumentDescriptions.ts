import type { ElementKey } from './elements'
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
    subtitle: 'Exact wave function probability distributions |ψ(r,θ,φ)|² — not classical electron orbits',
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
    subtitle: 'Paired electrons in quantized energy shells — illustrative point markers',
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
    subtitle: 'Two-electron Hamiltonian with r₁₂ Coulomb repulsion and Pauli singlet spin coupling',
    badge: 'TWO-ELECTRON DERIVATION',
  },
}

const lithiumModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'LITHIUM OVERVIEW',
    subtitle: 'Closed 1s² core + 1 outer valence electron · Alkali metal physics',
    badge: 'ELEMENT 03 / AVAILABLE',
  },
  bohr: {
    title: 'SHELL OCCUPANCY MODEL',
    subtitle: 'K-shell (1s²) core pair + L/M/N-shell outer valence electron transitions',
    badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
  },
  quantum: {
    title: 'SCHRÖDINGER REDUCED DENSITY & QUANTUM DEFECT',
    subtitle: 'Reduced one-electron density ρ(r) with core screening and penetration analysis',
    badge: 'REDUCED PROBABILITY DENSITY',
  },
  energy: {
    title: 'LITHIUM I TERM EIGENVALUES',
    subtitle: '²S, ²P°, ²D, ²F° series approaching the 5.392 eV ionization threshold',
    badge: 'NIST ASD TERM DIAGRAM',
  },
  spectra: {
    title: 'EMISSION SPECTROSCOPY',
    subtitle: '670.8 nm resonance doublet and persistent spectral transitions in air',
    badge: 'LITHIUM I SPECTROSCOPY',
  },
  equations: {
    title: 'MATHEMATICAL DERIVATION INSPECTOR',
    subtitle: 'Three-electron Hamiltonian with r₁₂, r₁₃, r₂₃ pair repulsions and core screening',
    badge: 'THREE-ELECTRON DERIVATION',
  },
}

const berylliumModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'BERYLLIUM OVERVIEW',
    subtitle: 'Closed 1s² core + two interacting valence electrons · Alkaline earth physics',
    badge: 'ELEMENT 04 / AVAILABLE',
  },
  bohr: {
    title: 'SHELL & SUBSHELL OCCUPANCY MODEL',
    subtitle: 'K-shell (1s²) core pair + two independently tracked valence electrons',
    badge: 'PEDAGOGICAL ELECTRON-SHELL REPRESENTATION',
  },
  quantum: {
    title: 'SCHRÖDINGER REDUCED DENSITY (4-ELECTRON)',
    subtitle: 'Reduced one-electron density ρ(r) derived from a Slater-screened effective-charge approximation',
    badge: 'REDUCED PROBABILITY DENSITY',
  },
  energy: {
    title: 'BERYLLIUM I TERM EIGENVALUES',
    subtitle: 'Singlet (S=0) and Triplet (S=1) systems approaching the reference ionization limit',
    badge: 'NIST ASD TERM DIAGRAM',
  },
  spectra: {
    title: 'EMISSION SPECTROSCOPY',
    subtitle: '234.9 nm ground-state resonance and curated Be I persistent-line transitions',
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
    subtitle: 'Closed 1s²2s² core + one open-subshell 2p valence electron · Metalloid physics',
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

const multiElementModeDescriptions: ModeDescriptions = {
  overview: {
    title: 'ATOMIC REFERENCE PROFILE',
    subtitle: 'Element properties and ground-state configuration from a published periodic table reference',
    badge: 'REFERENCE DATA',
  },
  bohr: {
    title: 'SHELL OCCUPANCY MODEL',
    subtitle: 'Select electronic states, absorb or emit photons, and inspect electron shell changes',
    badge: 'IDEALIZED SHELL REPRESENTATION',
  },
  quantum: {
    title: 'RADIAL ELECTRON CLOUD',
    subtitle: 'Schematic shell density for the selected configuration, with animated state changes',
    badge: 'ILLUSTRATIVE DENSITY MODEL',
  },
  energy: {
    title: 'NEUTRAL ATOM ENERGY LEVELS',
    subtitle: 'Reference level records from NIST ASD when available',
    badge: 'NIST ASD REFERENCE',
  },
  spectra: {
    title: 'DERIVED TRANSITION WAVELENGTH',
    subtitle: 'Vacuum wavelength calculated from the selected reference-level energy difference',
    badge: 'CALCULATED FROM LEVEL DATA',
  },
  equations: {
    title: 'ATOMIC RELATIONS',
    subtitle: 'Configuration electron counts and energy-to-wavelength conversion',
    badge: 'REFERENCE RELATIONS',
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
  const descriptions = elementModeDescriptions[elementKey] ?? multiElementModeDescriptions
  return descriptions[mode] ?? descriptions.overview
}

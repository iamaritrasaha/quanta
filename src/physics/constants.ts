/** SI constants used by the browser-only scientific calculation engine. */
export const PLANCK = 6.626_070_15e-34 // J·s (exact)
export const LIGHT_SPEED = 299_792_458 // m·s⁻¹ (exact)
export const ELECTRON_VOLT = 1.602_176_634e-19 // J (exact)
export const BOHR_RADIUS = 5.291_772_109_03e-11 // m
export const RYDBERG_H = 10_967_758.340_280_352 // m⁻¹, reduced-mass hydrogen value
export const HYDROGEN_GROUND_ENERGY_EV = -13.598_434_599_702

// NIST conversion factor: 1 cm⁻¹ in eV (h * c * 100 / e)
export const CM1_TO_EV = 1.239_841_984_332_002_6e-4

// Authoritative NIST Helium (He I) constants (Source: NIST ASD 2024)
export const HELIUM_IONIZATION_ENERGY_EV = 24.587_389_011
export const HELIUM_IONIZATION_LIMIT_CM1 = 198_310.666_37

// Authoritative NIST Lithium (Li I) constants (Source: NIST ASD Reference Data / Kramida et al., 2024)
// First Ionization Energy: 5.391714996 eV (Uncertainty: ± 0.000000022 eV) [Compact: 5.391714996(22) eV]
// Ionization Limit: 43,487.11420 cm⁻¹
export const LITHIUM_IONIZATION_ENERGY_EV = 5.391_714_996
export const LITHIUM_IONIZATION_ENERGY_UNCERTAINTY_EV = 0.000_000_022
export const LITHIUM_IONIZATION_ENERGY_FORMATTED_EV = '5.391714996(22) eV'
export const LITHIUM_IONIZATION_LIMIT_CM1 = 43_487.114_20

// CIAAW Standard Atomic-Weight Interval [6.938, 6.997]
export const LITHIUM_ATOMIC_WEIGHT_RANGE = [6.938, 6.997] as const

// CIAAW Normal-Material Isotopic-Composition Intervals:
// ⁶Li: [0.019, 0.078] = 1.9% – 7.8%
// ⁷Li: [0.922, 0.981] = 92.2% – 98.1%
export const LITHIUM_6_ISOTOPE_FRACTION_RANGE = [0.019, 0.078] as const
export const LITHIUM_7_ISOTOPE_FRACTION_RANGE = [0.922, 0.981] as const

// Rydberg constant for infinite mass (cm⁻¹)
export const RYDBERG_INF_CM1 = 109_737.315_681_60

// Mass-adjusted Rydberg constant for ⁷Li (cm⁻¹): R_⁷Li = R_∞ / (1 + m_e / M(⁷Li))
export const RYDBERG_LI7_CM1 = 109_728.718_45

export const joulesToEv = (joules: number) => joules / ELECTRON_VOLT
export const evToJoules = (ev: number) => ev * ELECTRON_VOLT
export const metresToNm = (metres: number) => metres * 1e9
export const metresToPm = (metres: number) => metres * 1e12
export const cm1ToEv = (cm1: number) => cm1 * CM1_TO_EV

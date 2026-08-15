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

export const joulesToEv = (joules: number) => joules / ELECTRON_VOLT
export const evToJoules = (ev: number) => ev * ELECTRON_VOLT
export const metresToNm = (metres: number) => metres * 1e9
export const metresToPm = (metres: number) => metres * 1e12
export const cm1ToEv = (cm1: number) => cm1 * CM1_TO_EV

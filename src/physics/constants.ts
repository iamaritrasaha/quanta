/** SI constants used by the browser-only scientific calculation engine. */
export const PLANCK = 6.626_070_15e-34 // J·s (exact)
export const LIGHT_SPEED = 299_792_458 // m·s⁻¹ (exact)
export const ELECTRON_VOLT = 1.602_176_634e-19 // J (exact)
export const BOHR_RADIUS = 5.291_772_109_03e-11 // m
export const RYDBERG_H = 10_967_758.340_280_352 // m⁻¹, reduced-mass hydrogen value
export const HYDROGEN_GROUND_ENERGY_EV = -13.598_434_599_702

export const joulesToEv = (joules: number) => joules / ELECTRON_VOLT
export const evToJoules = (ev: number) => ev * ELECTRON_VOLT
export const metresToNm = (metres: number) => metres * 1e9
export const metresToPm = (metres: number) => metres * 1e12

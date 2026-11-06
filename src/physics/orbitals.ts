/**
 * QUANTA V4 — Universal Atomic Orbital Engine
 *
 * Provides a rigorous, analytical and screened mathematical framework for
 * atomic wavefunctions across all s, p, d, and f orbitals:
 *   ψ_nlm(r, θ, φ) = R_nl(r; Z_eff) * Y_l,orientation(θ, φ)
 *
 * Implements:
 * 1. Complete real spherical harmonics for:
 *    - s (l=0): 1 orientation
 *    - p (l=1): 3 orientations (px, py, pz)
 *    - d (l=2): 5 orientations (dxy, dxz, dyz, dx²-y², dz²)
 *    - f (l=3): 7 orientations (fz³, fxz², fyz², fxyz, fz(x²-y²), fx(x²-3y²), fy(3x²-y²))
 * 2. Exact analytical Hydrogenic radial functions via generalized Laguerre polynomials
 *    L_{n-l-1}^{2l+1}(2Zr/n) for arbitrary n >= 1 and 0 <= l < n.
 * 3. Screened effective nuclear charge (Z_eff) integration for multi-electron atoms.
 * 4. Wavefunction phase evaluation (sign +1 or -1), probability densities, and nodes.
 * 5. Rejection sampling of 3D point clouds with phase tags for Three.js rendering.
 */

import { calculateSlaterScreening, parseConfiguration } from './slater'
import { getAtomicProperties } from '../data/atomicData'
import { elements } from '../data/elements'

export type OrbitalFamily = 's' | 'p' | 'd' | 'f'

export type RealOrientationKey =
  // s (1)
  | 's'
  // p (3)
  | 'px'
  | 'py'
  | 'pz'
  // d (5)
  | 'dxy'
  | 'dxz'
  | 'dyz'
  | 'dx2-y2'
  | 'dz2'
  // f (7)
  | 'fz3'
  | 'fxz2'
  | 'fyz2'
  | 'fxyz'
  | 'fz(x2-y2)'
  | 'fx(x2-3y2)'
  | 'fy(3x2-y2)'

export interface OrbitalOrientationInfo {
  key: RealOrientationKey
  family: OrbitalFamily
  label: string
  formula: string
  angularNodesDesc: string
  mEquivalent?: string // Educational note on complex eigenstate relationship
}

export const ORBITAL_ORIENTATIONS: Record<RealOrientationKey, OrbitalOrientationInfo> = {
  s: {
    key: 's',
    family: 's',
    label: 's',
    formula: 'Y₀₀ = 1 / √(4π)',
    angularNodesDesc: '0 angular nodes (spherically symmetric)',
    mEquivalent: 'm = 0 eigenstate',
  },
  pz: {
    key: 'pz',
    family: 'p',
    label: 'p_z',
    formula: 'Y₁₀ ∝ z / r = cos θ',
    angularNodesDesc: '1 planar node: xy-equator (z = 0)',
    mEquivalent: 'm = 0 eigenstate',
  },
  px: {
    key: 'px',
    family: 'p',
    label: 'p_x',
    formula: 'Y_{p_x} ∝ x / r = sin θ cos φ',
    angularNodesDesc: '1 planar node: yz-plane (x = 0)',
    mEquivalent: 'Real superposition: (Y₁₋₁ - Y₁₁)/√2',
  },
  py: {
    key: 'py',
    family: 'p',
    label: 'p_y',
    formula: 'Y_{p_y} ∝ y / r = sin θ sin φ',
    angularNodesDesc: '1 planar node: xz-plane (y = 0)',
    mEquivalent: 'Real superposition: i(Y₁₋₁ + Y₁₁)/√2',
  },
  dz2: {
    key: 'dz2',
    family: 'd',
    label: 'd_{z²}',
    formula: 'Y₂₀ ∝ (3z² - r²) / r² = 3cos²θ - 1',
    angularNodesDesc: '2 conical nodes: cos θ = ±1/√3 (θ ≈ 54.7°, 125.3°)',
    mEquivalent: 'm = 0 eigenstate',
  },
  dxz: {
    key: 'dxz',
    family: 'd',
    label: 'd_{xz}',
    formula: 'Y_{d_{xz}} ∝ xz / r² = sin θ cos θ cos φ',
    angularNodesDesc: '2 planar nodes: x = 0 (yz-plane) and z = 0 (xy-plane)',
    mEquivalent: 'Real superposition: (Y₂₋₁ - Y₂₁)/√2',
  },
  dyz: {
    key: 'dyz',
    family: 'd',
    label: 'd_{yz}',
    formula: 'Y_{d_{yz}} ∝ yz / r² = sin θ cos θ sin φ',
    angularNodesDesc: '2 planar nodes: y = 0 (xz-plane) and z = 0 (xy-plane)',
    mEquivalent: 'Real superposition: i(Y₂₋₁ + Y₂₁)/√2',
  },
  dxy: {
    key: 'dxy',
    family: 'd',
    label: 'd_{xy}',
    formula: 'Y_{d_{xy}} ∝ xy / r² = sin²θ sin 2φ',
    angularNodesDesc: '2 planar nodes: x = 0 and y = 0',
    mEquivalent: 'Real superposition: i(Y₂₋₂ - Y₂₂)/√2',
  },
  'dx2-y2': {
    key: 'dx2-y2',
    family: 'd',
    label: 'd_{x²-y²}',
    formula: 'Y_{d_{x²-y²}} ∝ (x² - y²) / r² = sin²θ cos 2φ',
    angularNodesDesc: '2 planar nodes: x = y and x = -y (bisecting axes at 45°)',
    mEquivalent: 'Real superposition: (Y₂₋₂ + Y₂₂)/√2',
  },
  fz3: {
    key: 'fz3',
    family: 'f',
    label: 'f_{z³}',
    formula: 'Y₃₀ ∝ z(5z² - 3r²) / r³ = cos θ (5cos²θ - 3)',
    angularNodesDesc: '3 angular nodes: z = 0 equator & 2 cones at cos θ = ±√(3/5)',
    mEquivalent: 'm = 0 eigenstate',
  },
  fxz2: {
    key: 'fxz2',
    family: 'f',
    label: 'f_{xz²}',
    formula: 'Y_{f_{xz²}} ∝ x(5z² - r²) / r³',
    angularNodesDesc: '3 angular nodes: yz-plane (x = 0) and 2 cones at 5z² = r²',
    mEquivalent: 'Real superposition: (Y₃₋₁ - Y₃₁)/√2',
  },
  fyz2: {
    key: 'fyz2',
    family: 'f',
    label: 'f_{yz²}',
    formula: 'Y_{f_{yz²}} ∝ y(5z² - r²) / r³',
    angularNodesDesc: '3 angular nodes: xz-plane (y = 0) and 2 cones at 5z² = r²',
    mEquivalent: 'Real superposition: i(Y₃₋₁ + Y₃₁)/√2',
  },
  fxyz: {
    key: 'fxyz',
    family: 'f',
    label: 'f_{xyz}',
    formula: 'Y_{f_{xyz}} ∝ xyz / r³',
    angularNodesDesc: '3 planar nodes: x = 0, y = 0, z = 0 (8 alternating octants)',
    mEquivalent: 'Real superposition: i(Y₃₋₂ - Y₃₂)/√2',
  },
  'fz(x2-y2)': {
    key: 'fz(x2-y2)',
    family: 'f',
    label: 'f_{z(x²-y²)}',
    formula: 'Y_{f_{z(x²-y²)}} ∝ z(x² - y²) / r³',
    angularNodesDesc: '3 planar nodes: z = 0, x = y, x = -y',
    mEquivalent: 'Real superposition: (Y₃₋₂ + Y₃₂)/√2',
  },
  'fx(x2-3y2)': {
    key: 'fx(x2-3y2)',
    family: 'f',
    label: 'f_{x(x²-3y²)}',
    formula: 'Y_{f_{x(x²-3y²)}} ∝ x(x² - 3y²) / r³ = sin³θ cos 3φ',
    angularNodesDesc: '3 vertical planar nodes at φ = 30°, 90°, 150° (6 lobes)',
    mEquivalent: 'Real superposition: (Y₃₋₃ - Y₃₃)/√2',
  },
  'fy(3x2-y2)': {
    key: 'fy(3x2-y2)',
    family: 'f',
    label: 'f_{y(3x²-y²)}',
    formula: 'Y_{f_{y(3x²-y²)}} ∝ y(3x² - y²) / r³ = sin³θ sin 3φ',
    angularNodesDesc: '3 vertical planar nodes at φ = 0°, 60°, 120° (6 lobes)',
    mEquivalent: 'Real superposition: i(Y₃₋₃ + Y₃₃)/√2',
  },
}

export const FAMILY_ORIENTATIONS: Record<OrbitalFamily, RealOrientationKey[]> = {
  s: ['s'],
  p: ['pz', 'px', 'py'],
  d: ['dz2', 'dxz', 'dyz', 'dxy', 'dx2-y2'],
  f: ['fz3', 'fxz2', 'fyz2', 'fxyz', 'fz(x2-y2)', 'fx(x2-3y2)', 'fy(3x2-y2)'],
}

export const FAMILY_TO_L: Record<OrbitalFamily, number> = {
  s: 0,
  p: 1,
  d: 2,
  f: 3,
}

export const L_TO_FAMILY: Record<number, OrbitalFamily> = {
  0: 's',
  1: 'p',
  2: 'd',
  3: 'f',
}

export const FAMILY_CAPACITY: Record<OrbitalFamily, number> = {
  s: 2,
  p: 6,
  d: 10,
  f: 14,
}

function cleanZero(val: number): number {
  return Object.is(val, -0) || Math.abs(val) < 1e-15 ? 0 : val
}

/**
 * Evaluates the real spherical harmonic angular function Y_l,orient(θ, φ)
 * using Cartesian unit coordinates (ux = x/r, uy = y/r, uz = z/r).
 * Guaranteed singularity-free at origin (returns 0 for l > 0).
 */
export function evaluateRealSphericalHarmonic(
  orientation: RealOrientationKey,
  ux: number,
  uy: number,
  uz: number
): number {
  switch (orientation) {
    // l = 0 (s)
    case 's':
      return 0.28209479177387814 // 1 / sqrt(4 * pi)

    // l = 1 (p)
    case 'pz':
      return cleanZero(0.4886025119029199 * uz) // sqrt(3 / (4 * pi)) * uz
    case 'px':
      return cleanZero(0.4886025119029199 * ux)
    case 'py':
      return cleanZero(0.4886025119029199 * uy)

    // l = 2 (d)
    case 'dz2':
      // 0.5 * sqrt(5 / (4 * pi)) * (3 * uz² - 1) = 0.31539156525252005 * (3*uz² - 1)
      return cleanZero(0.31539156525252005 * (3 * uz * uz - 1))
    case 'dxz':
      return cleanZero(1.0925484305920792 * ux * uz) // sqrt(15 / (4 * pi)) * ux * uz
    case 'dyz':
      return cleanZero(1.0925484305920792 * uy * uz)
    case 'dxy':
      return cleanZero(1.0925484305920792 * ux * uy)
    case 'dx2-y2':
      return cleanZero(0.5462742152960396 * (ux * ux - uy * uy)) // 0.5 * sqrt(15 / (4 * pi)) * (ux² - uy²)

    // l = 3 (f)
    case 'fz3':
      // 0.25 * sqrt(7 / pi) * uz * (5 * uz² - 3) = 0.3731763325901154 * uz * (5*uz² - 3)
      return cleanZero(0.3731763325901154 * uz * (5 * uz * uz - 3))
    case 'fxz2':
      // 0.25 * sqrt(21 / (2 * pi)) * ux * (5 * uz² - 1) = 0.4570457994644658 * ux * (5*uz² - 1)
      return cleanZero(0.4570457994644658 * ux * (5 * uz * uz - 1))
    case 'fyz2':
      return cleanZero(0.4570457994644658 * uy * (5 * uz * uz - 1))
    case 'fxyz':
      // sqrt(105 / (4 * pi)) * ux * uy * uz = 2.890611442640554 * ux * uy * uz
      return cleanZero(2.890611442640554 * ux * uy * uz)
    case 'fz(x2-y2)':
      // 0.25 * sqrt(105 / pi) * uz * (ux² - uy²) = 1.445305721320277 * uz * (ux² - uy²)
      return cleanZero(1.445305721320277 * uz * (ux * ux - uy * uy))
    case 'fx(x2-3y2)':
      // 0.25 * sqrt(35 / (2 * pi)) * ux * (ux² - 3*uy²) = 0.5900435899266435 * ux * (ux² - 3*uy²)
      return cleanZero(0.5900435899266435 * ux * (ux * ux - 3 * uy * uy))
    case 'fy(3x2-y2)':
      return cleanZero(0.5900435899266435 * uy * (3 * ux * ux - uy * uy))

    default:
      return 0.28209479177387814
  }
}

/**
 * Generalized / Associated Laguerre Polynomial L_k^alpha(x) via three-term recurrence.
 * Degree k = n - l - 1 equals the number of radial nodes.
 */
export function evaluateAssociatedLaguerre(k: number, alpha: number, x: number): number {
  if (k <= 0) return 1.0
  if (k === 1) return 1.0 + alpha - x

  let lPrev = 1.0
  let lCurr = 1.0 + alpha - x

  for (let j = 1; j < k; j++) {
    const lNext = ((2 * j + 1 + alpha - x) * lCurr - (j + alpha) * lPrev) / (j + 1)
    lPrev = lCurr
    lCurr = lNext
  }

  return lCurr
}

/**
 * Natural log factorial helper for computing large normalization constants without overflow.
 */
function lnFactorial(n: number): number {
  if (n <= 1) return 0
  let sum = 0
  for (let i = 2; i <= n; i++) {
    sum += Math.log(i)
  }
  return sum
}

/**
 * Exact analytical Hydrogenic radial wavefunction R_{nl}(r; Z) in atomic units (r in a₀).
 * Evaluates:
 *   N_{nl} = sqrt((2Z/n)³ * (n-l-1)! / (2n * (n+l)!))
 *   R_{nl}(r) = N_{nl} * exp(-ρ/2) * ρ^l * L_{n-l-1}^{2l+1}(ρ)
 * where ρ = 2*Z*r / n.
 */
export function evaluateRadialWavefunction(n: number, l: number, r: number, z = 1.0): number {
  if (n < 1 || l < 0 || l >= n || r < 0) return 0.0

  const k = n - l - 1 // radial node count
  const alpha = 2 * l + 1
  const rho = (2.0 * z * r) / n

  // Normalization factor computed in log-space for numerical stability
  const logFactor =
    1.5 * Math.log((2.0 * z) / n) +
    0.5 * (lnFactorial(k) - Math.log(2.0 * n) - lnFactorial(n + l))
  const norm = Math.exp(logFactor)

  const laguerre = evaluateAssociatedLaguerre(k, alpha, rho)
  const powerPart = Math.pow(rho, l)
  const expPart = Math.exp(-rho / 2.0)

  return norm * powerPart * laguerre * expPart
}

/**
 * Radial probability distribution function:
 *   P(r) = r² * |R_{nl}(r)|²
 * Normalized such that ∫₀^∞ P(r) dr = 1.
 */
export function evaluateRadialProbability(n: number, l: number, r: number, z = 1.0): number {
  const rVal = evaluateRadialWavefunction(n, l, r, z)
  return r * r * rVal * rVal
}

/**
 * Full spatial atomic orbital wavefunction value ψ(x, y, z):
 *   ψ(x, y, z) = R_{nl}(r; Z_eff) * Y_{l,orient}(x/r, y/r, z/r)
 */
export function evaluateOrbitalWavefunction(
  n: number,
  orientation: RealOrientationKey,
  x: number,
  y: number,
  z: number,
  zeff = 1.0
): number {
  const r2 = x * x + y * y + z * z
  const r = Math.sqrt(r2)
  const info = ORBITAL_ORIENTATIONS[orientation]
  const l = FAMILY_TO_L[info.family]

  if (r < 1e-9) {
    if (l === 0) {
      // s-orbital has non-zero finite value at origin
      const r0 = evaluateRadialWavefunction(n, 0, 0, zeff)
      return r0 * 0.28209479177387814
    }
    return 0.0
  }

  const ux = x / r
  const uy = y / r
  const uz = z / r

  const radial = evaluateRadialWavefunction(n, l, r, zeff)
  const angular = evaluateRealSphericalHarmonic(orientation, ux, uy, uz)

  return radial * angular
}

/**
 * Computes the Slater effective nuclear charge Z_eff for a specific (n, l) orbital
 * within a given element's electron configuration.
 */
export function getOrbitalZeff(
  elementNumber: number,
  n: number,
  family: OrbitalFamily,
  configuration?: string
): number {
  if (elementNumber === 1) return 1.0 // Hydrogen is exact Tier A

  const symbol = elements.find((e) => e.number === elementNumber)?.symbol ?? ''
  const config =
    configuration ??
    getAtomicProperties(symbol)?.electronConfiguration

  if (!config) {
    // Default fallback based on atomic number and shell
    return Math.max(1.0, Math.sqrt(elementNumber) * 0.75 + 0.5)
  }

  const subshells = parseConfiguration(config)
  const targetSubshellKey = `${n}${family}`
  const targetIndex = subshells.findIndex((s) => `${s.n}${s.l}` === targetSubshellKey)

  // If subshell is unpopulated in ground state, compute screening from all occupied electrons
  if (targetIndex < 0) {
    let sigma = 0
    for (const sub of subshells) {
      if (family === 's' || family === 'p') {
        if (sub.n === n) {
          sigma += sub.count * 0.35
        } else if (sub.n === n - 1) {
          sigma += sub.count * 0.85
        } else if (sub.n < n - 1) {
          sigma += sub.count * 1.0
        }
      } else {
        // d or f
        if (sub.n === n && sub.l === family) {
          sigma += sub.count * 0.35
        } else if (sub.n < n || (sub.n === n && (sub.l === 's' || sub.l === 'p'))) {
          sigma += sub.count * 1.0
        }
      }
    }
    return Math.max(1.0, elementNumber - sigma)
  }

  // Subshell exists in configuration
  const slater = calculateSlaterScreening(elementNumber, config)
  return Math.max(1.0, slater.zEffective)
}

/**
 * Detailed description of an atomic orbital state for UI inspection and educational context.
 */
export interface OrbitalMetadata {
  n: number
  family: OrbitalFamily
  l: number
  orientation: RealOrientationKey
  orientationInfo: OrbitalOrientationInfo
  radialNodes: number // n - l - 1
  angularNodes: number // l
  totalNodes: number // n - 1
  capacity: number
  isGroundOccupied: boolean
  groundOccupancy: number
  zEffective: number
  rPeakBoher: number // Approximate peak radius in a₀
}

/**
 * Generates complete scientific metadata for any orbital in any element.
 */
export function getOrbitalMetadata(
  elementNumber: number,
  n: number,
  orientation: RealOrientationKey,
  configuration?: string
): OrbitalMetadata {
  const orientInfo = ORBITAL_ORIENTATIONS[orientation]
  const l = FAMILY_TO_L[orientInfo.family]
  const radialNodes = n - l - 1
  const angularNodes = l
  const totalNodes = n - 1
  const capacity = FAMILY_CAPACITY[orientInfo.family]
  const zeff = getOrbitalZeff(elementNumber, n, orientInfo.family, configuration)

  // Ground state occupancy
  let isGroundOccupied = false
  let groundOccupancy = 0

  const symbol = elements.find((e) => e.number === elementNumber)?.symbol ?? ''
  const config =
    configuration ??
    getAtomicProperties(symbol)?.electronConfiguration

  if (config) {
    const subshells = parseConfiguration(config)
    const targetKey = `${n}${orientInfo.family}`
    const match = subshells.find((s) => `${s.n}${s.l}` === targetKey)
    if (match && match.count > 0) {
      isGroundOccupied = true
      groundOccupancy = match.count
    }
  }

  // Peak radius estimate: r_peak ≈ n² / Z_eff
  const rPeakBoher = (n * n) / zeff

  return {
    n,
    family: orientInfo.family,
    l,
    orientation,
    orientationInfo: orientInfo,
    radialNodes,
    angularNodes,
    totalNodes,
    capacity,
    isGroundOccupied,
    groundOccupancy,
    zEffective: zeff,
    rPeakBoher,
  }
}

export interface OrbitalSampleResult {
  positions: Float32Array // count * 3 (x, y, z in scene coordinates)
  phases: Float32Array // count (+1.0 for positive phase, -1.0 for negative phase)
  densities: Float32Array // count (relative density in [0, 1])
  extent: number
  pointCount: number
}

/**
 * Rejection sampling of 3D orbital probability density |ψ|² with phase attribution.
 * Generates points proportional to |ψ|² and tags each point with the algebraic sign
 * of ψ (wavefunction phase).
 */
export function sampleOrbitalField(
  n: number,
  orientation: RealOrientationKey,
  count: number,
  zeff = 1.0,
  seed = 101,
  slicePlane: 'none' | 'xy' | 'xz' | 'yz' = 'none'
): OrbitalSampleResult {
  const orientInfo = ORBITAL_ORIENTATIONS[orientation]
  const l = FAMILY_TO_L[orientInfo.family]

  // Dynamic spatial bounding extent based on principal quantum number and effective charge
  // Visual scaling: normalized to maintain comfortable viewing size in Three.js viewport
  const visualScale = 1.0 // scaled in scene space
  const rExtent = Math.max(3.5, (n * n * 2.8) / Math.sqrt(zeff))
  const boxExtent = rExtent * 1.15

  const positions = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const densities = new Float32Array(count)

  let rng = (seed >>> 0) || 101
  const random = () => {
    rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0
    return rng / 4294967296
  }

  // Find approximate maximum density for rejection sampling
  let maxPsi2 = 0
  const probeCount = 200
  for (let i = 0; i < probeCount; i++) {
    const rx = (random() * 2 - 1) * rExtent
    const ry = (random() * 2 - 1) * rExtent
    const rz = (random() * 2 - 1) * rExtent
    const psi = evaluateOrbitalWavefunction(n, orientation, rx, ry, rz, zeff)
    const psi2 = psi * psi
    if (psi2 > maxPsi2) maxPsi2 = psi2
  }
  if (maxPsi2 <= 0) maxPsi2 = 0.01

  let accepted = 0
  let iterations = 0
  const maxIterations = count * 120

  while (accepted < count && iterations < maxIterations) {
    iterations++

    let px = (random() * 2 - 1) * boxExtent
    let py = (random() * 2 - 1) * boxExtent
    let pz = (random() * 2 - 1) * boxExtent

    // Cross-section slice constraint: restrict point sampling to a thin slice
    if (slicePlane === 'xy') {
      pz = (random() * 2 - 1) * 0.18
    } else if (slicePlane === 'xz') {
      py = (random() * 2 - 1) * 0.18
    } else if (slicePlane === 'yz') {
      px = (random() * 2 - 1) * 0.18
    }

    const psi = evaluateOrbitalWavefunction(n, orientation, px, py, pz, zeff)
    const psi2 = psi * psi

    // Rejection threshold
    if (random() * maxPsi2 * 1.2 <= psi2) {
      // Scene coordinates with normalized scale
      const sceneScale = visualScale / Math.max(1.0, (n * 1.2) / Math.sqrt(zeff))
      positions[accepted * 3] = px * sceneScale
      positions[accepted * 3 + 1] = py * sceneScale
      positions[accepted * 3 + 2] = pz * sceneScale

      phases[accepted] = psi >= 0 ? 1.0 : -1.0
      densities[accepted] = Math.min(1.0, psi2 / maxPsi2)
      accepted++
    }
  }

  // Fill any remaining points with valid coordinates if loop hit maximum iterations
  while (accepted < count) {
    const fallbackAngle = (accepted / count) * Math.PI * 2
    const fallbackR = (n * n * 0.5) / Math.sqrt(zeff)
    positions[accepted * 3] = Math.cos(fallbackAngle) * fallbackR
    positions[accepted * 3 + 1] = Math.sin(fallbackAngle) * fallbackR
    positions[accepted * 3 + 2] = 0
    phases[accepted] = 1.0
    densities[accepted] = 0.5
    accepted++
  }

  return {
    positions,
    phases,
    densities,
    extent: boxExtent,
    pointCount: count,
  }
}

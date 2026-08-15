export type OrbitalKey = '1s' | '2s' | '2p' | '3s' | '3p' | '3d'
export type UiOrbitalKey = '1s' | '2s' | '2p'

export interface QuantumNumbers {
  n: number
  l: number
  m: number
  spin: 0.5 | -0.5
}

export const ORBITALS: Record<OrbitalKey, Omit<QuantumNumbers, 'spin'>> = {
  '1s': { n: 1, l: 0, m: 0 },
  '2s': { n: 2, l: 0, m: 0 },
  '2p': { n: 2, l: 1, m: 0 },
  '3s': { n: 3, l: 0, m: 0 },
  '3p': { n: 3, l: 1, m: 0 },
  '3d': { n: 3, l: 2, m: 0 },
}

export const UI_ORBITALS: UiOrbitalKey[] = ['1s', '2s', '2p']

export function validateQuantumNumbers({ n, l, m, spin }: QuantumNumbers): boolean {
  return (
    Number.isInteger(n) &&
    n >= 1 &&
    Number.isInteger(l) &&
    l >= 0 &&
    l < n &&
    Number.isInteger(m) &&
    m >= -l &&
    m <= l &&
    (spin === 0.5 || spin === -0.5)
  )
}

interface OrbitalParams {
  extent: number
  maxDensity: number
}

const ORBITAL_PARAMS: Record<OrbitalKey, OrbitalParams> = {
  '1s': { extent: 3.8, maxDensity: 1.0 },
  '2s': { extent: 8.5, maxDensity: 4.0 },
  '2p': { extent: 8.5, maxDensity: 0.55 },
  '3s': { extent: 14.0, maxDensity: 730.0 },
  '3p': { extent: 15.0, maxDensity: 16.0 },
  '3d': { extent: 15.0, maxDensity: 65.0 },
}

/**
 * Exact relative probability density functions |ψ(x, y, z)|² for Hydrogenic states.
 * Uses natural atomic units (r in Bohr radii a₀).
 */
export function orbitalDensity(orbital: OrbitalKey, x: number, y: number, z: number): number {
  const r2 = x * x + y * y + z * z
  const r = Math.sqrt(r2)

  switch (orbital) {
    case '1s': {
      // |ψ_100|² ∝ exp(-2r)
      return Math.exp(-2 * r)
    }
    case '2s': {
      // |ψ_200|² ∝ (2 - r)² exp(-r) (radial node at r = 2)
      const radial = 2 - r
      return radial * radial * Math.exp(-r)
    }
    case '2p': {
      // |ψ_210|² ∝ z² exp(-r) (planar node at z = 0)
      return z * z * Math.exp(-r)
    }
    case '3s': {
      // |ψ_300|² ∝ (27 - 18r + 2r²)² exp(-2r/3) (radial nodes at r ≈ 1.90 and 7.10)
      const poly = 27 - 18 * r + 2 * r2
      return poly * poly * Math.exp((-2 * r) / 3)
    }
    case '3p': {
      // |ψ_310|² ∝ z² (6 - r)² exp(-2r/3) (planar node at z = 0, radial node at r = 6)
      const radial = 6 - r
      return z * z * radial * radial * Math.exp((-2 * r) / 3)
    }
    case '3d': {
      // Hydrogenic 3d, m=0: ψ_320 ∝ (3z² - r²) exp(-r/3) = (2z² - x² - y²) exp(-r/3)
      // Angular nodal cone where 3cos²θ - 1 = 0 => 2z² = x² + y²
      const angular = 3 * z * z - r2
      return angular * angular * Math.exp((-2 * r) / 3)
    }
    default:
      return Math.exp(-2 * r)
  }
}

/**
 * Robust rejection sampling of the exact Hydrogenic probability density.
 * Guarantees that all count * 3 floats in the returned Float32Array are validly populated.
 */
export function sampleOrbital(orbital: OrbitalKey, count: number, seed = 173): Float32Array {
  const positions = new Float32Array(count * 3)
  let state = (seed >>> 0) || 173

  // Fast Linear Congruential Generator (LCG) for deterministic reproducibility
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }

  const { extent, maxDensity } = ORBITAL_PARAMS[orbital] ?? ORBITAL_PARAMS['1s']
  let accepted = 0
  let attempts = 0
  const maxAttempts = count * 200

  while (accepted < count && attempts < maxAttempts) {
    attempts++
    const x = (random() * 2 - 1) * extent
    const y = (random() * 2 - 1) * extent
    const z = (random() * 2 - 1) * extent

    const density = orbitalDensity(orbital, x, y, z)
    const prob = density / maxDensity

    if (random() < prob) {
      const idx = accepted * 3
      positions[idx] = x
      positions[idx + 1] = y
      positions[idx + 2] = z
      accepted++
    }
  }

  // If maxAttempts was reached before completing all points, duplicate from accepted points
  if (accepted < count && accepted > 0) {
    for (let i = accepted; i < count; i++) {
      const srcIdx = (i % accepted) * 3
      const dstIdx = i * 3
      // Add slight jitter so duplicate points don't occupy identical pixel coordinates
      positions[dstIdx] = positions[srcIdx] + (random() - 0.5) * 0.05
      positions[dstIdx + 1] = positions[srcIdx + 1] + (random() - 0.5) * 0.05
      positions[dstIdx + 2] = positions[srcIdx + 2] + (random() - 0.5) * 0.05
    }
  }

  return positions
}

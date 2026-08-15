export type OrbitalKey = '1s' | '2s' | '2p' | '3s' | '3p' | '3d'
export interface QuantumNumbers { n: number; l: number; m: number; spin: 0.5 | -0.5 }
export const ORBITALS: Record<OrbitalKey, Omit<QuantumNumbers, 'spin'>> = {
  '1s': { n: 1, l: 0, m: 0 }, '2s': { n: 2, l: 0, m: 0 }, '2p': { n: 2, l: 1, m: 0 },
  '3s': { n: 3, l: 0, m: 0 }, '3p': { n: 3, l: 1, m: 0 }, '3d': { n: 3, l: 2, m: 0 },
}
export function validateQuantumNumbers({ n, l, m, spin }: QuantumNumbers): boolean {
  return Number.isInteger(n) && n >= 1 && Number.isInteger(l) && l >= 0 && l < n && Number.isInteger(m) && m >= -l && m <= l && (spin === .5 || spin === -.5)
}

/** Unnormalised analytic density shapes, intentionally sufficient for relative point sampling. */
export function orbitalDensity(orbital: OrbitalKey, x: number, y: number, z: number): number {
  const r2 = x * x + y * y + z * z, r = Math.sqrt(r2), radial = Math.exp(-r)
  if (orbital === '1s') return radial * radial
  if (orbital === '2s') return Math.pow((2 - r) * Math.exp(-r / 2), 2)
  if (orbital === '2p') return z * z * Math.exp(-r)
  if (orbital === '3s') return Math.pow((27 - 18 * r + 2 * r2) * Math.exp(-r / 3), 2)
  if (orbital === '3p') return z * z * Math.pow((6 - r) * Math.exp(-r / 3), 2)
  return z * z * z * z * Math.exp(-2 * r / 3)
}

/** Rejection samples a finite visual threshold, not a physical orbital boundary. */
export function sampleOrbital(orbital: OrbitalKey, count: number, seed = 173): Float32Array {
  const positions = new Float32Array(count * 3); let state = seed
  const random = () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296)
  const extent = orbital === '1s' ? 4 : orbital.startsWith('2') ? 9 : 14
  let i = 0, attempts = 0
  while (i < count && attempts++ < count * 80) {
    const x = (random() * 2 - 1) * extent, y = (random() * 2 - 1) * extent, z = (random() * 2 - 1) * extent
    const density = orbitalDensity(orbital, x, y, z)
    // A fixed envelope makes all supported orbital lobes/nodes apparent.
    if (random() < Math.min(1, density * 2.2)) { positions[i++] = x; positions[i++] = y; positions[i++] = z }
  }
  return positions
}

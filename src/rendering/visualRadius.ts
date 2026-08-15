/**
 * Compressed non-linear visual radius mapping for Bohr orbit representation.
 * Physical radius follows r_n = a_0 * n^2 (ranging from 1 to 36 a_0).
 * A direct linear or quadratic 3D scale would make high levels explode off screen.
 * This smooth logarithmic compression preserves the monotonic hierarchy while
 * keeping n = 1 through n = 6 within 45–55% of the viewport.
 */
export function getVisualRadius(n: number): number {
  const clampedN = Math.max(1, Math.min(8, n))
  return 1.65 + 1.62 * Math.log2(clampedN + 0.3)
}

/**
 * Visual angular velocity for electron orbit.
 * Scaled smoothly so inner orbits are swifter than outer orbits without becoming frantic.
 */
export function getOrbitAngularSpeed(n: number): number {
  const clampedN = Math.max(1, Math.min(8, n))
  return 2.2 / Math.pow(clampedN, 0.75)
}

/**
 * Scientific Scale Transform Utilities for QUANTA Atomic Visualizers.
 *
 * Provides monotonic display coordinate transforms for bound states and excitation manifolds,
 * explicitly supporting scale breaks and non-linear Rydberg expansions while preserving
 * physical ordering invariants.
 */

export interface EnergyScaleDomain {
  minEv: number
  maxEv: number
}

export interface EnergyScaleRange {
  minPercent: number
  maxPercent: number
}

/**
 * Transforms a physical Hydrogen energy (eV) into a display percentage [0, 100].
 * Explicitly applies a piecewise transform that discloses scale expansion for the
 * upper Rydberg manifold (n >= 2, E in [-3.400, 0.000] eV) above the deep ground state (n = 1, -13.598 eV).
 *
 * Physical Invariant:
 * E_1 (-13.598 eV) < E_2 (-3.400 eV) < E_3 (-1.511 eV) < E_4 (-0.850 eV) < E_5 (-0.544 eV) < E_6 (-0.378 eV) < E_ion (0.000 eV)
 */
export function hydrogenDisplayEnergyPosition(energyEv: number): number {
  const GROUND_EV = -13.5984346
  const FIRST_EXCITED_EV = -3.39960865
  const IONIZATION_EV = 0.0

  // Clamping safety
  if (energyEv <= GROUND_EV) return 6.0
  if (energyEv >= IONIZATION_EV) return 96.0

  // Piece 1: Ground state region [GROUND_EV, FIRST_EXCITED_EV)
  // Maps to [6.0%, 26.0%] (with axis break at ~28%)
  if (energyEv < FIRST_EXCITED_EV) {
    const frac = (energyEv - GROUND_EV) / (FIRST_EXCITED_EV - GROUND_EV)
    return 6.0 + frac * 20.0
  }

  // Piece 2: Upper Rydberg manifold [FIRST_EXCITED_EV, IONIZATION_EV]
  // Maps to [32.0%, 92.0%] ensuring expansive clearance between high-n states
  const rydbergFrac = (energyEv - FIRST_EXCITED_EV) / (IONIZATION_EV - FIRST_EXCITED_EV)
  return 32.0 + rydbergFrac * 60.0
}

/**
 * Transforms a physical Helium excitation energy (eV) into a display percentage [0, 100].
 * Discloses scale expansion for the excited manifold (19.5 - 24.6 eV) above the ground state (0.000 eV).
 *
 * Physical Invariant:
 * 0.000 eV (Ground 1s²) < 19.820 eV (1s2s ³S₁) < ... < 23.087 eV (1s3p ¹P°₁) < 24.587 eV (Ionization)
 */
export function heliumDisplayEnergyPosition(excitationEv: number): number {
  const GROUND_EV = 0.0
  const FIRST_EXCITED_EV = 19.8196
  const IONIZATION_EV = 24.587389

  if (excitationEv <= GROUND_EV) return 6.0
  if (excitationEv >= IONIZATION_EV) return 96.0

  if (excitationEv < FIRST_EXCITED_EV) {
    const frac = excitationEv / FIRST_EXCITED_EV
    return 6.0 + frac * 18.0
  }

  // Excited manifold: maps 19.82 eV -> 24.59 eV over [28.0%, 92.0%]
  const excitedFrac = (excitationEv - FIRST_EXCITED_EV) / (IONIZATION_EV - FIRST_EXCITED_EV)
  return 28.0 + excitedFrac * 64.0
}

/**
 * Validates that an energy scale function is strictly monotonic:
 * for any e1 < e2, displayPosition(e1) < displayPosition(e2).
 */
export function validateMonotonicity(
  scaleFn: (ev: number) => number,
  samples: number[]
): boolean {
  for (let i = 0; i < samples.length - 1; i++) {
    const eCurrent = samples[i]
    const eNext = samples[i + 1]
    if (eCurrent >= eNext) continue
    if (scaleFn(eCurrent) >= scaleFn(eNext)) {
      return false
    }
  }
  return true
}

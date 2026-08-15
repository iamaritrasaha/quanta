import { describe, expect, it } from 'vitest'
import {
  hydrogenDisplayEnergyPosition,
  heliumDisplayEnergyPosition,
  validateMonotonicity,
} from './scaleTransforms'
import { hydrogenEnergy } from './hydrogen'
import { HELIUM_LEVELS } from './helium'
import { HELIUM_IONIZATION_ENERGY_EV } from './constants'

describe('Scientific Scale Transforms & Monotonicity', () => {
  it('strictly preserves physical energy monotonicity for Hydrogen (n = 1 to 6)', () => {
    const energies = [
      hydrogenEnergy(1), // -13.598 eV
      hydrogenEnergy(2), // -3.400 eV
      hydrogenEnergy(3), // -1.511 eV
      hydrogenEnergy(4), // -0.850 eV
      hydrogenEnergy(5), // -0.544 eV
      hydrogenEnergy(6), // -0.378 eV
      0.0,               // Ionization Limit
    ]

    expect(validateMonotonicity(hydrogenDisplayEnergyPosition, energies)).toBe(true)

    // Check individual ordering
    for (let i = 0; i < energies.length - 1; i++) {
      const posA = hydrogenDisplayEnergyPosition(energies[i])
      const posB = hydrogenDisplayEnergyPosition(energies[i + 1])
      expect(posB).toBeGreaterThan(posA)
    }

    // High-n states have ample vertical separation for legibility
    const pos5 = hydrogenDisplayEnergyPosition(hydrogenEnergy(5))
    const pos6 = hydrogenDisplayEnergyPosition(hydrogenEnergy(6))
    expect(pos6 - pos5).toBeGreaterThan(1.5)
  })

  it('strictly preserves physical energy monotonicity for Helium (Ground to Ionization)', () => {
    // Sort curated levels by energy
    const sortedLevels = [...HELIUM_LEVELS].sort((a, b) => a.energyEv - b.energyEv)
    const energies = [0.0, ...sortedLevels.map((l) => l.energyEv), HELIUM_IONIZATION_ENERGY_EV]

    // Ensure strictly non-decreasing samples are tested
    const uniqueSortedEnergies = Array.from(new Set(energies)).sort((a, b) => a - b)
    expect(validateMonotonicity(heliumDisplayEnergyPosition, uniqueSortedEnergies)).toBe(true)

    for (let i = 0; i < uniqueSortedEnergies.length - 1; i++) {
      const posA = heliumDisplayEnergyPosition(uniqueSortedEnergies[i])
      const posB = heliumDisplayEnergyPosition(uniqueSortedEnergies[i + 1])
      expect(posB).toBeGreaterThan(posA)
    }
  })
})

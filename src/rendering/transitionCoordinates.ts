import * as THREE from 'three'

export const ORBIT_INCLINATION_X = Math.PI * 0.42
export const ORBIT_INCLINATION_Z = Math.PI * 0.06

const orbitEuler = new THREE.Euler(ORBIT_INCLINATION_X, 0, ORBIT_INCLINATION_Z, 'XYZ')

/**
 * Calculates the 3D world coordinates of the conceptual Bohr electron given its radius and angle.
 */
export function getBohrElectronWorldPosition(radius: number, angle: number): THREE.Vector3 {
  const local = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
  local.applyEuler(orbitEuler)
  return local
}

/**
 * Returns a stable, camera-visible entry coordinate for incoming absorption photons.
 */
export function getAbsorptionOrigin(): THREE.Vector3 {
  return new THREE.Vector3(-12.5, 5.2, 3.0)
}

/**
 * Returns a stable, camera-visible departure coordinate for outgoing emitted photons.
 */
export function getEmissionDestination(): THREE.Vector3 {
  return new THREE.Vector3(12.8, 4.6, -2.2)
}

/**
 * Returns the electronic field volume traversal coordinate for quantum probability clouds.
 * This represents a passage coordinate across the spatial wavefunction rather than a point collision.
 */
export function getQuantumInteractionPosition(orbital: string | null): THREE.Vector3 {
  if (!orbital) {
    return new THREE.Vector3(0, 2.0, 0)
  }
  const yOffset = orbital === '1s' ? 1.4 : orbital === '2s' ? 2.2 : 2.8
  const local = new THREE.Vector3(0.4, yOffset, 0.6)
  local.applyEuler(orbitEuler)
  return local
}

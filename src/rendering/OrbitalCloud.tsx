import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  sampleOrbitalField,
  getOrbitalZeff,
  type RealOrientationKey,
  type OrbitalFamily,
  ORBITAL_ORIENTATIONS,
} from '../physics/orbitals'
import { useQuantaStore } from '../state/quantaStore'
import { useDisposableGeometry } from './useDisposableGeometry'
import { useReducedMotion } from './useReducedMotion'

export interface OrbitalCloudProps {
  elementNumber: number
  n: number
  family: OrbitalFamily
  orientation: RealOrientationKey
  slicePlane?: 'none' | 'xy' | 'xz' | 'yz'
  viewMode?: 'phase' | 'density'
  scale?: number
}

// Calibrated spectral phase colors:
// Positive phase (+ sign of ψ): Optical Sky Blue (0.22, 0.74, 0.97)
// Negative phase (- sign of ψ): Optical Coral Amber (0.98, 0.57, 0.24)
// Note: Colors denote wavefunction algebraic sign, NOT electrical charge!
const COLOR_POS = new THREE.Color('#38bdf8')
const COLOR_NEG = new THREE.Color('#fb923c')
const COLOR_DENSITY_LOW = new THREE.Color('#1e3a8a')
const COLOR_DENSITY_HIGH = new THREE.Color('#f8fafc')

export function OrbitalCloud({
  elementNumber,
  n,
  family,
  orientation,
  slicePlane = 'none',
  viewMode = 'phase',
  scale = 1.0,
}: OrbitalCloudProps) {
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const reducedMotion = useReducedMotion()

  const sampleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 4500 : 9000

  // State key identifying the current orbital configuration
  const orbitalKey = `${elementNumber}-${n}-${family}-${orientation}-${slicePlane}-${viewMode}`

  const [currentKey, setCurrentKey] = useState(orbitalKey)
  const [prevKey, setPrevKey] = useState<string | null>(null)
  const crossfadeProgress = useRef(1.0)
  const groupRef = useRef<THREE.Group>(null!)

  // Sample current orbital point cloud
  const sample = useMemo(() => {
    const zeff = getOrbitalZeff(elementNumber, n, family)
    return sampleOrbitalField(n, orientation, sampleCount, zeff, 173 + n * 17, slicePlane)
  }, [elementNumber, n, family, orientation, sampleCount, slicePlane])

  // Build vertex buffer geometry with position and vertex colors
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(sample.positions, 3))

    const colors = new Float32Array(sample.pointCount * 3)
    const tempColor = new THREE.Color()

    for (let i = 0; i < sample.pointCount; i++) {
      if (viewMode === 'phase') {
        const isPos = sample.phases[i] >= 0
        const chosen = isPos ? COLOR_POS : COLOR_NEG
        colors[i * 3] = chosen.r
        colors[i * 3 + 1] = chosen.g
        colors[i * 3 + 2] = chosen.b
      } else {
        // Density view: interpolate from dark blue to glowing white-blue
        const d = Math.max(0, Math.min(1, sample.densities[i]))
        tempColor.copy(COLOR_DENSITY_LOW).lerp(COLOR_DENSITY_HIGH, d)
        colors[i * 3] = tempColor.r
        colors[i * 3 + 1] = tempColor.g
        colors[i * 3 + 2] = tempColor.b
      }
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geom
  }, [sample, viewMode])

  useDisposableGeometry(geometry)

  useEffect(() => {
    if (orbitalKey !== currentKey) {
      setPrevKey(currentKey)
      setCurrentKey(orbitalKey)
      crossfadeProgress.current = 0.0
    }
  }, [orbitalKey, currentKey])

  useFrame((_, delta) => {
    if (crossfadeProgress.current < 1.0) {
      crossfadeProgress.current = Math.min(1.0, crossfadeProgress.current + delta * 3.0 * speed)
      if (crossfadeProgress.current >= 1.0) {
        setPrevKey(null)
      }
    }

    if (groupRef.current && playing && !reducedMotion) {
      // Gentle subtle quantum precession to enhance 3D spatial perception
      groupRef.current.rotation.y += delta * 0.08 * speed
    }
  })

  const orientInfo = ORBITAL_ORIENTATIONS[orientation]

  return (
    <group ref={groupRef} scale={scale} name={`orbital-cloud-${orientInfo.label}`}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.068}
          vertexColors={true}
          transparent={true}
          opacity={0.82}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle core marker indicating the atomic nucleus */}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

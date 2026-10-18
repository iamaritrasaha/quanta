import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from './useReducedMotion'
import { useQuantaStore } from '../state/quantaStore'

interface BoronNucleusProps {
  opacity?: number
}

/**
 * ¹¹B Nucleus Model (5 protons + 6 neutrons) — DEFAULT ISOTOPE VISUALIZATION.
 * Not every Boron atom is ¹¹B: normal terrestrial material also contains ¹⁰B; isotope
 * shift/hyperfine splitting are not resolved in V1 (see BoronOverview disclosure).
 * Clustered compact 11-nucleon cluster, extending the SAME restrained warm-white proton /
 * cool-silver neutron optical convention and modest-scale nuclear layout established by
 * Hydrogen/Helium/Lithium/Beryllium — kept visually compact rather than magnified further
 * simply because two more nucleons are present.
 */
export function BoronNucleus({ opacity = 1.0 }: BoronNucleusProps) {
  const reducedMotion = useReducedMotion()
  const motionTime = useRef(0)
  const groupRef = useRef<THREE.Group>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const innerShellRef = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

  // Positions of 11 nucleons in a tight stable cluster
  const nucleonPositions: { pos: [number, number, number]; isProton: boolean }[] = [
    // 5 Protons
    { pos: [0.1, 0.1, 0.06], isProton: true },
    { pos: [-0.1, -0.08, 0.08], isProton: true },
    { pos: [0.04, -0.1, -0.09], isProton: true },
    { pos: [0.11, -0.02, 0.1], isProton: true },
    { pos: [-0.05, 0.11, 0.04], isProton: true },
    // 6 Neutrons
    { pos: [-0.09, 0.1, -0.07], isProton: false },
    { pos: [0.1, -0.08, 0.09], isProton: false },
    { pos: [-0.04, 0.02, 0.12], isProton: false },
    { pos: [0.07, 0.1, -0.1], isProton: false },
    { pos: [-0.11, -0.03, -0.09], isProton: false },
    { pos: [0.0, -0.11, 0.05], isProton: false },
  ]

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const { playing, animationSpeed } = useQuantaStore.getState()
    if (playing && !reducedMotion) motionTime.current += delta * animationSpeed

    const idleShimmer = reducedMotion ? 0 : Math.sin(motionTime.current * 1.5) * 0.025
    const s = 1.0 + idleShimmer
    groupRef.current.scale.set(s, s, s)

    if (!reducedMotion) {
      groupRef.current.rotation.y = motionTime.current * 0.1
      groupRef.current.rotation.x = Math.sin(motionTime.current * 0.07) * 0.12
    }

    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (0.16 + idleShimmer * 0.35) * opacity
    }

    if (innerShellRef.current) {
      const mat = innerShellRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (0.28 + idleShimmer * 0.45) * opacity
    }

    if (lightRef.current) {
      lightRef.current.intensity = (4.6 + idleShimmer * 2.0) * opacity
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 11 Clustered Nucleons (5 Protons + 6 Neutrons) */}
      {nucleonPositions.map(({ pos, isProton }, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.105, 24, 24]} />
          {isProton ? (
            <meshStandardMaterial
              color="#fffaf5"
              emissive="#ffd9b0"
              emissiveIntensity={1.45}
              roughness={0.25}
              metalness={0.15}
              transparent
              opacity={0.98 * opacity}
            />
          ) : (
            <meshStandardMaterial
              color="#e2e8f0"
              emissive="#94a3b8"
              emissiveIntensity={0.6}
              roughness={0.35}
              metalness={0.4}
              transparent
              opacity={0.95 * opacity}
            />
          )}
        </mesh>
      ))}

      {/* Shared Translucent Inner Emission Shell */}
      <mesh ref={innerShellRef}>
        <sphereGeometry args={[0.46, 24, 24]} />
        <meshBasicMaterial
          color="#ffd9b0"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Shared Soft Outer Nuclear Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.66, 24, 24]} />
        <meshBasicMaterial
          color="#fff7ed"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Internal Subdued Nuclear Light */}
      <pointLight ref={lightRef} color="#fff4eb" intensity={4.6} distance={8.5} />
    </group>
  )
}

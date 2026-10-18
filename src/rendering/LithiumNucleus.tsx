import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from './useReducedMotion'
import { useQuantaStore } from '../state/quantaStore'

interface LithiumNucleusProps {
  opacity?: number
}

/**
 * ⁷Li Nucleus Model (3 protons + 4 neutrons).
 * Clustered compact 7-nucleon cluster with restrained warm-white protons
 * and neutral/cool silver neutrons, bounded by a shared nuclear halo.
 * Pedagogical visualization: true nuclear scale is magnified for atomic visibility.
 */
export function LithiumNucleus({ opacity = 1.0 }: LithiumNucleusProps) {
  const reducedMotion = useReducedMotion()
  const motionTime = useRef(0)
  const groupRef = useRef<THREE.Group>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const innerShellRef = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

  // Positions of 7 nucleons in a tight stable cluster (radius of each ~0.11, center offsets ~0.085-0.12)
  const nucleonPositions: { pos: [number, number, number]; isProton: boolean }[] = [
    // 3 Protons
    { pos: [0.085, 0.085, 0.085], isProton: true },
    { pos: [-0.095, -0.075, 0.08], isProton: true },
    { pos: [0.03, -0.09, -0.095], isProton: true },
    // 4 Neutrons
    { pos: [-0.085, 0.095, -0.075], isProton: false },
    { pos: [0.095, -0.08, 0.075], isProton: false },
    { pos: [-0.04, 0.02, 0.11], isProton: false },
    { pos: [0.075, 0.095, -0.085], isProton: false },
  ]

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const { playing, animationSpeed } = useQuantaStore.getState()
    if (playing && !reducedMotion) motionTime.current += delta * animationSpeed

    // Subtle gentle idle shimmer of the collective nuclear core
    const idleShimmer = reducedMotion ? 0 : Math.sin(motionTime.current * 1.5) * 0.025
    const s = 1.0 + idleShimmer
    groupRef.current.scale.set(s, s, s)

    // Gentle slow collective nuclear orientation drift
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
      lightRef.current.intensity = (4.2 + idleShimmer * 2.0) * opacity
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 7 Clustered Nucleons (3 Protons + 4 Neutrons) */}
      {nucleonPositions.map(({ pos, isProton }, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.115, 24, 24]} />
          {isProton ? (
            /* Proton: Warm-white optical accent */
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
            /* Neutron: Cool silver accent */
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
        <sphereGeometry args={[0.42, 24, 24]} />
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
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshBasicMaterial
          color="#fff7ed"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Internal Subdued Nuclear Light */}
      <pointLight ref={lightRef} color="#fff4eb" intensity={4.2} distance={8.5} />
    </group>
  )
}

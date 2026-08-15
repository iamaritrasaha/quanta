import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface HeliumNucleusProps {
  opacity?: number
}

/**
 * ⁴He Nucleus Model (2 protons + 2 neutrons).
 * Clustered compact tetrahedral representation with restrained warm-white protons
 * and neutral/cool silver neutrons, bounded by a subtle shared nuclear halo.
 * Pedagogical visualization: true nuclear scale is magnified for atomic visibility.
 */
export function HeliumNucleus({ opacity = 1.0 }: HeliumNucleusProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const innerShellRef = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

  // Positions of the 4 nucleons in a tight cluster (radius of each nucleon ~0.12, center distance ~0.10)
  const d = 0.095
  const nucleonPositions: { pos: [number, number, number]; isProton: boolean }[] = [
    { pos: [d, d, d], isProton: true }, // Proton A
    { pos: [-d, -d, d], isProton: true }, // Proton B
    { pos: [-d, d, -d], isProton: false }, // Neutron A
    { pos: [d, -d, -d], isProton: false }, // Neutron B
  ]

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    // Subtle gentle idle shimmer of the collective nuclear core
    const idleShimmer = Math.sin(clock.elapsedTime * 1.6) * 0.03
    const s = 1.0 + idleShimmer
    groupRef.current.scale.set(s, s, s)

    // Gentle slow collective nuclear orientation drift
    groupRef.current.rotation.y = clock.elapsedTime * 0.12
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.15

    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (0.16 + idleShimmer * 0.4) * opacity
    }

    if (innerShellRef.current) {
      const mat = innerShellRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (0.28 + idleShimmer * 0.5) * opacity
    }

    if (lightRef.current) {
      lightRef.current.intensity = (4.0 + idleShimmer * 2.0) * opacity
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 4 Clustered Nucleons (2 Protons + 2 Neutrons) */}
      {nucleonPositions.map(({ pos, isProton }, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.13, 24, 24]} />
          {isProton ? (
            /* Proton: Warm-white accent */
            <meshStandardMaterial
              color="#fffaf5"
              emissive="#ffd9b0"
              emissiveIntensity={1.5}
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

      {/* Shared Translucent Inner Emission Shell (radius 0.38) */}
      <mesh ref={innerShellRef}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshBasicMaterial
          color="#ffd9b0"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Shared Soft Outer Nuclear Halo (radius 0.56) */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.56, 24, 24]} />
        <meshBasicMaterial
          color="#fff7ed"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Internal Subdued Nuclear Light */}
      <pointLight ref={lightRef} color="#fff4eb" intensity={4.0} distance={8.0} />
    </group>
  )
}

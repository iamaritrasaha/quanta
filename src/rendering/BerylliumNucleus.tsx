import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface BerylliumNucleusProps {
  opacity?: number
}

/**
 * ⁹Be Nucleus Model (4 protons + 5 neutrons).
 * Clustered compact 9-nucleon cluster, following the same restrained warm-white proton /
 * cool-silver neutron optical convention used by the Hydrogen, Helium, and Lithium nuclei.
 * PEDAGOGICAL NUCLEAR REPRESENTATION: nucleon locations are illustrative, not a literal
 * nuclear geometry claim. Nuclear/atomic scale is magnified for visibility.
 */
export function BerylliumNucleus({ opacity = 1.0 }: BerylliumNucleusProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const innerShellRef = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

  // Positions of 9 nucleons in a tight stable cluster
  const nucleonPositions: { pos: [number, number, number]; isProton: boolean }[] = [
    // 4 Protons
    { pos: [0.09, 0.09, 0.07], isProton: true },
    { pos: [-0.095, -0.08, 0.075], isProton: true },
    { pos: [0.03, -0.095, -0.09], isProton: true },
    { pos: [0.1, -0.02, 0.09], isProton: true },
    // 5 Neutrons
    { pos: [-0.09, 0.095, -0.07], isProton: false },
    { pos: [0.095, -0.075, 0.08], isProton: false },
    { pos: [-0.04, 0.02, 0.115], isProton: false },
    { pos: [0.07, 0.095, -0.09], isProton: false },
    { pos: [-0.1, -0.03, -0.09], isProton: false },
  ]

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const idleShimmer = Math.sin(clock.elapsedTime * 1.5) * 0.025
    const s = 1.0 + idleShimmer
    groupRef.current.scale.set(s, s, s)

    groupRef.current.rotation.y = clock.elapsedTime * 0.1
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.07) * 0.12

    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (0.16 + idleShimmer * 0.35) * opacity
    }

    if (innerShellRef.current) {
      const mat = innerShellRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (0.28 + idleShimmer * 0.45) * opacity
    }

    if (lightRef.current) {
      lightRef.current.intensity = (4.4 + idleShimmer * 2.0) * opacity
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 9 Clustered Nucleons (4 Protons + 5 Neutrons) */}
      {nucleonPositions.map(({ pos, isProton }, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.11, 24, 24]} />
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
        <sphereGeometry args={[0.44, 24, 24]} />
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
        <sphereGeometry args={[0.64, 24, 24]} />
        <meshBasicMaterial
          color="#fff7ed"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Internal Subdued Nuclear Light */}
      <pointLight ref={lightRef} color="#fff4eb" intensity={4.4} distance={8.5} />
    </group>
  )
}

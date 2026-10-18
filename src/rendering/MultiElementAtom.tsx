import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { getAtomicProperties, getElementColor, getShellOccupancy } from '../data/atomicData'
import type { Element } from '../data/elements'
import { useQuantaStore } from '../state/quantaStore'
import { useReducedMotion } from './useReducedMotion'

function getShellRadius(shell: number): number {
  return 1.15 + (shell - 1) * 0.7
}

export function MultiElementAtom({ element }: { element: Element }) {
  const playing = useQuantaStore((state) => state.playing)
  const speed = useQuantaStore((state) => state.animationSpeed)
  const reducedMotion = useReducedMotion()
  const viewport = useThree((state) => state.viewport)
  const groupRef = useRef<THREE.Group>(null!)
  const properties = getAtomicProperties(element.symbol)
  const color = properties ? getElementColor(properties) : '#60a5fa'
  const shells = useMemo(
    () => getShellOccupancy(properties?.electronConfiguration ?? ''),
    [properties?.electronConfiguration]
  )
  const placements = useMemo(() => {
    const result: THREE.Vector3[] = []
    shells.forEach(({ shell, electrons }) => {
      const radius = getShellRadius(shell)
      const tilt = (shell % 3) * 0.38
      for (let index = 0; index < electrons; index++) {
        const angle = (index / electrons) * Math.PI * 2 + shell * 0.73
        result.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * Math.cos(tilt),
            Math.sin(angle) * radius * Math.sin(tilt)
          )
        )
      }
    })
    return result
  }, [shells])
  const electronGeometry = useMemo(() => new THREE.SphereGeometry(0.075, 8, 8), [])
  const electronMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.45, roughness: 0.35 }),
    [color]
  )
  const electronInstances = useRef<THREE.InstancedMesh>(null!)
  const radius = getShellRadius(shells[shells.length - 1]?.shell ?? 1) + 0.15
  const modelScale = Math.min(1, viewport.width * 0.82 / (radius * 2), viewport.height * 0.76 / (radius * 2))

  useEffect(() => {
    if (!electronInstances.current) return
    const dummy = new THREE.Object3D()
    placements.forEach((position, index) => {
      dummy.position.copy(position)
      dummy.updateMatrix()
      electronInstances.current.setMatrixAt(index, dummy.matrix)
    })
    electronInstances.current.instanceMatrix.needsUpdate = true
  }, [placements])

  useEffect(() => () => electronGeometry.dispose(), [electronGeometry])
  useEffect(() => () => electronMaterial.dispose(), [electronMaterial])

  useFrame((_, delta) => {
    if (playing && !reducedMotion && groupRef.current) groupRef.current.rotation.y += delta * 0.16 * speed
  })

  return (
    <group ref={groupRef} scale={modelScale}>
      {shells.map(({ shell, electrons }) => {
        const radius = getShellRadius(shell)
        return (
          <mesh key={shell} rotation={[(shell % 3) * 0.38, 0, 0]}>
            <torusGeometry args={[radius, 0.012, 6, 96]} />
            <meshBasicMaterial color={color} transparent opacity={0.16 + (electrons / element.number) * 0.24} />
          </mesh>
        )
      })}
      <mesh>
        <sphereGeometry args={[0.48 + Math.min(element.number, 118) * 0.0015, 28, 24]} />
        <meshStandardMaterial color="#e8edf5" emissive={color} emissiveIntensity={0.23} roughness={0.32} />
      </mesh>
      {placements.length > 0 && (
        <instancedMesh
          ref={electronInstances}
          args={[electronGeometry, electronMaterial, placements.length]}
          frustumCulled={false}
        />
      )}
    </group>
  )
}

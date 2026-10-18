import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { Element } from '../data/elements'
import { electronPaths, groundModel, jumpProgress, shellRadius, type ModelShell } from '../physics/elementModel'
import { useQuantaStore } from '../state/quantaStore'
import { useReducedMotion } from './useReducedMotion'
import { PhotonWavePacket } from './PhotonWavePacket'

// Deterministic schematic radial density. These points are not a many-electron wavefunction.
function cloudPositions(shells: ModelShell[], seed: number): Float32Array {
  let state = seed
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return (state + 1) / 4294967297 }
  const total = shells.reduce((n, s) => n + s.electrons, 0)
  const positions = new Float32Array(6000 * 3)
  for (let i = 0; i < 6000; i++) {
    let pick = random() * total
    const shell = shells.find((s) => { pick -= s.electrons; return pick <= 0 }) ?? shells[shells.length - 1]
    const radius = Math.max(0.1, shellRadius(shell.shell) + Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random()) * 0.18)
    const z = 2 * random() - 1, phi = 2 * Math.PI * random(), xy = Math.sqrt(1 - z * z)
    positions.set([radius * xy * Math.cos(phi), radius * xy * Math.sin(phi), radius * z], i * 3)
  }
  return positions
}

export function MultiElementAtom({ element }: { element: Element }) {
  const model = useQuantaStore((s) => s.sharedElement)
  const mode = useQuantaStore((s) => s.mode)
  const reducedMotion = useReducedMotion()
  const size = useThree((s) => s.size)
  const instances = useRef<THREE.InstancedMesh>(null!)
  const activeElectron = useRef<THREE.Mesh>(null!)
  const sourceCloud = useRef<THREE.Points>(null!)
  const targetCloud = useRef<THREE.Points>(null!)
  const clock = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const photonPosition = useMemo(() => new THREE.Vector3(), [])
  const ground = useMemo(() => groundModel(element.symbol), [element.symbol])
  const selected = model.selected ?? ground
  const jump = model.activeTransition
  const source = jump?.initial ?? selected
  const target = jump?.target ?? selected
  const paths = useMemo(() => electronPaths(source.shells, target.shells), [source, target])
  const fromCloud = useMemo(() => cloudPositions(source.shells, element.number), [source, element.number])
  const toCloud = useMemo(() => cloudPositions(target.shells, element.number), [target, element.number])
  // Keep size independent of the live camera distance so wheel/pinch zoom actually changes apparent size.
  const maxShell = ground.shells[ground.shells.length - 1].shell + 2
  const baseHeight = 2 * Math.tan(42 * Math.PI / 360) * Math.hypot(13.5, 2.2)
  const diameter = 2 * (shellRadius(maxShell) + 0.3)
  const modelScale = Math.min(1, baseHeight * size.width / size.height * 0.88 / diameter, baseHeight * 0.72 / diameter)
  const quantum = mode === 'quantum'
  // White electron markers stay visible even for elements with a dark CPK color (e.g. carbon).
  const color = '#93c5fd'
  const rings = [...new Set([...source.shells, ...target.shells].map((s) => s.shell))]

  useFrame((_, delta) => {
    const state = useQuantaStore.getState()
    if (state.playing && !reducedMotion) clock.current += delta * state.animationSpeed
    if (state.sharedElement.activeTransition) state.advanceElementTransition(Math.min(delta, 0.1))
    const active = useQuantaStore.getState().sharedElement.activeTransition
    const mix = jumpProgress(active?.progress ?? (jump ? 1 : 0), jump?.type ?? 'absorption')
    let activeIndex = paths.findIndex((p) => p.from !== p.to)
    if (activeIndex < 0) activeIndex = paths.length - 1
    paths.forEach((path, i) => {
      const n = THREE.MathUtils.lerp(path.from, path.to, mix)
      const angle = i * 2.399963 + clock.current * (0.48 / Math.sqrt(n))
      const tilt = THREE.MathUtils.lerp((path.from % 3) * 0.38, (path.to % 3) * 0.38, mix)
      const radius = shellRadius(n)
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * Math.cos(tilt), Math.sin(angle) * radius * Math.sin(tilt))
      dummy.updateMatrix()
      instances.current?.setMatrixAt(i, dummy.matrix)
      if (i === activeIndex) {
        activeElectron.current?.position.copy(dummy.position)
        photonPosition.copy(dummy.position).multiplyScalar(modelScale)
      }
    })
    if (instances.current) instances.current.instanceMatrix.needsUpdate = true
    if (activeElectron.current) {
      activeElectron.current.visible = Boolean(jump) && !quantum
      activeElectron.current.scale.setScalar(1 + Math.sin((active?.progress ?? 0) * Math.PI) * 0.6)
    }
    if (sourceCloud.current) (sourceCloud.current.material as THREE.PointsMaterial).opacity = 0.48 * (1 - mix)
    if (targetCloud.current) (targetCloud.current.material as THREE.PointsMaterial).opacity = 0.48 * mix
  })

  return (
    <>
      <group name="element-atom" scale={modelScale}>
        <group visible={!quantum}>
          {rings.map((n) => <mesh key={n} rotation={[(n % 3) * 0.38, 0, 0]}>
            <torusGeometry args={[shellRadius(n), 0.014, 6, 128]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>)}
          <instancedMesh name="electron-markers" ref={instances} args={[undefined, undefined, element.number]} frustumCulled={false}>
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshStandardMaterial color="#e0f2fe" emissive={color} emissiveIntensity={1.2} />
          </instancedMesh>
          <mesh ref={activeElectron} visible={false}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
        <group visible={quantum}>
          <points name="shell-density" ref={sourceCloud} frustumCulled={false}>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[fromCloud, 3]} /></bufferGeometry>
            <pointsMaterial color={color} size={0.045} transparent opacity={0.48} depthWrite={false} blending={THREE.AdditiveBlending} />
          </points>
          <points ref={targetCloud} frustumCulled={false}>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[toCloud, 3]} /></bufferGeometry>
            <pointsMaterial color={color} size={0.045} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
          </points>
        </group>
        <mesh>
          <sphereGeometry args={[0.32 + Math.min(element.number, 118) * 0.001, 28, 24]} />
          <meshStandardMaterial color="#e8edf5" emissive="#60a5fa" emissiveIntensity={0.3} roughness={0.32} />
        </mesh>
      </group>
      <PhotonWavePacket visible={Boolean(jump)} progress={jump?.progress ?? 0} direction={jump?.type ?? 'absorption'} color="#fbbf24" electronPosition={photonPosition} />
    </>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useQuantaStore } from '../state/quantaStore'
import { advanceTransitionProgress } from '../physics/transitionTiming'
import { BerylliumNucleus } from './BerylliumNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { ORBIT_INCLINATION_X, ORBIT_INCLINATION_Z, getBohrElectronWorldPosition } from './transitionCoordinates'
import { useReducedMotion } from './useReducedMotion'

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/** Shell radii for Beryllium pedagogical shell model. */
function getBerylliumShellRadius(n: number): number {
  if (n === 1) return 1.65 // n=1 K-shell (1s² core)
  if (n === 2) return 3.85 // n=2 L-shell (2s/2p valence)
  if (n === 3) return 5.65 // n=3 M-shell (3s/3p/3d valence)
  return 6.5
}

/**
 * PEDAGOGICAL occupancy mapping. Beryllium's TWO valence electrons are tracked
 * independently: valenceNs[0] is the "anchor" valence electron (stays 2s-like across
 * every curated level), valenceNs[1] is the electron actually excited in curated transitions.
 * Shell radius is indexed only by principal n (not l) — the same limitation already
 * accepted for Hydrogen/Helium/Lithium shell rendering. Subshell (l) occupancy is
 * communicated textually in BerylliumShellControls, not by 3D geometry.
 */
function getBerylliumOccupancy(levelId: string): { coreN: number; valenceNs: [number, number] } {
  const configPart = levelId.split('_')[0]
  if (configPart.startsWith('2s3')) return { coreN: 1, valenceNs: [2, 3] }
  return { coreN: 1, valenceNs: [2, 2] }
}

export function BerylliumShell() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const berylliumState = useQuantaStore((s) => s.beryllium)
  const updateTransitionProgress = useQuantaStore((s) => s.updateBerylliumTransitionProgress)
  const completeTransition = useQuantaStore((s) => s.completeBerylliumTransition)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)
  const reducedMotion = useReducedMotion()

  const activeTransition = berylliumState.activeTransition
  const occupancy = useMemo(() => getBerylliumOccupancy(berylliumState.selectedLevelId), [berylliumState.selectedLevelId])

  const core1Angle = useRef(0)
  const core2Angle = useRef(Math.PI)
  const valenceAAngle = useRef(Math.PI * 0.4)
  const valenceBAngle = useRef(Math.PI * 1.1)

  const valenceBPosRef = useRef(new THREE.Vector3(0, 0, 0))

  const coreRadius = getBerylliumShellRadius(1)
  const currentValenceARadius = useRef(getBerylliumShellRadius(occupancy.valenceNs[0]))
  const currentValenceBRadius = useRef(getBerylliumShellRadius(occupancy.valenceNs[1]))

  const groupRef = useRef<THREE.Group>(null!)
  const c1GroupRef = useRef<THREE.Group>(null!)
  const c2GroupRef = useRef<THREE.Group>(null!)
  const vaGroupRef = useRef<THREE.Group>(null!)
  const vbGroupRef = useRef<THREE.Group>(null!)

  const vbCoreRef = useRef<THREE.Mesh>(null!)
  const vbHaloRef = useRef<THREE.Mesh>(null!)

  const shellGuideRefs = useRef<(THREE.LineLoop | null)[]>([])

  const shellGeometries = useMemo(() => {
    const segments = 128
    return [1, 2, 3].map((n) => {
      const radius = getBerylliumShellRadius(n)
      const points = new Float32Array(segments * 3)
      for (let j = 0; j < segments; j++) {
        const theta = (j / segments) * Math.PI * 2
        points[j * 3] = Math.cos(theta) * radius
        points[j * 3 + 1] = Math.sin(theta) * radius
        points[j * 3 + 2] = 0
      }
      const geom = new THREE.BufferGeometry()
      geom.setAttribute('position', new THREE.BufferAttribute(points, 3))
      return { n, radius, geom }
    })
  }, [])

  useEffect(() => {
    return () => {
      shellGeometries.forEach(({ geom }) => geom.dispose())
    }
  }, [shellGeometries])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const targetBlend = isQuantum ? 1.0 : 0.0
    modelBlendRef.current = THREE.MathUtils.damp(modelBlendRef.current, targetBlend, 4.0 * speed, delta)
    const shellOpacity = Math.max(0, Math.min(1, 1.0 - modelBlendRef.current))

    let progress = 0
    let targetValenceBN = occupancy.valenceNs[1]
    let electronInteractionFlash = 0

    if (activeTransition) {
      progress = advanceTransitionProgress(activeTransition, delta, speed, playing)

      const initialOcc = getBerylliumOccupancy(activeTransition.initialLevelId)
      const finalOcc = getBerylliumOccupancy(activeTransition.targetLevelId)

      if (activeTransition.type === 'absorption') {
        if (progress < 0.46) {
          updateTransitionProgress(progress, 'photonIncoming')
          targetValenceBN = initialOcc.valenceNs[1]
        } else if (progress < 0.56) {
          updateTransitionProgress(progress, 'interaction')
          electronInteractionFlash = Math.sin(((progress - 0.46) / 0.1) * Math.PI)
          targetValenceBN = initialOcc.valenceNs[1]
        } else if (progress < 0.94) {
          const jumpP = easeInOutCubic((progress - 0.54) / 0.4)
          currentValenceBRadius.current = THREE.MathUtils.lerp(
            getBerylliumShellRadius(initialOcc.valenceNs[1]),
            getBerylliumShellRadius(finalOcc.valenceNs[1]),
            jumpP
          )
          updateTransitionProgress(progress, 'electronTransition')
        } else {
          updateTransitionProgress(progress, 'settle')
          targetValenceBN = finalOcc.valenceNs[1]
        }
      } else {
        if (progress < 0.46) {
          const dropP = easeInOutCubic(progress / 0.46)
          currentValenceBRadius.current = THREE.MathUtils.lerp(
            getBerylliumShellRadius(initialOcc.valenceNs[1]),
            getBerylliumShellRadius(finalOcc.valenceNs[1]),
            dropP
          )
          updateTransitionProgress(progress, 'electronTransition')
        } else if (progress < 0.56) {
          electronInteractionFlash = Math.sin(((progress - 0.46) / 0.1) * Math.PI)
          updateTransitionProgress(progress, 'interaction')
          targetValenceBN = finalOcc.valenceNs[1]
        } else if (progress < 0.95) {
          updateTransitionProgress(progress, 'photonOutgoing')
          targetValenceBN = finalOcc.valenceNs[1]
        } else {
          updateTransitionProgress(progress, 'settle')
          targetValenceBN = finalOcc.valenceNs[1]
        }
      }

      if (progress >= 1.0) {
        completeTransition()
      }
    } else {
      currentValenceBRadius.current = THREE.MathUtils.damp(
        currentValenceBRadius.current,
        getBerylliumShellRadius(targetValenceBN),
        12, delta
      )
    }

    currentValenceARadius.current = THREE.MathUtils.damp(
      currentValenceARadius.current,
      getBerylliumShellRadius(occupancy.valenceNs[0]),
      12, delta
    )

    if (playing && !reducedMotion) {
      const coreSpeed = 2.4 * speed * Math.max(0.1, shellOpacity)
      const valASpeed = (1.8 / Math.pow(occupancy.valenceNs[0], 0.75)) * speed * Math.max(0.1, shellOpacity)
      const valBSpeed = (1.8 / Math.pow(targetValenceBN, 0.75)) * speed * Math.max(0.1, shellOpacity)
      core1Angle.current += delta * coreSpeed
      core2Angle.current += delta * coreSpeed
      valenceAAngle.current += delta * valASpeed
      valenceBAngle.current += delta * valBSpeed
    }

    const rCore = coreRadius
    const rValA = currentValenceARadius.current
    const rValB = currentValenceBRadius.current

    if (c1GroupRef.current) {
      c1GroupRef.current.position.set(Math.cos(core1Angle.current) * rCore, Math.sin(core1Angle.current) * rCore, 0)
      c1GroupRef.current.visible = shellOpacity > 0.01
    }
    if (c2GroupRef.current) {
      c2GroupRef.current.position.set(Math.cos(core2Angle.current) * rCore, Math.sin(core2Angle.current) * rCore, 0)
      c2GroupRef.current.visible = shellOpacity > 0.01
    }
    if (vaGroupRef.current) {
      vaGroupRef.current.position.set(
        Math.cos(valenceAAngle.current) * rValA,
        Math.sin(valenceAAngle.current) * rValA,
        0
      )
      vaGroupRef.current.visible = shellOpacity > 0.01
    }
    if (vbGroupRef.current) {
      const xv = Math.cos(valenceBAngle.current) * rValB
      const yv = Math.sin(valenceBAngle.current) * rValB
      vbGroupRef.current.position.set(xv, yv, 0)
      valenceBPosRef.current.copy(getBohrElectronWorldPosition(rValB, valenceBAngle.current))

      if (vbCoreRef.current) {
        const mat = vbCoreRef.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = (2.2 + electronInteractionFlash * 3.5) * shellOpacity
        mat.opacity = 0.98 * shellOpacity
      }
      if (vbHaloRef.current) {
        const mat = vbHaloRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = (0.45 + electronInteractionFlash * 0.45) * shellOpacity
      }
      vbGroupRef.current.visible = shellOpacity > 0.01
    }

    shellGeometries.forEach(({ n }, idx) => {
      const line = shellGuideRefs.current[idx]
      if (line) {
        const isCore = n === 1
        const isValence = n === occupancy.valenceNs[0] || n === targetValenceBN
        const mat = line.material as THREE.LineBasicMaterial
        mat.opacity = (isCore ? 0.65 : isValence ? 0.75 : 0.18) * shellOpacity
        line.visible = shellOpacity > 0.01
      }
    })
  })

  const photonColor = activeTransition?.physics.displayColor ?? '#a855f7'
  const isAbsorption = activeTransition?.type === 'absorption'

  return (
    <group ref={groupRef}>
      {/* ⁹Be Nucleus */}
      <BerylliumNucleus />

      <group rotation={[ORBIT_INCLINATION_X, 0, ORBIT_INCLINATION_Z]}>
        {shellGeometries.map(({ n, geom }, idx) => (
          <lineLoop
            key={n}
            ref={(el: THREE.LineLoop | null) => {
              shellGuideRefs.current[idx] = el
            }}
          >
            <primitive object={geom} attach="geometry" />
            <lineBasicMaterial
              color={n === 1 ? '#93c5fd' : n === 2 ? '#c4b5fd' : '#475569'}
              transparent
              opacity={0.5}
            />
          </lineLoop>
        ))}

        {/* Core Electron 1 (K Shell) */}
        <group ref={c1GroupRef}>
          <mesh>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#f0f9ff" emissiveIntensity={2.0} roughness={0.1} metalness={0.1} transparent opacity={0.98} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshBasicMaterial color="#93c5fd" transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color="#93c5fd" intensity={1.8} distance={2.5} />
        </group>

        {/* Core Electron 2 (K Shell) */}
        <group ref={c2GroupRef}>
          <mesh>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#f0f9ff" emissiveIntensity={2.0} roughness={0.1} metalness={0.1} transparent opacity={0.98} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshBasicMaterial color="#93c5fd" transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color="#93c5fd" intensity={1.8} distance={2.5} />
        </group>

        {/* Valence Electron A (anchor 2s-like electron) */}
        <group ref={vaGroupRef}>
          <mesh>
            <sphereGeometry args={[0.078, 24, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#faf5ff" emissiveIntensity={2.0} roughness={0.1} metalness={0.1} transparent opacity={0.96} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.19, 20, 20]} />
            <meshBasicMaterial color="#c4b5fd" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color="#a78bfa" intensity={2.0} distance={3.0} />
        </group>

        {/* Valence Electron B (excited/transitioning electron) */}
        <group ref={vbGroupRef}>
          <mesh ref={vbCoreRef}>
            <sphereGeometry args={[0.082, 24, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#f3e8ff" emissiveIntensity={2.2} roughness={0.1} metalness={0.1} transparent opacity={0.98} />
          </mesh>
          <mesh ref={vbHaloRef}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color="#a855f7" intensity={2.4} distance={3.2} />
        </group>
      </group>

      {/* Photon Wave Packet targeting the transitioning valence electron */}
      {activeTransition && (
        <PhotonWavePacket
          visible={true}
          progress={activeTransition.progress}
          direction={isAbsorption ? 'absorption' : 'emission'}
          color={photonColor}
          electronPosition={valenceBPosRef.current}
        />
      )}
    </group>
  )
}

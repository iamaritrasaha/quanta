import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useQuantaStore } from '../state/quantaStore'
import { advanceTransitionProgress } from '../physics/transitionTiming'
import { BoronNucleus } from './BoronNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { ORBIT_INCLINATION_X, ORBIT_INCLINATION_Z, getBohrElectronWorldPosition } from './transitionCoordinates'
import { useReducedMotion } from './useReducedMotion'

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/** Shell radii for Boron pedagogical shell model. */
function getBoronShellRadius(n: number): number {
  if (n === 1) return 1.65 // n=1 K-shell (1s² core)
  if (n === 2) return 3.85 // n=2 L-shell (2s²/2p valence)
  if (n === 3) return 5.65 // n=3 M-shell (3s/3p/3d valence)
  if (n === 4) return 7.25 // n=4 N-shell (4s/4p/4f valence)
  return 8.0
}

/**
 * PEDAGOGICAL occupancy mapping. Boron's THREE n=2-and-above electrons are tracked as: a
 * 2s "anchor" PAIR (va1, va2 — always rendered at n=2, matching the filled 2s² subshell) plus
 * ONE electron that actually moves in curated transitions (vb — the open-subshell 2p electron
 * in the ground state, promoted to 3s/3p/3d/4s/4p/4f in excited configurations). vb is rendered
 * VISUALLY DISTINCT from the 2s pair (different color/halo), not a third identical dot, so the
 * open p subshell reads as qualitatively different from Beryllium's closed 2s² valence pair.
 * Shell radius is indexed only by principal n (not l) — the same limitation already accepted
 * for Hydrogen/Helium/Lithium/Beryllium shell rendering. Subshell (l) occupancy is communicated
 * textually in BoronShellControls, not by 3D geometry.
 */
function getBoronOccupancy(levelId: string): { coreN: number; anchorN: number; transitionN: number } {
  if (levelId.startsWith('3')) return { coreN: 1, anchorN: 2, transitionN: 3 }
  if (levelId.startsWith('4')) return { coreN: 1, anchorN: 2, transitionN: 4 }
  return { coreN: 1, anchorN: 2, transitionN: 2 }
}

export function BoronShell() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const boronState = useQuantaStore((s) => s.boron)
  const updateTransitionProgress = useQuantaStore((s) => s.updateBoronTransitionProgress)
  const completeTransition = useQuantaStore((s) => s.completeBoronTransition)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)
  const reducedMotion = useReducedMotion()

  const activeTransition = boronState.activeTransition
  const occupancy = useMemo(() => getBoronOccupancy(boronState.selectedLevelId), [boronState.selectedLevelId])

  const core1Angle = useRef(0)
  const core2Angle = useRef(Math.PI)
  const va1Angle = useRef(Math.PI * 0.35)
  const va2Angle = useRef(Math.PI * 1.35)
  const vbAngle = useRef(Math.PI * 0.9)

  const vbPosRef = useRef(new THREE.Vector3(0, 0, 0))

  const coreRadius = getBoronShellRadius(1)
  const anchorRadius = getBoronShellRadius(2)
  const currentTransitionRadius = useRef(getBoronShellRadius(occupancy.transitionN))

  const groupRef = useRef<THREE.Group>(null!)
  const c1GroupRef = useRef<THREE.Group>(null!)
  const c2GroupRef = useRef<THREE.Group>(null!)
  const va1GroupRef = useRef<THREE.Group>(null!)
  const va2GroupRef = useRef<THREE.Group>(null!)
  const vbGroupRef = useRef<THREE.Group>(null!)

  const vbCoreRef = useRef<THREE.Mesh>(null!)
  const vbHaloRef = useRef<THREE.Mesh>(null!)

  const shellGuideRefs = useRef<(THREE.LineLoop | null)[]>([])

  const shellGeometries = useMemo(() => {
    const segments = 128
    return [1, 2, 3, 4].map((n) => {
      const radius = getBoronShellRadius(n)
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
    let targetTransitionN = occupancy.transitionN
    let electronInteractionFlash = 0

    if (activeTransition) {
      progress = advanceTransitionProgress(activeTransition, delta, speed, playing)

      const initialOcc = getBoronOccupancy(activeTransition.initialLevelId)
      const finalOcc = getBoronOccupancy(activeTransition.targetLevelId)

      if (activeTransition.type === 'absorption') {
        if (progress < 0.46) {
          updateTransitionProgress(progress, 'photonIncoming')
          targetTransitionN = initialOcc.transitionN
        } else if (progress < 0.56) {
          updateTransitionProgress(progress, 'interaction')
          electronInteractionFlash = Math.sin(((progress - 0.46) / 0.1) * Math.PI)
          targetTransitionN = initialOcc.transitionN
        } else if (progress < 0.94) {
          const jumpP = easeInOutCubic((progress - 0.54) / 0.4)
          currentTransitionRadius.current = THREE.MathUtils.lerp(
            getBoronShellRadius(initialOcc.transitionN),
            getBoronShellRadius(finalOcc.transitionN),
            jumpP
          )
          updateTransitionProgress(progress, 'electronTransition')
        } else {
          updateTransitionProgress(progress, 'settle')
          targetTransitionN = finalOcc.transitionN
        }
      } else {
        if (progress < 0.46) {
          const dropP = easeInOutCubic(progress / 0.46)
          currentTransitionRadius.current = THREE.MathUtils.lerp(
            getBoronShellRadius(initialOcc.transitionN),
            getBoronShellRadius(finalOcc.transitionN),
            dropP
          )
          updateTransitionProgress(progress, 'electronTransition')
        } else if (progress < 0.56) {
          electronInteractionFlash = Math.sin(((progress - 0.46) / 0.1) * Math.PI)
          updateTransitionProgress(progress, 'interaction')
          targetTransitionN = finalOcc.transitionN
        } else if (progress < 0.95) {
          updateTransitionProgress(progress, 'photonOutgoing')
          targetTransitionN = finalOcc.transitionN
        } else {
          updateTransitionProgress(progress, 'settle')
          targetTransitionN = finalOcc.transitionN
        }
      }

      if (progress >= 1.0) {
        completeTransition()
      }
    } else {
      currentTransitionRadius.current = THREE.MathUtils.damp(
        currentTransitionRadius.current,
        getBoronShellRadius(targetTransitionN),
        12, delta
      )
    }

    if (playing && !reducedMotion) {
      const coreSpeed = 2.4 * speed * Math.max(0.1, shellOpacity)
      const anchorSpeed = (1.8 / Math.pow(occupancy.anchorN, 0.75)) * speed * Math.max(0.1, shellOpacity)
      const vbSpeed = (1.8 / Math.pow(targetTransitionN, 0.75)) * speed * Math.max(0.1, shellOpacity)
      core1Angle.current += delta * coreSpeed
      core2Angle.current += delta * coreSpeed
      va1Angle.current += delta * anchorSpeed
      va2Angle.current += delta * anchorSpeed
      vbAngle.current += delta * vbSpeed
    }

    const rCore = coreRadius
    const rAnchor = anchorRadius
    const rVb = currentTransitionRadius.current

    if (c1GroupRef.current) {
      c1GroupRef.current.position.set(Math.cos(core1Angle.current) * rCore, Math.sin(core1Angle.current) * rCore, 0)
      c1GroupRef.current.visible = shellOpacity > 0.01
    }
    if (c2GroupRef.current) {
      c2GroupRef.current.position.set(Math.cos(core2Angle.current) * rCore, Math.sin(core2Angle.current) * rCore, 0)
      c2GroupRef.current.visible = shellOpacity > 0.01
    }
    if (va1GroupRef.current) {
      va1GroupRef.current.position.set(Math.cos(va1Angle.current) * rAnchor, Math.sin(va1Angle.current) * rAnchor, 0)
      va1GroupRef.current.visible = shellOpacity > 0.01
    }
    if (va2GroupRef.current) {
      va2GroupRef.current.position.set(Math.cos(va2Angle.current) * rAnchor, Math.sin(va2Angle.current) * rAnchor, 0)
      va2GroupRef.current.visible = shellOpacity > 0.01
    }
    if (vbGroupRef.current) {
      const xv = Math.cos(vbAngle.current) * rVb
      const yv = Math.sin(vbAngle.current) * rVb
      vbGroupRef.current.position.set(xv, yv, 0)
      vbPosRef.current.copy(getBohrElectronWorldPosition(rVb, vbAngle.current))

      if (vbCoreRef.current) {
        const mat = vbCoreRef.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = (2.4 + electronInteractionFlash * 3.5) * shellOpacity
        mat.opacity = 0.98 * shellOpacity
      }
      if (vbHaloRef.current) {
        const mat = vbHaloRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = (0.5 + electronInteractionFlash * 0.45) * shellOpacity
      }
      vbGroupRef.current.visible = shellOpacity > 0.01
    }

    shellGeometries.forEach(({ n }, idx) => {
      const line = shellGuideRefs.current[idx]
      if (line) {
        const isCore = n === 1
        const isValence = n === occupancy.anchorN || n === targetTransitionN
        const mat = line.material as THREE.LineBasicMaterial
        mat.opacity = (isCore ? 0.65 : isValence ? 0.75 : 0.18) * shellOpacity
        line.visible = shellOpacity > 0.01
      }
    })
  })

  const photonColor = activeTransition?.physics.displayColor ?? '#eab308'
  const isAbsorption = activeTransition?.type === 'absorption'

  return (
    <group ref={groupRef}>
      {/* ¹¹B Nucleus */}
      <BoronNucleus />

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

        {/* Anchor Valence Electron 1 (2s pair, member A) */}
        <group ref={va1GroupRef}>
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

        {/* Anchor Valence Electron 2 (2s pair, member B) */}
        <group ref={va2GroupRef}>
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

        {/* Open-Subshell 2p / Transitioning Valence Electron — VISUALLY DISTINCT amber-gold marker,
            not a third identical violet dot, to signal the open p subshell */}
        <group ref={vbGroupRef}>
          <mesh ref={vbCoreRef}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial color="#fffbeb" emissive="#fde68a" emissiveIntensity={2.4} roughness={0.1} metalness={0.1} transparent opacity={0.98} />
          </mesh>
          <mesh ref={vbHaloRef}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color="#eab308" intensity={2.6} distance={3.4} />
        </group>
      </group>

      {/* Photon Wave Packet targeting the transitioning valence electron */}
      {activeTransition && (
        <PhotonWavePacket
          visible={true}
          progress={activeTransition.progress}
          direction={isAbsorption ? 'absorption' : 'emission'}
          color={photonColor}
          electronPosition={vbPosRef.current}
        />
      )}
    </group>
  )
}

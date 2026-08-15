import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useQuantaStore } from '../state/quantaStore'
import { getHeliumLevel } from '../physics/helium'
import { HeliumNucleus } from './HeliumNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { ORBIT_INCLINATION_X, ORBIT_INCLINATION_Z, getBohrElectronWorldPosition } from './transitionCoordinates'

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/**
 * Shell radii for Helium pedagogical shell model.
 * Screened non-linear pedagogical scaling.
 */
function getHeliumShellRadius(n: number): number {
  if (n === 1) return 1.95 // n=1 K-shell
  if (n === 2) return 3.65 // n=2 L-shell
  if (n === 3) return 5.45 // n=3 M-shell
  return 6.8
}

function getHeliumOccupancy(levelId: string): { n1: number; n2: number } {
  if (levelId === '1s2_1S0') return { n1: 1, n2: 1 }
  if (levelId.startsWith('1s2s') || levelId.startsWith('1s2p')) return { n1: 1, n2: 2 }
  if (levelId.startsWith('1s3s') || levelId.startsWith('1s3p') || levelId.startsWith('1s3d')) return { n1: 1, n2: 3 }
  return { n1: 1, n2: 1 }
}

export function HeliumShell() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const heliumState = useQuantaStore((s) => s.helium)
  const updateTransitionProgress = useQuantaStore((s) => s.updateHeliumTransitionProgress)
  const completeTransition = useQuantaStore((s) => s.completeHeliumTransition)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)

  const activeTransition = heliumState.activeTransition
  const occupancy = useMemo(() => getHeliumOccupancy(heliumState.selectedLevelId), [heliumState.selectedLevelId])

  const electron1Angle = useRef(0)
  const electron2Angle = useRef(Math.PI) // Phase-separated across the shell

  const electron1PosRef = useRef(new THREE.Vector3(0, 0, 0))
  const electron2PosRef = useRef(new THREE.Vector3(0, 0, 0))

  const currentR1 = useRef(getHeliumShellRadius(occupancy.n1))
  const currentR2 = useRef(getHeliumShellRadius(occupancy.n2))

  const groupRef = useRef<THREE.Group>(null!)
  const e1GroupRef = useRef<THREE.Group>(null!)
  const e2GroupRef = useRef<THREE.Group>(null!)
  const e1CoreRef = useRef<THREE.Mesh>(null!)
  const e2CoreRef = useRef<THREE.Mesh>(null!)
  const e1HaloRef = useRef<THREE.Mesh>(null!)
  const e2HaloRef = useRef<THREE.Mesh>(null!)

  const e1TrailRef = useRef<THREE.Line>(null!)
  const e2TrailRef = useRef<THREE.Line>(null!)

  const shellGuideRefs = useRef<(THREE.LineLoop | null)[]>([])

  // Shell guide geometries for n = 1, 2, 3
  const shellGeometries = useMemo(() => {
    const segments = 128
    return [1, 2, 3].map((n) => {
      const radius = getHeliumShellRadius(n)
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

  // Trail buffer setup
  const trailCount = 36
  const { e1TrailGeom, e1TrailPos, e2TrailGeom, e2TrailPos } = useMemo(() => {
    const p1 = new Float32Array(trailCount * 3)
    const p2 = new Float32Array(trailCount * 3)
    const colors = new Float32Array(trailCount * 3)

    for (let i = 0; i < trailCount; i++) {
      const t = i / (trailCount - 1)
      const alpha = Math.pow(t, 2.0)
      colors[i * 3] = 0.65 + 0.35 * alpha
      colors[i * 3 + 1] = 0.88 + 0.12 * alpha
      colors[i * 3 + 2] = 1.0
    }

    const g1 = new THREE.BufferGeometry()
    const pos1 = new THREE.BufferAttribute(p1, 3)
    g1.setAttribute('position', pos1)
    g1.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const g2 = new THREE.BufferGeometry()
    const pos2 = new THREE.BufferAttribute(p2, 3)
    g2.setAttribute('position', pos2)
    g2.setAttribute('color', new THREE.BufferAttribute(colors.slice(), 3))

    return { e1TrailGeom: g1, e1TrailPos: pos1, e2TrailGeom: g2, e2TrailPos: pos2 }
  }, [trailCount])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    // Damp model transition blend
    const targetBlend = isQuantum ? 1.0 : 0.0
    modelBlendRef.current = THREE.MathUtils.damp(
      modelBlendRef.current,
      targetBlend,
      4.0 * speed,
      delta
    )

    const shellOpacity = Math.max(0, Math.min(1, 1.0 - modelBlendRef.current))

    // Transition progress state machine
    let progress = 0
    let targetOccupancy = occupancy
    let electronInteractionFlash = 0

    if (activeTransition) {
      const elapsed = performance.now() - activeTransition.startTime
      progress = Math.min(1, Math.max(0, elapsed / activeTransition.durationMs))

      const initialOcc = getHeliumOccupancy(activeTransition.initialLevelId)
      const finalOcc = getHeliumOccupancy(activeTransition.targetLevelId)

      if (activeTransition.type === 'absorption') {
        if (progress < 0.46) {
          updateTransitionProgress(progress, 'photonIncoming')
          targetOccupancy = initialOcc
        } else if (progress < 0.56) {
          updateTransitionProgress(progress, 'interaction')
          const interactionP = (progress - 0.46) / 0.1
          electronInteractionFlash = Math.sin(interactionP * Math.PI)
          targetOccupancy = initialOcc
        } else if (progress < 0.94) {
          const jumpP = easeInOutCubic((progress - 0.54) / 0.4)
          const interpR2 = THREE.MathUtils.lerp(
            getHeliumShellRadius(initialOcc.n2),
            getHeliumShellRadius(finalOcc.n2),
            jumpP
          )
          currentR2.current = interpR2
          updateTransitionProgress(progress, 'electronTransition')
        } else {
          updateTransitionProgress(progress, 'settle')
          targetOccupancy = finalOcc
        }
      } else {
        // Emission
        if (progress < 0.46) {
          const dropP = easeInOutCubic(progress / 0.46)
          const interpR2 = THREE.MathUtils.lerp(
            getHeliumShellRadius(initialOcc.n2),
            getHeliumShellRadius(finalOcc.n2),
            dropP
          )
          currentR2.current = interpR2
          updateTransitionProgress(progress, 'electronTransition')
        } else if (progress < 0.56) {
          const interactionP = (progress - 0.46) / 0.1
          electronInteractionFlash = Math.sin(interactionP * Math.PI)
          updateTransitionProgress(progress, 'interaction')
          targetOccupancy = finalOcc
        } else if (progress < 0.95) {
          updateTransitionProgress(progress, 'photonOutgoing')
          targetOccupancy = finalOcc
        } else {
          updateTransitionProgress(progress, 'settle')
          targetOccupancy = finalOcc
        }
      }

      if (progress >= 1.0) {
        completeTransition()
      }
    } else {
      currentR1.current = THREE.MathUtils.lerp(currentR1.current, getHeliumShellRadius(targetOccupancy.n1), delta * 12)
      currentR2.current = THREE.MathUtils.lerp(currentR2.current, getHeliumShellRadius(targetOccupancy.n2), delta * 12)
    }

    // Motion updates for both electron markers
    if (playing) {
      const speed1 = 2.2 * speed * Math.max(0.1, shellOpacity)
      const speed2 = (2.2 / Math.pow(targetOccupancy.n2, 0.7)) * speed * Math.max(0.1, shellOpacity)
      electron1Angle.current += delta * speed1
      electron2Angle.current += delta * speed2
    }

    const r1 = currentR1.current
    const r2 = currentR2.current

    const cos1 = Math.cos(electron1Angle.current)
    const sin1 = Math.sin(electron1Angle.current)
    const cos2 = Math.cos(electron2Angle.current)
    const sin2 = Math.sin(electron2Angle.current)

    // Position Electron 1 (Core 1s electron)
    if (e1GroupRef.current) {
      e1GroupRef.current.position.set(cos1 * r1, sin1 * r1, 0)
      electron1PosRef.current.copy(getBohrElectronWorldPosition(r1, electron1Angle.current))

      if (e1CoreRef.current) {
        const mat = e1CoreRef.current.material as THREE.MeshStandardMaterial
        mat.opacity = 0.98 * shellOpacity
      }
      if (e1HaloRef.current) {
        const mat = e1HaloRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = 0.42 * shellOpacity
      }
      e1GroupRef.current.visible = shellOpacity > 0.01
    }

    // Position Electron 2 (Valence electron)
    if (e2GroupRef.current) {
      e2GroupRef.current.position.set(cos2 * r2, sin2 * r2, 0)
      electron2PosRef.current.copy(getBohrElectronWorldPosition(r2, electron2Angle.current))

      if (e2CoreRef.current) {
        const mat = e2CoreRef.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = (2.2 + electronInteractionFlash * 3.5) * shellOpacity
        mat.opacity = 0.98 * shellOpacity
      }
      if (e2HaloRef.current) {
        const mat = e2HaloRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = (0.42 + electronInteractionFlash * 0.45) * shellOpacity
      }
      e2GroupRef.current.visible = shellOpacity > 0.01
    }

    // Update trails
    if (e1TrailRef.current) {
      const arr = e1TrailPos.array as Float32Array
      const trailArc = 0.45
      for (let i = 0; i < trailCount; i++) {
        const arc = (1 - i / (trailCount - 1)) * trailArc
        const a = electron1Angle.current - arc
        arr[i * 3] = Math.cos(a) * r1
        arr[i * 3 + 1] = Math.sin(a) * r1
        arr[i * 3 + 2] = 0
      }
      e1TrailPos.needsUpdate = true
      const mat = e1TrailRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.72 * shellOpacity
      e1TrailRef.current.visible = shellOpacity > 0.01
    }

    if (e2TrailRef.current) {
      const arr = e2TrailPos.array as Float32Array
      const trailArc = 0.45
      for (let i = 0; i < trailCount; i++) {
        const arc = (1 - i / (trailCount - 1)) * trailArc
        const a = electron2Angle.current - arc
        arr[i * 3] = Math.cos(a) * r2
        arr[i * 3 + 1] = Math.sin(a) * r2
        arr[i * 3 + 2] = 0
      }
      e2TrailPos.needsUpdate = true
      const mat = e2TrailRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.72 * shellOpacity
      e2TrailRef.current.visible = shellOpacity > 0.01
    }

    // Update guide circles opacity
    shellGeometries.forEach(({ n }, idx) => {
      const line = shellGuideRefs.current[idx]
      if (line) {
        const isOccupied = n === occupancy.n1 || n === occupancy.n2
        const mat = line.material as THREE.LineBasicMaterial
        mat.opacity = (isOccupied ? 0.7 : 0.18) * shellOpacity
        line.visible = shellOpacity > 0.01
      }
    })
  })

  const photonColor = activeTransition?.physics.displayColor ?? '#fbbf24'
  const isAbsorption = activeTransition?.type === 'absorption'

  return (
    <group ref={groupRef}>
      {/* ⁴He Nucleus */}
      <HeliumNucleus />

      {/* Tilted Shell Plane */}
      <group rotation={[ORBIT_INCLINATION_X, 0, ORBIT_INCLINATION_Z]}>
        {/* Shell Guides (n = 1, 2, 3) */}
        {shellGeometries.map(({ n, geom }, idx) => (
          <primitive
            key={n}
            ref={(el: THREE.LineLoop | null) => {
              shellGuideRefs.current[idx] = el
            }}
            object={
              new THREE.LineLoop(
                geom,
                new THREE.LineBasicMaterial({
                  color: n === 1 ? '#93c5fd' : '#475569',
                  transparent: true,
                  opacity: 0.5,
                })
              )
            }
          />
        ))}

        {/* Electron 1 Trail */}
        <primitive
          ref={e1TrailRef}
          object={
            new THREE.Line(
              e1TrailGeom,
              new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.72,
                blending: THREE.AdditiveBlending,
              })
            )
          }
        />

        {/* Electron 2 Trail */}
        <primitive
          ref={e2TrailRef}
          object={
            new THREE.Line(
              e2TrailGeom,
              new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.72,
                blending: THREE.AdditiveBlending,
              })
            )
          }
        />

        {/* Electron Marker 1 */}
        <group ref={e1GroupRef}>
          <mesh ref={e1CoreRef}>
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f8fdff"
              emissiveIntensity={2.2}
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.98}
            />
          </mesh>
          <mesh ref={e1HaloRef}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshBasicMaterial
              color="#bdefff"
              transparent
              opacity={0.42}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color="#bdefff" intensity={2.0} distance={3.0} />
        </group>

        {/* Electron Marker 2 */}
        <group ref={e2GroupRef}>
          <mesh ref={e2CoreRef}>
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f8fdff"
              emissiveIntensity={2.2}
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.98}
            />
          </mesh>
          <mesh ref={e2HaloRef}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshBasicMaterial
              color="#bdefff"
              transparent
              opacity={0.42}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color="#bdefff" intensity={2.0} distance={3.0} />
        </group>
      </group>

      {/* Photon Wave Packet interaction targeting the transitioning valence electron */}
      {activeTransition && (
        <PhotonWavePacket
          visible={true}
          progress={activeTransition.progress}
          direction={isAbsorption ? 'absorption' : 'emission'}
          color={photonColor}
          electronPosition={electron2PosRef.current}
        />
      )}
    </group>
  )
}

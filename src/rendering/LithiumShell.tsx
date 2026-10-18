import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useQuantaStore } from '../state/quantaStore'
import { advanceTransitionProgress } from '../physics/transitionTiming'
import { LithiumNucleus } from './LithiumNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { ORBIT_INCLINATION_X, ORBIT_INCLINATION_Z, getBohrElectronWorldPosition } from './transitionCoordinates'
import { useDisposableGeometry } from './useDisposableGeometry'
import { useReducedMotion } from './useReducedMotion'

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/**
 * Shell radii for Lithium pedagogical shell model.
 * Core K-shell (n=1) is compact; outer shells (n=2, 3, 4) clearly separated.
 */
function getLithiumShellRadius(n: number): number {
  if (n === 1) return 1.65 // n=1 K-shell (1s² core)
  if (n === 2) return 3.85 // n=2 L-shell (2s/2p valence)
  if (n === 3) return 5.65 // n=3 M-shell (3s/3p/3d valence)
  if (n === 4) return 7.25 // n=4 N-shell (4s/4p/4d/4f valence)
  return 8.0
}

function getLithiumOccupancy(levelId: string): { coreN: number; valenceN: number } {
  if (levelId.includes('2s') || levelId.includes('2p')) return { coreN: 1, valenceN: 2 }
  if (levelId.includes('3s') || levelId.includes('3p') || levelId.includes('3d')) return { coreN: 1, valenceN: 3 }
  if (levelId.includes('4s') || levelId.includes('4p') || levelId.includes('4d') || levelId.includes('4f')) return { coreN: 1, valenceN: 4 }
  return { coreN: 1, valenceN: 2 }
}

export function LithiumShell() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const lithiumState = useQuantaStore((s) => s.lithium)
  const updateTransitionProgress = useQuantaStore((s) => s.updateLithiumTransitionProgress)
  const completeTransition = useQuantaStore((s) => s.completeLithiumTransition)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)
  const reducedMotion = useReducedMotion()

  const activeTransition = lithiumState.activeTransition
  const occupancy = useMemo(() => getLithiumOccupancy(lithiumState.selectedLevelId), [lithiumState.selectedLevelId])

  // Angles for the 2 core electrons and 1 valence electron
  const core1Angle = useRef(0)
  const core2Angle = useRef(Math.PI) // Phase-separated in K shell
  const valenceAngle = useRef(Math.PI * 0.5) // Valence electron

  const valencePosRef = useRef(new THREE.Vector3(0, 0, 0))

  const coreRadius = getLithiumShellRadius(1)
  const currentValenceRadius = useRef(getLithiumShellRadius(occupancy.valenceN))

  const groupRef = useRef<THREE.Group>(null!)
  const c1GroupRef = useRef<THREE.Group>(null!)
  const c2GroupRef = useRef<THREE.Group>(null!)
  const vGroupRef = useRef<THREE.Group>(null!)

  const vCoreRef = useRef<THREE.Mesh>(null!)
  const vHaloRef = useRef<THREE.Mesh>(null!)

  const c1TrailRef = useRef<THREE.Line>(null!)
  const c2TrailRef = useRef<THREE.Line>(null!)
  const vTrailRef = useRef<THREE.Line>(null!)

  const shellGuideRefs = useRef<(THREE.LineLoop | null)[]>([])

  // Shell guide geometries for n = 1, 2, 3, 4
  const shellGeometries = useMemo(() => {
    const segments = 128
    return [1, 2, 3, 4].map((n) => {
      const radius = getLithiumShellRadius(n)
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
  const { c1TrailGeom, c1TrailPos, c2TrailGeom, c2TrailPos, vTrailGeom, vTrailPos } = useMemo(() => {
    const p1 = new Float32Array(trailCount * 3)
    const p2 = new Float32Array(trailCount * 3)
    const pv = new Float32Array(trailCount * 3)

    const colorsCore = new Float32Array(trailCount * 3)
    const colorsValence = new Float32Array(trailCount * 3)

    for (let i = 0; i < trailCount; i++) {
      const t = i / (trailCount - 1)
      const alpha = Math.pow(t, 2.0)
      // Core: cool silver-sky
      colorsCore[i * 3] = 0.58 + 0.42 * alpha
      colorsCore[i * 3 + 1] = 0.8 + 0.2 * alpha
      colorsCore[i * 3 + 2] = 1.0

      // Valence: warm amber/rose
      colorsValence[i * 3] = 0.95 + 0.05 * alpha
      colorsValence[i * 3 + 1] = 0.5 + 0.5 * alpha
      colorsValence[i * 3 + 2] = 0.4 + 0.6 * alpha
    }

    const g1 = new THREE.BufferGeometry()
    const pos1 = new THREE.BufferAttribute(p1, 3)
    g1.setAttribute('position', pos1)
    g1.setAttribute('color', new THREE.BufferAttribute(colorsCore, 3))

    const g2 = new THREE.BufferGeometry()
    const pos2 = new THREE.BufferAttribute(p2, 3)
    g2.setAttribute('position', pos2)
    g2.setAttribute('color', new THREE.BufferAttribute(colorsCore.slice(), 3))

    const gv = new THREE.BufferGeometry()
    const posv = new THREE.BufferAttribute(pv, 3)
    gv.setAttribute('position', posv)
    gv.setAttribute('color', new THREE.BufferAttribute(colorsValence, 3))

    return {
      c1TrailGeom: g1,
      c1TrailPos: pos1,
      c2TrailGeom: g2,
      c2TrailPos: pos2,
      vTrailGeom: gv,
      vTrailPos: posv,
    }
  }, [trailCount])

  useEffect(() => {
    return () => {
      shellGeometries.forEach(({ geom }) => geom.dispose())
    }
  }, [shellGeometries])
  useDisposableGeometry(c1TrailGeom)
  useDisposableGeometry(c2TrailGeom)
  useDisposableGeometry(vTrailGeom)

  const c1TrailLine = useMemo(
    () =>
      new THREE.Line(
        c1TrailGeom,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
      ),
    [c1TrailGeom]
  )
  const c2TrailLine = useMemo(
    () =>
      new THREE.Line(
        c2TrailGeom,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
      ),
    [c2TrailGeom]
  )
  const vTrailLine = useMemo(
    () =>
      new THREE.Line(
        vTrailGeom,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
      ),
    [vTrailGeom]
  )
  useEffect(() => {
    return () => {
      c1TrailLine.material.dispose()
      c2TrailLine.material.dispose()
      vTrailLine.material.dispose()
    }
  }, [c1TrailLine, c2TrailLine, vTrailLine])

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

    // Transition progress state machine (affects ONLY the valence electron)
    let progress = 0
    let targetValenceN = occupancy.valenceN
    let electronInteractionFlash = 0

    if (activeTransition) {
      progress = advanceTransitionProgress(activeTransition, delta, speed, playing)

      const initialOcc = getLithiumOccupancy(activeTransition.initialLevelId)
      const finalOcc = getLithiumOccupancy(activeTransition.targetLevelId)

      if (activeTransition.type === 'absorption') {
        if (progress < 0.46) {
          updateTransitionProgress(progress, 'photonIncoming')
          targetValenceN = initialOcc.valenceN
        } else if (progress < 0.56) {
          updateTransitionProgress(progress, 'interaction')
          const interactionP = (progress - 0.46) / 0.1
          electronInteractionFlash = Math.sin(interactionP * Math.PI)
          targetValenceN = initialOcc.valenceN
        } else if (progress < 0.94) {
          const jumpP = easeInOutCubic((progress - 0.54) / 0.4)
          const interpRv = THREE.MathUtils.lerp(
            getLithiumShellRadius(initialOcc.valenceN),
            getLithiumShellRadius(finalOcc.valenceN),
            jumpP
          )
          currentValenceRadius.current = interpRv
          updateTransitionProgress(progress, 'electronTransition')
        } else {
          updateTransitionProgress(progress, 'settle')
          targetValenceN = finalOcc.valenceN
        }
      } else {
        // Emission
        if (progress < 0.46) {
          const dropP = easeInOutCubic(progress / 0.46)
          const interpRv = THREE.MathUtils.lerp(
            getLithiumShellRadius(initialOcc.valenceN),
            getLithiumShellRadius(finalOcc.valenceN),
            dropP
          )
          currentValenceRadius.current = interpRv
          updateTransitionProgress(progress, 'electronTransition')
        } else if (progress < 0.56) {
          const interactionP = (progress - 0.46) / 0.1
          electronInteractionFlash = Math.sin(interactionP * Math.PI)
          updateTransitionProgress(progress, 'interaction')
          targetValenceN = finalOcc.valenceN
        } else if (progress < 0.95) {
          updateTransitionProgress(progress, 'photonOutgoing')
          targetValenceN = finalOcc.valenceN
        } else {
          updateTransitionProgress(progress, 'settle')
          targetValenceN = finalOcc.valenceN
        }
      }

      if (progress >= 1.0) {
        completeTransition()
      }
    } else {
      currentValenceRadius.current = THREE.MathUtils.damp(
        currentValenceRadius.current,
        getLithiumShellRadius(targetValenceN),
        12, delta
      )
    }

    // Motion updates for all three electrons
    if (playing && !reducedMotion) {
      const coreSpeed = 2.4 * speed * Math.max(0.1, shellOpacity)
      const valSpeed = (1.8 / Math.pow(targetValenceN, 0.75)) * speed * Math.max(0.1, shellOpacity)
      core1Angle.current += delta * coreSpeed
      core2Angle.current += delta * coreSpeed
      valenceAngle.current += delta * valSpeed
    }

    const rCore = coreRadius
    const rVal = currentValenceRadius.current

    // Core Electron 1
    if (c1GroupRef.current) {
      const x1 = Math.cos(core1Angle.current) * rCore
      const y1 = Math.sin(core1Angle.current) * rCore
      c1GroupRef.current.position.set(x1, y1, 0)
      c1GroupRef.current.visible = shellOpacity > 0.01
    }

    // Core Electron 2
    if (c2GroupRef.current) {
      const x2 = Math.cos(core2Angle.current) * rCore
      const y2 = Math.sin(core2Angle.current) * rCore
      c2GroupRef.current.position.set(x2, y2, 0)
      c2GroupRef.current.visible = shellOpacity > 0.01
    }

    // Valence Electron
    if (vGroupRef.current) {
      const xv = Math.cos(valenceAngle.current) * rVal
      const yv = Math.sin(valenceAngle.current) * rVal
      vGroupRef.current.position.set(xv, yv, 0)
      valencePosRef.current.copy(getBohrElectronWorldPosition(rVal, valenceAngle.current))

      if (vCoreRef.current) {
        const mat = vCoreRef.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = (2.2 + electronInteractionFlash * 3.5) * shellOpacity
        mat.opacity = 0.98 * shellOpacity
      }
      if (vHaloRef.current) {
        const mat = vHaloRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = (0.45 + electronInteractionFlash * 0.45) * shellOpacity
      }
      vGroupRef.current.visible = shellOpacity > 0.01
    }

    // Update trails
    if (c1TrailRef.current) {
      const arr = c1TrailPos.array as Float32Array
      const trailArc = 0.4
      for (let i = 0; i < trailCount; i++) {
        const arc = (1 - i / (trailCount - 1)) * trailArc
        const a = core1Angle.current - arc
        arr[i * 3] = Math.cos(a) * rCore
        arr[i * 3 + 1] = Math.sin(a) * rCore
        arr[i * 3 + 2] = 0
      }
      c1TrailPos.needsUpdate = true
      const mat = c1TrailRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.65 * shellOpacity
      c1TrailRef.current.visible = shellOpacity > 0.01
    }

    if (c2TrailRef.current) {
      const arr = c2TrailPos.array as Float32Array
      const trailArc = 0.4
      for (let i = 0; i < trailCount; i++) {
        const arc = (1 - i / (trailCount - 1)) * trailArc
        const a = core2Angle.current - arc
        arr[i * 3] = Math.cos(a) * rCore
        arr[i * 3 + 1] = Math.sin(a) * rCore
        arr[i * 3 + 2] = 0
      }
      c2TrailPos.needsUpdate = true
      const mat = c2TrailRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.65 * shellOpacity
      c2TrailRef.current.visible = shellOpacity > 0.01
    }

    if (vTrailRef.current) {
      const arr = vTrailPos.array as Float32Array
      const trailArc = 0.45
      for (let i = 0; i < trailCount; i++) {
        const arc = (1 - i / (trailCount - 1)) * trailArc
        const a = valenceAngle.current - arc
        arr[i * 3] = Math.cos(a) * rVal
        arr[i * 3 + 1] = Math.sin(a) * rVal
        arr[i * 3 + 2] = 0
      }
      vTrailPos.needsUpdate = true
      const mat = vTrailRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.75 * shellOpacity
      vTrailRef.current.visible = shellOpacity > 0.01
    }

    // Update guide circles opacity
    shellGeometries.forEach(({ n }, idx) => {
      const line = shellGuideRefs.current[idx]
      if (line) {
        const isCore = n === 1
        const isValence = n === occupancy.valenceN
        const mat = line.material as THREE.LineBasicMaterial
        mat.opacity = (isCore ? 0.65 : isValence ? 0.75 : 0.18) * shellOpacity
        line.visible = shellOpacity > 0.01
      }
    })
  })

  const photonColor = activeTransition?.physics.displayColor ?? '#ef4444'
  const isAbsorption = activeTransition?.type === 'absorption'

  return (
    <group ref={groupRef}>
      {/* ⁷Li Nucleus */}
      <LithiumNucleus />

      {/* Tilted Shell Plane */}
      <group rotation={[ORBIT_INCLINATION_X, 0, ORBIT_INCLINATION_Z]}>
        {/* Shell Guides (n = 1, 2, 3, 4) */}
        {shellGeometries.map(({ n, geom }, idx) => (
          <lineLoop
            key={n}
            ref={(el: THREE.LineLoop | null) => {
              shellGuideRefs.current[idx] = el
            }}
          >
            <primitive object={geom} attach="geometry" />
            <lineBasicMaterial
              color={n === 1 ? '#93c5fd' : n === 2 ? '#fca5a5' : '#475569'}
              transparent
              opacity={0.5}
            />
          </lineLoop>
        ))}

        {/* Core 1s Electron 1 Trail */}
        <primitive ref={c1TrailRef} object={c1TrailLine} />

        {/* Core 1s Electron 2 Trail */}
        <primitive ref={c2TrailRef} object={c2TrailLine} />

        {/* Outer Valence Electron Trail */}
        <primitive ref={vTrailRef} object={vTrailLine} />

        {/* Core Electron 1 (K Shell) */}
        <group ref={c1GroupRef}>
          <mesh>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f0f9ff"
              emissiveIntensity={2.0}
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.98}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshBasicMaterial
              color="#93c5fd"
              transparent
              opacity={0.38}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color="#93c5fd" intensity={1.8} distance={2.5} />
        </group>

        {/* Core Electron 2 (K Shell) */}
        <group ref={c2GroupRef}>
          <mesh>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f0f9ff"
              emissiveIntensity={2.0}
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.98}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshBasicMaterial
              color="#93c5fd"
              transparent
              opacity={0.38}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color="#93c5fd" intensity={1.8} distance={2.5} />
        </group>

        {/* Valence Electron (L/M/N Shell) */}
        <group ref={vGroupRef}>
          <mesh ref={vCoreRef}>
            <sphereGeometry args={[0.082, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#fff1f2"
              emissiveIntensity={2.2}
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.98}
            />
          </mesh>
          <mesh ref={vHaloRef}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshBasicMaterial
              color="#fda4af"
              transparent
              opacity={0.45}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color="#f43f5e" intensity={2.4} distance={3.2} />
        </group>
      </group>

      {/* Photon Wave Packet targeting the transitioning outer valence electron */}
      {activeTransition && (
        <PhotonWavePacket
          visible={true}
          progress={activeTransition.progress}
          direction={isAbsorption ? 'absorption' : 'emission'}
          color={photonColor}
          electronPosition={valencePosRef.current}
        />
      )}
    </group>
  )
}

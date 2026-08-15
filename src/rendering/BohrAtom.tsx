import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useQuantaStore } from '../state/quantaStore'
import { getOrbitAngularSpeed, getVisualRadius } from './visualRadius'
import { PhotonWavePacket } from './PhotonWavePacket'
import { getBohrElectronWorldPosition, ORBIT_INCLINATION_X, ORBIT_INCLINATION_Z } from './transitionCoordinates'

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function BohrAtom() {
  const mode = useQuantaStore((s) => s.mode)
  const level = useQuantaStore((s) => s.level)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const activeTransition = useQuantaStore((s) => s.activeTransition)
  const updateTransitionProgress = useQuantaStore((s) => s.updateTransitionProgress)
  const completeTransition = useQuantaStore((s) => s.completeTransition)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)

  const groupRef = useRef<THREE.Group>(null!)
  const electronGroupRef = useRef<THREE.Group>(null!)
  const electronCoreRef = useRef<THREE.Mesh>(null!)
  const electronHaloRef = useRef<THREE.Mesh>(null!)
  const electronLightRef = useRef<THREE.PointLight>(null!)

  const nucleusGroupRef = useRef<THREE.Group>(null!)
  const nucleusCoreRef = useRef<THREE.Mesh>(null!)
  const nucleusInnerShellRef = useRef<THREE.Mesh>(null!)
  const nucleusOuterHaloRef = useRef<THREE.Mesh>(null!)
  const nucleusLightRef = useRef<THREE.PointLight>(null!)

  const electronTrailRef = useRef<THREE.Line>(null!)
  const activeOrbitLineRef = useRef<THREE.LineLoop>(null!)
  const orbitLineRefs = useRef<(THREE.LineLoop | null)[]>([])

  const electronAngle = useRef(0)
  const currentVisualRadius = useRef(getVisualRadius(level))
  const electronWorldPosRef = useRef(new THREE.Vector3(0, 0, 0))

  // Generate orbit ring geometries for n = 1..6
  const orbitGeometries = useMemo(() => {
    const segments = 128
    return Array.from({ length: 6 }, (_, i) => {
      const n = i + 1
      const radius = getVisualRadius(n)
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

  // Dynamic active orbit geometry for smooth interpolation during transition
  const dynamicActiveOrbitGeom = useMemo(() => {
    const segments = 128
    const points = new Float32Array(segments * 3)
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(points, 3))
    return geom
  }, [])

  // Refined tapering electron motion trail geometry (~10-14% of an orbit)
  const trailPointsCount = 48
  const { trailGeometry, trailPosAttr } = useMemo(() => {
    const points = new Float32Array(trailPointsCount * 3)
    const colors = new Float32Array(trailPointsCount * 3)
    for (let i = 0; i < trailPointsCount; i++) {
      const t = i / (trailPointsCount - 1)
      const alpha = Math.pow(t, 2.0)
      colors[i * 3] = 0.62 + 0.38 * alpha
      colors[i * 3 + 1] = 0.88 + 0.12 * alpha
      colors[i * 3 + 2] = 1.0
    }
    const geom = new THREE.BufferGeometry()
    const pos = new THREE.BufferAttribute(points, 3)
    geom.setAttribute('position', pos)
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return { trailGeometry: geom, trailPosAttr: pos }
  }, [trailPointsCount])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    // Smoothly damp model transition blend
    const targetBlend = isQuantum ? 1.0 : 0.0
    modelBlendRef.current = THREE.MathUtils.damp(
      modelBlendRef.current,
      targetBlend,
      4.0 * speed,
      delta
    )

    // Calculate effective opacity from model transition blend
    const bohrOpacity = Math.max(0, Math.min(1, 1.0 - modelBlendRef.current))

    // Transition progress state machine
    let progress = 0
    let transitionRadius = getVisualRadius(level)
    let isTransitioning = false
    let electronInteractionFlash = 0

    if (activeTransition) {
      isTransitioning = true
      const elapsed = performance.now() - activeTransition.startTime
      progress = Math.min(1, Math.max(0, elapsed / activeTransition.durationMs))

      const initialR = getVisualRadius(activeTransition.initialLevel)
      const targetR = getVisualRadius(activeTransition.targetLevel)

      if (activeTransition.type === 'absorption') {
        // Absorption timeline:
        // 0.00 - 0.46: Incoming photon wave packet travels toward ELECTRON
        // 0.46 - 0.56: Energy transfer interaction pulse AT ELECTRON
        // 0.54 - 0.94: Electron expands outward smoothly to target orbit (spiral path)
        // 0.94 - 1.00: Settle into target level
        if (progress < 0.46) {
          updateTransitionProgress(progress, 'photonIncoming')
          transitionRadius = initialR
        } else if (progress < 0.56) {
          updateTransitionProgress(progress, 'interaction')
          const interactionP = (progress - 0.46) / 0.1
          electronInteractionFlash = Math.sin(interactionP * Math.PI)
          transitionRadius = initialR
        } else if (progress < 0.94) {
          const jumpP = easeInOutCubic((progress - 0.54) / 0.4)
          transitionRadius = THREE.MathUtils.lerp(initialR, targetR, jumpP)
          updateTransitionProgress(progress, 'electronTransition')
        } else {
          transitionRadius = targetR
          updateTransitionProgress(progress, 'settle')
        }
      } else {
        // Emission timeline:
        // 0.00 - 0.46: Electron drops inward smoothly to target orbit
        // 0.46 - 0.56: Interaction pulse AT ELECTRON & photon wave packet birth
        // 0.56 - 0.95: Outgoing photon wave packet propagates away from ELECTRON
        // 0.95 - 1.00: Settle into target level
        if (progress < 0.46) {
          const dropP = easeInOutCubic(progress / 0.46)
          transitionRadius = THREE.MathUtils.lerp(initialR, targetR, dropP)
          updateTransitionProgress(progress, 'electronTransition')
        } else if (progress < 0.56) {
          const interactionP = (progress - 0.46) / 0.1
          electronInteractionFlash = Math.sin(interactionP * Math.PI)
          transitionRadius = targetR
          updateTransitionProgress(progress, 'interaction')
        } else if (progress < 0.95) {
          transitionRadius = targetR
          updateTransitionProgress(progress, 'photonOutgoing')
        } else {
          transitionRadius = targetR
          updateTransitionProgress(progress, 'settle')
        }
      }

      if (progress >= 1.0) {
        completeTransition()
      }
    }

    // Smooth radius convergence
    const targetRadius = isTransitioning ? transitionRadius : getVisualRadius(level)
    currentVisualRadius.current = THREE.MathUtils.lerp(currentVisualRadius.current, targetRadius, delta * 14)

    // Electron orbital rotation with smooth deceleration during quantum morph
    if (playing) {
      const angularSpeed = getOrbitAngularSpeed(level) * speed * Math.max(0.1, bohrOpacity)
      electronAngle.current += delta * angularSpeed
    }

    const rad = currentVisualRadius.current
    const cosAngle = Math.cos(electronAngle.current)
    const sinAngle = Math.sin(electronAngle.current)

    // Position electron in tilted 3D plane
    if (electronGroupRef.current) {
      electronGroupRef.current.position.set(cosAngle * rad, sinAngle * rad, 0)

      // Calculate true world coordinate of electron for photon targeting
      electronWorldPosRef.current.copy(getBohrElectronWorldPosition(rad, electronAngle.current))

      // Calculate depth cueing based on orbit inclination
      const depthZ = sinAngle * Math.sin(ORBIT_INCLINATION_X)
      const depthScale = 1.0 + depthZ * 0.18
      const depthBrightness = 1.0 + depthZ * 0.22

      electronGroupRef.current.scale.set(depthScale, depthScale, depthScale)

      if (electronCoreRef.current) {
        const mat = electronCoreRef.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = (2.2 + electronInteractionFlash * 3.6) * depthBrightness * bohrOpacity
        mat.opacity = 0.98 * bohrOpacity
      }
      if (electronHaloRef.current) {
        const mat = electronHaloRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = (0.42 + electronInteractionFlash * 0.45) * depthBrightness * bohrOpacity
      }
      if (electronLightRef.current) {
        electronLightRef.current.intensity = (2.2 + electronInteractionFlash * 4.5) * depthBrightness * bohrOpacity
      }
      electronGroupRef.current.visible = bohrOpacity > 0.01
    }

    // Dynamic active highlighted orbit line
    if (activeOrbitLineRef.current) {
      const posAttr = dynamicActiveOrbitGeom.getAttribute('position') as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      const segments = 128
      for (let j = 0; j < segments; j++) {
        const theta = (j / segments) * Math.PI * 2
        arr[j * 3] = Math.cos(theta) * rad
        arr[j * 3 + 1] = Math.sin(theta) * rad
        arr[j * 3 + 2] = 0
      }
      posAttr.needsUpdate = true

      const mat = activeOrbitLineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = (activeTransition ? 0.92 : 0.78) * bohrOpacity
      activeOrbitLineRef.current.visible = bohrOpacity > 0.01
    }

    // Update orbit guides opacity during transition (smooth cross-fade of active states)
    orbitGeometries.forEach(({ n }, index) => {
      const line = orbitLineRefs.current[index]
      if (line) {
        const mat = line.material as THREE.LineBasicMaterial
        if (isTransitioning && activeTransition) {
          if (n === activeTransition.initialLevel) {
            mat.opacity = THREE.MathUtils.lerp(0.75, 0.15, progress) * bohrOpacity
          } else if (n === activeTransition.targetLevel) {
            mat.opacity = THREE.MathUtils.lerp(0.15, 0.75, progress) * bohrOpacity
          } else {
            mat.opacity = 0.15 * bohrOpacity
          }
        } else {
          mat.opacity = (n === level ? 0.75 : 0.16) * bohrOpacity
        }
        line.visible = bohrOpacity > 0.01
      }
    })

    // Update electron trail behind current angle (tapered ~12% of orbit)
    if (electronTrailRef.current) {
      const arr = trailPosAttr.array as Float32Array
      const trailArc = 0.52
      for (let i = 0; i < trailPointsCount; i++) {
        const arcOffset = (1 - i / (trailPointsCount - 1)) * trailArc
        const a = electronAngle.current - arcOffset
        arr[i * 3] = Math.cos(a) * rad
        arr[i * 3 + 1] = Math.sin(a) * rad
        arr[i * 3 + 2] = 0
      }
      trailPosAttr.needsUpdate = true
      const mat = electronTrailRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.75 * bohrOpacity
      electronTrailRef.current.visible = bohrOpacity > 0.01
    }

    // Nucleus retains its beautiful compact proton identity and subtle idle shimmer
    // (Nucleus flash during electronic transition is strictly decoupled)
    const idleShimmer = Math.sin(clock.elapsedTime * 1.8) * 0.04
    const baseEnergyScale = 1.0 + idleShimmer

    if (nucleusGroupRef.current) {
      nucleusGroupRef.current.scale.set(baseEnergyScale, baseEnergyScale, baseEnergyScale)
    }
    if (nucleusCoreRef.current) {
      const mat = nucleusCoreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.6 + idleShimmer * 0.4
    }
    if (nucleusLightRef.current) {
      nucleusLightRef.current.intensity = 3.5 + idleShimmer
    }
  })

  const photonColor = activeTransition?.physics.displayColor ?? '#38bdf8'
  const isAbsorption = activeTransition?.type === 'absorption'

  return (
    <group ref={groupRef}>
      {/* Compact Protium Nucleus (Persistent in both models as the central proton) */}
      <group ref={nucleusGroupRef} position={[0, 0, 0]}>
        {/* Layer 1: Compact dense proton core (radius 0.20) */}
        <mesh ref={nucleusCoreRef}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#fffaf5"
            emissive="#ffd9b0"
            emissiveIntensity={1.6}
            roughness={0.2}
            metalness={0.1}
            transparent
            opacity={0.98}
          />
        </mesh>

        {/* Layer 2: Translucent inner emission shell (radius 0.32) */}
        <mesh ref={nucleusInnerShellRef}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshBasicMaterial
            color="#ffd9b0"
            transparent
            opacity={0.32}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Layer 3: Soft outer halo (radius 0.48) */}
        <mesh ref={nucleusOuterHaloRef}>
          <sphereGeometry args={[0.48, 24, 24]} />
          <meshBasicMaterial
            color="#fff7ed"
            transparent
            opacity={0.14}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Subdued internal point light */}
        <pointLight ref={nucleusLightRef} color="#fff1e6" intensity={3.5} distance={8.0} />
      </group>

      {/* Orbit planes, guides, and classical electron (Fades during Quantum morph) */}
      <group rotation={[ORBIT_INCLINATION_X, 0, ORBIT_INCLINATION_Z]}>
        {/* Inactive guide circles for n = 1..6 */}
        {orbitGeometries.map(({ n, geom }, index) => {
          const isActive = n === level && !activeTransition
          return (
            <primitive
              key={n}
              ref={(el: THREE.LineLoop | null) => {
                orbitLineRefs.current[index] = el
              }}
              object={
                new THREE.LineLoop(
                  geom,
                  new THREE.LineBasicMaterial({
                    color: isActive ? '#93c5fd' : '#334155',
                    transparent: true,
                    opacity: isActive ? 0.75 : 0.16,
                  })
                )
              }
            />
          )
        })}

        {/* Dynamic active highlighted orbit line */}
        <primitive
          ref={activeOrbitLineRef}
          object={
            new THREE.LineLoop(
              dynamicActiveOrbitGeom,
              new THREE.LineBasicMaterial({
                color: activeTransition ? photonColor : '#60a5fa',
                transparent: true,
                opacity: activeTransition ? 0.92 : 0.78,
                linewidth: 2,
              })
            )
          }
        />

        {/* Tapered electron motion trail */}
        <primitive
          ref={electronTrailRef}
          object={
            new THREE.Line(
              trailGeometry,
              new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
              })
            )
          }
        />

        {/* Electron with Tiny Luminous Core and Cold Blue-White Halo */}
        <group ref={electronGroupRef}>
          {/* Tiny bright core sphere (radius 0.075) */}
          <mesh ref={electronCoreRef}>
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

          {/* Soft cold blue-white emissive halo (radius 0.18) */}
          <mesh ref={electronHaloRef}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshBasicMaterial
              color="#bdefff"
              transparent
              opacity={0.42}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Electron point light */}
          <pointLight ref={electronLightRef} color="#bdefff" intensity={2.2} distance={3.2} />
        </group>
      </group>

      {/* Incoming / Outgoing Photon Wave Packet targeting the ELECTRON position */}
      {activeTransition && (
        <PhotonWavePacket
          visible={true}
          progress={activeTransition.progress}
          direction={isAbsorption ? 'absorption' : 'emission'}
          color={photonColor}
          electronPosition={electronWorldPosRef.current}
        />
      )}
    </group>
  )
}

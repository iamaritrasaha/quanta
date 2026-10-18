import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useQuantaStore } from '../state/quantaStore'
import { getAbsorptionOrigin, getEmissionDestination } from './transitionCoordinates'
import { useDisposableGeometry } from './useDisposableGeometry'
import { useReducedMotion } from './useReducedMotion'

interface PhotonWavePacketProps {
  visible: boolean
  progress: number // 0 to 1
  direction: 'absorption' | 'emission'
  color: string
  // For absorption: target is electron's 3D position; for emission: origin is electron's 3D position
  electronPosition?: THREE.Vector3 | [number, number, number]
}

export function PhotonWavePacket({
  visible,
  progress,
  direction,
  color,
  electronPosition,
}: PhotonWavePacketProps) {
  const speed = useQuantaStore((s) => s.animationSpeed)
  const playing = useQuantaStore((s) => s.playing)
  const reducedMotion = useReducedMotion()

  const groupRef = useRef<THREE.Group>(null!)
  const primaryLineRef = useRef<THREE.Line>(null!)
  const orthogonalLineRef = useRef<THREE.Line>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const glowLightRef = useRef<THREE.PointLight>(null!)

  const wavePhase = useRef(0)

  // Compact wave packet parameters
  const pointsCount = 72
  const packetLength = 1.65
  const sigma = 0.42
  const spatialFreq = 18.0

  const { primaryGeom, orthogonalGeom, primaryPosAttr, orthoPosAttr } = useMemo(() => {
    const pGeom = new THREE.BufferGeometry()
    const oGeom = new THREE.BufferGeometry()

    const pPositions = new Float32Array(pointsCount * 3)
    const oPositions = new Float32Array(pointsCount * 3)
    const pColors = new Float32Array(pointsCount * 3)
    const oColors = new Float32Array(pointsCount * 3)

    const threeColor = new THREE.Color(color)

    for (let i = 0; i < pointsCount; i++) {
      const u = (i / (pointsCount - 1) - 0.5) * packetLength
      const envelope = Math.exp(-Math.pow(u / sigma, 2))

      pPositions[i * 3] = u
      pPositions[i * 3 + 1] = envelope * 0.32 * Math.sin(spatialFreq * u)
      pPositions[i * 3 + 2] = 0

      oPositions[i * 3] = u
      oPositions[i * 3 + 1] = 0
      oPositions[i * 3 + 2] = envelope * 0.18 * Math.cos(spatialFreq * u)

      const coreMix = Math.pow(envelope, 1.5)
      const r = THREE.MathUtils.lerp(threeColor.r, 1.0, coreMix * 0.85)
      const g = THREE.MathUtils.lerp(threeColor.g, 1.0, coreMix * 0.85)
      const b = THREE.MathUtils.lerp(threeColor.b, 1.0, coreMix * 0.85)

      pColors[i * 3] = r
      pColors[i * 3 + 1] = g
      pColors[i * 3 + 2] = b

      oColors[i * 3] = r * 0.8
      oColors[i * 3 + 1] = g * 0.8
      oColors[i * 3 + 2] = b * 0.8
    }

    const pPos = new THREE.BufferAttribute(pPositions, 3)
    const oPos = new THREE.BufferAttribute(oPositions, 3)

    pGeom.setAttribute('position', pPos)
    pGeom.setAttribute('color', new THREE.BufferAttribute(pColors, 3))

    oGeom.setAttribute('position', oPos)
    oGeom.setAttribute('color', new THREE.BufferAttribute(oColors, 3))

    return { primaryGeom: pGeom, orthogonalGeom: oGeom, primaryPosAttr: pPos, orthoPosAttr: oPos }
  }, [color, pointsCount, packetLength, sigma, spatialFreq])

  useDisposableGeometry(primaryGeom)
  useDisposableGeometry(orthogonalGeom)

  const primaryLine = useMemo(
    () =>
      new THREE.Line(
        primaryGeom,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      ),
    [primaryGeom]
  )
  const orthogonalLine = useMemo(
    () =>
      new THREE.Line(
        orthogonalGeom,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
      ),
    [orthogonalGeom]
  )
  useEffect(() => {
    return () => {
      primaryLine.material.dispose()
      orthogonalLine.material.dispose()
    }
  }, [primaryLine, orthogonalLine])

  const defaultFarEntry = useMemo(() => getAbsorptionOrigin(), [])
  const defaultFarExit = useMemo(() => getEmissionDestination(), [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (!visible) {
      groupRef.current.visible = false
      return
    }

    // High frequency internal wave phase oscillation (decorative squiggle only —
    // packet position/opacity below is driven by `progress` and still updates,
    // preserving transition direction and state under reduced motion)
    if (playing && !reducedMotion) {
      wavePhase.current += delta * 24.0 * speed
    }

    let t = 0
    let opacity = 1
    let packetAmplitudeScale = 1.0

    // Resolve electron target / origin in 3D world space
    const targetVec = electronPosition
      ? electronPosition instanceof THREE.Vector3
        ? electronPosition
        : new THREE.Vector3(...electronPosition)
      : new THREE.Vector3(2.5, 1.5, 0.5)

    let startVec: THREE.Vector3
    let endVec: THREE.Vector3

    if (direction === 'absorption') {
      // Absorption: incoming from outside towards the ELECTRON (not nucleus)
      startVec = defaultFarEntry
      endVec = targetVec

      if (progress < 0.48) {
        t = progress / 0.48
        if (t < 0.2) {
          opacity = t / 0.2
        } else if (t > 0.82) {
          // Rapidly compress/dissolve as it enters the electron
          const impactP = (t - 0.82) / 0.18
          opacity = 1.0 - impactP
          packetAmplitudeScale = 1.0 - impactP * 0.5
        } else {
          opacity = 1.0
        }
      } else {
        groupRef.current.visible = false
        return
      }
    } else {
      // Emission: born AT THE ELECTRON (not nucleus), propagates outward
      startVec = targetVec
      endVec = defaultFarExit

      if (progress >= 0.46) {
        t = (progress - 0.46) / 0.54
        if (t < 0.2) {
          // Born from the electron: expands from zero
          const birthP = t / 0.2
          opacity = birthP
          packetAmplitudeScale = THREE.MathUtils.lerp(0.08, 1.0, birthP)
        } else if (t > 0.78) {
          opacity = (1.0 - t) / 0.22
          packetAmplitudeScale = 1.0
        } else {
          opacity = 1.0
          packetAmplitudeScale = 1.0
        }
      } else {
        groupRef.current.visible = false
        return
      }
    }

    groupRef.current.visible = opacity > 0.01

    // Update dynamic oscillating wave vertices
    const pArr = primaryPosAttr.array as Float32Array
    const oArr = orthoPosAttr.array as Float32Array
    const phase = wavePhase.current

    for (let i = 0; i < pointsCount; i++) {
      const u = (i / (pointsCount - 1) - 0.5) * packetLength
      const envelope = Math.exp(-Math.pow(u / sigma, 2)) * packetAmplitudeScale

      pArr[i * 3 + 1] = envelope * 0.32 * Math.sin(spatialFreq * u - phase)
      oArr[i * 3 + 2] = envelope * 0.18 * Math.cos(spatialFreq * u - phase)
    }

    primaryPosAttr.needsUpdate = true
    orthoPosAttr.needsUpdate = true

    // Interpolate current packet coordinate
    const currentPos = new THREE.Vector3().lerpVectors(startVec, endVec, t)
    groupRef.current.position.copy(currentPos)

    // Orient along travel vector
    const travelDir = new THREE.Vector3().subVectors(endVec, startVec).normalize()
    if (travelDir.lengthSq() > 0.001) {
      groupRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), travelDir)
    }

    // Material updates
    if (primaryLineRef.current) {
      const mat = primaryLineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = opacity * 0.95
    }
    if (orthogonalLineRef.current) {
      const mat = orthogonalLineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = opacity * 0.65
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity * 0.98
      const coreScale = packetAmplitudeScale * 0.07
      coreRef.current.scale.set(coreScale, coreScale, coreScale)
    }
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity * 0.45
      const haloScale = packetAmplitudeScale * 0.22
      haloRef.current.scale.set(haloScale, haloScale, haloScale)
    }
    if (glowLightRef.current) {
      glowLightRef.current.intensity = opacity * packetAmplitudeScale * 5.0
    }
  })

  return (
    <group name="photon-wave-packet" ref={groupRef} visible={false}>
      {/* Primary oscillating E-field wave line */}
      <primitive ref={primaryLineRef} object={primaryLine} />

      {/* Orthogonal oscillating B-field wave line */}
      <primitive ref={orthogonalLineRef} object={orthogonalLine} />

      {/* Tiny white-hot central energy centroid */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
      </mesh>

      {/* Atmospheric spectral glow halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Local point light */}
      <pointLight ref={glowLightRef} color={color} intensity={5.0} distance={6.0} />
    </group>
  )
}

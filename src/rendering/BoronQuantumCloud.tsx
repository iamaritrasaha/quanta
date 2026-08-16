import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { sampleBoronDensity } from '../physics/boron'
import { useQuantaStore } from '../state/quantaStore'
import { BoronNucleus } from './BoronNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { getQuantumInteractionPosition } from './transitionCoordinates'
import { useDisposableGeometry } from './useDisposableGeometry'
import { useReducedMotion } from './useReducedMotion'

const DENSITY_KEYS = ['2p', '2p2', '3s', '3p', '3d', '4s', '4p', '4f'] as const
type DensityKey = (typeof DENSITY_KEYS)[number]

/** Maps a Boron level id to one of the eight curated density buffer keys. */
function getDensityKey(levelId: string): DensityKey {
  const configPart = levelId.split('_')[0]
  if ((DENSITY_KEYS as readonly string[]).includes(configPart)) return configPart as DensityKey
  return '2p'
}

export function BoronQuantumCloud() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const boronState = useQuantaStore((s) => s.boron)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)
  const reducedMotion = useReducedMotion()

  const selectedLevelId = boronState.selectedLevelId
  const densityView = boronState.densityView
  const activeTransition = boronState.activeTransition

  const [currentLevel, setCurrentLevel] = useState(selectedLevelId)
  const crossfadeProgress = useRef(1.0)

  const sampleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 4500 : 11000

  const densityBuffers = useMemo(() => {
    const buffers: Record<string, Float32Array> = {}
    DENSITY_KEYS.forEach((key, i) => {
      buffers[`${key}_total`] = sampleBoronDensity(key, sampleCount, 'total', 6001 + i * 3)
      buffers[`${key}_core`] = sampleBoronDensity(key, Math.floor(sampleCount * 0.5), 'core', 6002 + i * 3)
      buffers[`${key}_valence`] = sampleBoronDensity(key, Math.floor(sampleCount * 0.5), 'valence', 6003 + i * 3)
    })
    return buffers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleCount])

  useEffect(() => {
    if (selectedLevelId !== currentLevel) {
      setCurrentLevel(selectedLevelId)
      crossfadeProgress.current = 0.0
    }
  }, [selectedLevelId, currentLevel])

  const groupRef = useRef<THREE.Group>(null!)
  const totalPointsRef = useRef<THREE.Points>(null!)
  const corePointsRef = useRef<THREE.Points>(null!)
  const valencePointsRef = useRef<THREE.Points>(null!)
  const quantumLightRef = useRef<THREE.PointLight>(null!)

  const currentKey = getDensityKey(currentLevel)

  const currentTotalGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(densityBuffers[`${currentKey}_total`], 3))
    return geom
  }, [currentKey, densityBuffers])

  const currentCoreGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(densityBuffers[`${currentKey}_core`], 3))
    return geom
  }, [currentKey, densityBuffers])

  const currentValenceGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(densityBuffers[`${currentKey}_valence`], 3))
    return geom
  }, [currentKey, densityBuffers])

  useDisposableGeometry(currentTotalGeom)
  useDisposableGeometry(currentCoreGeom)
  useDisposableGeometry(currentValenceGeom)

  useFrame((_, delta) => {
    const targetBlend = isQuantum ? 1.0 : 0.0
    modelBlendRef.current = THREE.MathUtils.damp(modelBlendRef.current, targetBlend, 4.0 * speed, delta)

    if (crossfadeProgress.current < 1.0) {
      crossfadeProgress.current = Math.min(1.0, crossfadeProgress.current + delta * 2.2 * speed)
    }

    const quantumOpacity = Math.max(0, Math.min(1, modelBlendRef.current))

    let transitionFieldBrighten = 0
    if (isQuantum && activeTransition && activeTransition.phase === 'interaction') {
      transitionFieldBrighten = 0.35
    }

    const baseAlpha = quantumOpacity * (0.74 + transitionFieldBrighten)

    if (totalPointsRef.current) {
      const mat = totalPointsRef.current.material as THREE.PointsMaterial
      mat.opacity = densityView === 'total' ? baseAlpha : 0
      totalPointsRef.current.visible = densityView === 'total' && baseAlpha > 0.005
      if (playing && !reducedMotion) {
        const time = performance.now() * 0.001 * speed
        const s = 1.0 + Math.sin(time * 1.6) * 0.015 + transitionFieldBrighten * 0.06
        totalPointsRef.current.scale.set(s, s, s)
      }
    }

    if (corePointsRef.current) {
      const mat = corePointsRef.current.material as THREE.PointsMaterial
      mat.opacity = densityView === 'components' ? baseAlpha * 0.88 : 0
      corePointsRef.current.visible = densityView === 'components' && baseAlpha > 0.005
    }

    if (valencePointsRef.current) {
      const mat = valencePointsRef.current.material as THREE.PointsMaterial
      mat.opacity = densityView === 'components' ? baseAlpha * 0.88 : 0
      valencePointsRef.current.visible = densityView === 'components' && baseAlpha > 0.005
    }

    if (quantumLightRef.current) {
      quantumLightRef.current.intensity = (3.2 + transitionFieldBrighten * 4.0) * quantumOpacity
    }

    if (groupRef.current) {
      groupRef.current.visible = quantumOpacity > 0.005
    }
  })

  const interactionPos = useMemo(() => {
    return getQuantumInteractionPosition(currentKey === '2p' ? '2p' : '2s')
  }, [currentKey])

  return (
    <group ref={groupRef} visible={false}>
      {/* ¹¹B Nucleus */}
      <BoronNucleus opacity={0.9} />

      {/* Total Density View: 1s² core + 2s² + directional 2p valence contributions */}
      {currentTotalGeom && (
        <points ref={totalPointsRef}>
          <primitive object={currentTotalGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '2p' ? '#fde68a' : currentKey === '2p2' ? '#facc15' : '#eab308'}
            size={0.05}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Orbital Components View: Core (1s²) in cool silver-sky */}
      {currentCoreGeom && (
        <points ref={corePointsRef}>
          <primitive object={currentCoreGeom} attach="geometry" />
          <pointsMaterial color="#93c5fd" size={0.046} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      )}

      {/* Orbital Components View: 2s²/valence contributions in distinct amber-gold tone
          (open p-subshell directional lobe reads visually distinct from Beryllium's spherical valence) */}
      {currentValenceGeom && (
        <points ref={valencePointsRef}>
          <primitive object={currentValenceGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '2p2' ? '#f59e0b' : currentKey === '4f' ? '#fbbf24' : '#eab308'}
            size={0.052}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      <pointLight ref={quantumLightRef} color="#fcd34d" intensity={3.2} distance={8.5} />

      {isQuantum && activeTransition && (
        <PhotonWavePacket
          visible={true}
          progress={activeTransition.progress}
          direction={activeTransition.type}
          color={activeTransition.physics.displayColor}
          electronPosition={interactionPos}
        />
      )}
    </group>
  )
}

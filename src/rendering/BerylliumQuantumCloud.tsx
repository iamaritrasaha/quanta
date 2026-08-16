import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { sampleBerylliumDensity } from '../physics/beryllium'
import { useQuantaStore } from '../state/quantaStore'
import { BerylliumNucleus } from './BerylliumNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { getQuantumInteractionPosition } from './transitionCoordinates'
import { useDisposableGeometry } from './useDisposableGeometry'
import { useReducedMotion } from './useReducedMotion'

/** Maps a Beryllium level id to one of the six curated density buffer keys. */
function getDensityKey(levelId: string): string {
  const configPart = levelId.split('_')[0]
  if (configPart === '2s2') return '2s2'
  if (configPart === '2s2p') return '2s2p'
  if (configPart === '2p2') return '2p2'
  if (configPart === '2s3s') return '2s3s'
  if (configPart === '2s3p') return '2s3p'
  if (configPart === '2s3d') return '2s3d'
  return '2s2'
}

export function BerylliumQuantumCloud() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const berylliumState = useQuantaStore((s) => s.beryllium)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)
  const reducedMotion = useReducedMotion()

  const selectedLevelId = berylliumState.selectedLevelId
  const densityView = berylliumState.densityView
  const activeTransition = berylliumState.activeTransition

  const [currentLevel, setCurrentLevel] = useState(selectedLevelId)
  const crossfadeProgress = useRef(1.0)

  const sampleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 4500 : 11000

  const densityKeys = ['2s2', '2s2p', '2p2', '2s3s', '2s3p', '2s3d'] as const

  const densityBuffers = useMemo(() => {
    const buffers: Record<string, Float32Array> = {}
    densityKeys.forEach((key, i) => {
      buffers[`${key}_total`] = sampleBerylliumDensity(key, sampleCount, 'total', 5001 + i * 3)
      buffers[`${key}_core`] = sampleBerylliumDensity(key, Math.floor(sampleCount * 0.5), 'core', 5002 + i * 3)
      buffers[`${key}_valence`] = sampleBerylliumDensity(key, Math.floor(sampleCount * 0.5), 'valence', 5003 + i * 3)
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
    return getQuantumInteractionPosition(currentKey === '2s2' ? '2s' : '2p')
  }, [currentKey])

  return (
    <group ref={groupRef} visible={false}>
      {/* ⁹Be Nucleus */}
      <BerylliumNucleus opacity={0.9} />

      {/* Total Density View: 1s² core + 2 valence electron contributions */}
      {currentTotalGeom && (
        <points ref={totalPointsRef}>
          <primitive object={currentTotalGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '2s2' ? '#d8b4fe' : currentKey === '2s2p' || currentKey === '2p2' ? '#a855f7' : '#c084fc'}
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

      {/* Orbital Components View: Two valence electrons in distinct optical tone */}
      {currentValenceGeom && (
        <points ref={valencePointsRef}>
          <primitive object={currentValenceGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '2p2' ? '#f472b6' : currentKey === '2s3d' ? '#fbbf24' : '#a855f7'}
            size={0.052}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      <pointLight ref={quantumLightRef} color="#c4b5fd" intensity={3.2} distance={8.5} />

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

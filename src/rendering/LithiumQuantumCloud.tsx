import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { sampleLithiumDensity } from '../physics/lithium'
import { useQuantaStore } from '../state/quantaStore'
import { LithiumNucleus } from './LithiumNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { getQuantumInteractionPosition } from './transitionCoordinates'

export function LithiumQuantumCloud() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const lithiumState = useQuantaStore((s) => s.lithium)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)

  const selectedLevelId = lithiumState.selectedLevelId
  const densityView = lithiumState.densityView
  const activeTransition = lithiumState.activeTransition

  const [currentLevel, setCurrentLevel] = useState(selectedLevelId)
  const [prevLevel, setPrevLevel] = useState<string | null>(null)
  const crossfadeProgress = useRef(1.0)

  const sampleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 4500 : 11000

  // Pre-sample density buffers for key Lithium configurations
  const densityBuffers = useMemo(() => {
    return {
      '1s2_2s_total': sampleLithiumDensity('1s2_2s', sampleCount, 'total', 501),
      '1s2_2s_core': sampleLithiumDensity('1s2_2s', Math.floor(sampleCount * 0.55), 'core', 502),
      '1s2_2s_valence': sampleLithiumDensity('1s2_2s', Math.floor(sampleCount * 0.45), 'valence', 503),

      '1s2_2p_total': sampleLithiumDensity('1s2_2p', sampleCount, 'total', 601),
      '1s2_2p_core': sampleLithiumDensity('1s2_2p', Math.floor(sampleCount * 0.55), 'core', 602),
      '1s2_2p_valence': sampleLithiumDensity('1s2_2p', Math.floor(sampleCount * 0.45), 'valence', 603),

      '1s2_3s_total': sampleLithiumDensity('1s2_3s', sampleCount, 'total', 701),
      '1s2_3s_core': sampleLithiumDensity('1s2_3s', Math.floor(sampleCount * 0.55), 'core', 702),
      '1s2_3s_valence': sampleLithiumDensity('1s2_3s', Math.floor(sampleCount * 0.45), 'valence', 703),

      '1s2_3d_total': sampleLithiumDensity('1s2_3d', sampleCount, 'total', 801),
      '1s2_3d_core': sampleLithiumDensity('1s2_3d', Math.floor(sampleCount * 0.55), 'core', 802),
      '1s2_3d_valence': sampleLithiumDensity('1s2_3d', Math.floor(sampleCount * 0.45), 'valence', 803),
    }
  }, [sampleCount])

  useEffect(() => {
    if (selectedLevelId !== currentLevel) {
      setPrevLevel(currentLevel)
      setCurrentLevel(selectedLevelId)
      crossfadeProgress.current = 0.0
    }
  }, [selectedLevelId, currentLevel])

  const groupRef = useRef<THREE.Group>(null!)
  const totalPointsRef = useRef<THREE.Points>(null!)
  const corePointsRef = useRef<THREE.Points>(null!)
  const valencePointsRef = useRef<THREE.Points>(null!)
  const quantumLightRef = useRef<THREE.PointLight>(null!)

  // Helper to map levelId to buffer key prefix
  const getBufferKey = (levelId: string) => {
    if (levelId.includes('2p')) return '1s2_2p'
    if (levelId.includes('3s')) return '1s2_3s'
    if (levelId.includes('3d') || levelId.includes('4d') || levelId.includes('4f')) return '1s2_3d'
    if (levelId.includes('3p') || levelId.includes('4p')) return '1s2_2p'
    if (levelId.includes('4s')) return '1s2_3s'
    return '1s2_2s'
  }

  const currentKey = getBufferKey(currentLevel)

  const currentTotalGeom = useMemo(() => {
    const key = `${currentKey}_total` as keyof typeof densityBuffers
    const buffer = densityBuffers[key] ?? densityBuffers['1s2_2s_total']
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
    return geom
  }, [currentKey, densityBuffers])

  const currentCoreGeom = useMemo(() => {
    const key = `${currentKey}_core` as keyof typeof densityBuffers
    const buffer = densityBuffers[key] ?? densityBuffers['1s2_2s_core']
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
    return geom
  }, [currentKey, densityBuffers])

  const currentValenceGeom = useMemo(() => {
    const key = `${currentKey}_valence` as keyof typeof densityBuffers
    const buffer = densityBuffers[key] ?? densityBuffers['1s2_2s_valence']
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
    return geom
  }, [currentKey, densityBuffers])

  useFrame((_, delta) => {
    const targetBlend = isQuantum ? 1.0 : 0.0
    modelBlendRef.current = THREE.MathUtils.damp(
      modelBlendRef.current,
      targetBlend,
      4.0 * speed,
      delta
    )

    if (crossfadeProgress.current < 1.0) {
      crossfadeProgress.current = Math.min(1.0, crossfadeProgress.current + delta * 2.2 * speed)
      if (crossfadeProgress.current >= 1.0) {
        setPrevLevel(null)
      }
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

      if (playing) {
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
    return getQuantumInteractionPosition(currentKey === '1s2_2p' ? '2p' : '2s')
  }, [currentKey])

  return (
    <group ref={groupRef} visible={false}>
      {/* ⁷Li Nucleus */}
      <LithiumNucleus opacity={0.9} />

      {/* Total Density View: 1s² core + valence */}
      {currentTotalGeom && (
        <points ref={totalPointsRef}>
          <primitive object={currentTotalGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '1s2_2s' ? '#fca5a5' : currentKey === '1s2_2p' ? '#f87171' : '#fb923c'}
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
          <pointsMaterial
            color="#93c5fd"
            size={0.046}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Orbital Components View: Valence (2s/2p/3s/3d) in distinct optical tone */}
      {currentValenceGeom && (
        <points ref={valencePointsRef}>
          <primitive object={currentValenceGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '1s2_2p' ? '#f43f5e' : currentKey === '1s2_3d' ? '#fbbf24' : '#ef4444'}
            size={0.052}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Ambient Internal Quantum Light */}
      <pointLight ref={quantumLightRef} color="#fca5a5" intensity={3.2} distance={8.5} />

      {/* Photon Wave Packet in Quantum Mode (no point electron) */}
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

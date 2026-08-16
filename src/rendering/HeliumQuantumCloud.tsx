import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { sampleHeliumDensity } from '../physics/helium'
import { useQuantaStore } from '../state/quantaStore'
import { HeliumNucleus } from './HeliumNucleus'
import { PhotonWavePacket } from './PhotonWavePacket'
import { getQuantumInteractionPosition } from './transitionCoordinates'
import { useDisposableGeometry } from './useDisposableGeometry'
import { useReducedMotion } from './useReducedMotion'

export function HeliumQuantumCloud() {
  const mode = useQuantaStore((s) => s.mode)
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const heliumState = useQuantaStore((s) => s.helium)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)
  const reducedMotion = useReducedMotion()

  const selectedLevelId = heliumState.selectedLevelId
  const densityView = heliumState.densityView
  const activeTransition = heliumState.activeTransition

  const [currentLevel, setCurrentLevel] = useState(selectedLevelId)
  const [prevLevel, setPrevLevel] = useState<string | null>(null)
  const crossfadeProgress = useRef(1.0)

  const sampleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 4000 : 10000

  // Pre-sample density buffers for key Helium configurations
  const densityBuffers = useMemo(() => {
    return {
      '1s2_total': sampleHeliumDensity('1s2', sampleCount, 'total', 101),
      '1s2s_total': sampleHeliumDensity('1s2s', sampleCount, 'total', 202),
      '1s2s_core': sampleHeliumDensity('1s2s', Math.floor(sampleCount / 2), 'core', 203),
      '1s2s_valence': sampleHeliumDensity('1s2s', Math.floor(sampleCount / 2), 'valence', 204),
      '1s2p_total': sampleHeliumDensity('1s2p', sampleCount, 'total', 303),
      '1s2p_core': sampleHeliumDensity('1s2p', Math.floor(sampleCount / 2), 'core', 304),
      '1s2p_valence': sampleHeliumDensity('1s2p', Math.floor(sampleCount / 2), 'valence', 305),
      '1s3d_total': sampleHeliumDensity('1s3d', sampleCount, 'total', 404),
      '1s3d_core': sampleHeliumDensity('1s3d', Math.floor(sampleCount / 2), 'core', 405),
      '1s3d_valence': sampleHeliumDensity('1s3d', Math.floor(sampleCount / 2), 'valence', 406),
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

  // Helper to get buffer key
  const getBufferKey = (levelId: string) => {
    if (levelId === '1s2_1S0') return '1s2'
    if (levelId.startsWith('1s2s')) return '1s2s'
    if (levelId.startsWith('1s2p')) return '1s2p'
    if (levelId.startsWith('1s3d')) return '1s3d'
    if (levelId.startsWith('1s3p')) return '1s2p'
    if (levelId.startsWith('1s3s')) return '1s2s'
    return '1s2'
  }

  const currentKey = getBufferKey(currentLevel)

  const currentTotalGeom = useMemo(() => {
    const key = `${currentKey}_total` as keyof typeof densityBuffers
    const buffer = densityBuffers[key] ?? densityBuffers['1s2_total']
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
    return geom
  }, [currentKey, densityBuffers])

  const currentCoreGeom = useMemo(() => {
    const key = `${currentKey}_core` as keyof typeof densityBuffers
    const buffer = densityBuffers[key] ?? densityBuffers['1s2_total']
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
    return geom
  }, [currentKey, densityBuffers])

  const currentValenceGeom = useMemo(() => {
    const key = `${currentKey}_valence` as keyof typeof densityBuffers
    const buffer = densityBuffers[key] ?? densityBuffers['1s2_total']
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
    return geom
  }, [currentKey, densityBuffers])

  useDisposableGeometry(currentTotalGeom)
  useDisposableGeometry(currentCoreGeom)
  useDisposableGeometry(currentValenceGeom)

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

    const baseAlpha = quantumOpacity * (0.72 + transitionFieldBrighten)

    if (totalPointsRef.current) {
      const mat = totalPointsRef.current.material as THREE.PointsMaterial
      mat.opacity = densityView === 'total' ? baseAlpha : 0
      totalPointsRef.current.visible = densityView === 'total' && baseAlpha > 0.005

      if (playing && !reducedMotion) {
        const time = performance.now() * 0.001 * speed
        const s = 1.0 + Math.sin(time * 1.8) * 0.015 + transitionFieldBrighten * 0.06
        totalPointsRef.current.scale.set(s, s, s)
      }
    }

    if (corePointsRef.current) {
      const mat = corePointsRef.current.material as THREE.PointsMaterial
      mat.opacity = densityView === 'components' ? baseAlpha * 0.85 : 0
      corePointsRef.current.visible = densityView === 'components' && baseAlpha > 0.005
    }

    if (valencePointsRef.current) {
      const mat = valencePointsRef.current.material as THREE.PointsMaterial
      mat.opacity = densityView === 'components' ? baseAlpha * 0.85 : 0
      valencePointsRef.current.visible = densityView === 'components' && baseAlpha > 0.005
    }

    if (quantumLightRef.current) {
      quantumLightRef.current.intensity = (3.0 + transitionFieldBrighten * 4.0) * quantumOpacity
    }

    if (groupRef.current) {
      groupRef.current.visible = quantumOpacity > 0.005
    }
  })

  const interactionPos = useMemo(() => {
    return getQuantumInteractionPosition(currentKey === '1s2' ? '1s' : '2p')
  }, [currentKey])

  return (
    <group ref={groupRef} visible={false}>
      {/* ⁴He Nucleus */}
      <HeliumNucleus opacity={0.9} />

      {/* Total Density View */}
      {currentTotalGeom && (
        <points ref={totalPointsRef}>
          <primitive object={currentTotalGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '1s2' ? '#93c5fd' : '#a5b4fc'}
            size={0.052}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Orbital Components View: Core (1s) in silver-sky */}
      {currentCoreGeom && (
        <points ref={corePointsRef}>
          <primitive object={currentCoreGeom} attach="geometry" />
          <pointsMaterial
            color="#93c5fd"
            size={0.048}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Orbital Components View: Valence in violet/gold */}
      {currentValenceGeom && (
        <points ref={valencePointsRef}>
          <primitive object={currentValenceGeom} attach="geometry" />
          <pointsMaterial
            color={currentKey === '1s2p' ? '#c084fc' : '#fbbf24'}
            size={0.052}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Ambient Internal Quantum Light */}
      <pointLight ref={quantumLightRef} color="#93c5fd" intensity={3.0} distance={8.0} />

      {/* Photon Wave Packet in Quantum Mode (traverses electron cloud, NO point electron) */}
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

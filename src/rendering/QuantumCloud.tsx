import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { sampleOrbital, type UiOrbitalKey } from '../physics/quantum'
import { useQuantaStore } from '../state/quantaStore'
import { PhotonWavePacket } from './PhotonWavePacket'
import { getQuantumInteractionPosition } from './transitionCoordinates'
import { useDisposableGeometry } from './useDisposableGeometry'
import { useReducedMotion } from './useReducedMotion'

const ORBITAL_COLORS: Record<UiOrbitalKey, string> = {
  '1s': '#93c5fd', // Ethereal silver-sky
  '2s': '#a5b4fc', // Cold optical violet-silver
  '2p': '#c084fc', // Spectral lavender
}

export function QuantumCloud({ orbital }: { orbital: UiOrbitalKey | null }) {
  const playing = useQuantaStore((s) => s.playing)
  const speed = useQuantaStore((s) => s.animationSpeed)
  const mode = useQuantaStore((s) => s.mode)
  const activeTransition = useQuantaStore((s) => s.activeTransition)

  const isQuantum = mode === 'quantum'
  const modelBlendRef = useRef(isQuantum ? 1.0 : 0.0)
  const reducedMotion = useReducedMotion()

  const [currentOrbital, setCurrentOrbital] = useState<UiOrbitalKey | null>(orbital)
  const [prevOrbital, setPrevOrbital] = useState<UiOrbitalKey | null>(null)
  const crossfadeProgress = useRef(1.0)

  // Pre-sample accurate point buffers for 1s, 2s, 2p
  const sampleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 4000 : 10000

  const orbitalBuffers = useMemo(() => {
    return {
      '1s': sampleOrbital('1s', sampleCount, 101),
      '2s': sampleOrbital('2s', sampleCount, 202),
      '2p': sampleOrbital('2p', sampleCount, 303),
    }
  }, [sampleCount])

  // Track orbital changes for smooth state crossfade
  useEffect(() => {
    if (orbital !== currentOrbital) {
      setPrevOrbital(currentOrbital)
      setCurrentOrbital(orbital)
      crossfadeProgress.current = 0.0
    }
  }, [orbital, currentOrbital])

  const groupRef = useRef<THREE.Group>(null!)
  const currentPointsRef = useRef<THREE.Points>(null!)
  const prevPointsRef = useRef<THREE.Points>(null!)
  const quantumLightRef = useRef<THREE.PointLight>(null!)

  const currentGeom = useMemo(() => {
    if (!currentOrbital) return null
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(orbitalBuffers[currentOrbital], 3))
    return geom
  }, [currentOrbital, orbitalBuffers])

  const prevGeom = useMemo(() => {
    if (!prevOrbital) return null
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(orbitalBuffers[prevOrbital], 3))
    return geom
  }, [prevOrbital, orbitalBuffers])

  useDisposableGeometry(currentGeom)
  useDisposableGeometry(prevGeom)

  useFrame((_, delta) => {
    // Smoothly damp model transition blend
    const targetBlend = isQuantum && orbital !== null ? 1.0 : 0.0
    modelBlendRef.current = THREE.MathUtils.damp(
      modelBlendRef.current,
      targetBlend,
      4.0 * speed,
      delta
    )

    // Advance crossfade between quantum eigenstates
    if (crossfadeProgress.current < 1.0) {
      crossfadeProgress.current = Math.min(1.0, crossfadeProgress.current + delta * 2.2 * speed)
      if (crossfadeProgress.current >= 1.0) {
        setPrevOrbital(null)
      }
    }

    const quantumOpacity = Math.max(0, Math.min(1, modelBlendRef.current))
    const t = crossfadeProgress.current

    // Global field brightness response during active quantum transitions
    let transitionFieldBrighten = 0
    if (mode === 'quantum' && activeTransition) {
      if (activeTransition.phase === 'interaction') {
        transitionFieldBrighten = 0.35
      }
    }

    const currentAlpha = t * quantumOpacity * (0.72 + transitionFieldBrighten)
    const prevAlpha = (1.0 - t) * quantumOpacity * 0.72

    if (currentPointsRef.current) {
      const mat = currentPointsRef.current.material as THREE.PointsMaterial
      mat.opacity = currentAlpha
      currentPointsRef.current.visible = currentAlpha > 0.005 && currentOrbital !== null

      // Subtle quantum phase fluctuation and breathing
      if (playing && !reducedMotion && currentOrbital !== null) {
        const time = performance.now() * 0.001 * speed
        const subtleScale = 1.0 + Math.sin(time * 1.8) * 0.015 + transitionFieldBrighten * 0.06
        currentPointsRef.current.scale.set(subtleScale, subtleScale, subtleScale)
      }
    }

    if (prevPointsRef.current && prevGeom) {
      const mat = prevPointsRef.current.material as THREE.PointsMaterial
      mat.opacity = prevAlpha
      prevPointsRef.current.visible = prevAlpha > 0.005
    }

    if (quantumLightRef.current) {
      quantumLightRef.current.intensity =
        (2.5 + transitionFieldBrighten * 4.0) * quantumOpacity * (currentOrbital !== null ? 1 : 0)
    }

    if (groupRef.current) {
      groupRef.current.visible = quantumOpacity > 0.005
    }
  })

  const currentColor = currentOrbital ? ORBITAL_COLORS[currentOrbital] : '#93c5fd'
  const prevColor = prevOrbital ? ORBITAL_COLORS[prevOrbital] : '#93c5fd'

  const quantumInteractionPoint = useMemo(() => {
    return getQuantumInteractionPosition(currentOrbital)
  }, [currentOrbital])

  const isQuantumActive = mode === 'quantum' && activeTransition && currentOrbital !== null

  return (
    <group ref={groupRef} visible={false}>
      {/* Current Orbital State Cloud */}
      {currentGeom && (
        <points ref={currentPointsRef}>
          <primitive object={currentGeom} attach="geometry" />
          <pointsMaterial
            color={currentColor}
            size={0.052}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Previous Orbital State Cloud during crossfade */}
      {prevGeom && (
        <points ref={prevPointsRef}>
          <primitive object={prevGeom} attach="geometry" />
          <pointsMaterial
            color={prevColor}
            size={0.052}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Internal ambient field light */}
      <pointLight ref={quantumLightRef} color={currentColor} intensity={2.5} distance={7.0} />

      {/* Photon Wave Packet in Quantum Mode (crosses the electronic field volume, NO point electron) */}
      {isQuantumActive && activeTransition && (
        <PhotonWavePacket
          visible={true}
          progress={activeTransition.progress}
          direction={activeTransition.type}
          color={activeTransition.physics.displayColor}
          electronPosition={quantumInteractionPoint}
        />
      )}
    </group>
  )
}

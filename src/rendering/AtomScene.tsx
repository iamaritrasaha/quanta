import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useQuantaStore } from '../state/quantaStore'
import { BohrAtom } from './BohrAtom'
import { QuantumCloud } from './QuantumCloud'
import { HeliumShell } from './HeliumShell'
import { HeliumQuantumCloud } from './HeliumQuantumCloud'
import { LithiumShell } from './LithiumShell'
import { LithiumQuantumCloud } from './LithiumQuantumCloud'
import { BerylliumShell } from './BerylliumShell'
import { BerylliumQuantumCloud } from './BerylliumQuantumCloud'
import { BoronShell } from './BoronShell'
import { BoronQuantumCloud } from './BoronQuantumCloud'
import { MultiElementAtom } from './MultiElementAtom'
import { getElementByKey } from '../data/elements'

interface SceneManagerProps {
  resetCameraTrigger?: number
}

function SceneManager({ resetCameraTrigger }: SceneManagerProps) {
  const activeElement = useQuantaStore((s) => s.activeElement)
  const orbital = useQuantaStore((s) => s.orbital)
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const { camera } = useThree()
  const selectedElement = getElementByKey(activeElement)

  // Smoothly reset camera when requested
  useEffect(() => {
    if (resetCameraTrigger && resetCameraTrigger > 0) {
      // Flush pending damped gestures before restoring the camera, otherwise a
      // reset during a drag/zoom continues drifting away from the default view.
      const controls = controlsRef.current
      const damping = controls?.enableDamping
      if (controls) {
        controls.enableDamping = false
        controls.update()
      }
      camera.position.set(0, 2.2, 13.5)
      camera.lookAt(0, 0, 0)
      if (controls) {
        controls.target.set(0, 0, 0)
        controls.update()
        controls.enableDamping = damping ?? true
      }
    }
  }, [resetCameraTrigger, camera])

  return (
    <>
      {/* Cold optical graphite background & subtle depth fog */}
      <color attach="background" args={['#080a0f']} />
      <fog attach="fog" args={['#080a0f', 16, 38]} />

      {/* Scientific Instrument Lighting */}
      <ambientLight intensity={0.4} color="#f8fafc" />
      <directionalLight position={[10, 15, 12]} intensity={0.65} color="#f1f5f9" />
      <directionalLight position={[-10, -5, -8]} intensity={0.25} color="#60a5fa" />

      {/* Element-Driven 3D Model Layers */}
      {activeElement === 'hydrogen' ? (
        <>
          <BohrAtom />
          <QuantumCloud orbital={orbital} />
        </>
      ) : activeElement === 'helium' ? (
        <>
          <HeliumShell />
          <HeliumQuantumCloud />
        </>
      ) : activeElement === 'lithium' ? (
        <>
          <LithiumShell />
          <LithiumQuantumCloud />
        </>
      ) : activeElement === 'beryllium' ? (
        <>
          <BerylliumShell />
          <BerylliumQuantumCloud />
        </>
      ) : activeElement === 'boron' ? (
        <>
          <BoronShell />
          <BoronQuantumCloud />
        </>
      ) : selectedElement ? (
        <MultiElementAtom element={selectedElement} />
      ) : null}

      {/* Restrained Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.06}
        minDistance={5.0}
        maxDistance={26.0}
        rotateSpeed={0.65}
        zoomSpeed={0.8}
      />
    </>
  )
}

export function AtomScene({ resetCameraTrigger }: { resetCameraTrigger?: number }) {
  return (
    <Canvas
      dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.8) : 1]}
      camera={{ position: [0, 2.2, 13.5], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      fallback={
        <div className="webgl-fallback">
          <h3>WebGL Unsupported</h3>
          <p>
            Your browser environment does not currently support WebGL rendering.
            QUANTA’s scientific equation engine, level derivations, and spectroscopic calculations
            remain fully operational.
          </p>
        </div>
      }
    >
      <SceneManager resetCameraTrigger={resetCameraTrigger} />
    </Canvas>
  )
}

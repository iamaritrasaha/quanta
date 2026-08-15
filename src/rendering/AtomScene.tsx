import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { sampleOrbital, type OrbitalKey } from '../physics/quantum'
import { useQuantaStore } from '../state/quantaStore'
import { hydrogenTransition, wavelengthToDisplayColor } from '../physics/hydrogen'

function Nucleus() {
 return <group><mesh><sphereGeometry args={[.65,48,48]}/><meshStandardMaterial color="#ff7d6c" emissive="#d52d52" emissiveIntensity={1.5} roughness={.35}/></mesh><pointLight color="#ff8d7a" intensity={9} distance={9}/></group>
}
function BohrAtom() {
 const level=useQuantaStore(s=>s.level), playing=useQuantaStore(s=>s.playing), phase=useQuantaStore(s=>s.phase)
 const electron=useRef<THREE.Mesh>(null!), angle=useRef(0); const radius=2.2 + level * 0.75
 useFrame((_,delta)=>{ if(playing) angle.current+=delta*.9; if(electron.current) electron.current.position.set(Math.cos(angle.current)*radius,Math.sin(angle.current)*radius*.42,Math.sin(angle.current)*radius*.13) })
 const rings=Array.from({length:6},(_,i)=>i+1)
 return <group>
   <Nucleus/>
   {rings.map(n=><mesh key={n} rotation={[Math.PI/2,0,0]}><torusGeometry args={[2.2+n*.75,.012,8,128]}/><meshBasicMaterial color={n===level?'#76e6ff':'#24455c'} transparent opacity={n===level?.9:.32}/></mesh>)}
   <mesh ref={electron}><sphereGeometry args={[.18,24,24]}/><meshStandardMaterial color="#b9f5ff" emissive="#40bfe9" emissiveIntensity={phase==='absorbing'?6:3}/></mesh>
 </group>
}
function QuantumCloud({ orbital }: { orbital:OrbitalKey }) {
 const points=useMemo(()=>sampleOrbital(orbital, window.innerWidth < 700 ? 3500 : 9000),[orbital])
 const ref=useRef<THREE.Points>(null!)
 useFrame(({clock})=>{if(ref.current){ref.current.rotation.y=clock.elapsedTime*.06; ref.current.rotation.z=Math.sin(clock.elapsedTime*.13)*.09}})
 return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry><pointsMaterial color={orbital==='2p'?'#bb8cff':'#61dcff'} size={.045} transparent opacity={.65} depthWrite={false} blending={THREE.AdditiveBlending}/></points>
}
function Photon() {
 const tick=useQuantaStore(s=>s.photonTick), initial=useQuantaStore(s=>s.initialLevel), final=useQuantaStore(s=>s.targetLevel)
 const ref=useRef<THREE.Group>(null!); const born=useRef(0); const active=useRef(0)
 if(active.current!==tick){active.current=tick;born.current=performance.now()}
 const transition=hydrogenTransition(initial,final), color=wavelengthToDisplayColor(transition.wavelengthNm)
 useFrame(()=>{if(ref.current){const t=Math.min(1,(performance.now()-born.current)/1500);ref.current.visible=t<1;ref.current.position.x=1.8+t*12;ref.current.scale.setScalar(.7+t*.8)}})
 return <group ref={ref} visible={false}><mesh><sphereGeometry args={[.16,18,18]}/><meshBasicMaterial color={color}/></mesh><pointLight color={color} intensity={5} distance={5}/></group>
}
function Scene() {
 const mode=useQuantaStore(s=>s.mode), orbital=useQuantaStore(s=>s.orbital)
 const quantum=mode==='quantum'
 return <><color attach="background" args={['#060a12']}/><fog attach="fog" args={['#060a12',16,36]}/><ambientLight intensity={.35}/><Stars radius={75} depth={40} count={700} factor={1.4} saturation={0}/>{quantum?<QuantumCloud orbital={orbital}/>:<BohrAtom/>}<Photon/><OrbitControls enablePan={false} minDistance={6} maxDistance={26} autoRotate={false}/></>
}
export function AtomScene(){ return <Canvas dpr={[1,Math.min(window.devicePixelRatio,1.7)]} camera={{position:[0,2,12],fov:42}} gl={{antialias:true,alpha:false}} fallback={<div className="webgl-fallback">This browser cannot render WebGL. QUANTA’s calculations and controls remain available.</div>}><Scene/></Canvas> }

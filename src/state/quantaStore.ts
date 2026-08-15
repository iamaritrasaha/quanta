import { create } from 'zustand'
import type { OrbitalKey } from '../physics/quantum'
export type ViewMode = 'overview' | 'bohr' | 'quantum' | 'energy' | 'spectra' | 'equations'
export type TransitionPhase = 'idle' | 'absorbing' | 'emitting'
interface QuantaState {
 mode: ViewMode; level: number; initialLevel: number; targetLevel: number; orbital: OrbitalKey; playing: boolean; phase: TransitionPhase; photonTick: number
 setMode:(mode:ViewMode)=>void; setLevel:(level:number)=>void; setInitialLevel:(level:number)=>void; setTargetLevel:(level:number)=>void; setOrbital:(orbital:OrbitalKey)=>void; togglePlaying:()=>void
 excite:()=>void; emit:()=>void; reset:()=>void
}
export const useQuantaStore = create<QuantaState>((set,get)=>({
 mode:'overview', level:1, initialLevel:3, targetLevel:2, orbital:'1s', playing:true, phase:'idle', photonTick:0,
 setMode:mode=>set({mode}), setLevel:level=>set({level}), setInitialLevel:initialLevel=>set({initialLevel}), setTargetLevel:targetLevel=>set({targetLevel}), setOrbital:orbital=>set({orbital}),
 togglePlaying:()=>set(s=>({playing:!s.playing})),
 excite:()=>{ const target=get().targetLevel; set({phase:'absorbing'}); window.setTimeout(()=>set({level:target,phase:'idle'}),650) },
 emit:()=>{ const target=get().targetLevel; set({phase:'emitting',photonTick:get().photonTick+1}); window.setTimeout(()=>set({level:target,phase:'idle'}),650) },
 reset:()=>set({level:1,initialLevel:3,targetLevel:2,orbital:'1s',phase:'idle',playing:true})
}))

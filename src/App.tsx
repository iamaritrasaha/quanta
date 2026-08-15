import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { elements, type Element } from './data/elements'
import { useQuantaStore, type ViewMode } from './state/quantaStore'
import { bohrRadius, formatFrequency, hydrogenEnergy, hydrogenTransition, wavelengthToDisplayColor } from './physics/hydrogen'
import { ORBITALS } from './physics/quantum'
import { Equation } from './components/Equation'
import './styles.css'

const AtomScene = lazy(() => import('./rendering/AtomScene').then(module => ({ default: module.AtomScene })))
const modes: [ViewMode,string,string][] = [['overview','Overview','Hydrogen at a glance'],['bohr','Bohr','Historical / conceptual model'],['quantum','Quantum','Modern probability-based description'],['energy','Energy','Level structure'],['spectra','Spectra','Hydrogen emissions'],['equations','Equations','Calculation inspector']]
const categoryClass=(c:Element['category'])=>c.replace(/ /g,'-')

function Welcome({ enter }:{enter:()=>void}) {
 const [notice,setNotice]=useState<string|null>(null)
 const choose=(element:Element)=>{ if(element.available) enter(); else {setNotice(`${element.name} is coming to QUANTA`);window.setTimeout(()=>setNotice(null),2200)}}
 return <main className="welcome"><header className="masthead"><div><p className="eyebrow">ATOMIC VISUALIZATION / 01</p><h1>QUANTA</h1><p className="tagline">Matter, visualized.</p></div><p className="intro">Explore atomic structure from classical models to quantum mechanics. Hydrogen is the first instrument in a growing library.</p></header>
 <section className="table-shell" aria-label="Interactive periodic table"><div className="periodic-table">{elements.map(el=><button key={el.symbol} className={`element ${categoryClass(el.category)} ${el.available?'available':''}`} style={{gridColumn:el.gridColumn,gridRow:el.gridRow}} onClick={()=>choose(el)} aria-label={`${el.name}, atomic number ${el.number}${el.available?', available':''}`}><small>{el.number}</small><strong>{el.symbol}</strong><span>{el.name}</span>{el.available&&<i>Explore</i>}</button>)}</div>
 <div className="table-footer"><span><b className="dot hydrogen"/> Hydrogen available</span><span><b className="dot"/> 117 elements staged for future releases</span><span>Use the table as a map of what comes next.</span></div></section>
 {notice&&<div className="toast" role="status">{notice}<small>Atomic simulation staged for a future release.</small></div>}
 <footer className="welcome-foot">SCIENTIFIC INTERFACE · V1 / HYDROGEN <span>Visual scale is exaggerated for clarity.</span></footer></main>
}

function LevelDiagram() {
 const level=useQuantaStore(s=>s.level), setLevel=useQuantaStore(s=>s.setLevel)
 return <div className="levels" aria-label="Hydrogen energy levels">{[6,5,4,3,2,1].map(n=><button className={n===level?'selected':''} key={n} onClick={()=>setLevel(n)}><span>n = {n}</span><i/ ><em>{hydrogenEnergy(n).toFixed(3)} eV</em></button>)}<div className="ionization"><span>0 eV</span><i/> ionization limit</div></div>
}
function TransitionPanel() {
 const initial=useQuantaStore(s=>s.initialLevel), target=useQuantaStore(s=>s.targetLevel), setInitial=useQuantaStore(s=>s.setInitialLevel), setTarget=useQuantaStore(s=>s.setTargetLevel), excite=useQuantaStore(s=>s.excite), emit=useQuantaStore(s=>s.emit)
 const transition=useMemo(()=>initial===target?null:hydrogenTransition(initial,target),[initial,target])
 return <section className="panel transition-panel"><p className="panel-kicker">STATE TRANSITION</p><div className="select-row"><label>From<select value={initial} onChange={e=>setInitial(Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label><span>→</span><label>To<select value={target} onChange={e=>setTarget(Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label></div>
 {transition?<><div className="metric"><span>ΔE</span><strong>{transition.deltaEnergyEv.toFixed(3)} eV</strong><small>{transition.direction}</small></div><div className="actions">{transition.direction==='absorption'?<button className="primary" onClick={excite}>ABSORB PHOTON</button>:<button className="primary" onClick={emit}>EMIT PHOTON</button>}</div></>:<p className="muted">Choose two different levels.</p>}</section>
}
function SpectralReadout() {
 const initial=useQuantaStore(s=>s.initialLevel), final=useQuantaStore(s=>s.targetLevel)
 if(initial===final) return <section className="panel"><p className="panel-kicker">SPECTRAL SIGNAL</p><p className="muted">Select a valid transition to resolve a spectral line.</p></section>
 const t=hydrogenTransition(initial,final), color=wavelengthToDisplayColor(t.wavelengthNm)
 const x=Math.max(3,Math.min(97,(t.wavelengthNm-250)/750*100))
 return <section className="panel spectrum"><p className="panel-kicker">SPECTRAL SIGNAL</p><div className="spectrum-strip"><span className="line" style={{left:`${x}%`,background:color,boxShadow:`0 0 16px ${color}`}}/></div><div className="spectrum-labels"><span>UV</span><span>VISIBLE</span><span>IR</span></div><div className="spectra-value"><strong>{t.wavelengthNm.toFixed(1)} nm</strong><span>{t.series} series · {t.band}</span></div><p className="fine-print">{t.band==='visible'?'Approximate visible-light colour.':'Visualization colour — this radiation is not visible to human vision.'}</p></section>
}
function Equations() {
 const initial=useQuantaStore(s=>s.initialLevel), final=useQuantaStore(s=>s.targetLevel), level=useQuantaStore(s=>s.level)
 const t=initial===final?null:hydrogenTransition(initial,final)
 return <section className="panel equations"><p className="panel-kicker">LIVE EQUATION INSPECTOR</p><div><Equation block>{String.raw`E_n = -\\frac{13.598}{n^2}\\,\\mathrm{eV}`}</Equation><p>Current state <b>n = {level}</b> → <b>{hydrogenEnergy(level).toFixed(3)} eV</b></p></div>{t&&<><div><Equation block>{String.raw`\\Delta E = E_f-E_i = ${t.deltaEnergyEv.toFixed(3)}\\,\\mathrm{eV}`}</Equation></div><div><Equation block>{String.raw`\\lambda = \\frac{hc}{|\\Delta E|} = ${t.wavelengthNm.toFixed(2)}\\,\\mathrm{nm}`}</Equation><p>{formatFrequency(t.frequencyHz)} · Rydberg check: {t.rydbergWavelengthNm.toFixed(2)} nm</p></div></>}</section>
}
function QuantumPanel() {
 const orbital=useQuantaStore(s=>s.orbital), setOrbital=useQuantaStore(s=>s.setOrbital)
 const q=ORBITALS[orbital]
 return <section className="panel quantum-panel"><p className="panel-kicker">QUANTUM STATE</p><div className="orbital-pills">{(Object.keys(ORBITALS) as (keyof typeof ORBITALS)[]).map(o=><button key={o} className={o===orbital?'active':''} onClick={()=>setOrbital(o)}>{o}</button>)}</div><div className="quantum-numbers"><span><b>n</b>{q.n}<small>principal</small></span><span><b>l</b>{q.l}<small>{q.l===0?'s orbital':q.l===1?'p orbital':'d orbital'}</small></span><span><b>mₗ</b>{q.m}<small>orientation</small></span><span><b>mₛ</b>+½<small>spin state</small></span></div><Equation block>{String.raw`P(r,\\theta,\\phi)=|\\psi_{nlm}|^2`}</Equation><p className="fine-print">Probability-density visualization — finite display threshold. Points are sampled from the Hydrogenic density, not electron trajectories.</p></section>
}
function Explorer({back}:{back:()=>void}) {
 const mode=useQuantaStore(s=>s.mode), setMode=useQuantaStore(s=>s.setMode), level=useQuantaStore(s=>s.level), playing=useQuantaStore(s=>s.playing), toggle=useQuantaStore(s=>s.togglePlaying), reset=useQuantaStore(s=>s.reset)
 const selected=modes.find(m=>m[0]===mode)!
 return <main className="explorer"><header className="explorer-head"><button className="back" onClick={back}>← TABLE</button><div><p className="eyebrow">ELEMENT 01 / AVAILABLE</p><h2>Hydrogen <span>H</span></h2></div><div className="head-state">ATOMIC NUMBER <b>1</b><small>Protium · 1 proton · 1 electron</small></div></header>
 <nav className="mode-nav" aria-label="Hydrogen exploration mode">{modes.map(([id,label,desc])=><button key={id} className={mode===id?'active':''} onClick={()=>setMode(id)}><span>{label}</span><small>{desc}</small></button>)}</nav>
 <div className="workspace"><section className="scene-wrap"><Suspense fallback={<div className="scene-loading">Preparing atomic field…</div>}><AtomScene/></Suspense><div className="scene-caption"><b>{selected[1]}</b><span>{selected[2]}</span></div><div className="scale-note">VISUAL SCALE EXAGGERATED FOR CLARITY</div><div className="scene-controls"><button onClick={toggle}>{playing?'PAUSE':'PLAY'}</button><button onClick={reset}>RESET</button></div></section>
 <aside className="right-rail">{mode==='quantum'?<QuantumPanel/>:<><section className="panel state-panel"><p className="panel-kicker">CURRENT LEVEL</p><strong>n = {level}</strong><span>{hydrogenEnergy(level).toFixed(3)} eV</span><small>rₙ = {(bohrRadius(level)*1e12).toFixed(1)} pm</small></section><LevelDiagram/><TransitionPanel/></>}{(mode==='spectra'||mode==='bohr'||mode==='energy')&&<SpectralReadout/>}{(mode==='equations'||mode==='bohr'||mode==='energy'||mode==='spectra')&&<Equations/>}{mode==='overview'&&<section className="panel overview"><p className="panel-kicker">HYDROGEN / H</p><p>The simplest atom, and the exact analytic foundation for QUANTA’s first scientific instrument.</p><dl><div><dt>Atomic mass</dt><dd>~1.008 u</dd></div><div><dt>Ground state</dt><dd>1s¹</dd></div><div><dt>Valence electrons</dt><dd>1</dd></div></dl><p className="fine-print">Protium is shown. Deuterium and tritium are planned as isotope extensions.</p></section>}</aside></div>
 <footer className="explorer-foot"><span>Bohr motion is an educational time-expanded illustration.</span><span>Hydrogen is exact; future multi-electron models will use different approximations.</span></footer></main>
}
export default function App() {
 const [view,setView]=useState(()=>location.hash.includes('/element/hydrogen')?'hydrogen':'table')
 useEffect(()=>{const listener=()=>setView(location.hash.includes('/element/hydrogen')?'hydrogen':'table');addEventListener('hashchange',listener);return()=>removeEventListener('hashchange',listener)},[])
 const enter=()=>location.hash='/element/hydrogen'; const back=()=>location.hash='/'
 return view==='hydrogen'?<Explorer back={back}/>:<Welcome enter={enter}/>
}

import { useQuantaStore, type ViewMode } from '../state/quantaStore'

interface ModeDef {
  id: ViewMode
  label: string
  shortDesc: string
}

const HYDROGEN_MODES: ModeDef[] = [
  { id: 'overview', label: 'Overview', shortDesc: 'Element Profile' },
  { id: 'bohr', label: 'Bohr Model', shortDesc: 'Quantized Orbit' },
  { id: 'quantum', label: 'Quantum', shortDesc: 'Wave Density' },
  { id: 'energy', label: 'Energy Levels', shortDesc: 'Eigenvalue Ladder' },
  { id: 'spectra', label: 'Spectra', shortDesc: 'Emission Lines' },
  { id: 'equations', label: 'Equations', shortDesc: 'Mathematical Derivations' },
]

const HELIUM_MODES: ModeDef[] = [
  { id: 'overview', label: 'Overview', shortDesc: 'Many-Body Profile' },
  { id: 'bohr', label: 'Shell Model', shortDesc: 'Pedagogical Shell' },
  { id: 'quantum', label: 'Quantum', shortDesc: 'Reduced Density' },
  { id: 'energy', label: 'Energy Levels', shortDesc: 'Term Diagram' },
  { id: 'spectra', label: 'Spectra', shortDesc: 'Emission Lines' },
  { id: 'equations', label: 'Equations', shortDesc: 'Two-Electron Math' },
]

const LITHIUM_MODES: ModeDef[] = [
  { id: 'overview', label: 'Overview', shortDesc: 'Alkali Profile' },
  { id: 'bohr', label: 'Shell Model', shortDesc: 'Core + Valence' },
  { id: 'quantum', label: 'Quantum', shortDesc: 'Screened Density' },
  { id: 'energy', label: 'Energy Levels', shortDesc: 'Term Multiplets' },
  { id: 'spectra', label: 'Spectra', shortDesc: 'Emission Lines' },
  { id: 'equations', label: 'Equations', shortDesc: 'Many-Body Math' },
]

const BERYLLIUM_MODES: ModeDef[] = [
  { id: 'overview', label: 'Overview', shortDesc: 'Alkaline Earth Profile' },
  { id: 'bohr', label: 'Shell Model', shortDesc: 'Core + 2 Valence' },
  { id: 'quantum', label: 'Quantum', shortDesc: 'Reduced Density' },
  { id: 'energy', label: 'Energy Levels', shortDesc: 'Singlet/Triplet Terms' },
  { id: 'spectra', label: 'Spectra', shortDesc: 'Emission Lines' },
  { id: 'equations', label: 'Equations', shortDesc: 'Four-Electron Math' },
]

export function ModeNavigation() {
  const mode = useQuantaStore((s) => s.mode)
  const activeElement = useQuantaStore((s) => s.activeElement)
  const setMode = useQuantaStore((s) => s.setMode)

  const modes =
    activeElement === 'hydrogen'
      ? HYDROGEN_MODES
      : activeElement === 'helium'
      ? HELIUM_MODES
      : activeElement === 'lithium'
      ? LITHIUM_MODES
      : BERYLLIUM_MODES

  return (
    <nav className="mode-navigation glass-capsule" aria-label={`${activeElement === 'hydrogen' ? 'Hydrogen' : 'Helium'} Exploration Modes`}>
      <div className="mode-capsule-track">
        {modes.map((m) => {
          const isActive = mode === m.id
          return (
            <button
              key={m.id}
              className={`mode-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setMode(m.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="mode-tab-label">{m.label}</span>
              <span className="mode-tab-desc">{m.shortDesc}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

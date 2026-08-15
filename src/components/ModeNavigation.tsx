import { useQuantaStore, type ViewMode } from '../state/quantaStore'

interface ModeDef {
  id: ViewMode
  label: string
  shortDesc: string
}

const MODES: ModeDef[] = [
  { id: 'overview', label: 'Overview', shortDesc: 'Element Profile' },
  { id: 'bohr', label: 'Bohr Model', shortDesc: 'Quantized Orbit' },
  { id: 'quantum', label: 'Quantum', shortDesc: 'Wave Density' },
  { id: 'energy', label: 'Energy Levels', shortDesc: 'Eigenvalue Ladder' },
  { id: 'spectra', label: 'Spectra', shortDesc: 'Emission Lines' },
  { id: 'equations', label: 'Equations', shortDesc: 'Mathematical Derivations' },
]

export function ModeNavigation() {
  const mode = useQuantaStore((s) => s.mode)
  const setMode = useQuantaStore((s) => s.setMode)

  return (
    <nav className="mode-navigation glass-capsule" aria-label="Hydrogen Exploration Modes">
      <div className="mode-capsule-track">
        {MODES.map((m) => {
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

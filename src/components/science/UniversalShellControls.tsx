import type { Element } from '../../data/elements'
import {
  getAtomicProperties,
  getConfigurationElectronCount,
} from '../../data/atomicData'
import { groundModel, type ModelShell } from '../../physics/elementModel'
import { getElementStates } from '../../data/elementStates'
import { useQuantaStore } from '../../state/quantaStore'

interface UniversalShellControlsProps {
  element: Element
}

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']

function ShellOccupancyBars({ shells }: { shells: ModelShell[] }) {
  const maxElectrons = Math.max(...shells.map((s) => s.electrons), 1)

  return (
    <div className="atomic-shell-list" aria-label="Electron count by principal shell">
      {shells.map(({ shell, electrons }) => (
        <div className="atomic-shell-row" key={shell}>
          <span className="atomic-shell-name">
            {SHELL_NAMES[shell - 1] ?? `n=${shell}`} · n={shell}
          </span>
          <div className="atomic-shell-bar" aria-hidden="true">
            <span style={{ width: `${(electrons / maxElectrons) * 100}%` }} />
          </div>
          <strong>{electrons} e⁻</strong>
        </div>
      ))}
    </div>
  )
}

export function UniversalShellControls({ element }: UniversalShellControlsProps) {
  const selectedState = useQuantaStore((s) => s.sharedElement.selected)
  const isTransitioning = useQuantaStore((s) => Boolean(s.sharedElement.activeTransition))
  const selectState = useQuantaStore((s) => s.selectElementState)
  const selected = selectedState ?? groundModel(element.symbol)
  const properties = getAtomicProperties(element.symbol)
  const allStates = getElementStates(element.symbol)
  const electronCount = properties
    ? getConfigurationElectronCount(properties.electronConfiguration)
    : element.number

  const outerShell = selected.shells[selected.shells.length - 1]?.shell ?? 1
  const outerElectrons = selected.shells[selected.shells.length - 1]?.electrons ?? 0

  return (
    <div className="bohr-pane" aria-label={`${element.name} Shell Model Controls`}>
      <div className="bohr-state-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">PEDAGOGICAL SHELL MODEL</span>
          <span className="provenance-tag">IDEALIZED SHELL REPRESENTATION</span>
        </div>

        <h3 className="card-title">{element.name} Principal Shells</h3>

        <div className="bohr-metrics-grid">
          <div className="b-metric">
            <span className="b-label">Outer Shell</span>
            <strong className="b-val">
              {SHELL_NAMES[outerShell - 1] ?? `n=${outerShell}`} (n = {outerShell})
            </strong>
          </div>
          <div className="b-metric">
            <span className="b-label">Total Electrons</span>
            <strong className="b-val">{electronCount} e⁻</strong>
          </div>
          <div className="b-metric">
            <span className="b-label">Outer Population</span>
            <strong className="b-val">{outerElectrons} e⁻</strong>
          </div>
        </div>

        <p className="card-desc mono-config">
          {selected.label} · {selected.configuration}
        </p>

        <ShellOccupancyBars shells={selected.shells} />

        {/* State Presets Selector */}
        {allStates.length > 1 && (
          <div className="state-presets-container" style={{ marginTop: '1rem' }}>
            <span className="b-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
              SELECT ATOMIC STATE
            </span>
            <div className="preset-buttons-row" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
              {allStates.slice(0, 4).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className={`preset-btn ${selected.id === st.id ? 'active' : ''}`}
                  disabled={isTransitioning}
                  onClick={() => selectState(st)}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                >
                  {st.id === 'ground' ? 'Ground' : st.label.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="atomic-model-note" style={{ marginTop: '0.8rem' }}>
          Orbital rings and moving point markers are pedagogical representations of principal
          shells. In modern quantum mechanics, electrons do not follow deterministic circular paths.
        </p>
      </div>
    </div>
  )
}

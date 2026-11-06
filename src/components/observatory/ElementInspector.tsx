import { elementKey, CATEGORY_LABELS, type Element } from '../../data/elements'
import { getShellOccupancy, type AtomicProperties } from '../../data/atomicData'
import type { ElementKey } from '../../state/quantaStore'
import { ShellDiagram } from './ShellDiagram'

interface ElementInspectorProps {
  element: Element
  properties?: AtomicProperties
  onSelectElement: (key: ElementKey) => void
  isEmbedded?: boolean
}

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
}

function formatConfiguration(conf: string): string {
  return conf.replace(/([spdf])(\d+)/g, (_, sub, num) => {
    const superNum = num
      .split('')
      .map((d: string) => SUPERSCRIPTS[d] ?? d)
      .join('')
    return `${sub}${superNum}`
  })
}

export function ElementInspector({
  element,
  properties,
  onSelectElement,
  isEmbedded = false,
}: ElementInspectorProps) {
  const isDedicated = element.number <= 5
  const config = properties?.electronConfiguration ?? ''
  const formattedConfig = config ? formatConfiguration(config) : 'Configuration pending'
  const shellOccupancy = config ? getShellOccupancy(config) : []

  const periodGroupLabel =
    element.category === 'lanthanide'
      ? 'Period 6 · Lanthanoid Series'
      : element.category === 'actinide'
      ? 'Period 7 · Actinoid Series'
      : `Period ${element.period} · Group ${element.group}`

  return (
    <article
      className={`element-inspector glass-surface ${isEmbedded ? 'inspector-embedded' : 'inspector-docked'}`}
      aria-label={`Detailed inspector for ${element.name}`}
    >
      {/* Column 1: Identity & Primary Action */}
      <div className="inspector-col-identity">
        <div className="inspector-meta-row">
          <span className="inspector-atomic-badge">Z = {element.number}</span>
          <span className={`inspector-category-pill ${element.category.replace(/\s+/g, '-')}`}>
            {CATEGORY_LABELS[element.category]}
          </span>
          <span className="inspector-period-group">{periodGroupLabel}</span>
        </div>

        <div className="inspector-identity-block">
          <div className="inspector-symbol-wrap">
            <span className="inspector-hero-symbol">{element.symbol}</span>
          </div>
          <div className="inspector-titles">
            <h2 className="inspector-element-name">{element.name}</h2>
            <div className="inspector-mass-wrap">
              <span className="inspector-mass-label">Weight:</span>
              <strong className="inspector-atomic-mass">
                {properties?.atomicMassU ? `${properties.atomicMassU} u` : 'Standard mass pending'}
              </strong>
            </div>
          </div>
        </div>

        <div className="inspector-actions">
          <button
            type="button"
            className="inspector-explore-btn"
            onClick={() => onSelectElement(elementKey(element))}
            aria-label={`Open interactive instrument for ${element.name}`}
          >
            <span>EXPLORE {element.name.toUpperCase()}</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Column 2: Ground State Configuration & Physical Properties */}
      <div className="inspector-col-physics">
        <div className="inspector-data-item">
          <span className="inspector-data-label">Ground State Configuration</span>
          <div className="inspector-config-text">{formattedConfig}</div>
        </div>

        <div className="inspector-properties-row">
          <div className="property-chip">
            <span className="chip-key">Standard State</span>
            <strong className="chip-val">{properties?.standardState || 'Not listed'}</strong>
          </div>
          <div className="property-chip">
            <span className="chip-key">1st Ionization</span>
            <strong className="chip-val">
              {properties?.ionizationEnergyEv ? `${properties.ionizationEnergyEv} eV` : 'Not listed'}
            </strong>
          </div>
          <div className="property-chip">
            <span className="chip-key">Electronegativity</span>
            <strong className="chip-val">
              {properties?.electronegativityPauling ? `${properties.electronegativityPauling} (Pauling)` : 'Not listed'}
            </strong>
          </div>
        </div>

        <div className="inspector-instrument-badge">
          <span className="instrument-dot" />
          <span className="instrument-desc">
            {isDedicated
              ? 'Dedicated 3D Quantum Wavefunction Instrument · Interactive Orbitals'
              : 'NIST ASD Neutral Atom Reference Levels · Derived Spectroscopy'}
          </span>
        </div>
      </div>

      {/* Column 3: Bohr Shell Architecture */}
      <div className="inspector-col-diagram">
        <ShellDiagram occupancy={shellOccupancy} symbol={element.symbol} size={isEmbedded ? 100 : 115} />
      </div>
    </article>
  )
}

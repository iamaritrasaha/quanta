import type { Element } from '../../data/elements'
import {
  ATOMIC_PROPERTIES_SOURCE,
  ATOMIC_PROPERTIES_SOURCE_URL,
  getAtomicProperties,
  getShellOccupancy,
} from '../../data/atomicData'
import { getElementProfile } from '../../data/elementProfiles'

interface UniversalOverviewProps {
  element: Element
}

function formatValue(value: string | undefined, suffix: string): string {
  if (!value || value.trim() === '') return 'Not listed'
  return `${value} ${suffix}`
}

export function UniversalOverview({ element }: UniversalOverviewProps) {
  const properties = getAtomicProperties(element.symbol)
  const profile = getElementProfile(element.symbol)
  const shells = properties ? getShellOccupancy(properties.electronConfiguration) : []
  const shellStr = shells.map((s) => s.electrons).join(' · ')

  const isPredicted =
    properties?.standardState?.toLowerCase().includes('expected') ||
    profile.modelTier === 'tierD'

  const provenanceTag =
    profile.modelTier === 'tierD'
      ? 'THEORETICAL PREDICTION'
      : 'NIST / PUBCHEM REFERENCE'

  return (
    <div className="overview-pane" aria-label={`${element.name} Scientific Overview`}>
      <div className="overview-card glass-instrument">
        <div className="card-kicker-row">
          <span className="card-kicker">
            ELEMENT {String(element.number).padStart(2, '0')} ·{' '}
            {element.category.toUpperCase()}
          </span>
          <span className="provenance-tag">{provenanceTag}</span>
        </div>

        <h3 className="card-title">
          {element.name} ({element.symbol} · {element.number})
        </h3>

        <p className="card-desc">{profile.physicalIdentity}</p>

        {/* Conceptual Contrast Banner */}
        <div className="many-body-contrast-box" aria-label="Atomic Structure Comparison">
          <div className="contrast-item">
            <span className="contrast-label">{profile.distinctiveBehavior.contrastLabel}</span>
            <span className="contrast-val">{profile.distinctiveBehavior.contrastVal}</span>
          </div>
          <div className="contrast-divider">vs</div>
          <div className="contrast-item highlight">
            <span className="contrast-label">{profile.distinctiveBehavior.currentLabel}</span>
            <span className="contrast-val">{profile.distinctiveBehavior.currentVal}</span>
          </div>
        </div>

        {/* Authoritative Data Table */}
        <div className="data-table">
          <div className="data-row">
            <span className="data-key">Atomic Number (Z)</span>
            <strong className="data-val">{element.number}</strong>
          </div>
          <div className="data-row">
            <span className="data-key">Standard Mass</span>
            <strong className="data-val">
              {formatValue(properties?.atomicMassU, 'u')}
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Ground Electronic Configuration</span>
            <strong className="data-val mono-config">
              {properties?.electronConfiguration ?? 'Not available'}
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Spectroscopic Ground Term</span>
            <strong className="data-val">{profile.groundTerm}</strong>
          </div>
          <div className="data-row">
            <span className="data-key">First Ionization Energy</span>
            <strong className="data-val">
              {formatValue(properties?.ionizationEnergyEv, 'eV')}
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Electronegativity (Pauling)</span>
            <strong className="data-val">
              {properties?.electronegativityPauling || 'Not listed'}
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Atomic Radius</span>
            <strong className="data-val">
              {formatValue(properties?.atomicRadiusPm, 'pm')}
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Shell Distribution (K → Q)</span>
            <strong className="data-val">{shellStr ? `${shellStr} e⁻` : 'Not available'}</strong>
          </div>
          <div className="data-row">
            <span className="data-key">
              {isPredicted ? 'Predicted Standard State' : 'Standard State'}
            </span>
            <strong className="data-val">
              {properties?.standardState || 'Not listed'}
            </strong>
          </div>
          <div className="data-row">
            <span className="data-key">Discovery</span>
            <strong className="data-val">{profile.historicalContext}</strong>
          </div>
        </div>

        <p className="atomic-source-note">
          Reference source:{' '}
          <a
            href={ATOMIC_PROPERTIES_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ATOMIC_PROPERTIES_SOURCE}
          </a>
          . Blank entries are displayed as not listed without fabrication.
        </p>
      </div>
    </div>
  )
}

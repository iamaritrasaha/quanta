import { useMemo, useState } from 'react'
import type { Element } from '../data/elements'
import {
  ATOMIC_PROPERTIES_SOURCE,
  ATOMIC_PROPERTIES_SOURCE_URL,
  getAtomicProperties,
  getConfigurationElectronCount,
  getShellOccupancy,
  type AtomicProperties,
} from '../data/atomicData'
import { calculateLevelSeparation, getNistLevels, NIST_LEVELS_SOURCE, NIST_LEVELS_SOURCE_URL, type AtomicLevel } from '../data/atomicLevels'
import type { ViewMode } from '../state/quantaStore'

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']

function formatSourceNumber(value: string, suffix: string): string {
  return value ? `${value} ${suffix}` : 'Not listed'
}

function getSpectralRegion(wavelengthNm: number): string {
  if (wavelengthNm < 10) return 'X-ray / extreme ultraviolet'
  if (wavelengthNm < 400) return 'Ultraviolet'
  if (wavelengthNm <= 700) return 'Visible'
  return 'Infrared'
}

function LevelName({ level }: { level: AtomicLevel }) {
  return <>{level.configuration} {level.term} (J = {level.j})</>
}

function ConfigurationSource({ properties }: { properties: AtomicProperties }) {
  if (!properties.configurationSource) return null
  return (
    <p className="atomic-source-note">
      Configuration source: <a href={properties.configurationSourceUrl} target="_blank" rel="noopener noreferrer">{properties.configurationSource}</a>.
    </p>
  )
}

function NistUnavailable({ symbol, levelCount = 0 }: { symbol: string; levelCount?: number }) {
  if (levelCount === 1) {
    return (
      <div className="atomic-data-notice" role="status">
        <strong>Only one bound neutral-atom level is listed for {symbol} in this reference set.</strong>
        <span>Two bound levels are needed to derive a transition wavelength.</span>
      </div>
    )
  }

  return (
    <div className="atomic-data-notice" role="status">
      <strong>Neutral-atom energy levels are not listed for {symbol} in this reference set.</strong>
      <span>No levels or spectral wavelengths are inferred when reference levels are unavailable.</span>
    </div>
  )
}

function ShellOccupancy({ configuration, isQuantumView = false }: { configuration: string; isQuantumView?: boolean }) {
  const shells = getShellOccupancy(configuration)
  const maxElectrons = Math.max(...shells.map((shell) => shell.electrons), 1)

  return (
    <div className="atomic-shell-list" aria-label="Electron count by principal shell">
      {shells.map(({ shell, electrons }) => (
        <div className="atomic-shell-row" key={shell}>
          <span className="atomic-shell-name">{SHELL_NAMES[shell - 1] ?? `n=${shell}`} · n={shell}</span>
          <div className="atomic-shell-bar" aria-hidden="true">
            <span style={{ width: `${(electrons / maxElectrons) * 100}%` }} />
          </div>
          <strong>{electrons} e⁻</strong>
        </div>
      ))}
      <p className="atomic-model-note">
        {isQuantumView
          ? 'Occupancy is grouped by principal shell from the published configuration. This display is not a many-electron wavefunction or electron probability density.'
          : 'Shell totals are parsed from the published ground-state configuration. Rings and counts are an idealized occupancy model, not classical electron paths.'}
      </p>
    </div>
  )
}

export function MultiElementInstrument({ element, mode }: { element: Element; mode: ViewMode }) {
  const properties = getAtomicProperties(element.symbol)
  const nist = getNistLevels(element.symbol)
  const levels = useMemo(
    () => [...nist.levels].sort((a, b) => a.energyCm - b.energyCm),
    [nist.levels]
  )
  const [lowerIndex, setLowerIndex] = useState(0)
  const [upperIndex, setUpperIndex] = useState(1)

  if (!properties) {
    return <div className="atomic-data-notice">Reference properties are not available for this element.</div>
  }

  const lowerLevel = levels[lowerIndex]
  const availableUpperLevels = levels
    .map((level, index) => ({ level, index }))
    .filter(({ level, index }) => index > lowerIndex && level.energyCm > (lowerLevel?.energyCm ?? -1))
  const availableLowerLevels = levels
    .map((level, index) => ({ level, index }))
    .filter(({ level, index }) => levels.slice(index + 1).some((upper) => upper.energyCm > level.energyCm))
  const hasDerivedPair = availableLowerLevels.length > 0
  const selectedUpper = availableUpperLevels.some(({ index }) => index === upperIndex)
    ? levels[upperIndex]
    : availableUpperLevels[0]?.level
  const selectedUpperIndex = availableUpperLevels.find(({ level }) => level === selectedUpper)?.index
  const separation = calculateLevelSeparation(lowerLevel, selectedUpper)
  const transitionWavenumber = separation?.wavenumberCm
  const transitionWavelengthNm = separation?.wavelengthNm
  const transitionEnergyEv = separation?.energyEv
  const electronCount = getConfigurationElectronCount(properties.electronConfiguration)

  if (mode === 'bohr' || mode === 'quantum') {
    return (
      <section className="multi-element-panel">
        <div className="instrument-card glass-instrument">
          <span className="card-kicker">{mode === 'bohr' ? 'SHELL OCCUPANCY MODEL' : 'CONFIGURATION VIEW'}</span>
          <h3 className="card-title">{element.name} electron distribution</h3>
          <p className="card-desc mono-config">{properties.electronConfiguration}</p>
          <ShellOccupancy configuration={properties.electronConfiguration} isQuantumView={mode === 'quantum'} />
          <div className="atomic-count-check">
            <span>Configuration electron count</span>
            <strong>{electronCount} / {element.number}</strong>
          </div>
          <ConfigurationSource properties={properties} />
        </div>
      </section>
    )
  }

  if (mode === 'energy') {
    return (
      <section className="multi-element-panel">
        <div className="instrument-card glass-instrument">
          <span className="card-kicker">NIST ASD · NEUTRAL {element.symbol} I</span>
          <h3 className="card-title">Reference energy levels</h3>
          {levels.length ? (
            <>
              <p className="card-desc">Energies are listed relative to the neutral atom ground state in cm⁻¹.</p>
              <div className="atomic-level-list">
                {levels.map((level, index) => (
                  <div className="atomic-level-row" key={`${level.configuration}-${level.term}-${level.j}-${level.energyCm}`}>
                    <span className="atomic-level-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="atomic-level-term"><LevelName level={level} /></span>
                    <strong>{level.energyCm.toLocaleString('en-US', { maximumFractionDigits: 7 })}</strong>
                    <small>cm⁻¹</small>
                  </div>
                ))}
                {nist.ionizationLimitCm !== undefined && (
                  <div className="atomic-level-row atomic-limit-row">
                    <span className="atomic-level-number">∞</span>
                    <span className="atomic-level-term">Ionization limit</span>
                    <strong>{nist.ionizationLimitCm.toLocaleString('en-US', { maximumFractionDigits: 7 })}</strong>
                    <small>cm⁻¹</small>
                  </div>
                )}
              </div>
              <p className="atomic-source-note">
                First {levels.length} bound levels returned by{' '}
                <a href={NIST_LEVELS_SOURCE_URL} target="_blank" rel="noopener noreferrer">{NIST_LEVELS_SOURCE}</a>.
                {nist.ionizationLimitCm !== undefined && ' The ionization limit is shown separately from bound states.'}
              </p>
            </>
          ) : (
            <NistUnavailable symbol={element.symbol} />
          )}
        </div>
      </section>
    )
  }

  if (mode === 'spectra') {
    return (
      <section className="multi-element-panel">
        <div className="instrument-card glass-instrument">
          <span className="card-kicker">VACUUM WAVELENGTH FROM LEVEL DIFFERENCE</span>
          <h3 className="card-title">Wavelength from levels</h3>
          {levels.length < 2 ? (
            <NistUnavailable symbol={element.symbol} levelCount={levels.length} />
          ) : !hasDerivedPair ? (
            <div className="atomic-data-notice" role="status">
              <strong>No pair of distinct bound energies is available for {element.symbol}.</strong>
              <span>No transition wavelength is calculated from equal-energy levels.</span>
            </div>
          ) : (
            <>
              <p className="card-desc">
                Choose two NIST ASD levels. The vacuum wavelength is calculated from their energy difference; the pair is not checked against transition selection rules, and the result is not an observed line or intensity.
              </p>
              <label className="atomic-select-label" htmlFor="atomic-lower-level">Lower level</label>
              <select
                id="atomic-lower-level"
                className="atomic-level-select"
                value={lowerIndex}
                onChange={(event) => {
                  const nextLower = Number(event.target.value)
                  setLowerIndex(nextLower)
                  const nextUpper = levels.findIndex((level, index) => index > nextLower && level.energyCm > levels[nextLower].energyCm)
                  setUpperIndex(nextUpper)
                }}
              >
                {availableLowerLevels.map(({ level, index }) => (
                  <option key={`${level.energyCm}-${index}`} value={index}>
                    {level.configuration} {level.term}, J={level.j} · {level.energyCm.toFixed(3)} cm⁻¹
                  </option>
                ))}
              </select>
              <label className="atomic-select-label" htmlFor="atomic-upper-level">Upper level</label>
              <select
                id="atomic-upper-level"
                className="atomic-level-select"
                value={selectedUpperIndex ?? ''}
                onChange={(event) => setUpperIndex(Number(event.target.value))}
              >
                {availableUpperLevels.map(({ level, index }) => (
                  <option key={`${level.energyCm}-${index}`} value={index}>
                    {level.configuration} {level.term}, J={level.j} · {level.energyCm.toFixed(3)} cm⁻¹
                  </option>
                ))}
              </select>
              {transitionWavelengthNm && transitionEnergyEv && selectedUpper && (
                <div className="atomic-transition-result">
                  <span className="card-kicker">DERIVED VACUUM WAVELENGTH · NIST ASD ENERGIES</span>
                  <strong>{transitionWavelengthNm < 0.01 ? transitionWavelengthNm.toExponential(3) : transitionWavelengthNm.toLocaleString('en-US', { maximumFractionDigits: 4 })} nm</strong>
                  <span>{getSpectralRegion(transitionWavelengthNm)}</span>
                  <small>ΔE = {transitionEnergyEv.toPrecision(6)} eV · Δṽ = {transitionWavenumber?.toFixed(5)} cm⁻¹</small>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    )
  }

  if (mode === 'equations') {
    return (
      <section className="multi-element-panel">
        <div className="instrument-card glass-instrument">
          <span className="card-kicker">REFERENCE RELATIONS</span>
          <h3 className="card-title">Atomic quantities</h3>
          <div className="atomic-equation-block">
            <strong>Neutral atom</strong>
            <code>Z = {element.number}, Nₑ = {electronCount}</code>
            <span>Electron count comes from the listed ground-state configuration.</span>
          </div>
          <div className="atomic-equation-block">
            <strong>Level separation</strong>
            <code>ΔE = hc/λᵥₐc</code>
            <span>For levels reported in cm⁻¹: λᵥₐc (nm) = 10⁷ / Δṽ (cm⁻¹).</span>
          </div>
          <div className="atomic-equation-block">
            <strong>Source properties</strong>
            <code>χ = {properties.electronegativityPauling || '—'} · I₁ = {properties.ionizationEnergyEv || '—'} eV</code>
            <span>Values are transcribed from <a href={ATOMIC_PROPERTIES_SOURCE_URL} target="_blank" rel="noopener noreferrer">{ATOMIC_PROPERTIES_SOURCE}</a>; blank source fields remain blank.</span>
          </div>
          <p className="atomic-source-note">
            Wavelengths are calculated from the selected level pair. Transition probabilities and observed line strengths are not inferred.
          </p>
        </div>
      </section>
    )
  }

  const shellPopulation = getShellOccupancy(properties.electronConfiguration)

  return (
    <section className="multi-element-panel">
      <div className="instrument-card glass-instrument">
        <span className="card-kicker">ELEMENT IDENTITY</span>
        <h3 className="card-title">{element.name} ({element.symbol} · {element.number})</h3>
        <p className="card-desc">
          {element.category} · Period {element.period}
          {element.category !== 'lanthanide' && element.category !== 'actinide' ? ` · Group ${element.group}` : ''}
        </p>
        <div className="data-table">
          <div className="data-row"><span className="data-key">Atomic mass</span><strong className="data-val">{formatSourceNumber(properties.atomicMassU, 'u')}</strong></div>
          <div className="data-row"><span className="data-key">Ground configuration</span><strong className="data-val">{properties.electronConfiguration}</strong></div>
          <div className="data-row"><span className="data-key">First ionization energy</span><strong className="data-val">{formatSourceNumber(properties.ionizationEnergyEv, 'eV')}</strong></div>
          <div className="data-row"><span className="data-key">Electronegativity</span><strong className="data-val">{properties.electronegativityPauling || 'Not listed'} (Pauling)</strong></div>
          <div className="data-row"><span className="data-key">Shell population</span><strong className="data-val">{shellPopulation.map((shell) => shell.electrons).join(' · ')} e⁻</strong></div>
          <div className="data-row"><span className="data-key">{properties.standardState.startsWith('Expected') ? 'Predicted state (source)' : 'Standard state'}</span><strong className="data-val">{properties.standardState || 'Not listed'}</strong></div>
          <div className="data-row"><span className="data-key">Melting point</span><strong className="data-val">{formatSourceNumber(properties.meltingPointK, 'K')}</strong></div>
          <div className="data-row"><span className="data-key">Boiling point</span><strong className="data-val">{formatSourceNumber(properties.boilingPointK, 'K')}</strong></div>
          <div className="data-row"><span className="data-key">Electron affinity</span><strong className="data-val">{formatSourceNumber(properties.electronAffinityEv, 'eV')}</strong></div>
        </div>
        <p className="atomic-source-note">
          Element properties: <a href={ATOMIC_PROPERTIES_SOURCE_URL} target="_blank" rel="noopener noreferrer">{ATOMIC_PROPERTIES_SOURCE}</a>.
          {' '}Blank source entries are shown as not listed.
        </p>
        <ConfigurationSource properties={properties} />
      </div>
    </section>
  )
}

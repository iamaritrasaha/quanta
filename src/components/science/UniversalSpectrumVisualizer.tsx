import { useMemo, useState } from 'react'
import type { Element } from '../../data/elements'
import {
  calculateLevelSeparation,
  getNistLevels,
  NIST_LEVELS_SOURCE,
  type AtomicLevel,
} from '../../data/atomicLevels'
import { getElementProfile } from '../../data/elementProfiles'
import { referenceModel } from '../../data/elementStates'
import { groundModel } from '../../physics/elementModel'
import { useQuantaStore } from '../../state/quantaStore'
import { SpectrumInstrumentHeader } from './SpectrumInstrumentHeader'
import { SpectralHeroResult } from './SpectralHeroResult'
import { SpectralRegionBadge } from './SpectralRegionBadge'
import { InstrumentFooter } from './InstrumentFooter'

interface UniversalSpectrumVisualizerProps {
  element: Element
}

function wavelengthToPercent(wavelengthNm: number): number {
  if (wavelengthNm <= 100) return 3
  if (wavelengthNm >= 2000) return 97

  if (wavelengthNm < 380) {
    // UV range: 100nm -> 380nm maps to 4% -> 26%
    return 4 + ((wavelengthNm - 100) / (380 - 100)) * 22
  } else if (wavelengthNm <= 740) {
    // Visible range: 380nm -> 740nm maps to 26% -> 74%
    return 26 + ((wavelengthNm - 380) / (740 - 380)) * 48
  } else {
    // IR range: 740nm -> 2000nm maps to 74% -> 96%
    return 74 + ((wavelengthNm - 740) / (2000 - 740)) * 22
  }
}

function getSpectralRegion(wavelengthNm: number): string {
  if (wavelengthNm < 10) return 'X-ray / Extreme UV'
  if (wavelengthNm < 380) return 'Ultraviolet'
  if (wavelengthNm <= 740) return 'Visible'
  if (wavelengthNm < 2500) return 'Near-Infrared'
  return 'Infrared'
}

function getWavelengthColor(wavelengthNm: number): string {
  if (wavelengthNm < 380) return '#818cf8'
  if (wavelengthNm < 440) return '#60a5fa'
  if (wavelengthNm < 490) return '#38bdf8'
  if (wavelengthNm < 560) return '#34d399'
  if (wavelengthNm < 590) return '#fbbf24'
  if (wavelengthNm < 630) return '#fb923c'
  if (wavelengthNm <= 740) return '#f87171'
  return '#f43f5e'
}

export function UniversalSpectrumVisualizer({ element }: UniversalSpectrumVisualizerProps) {
  const isTransitioning = useQuantaStore((s) => Boolean(s.sharedElement.activeTransition))
  const selectState = useQuantaStore((s) => s.selectElementState)
  const setTarget = useQuantaStore((s) => s.setElementTarget)
  const startTransition = useQuantaStore((s) => s.startElementTransition)

  const profile = getElementProfile(element.symbol)
  const nist = getNistLevels(element.symbol)
  const levels = useMemo(
    () => [...nist.levels].sort((a, b) => a.energyCm - b.energyCm),
    [nist.levels]
  )

  const [lowerIndex, setLowerIndex] = useState(0)
  const [upperIndex, setUpperIndex] = useState(1)

  const lowerLevel: AtomicLevel | undefined = levels[lowerIndex]
  const availableUpperLevels = levels
    .map((level, index) => ({ level, index }))
    .filter(
      ({ level, index }) =>
        index > lowerIndex && level.energyCm > (lowerLevel?.energyCm ?? -1)
    )
  const availableLowerLevels = levels
    .map((level, index) => ({ level, index }))
    .filter(({ level, index }) =>
      levels.slice(index + 1).some((upper) => upper.energyCm > level.energyCm)
    )

  const hasDerivedPair = availableLowerLevels.length > 0
  const selectedUpper = availableUpperLevels.some(({ index }) => index === upperIndex)
    ? levels[upperIndex]
    : availableUpperLevels[0]?.level
  const selectedUpperIndex = availableUpperLevels.find(
    ({ level }) => level === selectedUpper
  )?.index

  const separation = calculateLevelSeparation(lowerLevel, selectedUpper)
  const transitionWavelengthNm = separation?.wavelengthNm
  const transitionEnergyEv = separation?.energyEv
  const transitionWavenumber = separation?.wavenumberCm

  // Standard air wavelength calculation for lambda >= 200 nm (Edlén formula approx)
  const transitionAirWavelengthNm =
    transitionWavelengthNm && transitionWavelengthNm >= 200
      ? transitionWavelengthNm / 1.000277
      : undefined

  const activeColor = transitionWavelengthNm
    ? getWavelengthColor(transitionWavelengthNm)
    : '#93c5fd'
  const activePercent = transitionWavelengthNm
    ? wavelengthToPercent(transitionWavelengthNm)
    : 50

  const handleAnimate = (direction: 'absorption' | 'emission') => {
    if (!selectedUpper || isTransitioning) return
    const lower =
      lowerIndex === 0
        ? groundModel(element.symbol)
        : referenceModel(element.symbol, lowerLevel!, lowerIndex)
    const upper = referenceModel(
      element.symbol,
      selectedUpper,
      selectedUpperIndex ?? 0
    )

    if (lower && upper) {
      if (direction === 'absorption') {
        selectState(lower)
        setTarget(upper)
        startTransition(upper)
      } else {
        selectState(upper)
        setTarget(lower)
        startTransition(lower)
      }
    }
  }

  const isUnavailable = levels.length < 2

  return (
    <div
      className="spectrum-visualizer glass-instrument"
      aria-label={`${element.name} Emission Spectroscopy`}
    >
      <SpectrumInstrumentHeader
        title={`${element.symbol.toUpperCase()} I EMISSION SPECTROSCOPY`}
        badgeText={isUnavailable ? 'THEORETICAL' : 'NIST ASD DERIVED'}
        classificationOrSeries={
          transitionWavelengthNm
            ? `${getSpectralRegion(transitionWavelengthNm).toUpperCase()}`
            : 'SPECTRUM EXPLORATION'
        }
        classificationColor={activeColor}
      />

      {/* Multi-Band Spectral Strip */}
      <div className="spectrum-strip-container">
        <div className="spectrum-strip">
          <div className="strip-zone uv-zone" />
          <div className="strip-zone visible-zone" />
          <div className="strip-zone ir-zone" />
        </div>

        {/* Landmark Spectral Lines */}
        {profile.landmarkLines.map((lm) => (
          <div
            key={lm.label}
            className="landmark-marker"
            style={{ left: `${wavelengthToPercent(lm.wavelengthNm)}%` }}
            title={`${lm.label}: ${lm.wavelengthNm.toFixed(1)} nm (${lm.region})`}
          >
            <span className="landmark-line" style={{ backgroundColor: lm.color }} />
            <span className="landmark-label">{lm.wavelengthNm.toFixed(0)}</span>
          </div>
        ))}

        {/* Active Transition Marker */}
        {transitionWavelengthNm && (
          <div
            className="active-spectral-line"
            style={{
              left: `${activePercent}%`,
              borderColor: activeColor,
              boxShadow: `0 0 14px ${activeColor}`,
            }}
          >
            <div className="marker-pip" style={{ backgroundColor: activeColor }} />
            <div className="marker-callout" style={{ borderColor: activeColor }}>
              <strong>{transitionWavelengthNm.toFixed(1)} nm</strong>
              <small>{selectedUpper?.term ?? 'Upper'} → {lowerLevel?.term ?? 'Lower'}</small>
            </div>
          </div>
        )}
      </div>

      {/* Zone band markers */}
      <div className="spectrum-band-labels">
        <span className="band-label">ULTRAVIOLET (&lt; 380 nm)</span>
        <span className="band-label visible-label">VISIBLE SPECTRUM (380 – 740 nm)</span>
        <span className="band-label">INFRARED (&gt; 740 nm)</span>
      </div>

      {/* Level Selection & Animation Controls */}
      {isUnavailable ? (
        <div className="atomic-data-notice" role="status" style={{ margin: '1rem 0' }}>
          <strong>
            {levels.length === 1
              ? `Only one neutral bound level is listed for ${element.symbol} in this reference set.`
              : `Neutral-atom energy levels are not listed for ${element.symbol} in this reference set.`}
          </strong>
          <span>
            Two distinct bound levels are needed to derive a transition wavelength.
            No levels or spectral wavelengths are inferred when reference levels are unavailable.
          </span>
        </div>
      ) : !hasDerivedPair ? (
        <div className="atomic-data-notice" role="status" style={{ margin: '1rem 0' }}>
          <strong>No pair of distinct bound energies is available for {element.symbol}.</strong>
        </div>
      ) : (
        <div className="spectral-controls-container" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <div>
              <label className="atomic-select-label" htmlFor="atomic-lower-level">
                Lower Level
              </label>
              <select
                id="atomic-lower-level"
                className="atomic-level-select"
                disabled={isTransitioning}
                value={lowerIndex}
                onChange={(e) => {
                  const nextLower = Number(e.target.value)
                  setLowerIndex(nextLower)
                  const nextUpper = levels.findIndex(
                    (level, idx) => idx > nextLower && level.energyCm > levels[nextLower].energyCm
                  )
                  setUpperIndex(nextUpper >= 0 ? nextUpper : nextLower + 1)
                }}
              >
                {availableLowerLevels.map(({ level, index }) => (
                  <option key={`lower-${level.energyCm}-${index}`} value={index}>
                    {level.configuration} {level.term} ({level.energyCm.toFixed(1)} cm⁻¹)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="atomic-select-label" htmlFor="atomic-upper-level">
                Upper Level
              </label>
              <select
                id="atomic-upper-level"
                className="atomic-level-select"
                disabled={isTransitioning}
                value={selectedUpperIndex ?? ''}
                onChange={(e) => setUpperIndex(Number(e.target.value))}
              >
                {availableUpperLevels.map(({ level, index }) => (
                  <option key={`upper-${level.energyCm}-${index}`} value={index}>
                    {level.configuration} {level.term} ({level.energyCm.toFixed(1)} cm⁻¹)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Animation Buttons */}
          <div className="preset-buttons-row" style={{ marginTop: '0.8rem' }}>
            <button
              type="button"
              className="preset-btn"
              disabled={isTransitioning}
              onClick={() => handleAnimate('absorption')}
            >
              ANIMATE ABSORPTION
            </button>
            <button
              type="button"
              className="preset-btn"
              disabled={isTransitioning}
              onClick={() => handleAnimate('emission')}
            >
              ANIMATE EMISSION
            </button>
          </div>

          {/* Spectral Hero Result */}
          {transitionWavelengthNm && transitionEnergyEv && (
            <div style={{ marginTop: '1rem' }}>
              <SpectralHeroResult
                wavelengthNm={transitionWavelengthNm}
                wavelengthMedium={transitionWavelengthNm >= 200 ? 'air' : 'vacuum'}
                photonEnergyEv={transitionEnergyEv}
                classificationOrSeries="DERIVED NIST ASD ENERGIES"
                region={getSpectralRegion(transitionWavelengthNm)}
                displayColor={activeColor}
                description={
                  transitionWavenumber
                    ? `ΔE = ${transitionEnergyEv.toFixed(4)} eV · Δν̃ = ${transitionWavenumber.toFixed(1)} cm⁻¹`
                    : undefined
                }
              />
            </div>
          )}
        </div>
      )}

      <InstrumentFooter
        text={`${NIST_LEVELS_SOURCE} (${element.symbol} I) · Wavelengths are derived from reference level separations via ΔE = hc/λ. The selected pair is not filtered by selection rules; line intensities are not inferred.`}
      />
    </div>
  )
}

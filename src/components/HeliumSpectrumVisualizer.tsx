import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { HELIUM_TRANSITIONS, getHeliumTransition } from '../physics/helium'

function heliumWavelengthToPercent(wavelengthNm: number): number {
  if (wavelengthNm <= 40) return 2
  if (wavelengthNm >= 1200) return 98

  if (wavelengthNm < 380) {
    // EUV/UV zone: 40nm -> 380nm maps to 4% -> 26%
    return 4 + ((wavelengthNm - 40) / (380 - 40)) * 22
  } else if (wavelengthNm <= 740) {
    // Visible zone: 380nm -> 740nm maps to 26% -> 74%
    return 26 + ((wavelengthNm - 380) / (740 - 380)) * 48
  } else {
    // IR zone: 740nm -> 1200nm maps to 74% -> 96%
    return 74 + ((wavelengthNm - 740) / (1200 - 740)) * 22
  }
}

export function HeliumSpectrumVisualizer() {
  const selectedTransitionId = useQuantaStore((s) => s.helium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.helium.activeTransition)
  const setHeliumTransition = useQuantaStore((s) => s.setHeliumTransition)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getHeliumTransition(selectedTransitionId)
    return getHeliumTransition('587.6nm')!
  }, [activeTransition, selectedTransitionId])

  const markerPercent = transition ? heliumWavelengthToPercent(transition.wavelengthNm) : 50

  return (
    <div className="spectrum-visualizer glass-instrument" aria-label="Helium Emission Spectrum">
      <div className="spectrum-header">
        <div className="spectrum-title-wrap">
          <span className="spectrum-title">HELIUM I EMISSION SPECTROSCOPY</span>
          <span className="provenance-tag">NIST ASD DATA</span>
        </div>
        <span className="spectrum-series-badge">
          {transition ? transition.classification.toUpperCase() : 'SELECT LINE'}
        </span>
      </div>

      {/* Multi-Band Spectral Strip */}
      <div className="spectrum-strip-container">
        <div className="spectrum-strip">
          <div className="strip-zone uv-zone" />
          <div className="strip-zone visible-zone" />
          <div className="strip-zone ir-zone" />
        </div>

        {/* Landmark Helium Lines */}
        {HELIUM_TRANSITIONS.map((line) => {
          const isSelected = transition?.id === line.id
          const pos = heliumWavelengthToPercent(line.wavelengthNm)
          return (
            <div
              key={line.id}
              className={`landmark-marker helium-landmark ${isSelected ? 'active-landmark' : ''}`}
              style={{ left: `${pos}%` }}
              onClick={() => setHeliumTransition(line.id)}
              title={`${line.lineName}: ${line.wavelengthNm.toFixed(1)} nm (${line.wavelengthMedium})`}
            >
              <span className="landmark-line" style={{ backgroundColor: line.displayColor }} />
              <span className="landmark-label">{line.wavelengthNm.toFixed(1)}</span>
            </div>
          )
        })}

        {/* Active Line Indicator */}
        {transition && (
          <div
            className="active-spectral-line"
            style={{
              left: `${markerPercent}%`,
              borderColor: transition.displayColor,
              boxShadow: `0 0 16px ${transition.displayColor}`,
            }}
          >
            <div className="marker-pip" style={{ backgroundColor: transition.displayColor }} />
            <div className="marker-callout" style={{ borderColor: transition.displayColor }}>
              <strong>
                {transition.wavelengthNm.toFixed(2)} nm ({transition.wavelengthMedium})
              </strong>
              <small>{transition.lineName}</small>
            </div>
          </div>
        )}
      </div>

      {/* Zone Band Labels */}
      <div className="spectrum-band-labels">
        <span className="band-label">EUV & UV (&lt; 380 nm)</span>
        <span className="band-label visible-label">VISIBLE SPECTRUM (380 – 740 nm)</span>
        <span className="band-label">INFRARED (&gt; 740 nm)</span>
      </div>

      {/* Spectral Readout Card */}
      {transition ? (
        <div className="spectrum-readout-card">
          <div className="readout-primary">
            <span className="readout-value" style={{ color: transition.displayColor }}>
              {transition.wavelengthNm.toFixed(3)} nm
            </span>
            <span className="readout-sub">
              {transition.classification} · {transition.region} · {transition.wavelengthMedium.toUpperCase()} MEDIUM · Eγ = {transition.photonEnergyEv.toFixed(3)} eV
            </span>
          </div>
          <p className="spectrum-microcopy">
            {transition.description} {transition.colorDescription}.
          </p>
        </div>
      ) : null}
    </div>
  )
}

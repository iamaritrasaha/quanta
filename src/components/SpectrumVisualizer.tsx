import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { safeHydrogenTransition } from '../physics/hydrogen'

// Map physical wavelength to visual percentage on the non-linear spectrum strip
function wavelengthToPercent(wavelengthNm: number): number {
  if (wavelengthNm <= 100) return 2
  if (wavelengthNm >= 2000) return 98

  if (wavelengthNm < 380) {
    // UV range: 100nm -> 380nm maps to 4% -> 26%
    return 4 + ((wavelengthNm - 100) / (380 - 100)) * 22
  } else if (wavelengthNm <= 740) {
    // Visible range: 380nm -> 740nm maps to 26% -> 74% (expanded for clarity)
    return 26 + ((wavelengthNm - 380) / (740 - 380)) * 48
  } else {
    // IR range: 740nm -> 2000nm maps to 74% -> 96%
    return 74 + ((wavelengthNm - 740) / (2000 - 740)) * 22
  }
}

export function SpectrumVisualizer() {
  const initialLevel = useQuantaStore((s) => s.initialLevel)
  const targetLevel = useQuantaStore((s) => s.targetLevel)
  const activeTransition = useQuantaStore((s) => s.activeTransition)

  const transition = useMemo(() => {
    return activeTransition?.physics ?? safeHydrogenTransition(initialLevel, targetLevel)
  }, [activeTransition, initialLevel, targetLevel])

  const landmarks = [
    { label: 'Ly-α', nm: 121.57, color: '#818cf8' },
    { label: 'H-γ', nm: 434.17, color: '#60a5fa' },
    { label: 'H-β', nm: 486.27, color: '#38bdf8' },
    { label: 'H-α', nm: 656.47, color: '#ef4444' },
    { label: 'Pa-α', nm: 1875.6, color: '#f43f5e' },
  ]

  const markerPercent = transition ? wavelengthToPercent(transition.wavelengthNm) : 50

  return (
    <div className="spectrum-visualizer glass-instrument" aria-label="Hydrogen Emission Spectrum">
      <div className="spectrum-header">
        <span className="spectrum-title">EMISSION SPECTROSCOPY</span>
        <span className="spectrum-series-badge">
          {transition ? `${transition.series.toUpperCase()} SERIES` : 'SELECT TRANSITION'}
        </span>
      </div>

      {/* Main Multi-Band Spectral Strip */}
      <div className="spectrum-strip-container">
        <div className="spectrum-strip">
          {/* UV section */}
          <div className="strip-zone uv-zone" />
          {/* Visible rainbow section */}
          <div className="strip-zone visible-zone" />
          {/* IR section */}
          <div className="strip-zone ir-zone" />
        </div>

        {/* Landmark spectral lines */}
        {landmarks.map((lm) => (
          <div
            key={lm.label}
            className="landmark-marker"
            style={{ left: `${wavelengthToPercent(lm.nm)}%` }}
            title={`${lm.label}: ${lm.nm.toFixed(1)} nm`}
          >
            <span className="landmark-line" style={{ backgroundColor: lm.color }} />
            <span className="landmark-label">{lm.label}</span>
          </div>
        ))}

        {/* Active transition marker */}
        {transition && (
          <div
            className="active-spectral-line"
            style={{
              left: `${markerPercent}%`,
              borderColor: transition.displayColor,
              boxShadow: `0 0 14px ${transition.displayColor}`,
            }}
          >
            <div className="marker-pip" style={{ backgroundColor: transition.displayColor }} />
            <div className="marker-callout" style={{ borderColor: transition.displayColor }}>
              <strong>{transition.wavelengthNm.toFixed(1)} nm</strong>
              <small>{transition.lineName}</small>
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

      {/* Spectral metadata and classification */}
      {transition ? (
        <div className="spectrum-readout-card">
          <div className="readout-primary">
            <span className="readout-value" style={{ color: transition.displayColor }}>
              {transition.wavelengthNm.toFixed(2)} nm
            </span>
            <span className="readout-sub">
              {transition.series} Series · {transition.lineName} · {transition.band.toUpperCase()}
            </span>
          </div>
          <p className="spectrum-microcopy">
            {transition.isTrueColor
              ? 'Color rendered in true visible spectrum approximation.'
              : 'False-color visualization — radiation lies outside the human visible spectrum.'}
          </p>
        </div>
      ) : (
        <div className="spectrum-readout-card placeholder-card">
          <p className="spectrum-microcopy">
            Select two differing quantum levels (n_i ≠ n_f) to resolve spectral wavelength and series identification.
          </p>
        </div>
      )}
    </div>
  )
}

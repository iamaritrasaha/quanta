import { useMemo, useState } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { LITHIUM_TRANSITIONS, getLithiumTransition } from '../physics/lithium'
import { SpectrumInstrumentHeader, SpectralHeroResult } from './science'

function lithiumWavelengthToPercent(wavelengthNm: number): number {
  if (wavelengthNm <= 350) return 4
  if (wavelengthNm >= 900) return 96

  if (wavelengthNm < 380) {
    // UV zone: 350nm -> 380nm maps to 4% -> 12%
    return 4 + ((wavelengthNm - 350) / (380 - 350)) * 8
  } else if (wavelengthNm <= 740) {
    // Visible zone: 380nm -> 740nm maps to 12% -> 80%
    return 12 + ((wavelengthNm - 380) / (740 - 380)) * 68
  } else {
    // Near-IR zone: 740nm -> 900nm maps to 80% -> 96%
    return 80 + ((wavelengthNm - 740) / (900 - 740)) * 16
  }
}

export function LithiumSpectrumVisualizer() {
  const selectedTransitionId = useQuantaStore((s) => s.lithium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.lithium.activeTransition)
  const setLithiumTransition = useQuantaStore((s) => s.setLithiumTransition)

  const [isResolvedView, setIsResolvedView] = useState(true)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getLithiumTransition(selectedTransitionId)
    return getLithiumTransition('670.8nm')!
  }, [activeTransition, selectedTransitionId])

  const markerPercent = transition ? lithiumWavelengthToPercent(transition.wavelengthNm) : 50

  return (
    <div className="spectrum-visualizer glass-instrument" aria-label="Lithium Emission Spectrum">
      <SpectrumInstrumentHeader
        title="LITHIUM I EMISSION SPECTROSCOPY"
        badgeText="NIST ASD DATA"
        classificationOrSeries={transition ? transition.classification.toUpperCase() : 'SELECT LINE'}
        classificationColor={transition?.displayColor}
      />

      {/* Multi-Band Spectral Strip */}
      <div className="spectrum-strip-container">
        <div className="spectrum-strip">
          <div className="strip-zone uv-zone" />
          <div className="strip-zone visible-zone" />
          <div className="strip-zone ir-zone" />
        </div>

        {/* Landmark Lithium Lines */}
        {LITHIUM_TRANSITIONS.map((line) => {
          const isSelected = transition?.id === line.id
          const pos = lithiumWavelengthToPercent(line.wavelengthNm)
          return (
            <div
              key={line.id}
              className={`landmark-marker lithium-landmark ${isSelected ? 'active-landmark' : ''}`}
              style={{ left: `${pos}%` }}
              onClick={() => setLithiumTransition(line.id)}
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
        <span className="band-label">UV (&lt; 380 nm)</span>
        <span className="band-label visible-label">VISIBLE SPECTRUM (380 – 740 nm)</span>
        <span className="band-label">NEAR-IR (&gt; 740 nm)</span>
      </div>

      {/* Hero Doublet Fine-Structure Inspector (When Hero transition selected) */}
      {transition?.id === '670.8nm' && (
        <div className="doublet-hero-card">
          <div className="doublet-header-row">
            <div className="doublet-title-wrap">
              <span className="doublet-eyebrow">HERO TRANSITION</span>
              <strong className="doublet-title">670.8 nm Resonance Fine-Structure Doublet</strong>
            </div>
            <div className="doublet-toggle-buttons">
              <button
                type="button"
                className={`fs-toggle-btn ${isResolvedView ? 'active' : ''}`}
                onClick={() => setIsResolvedView(true)}
              >
                RESOLVED (D₁ & D₂)
              </button>
              <button
                type="button"
                className={`fs-toggle-btn ${!isResolvedView ? 'active' : ''}`}
                onClick={() => setIsResolvedView(false)}
              >
                COARSE ENVELOPE
              </button>
            </div>
          </div>

          {isResolvedView ? (
            <div className="doublet-components-grid">
              <div className="doublet-comp-card">
                <span className="comp-badge">D₂ LINE (PRIMARY)</span>
                <strong className="comp-wl scientific-number">670.7775 nm</strong>
                <span className="comp-term">2s ²S₁/₂ → 2p ²P°₃/₂</span>
                <span className="comp-energy scientific-number">14904.00 cm⁻¹ (1.84786 eV)</span>
              </div>
              <div className="doublet-comp-card">
                <span className="comp-badge">D₁ LINE</span>
                <strong className="comp-wl scientific-number">670.7926 nm</strong>
                <span className="comp-term">2s ²S₁/₂ → 2p ²P°₁/₂</span>
                <span className="comp-energy scientific-number">14903.66 cm⁻¹ (1.84782 eV)</span>
              </div>
            </div>
          ) : (
            <p className="coarse-view-desc">
              At standard spectrometer resolution, the doublet merges into a single prominent crimson feature at ~670.8 nm.
            </p>
          )}

          <span className="doublet-footnote">
            Fine structure resolved (Δλ ≈ 0.015 nm, Δṽ ≈ 0.34 cm⁻¹). Isotope shift (⁶Li vs ⁷Li) and nuclear hyperfine splitting omitted in V1.
          </span>
        </div>
      )}

      {/* Spectral Readout Card using shared SpectralHeroResult */}
      {transition ? (
        <SpectralHeroResult
          wavelengthNm={transition.wavelengthNm}
          wavelengthPrecision={3}
          wavelengthMedium={transition.wavelengthMedium}
          displayColor={transition.displayColor}
          classificationOrSeries={transition.classification}
          region={transition.region}
          photonEnergyEv={transition.photonEnergyEv}
          description={transition.description}
          colorDescription={transition.colorDescription}
          isTrueColor={transition.isTrueColor}
        />
      ) : null}
    </div>
  )
}

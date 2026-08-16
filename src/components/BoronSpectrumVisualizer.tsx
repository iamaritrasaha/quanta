import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { BORON_TRANSITIONS, getBoronTransition } from '../physics/boron'
import { SpectrumInstrumentHeader, SpectralHeroResult } from './science'

function boronWavelengthToPercent(wavelengthNm: number): number {
  if (wavelengthNm <= 150) return 4
  if (wavelengthNm >= 1300) return 96

  if (wavelengthNm < 380) {
    // UV zone: 150nm -> 380nm maps to 4% -> 20%
    return 4 + ((wavelengthNm - 150) / (380 - 150)) * 16
  } else if (wavelengthNm <= 740) {
    // Visible zone: 380nm -> 740nm maps to 20% -> 84%
    return 20 + ((wavelengthNm - 380) / (740 - 380)) * 64
  } else {
    // Near-IR zone: 740nm -> 1300nm maps to 84% -> 96%
    return 84 + ((wavelengthNm - 740) / (1300 - 740)) * 12
  }
}

export function BoronSpectrumVisualizer() {
  const selectedTransitionId = useQuantaStore((s) => s.boron.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.boron.activeTransition)
  const setBoronTransition = useQuantaStore((s) => s.setBoronTransition)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getBoronTransition(selectedTransitionId)
    return getBoronTransition('249.77nm')!
  }, [activeTransition, selectedTransitionId])

  const markerPercent = transition ? boronWavelengthToPercent(transition.wavelengthNm) : 50

  return (
    <div className="spectrum-visualizer glass-instrument" aria-label="Boron Emission Spectrum">
      <SpectrumInstrumentHeader
        title="BORON I EMISSION SPECTROSCOPY"
        badgeText="NIST ASD DATA"
        classificationOrSeries={transition ? transition.classification.toUpperCase() : 'SELECT LINE'}
        classificationColor={transition?.displayColor}
      />

      <div className="spectrum-strip-container">
        <div className="spectrum-strip">
          <div className="strip-zone uv-zone" />
          <div className="strip-zone visible-zone" />
          <div className="strip-zone ir-zone" />
        </div>

        {BORON_TRANSITIONS.map((line) => {
          const isSelected = transition?.id === line.id
          const pos = boronWavelengthToPercent(line.wavelengthNm)
          return (
            <div
              key={line.id}
              className={`landmark-marker boron-landmark ${isSelected ? 'active-landmark' : ''}`}
              style={{ left: `${pos}%` }}
              onClick={() => setBoronTransition(line.id)}
              title={`${line.lineName}: ${line.wavelengthNm.toFixed(1)} nm (${line.wavelengthMedium})`}
            >
              <span className="landmark-line" style={{ backgroundColor: line.displayColor }} />
              <span className="landmark-label">{line.wavelengthNm.toFixed(1)}</span>
            </div>
          )
        })}

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
            <div
              className={`marker-callout ${
                markerPercent <= 25 ? 'callout-align-start' : markerPercent >= 75 ? 'callout-align-end' : ''
              }`}
              style={{ borderColor: transition.displayColor }}
            >
              <strong>
                {transition.wavelengthNm.toFixed(2)} nm ({transition.wavelengthMedium})
              </strong>
              <small>{transition.lineName}</small>
            </div>
          </div>
        )}
      </div>

      <div className="spectrum-band-labels">
        <span className="band-label">UV (&lt; 380 nm)</span>
        <span className="band-label visible-label">VISIBLE SPECTRUM (380 – 740 nm)</span>
        <span className="band-label">NEAR-IR (&gt; 740 nm)</span>
      </div>

      {transition ? (
        <SpectralHeroResult
          wavelengthNm={transition.wavelengthNm}
          wavelengthPrecision={4}
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

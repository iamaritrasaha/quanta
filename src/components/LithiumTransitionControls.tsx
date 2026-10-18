import { useQuantaStore } from '../state/quantaStore'
import {
  LITHIUM_TRANSITIONS,
  getLithiumTransition,
  getLithiumLevel,
  calculateLithiumStateEnergyDelta,
} from '../physics/lithium'
import { SpectralTransitionRow, FineStructureComponentRow } from './science'

function getCleanTitle(lineName: string): string {
  const match = lineName.match(/^Li I (?:\d+\.\d+ nm )?\((.+)\)$/)
  if (match) {
    return `Li I · ${match[1]}`
  }
  return lineName
}

function getPhaseDescription(phase: string, type: 'absorption' | 'emission') {
  switch (phase) {
    case 'photonIncoming':
      return 'Incoming photon wave packet propagating toward electronic state…'
    case 'interaction':
      return type === 'absorption'
        ? 'Valence electron absorbing photon energy (ΔE > 0)…'
        : 'Valence electron liberating discrete photon energy (ΔE < 0)…'
    case 'electronTransition':
      return type === 'absorption'
        ? 'Photon absorption excites the valence electron to higher-energy state…'
        : 'Transition to lower valence electronic state…'
    case 'photonOutgoing':
      return 'Liberated photon wave packet propagating outward…'
    case 'settle':
      return 'Stabilizing target electronic state…'
    default:
      return 'Transitioning electronic configuration…'
  }
}

export function LithiumTransitionControls() {
  const selectedTransitionId = useQuantaStore((s) => s.lithium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.lithium.activeTransition)
  const selectedLevelId = useQuantaStore((s) => s.lithium.selectedLevelId)
  const setLithiumTransition = useQuantaStore((s) => s.setLithiumTransition)
  const setLithiumLevel = useQuantaStore((s) => s.setLithiumLevel)
  const startTransition = useQuantaStore((s) => s.startLithiumTransition)
  const cancelTransition = useQuantaStore((s) => s.cancelLithiumTransition)

  const activePhysics = activeTransition?.physics
  const currentTransition =
    activePhysics ??
    (selectedTransitionId
      ? getLithiumTransition(selectedTransitionId)
      : getLithiumTransition('670.8nm')!)

  const lowerLevel = currentTransition ? getLithiumLevel(currentTransition.lowerLevelId) : null
  const upperLevel = currentTransition ? getLithiumLevel(currentTransition.upperLevelId) : null
  const isCurrentUpper = selectedLevelId === upperLevel?.id
  const isAbsorption = !isCurrentUpper

  const { deltaEStateEv, photonEnergyEv } = currentTransition
    ? calculateLithiumStateEnergyDelta(currentTransition, isAbsorption ? 'absorption' : 'emission')
    : { deltaEStateEv: 0, photonEnergyEv: 0 }

  const playing = useQuantaStore((s) => s.playing)
  const isTransitioning = Boolean(activeTransition)
  const progressPercent = Math.round((activeTransition?.progress ?? 0) * 100)

  return (
    <div
      className="transition-controls-card glass-instrument"
      aria-label="Lithium Spectral Transition Controls"
    >
      <div className="card-kicker-row">
        <span className="card-kicker">CURATED LI I SPECTRAL TRANSITIONS</span>
        <span className="provenance-tag">NIST ASD AIR WAVELENGTHS</span>
      </div>

      {/* Standardized Semantic Transition List */}
      <div className="spectral-transitions-list" role="region" aria-label="Curated Transitions">
        {LITHIUM_TRANSITIONS.map((t) => {
          const isSelected = currentTransition?.id === t.id
          const cleanTitle = getCleanTitle(t.lineName)

          return (
            <SpectralTransitionRow
              key={t.id}
              id={t.id}
              title={cleanTitle}
              wavelengthNm={t.wavelengthNm}
              wavelengthPrecision={1}
              wavelengthMedium={t.wavelengthMedium}
              region={t.region}
              displayColor={t.displayColor}
              isSelected={isSelected}
              isDisabled={isTransitioning}
              onClick={() => {
                if (!isTransitioning) setLithiumTransition(t.id)
              }}
              ariaLabel={`Select ${cleanTitle} at ${t.wavelengthNm.toFixed(1)} nm, ${t.wavelengthMedium}, ${t.region}`}
            />
          )
        })}
      </div>

      {/* Fine Structure Component Breakdown for Selected Transition */}
      {currentTransition?.components && currentTransition.components.length > 1 && (
        <div className="fine-structure-breakdown-box">
          <span className="fs-box-title">FINE-STRUCTURE COMPONENTS (RESOLVED)</span>
          <div className="fs-components-list">
            {currentTransition.components.map((c, i) => (
              <FineStructureComponentRow
                key={i}
                comment={c.comment}
                wavelengthNm={c.wavelengthNm}
                wavelengthPrecision={4}
                wavelengthMedium={c.wavelengthMedium}
                energyCm1={c.wavenumberCm1}
                relativeIntensity={c.relativeIntensity}
              />
            ))}
          </div>
        </div>
      )}

      {/* Metric Preview or Active Progress (canonical H/He transition-action shell) */}
      {isTransitioning && activeTransition ? (
        <div className="active-transition-view">
          <div className="progress-info">
            <span className="phase-text">
              {playing ? getPhaseDescription(activeTransition.phase, activeTransition.type) : 'Transition paused. Select PLAY to continue.'}
            </span>
            <span className="progress-percent">{progressPercent}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: activeTransition.physics.displayColor,
              }}
            />
          </div>
          <button type="button" className="cancel-transition-btn" onClick={cancelTransition}>
            CANCEL TRANSITION
          </button>
        </div>
      ) : currentTransition && lowerLevel && upperLevel ? (
        <div className="transition-summary-row">
          <div className="summary-item">
            <span className="summary-label">
              {isAbsorption ? 'State Change (ΔE_state > 0)' : 'State Change (ΔE_state < 0)'}
            </span>
            <strong className="summary-val">
              {deltaEStateEv > 0 ? `+${deltaEStateEv.toFixed(3)}` : deltaEStateEv.toFixed(3)} eV
            </strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Photon Energy (Eγ = |ΔE|)</span>
            <strong className="summary-val">{photonEnergyEv.toFixed(3)} eV</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Wavelength ({currentTransition.wavelengthMedium})</span>
            <strong className="summary-val" style={{ color: currentTransition.displayColor }}>
              {currentTransition.wavelengthNm.toFixed(1)} nm
            </strong>
          </div>
        </div>
      ) : null}

      {/* Trigger Action Button */}
      {!isTransitioning && currentTransition && lowerLevel && upperLevel && (
        <div className="trigger-row-dual">
          <button
            type="button"
            className={`primary-action-btn ${isAbsorption ? 'absorb-btn' : 'emit-btn'}`}
            onClick={() => startTransition(currentTransition.id, isAbsorption ? 'absorption' : 'emission')}
          >
            {isAbsorption ? (
              <>
                <span className="action-icon">↑</span>
                <span>
                  ABSORB PHOTON (+{photonEnergyEv.toFixed(3)} eV · {lowerLevel.termSymbol} → {upperLevel.termSymbol})
                </span>
              </>
            ) : (
              <>
                <span className="action-icon">↓</span>
                <span>
                  EMIT PHOTON ({currentTransition.lineName} · {upperLevel.termSymbol} → {lowerLevel.termSymbol})
                </span>
              </>
            )}
          </button>

          {/* Direction toggle button if user wants to prime the opposite state */}
          <button
            type="button"
            className="secondary-action-btn"
            onClick={() => setLithiumLevel(isAbsorption ? upperLevel.id : lowerLevel.id)}
            title={
              isAbsorption
                ? 'Set atom to upper state to enable emission'
                : 'Set atom to lower state to enable absorption'
            }
          >
            {isAbsorption ? 'PREPARE EMISSION (JUMP TO UPPER)' : 'PREPARE ABSORPTION (JUMP TO LOWER)'}
          </button>
        </div>
      )}
    </div>
  )
}

import { useQuantaStore } from '../state/quantaStore'
import {
  LITHIUM_TRANSITIONS,
  getLithiumTransition,
  getLithiumLevel,
} from '../physics/lithium'
import { SpectralTransitionRow, FineStructureComponentRow } from './science'

function getCleanTitle(lineName: string): string {
  const match = lineName.match(/^Li I (?:\d+\.\d+ nm )?\((.+)\)$/)
  if (match) {
    return `Li I · ${match[1]}`
  }
  return lineName
}

export function LithiumTransitionControls() {
  const selectedTransitionId = useQuantaStore((s) => s.lithium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.lithium.activeTransition)
  const selectedLevelId = useQuantaStore((s) => s.lithium.selectedLevelId)
  const setLithiumTransition = useQuantaStore((s) => s.setLithiumTransition)
  const startTransition = useQuantaStore((s) => s.startLithiumTransition)
  const cancelTransition = useQuantaStore((s) => s.cancelLithiumTransition)

  const activePhysics = activeTransition?.physics
  const currentTransition =
    activePhysics ??
    (selectedTransitionId
      ? getLithiumTransition(selectedTransitionId)
      : getLithiumTransition('670.8nm')!)

  const upperLevel = currentTransition ? getLithiumLevel(currentTransition.upperLevelId) : null
  const isCurrentUpper = selectedLevelId === upperLevel?.id

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

      {/* Dynamic Action Trigger Button */}
      {currentTransition && (
        <div className="transition-trigger-area">
          {isTransitioning ? (
            <div className="transition-progress-container">
              <div className="progress-info-row">
                <span className="progress-status-label">
                  {activeTransition?.type === 'absorption'
                    ? '↑ ABSORPTION IN PROGRESS'
                    : '↓ EMISSION IN PROGRESS'}
                </span>
                <span className="progress-percent scientific-number">{progressPercent}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: currentTransition.displayColor,
                    boxShadow: `0 0 10px ${currentTransition.displayColor}`,
                  }}
                />
              </div>
              <button
                type="button"
                className="cancel-transition-btn"
                onClick={cancelTransition}
              >
                CANCEL TRANSITION
              </button>
            </div>
          ) : (
            <div className="trigger-row-dual">
              <button
                type="button"
                className="action-trigger-btn primary-action-btn"
                onClick={() =>
                  startTransition(
                    currentTransition.id,
                    isCurrentUpper ? 'emission' : 'absorption'
                  )
                }
                style={{
                  borderColor: currentTransition.displayColor,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${currentTransition.displayColor}22 100%)`,
                }}
              >
                <span className="btn-icon">{isCurrentUpper ? '↓' : '↑'}</span>
                <span className="btn-text">
                  TRIGGER {isCurrentUpper ? 'EMISSION' : 'ABSORPTION'} (
                  {currentTransition.wavelengthNm.toFixed(1)} nm)
                </span>
              </button>
              <button
                type="button"
                className="secondary-action-btn"
                onClick={() =>
                  startTransition(
                    currentTransition.id,
                    isCurrentUpper ? 'absorption' : 'emission'
                  )
                }
              >
                FORCE {isCurrentUpper ? 'ABSORPTION' : 'EMISSION'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

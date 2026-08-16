import { useQuantaStore } from '../state/quantaStore'
import { BERYLLIUM_TRANSITIONS, getBerylliumTransition, getBerylliumLevel } from '../physics/beryllium'
import { SpectralTransitionRow } from './science'

export function BerylliumTransitionControls() {
  const selectedTransitionId = useQuantaStore((s) => s.beryllium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.beryllium.activeTransition)
  const selectedLevelId = useQuantaStore((s) => s.beryllium.selectedLevelId)
  const setBerylliumTransition = useQuantaStore((s) => s.setBerylliumTransition)
  const startTransition = useQuantaStore((s) => s.startBerylliumTransition)
  const cancelTransition = useQuantaStore((s) => s.cancelBerylliumTransition)

  const activePhysics = activeTransition?.physics
  const currentTransition = activePhysics ?? (selectedTransitionId ? getBerylliumTransition(selectedTransitionId) : getBerylliumTransition('234.9nm')!)

  const upperLevel = currentTransition ? getBerylliumLevel(currentTransition.upperLevelId) : null
  const isCurrentUpper = selectedLevelId === upperLevel?.id

  const isTransitioning = Boolean(activeTransition)
  const progressPercent = Math.round((activeTransition?.progress ?? 0) * 100)

  return (
    <div className="transition-controls-card glass-instrument" aria-label="Beryllium Spectral Transition Controls">
      <div className="card-kicker-row">
        <span className="card-kicker">CURATED BE I SPECTRAL TRANSITIONS</span>
        <span className="provenance-tag">NIST ASD REFERENCE DATA</span>
      </div>

      <div className="spectral-transitions-list" role="region" aria-label="Curated Transitions">
        {BERYLLIUM_TRANSITIONS.map((t) => {
          const isSelected = currentTransition?.id === t.id
          return (
            <SpectralTransitionRow
              key={t.id}
              id={t.id}
              title={t.lineName.replace(/^Be I \d+\.\d+ nm \((.+)\)$/, 'Be I · $1')}
              wavelengthNm={t.wavelengthNm}
              wavelengthPrecision={t.wavelengthNm < 200 ? 4 : 1}
              wavelengthMedium={t.wavelengthMedium}
              region={t.region}
              displayColor={t.displayColor}
              isSelected={isSelected}
              isDisabled={isTransitioning}
              onClick={() => {
                if (!isTransitioning) setBerylliumTransition(t.id)
              }}
              ariaLabel={`Select ${t.lineName} at ${t.wavelengthNm.toFixed(2)} nm, ${t.wavelengthMedium}, ${t.region}`}
            />
          )
        })}
      </div>

      {currentTransition && (
        <div className="transition-trigger-area">
          {isTransitioning ? (
            <div className="transition-progress-container">
              <div className="progress-info-row">
                <span className="progress-status-label">
                  {activeTransition?.type === 'absorption' ? '↑ ABSORPTION IN PROGRESS' : '↓ EMISSION IN PROGRESS'}
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
              <button type="button" className="cancel-transition-btn" onClick={cancelTransition}>
                CANCEL TRANSITION
              </button>
            </div>
          ) : (
            <div className="trigger-row-dual">
              <button
                type="button"
                className="action-trigger-btn primary-action-btn"
                onClick={() => startTransition(currentTransition.id, isCurrentUpper ? 'emission' : 'absorption')}
                style={{
                  borderColor: currentTransition.displayColor,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${currentTransition.displayColor}22 100%)`,
                }}
              >
                <span className="btn-icon">{isCurrentUpper ? '↓' : '↑'}</span>
                <span className="btn-text">
                  TRIGGER {isCurrentUpper ? 'EMISSION' : 'ABSORPTION'} ({currentTransition.wavelengthNm.toFixed(1)} nm)
                </span>
              </button>
              <button
                type="button"
                className="secondary-action-btn"
                onClick={() => startTransition(currentTransition.id, isCurrentUpper ? 'absorption' : 'emission')}
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

import { useQuantaStore } from '../state/quantaStore'
import {
  BERYLLIUM_TRANSITIONS,
  getBerylliumTransition,
  getBerylliumLevel,
  calculateBerylliumStateEnergyDelta,
} from '../physics/beryllium'
import { SpectralTransitionRow } from './science'

function getPhaseDescription(phase: string, type: 'absorption' | 'emission') {
  switch (phase) {
    case 'photonIncoming':
      return 'Incoming photon wave packet propagating toward electronic state…'
    case 'interaction':
      return type === 'absorption'
        ? 'Valence electrons absorbing photon energy (ΔE > 0)…'
        : 'Valence electrons liberating discrete photon energy (ΔE < 0)…'
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

export function BerylliumTransitionControls() {
  const selectedTransitionId = useQuantaStore((s) => s.beryllium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.beryllium.activeTransition)
  const selectedLevelId = useQuantaStore((s) => s.beryllium.selectedLevelId)
  const setBerylliumTransition = useQuantaStore((s) => s.setBerylliumTransition)
  const setBerylliumLevel = useQuantaStore((s) => s.setBerylliumLevel)
  const startTransition = useQuantaStore((s) => s.startBerylliumTransition)
  const cancelTransition = useQuantaStore((s) => s.cancelBerylliumTransition)

  const activePhysics = activeTransition?.physics
  const currentTransition = activePhysics ?? (selectedTransitionId ? getBerylliumTransition(selectedTransitionId) : getBerylliumTransition('234.9nm')!)

  const lowerLevel = currentTransition ? getBerylliumLevel(currentTransition.lowerLevelId) : null
  const upperLevel = currentTransition ? getBerylliumLevel(currentTransition.upperLevelId) : null
  const isCurrentUpper = selectedLevelId === upperLevel?.id
  const isAbsorption = !isCurrentUpper

  const { deltaEStateEv, photonEnergyEv } = currentTransition
    ? calculateBerylliumStateEnergyDelta(currentTransition, isAbsorption ? 'absorption' : 'emission')
    : { deltaEStateEv: 0, photonEnergyEv: 0 }

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

      {/* Metric Preview or Active Progress (canonical H/He transition-action shell) */}
      {isTransitioning && activeTransition ? (
        <div className="active-transition-view">
          <div className="progress-info">
            <span className="phase-text">
              {getPhaseDescription(activeTransition.phase, activeTransition.type)}
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
            onClick={() => setBerylliumLevel(isAbsorption ? upperLevel.id : lowerLevel.id)}
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

import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { safeHydrogenTransition } from '../physics/hydrogen'

export function TransitionControls() {
  const initialLevel = useQuantaStore((s) => s.initialLevel)
  const targetLevel = useQuantaStore((s) => s.targetLevel)
  const setInitialLevel = useQuantaStore((s) => s.setInitialLevel)
  const setTargetLevel = useQuantaStore((s) => s.setTargetLevel)
  const startTransition = useQuantaStore((s) => s.startTransition)
  const cancelTransition = useQuantaStore((s) => s.cancelTransition)
  const activeTransition = useQuantaStore((s) => s.activeTransition)

  const transition = useMemo(() => {
    return safeHydrogenTransition(initialLevel, targetLevel)
  }, [initialLevel, targetLevel])

  const playing = useQuantaStore((s) => s.playing)
  const isTransitioning = Boolean(activeTransition)
  const isAbsorption = transition ? transition.direction === 'absorption' : false

  const handleQuickPreset = (from: number, to: number) => {
    if (isTransitioning) return
    setInitialLevel(from)
    setTargetLevel(to)
  }

  const getPhaseDescription = (phase: string, type: 'absorption' | 'emission') => {
    switch (phase) {
      case 'photonIncoming':
        return 'Incoming photon wave packet propagating toward electronic state…'
      case 'interaction':
        return type === 'absorption'
          ? 'Electronic state absorbing photon energy…'
          : 'Electronic state liberating discrete photon energy…'
      case 'electronTransition':
        return type === 'absorption'
          ? 'Photon absorption excites the electron to higher-energy state…'
          : 'Transition to lower electronic state…'
      case 'photonOutgoing':
        return 'Liberated photon wave packet propagating outward…'
      case 'settle':
        return 'Stabilizing target electronic state…'
      default:
        return 'Transitioning state…'
    }
  }

  return (
    <div className="transition-controls glass-floating" aria-label="State Transition Controls">
      <div className="controls-header">
        <span className="controls-title">QUANTUM JUMP CONTROLLER</span>
        {isTransitioning && <span className="transition-active-badge">{playing ? 'IN PROGRESS' : 'PAUSED'}</span>}
      </div>

      {/* Level Selectors */}
      <div className="level-select-grid">
        <div className="select-field">
          <label htmlFor="initial-level-select">INITIAL STATE (nᵢ)</label>
          <select
            id="initial-level-select"
            value={initialLevel}
            disabled={isTransitioning}
            onChange={(e) => setInitialLevel(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                n = {n}
              </option>
            ))}
          </select>
        </div>

        <div className="select-divider">→</div>

        <div className="select-field">
          <label htmlFor="target-level-select">FINAL STATE (n𝒻)</label>
          <select
            id="target-level-select"
            value={targetLevel}
            disabled={isTransitioning}
            onChange={(e) => setTargetLevel(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                n = {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Scientific Presets */}
      <div className="preset-buttons-row">
        <button
          className="preset-btn"
          disabled={isTransitioning}
          onClick={() => handleQuickPreset(1, 3)}
          title="Excite ground state n=1 to n=3"
        >
          1 → 3 (Ly-β)
        </button>
        <button
          className="preset-btn signature-btn"
          disabled={isTransitioning}
          onClick={() => handleQuickPreset(3, 2)}
          title="Signature Balmer H-alpha emission (656.5 nm Red)"
        >
          3 → 2 (H-α)
        </button>
        <button
          className="preset-btn"
          disabled={isTransitioning}
          onClick={() => handleQuickPreset(4, 2)}
          title="Balmer H-beta emission (486.3 nm Cyan)"
        >
          4 → 2 (H-β)
        </button>
        <button
          className="preset-btn"
          disabled={isTransitioning}
          onClick={() => handleQuickPreset(2, 1)}
          title="Lyman-alpha UV emission (121.6 nm)"
        >
          2 → 1 (Ly-α)
        </button>
      </div>

      {/* Metric Preview or Active Progress */}
      {isTransitioning && activeTransition ? (
        <div className="active-transition-view">
          <div className="progress-info">
            <span className="phase-text">
              {playing ? getPhaseDescription(activeTransition.phase, activeTransition.type) : 'Transition paused. Select PLAY to continue.'}
            </span>
            <span className="progress-percent">{Math.round(activeTransition.progress * 100)}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${activeTransition.progress * 100}%`,
                backgroundColor: activeTransition.physics.displayColor,
              }}
            />
          </div>
          <button className="cancel-transition-btn" onClick={cancelTransition}>
            CANCEL TRANSITION
          </button>
        </div>
      ) : transition ? (
        <div className="transition-summary-row">
          <div className="summary-item">
            <span className="summary-label">ΔE</span>
            <strong className="summary-val">{transition.deltaEnergyEv.toFixed(3)} eV</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Wavelength</span>
            <strong className="summary-val" style={{ color: transition.displayColor }}>
              {transition.wavelengthNm.toFixed(1)} nm
            </strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Series</span>
            <strong className="summary-val">{transition.series}</strong>
          </div>
        </div>
      ) : (
        <div className="invalid-transition-hint">
          <span>Choose two distinct levels to configure transition.</span>
        </div>
      )}

      {/* Trigger Button */}
      {!isTransitioning && (
        <div className="trigger-row">
          {transition ? (
            <button
              className={`primary-action-btn ${isAbsorption ? 'absorb-btn' : 'emit-btn'}`}
              onClick={() => startTransition()}
            >
              {isAbsorption ? (
                <>
                  <span className="action-icon">↑</span>
                  <span>ABSORB PHOTON (+{transition.photonEnergyEv.toFixed(2)} eV)</span>
                </>
              ) : (
                <>
                  <span className="action-icon">↓</span>
                  <span>EMIT PHOTON ({transition.lineName} · {transition.wavelengthNm.toFixed(1)} nm)</span>
                </>
              )}
            </button>
          ) : (
            <button className="primary-action-btn disabled-btn" disabled>
              SELECT TWO DIFFERENT LEVELS
            </button>
          )}
        </div>
      )}
    </div>
  )
}

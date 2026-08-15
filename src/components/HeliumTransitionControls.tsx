import { useState, useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  HELIUM_TRANSITIONS,
  getHeliumLevel,
  getHeliumTransition,
  calculateStateEnergyDelta,
} from '../physics/helium'

export function HeliumTransitionControls() {
  const selectedTransitionId = useQuantaStore((s) => s.helium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.helium.activeTransition)
  const selectedLevelId = useQuantaStore((s) => s.helium.selectedLevelId)
  const setHeliumTransition = useQuantaStore((s) => s.setHeliumTransition)
  const setHeliumLevel = useQuantaStore((s) => s.setHeliumLevel)
  const startHeliumTransition = useQuantaStore((s) => s.startHeliumTransition)
  const cancelHeliumTransition = useQuantaStore((s) => s.cancelHeliumTransition)

  const [showComponents, setShowComponents] = useState(false)

  const transition = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getHeliumTransition(selectedTransitionId)
    return getHeliumTransition('587.6nm')!
  }, [activeTransition, selectedTransitionId])

  const isTransitioning = Boolean(activeTransition)
  const lowerLevel = transition ? getHeliumLevel(transition.lowerLevelId) : null
  const upperLevel = transition ? getHeliumLevel(transition.upperLevelId) : null

  const isCurrentlyUpper = selectedLevelId === upperLevel?.id
  const isAbsorption = !isCurrentlyUpper
  const direction = isAbsorption ? 'absorption' : 'emission'

  const { deltaEStateEv, photonEnergyEv } = transition
    ? calculateStateEnergyDelta(transition, direction)
    : { deltaEStateEv: 0, photonEnergyEv: 0 }

  const handleSelectPreset = (id: string) => {
    if (isTransitioning) return
    setHeliumTransition(id)
  }

  const getPhaseDescription = (phase: string, type: 'absorption' | 'emission') => {
    switch (phase) {
      case 'photonIncoming':
        return 'Incoming photon wave packet propagating toward electronic state…'
      case 'interaction':
        return type === 'absorption'
          ? 'Helium electronic state absorbing photon energy (ΔE > 0)…'
          : 'Helium electronic state liberating discrete photon energy (ΔE < 0)…'
      case 'electronTransition':
        return type === 'absorption'
          ? `Valence electron excites: ${lowerLevel?.termSymbol} → ${upperLevel?.termSymbol}…`
          : `Valence electron relaxes: ${upperLevel?.termSymbol} → ${lowerLevel?.termSymbol}…`
      case 'photonOutgoing':
        return 'Liberated spectral photon wave packet propagating into the far field…'
      case 'settle':
        return 'Stabilizing target electronic state…'
      default:
        return 'Transitioning electronic configuration…'
    }
  }

  return (
    <div className="transition-controls glass-floating" aria-label="Helium State Transition Controls">
      <div className="controls-header">
        <div className="controls-title-wrap">
          <span className="controls-title">HELIUM TRANSITION CONTROLLER</span>
          <span className="provenance-tag">NIST ASD LINES</span>
        </div>
        {isTransitioning && <span className="transition-active-badge">IN PROGRESS</span>}
      </div>

      {/* Quick Scientific Line Presets */}
      <div className="preset-buttons-row helium-presets">
        <button
          className={`preset-btn signature-btn ${transition?.id === '587.6nm' ? 'selected-preset' : ''}`}
          disabled={isTransitioning}
          onClick={() => handleSelectPreset('587.6nm')}
          title="Hero Solar Eclipse Line: 587.561 nm (Air) Multiplet"
        >
          587.6 nm (D₃ Multiplet)
        </button>
        <button
          className={`preset-btn ${transition?.id === '667.8nm' ? 'selected-preset' : ''}`}
          disabled={isTransitioning}
          onClick={() => handleSelectPreset('667.8nm')}
          title="Singlet Red Line: 667.815 nm (Air)"
        >
          667.8 nm (Singlet Red)
        </button>
        <button
          className={`preset-btn ${transition?.id === '58.4nm' ? 'selected-preset' : ''}`}
          disabled={isTransitioning}
          onClick={() => handleSelectPreset('58.4nm')}
          title="Ground-State EUV Resonance Line: 58.4334 nm (Vacuum)"
        >
          58.4 nm (EUV Resonance)
        </button>
        <button
          className={`preset-btn ${transition?.id === '706.5nm' ? 'selected-preset' : ''}`}
          disabled={isTransitioning}
          onClick={() => handleSelectPreset('706.5nm')}
          title="Deep Red Triplet Multiplet: 706.519 nm (Air)"
        >
          706.5 nm (Deep Red)
        </button>
        <button
          className={`preset-btn ${transition?.id === '501.6nm' ? 'selected-preset' : ''}`}
          disabled={isTransitioning}
          onClick={() => handleSelectPreset('501.6nm')}
          title="Cyan-Green Singlet Line: 501.568 nm (Air)"
        >
          501.6 nm (Cyan-Green)
        </button>
        <button
          className={`preset-btn ${transition?.id === '388.9nm' ? 'selected-preset' : ''}`}
          disabled={isTransitioning}
          onClick={() => handleSelectPreset('388.9nm')}
          title="Near-UV / Violet Triplet Multiplet: 388.865 nm (Air)"
        >
          388.9 nm (Violet)
        </button>
        <button
          className={`preset-btn ${transition?.id === '1083.0nm' ? 'selected-preset' : ''}`}
          disabled={isTransitioning}
          onClick={() => handleSelectPreset('1083.0nm')}
          title="Near-Infrared Triplet Multiplet: 1083.03 nm (Air)"
        >
          1083.0 nm (Near-IR)
        </button>
      </div>

      {/* Metric Preview or Active Progress */}
      {isTransitioning && activeTransition ? (
        <div className="active-transition-view">
          <div className="progress-info">
            <span className="phase-text">
              {getPhaseDescription(activeTransition.phase, activeTransition.type)}
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
          <button className="cancel-transition-btn" onClick={cancelHeliumTransition}>
            CANCEL TRANSITION
          </button>
        </div>
      ) : transition && lowerLevel && upperLevel ? (
        <div className="transition-summary-block">
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
              <span className="summary-label">Wavelength ({transition.wavelengthMedium})</span>
              <strong className="summary-val" style={{ color: transition.displayColor }}>
                {transition.wavelengthNm.toFixed(3)} nm
              </strong>
            </div>
          </div>

          <div className="transition-detail-strip">
            <span className="detail-meta">
              <strong>{isAbsorption ? 'ABSORPTION' : 'EMISSION'}:</strong>{' '}
              {isAbsorption
                ? `${lowerLevel.configuration} ${lowerLevel.termSymbol} → ${upperLevel.configuration} ${upperLevel.termSymbol}`
                : `${upperLevel.configuration} ${upperLevel.termSymbol} → ${lowerLevel.configuration} ${lowerLevel.termSymbol}`}
            </span>
            <span className="detail-color-note">{transition.colorDescription}</span>
          </div>

          {/* Fine Structure Components Toggle */}
          {transition.components && transition.components.length > 1 && (
            <div className="fine-structure-toggle-row">
              <button
                className="fine-structure-btn"
                onClick={() => setShowComponents((v) => !v)}
              >
                {showComponents ? '▾ HIDE FINE STRUCTURE' : '▸ VIEW FINE-STRUCTURE COMPONENTS (' + transition.components.length + ')'}
              </button>
              {showComponents && (
                <div className="fine-structure-list">
                  {transition.components.map((c, i) => (
                    <div key={i} className="component-item">
                      <span className="component-transition">{c.comment ?? `J=${c.lowerJ} ↔ J=${c.upperJ}`}</span>
                      <strong className="component-wl">{c.wavelengthNm.toFixed(4)} nm ({c.wavelengthMedium})</strong>
                      {c.relativeIntensity && (
                        <span className="component-rel">Rel. Int: {c.relativeIntensity}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Trigger Action Button */}
      {!isTransitioning && transition && lowerLevel && upperLevel && (
        <div className="trigger-row-dual">
          <button
            className={`primary-action-btn ${isAbsorption ? 'absorb-btn' : 'emit-btn'}`}
            onClick={() => startHeliumTransition(transition.id, isAbsorption ? 'absorption' : 'emission')}
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
                  EMIT PHOTON ({transition.lineName} · {upperLevel.termSymbol} → {lowerLevel.termSymbol})
                </span>
              </>
            )}
          </button>

          {/* Direction toggle button if user wants to prime the opposite state */}
          <button
            className="secondary-action-btn"
            onClick={() => setHeliumLevel(isAbsorption ? upperLevel.id : lowerLevel.id)}
            title={isAbsorption ? 'Set atom to upper state to enable emission' : 'Set atom to lower state to enable absorption'}
          >
            {isAbsorption ? 'PREPARE EMISSION (JUMP TO UPPER)' : 'PREPARE ABSORPTION (JUMP TO LOWER)'}
          </button>
        </div>
      )}
    </div>
  )
}

import React from 'react'

export interface EnergyLevelRowProps {
  stateLabel: string
  termOrDetail?: string
  meta?: string
  badge?: string
  energyEv: number
  energyFormatted?: string
  isActive?: boolean
  isTransitionLower?: boolean
  isTransitionUpper?: boolean
  transitionColor?: string
  accessibleLabel: string
  onClick?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  className?: string
  style?: React.CSSProperties
}

export function EnergyLevelRow({
  stateLabel,
  termOrDetail,
  meta,
  badge,
  energyEv,
  energyFormatted,
  isActive = false,
  isTransitionLower = false,
  isTransitionUpper = false,
  transitionColor,
  accessibleLabel,
  onClick,
  onKeyDown,
  className = '',
  style,
}: EnergyLevelRowProps) {
  const inTransition = Boolean((isTransitionLower || isTransitionUpper) && transitionColor)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e)
    } else if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={`diagram-level-row ${isActive ? 'active-level' : ''} ${
        isTransitionLower ? 'transition-lower' : ''
      } ${isTransitionUpper ? 'transition-upper' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={accessibleLabel}
      style={style}
    >
      <div className="level-identity">
        <span className="level-config">{stateLabel}</span>
        {termOrDetail && <span className="level-term">{termOrDetail}</span>}
        {meta && <span className="level-meta">{meta}</span>}
        {badge && <span className="ground-state-badge">{badge}</span>}
      </div>

      <span className="level-energy scientific-number">
        {energyFormatted ?? `${energyEv.toFixed(3)} eV`}
      </span>

      <div className="level-rule-wrap">
        <div
          className={`level-rule-line ${inTransition ? 'transition-accent-line' : ''}`}
          style={
            inTransition && transitionColor
              ? {
                  backgroundColor: transitionColor,
                  boxShadow: `0 0 6px ${transitionColor}`,
                  opacity: 0.95,
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}

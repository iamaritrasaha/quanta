import React from 'react'

export interface IonizationLimitRowProps {
  title?: string
  reactionText: string
  energyEv: number
  energyFormatted?: string
  subNote?: string
}

export function IonizationLimitRow({
  title,
  reactionText,
  energyEv,
  energyFormatted,
  subNote,
}: IonizationLimitRowProps) {
  return (
    <div className="ionization-limit-row" title={title ?? 'Ionization Limit'}>
      <div className="ionization-row-top">
        <span className="ionization-kicker">IONIZATION LIMIT</span>
        <span className="ionization-value scientific-number">
          {energyFormatted ?? `${energyEv.toFixed(3)} eV`}
        </span>
      </div>

      <div className="ionization-row-bottom">
        <span className="ionization-sub">{reactionText}</span>
        {subNote && <span className="ionization-sub-note">{subNote}</span>}
      </div>

      <div className="ionization-rule-track">
        <div className="ionization-rule-line" />
      </div>
    </div>
  )
}

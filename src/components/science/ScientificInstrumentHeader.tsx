import React from 'react'

export interface ScientificInstrumentHeaderProps {
  title: string
  badgeText: string
  unitLabel: string
}

export function ScientificInstrumentHeader({
  title,
  badgeText,
  unitLabel,
}: ScientificInstrumentHeaderProps) {
  return (
    <header className="diagram-instrument-header">
      <div className="header-left">
        <span className="diagram-main-title">{title}</span>
        <span className="provenance-tag">{badgeText}</span>
      </div>
      <div className="header-right">
        <span className="diagram-unit-label">{unitLabel}</span>
      </div>
    </header>
  )
}

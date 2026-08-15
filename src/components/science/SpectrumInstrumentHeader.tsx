import React from 'react'

export interface SpectrumInstrumentHeaderProps {
  title: string
  badgeText?: string
  classificationOrSeries?: string
  classificationColor?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Standardized header for spectroscopy instruments across all elements.
 * Unifies main title, scientific provenance badge, and current line/series badge.
 */
export function SpectrumInstrumentHeader({
  title,
  badgeText = 'NIST ASD DATA',
  classificationOrSeries,
  classificationColor,
  className = '',
  style,
}: SpectrumInstrumentHeaderProps) {
  return (
    <div className={`spectrum-header ${className}`} style={style}>
      <div className="spectrum-title-wrap">
        <span className="spectrum-title">{title}</span>
        {badgeText && <span className="provenance-tag">{badgeText}</span>}
      </div>
      {classificationOrSeries && (
        <span
          className="spectrum-series-badge"
          style={classificationColor ? { color: classificationColor } : undefined}
        >
          {classificationOrSeries}
        </span>
      )}
    </div>
  )
}

import React from 'react'

export interface AxisBreakBarProps {
  title?: string
  subtitle: string
  subNote?: string
}

export function AxisBreakBar({ title = 'AXIS BREAK', subtitle, subNote }: AxisBreakBarProps) {
  return (
    <div className="energy-axis-break-bar" role="separator" aria-label={`Scale break: ${subtitle}`}>
      <div className="break-center-content">
        <div className="break-title-row">
          <span className="break-glyph">≋</span>
          <span className="break-title">{title}</span>
          <span className="break-glyph">≋</span>
        </div>
        <div className="break-subtitle-wrap">
          <span className="break-subtitle">{subtitle}</span>
          {subNote && <span className="break-subnote">{subNote}</span>}
        </div>
      </div>
    </div>
  )
}

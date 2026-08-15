import React from 'react'
import { SpectralRegionBadge } from './SpectralRegionBadge'
import { SpectralWavelength } from './SpectralWavelength'

export interface SpectralTransitionRowProps {
  id: string
  title: string
  subtitle?: string
  wavelengthNm: number
  wavelengthPrecision?: number
  wavelengthMedium?: 'air' | 'vacuum' | string
  region: string
  displayColor?: string
  isSelected?: boolean
  isDisabled?: boolean
  onClick?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
  extraMeta?: React.ReactNode
}

/**
 * GLOBAL QUANTA SPECTROSCOPY TRANSITION ROW CONTRACT
 * ---------------------------------------------------
 * All element spectroscopy panels (H, He, Li, Be, B, C, N, etc.) MUST use
 * this standardized presentation component or its CSS Grid contract.
 *
 * Layout Architecture:
 * ┌──────────────────────────────────────────────┐
 * │ Title (e.g. Li I · Resonance Doublet)        │
 * │ 670.8 nm · AIR                    [VISIBLE]  │
 * └──────────────────────────────────────────────┘
 *
 * Rules:
 * 1. Title and metadata occupy `minmax(0, 1fr)` and flow through CSS Grid.
 * 2. Region badge occupies protected `max-content` on the right.
 * 3. Numerical wavelength is protected against line breaks (`white-space: nowrap`).
 * 4. Text concatenation (e.g. "670.8 nmVISIBLE") is structurally prevented.
 * 5. Absolutely-positioned text is strictly prohibited.
 */
export function SpectralTransitionRow({
  id,
  title,
  subtitle,
  wavelengthNm,
  wavelengthPrecision = 1,
  wavelengthMedium = 'air',
  region,
  displayColor,
  isSelected = false,
  isDisabled = false,
  onClick,
  onKeyDown,
  ariaLabel,
  className = '',
  style,
  extraMeta,
}: SpectralTransitionRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e)
    } else if ((e.key === 'Enter' || e.key === ' ') && onClick && !isDisabled) {
      e.preventDefault()
      onClick()
    }
  }

  const customStyle: React.CSSProperties = {
    ...style,
    ...(displayColor ? ({ '--row-accent-color': displayColor } as React.CSSProperties) : {}),
  }

  return (
    <button
      type="button"
      id={`transition-row-${id}`}
      className={`spectral-transition-row ${isSelected ? 'active' : ''} ${className}`}
      onClick={isDisabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-label={ariaLabel ?? `${title}, ${wavelengthNm.toFixed(wavelengthPrecision)} nm ${wavelengthMedium}, ${region}`}
      aria-pressed={isSelected}
      style={customStyle}
    >
      <div className="spectral-transition-title-group">
        <span className="spectral-transition-title">{title}</span>
        {subtitle && <span className="spectral-transition-subtitle">{subtitle}</span>}
      </div>

      <div className="spectral-region-wrap">
        <SpectralRegionBadge region={region} />
      </div>

      <div className="spectral-transition-meta">
        <SpectralWavelength
          wavelengthNm={wavelengthNm}
          precision={wavelengthPrecision}
          medium={wavelengthMedium}
          displayColor={displayColor}
          size="sm"
        />
        {extraMeta}
      </div>
    </button>
  )
}

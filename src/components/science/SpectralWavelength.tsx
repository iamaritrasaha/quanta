import React from 'react'

export interface SpectralWavelengthProps {
  wavelengthNm: number
  precision?: number
  medium?: 'air' | 'vacuum' | string
  displayColor?: string
  showMedium?: boolean
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
  style?: React.CSSProperties
}

/**
 * Standardized scientific wavelength display.
 * Protects the numerical value + unit from accidental line-wrapping (`white-space: nowrap`),
 * provides clear separation from medium metadata (e.g. `670.8 nm · AIR`),
 * and optionally applies a restrained wavelength-derived color accent.
 */
export function SpectralWavelength({
  wavelengthNm,
  precision = 1,
  medium,
  displayColor,
  showMedium = true,
  size = 'md',
  className = '',
  style,
}: SpectralWavelengthProps) {
  const formattedVal = wavelengthNm.toFixed(precision)

  return (
    <div className={`spectral-wavelength size-${size} ${className}`} style={style}>
      <span
        className="wavelength-value scientific-number"
        style={displayColor ? { color: displayColor } : undefined}
      >
        {`${formattedVal} nm`}
      </span>
      {showMedium && medium && (
        <span className="wavelength-medium-tag">
          {`· ${medium.toUpperCase()}`}
        </span>
      )}
    </div>
  )
}

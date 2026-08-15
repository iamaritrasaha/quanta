import React from 'react'
import { SpectralRegionBadge } from './SpectralRegionBadge'

export interface SpectralHeroResultProps {
  wavelengthNm: number
  wavelengthPrecision?: number
  wavelengthMedium?: 'air' | 'vacuum' | string
  displayColor?: string
  classificationOrSeries?: string
  region?: string
  photonEnergyEv?: number
  description?: string
  colorDescription?: string
  transitionNotation?: string
  isTrueColor?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Standardized Hero Spectral Result presentation component.
 *
 * Rules:
 * 1. Numerical wavelength (e.g. "670.778 nm") is protected against wrapping (`white-space: nowrap`).
 * 2. Does NOT place lengthy prose alongside the huge numerical value at narrow container widths.
 * 3. Uses container-query driven layout:
 *    - Wide container: Wavelength and line title on left; medium, region, and energy on right; description below.
 *    - Narrow container (< 520px): Cleanly stacked hierarchy (wavelength -> title -> tags -> description).
 */
export function SpectralHeroResult({
  wavelengthNm,
  wavelengthPrecision = 3,
  wavelengthMedium = 'air',
  displayColor,
  classificationOrSeries,
  region,
  photonEnergyEv,
  description,
  colorDescription,
  transitionNotation,
  isTrueColor,
  className = '',
  style,
}: SpectralHeroResultProps) {
  const formattedWl = `${wavelengthNm.toFixed(wavelengthPrecision)} nm`

  return (
    <div
      className={`spectral-hero-result glass-surface ${className}`}
      style={style}
      aria-label={`Spectral result: ${formattedWl}, ${classificationOrSeries ?? ''}`}
    >
      <div className="hero-result-header">
        <div className="hero-result-primary-col">
          <span
            className="hero-wavelength-value scientific-number"
            style={displayColor ? { color: displayColor } : undefined}
          >
            {formattedWl}
          </span>
          {classificationOrSeries && (
            <span className="hero-transition-name">{classificationOrSeries}</span>
          )}
          {transitionNotation && (
            <span className="hero-transition-notation">{transitionNotation}</span>
          )}
        </div>

        <div className="hero-result-meta-col">
          <div className="hero-meta-tags">
            {wavelengthMedium && (
              <span className="hero-meta-tag">{`${wavelengthMedium.toUpperCase()} MEDIUM`}</span>
            )}
            {region && <SpectralRegionBadge region={region} />}
            {photonEnergyEv !== undefined && (
              <span className="hero-meta-energy scientific-number">
                {`Eγ = ${photonEnergyEv.toFixed(3)} eV`}
              </span>
            )}
          </div>
        </div>
      </div>

      {(description || colorDescription) && (
        <p className="hero-result-description">
          {description ? `${description} ` : ''}
          {colorDescription ? `${colorDescription}.` : ''}
          {isTrueColor !== undefined && !isTrueColor && (
            <span className="false-color-note">
              {' (False-color visualization — radiation lies outside the human visible spectrum).'}
            </span>
          )}
        </p>
      )}
    </div>
  )
}

import React from 'react'
import { SpectralWavelength } from './SpectralWavelength'

export interface FineStructureComponentRowProps {
  comment?: string
  wavelengthNm: number
  wavelengthPrecision?: number
  wavelengthMedium?: 'air' | 'vacuum' | string
  relativeIntensity?: string | number
  energyCm1?: number
  energyEv?: number
  displayColor?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Standardized fine-structure component row.
 * Uses a responsive grid that keeps notation on the left and high-precision wavelength on the right,
 * with graceful wrapping at narrow widths without clipping.
 */
export function FineStructureComponentRow({
  comment,
  wavelengthNm,
  wavelengthPrecision = 4,
  wavelengthMedium = 'air',
  relativeIntensity,
  energyCm1,
  energyEv,
  displayColor,
  className = '',
  style,
}: FineStructureComponentRowProps) {
  return (
    <div className={`fs-component-row ${className}`} style={style}>
      <div className="fs-component-identity">
        {comment && <span className="fs-component-comment">{comment}</span>}
        {(energyCm1 !== undefined || energyEv !== undefined) && (
          <span className="fs-component-energy scientific-number">
            {`${energyCm1 !== undefined ? `${energyCm1.toFixed(2)} cm⁻¹` : ''}${energyCm1 !== undefined && energyEv !== undefined ? ' · ' : ''}${energyEv !== undefined ? `${energyEv.toFixed(5)} eV` : ''}`}
          </span>
        )}
      </div>

      <div className="fs-component-wl-col">
        <SpectralWavelength
          wavelengthNm={wavelengthNm}
          precision={wavelengthPrecision}
          medium={wavelengthMedium}
          displayColor={displayColor}
          size="sm"
        />
        {relativeIntensity !== undefined && (
          <span className="fs-component-rel-int">
            {`Rel. Int: ${relativeIntensity}`}
          </span>
        )}
      </div>
    </div>
  )
}

import React from 'react'

export interface SpectralRegionBadgeProps {
  region: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Standardized scientific badge for spectral regions (e.g. VISIBLE, NIR, UV, EUV, IR).
 * Enforces restrained scientific metadata typography without visual collisions.
 */
export function SpectralRegionBadge({
  region,
  className = '',
  style,
}: SpectralRegionBadgeProps) {
  const normalized = region.toUpperCase()

  return (
    <span
      className={`spectral-region-badge region-${normalized.toLowerCase()} ${className}`}
      style={style}
    >
      {normalized}
    </span>
  )
}

import React from 'react'

export interface TransitionStatusCardProps {
  direction: 'absorption' | 'emission'
  wavelengthNm: number
  wavelengthMedium?: 'air' | 'vacuum'
  photonEnergyEv: number
  bandOrRegion: string
  lineName: string
  seriesOrDetail?: string
  displayColor: string
}

export function TransitionStatusCard({
  direction,
  wavelengthNm,
  wavelengthMedium,
  photonEnergyEv,
  bandOrRegion,
  lineName,
  seriesOrDetail,
  displayColor,
}: TransitionStatusCardProps) {
  const isEmission = direction === 'emission'

  return (
    <div className="transition-status-card" style={{ borderColor: displayColor }}>
      <div className="status-col-left">
        <span className="status-direction-badge" style={{ color: displayColor }}>
          {isEmission ? '↓ EMISSION' : '↑ ABSORPTION'}
        </span>
      </div>
      <div className="status-col-center">
        <div className="status-wl-row">
          <span className="status-wl-val scientific-number" style={{ color: displayColor }}>
            {wavelengthNm.toFixed(1)} nm
          </span>
          {wavelengthMedium && (
            <span className="status-medium-tag">· {wavelengthMedium.toUpperCase()}</span>
          )}
        </div>
        <div className="status-sub-name">
          {seriesOrDetail ? `${seriesOrDetail} · ${lineName}` : lineName}
        </div>
      </div>
      <div className="status-col-right">
        <div className="status-energy-val scientific-number">
          Eγ = {photonEnergyEv.toFixed(3)} eV
        </div>
        <div className="status-region-tag">{bandOrRegion.toUpperCase()}</div>
      </div>
    </div>
  )
}

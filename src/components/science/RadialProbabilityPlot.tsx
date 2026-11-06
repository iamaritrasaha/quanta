import { useMemo } from 'react'
import { evaluateRadialProbability, evaluateRadialWavefunction } from '../../physics/orbitals'

interface RadialProbabilityPlotProps {
  n: number
  l: number
  zEffective: number
  rPeak: number
  radialNodes: number
}

export function RadialProbabilityPlot({
  n,
  l,
  zEffective,
  rPeak,
  radialNodes,
}: RadialProbabilityPlotProps) {
  const plotData = useMemo(() => {
    const width = 280
    const height = 75
    const padding = { top: 8, bottom: 18, left: 24, right: 12 }
    const plotW = width - padding.left - padding.right
    const plotH = height - padding.top - padding.bottom

    const rMax = Math.max(7.0, rPeak * 2.3)
    const steps = 100
    const points: { r: number; p: number; x: number; y: number }[] = []

    let maxP = 0.0001
    for (let i = 0; i <= steps; i++) {
      const r = (i / steps) * rMax
      const p = evaluateRadialProbability(n, l, r, zEffective)
      if (p > maxP) maxP = p
      points.push({ r, p, x: 0, y: 0 })
    }

    // Scale points to SVG coordinates
    for (const pt of points) {
      pt.x = padding.left + (pt.r / rMax) * plotW
      pt.y = padding.top + plotH - (pt.p / maxP) * plotH
    }

    // Build SVG path
    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
    }, '')

    const areaD = `${pathD} L ${padding.left + plotW} ${padding.top + plotH} L ${padding.left} ${padding.top + plotH} Z`

    // Peak position
    const peakX = Math.min(padding.left + plotW, Math.max(padding.left, padding.left + (rPeak / rMax) * plotW))

    // Estimate radial node locations (roots where R(r) changes sign)
    const nodeRadii: number[] = []
    if (radialNodes > 0) {
      let prevSign = 0
      for (let i = 1; i <= 300; i++) {
        const rTest = (i / 300) * rMax
        const val = evaluateRadialWavefunction(n, l, rTest, zEffective)
        const sign = Math.sign(val)
        if (prevSign !== 0 && sign !== 0 && sign !== prevSign) {
          nodeRadii.push(rTest)
        }
        if (sign !== 0) prevSign = sign
      }
    }

    const nodeMarkers = nodeRadii.slice(0, radialNodes).map((r) => ({
      r,
      x: padding.left + (r / rMax) * plotW,
    }))

    return {
      width,
      height,
      padding,
      plotW,
      plotH,
      rMax,
      maxP,
      pathD,
      areaD,
      peakX,
      nodeMarkers,
    }
  }, [n, l, zEffective, rPeak, radialNodes])

  return (
    <div className="radial-plot-card">
      <div className="radial-plot-header">
        <span className="radial-plot-title">RADIAL PROBABILITY DENSITY P(r) = r²|R_{n}{l}(r)|²</span>
        <span className="radial-plot-peak">r_peak ≈ {rPeak.toFixed(2)} a₀</span>
      </div>

      <svg
        viewBox={`0 0 ${plotData.width} ${plotData.height}`}
        className="radial-svg"
        aria-label={`Radial probability curve for n=${n}, l=${l}`}
      >
        <defs>
          <linearGradient id={`radialGrad-${n}-${l}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Axes */}
        <line
          x1={plotData.padding.left}
          y1={plotData.padding.top + plotData.plotH}
          x2={plotData.padding.left + plotData.plotW}
          y2={plotData.padding.top + plotData.plotH}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
        <line
          x1={plotData.padding.left}
          y1={plotData.padding.top}
          x2={plotData.padding.left}
          y2={plotData.padding.top + plotData.plotH}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />

        {/* Shaded Area */}
        <path d={plotData.areaD} fill={`url(#radialGrad-${n}-${l})`} />

        {/* Curve Line */}
        <path d={plotData.pathD} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

        {/* Peak Indicator */}
        <line
          x1={plotData.peakX}
          y1={plotData.padding.top}
          x2={plotData.peakX}
          y2={plotData.padding.top + plotData.plotH}
          stroke="#fbbf24"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.8"
        />

        {/* Radial Node Markers */}
        {plotData.nodeMarkers.map((marker, idx) => (
          <g key={idx}>
            <circle
              cx={marker.x}
              cy={plotData.padding.top + plotData.plotH}
              r="2.5"
              fill="#fb923c"
              stroke="#080a0f"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Axis Labels */}
        <text
          x={plotData.padding.left}
          y={plotData.padding.top + plotData.plotH + 12}
          fill="rgba(255, 255, 255, 0.4)"
          fontSize="8"
          fontFamily="JetBrains Mono, monospace"
        >
          0
        </text>
        <text
          x={plotData.padding.left + plotData.plotW}
          y={plotData.padding.top + plotData.plotH + 12}
          fill="rgba(255, 255, 255, 0.4)"
          fontSize="8"
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
        >
          {plotData.rMax.toFixed(1)} a₀
        </text>
        <text
          x={plotData.padding.left - 4}
          y={plotData.padding.top + 6}
          fill="rgba(255, 255, 255, 0.4)"
          fontSize="8"
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
        >
          P
        </text>
      </svg>

      <div className="radial-plot-footer">
        <span className="radial-node-legend">
          <span className="dot peak-dot" /> Peak radius
          {radialNodes > 0 && (
            <>
              <span className="dot node-dot" style={{ marginLeft: '0.6rem' }} /> {radialNodes} Radial{' '}
              {radialNodes === 1 ? 'Node' : 'Nodes'}
            </>
          )}
        </span>
      </div>
    </div>
  )
}

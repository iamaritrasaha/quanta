interface ShellDiagramProps {
  occupancy: Array<{ shell: number; electrons: number }>
  symbol: string
  color?: string
  size?: number
}

const SHELL_LETTERS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']

/**
 * High-precision, lightweight SVG concentric circular shell diagram.
 * Strictly labeled as a schematic representation of Bohr shell occupancy.
 */
export function ShellDiagram({
  occupancy,
  symbol,
  color = '#93c5fd',
  size = 115,
}: ShellDiagramProps) {
  const center = size / 2
  const maxRadius = size * 0.42
  const minRadius = size * 0.16
  const shellsCount = Math.max(1, occupancy.length)
  const radiusStep = shellsCount > 1 ? (maxRadius - minRadius) / (shellsCount - 1) : 0

  return (
    <div className="shell-diagram-wrapper" aria-label={`Schematic shell occupancy for ${symbol}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="shell-diagram-svg"
        aria-hidden="true"
        width={size}
        height={size}
      >
        <defs>
          <radialGradient id={`nucleus-grad-${symbol}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Concentric shell paths */}
        {occupancy.map((sh, idx) => {
          const r = minRadius + idx * radiusStep
          return (
            <g key={sh.shell} className="shell-orbit-group">
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="rgba(255, 255, 255, 0.13)"
                strokeWidth="1"
                strokeDasharray={idx % 2 === 1 ? '2.5 2.5' : undefined}
              />
              {/* Shell letter tag at top */}
              <text
                x={center}
                y={center - r + 3}
                fill="rgba(255, 255, 255, 0.4)"
                fontSize={size < 130 ? '6' : '7.5'}
                fontFamily="var(--font-mono)"
                textAnchor="middle"
              >
                {SHELL_LETTERS[sh.shell - 1] ?? sh.shell}
              </text>
            </g>
          )
        })}

        {/* Nucleus icon */}
        <circle
          cx={center}
          cy={center}
          r={size * 0.08}
          fill={`url(#nucleus-grad-${symbol})`}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="0.8"
        />
        <text
          x={center}
          y={center + (size * 0.08) / 3.2}
          fill="#f8fafc"
          fontSize={size < 130 ? '7.5' : '9'}
          fontWeight="bold"
          fontFamily="var(--font-sans)"
          textAnchor="middle"
        >
          {symbol}
        </text>

        {/* Electrons along orbits */}
        {occupancy.map((sh, idx) => {
          const r = minRadius + idx * radiusStep
          const count = sh.electrons
          const displayDots = Math.min(count, 16)
          const angleStep = (2 * Math.PI) / displayDots

          return (
            <g key={`dots-${sh.shell}`}>
              {Array.from({ length: displayDots }).map((_, dotIdx) => {
                const angle = dotIdx * angleStep - Math.PI / 2
                const cx = center + r * Math.cos(angle)
                const cy = center + r * Math.sin(angle)
                return (
                  <circle
                    key={dotIdx}
                    cx={cx}
                    cy={cy}
                    r={size < 130 ? '1.8' : '2.2'}
                    fill={color}
                    stroke="rgba(0, 0, 0, 0.85)"
                    strokeWidth="0.5"
                    className="electron-dot"
                  />
                )
              })}
            </g>
          )
        })}
      </svg>
      <div className="shell-caption">
        <span className="shell-caption-label">Schematic Bohr shells</span>
        <span className="shell-caption-seq">
          {occupancy.map((s) => `${SHELL_LETTERS[s.shell - 1] ?? s.shell}:${s.electrons}`).join(' · ')}
        </span>
      </div>
    </div>
  )
}

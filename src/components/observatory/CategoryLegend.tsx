export function CategoryLegend() {
  return (
    <footer className="observatory-legend glass-surface" aria-label="Scientific notes and legend">
      <div className="legend-instruments-row">
        <div className="instrument-coverage-badge">
          <span className="coverage-dot dedicated-dot" aria-hidden="true" />
          <span className="coverage-title">H–B (Z = 1–5):</span>
          <span className="coverage-desc">Dedicated 3D quantum instruments · analytical/numerical wavefunctions</span>
        </div>
        <div className="instrument-coverage-badge">
          <span className="coverage-dot shared-dot" aria-hidden="true" />
          <span className="coverage-title">C–Og (Z = 6–118):</span>
          <span className="coverage-desc">Comprehensive NIST ASD reference levels & derived vacuum wavelengths</span>
        </div>
      </div>

      <div className="legend-pedagogical-notes">
        <p className="pedagogical-note">
          <strong>Conventional 18-Group Layout:</strong> Group numbers 1–18 follow IUPAC conventions.
          Lanthanoids (La–Lu, Z = 57–71) and Actinoids (Ac–Lr, Z = 89–103) are displayed as pedagogical series
          associated with Periods 6 and 7.
        </p>
        <p className="pedagogical-note">
          <strong>Scientific Notice:</strong> Shell diagrams represent idealized principal-shell occupancy.
          They do not depict classical mechanical trajectories. Transition wavelengths are derived from bound-state
          energy differences without asserting observed line intensities or transition probabilities.
        </p>
      </div>
    </footer>
  )
}

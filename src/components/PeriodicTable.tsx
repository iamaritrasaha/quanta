import { useEffect, useRef, useState } from 'react'
import { elements, elementKey, type Element } from '../data/elements'
import type { ElementKey } from '../state/quantaStore'

interface PeriodicTableProps {
  onSelectElement: (elementKey: ElementKey) => void
}

const categoryClass = (category: Element['category']) => category.replace(/\s+/g, '-')

export function PeriodicTable({ onSelectElement }: PeriodicTableProps) {
  const [enteringSymbol, setEnteringSymbol] = useState<string | null>(null)
  const enterTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (enterTimer.current !== null) window.clearTimeout(enterTimer.current)
  }, [])

  const handleElementClick = (element: Element) => {
    if (enterTimer.current !== null) return
    setEnteringSymbol(element.symbol)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    enterTimer.current = window.setTimeout(() => {
      onSelectElement(elementKey(element))
    }, reducedMotion ? 0 : 550)
  }

  return (
    <main className={`welcome-screen ${enteringSymbol ? 'welcome-entering' : ''}`}>
      <div className="optical-background" />

      <header className="welcome-masthead">
        <div className="masthead-brand">
          <div className="brand-eyebrow">
            <span className="dot-indicator live" />
            <span>OPTICAL SCIENTIFIC INSTRUMENT · ALL 118 ELEMENTS AVAILABLE</span>
          </div>
          <h1 className="brand-title">QUANTA</h1>
          <p className="brand-tagline">Matter, visualized.</p>
        </div>
        <div className="masthead-info">
          <p className="masthead-intro">
            Explore atomic structure, shell occupancy, reference energy levels, and wavelengths derived
            from reference data across the periodic table.
          </p>
          <div className="masthead-stats">
            <span className="active-stat">118 ELEMENTS READY</span>
            <span>·</span>
            <span>NIST LEVELS WHERE AVAILABLE</span>
          </div>
        </div>
      </header>

      <section className="table-stage glass-surface" aria-label="Interactive Periodic Table of Elements">
        <div className="table-stage-header">
          <div className="stage-title-wrap">
            <span className="stage-kicker">INTERACTIVE PERIODIC TABLE</span>
            <span className="stage-hint">Select any element to open its atomic instrument.</span>
          </div>
          <div className="mobile-scroll-hint">
            <span>← Swipe to explore 18 groups →</span>
          </div>
        </div>

        <div className="periodic-table-scroll-wrapper">
          <div className="periodic-table-grid">
            {elements.map((element) => {
              const isEnteringThis = enteringSymbol === element.symbol
              const tileSpecificClass =
                element.number <= 5 ? `${element.name.toLowerCase()}-tile` : 'multi-element-tile'

              return (
                <button
                  key={element.symbol}
                  className={`element-tile ${categoryClass(element.category)} ${tileSpecificClass} ${
                    isEnteringThis ? 'entering-focus' : ''
                  }`}
                  style={{ gridColumn: element.gridColumn, gridRow: element.gridRow }}
                  onClick={() => handleElementClick(element)}
                  aria-label={`${element.name}, atomic number ${element.number}, open instrument`}
                >
                  <div className="tile-top-row">
                    <span className="atomic-number">{element.number}</span>
                    <span className="explore-tag">{element.number <= 5 ? 'EXPLORE' : 'OPEN'}</span>
                  </div>
                  <strong className="element-symbol">{element.symbol}</strong>
                  <span className="element-name">{element.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <footer className="table-stage-footer">
          <div className="legend-items">
            <span className="legend-item">
              <b className="legend-dot hydrogen-dot" /> H–B: element-specific instruments
            </span>
            <span className="legend-item">
              <b className="legend-dot multi-element-dot" /> C–Og: shared multi-element instrument
            </span>
          </div>
          <span className="table-nav-note">
            Neutral-atom reference levels are shown where available in NIST ASD.
          </span>
        </footer>
      </section>

      <footer className="welcome-global-footer">
        <div className="welcome-footer-left">
          <span className="welcome-footer-brand">QUANTA — Matter, visualized.</span>
          <span className="welcome-footer-meta">
            Created by{' '}
            <a
              href="https://github.com/iamaritrasaha"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-author-link"
            >
              Aritra Saha
            </a>{' '}
            · A Foresight Labs project
          </span>
        </div>
        <div className="welcome-footer-right">
          <span>Visual scale compressed for observational clarity</span>
          <span>© 2026 Aritra Saha</span>
        </div>
      </footer>
    </main>
  )
}

import { useState } from 'react'
import { elements, type Element } from '../data/elements'
import type { ElementKey } from '../state/quantaStore'

interface PeriodicTableProps {
  onSelectElement: (elementKey: ElementKey) => void
  onSelectHydrogen?: () => void
}

const categoryClass = (c: Element['category']) => c.replace(/\s+/g, '-')

export function PeriodicTable({ onSelectElement, onSelectHydrogen }: PeriodicTableProps) {
  const [selectedNoticeElement, setSelectedNoticeElement] = useState<Element | null>(null)
  const [enteringSymbol, setEnteringSymbol] = useState<string | null>(null)

  const handleElementClick = (element: Element) => {
    if (element.available) {
      setEnteringSymbol(element.symbol)
      setTimeout(() => {
        if (element.symbol === 'H') {
          if (onSelectElement) onSelectElement('hydrogen')
          else if (onSelectHydrogen) onSelectHydrogen()
        } else if (element.symbol === 'He') {
          if (onSelectElement) onSelectElement('helium')
        } else if (element.symbol === 'Li') {
          if (onSelectElement) onSelectElement('lithium')
        } else if (element.symbol === 'Be') {
          if (onSelectElement) onSelectElement('beryllium')
        }
      }, 550)
    } else {
      setSelectedNoticeElement(element)
    }
  }

  return (
    <main className={`welcome-screen ${enteringSymbol ? 'welcome-entering' : ''}`}>
      {/* Ambient optical background */}
      <div className="optical-background" />

      {/* Masthead Header */}
      <header className="welcome-masthead">
        <div className="masthead-brand">
          <div className="brand-eyebrow">
            <span className="dot-indicator live" />
            <span>OPTICAL SCIENTIFIC INSTRUMENT · INSTRUMENTS 01–04 ACTIVE</span>
          </div>
          <h1 className="brand-title">QUANTA</h1>
          <p className="brand-tagline">Matter, visualized.</p>
        </div>
        <div className="masthead-info">
          <p className="masthead-intro">
            Explore quantized atomic physics from historical orbital models to modern Schrödinger
            eigenfunctions and many-electron quantum mechanics.
          </p>
          <div className="masthead-stats">
            <span className="active-stat">4 ELEMENTS ACTIVE (H · He · Li · Be)</span>
            <span>·</span>
            <span>114 STAGED</span>
          </div>
        </div>
      </header>

      {/* Periodic Table Glass Stage */}
      <section className="table-stage glass-surface" aria-label="Interactive Periodic Table of Elements">
        <div className="table-stage-header">
          <div className="stage-title-wrap">
            <span className="stage-kicker">INTERACTIVE PERIODIC TABLE</span>
            <span className="stage-hint">Select Hydrogen (H), Helium (He), Lithium (Li), or Beryllium (Be) to initialize the 3D atomic instrument</span>
          </div>
          <div className="mobile-scroll-hint">
            <span>← Swipe to explore 18 groups →</span>
          </div>
        </div>

        <div className="periodic-table-scroll-wrapper">
          <div className="periodic-table-grid">
            {elements.map((el) => {
              const isH = el.symbol === 'H'
              const isHe = el.symbol === 'He'
              const isLi = el.symbol === 'Li'
              const isBe = el.symbol === 'Be'
              const isAvailable = el.available
              const isEnteringThis = enteringSymbol === el.symbol

              let tileSpecificClass = 'unsupported-tile'
              if (isH) tileSpecificClass = 'hydrogen-tile'
              if (isHe) tileSpecificClass = 'helium-tile'
              if (isLi) tileSpecificClass = 'lithium-tile'
              if (isBe) tileSpecificClass = 'beryllium-tile'

              return (
                <button
                  key={el.symbol}
                  className={`element-tile ${categoryClass(el.category)} ${tileSpecificClass} ${
                    isEnteringThis ? 'entering-focus' : ''
                  }`}
                  style={{
                    gridColumn: el.gridColumn,
                    gridRow: el.gridRow,
                  }}
                  onClick={() => handleElementClick(el)}
                  aria-label={`${el.name}, atomic number ${el.number}${isAvailable ? ', available' : ', coming soon'}`}
                >
                  <div className="tile-top-row">
                    <span className="atomic-number">{el.number}</span>
                    {isAvailable && <span className="explore-tag">EXPLORE</span>}
                  </div>
                  <strong className="element-symbol">{el.symbol}</strong>
                  <span className="element-name">{el.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <footer className="table-stage-footer">
          <div className="legend-items">
            <span className="legend-item">
              <b className="legend-dot hydrogen-dot" /> Hydrogen (Z = 1, Exact Analytic)
            </span>
            <span className="legend-item">
              <b className="legend-dot helium-dot" /> Helium (Z = 2, Many-Electron)
            </span>
            <span className="legend-item">
              <b className="legend-dot lithium-dot" /> Lithium (Z = 3, Closed Core + Valence)
            </span>
            <span className="legend-item">
              <b className="legend-dot beryllium-dot" /> Beryllium (Z = 4, Two Valence Electrons)
            </span>
            <span className="legend-item">
              <b className="legend-dot upcoming-dot" /> 114 Elements (Staged Library)
            </span>
          </div>
          <span className="table-nav-note">Calculations executed entirely client-side via exact SI physics & NIST ASD reference data.</span>
        </footer>
      </section>

      {/* Restrained Upcoming Element Modal Dialog */}
      {selectedNoticeElement && (
        <div className="notice-overlay" onClick={() => setSelectedNoticeElement(null)}>
          <div className="notice-dialog glass-floating" onClick={(e) => e.stopPropagation()}>
            <div className="notice-header">
              <span className="notice-eyebrow">UPCOMING INSTRUMENT</span>
              <button
                className="notice-close-btn"
                onClick={() => setSelectedNoticeElement(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="notice-body">
              <div className="notice-element-badge">
                <span className="badge-num">{selectedNoticeElement.number}</span>
                <strong className="badge-sym">{selectedNoticeElement.symbol}</strong>
                <span className="badge-name">{selectedNoticeElement.name}</span>
              </div>
              <div className="notice-details">
                <p className="notice-main-text">
                  <strong>{selectedNoticeElement.name}</strong> is currently staged for a future QUANTA
                  release.
                </p>
                <p className="notice-sub-text">
                  Multi-electron atoms beyond Beryllium require Hartree-Fock or density functional approximations.
                  Hydrogen, Helium, Lithium, and Beryllium are our active instruments.
                </p>
              </div>
            </div>
            <div className="notice-actions triple-notice-actions">
              <button
                className="secondary-notice-btn"
                onClick={() => {
                  setSelectedNoticeElement(null)
                  handleElementClick(elements[0]) // Select Hydrogen
                }}
              >
                OPEN HYDROGEN (H) →
              </button>
              <button
                className="secondary-notice-btn"
                onClick={() => {
                  setSelectedNoticeElement(null)
                  handleElementClick(elements[1]) // Select Helium
                }}
              >
                OPEN HELIUM (He) →
              </button>
              <button
                className="secondary-notice-btn"
                onClick={() => {
                  setSelectedNoticeElement(null)
                  handleElementClick(elements[2]) // Select Lithium
                }}
              >
                OPEN LITHIUM (Li) →
              </button>
              <button
                className="primary-notice-btn"
                onClick={() => {
                  setSelectedNoticeElement(null)
                  handleElementClick(elements[3]) // Select Beryllium
                }}
              >
                OPEN BERYLLIUM (Be) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Welcome Footer */}
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

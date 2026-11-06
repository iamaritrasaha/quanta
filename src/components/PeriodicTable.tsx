import { useCallback, useId, useMemo, useState } from 'react'
import {
  elements,
  elementKey,
  type Element,
  type ElementCategory,
} from '../data/elements'
import { getAtomicProperties } from '../data/atomicData'
import { filterElements } from '../data/search'
import type { ElementKey } from '../state/quantaStore'
import { ElementTile } from './observatory/ElementTile'
import { ElementInspector } from './observatory/ElementInspector'
import { ObservatoryToolbar } from './observatory/ObservatoryToolbar'
import { CategoryLegend } from './observatory/CategoryLegend'
import { MobileElementCatalog } from './observatory/MobileElementCatalog'
import './observatory/observatory.css'

interface PeriodicTableProps {
  onSelectElement: (elementKey: ElementKey) => void
}

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1)
const PERIODS = [1, 2, 3, 4, 5, 6, 7]

export function PeriodicTable({ onSelectElement }: PeriodicTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ElementCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'catalog'>('grid')

  // Default to Hydrogen (Z=1) as active preview element
  const [inspectedElement, setInspectedElement] = useState<Element>(elements[0])

  // Coordinate map for 2D arrow key grid navigation
  const elementByCoords = useMemo(() => {
    const map = new Map<string, Element>()
    for (const el of elements) {
      map.set(`${el.gridRow},${el.gridColumn}`, el)
    }
    return map
  }, [])

  // Filtered matching elements
  const matchingElements = useMemo(() => {
    return filterElements(searchQuery, activeCategory)
  }, [searchQuery, activeCategory])

  const matchingSymbolSet = useMemo(() => {
    return new Set(matchingElements.map((el) => el.symbol))
  }, [matchingElements])

  const isFilteringActive = searchQuery.trim().length > 0 || activeCategory !== 'all'

  // Fast selection without artificial delays
  const handleSelectElement = useCallback(
    (element: Element) => {
      onSelectElement(elementKey(element))
    },
    [onSelectElement]
  )

  const handleInspectElement = useCallback((element: Element) => {
    setInspectedElement(element)
  }, [])

  // 2D Arrow-key navigation handler
  const handleTileKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, current: Element) => {
      const { gridRow: r, gridColumn: c } = current
      let target: Element | undefined

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        // Find next column in current row
        for (let col = c + 1; col <= 18; col++) {
          const el = elementByCoords.get(`${r},${col}`)
          if (el) {
            target = el
            break
          }
        }
        // Wrap to next row if not found
        if (!target && r < 9) {
          for (let row = r + 1; row <= 9; row++) {
            for (let col = 1; col <= 18; col++) {
              const el = elementByCoords.get(`${row},${col}`)
              if (el) {
                target = el
                break
              }
            }
            if (target) break
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        // Find previous column in current row
        for (let col = c - 1; col >= 1; col--) {
          const el = elementByCoords.get(`${r},${col}`)
          if (el) {
            target = el
            break
          }
        }
        // Wrap to previous row if not found
        if (!target && r > 1) {
          for (let row = r - 1; row >= 1; row--) {
            for (let col = 18; col >= 1; col--) {
              const el = elementByCoords.get(`${row},${col}`)
              if (el) {
                target = el
                break
              }
            }
            if (target) break
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        // Find element in rows below at closest column
        for (let row = r + 1; row <= 9; row++) {
          const direct = elementByCoords.get(`${row},${c}`)
          if (direct) {
            target = direct
            break
          }
          // Search nearest column in that row
          let bestDist = Infinity
          let bestEl: Element | undefined
          for (let col = 1; col <= 18; col++) {
            const candidate = elementByCoords.get(`${row},${col}`)
            if (candidate) {
              const dist = Math.abs(col - c)
              if (dist < bestDist) {
                bestDist = dist
                bestEl = candidate
              }
            }
          }
          if (bestEl) {
            target = bestEl
            break
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        // Find element in rows above at closest column
        for (let row = r - 1; row >= 1; row--) {
          const direct = elementByCoords.get(`${row},${c}`)
          if (direct) {
            target = direct
            break
          }
          let bestDist = Infinity
          let bestEl: Element | undefined
          for (let col = 1; col <= 18; col++) {
            const candidate = elementByCoords.get(`${row},${col}`)
            if (candidate) {
              const dist = Math.abs(col - c)
              if (dist < bestDist) {
                bestDist = dist
                bestEl = candidate
              }
            }
          }
          if (bestEl) {
            target = bestEl
            break
          }
        }
      }

      if (target) {
        setInspectedElement(target)
        const btn = document.querySelector<HTMLButtonElement>(`button[data-element-symbol="${target.symbol}"]`)
        btn?.focus()
      }
    },
    [elementByCoords]
  )

  const inspectedProperties = useMemo(() => {
    return getAtomicProperties(inspectedElement.symbol)
  }, [inspectedElement])

  const liveAnnouncementId = useId()

  return (
    <main className="welcome-screen">
      <div className="optical-background" />

      {/* Screen reader live announcement region */}
      <div id={liveAnnouncementId} className="sr-only" aria-live="polite" aria-atomic="true">
        {isFilteringActive
          ? `${matchingElements.length} elements match your current search and filter criteria.`
          : 'Displaying all 118 elements of the periodic table.'}
      </div>

      {/* Masthead */}
      <header className="welcome-masthead">
        <div className="masthead-brand">
          <div className="brand-eyebrow">
            <span className="dot-indicator live" aria-hidden="true" />
            <span>QUANTA OBSERVATORY · ALL 118 ELEMENTS READY</span>
          </div>
          <h1 className="brand-title">QUANTA</h1>
          <p className="brand-tagline">Matter, visualized.</p>
        </div>
        <div className="masthead-info">
          <p className="masthead-intro">
            Explore atomic electronic structure, shell occupancies, NIST ASD reference energy levels,
            and derived spectroscopy across the entire periodic table.
          </p>
          <div className="masthead-stats">
            <span className="active-stat">118 ELEMENTS</span>
            <span>·</span>
            <span>IUPAC TAXONOMY</span>
            <span>·</span>
            <span>NIST ASD ATOMIC SPECTRA</span>
          </div>
        </div>
      </header>

      {/* Observatory Workspace */}
      <div className="observatory-stage">
        {/* Search, Filter & View Controls */}
        <ObservatoryToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          totalMatches={matchingElements.length}
          elements={matchingElements}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenMatch={handleSelectElement}
        />

        {/* Docked Inspector for medium/small screens */}
        <ElementInspector
          element={inspectedElement}
          properties={inspectedProperties}
          onSelectElement={onSelectElement}
          isEmbedded={false}
        />

        {viewMode === 'catalog' ? (
          <MobileElementCatalog
            elements={matchingElements}
            selectedElement={inspectedElement}
            onInspect={handleInspectElement}
            onSelectElement={onSelectElement}
            onResetSearch={() => {
              setSearchQuery('')
              setActiveCategory('all')
            }}
          />
        ) : (
          <section className="table-stage-box glass-surface" aria-label="Interactive Periodic Table of Elements">
            <div className="table-stage-header-info">
              <div className="table-stage-meta">
                <span className="table-layout-convention-tag">IUPAC 18-GROUP CONVENTIONAL LAYOUT</span>
                <span>Select or focus any element to inspect its quantum structure.</span>
              </div>
              <div className="mobile-scroll-hint">
                <span>← Swipe table horizontally to explore all 18 groups →</span>
              </div>
            </div>

            <div className="periodic-table-scroll-wrapper">
              {/* Groups 1–18 Column Headers */}
              <div className="groups-header-row" aria-hidden="true">
                <span className="group-number-col" />
                {GROUPS.map((g) => (
                  <span key={g} className="group-number-col">
                    {g}
                  </span>
                ))}
              </div>

              {/* Periodic Table Matrix with Left Periods Column */}
              <div className="periodic-table-matrix-wrapper">
                {/* Left Period Numbers 1–7 and Series Markers */}
                <div className="periods-column" aria-hidden="true">
                  {PERIODS.map((p) => (
                    <span key={p} className="period-number-cell">
                      {p}
                    </span>
                  ))}
                  <div className="fblock-spacer-period" />
                  <span className="period-number-cell" title="Period 6 Lanthanoid Series">
                    6*
                  </span>
                  <span className="period-number-cell" title="Period 7 Actinoid Series">
                    7*
                  </span>
                </div>

                {/* 18-Group Element Grid */}
                <div className="periodic-table-grid" role="grid" aria-label="Periodic Table Elements Grid">
                  {/* Embedded Inspector in Periods 1–3, Groups 3–12 */}
                  <ElementInspector
                    element={inspectedElement}
                    properties={inspectedProperties}
                    onSelectElement={onSelectElement}
                    isEmbedded={true}
                  />

                  {/* 118 Element Tiles */}
                  {elements.map((element) => {
                    const isInspected = inspectedElement.symbol === element.symbol
                    const isMatch = matchingSymbolSet.has(element.symbol)
                    const isDimmed = isFilteringActive && !isMatch
                    const properties = getAtomicProperties(element.symbol)

                    return (
                      <ElementTile
                        key={element.symbol}
                        element={element}
                        properties={properties}
                        isInspected={isInspected}
                        isMatch={isMatch}
                        isDimmed={isDimmed}
                        onInspect={handleInspectElement}
                        onSelect={handleSelectElement}
                        onKeyDown={handleTileKeyDown}
                      />
                    )
                  })}

                  {/* F-Block row separator */}
                  <div className="fblock-separator-row" aria-hidden="true" />

                  {/* F-Block Series Callout Indicators in Column 3 */}
                  <div className="fblock-marker fblock-marker-lanthanoid" aria-hidden="true">
                    <span className="fblock-marker-range">57–71</span>
                    <span className="fblock-marker-label">La–Lu</span>
                  </div>
                  <div className="fblock-marker fblock-marker-actinoid" aria-hidden="true">
                    <span className="fblock-marker-range">89–103</span>
                    <span className="fblock-marker-label">Ac–Lr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific Legend */}
            <CategoryLegend />
          </section>
        )}
      </div>

      {/* Global Masthead Footer */}
      <footer className="welcome-global-footer">
        <div className="welcome-footer-left">
          <span className="welcome-footer-brand">QUANTA: Matter, visualized.</span>
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

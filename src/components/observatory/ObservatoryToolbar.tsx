import { useRef, type ChangeEvent, type KeyboardEvent } from 'react'
import { ALL_CATEGORIES, CATEGORY_LABELS, type ElementCategory, type Element } from '../../data/elements'

interface ObservatoryToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeCategory: ElementCategory | 'all'
  onCategoryChange: (category: ElementCategory | 'all') => void
  totalMatches: number
  elements: Element[]
  viewMode: 'grid' | 'catalog'
  onViewModeChange: (mode: 'grid' | 'catalog') => void
  onOpenMatch?: (element: Element) => void
}

export function ObservatoryToolbar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  totalMatches,
  elements,
  viewMode,
  onViewModeChange,
  onOpenMatch,
}: ObservatoryToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onSearchChange('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClear()
    } else if (e.key === 'Enter') {
      if (totalMatches === 1 && onOpenMatch) {
        e.preventDefault()
        const match = elements[0]
        if (match) onOpenMatch(match)
      }
    }
  }

  return (
    <div className="observatory-toolbar" role="search" aria-label="Search and filter elements">
      <div className="toolbar-top-row">
        {/* Search input container */}
        <div className="search-input-box">
          <span className="search-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by element name, symbol (e.g. Au), or atomic number (e.g. 79)..."
            aria-label="Search periodic table elements"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search input"
              title="Clear search (Esc)"
            >
              ×
            </button>
          )}
          <span className="search-shortcut-hint" aria-hidden="true">
            {totalMatches === 1 ? '↵ to open' : 'Esc to clear'}
          </span>
        </div>

        {/* Matches counter & View Switcher */}
        <div className="toolbar-actions">
          <div className="match-counter-badge" aria-live="polite">
            {totalMatches === 118 ? (
              <span>118 ELEMENTS</span>
            ) : totalMatches === 1 ? (
              <span className="match-highlight">1 MATCH FOUND</span>
            ) : (
              <span>{totalMatches} MATCHES</span>
            )}
          </div>

          <div className="view-mode-toggle" role="group" aria-label="Layout view mode">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-pressed={viewMode === 'grid'}
              title="Switch to 18-Group Periodic Table Grid"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>GRID</span>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'catalog' ? 'active' : ''}`}
              onClick={() => onViewModeChange('catalog')}
              aria-pressed={viewMode === 'catalog'}
              title="Switch to Element Catalog List"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span>CATALOG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="category-filter-bar" role="group" aria-label="Filter by chemical family">
        <button
          type="button"
          className={`category-pill all-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
          aria-pressed={activeCategory === 'all'}
        >
          All Elements (118)
        </button>

        {ALL_CATEGORIES.map((cat) => {
          const catClass = cat.replace(/\s+/g, '-')
          const isActive = activeCategory === cat

          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${catClass} ${isActive ? 'active' : ''}`}
              onClick={() => onCategoryChange(isActive ? 'all' : cat)}
              aria-pressed={isActive}
            >
              <span className="category-dot" aria-hidden="true" />
              <span>{CATEGORY_LABELS[cat]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import { memo } from 'react'
import { elementKey, CATEGORY_LABELS, type Element } from '../../data/elements'
import { getAtomicProperties } from '../../data/atomicData'
import type { ElementKey } from '../../state/quantaStore'

interface MobileElementCatalogProps {
  elements: Element[]
  selectedElement: Element
  onInspect: (element: Element) => void
  onSelectElement: (key: ElementKey) => void
  onResetSearch: () => void
}

export const MobileElementCatalog = memo(function MobileElementCatalog({
  elements,
  selectedElement,
  onInspect,
  onSelectElement,
  onResetSearch,
}: MobileElementCatalogProps) {
  if (elements.length === 0) {
    return (
      <div className="catalog-empty-state glass-surface">
        <div className="empty-icon">⚲</div>
        <h3 className="empty-title">No elements matched your search</h3>
        <p className="empty-desc">
          Try searching for a different element name, chemical symbol (e.g. Au), atomic number (1–118), or clearing your category filter.
        </p>
        <button type="button" className="empty-reset-btn" onClick={onResetSearch}>
          RESET SEARCH & FILTERS
        </button>
      </div>
    )
  }

  return (
    <div className="mobile-element-catalog" role="feed" aria-label="Chemical elements catalog">
      {elements.map((el) => {
        const props = getAtomicProperties(el.symbol)
        const isSelected = selectedElement.symbol === el.symbol
        const isDedicated = el.number <= 5
        const catClass = el.category.replace(/\s+/g, '-')

        return (
          <article
            key={el.symbol}
            className={`catalog-card glass-surface ${catClass} ${isSelected ? 'selected' : ''}`}
            onClick={() => onInspect(el)}
          >
            <div className="catalog-card-header">
              <span className="catalog-atomic-number">#{el.number}</span>
              <span className={`catalog-category-tag ${catClass}`}>
                {CATEGORY_LABELS[el.category]}
              </span>
            </div>

            <div className="catalog-card-body">
              <strong className="catalog-symbol">{el.symbol}</strong>
              <div className="catalog-identity">
                <h4 className="catalog-name">{el.name}</h4>
                <span className="catalog-mass">
                  {props?.atomicMassU ? `${props.atomicMassU} u` : 'Mass pending'}
                </span>
              </div>
            </div>

            <div className="catalog-card-footer">
              <span className="catalog-period-group">
                {el.category === 'lanthanide' || el.category === 'actinide'
                  ? `Period ${el.period} f-block`
                  : `P${el.period} · G${el.group}`}
              </span>
              <button
                type="button"
                className="catalog-explore-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement(elementKey(el))
                }}
                aria-label={`Open instrument for ${el.name}`}
              >
                {isDedicated ? 'EXPLORE' : 'OPEN'} →
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
})

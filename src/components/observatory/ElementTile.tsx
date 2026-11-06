import { memo } from 'react'
import type { Element } from '../../data/elements'
import type { AtomicProperties } from '../../data/atomicData'

interface ElementTileProps {
  element: Element
  properties?: AtomicProperties
  isInspected: boolean
  isMatch: boolean
  isDimmed: boolean
  onInspect: (element: Element) => void
  onSelect: (element: Element) => void
  tabIndex?: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>, element: Element) => void
}

const categoryClass = (category: Element['category']) => category.replace(/\s+/g, '-')

export const ElementTile = memo(function ElementTile({
  element,
  properties,
  isInspected,
  isMatch,
  isDimmed,
  onInspect,
  onSelect,
  tabIndex,
  onKeyDown,
}: ElementTileProps) {
  const isDedicated = element.number <= 5
  const tileDedicatedClass = isDedicated ? `${element.name.toLowerCase()}-tile` : 'multi-element-tile'
  const catClass = categoryClass(element.category)

  const massFormatted = properties?.atomicMassU
    ? `${Number.parseFloat(properties.atomicMassU).toFixed(properties.atomicMassU.includes('.') ? 2 : 0)} u`
    : ''

  return (
    <button
      type="button"
      className={`element-tile ${catClass} ${tileDedicatedClass} ${isInspected ? 'is-inspected' : ''} ${
        isMatch ? 'is-match' : ''
      } ${isDimmed ? 'is-dimmed' : ''}`}
      style={{ gridColumn: element.gridColumn, gridRow: element.gridRow }}
      onClick={() => onSelect(element)}
      onMouseEnter={() => onInspect(element)}
      onPointerEnter={() => onInspect(element)}
      onFocus={() => onInspect(element)}
      onKeyDown={(e) => onKeyDown?.(e, element)}
      tabIndex={tabIndex ?? 0}
      data-element-symbol={element.symbol}
      data-element-number={element.number}
      aria-label={`${element.name}, atomic number ${element.number}, open instrument`}
    >
      <div className="tile-top-row">
        <span className="atomic-number">{element.number}</span>
        <span className="category-accent-dot" aria-hidden="true" />
      </div>

      <strong className="element-symbol">{element.symbol}</strong>

      <div className="tile-bottom-info">
        <span className="element-name" title={element.name}>
          {element.name}
        </span>
        {massFormatted && <span className="element-mass">{massFormatted}</span>}
      </div>
    </button>
  )
})

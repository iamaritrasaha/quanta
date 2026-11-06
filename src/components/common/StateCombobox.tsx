import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useId,
} from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react'

export interface ComboboxOption {
  value: string
  label: string
  subLabel?: string
  badge?: string
  badgeVariant?: 'ground' | 'nist' | 'schematic' | 'default'
  disabled?: boolean
  keywords?: string[]
}

export interface StateComboboxProps {
  id: string
  name?: string
  value: string
  onChange: (value: string) => void
  options: ComboboxOption[]
  disabled?: boolean
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  className?: string
  ariaLabel?: string
  labelId?: string
  triggerId?: string
  compact?: boolean
}

export function StateCombobox({
  id,
  name,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Select state…',
  searchable,
  searchPlaceholder = 'Filter states (config, term, J)…',
  className = '',
  ariaLabel,
  labelId,
  triggerId,
  compact = false,
}: StateComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const listRef = useRef<(HTMLDivElement | null)[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()
  const actualTriggerId = triggerId ?? `${id}-trigger`

  // Auto-enable search for lists with 8 or more options
  const isSearchable = searchable ?? options.length >= 8

  // Selected option details
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  )

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options

    const q = searchQuery.toLowerCase().trim()
    const tokens = q.split(/\s+/).filter(Boolean)

    return options.filter((opt) => {
      const targetText = [
        opt.label,
        opt.subLabel ?? '',
        opt.badge ?? '',
        opt.value,
        ...(opt.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase()

      // Match all tokens
      return tokens.every((token) => targetText.includes(token))
    })
  }, [options, searchQuery])

  // Floating UI configuration with collision-aware positioning & dynamic viewport clamping
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (disabled) return
      setIsOpen(open)
      if (!open) {
        setSearchQuery('')
        setActiveIndex(null)
      } else {
        // Highlight currently selected option if available
        const selectedIdx = filteredOptions.findIndex((opt) => opt.value === value)
        setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0)
      }
    },
    placement: 'bottom-start',
    middleware: [
      offset(6),
      flip({
        padding: 8,
        fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
      }),
      size({
        padding: 8,
        apply({ availableHeight, elements }) {
          // Dynamic height constraint: max 320px, clamped to available viewport space
          const maxHeight = Math.min(320, Math.max(100, availableHeight - 8))
          elements.floating.style.maxHeight = `${maxHeight}px`
        },
      }),
      shift({ padding: 8, crossAxis: true }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context, { enabled: !disabled })
  const dismiss = useDismiss(context)

  // We manage the combobox / listbox / option roles explicitly according to W3C ARIA APG
  // rather than using useRole({ role: 'listbox' }) which would inappropriately place role="listbox"
  // on the outer floating wrapper (which houses the search box).
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  // Keep listRef array in sync with filtered options count
  useEffect(() => {
    listRef.current = listRef.current.slice(0, filteredOptions.length)
  }, [filteredOptions])

  // Auto-focus search input when combobox opens
  useEffect(() => {
    if (isOpen && isSearchable) {
      const t = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 30)
      return () => clearTimeout(t)
    }
  }, [isOpen, isSearchable])

  // Select an option
  const handleSelect = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return
      onChange(option.value)
      setIsOpen(false)
      setSearchQuery('')
      setActiveIndex(null)
    },
    [onChange]
  )

  // Find next enabled option index in a direction
  const findNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1): number => {
      const count = filteredOptions.length
      if (count === 0) return 0
      let cur = startIndex
      for (let i = 0; i < count; i++) {
        cur = (cur + direction + count) % count
        if (!filteredOptions[cur]?.disabled) {
          return cur
        }
      }
      return startIndex
    },
    [filteredOptions]
  )

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        e.stopPropagation()
        setActiveIndex((prev) => {
          if (prev === null) {
            const firstEnabled = filteredOptions.findIndex((opt) => !opt.disabled)
            return firstEnabled >= 0 ? firstEnabled : 0
          }
          return findNextEnabledIndex(prev, 1)
        })
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        e.stopPropagation()
        setActiveIndex((prev) => {
          if (prev === null) {
            const lastEnabled = [...filteredOptions].reverse().findIndex((opt) => !opt.disabled)
            return lastEnabled >= 0 ? filteredOptions.length - 1 - lastEnabled : filteredOptions.length - 1
          }
          return findNextEnabledIndex(prev, -1)
        })
        break
      }
      case 'Home': {
        e.preventDefault()
        e.stopPropagation()
        const firstEnabled = filteredOptions.findIndex((opt) => !opt.disabled)
        setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0)
        break
      }
      case 'End': {
        e.preventDefault()
        e.stopPropagation()
        const lastEnabled = [...filteredOptions].reverse().findIndex((opt) => !opt.disabled)
        setActiveIndex(lastEnabled >= 0 ? filteredOptions.length - 1 - lastEnabled : filteredOptions.length - 1)
        break
      }
      case 'PageDown': {
        e.preventDefault()
        e.stopPropagation()
        setActiveIndex((prev) => {
          const base = prev ?? 0
          const target = Math.min(filteredOptions.length - 1, base + 5)
          return target
        })
        break
      }
      case 'PageUp': {
        e.preventDefault()
        e.stopPropagation()
        setActiveIndex((prev) => {
          const base = prev ?? 0
          const target = Math.max(0, base - 5)
          return target
        })
        break
      }
      case 'Enter': {
        e.preventDefault()
        e.stopPropagation()
        if (activeIndex !== null && filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex])
        } else if (filteredOptions.length > 0) {
          const firstValid = filteredOptions.find((opt) => !opt.disabled)
          if (firstValid) handleSelect(firstValid)
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(false)
        break
      }
      case 'Tab': {
        setIsOpen(false)
        break
      }
      default: {
        // Typeahead for non-searchable dropdowns
        if (!isSearchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase()
          const matchIdx = filteredOptions.findIndex(
            (opt, i) =>
              (activeIndex === null || i > activeIndex) &&
              !opt.disabled &&
              opt.label.trim().toLowerCase().startsWith(char)
          )
          if (matchIdx >= 0) {
            e.preventDefault()
            setActiveIndex(matchIdx)
          } else {
            // Wrap to start
            const wrapIdx = filteredOptions.findIndex(
              (opt) => !opt.disabled && opt.label.trim().toLowerCase().startsWith(char)
            )
            if (wrapIdx >= 0) {
              e.preventDefault()
              setActiveIndex(wrapIdx)
            }
          }
        }
      }
    }
  }

  // Scroll active option into view when activeIndex changes
  useEffect(() => {
    if (activeIndex !== null && listRef.current[activeIndex]) {
      listRef.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [activeIndex])

  const activeOptionId =
    activeIndex !== null && filteredOptions[activeIndex]
      ? `${listboxId}-opt-${activeIndex}`
      : undefined

  return (
    <div className={`quanta-combobox-wrap ${className}`} onKeyDown={handleKeyDown}>
      {/* Backing select for standard HTML form APIs, accessibility, and automation */}
      <select
        id={id}
        name={name ?? id}
        value={value}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="combobox-native-select"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          const trigger = document.getElementById(actualTriggerId)
          trigger?.focus()
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Trigger Button (Combobox) */}
      <button
        ref={refs.setReference}
        id={actualTriggerId}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen && !isSearchable ? activeOptionId : undefined}
        aria-label={!labelId ? (ariaLabel ?? placeholder) : undefined}
        aria-labelledby={labelId ? `${labelId} ${id}-trigger-text` : undefined}
        className={`quanta-combobox-trigger ${isOpen ? 'active-open' : ''} ${
          compact ? 'compact' : ''
        }`}
        {...getReferenceProps()}
      >
        <span id={`${id}-trigger-text`} className="combobox-trigger-text">
          {selectedOption ? (
            <span className="combobox-trigger-content">
              <span className="combobox-trigger-primary">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span
                  className={`combobox-badge badge-${
                    selectedOption.badgeVariant ?? 'default'
                  }`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </span>
          ) : (
            <span className="combobox-placeholder">{placeholder}</span>
          )}
        </span>
        <svg
          className={`combobox-chevron ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Floating Popover via Portal */}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={isSearchable ? searchInputRef : refs.floating}
            returnFocus={true}
          >
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="quanta-combobox-popover glass-combobox"
              aria-label={ariaLabel ?? placeholder}
              {...getFloatingProps()}
            >
              {/* Optional Search / Filter Header */}
              {isSearchable && (
                <div className="combobox-search-header">
                  <div className="combobox-search-box">
                    <svg
                      className="search-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="5"
                        cy="5"
                        r="3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M7.5 7.5L10.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded="true"
                      aria-controls={listboxId}
                      aria-activedescendant={activeOptionId}
                      aria-label="Filter states"
                      className="combobox-search-input"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setActiveIndex(0)
                      }}
                      onKeyDown={(e) => {
                        // Let arrow navigation and enter pass through to handleKeyDown
                        if (
                          e.key === 'ArrowDown' ||
                          e.key === 'ArrowUp' ||
                          e.key === 'Enter' ||
                          e.key === 'Escape' ||
                          e.key === 'Home' ||
                          e.key === 'End' ||
                          e.key === 'PageDown' ||
                          e.key === 'PageUp'
                        ) {
                          e.stopPropagation()
                          handleKeyDown(e)
                        }
                      }}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => {
                          setSearchQuery('')
                          setActiveIndex(0)
                          searchInputRef.current?.focus()
                        }}
                        aria-label="Clear search query"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="combobox-count-indicator">
                    {filteredOptions.length} of {options.length} states
                  </div>
                  {/* Screen reader live announcement */}
                  <div className="quanta-sr-only" aria-live="polite" aria-atomic="true">
                    {filteredOptions.length} {filteredOptions.length === 1 ? 'state' : 'states'} available
                  </div>
                </div>
              )}

              {/* Single Authentic Options Listbox */}
              <div
                id={listboxId}
                role="listbox"
                tabIndex={-1}
                aria-label={ariaLabel ?? placeholder}
                className="combobox-options-list"
              >
                {filteredOptions.length === 0 ? (
                  <div className="combobox-empty-message" role="status">
                    <span className="empty-text">No matching atomic states</span>
                    <span className="empty-subtext">
                      Try searching by subshell (e.g. 3s, 3p, 4s), term (²P, ²D), or J value
                    </span>
                  </div>
                ) : (
                  filteredOptions.map((opt, idx) => {
                    const isSelected = opt.value === value
                    const isActive = activeIndex === idx

                    return (
                      <div
                        key={opt.value}
                        ref={(node) => {
                          listRef.current[idx] = node
                        }}
                        id={`${listboxId}-opt-${idx}`}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={opt.disabled}
                        className={`combobox-option-row ${
                          isSelected ? 'selected' : ''
                        } ${isActive ? 'active' : ''} ${
                          opt.disabled ? 'disabled' : ''
                        }`}
                        onClick={() => handleSelect(opt)}
                        onMouseEnter={() => {
                          if (!opt.disabled) setActiveIndex(idx)
                        }}
                      >
                        <div className="option-main-col">
                          <div className="option-primary-line">
                            <span className="option-label-text">{opt.label}</span>
                            {opt.badge && (
                              <span
                                className={`combobox-badge badge-${
                                  opt.badgeVariant ?? 'default'
                                }`}
                              >
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          {opt.subLabel && (
                            <div className="option-sub-line">{opt.subLabel}</div>
                          )}
                        </div>

                        {isSelected && (
                          <svg
                            className="option-check-icon"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 7.5L5.5 10L11 4.5"
                              stroke="#38bdf8"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )
}

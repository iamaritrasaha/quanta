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
  useRole,
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
  compact = false,
}: StateComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const listRef = useRef<(HTMLDivElement | null)[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  // Auto-enable search for lists with 8 or more options
  const isSearchable = searchable ?? options.length >= 8

  // Floating UI configuration with collision-aware positioning & dynamic viewport clamping
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (disabled) return
      setIsOpen(open)
      if (!open) {
        setSearchQuery('')
        setActiveIndex(null)
      }
    },
    placement: 'bottom-start',
    middleware: [
      offset(6),
      flip({
        padding: 12,
        fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
      }),
      shift({ padding: 12 }),
      size({
        padding: 12,
        apply({ availableHeight, elements }) {
          // Dynamic height constraint: max 320px, clamped to available viewport space
          const maxHeight = Math.max(160, Math.min(320, availableHeight - 16))
          elements.floating.style.maxHeight = `${maxHeight}px`
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context, { enabled: !disabled })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

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

  // Keep listRef array in sync with filtered options count
  useEffect(() => {
    listRef.current = listRef.current.slice(0, filteredOptions.length)
  }, [filteredOptions])

  // Auto-focus search input when combobox opens
  useEffect(() => {
    if (isOpen && isSearchable) {
      // Small timeout to ensure DOM focus manager is ready
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    e.stopPropagation()

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        setActiveIndex((prev) => {
          if (prev === null) return 0
          const next = prev + 1
          return next < filteredOptions.length ? next : 0
        })
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        setActiveIndex((prev) => {
          if (prev === null) return filteredOptions.length - 1
          const next = prev - 1
          return next >= 0 ? next : filteredOptions.length - 1
        })
        break
      }
      case 'Home': {
        e.preventDefault()
        setActiveIndex(0)
        break
      }
      case 'End': {
        e.preventDefault()
        setActiveIndex(filteredOptions.length - 1)
        break
      }
      case 'Enter': {
        e.preventDefault()
        e.stopPropagation()
        if (activeIndex !== null && filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex])
        } else if (filteredOptions.length > 0) {
          // Select first matching option if enter is pressed in search input
          handleSelect(filteredOptions[0])
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
        // Close on tab away
        setIsOpen(false)
        break
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
          const trigger = document.getElementById(`${id}-trigger`)
          trigger?.focus()
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Trigger Button */}
      <button
        ref={refs.setReference}
        id={`${id}-trigger`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel ?? placeholder}
        className={`quanta-combobox-trigger ${isOpen ? 'active-open' : ''} ${
          compact ? 'compact' : ''
        }`}
        {...getReferenceProps()}
      >
        <span className="combobox-trigger-text">
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
                      className="combobox-search-input"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setActiveIndex(0)
                      }}
                      onKeyDown={(e) => {
                        // Let arrow up/down pass through to handleKeyDown
                        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === 'Escape') {
                          e.stopPropagation()
                          handleKeyDown(e)
                        }
                      }}
                      aria-label="Filter options"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => {
                          setSearchQuery('')
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
                </div>
              )}

              {/* Options List */}
              <div
                id={listboxId}
                role="listbox"
                aria-label={ariaLabel ?? 'Options'}
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
                        onMouseEnter={() => setActiveIndex(idx)}
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

import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function getInitial(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY).matches
    : false
}

/**
 * Tracks the OS/browser `prefers-reduced-motion` preference and stays in sync
 * with live changes. CSS media queries alone do not affect motion driven
 * imperatively inside R3F `useFrame` loops — consult this hook once per
 * component (not per frame) and gate continuous decorative motion with it.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitial)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(QUERY)
    const handleChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return reduced
}

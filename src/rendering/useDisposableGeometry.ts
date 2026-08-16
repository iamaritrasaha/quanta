import { useEffect } from 'react'
import type { BufferGeometry } from 'three'

/**
 * Manually created BufferGeometry attached via `<primitive attach="geometry">`
 * is not auto-disposed by React Three Fiber on unmount or replacement, since
 * primitives may be shared/reused. Dispose it ourselves when it changes or
 * the owning component unmounts.
 */
export function useDisposableGeometry(geometry: BufferGeometry | null | undefined): void {
  useEffect(() => {
    return () => {
      geometry?.dispose()
    }
  }, [geometry])
}

import { describe, expect, it } from 'vitest'
import { advanceTransitionProgress } from './transitionTiming'

describe('Transition simulation clock', () => {
  it('advances according to elapsed time at normal and low frame rates', () => {
    for (const frames of [2, 10, 60, 120]) {
      let progress = 0
      for (let i = 0; i < frames; i++) {
        progress = advanceTransitionProgress({ progress, durationMs: 2000 }, 1 / frames, 1, true)
      }
      expect(progress).toBeCloseTo(0.5, 10)
    }
  })

  it('preserves progress throughout a pause and resumes without counting paused time', () => {
    const paused = advanceTransitionProgress({ progress: 0.25, durationMs: 2000 }, 12, 1, false)
    expect(paused).toBe(0.25)
    expect(advanceTransitionProgress({ progress: paused, durationMs: 2000 }, 0.5, 1, true)).toBe(0.5)
  })

  it('applies speed changes without moving the current state backwards', () => {
    let progress = advanceTransitionProgress({ progress: 0, durationMs: 2000 }, 0.5, 0.5, true)
    expect(progress).toBe(0.125)
    progress = advanceTransitionProgress({ progress, durationMs: 2000 }, 0.5, 2, true)
    expect(progress).toBe(0.625)
  })

  it('settles at the target after a long frame', () => {
    expect(advanceTransitionProgress({ progress: 0.8, durationMs: 2000 }, 1.2, 1, true)).toBe(1)
  })

  it('ignores invalid deltas, speeds and durations', () => {
    for (const delta of [NaN, Infinity, -1, 0]) {
      expect(advanceTransitionProgress({ progress: 0.3, durationMs: 2000 }, delta, 1, true)).toBe(0.3)
    }
    for (const speed of [NaN, Infinity, -1, 0]) {
      expect(advanceTransitionProgress({ progress: 0.3, durationMs: 2000 }, 1, speed, true)).toBe(0.3)
    }
    for (const durationMs of [NaN, Infinity, -1, 0]) {
      expect(advanceTransitionProgress({ progress: 0.3, durationMs }, 1, 1, true)).toBe(0.3)
    }
  })
})

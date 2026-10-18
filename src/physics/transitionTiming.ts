interface TransitionClock {
  progress: number
  /** Duration at 1× speed. */
  durationMs: number
}

/** Advance simulation time, so pauses and speed changes apply during a jump. */
export function advanceTransitionProgress(
  transition: TransitionClock,
  deltaSeconds: number,
  speed: number,
  playing: boolean
): number {
  const progress = Math.max(0, Math.min(1, transition.progress))
  if (!playing || !Number.isFinite(deltaSeconds) || deltaSeconds <= 0 ||
      !Number.isFinite(speed) || speed <= 0 ||
      !Number.isFinite(transition.durationMs) || transition.durationMs <= 0) return progress
  return Math.min(1, progress + deltaSeconds * 1000 * speed / transition.durationMs)
}

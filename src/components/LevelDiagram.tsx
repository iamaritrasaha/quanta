import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { hydrogenEnergy, safeHydrogenTransition } from '../physics/hydrogen'

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function LevelDiagram() {
  const currentLevel = useQuantaStore((s) => s.level)
  const initialLevel = useQuantaStore((s) => s.initialLevel)
  const targetLevel = useQuantaStore((s) => s.targetLevel)
  const setLevel = useQuantaStore((s) => s.setLevel)
  const setInitialLevel = useQuantaStore((s) => s.setInitialLevel)
  const setTargetLevel = useQuantaStore((s) => s.setTargetLevel)
  const activeTransition = useQuantaStore((s) => s.activeTransition)

  const transition = useMemo(() => {
    return activeTransition?.physics ?? safeHydrogenTransition(initialLevel, targetLevel)
  }, [activeTransition, initialLevel, targetLevel])

  const levels = [6, 5, 4, 3, 2, 1]

  // Physically proportioned vertical positions (mapped from -13.6 eV at bottom to 0 eV at top)
  const getLevelBottomPercent = (n: number) => {
    const energy = hydrogenEnergy(n)
    return 6 + ((energy - -13.598) / 13.598) * 86
  }

  const handleSelectLevel = (n: number) => {
    if (activeTransition) return
    setLevel(n)
    if (n !== initialLevel) {
      setInitialLevel(currentLevel)
      setTargetLevel(n)
    }
  }

  const fromPercent = transition ? getLevelBottomPercent(transition.initialN) : 0
  const toPercent = transition ? getLevelBottomPercent(transition.finalN) : 0
  const isUpward = transition ? transition.finalN > transition.initialN : false

  // Compute synchronized progress for transition vector animation
  let visualProgress = 1.0
  if (activeTransition) {
    if (activeTransition.type === 'absorption') {
      if (activeTransition.progress < 0.54) {
        visualProgress = 0
      } else if (activeTransition.progress < 0.94) {
        visualProgress = easeInOutCubic((activeTransition.progress - 0.54) / 0.4)
      } else {
        visualProgress = 1.0
      }
    } else {
      if (activeTransition.progress < 0.46) {
        visualProgress = easeInOutCubic(activeTransition.progress / 0.46)
      } else {
        visualProgress = 1.0
      }
    }
  }

  const dynamicToPercent = THREE_lerp(fromPercent, toPercent, visualProgress)
  const transitionBottom = Math.min(fromPercent, dynamicToPercent)
  const transitionHeight = Math.max(2, Math.abs(dynamicToPercent - fromPercent))

  function THREE_lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  return (
    <div className="levels-diagram glass-instrument" aria-label="Hydrogen Energy Levels">
      <div className="levels-header">
        <span className="levels-title">ENERGY LEVELS</span>
        <span className="levels-unit">Eₙ = -13.6/n² eV</span>
      </div>

      <div className="levels-ladder">
        {/* Ionization boundary (0 eV) */}
        <div className="ionization-line">
          <span className="ionization-label">0.000 eV (Ionization Limit)</span>
          <div className="ladder-rule dashed" />
        </div>

        {/* Dynamic Transition Vector Indicator */}
        {transition && (
          <div
            className={`transition-vector ${isUpward ? 'upward' : 'downward'}`}
            style={{
              bottom: `${transitionBottom}%`,
              height: `${transitionHeight}%`,
              borderColor: transition.displayColor,
              opacity: activeTransition && visualProgress === 0 ? 0.35 : 1.0,
            }}
          >
            <div
              className="vector-arrowhead"
              style={{
                [isUpward ? 'top' : 'bottom']: '-4px',
                borderColor: transition.displayColor,
              }}
            />
            {visualProgress > 0.3 && (
              <div
                className="vector-badge"
                style={{ backgroundColor: '#090a0f', borderColor: transition.displayColor }}
              >
                <span>{Math.abs(transition.deltaEnergyEv).toFixed(2)} eV</span>
              </div>
            )}
          </div>
        )}

        {/* Energy Rungs */}
        {levels.map((n) => {
          const energy = hydrogenEnergy(n)
          const isCurrent = n === currentLevel
          const isInitial = transition?.initialN === n
          const isTarget = transition?.finalN === n
          const bottomPos = getLevelBottomPercent(n)

          return (
            <div
              key={n}
              className={`ladder-rung ${isCurrent ? 'active-rung' : ''} ${isInitial ? 'initial-rung' : ''} ${
                isTarget ? 'target-rung' : ''
              }`}
              style={{ bottom: `${bottomPos}%` }}
              onClick={() => handleSelectLevel(n)}
            >
              <span className="rung-n">n = {n}</span>
              <div className="ladder-rule" />
              <span className="rung-ev">{energy.toFixed(3)} eV</span>
            </div>
          )
        })}
      </div>

      <div className="levels-footer">
        <span>Click any level to set state</span>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import { hydrogenEnergy, safeHydrogenTransition } from '../physics/hydrogen'
import { ScientificInstrumentHeader } from './science/ScientificInstrumentHeader'
import { IonizationLimitRow } from './science/IonizationLimitRow'
import { TransitionStatusCard } from './science/TransitionStatusCard'
import { AxisBreakBar } from './science/AxisBreakBar'
import { EnergyLevelRow } from './science/EnergyLevelRow'
import { InstrumentFooter } from './science/InstrumentFooter'

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

  const upperLevels = [6, 5, 4, 3, 2]
  const groundN = 1

  const handleSelectLevel = (n: number) => {
    if (activeTransition) return
    setLevel(n)
    if (n !== initialLevel) {
      setInitialLevel(currentLevel)
      setTargetLevel(n)
    }
  }

  const isTransitionLower = (n: number) => {
    if (!transition) return false
    const lowerN = Math.min(transition.initialN, transition.finalN)
    return n === lowerN
  }

  const isTransitionUpper = (n: number) => {
    if (!transition) return false
    const upperN = Math.max(transition.initialN, transition.finalN)
    return n === upperN
  }

  return (
    <div
      className="levels-diagram hydrogen-levels-instrument glass-instrument"
      aria-label="Hydrogen Energy Levels Diagram"
    >
      {/* 1. Header Row */}
      <ScientificInstrumentHeader
        title="ENERGY LEVELS"
        badgeText="CALCULATED"
        unitLabel="H I · Energy (eV)"
      />

      {/* 2. Ionization Limit Row (0.000 eV) */}
      <IonizationLimitRow
        reactionText="H I → H II + e⁻"
        energyEv={0.0}
        subNote="13.598 eV above ground"
        title="Hydrogen Ionization Limit (0.000 eV Binding Energy)"
      />

      {/* 3. Transition Status Card (when active or selected) */}
      {transition && (
        <TransitionStatusCard
          direction={transition.direction}
          wavelengthNm={transition.wavelengthNm}
          wavelengthMedium="vacuum"
          photonEnergyEv={transition.photonEnergyEv}
          bandOrRegion={transition.band}
          lineName={transition.lineName}
          seriesOrDetail={transition.series}
          displayColor={transition.displayColor}
        />
      )}

      {/* 4. Upper Rydberg Manifold Container (Single Wide Column) */}
      <div className="hydrogen-manifold-container">
        <header className="hydrogen-manifold-header">
          <span className="system-title">BOUND RYDBERG MANIFOLD</span>
          <span className="system-spin-badge">n = 2 … 6</span>
        </header>

        <div className="level-rows-stack">
          {upperLevels.map((n) => {
            const energy = hydrogenEnergy(n)
            const isActive = n === currentLevel
            const isLower = isTransitionLower(n)
            const isUpper = isTransitionUpper(n)

            return (
              <EnergyLevelRow
                key={n}
                stateLabel={`n = ${n}`}
                termOrDetail={n === 2 ? 'Balmer lower' : undefined}
                energyEv={energy}
                isActive={isActive}
                isTransitionLower={isLower}
                isTransitionUpper={isUpper}
                transitionColor={transition?.displayColor}
                accessibleLabel={`Hydrogen level n equals ${n}, binding energy ${energy.toFixed(3)} electron volts`}
                onClick={() => handleSelectLevel(n)}
              />
            )
          })}
        </div>
      </div>

      {/* 5. Disclosed Axis Break */}
      <AxisBreakBar
        subtitle="Upper Rydberg states expanded near ionization limit"
        subNote="ΔE gap = 10.198 eV"
      />

      {/* 6. Dedicated Ground State Row (n = 1) */}
      <EnergyLevelRow
        stateLabel={`n = ${groundN}`}
        termOrDetail="Lyman ground"
        badge="GROUND"
        energyEv={hydrogenEnergy(groundN)}
        isActive={groundN === currentLevel}
        isTransitionLower={isTransitionLower(groundN)}
        isTransitionUpper={isTransitionUpper(groundN)}
        transitionColor={transition?.displayColor}
        accessibleLabel={`Hydrogen level n equals 1, ground state binding energy ${hydrogenEnergy(groundN).toFixed(3)} electron volts`}
        onClick={() => handleSelectLevel(groundN)}
        className="ground-level-row"
      />

      {/* 7. Footer Microcopy */}
      <InstrumentFooter text="Click any level to set state · Transition card reflects physical interaction · Exact Bohr/Rydberg model" />
    </div>
  )
}

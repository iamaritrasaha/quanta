import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  BERYLLIUM_TRANSITIONS,
  findBerylliumTransition,
  getBerylliumLevel,
  getBerylliumTransition,
  type BerylliumTransition,
} from '../physics/beryllium'
import { BERYLLIUM_IONIZATION_ENERGY_EV, BERYLLIUM_IONIZATION_LIMIT_CM1 } from '../physics/constants'
import { ScientificInstrumentHeader } from './science/ScientificInstrumentHeader'
import { IonizationLimitRow } from './science/IonizationLimitRow'
import { TransitionStatusCard } from './science/TransitionStatusCard'
import { AxisBreakBar } from './science/AxisBreakBar'
import { EnergyLevelRow } from './science/EnergyLevelRow'
import { InstrumentFooter } from './science/InstrumentFooter'

interface DiagramLevelDef {
  id: string
  matchIds: string[]
  config: string
  term: string
  meta?: string
  energyEv: number
  accessibleName: string
}

function levelDef(representativeId: string, matchIds: string[], meta?: string): DiagramLevelDef {
  const lvl = getBerylliumLevel(representativeId)!
  return {
    id: representativeId,
    matchIds,
    config: lvl.configuration,
    term: lvl.termSymbol,
    meta,
    energyEv: lvl.energyEv,
    accessibleName: `${lvl.configuration}, ${lvl.multiplicity} ${lvl.term}, excitation energy ${lvl.energyEv.toFixed(3)} electron volts`,
  }
}

const SINGLET_EXCITED_LEVELS: DiagramLevelDef[] = [
  levelDef('2s3d_1D2', ['2s3d_1D2']),
  levelDef('2s3p_1P1', ['2s3p_1P1']),
  levelDef('2p2_1D2', ['2p2_1D2']),
  levelDef('2s3s_1S0', ['2s3s_1S0']),
  levelDef('2s2p_1P1', ['2s2p_1P1']),
]

const TRIPLET_EXCITED_LEVELS: DiagramLevelDef[] = [
  levelDef('2s3d_3D', ['2s3d_3D'], 'J = 1,2,3'),
  levelDef('2p2_3P', ['2p2_3P0', '2p2_3P1', '2p2_3P2', '2p2_3P'], 'J = 0,1,2'),
  levelDef('2s3p_3P', ['2s3p_3P01', '2s3p_3P2', '2s3p_3P'], 'J = 0,1,2'),
  levelDef('2s3s_3S1', ['2s3s_3S1']),
  levelDef('2s2p_3P', ['2s2p_3P0', '2s2p_3P1', '2s2p_3P2', '2s2p_3P'], 'J = 0,1,2 · Metastable'),
]

const GROUND_LEVEL = levelDef('2s2_1S0', ['2s2_1S0'], 'Ground Reference')

export function BerylliumLevelDiagram() {
  const selectedLevelId = useQuantaStore((s) => s.beryllium.selectedLevelId)
  const initialLevelId = useQuantaStore((s) => s.beryllium.initialLevelId)
  const targetLevelId = useQuantaStore((s) => s.beryllium.targetLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.beryllium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.beryllium.activeTransition)
  const setBerylliumLevel = useQuantaStore((s) => s.setBerylliumLevel)
  const setBerylliumTransition = useQuantaStore((s) => s.setBerylliumTransition)

  const transition: BerylliumTransition | undefined = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getBerylliumTransition(selectedTransitionId)
    return findBerylliumTransition(initialLevelId, targetLevelId) ?? getBerylliumTransition('234.9nm')
  }, [activeTransition, selectedTransitionId, initialLevelId, targetLevelId])

  const upperLevelObj = transition ? getBerylliumLevel(transition.upperLevelId) : null
  const isEmission = activeTransition ? activeTransition.type === 'emission' : selectedLevelId === upperLevelObj?.id
  const isGroundInTransition = transition?.lowerLevelId === GROUND_LEVEL.id

  const isLevelActive = (def: DiagramLevelDef) => def.matchIds.includes(selectedLevelId)
  const isLevelTransitionLower = (def: DiagramLevelDef) => (transition ? def.matchIds.includes(transition.lowerLevelId) : false)
  const isLevelTransitionUpper = (def: DiagramLevelDef) => (transition ? def.matchIds.includes(transition.upperLevelId) : false)

  const handleSelectLevel = (def: DiagramLevelDef) => {
    if (activeTransition) return
    setBerylliumLevel(def.id)
    const match = BERYLLIUM_TRANSITIONS.find((t) => def.matchIds.includes(t.lowerLevelId) || def.matchIds.includes(t.upperLevelId))
    if (match) {
      setBerylliumTransition(match.id)
    }
  }

  return (
    <div className="levels-diagram beryllium-levels-instrument glass-instrument" aria-label="Beryllium Term Energy Levels Diagram">
      <ScientificInstrumentHeader title="TERM ENERGY LEVELS" badgeText="NIST ASD DATA" unitLabel="Be I · Excitation energy (eV)" />

      <IonizationLimitRow
        reactionText="Be I (2s²) → Be II (2s) + e⁻"
        energyEv={BERYLLIUM_IONIZATION_ENERGY_EV}
        subNote={`Reference level-table limit: ${BERYLLIUM_IONIZATION_LIMIT_CM1.toFixed(2)} cm⁻¹`}
        title="First Ionization Potential of Be I (NIST ASD Reference Data)"
      />

      {transition && (
        <TransitionStatusCard
          direction={isEmission ? 'emission' : 'absorption'}
          wavelengthNm={transition.wavelengthNm}
          wavelengthMedium={transition.wavelengthMedium}
          photonEnergyEv={transition.photonEnergyEv}
          bandOrRegion={transition.region}
          lineName={transition.lineName}
          seriesOrDetail={transition.classification}
          displayColor={transition.displayColor}
        />
      )}

      {/* Side-by-Side or Stacked Singlet/Triplet System Container (shared architecture, reused from Helium) */}
      <div className="excited-manifold-container">
        <section className="level-system-column singlet-system" aria-label="Singlet System S=0">
          <header className="system-column-header">
            <span className="system-title">SINGLET SYSTEM</span>
            <span className="system-spin-badge">S = 0</span>
          </header>
          <div className="level-rows-stack">
            {SINGLET_EXCITED_LEVELS.map((lvl) => (
              <EnergyLevelRow
                key={lvl.id}
                stateLabel={lvl.config}
                termOrDetail={lvl.term}
                meta={lvl.meta}
                energyEv={lvl.energyEv}
                isActive={isLevelActive(lvl)}
                isTransitionLower={isLevelTransitionLower(lvl)}
                isTransitionUpper={isLevelTransitionUpper(lvl)}
                transitionColor={transition?.displayColor}
                accessibleLabel={lvl.accessibleName}
                onClick={() => handleSelectLevel(lvl)}
                className="singlet-row"
              />
            ))}
          </div>
        </section>

        <div className="manifold-center-divider" aria-hidden="true" />

        <section className="level-system-column triplet-system" aria-label="Triplet System S=1">
          <header className="system-column-header">
            <span className="system-title">TRIPLET SYSTEM</span>
            <span className="system-spin-badge">S = 1</span>
          </header>
          <div className="level-rows-stack">
            {TRIPLET_EXCITED_LEVELS.map((lvl) => (
              <EnergyLevelRow
                key={lvl.id}
                stateLabel={lvl.config}
                termOrDetail={lvl.term}
                meta={lvl.meta}
                energyEv={lvl.energyEv}
                isActive={isLevelActive(lvl)}
                isTransitionLower={isLevelTransitionLower(lvl)}
                isTransitionUpper={isLevelTransitionUpper(lvl)}
                transitionColor={transition?.displayColor}
                accessibleLabel={lvl.accessibleName}
                onClick={() => handleSelectLevel(lvl)}
                className="triplet-row"
              />
            ))}
          </div>
        </section>
      </div>

      <AxisBreakBar subtitle="Excited manifold expanded for legibility" />

      <EnergyLevelRow
        stateLabel={GROUND_LEVEL.config}
        termOrDetail={GROUND_LEVEL.term}
        badge="GROUND"
        energyEv={GROUND_LEVEL.energyEv}
        isActive={isLevelActive(GROUND_LEVEL)}
        isTransitionLower={isGroundInTransition}
        transitionColor={transition?.displayColor}
        accessibleLabel={GROUND_LEVEL.accessibleName}
        onClick={() => handleSelectLevel(GROUND_LEVEL)}
        className="ground-level-row"
      />

      <InstrumentFooter text="2s2p ³P° metastable manifold: E1 spin-forbidden from ¹S₀ ground state · Click any level to inspect state · NIST ASD Data" />
    </div>
  )
}

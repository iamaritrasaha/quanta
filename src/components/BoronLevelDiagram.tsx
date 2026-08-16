import { useMemo, useState } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  BORON_TRANSITIONS,
  findBoronTransition,
  getBoronLevel,
  getBoronTransition,
  type BoronTransition,
} from '../physics/boron'
import { BORON_IONIZATION_ENERGY_EV, BORON_IONIZATION_LIMIT_CM1 } from '../physics/constants'
import { ScientificInstrumentHeader } from './science/ScientificInstrumentHeader'
import { IonizationLimitRow } from './science/IonizationLimitRow'
import { TransitionStatusCard } from './science/TransitionStatusCard'
import { AxisBreakBar } from './science/AxisBreakBar'
import { EnergyLevelRow } from './science/EnergyLevelRow'
import { InstrumentFooter } from './science/InstrumentFooter'

type SeriesCategory = 'S' | 'P' | 'D' | 'F'

interface DiagramLevelDef {
  id: string
  matchIds: string[]
  config: string
  term: string
  meta?: string
  energyEv: number
  series: SeriesCategory
  accessibleName: string
}

function levelDef(representativeId: string, matchIds: string[], series: SeriesCategory, meta?: string): DiagramLevelDef {
  const lvl = getBoronLevel(representativeId)!
  return {
    id: representativeId,
    matchIds,
    config: lvl.configuration,
    term: lvl.termSymbol,
    meta,
    energyEv: lvl.energyEv,
    series,
    accessibleName: `${lvl.configuration}, doublet ${lvl.term}, excitation energy ${lvl.energyEv.toFixed(3)} electron volts`,
  }
}

const BORON_EXCITED_LEVELS: DiagramLevelDef[] = [
  // F series
  levelDef('4f_2F', ['4f_2F'], 'F', 'J = 5/2, 7/2 · grouped'),

  // D series
  levelDef('3d_2D5_2', ['3d_2D3_2', '3d_2D5_2'], 'D', 'J = 3/2, 5/2'),
  levelDef('2p2_2D5_2', ['2p2_2D3_2', '2p2_2D5_2'], 'D', 'J = 3/2, 5/2 · 2s2p²'),

  // P series (excited)
  levelDef('4p_2P3_2', ['4p_2P1_2', '4p_2P3_2'], 'P', 'J = 1/2, 3/2'),
  levelDef('3p_2P3_2', ['3p_2P1_2', '3p_2P3_2'], 'P', 'J = 1/2, 3/2'),

  // S series
  levelDef('4s_2S1_2', ['4s_2S1_2'], 'S'),
  levelDef('3s_2S1_2', ['3s_2S1_2'], 'S'),
]

const GROUND_LEVEL: DiagramLevelDef = levelDef(
  '2p_2P1_2',
  ['2p_2P1_2', '2p_2P3_2'],
  'P',
  'Ground fine-structure doublet · ²P°₃/₂ at +15.287 cm⁻¹'
)

export function BoronLevelDiagram() {
  const selectedLevelId = useQuantaStore((s) => s.boron.selectedLevelId)
  const initialLevelId = useQuantaStore((s) => s.boron.initialLevelId)
  const targetLevelId = useQuantaStore((s) => s.boron.targetLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.boron.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.boron.activeTransition)
  const setBoronLevel = useQuantaStore((s) => s.setBoronLevel)
  const setBoronTransition = useQuantaStore((s) => s.setBoronTransition)

  const [activeSeriesTab, setActiveSeriesTab] = useState<'all' | SeriesCategory>('all')

  const transition: BoronTransition | undefined = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getBoronTransition(selectedTransitionId)
    return findBoronTransition(initialLevelId, targetLevelId) ?? getBoronTransition('249.77nm')
  }, [activeTransition, selectedTransitionId, initialLevelId, targetLevelId])

  const upperLevelObj = transition ? getBoronLevel(transition.upperLevelId) : null
  const isEmission = activeTransition ? activeTransition.type === 'emission' : selectedLevelId === upperLevelObj?.id
  const isGroundInTransition = transition ? GROUND_LEVEL.matchIds.includes(transition.lowerLevelId) : false

  const isLevelActive = (def: DiagramLevelDef) => def.matchIds.includes(selectedLevelId)
  const isLevelTransitionLower = (def: DiagramLevelDef) => (transition ? def.matchIds.includes(transition.lowerLevelId) : false)
  const isLevelTransitionUpper = (def: DiagramLevelDef) => (transition ? def.matchIds.includes(transition.upperLevelId) : false)

  const handleSelectLevel = (def: DiagramLevelDef) => {
    if (activeTransition) return
    setBoronLevel(def.id)
    const match = BORON_TRANSITIONS.find((t) => def.matchIds.includes(t.lowerLevelId) || def.matchIds.includes(t.upperLevelId))
    if (match) {
      setBoronTransition(match.id)
    }
  }

  const sLevels = BORON_EXCITED_LEVELS.filter((l) => l.series === 'S')
  const pLevels = BORON_EXCITED_LEVELS.filter((l) => l.series === 'P')
  const dLevels = BORON_EXCITED_LEVELS.filter((l) => l.series === 'D')
  const fLevels = BORON_EXCITED_LEVELS.filter((l) => l.series === 'F')

  return (
    <div className="levels-diagram boron-levels-instrument glass-instrument" aria-label="Boron Term Energy Levels Diagram">
      <ScientificInstrumentHeader title="TERM ENERGY LEVELS" badgeText="NIST ASD DATA" unitLabel="B I · Excitation energy (eV)" />

      <IonizationLimitRow
        reactionText="B I (2s²2p) → B II (2s²) + e⁻"
        energyEv={BORON_IONIZATION_ENERGY_EV}
        subNote={`Reference level-table limit: ${BORON_IONIZATION_LIMIT_CM1.toFixed(2)} cm⁻¹`}
        title="First Ionization Potential of B I (NIST ASD Reference Data)"
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

      {/* Series Segmented Filter Controls */}
      <div className="series-filter-tab-bar">
        <span className="series-tab-label">SERIES:</span>
        <div className="series-tabs">
          <button className={`series-tab-btn ${activeSeriesTab === 'all' ? 'active' : ''}`} onClick={() => setActiveSeriesTab('all')}>
            ALL SERIES
          </button>
          <button className={`series-tab-btn ${activeSeriesTab === 'S' ? 'active' : ''}`} onClick={() => setActiveSeriesTab('S')}>
            ²S
          </button>
          <button className={`series-tab-btn ${activeSeriesTab === 'P' ? 'active' : ''}`} onClick={() => setActiveSeriesTab('P')}>
            ²P°
          </button>
          <button className={`series-tab-btn ${activeSeriesTab === 'D' ? 'active' : ''}`} onClick={() => setActiveSeriesTab('D')}>
            ²D
          </button>
          <button className={`series-tab-btn ${activeSeriesTab === 'F' ? 'active' : ''}`} onClick={() => setActiveSeriesTab('F')}>
            ²F°
          </button>
        </div>
      </div>

      <div className="lithium-manifold-container">
        {(activeSeriesTab === 'all' || activeSeriesTab === 'S') && (
          <section className="level-system-column series-s-column" aria-label="S Series">
            <header className="system-column-header">
              <span className="system-title">²S SERIES</span>
              <span className="system-spin-badge">L = 0</span>
            </header>
            <div className="level-rows-stack">
              {sLevels.map((lvl) => (
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
                />
              ))}
            </div>
          </section>
        )}

        {(activeSeriesTab === 'all' || activeSeriesTab === 'P') && (
          <section className="level-system-column series-p-column" aria-label="P Series">
            <header className="system-column-header">
              <span className="system-title">²P° SERIES</span>
              <span className="system-spin-badge">L = 1</span>
            </header>
            <div className="level-rows-stack">
              {pLevels.map((lvl) => (
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
                />
              ))}
            </div>
          </section>
        )}

        {(activeSeriesTab === 'all' || activeSeriesTab === 'D') && (
          <section className="level-system-column series-d-column" aria-label="D Series">
            <header className="system-column-header">
              <span className="system-title">²D SERIES</span>
              <span className="system-spin-badge">L = 2</span>
            </header>
            <div className="level-rows-stack">
              {dLevels.map((lvl) => (
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
                />
              ))}
            </div>
          </section>
        )}

        {(activeSeriesTab === 'all' || activeSeriesTab === 'F') && (
          <section className="level-system-column series-f-column" aria-label="F Series">
            <header className="system-column-header">
              <span className="system-title">²F° SERIES</span>
              <span className="system-spin-badge">L = 3</span>
            </header>
            <div className="level-rows-stack">
              {fLevels.map((lvl) => (
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
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <AxisBreakBar subtitle="Excited manifold expanded for legibility" />

      <EnergyLevelRow
        stateLabel={GROUND_LEVEL.config}
        termOrDetail="²P°₁/₂,₃/₂"
        badge="GROUND"
        meta={GROUND_LEVEL.meta}
        energyEv={GROUND_LEVEL.energyEv}
        isActive={isLevelActive(GROUND_LEVEL)}
        isTransitionLower={isGroundInTransition}
        transitionColor={transition?.displayColor}
        accessibleLabel="2s squared 2p ground fine-structure doublet, P odd 1/2 and 3/2"
        onClick={() => handleSelectLevel(GROUND_LEVEL)}
        className="ground-level-row"
      />

      <InstrumentFooter text="Ground term ²P°₁/₂,₃/₂: open p subshell, L=1, odd parity · First QUANTA element with nonzero ground-state orbital angular momentum · NIST ASD Data" />
    </div>
  )
}

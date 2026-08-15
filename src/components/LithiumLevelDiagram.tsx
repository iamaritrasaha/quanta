import { useMemo, useState } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  LITHIUM_TRANSITIONS,
  findLithiumTransition,
  getLithiumLevel,
  getLithiumTransition,
  type LithiumTransition,
  type SeriesCategory,
} from '../physics/lithium'
import { LITHIUM_IONIZATION_ENERGY_EV, LITHIUM_IONIZATION_LIMIT_CM1 } from '../physics/constants'
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
  wavenumberCm1: number
  series: SeriesCategory
  accessibleName: string
}

const LITHIUM_EXCITED_LEVELS: DiagramLevelDef[] = [
  // F Series
  {
    id: '1s2_4f_2F5_2',
    matchIds: ['1s2_4f_2F5_2', '1s2_4f_2F7_2'],
    config: '1s²4f',
    term: '²F°',
    meta: 'J = 5/2, 7/2',
    energyEv: 4.542,
    wavenumberCm1: 36630.2,
    series: 'F',
    accessibleName: '1s squared 4f, doublet F odd multiplet J 5/2, 7/2, excitation energy 4.542 electron volts',
  },

  // D Series
  {
    id: '1s2_4d_2D5_2',
    matchIds: ['1s2_4d_2D5_2', '1s2_4d_2D3_2'],
    config: '1s²4d',
    term: '²D',
    meta: 'J = 3/2, 5/2',
    energyEv: 4.541,
    wavenumberCm1: 36623.4,
    series: 'D',
    accessibleName: '1s squared 4d, doublet D multiplet J 3/2, 5/2, excitation energy 4.541 electron volts',
  },
  {
    id: '1s2_3d_2D5_2',
    matchIds: ['1s2_3d_2D5_2', '1s2_3d_2D3_2'],
    config: '1s²3d',
    term: '²D',
    meta: 'J = 3/2, 5/2',
    energyEv: 3.879,
    wavenumberCm1: 31283.12,
    series: 'D',
    accessibleName: '1s squared 3d, doublet D multiplet J 3/2, 5/2, excitation energy 3.879 electron volts',
  },

  // P Series
  {
    id: '1s2_4p_2P3_2',
    matchIds: ['1s2_4p_2P3_2', '1s2_4p_2P1_2'],
    config: '1s²4p',
    term: '²P°',
    meta: 'J = 1/2, 3/2',
    energyEv: 4.522,
    wavenumberCm1: 36469.55,
    series: 'P',
    accessibleName: '1s squared 4p, doublet P odd multiplet J 1/2, 3/2, excitation energy 4.522 electron volts',
  },
  {
    id: '1s2_3p_2P3_2',
    matchIds: ['1s2_3p_2P3_2', '1s2_3p_2P1_2'],
    config: '1s²3p',
    term: '²P°',
    meta: 'J = 1/2, 3/2',
    energyEv: 3.834,
    wavenumberCm1: 30925.38,
    series: 'P',
    accessibleName: '1s squared 3p, doublet P odd multiplet J 1/2, 3/2, excitation energy 3.834 electron volts',
  },
  {
    id: '1s2_2p_2P3_2',
    matchIds: ['1s2_2p_2P3_2'],
    config: '1s²2p',
    term: '²P°₃/₂',
    meta: 'D₂ · 14904.00 cm⁻¹',
    energyEv: 1.848,
    wavenumberCm1: 14904.0,
    series: 'P',
    accessibleName: '1s squared 2p, doublet P odd 3/2, fine structure D2 component, excitation energy 1.848 electron volts',
  },
  {
    id: '1s2_2p_2P1_2',
    matchIds: ['1s2_2p_2P1_2'],
    config: '1s²2p',
    term: '²P°₁/₂',
    meta: 'D₁ · 14903.66 cm⁻¹',
    energyEv: 1.848,
    wavenumberCm1: 14903.66,
    series: 'P',
    accessibleName: '1s squared 2p, doublet P odd 1/2, fine structure D1 component, excitation energy 1.848 electron volts',
  },

  // S Series
  {
    id: '1s2_4s_2S1_2',
    matchIds: ['1s2_4s_2S1_2'],
    config: '1s²4s',
    term: '²S₁/₂',
    energyEv: 4.341,
    wavenumberCm1: 35012.06,
    series: 'S',
    accessibleName: '1s squared 4s, doublet S 1/2, excitation energy 4.341 electron volts',
  },
  {
    id: '1s2_3s_2S1_2',
    matchIds: ['1s2_3s_2S1_2'],
    config: '1s²3s',
    term: '²S₁/₂',
    energyEv: 3.373,
    wavenumberCm1: 27206.12,
    series: 'S',
    accessibleName: '1s squared 3s, doublet S 1/2, excitation energy 3.373 electron volts',
  },
]

const GROUND_LEVEL: DiagramLevelDef = {
  id: '1s2_2s_2S1_2',
  matchIds: ['1s2_2s_2S1_2'],
  config: '1s²2s',
  term: '²S₁/₂',
  meta: 'Ground Reference',
  energyEv: 0.0,
  wavenumberCm1: 0.0,
  series: 'S',
  accessibleName: '1s squared 2s, doublet S 1/2 ground state reference, 0.000 electron volts',
}

export function LithiumLevelDiagram() {
  const selectedLevelId = useQuantaStore((s) => s.lithium.selectedLevelId)
  const initialLevelId = useQuantaStore((s) => s.lithium.initialLevelId)
  const targetLevelId = useQuantaStore((s) => s.lithium.targetLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.lithium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.lithium.activeTransition)
  const setLithiumLevel = useQuantaStore((s) => s.setLithiumLevel)
  const setLithiumTransition = useQuantaStore((s) => s.setLithiumTransition)

  const [activeSeriesTab, setActiveSeriesTab] = useState<'all' | SeriesCategory>('all')

  const transition: LithiumTransition | undefined = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getLithiumTransition(selectedTransitionId)
    return findLithiumTransition(initialLevelId, targetLevelId) ?? getLithiumTransition('670.8nm')
  }, [activeTransition, selectedTransitionId, initialLevelId, targetLevelId])

  const upperLevelObj = transition ? getLithiumLevel(transition.upperLevelId) : null
  const isEmission = activeTransition
    ? activeTransition.type === 'emission'
    : selectedLevelId === upperLevelObj?.id

  const isGroundInTransition = transition?.lowerLevelId === GROUND_LEVEL.id

  const isLevelActive = (def: DiagramLevelDef) => {
    return def.matchIds.includes(selectedLevelId)
  }

  const isLevelTransitionLower = (def: DiagramLevelDef) => {
    return transition ? def.matchIds.includes(transition.lowerLevelId) : false
  }

  const isLevelTransitionUpper = (def: DiagramLevelDef) => {
    return transition ? def.matchIds.includes(transition.upperLevelId) : false
  }

  const handleSelectLevel = (def: DiagramLevelDef) => {
    if (activeTransition) return
    setLithiumLevel(def.id)

    // Auto-select corresponding curated transition if available
    const match = LITHIUM_TRANSITIONS.find((t) =>
      def.matchIds.includes(t.lowerLevelId) || def.matchIds.includes(t.upperLevelId)
    )
    if (match) {
      setLithiumTransition(match.id)
    }
  }

  const sLevels = LITHIUM_EXCITED_LEVELS.filter((l) => l.series === 'S')
  const pLevels = LITHIUM_EXCITED_LEVELS.filter((l) => l.series === 'P')
  const dLevels = LITHIUM_EXCITED_LEVELS.filter((l) => l.series === 'D')
  const fLevels = LITHIUM_EXCITED_LEVELS.filter((l) => l.series === 'F')

  return (
    <div
      className="levels-diagram lithium-levels-instrument glass-instrument"
      aria-label="Lithium Term Energy Levels Diagram"
    >
      {/* 1. Scientific Header */}
      <ScientificInstrumentHeader
        title="TERM ENERGY LEVELS"
        badgeText="NIST ASD DATA"
        unitLabel="Li I · Excitation energy (eV)"
      />

      {/* 2. Full-Width Ionization Limit Bar */}
      <IonizationLimitRow
        reactionText="Li I (1s²2s) → Li II (1s²) + e⁻"
        energyEv={LITHIUM_IONIZATION_ENERGY_EV}
        subNote={`${LITHIUM_IONIZATION_LIMIT_CM1.toFixed(2)} cm⁻¹ above ground`}
        title="First Ionization Potential of Li I (NIST ASD Reference Data)"
      />

      {/* 3. Transition Status Card */}
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

      {/* 4. Series Segmented Filter Controls (Visible on narrower workspace widths) */}
      <div className="series-filter-tab-bar">
        <span className="series-tab-label">SERIES:</span>
        <div className="series-tabs">
          <button
            className={`series-tab-btn ${activeSeriesTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSeriesTab('all')}
          >
            ALL SERIES
          </button>
          <button
            className={`series-tab-btn ${activeSeriesTab === 'S' ? 'active' : ''}`}
            onClick={() => setActiveSeriesTab('S')}
          >
            ²S (SHARP)
          </button>
          <button
            className={`series-tab-btn ${activeSeriesTab === 'P' ? 'active' : ''}`}
            onClick={() => setActiveSeriesTab('P')}
          >
            ²P° (PRINCIPAL)
          </button>
          <button
            className={`series-tab-btn ${activeSeriesTab === 'D' ? 'active' : ''}`}
            onClick={() => setActiveSeriesTab('D')}
          >
            ²D (DIFFUSE)
          </button>
          <button
            className={`series-tab-btn ${activeSeriesTab === 'F' ? 'active' : ''}`}
            onClick={() => setActiveSeriesTab('F')}
          >
            ²F° (FUNDAMENTAL)
          </button>
        </div>
      </div>

      {/* 5. Series Columns Container */}
      <div className="lithium-manifold-container">
        {/* S Series Column */}
        {(activeSeriesTab === 'all' || activeSeriesTab === 'S') && (
          <section className="level-system-column series-s-column" aria-label="S Series (Sharp)">
            <header className="system-column-header">
              <span className="system-title">²S SERIES (SHARP)</span>
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

        {/* P Series Column (Contains 2p fine-structure split) */}
        {(activeSeriesTab === 'all' || activeSeriesTab === 'P') && (
          <section className="level-system-column series-p-column" aria-label="P Series (Principal)">
            <header className="system-column-header">
              <span className="system-title">²P° SERIES (PRINCIPAL)</span>
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

        {/* D Series Column */}
        {(activeSeriesTab === 'all' || activeSeriesTab === 'D') && (
          <section className="level-system-column series-d-column" aria-label="D Series (Diffuse)">
            <header className="system-column-header">
              <span className="system-title">²D SERIES (DIFFUSE)</span>
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

        {/* F Series Column */}
        {(activeSeriesTab === 'all' || activeSeriesTab === 'F') && (
          <section className="level-system-column series-f-column" aria-label="F Series (Fundamental)">
            <header className="system-column-header">
              <span className="system-title">²F° SERIES (FUNDAMENTAL)</span>
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

      {/* 6. Axis Break Bar */}
      <AxisBreakBar subtitle="Upper Rydberg states expanded for legibility" />

      {/* 7. Ground Level Row */}
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

      {/* 8. Footer Microcopy */}
      <InstrumentFooter text="2p fine structure: ²P°₁/₂ (14903.66 cm⁻¹) & ²P°₃/₂ (14904.00 cm⁻¹) · NIST ASD compilation" />
    </div>
  )
}

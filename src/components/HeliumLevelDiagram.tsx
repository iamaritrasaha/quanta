import { useMemo } from 'react'
import { useQuantaStore } from '../state/quantaStore'
import {
  HELIUM_TRANSITIONS,
  findHeliumTransition,
  getHeliumLevel,
  getHeliumTransition,
  type HeliumTransition,
} from '../physics/helium'
import { HELIUM_IONIZATION_ENERGY_EV } from '../physics/constants'
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
  multiplicity: 'singlet' | 'triplet'
  accessibleName: string
}

const SINGLET_EXCITED_LEVELS: DiagramLevelDef[] = [
  {
    id: '1s3p_1P1',
    matchIds: ['1s3p_1P1'],
    config: '1s3p',
    term: '¹P°₁',
    energyEv: 23.087,
    wavenumberCm1: 186209.37,
    multiplicity: 'singlet',
    accessibleName: '1s 3p, singlet P odd 1, excitation energy 23.087 electron volts',
  },
  {
    id: '1s3d_1D2',
    matchIds: ['1s3d_1D2'],
    config: '1s3d',
    term: '¹D₂',
    energyEv: 23.074,
    wavenumberCm1: 186104.97,
    multiplicity: 'singlet',
    accessibleName: '1s 3d, singlet D 2, excitation energy 23.074 electron volts',
  },
  {
    id: '1s3s_1S0',
    matchIds: ['1s3s_1S0'],
    config: '1s3s',
    term: '¹S₀',
    energyEv: 22.920,
    wavenumberCm1: 184864.83,
    multiplicity: 'singlet',
    accessibleName: '1s 3s, singlet S 0, excitation energy 22.920 electron volts',
  },
  {
    id: '1s2p_1P1',
    matchIds: ['1s2p_1P1'],
    config: '1s2p',
    term: '¹P°₁',
    energyEv: 21.218,
    wavenumberCm1: 171134.90,
    multiplicity: 'singlet',
    accessibleName: '1s 2p, singlet P odd 1, excitation energy 21.218 electron volts',
  },
  {
    id: '1s2s_1S0',
    matchIds: ['1s2s_1S0'],
    config: '1s2s',
    term: '¹S₀',
    energyEv: 20.616,
    wavenumberCm1: 166277.44,
    multiplicity: 'singlet',
    accessibleName: '1s 2s, singlet S 0 metastable, excitation energy 20.616 electron volts',
  },
]

const TRIPLET_EXCITED_LEVELS: DiagramLevelDef[] = [
  {
    id: '1s3d_3D',
    matchIds: ['1s3d_3D', '1s3d_3D3', '1s3d_3D2', '1s3d_3D1'],
    config: '1s3d',
    term: '³D',
    meta: 'J = 1,2,3',
    energyEv: 23.074,
    wavenumberCm1: 186101.55,
    multiplicity: 'triplet',
    accessibleName: '1s 3d, triplet D multiplet J 1,2,3, excitation energy 23.074 electron volts',
  },
  {
    id: '1s3p_3P',
    matchIds: ['1s3p_3P', '1s3p_3P2', '1s3p_3P1', '1s3p_3P0'],
    config: '1s3p',
    term: '³P°',
    meta: 'J = 0,1,2',
    energyEv: 23.007,
    wavenumberCm1: 185564.60,
    multiplicity: 'triplet',
    accessibleName: '1s 3p, triplet P odd multiplet J 0,1,2, excitation energy 23.007 electron volts',
  },
  {
    id: '1s3s_3S1',
    matchIds: ['1s3s_3S1'],
    config: '1s3s',
    term: '³S₁',
    energyEv: 22.719,
    wavenumberCm1: 183236.79,
    multiplicity: 'triplet',
    accessibleName: '1s 3s, triplet S 1, excitation energy 22.719 electron volts',
  },
  {
    id: '1s2p_3P2',
    matchIds: ['1s2p_3P2', '1s2p_3P1', '1s2p_3P0'],
    config: '1s2p',
    term: '³P°',
    meta: 'J = 0,1,2',
    energyEv: 20.964,
    wavenumberCm1: 169086.77,
    multiplicity: 'triplet',
    accessibleName: '1s 2p, triplet P odd multiplet J 0,1,2, excitation energy 20.964 electron volts',
  },
  {
    id: '1s2s_3S1',
    matchIds: ['1s2s_3S1'],
    config: '1s2s',
    term: '³S₁',
    energyEv: 19.820,
    wavenumberCm1: 159855.97,
    multiplicity: 'triplet',
    accessibleName: '1s 2s, triplet S 1 metastable, excitation energy 19.820 electron volts',
  },
]

const GROUND_LEVEL: DiagramLevelDef = {
  id: '1s2_1S0',
  matchIds: ['1s2_1S0'],
  config: '1s²',
  term: '¹S₀',
  energyEv: 0.0,
  wavenumberCm1: 0.0,
  multiplicity: 'singlet',
  accessibleName: '1s squared, singlet S 0 ground state reference, 0.000 electron volts',
}

export function HeliumLevelDiagram() {
  const selectedLevelId = useQuantaStore((s) => s.helium.selectedLevelId)
  const initialLevelId = useQuantaStore((s) => s.helium.initialLevelId)
  const targetLevelId = useQuantaStore((s) => s.helium.targetLevelId)
  const selectedTransitionId = useQuantaStore((s) => s.helium.selectedTransitionId)
  const activeTransition = useQuantaStore((s) => s.helium.activeTransition)
  const setHeliumLevel = useQuantaStore((s) => s.setHeliumLevel)
  const setHeliumTransition = useQuantaStore((s) => s.setHeliumTransition)

  const transition: HeliumTransition | undefined = useMemo(() => {
    if (activeTransition) return activeTransition.physics
    if (selectedTransitionId) return getHeliumTransition(selectedTransitionId)
    return findHeliumTransition(initialLevelId, targetLevelId) ?? getHeliumTransition('587.6nm')
  }, [activeTransition, selectedTransitionId, initialLevelId, targetLevelId])

  const upperLevelObj = transition ? getHeliumLevel(transition.upperLevelId) : null
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
    setHeliumLevel(def.id)

    // Auto-select corresponding curated transition if available
    const match = HELIUM_TRANSITIONS.find((t) =>
      def.matchIds.includes(t.lowerLevelId) || def.matchIds.includes(t.upperLevelId)
    )
    if (match) {
      setHeliumTransition(match.id)
    }
  }

  return (
    <div
      className="levels-diagram helium-levels-instrument glass-instrument"
      aria-label="Helium Term Energy Levels Diagram"
    >
      {/* 1. Header Row */}
      <ScientificInstrumentHeader
        title="TERM ENERGY LEVELS"
        badgeText="NIST ASD DATA"
        unitLabel="He I · Excitation energy (eV)"
      />

      {/* 2. Full-Width Ionization Limit Bar */}
      <IonizationLimitRow
        reactionText="He I → He II + e⁻"
        energyEv={HELIUM_IONIZATION_ENERGY_EV}
        title="First Ionization Potential of He I (NIST ASD 2024)"
      />

      {/* 3. Transition Status Card (when a transition is active or selected) */}
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

      {/* 4. Side-by-Side or Stacked Excited Manifold Container */}
      <div className="excited-manifold-container">
        {/* Singlet Column (S = 0) */}
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

        {/* Center Optical Column Divider (Visible only in wide side-by-side mode) */}
        <div className="manifold-center-divider" aria-hidden="true" />

        {/* Triplet Column (S = 1) */}
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

      {/* 5. Simplified Axis Break Bar */}
      <AxisBreakBar subtitle="Excited-state scale expanded for legibility" />

      {/* 6. Full-Width Ground State Row */}
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

      {/* 7. Footer Microcopy */}
      <InstrumentFooter text="Click any level to inspect state · Directional vector reflects physical absorption/emission · NIST ASD Data" />
    </div>
  )
}

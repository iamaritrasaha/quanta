import { useMemo } from 'react'
import type { Element } from '../../data/elements'
import {
  getNistLevels,
  NIST_LEVELS_SOURCE,
  NIST_LEVELS_SOURCE_URL,
  type AtomicLevel,
} from '../../data/atomicLevels'
import { getAtomicProperties } from '../../data/atomicData'
import { getElementProfile } from '../../data/elementProfiles'
import { referenceModel } from '../../data/elementStates'
import { groundModel } from '../../physics/elementModel'
import { useQuantaStore } from '../../state/quantaStore'
import { ScientificInstrumentHeader } from './ScientificInstrumentHeader'
import { IonizationLimitRow } from './IonizationLimitRow'
import { TransitionStatusCard } from './TransitionStatusCard'
import { AxisBreakBar } from './AxisBreakBar'
import { EnergyLevelRow } from './EnergyLevelRow'
import { InstrumentFooter } from './InstrumentFooter'

interface UniversalLevelDiagramProps {
  element: Element
}

const CM_TO_EV = 1.2398419843320026e-4

export function UniversalLevelDiagram({ element }: UniversalLevelDiagramProps) {
  const selectedState = useQuantaStore((s) => s.sharedElement.selected)
  const isTransitioning = useQuantaStore((s) => Boolean(s.sharedElement.activeTransition))
  const selectState = useQuantaStore((s) => s.selectElementState)
  const setTarget = useQuantaStore((s) => s.setElementTarget)
  const startTransition = useQuantaStore((s) => s.startElementTransition)

  const selected = selectedState ?? groundModel(element.symbol)
  const properties = getAtomicProperties(element.symbol)
  const profile = getElementProfile(element.symbol)
  const nist = getNistLevels(element.symbol)

  const levels = useMemo(
    () => [...nist.levels].sort((a, b) => a.energyCm - b.energyCm),
    [nist.levels]
  )

  const ionizationEnergyEv = properties?.ionizationEnergyEv
    ? parseFloat(properties.ionizationEnergyEv)
    : nist.ionizationLimitCm
    ? nist.ionizationLimitCm * CM_TO_EV
    : undefined

  const hasReferenceLevels = levels.length > 0
  const isSingleLevel = levels.length === 1
  const isUnavailable = levels.length === 0

  const handleSelectLevel = (level: AtomicLevel, index: number) => {
    if (isTransitioning) return
    const model =
      index === 0
        ? groundModel(element.symbol)
        : referenceModel(element.symbol, level, index)

    if (model) {
      if (model.id !== selected.id) {
        setTarget(model)
        selectState(model)
      }
    }
  }

  return (
    <div
      className="levels-diagram glass-instrument"
      aria-label={`${element.name} Energy Levels Diagram`}
    >
      <ScientificInstrumentHeader
        title={`${element.symbol.toUpperCase()} I ENERGY LEVELS`}
        badgeText={isUnavailable ? 'THEORETICAL' : 'NIST ASD REFERENCE'}
        unitLabel={`${element.name} · Energy (eV & cm⁻¹)`}
      />

      {/* Ionization Limit Row */}
      {ionizationEnergyEv !== undefined ? (
        <IonizationLimitRow
          reactionText={`${element.symbol} I → ${element.symbol} II + e⁻`}
          energyEv={ionizationEnergyEv}
          subNote={
            nist.ionizationLimitCm
              ? `${nist.ionizationLimitCm.toLocaleString('en-US', {
                  maximumFractionDigits: 1,
                })} cm⁻¹ ionization threshold`
              : 'First ionization threshold'
          }
          title={`${element.name} Ionization Limit`}
        />
      ) : (
        <div className="atomic-level-row atomic-limit-row">
          <span className="atomic-level-number">∞</span>
          <span className="atomic-level-term">Ionization Limit (Predicted)</span>
          <strong>~10.0+</strong>
          <small>eV</small>
        </div>
      )}

      {/* Level Stack */}
      {hasReferenceLevels ? (
        <div className="hydrogen-manifold-container">
          <header className="hydrogen-manifold-header">
            <span className="system-title">
              {isSingleLevel ? 'GROUND TERM ONLY' : 'NIST ASD BOUND SPECTRUM'}
            </span>
            <span className="system-spin-badge">
              {levels.length} {levels.length === 1 ? 'LEVEL' : 'LEVELS'} RECORDED
            </span>
          </header>

          <div className="level-rows-stack">
            {levels.slice(0, 12).map((level, index) => {
              const energyEv = level.energyCm * CM_TO_EV
              const isGround = index === 0
              const isSelected =
                selected.id === (isGround ? 'ground' : `nist-${index}`) ||
                (selected.energyCm !== undefined &&
                  Math.abs(selected.energyCm - level.energyCm) < 0.01)

              const model =
                isGround
                  ? groundModel(element.symbol)
                  : referenceModel(element.symbol, level, index)
              const isDisabled = !isGround && !model

              return (
                <EnergyLevelRow
                  key={`${level.configuration}-${level.term}-${level.j}-${index}`}
                  stateLabel={`${level.configuration} ${level.term}`}
                  termOrDetail={`J = ${level.j}`}
                  meta={`${level.energyCm.toLocaleString('en-US', {
                    maximumFractionDigits: 1,
                  })} cm⁻¹`}
                  energyEv={energyEv}
                  energyFormatted={`${energyEv.toFixed(3)} eV`}
                  isActive={isSelected}
                  accessibleLabel={`${level.configuration} ${level.term}, J=${level.j}, energy ${energyEv.toFixed(3)} electron volts`}
                  onClick={() => !isDisabled && handleSelectLevel(level, index)}
                  className={`atomic-level-button ${isDisabled ? 'disabled-level-row' : ''}`}
                />
              )
            })}

            {levels.length > 12 && (
              <div
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                + {levels.length - 12} additional high-lying NIST levels tabulated
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Explanatory view when experimental levels are unmeasured */
        <div className="atomic-data-notice" role="status" style={{ margin: '1rem 0' }}>
          <strong>
            Neutral-atom energy levels for {element.name} ({element.symbol}) are not cataloged in
            NIST ASD.
          </strong>
          <p style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
            {profile.modelTier === 'tierD'
              ? 'As a superheavy synthetic element with a fleeting half-life, bound optical transitions have not yet been experimentally resolved in laboratory spectroscopy.'
              : 'Authoritative experimental bound-level compilations are currently unrecorded in the primary atomic spectra database.'}
          </p>
        </div>
      )}

      {/* Axis Break for Ground Separation */}
      {levels.length > 1 && levels[1].energyCm > 5000 && (
        <AxisBreakBar
          title="SCALE BREAK"
          subtitle="Ground term fine-structure vs excited Rydberg manifold"
          subNote="Energy axis compressed for visual clarity"
        />
      )}

      <InstrumentFooter
        text={
          hasReferenceLevels
            ? `${NIST_LEVELS_SOURCE} (${element.symbol} I) · Measured relative to ground state in cm⁻¹ and converted to eV.`
            : 'Theoretical atomic structure predictions · Bound energy levels omitted where experimental measurements are unavailable.'
        }
      />
    </div>
  )
}

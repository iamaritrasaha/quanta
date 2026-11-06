import { defaultTarget, getElementStates } from '../data/elementStates'
import { groundModel, modelSeparation } from '../physics/elementModel'
import { useQuantaStore } from '../state/quantaStore'
import { useMemo } from 'react'
import { StateCombobox } from './common/StateCombobox'
import { formatElementStateOption } from './common/stateComboboxHelpers'

export function ElementTransitionControls({ symbol }: { symbol: string }) {
  const states = useMemo(() => getElementStates(symbol), [symbol])
  const stateOptions = useMemo(
    () => states.map((s, i) => formatElementStateOption(s, i === 0)),
    [states]
  )

  const model = useQuantaStore((s) => s.sharedElement)
  const select = useQuantaStore((s) => s.selectElementState)
  const setTarget = useQuantaStore((s) => s.setElementTarget)
  const start = useQuantaStore((s) => s.startElementTransition)
  const cancel = useQuantaStore((s) => s.cancelElementTransition)
  const playing = useQuantaStore((s) => s.playing)

  const initial = model.selected ?? states[0]
  const target = model.target ?? defaultTarget(states)
  const separation = modelSeparation(initial, target)
  const absorption = target.rank > initial.rank
  const jump = model.activeTransition
  const invalid = initial.rank === target.rank || initial.id === target.id
  const phase = jump
    ? jump.type === 'absorption'
      ? jump.progress < 0.46 ? 'Incoming photon' : jump.progress < 0.56 ? 'Absorbing photon' : 'Electron excitation'
      : jump.progress < 0.46 ? 'Electron relaxation' : 'Outgoing photon'
    : ''

  return (
    <div className="transition-controls element-transition-controls glass-floating" aria-label="State Transition Controls">
      <div className="controls-header">
        <span className="controls-title">QUANTUM JUMP CONTROLLER</span>
        {jump && <span className="transition-active-badge">{playing ? 'IN PROGRESS' : 'PAUSED'}</span>}
      </div>
      <div className="level-select-grid">
        <div className="select-field">
          <label htmlFor="element-initial-state">INITIAL STATE</label>
          <StateCombobox
            id="element-initial-state"
            ariaLabel="Initial quantum state"
            value={initial.id}
            disabled={Boolean(jump)}
            onChange={(val) => {
              const matched = states.find((s) => s.id === val)
              if (matched) select(matched)
            }}
            options={stateOptions}
          />
        </div>
        <div className="select-divider">→</div>
        <div className="select-field">
          <label htmlFor="element-target-state">FINAL STATE</label>
          <StateCombobox
            id="element-target-state"
            ariaLabel="Final quantum state"
            value={target.id}
            disabled={Boolean(jump)}
            onChange={(val) => {
              const matched = states.find((s) => s.id === val)
              if (matched) setTarget(matched)
            }}
            options={stateOptions}
          />
        </div>
      </div>
      <div className="preset-buttons-row">
        <button className="preset-btn" disabled={Boolean(jump)} onClick={() => { select(groundModel(symbol)); setTarget(defaultTarget(states)) }}>EXCITE</button>
        <button className="preset-btn" disabled={Boolean(jump)} onClick={() => { select(defaultTarget(states)); setTarget(groundModel(symbol)) }}>RELAX</button>
        <button className="preset-btn" disabled={Boolean(jump)} onClick={() => { select(target); setTarget(initial) }}>REVERSE</button>
      </div>
      <p className="atomic-model-note">
        {invalid ? 'Choose a different final state to demonstrate photon absorption or emission.' : initial.schematic || target.schematic
          ? 'Schematic shell promotion: illustrates excitation and relaxation only. No measured energy or wavelength is assigned.'
          : 'NIST level energies. Animation is schematic; this pair is not checked against transition selection rules. States within one principal shell do not change its electron count.'}
      </p>
      {separation && <div className="atomic-jump-energy">ΔE = {separation.energyEv.toPrecision(5)} eV · λ = {separation.wavelengthNm.toLocaleString('en-US', { maximumFractionDigits: 3 })} nm</div>}
      {jump ? (
        <div className="active-transition-view">
          <p role="status">{phase}{!playing ? ' · paused' : ''} · {Math.round(jump.progress * 100)}%</p>
          <progress className="atomic-jump-progress" aria-label="Transition progress" max={1} value={jump.progress} />
          <button className="primary-action-btn" onClick={cancel}>CANCEL TRANSITION</button>
        </div>
      ) : (
        <button className="primary-action-btn" disabled={invalid} onClick={() => start(target)}>
          {invalid ? 'SELECT A DIFFERENT FINAL STATE' : `${absorption ? 'ABSORB' : 'EMIT'} PHOTON${separation ? ` (${separation.energyEv.toFixed(3)} eV)` : ' · SCHEMATIC'}`}
        </button>
      )}
      <p className="atomic-model-note">Drag to rotate · Scroll or pinch to zoom · Use PLAY / PAUSE and speed controls below the scene.</p>
    </div>
  )
}

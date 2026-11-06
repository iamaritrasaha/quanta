import type { Element } from '../data/elements'
import type { ViewMode } from '../state/quantaStore'
import { ElementTransitionControls } from './ElementTransitionControls'
import {
  UniversalOverview,
  UniversalShellControls,
  UniversalQuantumControls,
  UniversalLevelDiagram,
  UniversalSpectrumVisualizer,
  UniversalEquationInspector,
} from './science'

interface MultiElementInstrumentProps {
  element: Element
  mode: ViewMode
}

export function MultiElementInstrument({ element, mode }: MultiElementInstrumentProps) {
  return (
    <>
      <ElementTransitionControls symbol={element.symbol} />
      {mode === 'overview' && <UniversalOverview element={element} />}
      {mode === 'bohr' && <UniversalShellControls element={element} />}
      {mode === 'quantum' && <UniversalQuantumControls element={element} />}
      {mode === 'energy' && <UniversalLevelDiagram element={element} />}
      {mode === 'spectra' && <UniversalSpectrumVisualizer element={element} />}
      {mode === 'equations' && <UniversalEquationInspector element={element} />}
    </>
  )
}

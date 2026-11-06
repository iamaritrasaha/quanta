# QUANTA V3: Forensic Baseline Audit

**Project:** QUANTA: Matter, visualized.  
**Auditor:** Senior Frontend & Scientific Visualization Pair Programmer  
**Date:** 2026-11-06  
**Branch:** `design/quanta-periodic-table-v3` (branched from `main` @ `6526eff`)  
**Commit:** `6526eff` ("Refactor explorer layout for readability")  
**Environment:** Node.js v22.x, Windows 11, PowerShell  
**Baseline Test Status:** 
- Unit Tests (Vitest): **374 passed** (13 test files)
- Production Build (`tsc -b && vite build`): **Succeeded** (5.57s)
- Browser Tests (Playwright): **12 passed** (4.9m)

---

## 1. Executive Summary

QUANTA is an interactive atomic physics visualization instrument built with React 19, TypeScript, Three.js, React Three Fiber, Zustand, KaTeX, and Vite. It covers all 118 chemical elements, with dedicated 3D quantum wave mechanics instruments for Hydrogen through Boron (Z = 1–5), and a shared scientific instrument for Carbon through Oganesson (Z = 6–118) powered by local snapshots of NIST ASD and PubChem reference data.

The application possesses a robust, mathematically sound physics engine and comprehensive unit/browser test coverage. However, the initial screen (the **Periodic Table**) is rudimentary compared to the sophisticated 3D atomic explorer. It functions essentially as a static grid of 118 buttons with minimal styling, no group/period labels, no search, no family filtering, no element inspection, an artificial 550ms click delay, and CSS/scientific categorization defects.

This audit records the baseline state, identifies confirmed defects versus subjective enhancement opportunities, and outlines the plan for the **QUANTA OBSERVATORY (V3)** redesign.

---

## 2. Baseline Verification Results

### 2.1 Unit Tests (`npm test` via Vitest)
```
✓ src/physics/helium.test.ts (13 tests)
✓ src/physics/lithium.test.ts (16 tests)
✓ src/physics/hydrogen.test.ts (10 tests)
✓ src/physics/beryllium.test.ts (22 tests)
✓ src/physics/boron.test.ts (21 tests)
✓ src/state/quantaStore.test.ts (21 tests)
✓ src/components/science/spectroscopy.test.ts (12 tests)
✓ src/physics/scaleTransforms.test.ts (2 tests)
✓ src/physics/transitionTiming.test.ts (5 tests)
✓ src/state/playback.test.ts (6 tests)
✓ src/data/atomicData.test.ts (11 tests)
✓ src/state/elementTransitions.test.ts (118 tests)
✓ src/data/elementStates.test.ts (117 tests)

Test Files  13 passed (13)
Tests       374 passed (374)
Duration    1.80s
```

### 2.2 Production Build (`npm run build`)
- TypeScript compiler (`tsc -b`): Clean, zero errors.
- Vite build: Bundled client in 5.57s.
- Chunk separation: `three-core` (703 kB), `math-typesetting` (261 kB), `AtomScene` (235 kB, lazy-loaded), `MultiElementInstrument` (150 kB, lazy-loaded), `index.js` (512 kB).
- Asset base: Relative (`./`), suitable for GitHub Pages deployment under `/quanta/`.

### 2.3 Browser Tests (`npm run test:browser` via Playwright)
- All 12 browser tests passed:
  1. All 118 element routes and 113 shared transition controllers (`1.0m`).
  2. Hydrogen: photon pause, speed, resume, emission, cancel, reset, modes, idle pause (`18.2s`).
  3. Helium: photon pause, speed, resume, emission, cancel, reset, modes, idle pause (`19.9s`).
  4. Lithium: photon pause, speed, resume, emission, cancel, reset, modes, idle pause (`21.0s`).
  5. Beryllium: photon pause, speed, resume, emission, cancel, reset, modes, idle pause (`22.1s`).
  6. Boron: photon pause, speed, resume, emission, cancel, reset, modes, idle pause (`25.4s`).
  7. Shared reference and schematic transitions, clouds and missing data (`1.1m`).
  8. Mouse rotation, zoom, and camera reset work on Hydrogen and Carbon (`21.4s`).
  9. Responsive 320px layout fit (`7.9s`).
  10. Responsive 390px layout fit (`8.9s`).
  11. Responsive 768px layout fit (`9.0s`).
  12. Touch drag and pinch rotate/zoom (`7.9s`).

---

## 3. Confirmed Defects (Bugs & Inaccuracies)

| ID | Issue | Severity | Component | Evidence | Proposed Repair | Regression Risk |
|---|---|---|---|---|---|---|
| **DEF-01** | Undefined `--radius-xs` design token | Medium | `src/styles.css` | Used at lines 3564, 4006, 4057, 4092, 4193 (`border-radius: var(--radius-xs);`), but `:root` only defines `--radius-sm: 6px`, `--radius-md: 10px`, etc. Browser resolves undefined variable to `0px`. | Define `--radius-xs: 4px;` in `:root`. | Very Low |
| **DEF-02** | Lanthanum (La) and Actinium (Ac) misclassified as "transition metal" | Medium | `src/data/elements.ts` | `const lanthanides = ['Ce', ..., 'Lu']` (14 elements), `const actinides = ['Th', ..., 'Lr']` (14 elements). `La` (57) and `Ac` (89) are given `category: 'transition metal'` because they sit in col 3. In IUPAC taxonomy, La–Lu (57–71) are Lanthanoids and Ac–Lr (89–103) are Actinoids. | Expand lanthanoid and actinoid classifications to all 15 elements each (La–Lu, Ac–Lr) while preserving grid coordinates. | Low |
| **DEF-03** | Artificial 550ms input delay on tile click | Low | `src/components/PeriodicTable.tsx` | `handleElementClick` sets a 550ms `window.setTimeout` before calling `onSelectElement`. This adds perceptible latency to navigation. | Remove fixed delay; trigger navigation immediately while supporting smooth visual transitions. | Very Low |
| **DEF-04** | Missing Periodic Table metadata: No group or period numbering | Medium | `src/components/PeriodicTable.tsx` | The grid renders 18 columns and 9 rows with zero group headers (1–18) and zero period labels (1–7). Lanthanoids and Actinoids have no row labels or period connection. | Render clear group headers (1–18), period indicators (1–7), and distinct series tags for Lanthanoids (Period 6) and Actinoids (Period 7). | Low |
| **DEF-05** | Fragile color hex values with 8-digit syntax in `:root` | Low | `src/styles.css` | `--accent-optic-subtle: #38bdf826;` and `--accent-glow: #60a5fa33;` lack explicit rgba or functional color definitions, which can fail or render inconsistently in older WebViews. | Use explicit `rgba(...)` tokens for transparent accents. | Very Low |

---

## 4. Subjective & Architectural Improvements

| Area | Current State | Defect vs Improvement | Proposed V3 Improvement |
|---|---|---|---|
| **Element Search** | None | Improvement | Real-time search across names, symbols, atomic numbers, partial matches, and spelling variants (Aluminium/Aluminum, Caesium/Cesium). Unambiguous match on Enter, clear on Escape. |
| **Category Filtering** | None | Improvement | Interactive filter bar for 10 chemical families (Alkali metals, Alkaline-earth metals, Transition metals, Post-transition metals, Metalloids, Other nonmetals, Halogens, Noble gases, Lanthanoids, Actinoids) plus "All Elements". |
| **Element Inspector** | None | Improvement | Contextual inspector occupying the natural upper-middle space of the periodic table (Periods 1–3, Groups 3–12) on desktop, and docked/adjacent on tablet/mobile. Displays atomic number, symbol, name, category, mass with units, electron configuration, shell occupancy, and "EXPLORE ATOM" button. |
| **Tile Hierarchy** | Crowded, arbitrary 'OPEN'/'EXPLORE' labels, no atomic mass, long names clip | Improvement | Clean hierarchy: atomic number, prominent chemical symbol, legible element name, and atomic mass where legible. Subtle category glow and border accents. |
| **Mobile Experience** | Raw horizontal scroll across a 960px minimum-width grid | Improvement | Dual-mode mobile experience: responsive scrollable grid with explicit affordances + compact, searchable element list/browser optimized for touch. |
| **Keyboard Accessibility** | Linear 118-tab sequence; no grid navigation; no screen reader live feedback | Improvement | 2D arrow-key grid navigation, roving tabindex, visible focus rings, ARIA live region for search results, semantic role attributes. |
| **Modular CSS** | Single 4,234-line stylesheet with mixed concerns | Improvement | Modularize periodic table styling into dedicated components and stylesheet segments, keeping atomic instrument styles intact. |

---

## 5. Scope & Safeguards

1. **Zero regressions in scientific features**: Hydrogen through Boron dedicated instruments and Carbon through Oganesson shared instruments remain 100% functional.
2. **All 118 direct routes**: `#/element/<name>` must continue to resolve cleanly.
3. **No breaking changes to physics calculations**: Rydberg formulas, NIST levels, selection rules, and spectroscopic conversions remain untouched.
4. **Static deployability**: Full compatibility with GitHub Pages (`base: './'`).

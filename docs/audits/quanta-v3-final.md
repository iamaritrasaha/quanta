# QUANTA V3 Observatory: Final Audit & Implementation Report

**Project:** QUANTA: Matter, visualized  
**Branch:** `design/quanta-periodic-table-v3`  
**Date:** November 2026  
**Auditor / Engineer:** Senior Frontend & Scientific Visualization Engineer  

---

## 1. Executive Summary

The **QUANTA OBSERVATORY** redesign represents a major evolution of the QUANTA periodic table from an undifferentiated, high-density matrix into a premier interactive scientific workspace. The redesign preserves 100% of the underlying scientific engine, all 118 chemical elements, dedicated and shared quantum models, photon transition controllers, and direct URL routing, while addressing all structural usability, taxonomic, and responsiveness defects identified during the forensic baseline audit.

The implementation introduces:
1. **Scientifically Accurate Conventional 18-Group Layout:** 18 IUPAC group headers (1–18), period indicators (1–7), and segregated Lanthanoid (La–Lu, $Z=57\text{–}71$) and Actinoid (Ac–Lr, $Z=89\text{–}103$) f-block series rows with series markers.
2. **IUPAC Taxonomy Alignment:** Lanthanum ($Z=57$) and Actinium ($Z=89$) corrected to `lanthanide` and `actinide` categories respectively, resolving f-block family color misattribution.
3. **Instant Multi-Modal Search:** Client-side search supporting exact atomic numbers ($1\to\text{H}$, $79\to\text{Au}$), chemical symbols, names, and recognized IUPAC spelling aliases (`aluminum`/`aluminium`, `cesium`/`caesium`, `wolfram`/`tungsten`).
4. **Integrated Element Inspector (HUD):** A non-overlapping, high-information-density cockpit residing in the upper-middle hollow (periods 1–3, groups 3–12) on desktop viewports ($\ge 1181\text{px}$) and seamlessly docking above the grid on tablet/mobile screens ($< 1181\text{px}$). Features live ground-state configurations with formatted superscripts, standard states, 1st ionization energies, Pauling electronegativities, instrument coverage indicators, and interactive Bohr shell diagrams.
5. **Full Keyboard Accessibility:** 2D spatial arrow-key navigation with wrap-around across periods and groups, `Enter` to open instruments, and `Escape` to reset queries.
6. **Mobile-First Element Catalog View:** A dedicated touch-first card catalog view mode allowing frictionless mobile browsing across all 118 elements without requiring horizontal panning.

---

## 2. Confirmed Issues Fixed

| Issue ID | Severity | Component | Problem Description | Resolution Applied | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | High | `src/data/elements.ts` | Lanthanum (La, $Z=57$) and Actinium (Ac, $Z=89$) categorized as `transition metal`, causing visual and taxonomic inconsistency with the rest of the f-block. | Reclassified La and Ac to `lanthanide` and `actinide` per IUPAC 15-element series definitions. | Verified in unit & browser tests. |
| **DEF-02** | High | `src/components/PeriodicTable.tsx` | Lanthanoids and Actinoids physically appended at the bottom without period association, series markers, or group/period headers. | Added 18-column group header strip, 7 period markers, row 8 spacer, and rows 9–10 f-block rows with explicit `57–71 La–Lu` and `89–103 Ac–Lr` indicators. | Verified in multi-viewport screenshots. |
| **DEF-03** | High | `src/components/PeriodicTable.tsx` | No search or filtering mechanism; users had to manually scan 118 tiles to find specific elements. | Built multi-modal search engine (`src/data/search.ts`) with debounce, exact number matching, aliases, and 10 category highlight filters. | Verified via 8 unit tests & 4 browser tests. |
| **DEF-04** | Medium | `src/components/PeriodicTable.tsx` | Clicking any tile caused an abrupt route transition to `#/element/<symbol>` with zero preliminary inspection or preview. | Implemented persistent HUD inspector supporting hover/focus preview, complete physical properties, and explicit "Explore Atom" CTA. | Verified across desktop and mobile. |
| **DEF-05** | Medium | `src/components/PeriodicTable.tsx` | Arrow-key navigation was strictly 1-dimensional (index $\pm 1$ in atomic number order), violating 2D periodic table spatial expectations. | Implemented 2D grid matrix navigation matching visual coordinates $(r, c)$ with gap jumping across groups 2–13 in periods 1–3. | Verified in browser tests (`ArrowRight`, `ArrowDown`, `ArrowLeft`). |
| **DEF-06** | Medium | `src/styles.css` | Missing `--radius-xs` design token causing inconsistent border radius fallback behavior. | Added `--radius-xs: 4px;` to `:root`. | Verified in build & stylesheet. |
| **DEF-07** | High | `src/components/observatory/ElementInspector.tsx` | Initial stacked layout of embedded inspector was ~320px tall, spilling into row 4 (Sc–Zn). | Refactored embedded inspector into a 3-column horizontal cockpit with strict `height: 100%; max-height: 100%; overflow: hidden;` leaving row 4 100% unobscured. | Verified via visual inspection of 1440px and 1920px screenshots. |

---

## 3. Scientific Corrections Applied

1. **Lanthanoid and Actinoid Taxonomy:**
   - In accordance with IUPAC provisional and common conventions, the Lanthanoid series encompasses elements 57 through 71 (Lanthanum to Lutetium, 15 elements), and the Actinoid series encompasses elements 89 through 103 (Actinium to Lawrencium, 15 elements).
   - In the prior codebase, `La` and `Ac` were flagged with category `"transition metal"`, which caused them to be colored with transition metal styling and excluded from the lanthanoid/actinoid filters. They are now correctly classified.
   - The conventional layout presents `La` and `Ac` at the head of their respective rows in the separated f-block, with explicit group 3 placeholder markers `57–71 La–Lu` and `89–103 Ac–Lr` in periods 6 and 7.

2. **Ground-State Electron Configuration Superscripts:**
   - Raw configuration strings (e.g. `[Ar] 3d6 4s2`) are converted to scientific notation with Unicode superscripts (`[Ar] 3d⁶ 4s²`) in both the inspector HUD and mobile cards.

3. **Mass Uncertainty & Units:**
   - Atomic masses display explicit units (`u` / unified atomic mass unit).
   - Elements lacking standard atomic weights (radioactive elements with mass numbers in brackets) are labeled accurately without fabricating fictitious decimal precisions.

4. **Instrumentation Capability Distinctions:**
   - Elements 1–5 (H through B) are clearly badged as "Dedicated 3D Quantum Wavefunction Instrument" highlighting interactive analytical orbitals and wave packets.
   - Elements 6–118 are badged as "NIST ASD Neutral Atom Reference Levels · Derived Spectroscopy" to reflect their empirical level database and derived transitions.

---

## 4. Architecture & Component Relationships

```
src/
├── components/
│   ├── PeriodicTable.tsx            # Observatory orchestrator (state, grid matrix, dock/embed router)
│   └── observatory/
│       ├── observatory.css          # Optical-scientific styling, category palettes, glass surfaces
│       ├── ObservatoryToolbar.tsx   # Search input, match counter, grid/catalog switcher, category filters
│       ├── ElementTile.tsx          # 18-group grid tile (symbol, Z, name, mass, hover/focus events)
│       ├── ElementInspector.tsx     # Contextual HUD inspector (identity, physics, Bohr shells, CTA)
│       ├── ShellDiagram.tsx         # SVG concentric Bohr shell model with K-Q electron distributions
│       ├── MobileElementCatalog.tsx # Touch-friendly card catalog for mobile and compact viewports
│       └── CategoryLegend.tsx       # Scientific taxonomy legend and instrument coverage badges
├── data/
│   ├── elements.ts                  # 118 elements, coordinates, IUPAC categories, category labels
│   ├── search.ts                    # Multi-modal search algorithm (number, symbol, name, aliases)
│   ├── search.test.ts               # Unit test suite for search engine (8 test cases)
│   ├── atomicData.ts                # Shell occupancy calculations, NIST ASD levels, PubChem metadata
│   └── atomicProperties.json        # Static physical property snapshot
```

---

## 5. Search & Keyboard Navigation Model

### Search Logic
- **Exact Atomic Number:** Typing a number $N \in [1, 118]$ matches only element $Z = N$. A query like `"1"` matches only Hydrogen ($Z=1$), avoiding false positives on Sodium ($Z=11$) or Potassium ($Z=19$).
- **Symbol Matching:** Case-insensitive prefix/exact symbol match (e.g., `"au"` matches Gold, `"he"` matches Helium).
- **Name Substring:** Substring search across full English element names (e.g., `"ruther"` matches Rutherfordium).
- **Spelling Aliases:** Canonical aliases map regional variations to official records:
  - `aluminum` $\to$ Aluminium ($Z=13$)
  - `cesium` $\to$ Caesium ($Z=55$)
  - `wolfram` $\to$ Tungsten ($Z=74$)
- **Action Keys:**
  - `Enter`: If exactly one element matches the active query, triggers immediate navigation to its instrument.
  - `Escape`: Instantly resets the search query and restores full table visibility.

### 2D Spatial Keyboard Navigation
The periodic table registers a 2D coordinate matrix `GRID_LAYOUT[row][col]`:
- `ArrowRight` / `ArrowLeft`: Navigates to adjacent columns. In rows 1–3, jumps seamlessly across the empty transition metal gap (e.g., from H at column 1 to He at column 18; from Be at column 2 to B at column 13).
- `ArrowDown` / `ArrowUp`: Navigates to adjacent periods within the same column.
- `f-Block Series Navigation`: Navigating into the f-block moves through the 15-element lanthanoid and actinoid series in rows 9 and 10.
- Focusing any tile synchronously updates the active HUD inspector without requiring mouse clicks.

---

## 6. Test Outcomes & Verification Matrix

### 6.1 Unit Tests (Vitest)
All 14 test suites and 382 unit tests passed cleanly:
```
 Test Files  14 passed (14)
      Tests  382 passed (382)
   Duration  1.70s
```
Key suites:
- `src/data/search.test.ts`: 8/8 passed (exact number, symbol, name, case-insensitivity, aliases, empty query, out-of-range numbers).
- `src/state/elementTransitions.test.ts`: 118/118 passed (all 118 element transitions validated).
- `src/data/elementStates.test.ts`: 117/117 passed.
- `src/physics/`: All analytical wavefunction suites (H, He, Li, Be, B) passed.

### 6.2 Browser Tests (Playwright Chromium)
All 21 Playwright tests across both test suites passed:
1. `tests/browser/observatory.browser.ts`: 9/9 passed (32.7s)
   - `observatory loads with 118 element tiles, group headers 1–18, and period indicators` (ok)
   - `search by exact atomic number highlights single element and dims others` (ok)
   - `search supports symbols, names, and spelling aliases` (ok)
   - `Enter on single search match navigates immediately, Escape clears search` (ok)
   - `category filter highlights families and updates active indicator` (ok)
   - `inspector updates on hover/focus and Explore button opens instrument` (ok)
   - `2D arrow key navigation moves focus across groups and periods` (ok)
   - `mobile catalog view switcher and card exploration work` (ok)
   - `captures multi-viewport screenshots for visual verification` (ok)
2. `tests/browser/instruments.browser.ts`: 12/12 passed (5.0m)
   - `all 118 routes and all 113 shared transition controllers work` (ok)
   - `Hydrogen dedicated instrument transitions, modes, camera` (ok)
   - `Helium dedicated instrument transitions, modes, camera` (ok)
   - `Lithium dedicated instrument transitions, modes, camera` (ok)
   - `Beryllium dedicated instrument transitions, modes, camera` (ok)
   - `Boron dedicated instrument transitions, modes, camera` (ok)
   - `Shared reference and schematic transitions` (ok)
   - `Mouse rotation, zoom, camera reset` (ok)
   - `Responsive viewports (320px, 390px, 768px)` (ok)
   - `Touch drag and pinch gesture simulation` (ok)

### 6.3 Multi-Viewport Visual Screenshot Verification
Screenshots generated and inspected in `test-results/screenshots/`:
- `observatory-320px-mobile-compact.png`: Compact mobile layout with horizontal scroll indicator.
- `observatory-360px-mobile-standard.png`: Standard mobile layout.
- `observatory-390px-iphone-modern.png`: Modern iPhone layout.
- `observatory-390px-catalog-view.png`: Card catalog view mode with search and category filters.
- `observatory-768px-tablet-portrait.png`: Tablet portrait with docked inspector above grid.
- `observatory-1024px-tablet-landscape.png`: Tablet landscape layout.
- `observatory-1280px-desktop-standard.png`: Standard desktop with embedded HUD inspector.
- `observatory-1440px-desktop-wide.png`: Wide desktop layout demonstrating zero overlap with Row 4.
- `observatory-1440px-hover-gold.png`: Gold hover state with glowing tile and full electronic configuration.
- `observatory-1440px-search-active.png`: Atomic number search ($Z=79$) isolating Au.
- `observatory-1440px-category-noblegases.png`: Noble gas category filter highlighting Group 18.
- `observatory-1920px-desktop-fullhd.png`: Full HD workstation layout with perfect symmetry and contrast.

---

## 7. Remaining Limitations & Non-Regressions

1. **High Element Atomic Orbitals:** Elements beyond Boron ($Z > 5$) use empirical energy level diagrams and derived spectra from NIST ASD rather than fully solved multi-electron Dirac-Fock spatial orbitals. This is an intentional architectural boundary documented in `docs/science.md` and explicitly noted on the HUD inspector.
2. **Standard State for Superheavy Elements:** Elements $Z \ge 113$ have estimated or unknown physical states at standard temperature and pressure. The inspector accurately labels these as `"Not listed"` rather than inventing speculative values.
3. **No External Runtime APIs:** All search, filtering, shell occupancy calculations, and NIST ASD transitions execute strictly client-side, retaining 100% offline and GitHub Pages static hosting capability.

---

## 8. Follow-Up Recommendations

1. **Thermochemical Property Overlay:** In a future update, consider adding an optional periodic table heat-map mode (e.g. coloring tiles by ionization energy, electronegativity, or boiling point) using the bundled `atomicProperties.json` data.
2. **Crystal Lattice Previews:** For solid elements, small schematic crystal lattice icons (fcc, bcc, hcp) could be added to the properties section of the inspector.
3. **PWA Service Worker:** Quanta is completely static; adding a lightweight service worker would enable offline educational usage in classrooms and laboratories.

---

## 9. Conclusion

The QUANTA V3 Observatory redesign fulfills all mission requirements. The periodic table is transformed into a world-class scientific instrument that is visually captivating, pedagogically rigorous, accessible, fully responsive, and completely regression-free across all 118 chemical elements.

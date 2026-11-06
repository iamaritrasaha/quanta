# QUANTA V4 — Design Specification: Complete Atomic Exploration

**System:** QUANTA Atomic Instruments (All 118 Elements)  
**Status:** Implemented & Verified  
**Audience:** Frontend Engineers, Computational Physicists, Scientific Reviewers  
**Design Direction:** Precision Scientific Instrument / Hydrogen Benchmark Parity  

---

## 1. Vision & The Hydrogen Benchmark Standard

In QUANTA V1–V3, the Hydrogen instrument ($Z=1$) established the benchmark for scientific software design: high visual fidelity, rigorous mathematical derivations, interactive quantum wavefunctions, intuitive energy level ladders, and continuous multi-band spectroscopy. 

However, elements Carbon through Oganesson ($Z=6\text{–}118$) previously utilized a minimal shared instrument that lacked element-specific narratives, mathematical transparency, visual energy ladders, and nuanced spectroscopic context.

**QUANTA V4 systematically eliminates all qualitative differences across all 118 chemical elements.** Every element now provides six rich, carefully structured exploration modes that match Hydrogen's educational standard while strictly respecting the physical laws governing many-electron atoms.

---

## 2. Mandatory Typography Standard

QUANTA V4 replaces all legacy UI fonts with a cohesive, high-performance, open-source typography standard:

### 2.1 Primary Interface Font: Google Sans
- **Package:** `@fontsource/google-sans` (Weights: 400, 500, 600, 700)
- **License:** SIL Open Font License 1.1
- **Usage:**
  - Application header and periodic table navigation
  - Instrument mode navigation tabs and action buttons
  - Headings, section titles, and element names
  - Scientific narratives, historical notes, and physical explanations
  - Tooltips, modal dialogs, and metadata labels
- **Rendering:** `font-display: swap`, system fallbacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).

### 2.2 Technical & Tabular Font: JetBrains Mono
- **Package:** `@fontsource/jetbrains-mono` (Weights: 400, 500, 600)
- **License:** SIL Open Font License 1.1
- **Usage:**
  - Tabular atomic numbers ($Z$) and standard atomic weights
  - Ground-state and excited-state electron configurations (e.g., `[Ar] 3d⁶ 4s²`)
  - Spectroscopic term symbols (e.g., `⁵D₄`, `²S₁/₂`)
  - Energy values ($\text{eV}$, $\text{cm}^{-1}$), wavelengths ($\text{nm}$), and frequencies ($\text{THz}$)
  - Mathematical state identifiers and quantum numbers ($n, \ell, m_\ell, s$)
  - Slater screening constants ($\sigma$) and effective nuclear charge ($Z_{\text{eff}}$)

### 2.3 Mathematical Typography: KaTeX
- **Rendering Stack:** KaTeX font stack (`KaTeX_Main`, `KaTeX_Math`, `KaTeX_AMS`, `KaTeX_Size1-4`).
- **Isolation:** Mathematical equations and derivations are preserved from interface font overrides to avoid glyph distortion or corrupted radical/integral signs.

---

## 3. Universal Scientific Architecture

Rather than maintaining divergent instrument views, QUANTA V4 unifies elements $Z=6\text{–}118$ under a modular, high-performance suite of universal scientific components (`src/components/science/`):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Header / Element HUD                        │
├────────────────────────────────┬───────────────────────────────────────┤
│                                │             Mode Tabs                 │
│                                │ [Overview] [Shell] [Quantum]          │
│                                │ [Energy Levels] [Spectra] [Equations] │
│                                ├───────────────────────────────────────┤
│                                │                                       │
│          3D Canvas             │        Active Mode Component          │
│       (Three.js / R3F)         │  • UniversalOverview                  │
│   • Nucleus Particle Cluster   │  • UniversalShellControls             │
│   • Core & Valence Shell Rings │  • UniversalQuantumControls           │
│   • Pedagogical Electron Nodes │  • UniversalLevelDiagram              │
│   • Photon Absorption/Emission │  • UniversalSpectrumVisualizer        │
│                                │  • UniversalEquationInspector         │
│                                │                                       │
│                                ├───────────────────────────────────────┤
│                                │       ElementTransitionControls       │
│                                │  [EXCITE] [RELAX] [ABSORB] [EMIT]     │
└────────────────────────────────┴───────────────────────────────────────┘
```

### Universal Component Suite
1. **`UniversalOverview`**: Complete scientific dossier:
   - Header identity with IUPAC family badge, period, group, and standard state.
   - Historical discovery context and etymology.
   - Distinctive physical behavior contrast box (e.g., aufbau anomalies, relativistic contraction).
   - High-density properties grid (atomic weight, configuration, ionization energy, electronegativity, radius, density).
   - Spectroscopic ground term and model tier badge.
2. **`UniversalShellControls`**: Principal quantum shell breakdown ($K$ through $Q$, $n=1\text{–}7$):
   - Occupancy metrics distinguishing core vs. valence electrons.
   - Pedagogical orbit warning (clarifying that electrons do not travel in planetary Bohr trajectories).
   - State presets for quick inspection.
3. **`UniversalQuantumControls`**: Quantum mechanical structure:
   - Subshell breakdown ($s, p, d, f$) and orbital degeneracies ($2(2\ell+1)$).
   - Live Slater screening calculator displaying screening constant $\sigma$ and effective nuclear charge $Z_{\text{eff}}$.
   - Pauli exclusion principle and Hund's rule occupancy explanations.
4. **`UniversalLevelDiagram`**: Visual Grotrian energy ladder:
   - Interactive SVG vertical energy ladder calibrated in $\text{eV}$ and $\text{cm}^{-1}$.
   - Continuum threshold and ionization limit marker ($E_{\text{ion}}$).
   - Visual scale-break bar with warning for ultra-deep ground states.
   - Clickable level rows displaying state configuration, term symbol, and energy.
5. **`UniversalSpectrumVisualizer`**: Multi-band spectral laboratory:
   - Continuous spectral strip covering Vacuum UV ($<200\text{ nm}$), Near UV, Visible ($380\text{–}750\text{ nm}$), and Near IR ($>750\text{ nm}$).
   - Landmark spectral lines with source citations.
   - Live active transition marker with vacuum wavelength, air wavelength (Edlén index), frequency, and photon energy.
   - Photon absorption and emission trigger controls.
6. **`UniversalEquationInspector`**: 4-stage pedagogical mathematical derivation:
   - **Stage 01 — Physical Concept:** Core mechanics of nuclear attraction, electron shielding, and photon quantization.
   - **Stage 02 — Mathematical Formulation:** Multi-electron Hamiltonian with Coulomb repulsion, Slater screening formulas, and Rydberg energy approximations.
   - **Stage 03 — State Parameter Substitution:** Live substitution of the selected element's $Z$, ground term, and level energies into the equations.
   - **Stage 04 — Calculated Physical Result:** Computed effective charge, binding energy, and transition characteristics.

---

## 4. Six Exploration Modes Specification

| Mode | Pedagogical Objective | Key Interactive Elements |
| :--- | :--- | :--- |
| **Overview** | Establish element identity, macroscopic state, periodic placement, and atomic metrics. | Contrast callout box, tabular properties grid, provenance badges, historical discovery notes. |
| **Shell Model** | Visualize principal quantum shells ($n=1\text{–}7$), electron counts, and core/valence demarcation. | Shell breakdown chips ($K\dots Q$), state presets, camera reset, 3D orbiting markers. |
| **Quantum** | Explain wave-mechanical reality, orbital angular momentum ($\ell=0,1,2,3$), and electron screening. | Subshell chips, Slater $Z_{\text{eff}}$ calculation card, Pauli/Hund rule callouts, density clouds. |
| **Energy Levels** | Conceptualize bound stationary states and quantum jumps between discrete energy levels. | Grotrian energy ladder, ionization line, level selection rows, transition state preview. |
| **Spectra** | Connect discrete atomic energy differences to electromagnetic radiation and observable colors. | Multi-band spectral strip, landmark emission lines, air/vacuum wavelength switcher, photon animation. |
| **Equations** | Disclose the mathematical foundation with full symbolic rigor and live numerical substitution. | 4-stage KaTeX derivation stepper (Concept $\to$ Formulation $\to$ Substitution $\to$ Result). |

---

## 5. Model Tier Framework & Scientific Honesty

To guarantee scientific rigor, QUANTA adheres strictly to four model tiers:

- **Tier A — Analytical Hydrogenic ($Z=1$):** Exact hydrogenic solutions. Wavefunctions rendered as continuous probability density volumes.
- **Tier B — Dedicated Many-Electron ($Z=2\text{–}5$):** Multi-electron wavefunctions incorporating electron correlation, singlet/triplet manifolds, and fine structure.
- **Tier C — Empirical / Slater Radial ($Z=6\text{–}108$):** Empirical NIST ASD level ladders, calculated Slater effective nuclear charges ($Z_{\text{eff}}$), and pedagogical radial occupancy clouds.
- **Tier D — Theoretical / Superheavy ($Z=109\text{–}118$):** Relativistic Dirac-Fock predictions, shell closures, and open research questions. Missing experimental spectra are explicitly marked as unavailable rather than fabricated.

---

## 6. Accessibility & Responsiveness

- **Contrast:** All text, badges, and interactive controls maintain WCAG 2.1 AA compliant contrast ratios ($\ge 4.5:1$ for body text, $\ge 3:1$ for UI components and headers).
- **Tabular Alignment:** All numerical measurements and electron configurations use monospace tabular figures (`JetBrains Mono`), preventing jitter during live transitions.
- **Touch & Mobile Support:** Touch targets meet the minimum $44 \times 44\text{px}$ dimension. Horizontal scrolling tabs and stacked control panels ensure full usability on mobile viewports ($375\text{px}$ width and above).
- **Reduced Motion:** Adheres to `prefers-reduced-motion: reduce` media queries by freezing decorative idle orbits while preserving user-initiated transitions.

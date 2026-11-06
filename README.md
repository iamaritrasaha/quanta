# QUANTA

**Matter, visualized.**

An interactive atomic physics observatory and scientific instrument exploring all 118 chemical elements: atomic structure, electron configurations, quantum mechanics, photon transitions, Grotrian energy diagrams, and continuous spectroscopy.

**[Launch QUANTA Observatory](https://iamaritrasaha.github.io/quanta/)**

---

## QUANTA V4 — Complete Atomic Exploration

QUANTA V4 systematically eliminates all qualitative differences across all 118 elements, bringing every single element to the visual, mathematical, and interactive standard established by Hydrogen.

Every element provides six rich, dedicated exploration modes powered by rigorous physical models:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          QUANTA OBSERVATORY                            │
│           Interactive 18-Group Periodic Table & Element HUD            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   118 ATOMIC SCIENTIFIC INSTRUMENTS                    │
├─────────────────┬──────────────────────────────────────────────────────┤
│ 1. Overview     │ Identity, discovery, physical properties & contrasts │
│ 2. Shell Model  │ Interactive 3D shell structure & core/valence counts │
│ 3. Quantum      │ Subshell breakdown, Slater's Z_eff & Hund's rules    │
│ 4. Energy Levels│ Visual Grotrian energy ladder & ionization limits    │
│ 5. Spectra      │ Multi-band spectral strip, landmark lines & air disp.│
│ 6. Equations    │ 4-stage KaTeX mathematical derivations & Hamiltonian │
└─────────────────┴──────────────────────────────────────────────────────┘
```

### Scientific Model Tiers
To preserve physical honesty, QUANTA categorizes atomic systems into four clear model tiers:

| Tier | Scope | Description & Physical Realism |
| :--- | :--- | :--- |
| **Tier A — Analytical Hydrogenic** | $\text{H}$ ($Z=1$) | Exact analytical wavefunctions $\psi_{n\ell m}(r,\theta,\phi)$ and Rydberg energy eigenvalues $E_n = -13.6\text{ eV}/n^2$. |
| **Tier B — Dedicated Multi-Electron** | $\text{He}\text{–}\text{B}$ ($Z=2\text{–}5$) | Dedicated multi-electron states with parameterized effective-charge screening (calibrated against empirical ionization energies and published numerical Hartree-Fock charge densities), singlet/triplet manifolds, and fine structure. |
| **Tier C — Empirical / Slater Radial** | $\text{C}\text{–}\text{Hs}$ ($Z=6\text{–}108$) | Empirical NIST ASD level ladders, calculated subshell-targeted Slater screening constants ($Z_{\text{eff}} = Z - \sigma$), exact analytical Laguerre radial functions with numerical peak and node evaluation, and real spherical harmonic angular representations. |
| **Tier D — Theoretical / Superheavy** | $\text{Mt}\text{–}\text{Og}$ ($Z=109\text{–}118$) | Published relativistic Dirac-Fock predictions (e.g. Fricke, Schwerdtfeger, and NIST theoretical literature) and $j\text{-}j$ spin-orbit coupling disclosures. Missing optical spectra are honestly flagged rather than fabricated. |

---

## Typography Standard

QUANTA uses a modern, open-source typography standard:

- **Google Sans** (`@fontsource/google-sans`): Navigation, element names, mode tabs, card titles, scientific narratives, and UI text.
- **JetBrains Mono** (`@fontsource/jetbrains-mono`): Tabular atomic numbers, electron configurations, spectroscopic term symbols, energy values, wavelengths, frequencies, and code.
- **KaTeX Font Stack**: Mathematical formulas, Greek symbols, and quantum mechanical derivations preserved without distortion.

---

## The Six Exploration Modes

1. **Overview:** Rich scientific dossier with IUPAC category, discovery history, etymology, distinctive physical behavior callout (e.g. relativistic contraction in Au, aufbau anomalies in Cu/Cr), and tabular physical properties.
2. **Bohr / Shell Model:** 3D interactive shell visualization with principal quantum shells ($K$ through $Q$, $n=1\text{–}7$), clear core versus valence distinctions, and pedagogical notices.
3. **Quantum:** Complete, interactive 3D atomic orbital explorer covering all $s, p, d, f$ subshells ($n=1\text{–}7$) across all 16 real basis orientations ($p_x/p_y/p_z$, 5 $d$, 7 $f$). Features signed wavefunction phase coloring ($\psi > 0$ Sky Blue vs $\psi < 0$ Coral Amber), internal cross-section slicing (XY, XZ, YZ), interactive SVG radial probability density plots $P(r) = r^2|R(r)|^2$ with exact numerical peak radii and analytical node markers, ground-state occupancy badges, and live Slater $Z_{\text{eff}}$ screening calculators.
4. **Energy Levels:** Visual SVG Grotrian energy ladder calibrated in $\text{eV}$ and $\text{cm}^{-1}$, continuum threshold ($E_{\text{ion}}$), visual scale breaks, and selectable bound stationary states.
5. **Spectra:** Continuous spectral strip covering Vacuum UV ($<200\text{ nm}$), Near UV, Visible ($380\text{–}750\text{ nm}$), and Near IR ($>750\text{ nm}$). Displays landmark spectral lines, vacuum wavelengths, and air wavelengths computed via the **Edlén dispersion formula** ($\lambda \ge 200\text{ nm}$).
6. **Equations:** 4-stage pedagogical mathematical derivation stepper:
   - **Stage 01:** Physical Concept
   - **Stage 02:** Mathematical Formulation ($Z$-electron Hamiltonian, Slater relations)
   - **Stage 03:** Element & State Parameter Substitution
   - **Stage 04:** Calculated Results ($Z_{\text{eff}}$, valence binding energy, transition $\Delta E$)

---

## Scene & Transition Controls

| Control | Action |
| :--- | :--- |
| **Mouse Drag / Touch Drag** | Orbit and rotate the 3D atom scene |
| **Mouse Wheel / Pinch** | Smoothly zoom the camera |
| **PLAY / PAUSE** | Freeze or resume electron motion and active photon transitions |
| **0.5× / 1× / 2×** | Adjust animation playback speed |
| **RESET VIEW** | Restore the default camera orientation |
| **RESET ATOM** | Restore the atom to its ground-state configuration |
| **ABSORB / EMIT PHOTON** | Trigger quantum excitation or relaxation with animated photon wave packet |
| **CANCEL TRANSITION** | Abort an in-flight photon transition and revert to initial state |

---

## Documentation & Audits

- **[Quantum Orbital Models](docs/science/orbital-models.md):** Mathematical formulation of real spherical harmonics, generalized Laguerre polynomials, radial probability densities, and Slater $Z_{\text{eff}}$ models.
- **[Orbital Explorer Specification](docs/design/orbital-explorer.md):** Visual specification, phase color palette, optical glass styling, slice planes, and accessibility.
- **[Quantum Orbitals Final Audit](docs/audits/quantum-orbitals-final.md):** Verification report and defect resolution summary for DEF-Q01 through DEF-Q05.
- **[Scientific Models](docs/science.md):** Many-electron Hamiltonians, Slater screening rules, relativistic effects, and quantum mechanics derivations.
- **[Reference Data](docs/reference-data.md):** Provenance, NIST ASD and PubChem snapshots, Edlén atmospheric dispersion, and data integrity guidelines.
- **[Design Specification V4](docs/design/atomic-explorer-v4.md):** The Hydrogen benchmark standard, typography migration, and universal component architecture.
- **[Atomic Coverage Audit V4](docs/audits/atomic-coverage-v4.md):** Forensic audit matrix covering all 118 elements across all 6 modes.
- **[Final Implementation Audit](docs/audits/quanta-v4-final.md):** Comprehensive test results, visual audits, and verification sign-off.

---

## Local Development & Testing

Requires **Node.js 22 LTS or 24 LTS**.

```bash
# Clone the repository
git clone https://github.com/iamaritrasaha/quanta.git
cd quanta

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Verification & Testing Suite

```bash
# Run unit tests (438 tests across 19 suites)
npm test

# Production build and TypeScript type check
npm run build

# Run Playwright browser integration suite
npm run test:browser
```

*(Note for Windows PowerShell users: use `npm.cmd` and `npx.cmd` if PowerShell script execution policies restrict `.ps1` files).*

Direct element links use hash routes, e.g. `#/element/hydrogen`, `#/element/carbon`, `#/element/gold`, `#/element/oganesson`.

---

## Project Structure

```text
src/
  App.tsx                      Observatory periodic table and instrument routing
  components/                  UI components, periodic table, inspector HUD
    observatory/               Observatory grid, search, HUD, and mobile cards
    science/                   Universal scientific instrument components
      UniversalOverview.tsx
      UniversalShellControls.tsx
      UniversalQuantumControls.tsx
      UniversalLevelDiagram.tsx
      UniversalSpectrumVisualizer.tsx
      UniversalEquationInspector.tsx
  data/                        Periodic table dataset, element profiles, NIST levels
    elementProfiles.ts         Curated scientific dossiers for all 118 elements
    elements.ts                IUPAC element properties & categories
    nistLevels.json            Bundled NIST ASD bound-level records
  physics/                     Physical formulas, Slater screening, dispersion
    orbitals.ts                Analytical wavefunctions, nodes & maxima, rejection sampling
    slater.ts                  Slater screening constant and Z_eff calculator
  rendering/                   Three.js canvas, electron orbits, photon packets
  state/                       Zustand state store and transition controllers
  styles.css                   Design system tokens, typography, glass UI
tests/browser/                 Playwright browser regression suite
docs/                          Scientific documentation, design specs, and audit reports
```

---

## Author

**Aritra Saha**  
Founder & Product Builder, Foresight Labs  
GitHub: [@iamaritrasaha](https://github.com/iamaritrasaha)

QUANTA is an original interactive scientific visualization project exploring atomic structure from historical Bohr models to modern quantum-mechanical probability descriptions.

---

## Copyright & License

Copyright © 2026 Aritra Saha. All rights reserved.

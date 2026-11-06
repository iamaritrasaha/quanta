# QUANTA V4: Universal Atomic Orbital Explorer UI/UX & Visual Specification

## 1. Design Overview

The Universal Atomic Orbital Explorer provides an intuitive, mathematically rigorous, and visually striking interface for exploring spatial wavefunctions across all 118 chemical elements. It elevates every element's quantum mode to match or exceed Hydrogen's visual and pedagogical standard.

---

## 2. Typography Standard

In accordance with QUANTA V4 typography specifications:

| Role | Font Family | Example Usages |
| :--- | :--- | :--- |
| **Primary Interface** | `Google Sans`, `Google Sans Text`, system-ui | Headings, family pills, tooltips, descriptions, occupancy notices |
| **Technical Readouts** | `JetBrains Mono`, monospace | Quantum numbers ($n, \ell$), $Z_{\text{eff}}$, electron counts, coordinates, peak radii |
| **Mathematical Formulas** | `KaTeX` font stack | Orbital equations $\psi_{n\ell m}$, spherical harmonics $Y_{\ell,\text{orient}}$, Laguerre notation |

---

## 3. Color Palette & Optical Glass Aesthetics

### 3.1 Wavefunction Phase & Density Colors

| Token | Hex Value | RGB | Role / Meaning |
| :--- | :--- | :--- | :--- |
| **Positive Phase ($\psi > 0$)** | `#38bdf8` | `(56, 189, 248)` | Optical Sky Blue. Algebraic positive sign of the wavefunction. |
| **Negative Phase ($\psi < 0$)** | `#fb923c` | `(251, 146, 60)` | Optical Coral Amber. Algebraic negative sign of the wavefunction. |
| **Low Density ($|\psi|^2 \to 0$)** | `#1e3a8a` | `(30, 58, 138)` | Deep indigo optical glass; nodal regions. |
| **High Density ($|\psi|^2 \to \text{max}$)** | `#f8fafc` | `(248, 250, 252)` | Glowing spectral white-blue peak amplitude. |
| **Radial Node Marker** | `#fb923c` | `(251, 146, 60)` | Amber dot marking roots of $R_{n\ell}(r) = 0$ along the radial axis. |
| **Peak Radius Line** | `#fbbf24` | `(251, 191, 36)` | Dashed gold vertical line marking $r_{\text{peak}} \approx n^2 / Z_{\text{eff}}$. |

> **Pedagogy Rule:** The phase colors are accompanied by an invariant explicit UI disclaimer:
> *"Phase colors represent opposite signs of the mathematical wavefunction $\psi(\mathbf{r})$, not positive and negative electrical charges. The electron carries a negative charge in all regions."*

### 3.2 Glass Container Styling

The instrument panel uses QUANTA's optical dark-mode glass language:
- **Background:** `rgba(255, 255, 255, 0.025)` with `backdrop-filter: blur(12px)`.
- **Border:** `1px solid rgba(255, 255, 255, 0.06)`.
- **Active State Highlights:** `rgba(56, 189, 248, 0.14)` border `rgba(56, 189, 248, 0.45)`.
- **Radius:** `var(--radius-sm)` (4px to 6px) for crisp laboratory instrumentation.

---

## 4. Interactive Control Structure

```
+-------------------------------------------------------------------------+
| [CARD KICKER] QUANTUM ORBITAL ENGINE      [PROVENANCE] TIER C (SLATER)  |
| Carbon Quantum Architecture (Z = 6)                                     |
+-------------------------------------------------------------------------+
| [DISPLAY MODE]  [ Individual Orbital (s/p/d/f) ] [ Total Shell Density ] |
+-------------------------------------------------------------------------+
| ORBITAL FAMILY (AZIMUTHAL QUANTUM NUMBER ℓ)                             |
| [ s (ℓ=0) ]  [ p (ℓ=1) *ACTIVE* ]  [ d (ℓ=2) ]  [ f (ℓ=3) ]              |
+-------------------------------------------------------------------------+
| PRINCIPAL QUANTUM SHELL (n)                  Allowed: n > ℓ (n ≥ 2)     |
| [ n=2 *ACTIVE* ] [ n=3 ] [ n=4 ] [ n=5 ] [ n=6 ] [ n=7 ]                |
+-------------------------------------------------------------------------+
| REAL BASIS ORIENTATION (3 STATES)                                       |
| [ p_z ]  [ p_x *ACTIVE* ]  [ p_y ]                                      |
+-------------------------------------------------------------------------+
| [OCCUPANCY BADGE] ● Ground-State Occupied: 2p contains 2 of 6 electrons |
+-------------------------------------------------------------------------+
| VIEW RENDERING MODE          CROSS-SECTION SLICE                        |
| [ Signed Phase ] [ Density ] [ 3D Vol ] [ XY *ACTIVE* ] [ XZ ] [ YZ ]   |
+-------------------------------------------------------------------------+
| [PHASE LEGEND]                                                          |
| ● ψ > 0 (Positive Phase)    ● ψ < 0 (Negative Phase)                    |
| Note: Colors denote algebraic sign of ψ, not electrical charge.         |
+-------------------------------------------------------------------------+
| [SVG RADIAL PROBABILITY DENSITY P(r) = r²|R(r)|²]                       |
|   ~ Curve with peak radius indicator and radial node markers ~          |
+-------------------------------------------------------------------------+
| [QUANTUM NUMBERS & NODES GRID]                                          |
| Radial Nodes: 0 | Angular Nodes: 1 | Total Nodes: 1 | Z_eff: +3.25      |
+-------------------------------------------------------------------------+
| [NODAL GEOMETRY DETAILS]                                                |
| 2p_x Symmetry: 1 planar node along yz-plane (x = 0).                     |
| Complex superposition: (Y₁₋₁ - Y₁₁) / √2                                |
+-------------------------------------------------------------------------+
| [ORBITAL WAVEFUNCTION FORMULATION]                                      |
| ψ_{2p}(r,θ,φ) = R_{2,1}(r; Z_eff) · Y_{p_x}(θ,φ)                        |
+-------------------------------------------------------------------------+
```

---

## 5. Cross-Section Slice Planes

To inspect internal nodal spheres and planar node intersections, users can slice through the 3D probability cloud along cardinal planes:

| Slice Option | Nodal Slice Filter Condition | Geometric Inspection Utility |
| :--- | :--- | :--- |
| **3D Vol** | No restriction; full 3D point cloud | Overall spatial envelope and multi-lobed orientation |
| **XY Slice** | $|z| < 0.25 a_0$ | Reveals equatorial planar nodes (e.g. $p_z = 0$, $d_{xy}$, $f_{xyz}$) |
| **XZ Slice** | $|y| < 0.25 a_0$ | Reveals vertical nodal planes ($p_y = 0$, $d_{yz}$) |
| **YZ Slice** | $|x| < 0.25 a_0$ | Reveals vertical nodal planes ($p_x = 0$, $d_{xz}$) |

---

## 6. Accessibility & Keyboard Navigation

1. **ARIA Roles & Labels:**
   - The quantum controls panel is labelled with `role="region"` and `aria-label="{element.name} Quantum Controls"`.
   - The SVG radial curve has `aria-label="Radial probability curve for n={n}, l={l}"`.
   - Orientation pills carry full accessible tooltips with formulas and nodal counts.
2. **Reduced Motion:**
   - When the user prefers reduced motion (`prefers-reduced-motion: reduce`), 3D precession rotation is suspended while full interactive mouse orbit controls remain available.
3. **Contrast:**
   - Both phase colors (`#38bdf8` and `#fb923c`) exceed WCAG AA contrast against the `#080a0f` optical graphite background.

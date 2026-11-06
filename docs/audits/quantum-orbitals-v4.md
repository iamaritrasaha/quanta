# QUANTA V4 — Forensic Audit of Quantum Orbital Rendering

**Audit Date:** November 2026  
**Auditor:** Senior Computational Physicist & Frontend Architect  
**Subject:** Atomic Orbital Visualizations, Wavefunctions, and Quantum Controls across all 118 Elements  

---

## 1. Executive Summary

A comprehensive forensic audit of QUANTA's quantum visualization layer (`src/physics/quantum.ts`, `src/rendering/QuantumCloud.tsx`, `src/rendering/MultiElementAtom.tsx`, `src/rendering/*QuantumCloud.tsx`, `src/components/QuantumControls.tsx`, `src/components/science/UniversalQuantumControls.tsx`) was conducted to evaluate the visual fidelity, mathematical rigor, and architectural completeness of atomic orbital representations.

The audit confirmed five critical structural defects that severely limit the educational depth and physical authenticity of QUANTA's quantum mode:
1. **DEF-Q01 — Isotropic Spherical Clouds in Carbon–Oganesson ($Z=6\text{–}118$):** Multi-element quantum mode generates 3D point swarms using a purely radial Gaussian distribution with random spherical angles, completely lacking subshell angular dependence ($s, p, d, f$). Users cannot inspect directional $p$ lobes, cloverleaf $d$ orbitals, or complex $f$ manifolds.
2. **DEF-Q02 — Severely Restricted Hydrogen Selector:** Despite Hydrogen serving as the visual benchmark, the UI restricts orbital selection exclusively to $1s$, $2s$, and $2p_z$. All states with $n \ge 3$ ($3s, 3p, 3d, 4s\dots 4f$) are blocked with an "unsupported quantum visualization" card, even though Hydrogen's exact analytical solutions are well-known.
3. **DEF-Q03 — Erroneous Lithium 4f to 3d Fallback Mapping:** In `src/physics/lithium.ts` (line 750) and `src/rendering/LithiumQuantumCloud.tsx` (line 71), selecting $4f$ states routes directly to a $3d$ density buffer using the angular function $3z^2 - r^2$, falsely presenting a $d$-orbital cloverleaf as an $f$-orbital.
4. **DEF-Q04 — Angular Fallback Substitutions in Helium, Beryllium, and Boron:** In `src/physics/boron.ts` (line 773), the $4f$ valence state explicitly reuses the $3d$ angular factor ($3z^2 - r^2$). In `HeliumQuantumCloud.tsx`, $1s3p$ is mapped to $1s2p$ and $1s3s$ to $1s2s$. In `BerylliumQuantumCloud.tsx`, higher excitations ($2s4s, 2s4d$) fall back to the ground state $2s^2$.
5. **DEF-Q05 — Lack of Phase, Node, and Cross-Section Disclosures:** No visualization in the codebase distinguishes between positive and negative wavefunction phases ($\psi > 0$ vs $\psi < 0$), nodal planes/cones are not highlighted or explained, and no radial probability plots $P(r) = r^2|R(r)|^2$ or cross-sectional views exist.

---

## 2. Detailed Component Audit Matrix

| Component | Scope | Existing Behavior | Confirmed Defect | Target V4 Standard |
| :--- | :--- | :--- | :--- | :--- |
| `src/rendering/MultiElementAtom.tsx` | Elements $Z=6\text{–}118$ | Computes `cloudPositions()` with $z = 2\text{rand}-1, \phi = 2\pi\text{rand}, \text{radius} = r(n) + \text{Gauss}$. | **DEF-Q01**: Zero angular modulation. All elements render isotropic spherical clouds regardless of subshell. | Connect to interactive orbital engine rendering genuine $s, p_x, p_y, p_z, d, f$ geometries with phase coloring. |
| `src/physics/quantum.ts` | Hydrogen ($Z=1$) | Contains density functions only for $1s, 2s, 2p_z, 3s, 3p_z, 3d_{z^2}$. No $p_x, p_y$, no $d_{xy}, d_{xz}, d_{yz}, d_{x^2-y^2}$, no $f$ orbitals. | **DEF-Q02**: Incomplete orbital basis and missing orientations. | General associated Laguerre radial generator $R_{n\ell}(r)$ and complete real spherical harmonic basis for all $\ell=0,1,2,3$. |
| `src/components/QuantumControls.tsx` | Hydrogen ($Z=1$) | `UI_ORBITALS = ['1s', '2s', '2p']`. For $n \ge 3$, displays "n = {level} quantum visualization is not enabled yet". | **DEF-Q02**: Blocks user exploration of higher hydrogenic shells. | Full selector for $n=1\text{–}6$ covering all subshells ($s, p, d, f$) and all standard real orientations. |
| `src/physics/lithium.ts` | Lithium ($Z=3$) | Line 750: `else if (configuration.includes('4d') \|\| configuration.includes('4f')) { const angular = 3*z*z - r2; ... }` | **DEF-Q03**: $4f$ mathematically evaluated using $d_{z^2}$ angular function! | Evaluate true $f$-orbital angular and radial functions for $4f$. |
| `src/rendering/LithiumQuantumCloud.tsx` | Lithium ($Z=3$) | Line 71: `if (levelId.includes('3d') \|\| levelId.includes('4d') \|\| levelId.includes('4f')) return '1s2_3d'` | **DEF-Q03**: $4f$ state mapped to $1s^2 3d$ buffer. | Fix mapping to compute and render true $4f$ density buffer. |
| `src/physics/boron.ts` | Boron ($Z=5$) | Line 773: `case '4f': { const angular = 3*z*z - r2; ... }` | **DEF-Q04**: $4f$ reuses $3d$ cloverleaf angular factor. | Implement genuine $f$-orbital angular modulation. |
| `src/rendering/HeliumQuantumCloud.tsx` | Helium ($Z=2$) | Lines 68–69: `1s3p` mapped to `1s2p`, `1s3s` mapped to `1s2s`. | **DEF-Q04**: Higher $n=3$ states reuse $n=2$ buffers without radial node structure. | Provide distinct $n=3$ radial profiles with correct radial nodes. |
| `src/components/science/UniversalQuantumControls.tsx` | Elements $Z=6\text{–}118$ | Displays Slater screening numbers and static subshell counts. No orbital selection controls. | **DEF-Q05**: Users cannot interact with individual subshells or orientations. | Interactive orbital selector, ground-state occupancy flags, phase legend, radial curve, and node statistics. |

---

## 3. Mathematical Analysis of Deficiencies

### 3.1 The Missing Angular Harmonic Functions
In central field theory, one-electron orbitals are expressed in spherical polar coordinates as:
$$\psi_{n\ell m}(r,\theta,\phi) = R_{n\ell}(r) Y_\ell^m(\theta,\phi)$$
To visualize stationary spatial distributions in real 3D space, quantum chemistry uses real combinations of complex spherical harmonics:
- **p-orbitals ($\ell=1$):**
  - $p_z \propto z/r$ (1 planar node: $z=0$)
  - $p_x \propto x/r$ (1 planar node: $x=0$)
  - $p_y \propto y/r$ (1 planar node: $y=0$)
- **d-orbitals ($\ell=2$):**
  - $d_{z^2} \propto (3z^2 - r^2) / r^2$ (2 conical nodes: $\cos\theta = \pm 1/\sqrt{3}$)
  - $d_{xz} \propto xz / r^2$ (2 planar nodes: $x=0, z=0$)
  - $d_{yz} \propto yz / r^2$ (2 planar nodes: $y=0, z=0$)
  - $d_{xy} \propto xy / r^2$ (2 planar nodes: $x=0, y=0$)
  - $d_{x^2-y^2} \propto (x^2 - y^2) / r^2$ (2 planar nodes: $x = \pm y$)
- **f-orbitals ($\ell=3$):** 7 linearly independent real functions:
  - $f_{z^3} \propto z(5z^2 - 3r^2) / r^3$
  - $f_{xz^2} \propto x(5z^2 - r^2) / r^3$
  - $f_{yz^2} \propto y(5z^2 - r^2) / r^3$
  - $f_{xyz} \propto xyz / r^3$
  - $f_{z(x^2-y^2)} \propto z(x^2 - y^2) / r^3$
  - $f_{x(x^2-3y^2)} \propto x(x^2 - 3y^2) / r^3$
  - $f_{y(3x^2-y^2)} \propto y(3x^2 - y^2) / r^3$

Currently, QUANTA possesses none of the $f$-orbital angular functions and only 1 of the 5 $d$-orbitals ($d_{z^2}$) and 1 of the 3 $p$-orbitals ($p_z$).

### 3.2 Wavefunction Phase vs Electrical Charge
In quantum mechanics, $\psi(\mathbf{r})$ is a signed scalar field. The lobes of $p, d, f$ orbitals have opposite algebraic signs:
$$\psi > 0 \quad \text{vs} \quad \psi < 0$$
These signs dictate chemical bonding, constructive/destructive interference, and spectroscopic transition dipole integrals:
$$\langle \psi_f | \mathbf{r} | \psi_i \rangle$$
QUANTA previously discarded the sign entirely by only computing $|\psi|^2$, and provided zero visual indication of phase. Furthermore, educational research shows students frequently confuse wavefunction phase colors with positive/negative electric charges. V4 must explicitly resolve this ambiguity with clear color legends.

---

## 4. Remediation Plan

1. **Develop `src/physics/orbitals.ts`:**
   - General associated Laguerre polynomial solver for analytical radial functions $R_{n\ell}(r; Z)$.
   - Complete 16-orientation real spherical harmonic algebra covering $s$, $p_x, p_y, p_z$, $d_{z^2}, d_{xz}, d_{yz}, d_{xy}, d_{x^2-y^2}$, and all 7 $f$-orbitals.
   - Slater effective nuclear charge integration $Z_{\text{eff}}$ for multi-electron atoms.
   - Phase-aware rejection sampling returning $(x, y, z, \text{phase})$ vertex buffers.
   - Node analysis: radial nodes ($n-\ell-1$), angular nodes ($\ell$).
   - Radial probability distribution curve $P(r) = r^2 |R(r)|^2$.
2. **Fix Dedicated Atoms:**
   - Repair $4f$ in `lithium.ts` and `LithiumQuantumCloud.tsx`.
   - Repair $4f$ in `boron.ts` and `BoronQuantumCloud.tsx`.
   - Update Helium density models.
3. **Build Universal 3D Orbital Cloud (`src/rendering/OrbitalCloud.tsx`):**
   - Two-tone phase visualization (cyan/blue for $\psi > 0$, amber/orange for $\psi < 0$).
   - Optional cross-section slicing (XY, XZ, YZ).
   - Integrate with `MultiElementAtom.tsx` so all 118 elements render genuine orbital lobes in Quantum mode.
   - Integrate with `QuantumCloud.tsx` for Hydrogen.
4. **Upgrade Quantum Controls (`UniversalQuantumControls.tsx` & `QuantumControls.tsx`):**
   - Interactive shell & subshell selector.
   - Ground-state occupancy indicator vs educational exploration.
   - Phase sign legend and node explanations.
   - Interactive radial probability plot.
5. **Comprehensive Automated Verification:**
   - Unit tests verifying normalization, node locations, symmetry, and phase boundaries.
   - Real browser visual regression suite capturing 3D orbital renders.

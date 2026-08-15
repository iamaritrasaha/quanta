# QUANTA Scientific Notes

## Hydrogen Scope (Z = 1)

QUANTA models ordinary Hydrogen (protium: $1\text{p}^+, 1\text{e}^-$). Binding energy levels follow the exact analytic SI relation:

$$E_n = -\frac{13.5984346}{n^2}\text{ eV}$$

Photon frequencies $\nu$ and wavelengths $\lambda$ are derived from discrete energy differences via $\Delta E = h\nu = \frac{hc}{\lambda}$, with numerical Rydberg relations serving as analytic cross-checks.

Spectral series are determined by the lower terminal state $n_f$:
- **Lyman Series** ($n_f = 1$): Vacuum Ultraviolet ($\lambda \approx 91.2 - 121.6\text{ nm}$)
- **Balmer Series** ($n_f = 2$): Visible spectrum ($\lambda \approx 364.6 - 656.5\text{ nm}$)
- **Paschen Series** ($n_f = 3$): Near Infrared ($\lambda \approx 820.4 - 1875.6\text{ nm}$)
- **Brackett & Pfund Series** ($n_f = 4, 5$): Mid/Far Infrared

---

## Helium Scope (Z = 2)

Helium represents QUANTA's first multi-electron atom and demonstrates the transition from an exactly solvable one-electron potential to an interacting many-body quantum system.

### 1. Default Isotope & Nuclear Architecture
- **Default Reference Isotope**: $^4\text{He}$ ($2\text{p}^+, 2\text{n}^0, 2\text{e}^-$).
- **Atomic Weight**: $\approx 4.002602\text{ u}$.
- **Nuclear Model**: Clustered 4-nucleon core consisting of two protons (warm-white optical accent) and two neutrons (cool silver accent) surrounded by a shared nuclear halo. The nuclear scale is visually magnified for pedagogical observation.

### 2. The Many-Body Problem & Non-Separability
In the infinite-nuclear-mass approximation, neutral Helium is governed by the two-electron Hamiltonian:

$$\hat{H} = -\frac{\hbar^2}{2m_e}\nabla_1^2 - \frac{\hbar^2}{2m_e}\nabla_2^2 - \frac{2e^2}{4\pi\varepsilon_0 r_1} - \frac{2e^2}{4\pi\varepsilon_0 r_2} + \frac{e^2}{4\pi\varepsilon_0 r_{12}}$$

The final term,

$$V_{ee} = \frac{e^2}{4\pi\varepsilon_0 r_{12}} = \frac{e^2}{4\pi\varepsilon_0 |\mathbf{r}_1 - \mathbf{r}_2|}$$

represents the mutual Coulomb repulsion between the two electrons. Because this term depends on the inter-electronic coordinate $r_{12}$, the Schrödinger equation **cannot be separated into two independent single-electron Hydrogen equations**. Neutral Helium energies do **not** follow $-13.6/n^2$ or $-13.6 Z^2/n^2$.

### 3. Six-Dimensional Wavefunction & Reduced Density
The true spatial wavefunction $\Psi(\mathbf{r}_1, \mathbf{r}_2)$ depends on six spatial coordinates $(x_1, y_1, z_1, x_2, y_2, z_2)$. It cannot be directly visualized as a single 3D object without projection.

QUANTA renders a **reduced one-electron probability density**:

$$\rho(\mathbf{r}) = 2 \int |\Psi(\mathbf{r}, \mathbf{r}_2)|^2 d^3\mathbf{r}_2$$

For 3D visualization, QUANTA utilizes an independent-particle screening model with variational effective nuclear charge $Z_{\text{eff}} = 2 - \frac{5}{16} = 1.6875$ for the $1\text{s}^2$ ground state:

$$\rho_{1\text{s}^2}(r) \propto e^{-2 Z_{\text{eff}} r}$$

This visual model is explicitly documented as a pedagogical approximation and is strictly decoupled from authoritative measured energy data.

### 4. Pauli Exclusion Principle & Spin Coupling
Under Fermi-Dirac statistics, the total electron wavefunction $\Psi(1, 2) = \psi_{\text{space}}(\mathbf{r}_1, \mathbf{r}_2) \chi_{\text{spin}}(s_1, s_2)$ must be antisymmetric under electron permutation:

$$\hat{P}_{12} \Psi(1, 2) = -\Psi(1, 2)$$

- **Ground State ($1\text{s}^2\ ^1\text{S}_0$)**:
  - Total spin $S = 0$ (Singlet).
  - Spatial wavefunction is symmetric: $\psi_{\text{space}}(\mathbf{r}_1, \mathbf{r}_2) = \phi_{1\text{s}}(\mathbf{r}_1)\phi_{1\text{s}}(\mathbf{r}_2)$.
  - Spin wavefunction is antisymmetric:
    $$\chi_{\text{singlet}} = \frac{|\uparrow\downarrow\rangle - |\downarrow\uparrow\rangle}{\sqrt{2}}$$
  - Quantum numbers: Electron 1 $(n=1, l=0, m_l=0, m_s=+1/2)$, Electron 2 $(n=1, l=0, m_l=0, m_s=-1/2)$.

- **Singlet vs. Triplet Structure ($S = 0$ vs. $S = 1$)**:
  - In excited configurations (e.g. $1\text{s}2\text{s}$), the spatial wavefunction can be symmetric (Singlet, $S=0$) or antisymmetric (Triplet, $S=1$).
  - In Triplet states ($S=1$), the antisymmetric spatial state vanishes as $\mathbf{r}_1 \to \mathbf{r}_2$ (exchange hole / Fermi hole). Electrons avoid each other, reducing Coulomb repulsion $V_{ee}$. Consequently, **triplet levels lie lower in energy than corresponding singlet levels** (e.g., $1\text{s}2\text{s}\ ^3\text{S}_1$ at $19.820\text{ eV}$ vs. $1\text{s}2\text{s}\ ^1\text{S}_0$ at $20.616\text{ eV}$).

### 5. Spectroscopy Architecture & Sign Conventions
- **Physical Level Ordering Invariant**: Every transition record explicitly maintains $E(\text{upper}) > E(\text{lower})$.
- **State Energy Difference vs. Photon Energy**:
  - State change: $\Delta E_{\text{state}} = E_{\text{final}} - E_{\text{initial}}$
  - **Absorption**: Atom excites from lower to upper state ($\Delta E_{\text{state}} > 0$). Photon energy is $E_\gamma = \Delta E_{\text{state}} > 0$.
  - **Emission**: Atom relaxes from upper to lower state ($\Delta E_{\text{state}} < 0$). Liberated photon energy is strictly positive: $E_\gamma = |\Delta E_{\text{state}}| = hc/\lambda > 0$.
- **Air vs. Vacuum Conventions**:
  - $\lambda < 200\text{ nm}$ (e.g. $58.4334\text{ nm}$): Reported in vacuum.
  - $\lambda \ge 200\text{ nm}$ (e.g. $587.561\text{ nm}$): Reported in standard dry air at $15^\circ\text{C}$ and $101.325\text{ kPa}$ ($n_{\text{air}} \approx 1.000277$).

### 6. Authoritative NIST ASD Energy Levels & Spectroscopy
All Helium numerical energy levels and spectral transitions are derived from the authoritative **NIST Atomic Spectra Database (ASD)** (Kramida et al., 2024):
- **Ground State Reference**: $0.0000\text{ cm}^{-1}$ ($0.0000\text{ eV}$)
- **Ionization Threshold**: $198,310.66637\text{ cm}^{-1}$ ($24.587389011\text{ eV}$)
- **Curated He I Transitions**:
  1. **$58.4334\text{ nm}$ (Resonance Singlet, Vacuum)**:
     - Emission: $1\text{s}2\text{p}\ ^1\text{P}^\circ_1 \to 1\text{s}^2\ ^1\text{S}_0$
     - Absorption: $1\text{s}^2\ ^1\text{S}_0 \to 1\text{s}2\text{p}\ ^1\text{P}^\circ_1$
     - $\Delta E \approx 21.218\text{ eV}$, non-visible extreme UV (false color).
  2. **$587.561\text{ nm}$ (Hero Triplet Yellow $D_3$ Multiplet, Air)**:
     - Emission: $1\text{s}3\text{d}\ ^3\text{D} \to 1\text{s}2\text{p}\ ^3\text{P}^\circ$ (the landmark 1868 solar eclipse line)
     - Absorption: $1\text{s}2\text{p}\ ^3\text{P}^\circ \to 1\text{s}3\text{d}\ ^3\text{D}$
     - $\Delta E \approx 2.110\text{ eV}$, approximate display color: yellow. Contains 5 fine-structure components.
  3. **$667.815\text{ nm}$ (Singlet Red, Air)**:
     - Emission: $1\text{s}3\text{d}\ ^1\text{D}_2 \to 1\text{s}2\text{p}\ ^1\text{P}^\circ_1$
     - Absorption: $1\text{s}2\text{p}\ ^1\text{P}^\circ_1 \to 1\text{s}3\text{d}\ ^1\text{D}_2$
     - $\Delta E \approx 1.856\text{ eV}$, approximate display color: red.
  4. **$706.519\text{ nm}$ (Deep Red Triplet Multiplet, Air)**:
     - Emission: $1\text{s}3\text{s}\ ^3\text{S}_1 \to 1\text{s}2\text{p}\ ^3\text{P}^\circ_J$
     - Absorption: $1\text{s}2\text{p}\ ^3\text{P}^\circ_J \to 1\text{s}3\text{s}\ ^3\text{S}_1$
     - $\Delta E \approx 1.754\text{ eV}$, approximate display color: deep red.
  5. **$501.568\text{ nm}$ (Cyan-Green Singlet, Air)**:
     - Emission: $1\text{s}3\text{p}\ ^1\text{P}^\circ_1 \to 1\text{s}2\text{s}\ ^1\text{S}_0$
     - Absorption: $1\text{s}2\text{s}\ ^1\text{S}_0 \to 1\text{s}3\text{p}\ ^1\text{P}^\circ_1$
     - $\Delta E \approx 2.471\text{ eV}$, approximate display color: cyan-green.
  6. **$388.865\text{ nm}$ (Violet Triplet Multiplet, Air)**:
     - Emission: $1\text{s}3\text{p}\ ^3\text{P}^\circ_J \to 1\text{s}2\text{s}\ ^3\text{S}_1$
     - Absorption: $1\text{s}2\text{s}\ ^3\text{S}_1 \to 1\text{s}3\text{p}\ ^3\text{P}^\circ_J$
     - $\Delta E \approx 3.187\text{ eV}$, approximate display color: violet. Upper level fine-structure: $J=2\ (185564.56\text{ cm}^{-1})$, $J=1\ (185564.58\text{ cm}^{-1})$, $J=0\ (185564.85\text{ cm}^{-1})$.
  7. **$1083.03\text{ nm}$ (Near-IR Triplet Multiplet, Air)**:
     - Emission: $1\text{s}2\text{p}\ ^3\text{P}^\circ_J \to 1\text{s}2\text{s}\ ^3\text{S}_1$
     - Absorption: $1\text{s}2\text{s}\ ^3\text{S}_1 \to 1\text{s}2\text{p}\ ^3\text{P}^\circ_J$
     - $\Delta E \approx 1.145\text{ eV}$, non-visible near-infrared (false color).

### 7. Singly-Ionized Helium ($\text{He}^+$)
Upon losing one electron ($\text{He I} \to \text{He II} + e^-$), the resulting $\text{He}^+$ ion is a hydrogenic one-electron ion with $Z = 2$, whose binding energies return to an exact Hydrogenic form: $E_n = -13.598 \cdot Z^2 / n^2 = -54.39 / n^2\text{ eV}$.

---

## Lithium Scope (Z = 3)

Lithium introduces a fundamental architectural milestone in QUANTA: the emergence of a **closed inner electron core** ($1\text{s}^2$) paired with a **single outer valence electron** ($2\text{s}^1$). Its chemistry, optical spectrum, and quantum characteristics are dominated by this core-valence separation.

### 1. Isotopic Composition & Standard Atomic Weight
- **Default Reference Isotope**: $^7\text{Li}$ ($3\text{p}^+, 4\text{n}^0, 3\text{e}^-$), chosen as the dominant natural isotope.
- **Normal-Material Isotopic-Composition Intervals [CIAAW]**:
  - $^7\text{Li}$: $[0.922, 0.981]$ ($92.2\text{–}98.1\%$)
  - $^6\text{Li}$: $[0.019, 0.078]$ ($1.9\text{–}7.8\%$)
  *(Commission on Isotopic Abundances and Atomic Weights; abundances vary across terrestrial materials and are not presented as a single universal point value).*
- **Standard Atomic Weight [CIAAW]**: Standard atomic-weight interval $[6.938, 6.997]$.
- **Ground Configuration**: $1\text{s}^2 2\text{s}$.
- **Ground Term Symbol**: $^2\text{S}_{1/2}$ (Doublet, $S = 1/2, L = 0, J = 1/2$).
- **First Ionization Potential**: $I_1 = 5.391714996(22)\text{ eV}$ ($5.391714996\text{ eV} \pm 0.000000022\text{ eV}$, corresponding to $43,487.11420\text{ cm}^{-1}$).
- **NIST ASD Reference Data & Provenance Nuance**:
  - The ionization limit ($5.391714996(22)\text{ eV} / 43,487.11420\text{ cm}^{-1}$) is sourced from high-precision NIST reference compilations (Kramida et al., 2024).
  - NIST explicitly notes that the primary Li I energy-level list compilation in ASD is based on an unpublished level list (prepared for Kelly 1987 classifications) and is **not critically evaluated by NIST**. QUANTA discloses this metadata while using the dataset as the reference standard.

### 2. The Three-Electron Hamiltonian & Non-Hydrogenic Nature
In the non-relativistic, clamped-nucleus approximation ($Z = 3$), neutral Lithium is described by:

$$\hat{H} = \sum_{i=1}^{3} \left( -\frac{\hbar^2}{2m_e}\nabla_i^2 - \frac{3e^2}{4\pi\varepsilon_0 r_i} \right) + \sum_{1 \le i < j \le 3} \frac{e^2}{4\pi\varepsilon_0 r_{ij}}$$

The interaction term contains **three electron-electron Coulomb pair repulsions**:

$$V_{ee} = \frac{e^2}{4\pi\varepsilon_0} \left( \frac{1}{r_{12}} + \frac{1}{r_{13}} + \frac{1}{r_{23}} \right)$$

Because of these cross-terms, neutral Lithium cannot be solved analytically and does not follow hydrogenic $E_n = -13.598 Z^2/n^2$ scaling.

### 3. Core Screening, Penetration & Quantum Defect Theory
The two inner $1\text{s}$ electrons form a compact, spherically symmetric Helium-like electron core ($1\text{s}^2$) with binding energy far higher than the outer electron ($\sim 60\text{ eV}$). The valence electron moves in an effective central field:

$$V_{\text{eff}}(r) = -\frac{Z_{\text{eff}}(r) e^2}{4\pi\varepsilon_0 r}$$

- **Asymptotic Limits**:
  - $r \to 0$ (valence electron penetrates the core): $Z_{\text{eff}}(r) \to 3$.
  - $r \to \infty$ (valence electron far outside the core): $Z_{\text{eff}}(r) \to 3 - 2 = 1$.

This radial dependence lifts the orbital angular momentum ($l$) degeneracy of the Hydrogenic shell. Energy eigenvalues are parameterized using the Rydberg constant ($R_\infty = 109,737.31568\text{ cm}^{-1}$ or mass-adjusted $R_{^7\text{Li}} = 109,728.718\text{ cm}^{-1}$) and the **derived quantum defect** $\delta_l$:

$$n^* = \sqrt{\frac{R_M}{T_\infty - T_n}},\quad \delta_l = n - n^*$$

where $T_\infty = 43,487.11420\text{ cm}^{-1}$ is the ionization limit and $T_n < T_\infty$ is the excitation wavenumber of the state.

- **$s$ Orbitals ($l = 0$)**: Have non-zero probability at the nucleus, penetrating deeply through the $1\text{s}^2$ core to experience the full $Z=3$ nuclear charge. They have the largest quantum defect ($\delta_s \approx 0.41$) and are bound most strongly ($E(2\text{s}) = 0\text{ eV}$, $E(3\text{s}) = 3.373\text{ eV}$).
- **$p$ Orbitals ($l = 1$)**: Partially penetrate the core ($\delta_p \approx 0.04 - 0.05$).
- **$d$ and $f$ Orbitals ($l \ge 2$)**: The centrifugal barrier $\frac{l(l+1)\hbar^2}{2m_e r^2}$ prevents the valence electron from entering the $1\text{s}^2$ core ($r > 2\text{ a.u.}$). Consequently, $Z_{\text{eff}} \approx 1$, $\delta_d \approx 0.00$, and levels approach ideal Hydrogenic eigenvalues ($E(3\text{d}) \approx 3.879\text{ eV}$).

### 4. Spectroscopy & Reference vs. Derived Wavelength Architecture
Lithium transitions obey electric dipole selection rules ($\Delta l = \pm 1, \Delta J = 0, \pm 1$). QUANTA maintains a clear separation between **reference persistent line table values** ($\lambda_{\text{air}}$) and **level-derived values** ($\lambda_{\text{vac}} = 10^7 / \Delta\tilde{\nu}$, converted to air via standard Peck & Reeder dispersion):

1. **$670.8\text{ nm}$ Resonance Doublet (Approximate Display Color: Deep Red, Air)**:
   - Transition: $2\text{s}\ ^2\text{S}_{1/2} \leftrightarrow 2\text{p}\ ^2\text{P}^\circ_{1/2, 3/2}$
   - $D_2$ Line ($2\text{s}\ ^2\text{S}_{1/2} \leftrightarrow 2\text{p}\ ^2\text{P}^\circ_{3/2}$): Reference $\lambda_{\text{air}} = 670.7775\text{ nm}$ ($14,904.00\text{ cm}^{-1}$, $1.84786\text{ eV}$)
   - $D_1$ Line ($2\text{s}\ ^2\text{S}_{1/2} \leftrightarrow 2\text{p}\ ^2\text{P}^\circ_{1/2}$): Reference $\lambda_{\text{air}} = 670.7926\text{ nm}$ ($14,903.66\text{ cm}^{-1}$, $1.84782\text{ eV}$)
   - Fine-structure splitting: $\Delta\tilde{\nu} \approx 0.34\text{ cm}^{-1}$ ($\Delta\lambda \approx 0.015\text{ nm}$).
   - The prominent red color of Lithium flame tests and astronomical stellar spectra.
2. **$610.4\text{ nm}$ Diffuse Line (Approximate Display Color: Orange-Red, Air)**:
   - Transition: $2\text{p}\ ^2\text{P}^\circ \leftrightarrow 3\text{d}\ ^2\text{D}$
   - Components: $2\text{p}\ ^2\text{P}^\circ_{3/2} \leftrightarrow 3\text{d}\ ^2\text{D}_{5/2}$ ($\lambda_{\text{air}} = 610.3654\text{ nm}$), $2\text{p}\ ^2\text{P}^\circ_{1/2} \leftrightarrow 3\text{d}\ ^2\text{D}_{3/2}$ ($\lambda_{\text{air}} = 610.3542\text{ nm}$).
3. **$812.6\text{ nm}$ Sharp Line (False Color: Non-Visible Near-IR, Air)**:
   - Transition: $2\text{p}\ ^2\text{P}^\circ \leftrightarrow 3\text{s}\ ^2\text{S}_{1/2}$
   - Components: $2\text{p}\ ^2\text{P}^\circ_{3/2} \leftrightarrow 3\text{s}\ ^2\text{S}_{1/2}$ ($\lambda_{\text{air}} = 812.6453\text{ nm}$), $2\text{p}\ ^2\text{P}^\circ_{1/2} \leftrightarrow 3\text{s}\ ^2\text{S}_{1/2}$ ($\lambda_{\text{air}} = 812.6232\text{ nm}$).
4. **$460.3\text{ nm}$ Blue Diffuse Line (Approximate Display Color: Cyan-Blue, Air)**:
   - Transition: $2\text{p}\ ^2\text{P}^\circ \leftrightarrow 4\text{d}\ ^2\text{D}$
   - Components: $2\text{p}\ ^2\text{P}^\circ_{3/2} \leftrightarrow 4\text{d}\ ^2\text{D}_{5/2}$ ($\lambda_{\text{air}} = 460.2898\text{ nm}$), $2\text{p}\ ^2\text{P}^\circ_{1/2} \leftrightarrow 4\text{d}\ ^2\text{D}_{3/2}$ ($\lambda_{\text{air}} = 460.2831\text{ nm}$).

### 5. Reduced One-Electron Probability Density & Visual Parameter Origin
The full spatial wavefunction $\Psi(\mathbf{r}_1, \mathbf{r}_2, \mathbf{r}_3)$ spans 9 spatial dimensions. QUANTA renders the reduced one-electron density:

$$\rho(\mathbf{r}) = 3 \int |\Psi(\mathbf{r}, \mathbf{r}_2, \mathbf{r}_3)|^2 d^3\mathbf{r}_2 d^3\mathbf{r}_3 \approx 2\rho_{1\text{s}}(\mathbf{r}; Z_{\text{core}}) + \rho_{\text{valence}}(\mathbf{r}; Z_{\text{val}})$$

- **Origin of $Z_{\text{core}} = 2.6875$**: For a $1\text{s}^2$ Helium-like core around a $Z=3$ nucleus, first-order variational / Slater-like screening yields $Z_{\text{eff}} = Z - 5/16 = 3 - 0.3125 = 2.6875$.
- **Status**: Designated explicitly as a **Visual Model Parameter / Approximate Effective Charge** used strictly for 3D density sampling. It is completely decoupled from authoritative NIST energy eigenvalues and spectroscopic calculations.

---

## Pedagogical Models & Visual Disclaimers

- **Shell Occupancy Model**: Pedagogical representation illustrating discrete shell occupancies ($K, L, M, N$). Electron markers and their classical orbits are illustrative; multi-electron atoms possess no fixed classical trajectories.
- **Quantum Mechanics View**: Displays one-electron reduced probability density $\rho(r)$ without point particles.
- **Photon Wave Packets**: Compact wave packet representations illustrating energy exchange; spatial wavelength is compressed for simultaneous atom-photon observation.
- **Nuclear Scale**: Nuclear dimensions are magnified non-linearly to enable visual inspection of nucleon clusters ($^1\text{H}$, $^4\text{He}$, $^7\text{Li}$).

---

© 2026 Aritra Saha. All rights reserved.

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

## Pedagogical Models & Visual Disclaimers

- **Shell Occupancy Model**: Pedagogical representation illustrating discrete shell occupancies ($K, L, M$). Electron markers and their classical orbits are illustrative; neutral Helium possesses no fixed classical trajectories.
- **Quantum Mechanics View**: Displays one-electron reduced probability density $\rho(r)$ without point particles.
- **Photon Wave Packets**: Compact wave packet representations illustrating energy exchange; spatial wavelength is compressed for simultaneous atom-photon observation.
- **Nuclear Scale**: Nuclear dimensions are magnified non-linearly to enable visual inspection of the compact nucleon core.

---

© 2026 Aritra Saha. All rights reserved.

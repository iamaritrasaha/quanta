# Reference Data — QUANTA V4

QUANTA bundles all physical, spectroscopic, and periodic reference values locally. These snapshots and analytical models are used across the Observatory and all 118 atomic instruments without triggering network requests in the application.

---

## 1. PubChem Periodic Table Snapshot

- **Source:** [PubChem PUG REST Periodic Table](https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON)
- **Retrieved:** 2026-10-17
- **Coverage:** 118 elements ($Z=1\text{ to }118$)
- **Bundled fields:** Source atomic mass, ground electron configuration, electronegativity (Pauling scale), atomic radius (empirical/calculated pm), first ionization energy (eV), electron affinity (eV), oxidation states, standard thermodynamic state, melting point (K), boiling point (K), density ($\text{g/cm}^3$), and discovery year. Blank source values are retained as blank or marked unmeasured.
- **Physical units:**
  - Atomic mass: unified atomic mass units ($\text{u}$ or $\text{Da}$)
  - Atomic radius: picometers ($\text{pm}$)
  - Ionization energy and electron affinity: electronvolts ($\text{eV}$)
  - Melting and boiling points: Kelvin ($\text{K}$)
  - Density: grams per cubic centimeter ($\text{g/cm}^3$) at STP (or solid/liquid phase where specified)
  - Electronegativity: dimensionless Pauling scale

### Integrity & Curated Corrections
- The reference includes theoretical estimates for synthetic superheavy elements. Source entries described as expected phases are explicitly labeled as **predicted** in the instruments; they are never treated as measured physical constants.
- **Lawrencium ($Z=103$) Configuration:** The raw PubChem snapshot historically contained an older $6d$ assignment ($[\text{Rn}]\,5f^{14}\,6d\,7s^2$). This is replaced at lookup with $[\text{Rn}]\,5f^{14}\,7s^2\,7p^1$, matching the [NIST ASD Lr I ground configuration](https://physics.nist.gov/cgi-bin/ASD/energy1.pl?spectrum=Lr+I) rechecked in October 2026. This correction is cited in the Lawrencium instrument.
- **Principal-shell totals:** Parsed deterministically from the inert-gas core and subshell occupancies. All 118 configurations strictly conserve the atomic number $Z$:
  $$\sum_{n=1}^7 N_n = Z$$

---

## 2. NIST Atomic Spectra Database (ASD) Snapshot

- **Source:** [NIST Atomic Spectra Database](https://physics.nist.gov/asd), [DOI: 10.18434/T4W30F](https://doi.org/10.18434/T4W30F)
- **Retrieved:** 2026-10-17
- **Species queried:** Neutral atoms from C I through Og I ($Z=6\text{ to }118$)
- **Bundled records:** Up to the first 20 numeric-energy records per neutral species, with duplicates eliminated. Energies are stored in wavenumbers ($\text{cm}^{-1}$) relative to the ground state ($E_0 = 0.000\text{ cm}^{-1}$). Non-numeric/bracketed estimates are preserved or omitted; ionization limits are isolated.
- **Coverage breakdown:**
  - **84 elements:** 20 verified empirical bound levels.
  - **1 element:** 3 verified empirical bound levels.
  - **18 elements:** Exactly 1 bound level (ground state only, primarily transuranic actinides and early transactinides).
  - **10 elements ($Z=109\text{–}118$):** 0 neutral bound levels in NIST ASD. Classified as **Tier D (Predicted / Superheavy)**.

### Derived Transition Wavelengths
For any pair of reference levels with energy separation $\Delta\tilde{\nu} = |\tilde{\nu}_{\text{upper}} - \tilde{\nu}_{\text{lower}}| > 0\text{ cm}^{-1}$, the vacuum wavelength is derived via:
$$\lambda_{\text{vac}}\text{ (nm)} = \frac{10^7}{\Delta\tilde{\nu}\text{ (cm}^{-1})}$$
The photon energy is calculated as:
$$\Delta E\text{ (eV)} = \Delta\tilde{\nu}\text{ (cm}^{-1}) \times 1.239841984\times 10^{-4}\text{ eV/cm}^{-1}$$

No transitions between arbitrary NIST level pairs are asserted to be dipole-allowed, observed lines, or unit-probability transitions unless matched to documented landmark lines.

---

## 3. Atmospheric Dispersion & Wavelengths in Standard Air

For transitions in the optical and infrared regimes ($\lambda_{\text{vac}} \ge 200\text{ nm}$), QUANTA computes the air wavelength $\lambda_{\text{air}}$ using the standard **Edlén (1953/1966) dispersion formula** for dry air at $15^\circ\text{C}$, $101.325\text{ kPa}$ (1 atm), and $450\text{ ppm CO}_2$:

$$(n - 1) \times 10^8 = 8342.54 + \frac{2406147}{130 - \sigma^2} + \frac{15998}{38.9 - \sigma^2}$$

where $\sigma = 1 / \lambda_{\text{vac}} = \Delta\tilde{\nu} / 10^7$ with $\lambda_{\text{vac}}$ in micrometers ($\mu\text{m}$). The wavelength in air is:
$$\lambda_{\text{air}} = \frac{\lambda_{\text{vac}}}{n_{\text{air}}(\lambda_{\text{vac}})}$$

- **Vacuum Ultraviolet ($\lambda < 200\text{ nm}$):** Atmospheric air strongly absorbs via the Schumann-Runge bands of molecular oxygen ($O_2$). In this regime, transitions are explicitly designated as **Vacuum UV** and displayed as $\lambda_{\text{vac}}$.
- **Optical / Near IR ($\lambda \ge 200\text{ nm}$):** Labeled with both vacuum and air wavelengths $\lambda_{\text{air}}$ for direct laboratory spectrograph comparison.

---

## 4. Slater's Rules & Effective Nuclear Charge Engine

To provide quantitative screening insights for all many-electron atoms without fabricating fictitious single-particle potentials, QUANTA implements Slater's classic screening rules (`src/physics/slater.ts`):

### Electron Grouping Hierarchy
Electrons are grouped into atomic screening shells ordered by principal and azimuthal quantum numbers:
$$(1s),\ (2s, 2p),\ (3s, 3p),\ (3d),\ (4s, 4p),\ (4d),\ (4f),\ (5s, 5p),\ \dots$$

### Screening Constants $\sigma$
1. **Electrons in higher groups** contribute $0.00$ to the screening constant.
2. **For an electron in an $(ns, np)$ group:**
   - Other electrons in the same $(ns, np)$ group: $0.35$ each (or $0.30$ if $1s$).
   - Electrons in the $(n-1)$ shell (all $s, p, d, f$): $0.85$ each.
   - Electrons in the $(n-2)$ or deeper shells: $1.00$ each.
3. **For an electron in an $(nd)$ or $(nf)$ group:**
   - Other electrons in the same $(nd)$ or $(nf)$ group: $0.35$ each.
   - All electrons in underlying groups (closer to the nucleus or lower in the sequence): $1.00$ each.

### Effective Nuclear Charge & Orbital Energy
The effective nuclear charge experienced by a valence electron is:
$$Z_{\text{eff}} = Z - \sigma$$

The estimated single-electron binding energy is calculated using Slater's effective principal quantum number $n^*$:
$$E_n \approx -13.6057\text{ eV} \times \left(\frac{Z_{\text{eff}}}{n^*}\right)^2$$
where $n^*$ scales for higher shells:
- $n = 1 \implies n^* = 1.0$
- $n = 2 \implies n^* = 2.0$
- $n = 3 \implies n^* = 3.0$
- $n = 4 \implies n^* = 3.7$
- $n = 5 \implies n^* = 4.0$
- $n = 6 \implies n^* = 4.2$
- $n = 7 \implies n^* = 4.4$

---

## 5. Curated Element Profiles Database

`src/data/elementProfiles.ts` contains curated, peer-reviewed scientific records for all 118 chemical elements:
- **Historical Discovery & Context:** Discovery date, discoverers, isolation methodology, etymology, and biological/geological role.
- **Physical Identity Narrative:** Concise physical overview detailing standard state, allotropes, bonding tendencies, and macroscopic color/luster.
- **Distinctive Scientific Behavior Box:** High-contrast pedagogical callout highlighting the unique physical or chemical anomaly of the element (e.g. Copper and Chromium aufbau subshell anomalies, Gold and Mercury relativistic $s$-orbital contraction, Lanthanoid and Actinoid contractions, Superheavy spin-orbit $j\text{-}j$ coupling).
- **Spectroscopic Ground Term:** Russell-Saunders term symbol $^{2S+1}L_J$ (e.g. Carbon $^3P_0$, Iron $^5D_4$, Gold $^2S_{1/2}$, Oganesson $^1S_0$).
- **Valence Subshell Configuration:** Explicit valence subshell string (e.g. $3d^6 4s^2$ for Fe).
- **Landmark Spectral Transitions:** Primary resonance or characteristic emission/absorption lines with air/vac wavelengths, upper/lower state terms, and citations to NIST ASD or CRC Handbook of Chemistry & Physics.
- **Model Tier:** Rigorous assignment across Tier A, Tier B, Tier C, and Tier D.

---

## 6. Scientific Model Tier Framework

To maintain scientific integrity, QUANTA never masquerades approximate or schematic models as exact solutions:

| Tier | Category | Scope | Quantum Model Description |
| :--- | :--- | :--- | :--- |
| **Tier A** | Analytical Hydrogenic | $\text{H}$ ($Z=1$) | Exact analytical wavefunctions $\psi_{n\ell m}(r,\theta,\phi)$ with Laguerre polynomials and spherical harmonics. Analytical energy eigenvalues $E_n = -13.6\text{ eV}/n^2$. |
| **Tier B** | Approximate Many-Electron | $\text{He}\text{–}\text{B}$ ($Z=2\text{–}5$) | Multi-electron configurations with Hartree-Fock/effective-charge screening approximations, singlet/triplet fine structure, and reduced orbital densities. |
| **Tier C** | Empirical / Slater Radial | $\text{C}\text{–}\text{Hs}$ ($Z=6\text{–}108$) | Empirical NIST ASD level ladders, calculated Slater screening $Z_{\text{eff}}$, and pedagogical radial occupancy clouds with core vs. valence differentiation. |
| **Tier D** | Theoretical / Superheavy | $\text{Mt}\text{–}\text{Og}$ ($Z=109\text{–}118$) | Relativistic Dirac-Fock predictions, relativistic spin-orbit subshell splittings ($7p_{1/2}\text{–}7p_{3/2}$), closed-shell stability calculations. No fabricated optical spectra. |

---

## 7. Refreshing & Maintaining Reference Data

When updating or extending reference snapshots:
1. Always preserve the original source attribution, retrieval timestamp, and citation link.
2. Keep raw empirical observations clearly distinguished from derived or modeled values.
3. Verify that every parsed electron configuration strictly conserves electron count ($\sum N_e = Z$).
4. Never replace missing empirical data with fabricated or assumed transition values. Elements lacking measured spectra must remain honestly labeled as Tier D or unmeasured.

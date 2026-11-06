# QUANTA V4 — Quantum Atomic Orbital Mathematical Formulations & Models

## 1. Central-Field Wavefunction Factorization

In non-relativistic quantum mechanics, the time-independent Schrödinger equation for a single electron moving in a spherically symmetric central potential $V(r)$ is given by:

$$\left[ -\frac{\hbar^2}{2m_e}\nabla^2 + V(r) \right] \psi(\mathbf{r}) = E \psi(\mathbf{r})$$

Using spherical coordinates $(r, \theta, \phi)$, the spatial wavefunction exactly factorizes into radial and angular parts:

$$\psi_{n\ell m}(r, \theta, \phi) = R_{n\ell}(r) \, Y_\ell^m(\theta, \phi)$$

where:
- $n \in \{1, 2, 3, \dots\}$ is the principal quantum number.
- $\ell \in \{0, 1, \dots, n-1\}$ is the orbital angular momentum (azimuthal) quantum number, corresponding to subshell spectroscopic designations:
  - $\ell = 0 \implies \mathbf{s}$ (sharp, 1 orbital)
  - $\ell = 1 \implies \mathbf{p}$ (principal, 3 orbitals)
  - $\ell = 2 \implies \mathbf{d}$ (diffuse, 5 orbitals)
  - $\ell = 3 \implies \mathbf{f}$ (fundamental, 7 orbitals)
- $m \in \{-\ell, -\ell+1, \dots, \ell\}$ is the magnetic quantum number.

---

## 2. Real Spherical Harmonics Basis (16 Orientations)

While the complex spherical harmonics $Y_\ell^m(\theta, \phi)$ are simultaneous eigenfunctions of $\hat{\mathbf{L}}^2$ and $\hat{L}_z$, chemistry and atomic visualization conventionally employ the **real spherical harmonics** $S_{\ell m}(\theta, \phi)$. These real orbitals orient directly along Cartesian axes and reflect the directional bonding geometry of molecules and solid-state materials.

### 2.1 Relation to Complex Spherical Harmonics

For $m \neq 0$, the real orbitals are orthogonal linear superpositions:

$$S_{\ell 0} = Y_\ell^0$$

$$S_{\ell m+} = \frac{1}{\sqrt{2}} \left( Y_\ell^{-|m|} + (-1)^m Y_\ell^{|m|} \right) \propto \cos(|m|\phi)$$

$$S_{\ell m-} = \frac{i}{\sqrt{2}} \left( Y_\ell^{-|m|} - (-1)^m Y_\ell^{|m|} \right) \propto \sin(|m|\phi)$$

> **Critical Pedagogical Note:** Real orbitals such as $p_x$, $p_y$, $d_{xy}$, and $f_{xyz}$ are **not** eigenfunctions of the $\hat{L}_z$ operator. They do not possess a unique magnetic quantum number $m$, but rather represent superpositions with $\langle L_z \rangle = 0$.

### 2.2 Algebraic Cartesian Implementations in QUANTA

To avoid coordinate singularities at the poles and coordinate origin, QUANTA evaluates real spherical harmonics algebraically using normalized Cartesian direction cosines:

$$u_x = \frac{x}{r}, \quad u_y = \frac{y}{r}, \quad u_z = \frac{z}{r}, \quad \text{where } r = \sqrt{x^2 + y^2 + z^2}$$

#### s-Orbital ($\ell = 0$, 1 Orientation)
- **s**:
  $$Y_{00} = \frac{1}{\sqrt{4\pi}} \approx 0.282095$$
  - Spherically symmetric. 0 angular nodes.

#### p-Orbitals ($\ell = 1$, 3 Orientations)
- **$p_z$**:
  $$Y_{p_z} = \sqrt{\frac{3}{4\pi}} \, u_z = \sqrt{\frac{3}{4\pi}} \cos\theta$$
  - 1 planar node: $xy$-plane ($z = 0$). Complex eigenstate $m = 0$.
- **$p_x$**:
  $$Y_{p_x} = \sqrt{\frac{3}{4\pi}} \, u_x = \sqrt{\frac{3}{4\pi}} \sin\theta \cos\phi$$
  - 1 planar node: $yz$-plane ($x = 0$). Linear superposition of $m = \pm 1$.
- **$p_y$**:
  $$Y_{p_y} = \sqrt{\frac{3}{4\pi}} \, u_y = \sqrt{\frac{3}{4\pi}} \sin\theta \sin\phi$$
  - 1 planar node: $xz$-plane ($y = 0$). Linear superposition of $m = \pm 1$.

#### d-Orbitals ($\ell = 2$, 5 Orientations)
- **$d_{z^2}$**:
  $$Y_{d_{z^2}} = \frac{1}{2}\sqrt{\frac{5}{4\pi}} (3u_z^2 - 1) = \frac{1}{2}\sqrt{\frac{5}{4\pi}} (3\cos^2\theta - 1)$$
  - 2 conical nodal surfaces at $\cos\theta = \pm \frac{1}{\sqrt{3}} \implies \theta \approx 54.74^\circ, 125.26^\circ$. Complex eigenstate $m = 0$.
- **$d_{xz}$**:
  $$Y_{d_{xz}} = \sqrt{\frac{15}{4\pi}} \, u_x u_z$$
  - 2 planar nodes: $x = 0$ ($yz$-plane) and $z = 0$ ($xy$-plane).
- **$d_{yz}$**:
  $$Y_{d_{yz}} = \sqrt{\frac{15}{4\pi}} \, u_y u_z$$
  - 2 planar nodes: $y = 0$ ($xz$-plane) and $z = 0$ ($xy$-plane).
- **$d_{xy}$**:
  $$Y_{d_{xy}} = \sqrt{\frac{15}{4\pi}} \, u_x u_y$$
  - 2 planar nodes: $x = 0$ ($yz$-plane) and $y = 0$ ($xz$-plane).
- **$d_{x^2-y^2}$**:
  $$Y_{d_{x^2-y^2}} = \frac{1}{2}\sqrt{\frac{15}{4\pi}} (u_x^2 - u_y^2)$$
  - 2 planar nodes bisecting the $x$ and $y$ axes at $45^\circ$: $x = y$ and $x = -y$.

#### f-Orbitals ($\ell = 3$, 7 Orientations)
- **$f_{z^3}$**:
  $$Y_{f_{z^3}} = \frac{1}{2}\sqrt{\frac{7}{4\pi}} \, u_z (5u_z^2 - 3)$$
  - 3 angular nodes: equatorial plane $z = 0$ and two cones at $\cos\theta = \pm \sqrt{3/5} \implies \theta \approx 39.23^\circ, 140.77^\circ$. Complex eigenstate $m = 0$.
- **$f_{xz^2}$**:
  $$Y_{f_{xz^2}} = \frac{1}{4}\sqrt{\frac{42}{4\pi}} \, u_x (5u_z^2 - 1)$$
  - 3 angular nodes: planar node $x = 0$ and two cones at $5z^2 = r^2$.
- **$f_{yz^2}$**:
  $$Y_{f_{yz^2}} = \frac{1}{4}\sqrt{\frac{42}{4\pi}} \, u_y (5u_z^2 - 1)$$
  - 3 angular nodes: planar node $y = 0$ and two cones at $5z^2 = r^2$.
- **$f_{xyz}$**:
  $$Y_{f_{xyz}} = \sqrt{\frac{105}{4\pi}} \, u_x u_y u_z$$
  - 3 planar nodes: $x = 0$, $y = 0$, $z = 0$, dividing space into 8 alternating-sign octants.
- **$f_{z(x^2-y^2)}$**:
  $$Y_{f_{z(x^2-y^2)}} = \frac{1}{2}\sqrt{\frac{105}{4\pi}} \, u_z (u_x^2 - u_y^2)$$
  - 3 planar nodes: $z = 0$, $x = y$, $x = -y$.
- **$f_{x(x^2-3y^2)}$**:
  $$Y_{f_{x(x^2-3y^2)}} = \frac{1}{4}\sqrt{\frac{70}{4\pi}} \, u_x (u_x^2 - 3u_y^2) = \frac{1}{4}\sqrt{\frac{70}{4\pi}} \sin^3\theta \cos(3\phi)$$
  - 3 vertical planar nodes at $\phi = 30^\circ, 90^\circ, 150^\circ$, forming 6 clover-like lobes in the $xy$-plane.
- **$f_{y(3x^2-y^2)}$**:
  $$Y_{f_{y(3x^2-y^2)}} = \frac{1}{4}\sqrt{\frac{70}{4\pi}} \, u_y (3u_x^2 - u_y^2) = \frac{1}{4}\sqrt{\frac{70}{4\pi}} \sin^3\theta \sin(3\phi)$$
  - 3 vertical planar nodes at $\phi = 0^\circ, 60^\circ, 120^\circ$.

---

## 3. Radial Wavefunction Formulation

### 3.1 Exact Hydrogenic Radial Solution

For hydrogen and hydrogenic single-electron ions ($Z_{\text{eff}} = Z$), the exact radial wavefunction in atomic units ($r$ in Bohr radii $a_0$) is:

$$R_{n\ell}(r) = N_{n\ell} \, e^{-\rho / 2} \, \rho^\ell \, L_{n-\ell-1}^{2\ell+1}(\rho)$$

where:
$$\rho = \frac{2 Z_{\text{eff}} r}{n a_0}$$

The normalization constant $N_{n\ell}$ is:

$$N_{n\ell} = \sqrt{\left(\frac{2 Z_{\text{eff}}}{n a_0}\right)^3 \frac{(n - \ell - 1)!}{2n [(n + \ell)!]}}$$

To prevent numerical overflow or underflow in calculating large factorials (e.g. for $n = 6, \ell = 3$), QUANTA evaluates $N_{n\ell}$ in log-space:

$$\ln N_{n\ell} = \frac{3}{2}\ln\left(\frac{2 Z_{\text{eff}}}{n}\right) + \frac{1}{2}\left[\ln((n-\ell-1)!) - \ln(2n) - \ln((n+\ell)!)\right]$$

### 3.2 Associated Laguerre Polynomial Evaluation

The generalized Laguerre polynomial $L_k^\alpha(x)$ with degree $k = n - \ell - 1$ and parameter $\alpha = 2\ell + 1$ is computed using the numerically stable 3-term recurrence relation:

$$L_0^\alpha(x) = 1$$
$$L_1^\alpha(x) = 1 + \alpha - x$$
$$(j + 1) L_{j+1}^\alpha(x) = (2j + 1 + \alpha - x) L_j^\alpha(x) - (j + \alpha) L_{j-1}^\alpha(x)$$

### 3.3 Radial Nodes and Exact Probability Maxima

The total number of nodal surfaces is $n - 1$:
- **Radial nodes:** $k = n - \ell - 1$ (spherical shells where $R_{n\ell}(r) = 0$).
- **Angular nodes:** $\ell$ (planes or cones where $Y_{\ell,\text{orient}}(\theta, \phi) = 0$).
- **Total nodes:** $(n - \ell - 1) + \ell = n - 1$.

The radial probability distribution $P(r)$ defines the probability of finding the electron in a spherical shell between $r$ and $r + dr$:

$$P(r) = r^2 |R_{n\ell}(r)|^2$$

Normalized such that:

$$\int_0^\infty P(r) \, dr = 1$$

While circular states ($\ell = n - 1$, e.g. $1s, 2p, 3d, 4f$) have a single maximum at $r_{\text{peak}} = \frac{n^2 a_0}{Z_{\text{eff}}}$, states with radial nodes ($k = n - \ell - 1 > 0$) have multiple local maxima and shift the principal valence peak outward (for example, the $2s$ orbital has its principal peak at $r = (3 + \sqrt{5})\frac{a_0}{Z_{\text{eff}}} \approx 5.236 \frac{a_0}{Z_{\text{eff}}}$, over $30\%$ farther out than $n^2/Z_{\text{eff}} = 4.0 a_0/Z_{\text{eff}}$).

QUANTA locates all exact radial nodes and peaks:
1. **Radial Nodes:** Computed as the roots of the associated Laguerre polynomial $L_{n-\ell-1}^{2\ell+1}(\rho) = 0$ via closed forms for $k \le 2$ and the symmetric tridiagonal Jacobi eigensolver for $k \ge 3$:
   $$r_{\text{node}, i} = \frac{n \rho_i a_0}{2 Z_{\text{eff}}}$$
2. **Radial Probability Maxima:** Evaluated via golden-section search across the unimodal intervals bounded by the radial nodes, identifying both secondary internal maxima and the dominant outermost principal peak displayed in the interface.

---

## 4. Multi-Electron Screening & Slater $Z_{\text{eff}}$ Model

### 4.1 Physical Need for Effective Nuclear Charge

In neutral multi-electron atoms ($Z \ge 2$), the full Hamiltonian contains electron-electron Coulomb repulsion terms:

$$\hat{H} = \sum_{i=1}^Z \left( -\frac{\hbar^2}{2m_e}\nabla_i^2 - \frac{Z e^2}{4\pi\varepsilon_0 r_i} \right) + \sum_{i < j}^Z \frac{e^2}{4\pi\varepsilon_0 r_{ij}}$$

Due to the inter-electronic distance terms $r_{ij} = |\mathbf{r}_i - \mathbf{r}_j|$, the multi-electron Schrödinger equation cannot be separated into independent single-particle coordinates. Exact closed-form analytic solutions **do not exist**.

In central field approximations, each electron moves in an effective central potential representing the nucleus screened by the average spherical charge density of the other $Z - 1$ electrons:

$$V_{\text{eff}}(r) \approx -\frac{Z_{\text{eff}}(r) e^2}{4\pi\varepsilon_0 r}$$

### 4.2 Slater's Screening Rules

QUANTA implements John C. Slater's empirical formulation (Phys. Rev. 36, 57, 1930) to compute subshell-dependent screening constants $\sigma$ and effective nuclear charges:

$$Z_{\text{eff}} = Z - \sigma$$

Electrons are grouped in order of increasing principal shell and angular momentum:
$$(1s), (2s, 2p), (3s, 3p), (3d), (4s, 4p), (4d), (4f), (5s, 5p), \dots$$

#### Rules for $s$ and $p$ Valence Groups:
1. Electrons in groups higher than the target contribute $0.00$.
2. Other electrons in the same $(ns, np)$ group contribute $0.35$ each (except in $1s$, where the other electron contributes $0.30$).
3. Electrons in the $(n-1)$ shell contribute $0.85$ each.
4. Electrons in $(n-2)$ and deeper shells contribute $1.00$ each (complete core screening).

#### Rules for $d$ and $f$ Groups:
1. Electrons in groups higher than the target contribute $0.00$.
2. Other electrons in the same $(nd)$ or $(nf)$ group contribute $0.35$ each.
3. All electrons in groups below the target contribute $1.00$ each.

---

## 5. Model Limitations & Physical Disclosures

QUANTA explicitly discloses the scope and boundaries of its quantum representations in the user interface:

1. **Not Exact Wavefunctions for Multi-Electron Atoms:**
   A hydrogenic orbital evaluated with an effective charge $Z_{\text{eff}}$ is an educational model of single-electron spatial behavior. It does not incorporate full electron-electron correlation, configuration interaction (CI), or runtime self-consistent field (SCF) relaxation.

2. **Phase Sign vs Electrical Charge:**
   Wavefunction phase colors (+ Sky Blue, - Coral Amber) represent opposite algebraic signs of the scalar mathematical field $\psi(\mathbf{r})$, **not positive and negative electrical charges**. An electron possesses an invariant negative charge $-e$ throughout all lobes and phases.

3. **Probability Amplitudes vs Classical Trajectories:**
   Points sampled in the 3D density cloud represent the spatial probability density $|\psi(\mathbf{r})|^2$. They do not depict classical Bohr trajectories, planetary orbits, or localized particle paths.

4. **Relativistic Effects in Heavy Atoms:**
   For elements with $Z > 54$ (gold, uranium, oganesson), relativistic mass increases cause direct contraction and stabilization of $s$ and $p_{1/2}$ orbitals, along with indirect electrostatic screening and expansion of $d$ and $f$ orbitals. Spin-orbit coupling splits subshells into $j = \ell \pm 1/2$ states. QUANTA flags these states with its Tier D Relativistic Approximation disclosure.

---

## 6. Literature References

1. Slater, J. C. (1930). "Atomic Shielding Constants". *Physical Review*, 36(1), 57–64.
2. Pauling, L., & Wilson, E. B. (1935). *Introduction to Quantum Mechanics with Applications to Chemistry*. McGraw-Hill.
3. Clementi, E., & Raimondi, D. L. (1963). "Atomic Screening Constants from SCF Functions". *Journal of Chemical Physics*, 38(11), 2686–2689.
4. Kramida, A., Ralchenko, Yu., Reader, J., & NIST ASD Team (2024). *NIST Atomic Spectra Database* (ver. 5.11). National Institute of Standards and Technology, Gaithersburg, MD.
5. Bethe, H. A., & Salpeter, E. E. (1957). *Quantum Mechanics of One- and Two-Electron Atoms*. Academic Press.

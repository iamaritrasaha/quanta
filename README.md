# QUANTA

**Matter, visualized.**

QUANTA is an interactive atomic physics visualization instrument for exploring atomic structure from historical Bohr quantization to modern quantum-mechanical probability distributions. V2 deeply implements Hydrogen with exact analytical solutions, dynamic Rydberg transitions, emission spectroscopy, and step-by-step mathematical derivations.

## Scope & Features

- **Interactive Periodic Table**: Glass interface staging all 118 named elements, with Hydrogen active as the foundational instrument.
- **Bohr Quantization Model**: Historical/conceptual model showing discrete electron orbits ($r_n = a_0 \cdot n^2$), orbital velocity scaling, and electronic state transitions.
- **Schrödinger Eigenfunctions**: Exact wave function probability distributions ($|\psi(r,\theta,\phi)|^2$) for $1s$, $2s$, and $2p$ eigenstates with physical nodal surfaces.
- **Quantum State Transitions**: Discrete absorption and emission of photons with dynamic Rydberg wavelength calculations across Lyman, Balmer, and Paschen series.
- **Mathematical Derivation Inspector**: Step-by-step physical equations, exact parameter substitutions, and physical state outputs rendered via KaTeX.
- **Calibrated Spectroscopy**: Continuous UV-Visible-IR spectral band visualizer with physical spectral line markers.
- **Client-Side SI Physics Engine**: Standalone TypeScript calculation layer with zero external API dependencies, servers, or runtime secrets.

## Technology Stack

- **Framework**: React 19, TypeScript
- **3D Graphics & Physics**: Three.js, React Three Fiber, Drei
- **State Architecture**: Zustand
- **Typography & Math**: KaTeX
- **Build & Test**: Vite, Vitest

## Local Development

```bash
npm install
npm run dev
npm run test
npm run build
npm run preview
```

## GitHub Pages Deployment

The included GitHub Actions workflow automatically builds and deploys on pushes to `main`. The build uses relative asset paths (`base: './'`), operating seamlessly on GitHub Pages at [https://iamaritrasaha.github.io/quanta/](https://iamaritrasaha.github.io/quanta/).

## Scientific Model Notes

- **Bohr Model**: Presented as a historical and conceptual representation of quantized states. Electron motion is time-expanded for educational clarity.
- **Quantum Mechanics**: Renders exact analytical Hydrogenic probability densities ($|\psi|^2$), derived from the wave function $\psi$. No classical trajectories are drawn through probability clouds.
- **Photon Wave Packets**: Pedagogical visualizations of quantum energy exchange; spatial wavelength is not to physical scale.

For detailed notes on physical formulas and assumptions, refer to [`docs/science.md`](docs/science.md).

## Author

**Aritra Saha**<br />
Founder & Product Builder, Foresight Labs

QUANTA is an original interactive scientific visualization project exploring atomic structure from historical Bohr models to quantum-mechanical probability descriptions.

GitHub: [https://github.com/iamaritrasaha](https://github.com/iamaritrasaha)

## Copyright

Copyright © 2026 Aritra Saha. All rights reserved.

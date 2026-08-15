# QUANTA

**Matter, visualized.**

QUANTA is a browser-native scientific visualization instrument for exploring atoms from historical and quantum perspectives. V1 implements Hydrogen deeply; the periodic table is a map for elements that will be added individually.

## Current scope

- Glass interactive periodic table with all 118 named elements
- Hydrogen overview, Bohr model, energy levels, excitation/emission, spectroscopy, equations, and quantum probability-density visualization
- Local, tested TypeScript physics calculations — no API, server, database, or runtime secrets
- Hash-based navigation (\`#/element/hydrogen\`) for GitHub Pages refresh safety

## Technology

React, TypeScript, Vite, Three.js / React Three Fiber, Zustand, KaTeX, and Vitest.

## Local development

\`\`\`bash
npm install
npm run dev
npm run test
npm run build
npm run preview
\`\`\`

## GitHub Pages deployment

The included workflow builds and deploys on pushes to \`main\`. In the repository settings, set **Pages → Build and deployment → GitHub Actions**. The Vite build uses relative asset paths, so it works under a repository URL such as \`username.github.io/quanta/\`, as well as a custom domain.

## Architecture

- \`src/physics/\`: framework-independent constants, Hydrogen transitions, spectral classification, quantum-number validation, and analytic orbital density sampling
- \`src/rendering/\`: Three.js atom / probability-density renderer
- \`src/state/\`: one shared visualization state for panels and scene
- \`src/data/\`: bundled periodic-table metadata

Hydrogen’s exact one-electron equations are deliberately not presented as a direct model for future multi-electron atoms; those require their own approximations and renderers.

## Scientific model

The Bohr model is presented as a historical / conceptual model. Electron motion is only shown in that mode and is time-expanded for educational readability. Quantum mode renders a sampled finite probability-density field; it is not an electron path or a hard orbital boundary. Nuclear and atomic display scales are exaggerated for clarity. Read [the scientific notes](docs/science.md) for scope and assumptions.

## Roadmap

- V1 — Hydrogen
- V2 — Helium
- V3 — Lithium
- V4 — Carbon

Future work may include isotopes, multi-electron filling, richer spectroscopy, nuclear structure, and comparative model history.

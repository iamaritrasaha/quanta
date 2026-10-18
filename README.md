# QUANTA

**Matter, visualized.**

An interactive atomic physics instrument for exploring all 118 elements: atomic structure, electron configurations, photon transitions, energy levels, and spectroscopy.

**[Open QUANTA](https://iamaritrasaha.github.io/quanta/)**

## Element Coverage

All 118 periodic-table tiles open an instrument. The scientific models differ by element:

| Elements | Structure and quantum view | Energy levels and spectra |
| --- | --- | --- |
| Hydrogen | Conceptual Bohr orbits for n = 1–6; analytical 1s, 2s, and 2p probability densities | Hydrogen energy relations and Rydberg series calculations |
| Helium–Boron | Dedicated shell models and approximate reduced electron densities | Curated neutral-atom levels and spectral lines, with air/vacuum labels |
| Carbon–Oganesson | Shared interactive shell models and schematic radial occupancy clouds | Bundled NIST neutral-atom levels where available; vacuum wavelengths derived from selected level differences |

The shared instrument includes element properties for Carbon through Oganesson and up to 20 retained bound-level records per element. In the bundled NIST snapshot, 103 of those 113 elements have at least one bound level, and 85 have at least two. Missing reference spectra are not filled with invented values.

## Explore an Atom

1. Select an element from the periodic table.
2. Switch between **Overview**, **Bohr/Shell Model**, **Quantum**, **Energy Levels**, **Spectra**, and **Equations**.
3. Choose an initial state, final state, or reference transition in the available controls.
4. Select **ABSORB PHOTON** to excite the atom or **EMIT PHOTON** to relax it. Watch the photon packet and the displayed electronic state change.

### Scene Controls

| Control | Action |
| --- | --- |
| Mouse drag / one-finger drag | Rotate the atom |
| Mouse wheel / two-finger pinch | Zoom the camera |
| **PLAY / PAUSE** | Resume or freeze electron motion and an active photon transition |
| **0.5× / 1× / 2×** | Change animation speed, including during a transition |
| **RESET VIEW** | Restore the default camera position |
| **RESET ATOM** | Restore the selected element's ground state |
| **CANCEL TRANSITION** | Stop a running transition and return to its initial electronic state |

Reduced-motion preferences suppress decorative idle motion while preserving deliberate camera gestures and user-triggered transitions. On smaller screens, scroll the mode tabs horizontally and scroll the scientific controls to reach additional content.

### Carbon–Oganesson Controls

- **Initial state** previews a configuration; **Final state** chooses the destination for the next jump.
- **EXCITE**, **RELAX**, and **REVERSE** prepare a state pair. The photon action starts the animation.
- After a completed jump, the previous state becomes the next target, allowing the reverse transition.
- Select a mapped row in **Energy Levels** to display that state's shell configuration. Reference records that cannot be mapped unambiguously remain disabled.
- In **Spectra**, choose lower and upper reference levels to calculate their vacuum wavelength. **ANIMATE ABSORPTION / EMISSION** connects a mapped pair to the same atom model.
- Each element also has two explicitly labelled **schematic shell promotions**. These illustrate moving one outer electron to a higher principal shell and have no assigned measured energy or wavelength.

## Scientific Model Notes

- **Hydrogen:** The exposed 1s, 2s, and 2p clouds sample analytical hydrogenic probability densities. Higher Bohr states remain selectable; unsupported quantum views preserve the state and explain the visualization limit.
- **Many-electron atoms:** Electrons do not follow fixed classical paths. Shell rings and moving point markers are teaching representations. Helium–Boron use approximate density models; Carbon–Oganesson clouds illustrate radial shell occupancy and are not calculated many-electron wavefunctions.
- **Reference configurations:** Published configurations determine shell counts. Selectable NIST configurations restore omitted closed core subshells only when the mapping conserves the atom's electron count. Fine-structure states can differ in energy while retaining the same principal-shell counts.
- **Derived wavelengths:** For a reference-level separation Δṽ in cm⁻¹, λᵥₐc in nm = 10⁷ / Δṽ. Arbitrary shared-instrument pairs are not asserted to be allowed transitions, observed lines, intensities, or transition probabilities.
- **Visual scale:** Shell radii, nucleus sizes, photon color, and wave-packet spacing are illustrative. Animation timing is expanded for inspection.
- **Sources:** Element properties come from the bundled PubChem periodic-table snapshot; reference levels come from NIST ASD. Source estimates and missing fields remain identified. A cited Lawrencium configuration correction is documented separately.

See [Scientific Models](docs/science.md) and [Reference Data](docs/reference-data.md) for formulas, approximations, source links, coverage, and snapshot dates.

## Local Development

Use a current **Node.js 22 LTS or 24 LTS** release and npm. A modern browser with WebGL is required for the 3D views. No application API keys or environment variables are required; reference data is bundled locally.

```bash
git clone https://github.com/iamaritrasaha/quanta.git
cd quanta
npm ci
npm run dev
```

Open the local URL printed by Vite. Direct element links use hash routes, for example `#/element/hydrogen`, `#/element/carbon`, and `#/element/oganesson`.

### Verification and Production Preview

```bash
npm test          # Physics, data, routing helpers, state isolation, and transition lifecycle tests
npm run build     # TypeScript checks and production bundle
npm run preview   # Serve the production build locally
```

Run the browser regression suite against the production build:

```bash
npx playwright install chromium   # Install the test browser once
npm run build
npm run test:browser
```

Browser tests cover all 118 routes, all 113 shared transition controllers, Hydrogen–Boron playback, reference and schematic transitions, camera gestures, mobile layouts, and touch input. Failed browser checks retain screenshots and traces in `test-results/`. For a prepared environment with an existing Chromium binary, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute path.

For interactive unit-test development, use `npm run test:watch`.

Tests include electron conservation for all published configurations, shared-element absorption/emission/reset lifecycles, and dedicated-instrument pause/resume and speed changes.

For a browser regression check:

1. Open Hydrogen, Helium, Lithium, Beryllium, Boron, and representative shared instruments such as Carbon, Iron, Cerium, Lawrencium, and Oganesson.
2. Check all six modes, drag rotation, wheel/pinch zoom, and camera reset.
3. Complete absorption and emission; pause mid-transition, change speed, resume, cancel, and reset the atom.
4. Check that selected states, shell counts, energy labels, and the current-state header agree. Missing reference energies must not produce a wavelength.
5. Repeat at mobile widths, check touch gestures and reachable controls, and inspect the browser console and failed asset requests.

## Project Structure

```text
src/
  App.tsx              Hash routes and the existing instrument workspace
  components/          Element panels, controls, and periodic table
    science/           Reusable scientific display components
  data/                Element identities, bundled reference snapshots, and state mapping
  physics/             Energy relations, density models, and transition calculations
  rendering/           Three.js scenes, electron models, clouds, and photon packets
  state/               Shared Zustand store and element state lifecycles
  styles.css           Instrument styling and responsive layouts
tests/browser/         Production-browser interaction regressions
playwright.config.ts   Browser test configuration
docs/                  Scientific model and source documentation
.github/workflows/     Pull-request checks and GitHub Pages deployment
```

The application uses React 19, TypeScript, Zustand, Three.js, React Three Fiber, Drei, KaTeX, Vite, Vitest, and Playwright. It remains a static client application with no runtime reference-data service. The 3D scene and shared reference instrument load lazily.

## GitHub Pages Deployment

Pull requests targeting `main` install dependencies, run unit tests, build the site, and run the Chromium browser regression suite in GitHub Actions. Pushes to `main` run tests, build the site, and deploy the resulting `dist/` directory to GitHub Pages.

Vite uses relative asset paths (`base: './'`), supporting the `/quanta/` project path. Hash routes allow direct element links without server-side rewrite rules. See the repository's [Actions](https://github.com/iamaritrasaha/quanta/actions) for verification and deployment status.

## Author

**Aritra Saha**<br />
Founder & Product Builder, Foresight Labs

QUANTA is an original interactive scientific visualization project exploring atomic structure from historical Bohr models to quantum-mechanical probability descriptions.

GitHub: [iamaritrasaha](https://github.com/iamaritrasaha)

## Copyright

Copyright © 2026 Aritra Saha. All rights reserved.

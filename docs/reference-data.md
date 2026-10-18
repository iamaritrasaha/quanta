# Reference Data

QUANTA bundles reference values locally. These snapshots are used by the shared instrument for Carbon through Oganesson and do not trigger network requests in the app.

## PubChem Periodic Table

- **Source:** [PubChem PUG REST Periodic Table](https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON)
- **Retrieved:** 2026-10-17
- **Coverage:** 118 elements
- **Bundled fields:** source atomic mass, electron configuration, electronegativity, atomic radius, first ionization energy, electron affinity, oxidation states, standard state, melting point, boiling point, density, and discovery year. Blank source values are retained as blank.
- **Units:** atomic mass (u), atomic radius (pm), ionization energy and electron affinity (eV), melting/boiling point (K), density (g/cm³), and electronegativity (Pauling scale).

The reference includes estimates for synthetic elements. Source entries described as expected phases are labeled as predictions in the instrument; they are not treated as measured phases.

The raw PubChem snapshot is retained as published, including predicted annotations. Lawrencium has an explicit, attributed correction at lookup: the older PubChem 6d assignment is replaced with [Rn]5f¹⁴7s²7p¹, matching the [NIST ASD Lr I ground configuration](https://physics.nist.gov/cgi-bin/ASD/energy1.pl?spectrum=Lr+I&units=0&format=0&conf_out=on&term_out=on&level_out=on&j_out=on), rechecked on 2026-10-18. This correction is cited in the Lawrencium instrument. Principal-shell totals are parsed from the noble-gas core and listed subshells; the resulting counts are checked against atomic numbers for all 118 configurations. The shell diagram built from those counts remains an idealized representation.

## NIST Atomic Spectra Database

- **Source:** [NIST Atomic Spectra Database](https://physics.nist.gov/asd), [database reference](https://doi.org/10.18434/T4W30F)
- **Retrieved:** 2026-10-17
- **Species queried:** neutral atoms from C I through Og I
- **Bundled records:** up to the first 20 numeric-energy records per neutral species, with repeated identical records removed. Energies are in cm⁻¹ and relative to the ground level. Nonnumeric energy records are omitted; ionization-limit rows are stored separately when included in the retained records.
- **Coverage in this snapshot:** 103 elements returned at least one bound level; 85 returned at least two. Eighteen returned only one bound level, and ten returned no neutral bound levels. Elements with fewer than two bound levels do not show a derived reference wavelength. Their shell-promotion demonstrations are explicitly schematic and carry no measured energy or wavelength.

Only bound-level energies and their listed configuration, term, and J values are used in the level view and wavelength calculator. Vacuum wavelengths are calculated from two selected bound-level energies using $\lambda_{vac}\text{ (nm)} = 10^7 / \Delta\tilde{\nu}\text{ (cm}^{-1}\text{)}$. The selected pair is not filtered by transition selection rules, and the calculator does not assert an observed spectral line, intensity, or transition probability.

## Interactive state mapping

Selectable NIST configurations use explicit subshell occupations, with omitted closed core subshells restored from the published ground configuration. A configuration is selectable only if that mapping accounts for exactly Z electrons. Reference levels that cannot be mapped remain visible as disabled records. Transitions retain the reference energy difference while the shell and photon animation remains schematic; no selection rule or transition probability is inferred. Fine-structure pairs keep the same shell counts.

Two additional shell-promotion states per element move one outer electron to a higher principal shell for teaching purposes. They have no reference energy and do not produce a derived wavelength. The cloud is a schematic radial occupancy illustration rather than a many-electron wavefunction.

## Refreshing the snapshots

When refreshing either snapshot, retain the source and retrieval date, keep source values distinct from derived values, and check that every element configuration accounts for its atomic number. Do not replace missing reference data with calculated or estimated spectroscopy values.

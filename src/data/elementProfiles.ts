/**
 * QUANTA V4 — Comprehensive 118-Element Scientific Profile Registry
 *
 * Provides authoritative historical, atomic, spectroscopic, and model-tier
 * profiles for every chemical element from Hydrogen (Z=1) to Oganesson (Z=118).
 */

export type ModelTier = 'tierA' | 'tierB' | 'tierC' | 'tierD'

export interface LandmarkSpectralLine {
  label: string
  wavelengthNm: number
  region: 'Ultraviolet' | 'Visible' | 'Infrared'
  color: string
  status: 'reference' | 'derived' | 'schematic'
  lowerConfig?: string
  upperConfig?: string
}

export interface DistinctiveBehaviorHighlight {
  contrastLabel: string
  contrastVal: string
  currentLabel: string
  currentVal: string
}

export interface ElementProfile {
  number: number
  symbol: string
  name: string
  groundTerm: string
  modelTier: ModelTier
  valenceConfiguration: string
  historicalContext: string
  physicalIdentity: string
  distinctiveBehavior: DistinctiveBehaviorHighlight
  landmarkLines: LandmarkSpectralLine[]
}

export const ELEMENT_PROFILES: Record<string, ElementProfile> = {
  "H": {
    "number": 1,
    "symbol": "H",
    "name": "Hydrogen",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierA",
    "valenceConfiguration": "1s1",
    "historicalContext": "Hydrogen was identified in 1766.",
    "physicalIdentity": "Hydrogen (H, atomic number Z = 1) is the fundamental testing ground of atomic physics and quantum mechanics, whose single-electron Coulomb potential permits exact closed-form analytical solutions. The neutral atom ground state configuration is 1s1, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PROTIUM TESTING GROUND",
      "currentVal": "Pure 1/r Coulomb potential · Benchmark for modern quantum electrodynamics"
    },
    "landmarkLines": []
  },
  "He": {
    "number": 2,
    "symbol": "He",
    "name": "Helium",
    "groundTerm": "—",
    "modelTier": "tierB",
    "valenceConfiguration": "1s2",
    "historicalContext": "Helium was identified in 1868.",
    "physicalIdentity": "Helium (He, atomic number Z = 2) is the archetypal two-electron system, demonstrating the failure of independent-electron central field approximations and the crucial role of Coulomb repulsion and spin-exchange symmetry. The neutral atom ground state configuration is 1s2, yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "1 electron · Exact analytic solution",
      "currentLabel": "HELIUM (Z = 2)",
      "currentVal": "2 interacting electrons · Exchange symmetry & Singlet/Triplet splitting"
    },
    "landmarkLines": []
  },
  "Li": {
    "number": 3,
    "symbol": "Li",
    "name": "Lithium",
    "groundTerm": "—",
    "modelTier": "tierB",
    "valenceConfiguration": "2s1",
    "historicalContext": "Lithium was identified in 1817.",
    "physicalIdentity": "Lithium (Li, atomic number Z = 3) is the simplest alkali metal, featuring a tightly bound helium-like 1s² core shielded from a loosely held 2s valence electron. The neutral atom ground state configuration is [He]2s1, yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HELIUM (Z = 2)",
      "contrastVal": "Closed 1s² core · High ionization (24.59 eV)",
      "currentLabel": "LITHIUM (Z = 3)",
      "currentVal": "1s² core + lone 2s valence electron · Low ionization (5.39 eV)"
    },
    "landmarkLines": []
  },
  "Be": {
    "number": 4,
    "symbol": "Be",
    "name": "Beryllium",
    "groundTerm": "—",
    "modelTier": "tierB",
    "valenceConfiguration": "2s2",
    "historicalContext": "Beryllium was identified in 1798.",
    "physicalIdentity": "Beryllium (Be, atomic number Z = 4) is a light period-2 element whose chemical and atomic behavior is dominated by the sequential filling of the 2s and 2p subshells under strong electron correlation. The neutral atom ground state configuration is [He]2s2, yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "LITHIUM (Z = 3)",
      "contrastVal": "Alkali metal · 2s¹ open shell",
      "currentLabel": "BERYLLIUM (Z = 4)",
      "currentVal": "Alkaline earth · Closed 2s² subshell with low 2s-2p promotion energy"
    },
    "landmarkLines": []
  },
  "B": {
    "number": 5,
    "symbol": "B",
    "name": "Boron",
    "groundTerm": "—",
    "modelTier": "tierB",
    "valenceConfiguration": "2s2 2p1",
    "historicalContext": "Boron was identified in 1808.",
    "physicalIdentity": "Boron (B, atomic number Z = 5) is a light period-2 element whose chemical and atomic behavior is dominated by the sequential filling of the 2s and 2p subshells under strong electron correlation. The neutral atom ground state configuration is [He]2s2 2p1, yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "BERYLLIUM (Z = 4)",
      "contrastVal": "Closed 2s² subshell · Spherically symmetric",
      "currentLabel": "BORON (Z = 5)",
      "currentVal": "First p-block element · Directional 2p orbital lobe"
    },
    "landmarkLines": []
  },
  "C": {
    "number": 6,
    "symbol": "C",
    "name": "Carbon",
    "groundTerm": "³P₀",
    "modelTier": "tierC",
    "valenceConfiguration": "2s2 2p2",
    "historicalContext": "Carbon has been known and utilized since antiquity.",
    "physicalIdentity": "Carbon (C, atomic number Z = 6) is a light period-2 element whose chemical and atomic behavior is dominated by the sequential filling of the 2s and 2p subshells under strong electron correlation. The neutral atom ground state configuration is [He]2s2 2p2, yielding the spectroscopic ground term ³P₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Spherical symmetry",
      "currentLabel": "CARBON (Z = 6)",
      "currentVal": "Open 2p² subshell · Hund's rule triplet ground state & sp³ hybridization"
    },
    "landmarkLines": [
      {
        "label": "1D → 3P",
        "wavelengthNm": 981.1,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "2s2.2p2",
        "upperConfig": "2s2.2p2"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 461.94,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "2s2.2p2",
        "upperConfig": "2s2.2p2"
      },
      {
        "label": "5S* → 3P",
        "wavelengthNm": 296.43,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p2",
        "upperConfig": "2s.2p3"
      },
      {
        "label": "3P* → 3P",
        "wavelengthNm": 165.75,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p2",
        "upperConfig": "2s2.2p.3s"
      }
    ]
  },
  "N": {
    "number": 7,
    "symbol": "N",
    "name": "Nitrogen",
    "groundTerm": "⁴S°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "2s2 2p3",
    "historicalContext": "Nitrogen was identified in 1772.",
    "physicalIdentity": "Nitrogen (N, atomic number Z = 7) is a light period-2 element whose chemical and atomic behavior is dominated by the sequential filling of the 2s and 2p subshells under strong electron correlation. The neutral atom ground state configuration is [He] 2s2 2p3, yielding the spectroscopic ground term ⁴S°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "CARBON (Z = 6)",
      "contrastVal": "2p² subshell · Intermediate electron affinity",
      "currentLabel": "NITROGEN (Z = 7)",
      "currentVal": "Half-filled 2p³ subshell · High exchange stability & elevated ionization energy"
    },
    "landmarkLines": [
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 520.17,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "2s2.2p3",
        "upperConfig": "2s2.2p3"
      },
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 519.93,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "2s2.2p3",
        "upperConfig": "2s2.2p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 346.75,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p3",
        "upperConfig": "2s2.2p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 346.75,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p3",
        "upperConfig": "2s2.2p3"
      }
    ]
  },
  "O": {
    "number": 8,
    "symbol": "O",
    "name": "Oxygen",
    "groundTerm": "³P₂",
    "modelTier": "tierC",
    "valenceConfiguration": "2s2 2p4",
    "historicalContext": "Oxygen was identified in 1774.",
    "physicalIdentity": "Oxygen (O, atomic number Z = 8) is a light period-2 element whose chemical and atomic behavior is dominated by the sequential filling of the 2s and 2p subshells under strong electron correlation. The neutral atom ground state configuration is [He]2s2 2p4, yielding the spectroscopic ground term ³P₂.",
    "distinctiveBehavior": {
      "contrastLabel": "NITROGEN (Z = 7)",
      "contrastVal": "Half-filled 2p³ shell · Spherically symmetric spin density",
      "currentLabel": "OXYGEN (Z = 8)",
      "currentVal": "2p⁴ subshell · First paired 2p electron with increased electron-electron repulsion"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 63185.16,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "2s2.2p4",
        "upperConfig": "2s2.2p4"
      },
      {
        "label": "3P → 3P",
        "wavelengthNm": 44057.33,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "2s2.2p4",
        "upperConfig": "2s2.2p4"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 630.2,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "2s2.2p4",
        "upperConfig": "2s2.2p4"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 295.92,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p4",
        "upperConfig": "2s2.2p4"
      }
    ]
  },
  "F": {
    "number": 9,
    "symbol": "F",
    "name": "Fluorine",
    "groundTerm": "²P°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "2s2 2p5",
    "historicalContext": "Fluorine was identified in 1670.",
    "physicalIdentity": "Fluorine (F, atomic number Z = 9) is a light period-2 element whose chemical and atomic behavior is dominated by the sequential filling of the 2s and 2p subshells under strong electron correlation. The neutral atom ground state configuration is [He]2s2 2p5, yielding the spectroscopic ground term ²P°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "OXYGEN (Z = 8)",
      "contrastVal": "2p⁴ configuration · Oxidation states -2 to +2",
      "currentLabel": "FLUORINE (Z = 9)",
      "currentVal": "2p⁵ configuration · Most electronegative element · Extremely high electron affinity"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 24743.84,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "2s2.2p5",
        "upperConfig": "2s2.2p5"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 97.65,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p5",
        "upperConfig": "2s2.2p4.(3P).3s"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 97.39,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p5",
        "upperConfig": "2s2.2p4.(3P).3s"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 97.24,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p5",
        "upperConfig": "2s2.2p4.(3P).3s"
      }
    ]
  },
  "Ne": {
    "number": 10,
    "symbol": "Ne",
    "name": "Neon",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "2s2 2p6",
    "historicalContext": "Neon was identified in 1898.",
    "physicalIdentity": "Neon (Ne, atomic number Z = 10) is a light period-2 element whose chemical and atomic behavior is dominated by the sequential filling of the 2s and 2p subshells under strong electron correlation. The neutral atom ground state configuration is [He]2s2 2p6, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "FLUORINE (Z = 9)",
      "contrastVal": "2p⁵ open valence shell · Extreme chemical reactivity",
      "currentLabel": "NEON (Z = 10)",
      "currentVal": "Closed 2s² 2p⁶ octet · Exceptional chemical inertness & 21.56 eV ionization threshold"
    },
    "landmarkLines": [
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 74.6,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p6",
        "upperConfig": "2s2.2p5.(2P*<3/2>).3s"
      },
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 74.37,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p6",
        "upperConfig": "2s2.2p5.(2P*<3/2>).3s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 74.17,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p6",
        "upperConfig": "2s2.2p5.(2P*<1/2>).3s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 73.59,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2s2.2p6",
        "upperConfig": "2s2.2p5.(2P*<1/2>).3s"
      }
    ]
  },
  "Na": {
    "number": 11,
    "symbol": "Na",
    "name": "Sodium",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "3s1",
    "historicalContext": "Sodium was identified in 1807.",
    "physicalIdentity": "Sodium (Na, atomic number Z = 11) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s1, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "NEON (Z = 10)",
      "contrastVal": "Closed L-shell (2s² 2p⁶) · Radius 154 pm",
      "currentLabel": "SODIUM (Z = 11)",
      "currentVal": "Lone 3s¹ valence electron · Classic 589 nm D-line resonance doublet"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2S",
        "wavelengthNm": 589.76,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "2p6.3s",
        "upperConfig": "2p6.3p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 589.16,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "2p6.3s",
        "upperConfig": "2p6.3p"
      },
      {
        "label": "2S → 2S",
        "wavelengthNm": 388.5,
        "region": "Visible",
        "color": "#818cf8",
        "status": "derived",
        "lowerConfig": "2p6.3s",
        "upperConfig": "2p6.4s"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 342.78,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2p6.3s",
        "upperConfig": "2p6.3d"
      }
    ]
  },
  "Mg": {
    "number": 12,
    "symbol": "Mg",
    "name": "Magnesium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "3s2",
    "historicalContext": "Magnesium was identified in 1808.",
    "physicalIdentity": "Magnesium (Mg, atomic number Z = 12) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s2, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "SODIUM (Z = 11)",
      "contrastVal": "3s¹ alkali valence · Ionization energy 5.14 eV",
      "currentLabel": "MAGNESIUM (Z = 12)",
      "currentVal": "Closed 3s² valence subshell · Singlet ground term ¹S₀"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 457.66,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "2p6.3s2",
        "upperConfig": "3s.3p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 457.24,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "2p6.3s2",
        "upperConfig": "3s.3p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 456.39,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "2p6.3s2",
        "upperConfig": "3s.3p"
      },
      {
        "label": "1P* → 1S",
        "wavelengthNm": 285.3,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "2p6.3s2",
        "upperConfig": "3s.3p"
      }
    ]
  },
  "Al": {
    "number": 13,
    "symbol": "Al",
    "name": "Aluminium",
    "groundTerm": "²P°₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "3s2 3p1",
    "historicalContext": "Aluminium has been known and utilized since antiquity.",
    "physicalIdentity": "Aluminium (Al, atomic number Z = 13) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s2 3p1, yielding the spectroscopic ground term ²P°₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ALUMINIUM (Z = 13)",
      "currentVal": "Neutral 13-electron atom · [Ne]3s2 3p1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 89237.11,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p",
        "upperConfig": "3s2.3p"
      },
      {
        "label": "2S → 2P*",
        "wavelengthNm": 394.51,
        "region": "Visible",
        "color": "#818cf8",
        "status": "derived",
        "lowerConfig": "3s2.3p",
        "upperConfig": "3s2.4s"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 344.59,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p",
        "upperConfig": "3s.3p2"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 344.03,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p",
        "upperConfig": "3s.3p2"
      }
    ]
  },
  "Si": {
    "number": 14,
    "symbol": "Si",
    "name": "Silicon",
    "groundTerm": "³P₀",
    "modelTier": "tierC",
    "valenceConfiguration": "3s2 3p2",
    "historicalContext": "Silicon was identified in 1854.",
    "physicalIdentity": "Silicon (Si, atomic number Z = 14) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s2 3p2, yielding the spectroscopic ground term ³P₀.",
    "distinctiveBehavior": {
      "contrastLabel": "CARBON (Z = 6)",
      "contrastVal": "2p² valence · Strong catenation & π-bonding",
      "currentLabel": "SILICON (Z = 14)",
      "currentVal": "3p² valence · Expanded 3d participation & semiconductor bandgap physics"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 44811.5,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p2",
        "upperConfig": "3s2.3p2"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 1587.59,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p2",
        "upperConfig": "3s2.3p2"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 649.59,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "3s2.3p2",
        "upperConfig": "3s2.3p2"
      },
      {
        "label": "5S* → 3P",
        "wavelengthNm": 300.07,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p2",
        "upperConfig": "3s.3p3"
      }
    ]
  },
  "P": {
    "number": 15,
    "symbol": "P",
    "name": "Phosphorus",
    "groundTerm": "⁴S°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "3s2 3p3",
    "historicalContext": "Phosphorus was identified in 1669.",
    "physicalIdentity": "Phosphorus (P, atomic number Z = 15) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s2 3p3, yielding the spectroscopic ground term ⁴S°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PHOSPHORUS (Z = 15)",
      "currentVal": "Neutral 15-electron atom · [Ne]3s2 3p3 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 880.2,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p3",
        "upperConfig": "3s2.3p3"
      },
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 878.99,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p3",
        "upperConfig": "3s2.3p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 534.11,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "3s2.3p3",
        "upperConfig": "3s2.3p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 533.39,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "3s2.3p3",
        "upperConfig": "3s2.3p3"
      }
    ]
  },
  "S": {
    "number": 16,
    "symbol": "S",
    "name": "Sulfur",
    "groundTerm": "³P₂",
    "modelTier": "tierC",
    "valenceConfiguration": "3s2 3p4",
    "historicalContext": "Sulfur has been known and utilized since antiquity.",
    "physicalIdentity": "Sulfur (S, atomic number Z = 16) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s2 3p4, yielding the spectroscopic ground term ³P₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "SULFUR (Z = 16)",
      "currentVal": "Neutral 16-electron atom · [Ne]3s2 3p4 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 25248.92,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p4",
        "upperConfig": "3s2.3p4"
      },
      {
        "label": "3P → 3P",
        "wavelengthNm": 17433.88,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p4",
        "upperConfig": "3s2.3p4"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 1082.41,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p4",
        "upperConfig": "3s2.3p4"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 450.86,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "3s2.3p4",
        "upperConfig": "3s2.3p4"
      }
    ]
  },
  "Cl": {
    "number": 17,
    "symbol": "Cl",
    "name": "Chlorine",
    "groundTerm": "²P°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "3s2 3p5",
    "historicalContext": "Chlorine was identified in 1774.",
    "physicalIdentity": "Chlorine (Cl, atomic number Z = 17) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s2 3p5, yielding the spectroscopic ground term ²P°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "CHLORINE (Z = 17)",
      "currentVal": "Neutral 17-electron atom · [Ne]3s2 3p5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 11333.35,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3s2.3p5",
        "upperConfig": "3s2.3p5"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 138.97,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p5",
        "upperConfig": "3s2.3p4.(3P).4s"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 137.95,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p5",
        "upperConfig": "3s2.3p4.(3P).4s"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 137.31,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p5",
        "upperConfig": "3s2.3p4.(3P).4s"
      }
    ]
  },
  "Ar": {
    "number": 18,
    "symbol": "Ar",
    "name": "Argon",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "3s2 3p6",
    "historicalContext": "Argon was identified in 1894.",
    "physicalIdentity": "Argon (Ar, atomic number Z = 18) is a period-3 element filling the 3s and 3p valence subshells, exhibiting expanded atomic radii and accessibility of low-lying excited states. The neutral atom ground state configuration is [Ne]3s2 3p6, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "NEON (Z = 10)",
      "contrastVal": "2s² 2p⁶ shell · Ionization 21.56 eV",
      "currentLabel": "ARGON (Z = 18)",
      "currentVal": "Closed 3s² 3p⁶ octet · Blue-violet glow & empty 3d subshell manifold"
    },
    "landmarkLines": [
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 107.36,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p6",
        "upperConfig": "3s2.3p5.(2P*<3/2>).4s"
      },
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 106.67,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p6",
        "upperConfig": "3s2.3p5.(2P*<3/2>).4s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 105.76,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p6",
        "upperConfig": "3s2.3p5.(2P*<1/2>).4s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 104.82,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3s2.3p6",
        "upperConfig": "3s2.3p5.(2P*<1/2>).4s"
      }
    ]
  },
  "K": {
    "number": 19,
    "symbol": "K",
    "name": "Potassium",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s1",
    "historicalContext": "Potassium was identified in 1807.",
    "physicalIdentity": "Potassium (K, atomic number Z = 19) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s1, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "ARGON (Z = 18)",
      "contrastVal": "Closed M-octet · Empty 3d manifold",
      "currentLabel": "POTASSIUM (Z = 19)",
      "currentVal": "4s¹ occupancy before 3d · Madelung energy rule demonstration"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2S",
        "wavelengthNm": 770.11,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3p6.4s",
        "upperConfig": "3p6.4p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 766.7,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3p6.4s",
        "upperConfig": "3p6.4p"
      },
      {
        "label": "2S → 2S",
        "wavelengthNm": 475.59,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "3p6.4s",
        "upperConfig": "3p6.5s"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 464.37,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "3p6.4s",
        "upperConfig": "3p6.3d"
      }
    ]
  },
  "Ca": {
    "number": 20,
    "symbol": "Ca",
    "name": "Calcium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2",
    "historicalContext": "Calcium has been known and utilized since antiquity.",
    "physicalIdentity": "Calcium (Ca, atomic number Z = 20) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "CALCIUM (Z = 20)",
      "currentVal": "Neutral 20-electron atom · [Ar]4s2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 659.72,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "3p6.4s2",
        "upperConfig": "3p6.4s.4p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 657.46,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "3p6.4s2",
        "upperConfig": "3p6.4s.4p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 652.91,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "3p6.4s2",
        "upperConfig": "3p6.4s.4p"
      },
      {
        "label": "3D → 1S",
        "wavelengthNm": 491.75,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "3p6.4s2",
        "upperConfig": "3p6.3d.4s"
      }
    ]
  },
  "Sc": {
    "number": 21,
    "symbol": "Sc",
    "name": "Scandium",
    "groundTerm": "²D₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d1",
    "historicalContext": "Scandium was identified in 1879.",
    "physicalIdentity": "Scandium (Sc, atomic number Z = 21) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d1, yielding the spectroscopic ground term ²D₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "SCANDIUM (Z = 21)",
      "currentVal": "Neutral 21-electron atom · [Ar]4s2 3d1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D → 2D",
        "wavelengthNm": 59404.61,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d.4s2",
        "upperConfig": "3d.4s2"
      },
      {
        "label": "4F → 2D",
        "wavelengthNm": 868.06,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d.4s2",
        "upperConfig": "3d2.(3F).4s"
      },
      {
        "label": "4F → 2D",
        "wavelengthNm": 865.23,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d.4s2",
        "upperConfig": "3d2.(3F).4s"
      },
      {
        "label": "4F → 2D",
        "wavelengthNm": 861.31,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d.4s2",
        "upperConfig": "3d2.(3F).4s"
      }
    ]
  },
  "Ti": {
    "number": 22,
    "symbol": "Ti",
    "name": "Titanium",
    "groundTerm": "³F₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d2",
    "historicalContext": "Titanium was identified in 1791.",
    "physicalIdentity": "Titanium (Ti, atomic number Z = 22) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d2, yielding the spectroscopic ground term ³F₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TITANIUM (Z = 22)",
      "currentVal": "Neutral 22-electron atom · [Ar]4s2 3d2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 3F → a 3F",
        "wavelengthNm": 58777.61,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d2.4s2",
        "upperConfig": "3d2.4s2"
      },
      {
        "label": "a 3F → a 3F",
        "wavelengthNm": 25848.21,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d2.4s2",
        "upperConfig": "3d2.4s2"
      },
      {
        "label": "a 5F → a 3F",
        "wavelengthNm": 1525.13,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d2.4s2",
        "upperConfig": "3d3.(4F).4s"
      },
      {
        "label": "a 5F → a 3F",
        "wavelengthNm": 1515.44,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d2.4s2",
        "upperConfig": "3d3.(4F).4s"
      }
    ]
  },
  "V": {
    "number": 23,
    "symbol": "V",
    "name": "Vanadium",
    "groundTerm": "⁴F₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d3",
    "historicalContext": "Vanadium was identified in 1801.",
    "physicalIdentity": "Vanadium (V, atomic number Z = 23) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d3, yielding the spectroscopic ground term ⁴F₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "VANADIUM (Z = 23)",
      "currentVal": "Neutral 23-electron atom · [Ar]4s2 3d3 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 72789.21,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d3.4s2",
        "upperConfig": "3d3.4s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 30918.4,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d3.4s2",
        "upperConfig": "3d3.4s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 18084.65,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d3.4s2",
        "upperConfig": "3d3.4s2"
      },
      {
        "label": "a 6D → a 4F",
        "wavelengthNm": 4734.22,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d3.4s2",
        "upperConfig": "3d4.(5D).4s"
      }
    ]
  },
  "Cr": {
    "number": 24,
    "symbol": "Cr",
    "name": "Chromium",
    "groundTerm": "⁷S₃",
    "modelTier": "tierC",
    "valenceConfiguration": "3d5 4s1",
    "historicalContext": "Chromium was identified in 1797.",
    "physicalIdentity": "Chromium (Cr, atomic number Z = 24) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]3d5 4s1, yielding the spectroscopic ground term ⁷S₃.",
    "distinctiveBehavior": {
      "contrastLabel": "VANADIUM (Z = 23)",
      "contrastVal": "[Ar] 3d³ 4s² regular subshell filling",
      "currentLabel": "CHROMIUM (Z = 24)",
      "currentVal": "[Ar] 3d⁵ 4s¹ anomaly · Half-filled d-subshell exchange stabilization"
    },
    "landmarkLines": [
      {
        "label": "a 5S → a 7S",
        "wavelengthNm": 1316.98,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d5.(6S).4s",
        "upperConfig": "3d5.(6S).4s"
      },
      {
        "label": "a 5D → a 7S",
        "wavelengthNm": 1290.2,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d5.(6S).4s",
        "upperConfig": "3d4.4s2"
      },
      {
        "label": "a 5D → a 7S",
        "wavelengthNm": 1280.28,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d5.(6S).4s",
        "upperConfig": "3d4.4s2"
      },
      {
        "label": "a 5D → a 7S",
        "wavelengthNm": 1261.44,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d5.(6S).4s",
        "upperConfig": "3d4.4s2"
      }
    ]
  },
  "Mn": {
    "number": 25,
    "symbol": "Mn",
    "name": "Manganese",
    "groundTerm": "⁶S₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d5",
    "historicalContext": "Manganese was identified in 1774.",
    "physicalIdentity": "Manganese (Mn, atomic number Z = 25) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d5, yielding the spectroscopic ground term ⁶S₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "MANGANESE (Z = 25)",
      "currentVal": "Neutral 25-electron atom · [Ar]4s2 3d5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 6D → a 6S",
        "wavelengthNm": 586.43,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "3d5.4s2",
        "upperConfig": "3d6.(5D).4s"
      },
      {
        "label": "a 6D → a 6S",
        "wavelengthNm": 578.64,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "3d5.4s2",
        "upperConfig": "3d6.(5D).4s"
      },
      {
        "label": "a 6D → a 6S",
        "wavelengthNm": 573.02,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "3d5.4s2",
        "upperConfig": "3d6.(5D).4s"
      },
      {
        "label": "a 6D → a 6S",
        "wavelengthNm": 569.2,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "3d5.4s2",
        "upperConfig": "3d6.(5D).4s"
      }
    ]
  },
  "Fe": {
    "number": 26,
    "symbol": "Fe",
    "name": "Iron",
    "groundTerm": "⁵D₄",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d6",
    "historicalContext": "Iron has been known and utilized since antiquity.",
    "physicalIdentity": "Iron (Fe, atomic number Z = 26) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d6, yielding the spectroscopic ground term ⁵D₄.",
    "distinctiveBehavior": {
      "contrastLabel": "CALCIUM (Z = 20)",
      "contrastVal": "Closed 4s² shell · Diamagnetic core",
      "currentLabel": "IRON (Z = 26)",
      "currentVal": "Partially filled 3d⁶ 4s² · High spin magnetic moment & rich multiline spectrum"
    },
    "landmarkLines": [
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 24042.33,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d6.4s2",
        "upperConfig": "3d6.4s2"
      },
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 14204.4,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d6.4s2",
        "upperConfig": "3d6.4s2"
      },
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 11259.59,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d6.4s2",
        "upperConfig": "3d6.4s2"
      },
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 10224.18,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d6.4s2",
        "upperConfig": "3d6.4s2"
      }
    ]
  },
  "Co": {
    "number": 27,
    "symbol": "Co",
    "name": "Cobalt",
    "groundTerm": "⁴F₉ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d7",
    "historicalContext": "Cobalt was identified in 1735.",
    "physicalIdentity": "Cobalt (Co, atomic number Z = 27) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d7, yielding the spectroscopic ground term ⁴F₉ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "COBALT (Z = 27)",
      "currentVal": "Neutral 27-electron atom · [Ar]4s2 3d7 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 12254.9,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3p6.3d7.4s2",
        "upperConfig": "3p6.3d7.4s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 7108.13,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3p6.3d7.4s2",
        "upperConfig": "3p6.3d7.4s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 5526.91,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3p6.3d7.4s2",
        "upperConfig": "3p6.3d7.4s2"
      },
      {
        "label": "b 4F → a 4F",
        "wavelengthNm": 2871.24,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3p6.3d7.4s2",
        "upperConfig": "3p6.3d8.(3F).4s"
      }
    ]
  },
  "Ni": {
    "number": 28,
    "symbol": "Ni",
    "name": "Nickel",
    "groundTerm": "³F₄",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d8",
    "historicalContext": "Nickel was identified in 1751.",
    "physicalIdentity": "Nickel (Ni, atomic number Z = 28) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d8, yielding the spectroscopic ground term ³F₄.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "NICKEL (Z = 28)",
      "currentVal": "Neutral 28-electron atom · [Ar]4s2 3d8 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3F → 3F",
        "wavelengthNm": 7506.58,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d8.(3F).4s2",
        "upperConfig": "3d8.(3F).4s2"
      },
      {
        "label": "3F → 3F",
        "wavelengthNm": 4511.52,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d8.(3F).4s2",
        "upperConfig": "3d8.(3F).4s2"
      },
      {
        "label": "3D → 3F",
        "wavelengthNm": 48831.22,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d8.(3F).4s2",
        "upperConfig": "3d9.(2D).4s"
      },
      {
        "label": "3D → 3F",
        "wavelengthNm": 11366.01,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d8.(3F).4s2",
        "upperConfig": "3d9.(2D).4s"
      }
    ]
  },
  "Cu": {
    "number": 29,
    "symbol": "Cu",
    "name": "Copper",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s1 3d10",
    "historicalContext": "Copper has been known and utilized since antiquity.",
    "physicalIdentity": "Copper (Cu, atomic number Z = 29) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s1 3d10, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "NICKEL (Z = 28)",
      "contrastVal": "[Ar] 3d⁸ 4s² regular subshell filling",
      "currentLabel": "COPPER (Z = 29)",
      "currentVal": "[Ar] 3d¹⁰ 4s¹ anomaly · Completely filled 3d subshell stability"
    },
    "landmarkLines": [
      {
        "label": "2D → 2S",
        "wavelengthNm": 892.65,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d10.4s",
        "upperConfig": "3d9.4s2"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 754.98,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d10.4s",
        "upperConfig": "3d9.4s2"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 327.49,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s",
        "upperConfig": "3d10.4p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 324.85,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s",
        "upperConfig": "3d10.4p"
      }
    ]
  },
  "Zn": {
    "number": 30,
    "symbol": "Zn",
    "name": "Zinc",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d10",
    "historicalContext": "Zinc was identified in 1746.",
    "physicalIdentity": "Zinc (Zn, atomic number Z = 30) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d10, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ZINC (Z = 30)",
      "currentVal": "Neutral 30-electron atom · [Ar]4s2 3d10 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 309.49,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s2",
        "upperConfig": "3d10.4s.4p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 307.68,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s2",
        "upperConfig": "3d10.4s.4p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 304.04,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s2",
        "upperConfig": "3d10.4s.4p"
      },
      {
        "label": "1P* → 1S",
        "wavelengthNm": 213.92,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s2",
        "upperConfig": "3d10.4s.4p"
      }
    ]
  },
  "Ga": {
    "number": 31,
    "symbol": "Ga",
    "name": "Gallium",
    "groundTerm": "²P°₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d10 4p1",
    "historicalContext": "Gallium was identified in 1875.",
    "physicalIdentity": "Gallium (Ga, atomic number Z = 31) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d10 4p1, yielding the spectroscopic ground term ²P°₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "GALLIUM (Z = 31)",
      "currentVal": "Neutral 31-electron atom · [Ar]4s2 3d10 4p1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 12103.75,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "3d10.4s2.4p",
        "upperConfig": "3d10.4s2.4p"
      },
      {
        "label": "2S → 2P*",
        "wavelengthNm": 403.41,
        "region": "Visible",
        "color": "#818cf8",
        "status": "derived",
        "lowerConfig": "3d10.4s2.4p",
        "upperConfig": "4s2.5s"
      },
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 302.63,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s2.4p",
        "upperConfig": "4s2.5p"
      },
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 301.61,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "3d10.4s2.4p",
        "upperConfig": "4s2.5p"
      }
    ]
  },
  "Ge": {
    "number": 32,
    "symbol": "Ge",
    "name": "Germanium",
    "groundTerm": "³P₀",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d10 4p2",
    "historicalContext": "Germanium was identified in 1886.",
    "physicalIdentity": "Germanium (Ge, atomic number Z = 32) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d10 4p2, yielding the spectroscopic ground term ³P₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "GERMANIUM (Z = 32)",
      "currentVal": "Neutral 32-electron atom · [Ar]4s2 3d10 4p2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 17949,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p2",
        "upperConfig": "4s2.4p2"
      },
      {
        "label": "3P → 3P",
        "wavelengthNm": 7092.4,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p2",
        "upperConfig": "4s2.4p2"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 1403.45,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p2",
        "upperConfig": "4s2.4p2"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 610.97,
        "region": "Visible",
        "color": "#fb923c",
        "status": "derived",
        "lowerConfig": "4s2.4p2",
        "upperConfig": "4s2.4p2"
      }
    ]
  },
  "As": {
    "number": 33,
    "symbol": "As",
    "name": "Arsenic",
    "groundTerm": "⁴S°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d10 4p3",
    "historicalContext": "Arsenic has been known and utilized since antiquity.",
    "physicalIdentity": "Arsenic (As, atomic number Z = 33) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d10 4p3, yielding the spectroscopic ground term ⁴S°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ARSENIC (Z = 33)",
      "currentVal": "Neutral 33-electron atom · [Ar]4s2 3d10 4p3 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 944.06,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p3",
        "upperConfig": "4s2.4p3"
      },
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 916.2,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p3",
        "upperConfig": "4s2.4p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 549.87,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "4s2.4p3",
        "upperConfig": "4s2.4p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 536.26,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "4s2.4p3",
        "upperConfig": "4s2.4p3"
      }
    ]
  },
  "Se": {
    "number": 34,
    "symbol": "Se",
    "name": "Selenium",
    "groundTerm": "³P₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d10 4p4",
    "historicalContext": "Selenium was identified in 1817.",
    "physicalIdentity": "Selenium (Se, atomic number Z = 34) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d10 4p4, yielding the spectroscopic ground term ³P₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "SELENIUM (Z = 34)",
      "currentVal": "Neutral 34-electron atom · [Ar]4s2 3d10 4p4 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 5026.4,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p4",
        "upperConfig": "4s2.4p4"
      },
      {
        "label": "3P → 3P",
        "wavelengthNm": 3945.77,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p4",
        "upperConfig": "4s2.4p4"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 1044.26,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p4",
        "upperConfig": "4s2.4p4"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 445.51,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "4s2.4p4",
        "upperConfig": "4s2.4p4"
      }
    ]
  },
  "Br": {
    "number": 35,
    "symbol": "Br",
    "name": "Bromine",
    "groundTerm": "²P°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d10 4p5",
    "historicalContext": "Bromine was identified in 1826.",
    "physicalIdentity": "Bromine (Br, atomic number Z = 35) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d10 4p5, yielding the spectroscopic ground term ²P°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "BROMINE (Z = 35)",
      "currentVal": "Neutral 35-electron atom · [Ar]4s2 3d10 4p5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 2713.53,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4s2.4p5",
        "upperConfig": "4s2.4p5"
      },
      {
        "label": "2[2] → 2P*",
        "wavelengthNm": 157.64,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4s2.4p5",
        "upperConfig": "4s2.4p4.(3P<2>).5s"
      },
      {
        "label": "2[2] → 2P*",
        "wavelengthNm": 154.07,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4s2.4p5",
        "upperConfig": "4s2.4p4.(3P<2>).5s"
      },
      {
        "label": "2[1] → 2P*",
        "wavelengthNm": 149.51,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4s2.4p5",
        "upperConfig": "4s2.4p4.(3P<1>).5s"
      }
    ]
  },
  "Kr": {
    "number": 36,
    "symbol": "Kr",
    "name": "Krypton",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "4s2 3d10 4p6",
    "historicalContext": "Krypton was identified in 1898.",
    "physicalIdentity": "Krypton (Kr, atomic number Z = 36) is a period-4 element where transition series d-electron physics, anomalous configuration exceptions, and complex multiplet term structures govern atomic spectra. The neutral atom ground state configuration is [Ar]4s2 3d10 4p6, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "KRYPTON (Z = 36)",
      "currentVal": "Neutral 36-electron atom · [Ar]4s2 3d10 4p6 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 125.04,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4s2.4p6",
        "upperConfig": "4s2.4p5.(2P*<3/2>).5s"
      },
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 123.58,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4s2.4p6",
        "upperConfig": "4s2.4p5.(2P*<3/2>).5s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 117.38,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4s2.4p6",
        "upperConfig": "4s2.4p5.(2P*<1/2>).5s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 116.49,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4s2.4p6",
        "upperConfig": "4s2.4p5.(2P*<1/2>).5s"
      }
    ]
  },
  "Rb": {
    "number": 37,
    "symbol": "Rb",
    "name": "Rubidium",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s1",
    "historicalContext": "Rubidium was identified in 1861.",
    "physicalIdentity": "Rubidium (Rb, atomic number Z = 37) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s1, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "RUBIDIUM (Z = 37)",
      "currentVal": "Neutral 37-electron atom · [Kr]5s1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2S",
        "wavelengthNm": 794.98,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4p6.5s",
        "upperConfig": "4p6.5p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 780.24,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4p6.5s",
        "upperConfig": "4p6.5p"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 516.66,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "4p6.5s",
        "upperConfig": "4p6.4d"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 516.65,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "4p6.5s",
        "upperConfig": "4p6.4d"
      }
    ]
  },
  "Sr": {
    "number": 38,
    "symbol": "Sr",
    "name": "Strontium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2",
    "historicalContext": "Strontium was identified in 1790.",
    "physicalIdentity": "Strontium (Sr, atomic number Z = 38) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "STRONTIUM (Z = 38)",
      "currentVal": "Neutral 38-electron atom · [Kr]5s2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 698.45,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "5s2",
        "upperConfig": "5s.5p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 689.45,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "5s2",
        "upperConfig": "5s.5p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 671.21,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "5s2",
        "upperConfig": "5s.5p"
      },
      {
        "label": "3D → 1S",
        "wavelengthNm": 550.69,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "5s2",
        "upperConfig": "5s.4d"
      }
    ]
  },
  "Y": {
    "number": 39,
    "symbol": "Y",
    "name": "Yttrium",
    "groundTerm": "²D₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d1",
    "historicalContext": "Yttrium was identified in 1794.",
    "physicalIdentity": "Yttrium (Y, atomic number Z = 39) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d1, yielding the spectroscopic ground term ²D₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "YTTRIUM (Z = 39)",
      "currentVal": "Neutral 39-electron atom · [Kr]5s2 4d1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 2D → a 2D",
        "wavelengthNm": 18855.44,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d.5s2",
        "upperConfig": "4d.5s2"
      },
      {
        "label": "z 2P* → a 2D",
        "wavelengthNm": 949.74,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d.5s2",
        "upperConfig": "5s2.5p"
      },
      {
        "label": "z 2P* → a 2D",
        "wavelengthNm": 880.3,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d.5s2",
        "upperConfig": "5s2.5p"
      },
      {
        "label": "a 4F → a 2D",
        "wavelengthNm": 914.29,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d.5s2",
        "upperConfig": "4d2.(3F).5s"
      }
    ]
  },
  "Zr": {
    "number": 40,
    "symbol": "Zr",
    "name": "Zirconium",
    "groundTerm": "³F₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d2",
    "historicalContext": "Zirconium was identified in 1789.",
    "physicalIdentity": "Zirconium (Zr, atomic number Z = 40) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d2, yielding the spectroscopic ground term ³F₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ZIRCONIUM (Z = 40)",
      "currentVal": "Neutral 40-electron atom · [Kr]5s2 4d2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 3F → a 3F",
        "wavelengthNm": 17531.25,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d2.5s2",
        "upperConfig": "4d2.5s2"
      },
      {
        "label": "a 3F → a 3F",
        "wavelengthNm": 8059.06,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d2.5s2",
        "upperConfig": "4d2.5s2"
      },
      {
        "label": "a 3P → a 3F",
        "wavelengthNm": 2388.85,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d2.5s2",
        "upperConfig": "4d2.5s2"
      },
      {
        "label": "a 3P → a 3F",
        "wavelengthNm": 2382.74,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d2.5s2",
        "upperConfig": "4d2.5s2"
      }
    ]
  },
  "Nb": {
    "number": 41,
    "symbol": "Nb",
    "name": "Niobium",
    "groundTerm": "⁶D₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s1 4d4",
    "historicalContext": "Niobium was identified in 1801.",
    "physicalIdentity": "Niobium (Nb, atomic number Z = 41) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s1 4d4, yielding the spectroscopic ground term ⁶D₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "NIOBIUM (Z = 41)",
      "currentVal": "Neutral 41-electron atom · [Kr]5s1 4d4 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 6D → a 6D",
        "wavelengthNm": 64855.05,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d4.(5D).5s",
        "upperConfig": "4d4.(5D).5s"
      },
      {
        "label": "a 6D → a 6D",
        "wavelengthNm": 25510.85,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d4.(5D).5s",
        "upperConfig": "4d4.(5D).5s"
      },
      {
        "label": "a 6D → a 6D",
        "wavelengthNm": 14383.32,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d4.(5D).5s",
        "upperConfig": "4d4.(5D).5s"
      },
      {
        "label": "a 6D → a 6D",
        "wavelengthNm": 9521.45,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d4.(5D).5s",
        "upperConfig": "4d4.(5D).5s"
      }
    ]
  },
  "Mo": {
    "number": 42,
    "symbol": "Mo",
    "name": "Molybdenum",
    "groundTerm": "⁷S₃",
    "modelTier": "tierC",
    "valenceConfiguration": "5s1 4d5",
    "historicalContext": "Molybdenum was identified in 1778.",
    "physicalIdentity": "Molybdenum (Mo, atomic number Z = 42) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s1 4d5, yielding the spectroscopic ground term ⁷S₃.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "MOLYBDENUM (Z = 42)",
      "currentVal": "Neutral 42-electron atom · [Kr]5s1 4d5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 5S → a 7S",
        "wavelengthNm": 928.65,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.(6S).5s",
        "upperConfig": "4d5.(6S).5s"
      },
      {
        "label": "a 5D → a 7S",
        "wavelengthNm": 911.91,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.(6S).5s",
        "upperConfig": "4d4.5s2"
      },
      {
        "label": "a 5D → a 7S",
        "wavelengthNm": 897.44,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.(6S).5s",
        "upperConfig": "4d4.5s2"
      },
      {
        "label": "a 5D → a 7S",
        "wavelengthNm": 873.03,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.(6S).5s",
        "upperConfig": "4d4.5s2"
      }
    ]
  },
  "Tc": {
    "number": 43,
    "symbol": "Tc",
    "name": "Technetium",
    "groundTerm": "⁶S₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d5",
    "historicalContext": "Technetium was identified in 1937.",
    "physicalIdentity": "Technetium (Tc, atomic number Z = 43) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d5, yielding the spectroscopic ground term ⁶S₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TECHNETIUM (Z = 43)",
      "currentVal": "Neutral 43-electron atom · [Kr]5s2 4d5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "6D → 6S",
        "wavelengthNm": 3886.68,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.5s2",
        "upperConfig": "4d6.(5D).5s"
      },
      {
        "label": "6D → 6S",
        "wavelengthNm": 3076.06,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.5s2",
        "upperConfig": "4d6.(5D).5s"
      },
      {
        "label": "6D → 6S",
        "wavelengthNm": 2702.31,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.5s2",
        "upperConfig": "4d6.(5D).5s"
      },
      {
        "label": "6D → 6S",
        "wavelengthNm": 2498.39,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d5.5s2",
        "upperConfig": "4d6.(5D).5s"
      }
    ]
  },
  "Ru": {
    "number": 44,
    "symbol": "Ru",
    "name": "Ruthenium",
    "groundTerm": "⁵F₅",
    "modelTier": "tierC",
    "valenceConfiguration": "5s1 4d7",
    "historicalContext": "Ruthenium was identified in 1827.",
    "physicalIdentity": "Ruthenium (Ru, atomic number Z = 44) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s1 4d7, yielding the spectroscopic ground term ⁵F₅.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "RUTHENIUM (Z = 44)",
      "currentVal": "Neutral 44-electron atom · [Kr]5s1 4d7 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 5F → a 5F",
        "wavelengthNm": 8398.84,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d7.(a 4F).5s",
        "upperConfig": "4d7.(a 4F).5s"
      },
      {
        "label": "a 5F → a 5F",
        "wavelengthNm": 4781.17,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d7.(a 4F).5s",
        "upperConfig": "4d7.(a 4F).5s"
      },
      {
        "label": "a 5F → a 5F",
        "wavelengthNm": 3685.63,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d7.(a 4F).5s",
        "upperConfig": "4d7.(a 4F).5s"
      },
      {
        "label": "a 5F → a 5F",
        "wavelengthNm": 3220.1,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d7.(a 4F).5s",
        "upperConfig": "4d7.(a 4F).5s"
      }
    ]
  },
  "Rh": {
    "number": 45,
    "symbol": "Rh",
    "name": "Rhodium",
    "groundTerm": "⁴F₉ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s1 4d8",
    "historicalContext": "Rhodium was identified in 1803.",
    "physicalIdentity": "Rhodium (Rh, atomic number Z = 45) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s1 4d8, yielding the spectroscopic ground term ⁴F₉ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "RHODIUM (Z = 45)",
      "currentVal": "Neutral 45-electron atom · [Kr]5s1 4d8 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 6536.08,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d8.(3F).5s",
        "upperConfig": "4d8.(3F).5s"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 3849.07,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d8.(3F).5s",
        "upperConfig": "4d8.(3F).5s"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 2879.62,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d8.(3F).5s",
        "upperConfig": "4d8.(3F).5s"
      },
      {
        "label": "a 2D → a 4F",
        "wavelengthNm": 3021.28,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d8.(3F).5s",
        "upperConfig": "4d9"
      }
    ]
  },
  "Pd": {
    "number": 46,
    "symbol": "Pd",
    "name": "Palladium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "4d10",
    "historicalContext": "Palladium was identified in 1803.",
    "physicalIdentity": "Palladium (Pd, atomic number Z = 46) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]4d10, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PALLADIUM (Z = 46)",
      "currentVal": "Neutral 46-electron atom · [Kr]4d10 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2[5/2] → 1S",
        "wavelengthNm": 1523.43,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d10",
        "upperConfig": "4d9.(2D<5/2>).5s"
      },
      {
        "label": "2[5/2] → 1S",
        "wavelengthNm": 1289.49,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d10",
        "upperConfig": "4d9.(2D<5/2>).5s"
      },
      {
        "label": "2[3/2] → 1S",
        "wavelengthNm": 990.69,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d10",
        "upperConfig": "4d9.(2D<3/2>).5s"
      },
      {
        "label": "2[3/2] → 1S",
        "wavelengthNm": 853.11,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4d10",
        "upperConfig": "4d9.(2D<3/2>).5s"
      }
    ]
  },
  "Ag": {
    "number": 47,
    "symbol": "Ag",
    "name": "Silver",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s1 4d10",
    "historicalContext": "Silver has been known and utilized since antiquity.",
    "physicalIdentity": "Silver (Ag, atomic number Z = 47) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s1 4d10, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "COPPER (Z = 29)",
      "contrastVal": "3d¹⁰ 4s¹ valence · First coinage metal",
      "currentLabel": "SILVER (Z = 47)",
      "currentVal": "4d¹⁰ 5s¹ configuration · Highest electrical and thermal conductivity of any element"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2S",
        "wavelengthNm": 338.39,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s",
        "upperConfig": "4d10.5p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 328.16,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s",
        "upperConfig": "4d10.5p"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 330.66,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s",
        "upperConfig": "4d9.5s2"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 288.07,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s",
        "upperConfig": "4d9.5s2"
      }
    ]
  },
  "Cd": {
    "number": 48,
    "symbol": "Cd",
    "name": "Cadmium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d10",
    "historicalContext": "Cadmium was identified in 1817.",
    "physicalIdentity": "Cadmium (Cd, atomic number Z = 48) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d10, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "CADMIUM (Z = 48)",
      "currentVal": "Neutral 48-electron atom · [Kr]5s2 4d10 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 332.07,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s2",
        "upperConfig": "4d10.5s.5p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 326.2,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s2",
        "upperConfig": "4d10.5s.5p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 314.2,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s2",
        "upperConfig": "4d10.5s.5p"
      },
      {
        "label": "1P* → 1S",
        "wavelengthNm": 228.87,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "4d10.5s2",
        "upperConfig": "4d10.5s.5p"
      }
    ]
  },
  "In": {
    "number": 49,
    "symbol": "In",
    "name": "Indium",
    "groundTerm": "²P°₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d10 5p1",
    "historicalContext": "Indium was identified in 1863.",
    "physicalIdentity": "Indium (In, atomic number Z = 49) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d10 5p1, yielding the spectroscopic ground term ²P°₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "INDIUM (Z = 49)",
      "currentVal": "Neutral 49-electron atom · [Kr]5s2 4d10 5p1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 4519.57,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5s2.5p",
        "upperConfig": "5s2.5p"
      },
      {
        "label": "2S → 2P*",
        "wavelengthNm": 410.29,
        "region": "Visible",
        "color": "#818cf8",
        "status": "derived",
        "lowerConfig": "5s2.5p",
        "upperConfig": "5s2.6s"
      },
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 314.3,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5s2.5p",
        "upperConfig": "5s2.6p"
      },
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 311.38,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5s2.5p",
        "upperConfig": "5s2.6p"
      }
    ]
  },
  "Sn": {
    "number": 50,
    "symbol": "Sn",
    "name": "Tin",
    "groundTerm": "³P₀",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d10 5p2",
    "historicalContext": "Tin has been known and utilized since antiquity.",
    "physicalIdentity": "Tin (Sn, atomic number Z = 50) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d10 5p2, yielding the spectroscopic ground term ³P₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TIN (Z = 50)",
      "currentVal": "Neutral 50-electron atom · [Kr]5s2 4d10 5p2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 5910.84,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5s2.5p2",
        "upperConfig": "5s2.5p2"
      },
      {
        "label": "3P → 3P",
        "wavelengthNm": 2917.43,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5s2.5p2",
        "upperConfig": "5s2.5p2"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 1161.04,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5s2.5p2",
        "upperConfig": "5s2.5p2"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 582.67,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "5s2.5p2",
        "upperConfig": "5s2.5p2"
      }
    ]
  },
  "Sb": {
    "number": 51,
    "symbol": "Sb",
    "name": "Antimony",
    "groundTerm": "⁴S°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d10 5p3",
    "historicalContext": "Antimony has been known and utilized since antiquity.",
    "physicalIdentity": "Antimony (Sb, atomic number Z = 51) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d10 5p3, yielding the spectroscopic ground term ⁴S°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ANTIMONY (Z = 51)",
      "currentVal": "Neutral 51-electron atom · [Kr]5s2 4d10 5p3 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 1174.79,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5p3",
        "upperConfig": "5p3"
      },
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 1014.81,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5p3",
        "upperConfig": "5p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 609.93,
        "region": "Visible",
        "color": "#fb923c",
        "status": "derived",
        "lowerConfig": "5p3",
        "upperConfig": "5p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 541.59,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "5p3",
        "upperConfig": "5p3"
      }
    ]
  },
  "Te": {
    "number": 52,
    "symbol": "Te",
    "name": "Tellurium",
    "groundTerm": "³P₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d10 5p4",
    "historicalContext": "Tellurium was identified in 1782.",
    "physicalIdentity": "Tellurium (Te, atomic number Z = 52) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d10 5p4, yielding the spectroscopic ground term ³P₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TELLURIUM (Z = 52)",
      "currentVal": "Neutral 52-electron atom · [Kr]5s2 4d10 5p4 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 2124.72,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5p4",
        "upperConfig": "5p4"
      },
      {
        "label": "3P → 3P",
        "wavelengthNm": 2104.95,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5p4",
        "upperConfig": "5p4"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 947.16,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5p4",
        "upperConfig": "5p4"
      },
      {
        "label": "1S → 3P",
        "wavelengthNm": 431.06,
        "region": "Visible",
        "color": "#818cf8",
        "status": "derived",
        "lowerConfig": "5p4",
        "upperConfig": "5p4"
      }
    ]
  },
  "I": {
    "number": 53,
    "symbol": "I",
    "name": "Iodine",
    "groundTerm": "²P°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d10 5p5",
    "historicalContext": "Iodine was identified in 1811.",
    "physicalIdentity": "Iodine (I, atomic number Z = 53) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d10 5p5, yielding the spectroscopic ground term ²P°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "IODINE (Z = 53)",
      "currentVal": "Neutral 53-electron atom · [Kr]5s2 4d10 5p5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 1315.27,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5s2.5p5",
        "upperConfig": "5s2.5p5"
      },
      {
        "label": "2[2] → 2P*",
        "wavelengthNm": 183.04,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5s2.5p5",
        "upperConfig": "5s2.5p4.(3P<2>).6s"
      },
      {
        "label": "2[2] → 2P*",
        "wavelengthNm": 178.28,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5s2.5p5",
        "upperConfig": "5s2.5p4.(3P<2>).6s"
      },
      {
        "label": "2[0] → 2P*",
        "wavelengthNm": 164.21,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5s2.5p5",
        "upperConfig": "5s2.5p4.(3P<0>).6s"
      }
    ]
  },
  "Xe": {
    "number": 54,
    "symbol": "Xe",
    "name": "Xenon",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "5s2 4d10 5p6",
    "historicalContext": "Xenon was identified in 1898.",
    "physicalIdentity": "Xenon (Xe, atomic number Z = 54) is a period-5 element characterized by 4d and 5p electron configurations, significant spin-orbit splittings, and diverse oxidation states. The neutral atom ground state configuration is [Kr]5s2 4d10 5p6, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "XENON (Z = 54)",
      "currentVal": "Neutral 54-electron atom · [Kr]5s2 4d10 5p6 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 149.1,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5p6",
        "upperConfig": "5p5.(2P*<3/2>).6s"
      },
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 146.96,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5p6",
        "upperConfig": "5p5.(2P*<3/2>).6s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 131.24,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5p6",
        "upperConfig": "5p5.(2P*<1/2>).6s"
      },
      {
        "label": "2[1/2]* → 1S",
        "wavelengthNm": 129.56,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5p6",
        "upperConfig": "5p5.(2P*<1/2>).6s"
      }
    ]
  },
  "Cs": {
    "number": 55,
    "symbol": "Cs",
    "name": "Caesium",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s1",
    "historicalContext": "Caesium was identified in 1860.",
    "physicalIdentity": "Caesium (Cs, atomic number Z = 55) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s1, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "CAESIUM (Z = 55)",
      "currentVal": "Neutral 55-electron atom · [Xe]6s1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2S",
        "wavelengthNm": 894.59,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5p6.6s",
        "upperConfig": "5p6.6p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 852.35,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5p6.6s",
        "upperConfig": "5p6.6p"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 689.69,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "5p6.6s",
        "upperConfig": "5p6.5d"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 685.08,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "5p6.6s",
        "upperConfig": "5p6.5d"
      }
    ]
  },
  "Ba": {
    "number": 56,
    "symbol": "Ba",
    "name": "Barium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2",
    "historicalContext": "Barium was identified in 1808.",
    "physicalIdentity": "Barium (Ba, atomic number Z = 56) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "BARIUM (Z = 56)",
      "currentVal": "Neutral 56-electron atom · [Xe]6s2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3D → 1S",
        "wavelengthNm": 1106.93,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6s2",
        "upperConfig": "6s.5d"
      },
      {
        "label": "3D → 1S",
        "wavelengthNm": 1085.13,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6s2",
        "upperConfig": "6s.5d"
      },
      {
        "label": "3D → 1S",
        "wavelengthNm": 1042.04,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6s2",
        "upperConfig": "6s.5d"
      },
      {
        "label": "1D → 1S",
        "wavelengthNm": 877.55,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6s2",
        "upperConfig": "6s.5d"
      }
    ]
  },
  "La": {
    "number": 57,
    "symbol": "La",
    "name": "Lanthanum",
    "groundTerm": "²D₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 5d1",
    "historicalContext": "Lanthanum was identified in 1839.",
    "physicalIdentity": "Lanthanum (La, atomic number Z = 57) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 5d1, yielding the spectroscopic ground term ²D₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "LANTHANUM (Z = 57)",
      "currentVal": "Neutral 57-electron atom · [Xe]6s2 5d1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D → 2D",
        "wavelengthNm": 9495.2,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "5d.6s2"
      },
      {
        "label": "4F → 2D",
        "wavelengthNm": 3747.86,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "5d2.(3F).6s"
      },
      {
        "label": "4F → 2D",
        "wavelengthNm": 3322.26,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "5d2.(3F).6s"
      },
      {
        "label": "4F → 2D",
        "wavelengthNm": 2861.62,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "5d2.(3F).6s"
      }
    ]
  },
  "Ce": {
    "number": 58,
    "symbol": "Ce",
    "name": "Cerium",
    "groundTerm": "¹G°₄",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f1 5d1",
    "historicalContext": "Cerium was identified in 1803.",
    "physicalIdentity": "Cerium (Ce, atomic number Z = 58) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f1 5d1, yielding the spectroscopic ground term ¹G°₄.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "CERIUM (Z = 58)",
      "currentVal": "Neutral 58-electron atom · [Xe]6s2 4f1 5d1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3F* → 1G*",
        "wavelengthNm": 43696.94,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f.5d.6s2",
        "upperConfig": "4f.5d.6s2"
      },
      {
        "label": "3F* → 1G*",
        "wavelengthNm": 6012.8,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f.5d.6s2",
        "upperConfig": "4f.5d.6s2"
      },
      {
        "label": "3F* → 1G*",
        "wavelengthNm": 3225.65,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f.5d.6s2",
        "upperConfig": "4f.5d.6s2"
      },
      {
        "label": "3H* → 1G*",
        "wavelengthNm": 7816.02,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f.5d.6s2",
        "upperConfig": "4f.5d.6s2"
      }
    ]
  },
  "Pr": {
    "number": 59,
    "symbol": "Pr",
    "name": "Praseodymium",
    "groundTerm": "⁴I°₉ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f3",
    "historicalContext": "Praseodymium was identified in 1885.",
    "physicalIdentity": "Praseodymium (Pr, atomic number Z = 59) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f3, yielding the spectroscopic ground term ⁴I°₉ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PRASEODYMIUM (Z = 59)",
      "currentVal": "Neutral 59-electron atom · [Xe]6s2 4f3 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "4I* → 4I*",
        "wavelengthNm": 7264.27,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f3.6s2",
        "upperConfig": "4f3.6s2"
      },
      {
        "label": "4I* → 4I*",
        "wavelengthNm": 3512.78,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f3.6s2",
        "upperConfig": "4f3.6s2"
      },
      {
        "label": "4I* → 4I*",
        "wavelengthNm": 2282.53,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f3.6s2",
        "upperConfig": "4f3.6s2"
      },
      {
        "label": "4I → 4I*",
        "wavelengthNm": 2256.21,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f3.6s2",
        "upperConfig": "4f2.(3H).5d.6s2"
      }
    ]
  },
  "Nd": {
    "number": 60,
    "symbol": "Nd",
    "name": "Neodymium",
    "groundTerm": "⁵I₄",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f4",
    "historicalContext": "Neodymium was identified in 1885.",
    "physicalIdentity": "Neodymium (Nd, atomic number Z = 60) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f4, yielding the spectroscopic ground term ⁵I₄.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "NEODYMIUM (Z = 60)",
      "currentVal": "Neutral 60-electron atom · [Xe]6s2 4f4 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "5I → 5I",
        "wavelengthNm": 8864.81,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f4.6s2",
        "upperConfig": "4f4.6s2"
      },
      {
        "label": "5I → 5I",
        "wavelengthNm": 4225.48,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f4.6s2",
        "upperConfig": "4f4.6s2"
      },
      {
        "label": "5I → 5I",
        "wavelengthNm": 2716.14,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f4.6s2",
        "upperConfig": "4f4.6s2"
      },
      {
        "label": "5I → 5I",
        "wavelengthNm": 1980.75,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f4.6s2",
        "upperConfig": "4f4.6s2"
      }
    ]
  },
  "Pm": {
    "number": 61,
    "symbol": "Pm",
    "name": "Promethium",
    "groundTerm": "⁶H°₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f5",
    "historicalContext": "Promethium was identified in 1945.",
    "physicalIdentity": "Promethium (Pm, atomic number Z = 61) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f5, yielding the spectroscopic ground term ⁶H°₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PROMETHIUM (Z = 61)",
      "currentVal": "Neutral 61-electron atom · [Xe]6s2 4f5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "6H* → 6H*",
        "wavelengthNm": 12440.6,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f5.6s2",
        "upperConfig": "4f5.6s2"
      },
      {
        "label": "6H* → 6H*",
        "wavelengthNm": 5718.27,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f5.6s2",
        "upperConfig": "4f5.6s2"
      },
      {
        "label": "6H* → 6H*",
        "wavelengthNm": 3575.13,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f5.6s2",
        "upperConfig": "4f5.6s2"
      },
      {
        "label": "6H* → 6H*",
        "wavelengthNm": 2551.65,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f5.6s2",
        "upperConfig": "4f5.6s2"
      }
    ]
  },
  "Sm": {
    "number": 62,
    "symbol": "Sm",
    "name": "Samarium",
    "groundTerm": "⁷F₀",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f6",
    "historicalContext": "Samarium was identified in 1879.",
    "physicalIdentity": "Samarium (Sm, atomic number Z = 62) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f6, yielding the spectroscopic ground term ⁷F₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "SAMARIUM (Z = 62)",
      "currentVal": "Neutral 62-electron atom · [Xe]6s2 4f6 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "7F → 7F",
        "wavelengthNm": 34178.69,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f6.6s2",
        "upperConfig": "4f6.6s2"
      },
      {
        "label": "7F → 7F",
        "wavelengthNm": 12316.48,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f6.6s2",
        "upperConfig": "4f6.6s2"
      },
      {
        "label": "7F → 7F",
        "wavelengthNm": 6713.44,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f6.6s2",
        "upperConfig": "4f6.6s2"
      },
      {
        "label": "7F → 7F",
        "wavelengthNm": 4399.3,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f6.6s2",
        "upperConfig": "4f6.6s2"
      }
    ]
  },
  "Eu": {
    "number": 63,
    "symbol": "Eu",
    "name": "Europium",
    "groundTerm": "⁸S°₇ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f7",
    "historicalContext": "Europium was identified in 1901.",
    "physicalIdentity": "Europium (Eu, atomic number Z = 63) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f7, yielding the spectroscopic ground term ⁸S°₇ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "EUROPIUM (Z = 63)",
      "currentVal": "Neutral 63-electron atom · [Xe]6s2 4f7 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 10D* → a 8S*",
        "wavelengthNm": 773.77,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.6s2",
        "upperConfig": "4f7.(8S*).5d (9D*).6s"
      },
      {
        "label": "a 10D* → a 8S*",
        "wavelengthNm": 766.35,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.6s2",
        "upperConfig": "4f7.(8S*).5d (9D*).6s"
      },
      {
        "label": "a 10D* → a 8S*",
        "wavelengthNm": 756.31,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.6s2",
        "upperConfig": "4f7.(8S*).5d (9D*).6s"
      },
      {
        "label": "a 10D* → a 8S*",
        "wavelengthNm": 743.1,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.6s2",
        "upperConfig": "4f7.(8S*).5d (9D*).6s"
      }
    ]
  },
  "Gd": {
    "number": 64,
    "symbol": "Gd",
    "name": "Gadolinium",
    "groundTerm": "9D°₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f7 5d1",
    "historicalContext": "Gadolinium was identified in 1880.",
    "physicalIdentity": "Gadolinium (Gd, atomic number Z = 64) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f7 5d1, yielding the spectroscopic ground term 9D°₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "GADOLINIUM (Z = 64)",
      "currentVal": "Neutral 64-electron atom · [Xe]6s2 4f7 5d1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "9D* → 9D*",
        "wavelengthNm": 46484.82,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.(8S*).5d.6s2",
        "upperConfig": "4f7.(8S*).5d.6s2"
      },
      {
        "label": "9D* → 9D*",
        "wavelengthNm": 18762.54,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.(8S*).5d.6s2",
        "upperConfig": "4f7.(8S*).5d.6s2"
      },
      {
        "label": "9D* → 9D*",
        "wavelengthNm": 10008.8,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.(8S*).5d.6s2",
        "upperConfig": "4f7.(8S*).5d.6s2"
      },
      {
        "label": "9D* → 9D*",
        "wavelengthNm": 5817.04,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f7.(8S*).5d.6s2",
        "upperConfig": "4f7.(8S*).5d.6s2"
      }
    ]
  },
  "Tb": {
    "number": 65,
    "symbol": "Tb",
    "name": "Terbium",
    "groundTerm": "⁶H°₁₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f9",
    "historicalContext": "Terbium was identified in 1843.",
    "physicalIdentity": "Terbium (Tb, atomic number Z = 65) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f9, yielding the spectroscopic ground term ⁶H°₁₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TERBIUM (Z = 65)",
      "currentVal": "Neutral 65-electron atom · [Xe]6s2 4f9 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "6H* → 6H*",
        "wavelengthNm": 3607.93,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f9.6s2",
        "upperConfig": "4f9.6s2"
      },
      {
        "label": "6H* → 6H*",
        "wavelengthNm": 2141.12,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f9.6s2",
        "upperConfig": "4f9.6s2"
      },
      {
        "label": "6H* → 6H*",
        "wavelengthNm": 1619.45,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f9.6s2",
        "upperConfig": "4f9.6s2"
      },
      {
        "label": "8G → 6H*",
        "wavelengthNm": 35026.27,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f9.6s2",
        "upperConfig": "4f8.(7F).5d.6s2"
      }
    ]
  },
  "Dy": {
    "number": 66,
    "symbol": "Dy",
    "name": "Dysprosium",
    "groundTerm": "⁵I₈",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f10",
    "historicalContext": "Dysprosium was identified in 1886.",
    "physicalIdentity": "Dysprosium (Dy, atomic number Z = 66) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f10, yielding the spectroscopic ground term ⁵I₈.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "DYSPROSIUM (Z = 66)",
      "currentVal": "Neutral 66-electron atom · [Xe]6s2 4f10 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "5I → 5I",
        "wavelengthNm": 2418.83,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f10.6s2",
        "upperConfig": "4f10.6s2"
      },
      {
        "label": "5I → 5I",
        "wavelengthNm": 1418.32,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f10.6s2",
        "upperConfig": "4f10.6s2"
      },
      {
        "label": "5I → 5I",
        "wavelengthNm": 1085.59,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f10.6s2",
        "upperConfig": "4f10.6s2"
      },
      {
        "label": "5I → 5I",
        "wavelengthNm": 915.31,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f10.6s2",
        "upperConfig": "4f10.6s2"
      }
    ]
  },
  "Ho": {
    "number": 67,
    "symbol": "Ho",
    "name": "Holmium",
    "groundTerm": "⁴I°₁₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f11",
    "historicalContext": "Holmium was identified in 1878.",
    "physicalIdentity": "Holmium (Ho, atomic number Z = 67) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f11, yielding the spectroscopic ground term ⁴I°₁₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "HOLMIUM (Z = 67)",
      "currentVal": "Neutral 67-electron atom · [Xe]6s2 4f11 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "4I* → 4I*",
        "wavelengthNm": 1845.12,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f11.6s2",
        "upperConfig": "4f11.6s2"
      },
      {
        "label": "4I* → 4I*",
        "wavelengthNm": 1162.09,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f11.6s2",
        "upperConfig": "4f11.6s2"
      },
      {
        "label": "4I* → 4I*",
        "wavelengthNm": 934.95,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f11.6s2",
        "upperConfig": "4f11.6s2"
      },
      {
        "label": "(8,3/2) → 4I*",
        "wavelengthNm": 1193.47,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f11.6s2",
        "upperConfig": "4f10.(5I<8>).5d<3/2>.6s2"
      }
    ]
  },
  "Er": {
    "number": 68,
    "symbol": "Er",
    "name": "Erbium",
    "groundTerm": "³H₆",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f12",
    "historicalContext": "Erbium was identified in 1843.",
    "physicalIdentity": "Erbium (Er, atomic number Z = 68) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f12, yielding the spectroscopic ground term ³H₆.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ERBIUM (Z = 68)",
      "currentVal": "Neutral 68-electron atom · [Xe]6s2 4f12 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3H → 3H",
        "wavelengthNm": 1437.13,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f12.6s2",
        "upperConfig": "4f12.6s2"
      },
      {
        "label": "3H → 3H",
        "wavelengthNm": 930.15,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f12.6s2",
        "upperConfig": "4f12.6s2"
      },
      {
        "label": "3F → 3H",
        "wavelengthNm": 1986.02,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f12.6s2",
        "upperConfig": "4f12.6s2"
      },
      {
        "label": "3F → 3H",
        "wavelengthNm": 807.92,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f12.6s2",
        "upperConfig": "4f12.6s2"
      }
    ]
  },
  "Tm": {
    "number": 69,
    "symbol": "Tm",
    "name": "Thulium",
    "groundTerm": "²F°₇ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f13",
    "historicalContext": "Thulium was identified in 1879.",
    "physicalIdentity": "Thulium (Tm, atomic number Z = 69) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f13, yielding the spectroscopic ground term ²F°₇ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "THULIUM (Z = 69)",
      "currentVal": "Neutral 69-electron atom · [Xe]6s2 4f13 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2F* → 2F*",
        "wavelengthNm": 1140.09,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f13.(2F*).6s2",
        "upperConfig": "4f13.(2F*).6s2"
      },
      {
        "label": "(6,3/2) → 2F*",
        "wavelengthNm": 762.22,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "4f13.(2F*).6s2",
        "upperConfig": "4f12.(3H<6>).5d<3/2>.6s2"
      },
      {
        "label": "(6,3/2) → 2F*",
        "wavelengthNm": 654.84,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "4f13.(2F*).6s2",
        "upperConfig": "4f12.(3H<6>).5d<3/2>.6s2"
      },
      {
        "label": "(6,3/2) → 2F*",
        "wavelengthNm": 641.53,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "4f13.(2F*).6s2",
        "upperConfig": "4f12.(3H<6>).5d<3/2>.6s2"
      }
    ]
  },
  "Yb": {
    "number": 70,
    "symbol": "Yb",
    "name": "Ytterbium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14",
    "historicalContext": "Ytterbium was identified in 1878.",
    "physicalIdentity": "Ytterbium (Yb, atomic number Z = 70) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "YTTERBIUM (Z = 70)",
      "currentVal": "Neutral 70-electron atom · [Xe]6s2 4f14 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 578.42,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "4f14.6s2",
        "upperConfig": "4f14.6s.6p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 555.8,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "4f14.6s2",
        "upperConfig": "4f14.6s.6p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 507.35,
        "region": "Visible",
        "color": "#34d399",
        "status": "derived",
        "lowerConfig": "4f14.6s2",
        "upperConfig": "4f14.6s.6p"
      },
      {
        "label": "(7/2,3/2)* → 1S",
        "wavelengthNm": 431.25,
        "region": "Visible",
        "color": "#818cf8",
        "status": "derived",
        "lowerConfig": "4f14.6s2",
        "upperConfig": "4f13.(2F*<7/2>).5d<3/2>.6s2"
      }
    ]
  },
  "Lu": {
    "number": 71,
    "symbol": "Lu",
    "name": "Lutetium",
    "groundTerm": "²D₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d1",
    "historicalContext": "Lutetium was identified in 1907.",
    "physicalIdentity": "Lutetium (Lu, atomic number Z = 71) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d1, yielding the spectroscopic ground term ²D₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "LUTETIUM (Z = 71)",
      "currentVal": "Neutral 71-electron atom · [Xe]6s2 4f14 5d1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D → 2D",
        "wavelengthNm": 5015.25,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "5d.6s2"
      },
      {
        "label": "2P* → 2D",
        "wavelengthNm": 2417.72,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "6s2.6p"
      },
      {
        "label": "2P* → 2D",
        "wavelengthNm": 1337.54,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "6s2.6p"
      },
      {
        "label": "4F* → 2D",
        "wavelengthNm": 573.81,
        "region": "Visible",
        "color": "#fbbf24",
        "status": "derived",
        "lowerConfig": "5d.6s2",
        "upperConfig": "5d.6s.(3D).6p"
      }
    ]
  },
  "Hf": {
    "number": 72,
    "symbol": "Hf",
    "name": "Hafnium",
    "groundTerm": "³F₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d2",
    "historicalContext": "Hafnium was identified in 1923.",
    "physicalIdentity": "Hafnium (Hf, atomic number Z = 72) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d2, yielding the spectroscopic ground term ³F₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "HAFNIUM (Z = 72)",
      "currentVal": "Neutral 72-electron atom · [Xe]6s2 4f14 5d2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 3F → a 3F",
        "wavelengthNm": 4243.27,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d2.6s2",
        "upperConfig": "5d2.6s2"
      },
      {
        "label": "a 3F → a 3F",
        "wavelengthNm": 2189.31,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d2.6s2",
        "upperConfig": "5d2.6s2"
      },
      {
        "label": "a 3P → a 3F",
        "wavelengthNm": 1811.01,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d2.6s2",
        "upperConfig": "5d2.6s2"
      },
      {
        "label": "a 3P → a 3F",
        "wavelengthNm": 1521.48,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d2.6s2",
        "upperConfig": "5d2.6s2"
      }
    ]
  },
  "Ta": {
    "number": 73,
    "symbol": "Ta",
    "name": "Tantalum",
    "groundTerm": "⁴F₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d3",
    "historicalContext": "Tantalum was identified in 1802.",
    "physicalIdentity": "Tantalum (Ta, atomic number Z = 73) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d3, yielding the spectroscopic ground term ⁴F₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TANTALUM (Z = 73)",
      "currentVal": "Neutral 73-electron atom · [Xe]6s2 4f14 5d3 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 4974.88,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d3.6s2",
        "upperConfig": "5d3.6s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 2522.76,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d3.6s2",
        "upperConfig": "5d3.6s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 1779.03,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d3.6s2",
        "upperConfig": "5d3.6s2"
      },
      {
        "label": "a 4P → a 4F",
        "wavelengthNm": 1653.05,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d3.6s2",
        "upperConfig": "5d3.6s2"
      }
    ]
  },
  "W": {
    "number": 74,
    "symbol": "W",
    "name": "Tungsten",
    "groundTerm": "⁵D₀",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d4",
    "historicalContext": "Tungsten was identified in 1783.",
    "physicalIdentity": "Tungsten (W, atomic number Z = 74) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d4, yielding the spectroscopic ground term ⁵D₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TUNGSTEN (Z = 74)",
      "currentVal": "Neutral 74-electron atom · [Xe]6s2 4f14 5d4 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "5D → 5D",
        "wavelengthNm": 5986.98,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d4.6s2",
        "upperConfig": "5d4.6s2"
      },
      {
        "label": "5D → 5D",
        "wavelengthNm": 3007.04,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d4.6s2",
        "upperConfig": "5d4.6s2"
      },
      {
        "label": "5D → 5D",
        "wavelengthNm": 2070.39,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d4.6s2",
        "upperConfig": "5d4.6s2"
      },
      {
        "label": "5D → 5D",
        "wavelengthNm": 1607.89,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d4.6s2",
        "upperConfig": "5d4.6s2"
      }
    ]
  },
  "Re": {
    "number": 75,
    "symbol": "Re",
    "name": "Rhenium",
    "groundTerm": "⁶S₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d5",
    "historicalContext": "Rhenium was identified in 1925.",
    "physicalIdentity": "Rhenium (Re, atomic number Z = 75) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d5, yielding the spectroscopic ground term ⁶S₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "RHENIUM (Z = 75)",
      "currentVal": "Neutral 75-electron atom · [Xe]6s2 4f14 5d5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 4P → a 6S",
        "wavelengthNm": 863.26,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d5.6s2",
        "upperConfig": "5d5.6s2"
      },
      {
        "label": "a 4P → a 6S",
        "wavelengthNm": 723.27,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "5d5.6s2",
        "upperConfig": "5d5.6s2"
      },
      {
        "label": "a 4P → a 6S",
        "wavelengthNm": 659.37,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "5d5.6s2",
        "upperConfig": "5d5.6s2"
      },
      {
        "label": "a 6D → a 6S",
        "wavelengthNm": 850.74,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d5.6s2",
        "upperConfig": "5d6.(5D).6s"
      }
    ]
  },
  "Os": {
    "number": 76,
    "symbol": "Os",
    "name": "Osmium",
    "groundTerm": "⁵D₄",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d6",
    "historicalContext": "Osmium was identified in 1803.",
    "physicalIdentity": "Osmium (Os, atomic number Z = 76) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d6, yielding the spectroscopic ground term ⁵D₄.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "OSMIUM (Z = 76)",
      "currentVal": "Neutral 76-electron atom · [Xe]6s2 4f14 5d6 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 3648.98,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d6.6s2",
        "upperConfig": "5d6.6s2"
      },
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 2404.24,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d6.6s2",
        "upperConfig": "5d6.6s2"
      },
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 1734.26,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d6.6s2",
        "upperConfig": "5d6.6s2"
      },
      {
        "label": "a 5D → a 5D",
        "wavelengthNm": 1641.28,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d6.6s2",
        "upperConfig": "5d6.6s2"
      }
    ]
  },
  "Ir": {
    "number": 77,
    "symbol": "Ir",
    "name": "Iridium",
    "groundTerm": "⁴F₉ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d7",
    "historicalContext": "Iridium was identified in 1803.",
    "physicalIdentity": "Iridium (Ir, atomic number Z = 77) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d7, yielding the spectroscopic ground term ⁴F₉ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "IRIDIUM (Z = 77)",
      "currentVal": "Neutral 77-electron atom · [Xe]6s2 4f14 5d7 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 2451.62,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d7.6s2",
        "upperConfig": "5d7.6s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 1728.72,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d7.6s2",
        "upperConfig": "5d7.6s2"
      },
      {
        "label": "a 4F → a 4F",
        "wavelengthNm": 1581.3,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d7.6s2",
        "upperConfig": "5d7.6s2"
      },
      {
        "label": "b 4F → a 4F",
        "wavelengthNm": 3527.36,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d7.6s2",
        "upperConfig": "5d8.(3F).6s"
      }
    ]
  },
  "Pt": {
    "number": 78,
    "symbol": "Pt",
    "name": "Platinum",
    "groundTerm": "³D₃",
    "modelTier": "tierC",
    "valenceConfiguration": "6s1 4f14 5d9",
    "historicalContext": "Platinum was identified in 1735.",
    "physicalIdentity": "Platinum (Pt, atomic number Z = 78) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s1 4f14 5d9, yielding the spectroscopic ground term ³D₃.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PLATINUM (Z = 78)",
      "currentVal": "Neutral 78-electron atom · [Xe]6s1 4f14 5d9 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3D → 3D",
        "wavelengthNm": 1522.66,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d9.6s",
        "upperConfig": "5d9.6s"
      },
      {
        "label": "3D → 3D",
        "wavelengthNm": 986.98,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d9.6s",
        "upperConfig": "5d9.6s"
      },
      {
        "label": "a 1D → 3D",
        "wavelengthNm": 12888.66,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d9.6s",
        "upperConfig": "5d9.6s"
      },
      {
        "label": "3F → 3D",
        "wavelengthNm": 12140.92,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d9.6s",
        "upperConfig": "5d8.6s2"
      }
    ]
  },
  "Au": {
    "number": 79,
    "symbol": "Au",
    "name": "Gold",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s1 4f14 5d10",
    "historicalContext": "Gold has been known and utilized since antiquity.",
    "physicalIdentity": "Gold (Au, atomic number Z = 79) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s1 4f14 5d10, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "SILVER (Z = 47)",
      "contrastVal": "4d¹⁰ 5s¹ · White reflective optical luster",
      "currentLabel": "GOLD (Z = 79)",
      "currentVal": "Relativistic contraction of 6s & 5d expansion · Characteristic yellow optical absorption"
    },
    "landmarkLines": [
      {
        "label": "2D → 2S",
        "wavelengthNm": 1091.56,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "5d10.6s",
        "upperConfig": "5d9.6s2"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 466.52,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "5d10.6s",
        "upperConfig": "5d9.6s2"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 267.67,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5d10.6s",
        "upperConfig": "5d10.6p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 242.87,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5d10.6s",
        "upperConfig": "5d10.6p"
      }
    ]
  },
  "Hg": {
    "number": 80,
    "symbol": "Hg",
    "name": "Mercury",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d10",
    "historicalContext": "Mercury has been known and utilized since antiquity.",
    "physicalIdentity": "Mercury (Hg, atomic number Z = 80) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d10, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "GOLD (Z = 79)",
      "contrastVal": "6s¹ valence · Malleable solid metal",
      "currentLabel": "MERCURY (Z = 80)",
      "currentVal": "Relativistic 6s² inert pair contraction · Liquid state at standard temperature"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 265.64,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5d10.6s2",
        "upperConfig": "5d10.6s.6p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 253.73,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5d10.6s2",
        "upperConfig": "5d10.6s.6p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 227.05,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5d10.6s2",
        "upperConfig": "5d10.6s.6p"
      },
      {
        "label": "1P* → 1S",
        "wavelengthNm": 184.95,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "5d10.6s2",
        "upperConfig": "5d10.6s.6p"
      }
    ]
  },
  "Tl": {
    "number": 81,
    "symbol": "Tl",
    "name": "Thallium",
    "groundTerm": "²P°₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d10 6p1",
    "historicalContext": "Thallium was identified in 1861.",
    "physicalIdentity": "Thallium (Tl, atomic number Z = 81) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d10 6p1, yielding the spectroscopic ground term ²P°₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "THALLIUM (Z = 81)",
      "currentVal": "Neutral 81-electron atom · [Xe]6s2 4f14 5d10 6p1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 1283.25,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6s2.6p",
        "upperConfig": "6s2.6p"
      },
      {
        "label": "2S → 2P*",
        "wavelengthNm": 377.68,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6s2.6p",
        "upperConfig": "6s2.7s"
      },
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 292.74,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6s2.6p",
        "upperConfig": "6s2.7p"
      },
      {
        "label": "2P* → 2P*",
        "wavelengthNm": 284.41,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6s2.6p",
        "upperConfig": "6s2.7p"
      }
    ]
  },
  "Pb": {
    "number": 82,
    "symbol": "Pb",
    "name": "Lead",
    "groundTerm": "(1/2,1/2)₀",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d10 6p2",
    "historicalContext": "Lead has been known and utilized since antiquity.",
    "physicalIdentity": "Lead (Pb, atomic number Z = 82) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d10 6p2, yielding the spectroscopic ground term (1/2,1/2)₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "LEAD (Z = 82)",
      "currentVal": "Neutral 82-electron atom · [Xe]6s2 4f14 5d10 6p2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "(3/2,1/2) → (1/2,1/2)",
        "wavelengthNm": 1278.89,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6s2.6p2",
        "upperConfig": "6s2.6p2"
      },
      {
        "label": "(3/2,1/2) → (1/2,1/2)",
        "wavelengthNm": 938.94,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6s2.6p2",
        "upperConfig": "6s2.6p2"
      },
      {
        "label": "(3/2,3/2) → (1/2,1/2)",
        "wavelengthNm": 466.03,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "6s2.6p2",
        "upperConfig": "6s2.6p2"
      },
      {
        "label": "(3/2,3/2) → (1/2,1/2)",
        "wavelengthNm": 339.36,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6s2.6p2",
        "upperConfig": "6s2.6p2"
      }
    ]
  },
  "Bi": {
    "number": 83,
    "symbol": "Bi",
    "name": "Bismuth",
    "groundTerm": "⁴S°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d10 6p3",
    "historicalContext": "Bismuth was identified in 1753.",
    "physicalIdentity": "Bismuth (Bi, atomic number Z = 83) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d10 6p3, yielding the spectroscopic ground term ⁴S°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "BISMUTH (Z = 83)",
      "currentVal": "Neutral 83-electron atom · [Xe]6s2 4f14 5d10 6p3 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 875.73,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6p3",
        "upperConfig": "6p3"
      },
      {
        "label": "2D* → 4S*",
        "wavelengthNm": 647.77,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "6p3",
        "upperConfig": "6p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 461.66,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "6p3",
        "upperConfig": "6p3"
      },
      {
        "label": "2P* → 4S*",
        "wavelengthNm": 301.52,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p3",
        "upperConfig": "6p3"
      }
    ]
  },
  "Po": {
    "number": 84,
    "symbol": "Po",
    "name": "Polonium",
    "groundTerm": "³P₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d10 6p4",
    "historicalContext": "Polonium was identified in 1898.",
    "physicalIdentity": "Polonium (Po, atomic number Z = 84) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d10 6p4, yielding the spectroscopic ground term ³P₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "POLONIUM (Z = 84)",
      "currentVal": "Neutral 84-electron atom · [Xe]6s2 4f14 5d10 6p4 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P → 3P",
        "wavelengthNm": 1330.73,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6p4",
        "upperConfig": "6p4"
      },
      {
        "label": "3P → 3P",
        "wavelengthNm": 594.12,
        "region": "Visible",
        "color": "#fb923c",
        "status": "derived",
        "lowerConfig": "6p4",
        "upperConfig": "6p4"
      },
      {
        "label": "1D → 3P",
        "wavelengthNm": 461.27,
        "region": "Visible",
        "color": "#38bdf8",
        "status": "derived",
        "lowerConfig": "6p4",
        "upperConfig": "6p4"
      },
      {
        "label": "5S* → 3P",
        "wavelengthNm": 255.88,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p4",
        "upperConfig": "6p3.(4S*).7s"
      }
    ]
  },
  "At": {
    "number": 85,
    "symbol": "At",
    "name": "Astatine",
    "groundTerm": "²P°₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d10 6p5",
    "historicalContext": "Astatine was identified in 1940.",
    "physicalIdentity": "Astatine (At, atomic number Z = 85) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d10 6p5, yielding the spectroscopic ground term ²P°₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ASTATINE (Z = 85)",
      "currentVal": "Neutral 85-electron atom · [Xe]6s2 4f14 5d10 6p5 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "4P → 2P*",
        "wavelengthNm": 224.47,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p5",
        "upperConfig": "6p4.(3P).7s"
      },
      {
        "label": "4P → 2P*",
        "wavelengthNm": 216.29,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p5",
        "upperConfig": "6p4.(3P).7s"
      }
    ]
  },
  "Rn": {
    "number": 86,
    "symbol": "Rn",
    "name": "Radon",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "6s2 4f14 5d10 6p6",
    "historicalContext": "Radon was identified in 1900.",
    "physicalIdentity": "Radon (Rn, atomic number Z = 86) is a heavy period-6 element where relativistic contraction of s-orbitals, expansion of d/f-orbitals, and substantial spin-orbit coupling profoundly alter electronic structure. The neutral atom ground state configuration is [Xe]6s2 4f14 5d10 6p6, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "RADON (Z = 86)",
      "currentVal": "Neutral 86-electron atom · [Xe]6s2 4f14 5d10 6p6 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 183.08,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p6",
        "upperConfig": "6p5.(2P*<3/2>).7s"
      },
      {
        "label": "2[3/2]* → 1S",
        "wavelengthNm": 178.61,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p6",
        "upperConfig": "6p5.(2P*<3/2>).7s"
      },
      {
        "label": "2[1/2] → 1S",
        "wavelengthNm": 150.95,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p6",
        "upperConfig": "6p5.(2P*<3/2>).7p"
      },
      {
        "label": "2[1/2] → 1S",
        "wavelengthNm": 143.38,
        "region": "Ultraviolet",
        "color": "#93c5fd",
        "status": "derived",
        "lowerConfig": "6p6",
        "upperConfig": "6p5.(2P*<3/2>).7p"
      }
    ]
  },
  "Fr": {
    "number": 87,
    "symbol": "Fr",
    "name": "Francium",
    "groundTerm": "²S₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s1",
    "historicalContext": "Francium was identified in 1939.",
    "physicalIdentity": "Francium (Fr, atomic number Z = 87) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s1, yielding the spectroscopic ground term ²S₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "FRANCIUM (Z = 87)",
      "currentVal": "Neutral 87-electron atom · [Rn]7s1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2P* → 2S",
        "wavelengthNm": 817.17,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "7s",
        "upperConfig": "7p"
      },
      {
        "label": "2P* → 2S",
        "wavelengthNm": 718.18,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "7s",
        "upperConfig": "7p"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 616.15,
        "region": "Visible",
        "color": "#fb923c",
        "status": "derived",
        "lowerConfig": "7s",
        "upperConfig": "6d"
      },
      {
        "label": "2D → 2S",
        "wavelengthNm": 608.66,
        "region": "Visible",
        "color": "#fb923c",
        "status": "derived",
        "lowerConfig": "7s",
        "upperConfig": "6d"
      }
    ]
  },
  "Ra": {
    "number": 88,
    "symbol": "Ra",
    "name": "Radium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2",
    "historicalContext": "Radium was identified in 1898.",
    "physicalIdentity": "Radium (Ra, atomic number Z = 88) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "RADIUM (Z = 88)",
      "currentVal": "Neutral 88-electron atom · [Rn]7s2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3P* → 1S",
        "wavelengthNm": 764.62,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "7s2",
        "upperConfig": "7s.7p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 714.32,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "7s2",
        "upperConfig": "7s.7p"
      },
      {
        "label": "3P* → 1S",
        "wavelengthNm": 599.21,
        "region": "Visible",
        "color": "#fb923c",
        "status": "derived",
        "lowerConfig": "7s2",
        "upperConfig": "7s.7p"
      },
      {
        "label": "3D → 1S",
        "wavelengthNm": 729.09,
        "region": "Visible",
        "color": "#f87171",
        "status": "derived",
        "lowerConfig": "7s2",
        "upperConfig": "7s.6d"
      }
    ]
  },
  "Ac": {
    "number": 89,
    "symbol": "Ac",
    "name": "Actinium",
    "groundTerm": "²D₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 6d1",
    "historicalContext": "Actinium was identified in 1899.",
    "physicalIdentity": "Actinium (Ac, atomic number Z = 89) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 6d1, yielding the spectroscopic ground term ²D₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ACTINIUM (Z = 89)",
      "currentVal": "Neutral 89-electron atom · [Rn]7s2 6d1 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "2D → 2D",
        "wavelengthNm": 4481.43,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d.7s2",
        "upperConfig": "6d.7s2"
      },
      {
        "label": "2P* → 2D",
        "wavelengthNm": 1337.37,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d.7s2",
        "upperConfig": "7s2.7p"
      },
      {
        "label": "2P* → 2D",
        "wavelengthNm": 814.56,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d.7s2",
        "upperConfig": "7s2.7p"
      },
      {
        "label": "4F → 2D",
        "wavelengthNm": 1084.92,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d.7s2",
        "upperConfig": "6d2.(3F).7s"
      }
    ]
  },
  "Th": {
    "number": 90,
    "symbol": "Th",
    "name": "Thorium",
    "groundTerm": "³F₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 6d2",
    "historicalContext": "Thorium was identified in 1828.",
    "physicalIdentity": "Thorium (Th, atomic number Z = 90) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 6d2, yielding the spectroscopic ground term ³F₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "THORIUM (Z = 90)",
      "currentVal": "Neutral 90-electron atom · [Rn]7s2 6d2 ground configuration & central field screening"
    },
    "landmarkLines": [
      {
        "label": "3F → 3F",
        "wavelengthNm": 3485.22,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d2.7s2",
        "upperConfig": "6d2.7s2"
      },
      {
        "label": "3F → 3F",
        "wavelengthNm": 2015.45,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d2.7s2",
        "upperConfig": "6d2.7s2"
      },
      {
        "label": "3P → 3F",
        "wavelengthNm": 3909.22,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d2.7s2",
        "upperConfig": "6d2.7s2"
      },
      {
        "label": "3P → 3F",
        "wavelengthNm": 2587.01,
        "region": "Infrared",
        "color": "#f43f5e",
        "status": "derived",
        "lowerConfig": "6d2.7s2",
        "upperConfig": "6d2.7s2"
      }
    ]
  },
  "Pa": {
    "number": 91,
    "symbol": "Pa",
    "name": "Protactinium",
    "groundTerm": "⁴K₁₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f2 6d1",
    "historicalContext": "Protactinium was identified in 1913.",
    "physicalIdentity": "Protactinium (Pa, atomic number Z = 91) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f2 6d1, yielding the spectroscopic ground term ⁴K₁₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PROTACTINIUM (Z = 91)",
      "currentVal": "Neutral 91-electron atom · [Rn]7s2 5f2 6d1 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "U": {
    "number": 92,
    "symbol": "U",
    "name": "Uranium",
    "groundTerm": "⁵L°₆",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f3 6d1",
    "historicalContext": "Uranium was identified in 1789.",
    "physicalIdentity": "Uranium (U, atomic number Z = 92) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f3 6d1, yielding the spectroscopic ground term ⁵L°₆.",
    "distinctiveBehavior": {
      "contrastLabel": "RADIUM (Z = 88)",
      "contrastVal": "Alkaline earth [Rn] 7s²",
      "currentLabel": "URANIUM (Z = 92)",
      "currentVal": "Actinoid [Rn] 5f³ 6d¹ 7s² · Complex 5f participation & nuclear fission cross-sections"
    },
    "landmarkLines": []
  },
  "Np": {
    "number": 93,
    "symbol": "Np",
    "name": "Neptunium",
    "groundTerm": "⁶L₁₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f4 6d1",
    "historicalContext": "Neptunium was identified in 1940.",
    "physicalIdentity": "Neptunium (Np, atomic number Z = 93) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f4 6d1, yielding the spectroscopic ground term ⁶L₁₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "NEPTUNIUM (Z = 93)",
      "currentVal": "Neutral 93-electron atom · [Rn]7s2 5f4 6d1 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Pu": {
    "number": 94,
    "symbol": "Pu",
    "name": "Plutonium",
    "groundTerm": "⁷F₀",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f6",
    "historicalContext": "Plutonium was identified in 1940.",
    "physicalIdentity": "Plutonium (Pu, atomic number Z = 94) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f6, yielding the spectroscopic ground term ⁷F₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "PLUTONIUM (Z = 94)",
      "currentVal": "Neutral 94-electron atom · [Rn]7s2 5f6 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Am": {
    "number": 95,
    "symbol": "Am",
    "name": "Americium",
    "groundTerm": "⁸S°₇ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f7",
    "historicalContext": "Americium was identified in 1944.",
    "physicalIdentity": "Americium (Am, atomic number Z = 95) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f7, yielding the spectroscopic ground term ⁸S°₇ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "AMERICIUM (Z = 95)",
      "currentVal": "Neutral 95-electron atom · [Rn]7s2 5f7 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Cm": {
    "number": 96,
    "symbol": "Cm",
    "name": "Curium",
    "groundTerm": "9D°₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f7 6d1",
    "historicalContext": "Curium was identified in 1944.",
    "physicalIdentity": "Curium (Cm, atomic number Z = 96) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f7 6d1, yielding the spectroscopic ground term 9D°₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "CURIUM (Z = 96)",
      "currentVal": "Neutral 96-electron atom · [Rn]7s2 5f7 6d1 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Bk": {
    "number": 97,
    "symbol": "Bk",
    "name": "Berkelium",
    "groundTerm": "⁶H°₁₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f9",
    "historicalContext": "Berkelium was identified in 1949.",
    "physicalIdentity": "Berkelium (Bk, atomic number Z = 97) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f9, yielding the spectroscopic ground term ⁶H°₁₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "BERKELIUM (Z = 97)",
      "currentVal": "Neutral 97-electron atom · [Rn]7s2 5f9 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Cf": {
    "number": 98,
    "symbol": "Cf",
    "name": "Californium",
    "groundTerm": "⁵I₈",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f10",
    "historicalContext": "Californium was identified in 1950.",
    "physicalIdentity": "Californium (Cf, atomic number Z = 98) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f10, yielding the spectroscopic ground term ⁵I₈.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "CALIFORNIUM (Z = 98)",
      "currentVal": "Neutral 98-electron atom · [Rn]7s2 5f10 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Es": {
    "number": 99,
    "symbol": "Es",
    "name": "Einsteinium",
    "groundTerm": "⁴I°₁₅ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f11",
    "historicalContext": "Einsteinium was identified in 1952.",
    "physicalIdentity": "Einsteinium (Es, atomic number Z = 99) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f11, yielding the spectroscopic ground term ⁴I°₁₅ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "EINSTEINIUM (Z = 99)",
      "currentVal": "Neutral 99-electron atom · [Rn]7s2 5f11 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Fm": {
    "number": 100,
    "symbol": "Fm",
    "name": "Fermium",
    "groundTerm": "³H₆",
    "modelTier": "tierC",
    "valenceConfiguration": "5f12 7s2",
    "historicalContext": "Fermium was identified in 1952.",
    "physicalIdentity": "Fermium (Fm, atomic number Z = 100) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn] 5f12 7s2, yielding the spectroscopic ground term ³H₆.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "FERMIUM (Z = 100)",
      "currentVal": "Neutral 100-electron atom · [Rn] 5f12 7s2 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Md": {
    "number": 101,
    "symbol": "Md",
    "name": "Mendelevium",
    "groundTerm": "²F°₇ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f13",
    "historicalContext": "Mendelevium was identified in 1955.",
    "physicalIdentity": "Mendelevium (Md, atomic number Z = 101) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f13, yielding the spectroscopic ground term ²F°₇ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "MENDELEVIUM (Z = 101)",
      "currentVal": "Neutral 101-electron atom · [Rn]7s2 5f13 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "No": {
    "number": 102,
    "symbol": "No",
    "name": "Nobelium",
    "groundTerm": "¹S₀",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f14",
    "historicalContext": "Nobelium was identified in 1957.",
    "physicalIdentity": "Nobelium (No, atomic number Z = 102) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14, yielding the spectroscopic ground term ¹S₀.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "NOBELIUM (Z = 102)",
      "currentVal": "Neutral 102-electron atom · [Rn]7s2 5f14 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Lr": {
    "number": 103,
    "symbol": "Lr",
    "name": "Lawrencium",
    "groundTerm": "²P°₁ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f14 6d1",
    "historicalContext": "Lawrencium was identified in 1961.",
    "physicalIdentity": "Lawrencium (Lr, atomic number Z = 103) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d1, yielding the spectroscopic ground term ²P°₁ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "LAWRENCIUM (Z = 103)",
      "currentVal": "Neutral 103-electron atom · [Rn]7s2 5f14 6d1 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Rf": {
    "number": 104,
    "symbol": "Rf",
    "name": "Rutherfordium",
    "groundTerm": "³F₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f14 6d2",
    "historicalContext": "Rutherfordium was identified in 1964.",
    "physicalIdentity": "Rutherfordium (Rf, atomic number Z = 104) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d2, yielding the spectroscopic ground term ³F₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "RUTHERFORDIUM (Z = 104)",
      "currentVal": "Neutral 104-electron atom · [Rn]7s2 5f14 6d2 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Db": {
    "number": 105,
    "symbol": "Db",
    "name": "Dubnium",
    "groundTerm": "⁴F₃ᐟ₂",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f14 6d3",
    "historicalContext": "Dubnium was identified in 1967.",
    "physicalIdentity": "Dubnium (Db, atomic number Z = 105) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d3, yielding the spectroscopic ground term ⁴F₃ᐟ₂.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "DUBNIUM (Z = 105)",
      "currentVal": "Neutral 105-electron atom · [Rn]7s2 5f14 6d3 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Sg": {
    "number": 106,
    "symbol": "Sg",
    "name": "Seaborgium",
    "groundTerm": "—",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f14 6d4",
    "historicalContext": "Seaborgium was identified in 1974.",
    "physicalIdentity": "Seaborgium (Sg, atomic number Z = 106) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d4, yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "SEABORGIUM (Z = 106)",
      "currentVal": "Neutral 106-electron atom · [Rn]7s2 5f14 6d4 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Bh": {
    "number": 107,
    "symbol": "Bh",
    "name": "Bohrium",
    "groundTerm": "—",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f14 6d5",
    "historicalContext": "Bohrium was identified in 1976.",
    "physicalIdentity": "Bohrium (Bh, atomic number Z = 107) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d5, yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "BOHRIUM (Z = 107)",
      "currentVal": "Neutral 107-electron atom · [Rn]7s2 5f14 6d5 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Hs": {
    "number": 108,
    "symbol": "Hs",
    "name": "Hassium",
    "groundTerm": "—",
    "modelTier": "tierC",
    "valenceConfiguration": "7s2 5f14 6d6",
    "historicalContext": "Hassium was identified in 1984.",
    "physicalIdentity": "Hassium (Hs, atomic number Z = 108) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d6, yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "HASSIUM (Z = 108)",
      "currentVal": "Neutral 108-electron atom · [Rn]7s2 5f14 6d6 ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Mt": {
    "number": 109,
    "symbol": "Mt",
    "name": "Meitnerium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 5f14 6d7 (calculated)",
    "historicalContext": "Meitnerium was identified in 1982.",
    "physicalIdentity": "Meitnerium (Mt, atomic number Z = 109) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d7 (calculated), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "MEITNERIUM (Z = 109)",
      "currentVal": "Neutral 109-electron atom · [Rn]7s2 5f14 6d7 (calculated) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Ds": {
    "number": 110,
    "symbol": "Ds",
    "name": "Darmstadtium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 5f14 6d8 (predicted)",
    "historicalContext": "Darmstadtium was identified in 1994.",
    "physicalIdentity": "Darmstadtium (Ds, atomic number Z = 110) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d8 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "DARMSTADTIUM (Z = 110)",
      "currentVal": "Neutral 110-electron atom · [Rn]7s2 5f14 6d8 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Rg": {
    "number": 111,
    "symbol": "Rg",
    "name": "Roentgenium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 5f14 6d9 (predicted)",
    "historicalContext": "Roentgenium was identified in 1994.",
    "physicalIdentity": "Roentgenium (Rg, atomic number Z = 111) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d9 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "ROENTGENIUM (Z = 111)",
      "currentVal": "Neutral 111-electron atom · [Rn]7s2 5f14 6d9 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Cn": {
    "number": 112,
    "symbol": "Cn",
    "name": "Copernicium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 5f14 6d10 (predicted)",
    "historicalContext": "Copernicium was identified in 1996.",
    "physicalIdentity": "Copernicium (Cn, atomic number Z = 112) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 5f14 6d10 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "COPERNICIUM (Z = 112)",
      "currentVal": "Neutral 112-electron atom · [Rn]7s2 5f14 6d10 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Nh": {
    "number": 113,
    "symbol": "Nh",
    "name": "Nihonium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "5f14 6d10 7s2 7p1 (predicted)",
    "historicalContext": "Nihonium was identified in 2004.",
    "physicalIdentity": "Nihonium (Nh, atomic number Z = 113) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]5f14 6d10 7s2 7p1 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "NIHONIUM (Z = 113)",
      "currentVal": "Neutral 113-electron atom · [Rn]5f14 6d10 7s2 7p1 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Fl": {
    "number": 114,
    "symbol": "Fl",
    "name": "Flerovium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 7p2 5f14 6d10 (predicted)",
    "historicalContext": "Flerovium was identified in 1998.",
    "physicalIdentity": "Flerovium (Fl, atomic number Z = 114) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 7p2 5f14 6d10 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "FLEROVIUM (Z = 114)",
      "currentVal": "Neutral 114-electron atom · [Rn]7s2 7p2 5f14 6d10 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Mc": {
    "number": 115,
    "symbol": "Mc",
    "name": "Moscovium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 7p3 5f14 6d10 (predicted)",
    "historicalContext": "Moscovium was identified in 2003.",
    "physicalIdentity": "Moscovium (Mc, atomic number Z = 115) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 7p3 5f14 6d10 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "MOSCOVIUM (Z = 115)",
      "currentVal": "Neutral 115-electron atom · [Rn]7s2 7p3 5f14 6d10 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Lv": {
    "number": 116,
    "symbol": "Lv",
    "name": "Livermorium",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 7p4 5f14 6d10 (predicted)",
    "historicalContext": "Livermorium was identified in 2000.",
    "physicalIdentity": "Livermorium (Lv, atomic number Z = 116) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 7p4 5f14 6d10 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "LIVERMORIUM (Z = 116)",
      "currentVal": "Neutral 116-electron atom · [Rn]7s2 7p4 5f14 6d10 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Ts": {
    "number": 117,
    "symbol": "Ts",
    "name": "Tennessine",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 7p5 5f14 6d10 (predicted)",
    "historicalContext": "Tennessine was identified in 2010.",
    "physicalIdentity": "Tennessine (Ts, atomic number Z = 117) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 7p5 5f14 6d10 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "HYDROGEN (Z = 1)",
      "contrastVal": "Single electron · Exact analytic solution",
      "currentLabel": "TENNESSINE (Z = 117)",
      "currentVal": "Neutral 117-electron atom · [Rn]7s2 7p5 5f14 6d10 (predicted) ground configuration & central field screening"
    },
    "landmarkLines": []
  },
  "Og": {
    "number": 118,
    "symbol": "Og",
    "name": "Oganesson",
    "groundTerm": "—",
    "modelTier": "tierD",
    "valenceConfiguration": "7s2 7p6 5f14 6d10 (predicted)",
    "historicalContext": "Oganesson was identified in 2006.",
    "physicalIdentity": "Oganesson (Og, atomic number Z = 118) is a superheavy actinoid or transactinoid element characterized by extreme relativistic effects, strong spin-orbit mixing, and significant radioactive instability. The neutral atom ground state configuration is [Rn]7s2 7p6 5f14 6d10 (predicted), yielding the spectroscopic ground term —.",
    "distinctiveBehavior": {
      "contrastLabel": "RADON (Z = 86)",
      "contrastVal": "Inert noble gas · Distinct 6p shell closure",
      "currentLabel": "OGANESSON (Z = 118)",
      "currentVal": "Extreme spin-orbit coupling · Relativistic smearing of 7p subshell into uniform electron gas"
    },
    "landmarkLines": []
  }
}

export function getElementProfile(symbol: string): ElementProfile {
  return (
    ELEMENT_PROFILES[symbol] ?? {
      number: 0,
      symbol,
      name: symbol,
      groundTerm: '—',
      modelTier: 'tierD',
      valenceConfiguration: '—',
      historicalContext: 'Historical data not recorded.',
      physicalIdentity: 'Atomic profile is unavailable.',
      distinctiveBehavior: {
        contrastLabel: 'REFERENCE ATOM',
        contrastVal: 'Standard atomic profile',
        currentLabel: symbol,
        currentVal: 'Profile pending experimental confirmation'
      },
      landmarkLines: []
    }
  )
}

# QUANTA V3 — Design Specification: QUANTA OBSERVATORY

**System:** QUANTA Periodic Table V3  
**Status:** Approved for Implementation  
**Audience:** Frontend Engineers, Designers, Scientific Reviewers  
**Design Direction:** Optical Scientific Instrument / Research Observatory  

---

## 1. Vision & Identity

QUANTA is an interactive scientific instrument for atomic physics. The periodic table serves as the primary gateway into the quantum realm of all 118 chemical elements. 

The redesign evolves the initial welcome screen from a passive grid of buttons into the **QUANTA OBSERVATORY**—a high-density, interactive scientific workspace that combines the clarity of reference tables (Ptable, RSC, PubChem) with the refined, dark optical-scientific aesthetic of QUANTA.

### 1.1 Aesthetic Pillars
1. **Deep Graphite Canvas**: Backgrounds utilize ultra-dark charcoal tones (`#07080c`, `#0c0e14`, `#12151d`), eliminating glare and maximizing visual contrast for optical highlights.
2. **Optical Glass Surfaces**: Card surfaces use subtle multi-layered glass styling (`backdrop-filter: blur(20px)`, `border: 1px solid rgba(255, 255, 255, 0.08)`, subtle inner top-edge specular highlights).
3. **Restrained Spectral Color Palette**: Rather than garish neon or generic rainbow schemes, chemical families are coded with restrained, calibrated spectral hues with strictly maintained WCAG contrast.
4. **Information Density & Geometric Alignment**: Clear grid alignment, tabular numerals (JetBrains Mono), and balanced typographic hierarchy ensure the table feels like a calibrated physical instrument.

---

## 2. Information Architecture & Spatial Layout

### 2.1 The Observatory Grid Architecture

Conventional periodic tables leave a large void in Periods 1–3, Groups 3–12 (columns 3 through 12, rows 1 through 3). **QUANTA OBSERVATORY** utilizes this natural architectural aperture for the **Integrated Element Inspector**, ensuring no element tiles are ever overlapped or displaced.

```
       Col 1   Col 2   Col 3 ... Col 12   Col 13  Col 14  Col 15  Col 16  Col 17  Col 18
Row 1    H                                                                         He
Row 2   Li      Be     +----------------+   B       C       N       O       F      Ne
Row 3   Na      Mg     | INTEGRATED     |  Al      Si       P       S      Cl      Ar
Row 4    K      Ca     | ELEMENT        |  Ga      Ge      As      Se      Br      Kr
Row 5   Rb      Sr     | INSPECTOR      |  In      Sn      Sb      Te       I      Xe
Row 6   Cs      Ba  La | (Groups 3-12)  |  Tl      Pb      Bi      Po      At      Rn
Row 7   Fr      Ra  Ac +----------------+  Nh      Fl      Mc      Lv      Ts      Og

Row 8                  Ce ... Lu  (Lanthanoids, Period 6)
Row 9                  Th ... Lr  (Actinoids, Period 7)
```

### 2.2 Table Metadata & Conventional Layout
1. **Group Headers (1–18)**: Prominently marked above each column with IUPAC numbering (1 through 18).
2. **Period Indicators (1–7)**: Numbered along the left margin.
3. **Lanthanoid / Actinoid Series**:
   - Rows 8 & 9 are explicitly labeled with their period affiliations: `Period 6 • Lanthanoids (57–71)` and `Period 7 • Actinoids (89–103)`.
   - In Group 3, Period 6 sits Lanthanum (La, 57); Ce–Lu (58–71) sit in row 8 (columns 4–17).
   - In Group 3, Period 7 sits Actinium (Ac, 89); Th–Lr (90–103) sit in row 9 (columns 4–17).
   - An indicator connects the main grid cells to the f-block rows.
   - **Scientific Classification Invariant**: In chemistry taxonomy, all 15 elements La–Lu belong to the Lanthanoids family, and all 15 elements Ac–Lr belong to the Actinoids family. Their family membership is completely decoupled from their 2D layout coordinates.

---

## 3. Element Tile Design

Each tile is an information-dense, interactive button with an intentional typographical hierarchy:

```
+---------------------------------------+
| 79                             [Au]   | <- Atomic Number & Category Accent Dot
|                                       |
|                 Au                    | <- Symbol (Bold, Optical Focus)
|                                       |
|                Gold                   | <- Element Name (Truncation-Safe)
|               196.97 u                | <- Atomic Mass (High Legibility)
+---------------------------------------+
```

### Hierarchy & Typography
1. **Atomic Number**: Top-left, `font-family: var(--font-mono)`, `font-size: 0.68rem`, `color: var(--text-tertiary)`.
2. **Category Indicator**: Top-right subtle glowing dot/pill colored according to chemical family.
3. **Chemical Symbol**: Center, `font-weight: 700`, `font-size: clamp(1.1rem, 1.4vw, 1.45rem)`, `letter-spacing: -0.03em`.
4. **Element Name**: Bottom, `font-size: 0.66rem`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`. For long names (Rutherfordium, Darmstadtium), container uses dynamic min-width and condensed letter spacing.
5. **Atomic Mass**: Bottom sub-label, `font-family: var(--font-mono)`, `font-size: 0.58rem`, `color: var(--text-muted)`.

### Tile States
- **Default**: Subtle tinted translucent glass, 1px border matching category hue at 12% opacity.
- **Hover / Focus**: Elevates `-2px`, background brightens, category border sharpens (`rgba(..., 0.5)`), glowing inner highlight, inspector updates immediately.
- **Active / Entering**: Immediate responsive highlight; no 550ms artificial lag.
- **Dimmed (Filtered out / Non-matching search)**: `opacity: 0.22`, grayscale filter, fully preserving spatial position.

---

## 4. Chemical Family Color Palette

All colors are restrained, optical-grade tones ensuring WCAG 2.2 AA contrast against the dark graphite canvas:

| Family | IUPAC Category | Accent Hue | Border Token | Background Tint |
|---|---|---|---|---|
| Alkali metals | `alkali-metal` | Rose / Crimson | `rgba(244, 63, 94, 0.45)` | `rgba(244, 63, 94, 0.08)` |
| Alkaline-earth metals | `alkaline-earth` | Amber / Orange | `rgba(251, 146, 60, 0.45)` | `rgba(251, 146, 60, 0.08)` |
| Transition metals | `transition-metal` | Slate / Titanium | `rgba(148, 163, 184, 0.40)` | `rgba(148, 163, 184, 0.06)` |
| Post-transition metals | `post-transition` | Sky / Steel Blue | `rgba(56, 189, 248, 0.40)` | `rgba(56, 189, 248, 0.08)` |
| Metalloids | `metalloid` | Emerald / Mint | `rgba(45, 212, 191, 0.45)` | `rgba(45, 212, 191, 0.08)` |
| Other nonmetals | `nonmetal` | Optical Pure White | `rgba(248, 250, 252, 0.45)` | `rgba(255, 255, 255, 0.08)` |
| Halogens | `halogen` | Cornflower / Azure | `rgba(96, 165, 250, 0.45)` | `rgba(96, 165, 250, 0.08)` |
| Noble gases | `noble-gas` | Indigo / Violet | `rgba(168, 85, 247, 0.45)` | `rgba(168, 85, 247, 0.08)` |
| Lanthanoids | `lanthanoid` | Orchid / Fuchsia | `rgba(236, 72, 153, 0.45)` | `rgba(236, 72, 153, 0.08)` |
| Actinoids | `actinoid` | Golden Topaz | `rgba(234, 179, 8, 0.45)` | `rgba(234, 179, 8, 0.08)` |

---

## 5. Search & Filtering System

### 5.1 Real-Time Search Specification
- **Search Target**: All 118 elements.
- **Query Types Supported**:
  - Full element name (e.g. `Hydrogen`, `Gold`, `Rutherfordium`).
  - Chemical symbol (e.g. `H`, `Au`, `Og`, case-insensitive).
  - Exact atomic number (e.g. `1`, `79`, `118`). Exact number matching prevents query `1` from falsely matching `11`, `21`, `31` unless specified as partial text.
  - Partial name matching (e.g. `magn` matches `Magnesium`).
  - English spelling aliases:
    - `aluminum` ↔ `aluminium`
    - `cesium` ↔ `caesium`
    - `wolfram` ↔ `tungsten`
- **Keyboard Handling**:
  - `Enter`: If exactly 1 element matches, immediately navigates to `#/element/<name>`.
  - `Escape`: Clears the search input and restores all elements.
- **Live Announcements**: `aria-live="polite"` announces result count (e.g. "Found 1 matching element: Hydrogen").

### 5.2 Category Filter Bar
- Horizontal pills for "All (118)" plus each of the 10 chemical families.
- Clicking an active category toggles it off (returns to All).
- Visual feedback: Matching category elements stay bright, others dim to 22% opacity.
- Composable with search: when both search and category are active, elements matching both criteria are highlighted.

---

## 6. Integrated Element Inspector

Located in the upper-middle aperture on desktop, the inspector acts as a real-time HUD:

### 6.1 Data Displayed
1. **Header**:
   - Atomic Number badge (`#79`).
   - Chemical family pill (`Transition Metal`).
   - Group & Period (`Group 11 · Period 6`).
2. **Hero Identity**:
   - Massive chemical symbol (`Au`).
   - Element name (`Gold`).
   - Atomic mass with unit: `196.966570(4) u`.
3. **Electronic Structure**:
   - Ground-state electron configuration: `[Xe] 4f¹⁴ 5d¹⁰ 6s¹`.
   - Shell occupancy visualization: `K:2 · L:8 · M:18 · N:32 · O:18 · P:1`.
4. **Physical Properties (from bundled PubChem reference)**:
   - Standard state: `Solid`.
   - Electronegativity: `2.54 (Pauling)`.
   - First ionization energy: `9.2255 eV`.
5. **Instrument Type Badge**:
   - `H–B (1–5)`: "Dedicated 3D Quantum Wavefunction Instrument".
   - `C–Og (6–118)`: "NIST ASD Reference Transitions & Spectroscopy".
6. **Primary Action**:
   - Button: `EXPLORE ATOM →` (navigates to element route).

---

## 7. Responsive & Mobile Architecture

### Viewport Targets
- **Desktop (≥ 1200px)**: Complete 18-column grid with Integrated Inspector.
- **Tablet (768px – 1199px)**: Proportional grid scaling, docked inspector above or below grid.
- **Mobile (< 768px)**:
  - Dual Mode Switcher:
    - **Grid View**: Fluid horizontal scroll container with clear left/right shadow indicators, fixed period numbers, and swipe hints.
    - **Catalog / List View**: Vertical searchable card deck grouped by family, with large touch targets (minimum 44×44px).
  - Docked Inspector Sheet when any element is tapped.

---

## 8. Accessibility (WCAG 2.2 AA)

1. **Semantic HTML**: Grid table with proper headers, buttons with descriptive `aria-label`s.
2. **2D Arrow Key Navigation**: Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) move focus logically across periods and groups, skipping empty cells.
3. **Live Regions**: Screen reader announcements for search results and filter counts.
4. **High Contrast Focus Rings**: 2px solid cyan (`var(--accent-optic)`) with 2px offset.
5. **Reduced Motion**: Respects `prefers-reduced-motion: reduce` across all transitions and animations.

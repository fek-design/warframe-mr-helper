# DESIGN.md - To Be Hero X (TBHX) Design System & Quality Contract

This document defines the durable design language for the **Warframe MR Tracker**, grounded in the official aesthetic of [To Be Hero X](https://tbhx.net) and governed by [Impeccable](https://github.com/pbakaus/impeccable) craft rules.

---

## 1. Color Palette

### Base Surfaces & Canvas
* **Canvas / Background**: `#050608` (Pitch Deep Obsidian)
* **Surface / Cards**: `#0e1017` (Dark Carbon Slate)
* **Surface Elevated**: `#151822` (Elevated Panel)
* **Hairline Borders**: `rgba(255, 255, 255, 0.09)`
* **Active / Focus Borders**: `rgba(255, 64, 64, 0.6)`

### Primary Action & Highlights (TBHX Crimson)
* **Primary Crimson**: `#ff4040` (Active buttons, critical indicators, active tab indicator)
* **Crimson Dark**: `#ed2215` (Border accent, hover state)
* **Crimson Soft Glow**: `rgba(255, 64, 64, 0.2)`

### Text Contrast
* **Primary Text**: `#ffffff` (High contrast headers and titles)
* **Secondary Text**: `#9ba1b0` (Metadata, component subtitles)
* **Muted Text**: `#5e6575` (Tertiary labels, disabled elements)

### Category & Tier Hero Accents
* **Tier 0 (Ready to Build)**: `#ff4040` (Crimson - Immediate Foundry Action)
* **Tier 1 (Market / Dojo Blueprint)**: `#00fa9a` (Lucky Cyan - Quick Purchase)
* **Tier 2 (Single Part Needed)**: `#fcc800` (Ghostblade Gold - 1 Component Away)
* **Tier 3 (Farming in Progress)**: `#ff9933` (Johnny Orange - Multi-part Assembly)
* **Tier 4 (Vaulted / Relic Farm)**: `#a855f7` (Dragon Violet - Void Relic Priority)
* **Tier 5 (Syndicate / Baro / Event)**: `#008db7` (Soul Blue - Special Source)

---

## 2. Typography

* **Display & Headings**: `Oswald`, sans-serif (Condensed uppercase, letter-spacing: 0.05em to 0.08em).
  - Used for item titles, rank numerals (`RANK No. 24`), navigation tabs, and drawer section headers.
* **Body, Tables, & Figures**: `Geist Sans` / `Inter`, system-ui.
  - Used for component counts, acquisition notes, and detailed descriptions.
* **Serif Prohibition**: Fraunces or any editorial serif fonts are strictly prohibited.

---

## 3. Geometries & Visual Motifs

* **Card Corners**: Crisp `12px` to `16px` border-radius (`rounded-xl` / `rounded-2xl`). No oversized `rounded-3xl` bubble cards.
* **Tournament HUD Skew**: Tactical tabs and badges utilize `transform: skewX(-10deg)` to `-12deg` with internal text counter-skewed.
* **Zero-Padded Numbers**: Number badges follow tournament ranking format: `01`, `02`, `03`...
* **Hairline Definition**: Sharp inset or hairline borders (`1px solid rgba(255,255,255,0.09)`).
* **Hover Micro-Interactions**: Clean border-color transition and subtle lift (`translateY(-2px)`). No jittery `scale(1.04)`.

---

## 4. Craft & Anti-Pattern Floor

1. **No AI Visual Tells**: Prohibit purple/violet-on-dark gradients, cyan halo glows, and generic pill overdose.
2. **Accessible Contrast**: WCAG AA contrast (minimum 4.5:1 for body copy).
3. **Themed Browser Surfaces**: Custom scrollbars and text selection (`::selection`) themed with crimson and obsidian.

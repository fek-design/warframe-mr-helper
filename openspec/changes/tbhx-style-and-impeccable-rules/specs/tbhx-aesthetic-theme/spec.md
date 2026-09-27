## Purpose

Defines the To Be Hero X (TBHX) visual language and design token system for the Warframe MR Helper, replacing soft editorial styling with a high-contrast, anime/cyberpunk superhero tournament HUD aesthetic.

## ADDED Requirements

### Requirement: TBHX Visual Palette and Token Architecture
The design system SHALL implement high-contrast dark tones (Pitch Black `#000000`, Deep Obsidian `#08090c`, Charcoal Card `#12141a`), aggressive high-energy crimson accents (`#ff4040`, `#ed2215`, `#ff211e`), crisp stark white typography, and distinct category hero accent colors.

#### Scenario: Obsidian canvas with crimson focal highlights
- **WHEN** the user views the main application page
- **THEN** the background is obsidian black and primary action targets or status indicators use TBHX crimson red (`#ff4040` / `#ed2215`) instead of generic green or purple.

#### Scenario: Elimination of Framna tokens
- **WHEN** stylesheet variables and component classes are evaluated
- **THEN** zero `--framna-*` variables or `.framna-*` CSS classes exist in the codebase.

### Requirement: Condensed HUD Typography
The application SHALL utilize bold condensed uppercase display typography for headers, rank numbers, and badge labels, paired with a sharp legible sans-serif for metadata and body copy.

#### Scenario: Tournament ranking numbers and headings
- **WHEN** rank tags, tier badges, and header metrics are displayed
- **THEN** they render with Oswald condensed uppercase lettering with deliberate tracking and zero-padded numbers (e.g. `RANK No. 01`, `TIER 0`).

#### Scenario: Removal of editorial serif font
- **WHEN** cards, hero displays, and drawer headings are rendered
- **THEN** no Fraunces or editorial serif typography is used anywhere in the application.

### Requirement: Angular Tournament HUD Geometries
The UI components SHALL feature high-tech tournament HUD motifs including angled/skewed tags (`transform: skewX(-12deg)`), hairline framing borders, and sharp corner cutouts.

#### Scenario: Category navigation and filter badges
- **WHEN** the user navigates categories or filters
- **THEN** active tabs and filter pills feature high-contrast fills, angular bevels/skews, and crisp border definition.

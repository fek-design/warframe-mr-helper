## Why

The previous UI pass mistakenly treated the external reference brand ("Framna") as the product's identity, stamping "Framna" tags, green pill designs, and editorial serif typography across the app. This feels mismatched with Warframe's sci-fi gaming universe and contains AI design anti-patterns (e.g. purple/violet AI accent colors, excessive pills, robotic terminology).

By pivoting to the aesthetic of the official [To Be Hero X](https://tbhx.net) website—characterized by high-contrast obsidian backgrounds, high-energy crimson accents, tactical Oswald condensed typography, comic/tournament HUD badges, and clean geometric cuts—and enforcing the [pbakaus/impeccable](https://github.com/pbakaus/impeccable) design skill guardrails along with a strict down-to-earth copy rule, the application will achieve a visceral, human-crafted gamer aesthetic while eliminating all AI jargon and erroneous Framna branding.

## What Changes

- **Integrate Impeccable Design Quality System**: Install and configure `impeccable` design skills, anti-pattern detection rules, and design constraints (`PRODUCT.md`, `DESIGN.md`) so every UI component conforms to strict visual and UX craft guidelines.
- **Scraped TBHX Style Guide Adoption**:
  - Adopt TBHX high-contrast palette: Obsidian Black (`#000000` / `#08090c`), Crimson Red (`#ff4040` / `#ed2215`), Crisp White (`#ffffff`), and Hero Accent tiers.
  - Implement TBHX typography: Bold condensed uppercase display headings (Oswald / sans-condensed) paired with sharp tabular sans for stats.
  - Integrate TBHX tournament HUD accents: Skewed badge geometry (`transform: skewX(-12deg)`), zero-padded ranking badges (`RANK No. 01`), tactical corner brackets, and crosshair accents.
- **Purge All "Framna" Branding & Tagging**:
  - Remove "Framna" text badges, comments, CSS classes (`.framna-card`, `.framna-pill`, `.framna-glow`), CSS custom properties (`--framna-*`), and replace with clean, TBHX-themed design tokens.
  - Remove mismatched Fraunces serif display fonts.
- **Down-to-Earth Copy Rule & Audit**:
  - Establish a hard rule prohibiting AI marketing jargon (e.g., "AI-powered", "algorithmic triage", "intelligent optimization").
  - Replace copy with authentic, down-to-earth Warframe player terminology (e.g., "Ready to build in Foundry", "Missing blueprints", "Quick MR leveling", "Mastered", "Vaulted").
- **Senior Designer Audit & Component Overhaul**:
  - Restructure `Header`, `CategoryNav`, `FilterBar`, `ItemCard`, and `RecipeDrawer` to fix visual hierarchy, spacing inconsistencies, and keyboard accessibility flaws identified during the senior design review.

## Capabilities

### New Capabilities
- `impeccable-design-system`: Installation and enforcement of Impeccable design skills, `DESIGN.md` design contract, and local detector rules verifying zero anti-patterns.
- `tbhx-aesthetic-theme`: Implementation of the To Be Hero X style guide (high contrast crimson/black palette, Oswald condensed typography, skewed tournament HUD badges, and hero accent colorway).
- `authentic-ux-copy`: Rule and copy audit enforcing down-to-earth, player-centric phrasing and completely eliminating AI buzzwords and Framna mentions.

### Modified Capabilities
*(None; this is an overhaul of presentation and copy standards)*

## Impact

- **UI & Layout**: Complete visual redesign of `Header.tsx`, `CategoryNav.tsx`, `FilterBar.tsx`, `ItemCard.tsx`, and `RecipeDrawer.tsx`.
- **CSS & Fonts**: Replacement of Google Font Fraunces with Oswald in `layout.tsx` / `globals.css`; replacement of `--framna-*` token variables with `--tbhx-*` / `--wf-*` tokens.
- **Tooling & Rules**: Addition of `.impeccable/` configuration, `.agents/rules/copy-rules.md`, and integration of `impeccable detect` validation checks.
- **Zero Breaking API Changes**: Data contracts and AlecaFrame parsing logic in `src/lib/` remain fully intact.

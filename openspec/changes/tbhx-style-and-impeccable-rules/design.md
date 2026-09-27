## Context

The current application relies on a previous design pass that mistakenly adopted the Scandinavian tech agency branding of "Framna" as the product's identity. This introduced mismatched serif typography (Fraunces), an electric green palette, pill-centric shapes, and robotic "AI-sounding" status phrases that do not fit Warframe. Furthermore, running `npx impeccable detect src/` highlighted visual tells of AI generation (such as `text-indigo-400` violet gradients).

This design document outlines the technical architecture to implement:
1. The **Impeccable** design skill and detector rule integration.
2. The **To Be Hero X (TBHX)** anime/cyberpunk superhero tournament HUD aesthetic.
3. A strict **Down-to-Earth Copy** rule and purge of all Framna tags.

## Goals / Non-Goals

**Goals:**
- Integrate `pbakaus/impeccable` configuration, design contract (`DESIGN.md`), and ensure `npx impeccable detect src/` passes cleanly with 0 anti-patterns.
- Replace `--framna-*` tokens and `.framna-*` CSS classes with TBHX-inspired design tokens (`--tbhx-*` / `--wf-*`) in `globals.css`.
- Replace Fraunces display serif with Oswald condensed uppercase display typography.
- Implement TBHX tournament HUD motifs: angled/skewed tags (`transform: skewX(-12deg)`), zero-padded rank indicators (`RANK No. 01`), high-contrast dark card surfaces, and crimson highlights (`#ff4040` / `#ed2215`).
- Audit and replace all AI buzzwords and robotic phrases with direct, down-to-earth Warframe community copy.
- Address all flaws identified in the Senior Designer audit across `Header`, `CategoryNav`, `FilterBar`, `ItemCard`, and `RecipeDrawer`.

**Non-Goals:**
- Altering the backend triage algorithms, AlecaFrame decryption, or component math in `src/lib/`.
- Building an entire custom graphics library; styling will utilize CSS custom properties, Tailwind CSS v4, and subtle Framer Motion micro-interactions.

## Senior Designer Critique & Component Solutions

### 1. Brand Identity & Header (`Header.tsx`)
- **Flaws**: Labeled with a literal "Framna" badge; circular monogram looks like a placeholder generic SaaS icon; MR rank pill has weak contrast against the dark background.
- **Solution**: Rebrand clearly to **WARFRAME MR TRACKER** with a tactical Tenno / TBHX tournament header: sharp angled status badge (`LIVE SYNC`), high-visibility crimson accent line, and prominent MR badge with zero-padded rank styling (`MR 24` or `LEGENDARY 4`).

### 2. Category Navigation (`CategoryNav.tsx`)
- **Flaws**: Standard pill bar that looks like every generic modern mobile web app; pills have rounded-full 40px radius with gentle green highlight; lacks gaming energy and high density.
- **Solution**: Shift to TBHX tournament tab bar: angled pill/tab indicators with skew effect (`transform: skewX(-10deg)`), high-contrast white text on crimson active fill, and zero-padded category counters (`[ 08 ]` unmastered).

### 3. Filter Bar & Search (`FilterBar.tsx`)
- **Flaws**: Floating 40px pills lack visual hierarchy; the search bar looks like an iOS search field; unmastered/mastered counts are tucked into tiny rounded pills with low contrast.
- **Solution**: Tactical HUD control bar with segmented buttons, crisp hairline borders (`1px solid rgba(255,255,255,0.12)`), sharp focus rings, and clear action labels ("Ready to Build", "In Progress", "Mastered").

### 4. Inventory Card (`ItemCard.tsx`)
- **Flaws**: Card has soft 24px rounded corners (`rounded-3xl`) which feels like a lifestyle app rather than an arsenal inventory. Status pills float awkwardly; mastery requirement badge is faint; the hover scale `scale(1.04)` causes layout jitter and text blurring on low-DPI screens.
- **Solution**: TBHX hero card architecture: crisp 12px corners with subtle corner notch/clip, high-contrast dark slate surface (`#0d0f14`), bold condensed uppercase item titles (Oswald), high-visibility tier badges with TBHX hero accent colors (Crimson, Gold, Cyan, Violet), and a clean progress track. Replace jittery scale animation with crisp border/glow highlight and subtle Y-lift (`translateY(-2px)`).

### 5. Recipe Drawer (`RecipeDrawer.tsx`)
- **Flaws**: Massive rounded pill buttons, editorial serif headers, and generic component list that resembles a receipt or food delivery checkout.
- **Solution**: Foundry blueprint layout: bold monospace/condensed headings, clean component requirement grid with clear checkboxes/indicators ("Owned: 2/2", "Missing: 1 Neuroptics"), and direct down-to-earth CTA: "Build in Foundry" or "View Wiki".

## Decisions & Technical Choices

### 1. Impeccable Integration & Config
- **Decision**: Install Impeccable via `npx impeccable install --project --yes --providers=gemini` and maintain `.impeccable/config.json` alongside a root `DESIGN.md`.
- **Rationale**: Impeccable detects anti-patterns (such as cyan/purple AI gradients, mismatched font scales, unstyled interactive states) deterministically without external API overhead.
- **Alternative Considered**: Writing custom ESLint rules (too time consuming and does not analyze computed CSS/styling patterns).

### 2. Scraped TBHX Design System Architecture
- **Palette**:
  - Background Canvas: `#050608` (Pitch Deep Obsidian)
  - Card/Surface: `#0e1017` (Dark Carbon Slate)
  - Card Border: `rgba(255, 255, 255, 0.10)` / Hover: `rgba(255, 64, 64, 0.4)`
  - Primary Accent: `#ff4040` / `#ed2215` (TBHX Crimson Red)
  - Hero Accents for Tiers:
    - Tier 0 (Ready to Build): `#ff4040` (Crimson - Immediate Priority)
    - Tier 1 (Market/Dojo Blueprint): `#00fa9a` (Lucky Cyan/Green)
    - Tier 2 (Single Part Missing): `#fcc800` (Ghostblade Gold)
    - Tier 3 (Multiple Parts Needed): `#ff9933` (Little Orange)
    - Tier 4 (Vaulted / Relic Farm): `#7f1184` (Dragon Purple)
    - Tier 5 (Baro / Syndicate / Event): `#008db7` (Soul Blue)
- **Typography Scale**:
  - Display / Headings / Badges: Oswald (Google Font) - uppercase, condensed, tracking-wide.
  - Body / Data / Metrics: Geist Sans / Inter - high legibility tabular figures.
- **HUD Geometry**:
  - Tactical badges: `.tbhx-skew { transform: skewX(-12deg); }`
  - HUD Brackets: Crisp inset border styling with tactical corner accents.

### 3. Down-to-Earth UX Copy Guidelines
- **Decision**: Create `.agents/rules/copy-rules.md` establishing mandatory copy standards:
  - NO AI jargon: "algorithmic triage", "neural synthesis", "intelligent optimization", "smart helper".
  - NO Framna branding: completely purged.
  - Direct player copy: "Ready to Build", "Missing Components", "Dojo Blueprint", "Vaulted Relic", "Mastery Progress".

## Risks / Trade-offs

- [Risk]: Changing fonts and card paddings might cause layout shifting on small screens.
  → Mitigation: Test responsiveness across mobile (375px), tablet (768px), and desktop (1280px).
- [Risk]: Oswald font loading latency.
  → Mitigation: Use `next/font/google` in `layout.tsx` with `display: 'swap'` and preconnect.
- [Risk]: High contrast crimson could be visually fatiguing if overused.
  → Mitigation: Confine crimson to focal call-to-actions, active indicators, and critical alerts; maintain calm neutral obsidian surfaces for primary content reading.

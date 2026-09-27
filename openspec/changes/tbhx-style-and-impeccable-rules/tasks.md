## 1. Impeccable Tooling & Design System Contract

- [x] 1.1 Install and configure Impeccable skills into the workspace (`npx impeccable install --project --yes`).
- [x] 1.2 Create `DESIGN.md` in root capturing the TBHX color system, Oswald typography hierarchy, and UI craft constraints.
- [x] 1.3 Create `.agents/rules/copy-rules.md` enforcing the ban on AI jargon, elimination of Framna branding, and adoption of down-to-earth Warframe terminology.

## 2. Tokens, Typography & Global Styles

- [x] 2.1 Replace Google Font Fraunces in `src/app/layout.tsx` with Oswald condensed font and configure `font-oswald` utility class.
- [x] 2.2 Purge all `--framna-*` CSS custom properties, `.framna-card`, `.framna-pill`, and `.framna-glow` classes in `src/app/globals.css`.
- [x] 2.3 Implement TBHX design tokens in `src/app/globals.css`: Obsidian canvas (`#050608`), Crimson red (`#ff4040`), Hero accents, `.tbhx-card`, `.tbhx-skew`, and tournament HUD borders.

## 3. Copy & Branding Purge

- [x] 3.1 Remove all "Framna" branding tags, text, and badges from `src/components/Header.tsx` and rebrand to "Warframe MR Tracker".
- [x] 3.2 Audit `src/app/page.tsx` and all components to replace AI jargon ("algorithmic triage", "neural", etc.) with plain, direct Warframe copy ("Ready to Build", "Missing Components", "Dojo Lab Blueprint").
- [x] 3.3 Fix the AI-slop color pattern (`text-indigo-400`) detected in `src/app/page.tsx`.

## 4. Component Redesign (TBHX Tournament HUD)

- [x] 4.1 Redesign `src/components/Header.tsx` with TBHX tournament HUD styling, live sync badge, and zero-padded MR rank pill (`RANK No. 24`).
- [x] 4.2 Redesign `src/components/CategoryNav.tsx` with skewed tournament category tabs (`transform: skewX(-10deg)`), active crimson highlights, and high-contrast count badges.
- [x] 4.3 Redesign `src/components/FilterBar.tsx` with tactical search bar, sharp hairline border segmented controls, and clear unmastered/mastered counts.
- [x] 4.4 Redesign `src/components/ItemCard.tsx` with crisp 12px corners, high-contrast dark carbon surface, bold Oswald item names, TBHX hero tier badges, and hover border highlights.
- [x] 4.5 Redesign `src/components/RecipeDrawer.tsx` into a tactical Foundry blueprint view with clean component checklists, acquisition source chips, and direct action buttons.

## 5. Quality Verification & Impeccable Audit

- [x] 5.1 Run `npx impeccable detect src/` to verify zero anti-patterns across all updated components.
- [x] 5.2 Validate responsive layout on mobile and desktop viewports.
- [x] 5.3 Run Next.js build (`npm run build`) to ensure TypeScript and CSS compilation pass cleanly.

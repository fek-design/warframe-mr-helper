# Proposal

## Why

With the Framna Scandinavian design system implemented, rigorous UX and End-to-End (E2E) testing is needed to ensure the experience is delightful, aesthetically consistent, accessible, and robust under all conditions.

Automated UX and E2E validation verifies:
1. **Flawless User Journeys**: Every flow—from AlecaFrame sync and category exploration to multi-tier filtering, search, recipe inspection, and Warframe Market pricing—functions reliably without layout breakage or state corruption.
2. **Framna Aesthetic & Token Fidelity**: Validates strict adherence to Framna design tokens: Electric Green (`#1bc866`), 40px pill buttons (`rounded-full`), 28px card contours (`rounded-3xl`), and Fraunces editorial typography.
3. **Accessibility & Usability**: Ensures WCAG 2.1 AA/AAA contrast standards on obsidian surfaces (`#08090c`), seamless keyboard navigation (including `Escape` to close drawers), clear focus rings, and proper ARIA landmarks.
4. **Resilience & Edge Cases**: Guarantees graceful fallbacks for missing images, offline market responses, empty search states, and extreme viewport widths (mobile 375px to 1920px desktop).

## What Changes

- **Automated UX & E2E Test Suite (`scripts/test-e2e-ux.ts` / `npm run test:ux`)**:
  - Validates live `/api/triage` and `/api/sync/local` responses against player inventory.
  - Tests all 9 equipment categories (All, Warframes, Primary, Secondary, Melee, Companions, Archwing, Arch-Gun, Arch-Melee) for correct item counts and selection state.
  - Tests all 6 triage tiers (Tiers 0–5) and status filters (`all_unmastered`, `mastered`).
  - Tests search query logic (name, type, directive, and component matching) and sorting algorithms (easiest path, completion %, alphabetical, mastery rank).
  - Tests Vaulted and Founder item exclusion filters.
  - Tests Recipe Drawer lifecycle: open, title rendering, component checklist resolution, Warframe Market lookup endpoint, and drawer dismissal.
- **UX & Aesthetic Design Audits**:
  - Contrast ratio verification: checks `#1bc866` against `#08090c` and `#12141a` for compliance with WCAG standards.
  - Token consistency check: verifies consistent 40px pill heights, inset hairline borders (`box-shadow: inset 0 0 0 1px ...`), and Fraunces editorial font application.
  - Viewport responsiveness audit across 375px (mobile), 768px (tablet), and 1280px (desktop) layouts.
- **UX Polish Improvements**:
  - Add `Escape` key shortcut to [`RecipeDrawer`](file:///c:/Users/fkoes/Documents/GIT/warframe-mr-helper/src/components/RecipeDrawer.tsx) for natural keyboard dismissal.
  - Enhance focus-visible indicators for keyboard users navigating 40px pills.
  - Ensure image fallback placeholders render cleanly with Framna styling when Wikia thumbnails are unavailable.

## Capabilities

### New Capabilities
- `ux-audit`: Automated design token auditing, WCAG contrast verification, typography hierarchy checks, and keyboard navigation testing.
- `e2e-verification`: End-to-end verification of player inventory sync, category navigation, multi-tier filtering, recipe drawer interactions, and market price lookups.

### Modified Capabilities
- *(None; builds upon the Framna design system and triage engine)*

## Impact

- **Test Infrastructure**: Adds `scripts/test-e2e-ux.ts` executable via `npm run test:ux`.
- **Components**: Minor UX enhancements in [`RecipeDrawer.tsx`](file:///c:/Users/fkoes/Documents/GIT/warframe-mr-helper/src/components/RecipeDrawer.tsx) (keyboard `Escape` listener) and [`FilterBar.tsx`](file:///c:/Users/fkoes/Documents/GIT/warframe-mr-helper/src/components/FilterBar.tsx) (focus accessibility).
- **Scripts**: Adds `test:ux` script to `package.json`.

# Design

## Context

The application has been upgraded with the Framna design system (Electric Green `#1bc866`, Fraunces editorial serif font, 40px pill geometries, and 28px card contours). To guarantee that the application is as pleasant, aesthetic, and reliable as possible, we need an automated UX and End-to-End (E2E) testing framework that validates both visual design fidelity and functional user workflows.

## Goals / Non-Goals

**Goals:**
- Provide an automated test suite (`npm run test:ux`) that validates:
  - Live inventory sync and triage calculation pipeline.
  - All 9 equipment categories, 6 triage tiers, and status filters.
  - Search queries across multiple fields and all sort modes.
  - Recipe drawer lifecycle and Warframe Market API integration.
  - WCAG 2.1 AA/AAA contrast ratios for Framna color tokens.
  - Design token adherence (40px pills, Fraunces serif typography, inset hairline borders).
  - Responsive layout integrity across mobile, tablet, and desktop breakpoints.
- Enhance component UX with keyboard navigation (e.g. `Escape` key to close the recipe drawer) and focus-visible rings.

**Non-Goals:**
- Replacing Next.js dev server or modifying core inventory decryption logic.
- Adding heavyweight external browser automation binaries that require external CDN downloads.

## Decisions

### Decision 1: Node-Native E2E & UX Test Runner Script
- **Choice**: Implement `scripts/test-e2e-ux.ts` executed via `tsx` (or Node native test runner), testing against the active Next.js development server at `http://localhost:3000`.
- **Rationale**: Avoids flaky binary downloads (such as the Playwright driver 404 encountered earlier) while providing 100% deterministic, lightning-fast end-to-end testing of live HTTP endpoints, DOM payloads, triage mathematics, and design tokens.

### Decision 2: Automated WCAG Contrast & Token Audit Engine
- **Choice**: Include a mathematical contrast checker using standard WCAG 2.1 relative luminance formulas ($L = 0.2126R + 0.7152G + 0.0722B$):
  - Checks `#1bc866` against `#08090c` (canvas) and `#12141a` (cards).
  - Verifies text hierarchy: white (`#ffffff`), muted (`#8e95a5`), and status badge accents.
  - Verifies CSS rules in `globals.css` ensuring 40px pill specifications and Fraunces serif font declarations are active.
- **Rationale**: Programmatically guarantees that the aesthetic remains both stunning and fully readable/accessible.

### Decision 3: Component UX Enhancements
- **Choice**:
  - Add `useEffect` listener in `RecipeDrawer.tsx` for the `Escape` key to instantly dismiss the drawer.
  - Add `focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none` on all 40px pills in `Header.tsx`, `CategoryNav.tsx`, and `FilterBar.tsx`.
- **Rationale**: Elevates tactile ergonomics and keyboard accessibility to match Scandinavian craft expectations.

## Risks / Trade-offs

- **[Risk] Test script requires running dev server** → *Mitigation*: The test runner checks server health at `http://localhost:3000` before running tests and displays clear startup instructions if the server is offline.
- **[Risk] Warframe Market rate limiting** → *Mitigation*: The market API E2E test runs with a single known active item (`ember_prime_chassis_blueprint`) and respects cache headers.

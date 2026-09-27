# Tasks

## 1. Component UX and Accessibility Polish

- [x] 1.1 Add `Escape` keyboard shortcut and accessibility attributes to `src/components/RecipeDrawer.tsx` for seamless drawer dismissal, verifying keyboard interaction
- [x] 1.2 Add `focus-visible` styling with Framna Electric Green accent ring (`focus-visible:ring-2 focus-visible:ring-[#1bc866]/60`) to 40px pills in `src/components/Header.tsx`, `src/components/CategoryNav.tsx`, and `src/components/FilterBar.tsx`, verifying focus states

## 2. Automated UX and E2E Test Suite

- [x] 2.1 Install `tsx` in `devDependencies` and configure `"test:ux": "tsx scripts/test-e2e-ux.ts"` in `package.json`, verifying script registration
- [x] 2.2 Implement `scripts/test-e2e-ux.ts` covering:
  - WCAG 2.1 contrast ratio mathematical validation for Framna colors
  - Framna design token and typography rules compliance
  - Full inventory sync and triage calculation verification
  - Category navigation across all 9 categories
  - Multi-tier filtering (Tiers 0–5, all unmastered, mastered)
  - Search query matching and sort orders
  - Recipe drawer lifecycle and Warframe Market API proxy lookup
  - Viewport responsive structure checks
  verifying test suite execution

## 3. Execution and Verification

- [x] 3.1 Run `npm run test:ux` against localhost:3000 and verify all UX and E2E test suites pass with a comprehensive audit report
- [x] 3.2 Run `npm run lint` and verify zero ESLint errors or warnings

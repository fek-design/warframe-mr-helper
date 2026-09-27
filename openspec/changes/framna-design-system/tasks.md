# Tasks

## 1. Design Tokens and Typography

- [x] 1.1 Import `Fraunces` editorial serif font in `src/app/layout.tsx` via `next/font/google` and configure CSS variable `--font-fraunces`, verifying compilation
- [x] 1.2 Update `src/app/globals.css` with Framna Electric Green (`#1bc866`), inset border utilities, 40px pill helpers, and editorial typography classes, verifying CSS compilation

## 2. Component Redesign

- [x] 2.1 Restyle `src/components/Header.tsx` with circular monogram branding, Electric Green live pulse, and Framna 40px pill CTA with hover scale `scale(1.04)`, verifying component rendering
- [x] 2.2 Restyle `src/components/CategoryNav.tsx` with Framna 40px pill selectors and Electric Green active indicator glide, verifying tab transitions
- [x] 2.3 Restyle `src/components/FilterBar.tsx` with rounded-full tier badge pills and high-contrast count chips, verifying filter reactivity
- [x] 2.4 Restyle `src/components/ItemCard.tsx` with 24–32px rounded corners (`rounded-3xl`), floating status pill tags, and smooth hover scaling, verifying card layout
- [x] 2.5 Restyle `src/components/RecipeDrawer.tsx` with Fraunces editorial title, Framna green checkmarks (`#1bc866`), and rounded-full market action pills, verifying drawer layout
- [x] 2.6 Update `src/app/page.tsx` hero banner with editorial serif numbers and Scandinavian grid spacing, verifying full page layout

## 3. Verification

- [x] 3.1 Verify end-to-end user experience on localhost:3000 confirming Framna styling and interaction consistency
- [x] 3.2 Run `npm run lint` and verify zero errors or warnings

# Proposal

## Why

The current interface follows an Apple Tahoe glassmorphism aesthetic. Adopting the design language of [framna.com](https://framna.com) (Scandinavian "Forwardism" and product-led craft) elevates the application into a confident, editorial, human-crafted experience with Framna's iconic Electric Green (`#1bc866`), dual typography (geometric Grotesk sans + editorial serif display), tactile 40px pill geometries, and smooth `scale(1.04)` micro-interactions.

## What Changes

- **Framna Color & Token System**: Integrate Framna Electric Green (`#1bc866`) as the primary active/accent tone, with high-contrast obsidian canvas (`#08090c`), rich charcoal card surfaces (`#12141a`), and crisp white text.
- **Dual Typography**: Introduce an editorial display serif font (Fraunces / Instrument Serif) for large metric counters, hero titles, and drawer headers, paired with Geist Sans for clean tabular data.
- **40px Pill Geometries**: Transition all navigation selectors, filter tags, and action buttons to full-pill shapes (`border-radius: 40px` / `rounded-full`).
- **Signature Micro-Interactions**: Implement Framna's spring hover scale (`transform: scale(1.04)` / `whileHover={{ scale: 1.04 }}`) and active glow states.
- **Editorial Card Architecture**: Adopt 24px–32px corner radii (`rounded-3xl`), inset hairline borders (`box-shadow: inset 0 0 0 1px ...`), and floated corner badge tags.
- **Component Restyling**: Update `Header`, `CategoryNav`, `FilterBar`, `ItemCard`, and `RecipeDrawer` to adhere to the Framna design system.

## Capabilities

### New Capabilities
- `framna-theme`: Framna design tokens, Electric Green palette, dual typography configuration, and hover-scale micro-interactions.
- `framna-components`: Restyled header, category pills, filter controls, item cards, and recipe inspector drawer with Framna editorial and pill styling.

### Modified Capabilities
*(None; new presentation layer capability)*

## Impact

- **CSS & Fonts**: Google Fonts import in `layout.tsx` for Fraunces editorial serif font, plus Framna utility classes in `globals.css`.
- **Components**: Visual and structural styling updates in `src/components/*` and `src/app/page.tsx`.
- **Dependencies**: Uses existing `motion` and `tailwindcss` packages without adding new heavyweight libraries.

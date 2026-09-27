# Design

## Context

See `proposal.md` for background and motivation. The application currently functions with a live AlecaFrame sync and Next.js 16 architecture, but utilizes a generic dark glassmorphism theme. This design aligns the entire frontend with the Scandinavian product design language of [framna.com](https://framna.com).

## Goals / Non-Goals

**Goals:**
- Implement Framna's iconic Electric Green (`#1bc866`) accent and high-contrast dark palette.
- Integrate a dual typographic system: Fraunces (editorial serif) for display titles, counters, and drawer headers, paired with Geist Sans for clean UI labels.
- Standardize all action buttons, filters, and tags into 40px rounded-full pill shapes with Framna's signature hover scaling (`scale: 1.04`).
- Adopt 24px–32px corner radii (`rounded-3xl`) with inset hairline borders for cards and containers.
- Retain all existing backend sync, triage calculation, and Warframe Market capabilities without breaking functionality.

**Non-Goals:**
- Changing backend decryption or catalog data structures.
- Re-implementing the Warframe Market API proxy.

## Decisions

### Decision 1: Framna Color Tokens & CSS Architecture
- **Choice**: Define Framna tokens in `globals.css`:
  - `--framna-green: #1bc866`
  - `--framna-green-glow: rgba(27, 200, 102, 0.25)`
  - `--framna-canvas: #08090c`
  - `--framna-surface: #12141a`
  - `--framna-border: rgba(255, 255, 255, 0.08)`
  - Inset borders via `box-shadow: inset 0 0 0 1px var(--framna-border)`.
- **Rationale**: Direct CSS variables in Tailwind v4 allow immediate theme consistency across all components.

### Decision 2: Typography Pairing with Fraunces
- **Choice**: Load `Fraunces` via `next/font/google` in `layout.tsx` alongside `Geist`, exposing `--font-fraunces`.
- **Alternatives Considered**:
  - *Playfair Display*: Too traditional/bookish.
  - *Instrument Serif*: Very stylized italic only.
  - *Fraunces*: Versatile variable font with soft geometric curves that closely match Framna's proprietary `FramnaSerif`.
- **Rationale**: Delivers the authentic Scandinavian editorial feel while keeping Next.js font optimization zero-cost.

### Decision 3: 40px Pill System & Micro-Interactions
- **Choice**: Replace `rounded-xl` and `rounded-2xl` on buttons and filter tags with `rounded-full` (40px pill). Wrap interactive buttons with Motion.js `whileHover={{ scale: 1.04 }}` and `whileTap={{ scale: 0.97 }}` with spring damping 25.
- **Rationale**: Emulates Framna's tactile, bouncy, and responsive design signature.

### Decision 4: Redesigned Card Architecture
- **Choice**: `rounded-3xl` cards with floating corner tags for readiness tiers, subtle inset borders, and clean typography.
- **Rationale**: Gives the item grid generous breathing room and editorial visual clarity.

## Risks / Trade-offs

- **[Risk] High-contrast green could be overpowering** → *Mitigation*: Reserve `#1bc866` for active states, key CTAs, and status indicators; keep card backgrounds dark and content text crisp white/gray.
- **[Risk] Serif font readability on small badges** → *Mitigation*: Restrict Fraunces to display titles and large numbers; use Geist Sans for all small badges and technical labels.

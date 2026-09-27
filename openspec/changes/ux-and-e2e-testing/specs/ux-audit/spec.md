# Spec Delta

## Purpose

Defines automated UX and aesthetic audit specifications to ensure Framna design token compliance, WCAG contrast standards, keyboard accessibility, and responsive viewport behavior.

## ADDED Requirements

### Requirement: Framna Design Token Compliance
The design system SHALL adhere strictly to Framna design tokens across all views and interactive components, ensuring consistent visual harmony.

#### Scenario: Token verification
- **WHEN** the UX audit evaluates CSS variables and computed styles
- **THEN** `--framna-green` is `#1bc866`, background canvas is `#08090c`, card surfaces are `#12141a`, interactive buttons have a height of `40px` with `rounded-full` pill contours, and editorial display headings use `font-serif` (`Fraunces`).

### Requirement: WCAG 2.1 Contrast Standards
The interface SHALL maintain accessible text contrast ratios meeting WCAG 2.1 AA guidelines across dark surfaces.

#### Scenario: Text on dark surfaces
- **WHEN** text is rendered against obsidian `#08090c` or charcoal `#12141a` surfaces
- **THEN** primary text has a contrast ratio of at least 7:1 (AAA), muted text has a contrast ratio of at least 4.5:1 (AA), and active Electric Green badges (`#1bc866`) against dark surfaces maintain high visual legibility.

### Requirement: Keyboard Navigation and Dismissal
Interactive modals and drawers SHALL support standard keyboard interaction patterns, including `Escape` key dismissal.

#### Scenario: Closing recipe drawer via keyboard
- **WHEN** the Recipe Inspector Drawer is open and the user presses the `Escape` key
- **THEN** the drawer immediately closes and focus returns to the main interface.

### Requirement: Responsive Viewport Fidelity
The application SHALL render without layout breaking, horizontal body scrolling, or overlapping elements across mobile (375px), tablet (768px), and desktop (1280px) breakpoints.

#### Scenario: Mobile viewport rendering
- **WHEN** the application is displayed at 375px width
- **THEN** navigation pills scroll horizontally without breaking the header, item cards stack into a single column, and the recipe drawer occupies full viewport width safely.

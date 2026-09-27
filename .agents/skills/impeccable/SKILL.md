---
name: impeccable
description: "Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens."
---

# Impeccable Design Quality & Craft Guidelines

This skill enforces production-grade craft, eliminating generic AI design patterns (like purple-to-blue gradients, pill overdose, and unstyled form controls) and replacing them with intentional, human-crafted interfaces.

## Core Rules

1. **Verify Contrast**: Body and placeholder text >= 4.5:1, large text >= 3:1.
2. **Depth & Shadows**: Shadows carry an offset and soft blur. Zero-offset glowing halos are prohibited.
3. **Spacing & Rhythm**: Tight related groups, generous section separation. More space above a heading than below it.
4. **Typography**: Balanced headings, intentional hierarchy. Max display sizes, tracking floors, no clipped or overflowing text.
5. **No AI Visual Cliches**:
   - BAN generic purple-to-cyan/blue gradients.
   - BAN pill overdose (avoid making every container, search input, and button a 40px rounded-full pill).
   - BAN eyebrow/kicker microcopy above every heading.
   - BAN unstyled browser controls (custom scrollbars, focus rings, and selection colors must match the design palette).
6. **Deterministic Detection**: Run `npx impeccable detect src/` to verify zero anti-patterns.

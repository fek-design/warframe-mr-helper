# Spec Delta

## Purpose

Defines the Framna-inspired visual foundation including Electric Green accents, dual typography (Grotesk and Editorial Serif), 40px pill shapes, and hover-scale micro-interactions.

## ADDED Requirements

### Requirement: Framna Color Palette and Design Tokens
The design system SHALL implement Framna's signature high-contrast palette featuring Electric Green (`#1bc866`), deep obsidian background (`#08090c`), rich charcoal card surfaces (`#12141a`), and crisp white text.

#### Scenario: Visual styling of active elements
- **WHEN** an element is active, focused, or highlighted
- **THEN** it displays with Framna Electric Green (`#1bc866`) accents and subtle lime glow

### Requirement: Dual Typography Pairing
The application SHALL employ a dual typographic hierarchy pairing an editorial serif typeface (Fraunces / Instrument Serif) for display headlines and metrics with a clean Grotesk sans-serif for UI labels and data.

#### Scenario: Headline and metric rendering
- **WHEN** the hero section, big metric counters, and modal drawer headers are rendered
- **THEN** they display in the editorial serif font with tight line-height and high visual distinction

### Requirement: Framna Pill Geometry and Micro-Interactions
The interface SHALL format all buttons, tags, and category switches with 40px rounded-full pill contours and apply spring hover scaling (`scale: 1.04`).

#### Scenario: Button hover interaction
- **WHEN** a user hovers over a CTA button or filter pill
- **THEN** the element smoothly scales up to `1.04` using spring easing

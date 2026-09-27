# Spec Delta

## Purpose

Delivers a calm, minimalist Apple Tahoe / iOS-inspired interface powered by Motion.js with fluid layout transitions, drawer inspectors, and human-crafted guidance.

## ADDED Requirements

### Requirement: Apple Tahoe Visual Design System
The interface SHALL implement a minimalist design language utilizing deep obsidian tones, frosted acrylic translucency (`backdrop-filter`), hairline specular borders, and refined typographic hierarchy.

#### Scenario: Visual rendering of cards and navigation
- **WHEN** items, filters, and header modules are rendered
- **THEN** they display with blur-backed glass styling, crisp contrast, and subtle borders without visual clutter or neon glows

### Requirement: Motion.js Fluid Layout Transitions
The interface SHALL animate filter changes, tab switching, and card reordering using Motion.js layout animations with spring physics.

#### Scenario: Category tab switching
- **WHEN** the user switches between equipment categories (e.g. Warframes to Melee)
- **THEN** an active pill indicator glides smoothly using spring interpolation and the item grid animates into place

### Requirement: Interactive Recipe Inspector Drawer
The interface SHALL provide an expandable drawer or modal sheet detailing the exact component breakdown, resource deficits, and natural-language acquisition directions for any selected item.

#### Scenario: Item card inspection
- **WHEN** the user clicks an item card
- **THEN** an iOS-style inspector drawer slides open displaying owned vs missing components, blueprint source, wiki links, and direct action steps

### Requirement: Human-Centric Acquisition Directives
The interface SHALL translate raw database codes into concise, natural-language human guidance for every item.

#### Scenario: Displaying acquisition instructions
- **WHEN** an item is displayed in the list or drawer
- **THEN** the system shows clear guidance (e.g., "Replicate in Clan Energy Lab for 15,000 Credits" or "Jackal assassination drop on Fossa, Venus") rather than unformatted raw game tags

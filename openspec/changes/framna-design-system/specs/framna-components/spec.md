# Spec Delta

## Purpose

Restyles all UI components (Header, CategoryNav, FilterBar, ItemCard, RecipeDrawer) into Framna's Scandinavian product-led aesthetic.

## ADDED Requirements

### Requirement: Framna Editorial Header
The Header SHALL feature a circular monogram badge with an electric green pulse indicator, pill-shaped action CTAs, and high-contrast typography.

#### Scenario: Header display
- **WHEN** the header renders on any screen size
- **THEN** it displays a minimalist circular brand emblem, live MR badge, and a rounded-full "Sync AlecaFrame" pill button with hover scaling

### Requirement: Full-Pill Category and Filter Navigators
The Category Navigation and Filter Bar SHALL render with 40px rounded-full pill switches, spring layout glides, and inset hairline borders.

#### Scenario: Category selection
- **WHEN** the user selects a category pill
- **THEN** the active indicator glides with spring physics and lights up in electric green or white-contrast pill styling

### Requirement: 24–32px Editorial Item Cards
Item Cards SHALL use generous 24px–32px corner radii (`rounded-3xl`), floating corner status tags, completion mini-progress bars, and natural language directives.

#### Scenario: Item card rendering
- **WHEN** items are rendered in the grid
- **THEN** each card displays rounded-3xl contours, inset hairline border highlights, floating readiness badge, and hover scale micro-interactions

### Requirement: Editorial Recipe Inspector Drawer
The Recipe Drawer SHALL display item titles in editorial serif typography, electric green checkmarks for satisfied parts, and tactile pill buttons for Warframe Market lookups.

#### Scenario: Opening recipe drawer
- **WHEN** an item is clicked
- **THEN** the drawer slides open showing the editorial serif title, clean component checklist with `#1bc866` checkmarks, and direct Warframe Market action pills

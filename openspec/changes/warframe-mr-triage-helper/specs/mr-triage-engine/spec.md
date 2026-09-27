# Spec Delta

## Purpose

Calculates complete mastery progression gaps, component crafting readiness, and easiest acquisition paths across all Warframe equipment categories.

## ADDED Requirements

### Requirement: Full Equipment Catalog Master Index
The system SHALL maintain a comprehensive index of all masterable items across Warframes, Primary, Secondary, Melee, Companions, Archwings, Archguns, Necramechs, and Amps.

#### Scenario: Catalog unmastered lookup
- **WHEN** player inventory state is evaluated against the catalog
- **THEN** every item lacking completed mastery XP (XP < 450,000 for standard items, or < 1,600,000 for rank 40 items) is retained in the unmastered pool without arbitrary truncation

### Requirement: Actionable Readiness Tiering
The system SHALL classify each unmastered item into structured readiness tiers based on inventory holdings and blueprint availability.

#### Scenario: Tier 0 Claim in Foundry
- **WHEN** an item appears in `PendingRecipes` with a completion date in the past
- **THEN** the system marks the item as "Ready to Claim" in Tier 0

#### Scenario: Tier 1 Instant Craft
- **WHEN** the player owns the blueprint in `Recipes` and owns 100% of all required crafting components in `MiscItems`
- **THEN** the system marks the item as "Ready to Craft Now" in Tier 1

#### Scenario: Tier 2 Credit or Clan Blueprint Acquisition
- **WHEN** the player owns all required components but lacks the blueprint, and the blueprint is purchasable for credits in the Market or researched in a Clan Dojo Lab
- **THEN** the system identifies the exact purchase source (e.g., Tenno Lab, Bio Lab, Market Credits) and marks it as Tier 2

#### Scenario: Tier 3 Partial Prime and Multi-Part Components
- **WHEN** the player owns a subset of required prime components or modular parts
- **THEN** the system highlights which specific parts are owned and which are missing, with live warframe.market plat prices

### Requirement: Multi-Faceted Filtering and Sorting
The system SHALL provide dynamic filtering by equipment category, readiness status, acquisition source, vaulted state, and mastery rank requirements.

#### Scenario: Filtering by readiness
- **WHEN** the user selects the "Ready to Craft" filter
- **THEN** the catalog instantly filters down to items with 100% material sufficiency without page reloads

#### Scenario: Sorting by easiest path
- **WHEN** the user sorts by "Easiest Path"
- **THEN** items are ordered from lowest acquisition friction (Claim > Instant Craft > Market Credits > Clan Dojo > Missing 1 Part > Farm/Vaulted)

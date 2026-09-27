# Spec Delta

## Purpose

Defines end-to-end (E2E) automated verification for core user journeys, data pipelines, filter reactivity, recipe inspection, and external market pricing lookups.

## ADDED Requirements

### Requirement: End-to-End Inventory Triage Verification
The test suite SHALL verify the end-to-end data pipeline from local AlecaFrame decryption (`lastData.dat`) to the triage engine and API response.

#### Scenario: Full inventory sync test
- **WHEN** the test queries `/api/triage`
- **THEN** the response returns HTTP 200 with `success: true`, a valid player profile, non-empty unmastered item pool, and valid tier count distributions matching the catalog.

### Requirement: Category and Tier Filter Reactivity
The test suite SHALL verify that category navigation and multi-tier filtering accurately slice and count catalog items.

#### Scenario: Slicing by category and tier
- **WHEN** filtering by a specific category (e.g., `Warframes`) or tier (e.g., `Tier 0 - Claim Ready`)
- **THEN** all returned items strictly match the selected criteria, and the sum of unmastered items across tiers equals the total unmastered pool.

### Requirement: Search and Sort Verification
The test suite SHALL verify search matching across item names, equipment types, components, and action directives, alongside all sort orders.

#### Scenario: Multi-field search
- **WHEN** searching for an item name or component
- **THEN** the returned items include matching results, and non-matching items are excluded.

### Requirement: Recipe Drawer and Market Lookup E2E
The test suite SHALL verify that opening an item card displays recipe components with accurate satisfaction status and verifies the Warframe Market pricing proxy.

#### Scenario: Market lookup for missing components
- **WHEN** a missing tradeable component's market slug is queried via `/api/market/[slug]`
- **THEN** the API returns HTTP 200 with lowest sell price, seller order counts, and direct market web URL.

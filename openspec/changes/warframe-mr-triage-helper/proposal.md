# Proposal

## Why

Warframe players aiming for high Mastery Rank (such as Legendary 3 to Legendary 4) face immense friction identifying which items remain unmastered, what components they already own, and the fastest path to acquire the rest. In-game menus lack consolidated gap analysis, while existing tools like AlecaFrame truncate suggestions to a "closest 20" list without actionable triage or comprehensive filtering. This change introduces a dedicated, high-performance Warframe MR Triage application that seamlessly ingests local AlecaFrame inventory data and presents an exhaustive, beautifully curated decision engine.

## What Changes

- **AlecaFrame Local Sync & Decryption**: Automatic localhost detection and optional drag-and-drop file upload for `%localappdata%\AlecaFrame\lastData.dat`, decrypted via AES-128-CBC to extract live player inventory, mastered XP records, owned blueprints, pending foundry builds, and resources.
- **Master Item & Recipe Catalog**: Integrated Warframe item database (covering Warframes, Primaries, Secondaries, Melees, Companions, Archwings, Archguns, Necramechs, and Amps) with complete blueprint crafting prerequisites and acquisition paths.
- **MR Triage & Readiness Calculation**: Exhaustive multi-tier classification of all unmastered items (Tier 0: Foundry Claimable, Tier 1: 100% Craftable Now, Tier 2: Credit / Clan Dojo Blueprints, Tier 3: Partial Primes / Weapon Parts, Tier 4: Deterministic Farms, Tier 5: RNG / Vaulted).
- **Warframe Market Integration**: Real-time plat price lookups for tradeable prime parts and weapon components to compare farming difficulty against platinum cost.
- **Apple Tahoe / iOS Minimalist UI**: High-craft interface using Motion.js with frosted acrylic glass surfaces, refined typographic rhythm, tactile segmented pill filters, and human-crafted acquisition notes.

## Capabilities

### New Capabilities
- `alecaframe-sync`: Parsing and real-time synchronization of local AlecaFrame encrypted account data and foundry state.
- `mr-triage-engine`: Catalog-wide unmastered item analysis, component inventory cross-referencing, readiness tiering, and Warframe Market price enrichment.
- `tahoe-interface`: Apple Tahoe-styled, human-centric interface with Motion.js spring transitions, drawer recipe inspectors, and exhaustive multi-attribute filtering.

### Modified Capabilities
*(None; greenfield specification set)*

## Impact

- **Dependencies**: Adds `motion` (Motion.js for React), crypto utilities for AES decryption, and `@wfcd/warframe-items` or bundled item database.
- **Architecture**: Next.js App Router route handlers for `/api/sync` and `/api/market`, with responsive client-side state for sorting and filtering.
- **Performance**: Instant client-side filtering across 700+ equipment entries with zero pagination lag.

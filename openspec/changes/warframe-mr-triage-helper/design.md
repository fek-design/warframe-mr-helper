# Design

## Context

See `proposal.md` for background and problem motivation. The application is built on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. The user runs this application locally on Windows where AlecaFrame maintains live game state at `%localappdata%\AlecaFrame\lastData.dat`.

## Goals / Non-Goals

**Goals:**
- Provide zero-friction one-click synchronization on localhost by directly reading and decrypting `%localappdata%\AlecaFrame\lastData.dat`.
- Support manual file drop for environments where direct filesystem access is unavailable.
- Provide a deterministic triage engine that categorizes every unmastered item into immediate, actionable tiers (Claimable, Craftable, Credit/Clan Dojo Blueprint, Near-Complete Prime, Targeted Farm, Vaulted).
- Render an exhaustive, fast catalog with Apple Tahoe aesthetics (glassmorphism, subtle specular borders, SF Pro / Geist typography) and Motion.js spring transitions.
- Enrich tradeable prime/syndicate items with live platinum market orders via Warframe Market API.

**Non-Goals:**
- Injecting code into the running Warframe process or reading game process memory directly (we only read AlecaFrame's local output file).
- In-game automation or automatic foundry crafting triggers (view & triage only).
- Creating custom account logins or cloud synchronization databases (all data remains local on the user's machine).

## Decisions

### Decision 1: Hybrid Local/Client Decryption Architecture
- **Choice**: The Next.js backend provides an endpoint `GET /api/sync/local` that checks the default Windows environment path `%localappdata%\AlecaFrame\lastData.dat`. A `POST /api/sync/upload` endpoint accepts uploaded files for fallback. Node's native `crypto.createDecipheriv('aes-128-cbc', key, iv)` performs decryption server-side.
- **Alternatives Considered**:
  - *Client-side Web Crypto only*: Requires the user to manually select or drag-and-drop `lastData.dat` every time they want to refresh.
  - *Direct memory reading*: High ban risk from Digital Extremes anti-cheat. Reading AlecaFrame's already-verified file is 100% safe.
- **Rationale**: Server-side local read provides a magical zero-click "Sync with AlecaFrame" button when running locally, while upload ensures portability.

### Decision 2: Warframe Item Master Catalog & Path Resolution
- **Choice**: Compile the complete Warframe item dataset (via `@wfcd/warframe-items` and AlecaFrame's cached definitions) into an optimized static lookup indexed by internal `/Lotus/...` paths.
- **Alternatives Considered**:
  - *Calling warframe-status API on every render*: Adds latency and external network dependency.
  - *Relying only on AlecaFrame's `cachedData`*: If AlecaFrame's cache is corrupt or missing, the app would fail.
- **Rationale**: Bundling a normalized schema ensures instant sub-millisecond filtering and complete offline capability.

### Decision 3: Actionable Triage Pipeline (Deterministic Scoring)
- **Choice**: A pipeline evaluates each item against the player's `Recipes`, `PendingRecipes`, and `MiscItems`:
  - **Tier 0 (Claim)**: Present in `PendingRecipes` with `CompletionDate <= now`.
  - **Tier 1 (Instant Craft)**: Blueprint present in `Recipes` AND all component item counts in `MiscItems` >= required counts.
  - **Tier 2 (Blueprint Needed)**: All components owned, but blueprint missing; source is either in-game Market (credits) or Clan Dojo Lab research.
  - **Tier 3 (Partial Components)**: Player owns 1+ unique non-resource components (e.g., Prime Barrel/Receiver); calculates missing components and queries Warframe Market plat prices.
  - **Tier 4 (Deterministic Farm)**: Star Chart bosses, Syndicate offerings, Invasions.
  - **Tier 5 (RNG / Vaulted)**: Bounties, Vaulted Relics, or Liches.
- **Rationale**: Completely replaces Aleca's vague top 20 list with an exhaustive, predictable progression roadmap.

### Decision 4: UI Architecture (Apple Tahoe Aesthetic + Motion.js)
- **Choice**: Tailwind CSS v4 styling with CSS custom properties for frosted acrylic glass (`rgba(15, 17, 23, 0.75)` with `backdrop-filter: blur(24px)`), hairline specular borders (`rgba(255, 255, 255, 0.08)`), and `motion/react` for layout animations, sliding drawers, and spring tabs.
- **Alternatives Considered**:
  - *Tailwind default cards / standard dashboard UI*: Looks generic and "AI-generated".
  - *CSS-only transitions*: Lack spring physics and fluid layout reordering when switching filters.
- **Rationale**: Delivers a tactile, refined Apple-grade software feel tailored for focused decision making.

### Decision 5: Warframe Market Proxy Route
- **Choice**: Implement `/api/market/[item]` as a cached server route in Next.js querying `api.warframe.market/v1/items/{item}/orders`.
- **Alternatives Considered**:
  - *Direct client fetch*: Blocked by browser CORS and risks client-side rate limiting.
- **Rationale**: Caching responses in-memory prevents duplicate calls and guarantees smooth browsing.

## Risks / Trade-offs

- **[Risk] AlecaFrame encryption key or file format changes** → *Mitigation*: Abstract the decryption routine into an isolated module `lib/alecaframe/decrypt.ts` with error handling and fallback parser support.
- **[Risk] Large dataset rendering performance with 700+ equipment cards** → *Mitigation*: Client-side virtualization or paginated smooth scrolling with Motion.js layout batching.
- **[Risk] Warframe Market rate limiting** → *Mitigation*: Query market orders on-demand (when an item card or drawer is inspected) and cache order results for 10 minutes.

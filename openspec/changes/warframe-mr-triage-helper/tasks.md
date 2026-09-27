# Tasks

## 1. Dependencies and Foundation

- [x] 1.1 Install `motion` (Motion.js for React) and verify installation in `package.json`
- [x] 1.2 Configure Apple Tahoe design tokens and utility classes in `src/app/globals.css` (obsidian dark canvas, frosted glass blur, specular hairline borders, SF Pro typographic scale) and verify CSS compilation

## 2. AlecaFrame Sync & Decryption Pipeline

- [x] 2.1 Implement `src/lib/alecaframe/decrypt.ts` with AES-128-CBC decryption and JSON parser, verifying with a unit test or verification script against sample payload
- [x] 2.2 Implement `GET /api/sync/local` to automatically locate and parse `%localappdata%\AlecaFrame\lastData.dat` on localhost, verifying response returns player MR, XPInfo, and inventory counts
- [x] 2.3 Implement `POST /api/sync/upload` to handle manual drag-and-drop file upload of `lastData.dat` with validation and error reporting, verifying via simulated upload

## 3. Warframe Master Catalog and Triage Engine

- [x] 3.1 Build the normalized item catalog in `src/lib/warframe/catalog.ts` mapping all masterable equipment across all categories with recipes, component requirements, and acquisition methods, verifying all categories are populated
- [x] 3.2 Implement the MR Triage calculator in `src/lib/warframe/triage.ts` classifying unmastered items into Tiers 0-5 (Claim, Instant Craft, Credit/Clan BP, Partial Prime, Farm, Vaulted), verifying classification with test cases
- [x] 3.3 Implement `GET /api/market/[slug]` with in-memory caching to fetch live lowest sell orders from Warframe Market API for tradeable prime and syndicate parts, verifying sample query for an unmastered prime part

## 4. Apple Tahoe UI & Motion.js Componentry

- [x] 4.1 Create the application header with live player status (MR badge, credits, platinum, last sync timestamp, and "Sync Now" button), verifying interactive sync feedback
- [x] 4.2 Build the category navigation pill bar with Motion.js sliding spring indicator (`layoutId`) across Warframes, Primary, Secondary, Melee, Companions, Archwing, Necramech, and Amps, verifying smooth tab transitions
- [x] 4.3 Build the filter and sort control bar (Readiness tier filter, acquisition source filter, vaulted status, and search query), verifying real-time reactive filtering
- [x] 4.4 Build the item card grid with Motion.js layout transitions displaying item icons, readiness badges, missing component badges, and natural language quick directives, verifying card rendering
- [x] 4.5 Build the iOS-style recipe inspector drawer with spring animation displaying full component checkmarks, resource deficits, plat buy prices, and step-by-step acquisition directions, verifying drawer open/close behavior

## 5. Verification and Polish

- [x] 5.1 Verify complete end-to-end flow with the user's live local AlecaFrame inventory, confirming accurate MR 33 calculation and exhaustive unmastered triage listing
- [x] 5.2 Run `npm run build` and `npm run lint` to verify clean production build without TypeScript or lint errors

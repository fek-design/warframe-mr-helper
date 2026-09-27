# Spec Delta

## Purpose

Provides automated local detection and manual upload workflows to decrypt and ingest real-time Warframe account inventory data from AlecaFrame.

## ADDED Requirements

### Requirement: Local AlecaFrame Account Detection
The system SHALL detect whether AlecaFrame's `lastData.dat` file exists in `%localappdata%\AlecaFrame` on the host machine and allow one-click synchronization.

#### Scenario: Local file detected
- **WHEN** the user opens the application on localhost and AlecaFrame is installed
- **THEN** the application detects the local data file and presents an active sync status with the player's alias and MR

#### Scenario: Local file missing
- **WHEN** the application is run in an environment without local AlecaFrame data
- **THEN** the application displays a drag-and-drop file upload zone for manual import

### Requirement: Account Data Decryption
The system SHALL decrypt `lastData.dat` using AES-128-CBC and decode the enclosed JSON inventory payload without sending unencrypted credentials off the local client/server.

#### Scenario: Valid encrypted file uploaded or read
- **WHEN** `lastData.dat` is ingested by the sync endpoint
- **THEN** the system decrypts the file, validates the JSON structure, and returns player stats, mastered XP records, owned blueprints, pending builds, and resource counts

#### Scenario: Corrupted or invalid file
- **WHEN** a malformed or non-AlecaFrame file is provided
- **THEN** the system returns a descriptive error message without crashing the application

### Requirement: Inventory State Extraction
The system SHALL parse and normalize equipment mastery XP, foundry blueprints, items currently crafting or ready to claim, and miscellaneous crafting resources.

#### Scenario: Parse player state
- **WHEN** decrypted inventory data is parsed
- **THEN** the system extracts `PlayerLevel` (MR), `XPInfo` (item mastery), `Recipes` (owned blueprints), `PendingRecipes` (foundry in-progress/claimed), and `MiscItems` (components and materials)

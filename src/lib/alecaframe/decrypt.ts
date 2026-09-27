import crypto from 'crypto';
import type { RawAlecaInventory, NormalizedPlayerProfile } from './types';

export const ALECA_KEY = Buffer.from('LEO-ALEC\tEO-ALEC', 'utf8');
export const ALECA_IV = Buffer.from([49, 50, 70, 71, 66, 51, 54, 45, 76, 69, 51, 45, 113, 61, 57, 0]);

/**
 * Decrypts a buffer containing AlecaFrame's lastData.dat
 */
export function decryptAlecaData(encryptedBuffer: Buffer): RawAlecaInventory {
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', ALECA_KEY, ALECA_IV);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    const parsed = JSON.parse(decrypted.toString('utf8')) as RawAlecaInventory;

    // Handle nested InventoryJson string if present
    if (parsed.InventoryJson && typeof parsed.InventoryJson === 'string') {
      try {
        const nested = JSON.parse(parsed.InventoryJson);
        return { ...parsed, ...nested };
      } catch {
        // Fall back to main parsed object
        return parsed;
      }
    }

    return parsed;
  } catch (error) {
    throw new Error(`Failed to decrypt AlecaFrame data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Normalizes the raw AlecaFrame inventory into a structured format for MR Triage
 */
export function normalizePlayerInventory(raw: RawAlecaInventory, syncTime = new Date().toISOString()): NormalizedPlayerProfile {
  const xpMap: Record<string, number> = {};
  const masteredUniqueNames: string[] = [];

  if (Array.isArray(raw.XPInfo)) {
    for (const entry of raw.XPInfo) {
      if (entry?.ItemType) {
        xpMap[entry.ItemType] = entry.XP || 0;
        // In Warframe, standard level 30 affinity requires 450,000 XP
        // Kuva / Tenet / Paracesis / Necramech can go to rank 40 (1,600,000 XP)
        if (entry.XP >= 450000) {
          masteredUniqueNames.push(entry.ItemType);
        }
      }
    }
  }

  // Map owned blueprints from Recipes
  const ownedBlueprints: Record<string, number> = {};
  if (Array.isArray(raw.Recipes)) {
    for (const recipe of raw.Recipes) {
      if (recipe?.ItemType) {
        ownedBlueprints[recipe.ItemType] = (ownedBlueprints[recipe.ItemType] || 0) + (recipe.ItemCount || 1);
      }
    }
  }

  // Parse pending / crafting recipes in the Foundry
  const now = Date.now();
  const pendingRecipes: NormalizedPlayerProfile['pendingRecipes'] = [];

  if (Array.isArray(raw.PendingRecipes)) {
    for (const pending of raw.PendingRecipes) {
      if (!pending?.ItemType) continue;

      let completionTimeMs = 0;
      if (typeof pending.CompletionDate === 'object' && pending.CompletionDate?.$date?.$numberLong) {
        completionTimeMs = parseInt(pending.CompletionDate.$date.$numberLong, 10);
      } else if (typeof pending.CompletionDate === 'number') {
        completionTimeMs = pending.CompletionDate;
      } else if (typeof pending.CompletionDate === 'string') {
        completionTimeMs = new Date(pending.CompletionDate).getTime();
      }

      pendingRecipes.push({
        itemType: pending.ItemType,
        isClaimable: completionTimeMs > 0 ? completionTimeMs <= now : true,
        completionTimeMs: completionTimeMs > 0 ? completionTimeMs : undefined,
      });
    }
  }

  // Collate all resource, component, and item counts
  const inventoryCounts: Record<string, number> = {};

  if (Array.isArray(raw.MiscItems)) {
    for (const item of raw.MiscItems) {
      if (item?.ItemType) {
        inventoryCounts[item.ItemType] = (inventoryCounts[item.ItemType] || 0) + (item.ItemCount || 1);
      }
    }
  }

  // Also include inventory weapons/suits that are built & in slots
  const equipmentArrays = [
    raw.Suits,
    raw.LongGuns,
    raw.Pistols,
    raw.Melee,
    raw.SpaceSuits,
    raw.SpaceGuns,
    raw.SpaceMelee,
    raw.Sentinels,
    raw.SentinelWeapons,
    raw.OperatorAmps,
  ];

  for (const list of equipmentArrays) {
    if (Array.isArray(list)) {
      for (const eq of list) {
        if (eq?.ItemType) {
          inventoryCounts[eq.ItemType] = (inventoryCounts[eq.ItemType] || 0) + 1;
        }
      }
    }
  }

  return {
    masteryRank: raw.PlayerLevel ?? 0,
    credits: raw.RegularCredits ?? 0,
    platinum: raw.PremiumCreditsFree ?? 0,
    masteredUniqueNames,
    xpMap,
    ownedBlueprints,
    pendingRecipes,
    inventoryCounts,
    lastSyncTime: syncTime,
  };
}

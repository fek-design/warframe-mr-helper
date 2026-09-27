export interface XPInfoEntry {
  ItemType: string;
  XP: number;
}

export interface RecipeEntry {
  ItemType: string;
  ItemCount?: number;
}

export interface PendingRecipeEntry {
  ItemType: string;
  CompletionDate?: {
    $date?: {
      $numberLong?: string;
    };
  } | string | number;
  ItemId?: unknown;
}

export interface MiscItemEntry {
  ItemType: string;
  ItemCount: number;
}

export interface InventoryItemEntry {
  ItemType: string;
  XP?: number;
}

export interface RawAlecaInventory {
  PlayerLevel?: number;
  RegularCredits?: number;
  PremiumCreditsFree?: number;
  XPInfo?: XPInfoEntry[];
  Recipes?: RecipeEntry[];
  PendingRecipes?: PendingRecipeEntry[];
  MiscItems?: MiscItemEntry[];
  Suits?: InventoryItemEntry[];
  LongGuns?: InventoryItemEntry[];
  Pistols?: InventoryItemEntry[];
  Melee?: InventoryItemEntry[];
  SpaceSuits?: InventoryItemEntry[];
  SpaceGuns?: InventoryItemEntry[];
  SpaceMelee?: InventoryItemEntry[];
  Sentinels?: InventoryItemEntry[];
  SentinelWeapons?: InventoryItemEntry[];
  OperatorAmps?: InventoryItemEntry[];
  InventoryJson?: string;
  [key: string]: unknown;
}

export interface NormalizedPlayerProfile {
  masteryRank: number;
  credits: number;
  platinum: number;
  masteredUniqueNames: Set<string> | string[];
  xpMap: Record<string, number>;
  ownedBlueprints: Record<string, number>;
  pendingRecipes: {
    itemType: string;
    isClaimable: boolean;
    completionTimeMs?: number;
  }[];
  inventoryCounts: Record<string, number>;
  lastSyncTime: string;
}

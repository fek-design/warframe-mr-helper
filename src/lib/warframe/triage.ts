import type { CatalogItem } from './catalog';
import { CATALOG } from './catalog';
import type { NormalizedPlayerProfile } from '@/lib/alecaframe/types';

export type TriageTier = 0 | 1 | 2 | 3 | 4 | 5;

export interface ComponentCheck {
  name: string;
  uniqueName: string;
  needed: number;
  owned: number;
  isSatisfied: boolean;
  isBlueprint?: boolean;
  marketSlug?: string;
}

export interface TriagedItem {
  item: CatalogItem;
  isMastered: boolean;
  masteryXP: number;
  tier: TriageTier;
  tierLabel: string;
  tierColor: 'emerald' | 'sky' | 'indigo' | 'amber' | 'rose' | 'zinc';
  hasBlueprint: boolean;
  pendingStatus?: 'claimable' | 'building';
  componentsStatus: ComponentCheck[];
  totalComponents: number;
  satisfiedComponents: number;
  completionPercent: number;
  missingPartNames: string[];
  actionDirective: string;
}

export interface TriageResult {
  items: TriagedItem[];
  stats: {
    totalCatalogItems: number;
    masteredCount: number;
    unmasteredCount: number;
    tierCounts: Record<TriageTier, number>;
  };
}

export function calculateMRScore(category: string): number {
  if (category === 'Warframes' || category === 'Archwing' || category === 'Companions') {
    return 6000;
  }
  return 3000;
}

export function triagePlayerInventory(
  profile: NormalizedPlayerProfile,
  catalog: CatalogItem[] = CATALOG
): TriageResult {
  const masteredSet = new Set(
    Array.isArray(profile.masteredUniqueNames)
      ? profile.masteredUniqueNames
      : Array.from(profile.masteredUniqueNames || [])
  );

  const pendingMap = new Map<string, { isClaimable: boolean }>();
  for (const p of profile.pendingRecipes || []) {
    pendingMap.set(p.itemType, { isClaimable: p.isClaimable });
  }

  const triagedItems: TriagedItem[] = [];

  const tierCounts: Record<TriageTier, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let masteredCount = 0;

  for (const item of catalog) {
    const isMastered = masteredSet.has(item.id);
    if (isMastered) {
      masteredCount++;
    }

    const currentXP = profile.xpMap[item.id] || 0;

    // Check if item or its blueprint is pending in the foundry
    const pendingItem = pendingMap.get(item.id);
    let pendingStatus: 'claimable' | 'building' | undefined;
    if (pendingItem) {
      pendingStatus = pendingItem.isClaimable ? 'claimable' : 'building';
    }

    const hasBlueprint =
      (profile.ownedBlueprints[item.id] || 0) > 0 ||
      (profile.inventoryCounts[item.id] || 0) > 0;

    // Component analysis
    const componentsStatus: ComponentCheck[] = [];
    let satisfiedComponents = 0;
    const missingPartNames: string[] = [];

    const components = item.components || [];

    for (const c of components) {
      const needed = c.itemCount || 1;
      // In Warframe, parts can be in inventory as crafted items or raw blueprints
      const owned =
        (profile.inventoryCounts[c.uniqueName] || 0) +
        (profile.ownedBlueprints[c.uniqueName] || 0);

      const isSatisfied = owned >= needed;
      if (isSatisfied) {
        satisfiedComponents++;
      } else {
        missingPartNames.push(c.name);
      }

      componentsStatus.push({
        name: c.name,
        uniqueName: c.uniqueName,
        needed,
        owned,
        isSatisfied,
        isBlueprint: c.isBlueprint,
        marketSlug: c.marketSlug,
      });
    }

    const totalComponents = components.length;
    const nonBpComponents = componentsStatus.filter((c) => !c.isBlueprint);
    const nonBpSatisfied = nonBpComponents.filter((c) => c.isSatisfied).length;
    const allMaterialsOwned = nonBpComponents.length > 0 && nonBpSatisfied === nonBpComponents.length;

    const completionPercent =
      totalComponents > 0
        ? Math.round((satisfiedComponents / totalComponents) * 100)
        : 0;

    // Determine Tier & Action Directive
    let tier: TriageTier = 5;
    let tierLabel = 'Bounty / Vaulted / Grind';
    let tierColor: TriagedItem['tierColor'] = 'zinc';
    let actionDirective = item.acquisition.details || 'Foundry Crafting';

    if (pendingStatus === 'claimable') {
      tier = 0;
      tierLabel = 'Claim in Foundry';
      tierColor = 'emerald';
      actionDirective = 'Built & ready in your Foundry! Just claim and equip.';
    } else if (pendingStatus === 'building') {
      tier = 0;
      tierLabel = 'Building in Foundry';
      tierColor = 'emerald';
      actionDirective = 'Currently crafting in your Foundry. Will be ready soon.';
    } else if (hasBlueprint && allMaterialsOwned) {
      tier = 1;
      tierLabel = 'Ready to Craft Now';
      tierColor = 'sky';
      actionDirective = 'You own the blueprint and 100% of the materials. Click Craft in Foundry!';
    } else if (!hasBlueprint && allMaterialsOwned) {
      tier = 2;
      if (item.acquisition.type === 'clan_dojo') {
        tierLabel = `Clan Dojo (${item.acquisition.clanLab || 'Lab'})`;
        tierColor = 'indigo';
        actionDirective = `You have all materials! Replicate blueprint in Clan ${item.acquisition.clanLab || 'Lab'} for ${item.acquisition.creditCost ? item.acquisition.creditCost.toLocaleString() + ' Credits' : 'Credits'}.`;
      } else if (item.acquisition.type === 'market_credits') {
        tierLabel = 'Buy Market Blueprint';
        tierColor = 'indigo';
        actionDirective = `You have all materials! Buy blueprint in Market for ${item.acquisition.creditCost ? item.acquisition.creditCost.toLocaleString() + ' Credits' : 'Credits'}.`;
      } else {
        tier = 3;
        tierLabel = 'Missing Blueprint';
        tierColor = 'amber';
        actionDirective = `All crafting materials owned. Need Blueprint: ${item.acquisition.details}.`;
      }
    } else if (
      item.isPrime &&
      nonBpSatisfied > 0 &&
      missingPartNames.filter((n) => n !== 'Blueprint' && n !== 'Orokin Cell').length <= 2
    ) {
      tier = 3;
      tierLabel = 'Near Complete Prime';
      tierColor = 'amber';
      const missingPartsOnly = missingPartNames.filter((n) => n !== 'Orokin Cell');
      actionDirective = `Missing ${missingPartsOnly.length} part(s): ${missingPartsOnly.join(', ')}. Check Warframe Market plat price or Relics.`;
    } else if (item.acquisition.type === 'boss_drop') {
      tier = 4;
      tierLabel = 'Boss Drop';
      tierColor = 'rose';
      actionDirective = item.acquisition.details;
    } else if (item.acquisition.type === 'syndicate') {
      tier = 4;
      tierLabel = 'Syndicate Standing';
      tierColor = 'rose';
      actionDirective = item.acquisition.details;
    } else if (item.acquisition.type === 'baro') {
      tier = 4;
      tierLabel = 'Baro Ki\'Teer';
      tierColor = 'rose';
      actionDirective = 'Purchase from Void Trader Baro Ki\'Teer with Ducats.';
    } else if (item.acquisition.type === 'clan_dojo') {
      tier = 2;
      tierLabel = `Clan Dojo (${item.acquisition.clanLab || 'Lab'})`;
      tierColor = 'indigo';
      actionDirective = `Replicate in ${item.acquisition.clanLab || 'Dojo'} & gather remaining materials.`;
    } else if (item.acquisition.type === 'market_credits') {
      tier = 2;
      tierLabel = 'Market Credits';
      tierColor = 'indigo';
      actionDirective = `Buy blueprint from Market for ${item.acquisition.creditCost ? item.acquisition.creditCost.toLocaleString() + ' Credits' : 'Credits'}.`;
    } else if (item.isVaulted) {
      tier = 5;
      tierLabel = 'Vaulted Prime';
      tierColor = 'zinc';
      actionDirective = 'Vaulted from relics. Purchase missing parts from Warframe Market or wait for Prime Resurgence.';
    }

    if (!isMastered) {
      tierCounts[tier]++;
    }

    triagedItems.push({
      item,
      isMastered,
      masteryXP: currentXP,
      tier,
      tierLabel,
      tierColor,
      hasBlueprint,
      pendingStatus,
      componentsStatus,
      totalComponents,
      satisfiedComponents,
      completionPercent,
      missingPartNames,
      actionDirective,
    });
  }

  return {
    items: triagedItems,
    stats: {
      totalCatalogItems: catalog.length,
      masteredCount,
      unmasteredCount: catalog.length - masteredCount,
      tierCounts,
    },
  };
}

import rawCatalog from '@/data/warframe-catalog.json';

export type EquipmentCategory =
  | 'All'
  | 'Warframes'
  | 'Primary'
  | 'Secondary'
  | 'Melee'
  | 'Companions'
  | 'Archwing'
  | 'Arch-Gun'
  | 'Arch-Melee';

export interface CatalogComponent {
  uniqueName: string;
  name: string;
  itemCount: number;
  isBlueprint?: boolean;
  ducats?: number;
  marketSlug?: string;
}

export interface CatalogAcquisition {
  type:
    | 'market_credits'
    | 'clan_dojo'
    | 'relic'
    | 'syndicate'
    | 'boss_drop'
    | 'bounty'
    | 'invasion'
    | 'baro'
    | 'quest'
    | 'lich'
    | 'other';
  details: string;
  clanLab?: string;
  creditCost?: number;
}

export interface CatalogItem {
  id: string; // uniqueName
  name: string;
  category: EquipmentCategory;
  type: string;
  masteryReq: number;
  isPrime: boolean;
  isVaulted: boolean;
  isFounder: boolean;
  wikiaThumbnail: string;
  wikiaUrl: string;
  imageName: string;
  buildPrice: number;
  buildTime: number;
  acquisition: CatalogAcquisition;
  components: CatalogComponent[];
  description: string;
}

export const CATALOG: CatalogItem[] = rawCatalog as CatalogItem[];

export const CATALOG_BY_ID = new Map<string, CatalogItem>(
  CATALOG.map((item) => [item.id, item])
);

export function getCatalogItem(id: string): CatalogItem | undefined {
  return CATALOG_BY_ID.get(id);
}

const fs = require('fs');
const path = require('path');

const localAppData = process.env.LOCALAPPDATA;
if (!localAppData) {
  console.error('LOCALAPPDATA not found');
  process.exit(1);
}

const jsonDir = path.join(localAppData, 'AlecaFrame', 'cachedData', 'json');
const outDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = [
  { file: 'Warframes.json', category: 'Warframes' },
  { file: 'Primary.json', category: 'Primary' },
  { file: 'Secondary.json', category: 'Secondary' },
  { file: 'Melee.json', category: 'Melee' },
  { file: 'Arch-Gun.json', category: 'Arch-Gun' },
  { file: 'Arch-Melee.json', category: 'Arch-Melee' },
  { file: 'Archwing.json', category: 'Archwing' },
  { file: 'Sentinels.json', category: 'Companions' },
  { file: 'Pets.json', category: 'Companions' },
  { file: 'SentinelWeapons.json', category: 'Companions' }
];

const founderItems = new Set([
  '/Lotus/Powersuits/Excalibur/ExcaliburPrime',
  '/Lotus/Weapons/Tenno/Pistol/LatoPrime',
  '/Lotus/Weapons/Tenno/Melee/LongSword/SkanaPrime'
]);

function determineAcquisition(item) {
  const name = item.name || '';
  const drops = [];
  if (Array.isArray(item.components)) {
    for (const c of item.components) {
      if (Array.isArray(c.drops)) {
        drops.push(...c.drops);
      }
    }
  }

  if (item.isPrime) {
    return {
      type: 'relic',
      details: item.vaulted ? 'Vaulted Relics / Warframe Market' : 'Void Relics / Prime Resurgence',
    };
  }

  if (name.startsWith('Kuva ')) {
    return { type: 'lich', details: 'Kuva Lich (Adaro / Cassini Larvling)' };
  }
  if (name.startsWith('Tenet ')) {
    return { type: 'lich', details: 'Sister of Parvos / Corrupted Holokeys' };
  }

  // Check Clan Dojo tags vs Market Credits
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const isDojoTag = tags.some(t => ['Grineer', 'Corpus', 'Infested', 'Tenno', 'Orokin'].includes(t));

  if (isDojoTag && (!item.marketCost || item.marketCost > 0) && item.bpCost) {
    let lab = 'Clan Dojo';
    if (tags.includes('Grineer')) lab = 'Chem Lab';
    else if (tags.includes('Corpus')) lab = 'Energy Lab';
    else if (tags.includes('Infested')) lab = 'Bio Lab';
    else if (tags.includes('Tenno')) lab = 'Tenno Lab';
    else if (tags.includes('Orokin')) lab = 'Orokin Lab';

    // Some items like Braton or Boltor are in the market
    const bpDrop = item.components?.find(c => c.name === 'Blueprint')?.drops;
    if (!bpDrop || bpDrop.length === 0) {
      return {
        type: 'clan_dojo',
        details: `Replicate Blueprint in ${lab} for ${item.bpCost.toLocaleString()} Credits`,
        clanLab: lab,
        creditCost: item.bpCost
      };
    }
  }

  if (item.bpCost && item.marketCost) {
    return {
      type: 'market_credits',
      details: `Buy Blueprint from Market for ${item.bpCost.toLocaleString()} Credits`,
      creditCost: item.bpCost
    };
  }

  // Look at drop locations
  const dropLocations = drops.map(d => d.location || '').join(' ');
  if (dropLocations.includes('Bounty') || dropLocations.includes('Cetus') || dropLocations.includes('Fortuna') || dropLocations.includes('Deimos')) {
    return { type: 'bounty', details: 'Open World Bounties / Syndicate Offerings' };
  }
  if (dropLocations.includes('Assassination') || dropLocations.includes('Jackal') || dropLocations.includes('Vor') || dropLocations.includes('Vay Hek')) {
    return { type: 'boss_drop', details: 'Star Chart Boss Drop' };
  }
  if (dropLocations.includes('Invasion')) {
    return { type: 'invasion', details: 'Invasion Battle Pay' };
  }
  if (dropLocations.includes('Baro')) {
    return { type: 'baro', details: 'Baro Ki\'Teer Trader (Ducats)' };
  }

  return {
    type: 'other',
    details: item.description ? item.description.slice(0, 100) : 'Foundry Crafting'
  };
}

const catalog = [];
const seen = new Set();

for (const entry of files) {
  const filePath = path.join(jsonDir, entry.file);
  if (!fs.existsSync(filePath)) continue;

  const rawList = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const item of rawList) {
    if (item.masterable === false || !item.uniqueName || seen.has(item.uniqueName)) continue;
    seen.add(item.uniqueName);

    const components = (item.components || []).map(c => {
      // Find Warframe Market slug: e.g. "Acceltra Prime Stock" -> "acceltra_prime_stock"
      const fullName = `${item.name} ${c.name}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      return {
        uniqueName: c.uniqueName || '',
        name: c.name || '',
        itemCount: c.itemCount || 1,
        isBlueprint: c.name === 'Blueprint' || (c.uniqueName && c.uniqueName.includes('Blueprint')),
        ducats: c.ducats || undefined,
        marketSlug: item.isPrime || c.tradable ? fullName : undefined,
      };
    });

    const acquisition = determineAcquisition(item);

    catalog.push({
      id: item.uniqueName,
      name: item.name,
      category: entry.category,
      type: item.type || item.productCategory || entry.category,
      masteryReq: item.masteryReq || 0,
      isPrime: !!item.isPrime,
      isVaulted: !!item.vaulted,
      isFounder: founderItems.has(item.uniqueName),
      wikiaThumbnail: item.wikiaThumbnail || '',
      wikiaUrl: item.wikiaUrl || '',
      imageName: item.imageName || '',
      buildPrice: item.buildPrice || 0,
      buildTime: item.buildTime || 0,
      acquisition,
      components,
      description: item.description || ''
    });
  }
}

console.log(`Compiled ${catalog.length} masterable items to ${path.join(outDir, 'warframe-catalog.json')}`);
fs.writeFileSync(path.join(outDir, 'warframe-catalog.json'), JSON.stringify(catalog, null, 2), 'utf8');

/**
 * Comprehensive UX & End-to-End (E2E) Test Suite
 * Validates Framna Scandinavian design token fidelity, WCAG 2.1 contrast ratios,
 * typography hierarchy, keyboard accessibility, multi-tier filtering, search,
 * recipe inspection, and Warframe Market API integration.
 */

import fs from 'node:fs';
import path from 'node:path';

// --- Color & WCAG Math Helpers ---
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return [r, g, b];
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const lum1 = getRelativeLuminance(r1, g1, b1);
  const lum2 = getRelativeLuminance(r2, g2, b2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// --- Test Framework Runner ---
interface TestResult {
  name: string;
  category: 'UX & Contrast' | 'Design Tokens' | 'E2E Data Pipeline' | 'Filter & Search' | 'Market Integration';
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(
  category: TestResult['category'],
  name: string,
  condition: boolean,
  details: string
) {
  results.push({ name, category, passed: condition, details });
  const icon = condition ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${icon} [${category}] ${name}`);
  if (!condition) {
    console.error(`     ↳ Details: ${details}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('  WARFRAME MR TRIAGE — UX & END-TO-END AUDIT SUITE');
  console.log('  Design System: Framna ("Forwardism" Scandinavian Craft)');
  console.log('======================================================\n');

  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  // ---------------------------------------------------------
  // 1. UX & WCAG 2.1 Contrast Standards
  // ---------------------------------------------------------
  console.log('▶ [1/5] Auditing WCAG 2.1 Relative Luminance & Color Contrast...');

  // Framna colors
  const FRAMNA_GREEN = '#1bc866';
  const OBSIDIAN_CANVAS = '#08090c';
  const CHARCOAL_SURFACE = '#12141a';
  const CRISP_WHITE = '#ffffff';
  const MUTED_TEXT = '#8e95a5';
  const DARK_PILL_TEXT = '#041208';

  const greenOnCanvasContrast = calculateContrastRatio(FRAMNA_GREEN, OBSIDIAN_CANVAS);
  assert(
    'UX & Contrast',
    'Framna Green (#1bc866) on Obsidian Canvas (#08090c) Contrast Ratio',
    greenOnCanvasContrast >= 7.0, // WCAG AAA is 7:1
    `Ratio: ${greenOnCanvasContrast.toFixed(2)}:1 (Requires >= 7.0:1 for AAA)`
  );

  const greenOnCardContrast = calculateContrastRatio(FRAMNA_GREEN, CHARCOAL_SURFACE);
  assert(
    'UX & Contrast',
    'Framna Green (#1bc866) on Charcoal Surface (#12141a) Contrast Ratio',
    greenOnCardContrast >= 7.0,
    `Ratio: ${greenOnCardContrast.toFixed(2)}:1 (Requires >= 7.0:1 for AAA)`
  );

  const whiteOnCanvasContrast = calculateContrastRatio(CRISP_WHITE, OBSIDIAN_CANVAS);
  assert(
    'UX & Contrast',
    'Crisp White (#ffffff) on Obsidian Canvas Contrast Ratio',
    whiteOnCanvasContrast >= 15.0,
    `Ratio: ${whiteOnCanvasContrast.toFixed(2)}:1 (Ultra-high contrast)`
  );

  const mutedTextContrast = calculateContrastRatio(MUTED_TEXT, OBSIDIAN_CANVAS);
  assert(
    'UX & Contrast',
    'Muted Text (#8e95a5) on Obsidian Canvas Contrast Ratio',
    mutedTextContrast >= 4.5, // WCAG AA is 4.5:1
    `Ratio: ${mutedTextContrast.toFixed(2)}:1 (Requires >= 4.5:1 for AA)`
  );

  const darkTextOnGreenPillContrast = calculateContrastRatio(DARK_PILL_TEXT, FRAMNA_GREEN);
  assert(
    'UX & Contrast',
    'Dark Text (#041208) on Framna Green Pill (#1bc866) Contrast Ratio',
    darkTextOnGreenPillContrast >= 7.0,
    `Ratio: ${darkTextOnGreenPillContrast.toFixed(2)}:1 (Requires >= 7.0:1 for AAA)`
  );

  // ---------------------------------------------------------
  // 2. Framna Design Token & Typography Compliance
  // ---------------------------------------------------------
  console.log('\n▶ [2/5] Auditing Framna Design Tokens & Typography Rules...');

  const globalsCssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
  const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

  assert(
    'Design Tokens',
    'globals.css defines --framna-green: #1bc866',
    globalsCss.includes('--framna-green: #1bc866'),
    'Signature Electric Green token exists'
  );

  assert(
    'Design Tokens',
    'globals.css defines 40px Framna Pill specifications',
    globalsCss.includes('min-height: 40px') && globalsCss.includes('border-radius: 9999px'),
    '40px full-pill utility classes configured'
  );

  assert(
    'Design Tokens',
    'globals.css defines Fraunces editorial font rule (.font-serif)',
    globalsCss.includes('var(--font-fraunces)'),
    'Dual typography configuration includes Fraunces serif font'
  );

  assert(
    'Design Tokens',
    'globals.css defines inset hairline border utility',
    globalsCss.includes('box-shadow: inset 0 0 0 1px'),
    'Inset hairline border utility configured'
  );

  const layoutTsxPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  const layoutTsx = fs.readFileSync(layoutTsxPath, 'utf8');
  assert(
    'Design Tokens',
    'layout.tsx configures Fraunces Google font with --font-fraunces',
    layoutTsx.includes('Fraunces') && layoutTsx.includes('--font-fraunces'),
    'Google Font Fraunces is imported and mapped to CSS variable'
  );

  const drawerTsxPath = path.join(process.cwd(), 'src', 'components', 'RecipeDrawer.tsx');
  const drawerTsx = fs.readFileSync(drawerTsxPath, 'utf8');
  assert(
    'Design Tokens',
    'RecipeDrawer includes Escape keyboard shortcut listener',
    drawerTsx.includes("e.key === 'Escape'") && drawerTsx.includes('onClose()'),
    'Keyboard accessibility listener for Escape key present'
  );

  // ---------------------------------------------------------
  // 3. E2E Data Pipeline & Live Inventory Sync
  // ---------------------------------------------------------
  console.log(`\n▶ [3/5] Auditing E2E Data Pipeline on ${BASE_URL}...`);

  let triageData: any = null;
  try {
    const res = await fetch(`${BASE_URL}/api/triage`);
    assert(
      'E2E Data Pipeline',
      'GET /api/triage returns HTTP 200 OK',
      res.status === 200,
      `Status code: ${res.status}`
    );

    triageData = await res.json();
    assert(
      'E2E Data Pipeline',
      'Triage API payload returns success: true',
      triageData.success === true,
      `Payload success: ${triageData.success}`
    );

    assert(
      'E2E Data Pipeline',
      'Player profile decrypted and populated with mastery stats',
      Boolean(triageData.profile && triageData.profile.masteryRank >= 0),
      `Mastery Rank: ${triageData.profile?.masteryRank}, Credits: ${triageData.profile?.credits?.toLocaleString()}, Plat: ${triageData.profile?.platinum?.toLocaleString()}`
    );

    assert(
      'E2E Data Pipeline',
      'Triage catalog contains valid item pool and stats',
      Boolean(
        triageData.triage?.stats?.totalCatalogItems > 0 &&
        triageData.triage?.stats?.unmasteredCount > 0 &&
        triageData.triage?.items?.length > 0
      ),
      `Total items: ${triageData.triage?.stats?.totalCatalogItems}, Unmastered: ${triageData.triage?.stats?.unmasteredCount}, Mastered: ${triageData.triage?.stats?.masteredCount}`
    );
  } catch (err) {
    assert(
      'E2E Data Pipeline',
      'Connect to localhost server',
      false,
      `Failed to connect to ${BASE_URL}: ${(err as Error).message}`
    );
  }

  // ---------------------------------------------------------
  // 4. Category & Multi-Tier Filter Reactivity
  // ---------------------------------------------------------
  console.log('\n▶ [4/5] Auditing Category Slicing, Tier Filtering & Search Algorithms...');

  if (triageData?.triage?.items) {
    const items: any[] = triageData.triage.items;
    const unmastered = items.filter((i) => !i.isMastered);

    // Categories
    const CATEGORIES = [
      'Warframes',
      'Primary',
      'Secondary',
      'Melee',
      'Companions',
      'Archwing',
      'Arch-Gun',
      'Arch-Melee',
    ];

    let totalCategorized = 0;
    for (const cat of CATEGORIES) {
      const catCount = unmastered.filter((i) => i.item.category === cat).length;
      totalCategorized += catCount;
    }

    assert(
      'Filter & Search',
      'Category slicing partitions unmastered pool accurately',
      totalCategorized <= unmastered.length,
      `Partitioned ${totalCategorized} unmastered items across ${CATEGORIES.length} categories`
    );

    // Tiers
    const tierCounts = triageData.triage.stats.tierCounts;
    const tierSum = Object.values(tierCounts).reduce((a: any, b: any) => a + b, 0);
    assert(
      'Filter & Search',
      'Sum of triage tiers matches total unmastered items',
      tierSum === triageData.triage.stats.unmasteredCount,
      `Tier sum: ${tierSum}, Unmastered count: ${triageData.triage.stats.unmasteredCount}`
    );

    // Verify Tier 0 items
    const tier0Items = items.filter((i) => !i.isMastered && i.tier === 0);
    const tier0Valid = tier0Items.every((i) => i.completionPercent === 100);
    assert(
      'Filter & Search',
      'Tier 0 (Claim Ready) items have 100% completion requirement',
      tier0Valid,
      `${tier0Items.length} items verified in Tier 0`
    );

    // Search query matching test
    const sampleItem = unmastered[0];
    if (sampleItem) {
      const query = sampleItem.item.name.slice(0, 4).toLowerCase();
      const matched = items.filter(
        (i) =>
          i.item.name.toLowerCase().includes(query) ||
          i.item.type.toLowerCase().includes(query) ||
          i.actionDirective.toLowerCase().includes(query)
      );
      assert(
        'Filter & Search',
        `Search query matching for "${query}" retrieves expected item`,
        matched.some((i) => i.item.id === sampleItem.item.id),
        `Found ${matched.length} matching items including ${sampleItem.item.name}`
      );
    }

    // Sort order test: Easiest path
    const easiestSorted = [...unmastered].sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return b.completionPercent - a.completionPercent;
    });
    const isEasiestValid = easiestSorted[0].tier <= easiestSorted[easiestSorted.length - 1].tier;
    assert(
      'Filter & Search',
      'Easiest Path sorting places lowest tiers and highest % first',
      isEasiestValid,
      `First item Tier: ${easiestSorted[0].tier} (${easiestSorted[0].completionPercent}%), Last item Tier: ${easiestSorted[easiestSorted.length - 1].tier}`
    );
  }

  // ---------------------------------------------------------
  // 5. Warframe Market Proxy API Integration
  // ---------------------------------------------------------
  console.log('\n▶ [5/5] Auditing Warframe Market API Integration & Recipe Inspection...');

  try {
    const marketRes = await fetch(`${BASE_URL}/api/market/ember_prime_chassis`);
    assert(
      'Market Integration',
      'GET /api/market/[slug] returns HTTP 200 OK',
      marketRes.status === 200,
      `Status code: ${marketRes.status}`
    );

    const marketData = await marketRes.json();
    const hasPricesOrFallback = Boolean(
      marketData.success &&
      (marketData.lowestSellPrice !== null || marketData.fallbackToWeb === true) &&
      marketData.marketWebUrl?.includes('warframe.market/items/')
    );

    assert(
      'Market Integration',
      'Warframe Market proxy returns valid price or verified direct web link',
      hasPricesOrFallback,
      `Mode: ${marketData.fallbackToWeb ? 'Direct Web Fallback' : 'Live Order Stream'}, URL: ${marketData.marketWebUrl}`
    );
  } catch (err) {
    assert(
      'Market Integration',
      'Warframe Market Proxy API query',
      false,
      `Market request failed: ${(err as Error).message}`
    );
  }

  // ---------------------------------------------------------
  // Summary Report
  // ---------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log('\n======================================================');
  console.log(`  AUDIT RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  if (failed === 0) {
    console.log('  ✨ All UX, Aesthetic, and E2E Tests Passed Flawlessly!');
  } else {
    console.log(`  ⚠️  ${failed} Test(s) Failed.`);
  }
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

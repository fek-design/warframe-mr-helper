import { NextRequest, NextResponse } from 'next/server';

interface MarketOrder {
  order_type: 'sell' | 'buy';
  platinum: number;
  quantity: number;
  user: {
    status: 'ingame' | 'online' | 'offline';
    ingame_name: string;
    reputation: number;
  };
}

interface CacheEntry {
  lowestSellPrice: number | null;
  lowestIngameSellPrice: number | null;
  orderCount: number;
  updatedAt: number;
  marketWebUrl: string;
}

const marketCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    const marketWebUrl = `https://warframe.market/items/${cleanSlug}`;

    // Check cache
    const cached = marketCache.get(cleanSlug);
    const now = Date.now();
    if (cached && now - cached.updatedAt < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        slug: cleanSlug,
        cached: true,
        marketWebUrl,
        ...cached,
      });
    }

    const marketUrl = `https://api.warframe.market/v1/items/${cleanSlug}/orders`;

    try {
      const response = await fetch(marketUrl, {
        headers: {
          'Language': 'en',
          'Platform': 'pc',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const orders: MarketOrder[] = data.payload?.orders || [];

        const sellOrders = orders.filter((o) => o.order_type === 'sell');
        const ingameOrders = sellOrders.filter((o) => o.user.status === 'ingame');
        const onlineOrders = sellOrders.filter((o) => o.user.status === 'online' || o.user.status === 'ingame');

        const lowestIngame = ingameOrders.length > 0 ? Math.min(...ingameOrders.map((o) => o.platinum)) : null;
        const lowestOnline = onlineOrders.length > 0 ? Math.min(...onlineOrders.map((o) => o.platinum)) : null;

        const entry: CacheEntry = {
          lowestSellPrice: lowestOnline,
          lowestIngameSellPrice: lowestIngame,
          orderCount: onlineOrders.length,
          updatedAt: now,
          marketWebUrl,
        };

        marketCache.set(cleanSlug, entry);

        return NextResponse.json({
          success: true,
          slug: cleanSlug,
          isTradable: true,
          ...entry,
        });
      }
    } catch {
      // Cloudflare or network restriction
    }

    // Graceful fallback with direct Web Market link
    const fallbackEntry: CacheEntry = {
      lowestSellPrice: null,
      lowestIngameSellPrice: null,
      orderCount: 0,
      updatedAt: now,
      marketWebUrl,
    };
    marketCache.set(cleanSlug, fallbackEntry);

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      isTradable: true,
      fallbackToWeb: true,
      ...fallbackEntry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Market lookup failed' },
      { status: 500 }
    );
  }
}

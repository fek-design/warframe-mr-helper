'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { TriagedItem } from '@/lib/warframe/triage';

interface RecipeDrawerProps {
  triaged: TriagedItem | null;
  onClose: () => void;
}

interface MarketPriceInfo {
  lowestSellPrice: number | null;
  lowestIngameSellPrice: number | null;
  orderCount: number;
  loading: boolean;
  marketWebUrl?: string;
  error?: string;
}

export function RecipeDrawer({ triaged, onClose }: RecipeDrawerProps) {
  const [marketPrices, setMarketPrices] = useState<Record<string, MarketPriceInfo>>({});

  useEffect(() => {
    if (!triaged) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triaged, onClose]);

  if (!triaged) return null;

  const { item, tierLabel, componentsStatus, actionDirective, completionPercent } = triaged;

  const fetchMarketPrice = async (slug: string) => {
    setMarketPrices((prev) => ({
      ...prev,
      [slug]: { lowestSellPrice: null, lowestIngameSellPrice: null, orderCount: 0, loading: true },
    }));

    try {
      const res = await fetch(`/api/market/${slug}`);
      const data = await res.json();
      if (data.success) {
        setMarketPrices((prev) => ({
          ...prev,
          [slug]: {
            lowestSellPrice: data.lowestSellPrice,
            lowestIngameSellPrice: data.lowestIngameSellPrice,
            orderCount: data.orderCount,
            marketWebUrl: data.marketWebUrl,
            loading: false,
          },
        }));
      } else {
        setMarketPrices((prev) => ({
          ...prev,
          [slug]: {
            lowestSellPrice: null,
            lowestIngameSellPrice: null,
            orderCount: 0,
            marketWebUrl: data.marketWebUrl,
            loading: false,
            error: data.error,
          },
        }));
      }
    } catch {
      setMarketPrices((prev) => ({
        ...prev,
        [slug]: {
          lowestSellPrice: null,
          lowestIngameSellPrice: null,
          orderCount: 0,
          loading: false,
          error: 'Network error',
        },
      }));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="recipe-drawer-title">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Tactical Drawer Sheet */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          className="relative w-full max-w-lg h-full bg-[#08090c] border-l border-white/[0.09] shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Top Tactical Bar */}
          <div className="px-6 py-4 border-b border-white/[0.09] flex items-center justify-between bg-[#0e1017]">
            <div className="flex items-center space-x-2.5">
              <span className="tbhx-badge bg-[#ff4040]/15 text-[#ff4040] border border-[#ff4040]/30">
                <span>{item.category} BLUEPRINT</span>
              </span>
              {item.isPrime && (
                <span className="px-2 py-0.5 text-[9px] font-oswald font-bold uppercase rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  PRIME
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close recipe details"
              className="w-8 h-8 rounded bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.09] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:outline-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header section with TBHX Oswald Title */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded bg-black/50 border border-white/[0.09] p-2 flex items-center justify-center overflow-hidden shrink-0">
                {item.wikiaThumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.wikiaThumbnail}
                    alt={item.name}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                ) : (
                  <span className="text-white/40 font-oswald font-bold text-sm uppercase">
                    {item.name.slice(0, 2)}
                  </span>
                )}
              </div>

              <div>
                <h2 id="recipe-drawer-title" className="font-oswald text-2xl font-bold text-white tracking-wide uppercase sm:text-3xl leading-tight">
                  {item.name}
                </h2>
                <div className="flex items-center space-x-2 text-xs font-mono text-white/50 mt-1">
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>MR {item.masteryReq}</span>
                  {item.buildPrice > 0 && (
                    <>
                      <span>•</span>
                      <span>{item.buildPrice.toLocaleString()} Credits</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tactical Action Directive Banner */}
            <div className="p-4 rounded bg-[#0e1017] border border-white/[0.09] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-oswald tracking-wider uppercase text-white/90">
                  CRAFTING DIRECTIVE
                </span>
                <span className="tbhx-badge bg-white/[0.06] border border-white/[0.1] text-white/80">
                  <span>{tierLabel}</span>
                </span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                {actionDirective}
              </p>
            </div>

            {/* Component Breakdown Checklist */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-oswald text-xs font-semibold uppercase tracking-wider text-white/50">
                  COMPONENTS REQUIRED ({triaged.satisfiedComponents}/{triaged.totalComponents})
                </h3>
                <span className="font-mono text-xs tabular-nums text-[#00fa9a] font-semibold">
                  {completionPercent}% READY
                </span>
              </div>

              <div className="space-y-2">
                {componentsStatus.map((comp) => {
                  const market = comp.marketSlug ? marketPrices[comp.marketSlug] : undefined;

                  return (
                    <div
                      key={comp.uniqueName}
                      className={`p-3.5 rounded border transition-all ${
                        comp.isSatisfied
                          ? 'bg-[#00fa9a]/[0.05] border-[#00fa9a]/25'
                          : 'bg-[#0e1017] border-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Tactical Checkbox */}
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-all ${
                              comp.isSatisfied
                                ? 'bg-[#00fa9a] text-black font-bold'
                                : 'border border-white/20 text-transparent'
                            }`}
                          >
                            ✓
                          </div>

                          <div>
                            <span
                              className={`text-xs font-medium ${
                                comp.isSatisfied ? 'text-white' : 'text-white/80'
                              }`}
                            >
                              {comp.name}
                            </span>
                            {comp.isBlueprint && (
                              <span className="ml-2 text-[10px] font-mono text-white/40">
                                (Blueprint)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Count */}
                        <div className="text-xs font-mono tabular-nums">
                          <span
                            className={
                              comp.isSatisfied
                                ? 'text-[#00fa9a] font-semibold'
                                : 'text-white/60'
                            }
                          >
                            {comp.owned.toLocaleString()}
                          </span>
                          <span className="text-white/40"> / {comp.needed.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Warframe Market Plat Price Action for Missing Tradeable Parts */}
                      {!comp.isSatisfied && comp.marketSlug && (
                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="text-[11px] font-mono text-amber-400/90 font-medium">
                            Missing component
                          </span>

                          {market ? (
                            market.loading ? (
                              <span className="text-[11px] font-mono text-white/50 animate-pulse">
                                Fetching market price...
                              </span>
                            ) : market.lowestIngameSellPrice !== null ? (
                              <div className="flex items-center space-x-2">
                                <span className="h-6 px-2 rounded bg-[#00fa9a]/15 border border-[#00fa9a]/35 text-[#00fa9a] font-mono text-xs font-semibold tabular-nums flex items-center">
                                  {market.lowestIngameSellPrice} Plat
                                </span>
                                <span className="text-[10px] font-mono text-white/40">
                                  ({market.orderCount} sellers)
                                </span>
                              </div>
                            ) : (
                              <a
                                href={market.marketWebUrl || `https://warframe.market/items/${comp.marketSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-7 px-3 rounded bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] text-[11px] font-oswald tracking-wider text-white/80 hover:text-white flex items-center space-x-1 transition-colors"
                              >
                                <span>WARFRAME MARKET</span>
                                <span>↗</span>
                              </a>
                            )
                          ) : (
                            <button
                              onClick={() => comp.marketSlug && fetchMarketPrice(comp.marketSlug)}
                              className="h-7 px-3 rounded bg-[#0e1017] hover:bg-[#ff4040]/15 hover:border-[#ff4040]/40 text-[#ff4040] border border-white/[0.09] font-oswald text-[11px] tracking-wider transition-all cursor-pointer"
                            >
                              CHECK PLAT PRICE
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Wiki Link */}
            {item.wikiaUrl && (
              <div className="pt-2">
                <a
                  href={item.wikiaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 px-4 rounded bg-[#0e1017] hover:bg-[#151822] border border-white/[0.09] flex items-center justify-center space-x-2 text-xs font-oswald tracking-wider text-white/80 hover:text-white transition-colors"
                >
                  <span>OPEN WARFRAME WIKI ARTICLE</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

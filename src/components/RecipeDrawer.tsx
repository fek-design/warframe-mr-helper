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
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Drawer Sheet */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-lg h-full bg-[#0c0e14] border-l border-white/[0.08] shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-6 py-4.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/60 font-semibold bg-white/[0.04] rounded-full border border-white/[0.08]">
                {item.category} Recipe
              </span>
              {item.isPrime && (
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Prime
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close recipe details"
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header section with Fraunces Editorial Title */}
            <div className="flex items-center space-x-4.5">
              <div className="w-18 h-18 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-2 flex items-center justify-center overflow-hidden shrink-0">
                {item.wikiaThumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.wikiaThumbnail}
                    alt={item.name}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                ) : (
                  <span className="text-white/40 font-bold text-sm uppercase">
                    {item.name.slice(0, 2)}
                  </span>
                )}
              </div>

              <div>
                <h2 id="recipe-drawer-title" className="font-serif text-2xl font-normal text-white tracking-tight sm:text-3xl leading-tight">
                  {item.name}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-white/50 mt-1">
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
            <div className="p-4.5 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">
                  Actionable Strategy
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.06] border border-white/[0.08] text-white/80">
                  {tierLabel}
                </span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                {actionDirective}
              </p>
            </div>

            {/* Component Breakdown Checklist */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Components Required ({triaged.satisfiedComponents}/{triaged.totalComponents})
                </h3>
                <span className="text-xs tabular-nums text-[#1bc866] font-semibold">
                  {completionPercent}% Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {componentsStatus.map((comp) => {
                  const market = comp.marketSlug ? marketPrices[comp.marketSlug] : undefined;

                  return (
                    <div
                      key={comp.uniqueName}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        comp.isSatisfied
                          ? 'bg-[#1bc866]/[0.05] border-[#1bc866]/25'
                          : 'bg-white/[0.02] border-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Framna Electric Green Checkbox */}
                          <div
                            className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              comp.isSatisfied
                                ? 'bg-[#1bc866] text-[#041208] shadow-[0_0_10px_rgba(27,200,102,0.5)]'
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
                              <span className="ml-2 text-[10px] text-white/40 font-normal">
                                (Blueprint)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Count */}
                        <div className="text-xs tabular-nums font-medium">
                          <span
                            className={
                              comp.isSatisfied
                                ? 'text-[#1bc866] font-semibold'
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
                        <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between">
                          <span className="text-[11px] text-amber-400/90 font-medium">
                            Missing component
                          </span>

                          {market ? (
                            market.loading ? (
                              <span className="text-[11px] text-white/50 animate-pulse">
                                Fetching market price...
                              </span>
                            ) : market.lowestIngameSellPrice !== null ? (
                              <div className="flex items-center space-x-2">
                                <span className="h-7 px-2.5 rounded-full bg-[#1bc866]/15 border border-[#1bc866]/35 text-[#1bc866] text-xs font-semibold tabular-nums flex items-center">
                                  {market.lowestIngameSellPrice} Plat
                                </span>
                                <span className="text-[10px] text-white/40">
                                  ({market.orderCount} sellers)
                                </span>
                              </div>
                            ) : (
                              <a
                                href={market.marketWebUrl || `https://warframe.market/items/${comp.marketSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-7 px-3 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-[11px] text-white/80 hover:text-white font-medium flex items-center space-x-1 transition-colors"
                              >
                                <span>Warframe Market</span>
                                <span>↗</span>
                              </a>
                            )
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => comp.marketSlug && fetchMarketPrice(comp.marketSlug)}
                              className="h-7 px-3 rounded-full bg-white/[0.04] hover:bg-[#1bc866]/15 hover:border-[#1bc866]/35 text-[#1bc866] border border-white/[0.08] text-[11px] font-medium transition-all cursor-pointer"
                            >
                              Check Market Plat Price
                            </motion.button>
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
                  className="w-full h-11 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center space-x-2 text-xs font-medium text-white/80 hover:text-white transition-colors"
                >
                  <span>Open Warframe Wiki Article</span>
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

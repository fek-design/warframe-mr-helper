'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { TriagedItem } from '@/lib/warframe/triage';

interface ItemCardProps {
  triaged: TriagedItem;
  onSelect: (item: TriagedItem) => void;
}

export function ItemCard({ triaged, onSelect }: ItemCardProps) {
  const { item, tierLabel, tierColor, completionPercent, actionDirective, isMastered } = triaged;
  const [imgError, setImgError] = useState(false);

  // Framna high-contrast tier badge styles
  const tierBadgeStyles: Record<string, string> = {
    emerald: 'bg-[#1bc866]/15 border-[#1bc866]/35 text-[#1bc866] shadow-[0_0_12px_rgba(27,200,102,0.18)]',
    sky: 'bg-sky-500/15 border-sky-400/35 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.18)]',
    indigo: 'bg-indigo-500/15 border-indigo-400/35 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.18)]',
    amber: 'bg-amber-500/15 border-amber-400/35 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.18)]',
    rose: 'bg-rose-500/15 border-rose-400/35 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.18)]',
    zinc: 'bg-zinc-500/20 border-zinc-500/35 text-zinc-300',
  };

  const badgeClass = tierBadgeStyles[tierColor] || tierBadgeStyles.zinc;

  return (
    <motion.div
      layout
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(triaged)}
      className="framna-card p-5 flex flex-col justify-between cursor-pointer select-none group relative overflow-hidden"
    >
      {/* Top subtle highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center space-x-3.5">
            {/* Thumbnail */}
            <div className="w-13 h-13 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-1.5 overflow-hidden shrink-0 group-hover:border-white/20 transition-colors">
              {!imgError && item.wikiaThumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.wikiaThumbnail}
                  alt={item.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-white/40 font-bold text-xs uppercase tracking-wider">
                  {item.name.slice(0, 2)}
                </span>
              )}
            </div>

            {/* Name & Type */}
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-semibold text-sm text-white tracking-tight group-hover:text-[#1bc866] transition-colors line-clamp-1">
                  {item.name}
                </h3>
                {item.isPrime && (
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Prime
                  </span>
                )}
                {isMastered && (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#1bc866]/15 text-[#1bc866] border border-[#1bc866]/30">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/50">
                {item.type || item.category} {item.masteryReq > 0 ? `• MR ${item.masteryReq}` : ''}
              </p>
            </div>
          </div>

          {/* Floating Tier Pill */}
          <span
            className={`px-2.5 py-0.5 text-[10px] font-medium tracking-wide rounded-full border whitespace-nowrap ${badgeClass}`}
          >
            {tierLabel}
          </span>
        </div>

        {/* Natural Language Human Directive */}
        <div className="mt-2.5 py-2 px-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/80 leading-relaxed font-normal">
          {actionDirective}
        </div>
      </div>

      {/* Bottom Progress Bar & Parts */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
        {/* Component Dots / Progress */}
        <div className="flex items-center space-x-2.5">
          <div className="w-18 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completionPercent === 100
                  ? 'bg-[#1bc866]'
                  : completionPercent > 50
                  ? 'bg-sky-400'
                  : 'bg-white/40'
              }`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-white/50 tabular-nums font-medium">
            {triaged.satisfiedComponents}/{triaged.totalComponents} parts ({completionPercent}%)
          </span>
        </div>

        {/* Action hint */}
        <span className="text-[10px] text-[#1bc866] group-hover:text-[#25e277] font-medium flex items-center space-x-1">
          <span>View recipe</span>
          <span className="text-xs leading-none">→</span>
        </span>
      </div>
    </motion.div>
  );
}

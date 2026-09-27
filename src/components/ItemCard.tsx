'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { TriagedItem } from '@/lib/warframe/triage';

interface ItemCardProps {
  triaged: TriagedItem;
  onSelect: (item: TriagedItem) => void;
}

export function ItemCard({ triaged, onSelect }: ItemCardProps) {
  const { item, tier, tierLabel, completionPercent, actionDirective, isMastered } = triaged;
  const [imgError, setImgError] = useState(false);

  // TBHX Hero Tier Badges
  const getTierBadge = () => {
    switch (tier) {
      case 0:
        return 'bg-[#ff4040]/15 border-[#ff4040]/40 text-[#ff4040]';
      case 1:
        return 'bg-[#00fa9a]/15 border-[#00fa9a]/40 text-[#00fa9a]';
      case 2:
        return 'bg-[#fcc800]/15 border-[#fcc800]/40 text-[#fcc800]';
      case 3:
        return 'bg-[#ff9933]/15 border-[#ff9933]/40 text-[#ff9933]';
      case 4:
        return 'bg-[#a855f7]/15 border-[#a855f7]/40 text-[#a855f7]';
      case 5:
      default:
        return 'bg-zinc-700/20 border-zinc-600/35 text-zinc-300';
    }
  };

  const badgeClass = getTierBadge();

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={() => onSelect(triaged)}
      className="tbhx-card p-4.5 flex flex-col justify-between cursor-pointer select-none group relative overflow-hidden"
    >
      {/* Top subtle highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center space-x-3">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded bg-black/40 border border-white/[0.08] flex items-center justify-center p-1 overflow-hidden shrink-0 group-hover:border-[#ff4040]/50 transition-colors">
              {!imgError && item.wikiaThumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.wikiaThumbnail}
                  alt={item.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-white/40 font-oswald font-bold text-xs uppercase tracking-wider">
                  {item.name.slice(0, 2)}
                </span>
              )}
            </div>

            {/* Name & Type */}
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-oswald font-semibold text-sm text-white tracking-wide group-hover:text-[#ff4040] transition-colors line-clamp-1">
                  {item.name}
                </h3>
                {item.isPrime && (
                  <span className="px-1.5 py-0.2 text-[9px] font-oswald font-bold uppercase tracking-wider rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    PRIME
                  </span>
                )}
                {isMastered && (
                  <span className="px-1.5 py-0.2 text-[9px] font-oswald font-bold rounded bg-[#00fa9a]/15 text-[#00fa9a] border border-[#00fa9a]/30">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/50 font-mono">
                {item.type || item.category} {item.masteryReq > 0 ? `• MR ${item.masteryReq}` : ''}
              </p>
            </div>
          </div>

          {/* TBHX Skewed Tier Badge */}
          <span
            className={`tbhx-badge border whitespace-nowrap ${badgeClass}`}
          >
            <span>{tierLabel}</span>
          </span>
        </div>

        {/* Down-to-earth Action Directive */}
        <div className="mt-2 py-2 px-2.5 rounded bg-black/30 border border-white/[0.06] text-[11px] text-white/75 leading-relaxed font-normal">
          {actionDirective}
        </div>
      </div>

      {/* Bottom Progress Bar & Parts */}
      <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
        {/* Component Progress */}
        <div className="flex items-center space-x-2">
          <div className="w-16 h-1 rounded bg-white/[0.08] overflow-hidden">
            <div
              className={`h-full rounded transition-all duration-300 ${
                completionPercent === 100
                  ? 'bg-[#ff4040]'
                  : completionPercent > 50
                  ? 'bg-[#00fa9a]'
                  : 'bg-white/40'
              }`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/50 tabular-nums">
            {triaged.satisfiedComponents}/{triaged.totalComponents} parts ({completionPercent}%)
          </span>
        </div>

        {/* Action hint */}
        <span className="text-[10px] font-oswald tracking-wider text-[#ff4040] group-hover:text-[#ff6666] font-medium flex items-center space-x-1">
          <span>BLUEPRINT</span>
          <span className="text-xs leading-none">→</span>
        </span>
      </div>
    </motion.div>
  );
}

'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { TriageTier } from '@/lib/warframe/triage';

export type TierFilterOption = 'all_unmastered' | 'all' | 'mastered' | TriageTier;
export type SortOption = 'easiest' | 'completion' | 'name' | 'mr_asc' | 'mr_desc';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTierFilter: TierFilterOption;
  onSelectTierFilter: (t: TierFilterOption) => void;
  sortOption: SortOption;
  onSelectSort: (s: SortOption) => void;
  hideVaulted: boolean;
  onToggleHideVaulted: () => void;
  hideFounder: boolean;
  onToggleHideFounder: () => void;
  tierCounts: Record<TriageTier, number>;
  unmasteredCount: number;
  masteredCount: number;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  activeTierFilter,
  onSelectTierFilter,
  sortOption,
  onSelectSort,
  hideVaulted,
  onToggleHideVaulted,
  hideFounder,
  onToggleHideFounder,
  tierCounts,
  unmasteredCount,
  masteredCount,
}: FilterBarProps) {
  return (
    <div className="space-y-3.5">
      {/* Top row: Framna Search & Sorting Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar - 40px Pill */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search weapons, warframes, components..."
            className="w-full h-10 pl-10 pr-9 rounded-full bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-white/[0.08] focus:border-[#1bc866]/50 focus:ring-1 focus:ring-[#1bc866]/30 text-xs text-white placeholder-white/40 focus:outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#1bc866]/60"
          />
          <svg
            className="absolute left-3.5 top-3 w-4 h-4 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-3.5 top-2.5 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white/40 hover:text-white/80 bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort & Toggles - 40px Pills */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3.5 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs focus-within:ring-2 focus-within:ring-[#1bc866]/60">
            <span className="text-white/40 text-[11px] font-medium">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              aria-label="Sort inventory items"
              className="bg-transparent text-white/90 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="easiest" className="bg-[#0f1118] text-white">
                Easiest Path
              </option>
              <option value="completion" className="bg-[#0f1118] text-white">
                Highest Completion %
              </option>
              <option value="name" className="bg-[#0f1118] text-white">
                Name (A-Z)
              </option>
              <option value="mr_asc" className="bg-[#0f1118] text-white">
                Mastery (Low to High)
              </option>
              <option value="mr_desc" className="bg-[#0f1118] text-white">
                Mastery (High to Low)
              </option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onToggleHideVaulted}
            className={`px-3.5 h-10 rounded-full text-xs font-medium border transition-colors cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none ${
              hideVaulted
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-white/[0.03] text-white/60 hover:text-white border-white/[0.08]'
            }`}
          >
            Hide Vaulted
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onToggleHideFounder}
            className={`px-3.5 h-10 rounded-full text-xs font-medium border transition-colors cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none ${
              hideFounder
                ? 'bg-[#1bc866]/15 text-[#1bc866] border-[#1bc866]/35 shadow-[0_0_12px_rgba(27,200,102,0.2)]'
                : 'bg-white/[0.03] text-white/60 hover:text-white border-white/[0.08]'
            }`}
          >
            Hide Founder
          </motion.button>
        </div>
      </div>

      {/* Framna Readiness Tier Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter('all_unmastered')}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none ${
            activeTierFilter === 'all_unmastered'
              ? 'bg-white text-[#08090c] font-semibold shadow-sm'
              : 'bg-white/[0.04] text-white/70 hover:text-white border border-white/[0.08]'
          }`}
        >
          <span>All Unmastered</span>
          <span
            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full ${
              activeTierFilter === 'all_unmastered'
                ? 'bg-[#08090c]/12 text-[#08090c]'
                : 'bg-white/10 text-white/70'
            }`}
          >
            {unmasteredCount}
          </span>
        </motion.button>

        {/* Tier 0: Claim Ready */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter(0)}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none ${
            activeTierFilter === 0
              ? 'bg-[#1bc866] text-[#041208] font-bold shadow-[0_0_16px_rgba(27,200,102,0.45)]'
              : 'bg-white/[0.04] text-[#1bc866] hover:bg-white/[0.07] border border-[#1bc866]/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Claim Ready</span>
          <span
            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full ${
              activeTierFilter === 0
                ? 'bg-[#041208]/20 text-[#041208]'
                : 'bg-[#1bc866]/15 text-[#1bc866]'
            }`}
          >
            {tierCounts[0]}
          </span>
        </motion.button>

        {/* Tier 1: 100% Craftable */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter(1)}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:outline-none ${
            activeTierFilter === 1
              ? 'bg-sky-400 text-[#041208] font-bold shadow-[0_0_16px_rgba(56,189,248,0.45)]'
              : 'bg-white/[0.04] text-sky-400 hover:bg-white/[0.07] border border-sky-400/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>100% Craftable</span>
          <span
            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full ${
              activeTierFilter === 1
                ? 'bg-[#041208]/20 text-[#041208]'
                : 'bg-sky-400/15 text-sky-400'
            }`}
          >
            {tierCounts[1]}
          </span>
        </motion.button>

        {/* Tier 2: Market / Clan Dojo */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter(2)}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:outline-none ${
            activeTierFilter === 2
              ? 'bg-indigo-400 text-[#041208] font-bold shadow-[0_0_16px_rgba(129,140,248,0.45)]'
              : 'bg-white/[0.04] text-indigo-400 hover:bg-white/[0.07] border border-indigo-400/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Market / Clan Dojo</span>
          <span
            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full ${
              activeTierFilter === 2
                ? 'bg-[#041208]/20 text-[#041208]'
                : 'bg-indigo-400/15 text-indigo-400'
            }`}
          >
            {tierCounts[2]}
          </span>
        </motion.button>

        {/* Tier 3: Near Complete */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter(3)}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:outline-none ${
            activeTierFilter === 3
              ? 'bg-amber-400 text-[#041208] font-bold shadow-[0_0_16px_rgba(251,191,36,0.45)]'
              : 'bg-white/[0.04] text-amber-400 hover:bg-white/[0.07] border border-amber-400/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Near Complete (1-2 Parts)</span>
          <span
            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full ${
              activeTierFilter === 3
                ? 'bg-[#041208]/20 text-[#041208]'
                : 'bg-amber-400/15 text-amber-400'
            }`}
          >
            {tierCounts[3]}
          </span>
        </motion.button>

        {/* Tier 4: Targeted Farm */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter(4)}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:outline-none ${
            activeTierFilter === 4
              ? 'bg-rose-400 text-[#041208] font-bold shadow-[0_0_16px_rgba(251,113,133,0.45)]'
              : 'bg-white/[0.04] text-rose-400 hover:bg-white/[0.07] border border-rose-400/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Targeted Farm</span>
          <span
            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full ${
              activeTierFilter === 4
                ? 'bg-[#041208]/20 text-[#041208]'
                : 'bg-rose-400/15 text-rose-400'
            }`}
          >
            {tierCounts[4]}
          </span>
        </motion.button>

        {/* Tier 5: Vaulted / Grind */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter(5)}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:outline-none ${
            activeTierFilter === 5
              ? 'bg-zinc-200 text-[#08090c] font-bold'
              : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.07] border border-zinc-500/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Vaulted / Grind</span>
          <span
            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full ${
              activeTierFilter === 5
                ? 'bg-[#08090c]/15 text-[#08090c]'
                : 'bg-zinc-500/20 text-zinc-400'
            }`}
          >
            {tierCounts[5]}
          </span>
        </motion.button>

        {/* Mastered */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectTierFilter('mastered')}
          className={`h-9 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none ${
            activeTierFilter === 'mastered'
              ? 'bg-white/20 text-white font-semibold border border-white/30'
              : 'bg-white/[0.03] text-white/50 hover:text-white/80 border border-white/[0.08]'
          }`}
        >
          <span>✓ Mastered</span>
          <span className="text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white/80">
            {masteredCount}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

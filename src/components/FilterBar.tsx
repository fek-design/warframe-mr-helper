'use client';

import React from 'react';
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
      {/* Top row: Search & Sorting */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tactical Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search weapons, Warframes, blueprints..."
            className="w-full h-9 pl-9 pr-9 rounded bg-[#0e1017] hover:bg-[#151822] focus:bg-[#151822] border border-white/[0.09] focus:border-[#ff4040]/70 focus:ring-1 focus:ring-[#ff4040]/40 text-xs text-white placeholder-white/40 focus:outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#ff4040]"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-white/40"
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
              className="absolute right-3 top-2 w-5 h-5 rounded flex items-center justify-center text-xs text-white/40 hover:text-white bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:outline-none cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort & Toggles */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 h-9 rounded bg-[#0e1017] border border-white/[0.09] text-xs">
            <span className="text-white/40 font-oswald text-[11px] tracking-wider">SORT:</span>
            <select
              value={sortOption}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              aria-label="Sort inventory items"
              className="bg-transparent text-white/90 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="easiest" className="bg-[#0e1017] text-white">
                Easiest Path First
              </option>
              <option value="completion" className="bg-[#0e1017] text-white">
                Highest Parts Owned
              </option>
              <option value="name" className="bg-[#0e1017] text-white">
                Name (A to Z)
              </option>
              <option value="mr_asc" className="bg-[#0e1017] text-white">
                Mastery (Low to High)
              </option>
              <option value="mr_desc" className="bg-[#0e1017] text-white">
                Mastery (High to Low)
              </option>
            </select>
          </div>

          <button
            onClick={onToggleHideVaulted}
            className={`px-3 h-9 rounded text-xs font-oswald tracking-wider border transition-colors cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:outline-none ${
              hideVaulted
                ? 'bg-[#ff4040]/15 text-[#ff4040] border-[#ff4040]/40'
                : 'bg-[#0e1017] text-white/60 hover:text-white border-white/[0.09]'
            }`}
          >
            HIDE VAULTED
          </button>

          <button
            onClick={onToggleHideFounder}
            className={`px-3 h-9 rounded text-xs font-oswald tracking-wider border transition-colors cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:outline-none ${
              hideFounder
                ? 'bg-[#00fa9a]/15 text-[#00fa9a] border-[#00fa9a]/40'
                : 'bg-[#0e1017] text-white/60 hover:text-white border-white/[0.09]'
            }`}
          >
            HIDE FOUNDER
          </button>
        </div>
      </div>

      {/* TBHX Tournament Tier Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {/* All Unmastered */}
        <button
          onClick={() => onSelectTierFilter('all_unmastered')}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:outline-none ${
            activeTierFilter === 'all_unmastered'
              ? 'bg-[#ff4040] text-white font-semibold shadow-[0_2px_10px_rgba(255,64,64,0.35)]'
              : 'bg-[#0e1017] text-white/70 hover:text-white border border-white/[0.09]'
          }`}
        >
          <span>ALL UNMASTERED</span>
          <span
            className={`text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded ${
              activeTierFilter === 'all_unmastered'
                ? 'bg-black/30 text-white'
                : 'bg-white/10 text-white/60'
            }`}
          >
            {unmasteredCount}
          </span>
        </button>

        {/* Tier 0: Ready in Foundry */}
        <button
          onClick={() => onSelectTierFilter(0)}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:outline-none ${
            activeTierFilter === 0
              ? 'bg-[#ff4040] text-white font-bold shadow-[0_2px_12px_rgba(255,64,64,0.4)]'
              : 'bg-[#0e1017] text-[#ff4040] hover:bg-[#151822] border border-[#ff4040]/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>READY IN FOUNDRY</span>
          <span
            className={`text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded ${
              activeTierFilter === 0 ? 'bg-black/30 text-white' : 'bg-[#ff4040]/15 text-[#ff4040]'
            }`}
          >
            {tierCounts[0]}
          </span>
        </button>

        {/* Tier 1: Ready to Build */}
        <button
          onClick={() => onSelectTierFilter(1)}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00fa9a] focus-visible:outline-none ${
            activeTierFilter === 1
              ? 'bg-[#00fa9a] text-black font-bold shadow-[0_2px_12px_rgba(0,250,154,0.4)]'
              : 'bg-[#0e1017] text-[#00fa9a] hover:bg-[#151822] border border-[#00fa9a]/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>READY TO BUILD</span>
          <span
            className={`text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded ${
              activeTierFilter === 1 ? 'bg-black/20 text-black' : 'bg-[#00fa9a]/15 text-[#00fa9a]'
            }`}
          >
            {tierCounts[1]}
          </span>
        </button>

        {/* Tier 2: Market / Dojo BP */}
        <button
          onClick={() => onSelectTierFilter(2)}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fcc800] focus-visible:outline-none ${
            activeTierFilter === 2
              ? 'bg-[#fcc800] text-black font-bold shadow-[0_2px_12px_rgba(252,200,0,0.4)]'
              : 'bg-[#0e1017] text-[#fcc800] hover:bg-[#151822] border border-[#fcc800]/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>MARKET / DOJO BP</span>
          <span
            className={`text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded ${
              activeTierFilter === 2 ? 'bg-black/20 text-black' : 'bg-[#fcc800]/15 text-[#fcc800]'
            }`}
          >
            {tierCounts[2]}
          </span>
        </button>

        {/* Tier 3: 1-2 Parts Needed */}
        <button
          onClick={() => onSelectTierFilter(3)}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff9933] focus-visible:outline-none ${
            activeTierFilter === 3
              ? 'bg-[#ff9933] text-black font-bold shadow-[0_2px_12px_rgba(255,153,51,0.4)]'
              : 'bg-[#0e1017] text-[#ff9933] hover:bg-[#151822] border border-[#ff9933]/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>1-2 PARTS NEEDED</span>
          <span
            className={`text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded ${
              activeTierFilter === 3 ? 'bg-black/20 text-black' : 'bg-[#ff9933]/15 text-[#ff9933]'
            }`}
          >
            {tierCounts[3]}
          </span>
        </button>

        {/* Tier 4: Farming Needed */}
        <button
          onClick={() => onSelectTierFilter(4)}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:outline-none ${
            activeTierFilter === 4
              ? 'bg-[#a855f7] text-white font-bold shadow-[0_2px_12px_rgba(168,85,247,0.4)]'
              : 'bg-[#0e1017] text-[#a855f7] hover:bg-[#151822] border border-[#a855f7]/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>FARMING NEEDED</span>
          <span
            className={`text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded ${
              activeTierFilter === 4 ? 'bg-black/30 text-white' : 'bg-[#a855f7]/15 text-[#a855f7]'
            }`}
          >
            {tierCounts[4]}
          </span>
        </button>

        {/* Tier 5: Vaulted / Special */}
        <button
          onClick={() => onSelectTierFilter(5)}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none ${
            activeTierFilter === 5
              ? 'bg-zinc-200 text-black font-bold'
              : 'bg-[#0e1017] text-zinc-400 hover:bg-[#151822] border border-zinc-600/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>VAULTED / SPECIAL</span>
          <span
            className={`text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded ${
              activeTierFilter === 5 ? 'bg-black/20 text-black' : 'bg-zinc-600/20 text-zinc-400'
            }`}
          >
            {tierCounts[5]}
          </span>
        </button>

        {/* Mastered */}
        <button
          onClick={() => onSelectTierFilter('mastered')}
          className={`h-8 px-3 rounded text-xs font-oswald tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
            activeTierFilter === 'mastered'
              ? 'bg-white text-black font-semibold'
              : 'bg-[#0e1017] text-white/50 hover:text-white border border-white/[0.09]'
          }`}
        >
          <span>✓ MASTERED</span>
          <span className="text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.2 rounded bg-white/10 text-white/80">
            {masteredCount}
          </span>
        </button>
      </div>
    </div>
  );
}

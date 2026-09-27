'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { FilterBar, type TierFilterOption, type SortOption } from '@/components/FilterBar';
import { ItemCard } from '@/components/ItemCard';
import { RecipeDrawer } from '@/components/RecipeDrawer';
import type { EquipmentCategory } from '@/lib/warframe/catalog';
import type { TriagedItem, TriageResult } from '@/lib/warframe/triage';
import type { NormalizedPlayerProfile } from '@/lib/alecaframe/types';

export default function HomePage() {
  const [profile, setProfile] = useState<NormalizedPlayerProfile | null>(null);
  const [allTriaged, setAllTriaged] = useState<TriagedItem[]>([]);
  const [stats, setStats] = useState<TriageResult['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncSource, setSyncSource] = useState<'local' | 'upload' | null>(null);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTierFilter, setActiveTierFilter] = useState<TierFilterOption>('all_unmastered');
  const [sortOption, setSortOption] = useState<SortOption>('easiest');
  const [hideVaulted, setHideVaulted] = useState(false);
  const [hideFounder, setHideFounder] = useState(true);

  // Inspector Drawer State
  const [selectedItem, setSelectedItem] = useState<TriagedItem | null>(null);

  const fetchTriage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/triage');
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setAllTriaged(data.triage.items);
        setStats(data.triage.stats);
        setSyncSource('local');
      } else {
        setError(data.error || 'Failed to sync with local AlecaFrame data.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error during sync');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Sync on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/triage')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setProfile(data.profile);
          setAllTriaged(data.triage.items);
          setStats(data.triage.stats);
          setSyncSource('local');
        } else {
          setError(data.error || 'Failed to sync with local AlecaFrame data.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Network error during sync');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Manual File Upload
  const handleUploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/sync/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to decrypt file');
      }

      const triageRes = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: data.profile }),
      });

      const triageData = await triageRes.json();
      if (triageData.success) {
        setProfile(data.profile);
        setAllTriaged(triageData.triage.items);
        setStats(triageData.triage.stats);
        setSyncSource('upload');
      } else {
        throw new Error(triageData.error || 'Failed to process inventory');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    for (const item of allTriaged) {
      if (!item.isMastered && (!hideFounder || !item.item.isFounder)) {
        counts.All = (counts.All || 0) + 1;
        counts[item.item.category] = (counts[item.item.category] || 0) + 1;
      }
    }
    return counts;
  }, [allTriaged, hideFounder]);

  // Filter and Sort Items
  const filteredItems = useMemo(() => {
    return allTriaged
      .filter((t) => {
        if (activeCategory !== 'All' && t.item.category !== activeCategory) {
          return false;
        }

        if (hideFounder && t.item.isFounder) {
          return false;
        }

        if (hideVaulted && t.item.isVaulted) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = t.item.name.toLowerCase().includes(q);
          const matchesType = t.item.type.toLowerCase().includes(q);
          const matchesDirective = t.actionDirective.toLowerCase().includes(q);
          const matchesParts = t.componentsStatus.some((c) => c.name.toLowerCase().includes(q));
          if (!matchesName && !matchesType && !matchesDirective && !matchesParts) {
            return false;
          }
        }

        if (activeTierFilter === 'all_unmastered') {
          return !t.isMastered;
        }
        if (activeTierFilter === 'mastered') {
          return t.isMastered;
        }
        if (activeTierFilter === 'all') {
          return true;
        }
        return !t.isMastered && t.tier === activeTierFilter;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'easiest':
            if (a.tier !== b.tier) return a.tier - b.tier;
            return b.completionPercent - a.completionPercent;
          case 'completion':
            return b.completionPercent - a.completionPercent;
          case 'name':
            return a.item.name.localeCompare(b.item.name);
          case 'mr_asc':
            return a.item.masteryReq - b.item.masteryReq;
          case 'mr_desc':
            return b.item.masteryReq - a.item.masteryReq;
          default:
            return 0;
        }
      });
  }, [allTriaged, activeCategory, hideFounder, hideVaulted, searchQuery, activeTierFilter, sortOption]);

  const completionRate = stats
    ? Math.round((stats.masteredCount / stats.totalCatalogItems) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#050608] text-white selection:bg-[#ff4040]/30 selection:text-[#ff4040]">
      {/* Tactical Navigation Bar */}
      <Header
        profile={profile}
        isLoading={isLoading}
        onRefreshLocal={fetchTriage}
        onUploadFile={handleUploadFile}
        syncSource={syncSource}
      />

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-300 hover:text-white font-bold ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Overview Stats Hero (TBHX Tournament Overview) */}
        {stats && profile && (
          <div className="tbhx-card p-6 sm:p-8 rounded-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Subtle crimson glow accent */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#ff4040]/[0.06] blur-3xl pointer-events-none" />

            <div className="space-y-3 z-10 max-w-2xl">
              <div className="flex items-center space-x-3">
                <span className="tbhx-badge bg-[#ff4040]/15 text-[#ff4040] border border-[#ff4040]/30">
                  <span>{profile.masteryRank >= 30 ? `LEGENDARY ${profile.masteryRank - 30}` : `RANK No. ${profile.masteryRank < 10 ? '0' : ''}${profile.masteryRank}`}</span>
                </span>
                <span className="text-xs font-oswald text-white/50 uppercase tracking-widest font-semibold">
                  ARSENAL READINESS
                </span>
              </div>

              <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide uppercase leading-[1.08]">
                {stats.unmasteredCount} items remaining to max mastery
              </h2>

              <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                You have mastered <span className="text-white font-semibold">{stats.masteredCount}</span> out of <span className="text-white font-semibold">{stats.totalCatalogItems}</span> catalog equipment items ({completionRate}% completed). Sorted by immediate Foundry readiness and component counts.
              </p>
            </div>

            {/* Quick Readiness Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 z-10">
              {/* Ready in Foundry */}
              <div className="px-4 py-3 rounded bg-black/40 border border-white/[0.09] hover:border-[#ff4040]/50 transition-colors text-center min-w-[95px]">
                <div className="font-oswald text-2xl sm:text-3xl text-[#ff4040] font-bold leading-none tabular-nums">
                  {stats.tierCounts[0]}
                </div>
                <div className="text-[10px] font-oswald uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  In Foundry
                </div>
              </div>

              {/* Ready to Build */}
              <div className="px-4 py-3 rounded bg-black/40 border border-white/[0.09] hover:border-[#00fa9a]/50 transition-colors text-center min-w-[95px]">
                <div className="font-oswald text-2xl sm:text-3xl text-[#00fa9a] font-bold leading-none tabular-nums">
                  {stats.tierCounts[1]}
                </div>
                <div className="text-[10px] font-oswald uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  Ready to Build
                </div>
              </div>

              {/* Market / Dojo BP */}
              <div className="px-4 py-3 rounded bg-black/40 border border-white/[0.09] hover:border-[#fcc800]/50 transition-colors text-center min-w-[95px]">
                <div className="font-oswald text-2xl sm:text-3xl text-[#fcc800] font-bold leading-none tabular-nums">
                  {stats.tierCounts[2]}
                </div>
                <div className="text-[10px] font-oswald uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  Dojo / Market BP
                </div>
              </div>

              {/* 1-2 Parts Needed */}
              <div className="px-4 py-3 rounded bg-black/40 border border-white/[0.09] hover:border-[#ff9933]/50 transition-colors text-center min-w-[95px]">
                <div className="font-oswald text-2xl sm:text-3xl text-[#ff9933] font-bold leading-none tabular-nums">
                  {stats.tierCounts[3]}
                </div>
                <div className="text-[10px] font-oswald uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  Near Complete
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Navigation Tabs */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={categoryCounts}
        />

        {/* Tactical Filter & Sort Control Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTierFilter={activeTierFilter}
          onSelectTierFilter={setActiveTierFilter}
          sortOption={sortOption}
          onSelectSort={setSortOption}
          hideVaulted={hideVaulted}
          onToggleHideVaulted={() => setHideVaulted(!hideVaulted)}
          hideFounder={hideFounder}
          onToggleHideFounder={() => setHideFounder(!hideFounder)}
          tierCounts={stats?.tierCounts || { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }}
          unmasteredCount={stats?.unmasteredCount || 0}
          masteredCount={stats?.masteredCount || 0}
        />

        {/* Item Cards Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#ff4040] border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-white/50">Reading AlecaFrame inventory & checking readiness...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredItems.map((triaged) => (
                  <ItemCard
                    key={triaged.item.id}
                    triaged={triaged}
                    onSelect={setSelectedItem}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="h-64 tbhx-card rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-2.5">
              <span className="text-2xl">🔍</span>
              <h3 className="text-sm font-oswald font-semibold tracking-wider uppercase text-white">No items found</h3>
              <p className="text-xs text-white/50 max-w-sm">
                Try loosening your filters, toggling Vaulted items, or searching for a different keyword.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTierFilter('all_unmastered');
                  setActiveCategory('All');
                }}
                className="mt-2 tbhx-btn-crimson px-4 h-8 rounded text-xs cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Sliding Blueprint Drawer */}
      <RecipeDrawer
        key={selectedItem?.item.id}
        triaged={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

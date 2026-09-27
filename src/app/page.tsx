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

  // Initial Sync from Localhost on mount
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

      // Calculate triage with the uploaded profile
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
        throw new Error(triageData.error || 'Failed to triage inventory');
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
        // Category filter
        if (activeCategory !== 'All' && t.item.category !== activeCategory) {
          return false;
        }

        // Hide Founder items
        if (hideFounder && t.item.isFounder) {
          return false;
        }

        // Hide Vaulted
        if (hideVaulted && t.item.isVaulted) {
          return false;
        }

        // Search query
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

        // Tier Filter
        if (activeTierFilter === 'all_unmastered') {
          return !t.isMastered;
        }
        if (activeTierFilter === 'mastered') {
          return t.isMastered;
        }
        if (activeTierFilter === 'all') {
          return true;
        }
        // Specific Tier (0, 1, 2, 3, 4, 5)
        return !t.isMastered && t.tier === activeTierFilter;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'easiest':
            // Sort by tier ascending, then completion percent descending
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
    <div className="min-h-screen flex flex-col bg-[#08090c] text-white selection:bg-[#1bc866]/30 selection:text-[#1bc866]">
      {/* Framna Editorial Navigation Bar */}
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
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
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

        {/* Overview Stats Hero (Framna Editorial Display) */}
        {stats && profile && (
          <div className="framna-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Subtle glow accent */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#1bc866]/[0.08] blur-3xl pointer-events-none" />

            <div className="space-y-3 z-10 max-w-2xl">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1bc866]/15 text-[#1bc866] border border-[#1bc866]/30 shadow-[0_0_12px_rgba(27,200,102,0.2)]">
                  {profile.masteryRank >= 30 ? `Legendary ${profile.masteryRank - 30}` : `Mastery ${profile.masteryRank}`}
                </span>
                <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                  Triage Status
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.08]">
                {stats.unmasteredCount} items remaining to max mastery.
              </h2>

              <p className="text-xs sm:text-sm text-white/55 leading-relaxed">
                You have mastered <span className="text-white font-medium">{stats.masteredCount}</span> out of <span className="text-white font-medium">{stats.totalCatalogItems}</span> catalog equipment pieces ({completionRate}% completed). Prioritized by ease of acquisition and component readiness.
              </p>
            </div>

            {/* Quick Readiness Triage Metrics in Fraunces Serif */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 z-10">
              {/* Claim Ready */}
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#1bc866]/35 transition-colors text-center min-w-[95px]">
                <div className="font-serif text-2xl sm:text-3xl text-[#1bc866] font-normal leading-none tabular-nums">
                  {stats.tierCounts[0]}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  Claim Ready
                </div>
              </div>

              {/* 100% Craftable */}
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-sky-400/35 transition-colors text-center min-w-[95px]">
                <div className="font-serif text-2xl sm:text-3xl text-sky-400 font-normal leading-none tabular-nums">
                  {stats.tierCounts[1]}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  Craftable
                </div>
              </div>

              {/* Dojo / Market BP */}
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-400/35 transition-colors text-center min-w-[95px]">
                <div className="font-serif text-2xl sm:text-3xl text-indigo-400 font-normal leading-none tabular-nums">
                  {stats.tierCounts[2]}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  Dojo / Market
                </div>
              </div>

              {/* Near Complete */}
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/35 transition-colors text-center min-w-[95px]">
                <div className="font-serif text-2xl sm:text-3xl text-amber-400 font-normal leading-none tabular-nums">
                  {stats.tierCounts[3]}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-medium mt-1.5">
                  Near Complete
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Navigation Pills */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={categoryCounts}
        />

        {/* Multi-Faceted Filter & Sort Control Bar */}
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
              <div className="w-8 h-8 rounded-full border-2 border-[#1bc866] border-t-transparent animate-spin" />
              <p className="text-xs text-white/50">Reading AlecaFrame inventory & calculating triage...</p>
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
            <div className="h-64 framna-card rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-2.5">
              <span className="text-2xl">🔍</span>
              <h3 className="text-sm font-semibold text-white">No items found</h3>
              <p className="text-xs text-white/50 max-w-sm">
                Try loosening your filters, toggling Vaulted items, or searching for a different keyword.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTierFilter('all_unmastered');
                  setActiveCategory('All');
                }}
                className="mt-2 px-4 h-9 rounded-full bg-white text-[#08090c] hover:bg-white/90 text-xs font-semibold transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Sliding Recipe Inspector Drawer */}
      <RecipeDrawer
        key={selectedItem?.item.id}
        triaged={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

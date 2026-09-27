'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { EquipmentCategory } from '@/lib/warframe/catalog';

interface CategoryNavProps {
  activeCategory: EquipmentCategory;
  onSelectCategory: (category: EquipmentCategory) => void;
  categoryCounts: Record<string, number>;
}

const CATEGORIES: { id: EquipmentCategory; label: string }[] = [
  { id: 'All', label: 'All Items' },
  { id: 'Warframes', label: 'Warframes' },
  { id: 'Primary', label: 'Primary' },
  { id: 'Secondary', label: 'Secondary' },
  { id: 'Melee', label: 'Melee' },
  { id: 'Companions', label: 'Companions' },
  { id: 'Archwing', label: 'Archwing' },
  { id: 'Arch-Gun', label: 'Arch-Gun' },
  { id: 'Arch-Melee', label: 'Arch-Melee' },
];

export function CategoryNav({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryNavProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <nav className="flex items-center space-x-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md w-max min-w-full sm:min-w-0">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <motion.button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative h-10 px-4 rounded-full text-xs font-medium transition-colors z-10 flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none ${
                isActive ? 'text-[#08090c] font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="framnaActiveCategoryPill"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_4px_16px_rgba(255,255,255,0.15)] -z-10"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span>{cat.label}</span>
              <span
                className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full transition-colors ${
                  isActive
                    ? 'bg-[#08090c]/12 text-[#08090c] font-bold'
                    : 'bg-white/[0.06] text-white/50'
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

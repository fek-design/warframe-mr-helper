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
  { id: 'All', label: 'All Equipment' },
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
      <nav className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-[#0e1017] border border-white/[0.09] w-max min-w-full sm:min-w-0">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          const formattedCount = count < 10 ? `0${count}` : `${count}`;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative h-9 px-3.5 rounded text-xs font-oswald tracking-wider transition-colors z-10 flex items-center space-x-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:outline-none ${
                isActive ? 'text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tbhxActiveCategoryTab"
                  className="absolute inset-0 rounded bg-[#ff4040] shadow-[0_2px_12px_rgba(255,64,64,0.35)] -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="uppercase">{cat.label}</span>
              <span
                className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded transition-colors ${
                  isActive
                    ? 'bg-black/30 text-white font-bold'
                    : 'bg-white/[0.06] text-white/45'
                }`}
              >
                {formattedCount}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

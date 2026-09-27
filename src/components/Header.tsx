'use client';

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import type { NormalizedPlayerProfile } from '@/lib/alecaframe/types';

interface HeaderProps {
  profile: NormalizedPlayerProfile | null;
  isLoading: boolean;
  onRefreshLocal: () => void;
  onUploadFile: (file: File) => void;
  syncSource: 'local' | 'upload' | null;
}

export function Header({
  profile,
  isLoading,
  onRefreshLocal,
  onUploadFile,
  syncSource,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  const mrTitle = profile
    ? profile.masteryRank >= 30
      ? `Legendary ${profile.masteryRank - 30}`
      : `Mastery ${profile.masteryRank}`
    : 'Connecting...';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#08090c]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Framna Circular Monogram & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-bold text-xs tracking-wider">WF</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold text-sm tracking-tight text-white">
                Warframe MR Triage
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-medium tracking-wide uppercase rounded-full bg-white/[0.06] text-white/60 border border-white/[0.08]">
                Framna
              </span>
            </div>
            <p className="text-[11px] text-white/45 flex items-center space-x-1.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  profile
                    ? 'bg-[#1bc866] shadow-[0_0_8px_rgba(27,200,102,0.8)]'
                    : 'bg-amber-400'
                }`}
              />
              <span>
                {profile
                  ? `Live AlecaFrame (${syncSource === 'local' ? 'Localhost' : 'File Sync'})`
                  : 'Awaiting AlecaFrame sync'}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Framna Player Metrics Pill */}
        {profile && (
          <div className="hidden md:flex items-center space-x-5 px-4 h-9 rounded-full bg-white/[0.03] border border-white/[0.08]">
            {/* MR Rank Badge */}
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1bc866] shadow-[0_0_6px_rgba(27,200,102,0.8)]" />
              <span className="text-[11px] font-medium text-white/50">Rank:</span>
              <span className="text-xs font-semibold text-white tracking-wide">
                {mrTitle} <span className="text-white/40 font-normal">(MR {profile.masteryRank})</span>
              </span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            {/* Credits */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-white/40 font-semibold tracking-wider">CR</span>
              <span className="text-xs tabular-nums font-medium text-white/90">
                {profile.credits.toLocaleString()}
              </span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            {/* Platinum */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-[#1bc866] font-semibold tracking-wider">PL</span>
              <span className="text-xs tabular-nums font-semibold text-white">
                {profile.platinum.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Right: Framna 40px Pill Controls */}
        <div className="flex items-center space-x-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".dat"
            className="hidden"
          />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => fileInputRef.current?.click()}
            className="hidden sm:inline-flex items-center px-4 h-10 text-xs font-medium rounded-full text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors focus-visible:ring-2 focus-visible:ring-[#1bc866]/60 focus-visible:outline-none"
            title="Import lastData.dat file manually"
          >
            Upload File
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={onRefreshLocal}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-4.5 h-10 text-xs font-semibold rounded-full bg-[#1bc866] hover:bg-[#21db73] text-[#041208] shadow-[0_2px_16px_rgba(27,200,102,0.35)] transition-all disabled:opacity-50 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            <span
              className={`w-2 h-2 rounded-full bg-[#041208] ${
                isLoading ? 'animate-ping' : ''
              }`}
            />
            <span>{isLoading ? 'Syncing...' : 'Sync AlecaFrame'}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}

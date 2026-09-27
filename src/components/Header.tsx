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

  const formattedRank = profile
    ? profile.masteryRank < 10
      ? `0${profile.masteryRank}`
      : `${profile.masteryRank}`
    : '--';

  const rankTitle = profile
    ? profile.masteryRank >= 30
      ? `LEGENDARY ${profile.masteryRank - 30}`
      : `MASTERY ${profile.masteryRank}`
    : 'CONNECTING';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#050608]/95 backdrop-blur-xl border-b border-white/[0.09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Tactical Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded bg-[#ff4040]/10 border border-[#ff4040]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,64,64,0.15)] tbhx-skew">
            <span className="text-[#ff4040] font-oswald text-xs font-bold tracking-wider tbhx-unskew">
              WF
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-oswald text-sm font-semibold tracking-wider text-white">
                WARFRAME MR TRACKER
              </h1>
              <span className="tbhx-badge bg-[#ff4040]/15 text-[#ff4040] border border-[#ff4040]/30">
                <span>HUD v2</span>
              </span>
            </div>
            <p className="text-[11px] text-white/50 flex items-center space-x-1.5 mt-0.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  profile
                    ? 'bg-[#00fa9a] shadow-[0_0_6px_rgba(0,250,154,0.8)]'
                    : 'bg-amber-400'
                }`}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {profile
                  ? `Live AlecaFrame (${syncSource === 'local' ? 'Localhost' : 'File Sync'})`
                  : 'Awaiting AlecaFrame sync'}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Tactical Player Metrics */}
        {profile && (
          <div className="hidden md:flex items-center space-x-5 px-4 h-9 rounded bg-[#0e1017] border border-white/[0.09]">
            {/* Rank Callout */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-oswald text-[#ff4040] tracking-wider">
                RANK No.
              </span>
              <span className="font-oswald text-xs font-semibold text-white tracking-widest">
                {formattedRank}
              </span>
              <span className="text-[10px] text-white/40 uppercase">
                ({rankTitle})
              </span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            {/* Credits */}
            <div className="flex items-center space-x-1.5 font-mono text-xs">
              <span className="text-[10px] text-white/40 font-semibold tracking-wider">CR</span>
              <span className="tabular-nums text-white/90">
                {profile.credits.toLocaleString()}
              </span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            {/* Platinum */}
            <div className="flex items-center space-x-1.5 font-mono text-xs">
              <span className="text-[10px] text-[#00fa9a] font-semibold tracking-wider">PL</span>
              <span className="tabular-nums font-semibold text-white">
                {profile.platinum.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Right: Tactical Action Controls */}
        <div className="flex items-center space-x-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".dat"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden sm:inline-flex items-center px-3.5 h-9 text-xs font-oswald tracking-wider rounded bg-[#0e1017] hover:bg-[#151822] text-white/70 hover:text-white border border-white/[0.12] transition-colors focus-visible:ring-2 focus-visible:ring-[#ff4040]/60 focus-visible:outline-none cursor-pointer"
            title="Import lastData.dat file manually"
          >
            UPLOAD FILE
          </button>

          <button
            onClick={onRefreshLocal}
            disabled={isLoading}
            className="tbhx-btn-crimson inline-flex items-center space-x-2 px-4 h-9 text-xs rounded border border-[#ff4040]/50 disabled:opacity-50 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-white ${
                isLoading ? 'animate-ping' : ''
              }`}
            />
            <span>{isLoading ? 'SYNCING...' : 'SYNC INVENTORY'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

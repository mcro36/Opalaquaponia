import React from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';

import { EarningsRelease } from '@/lib/earningsApi';

interface RITimelineProps {
  releases: EarningsRelease[];
  activePeriod?: string;
}

export function RITimeline({ releases, activePeriod }: RITimelineProps) {
  return (
    <div className="relative mb-12 flex w-full justify-between px-4">
      {/* Background Line */}
      <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/10" />
      
      {releases.map((release, idx) => {
        const isActive = release.period_label === activePeriod;
        const isPast = activePeriod ? releases.findIndex(r => r.period_label === activePeriod) > idx : true;
        
        return (
          <div key={release.id} className="relative z-10 flex flex-col items-center">
            <Link 
              href={`/historico/${release.period_label}`}
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all duration-300 hover:scale-125",
                isActive 
                  ? "border-emerald-500 bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                  : isPast 
                    ? "border-white/20 bg-white/10 text-white/60 hover:border-emerald-400 hover:bg-emerald-400/20"
                    : "border-white/10 bg-black text-white/30 hover:border-emerald-400"
              )}
            >
              <span className="text-[10px] font-black">{release.period_label}</span>
            </Link>
            
            <div className={clsx(
              "absolute top-12 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest transition-opacity duration-300",
              isActive ? "text-emerald-400 opacity-100" : "text-white/20 opacity-0 group-hover:opacity-100"
            )}>
              {release.event_key.split(':')[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  highlight?: boolean;
}

export default function KpiCard({ title, value, subtitle, icon, trend, highlight }: KpiCardProps) {
  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden ${
      highlight 
        ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)] animate-pulse-glow' 
        : 'bg-white/5 border-white/10 hover:border-white/20 shadow-xl'
    }`}>
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-3 rounded-2xl transition-all duration-300 ${
          highlight 
            ? 'bg-cyan-400 text-[#0a0f1c] shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
            : 'bg-white/5 text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 group-hover:scale-110'
        }`}>
          {icon}
        </div>
        {trend && (
          <div className="flex flex-col items-end">
             <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
               trend.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'
             }`}>
               {trend.positive ? '↗' : '↘'} {trend.value}
             </span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
           <p className={`text-3xl font-extrabold tracking-tighter ${highlight ? 'text-white' : 'text-white'}`}>
             {value}
           </p>
        </div>
        {subtitle && (
          <p className={`text-xs mt-3 font-medium transition-colors ${
            highlight ? 'text-cyan-300/70' : 'text-gray-500 group-hover:text-gray-400'
          }`}>
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Animated accent bar */}
      <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ${
        highlight ? 'w-full bg-cyan-400' : 'w-0 bg-cyan-400 group-hover:w-full'
      }`} />
    </div>
  );
}

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
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all hover:scale-[1.02] ${highlight ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 shadow-lg shadow-black/50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${highlight ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-gray-300'}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
            {trend.positive ? '+' : '-'}{trend.value}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</h3>
        <p className={`text-3xl font-bold ${highlight ? 'text-cyan-400' : 'text-white'}`}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-2 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}

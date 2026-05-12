import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { EarningsRelease } from '@/lib/earningsApi';

interface RICardProps {
  release: EarningsRelease;
}

export function RICard({ release }: RICardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getEventColor = (event: string) => {
    if (event.includes('Crise')) return 'bg-rose-500/20 text-rose-400 border-rose-500/20';
    if (event.includes('Independência') || event.includes('Verticalização')) return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
    if (event.includes('Recorde') || event.includes('Prêmio')) return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
  };

  const ebitdaMargin = release.dre.receita_liquida > 0 
    ? (release.dre.ebitda / release.dre.receita_liquida) * 100 
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-emerald-500/30 hover:bg-white/[0.06]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
            <Calendar size={12} />
            {release.period_label}
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400">
            {release.event_key}
          </h3>
        </div>
        <span className={clsx("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-tighter", getEventColor(release.event_key))}>
          {release.event_key.split(':')[0]}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-black/20 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase text-white/30">Receita</p>
          <p className="text-lg font-black text-white tabular-nums">
            {formatCurrency(release.dre.receita_bruta)}
          </p>
        </div>
        <div className="rounded-xl bg-black/20 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase text-white/30">Margem EBITDA</p>
          <p className={clsx("text-lg font-black tabular-nums", ebitdaMargin > 0 ? "text-emerald-400" : "text-rose-400")}>
            {ebitdaMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <div className={clsx("flex h-8 w-8 items-center justify-center rounded-full", release.dre.lucro_liquido > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
            {release.dre.lucro_liquido > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-white/30">Lucro Líquido</p>
            <p className="font-bold text-white tabular-nums">{formatCurrency(release.dre.lucro_liquido)}</p>
          </div>
        </div>
        
        <Link 
          href={`/historico/${release.period_label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-emerald-500 hover:text-black"
        >
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

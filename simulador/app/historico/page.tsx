import React from 'react';
import Sidebar from '@/components/Sidebar';
import { RITimeline } from '@/components/RITimeline';
import { RICard } from '@/components/RICard';
import { getAllEarningsReleases } from '@/lib/earningsApi';
import { Trophy, BarChart3, Clock, DollarSign } from 'lucide-react';

export default async function HistoricoPage() {
  const releases = await getAllEarningsReleases();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  // Métricas Consolidadas 5 Anos
  const totalRevenue = releases.reduce((sum, r) => sum + (r.dre.receita_bruta || 0), 0);
  
  const releasesWithRevenue = releases.filter(r => r.dre.receita_liquida > 0);
  const avgEbitdaMargin = releasesWithRevenue.length > 0 
    ? (releasesWithRevenue.reduce((sum, r) => sum + (r.dre.ebitda / r.dre.receita_liquida), 0) / releasesWithRevenue.length) * 100
    : 0;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      
      <main className="flex-1 p-8 lg:p-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12">
            <h1 className="mb-2 text-4xl font-black tracking-tight lg:text-6xl">
              HISTÓRICO <span className="text-emerald-500">RI</span>
            </h1>
            <p className="text-lg text-white/40">
              Relatórios de Resultados Semestrais — 2021 a 2025
            </p>
          </header>

          {/* Dash de Destaques Consolidados */}
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 size={24} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/30">Receita Total 5A</p>
              <p className="text-3xl font-black text-white">{formatCurrency(totalRevenue)}</p>
            </div>
            
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Trophy size={24} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/30">ROI Acumulado</p>
              <p className="text-3xl font-black text-white">~234%</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <Clock size={24} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/30">Payback Atingido</p>
              <p className="text-3xl font-black text-white">4,5 Anos</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
                <DollarSign size={24} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/30">Margem EBITDA Méd.</p>
              <p className="text-3xl font-black text-white">{avgEbitdaMargin.toFixed(1)}%</p>
            </div>
          </div>

          <section className="mb-16">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold">
              <Clock className="text-emerald-500" />
              Timeline do Projeto
            </h2>
            <RITimeline releases={releases} />
          </section>

          <section>
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold">
              <BarChart3 className="text-emerald-500" />
              Releases Semestrais
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {releases.map(release => (
                <RICard key={release.id} release={release} />
              ))}
            </div>
          </section>

          <footer className="mt-20 border-t border-white/5 pt-12 text-center text-white/20">
            <p className="text-sm">RJ Piscicultura — Relatórios de Resultados Auditados</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

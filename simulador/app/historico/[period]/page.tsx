import React from 'react';
import Sidebar from '@/components/Sidebar';
import { DRETable } from '@/components/DRETable';
import { RITimeline } from '@/components/RITimeline';
import { getEarningsRelease, getAllEarningsReleases } from '@/lib/earningsApi';
import { ChevronLeft, MessageSquare, PieChart, Activity, Wallet, FileText } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  const periods = ['1S21', '2S21', '1S22', '2S22', '1S23', '2S23', '1S24', '2S24', '1S25', '2S25'];
  return periods.map((period) => ({
    period: period,
  }));
}

export default async function ReleaseDetailPage(props: { params: Promise<{ period: string }> }) {
  const params = await props.params;
  const period = params.period;
  
  const [release, allReleases] = await Promise.all([
    getEarningsRelease(period),
    getAllEarningsReleases()
  ]);

  if (!release) return <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">Release não encontrado</div>;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      
      <main className="flex-1 p-8 lg:p-12">
        <div className="mx-auto max-w-6xl">
          <Link href="/historico" className="mb-8 flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-emerald-400">
            <ChevronLeft size={16} />
            Voltar para o Histórico
          </Link>

          <header className="mb-12">
            <div className="mb-4 flex items-center gap-4">
              <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-black text-black">
                {release.period_label}
              </span>
              <h1 className="text-4xl font-black lg:text-5xl">{release.event_key}</h1>
            </div>
          </header>

          <RITimeline releases={allReleases} activePeriod={period} />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Coluna Principal (Narrativa e DRE) */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
                  <MessageSquare className="text-emerald-500" />
                  Mensagem da Administração
                </h2>
                <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-8">
                  <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
                  <p className="text-lg leading-relaxed text-white/70 italic">
                    "{release.admin_message}"
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
                  <FileText className="text-emerald-500" />
                  Demonstração de Resultados (DRE)
                </h2>
                <DRETable data={release.dre} />
              </section>

              <section>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
                  <Wallet className="text-emerald-500" />
                  Fluxo de Caixa Livre (FCL)
                </h2>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-white/40">EBITDA Gerado</span>
                      <span className="font-bold tabular-nums">{formatCurrency(release.fcl.ebitda)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-white/40">(–) Investimentos (CAPEX)</span>
                      <span className="font-bold tabular-nums text-rose-400">{formatCurrency(release.fcl.capex)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-white/40">(–) Impostos e Amortizações</span>
                      <span className="font-bold tabular-nums text-rose-400">{formatCurrency(release.fcl.ir + release.fcl.amortizacao)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-black">
                      <span className="text-emerald-400">FCL Antes de Dividendos</span>
                      <span className="tabular-nums">{formatCurrency(release.fcl.fcl_antes)}</span>
                    </div>
                    {release.fcl.dividendos !== 0 && (
                      <div className="flex justify-between text-sm italic text-blue-400">
                        <span>(–) Dividendos Distribuídos</span>
                        <span>{formatCurrency(release.fcl.dividendos)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar de KPIs */}
            <div className="space-y-8">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/40">
                  <Activity size={16} />
                  KPIs Operacionais
                </h3>
                <div className="space-y-4">
                  {Object.entries(release.kpi_operational).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold uppercase text-white/20">{key.replace('_', ' ')}</span>
                      <span className="text-lg font-bold text-white">{value}{key.includes('fca') ? '' : (key.includes('kg') ? ' kg' : (key.includes('mortalidade') ? '%' : ''))}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/40">
                  <PieChart size={16} />
                  Estrutura de Capital
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold uppercase text-white/20">Dívida Bruta</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(release.capital_structure.divida_bruta)}</span>
                  </div>
                  <div className="flex flex-col border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold uppercase text-white/20">Caixa e Equiv.</span>
                    <span className="text-lg font-bold text-emerald-400">{formatCurrency(release.capital_structure.caixa)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-white/20">Dívida Líquida</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(release.capital_structure.divida_liquida)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

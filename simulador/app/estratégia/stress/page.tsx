"use client";

import { useProject } from "@/contexts/ProjectContext";
import { AlertOctagon, TrendingDown, ThermometerSnowflake, Skull, ShoppingCart, Activity, ShieldAlert, RefreshCcw } from 'lucide-react';
import KpiCard from "@/components/KpiCard";
import CapexChart from "@/components/CapexChart";
import { calcProfit, calcCashFlowProjection, calcPayback, calcCapex, WORKING_CAPITAL } from "@/lib/calculationEngine";

export default function StressTestPage() {
  const { state, syncDispatch } = useProject();
  
  const stress = state.parameters.stressTest || {
    marketCrash: false,
    feedCrisis: false,
    climateDisaster: false,
    highMortality: false
  };

  const toggleStress = (key: keyof typeof stress) => {
    const newStress = { ...stress, [key]: !stress[key] };
    syncDispatch({ type: 'UPDATE_PARAM', payload: { key: 'stressTest', value: newStress } });
  };

  const resetStress = () => {
    const cleanStress = { marketCrash: false, feedCrisis: false, climateDisaster: false, highMortality: false };
    syncDispatch({ type: 'UPDATE_PARAM', payload: { key: 'stressTest', value: cleanStress } });
  };

  // Cálculos comparativos (Base vs Stress)
  const isSolarOn = state.parameters.solarEnabled;
  const isOwnFeedOn = state.parameters.ownFeedEnabled;
  const isClimaOn = state.parameters.climateControlEnabled;
  const activePhases = state.activePhases;

  const baseProfit = calcProfit(5, isOwnFeedOn, isSolarOn, isClimaOn, activePhases, {});
  const stressProfit = calcProfit(5, isOwnFeedOn, isSolarOn, isClimaOn, activePhases, stress);
  
  const basePayback = calcPayback(isOwnFeedOn, isSolarOn, isClimaOn, activePhases, {});
  const stressPayback = calcPayback(isOwnFeedOn, isSolarOn, isClimaOn, activePhases, stress);

  const projection = calcCashFlowProjection(60, isOwnFeedOn, isSolarOn, isClimaOn, activePhases, stress);

  return (
    <div className="p-8 space-y-8 animate-in pb-32">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            <AlertOctagon className="text-red-500 animate-pulse" size={40} /> 
            Stress Test <span className="text-red-500">Center</span>
          </h1>
          <p className="text-gray-400 mt-2">Simule o colapso do mercado ou falhas biológicas para testar a resiliência do seu fluxo de caixa.</p>
        </div>
        <button 
          onClick={resetStress}
          className="bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
        >
          <RefreshCcw size={16} /> Resetar Cenário
        </button>
      </header>

      {/* STRESS CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => toggleStress('marketCrash')}
          className={`p-6 rounded-3xl border transition-all flex flex-col gap-4 text-left ${
            stress.marketCrash ? 'bg-red-500/20 border-red-500/50 ring-2 ring-red-500/20' : 'bg-white/5 border-white/10'
          }`}
        >
          <ShoppingCart className={stress.marketCrash ? 'text-red-500' : 'text-gray-500'} size={32} />
          <div>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest">Market Crash</h3>
            <p className="text-[10px] text-gray-500 mt-1">Preço do filé cai 30% devido à saturação regional.</p>
          </div>
        </button>

        <button 
          onClick={() => toggleStress('feedCrisis')}
          className={`p-6 rounded-3xl border transition-all flex flex-col gap-4 text-left ${
            stress.feedCrisis ? 'bg-orange-500/20 border-orange-500/50 ring-2 ring-orange-500/20' : 'bg-white/5 border-white/10'
          }`}
        >
          <TrendingDown className={stress.feedCrisis ? 'text-orange-500' : 'text-gray-500'} size={32} />
          <div>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest">Feed Crisis</h3>
            <p className="text-[10px] text-gray-500 mt-1">Custo global de soja e milho eleva ração em 40%.</p>
          </div>
        </button>

        <button 
          onClick={() => toggleStress('climateDisaster')}
          className={`p-6 rounded-3xl border transition-all flex flex-col gap-4 text-left ${
            stress.climateDisaster ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/20' : 'bg-white/5 border-white/10'
          }`}
        >
          <ThermometerSnowflake className={stress.climateDisaster ? 'text-blue-500' : 'text-gray-500'} size={32} />
          <div>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest">Climate Disaster</h3>
            <p className="text-[10px] text-gray-500 mt-1">Inverno rigoroso (5°C abaixo da média) em BH.</p>
          </div>
        </button>

        <button 
          onClick={() => toggleStress('highMortality')}
          className={`p-6 rounded-3xl border transition-all flex flex-col gap-4 text-left ${
            stress.highMortality ? 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/20' : 'bg-white/5 border-white/10'
          }`}
        >
          <Skull className={stress.highMortality ? 'text-purple-500' : 'text-gray-500'} size={32} />
          <div>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest">Mass Mortality</h3>
            <p className="text-[10px] text-gray-500 mt-1">Fungos ou queda de oxigênio matam 20% do lote final.</p>
          </div>
        </button>
      </div>

      {/* IMPACT ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0f1c] border border-white/5 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-6 flex items-center gap-2">
               <Activity size={20} className="text-red-500" /> Projeção de Sobrevivência de Caixa
            </h3>
            <div className="h-[350px]">
              <CapexChart data={projection} />
            </div>
            <div className="mt-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
               <p className="text-xs text-red-400 font-medium">
                 {stressProfit.lucro < 0 
                   ? "⚠️ AVISO: Neste cenário, a operação é DEFICITÁRIA. O caixa acumulado será consumido rapidamente." 
                   : "✅ RESILIÊNCIA: Apesar do stress, a operação mantém margem positiva."}
               </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Degradação de KPIs</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 mb-2">
                  <span>Lucro Mensal</span>
                  <span className={stressProfit.lucro < baseProfit.lucro ? 'text-red-400' : 'text-emerald-400'}>
                    {((stressProfit.lucro / baseProfit.lucro - 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xl font-black text-white">R$ {Math.round(stressProfit.lucro).toLocaleString('pt-BR')}</div>
              </div>
              
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 mb-2">
                  <span>Payback Projetado</span>
                  <span className={stressPayback > basePayback ? 'text-red-400' : 'text-emerald-400'}>
                    +{Math.round(stressPayback - basePayback)} meses
                  </span>
                </div>
                <div className="text-2xl font-black text-white">{stressPayback === Infinity ? 'Inviável' : `${stressPayback.toFixed(1)} m`}</div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-[32px] p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
               <ShieldAlert size={18} /> Protocolo de Crise
             </h3>
             <ul className="text-[10px] text-gray-400 space-y-3 list-disc pl-4">
               <li>Suspender novas compras de CAPEX imediatamente.</li>
               <li>Negociar prazos de pagamento com fornecedores de ração (PMP +30d).</li>
               <li>Reduzir densidade de estocagem no próximo ciclo em 15%.</li>
               <li>Aumentar processamento próprio para capturar margem de varejo.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

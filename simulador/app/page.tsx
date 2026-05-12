"use client";

import { useState, useCallback } from 'react';
import { useProject } from "../contexts/ProjectContext";
import KpiCard from "../components/KpiCard";
import CapexChart from "../components/CapexChart";
import OpexChart from "../components/OpexChart";
import { 
  Wallet, LineChart, Activity, DollarSign, TrendingUp, 
  Zap, Factory, BarChart3, Clock, ArrowRightCircle, ShieldCheck, Target
} from 'lucide-react';
import { 
  calcCapex, calcProfit, 
  calcPayback, calcCashFlowProjection, WORKING_CAPITAL 
} from "../lib/calculationEngine";
import * as CONST from "../data/constants";

export default function Dashboard() {
  const { state, syncDispatch } = useProject();
  const [simMonth, setSimMonth] = useState(12);

  const seasonalMonth = ((simMonth - 1) % 12) + 1;
  
  const isSolarOn = state.parameters.solarEnabled;
  const isOwnFeedOn = state.parameters.ownFeedEnabled;
  const isClimaOn = state.parameters.climateControlEnabled;
  const activePhases = state.activePhases;
  
  const isRampUp = simMonth <= 6;
  const tanksActiveCount = Math.min(simMonth, 6);
  
  // Base Calculations
  const capexTotal = calcCapex(activePhases);
  const investimentTotal = capexTotal + WORKING_CAPITAL;
  
  const profitData = calcProfit(
    seasonalMonth, isOwnFeedOn, isSolarOn, isClimaOn, activePhases, state.parameters.stressTest
  );

  const currentReceita = isRampUp ? 0 : profitData.receita;
  const currentOpex = isRampUp ? (profitData.opex * (tanksActiveCount / 6)) : profitData.opex;
  
  const currentLucro = isRampUp 
    ? (currentReceita - currentOpex - profitData.depreciacao - (currentReceita * 0.04))
    : profitData.lucro;
  
  const paybackMeses = calcPayback(isOwnFeedOn, isSolarOn, isClimaOn, activePhases, state.parameters.stressTest);
  const roiAnual = investimentTotal > 0 ? ((profitData.lucro * 12) / investimentTotal * 100).toFixed(1) : '0';

  const accumulatedCashFlow = calcCashFlowProjection(
    60, isOwnFeedOn, isSolarOn, isClimaOn, activePhases, state.parameters.stressTest
  );

  const handleToggle = useCallback((key: 'ownFeedEnabled' | 'solarEnabled' | 'climateControlEnabled') => {
    const newValue = !state.parameters[key];
    syncDispatch({ type: 'UPDATE_PARAM', payload: { key, value: newValue } });
    
    const newActivePhases = [...state.activePhases];
    if (key === 'ownFeedEnabled') newActivePhases[3] = newValue;
    if (key === 'solarEnabled') newActivePhases[4] = newValue;
    
    syncDispatch({ type: 'SET_ACTIVE_PHASES', payload: newActivePhases });
  }, [state.parameters, state.activePhases, syncDispatch]);

  return (
    <div className="space-y-8 animate-in pb-12">
      {/* IDENTITY BANNER */}
      <section className="relative overflow-hidden bg-[#0a1428] border border-cyan-500/20 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-cyan-500 text-[#0a1428] text-[10px] font-black uppercase tracking-widest rounded-full">Sistema Industrial</span>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Belo Horizonte / MG</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">RJ PISCICULTURA <span className="text-cyan-400">ENGINE</span></h1>
          <p className="text-gray-400 text-sm mt-1">Controle estratégico de 360m³ de lâmina d'água super-intensiva.</p>
        </div>
        <div className="flex gap-6 relative z-10">
          <div className="text-center">
             <div className="text-[10px] font-black text-gray-500 uppercase mb-1">Status Rede</div>
             <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Sincronizado
             </div>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="text-center">
             <div className="text-[10px] font-black text-gray-500 uppercase mb-1">Cenário</div>
             <div className="text-white font-bold text-sm uppercase tracking-wider">Realista</div>
          </div>
        </div>
      </section>

      {/* SIMULADOR TEMPORAL */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl animate-slide-up">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-white font-black text-lg flex items-center gap-2 uppercase tracking-tighter">
                  <Clock size={20} className="text-cyan-400"/> Cronograma da Operação
                </h3>
                <p className="text-gray-500 text-xs">Simule o amadurecimento biológico e o fluxo financeiro ao longo do tempo.</p>
              </div>
              <span className="text-cyan-400 font-black text-3xl tracking-tighter">{simMonth} <span className="text-sm font-normal text-gray-500">meses</span></span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={simMonth}
              onChange={(e) => setSimMonth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between mt-4 text-[9px] text-gray-600 uppercase tracking-widest font-black">
              <span>Mês 01</span>
              <span>12</span>
              <span>24</span>
              <span>36</span>
              <span>48</span>
              <span>Mês 60</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 px-8 border-l border-white/5">
             <div className="bg-black/20 p-4 rounded-2xl border border-white/5 min-w-[120px]">
                <div className="text-[9px] text-gray-600 font-black uppercase mb-1">Fase Atual</div>
                <div className={`text-sm font-black uppercase ${isRampUp ? 'text-yellow-500' : 'text-emerald-500'}`}>
                  {isRampUp ? 'Crescimento' : 'Estável'}
                </div>
             </div>
             <div className="bg-black/20 p-4 rounded-2xl border border-white/5 min-w-[120px]">
                <div className="text-[9px] text-gray-600 font-black uppercase mb-1">Capacidade</div>
                <div className="text-sm font-black text-white uppercase tracking-wider">
                  {tanksActiveCount}/6 Tanques
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC TOGGLES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <button 
            onClick={() => handleToggle('ownFeedEnabled')}
            className={`group p-6 rounded-3xl border transition-all duration-500 flex flex-col gap-4 text-left relative overflow-hidden ${
              isOwnFeedOn ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'
            }`}
          >
            <div className={`p-3 w-fit rounded-2xl ${isOwnFeedOn ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-gray-500'}`}>
              <Factory size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nutrição Própria</div>
              <div className="text-lg font-black text-white tracking-tighter">Fábrica de Ração</div>
              <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">Reduz OPEX em 45% através da produção interna de ração extrusada.</p>
            </div>
            {isOwnFeedOn && <div className="absolute top-4 right-4"><ShieldCheck className="text-emerald-500" size={16} /></div>}
          </button>

          <button 
            onClick={() => handleToggle('solarEnabled')}
            className={`group p-6 rounded-3xl border transition-all duration-500 flex flex-col gap-4 text-left relative overflow-hidden ${
              isSolarOn ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'
            }`}
          >
            <div className={`p-3 w-fit rounded-2xl ${isSolarOn ? 'bg-yellow-500 text-[#0a0f1c] shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-gray-500'}`}>
              <Zap size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Eficiência Energética</div>
              <div className="text-lg font-black text-white tracking-tighter">Energia Fotovoltaica</div>
              <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">Elimina custos variáveis de energia através de geração solar dedicada.</p>
            </div>
            {isSolarOn && <div className="absolute top-4 right-4"><ShieldCheck className="text-yellow-500" size={16} /></div>}
          </button>

          <button 
            onClick={() => handleToggle('climateControlEnabled')}
            className={`group p-6 rounded-3xl border transition-all duration-500 flex flex-col gap-4 text-left relative overflow-hidden ${
              isClimaOn ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'
            }`}
          >
            <div className={`p-3 w-fit rounded-2xl ${isClimaOn ? 'bg-cyan-500 text-[#0a0f1c] shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-gray-500'}`}>
              <Activity size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Controle Sanitário</div>
              <div className="text-lg font-black text-white tracking-tighter">Climatização Ativa</div>
              <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">Garante GPD constante de 4.2g/dia independente da estação externa.</p>
            </div>
            {isClimaOn && <div className="absolute top-4 right-4"><ShieldCheck className="text-cyan-500" size={16} /></div>}
          </button>
      </section>

      {/* KPIs GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <KpiCard 
          title="Receita Realizada" 
          value={`R$ ${currentReceita.toLocaleString('pt-BR')}`} 
          subtitle={isRampUp ? "Ciclo em Crescimento" : "Capacidade Máxima"}
          icon={<LineChart size={20} />} 
        />
        <KpiCard 
          title="Fluxo OPEX" 
          value={`R$ ${Math.round(currentOpex).toLocaleString('pt-BR')}`} 
          subtitle={`${CONST.BH_CLIMATE[seasonalMonth-1].label} (BH)`}
          icon={<Activity size={20} />} 
        />
        <KpiCard 
          title="Resultado Líquido" 
          value={`R$ ${Math.round(currentLucro).toLocaleString('pt-BR')}`} 
          subtitle="Lucro descontado CAPEX/TAX"
          icon={<DollarSign size={20} />} 
          highlight={currentLucro > 0}
        />
        <KpiCard 
          title="Tempo de Payback" 
          value={paybackMeses === Infinity ? '∞' : `${paybackMeses.toFixed(1)} m`} 
          subtitle={`ROI Proj: ${roiAnual}%`}
          trend={{ value: `${roiAnual}%`, positive: Number(roiAnual) > 20 }}
          icon={<TrendingUp size={20} />} 
        />
      </div>

      {/* MAIN DATA ANALYTICS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="xl:col-span-2 bg-[#0a0f1c] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h3 className="text-xl font-black text-white tracking-tighter uppercase">Curva de Equilíbrio de Caixa</h3>
                <p className="text-gray-500 text-xs">Projeção acumulada de 60 meses incluindo CAPEX e Ramp-up.</p>
             </div>
             <div className="flex items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-500 rounded-full" /> Saldo</div>
             </div>
          </div>
          <div className="h-[350px]">
            <CapexChart data={accumulatedCashFlow} />
          </div>
        </div>
        
        <div className="flex flex-col gap-8">
           <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex-1">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Alocação de Capital</h3>
              <div className="h-[250px]">
                <OpexChart data={[
                  { name: 'Investimento Infra', value: capexTotal },
                  { name: 'Giro (Working Cap)', value: WORKING_CAPITAL }
                ]} />
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Investimento Total</span>
                 <span className="text-lg font-black text-white">R$ {investimentTotal.toLocaleString()}</span>
              </div>
           </div>

           <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-[32px] p-8">
              <div className="flex items-center gap-3 mb-4">
                 <Target className="text-cyan-400" size={20} />
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Métricas Anuais</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Lucro Estimado / Ano</div>
                    <div className="text-3xl font-black text-white tracking-tighter">R$ {Math.round(profitData.lucro * 12).toLocaleString()}</div>
                 </div>
                 <div className="h-[1px] w-full bg-cyan-500/10" />
                 <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Margem de Contribuição</div>
                    <div className="text-2xl font-black text-cyan-400">42.5%</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

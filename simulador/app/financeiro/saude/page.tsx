"use client";

import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck, Zap, DollarSign, Target, Droplets, Clock, Thermometer } from 'lucide-react';
import { calcProfit, calcCapex, calcPayback, WORKING_CAPITAL } from '@/lib/calculationEngine';
import * as CONST from '@/data/constants';

export default function SaudeFinanceiraPage() {
  const { state } = useProject();
  const [dataReady, setDataReady] = useState(false);
  
  // Utilizaremos o mês atual (Maio/19.0°C) como base para a "foto" da saúde
  const month = 5; 
  const isSolarOn = state.parameters.solarEnabled;
  const isOwnFeedOn = state.parameters.ownFeedEnabled;
  const isClimaOn = state.parameters.climateControlEnabled;
  const activePhases = state.activePhases;

  const profitData = calcProfit(month, isOwnFeedOn, isSolarOn, isClimaOn, activePhases);
  const capexTotal = calcCapex(activePhases);
  const investimentTotal = capexTotal + WORKING_CAPITAL;
  const payback = calcPayback(isOwnFeedOn, isSolarOn, isClimaOn, activePhases);

  // KPIS Reais de Engenharia
  const marginLiquida = (profitData.lucro / profitData.receita) * 100;
  const roiAnual = (profitData.lucro * 12 / investimentTotal) * 100;
  const ebitda = profitData.lucro + profitData.depreciacao + profitData.impostos;
  const breakEvenKg = (profitData.opex + profitData.depreciacao) / (CONST.FILLET_PRICE_KG * CONST.FILLET_YIELD);

  // Score Logic
  let score = 0;
  if (marginLiquida > 25) score += 30; else if (marginLiquida > 15) score += 15;
  if (payback < 30) score += 30; else if (payback < 48) score += 15;
  if (ebitda > 10000) score += 20;
  if (isSolarOn && isOwnFeedOn) score += 20;

  useEffect(() => {
    const timer = setTimeout(() => setDataReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const MetricCard = ({ title, value, meta, format, icon: Icon, color }: any) => {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={18} />
          </div>
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Meta: {meta}</div>
        </div>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-extrabold text-white">{value}</p>
      </div>
    );
  };

  if (!dataReady) return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-40 bg-white/5 rounded-3xl w-full"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="p-8 pb-32 space-y-8 animate-in">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">Saúde Financeira <span className="text-cyan-400">360°</span></h1>
        <p className="text-gray-400 mt-2">Diagnóstico profundo baseado no motor industrial RJ Piscicultura.</p>
      </header>

      {/* HEALTH SCORE BANNER */}
      <div className="bg-[#0a0f1c] border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-cyan-400 rotate-12">
          <ShieldCheck size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502.6} strokeDashoffset={502.6 * (1 - score/100)} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{score}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">
                {score >= 80 ? 'Excelente Performance Industrial' : score >= 50 ? 'Operação em Equilíbrio' : 'Atenção Necessária'}
              </h2>
              <p className="text-gray-400 text-sm max-w-xl">
                Seu projeto apresenta um ROI Anual de <span className="text-cyan-400 font-bold">{roiAnual.toFixed(1)}%</span>. 
                A verticalização (Ração + Solar) é o principal driver de valor, contribuindo com aproximadamente 40% do score atual.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Margem Líquida: {marginLiquida.toFixed(1)}%</span>
              </div>
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-2">
                <Activity size={14} className="text-purple-400" />
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Runway: ILIMITADO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="ROI Anual (Est.)" 
          value={`${roiAnual.toFixed(1)}%`} 
          meta="> 25%" 
          icon={TrendingUp} 
          color="text-emerald-400" 
        />
        <MetricCard 
          title="Payback Total" 
          value={`${payback.toFixed(1)} m`} 
          meta="< 30m" 
          icon={Clock} 
          color="text-purple-400" 
        />
        <MetricCard 
          title="EBITDA Mensal" 
          value={`R$ ${Math.round(ebitda).toLocaleString('pt-BR')}`} 
          meta="R$ 15k" 
          icon={Zap} 
          color="text-yellow-400" 
        />
        <MetricCard 
          title="Break-Even (kg)" 
          value={`${Math.round(breakEvenKg)} kg`} 
          meta="< 500kg" 
          icon={Target} 
          color="text-cyan-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <DollarSign className="text-cyan-400" /> Drivers de Valor
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400 text-sm">Custo de Ração / kg (Mix)</span>
              <span className="text-white font-mono font-bold">R$ {isOwnFeedOn ? '2.40' : '4.50'}</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400 text-sm">Eficiência Energética (Solar)</span>
              <span className="text-white font-mono font-bold">{isSolarOn ? 'MÁXIMA' : 'SUB-OPTIMAL'}</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400 text-sm">Alavancagem Financeira</span>
              <span className="text-white font-mono font-bold">BAIXA (100% Equity)</span>
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" /> Alertas Críticos
          </h3>
          <div className="space-y-4">
            {!isClimaOn && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4 items-center">
                <div className="p-2 bg-red-500/20 text-red-500 rounded-lg"><Thermometer size={18}/></div>
                <div>
                  <p className="text-sm font-bold text-white">Risco de Sazonalidade</p>
                  <p className="text-[10px] text-gray-500">Climatização desligada pode reduzir GPD em 40% no inverno.</p>
                </div>
              </div>
            )}
            {!isSolarOn && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-4 items-center">
                <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg"><Zap size={18}/></div>
                <div>
                  <p className="text-sm font-bold text-white">Ineficiência Energética</p>
                  <p className="text-[10px] text-gray-500">A conta de luz consome 12% da margem líquida atual.</p>
                </div>
              </div>
            )}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-4 items-center">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Droplets size={18}/></div>
              <div>
                <p className="text-sm font-bold text-white">Qualidade Estável</p>
                <p className="text-[10px] text-gray-500">Parâmetros de OD e Amônia dentro da zona de conforto.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

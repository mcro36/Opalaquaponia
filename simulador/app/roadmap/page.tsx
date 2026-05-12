"use client";

import { useProject } from "@/contexts/ProjectContext";
import { useState } from "react";
import { Route, TrendingUp, CalendarDays, Coins, ShieldAlert, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { calcProfit, calcCashFlowProjection, calcCapex, WORKING_CAPITAL } from "@/lib/calculationEngine";
import * as CONST from "@/data/constants";

export default function RoadmapPage() {
  const { state } = useProject();
  const [aporteMensal, setAporteMensal] = useState(1000); // 1k default

  const isSolarOn = state.parameters.solarEnabled;
  const isOwnFeedOn = state.parameters.ownFeedEnabled;
  const isClimaOn = state.parameters.climateControlEnabled;
  const activePhases = state.activePhases;
  const stress = state.parameters.stressTest;

  // Gerar projeção de 36 meses (usando o engine oficial)
  const cashFlowData = calcCashFlowProjection(36, isOwnFeedOn, isSolarOn, isClimaOn, activePhases, stress);
  
  // Customizar para o gráfico do roadmap (adicionar label amigável)
  const chartData = cashFlowData.map(d => ({
    name: d.name,
    cash: d.value * 1000, // Voltando para escala real
  }));

  const capexTotal = calcCapex(activePhases);
  const capitalDeGiroMinimo = WORKING_CAPITAL;

  // Gatilhos de expansão baseados no saldo acumulado (Simulação simplificada para UI)
  const lastBalance = chartData[chartData.length - 1].cash;
  const triggerIntermediaria = lastBalance >= 35000;
  const triggerPreIndustrial = lastBalance >= 80000;
  const triggerIndustrial = lastBalance >= 130000;

  let dynamicPhase = 'pilot';
  if(triggerIndustrial) dynamicPhase = 'industrial';
  else if(triggerPreIndustrial) dynamicPhase = 'pre_industrial';
  else if(triggerIntermediaria) dynamicPhase = 'intermediaria';

  const breakEvenMonthData = chartData.find(d => d.cash >= 0);
  const breakEvenMonth = breakEvenMonthData ? breakEvenMonthData.name.replace('Mês ', '') : null;

  const phases = [
    { id: 'pilot', name: 'Fase 1: Piloto de Validação', volume: '30m³', desc: '6 tanques de 5000L. Foco em validar conversão alimentar.', achieved: true, trigger: 'Investimento Inicial' },
    { id: 'intermediaria', name: 'Fase 2: Escala Comercial', volume: '60m³', desc: '12 tanques. Volume mínimo para pro-labore fixo.', achieved: triggerIntermediaria, trigger: 'Saldo > R$ 35k' },
    { id: 'pre_industrial', name: 'Fase 3: Pré-Industrial', volume: '180m³', desc: 'Fábrica própria de ração recomendada.', achieved: triggerPreIndustrial, trigger: 'Saldo > R$ 80k' },
    { id: 'industrial', name: 'Fase 4: Industrial (Ceasa)', volume: '360m³', desc: 'Ataque no Ceasa-BH e redes de supermercado.', achieved: triggerIndustrial, trigger: 'Saldo > R$ 130k' }
  ];

  return (
    <div className="space-y-8 animate-in pb-12">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">Roadmap & <span className="text-emerald-400">Cash Flow</span></h1>
        <p className="text-gray-400 mt-2">Plano de evolução vertical e gatilhos de expansão baseados em reinvestimento.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0f1c] border border-white/5 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-400"/> Projeção Saldo Acumulado (36 Meses)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0f1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, 'Saldo']}
                  />
                  <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                  <Area type="monotone" dataKey="cash" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h3 className="text-lg font-black text-white uppercase mb-8">Timeline de Expansão</h3>
            <div className="space-y-6">
              {phases.map((phase, idx) => (
                <div key={phase.id} className={`flex gap-6 items-start p-4 rounded-2xl border transition-all ${phase.achieved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-transparent opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${phase.achieved ? 'bg-emerald-500 text-[#0a0f1c]' : 'bg-gray-800 text-gray-500'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-bold ${phase.achieved ? 'text-white' : 'text-gray-500'}`}>{phase.name}</h4>
                      <span className="text-[10px] font-black uppercase text-gray-600">Gatilho: {phase.trigger}</span>
                    </div>
                    <p className="text-xs text-gray-500">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock size={18} /> Ponto de Equilíbrio
              </h3>
              <div className="text-5xl font-black text-white tracking-tighter mb-2">
                {breakEvenMonth ? `Mês ${breakEvenMonth}` : '---'}
              </div>
              <p className="text-xs text-gray-500">Mês estimado em que o caixa acumulado volta a ser positivo após investimento inicial.</p>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Capital de Giro Mínimo</h4>
              <div className="text-2xl font-black text-white mb-2">R$ {capitalDeGiroMinimo.toLocaleString()}</div>
              <p className="text-[10px] text-gray-600 leading-relaxed">Reserva estratégica necessária para manter 6 meses de OPEX e salários em caso de mortalidade total.</p>
           </div>

           <div className="bg-orange-500/10 border border-orange-500/20 rounded-[32px] p-8">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert size={16} /> Margem de Segurança
              </h4>
              <div className="text-lg font-bold text-orange-400">{(lastBalance / (capexTotal || 1) * 100).toFixed(1)}%</div>
              <p className="text-[10px] text-gray-500 mt-2">Capacidade de absorção de prejuízo sobre o investimento total ao final de 3 anos.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

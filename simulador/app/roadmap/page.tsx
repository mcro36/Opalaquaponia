"use client";

import { useProject } from "../../contexts/ProjectContext";
import { useState } from "react";
import { Route, TrendingUp, CalendarDays, Coins, ShieldAlert } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { calcCustoEnergiaMensal, calcLucroLiquidoMensal, calcAlevinosNecessarios } from "../../lib/calculationEngine";

export default function RoadmapPage() {
  const { state } = useProject();
  const [aporteMensal, setAporteMensal] = useState(1000); // 1k default

  // Ensure arrays exist for calculation extraction
  const capexItems = state.capexItems || [];
  const opexItems = state.opexItems || [];

  // Basic Simulation Variables
  const capexTotal = capexItems.reduce((acc, item) => acc + item.cost, 0);
  const opexBaseMensal = opexItems.reduce((acc, item) => acc + item.monthlyCost, 0);
  
  // Rule approximation
  const volumeTotal = 30; 
  const targetDensity = state.parameters.targetDensity || 35;
  const biomassaTeorica = volumeTotal * targetDensity;
  
  const mortalities = state.parameters.mortalityByPhase || [
    { phase: "transporte", rate: 5 }, { phase: "alevinagem", rate: 10 }, { phase: "recria", rate: 4 }, { phase: "engorda", rate: 2 }
  ];
  const survivalRate = mortalities.reduce((acc: number, phase: any) => acc * (1 - (phase.rate / 100)), 1);
  const biomassaReal = biomassaTeorica * survivalRate;
  
  const rendimentoFile = 0.33; 
  const precoKgFile = state.parameters.pricePerKg || 50;
  const fileMensal = (biomassaReal / 6) * rendimentoFile;
  const receitaBrutaMedia = fileMensal * precoKgFile;

  const isClimaOn = state.parameters.climateControlEnabled || false;

  // Capital Giro Mínimo (Regra R3: OPEX base x 6 meses)
  const capitalDeGiroMinimo = opexBaseMensal * 6;

  // Generate Cash Flow Data for 36 months considering seasonality
  const cashFlowData = [];
  let accumulatedCash = -capexTotal; // Start deep in the negative from Day 0 investment
  
  // Variables for dynamic trigger assessment
  let triggerIntermediaria = false;
  let triggerPreIndustrial = false;
  let triggerIndustrial = false;
  
  for (let month = 1; month <= 36; month++) {
    // Determine real month of year (assume starting in Jan = 1)
    const monthOfYear = ((month - 1) % 12) + 1;
    
    // R4: Sazonal energia 
    const custoClima = calcCustoEnergiaMensal(monthOfYear, isClimaOn);
    const opexAtual = opexBaseMensal + custoClima;
    
    // We assume profit kicks in after month 6 (first harvest)
    // If NO climate in winter (May-Aug), zero revenue in those months (lethal delay)
    let receitaMesAtual = receitaBrutaMedia;
    const isWinter = monthOfYear >= 5 && monthOfYear <= 8;
    if (!isClimaOn && isWinter) {
        receitaMesAtual = 0;
    }

    const { lucro: lucroMensal } = calcLucroLiquidoMensal(receitaMesAtual, opexAtual, capexTotal);
    const profitNet = month > 6 ? lucroMensal : -opexAtual; // zero sales first 6 months
    
    accumulatedCash += profitNet + aporteMensal;
    
    cashFlowData.push({
      month: `Mês ${month}`,
      cash: Math.round(accumulatedCash),
      opexExtra: custoClima > 0 ? "Winter Heating ON" : ""
    });

    // Check triggers continuously
    if (accumulatedCash >= 35000) triggerIntermediaria = true;
    if (accumulatedCash >= 80000) triggerPreIndustrial = true;
    if (accumulatedCash >= 130000) triggerIndustrial = true;
  }

  // Find break-even month
  const breakEvenMonth = cashFlowData.findIndex(data => data.cash >= 0) + 1;

  // Determine dynamic phase based on projection
  let dynamicPhase = 'pilot';
  if(triggerIndustrial) { dynamicPhase = 'industrial'; }
  else if(triggerPreIndustrial) { dynamicPhase = 'pre_industrial'; }
  else if(triggerIntermediaria) { dynamicPhase = 'intermediaria'; }

  const phases = [
    { 
      id: 'pilot', 
      name: 'Fase 1: Piloto de Validação', 
      volume: '30m³', 
      desc: '6 tanques de 5000L. Foco em validar conversão alimentar e mortalidade em BH.',
      trigger: 'Mês 0 - CAPEX Inicial',
      achieved: true
    },
    { 
      id: 'intermediaria', 
      name: 'Fase 2: Escala Comercial', 
      volume: '60m³', 
      desc: '12 tanques. Volume mínimo para pagar pro-labore fixo.',
      trigger: 'Ao acumular +R$ 35.000 em caixa',
      achieved: triggerIntermediaria
    },
    { 
      id: 'pre_industrial', 
      name: 'Fase 3: Pré-Industrial', 
      volume: '180m³', 
      desc: 'Fábrica própria de ração recomendada (Ração Circular).',
      trigger: 'Ao acumular +R$ 80.000 em caixa',
      achieved: triggerPreIndustrial
    },
    { 
      id: 'industrial', 
      name: 'Fase 4: Industrial (Ceasa)', 
      volume: '360m³', 
      desc: 'Volume para ataque no Ceasa-BH e redes de supermercado.',
      trigger: 'Ao acumular +R$ 130.000 em caixa',
      achieved: triggerIndustrial
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Route className="text-cyan-400" /> Roadmap & Cash Flow
        </h1>
        <p className="text-gray-400 mt-2">Plano de evolução vertical, fluxo de caixa em 3 anos e gatilhos de expansão (Reinvestimento).</p>
      </header>

      {/* CASH FLOW PROJECTION SETTINGS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
         <div className="flex flex-col lg:flex-row gap-8 items-center">
           <div className="flex-1 w-full">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-white flex items-center gap-2"><Coins size={18} className="text-yellow-400"/> Aporte Mensal Extra (R$)</h3>
               <span className="font-mono text-xl font-bold text-yellow-400">R$ {aporteMensal.toLocaleString('pt-BR')}</span>
             </div>
             <input 
               type="range" 
               min="0" max="10000" step="500" 
               value={aporteMensal}
               onChange={(e) => setAporteMensal(Number(e.target.value))}
               className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
             />
             <p className="text-xs text-gray-500 mt-4 leading-relaxed">
               Lucros da piscicultura reinvestidos + aporte extra sazonal para garantir a trava de segurança de capital de giro (Burn Rate de Inverno).
             </p>
           </div>

           <div className="w-full lg:w-1/3 flex flex-col gap-4">
             <div className="bg-[#0a0f1c] border border-cyan-500/20 p-5 rounded-xl shadow-inner">
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Ponto de Equilíbrio (Break Even)</h4>
               {breakEvenMonth > 0 ? (
                 <p className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                   <CalendarDays size={20}/> Mês {breakEvenMonth}
                 </p>
               ) : (
                 <p className="text-lg font-bold text-red-400">Não atinge em 3 anos</p>
               )}
             </div>

             <div className="bg-orange-950/30 border border-orange-500/20 p-5 rounded-xl shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <ShieldAlert size={14} className="text-orange-400"/> Capital de Giro Mínimo Recomendado
                </h4>
                <p className="text-xl font-bold text-white">R$ {capitalDeGiroMinimo.toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-gray-500 mt-1">Garante a operação integral da piscicultura por 6 meses mesmo sem vendas ou sinistros.</p>
             </div>
           </div>
         </div>
      </div>

      {/* CASH FLOW CHART */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-emerald-400"/> Projeção Saldo Acumulado (36 Meses)</h3>
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
              <Tooltip 
                cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
                contentStyle={{ backgroundColor: '#0a0f1c', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any, name: any, props: any) => {
                  const extra = props.payload.opexExtra ? ` (${props.payload.opexExtra})` : '';
                  return [`R$ ${Number(value).toLocaleString('pt-BR')}${extra}`, 'Saldo Acumulado'];
                }}
              />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" opacity={0.6} />
              <Area 
                type="monotone" 
                dataKey="cash" 
                stroke="#34d399" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCash)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROADMAP TIMELINE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-2">Timeline de Expansão Dinâmica</h3>
        <p className="text-sm text-gray-400 mb-8">As fases são ativadas automaticamente nesta simulação ao se atingir os pontos de corte de segurança financeira no fluxo de caixa (O projeto alcança no máximo: <strong>Fase {dynamicPhase.toUpperCase()}</strong>).</p>
        
        <div className="relative pl-8 space-y-12 before:absolute before:inset-0 before:ml-[39px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
          
          {phases.map((phase, i) => {
            const isCurrent = dynamicPhase === phase.id;
            const isCompleted = phase.achieved && !isCurrent;
            const isFuture = !phase.achieved;
            
            let bulletConfig = 'bg-[#1e293b] border-[#0a0f1c]';
            let textConfig = 'text-gray-500';
            let cardBg = 'bg-white/5 opacity-60';
            
            if (isCurrent) {
               bulletConfig = 'bg-cyan-500 border-[#0a0f1c] scale-125 shadow-[0_0_15px_rgba(34,211,238,0.5)]';
               textConfig = 'text-cyan-400';
               cardBg = 'bg-cyan-950/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.05)]';
            } else if (isCompleted) {
               bulletConfig = 'bg-emerald-500 border-[#0a0f1c]';
               textConfig = 'text-emerald-400';
               cardBg = 'bg-emerald-950/10 border-emerald-500/20';
            }
            
            return (
              <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 transition-all duration-300 ${bulletConfig}`}>
                  <span className={`text-xs font-bold ${isCurrent ? 'text-black' : isCompleted ? 'text-black' : 'text-gray-400'}`}>
                    {isCompleted ? '✓' : i + 1}
                  </span>
                </div>
                
                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] border p-5 rounded-xl transition-all duration-300 cursor-default ${cardBg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-bold text-lg ${textConfig}`}>{phase.name}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${isCurrent ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-500 border-white/5'}`}>
                      {phase.volume}
                    </span>
                  </div>
                  <p className={`text-sm mb-4 ${isFuture ? 'text-gray-600' : 'text-gray-300'}`}>{phase.desc}</p>
                  <div className={`text-xs font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-2 border ${isCompleted || isCurrent ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20' : 'bg-[#0a0f1c]/50 text-gray-600 border-white/5'}`}>
                    <TrendingUp size={14}/> Gatilho: {phase.trigger}
                  </div>
                </div>
              </div>
            );
          })}
          
        </div>
      </div>

    </div>
  );
}

"use client";

import { useProject } from "@/contexts/ProjectContext";
import { Thermometer, AlertCircle, Flame, Zap } from "lucide-react";
import * as CONST from "@/data/constants";

export default function AlimentacaoPage() {
  const { state } = useProject();
  
  const tempTarget = CONST.TARGET_WATER_TEMP;
  const climateEnabled = state.parameters.climateControlEnabled;
  
  // Thermodynamic Calculation (BH Cwb Climate Context)
  const volumeTotal = 360; // Usando volume industrial agora
  const winterWaterTemp = 18; 
  const deltaT = Math.max(0, tempTarget - winterWaterTemp);
  const btuNecessario = Math.round(volumeTotal * deltaT * 133.3); // Approximation
  const powerKW = ((btuNecessario / 12000) * 1.25).toFixed(1); 

  // Feed Economics Estimation
  const biomassObj = state.biomass || {};
  const totalBiomass = Object.values(biomassObj).reduce((a, b) => a + Number(b), 0);
  const feedCostPerKg = 4.50; // Reference R$/kg
  const monthlyFeedCost = totalBiomass * 0.02 * 30 * feedCostPerKg;
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Thermometer className="text-cyan-400" /> Alimentação & Climatização
        </h1>
        <p className="text-gray-400 mt-2">Controle térmico integrado para maximizar o metabolismo da biomassa e gerenciar custos de ração.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CLIMATE CONTROLS */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Bomba de Calor (Inverno BH)</h3>
              <p className="text-sm text-gray-400 mt-1">Impacto direto no OPEX e Receita.</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${climateEnabled ? 'bg-cyan-500 text-[#0a0f1c]' : 'bg-gray-800 text-gray-500'}`}>
               {climateEnabled ? 'Sistema Ativo' : 'Sistema Inativo'}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
               <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Temperatura Alvo Estabilizada</label>
               <div className="text-3xl font-black text-white">{tempTarget}°C</div>
            </div>

            <div className="bg-[#0a0f1c] border border-white/5 rounded-2xl p-6 shadow-inner">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Cálculo Termodinâmico (Pico Inverno)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Demanda Térmica</p>
                  <p className="text-xl font-bold text-orange-400 flex items-center gap-1"><Flame size={16}/> {btuNecessario.toLocaleString('pt-BR')} <span className="text-xs text-gray-500 font-normal uppercase">BTU</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Potência Elétrica</p>
                  <p className="text-xl font-bold text-cyan-400 flex items-center gap-1"><Zap size={16}/> {powerKW} <span className="text-xs text-gray-500 font-normal uppercase">kW</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDING RULES AND IMPACT */}
        <div className="space-y-6">
          <div className={`p-6 rounded-[32px] border flex items-start gap-4 transition-colors duration-500 shadow-lg ${
            climateEnabled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <AlertCircle className={climateEnabled ? 'text-emerald-400' : 'text-red-400'} size={24} />
            <div>
              <h3 className={`font-black uppercase tracking-tighter ${climateEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                {climateEnabled ? 'Metabolismo Otimizado' : 'Risco Letal (Inverno)'}
              </h3>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                {climateEnabled
                  ? 'A tilápia processará a ração na máxima velocidade com a água a 28°C. FCA esperado base (1.2 - 1.4).' 
                  : 'Temperaturas em BH chegam a 18°C. A tilápia cessa a alimentação e perde imunidade.'
                }
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl flex flex-col gap-5">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Custo Operacional Estimado</h3>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Ração / Mês</p>
                    <p className="text-2xl font-black text-emerald-400">R$ {monthlyFeedCost.toLocaleString('pt-BR')}</p>
                 </div>
             </div>
             
             <div className="space-y-4 text-xs text-gray-300">
               <div className="flex justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <span className="font-bold text-gray-400">Ração Inicial (45% PB)</span>
                  <span className="text-white font-mono">R$ 6,00 / kg</span>
               </div>
               <div className="flex justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <span className="font-bold text-gray-400">Ração Crescimento (32% PB)</span>
                  <span className="text-white font-mono">R$ 4,50 / kg</span>
               </div>
               <div className="flex justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <span className="font-bold text-gray-400">Ração Engorda (28% PB)</span>
                  <span className="text-white font-mono">R$ 4,00 / kg</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

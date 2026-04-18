"use client";

import { useProject } from "../../../contexts/ProjectContext";
import { Thermometer, Droplets, AlertCircle, Flame, Zap, DollarSign } from "lucide-react";

export default function AlimentacaoPage() {
  const { state, dispatch } = useProject();
  
  const tempTarget = state.parameters.targetTemperature || 28;
  const climateEnabled = state.parameters.climateControlEnabled;
  
  // Thermodynamic Calculation (BH Cwb Climate Context)
  const volumeTotal = 30; // 30m³ in the Pilot phase
  const winterWaterTemp = 18; 
  const deltaT = Math.max(0, tempTarget - winterWaterTemp);
  const btuNecessario = Math.round(volumeTotal * deltaT * 133.3); // Approximation
  const powerKW = ((btuNecessario / 12000) * 1.25).toFixed(1); 

  // Feed Economics Estimation
  const biomassObj = state.biomass || {};
  const totalBiomass = Object.values(biomassObj).reduce((a, b) => a + Number(b), 0);
  const feedCostPerKg = 4.50; // Reference R$/kg
  // Rough estimate: Biomass * 2% bodyweight per day * 30 days * R$/kg
  const monthlyFeedCost = totalBiomass * 0.02 * 30 * feedCostPerKg;
  
  const handleTempChange = (val: string) => {
    dispatch({ type: 'UPDATE_PARAM', payload: { key: 'targetTemperature', value: Number(val) } });
  };
  
  const toggleClimate = () => {
    dispatch({ type: 'UPDATE_PARAM', payload: { key: 'climateControlEnabled', value: !climateEnabled } });
  };

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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Bomba de Calor (Inverno BH)</h3>
              <p className="text-sm text-gray-400 mt-1">Impacto direto no OPEX (Energia) e Receita (Tempo Despesca via TCA)</p>
            </div>
            <button 
              onClick={toggleClimate}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${climateEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${climateEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className={`transition-all duration-300 ${!climateEnabled ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
            <label className="block text-sm font-semibold text-gray-300 mb-4">Temperatura Alvo da Água: <span className="text-cyan-400 font-bold text-xl">{tempTarget}°C</span></label>
            <input 
              type="range" 
              min="20" max="32" step="1" 
              value={tempTarget}
              onChange={(e) => handleTempChange(e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold px-1">
              <span>20°C (Mínimo)</span>
              <span>28°C (Ideal)</span>
              <span>32°C (Estresse)</span>
            </div>

            <div className="mt-8 bg-[#0a0f1c] border border-white/5 rounded-xl p-5 shadow-inner">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Cálculo Termodinâmico (Pico Inverno)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Demanda Térmica Acumulada</p>
                  <p className="text-xl font-bold text-orange-400 flex items-center gap-1"><Flame size={16}/> {btuNecessario.toLocaleString('pt-BR')} <span className="text-xs text-gray-500 font-normal">BTUs</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Potência Elétrica Requerida</p>
                  <p className="text-xl font-bold text-cyan-400 flex items-center gap-1"><Zap size={16}/> {powerKW} <span className="text-xs text-gray-500 font-normal">kW</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDING RULES AND IMPACT */}
        <div className="space-y-6">
          <div className={`p-5 rounded-xl border flex items-start gap-4 transition-colors duration-500 shadow-lg ${
            climateEnabled ? (tempTarget >= 26 && tempTarget <= 30) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-red-500/10 border-red-500/30'
          }`}>
            <AlertCircle className={climateEnabled ? (tempTarget >= 26 && tempTarget <= 30) ? 'text-emerald-400' : 'text-yellow-400' : 'text-red-400'} size={24} />
            <div>
              <h3 className={`font-bold ${climateEnabled ? (tempTarget >= 26 && tempTarget <= 30) ? 'text-emerald-400' : 'text-yellow-400' : 'text-red-400'}`}>
                {climateEnabled 
                  ? (tempTarget >= 26 && tempTarget <= 30) ? 'Metabolismo Otimizado (Crescimento 100%)' : 'Risco Metabólico (Fora da Zona de Conforto)'
                  : 'Risco Letal (Inverno sem Aquecimento)'
                }
              </h3>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                {climateEnabled
                  ? (tempTarget >= 26 && tempTarget <= 30) ? 'A tilápia processará a ração na máxima velocidade. FCA esperado base (1.3 - 1.5).' : 'A digestão será lenta. Adapte a frequência do arraçoamento para evitar sobra de ração e degradação da água.'
                  : 'Temperaturas da água em BH chegam a 18°C ou menos. A tilápia cessa a alimentação, perde imunidade e pode ir a óbito. O simulador refletirá prejuízo financeiro direto.'
                }
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-5">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="text-lg font-bold text-white">Estratégia de Tratos Profissional</h3>
                 <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Custo Est. Mês (Ração)</p>
                    <p className="text-xl font-bold text-emerald-400">R$ {monthlyFeedCost.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                 </div>
             </div>
             
             <ul className="space-y-4 text-sm text-gray-300">
               <li className="flex flex-col border-b border-white/5 pb-3">
                 <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-cyan-400">Alevinagem (1g - 30g)</span>
                     <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">R$ 8,50 / kg</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-gray-400">
                     <span>Pó 1mm a 2mm (50% PB)</span>
                     <span>6x a 8x ao dia (~8% PV)</span>
                 </div>
               </li>

               <li className="flex flex-col border-b border-white/5 pb-3">
                 <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-cyan-400">Recria (30g - 250g)</span>
                     <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">R$ 5,20 / kg</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-gray-400">
                     <span>Pellet 4mm (36% PB)</span>
                     <span>4x ao dia (~4% PV)</span>
                 </div>
               </li>
               
               <li className="flex flex-col border-b border-white/5 pb-3">
                 <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-cyan-400">Engorda (250g - 800g+)</span>
                     <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">R$ 3,80 / kg</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-gray-400">
                     <span>Pellet 6mm a 8mm (32% PB)</span>
                     <span>3x ao dia (~2% PV)</span>
                 </div>
               </li>

               <li className="flex justify-between items-center pt-2 bg-black/30 p-3 rounded-lg border border-white/5">
                 <span className="text-gray-400">Tratos com Automação Otimizada</span>
                 <span className="font-bold text-cyan-400 flex items-center gap-1"><Zap size={14}/> Contínuo (Alimentador Automático)</span>
               </li>
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

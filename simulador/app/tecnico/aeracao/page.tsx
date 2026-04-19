"use client";

import { useProject } from "../../../contexts/ProjectContext";
import { Wind, AlertTriangle, CheckCircle2, Activity, Timer } from 'lucide-react';
import { useEffect, useState } from "react";

export default function AeracaoPage() {
  const { state, syncDispatch } = useProject();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const biomassObj = state.biomass || {};
  const totalBiomass = Object.values(biomassObj).reduce((a, b) => a + Number(b), 0);
  
  // Rule 4: vazaoNecessaria = biomassaTotal * 25 / 1000 (m³/h)
  const vazaoNecessaria = (totalBiomass * 25) / 1000;

  // Simulate installed capacity (rough estimate based on pilot capex)
  // 1 Blower 1CV pushes ~150 m³/h at 1.2m depth
  const sopradoresInstalados = (state.capexItems || []).filter(item => item.category === 'Aeração');
  // For the sake of the simulator, every aeration item = 1x Blower 1.5CV = 200m3/h
  const capacidadeInstalada = sopradoresInstalados.length * 200; 

  const isSufficient = capacidadeInstalada >= vazaoNecessaria;

  // Emerging Survival Time Calculation (Rough estimate: 35kg/m3 depletes in ~30 mins)
  const densityKgM3 = totalBiomass / 30; // 30m3 volume
  let survivalMinutes = 120; // safe baseline at very low density
  if (densityKgM3 > 5) survivalMinutes = 60;
  if (densityKgM3 > 15) survivalMinutes = 45;
  if (densityKgM3 > 25) survivalMinutes = 30;
  if (densityKgM3 > 30) survivalMinutes = 20;

  const handleBiomassChange = (tankId: string, value: string) => {
    syncDispatch({
      type: 'UPDATE_BIOMASS',
      payload: { tankId, value: Math.max(0, Number(value)) }
    });
  };

  if (!mounted) return null; // Hydration fix

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Wind className="text-cyan-400" /> Aeração & Oxigênio
        </h1>
        <p className="text-gray-400 mt-2">Dimensionamento dinâmico da demanda de O₂ e automação de sopradores.</p>
      </header>

      {/* STATUS BANNER */}
      <div className={`p-5 rounded-xl flex items-center gap-4 shadow-lg ${isSufficient ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border-l-4 border-l-red-500 border border-y-red-500/20 border-r-red-500/20'}`}>
        {isSufficient ? <CheckCircle2 className="text-emerald-400" size={28} /> : <AlertTriangle className="text-red-400" size={28} />}
        <div>
          <h3 className={`font-bold ${isSufficient ? 'text-emerald-400' : 'text-red-400'}`}>
            {isSufficient ? 'Aeração Adequada para a Biomassa Atual' : 'ALERTA: Aeração Insuficiente!'}
          </h3>
          <p className="text-sm text-gray-300 mt-1">
            {isSufficient 
              ? 'A capacidade instalada atende à demanda de oxigênio do biofloco e dos peixes.'
              : 'A biomassa nos tanques excede a capacidade de aeração, podendo causar hipóxia letal.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TANKS CONFIGURATION */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Activity size={18} className="text-cyan-400"/> Biomassa Viva (kg)</h3>
            <div className="flex gap-2">
              <span className="text-sm font-bold text-gray-300 px-3 py-1 bg-white/5 rounded-full border border-white/10">Densidade Global: {densityKgM3.toFixed(1)} kg/m³</span>
              <span className="text-sm font-bold text-cyan-400 px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30">Total: {totalBiomass} kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(biomassObj).map((tankId) => (
              <div key={tankId} className="bg-[#0a0f1c] border border-white/5 rounded-xl p-4 transition-all focus-within:border-cyan-500/50">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanque {tankId.toUpperCase()}</label>
                  <span className="text-[10px] text-gray-500">{(Number(biomassObj[tankId])/5).toFixed(1)}kg/m³</span>
                </div>
                <input 
                  type="number" 
                  value={biomassObj[tankId]} 
                  onChange={(e) => handleBiomassChange(tankId, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-bold tabular-nums focus:outline-none focus:border-cyan-500 hover:bg-white/10 transition-colors"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6">* Cada tanque suporta até 175kg na fase final piloto (35kg/m³ em 5000L). Operar acima de 40kg/m³ exige oxigênio líquido.</p>
        </div>

        {/* METRICS CARD */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">Parâmetros de Carga</h3>
            
            <div className="group relative">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2 cursor-help">Vazão Necessária ⓘ</p>
              <p className="text-3xl font-bold text-white">{vazaoNecessaria.toFixed(1)} <span className="text-sm text-gray-500 font-normal">m³/h</span></p>
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 bg-black text-xs text-gray-300 p-2 rounded shadow-lg border border-white/10 z-10">
                Fórmula de Regra Prática BFT: ~25 Litros de Ar por minuto para cada 1kg de peixe + demanda DBO orgânica.
              </div>
            </div>

            <div className="h-px w-full bg-white/10"></div>

            <div>
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Capac. Instalada</p>
              <p className={`text-3xl font-bold ${isSufficient ? 'text-emerald-400' : 'text-red-400'}`}>{capacidadeInstalada.toFixed(1)} <span className="text-sm text-gray-500 font-normal">m³/h</span></p>
              <p className="text-xs text-gray-500 mt-1">Conforme CAPEX investido ({sopradoresInstalados.length} uni.)</p>
            </div>
          </div>
          
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-2">
               <Timer className="text-orange-400" size={24}/>
               <h4 className="font-bold text-orange-400">O₂ de Emergência</h4>
             </div>
             <p className="text-2xl font-black text-white">{survivalMinutes} Minutos</p>
             <p className="text-xs text-orange-200/80 mt-1">Tempo estimado de sobrevivência da biomassa sem aeração (queda de grid de energia) baseado na densidade de {densityKgM3.toFixed(1)}kg/m³.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

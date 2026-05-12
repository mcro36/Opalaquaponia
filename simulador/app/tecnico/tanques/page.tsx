"use client";

import { useProject } from "@/contexts/ProjectContext";
import * as CONST from "@/data/constants";
import { Fish, Weight, Utensils, Info, Activity, Droplets, Target, AlertTriangle } from 'lucide-react';

export default function TanquesPage() {
  const { state } = useProject();
  
  const targetDensity = state.parameters.targetDensity;
  const totalVolume = 360; // m3
  const totalBiomassCap = targetDensity * totalVolume;
  
  const tanks = [
    { id: 1, name: 'Tanque 01 (Berçário)', volume: 60, stage: 'Alevinagem', weight: '1.5g - 30g' },
    { id: 2, name: 'Tanque 02 (Recria 1)', volume: 60, stage: 'Crescimento', weight: '30g - 150g' },
    { id: 3, name: 'Tanque 03 (Recria 2)', volume: 60, stage: 'Crescimento', weight: '150g - 350g' },
    { id: 4, name: 'Tanque 04 (Terminação 1)', volume: 60, stage: 'Engorda', weight: '350g - 550g' },
    { id: 5, name: 'Tanque 05 (Terminação 2)', volume: 60, stage: 'Engorda', weight: '550g - 750g' },
    { id: 6, name: 'Tanque 06 (Despesca)', volume: 60, stage: 'Acabamento', weight: '750g - 900g' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in pb-32">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">Engenharia de <span className="text-cyan-400">Tanques</span></h1>
        <p className="text-gray-400 mt-2">Dimensionamento industrial e densidades críticas para 360m³.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {tanks.map((tank) => (
            <div key={tank.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-white group-hover:scale-150 transition-transform">
                <Droplets size={80} />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
                  <Activity size={20} />
                </div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{tank.volume}m³ Volume</div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{tank.name}</h3>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-4">{tank.stage}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold mb-1">Peso Alvo</span>
                  <span className="text-sm font-bold text-white">{tank.weight}</span>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold mb-1">Capacidade</span>
                  <span className="text-sm font-bold text-white">{Math.round(tank.volume * targetDensity)} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <section className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
               <Target size={20} className="text-cyan-400" /> Métricas de Escala
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                  <span>Densidade Crítica</span>
                  <span className="text-cyan-400">{targetDensity} kg/m³</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${(targetDensity / 60) * 100}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Biomassa Total em Pico</span>
                    <span className="text-2xl font-black text-white">{totalBiomassCap.toLocaleString()} <span className="text-sm font-normal text-cyan-400">kg</span></span>
                 </div>
                 <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Renovação de Água Alvo</span>
                    <span className="text-2xl font-black text-white">0.5 <span className="text-sm font-normal text-cyan-400">% / dia (BFT)</span></span>
                 </div>
              </div>
            </div>
          </section>

          <section className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
               <AlertTriangle size={20} className="text-red-400" /> Restrição de Carga
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              O sistema super-intensivo RJ Piscicultura é dimensionado para uma carga máxima de 
              <span className="text-white font-bold"> 45kg/m³ </span> 
              sob aeração constante de 1.5HP por tanque. Ultrapassar este limite sem automação de oxigênio (OD) resultará em mortandade aguda em menos de 15 minutos em caso de queda de energia.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

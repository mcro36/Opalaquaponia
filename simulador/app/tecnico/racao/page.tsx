"use client";

import { useProject } from "../../../contexts/ProjectContext";
import { Factory, ArrowRight, Wallet, Activity, CheckCircle2 } from "lucide-react";

export default function RacaoPage() {
  const { state, syncDispatch } = useProject();
  
  const ownFeedEnabled = state.parameters.ownFeedEnabled;

  const toggleFeed = () => {
    const isNowEnabled = !ownFeedEnabled;
    syncDispatch({ type: 'UPDATE_PARAM', payload: { key: 'ownFeedEnabled', value: isNowEnabled } });
    
    // Simulate Business Rule Impact:
    // If own feed is produced: Better quality = lower FCA. Price/kg is assumed lower in OPEX global calculations.
    if (isNowEnabled) {
      syncDispatch({ type: 'UPDATE_PARAM', payload: { key: 'fca', value: 1.0 } }); 
    } else {
      syncDispatch({ type: 'UPDATE_PARAM', payload: { key: 'fca', value: 1.2 } }); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Factory className="text-cyan-400" /> Ração Circular
        </h1>
        <p className="text-gray-400 mt-2">Extrusão in-house com uso de biomassa da Lentilha d'água e silagem rica em proteína.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PRODUCE CONTROLS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-fit">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Fabricação Própria (Mini-Fábrica)</h3>
              <p className="text-sm text-gray-400 mt-1">Recomendado apenas para fases Pré-Industrial/Industrial</p>
            </div>
            <button 
              onClick={toggleFeed}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${ownFeedEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${ownFeedEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="space-y-3">
            <div className={`p-4 rounded-xl border transition-colors ${ownFeedEnabled ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/10'}`}>
               <div className="flex justify-between items-center mb-1">
                 <span className="text-sm text-gray-400">Nutrição</span>
                 <span className={`font-bold ${ownFeedEnabled ? 'text-cyan-400' : 'text-gray-200'}`}>
                   {ownFeedEnabled ? 'Premium Circular' : 'Comercial Padrão'}
                 </span>
               </div>
               <div className="flex justify-between items-center mb-1">
                 <span className="text-sm text-gray-400">Custo Estimado R$/kg</span>
                 <span className={`font-bold ${ownFeedEnabled ? 'text-emerald-400' : 'text-orange-400'}`}>
                   {ownFeedEnabled ? '~ R$ 2,50' : '~ R$ 4,50'}
                 </span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-400">Perspectiva FCA</span>
                 <span className={`font-bold ${ownFeedEnabled ? 'text-emerald-400' : 'text-yellow-400'}`}>
                   {ownFeedEnabled ? '1.0' : '1.2'}
                 </span>
               </div>
            </div>

            {ownFeedEnabled && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="text-emerald-400" />
                <p className="text-sm text-emerald-200">A ativação desta regra reduziu o FCA no Contexto Global. O OPEX no Dashboard será otimizado drasticamente.</p>
              </div>
            )}
          </div>
        </div>

        {/* PROCESS FLOW EXPLANATION */}
        <div className="bg-[#0a0f1c] border border-white/5 rounded-2xl p-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Factory size={150} />
          </div>
          
          <h3 className="text-lg font-bold text-white mb-6 relative z-10">Processo de Valor Agregado</h3>
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="bg-cyan-500/20 p-2 rounded-full text-cyan-400"><Activity size={16}/></div>
              <div>
                <p className="text-sm font-bold text-white">Resíduo da Filetagem (67%)</p>
                <p className="text-xs text-gray-500">Cabeças, espinhas e carcaças ricas em fósforo.</p>
              </div>
            </div>
            
            <div className="ml-4 border-l-2 border-cyan-500/30 pl-6 py-2 relative flex gap-4">
              <div className="absolute left-[-11px] top-4 bg-[#0a0f1c] text-cyan-500"><ArrowRight size={20}/></div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg w-full">
                <p className="text-sm font-bold text-emerald-400">Silagem Ácida (Proteína 15-20%)</p>
                <p className="text-xs text-emerald-200/80">Processamento a frio com ácido fórmico.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="bg-green-500/20 p-2 rounded-full text-green-400"><Factory size={16}/></div>
              <div>
                <p className="text-sm font-bold text-white">Mixagem & Extrusão</p>
                <p className="text-xs text-gray-500">Mistura com ingredientes agrícolas secos locais e Lentilha D'água.</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-lg">
              <p className="text-xs text-cyan-100 italic">"Esta arquitetura circular é o grande trunfo para viabilizar comercialmente a super-intensificação sem depender das oscilações da soja mercado."</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

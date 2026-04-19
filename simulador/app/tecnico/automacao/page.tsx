"use client";

import { useState } from "react";
import { useProject } from "../../../contexts/ProjectContext";
import { Cpu, Plus, Trash2, Save, X } from "lucide-react";

export default function AutomacaoPage() {
  const { state, syncDispatch } = useProject();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', cost: 0 });

  const sensores = state.capexItems.filter(item => item.category === 'Automação' || item.name.toLowerCase().includes('sensor'));

  const handleDelete = (id: string) => {
    syncDispatch({ type: 'REMOVE_CAPEX', payload: id });
  };

  const handleAdd = () => {
    if (!newItem.name || newItem.cost <= 0) return;
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `auto_${Date.now()}`;
    syncDispatch({
      type: 'ADD_CAPEX',
      payload: {
        id: newId,
        category: 'Automação',
        name: newItem.name,
        cost: Number(newItem.cost),
        status: 'Planejado'
      }
    });
    setNewItem({ name: '', cost: 0 });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Cpu className="text-cyan-400" /> Automação Inteligente
        </h1>
        <p className="text-gray-400 mt-2">Gestão de sensores e CLP. Equipamentos adicionados entram automaticamente no CAPEX.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CRUD SENSORES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Inventário IoT</h3>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors border border-cyan-400/50"
            >
              <Plus size={16} /> Novo Sensor
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {sensores.length === 0 && !isAdding && (
              <div className="bg-[#0a0f1c]/50 border border-dashed border-white/20 rounded-xl p-8 text-center text-gray-500">
                Nenhum sistema de automação mapeado.
              </div>
            )}

            {isAdding && (
              <div className="flex gap-3 bg-white/10 p-3 rounded-xl border border-cyan-500/30 animate-in slide-in-from-top-2">
                <input 
                  type="text" 
                  placeholder="Ex: Sensor de OD Óptico"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
                <input 
                  type="number" 
                  placeholder="R$"
                  value={newItem.cost || ''}
                  onChange={e => setNewItem({...newItem, cost: Number(e.target.value)})}
                  className="w-24 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
                <button onClick={handleAdd} className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors"><Save size={16}/></button>
                <button onClick={() => setIsAdding(false)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors"><X size={16}/></button>
              </div>
            )}

            {sensores.map(sensor => (
              <div key={sensor.id} className="flex justify-between items-center bg-[#0a0f1c] border border-white/5 p-4 rounded-xl group/item hover:border-white/20 transition-all">
                <div>
                  <p className="text-sm font-semibold text-gray-200">{sensor.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">{sensor.status}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="font-bold text-cyan-400">R$ {sensor.cost.toLocaleString('pt-BR')}</span>
                  <button onClick={() => handleDelete(sensor.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGIC DIAGRAM PLACEHOLDER */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-fit">
          <h3 className="text-lg font-bold text-white mb-6">Matriz de Lógica Smart</h3>
          <div className="bg-[#0a0f1c] p-5 rounded-xl border border-white/5 space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-white/5">
              <span className="text-cyan-400 font-bold shrink-0 mt-1">SE</span> 
              <p className="text-gray-300 text-sm leading-relaxed">OD &lt; 4.5 mg/L no Tanque<br/><span className="text-emerald-400 font-bold block mt-1">ENTÃO: Aciona soprador B2 (Backup) e envia Telegram.</span></p>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-white/5">
              <span className="text-cyan-400 font-bold shrink-0 mt-1">SE</span> 
              <p className="text-gray-300 text-sm leading-relaxed">Temp d'Água &lt; 25°C<br/><span className="text-emerald-400 font-bold block mt-1">ENTÃO: Trava arraçoamento noturno, liga Bomba Térmica.</span></p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-cyan-400 font-bold shrink-0 mt-1">SE</span> 
              <p className="text-gray-300 text-sm leading-relaxed">Queda Grid (0V)<br/><span className="text-emerald-400 font-bold block mt-1">ENTÃO: QTA transfere em &lt;10s. SMS disparo sirene.</span></p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-xs text-cyan-200">
            A automação inteligente reduz a dependência de mão de obra direta (-1 operador) e garante a conversão alimentar (FCA) abaixo de 1.3 evitando perdas críticas por anoxia.
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { loadGoals, upsertGoal, deleteGoal, upsertKeyResult } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { Target, Plus, CheckCircle, Flag, Trash2 } from 'lucide-react';

export default function MetasPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'produção', metric: '', target_value: 100, current_value: 0,
    unit: '%', deadline: new Date().toISOString().split('T')[0], status: 'em_andamento',
    priority: 'Alta'
  });

  const fetchData = async () => {
    setIsLoading(true);
    const data = await loadGoals(projectId);
    setGoals(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = { ...formData, id: crypto.randomUUID() };
    setIsGoalModalOpen(false);
    
    await upsertGoal(projectId, newGoal);
    fetchData();
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Excluir este Objetivo e seus Key Results?')) return;
    await deleteGoal(id);
    fetchData();
  };

  return (
    <div className="p-8 pb-32">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Objetivos Corporativos (OKRs)</h1>
          <p className="text-gray-400">Acompanhamento estratégico de metas da fazenda.</p>
        </div>
        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Objetivo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map(goal => {
          const perc = goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0;
          return (
            <div key={goal.id} className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/5 text-gray-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                  {goal.category}
                </span>
                <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">{goal.title}</h2>
              <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                <Flag size={14}/> Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
              </p>

              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">{goal.metric}</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {goal.current_value} <span className="text-sm text-gray-500">/ {goal.target_value} {goal.unit}</span>
                    </p>
                  </div>
                  <span className="font-mono text-white text-xl font-bold">{perc.toFixed(0)}%</span>
                </div>

                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${perc >= 100 ? 'bg-green-500' : perc > 50 ? 'bg-cyan-500' : 'bg-yellow-500'}`} 
                    style={{ width: `${Math.min(perc, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
        {goals.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-white/10 rounded-2xl text-gray-500">
             Nenhuma meta estratégica definida.
          </div>
        )}
      </div>

      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Adicionar Objetivo</h2>
            </div>
            
            <form onSubmit={handleSaveGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Título do Objetivo</label>
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Reduzir mortalidade da fase alevino" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Métrica Chave</label>
                  <input required value={formData.metric} onChange={e => setFormData({ ...formData, metric: e.target.value })} placeholder="Ex: Mortalidade" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Categoria</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="produção">Produção</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="comercial">Comercial</option>
                    <option value="qualidade">Qualidade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Alvo (Meta)</label>
                  <input type="number" step="0.1" required value={formData.target_value} onChange={e => setFormData({ ...formData, target_value: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Atual</label>
                  <input type="number" step="0.1" value={formData.current_value} onChange={e => setFormData({ ...formData, current_value: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Unidade</label>
                  <input value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} placeholder="%, kg, R$" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Data Limite (Deadline)</label>
                <input type="date" required value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsGoalModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all">Salvar Meta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Plus, Fish, Scale, Trash2, CheckCircle, Activity, Box } from 'lucide-react';
import { loadBatches, upsertBatch, deleteBatch } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';

export default function LotesPage() {
  const { state } = useProject();
  const projectId = DEFAULT_PROJECT_ID;
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    species: 'Tilápia GIFT',
    initial_count: 5000,
    current_count: 5000,
    avg_weight_g: 1.5,
    phase: 'alevinagem'
  });

  const fetchData = async () => {
    setIsLoading(true);
    const data = await loadBatches(projectId);
    setBatches(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch = {
      ...formData,
      id: crypto.randomUUID(),
    };
    // optimistically update UI
    setBatches([newBatch, ...batches]);
    setIsModalOpen(false);
    
    await upsertBatch(projectId, newBatch);
    fetchData(); // reload to get proper server timestamps
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir lote? Esta ação removerá biometrias associadas.')) return;
    setBatches(batches.filter(b => b.id !== id));
    await deleteBatch(id);
  };

  const calculateBiomass = (count: number, weight: number) => {
    return ((count * weight) / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Lotes & Ciclos</h1>
          <p className="text-gray-400">Gerencie a entrada, crescimento e despesca dos peixes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Lote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium font-mono text-sm uppercase">Lotes Ativos</h3>
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg"><Fish size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{batches.filter(b => b.status === 'ativo').length}</p>
        </div>
        
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium font-mono text-sm uppercase">Biomassa Total (kg)</h3>
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><Scale size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {batches.reduce((acc, b) => acc + ((b.current_count * b.avg_weight_g) / 1000), 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
          </p>
        </div>
        
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium font-mono text-sm uppercase">Despescas Mês</h3>
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><CheckCircle size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5 w-full"></div>)}
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-colors group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                    <Box size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      {batch.code}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        batch.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {batch.status}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-400">{batch.species} • FASE: <span className="text-white uppercase">{batch.phase}</span></p>
                  </div>
                </div>
                
                <div className="flex gap-8 text-right">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Contagem</p>
                    <p className="font-semibold text-white">{batch.current_count.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Peso Médio</p>
                    <p className="font-semibold text-white">{batch.avg_weight_g} g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Biomassa Estimada</p>
                    <p className="font-semibold text-cyan-400">{calculateBiomass(batch.current_count, batch.avg_weight_g)} kg</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors" title="Registrar Biometria">
                    <Activity size={18} />
                  </button>
                  <button onClick={() => handleDelete(batch.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Excluir Lote">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {batches.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <Fish size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">Nenhum lote registrado.</p>
              <p className="text-sm text-gray-500 mt-1">Clique em "Novo Lote" para começar.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Registrar Novo Lote</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Código do Lote</label>
                  <input required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="Ex: L2026-01" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Fase Inicial</label>
                  <select value={formData.phase} onChange={e => setFormData({ ...formData, phase: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="alevinagem">Alevinagem</option>
                    <option value="recria">Recria</option>
                    <option value="engorda">Engorda</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Contagem Inicial (nº peixes)</label>
                  <input type="number" required value={formData.initial_count} onChange={e => setFormData({ ...formData, initial_count: Number(e.target.value), current_count: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Peso Médio (g)</label>
                  <input type="number" step="0.1" required value={formData.avg_weight_g} onChange={e => setFormData({ ...formData, avg_weight_g: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all">Salvar Lote</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

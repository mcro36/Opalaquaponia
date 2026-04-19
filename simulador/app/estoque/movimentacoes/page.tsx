"use client";

import { useEffect, useState } from 'react';
import { loadInventoryMovements, loadInventoryItems, upsertInventoryMovement } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { ArrowUpRight, ArrowDownRight, Plus, ArrowLeftRight } from 'lucide-react';

export default function EstoqueMovimentacoesPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [movements, setMovements] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_id: '', movement_type: 'saída', quantity: 1, 
    reason: '', movement_date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [movs, invItems] = await Promise.all([
      loadInventoryMovements(projectId),
      loadInventoryItems(projectId)
    ]);
    setMovements(movs);
    setItems(invItems);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMovement = { ...formData, id: crypto.randomUUID() };
    setIsModalOpen(false);
    
    await upsertInventoryMovement(newMovement);
    fetchData(); // Reload fully to get JOINed item names and refreshed stock
  };

  return (
    <div className="p-8 pb-32">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Movimentações de Estoque</h1>
          <p className="text-gray-400">Histórico de entradas, saídas e ajustes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Registrar Movimentação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-400 rounded-full"><ArrowUpRight size={32} /></div>
          <div>
            <p className="text-gray-400 font-medium font-mono text-xs uppercase mb-1">Entradas (30 dias)</p>
            <p className="text-2xl font-bold text-white">
              {movements.filter(m => m.movement_type === 'entrada').length} registros
            </p>
          </div>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex items-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-400 rounded-full"><ArrowDownRight size={32} /></div>
          <div>
             <p className="text-gray-400 font-medium font-mono text-xs uppercase mb-1">Saídas / Consumo (30 dias)</p>
            <p className="text-2xl font-bold text-white">
              {movements.filter(m => m.movement_type === 'saída').length} registros
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Item</th>
              <th className="p-4 font-medium">Tipo / Quantidade</th>
              <th className="p-4 font-medium">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {movements.map(mov => {
              const itemInfo = mov.inventory_items || { name: 'Desconhecido', unit: 'un' };
              const isEntrada = mov.movement_type === 'entrada';

              return (
                <tr key={mov.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-400 font-mono">
                    {new Date(mov.movement_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-white font-medium">{itemInfo.name}</td>
                  <td className="p-4 flex items-center gap-3 font-mono font-bold">
                     <span className={`p-1.5 rounded-lg ${isEntrada ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                        {isEntrada ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                     </span>
                     <span className={isEntrada ? 'text-green-400' : 'text-white'}>
                       {isEntrada ? '+' : '-'} {mov.quantity} {itemInfo.unit}
                     </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {mov.reason || '-'}
                  </td>
                </tr>
              )
            })}
            {movements.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Nenhuma movimentação registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Registrar Movimentação</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Insumo / Material</label>
                <select required value={formData.item_id} onChange={e => setFormData({ ...formData, item_id: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                  <option value="">Selecione um item do estoque...</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.current_stock} {i.unit} dsponíveis)</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Tipo de Movimento</label>
                  <select value={formData.movement_type} onChange={e => setFormData({ ...formData, movement_type: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="saída">Saída / Consumo / Descarte</option>
                    <option value="entrada">Entrada / Compra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Quantidade</label>
                  <input type="number" step="0.1" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Data</label>
                  <input type="date" required value={formData.movement_date} onChange={e => setFormData({ ...formData, movement_date: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Motivo</label>
                  <input required value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} placeholder="Ex: Consumo diário" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

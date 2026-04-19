"use client";

import { useEffect, useState } from 'react';
import { loadInventoryItems, upsertInventoryItem, deleteInventoryItem } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { PackageOpen, Plus, AlertTriangle, ShieldCheck, Box, Trash2 } from 'lucide-react';

export default function EstoqueInsumosPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'ração', unit: 'kg', 
    current_stock: 0, min_stock: 100, cost_per_unit: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    const data = await loadInventoryItems(projectId);
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { ...formData, id: crypto.randomUUID() };
    setItems([newItem, ...items]);
    setIsModalOpen(false);
    
    await upsertInventoryItem(projectId, newItem);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este item do estoque?')) return;
    setItems(items.filter(i => i.id !== id));
    await deleteInventoryItem(id);
  };

  const alerts = items.filter(i => Number(i.current_stock) <= Number(i.min_stock));
  const totalValue = items.reduce((a, b) => a + (Number(b.current_stock) * Number(b.cost_per_unit)), 0);

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Insumos & Estoque</h1>
          <p className="text-gray-400">Controle de insumos de produção e materiais.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400"><Box size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Itens Únicos</p>
          <p className="text-4xl font-bold text-white">{items.length}</p>
        </div>
        <div className={`bg-[#121a2f] border rounded-2xl p-6 relative overflow-hidden ${alerts.length > 0 ? 'border-red-500/50' : 'border-white/10'}`}>
          <div className={`absolute top-0 right-0 p-4 opacity-10 ${alerts.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
             {alerts.length > 0 ? <AlertTriangle size={80} /> : <ShieldCheck size={80} />}
          </div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Alertas Nível Mín.</p>
          <p className={`text-3xl font-bold ${alerts.length > 0 ? 'text-red-500' : 'text-green-400'}`}>
            {alerts.length} itens baixos
          </p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-400"><PackageOpen size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Capital Estocado</p>
           <p className="text-3xl font-bold text-cyan-400">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Produto / Categoria</th>
              <th className="p-4 font-medium text-right">Custo Unid.</th>
              <th className="p-4 font-medium text-right">Estoque Min.</th>
              <th className="p-4 font-medium text-right">Saldo Atual</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {items.map(item => {
              const perc = Number(item.min_stock) > 0 ? (Number(item.current_stock) / Number(item.min_stock)) * 100 : 100;
              const isAlert = Number(item.current_stock) <= Number(item.min_stock);

              return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-white font-medium">
                    {item.name}
                    <div className="mt-1">
                      <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded text-[10px] uppercase">
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-400 font-mono">
                    R$ {Number(item.cost_per_unit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-right text-gray-500 font-mono">
                    {item.min_stock} {item.unit}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-mono font-bold text-lg ${isAlert ? 'text-red-500' : 'text-cyan-400'}`}>
                       {item.current_stock}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">{item.unit}</span>
                    {isAlert && <AlertTriangle size={12} className="inline text-red-500 ml-2 animate-pulse" />}
                    
                    <div className="w-24 h-1 bg-white/10 rounded-full mt-2 ml-auto overflow-hidden">
                      <div className={`h-full ${isAlert ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(perc, 100)}%` }}></div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum insumo cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Novo Insumo</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Nome do Insumo</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Categoria</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="ração">Ração</option>
                    <option value="medicamento">Medicamento</option>
                    <option value="químico">Kit Químico (Testes)</option>
                    <option value="material">Material Diverso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Und Medida</label>
                  <input value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} placeholder="kg, L, PC" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1 text-[10px] truncate" title="Saldo Inicial">Saldo Ini.</label>
                  <input type="number" step="0.1" value={formData.current_stock} onChange={e => setFormData({ ...formData, current_stock: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1 text-[10px] truncate" title="Alerta Mínimo">Alerta Mín.</label>
                  <input type="number" step="0.1" value={formData.min_stock} onChange={e => setFormData({ ...formData, min_stock: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1 text-[10px] truncate" title="Custo Unitário (R$)">Custo Un (R$)</label>
                  <input type="number" step="0.01" value={formData.cost_per_unit} onChange={e => setFormData({ ...formData, cost_per_unit: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
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

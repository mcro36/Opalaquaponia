"use client";

import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { loadTransactions, upsertTransaction, deleteTransaction } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Calendar, Trash2 } from 'lucide-react';

export default function TransacoesPage() {
  const { state } = useProject();
  const projectId = DEFAULT_PROJECT_ID;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    type: 'despesa',
    category: 'Ração',
    description: '',
    amount: 0,
    transaction_date: todayDate,
    payment_method: 'PIX',
    is_paid: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    const data = await loadTransactions(projectId);
    setTransactions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTx = {
      ...formData,
      id: crypto.randomUUID(),
    };
    
    // Optimistic
    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);

    await upsertTransaction(projectId, newTx);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta transação?')) return;
    setTransactions(transactions.filter(t => t.id !== id));
    await deleteTransaction(id);
  };

  // Metrics
  const totalReceitas = transactions.filter(t => t.type === 'receita').reduce((a, b) => a + Number(b.amount), 0);
  const totalDespesas = transactions.filter(t => t.type === 'despesa').reduce((a, b) => a + Number(b.amount), 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Transações Financeiras</h1>
          <p className="text-gray-400">Controle real de entradas e saídas.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400"><Wallet size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Saldo Atual</p>
          <p className={`text-4xl font-bold ${saldo >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-400"><ArrowUpRight size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Receitas Mês</p>
          <p className="text-3xl font-bold text-green-400">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-400"><ArrowDownRight size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Despesas Mês</p>
          <p className="text-3xl font-bold text-red-400">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5"></div>)}
        </div>
      ) : (
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Descrição</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium text-right">Valor</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-gray-400 font-mono">
                    {new Date(tx.transaction_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-white font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${tx.type === 'receita' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'receita' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      </div>
                      {tx.description}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    <span className="bg-white/5 px-2.5 py-1 rounded-md text-xs">{tx.category}</span>
                  </td>
                  <td className={`p-4 font-mono font-bold text-right ${tx.type === 'receita' ? 'text-green-400' : 'text-white'}`}>
                    {tx.type === 'despesa' ? '- ' : '+ '}
                    R$ {Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${tx.is_paid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {tx.is_paid ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(tx.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Nenhuma transação registrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Nova Transação</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Tipo</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Data</label>
                  <input type="date" required value={formData.transaction_date} onChange={e => setFormData({ ...formData, transaction_date: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Descrição</label>
                <input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Ex: Compra de ração inicial" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Categoria</label>
                  <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Ex: Ração, Energia..." className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Valor (R$)</label>
                  <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
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

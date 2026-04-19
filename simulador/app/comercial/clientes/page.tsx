"use client";

import { useEffect, useState } from 'react';
import { loadClients, upsertClient, deleteClient } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { Users, Plus, Store, User, Phone, Trash2 } from 'lucide-react';

export default function ComercialClientesPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', type: 'B2B', document: '', phone: '', email: '', 
    address: '', price_table: 20.0
  });

  const fetchData = async () => {
    setIsLoading(true);
    const data = await loadClients(projectId);
    setClients(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = { ...formData, id: crypto.randomUUID() };
    setClients([newClient, ...clients]);
    setIsModalOpen(false);
    
    await upsertClient(projectId, newClient);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este cliente?')) return;
    setClients(clients.filter(c => c.id !== id));
    await deleteClient(id);
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Clientes e CRM</h1>
          <p className="text-gray-400">Gestão da base de compradores (Atacado e Varejo).</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400"><Users size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Total de Clientes</p>
          <p className="text-4xl font-bold text-white">{clients.length}</p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-yellow-400"><Store size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">B2B (Atacado)</p>
          <p className="text-3xl font-bold text-yellow-400">{clients.filter(c => c.type === 'B2B').length}</p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-400"><User size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">B2C (Varejo)</p>
           <p className="text-3xl font-bold text-purple-400">{clients.filter(c => c.type === 'B2C').length}</p>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium">Tipo / Doc</th>
              <th className="p-4 font-medium">Contato</th>
              <th className="p-4 font-medium text-right">Tabela (R$/kg)</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-white font-medium">{client.name}</td>
                <td className="p-4 text-gray-400">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${client.type === 'B2B' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-purple-500/20 text-purple-400'}`}>
                    {client.type}
                  </span>
                  <span className="ml-2 font-mono text-xs">{client.document}</span>
                </td>
                <td className="p-4 text-gray-400 flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" /> {client.phone}
                </td>
                <td className="p-4 text-right font-mono text-cyan-400 font-bold">
                  R$ {Number(client.price_table).toFixed(2)}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(client.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum cliente cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Novo Cliente</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Nome / Razão Social</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Tipo</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="B2B">B2B (Atacado)</option>
                    <option value="B2C">B2C (Varejo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">CPF / CNPJ</label>
                  <input value={formData.document} onChange={e => setFormData({ ...formData, document: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Telefone</label>
                  <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Tabela Precificação (R$/kg)</label>
                  <input type="number" step="0.10" value={formData.price_table} onChange={e => setFormData({ ...formData, price_table: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
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

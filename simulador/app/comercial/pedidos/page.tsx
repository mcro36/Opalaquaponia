"use client";

import { useEffect, useState } from 'react';
import { loadOrders, loadClients, upsertOrder, deleteOrder, loadBatches } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { ShoppingCart, Plus, CheckCircle, Truck, PackageCheck, Trash2 } from 'lucide-react';

export default function ComercialPedidosPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '', batch_id: '',
    quantity_kg: 100, price_per_kg: 20.0,
    status: 'pendente', payment_status: 'pendente',
    delivery_date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [ordersData, clientsData, batchesData] = await Promise.all([
      loadOrders(projectId),
      loadClients(projectId),
      loadBatches(projectId)
    ]);
    setOrders(ordersData);
    setClients(clientsData);
    setBatches(batchesData.filter((b: any) => b.status === 'ativo'));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = { 
      ...formData, 
      id: crypto.randomUUID(),
      total_amount: formData.quantity_kg * formData.price_per_kg,
      order_date: new Date().toISOString()
    };
    setIsModalOpen(false);
    
    await upsertOrder(projectId, newOrder);
    fetchData(); // reload to get relations
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este pedido?')) return;
    setOrders(orders.filter(o => o.id !== id));
    await deleteOrder(id);
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Pedidos de Venda</h1>
          <p className="text-gray-400">Gestão de comercialização e despacho.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Pedido
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium font-mono text-sm uppercase">Em Produção</h3>
            <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg"><PackageCheck size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {orders.filter(o => o.status === 'produzindo').reduce((a,b) => a + Number(b.quantity_kg), 0)} kg
          </p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium font-mono text-sm uppercase">A Entregar</h3>
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Truck size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {orders.filter(o => o.status === 'pendente').reduce((a,b) => a + Number(b.quantity_kg), 0)} kg
          </p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium font-mono text-sm uppercase">Faturamento Projetado</h3>
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><CheckCircle size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            R$ {orders.reduce((a,b) => a + Number(b.total_amount), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Cliente</th>
              <th className="p-4 font-medium">Quantidade</th>
              <th className="p-4 font-medium">Valor Total</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium text-center">Pagamento</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-white font-medium">
                  {order.clients?.name || 'Cliente Deletado'}
                  <div className="text-[10px] text-gray-500 mt-1 uppercase">Entregar em: {new Date(order.delivery_date).toLocaleDateString()}</div>
                </td>
                <td className="p-4 text-gray-400 font-mono">
                  {order.quantity_kg} kg <br/><span className="text-xs">R$ {order.price_per_kg}/kg</span>
                </td>
                <td className="p-4 font-mono font-bold text-cyan-400">
                  R$ {Number(order.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold 
                    ${order.status === 'entregue' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}
                  `}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold 
                    ${order.payment_status === 'pago' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}
                  `}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(order.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Nenhum pedido registrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Novo Pedido</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Cliente</label>
                <select required value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                  <option value="">Selecione um cliente...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Lote (Origem)</label>
                <select value={formData.batch_id} onChange={e => setFormData({ ...formData, batch_id: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                  <option value="">Nenhum específico</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.code} ({b.species})</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Quantidade (kg)</label>
                  <input type="number" step="0.1" required value={formData.quantity_kg} onChange={e => setFormData({ ...formData, quantity_kg: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Preço (R$/kg)</label>
                  <input type="number" step="0.01" required value={formData.price_per_kg} onChange={e => setFormData({ ...formData, price_per_kg: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Data Entrega</label>
                  <input type="date" required value={formData.delivery_date} onChange={e => setFormData({ ...formData, delivery_date: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Status Pagto</label>
                  <select value={formData.payment_status} onChange={e => setFormData({ ...formData, payment_status: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex justify-between items-center text-lg font-bold text-white">
                <span className="text-cyan-400">TOTAL:</span>
                <span>R$ {(formData.quantity_kg * formData.price_per_kg).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all">Criar Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

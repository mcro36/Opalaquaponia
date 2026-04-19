"use client";

import { useEffect, useState } from 'react';
import { loadOrders } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { LayoutDashboard } from 'lucide-react';

export default function ComercialKanbanPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders(projectId).then(setOrders);
  }, [projectId]);

  const columns = [
    { id: 'pendente', title: 'Novos Pedidos', color: 'border-blue-500/30 bg-blue-500/5' },
    { id: 'produzindo', title: 'Em Produção/Despesca', color: 'border-yellow-500/30 bg-yellow-500/5' },
    { id: 'entregue', title: 'Entregues', color: 'border-green-500/30 bg-green-500/5' },
    { id: 'cancelado', title: 'Cancelados', color: 'border-red-500/30 bg-red-500/5' }
  ];

  return (
    <div className="p-8 pb-32 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Resumo Kanban</h1>
          <p className="text-gray-400">Acompanhamento visual de pipeline de vendas.</p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
          <LayoutDashboard size={24} />
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
        {columns.map(col => (
          <div key={col.id} className={`w-80 shrink-0 rounded-2xl border ${col.color} flex flex-col h-full`}>
            <div className="p-4 border-b border-inherit font-bold text-white uppercase text-sm tracking-wider">
              {col.title} <span className="text-gray-500 font-mono ml-2">({orders.filter(o => o.status === col.id).length})</span>
            </div>
            
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {orders.filter(o => o.status === col.id).map(order => (
                <div key={order.id} className="bg-[#121a2f] border border-white/10 rounded-xl p-4 cursor-grab hover:border-cyan-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-white truncate pr-2">
                      {order.clients?.name || 'Cliente...'}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold shrink-0
                      ${order.payment_status === 'pago' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}
                    `}>
                      {order.payment_status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-3">{order.quantity_kg} kg a R$ {order.price_per_kg}</p>
                  
                  <div className="flex justify-between items-center border-t border-white/10 pt-2 text-xs">
                    <span className="font-mono text-cyan-400 font-bold">R$ {Number(order.total_amount).toLocaleString()}</span>
                    <span className="text-gray-500 font-mono">{new Date(order.delivery_date).toLocaleDateString('pt-BR').slice(0,5)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

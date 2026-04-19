"use client";

import { useEffect, useState } from 'react';
import { loadTransactions } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { Clock, CheckCircle } from 'lucide-react';

export default function ContasPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [contas, setContas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const txs = await loadTransactions(projectId);
      // Foca apenas nas que is_paid = false, ou que têm um due_date no futuro.
      // Para simulação, pegaremos todas não pagas.
      setContas(txs.filter((t: any) => t.is_paid === false));
      setIsLoading(false);
    }
    fetch();
  }, [projectId]);

  const aPagar = contas.filter(c => c.type === 'despesa').reduce((a,b) => a + Number(b.amount), 0);
  const aReceber = contas.filter(c => c.type === 'receita').reduce((a,b) => a + Number(b.amount), 0);

  return (
    <div className="p-8 pb-32">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Contas a Pagar & Receber</h1>
          <p className="text-gray-400">Gerencie títulos em aberto.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-red-500/30 rounded-2xl p-6">
          <p className="text-gray-400 uppercase text-xs font-bold mb-2">Total a Pagar</p>
          <p className="text-3xl font-bold text-red-500">R$ {aPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</p>
        </div>
        <div className="bg-[#121a2f] border border-green-500/30 rounded-2xl p-6">
          <p className="text-gray-400 uppercase text-xs font-bold mb-2">Total a Receber</p>
          <p className="text-3xl font-bold text-green-500">R$ {aReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</p>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Vencimento</th>
              <th className="p-4 font-medium">Descrição</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium text-right">Valor</th>
              <th className="p-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {contas.length > 0 ? contas.map(c => (
              <tr key={c.id}>
                <td className="p-4 text-gray-400 font-mono">
                  {new Date(c.transaction_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-white">{c.description}</td>
                <td className="p-4 text-gray-400">{c.type === 'receita' ? 'A Receber' : 'A Pagar'}</td>
                <td className={`p-4 font-mono font-bold text-right ${c.type === 'receita' ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {Number(c.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-center">
                  <span className="text-xs uppercase font-bold text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded-full flex items-center gap-1 w-max mx-auto">
                    <Clock size={12} /> Pendente
                  </span>
                </td>
              </tr>
            )) : (
               <tr>
                 <td colSpan={5} className="p-8 text-center text-gray-500">Todas as contas estão em dia.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

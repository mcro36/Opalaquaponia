"use client";

import { useEffect, useState } from 'react';
import { loadTransactions } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { LineChart, BarChart } from 'lucide-react';

export default function FluxoCaixaPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [fluxo, setFluxo] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const txs = await loadTransactions(projectId);
      
      // Groupping by YYYY-MM
      const monthsMap: Record<string, { rec: number, end: number, desp: number }> = {};
      
      txs.forEach((t: any) => {
        const month = t.transaction_date.substring(0, 7); // YYYY-MM
        if (!monthsMap[month]) monthsMap[month] = { rec: 0, desp: 0, end: 0 };
        
        if (t.type === 'receita') monthsMap[month].rec += Number(t.amount);
        if (t.type === 'despesa') monthsMap[month].desp += Number(t.amount);
      });

      // Sort months and calc balance
      const sortedMonths = Object.keys(monthsMap).sort();
      
      let currentBalance = 0; // Starting at 0 or could fetch initial capital
      const results = sortedMonths.map(m => {
        const data = monthsMap[m];
        const prevBalance = currentBalance;
        currentBalance = prevBalance + data.rec - data.desp;
        
        return {
          month: m,
          receitas: data.rec,
          despesas: data.desp,
          saldoMensal: data.rec - data.desp,
          saldoAcumulado: currentBalance
        };
      });

      setFluxo(results);
    }
    fetch();
  }, [projectId]);

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Fluxo de Caixa Mensal</h1>
          <p className="text-gray-400">Projeção e histórico de entradas e saídas.</p>
        </div>
        <div className="flex gap-2">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
            <LineChart size={24} />
          </div>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Mês</th>
              <th className="p-4 font-medium text-right text-green-400">Entradas (+)</th>
              <th className="p-4 font-medium text-right text-red-400">Saídas (-)</th>
              <th className="p-4 font-medium text-right text-white">Saldo Mensal</th>
              <th className="p-4 font-medium text-right text-cyan-400">Saldo Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {fluxo.map(f => (
              <tr key={f.month} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white font-mono">{f.month}</td>
                <td className="p-4 text-right font-mono text-green-400">
                  R$ {f.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right font-mono text-red-400">
                  R$ {f.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right font-mono font-bold text-white">
                  R$ {f.saldoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right font-mono font-bold text-cyan-400">
                  R$ {f.saldoAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {fluxo.length === 0 && (
              <tr>
                 <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">Sem dados de movimentação.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { CalendarDays, AlertTriangle, Fish, DollarSign } from 'lucide-react';

export default function CalendarioPage() {
  
  // Mock events converging from different ERP modules
  const events = [
    { id: 1, date: '2026-04-19', type: 'operation', title: 'Biometria Lote L2025-01', desc: 'Tanque 1, estimativa 500g', icon: Fish, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 2, date: '2026-04-20', type: 'finance', title: 'Pagamento de Fornecedor', desc: 'Ração AgroMix R$ 4.500', icon: DollarSign, color: 'text-red-400', bg: 'bg-red-500/10' },
    { id: 3, date: '2026-04-22', type: 'compliance', title: 'Renovação Outorga d\'Água', desc: 'Enviar laudo para ANA', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { id: 4, date: '2026-04-25', type: 'operation', title: 'Despesca Prevista', desc: 'Lote L2024-08 (1.200 kg)', icon: Fish, color: 'text-green-400', bg: 'bg-green-500/10' }
  ];

  return (
    <div className="p-8 pb-32">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Calendário Unificado</h1>
          <p className="text-gray-400">Visão integrada das operações, financeiro e obrigações.</p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
           <CalendarDays size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {events.map((ev, idx) => {
          const Icon = ev.icon;
          return (
            <div key={idx} className={`bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-mono text-gray-400 font-bold">
                  {new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()}
                </span>
                <div className={`p-2 rounded-lg ${ev.bg} ${ev.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{ev.title}</h3>
              <p className="text-sm text-gray-500 mt-auto">{ev.desc}</p>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 p-12 text-center border border-dashed border-white/10 rounded-2xl text-gray-500">
          O grid de calendário completo (visão Mês/Semana) em desenvolvimento para a v2.0.
      </div>
    </div>
  );
}

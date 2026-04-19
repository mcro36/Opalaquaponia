"use client";

import { AlertTriangle, TrendingDown, TrendingUp, Activity } from 'lucide-react';

export default function MetasKPIsPage() {
  
  // Real implementation will calculate these from Supabase (batches, biometries, transactions)
  // Mocking for immediate UI presentation
  const kpis = [
    { title: "FCA Realizado Médio", val: 1.35, unit: "", status: "bom", detail: "Abaixo da meta de 1.40" },
    { title: "Mortalidade Geral (Mês)", val: 12.4, unit: "%", status: "atenção", detail: "Aumento nos tanques 2 e 5" },
    { title: "Receita vs Meta", val: 88, unit: "%", status: "bom", detail: "Faltam R$ 12.500 para a meta" },
    { title: "Ocupação de Tanques", val: 85, unit: "%", status: "excelente", detail: "Volume ótimo operando" },
    { title: "GPD Médio (Tilápia)", val: 3.1, unit: "g/dia", status: "excelente", detail: "Crescimento acelerado no L2025" },
    { title: "Despesa / Litro (Água)", val: 0.15, unit: "R$/L", status: "atenção", detail: "Custo de bombeamento subiu" }
  ];

  return (
    <div className="p-8 pb-32">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Painel de KPIs Operacionais</h1>
          <p className="text-gray-400">Indicadores sistêmicos atualizados em tempo real.</p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
           <Activity size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => {
          let borderColors = "border-white/10";
          let textColors = "text-white";
          let bgIcon = "bg-white/5 text-gray-500";
          let Icon = TrendingUp;

          if (kpi.status === 'bom' || kpi.status === 'excelente') {
            borderColors = "border-green-500/30";
            textColors = "text-green-400";
            bgIcon = "bg-green-500/20 text-green-400";
            Icon = TrendingUp;
          } else if (kpi.status === 'atenção') {
            borderColors = "border-yellow-500/30";
            textColors = "text-yellow-400";
            bgIcon = "bg-yellow-500/20 text-yellow-400";
            Icon = AlertTriangle;
          } else if (kpi.status === 'alerta') {
             borderColors = "border-red-500/30";
             textColors = "text-red-400";
             bgIcon = "bg-red-500/20 text-red-500";
             Icon = TrendingDown;
          }

          return (
            <div key={idx} className={`bg-[#121a2f] border ${borderColors} rounded-2xl p-6`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-400 font-medium font-mono text-xs uppercase">{kpi.title}</h3>
                <div className={`p-2 rounded-lg ${bgIcon}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className={`text-4xl font-extrabold ${textColors}`}>{kpi.val}</p>
                <span className="text-gray-500 font-mono">{kpi.unit}</span>
              </div>
              <p className="text-sm text-gray-500">{kpi.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

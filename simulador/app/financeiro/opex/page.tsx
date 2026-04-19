"use client";

import { useProject } from "../../../contexts/ProjectContext";
import EditableTable from "../../../components/EditableTable";
import { Activity, Download, Calendar } from "lucide-react";

export default function OpexPage() {
  const { state, syncDispatch } = useProject();

  const handleUpdate = (item: any) => {
    syncDispatch({ type: 'UPDATE_OPEX', payload: item });
  };

  const handleRemove = (id: string) => {
    syncDispatch({ type: 'REMOVE_OPEX', payload: id });
  };

  const handleAdd = (item: any) => {
    syncDispatch({ type: 'ADD_OPEX', payload: item });
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.opexItems, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `opex_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const categories = Array.from(new Set(state.opexItems.map(item => item.category)));
  const allCategories = Array.from(new Set([...categories, 'Energia Elétrica', 'Ração', 'Mão de Obra', 'Manutenção']));

  const opexColumns = [
    { key: 'name', label: 'Despesa Operacional', type: 'text' as const },
    { key: 'monthlyCost', label: 'Custo Mensal (R$)', type: 'number' as const },
    { key: 'yearlyCostView', label: 'Custo Anual Projetado (R$)', type: 'number' as const },
  ];

  const totalMonthly = state.opexItems.reduce((acc, item) => acc + item.monthlyCost, 0);
  const totalYearly = totalMonthly * 12;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="text-emerald-400" /> OPEX Manager
          </h1>
          <p className="text-gray-400 mt-2">Despesas Operacionais - Controle mensal e projeção anual de gastos fixos e variáveis.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportJSON}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg"
          >
            <Download size={18} /> Exportar JSON
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0a0f1c] border border-emerald-500/30 p-6 rounded-2xl shadow-[0_0_30px_-5px_rgba(52,211,153,0.1)]">
          <div className="flex items-center gap-4 text-emerald-400 font-bold text-xl mb-2">
            <span>OPEX Mensal:</span>
            <span>R$ {totalMonthly.toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-sm text-gray-500">Valor subtraído da Receita Bruta mensal para definir o Lucro no Dashboard Executivo.</p>
          {state.parameters.ownFeedEnabled && (
            <p className="text-xs text-cyan-400 font-bold mt-2">Atenção: Impacto indireto através da regra [Nutrição Própria] reduzindo o custo prático R$/kg.</p>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 text-white font-bold text-xl mb-2">
            <Calendar size={20} className="text-gray-400" />
            <span>OPEX Anual (Projeção Linear):</span>
            <span className="text-emerald-400">R$ {totalYearly.toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-sm text-gray-500">Valor utilizado nos cálculos macro de DRE ano a ano sem contar a sazonalidade elétrica.</p>
        </div>
      </div>

      <div className="space-y-6">
        {allCategories.map(cat => {
          // Injection for display
          const catData = state.opexItems.filter(item => item.category === cat).map(item => ({
            ...item, 
            yearlyCostView: item.monthlyCost * 12 
          }));

          return (
            <EditableTable 
              key={cat}
              categoryName={cat}
              data={catData}
              columns={opexColumns}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onAdd={handleAdd}
              defaultNewItem={{ name: '', monthlyCost: 0 }}
            />
          );
        })}
      </div>
    </div>
  );
}

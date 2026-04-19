"use client";

import { useProject } from "../../../contexts/ProjectContext";
import EditableTable from "../../../components/EditableTable";
import { Wallet, Download, RefreshCw } from "lucide-react";

export default function CapexPage() {
  const { state, syncDispatch } = useProject();

  const handleUpdate = (item: any) => {
    syncDispatch({ type: 'UPDATE_CAPEX', payload: item });
  };

  const handleRemove = (id: string) => {
    syncDispatch({ type: 'REMOVE_CAPEX', payload: id });
  };

  const handleAdd = (item: any) => {
    syncDispatch({ type: 'ADD_CAPEX', payload: item });
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.capexItems, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `capex_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Group by category
  const categories = Array.from(new Set(state.capexItems.map(item => item.category)));
  
  // Need to include empty categories if we want to allow adding to them, but for now we'll dynamically group existing plus common defaults
  const allCategories = Array.from(new Set([...categories, 'Estrutura e Tanques', 'Aeração', 'Filtragem', 'Elétrica e Hidráulica', 'Automação']));

  const capexColumns = [
    { key: 'name', label: 'Item/Equipamento', type: 'text' as const },
    { key: 'cost', label: 'Custo (R$)', type: 'number' as const },
    { key: 'priority', label: 'Prioridade', type: 'priority' as const },
    { key: 'status', label: 'Status', type: 'status' as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Wallet className="text-cyan-400" /> CAPEX Manager
          </h1>
          <p className="text-gray-400 mt-2">Investimentos capitais (Infraestrutura e Equipamentos) - Controle granular e priorização de compras.</p>
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

      <div className="bg-[#0a0f1c] border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_30px_-5px_rgba(34,211,238,0.1)]">
        <div className="flex items-center gap-4 text-cyan-400 font-bold text-xl mb-2">
          <span>CAPEX Total Estimado/Gasto:</span>
          <span>R$ {state.capexItems.reduce((acc, item) => acc + item.cost, 0).toLocaleString('pt-BR')}</span>
        </div>
        <p className="text-sm text-gray-500">Valor vinculado diretamente ao cálculo de Payback e ROI no Dashboard Executivo.</p>
      </div>

      <div className="space-y-6">
        {allCategories.map(cat => {
          const catData = state.capexItems.filter(item => item.category === cat).map(item => ({...item, priority: item.priority || 'Média'}));
          return (
            <EditableTable 
              key={cat}
              categoryName={cat}
              data={catData}
              columns={capexColumns}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onAdd={handleAdd}
              defaultNewItem={{ name: '', cost: 0, status: 'Planejado', priority: 'Média' }}
            />
          );
        })}
      </div>
    </div>
  );
}

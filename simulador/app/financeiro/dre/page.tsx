"use client";

import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { loadTransactions } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { FileText } from 'lucide-react';

export default function DrePage() {
  const { state } = useProject();
  const projectId = DEFAULT_PROJECT_ID;
  const [dataReady, setDataReady] = useState(false);
  
  const [dre, setDre] = useState({
    receitaBruta: 0,
    deducoes: 0,
    receitaLiquida: 0,
    cmv: 0,
    lucroBruto: 0,
    despesasOp: 0,
    ebitda: 0,
    depreciacao: 0,
    ebit: 0,
    resultFin: 0,
    lai: 0,
    impostos: 0,
    lucroLiquido: 0,
  });

  useEffect(() => {
    async function computeDRE() {
      if (!projectId) return;
      const txs = await loadTransactions(projectId);

      const receitas = txs.filter((t: any) => t.type === 'receita').reduce((a,b:any) => a + Number(b.amount), 0);
      const despesas = txs.filter((t: any) => t.type === 'despesa').reduce((a,b:any) => a + Number(b.amount), 0);

      // Simulação de alocação de categorias para estruturar uma DRE base:
      const receitaBruta = receitas;
      const deducoes = receitas * 0.05; // 5% de impostos sobre venda aprox
      const receitaLiquida = receitaBruta - deducoes;
      const cmv = despesas * 0.6; // Custos variáveis de produção (Ração, Alevino)
      const lucroBruto = receitaLiquida - cmv;
      
      const despesasOp = despesas * 0.3; // Mão de obra, administrativo
      const ebitda = lucroBruto - despesasOp;
      
      const depreciacao = 500; // Mock Depreciação de Equipamentos
      const ebit = ebitda - depreciacao;
      
      const resultFin = -(despesas * 0.1); // Despesas financeiras (taxas de banco, juros)
      const lai = ebit + resultFin;
      
      const impostos = lai > 0 ? lai * 0.15 : 0; // IRPJ/CSLL base
      const lucroLiquido = lai - impostos;

      setDre({
        receitaBruta, deducoes, receitaLiquida, cmv, lucroBruto,
        despesasOp, ebitda, depreciacao, ebit, resultFin, lai, impostos, lucroLiquido
      });
      setDataReady(true);
    }
    computeDRE();
  }, [projectId]);

  const DRELine = ({ label, value, bold = false, indent = false, isTotal = false }: any) => (
    <div className={`flex justify-between py-3 border-b border-white/5 ${bold ? 'font-bold text-white' : 'text-gray-400'} ${indent ? 'pl-8' : ''} ${isTotal ? 'bg-white/5 text-cyan-400 px-4 mt-2 rounded-lg border-none' : ''}`}>
      <span>{label}</span>
      <span className="font-mono">
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );

  if (!dataReady) return <div className="p-8 pb-32 animate-pulse"><div className="h-96 bg-white/5 rounded-2xl w-full"></div></div>;

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">DRE - Demonstração do Resultado</h1>
          <p className="text-gray-400">Consolidação de lucros e perdas no período.</p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
          <FileText size={24} />
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto shadow-xl">
        <h2 className="text-center font-mono text-gray-500 uppercase tracking-widest text-xs mb-8">Exercício em Curso</h2>
        
        <div className="space-y-1 text-sm">
          <DRELine label="Receita Bruta de Vendas" value={dre.receitaBruta} bold />
          <DRELine label="(-) Deduções sobre Vendas" value={-dre.deducoes} indent />
          <DRELine label="(=) RECEITA LÍQUIDA" value={dre.receitaLiquida} isTotal />
          
          <DRELine label="(-) Custo dos Produtos Vendidos (CMV)" value={-dre.cmv} indent />
          <DRELine label="(=) LUCRO BRUTO" value={dre.lucroBruto} isTotal />
          
          <DRELine label="(-) Despesas Operacionais (Administração, SG&A)" value={-dre.despesasOp} indent />
          <DRELine label="(=) EBITDA / LAJIDA" value={dre.ebitda} isTotal />
          
          <DRELine label="(-) Depreciação e Amortização" value={-dre.depreciacao} indent />
          <DRELine label="(=) EBIT / LAJIR" value={dre.ebit} isTotal />
          
          <DRELine label="(+/-) Resultado Financeiro" value={dre.resultFin} indent />
          <DRELine label="(=) LAI (Lucro Antes dos Impostos)" value={dre.lai} isTotal />
          
          <DRELine label="(-) Provisão IRPJ e CSLL" value={-dre.impostos} indent />
          <div className="mt-6 p-4 bg-cyan-500/20 border border-cyan-500/50 rounded-xl flex justify-between items-center text-xl font-bold text-white shadow-[0_0_15px_-3px_rgba(34,211,238,0.2)]">
            <span>(=) RESULTADO LÍQUIDO DO EXERCÍCIO</span>
            <span>R$ {dre.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

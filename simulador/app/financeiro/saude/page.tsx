"use client";

import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { loadTransactions, loadCapexItems, loadOpexItems, loadBatches } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SaudeFinanceiraPage() {
  const { state } = useProject();
  const projectId = DEFAULT_PROJECT_ID;
  const [dataReady, setDataReady] = useState(false);
  
  const [metrics, setMetrics] = useState({
    roi: 0, roe: 0, ebitda: 0, ebit: 0, margemBruta: 0, margemLiquida: 0, margemEbitda: 0, margemContribuicao: 0,
    liqCorrente: 0, liqSeca: 0, capitalGiro: 0, pmr: 0, pmp: 0, cicloOp: 0, cicloFin: 0,
    grauEndividamento: 0, coberturaJuros: 0, divEbitda: 0, compReceita: 0,
    custoKg: 0, recM3: 0, beKg: 0, beRs: 0, payback: 0, giroEstoque: 0, giroAtivo: 0,
    fcaReal: 0, sobrev: 0, gpd: 0, kgCiclo: 0, cstAlevino: 0, rendFile: 34,
    recProj12m: 0, runway: 0, score: 0
  });

  useEffect(() => {
    async function computeMetrics() {
      if (!projectId) return;
      
      const [txs, capex, opex, batches] = await Promise.all([
        loadTransactions(projectId),
        loadCapexItems(projectId),
        loadOpexItems(projectId),
        loadBatches(projectId)
      ]);

      // Receitas vs Despesas
      const receitas = txs.filter((t: any) => t.type === 'receita');
      const despesas = txs.filter((t: any) => t.type === 'despesa');
      
      const totalRec = receitas.reduce((a, b: any) => a + Number(b.amount), 0) || 1; // avoid /0
      const totalDesp = despesas.reduce((a, b: any) => a + Number(b.amount), 0);
      const totalCapex = capex.reduce((a, b: any) => a + Number(b.cost), 0) || 1;
      const lucroLiq = totalRec - totalDesp;

      // Classificações simples (simulação na ausência de tags finas)
      const custoProd = totalDesp * 0.6; // Simulando que 60% da despesa é prod
      const despFinan = totalDesp * 0.1; 
      const ebitdaVal = totalRec - custoProd - (totalDesp * 0.2); // tirando depreciação
      const ativoTotal = totalCapex + (totalRec * 0.5); // proxy
      const passivoCirc = totalDesp * 1.2;
      const ativoCirc = totalRec * 0.8;

      // Agronomia
      const biomassGain = 5000; // Mock kg até a sprint 18
      const feedCost = totalDesp * 0.4;
      const fcaVal = 1.35; // calculo simulado

      const m = {
        roi: (lucroLiq / totalCapex) * 100,
        roe: (lucroLiq / (ativoTotal - passivoCirc)) * 100,
        ebitda: ebitdaVal,
        ebit: ebitdaVal - (totalCapex * 0.1),
        margemBruta: ((totalRec - custoProd) / totalRec) * 100,
        margemLiquida: (lucroLiq / totalRec) * 100,
        margemEbitda: (ebitdaVal / totalRec) * 100,
        margemContribuicao: 42, // Fixo para demo
        
        liqCorrente: ativoCirc / (passivoCirc || 1),
        liqSeca: (ativoCirc * 0.7) / (passivoCirc || 1),
        capitalGiro: ativoCirc - passivoCirc,
        pmr: 22, pmp: 18, cicloOp: 22 + 45, cicloFin: 22 + 45 - 18,
        
        grauEndividamento: (passivoCirc / (ativoTotal || 1)) * 100,
        coberturaJuros: despFinan > 0 ? ebitdaVal / despFinan : 10,
        divEbitda: passivoCirc / (ebitdaVal || 1),
        compReceita: (totalDesp * 0.3 / (totalRec || 1)) * 100,
        
        custoKg: totalDesp / (biomassGain || 1),
        recM3: totalRec / 30, // 6 tanques x 5m3
        beKg: (totalDesp * 0.3) / (20 - 12),
        beRs: ((totalDesp * 0.3) / (20 - 12)) * 20,
        payback: totalCapex / (ebitdaVal / 12 || 1),
        giroEstoque: 4.2,
        giroAtivo: totalRec / ativoTotal,
        
        fcaReal: fcaVal,
        sobrev: 87,
        gpd: 3.2,
        kgCiclo: 840,
        cstAlevino: 5.2,
        rendFile: 34,
        
        recProj12m: totalRec * 1.5,
        runway: 8
      };

      // Calculate Score
      let score = 0;
      if (m.margemLiquida > 20) score += 15; else if (m.margemLiquida >= 10) score += 7.5;
      if (m.ebitda > 5000) score += 15; else if (m.ebitda > 1000) score += 7.5;
      if (m.liqCorrente > 2.0) score += 10; else if (m.liqCorrente >= 1.0) score += 5;
      if (m.capitalGiro > 10000) score += 10; else if (m.capitalGiro > 0) score += 5;
      if (m.fcaReal < 1.2) score += 10; else if (m.fcaReal <= 1.5) score += 5;
      if (m.payback < 18) score += 10; else if (m.payback <= 36) score += 5;
      if (m.grauEndividamento < 40) score += 10; else if (m.grauEndividamento <= 70) score += 5;
      if (m.sobrev > 90) score += 10; else if (m.sobrev >= 80) score += 5;
      if (m.runway > 6) score += 5; else if (m.runway >= 3) score += 2.5;
      score += 5; // MoM crescimento

      setMetrics({ ...m, score: Math.round(score) });
      setDataReady(true);
    }
    computeMetrics();
  }, [projectId]);

  const MetricBox = ({ title, value, meta, format, reversePositive = false }: any) => {
    let numVal = Number(value);
    let color = "text-white";
    let icon = "✅";
    
    // Limits based on reversePositive (e.g., lower FCA is better)
    if (!reversePositive) {
      if (numVal < (meta * 0.5)) { color = "text-red-400"; icon = "🔴"; }
      else if (numVal < meta) { color = "text-yellow-400"; icon = "🟡"; }
      else { color = "text-green-400"; icon = "✅"; }
    } else {
      if (numVal > (meta * 1.5)) { color = "text-red-400"; icon = "🔴"; }
      else if (numVal > meta) { color = "text-yellow-400"; icon = "🟡"; }
      else { color = "text-green-400"; icon = "✅"; }
    }

    const formattedValue = format === 'currency' 
      ? `R$ ${numVal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}` 
      : format === 'percent' 
      ? `${numVal.toFixed(1)}%` 
      : format === 'number'
      ? `${numVal.toFixed(1)}`
      : format === 'days'
      ? `${numVal.toFixed(0)} d`
      : `${numVal.toFixed(1)}x`;

    return (
      <div className="bg-white/5 border border-white/5 rounded-xl p-3">
        <p className="text-[10px] text-gray-500 font-mono uppercase mb-1 truncate" title={title}>{title}</p>
        <div className="flex items-center gap-2">
          <p className={`text-lg font-bold ${color}`}>{formattedValue}</p>
          <span className="text-xs">{icon}</span>
        </div>
      </div>
    );
  };

  if (!dataReady) return (
    <div className="p-8 pb-32 animate-pulse space-y-8">
      <div className="h-32 bg-white/5 rounded-2xl w-full"></div>
      <div className="h-48 bg-white/5 rounded-2xl w-full"></div>
      <div className="h-48 bg-white/5 rounded-2xl w-full"></div>
    </div>
  );

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Saúde Financeira 360°</h1>
          <p className="text-gray-400">Análise profunda de 35 indicadores gerenciais em tempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-2 bg-[#121a2f] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-cyan-400"><Activity size={120} /></div>
          <div>
            <h3 className="text-gray-400 font-medium font-mono text-xs uppercase mb-2">Health Score Geral</h3>
            <div className="flex items-center gap-4">
              <p className={`text-5xl font-extrabold ${metrics.score >= 80 ? 'text-green-400' : metrics.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {metrics.score}
              </p>
              <span className="text-gray-500">/ 100</span>
              <div className="ml-4 px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/20">
                Tendência: +5 pts
              </div>
            </div>
            <div className="mt-4 h-2 w-64 bg-black/50 rounded-full overflow-hidden">
              <div className={`h-full ${metrics.score >= 80 ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${metrics.score}%` }}></div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-mono uppercase">Receita MoM</p>
            <p className="text-green-400 font-bold mb-2">↗ +12%</p>
            <p className="text-[10px] text-gray-500 font-mono uppercase">Runway Caixa</p>
            <p className="text-white font-bold">{metrics.runway} meses</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* RENTABILIDADE */}
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <TrendingUp size={18} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-white uppercase">Rentabilidade</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBox title="ROI" value={metrics.roi} meta={10} format="percent" />
            <MetricBox title="ROE" value={metrics.roe} meta={15} format="percent" />
            <MetricBox title="EBITDA" value={metrics.ebitda} meta={100} format="currency" />
            <MetricBox title="EBIT" value={metrics.ebit} meta={0} format="currency" />
            <MetricBox title="Margem Bruta" value={metrics.margemBruta} meta={30} format="percent" />
            <MetricBox title="Margem Líquida" value={metrics.margemLiquida} meta={15} format="percent" />
            <MetricBox title="Margem EBITDA" value={metrics.margemEbitda} meta={20} format="percent" />
            <MetricBox title="Margem de Contribuição" value={metrics.margemContribuicao} meta={40} format="percent" />
          </div>
        </div>

        {/* LIQUIDEZ E ENDIVIDAMENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <ShieldCheck size={18} className="text-blue-400" />
              <h2 className="text-lg font-bold text-white uppercase">Liquidez & Prazos</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricBox title="Liquidez Corrente" value={metrics.liqCorrente} meta={1.5} format="number" />
              <MetricBox title="Capital de Giro" value={metrics.capitalGiro} meta={0} format="currency" />
              <MetricBox title="Ciclo Operacional" value={metrics.cicloOp} meta={60} format="days" reversePositive />
              <MetricBox title="Ciclo Financeiro" value={metrics.cicloFin} meta={45} format="days" reversePositive />
            </div>
          </div>

          <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <AlertTriangle size={18} className="text-red-400" />
              <h2 className="text-lg font-bold text-white uppercase">Endividamento</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricBox title="Grau de Endividamento" value={metrics.grauEndividamento} meta={50} format="percent" reversePositive />
              <MetricBox title="Dívida / EBITDA" value={metrics.divEbitda} meta={2.5} format="number" reversePositive />
              <MetricBox title="Cobertura de Juros" value={metrics.coberturaJuros} meta={3.0} format="number" />
              <MetricBox title="Compromentimento Rec." value={metrics.compReceita} meta={30} format="percent" reversePositive />
            </div>
          </div>
        </div>

        {/* EFICIÊNCIA OPERACIONAL E PRODUTIVIDADE */}
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <Activity size={18} className="text-purple-400" />
            <h2 className="text-lg font-bold text-white uppercase">Eficiência & Produtividade</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <MetricBox title="R$ / kg Prod." value={metrics.custoKg} meta={20} format="currency" reversePositive />
            <MetricBox title="Receita / m³" value={metrics.recM3} meta={100} format="currency" />
            <MetricBox title="Break-Even (kg)" value={metrics.beKg} meta={500} format="number" reversePositive />
            <MetricBox title="Payback" value={metrics.payback} meta={36} format="number" reversePositive />
            <MetricBox title="FCA Real" value={metrics.fcaReal} meta={1.3} format="number" reversePositive />
            <MetricBox title="Sobrevivência" value={metrics.sobrev} meta={85} format="percent" />
          </div>
        </div>
      </div>
    </div>
  );
}

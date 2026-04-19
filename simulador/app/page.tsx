"use client";

import { useProject } from "../contexts/ProjectContext";
import KpiCard from "../components/KpiCard";
import CapexChart from "../components/CapexChart";
import OpexChart from "../components/OpexChart";
import MiniRoadmap from "../components/MiniRoadmap";
import { Wallet, LineChart, Activity, DollarSign, TrendingUp, AlertTriangle, Fish, Calendar, Users } from 'lucide-react';
import { calcDiasAteDespesca, calcAlevinosNecessarios, calcLucroLiquidoMensal, calcFCAPonderado } from "../lib/calculationEngine";

export default function Dashboard() {
  const { state, syncDispatch } = useProject();

  // Ensure arrays exist for calculation extraction
  const capexItems = state.capexItems || [];
  const opexItems = state.opexItems || [];
  
  // Base Calculations
  const capexTotal = capexItems.reduce((acc, item) => acc + item.cost, 0);
  const opexMensal = opexItems.reduce((acc, item) => acc + item.monthlyCost, 0);
  
  // Real calculation from rules
  const volumeTotal = 30; // 6 tanques de 5000L
  const targetDensity = state.parameters.targetDensity || 35;
  const biomassaTeorica = volumeTotal * targetDensity; // 30 * 35 = 1050 kg
  
  const mortalities = state.parameters.mortalityByPhase || [
    { phase: "transporte", rate: 5 },
    { phase: "alevinagem", rate: 10 },
    { phase: "recria", rate: 4 },
    { phase: "engorda", rate: 2 }
  ];
  
  // Combined survival rate
  const survivalRate = mortalities.reduce((acc: number, phase: any) => acc * (1 - (phase.rate / 100)), 1);
  const biomassaReal = biomassaTeorica * survivalRate;
  
  const isClimaOn = state.parameters.climateControlEnabled || false;
  const targetWeight = state.parameters.targetWeight || 800; // grams
  const linhagem = state.parameters.linhagem || 'gift';
  const targetTemp = state.parameters.targetTemperature || 28;
  const scenario = state.parameters.scenario || 'realista';
  const isOwnFeed = state.parameters.ownFeedEnabled || false;
  
  // New Engine Calculations
  const diasAteDespesca = calcDiasAteDespesca(targetWeight, 1, isClimaOn, linhagem, targetTemp);
  const alevinosNecessarios = calcAlevinosNecessarios(biomassaTeorica, targetWeight, mortalities);
  const fcaPonderado = calcFCAPonderado(isOwnFeed, scenario, isClimaOn);
  
  const precoKgFile = state.parameters.pricePerKg || 50;
  const rendimentoFile = 0.33; 
  
  // Monthly yield assuming cyclical harvests
  const fileMensal = (biomassaReal / 6) * rendimentoFile; 
  const receitaMensal = fileMensal * precoKgFile;
  
  // Global Profit Engine calculation
  let { lucro: lucroLiquido } = calcLucroLiquidoMensal(receitaMensal, opexMensal, capexTotal);
  
  // Apply Climate Rule logic (block profits if NO climate control in winter)
  const isLethalRisk = !isClimaOn;
  if(isLethalRisk) {
    // Overriding profit as invalid (inviable system in BH)
    lucroLiquido = -opexMensal;
  }

  const paybackMeses = lucroLiquido > 0 ? (capexTotal / lucroLiquido).toFixed(1) : '∞';
  const roiAnual = capexTotal > 0 ? ((lucroLiquido * 12) / capexTotal * 100).toFixed(1) : '0';

  // Chart Data
  const capexByCategory = capexItems.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.cost;
    return acc;
  }, {});
  const capexChartData = Object.keys(capexByCategory).map(key => ({
    name: key,
    value: capexByCategory[key]
  }));

  const opexByCategory = opexItems.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.monthlyCost;
    return acc;
  }, {});
  const opexChartData = Object.keys(opexByCategory).map(key => ({
    name: key,
    value: opexByCategory[key]
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-400 mt-2">Visão geral do sistema super-intensivo e indicadores de performance para BH/MG.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Cenários Selector */}
          <div className="bg-[#151b2b] border border-white/10 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-400">CENÁRIO:</span>
            <select 
              value={scenario}
              onChange={(e) => syncDispatch({ type: 'UPDATE_PARAM', payload: { key: 'scenario', value: e.target.value }})}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="otimista" className="bg-[#0a0f1c]">Otimista (FCA 1.0)</option>
              <option value="realista" className="bg-[#0a0f1c]">Realista (FCA 1.2)</option>
              <option value="pessimista" className="bg-[#0a0f1c]">Pessimista (FCA 1.5)</option>
            </select>
          </div>
          
          <div className="bg-[#151b2b] border border-cyan-500/30 px-5 py-2.5 rounded-xl shadow-[0_0_20px_-5px_rgba(34,211,238,0.15)] flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-400">FASE ATUAL:</span>
            <span className="text-cyan-400 font-bold uppercase tracking-widest">{state.phase}</span>
          </div>
        </div>
      </header>

      {/* RISCOS & ALERTAS QUICK VIEW */}
      {isLethalRisk && (
        <div className="bg-orange-500/10 border-l-4 border-l-orange-500 border-y border-r border-y-orange-500/20 border-r-orange-500/20 rounded-r-xl p-5 flex items-center gap-5 shadow-lg">
          <div className="bg-orange-500/20 p-3 rounded-full">
            <AlertTriangle className="text-orange-400" size={24} />
          </div>
          <div>
            <h4 className="text-orange-400 font-bold text-lg">ALERTA TÉRMICO CRÍTICO (Região Cwb)</h4>
            <p className="text-sm text-orange-200/80 mt-1">
              Climatização desativada. Risco letal de perda de biomassa nos meses de inverno (Jun-Ago). O payback foi recalculado e o sistema atual é considerado <span className="font-bold text-white bg-orange-500/50 px-1 rounded">INVIÁVEL</span> sem bomba de calor.
            </p>
          </div>
        </div>
      )}

      {/* BIOLOGICAL KPIs GRID (New in Sprint 9) */}
      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-8">
        <Fish className="text-cyan-400" size={24} /> Desempenho Biológico
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard 
          title="Biomassa Teórica Atual" 
          value={`${biomassaTeorica} kg`} 
          subtitle={`Volume total: ${volumeTotal}m³`}
          icon={<Fish size={20} />} 
          trend={{ value: `Densidade ${targetDensity}kg/m³`, positive: true }}
        />
        <KpiCard 
          title="Tempo até Despesca (800g)" 
          value={diasAteDespesca > 700 ? 'Paralisado' : `${diasAteDespesca} dias`} 
          subtitle="Baseado na temp. da água"
          icon={<Calendar size={20} />} 
          highlight={diasAteDespesca <= 180}
          trend={diasAteDespesca > 700 ? { value: 'Inverno Crítico', positive: false } : { value: 'Curva Dias-Grau', positive: true }}
        />
        <KpiCard 
          title="Alevinos Necessários" 
          value={alevinosNecessarios.toLocaleString('pt-BR')} 
          subtitle="Considerando mortalidade"
          icon={<Users size={20} />} 
          trend={{ value: `Linhagem ${linhagem.toUpperCase()}`, positive: true }}
        />
      </div>

      {/* FINANCIAL KPIs GRID */}
      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-8">
        <Wallet className="text-emerald-400" size={24} /> Performance Financeira
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard 
          title="CAPEX Investido" 
          value={`R$ ${(capexTotal/1000).toFixed(1)}k`} 
          subtitle="Total em infra e eqpts"
          icon={<Wallet size={20} />} 
        />
        <KpiCard 
          title="OPEX Mensal" 
          value={`R$ ${opexMensal.toLocaleString('pt-BR')}`} 
          subtitle="Custo de operação (mês)"
          icon={<Activity size={20} />} 
        />
        <KpiCard 
          title="Lucro Líquido (Est)" 
          value={`R$ ${Math.round(lucroLiquido).toLocaleString('pt-BR')}`} 
          subtitle="Projeção Mensal"
          icon={<DollarSign size={20} />} 
          highlight={lucroLiquido > 0}
          trend={lucroLiquido > 0 ? { value: 'Lucro', positive: true } : { value: 'Déficit', positive: false }}
        />
        <KpiCard 
          title="Payback" 
          value={`${paybackMeses} meses`} 
          subtitle={`ROI Anual: ${roiAnual}%`}
          icon={<LineChart size={20} />} 
          trend={{ value: `FCA Médio ${fcaPonderado}`, positive: fcaPonderado < 1.3 }}
        />
      </div>

      {/* CHARTS & ROADMAP SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp size={20} className="text-cyan-400"/> CAPEX por Categoria</h3>
          </div>
          <CapexChart data={capexChartData} />
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Distribuição Operacional</h3>
          <OpexChart data={opexChartData} />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-lg overflow-x-auto">
        <h3 className="text-lg font-bold text-white mb-8">Roadmap de Escalabilidade e Investimento Inteligente</h3>
        <MiniRoadmap currentPhase={state.phase} />
      </div>
      
    </div>
  );
}

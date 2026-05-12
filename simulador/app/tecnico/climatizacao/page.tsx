"use client";

import { useProject } from "../../../contexts/ProjectContext";
import * as CONST from "../../../data/constants";
import { calcHeatPumpCost } from "../../../lib/calculationEngine";
import { Thermometer, Snowflake, Sun, Droplets, Zap } from 'lucide-react';
import CapexChart from "../../../components/CapexChart"; // Reusing for simplicity

export default function ClimatizacaoPage() {
  const { state } = useProject();
  const isClimaOn = state.parameters.climateControlEnabled || false;

  const chartData = CONST.BH_CLIMATE.map(c => ({
    name: c.label,
    custo: Math.round(calcHeatPumpCost(c.month)),
    temp: c.avgTemp
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Climatização Sazonal</h1>
        <p className="text-gray-400 mt-2">Análise de eficiência térmica e custo da Bomba de Calor em BH.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-yellow-400"/> Custo Mensal da Bomba de Calor (R$)
          </h3>
          <div className="h-[300px] w-full">
            <CapexChart data={chartData.map(d => ({ name: d.name, value: d.custo }))} />
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            * Baseado na tarifa de R$ {CONST.CEMIG_TARIFF_KWH}/kWh e manutenção de 28°C constante.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Thermometer size={20} className="text-cyan-400"/> Status Térmico
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Temperatura Alvo</span>
              <span className="text-xl font-bold text-white">{CONST.TARGET_WATER_TEMP}°C</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400">Sistema Ativo</span>
              <span className={`text-sm font-bold px-2 py-1 rounded ${isClimaOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {isClimaOn ? 'OPERACIONAL' : 'DESATIVADO'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3">
                <Snowflake size={18} className="text-blue-400" />
                <div>
                  <div className="text-xs text-gray-500">Mês mais caro (Jul)</div>
                  <div className="text-sm font-bold text-white">R$ {calcHeatPumpCost(7).toFixed(0)}</div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3">
                <Sun size={18} className="text-orange-400" />
                <div>
                  <div className="text-xs text-gray-500">Mês mais barato (Fev)</div>
                  <div className="text-sm font-bold text-white">R$ {calcHeatPumpCost(2).toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
            <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-2"><Droplets size={16}/> Eficiência Térmica</h4>
            <ul className="text-xs text-cyan-200/60 space-y-2">
              <li>• Isolamento Lã de Rocha: -75% perda lateral.</li>
              <li>• Bolas Flutuantes: -85% perda por evaporação.</li>
              <li>• COP da Bomba: 5.0 (gera 5kW térmicos por 1kW elétrico).</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-6">Tabela Sazonal Completa</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b border-white/10">
              <tr>
                <th className="pb-3 font-medium">Mês</th>
                <th className="pb-3 font-medium">Temp. Média BH</th>
                <th className="pb-3 font-medium">ΔT (Alvo 28°C)</th>
                <th className="pb-3 font-medium">Custo Estimado (R$)</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {CONST.BH_CLIMATE.map((c) => (
                <tr key={c.month} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 font-bold text-white">{c.label}</td>
                  <td className="py-3">{c.avgTemp}°C</td>
                  <td className="py-3 text-cyan-400">+{Math.max(0, 28 - c.avgTemp).toFixed(1)}°C</td>
                  <td className="py-3 font-mono">R$ {calcHeatPumpCost(c.month).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

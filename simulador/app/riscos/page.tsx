"use client";

import { useProject } from "../../contexts/ProjectContext";
import RiskCard from "../../components/RiskCard";
import { Shield, Droplet, Beaker } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

export default function RiscosPage() {
  const { state } = useProject();
  
  // BFT State
  const [racaoDiaKg, setRacaoDiaKg] = useState<number>(10); // 10kg/dia default
  
  // Active risk checks based on context
  const targetTemp = state.parameters.targetTemperature || 28;
  const isClimateActive = state.parameters.climateControlEnabled;
  const isLethalRiskActive = !isClimateActive; 
  const isStressRiskActive = isClimateActive && (targetTemp > 31 || targetTemp < 24);

  // Check if there are connected sensors to auto-mitigate risks
  const hasAmoniaSensor = state.capexItems.some(i => i.name.toLowerCase().includes('amônia'));
  const hasODOptico = state.capexItems.some(i => i.name.toLowerCase().includes('od') || i.name.toLowerCase().includes('oxigênio'));
  const hasGerador = state.capexItems.some(i => i.name.toLowerCase().includes('gerador') || i.name.toLowerCase().includes('nobreak'));

  // Calculate Risk Score
  let score = 100;
  if(isLethalRiskActive) score -= 40;
  if(!hasGerador) score -= 20;
  if(!hasAmoniaSensor) score -= 15;
  if(!hasODOptico) score -= 15;
  if(isStressRiskActive) score -= 10;
  
  score = Math.max(0, score); // cap at 0

  const gaugeData = [
    { name: "Segurança", value: score, color: score > 75 ? "#34d399" : score > 50 ? "#fbbf24" : "#ef4444" },
    { name: "Risco Absorvido", value: 100 - score, color: "#1e293b" }
  ];

  // BFT Calculation (Regra 17: Carbon source addition)
  // For each 1kg of feed (35% protein), ~300g of carbon is required to maintain C:N ratio 15:1.
  // Molasses has approx 40-50% carbon. So we need ~600g of Molasses per Kg of feed.
  const proteinaRacao = 0.35;
  const nitrogenioFeed = proteinaRacao * 0.16; // 16% of protein is Nitrogen
  const melacoNecessarioKg = (racaoDiaKg * nitrogenioFeed * 15 * 2).toFixed(2); // Simplified formula for UI

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Shield className="text-red-400" /> Matriz de Riscos & Sanidade
        </h1>
        <p className="text-gray-400 mt-2">Monitoramento de vulnerabilidades do sistema, alertas de mortandade e protocolos de qualidade d'água.</p>
      </header>

      {/* RISK GAUGE */}
      <div className="bg-[#0a0f1c] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Score de Biossegurança</h3>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            Seu score atual reflete os investimentos já realizados no CAPEX e os parâmetros globais setados. 
            Scores abaixo de <span className="font-bold text-red-400">50</span> representam perda eminente de todo o investimento em Belo Horizonte devido ao clima e densidade agressiva.
          </p>
          <div className="flex gap-4 pt-2">
            {!hasGerador && <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">Falta Gerador (-20pts)</span>}
            {!hasODOptico && <span className="text-xs bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">Sem OD Contínuo (-15pts)</span>}
          </div>
        </div>
        
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%" cy="50%"
                innerRadius={65} outerRadius={80}
                startAngle={180} endAngle={0}
                dataKey="value"
                stroke="none"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
            <span className="text-4xl font-black text-white">{score}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">/ 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <RiskCard 
          title="Choque Térmico (BH)"
          severity="Crítico"
          description="Queda rápida abaixo de 18°C. Causa parada imune imediata."
          mitigation={isClimateActive ? "✓ Climatizado." : "Instalar Aquecimento."}
          isActive={isLethalRiskActive}
        />
        <RiskCard 
          title="Anoxia Sistêmica"
          severity="Crítico"
          description="Oxigênio em densidade 35kg/m³ zera em 30 min sem grade."
          mitigation={hasGerador ? "✓ Gerador Ativo." : "Comprar Grupo Gerador 15kVA."}
          isActive={!hasGerador}
        />
        <RiskCard 
          title="Pico Toxidade (NH3)"
          severity="Alto"
          description="Frações letais de NH3 disparam com picos invisíveis de pH."
          mitigation={hasAmoniaSensor ? "✓ Monitorado." : "Instalar Sensor NH3."}
          isActive={!hasAmoniaSensor}
        />
        <RiskCard 
          title="Aeromonas (Queda Temp)"
          severity="Alto"
          description="Bactérias oportunistas atacam com variações de >3°C/dia."
          mitigation={!isClimateActive ? "Alerta Dinâmico: Variação Térmica Alta!" : "Bom controle térmico."}
          isActive={!isClimateActive}
        />
        <RiskCard 
          title="Streptococcus iniae"
          severity="Médio"
          description="Bactérias termofílicas se multiplicam rápido em águas quentes."
          mitigation={targetTemp > 31 ? "Alerta: Reduzir alvo Temp!" : "Manter água < 30°C."}
          isActive={targetTemp > 31}
        />
        <RiskCard 
          title="Flavobacterium Columnare"
          severity="Médio"
          description="Lesseões de brânquias ativadas por alto nível de nitrito e SST."
          mitigation="Check periódico de decantadores."
        />
        <RiskCard 
          title="Ictio (Doença Mancha Branca)"
          severity="Baixo"
          description="Raro em estufas, acionado por stress imune via frio crônico."
          mitigation={isClimateActive ? "Sem risco." : "Aquecer água e usar sal."}
          isActive={isLethalRiskActive}
        />
        <RiskCard 
          title="Excesso Sólidos Suspensos"
          severity="Baixo"
          description="SST > 800mg/L obstruindo brânquias no sistema BFT."
          mitigation="Drenos (sludge) regulares 3x semana."
        />
      </div>

      {/* GESTÃO DE BIOFLOCO (BFT) */}
      <div className="bg-[#151b2b] border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_20px_-5px_rgba(34,211,238,0.1)] mt-8 flex flex-col xl:flex-row gap-8 items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2"><Beaker className="text-cyan-400" size={24}/> Gestão de Biofloco (C:N Ratio)</h3>
          <p className="text-sm text-gray-400 mb-6">Em sistemas super-intensivos sem trocas de água, as bactérias heterotróficas precisam de Carbono Suplementar para assimilar a Amônia tóxica gerada pela ração. Calcule o input diário.</p>
          
          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">Ração Fornecida Diariamente (kg/dia)</label>
              <input 
                type="number" 
                value={racaoDiaKg} 
                onChange={e => setRacaoDiaKg(Number(e.target.value))}
                className="bg-transparent text-xl font-bold text-white outline-none w-full border-b border-white/20 pb-1 focus:border-cyan-400 transition-colors"
                min="0"
                step="0.5"
              />
            </div>
            <div className="flex items-center justify-center p-3">
              <span className="text-gray-500">→</span>
            </div>
            <div className="flex-1 bg-cyan-950/30 p-3 rounded-lg border border-cyan-500/30">
              <span className="text-xs text-cyan-400 font-bold block mb-1">Melaço Líquido Necessário</span>
              <div className="text-2xl font-black text-white">{melacoNecessarioKg} <span className="text-sm font-normal text-cyan-400">kg/dia</span></div>
            </div>
          </div>
        </div>
        
        <div className="w-full xl:w-1/3 bg-black/30 rounded-xl p-5 border border-white/5">
           <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Status do SST (Sólidos)</h4>
           {/* Visual Gauge simple CSS */}
           <div className="h-6 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 flex relative mt-2">
             <div className="absolute -top-6 left-0 text-xs text-gray-400">Z. Segura</div>
             <div className="absolute -top-6 left-1/2 text-xs text-gray-400 -translate-x-1/2">Ideal (300-500)</div>
             <div className="absolute -top-6 right-0 text-xs text-gray-400">Risco (&gt;800)</div>
             {/* Indicator pin (mocked at ideal position based on standard management) */}
             <div className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] border-2 border-black left-1/2 -translate-x-1/2 mix-blend-difference"></div>
           </div>
        </div>
      </div>
      
      {/* WATER QUALITY PANEL */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mt-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Droplet className="text-cyan-400" size={20}/> Relatório Completo de Qualidade d'Água</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5">
              <tr>
                <th className="px-4 py-3">Parâmetro</th>
                <th className="px-4 py-3">Alvo Ideal (Tilápia Cultivo Intensivo)</th>
                <th className="px-4 py-3">Limites Críticos (Letal)</th>
                <th className="px-4 py-3">Consequência Direta & Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Temperatura (T°C)</td>
                <td className="px-4 py-3">27°C - 30°C</td>
                <td className="px-4 py-3 text-red-400 font-bold">&lt;18°C ou &gt;34°C</td>
                <td className="px-4 py-3 text-gray-400">Choque térmico letal. Ação: Aquecimento ou aeração brusca para resfriar.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Oxigênio Dissolvido (OD)</td>
                <td className="px-4 py-3">5.0 - 8.0 mg/L</td>
                <td className="px-4 py-3 text-red-400 font-bold">&lt;3.0 mg/L limite, &lt;1.5 asfixia</td>
                <td className="px-4 py-3 text-gray-400">Asfixia do biofloco e peixe. Ação: Aeradores de backup.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">pH</td>
                <td className="px-4 py-3">6.5 - 8.0</td>
                <td className="px-4 py-3 text-orange-400 font-bold">&lt; 5.0 ou &gt; 9.0</td>
                <td className="px-4 py-3 text-gray-400">Torna amônia exponencialmente letal no alto. Ação: Cal ou Bicarbonato.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Amônia Total (TAN)</td>
                <td className="px-4 py-3">&lt; 2.0 mg/L</td>
                <td className="px-4 py-3 text-red-400 font-bold">&gt; 5.0 mg/L agudo</td>
                <td className="px-4 py-3 text-gray-400">Queima brônquios. Ação: Suspensão de ração, adicião de Carbono (Melaço).</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Amônia Tóxica (NH3-NI)</td>
                <td className="px-4 py-3">0.0 mg/L - 0.05 mg/L</td>
                <td className="px-4 py-3 text-red-500 font-black">&gt; 0.2 mg/L letal</td>
                <td className="px-4 py-3 text-gray-400">A verdadeira assassina silenciosa. Ação: Baixar pH e renovar água imediatamente.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Nitrito (NO2-)</td>
                <td className="px-4 py-3">&lt; 0.5 mg/L</td>
                <td className="px-4 py-3 text-yellow-400 font-bold">&gt; 2.5 mg/L (Sangue Marrom)</td>
                <td className="px-4 py-3 text-gray-400">Previne carregar oxigênio. Ação: Adição de Cloreto de Sódio (Sal não iodado).</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Alcalinidade (CaCO3)</td>
                <td className="px-4 py-3">120 - 150 mg/L</td>
                <td className="px-4 py-3 text-yellow-400 font-bold">&lt; 40 mg/L risco colapso pH</td>
                <td className="px-4 py-3 text-gray-400">O BFT a consome 24/7! Ação: Adição semanal de bicarbonato de sódio.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Sólidos Suspensos (SST)</td>
                <td className="px-4 py-3">300 - 500 mg/L</td>
                <td className="px-4 py-3 text-yellow-400 font-bold">&gt; 800 mg/L crônico</td>
                <td className="px-4 py-3 text-gray-400">Risco de bactérias patogênicas e bloqueio branquial. Ação: Dreno de decantadores.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3 font-bold text-cyan-400">Gás Carbônico (CO2)</td>
                <td className="px-4 py-3">&lt; 15 mg/L</td>
                <td className="px-4 py-3 text-yellow-400 font-bold">&gt; 35 mg/L</td>
                <td className="px-4 py-3 text-gray-400">Resquício da respiração microbiana pesada. Ação: Aeração forte de superfície (splashes).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

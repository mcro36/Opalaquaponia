"use client";

import { useProject } from "@/contexts/ProjectContext";
import { CloudRain, Store, Scale, ThermometerSnowflake, FileCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import * as CONST from "@/data/constants";

export default function MercadoPage() {
  const { state, syncDispatch } = useProject();

  const handlePriceUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    syncDispatch({ 
      type: 'UPDATE_PARAM', 
      payload: { key: 'pricePerKg', value: Number(e.target.value) } 
    });
  };

  const isClimateActive = state.parameters.climateControlEnabled;

  const bhClimateData = [
    { mes: 'Jan', temp: 23, aguaEstimada: 27, status: 'Ótimo' },
    { mes: 'Fev', temp: 23, aguaEstimada: 27, status: 'Ótimo' },
    { mes: 'Mar', temp: 22, aguaEstimada: 26, status: 'Ótimo' },
    { mes: 'Abr', temp: 21, aguaEstimada: 24, status: 'Bom' },
    { mes: 'Mai', temp: 18, aguaEstimada: 21, status: 'Alerta' },
    { mes: 'Jun', temp: 17, aguaEstimada: 19, status: 'Crítico' },
    { mes: 'Jul', temp: 17, aguaEstimada: 18, status: 'Crítico' },
    { mes: 'Ago', temp: 19, aguaEstimada: 20, status: 'Alerta' },
    { mes: 'Set', temp: 21, aguaEstimada: 22, status: 'Bom' },
    { mes: 'Out', temp: 22, aguaEstimada: 25, status: 'Ótimo' },
    { mes: 'Nov', temp: 22, aguaEstimada: 26, status: 'Ótimo' },
    { mes: 'Dez', temp: 22, aguaEstimada: 27, status: 'Ótimo' },
  ];

  // If climate control is on, water temp is steady at TARGET_WATER_TEMP.
  const chartData = bhClimateData.map(d => ({
    ...d,
    aguaControlada: isClimateActive ? CONST.TARGET_WATER_TEMP : d.aguaEstimada
  }));

  const salesChannels = [
    { id: 1, canal: 'CEASA-BH (Atacado)', preco: 35, volume: 'Muito Alto', licenca: 'SIM/SIE' },
    { id: 2, canal: 'Restaurantes (B2B)', preco: 45, volume: 'Alto', licenca: 'SIM/SIE' },
    { id: 3, canal: 'Feiras / Mercados', preco: 55, volume: 'Médio', licenca: 'SIM' },
    { id: 4, canal: 'Direto / E-commerce', preco: 65, volume: 'Baixo', licenca: 'Isento (Uso próprio)' }
  ];

  const licenses = [
    { name: 'SIM (Serviço de Inspeção Municipal)', area: 'Belo Horizonte', custo: 'Baixo', status: 'Requer abatedouro higienizado' },
    { name: 'SIE-MG (Instituto Mineiro de Agropecuária)', area: 'Governo de Minas Gerais', custo: 'Médio', status: 'Obrigatório para venda RT Intermunicipal' },
    { name: 'SIF (Inspecção Federal)', area: 'Brasil', custo: 'Alto', status: 'Apenas para Fase Industrial Avancçada' },
    { name: 'IGAM (Outorga de Água)', area: 'Recursos Hídricos MG', custo: 'Médio', status: 'Mesmo para Aquaponia, poço/copasa precisa de laudo' },
    { name: 'COPAM/FEAM', area: 'Secretaria Meio Ambiente', custo: 'Baixo', status: 'Dispensa para < 5 Ton/ano. Obrigatório depois.' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Store className="text-purple-400" /> Mercado & Clima BH
        </h1>
        <p className="text-gray-400 mt-2">Visão mercadológica, regulação sanitária e perfil térmico específico de Belo Horizonte.</p>
      </header>

      {/* CLIMATE PROFILE */}
      <div className="bg-[#0a0f1c] border border-blue-500/20 p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CloudRain className="text-blue-400" /> Perfil Térmico Cwb (Belo Horizonte)
          </h3>
          <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-bold flex items-center gap-2">
            <ThermometerSnowflake size={16}/>
            Bomba de Calor: {isClimateActive ? 'ON' : 'OFF'}
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 max-w-3xl">
          Belo Horizonte não perdoa sistemas abertos no inverno (Junho a Agosto). A água cai para 18°C e a Tilápia paralisa a alimentação.
          O gráfico abaixo projeta a água real do tanque (Linha Azul) versus a Temperatura do Ar (Linha Cinza). A zona vermelha demonstra paralisia comercial.
        </p>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="mes" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[10, 35]} stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0f1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <ReferenceLine y={28} stroke="#34d399" strokeDasharray="3 3" label={{ position: 'right', value: 'Ideal (28°C)', fill: '#34d399', fontSize: 10 }} />
              <ReferenceLine y={18} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Crítico (<18°C)', fill: '#ef4444', fontSize: 10 }} />
              <Line type="monotone" dataKey="temp" stroke="#6b7280" strokeWidth={2} dot={{ r: 4 }} name="Temp. Ar (°C)" />
              <Line type="monotone" dataKey="aguaControlada" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} name="Água Tanque (°C)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MARKET CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Store size={20} className="text-purple-400"/> Canais de Venda Ativos</h3>
          <p className="text-sm text-gray-400 mb-6">Selecione o canal para simular o R$/kg global no Dashboard.</p>
          
          <div className="mb-6 bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
            <label className="text-sm font-bold text-purple-300 block mb-2">Simular Preço Base (Filé):</label>
            <select 
              value={state.parameters.pricePerKg} 
              onChange={handlePriceUpdate}
              className="w-full bg-[#0a0f1c] border border-purple-500/30 text-white rounded-lg p-3 outline-none focus:border-purple-400 transition-colors"
            >
              <option value="35">R$ 35,00/kg - CEASA (Atacado)</option>
              <option value="45">R$ 45,00/kg - Restaurantes (B2B)</option>
              <option value="55">R$ 55,00/kg - Feiras e Açougues</option>
              <option value="65">R$ 65,00/kg - Direto ao Consumidor (Premium)</option>
            </select>
          </div>

          <div className="space-y-3">
            {salesChannels.map(c => (
              <div key={c.id} className={`p-3 rounded-lg flex justify-between items-center border transition-all ${state.parameters.pricePerKg === c.preco ? 'bg-purple-500/20 border-purple-500/50' : 'bg-[#0a0f1c] border-white/5'}`}>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">{c.canal}</h4>
                  <p className="text-xs text-gray-500">Volume: {c.volume}</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-black text-purple-400">R$ {c.preco}</span>
                  <span className="text-[10px] text-gray-500">Licença: {c.licenca}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Scale size={20} className="text-emerald-400"/> Checklist Regulatório (MG)</h3>
          <p className="text-sm text-gray-400 mb-6">Principais entes responsáveis pela formalização em BH.</p>
          
          <div className="space-y-4">
            {licenses.map((lic, i) => (
              <div key={i} className="flex gap-4 items-start p-4 bg-[#0a0f1c] border border-white/5 rounded-xl hover:border-emerald-500/30 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20">
                  <FileCheck size={18} className="text-gray-400 group-hover:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                    {lic.name} 
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 uppercase tracking-widest">{lic.custo}</span>
                  </h4>
                  <p className="text-xs text-emerald-400/80 mb-1 font-semibold">{lic.area}</p>
                  <p className="text-xs text-gray-500">{lic.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { Droplets, AlertTriangle, CheckCircle, Thermometer } from 'lucide-react';

export default function QualidadeAguaPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [readings, setReadings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReadings() {
      // Tentar carregar da tabela water_readings se existir
      const { data, error } = await supabase
        .from('water_readings')
        .select('*')
        .eq('project_id', projectId)
        .order('reading_date', { ascending: false })
        .limit(30);

      if (error) {
        console.warn('water_readings não disponível ou vazia:', error.message);
        // Mock data para demo
        setReadings([
          { id: 1, tank_name: 'Tanque 1', reading_date: '2026-04-18', ph: 7.2, dissolved_oxygen: 5.8, ammonia: 0.02, temperature: 27.5 },
          { id: 2, tank_name: 'Tanque 2', reading_date: '2026-04-18', ph: 6.9, dissolved_oxygen: 4.1, ammonia: 0.08, temperature: 28.1 },
          { id: 3, tank_name: 'Tanque 3', reading_date: '2026-04-18', ph: 7.5, dissolved_oxygen: 6.2, ammonia: 0.01, temperature: 26.8 },
          { id: 4, tank_name: 'Tanque 4', reading_date: '2026-04-17', ph: 7.0, dissolved_oxygen: 5.0, ammonia: 0.05, temperature: 27.0 },
          { id: 5, tank_name: 'Tanque 5', reading_date: '2026-04-17', ph: 8.1, dissolved_oxygen: 3.5, ammonia: 0.12, temperature: 29.5 },
          { id: 6, tank_name: 'Tanque 6', reading_date: '2026-04-17', ph: 7.3, dissolved_oxygen: 5.5, ammonia: 0.03, temperature: 27.2 },
        ]);
      } else {
        setReadings(data ?? []);
      }
      setIsLoading(false);
    }
    fetchReadings();
  }, [projectId]);

  const getAlert = (param: string, value: number) => {
    if (param === 'ph') return value < 6.5 || value > 8.5 ? 'danger' : value < 7.0 || value > 8.0 ? 'warn' : 'ok';
    if (param === 'od') return value < 3.0 ? 'danger' : value < 5.0 ? 'warn' : 'ok';
    if (param === 'ammonia') return value > 0.1 ? 'danger' : value > 0.05 ? 'warn' : 'ok';
    if (param === 'temp') return value < 24 || value > 32 ? 'danger' : value < 26 || value > 30 ? 'warn' : 'ok';
    return 'ok';
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'danger') return <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase"><AlertTriangle size={12} /> Crítico</span>;
    if (status === 'warn') return <span className="flex items-center gap-1 text-yellow-400 text-[10px] font-bold uppercase"><AlertTriangle size={12} /> Atenção</span>;
    return <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold uppercase"><CheckCircle size={12} /> Normal</span>;
  };

  const alerts = readings.filter(r => 
    getAlert('ph', r.ph) !== 'ok' || 
    getAlert('od', r.dissolved_oxygen) !== 'ok' || 
    getAlert('ammonia', r.ammonia) !== 'ok' || 
    getAlert('temp', r.temperature) !== 'ok'
  );

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-96 bg-white/5 rounded-2xl"></div></div>;

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Qualidade da Água</h1>
          <p className="text-gray-400">Monitoramento de parâmetros físico-químicos dos tanques.</p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
          <Droplets size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">Leituras (últimos 7d)</p>
          <p className="text-3xl font-bold text-white">{readings.length}</p>
        </div>
        <div className={`bg-[#121a2f] border rounded-2xl p-6 ${alerts.length > 0 ? 'border-red-500/50' : 'border-green-500/30'}`}>
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">Alertas Ativos</p>
          <p className={`text-3xl font-bold ${alerts.length > 0 ? 'text-red-500' : 'text-green-400'}`}>{alerts.length}</p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">pH Médio</p>
          <p className="text-3xl font-bold text-cyan-400">
            {readings.length > 0 ? (readings.reduce((a, b) => a + b.ph, 0) / readings.length).toFixed(1) : '-'}
          </p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">Temp Média</p>
          <p className="text-3xl font-bold text-white">
            {readings.length > 0 ? (readings.reduce((a, b) => a + b.temperature, 0) / readings.length).toFixed(1) : '-'}°C
          </p>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Tanque</th>
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium text-center">pH</th>
              <th className="p-4 font-medium text-center">OD (mg/L)</th>
              <th className="p-4 font-medium text-center">Amônia (mg/L)</th>
              <th className="p-4 font-medium text-center">Temp (°C)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {readings.map(r => (
              <tr key={r.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-bold">{r.tank_name}</td>
                <td className="p-4 text-gray-400 font-mono text-xs">{new Date(r.reading_date).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono font-bold ${getAlert('ph', r.ph) === 'ok' ? 'text-green-400' : getAlert('ph', r.ph) === 'warn' ? 'text-yellow-400' : 'text-red-500'}`}>{r.ph}</span>
                    <StatusBadge status={getAlert('ph', r.ph)} />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono font-bold ${getAlert('od', r.dissolved_oxygen) === 'ok' ? 'text-green-400' : getAlert('od', r.dissolved_oxygen) === 'warn' ? 'text-yellow-400' : 'text-red-500'}`}>{r.dissolved_oxygen}</span>
                    <StatusBadge status={getAlert('od', r.dissolved_oxygen)} />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono font-bold ${getAlert('ammonia', r.ammonia) === 'ok' ? 'text-green-400' : getAlert('ammonia', r.ammonia) === 'warn' ? 'text-yellow-400' : 'text-red-500'}`}>{r.ammonia}</span>
                    <StatusBadge status={getAlert('ammonia', r.ammonia)} />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono font-bold ${getAlert('temp', r.temperature) === 'ok' ? 'text-green-400' : getAlert('temp', r.temperature) === 'warn' ? 'text-yellow-400' : 'text-red-500'}`}>{r.temperature}°</span>
                    <StatusBadge status={getAlert('temp', r.temperature)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useProject } from '@/contexts/ProjectContext';
import { loadBatches } from '@/lib/supabaseActions';
import { Droplet, Activity, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';

export default function TanquesPage() {
  const { state } = useProject();
  const projectId = DEFAULT_PROJECT_ID;
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      loadBatches(projectId).then(setBatches);
    }
  }, [projectId]);

  const tanks = [
    { id: 't1', label: 'Tanque 1' },
    { id: 't2', label: 'Tanque 2' },
    { id: 't3', label: 'Tanque 3' },
    { id: 't4', label: 'Tanque 4' },
    { id: 't5', label: 'Tanque 5' },
    { id: 't6', label: 'Tanque 6' },
  ];

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Visão de Tanques</h1>
          <p className="text-gray-400">Layout operacional e ocupação atual.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tanks.map(tank => {
          const biomass = state.biomass[tank.id] || 0;
          const density = state.parameters.targetDensity;
          const maxCapacityKg = 5 * density; // Assumindo 5m3
          const loadPercentage = Math.min((biomass / maxCapacityKg) * 100, 100);
          
          let alertLevel = 'normal';
          if (loadPercentage > 90) alertLevel = 'critical';
          else if (loadPercentage > 75) alertLevel = 'warning';

          const activeBatch = batches.find(b => b.status === 'ativo' && b.tank_id === tank.id);

          return (
            <div key={tank.id} className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-start mb-6 relative">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {tank.label}
                    {alertLevel === 'critical' && <AlertTriangle size={16} className="text-red-500" />}
                  </h3>
                  <p className="text-sm text-gray-400">Volume: 5 m³</p>
                </div>
                
                <div className={`p-3 rounded-xl backdrop-blur-md border ${
                  alertLevel === 'critical' ? 'bg-red-500/20 border-red-500/30 text-red-500' :
                  alertLevel === 'warning' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' :
                  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                }`}>
                  <Droplet size={24} />
                </div>
              </div>

              <div className="space-y-4 relative">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Densidade (kg/m³)</span>
                    <span className="text-white font-bold">{(biomass/5).toFixed(1)} / {density}</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        alertLevel === 'critical' ? 'bg-red-500' :
                        alertLevel === 'warning' ? 'bg-yellow-500' :
                        'bg-cyan-500'
                      }`} 
                      style={{ width: `${loadPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-500 font-mono mb-1">Biomassa Total</p>
                    <p className="text-lg font-bold text-white">{biomass.toLocaleString('pt-BR')} kg</p>
                  </div>
                  
                  <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-500 font-mono mb-1">Lote Alocado</p>
                    <p className="text-sm font-bold text-white truncate">
                      {activeBatch ? activeBatch.code : <span className="text-gray-600">Vazio</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

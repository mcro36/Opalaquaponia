"use client";

import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface RiskCardProps {
  title: string;
  severity: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  description: string;
  mitigation: string;
  isActive?: boolean;
}

export default function RiskCard({ title, severity, description, mitigation, isActive = false }: RiskCardProps) {
  
  const getSeverityStyle = () => {
    switch(severity) {
      case 'Crítico': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Alto': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Médio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Baixo': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const Icon = severity === 'Crítico' ? ShieldAlert : severity === 'Alto' ? AlertTriangle : severity === 'Médio' ? AlertCircle : Info;

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl transition-all ${isActive ? 'shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-bold text-lg ${isActive ? 'text-red-400' : 'text-white'}`}>{title}</h3>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityStyle()}`}>
          {severity}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-4 h-16 opacity-90">{description}</p>
      
      <div className="pt-4 border-t border-white/5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Icon size={14} /> Mitigação
        </p>
        <p className="text-sm text-cyan-200/80 font-medium">{mitigation}</p>
      </div>
    </div>
  );
}

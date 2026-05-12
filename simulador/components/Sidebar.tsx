"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Wind, Thermometer, Recycle, Wallet, Receipt, Route, 
  ShieldAlert, Store, Users, ShoppingCart, TableProperties, PackageOpen, 
  ArrowDownUp, UserCheck, Clock, Target, Activity, Droplets, FileCheck, 
  CalendarDays, Map, AlertTriangle, ChevronDown, ChevronRight, Factory,
  Cpu, Beaker, BarChart3, TrendingUp, AlertOctagon, FileText
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navGroups = [
    {
      label: 'SIMULADOR INDUSTRIAL',
      links: [
        { name: 'Dashboard Executivo', href: '/', icon: LayoutDashboard },
        { name: 'Tanques (Técnico)', href: '/tecnico/tanques', icon: Recycle },
        { name: 'Climatização (Sazonal)', href: '/tecnico/climatizacao', icon: Thermometer },
        { name: 'Ração (Fábrica)', href: '/tecnico/racao', icon: Factory },
        { name: 'Aeração (Cálculos)', href: '/tecnico/aeracao', icon: Wind },
      ]
    },
    {
      label: 'FINANCEIRO & SAÚDE',
      links: [
        { name: 'Saúde Financeira 360°', href: '/financeiro/saude', icon: ShieldAlert },
        { name: 'DRE Consolidada', href: '/financeiro/dre', icon: BarChart3 },
        { name: 'Fluxo de Caixa (Curva J)', href: '/financeiro/fluxo-caixa', icon: TrendingUp },
        { name: 'CAPEX (Investimento)', href: '/financeiro/capex', icon: Wallet },
        { name: 'OPEX (Custos)', href: '/financeiro/opex', icon: Receipt },
        { name: 'Histórico RI', href: '/historico', icon: FileText },
      ]
    },
    {
      label: 'OPERAÇÃO REAL',
      links: [
        { name: 'Lotes Ativos', href: '/operacao/lotes', icon: Route },
        { name: 'Manejo Diário', href: '/operacao/manejo', icon: FileCheck },
        { name: 'Qualidade da Água', href: '/qualidade/agua', icon: Droplets },
        { name: 'Insumos / Estoque', href: '/estoque/insumos', icon: PackageOpen },
      ]
    },
    {
      label: 'COMERCIAL & ESTRATÉGIA',
      links: [
        { name: 'Pedidos & Vendas', href: '/comercial/pedidos', icon: ShoppingCart },
        { name: 'Roadmap Estratégico', href: '/roadmap', icon: Map },
        { name: 'Matriz de Riscos', href: '/riscos', icon: AlertTriangle },
        { name: 'Stress Test (Pânico)', href: '/estratégia/stress', icon: AlertOctagon },
      ]
    }
  ];

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialState: Record<string, boolean> = { 'SIMULADOR INDUSTRIAL': true };
    navGroups.forEach(group => {
      const hasActiveLink = group.links.some(link => 
        pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')
      );
      if (hasActiveLink) {
        initialState[group.label] = true;
      }
    });
    setExpandedGroups(initialState);
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0a0f1c] border-r border-white/10 h-screen sticky top-0 flex flex-col p-5 overflow-y-auto custom-scrollbar shadow-2xl">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-extrabold tracking-tighter text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Cpu className="text-[#0a0f1c]" size={18} />
          </div>
          RJ<span className="text-cyan-400">PISCICULTURA</span>
        </h1>
        <div className="text-[9px] mt-3 inline-block bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase tracking-[0.2em]">
          Engine Industrial v4.0
        </div>
      </div>
      
      <nav className="flex-1 space-y-6">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups[group.label];

          return (
            <div key={group.label}>
              <button 
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2 py-2 text-[10px] font-black text-gray-500 hover:text-cyan-400 uppercase tracking-widest transition-colors mb-2 group"
              >
                {group.label}
                <div className="flex items-center">
                   <div className="h-[1px] w-8 bg-white/5 group-hover:bg-cyan-500/30 mr-2 transition-all"></div>
                   {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </div>
              </button>
              
              <div 
                className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {group.links.map((link) => {
                  const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-200 rounded-xl relative group ${
                        isActive 
                          ? 'bg-cyan-500 text-[#0a0f1c] shadow-[0_4px_15px_-3px_rgba(6,182,212,0.4)]' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={`${isActive ? 'text-[#0a0f1c]' : 'text-gray-500 group-hover:text-cyan-400'} transition-colors`} />
                      {link.name}
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 bg-[#0a0f1c] rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-white/5 text-[9px] text-gray-600 flex flex-col items-center gap-2">
        <div className="flex gap-4">
           <span className="hover:text-cyan-400 cursor-pointer transition-colors">API STATUS: ONLINE</span>
        </div>
        <div className="font-mono opacity-50 uppercase tracking-widest">
           System.Encrypted.v4
        </div>
      </div>
    </aside>
  );
}

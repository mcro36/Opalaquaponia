"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wind, Thermometer, Recycle, Wallet, Receipt, Route, ShieldAlert, Store, Users, ShoppingCart, TableProperties, PackageOpen, ArrowDownUp, UserCheck, Clock, Target, Activity, Droplets, FileCheck, CalendarDays, Map, AlertTriangle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navGroups = [
    {
      label: 'Geral',
      links: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      ]
    },
    {
      label: 'Produção',
      links: [
        { name: 'Lotes / Ciclos', href: '/operacao/lotes', icon: Route },
        { name: 'Manejo Diário', href: '/operacao/manejo', icon: FileCheck },
        { name: 'Tanques (Visão)', href: '/operacao/tanques', icon: Recycle },
        { name: 'Aeração (Técnico)', href: '/tecnico/aeracao', icon: Wind },
        { name: 'Alim. / Clima', href: '/tecnico/alimentacao', icon: Thermometer },
      ]
    },
    {
      label: 'Financeiro',
      links: [
        { name: 'Transações Reais', href: '/financeiro/transacoes', icon: Wallet },
        { name: 'DRE', href: '/financeiro/dre', icon: Receipt },
        { name: 'Fluxo de Caixa', href: '/financeiro/fluxo-caixa', icon: Activity },
        { name: 'Contas a Pagar/Rec', href: '/financeiro/contas', icon: Store },
        { name: 'Saúde Financeira', href: '/financeiro/saude', icon: ShieldAlert },
        { name: 'CAPEX (Est.)', href: '/financeiro/capex', icon: Wallet },
        { name: 'OPEX (Est.)', href: '/financeiro/opex', icon: Receipt },
      ]
    },
    {
      label: 'Comercial',
      links: [
        { name: 'Clientes', href: '/comercial/clientes', icon: Users },
        { name: 'Pedidos', href: '/comercial/pedidos', icon: ShoppingCart },
        { name: 'Kanban', href: '/comercial/kanban', icon: TableProperties },
      ]
    },
    {
      label: 'Estoque',
      links: [
        { name: 'Insumos', href: '/estoque/insumos', icon: PackageOpen },
        { name: 'Movimentações', href: '/estoque/movimentacoes', icon: ArrowDownUp },
      ]
    },
    {
      label: 'RH & Equipe',
      links: [
        { name: 'Equipe', href: '/rh/equipe', icon: UserCheck },
        { name: 'Ponto', href: '/rh/ponto', icon: Clock },
      ]
    },
    {
      label: 'Metas',
      links: [
        { name: 'OKRs', href: '/metas', icon: Target },
        { name: 'KPIs', href: '/metas/kpis', icon: Activity },
      ]
    },
    {
      label: 'Qualidade',
      links: [
        { name: 'Água', href: '/qualidade/agua', icon: Droplets },
        { name: 'Laudos/Licenças', href: '/qualidade/laudos', icon: FileCheck },
        { name: 'Calendário', href: '/calendario', icon: CalendarDays },
      ]
    },
    {
      label: 'Estratégia',
      links: [
        { name: 'Roadmap', href: '/roadmap', icon: Map },
        { name: 'Riscos', href: '/riscos', icon: AlertTriangle },
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0a0f1c] border-r border-white/10 h-screen sticky top-0 flex flex-col p-5 overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-wider text-white">OPALA<span className="text-cyan-400">AQUAPONIA</span></h1>
        <div className="text-[10px] mt-2 inline-block border border-cyan-500/40 text-cyan-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
          ERP Aquicultura
        </div>
      </div>
      
      <nav className="flex-1 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.links.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-white/5 text-[10px] text-gray-600 text-center font-mono">
        v4.0.0 — next.js
      </div>
    </aside>
  );
}

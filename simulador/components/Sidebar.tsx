"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wind, Bot, Thermometer, Recycle, Wallet, Receipt, Route, ShieldAlert, Store } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Aeração', href: '/tecnico/aeracao', icon: Wind },
    { name: 'Automação', href: '/tecnico/automacao', icon: Bot },
    { name: 'Alimentação / Clima', href: '/tecnico/alimentacao', icon: Thermometer },
    { name: 'Ração Circular', href: '/tecnico/racao', icon: Recycle },
    { name: 'CAPEX', href: '/financeiro/capex', icon: Wallet },
    { name: 'OPEX', href: '/financeiro/opex', icon: Receipt },
    { name: 'Roadmap & Cash Flow', href: '/roadmap', icon: Route },
    { name: 'Riscos & Alertas', href: '/riscos', icon: ShieldAlert },
    { name: 'Mercado & Clima BH', href: '/mercado', icon: Store },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0a0f1c] border-r border-white/10 h-screen sticky top-0 flex flex-col p-5 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-wider text-white">OPALA<span className="text-cyan-400">AQUAPONIA</span></h1>
        <div className="text-[10px] mt-2 inline-block border border-cyan-500/40 text-cyan-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
          Simulador V4.0
        </div>
      </div>
      
      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(34,211,238,0.15)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-white/5 text-[10px] text-gray-600 text-center font-mono">
        v4.0.0 — next.js
      </div>
    </aside>
  );
}

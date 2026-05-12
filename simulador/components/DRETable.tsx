import React from 'react';
import { clsx } from 'clsx';

import { DRE } from '@/lib/earningsApi';

interface DRETableProps {
  data: DRE;
}

export function DRETable({ data }: DRETableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const formatPercent = (val: number) => {
    return val.toFixed(1) + '%';
  };

  const rows = [
    { label: '(+) Receita Bruta', value: data.receita_bruta, margin: 100, isMain: true },
    { label: '(–) PIS/COFINS', value: data.pis_cofins, margin: 0 },
    { label: '(=) Receita Líquida', value: data.receita_liquida, margin: 100, isSubtotal: true },
    { label: '(–) CPV — Ração', value: data.cpv_racao, margin: (data.cpv_racao / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(–) CPV — Alevinos', value: data.cpv_alevinos, margin: (data.cpv_alevinos / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(–) CPV — Processamento', value: data.cpv_processamento, margin: (data.cpv_processamento / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(=) Lucro Bruto', value: data.lucro_bruto, margin: (data.lucro_bruto / data.receita_liquida) * 100 || 0, isSubtotal: true },
    { label: '(–) SG&A — Energia', value: data.sga_energia, margin: (data.sga_energia / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(–) SG&A — Manutenção', value: data.sga_manutencao, margin: (data.sga_manutencao / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(=) EBITDA Ajustado', value: data.ebitda, margin: (data.ebitda / data.receita_liquida) * 100 || 0, isHighlight: true },
    { label: '(–) Depreciação e Amortização', value: data.depreciacao, margin: (data.depreciacao / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(=) EBIT', value: data.ebit, margin: (data.ebit / data.receita_liquida) * 100 || 0, isSubtotal: true },
    { label: '(–) Resultado Financeiro', value: data.financeiro, margin: (data.financeiro / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(=) LAIR', value: data.lair, margin: (data.lair / data.receita_liquida) * 100 || 0, isSubtotal: true },
    { label: '(–) IR/CSLL', value: data.ir_csll, margin: (data.ir_csll / data.receita_liquida) * 100 || 0, indent: true },
    { label: '(=) Lucro Líquido', value: data.lucro_liquido, margin: (data.lucro_liquido / data.receita_liquida) * 100 || 0, isHighlight: true, isLast: true },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-white/40">
            <th className="px-6 py-3 font-semibold">Linha da DRE</th>
            <th className="px-6 py-3 text-right font-semibold">Valor (R$)</th>
            <th className="px-6 py-3 text-right font-semibold">Margem (%)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row, idx) => (
            <tr 
              key={idx} 
              className={clsx(
                "transition-colors hover:bg-white/5",
                row.isSubtotal && "bg-white/[0.02] font-medium text-white/90",
                row.isHighlight && "bg-emerald-500/10 font-bold text-emerald-400",
                row.isLast && "bg-emerald-500/20 text-lg text-emerald-300"
              )}
            >
              <td className={clsx("px-6 py-4", row.indent && "pl-12 text-white/60")}>
                {row.label}
              </td>
              <td className="px-6 py-4 text-right tabular-nums">
                {formatCurrency(row.value)}
              </td>
              <td className={clsx(
                "px-6 py-4 text-right tabular-nums font-medium",
                row.margin < 0 ? "text-rose-400" : (row.margin > 0 ? "text-emerald-400" : "text-white/40")
              )}>
                {data.receita_liquida !== 0 ? formatPercent(row.margin) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

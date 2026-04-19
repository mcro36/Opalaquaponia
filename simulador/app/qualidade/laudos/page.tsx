"use client";

import { FileCheck, Upload, AlertCircle } from 'lucide-react';

export default function QualidadeLaudosPage() {
  
  // Mock data for compliance documents
  const laudos = [
    { id: 1, title: 'Laudo de Qualidade de Água (Trimestral)', agency: 'Laboratório Central', date: '2026-03-15', expire: '2026-06-15', status: 'válido' },
    { id: 2, title: 'Licença Ambiental de Operação (LAO)', agency: 'Órgão Ambiental Estadual', date: '2024-01-10', expire: '2026-01-10', status: 'vencido' },
    { id: 3, title: 'Certificado de Inspeção Sanitária', agency: 'Ministério da Agricultura', date: '2025-11-20', expire: '2026-11-20', status: 'válido' }
  ];

  return (
    <div className="p-8 pb-32">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Laudos e Licenças</h1>
          <p className="text-gray-400">Controle de compliance e conformidade regulatória.</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2">
          <Upload size={20} />
          Upload de Documento
        </button>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Documento</th>
              <th className="p-4 font-medium">Órgão / Emissor</th>
              <th className="p-4 font-medium">Emissão</th>
              <th className="p-4 font-medium">Vencimento</th>
              <th className="p-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {laudos.map(l => (
              <tr key={l.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-white font-medium flex items-center gap-2">
                  <FileCheck size={16} className="text-cyan-400" />
                  {l.title}
                </td>
                <td className="p-4 text-gray-400">{l.agency}</td>
                <td className="p-4 text-gray-400 font-mono text-xs">{new Date(l.date).toLocaleDateString('pt-BR')}</td>
                <td className={`p-4 font-mono font-bold text-xs ${l.status === 'vencido' ? 'text-red-500' : 'text-cyan-400'}`}>
                  {new Date(l.expire).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1 w-max mx-auto
                    ${l.status === 'válido' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                    {l.status === 'vencido' && <AlertCircle size={12} />}
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { loadTimeEntries, loadEmployees, upsertTimeEntry, deleteTimeEntry } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { Clock, Plus, Trash2 } from 'lucide-react';

export default function RHPontoPage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [entries, setEntries] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '', entry_date: new Date().toISOString().split('T')[0],
    hours_worked: 8, task_summary: ''
  });

  const fetchData = async () => {
    const [ents, emps] = await Promise.all([
      loadTimeEntries(projectId),
      loadEmployees(projectId)
    ]);
    setEntries(ents);
    setEmployees(emps.filter((e: any) => e.status === 'ativo'));
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = { ...formData, id: crypto.randomUUID() };
    setIsModalOpen(false);
    
    await upsertTimeEntry(newEntry);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este lançamento de ponto?')) return;
    setEntries(entries.filter(e => e.id !== id));
    await deleteTimeEntry(id);
  };

  return (
    <div className="p-8 pb-32">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Registro de Ponto</h1>
          <p className="text-gray-400">Controle diário de horas trabalhadas da equipe.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Lançar Ponto
        </button>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Colaborador</th>
              <th className="p-4 font-medium text-center">Horas</th>
              <th className="p-4 font-medium">Resumo do dia</th>
              <th className="p-4 font-medium text-right">Remover</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-cyan-400 font-mono">
                  {new Date(entry.entry_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-white font-bold">
                  {entry.employees?.name || '---'}
                </td>
                <td className="p-4 text-center font-mono">
                  <span className="bg-white/5 px-2 py-1 rounded-md text-gray-300">
                    {entry.hours_worked}h
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-xs">{entry.task_summary}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(entry.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum ponto registrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Lançar Ponto</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Colaborador</label>
                <select required value={formData.employee_id} onChange={e => setFormData({ ...formData, employee_id: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                  <option value="">Selecione o colaborador...</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Data</label>
                  <input type="date" required value={formData.entry_date} onChange={e => setFormData({ ...formData, entry_date: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Horas Trabalhadas</label>
                   <input type="number" step="0.5" required value={formData.hours_worked} onChange={e => setFormData({ ...formData, hours_worked: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Resumo das Atividades</label>
                <input required value={formData.task_summary} onChange={e => setFormData({ ...formData, task_summary: e.target.value })} placeholder="Ex: Alimentação tanque 1 a 6 e reparo oxigenador" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all">Salvar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

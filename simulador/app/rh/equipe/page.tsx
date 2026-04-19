"use client";

import { useEffect, useState } from 'react';
import { loadEmployees, upsertEmployee, deleteEmployee } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';
import { Users, Plus, UserCog, UserCheck, Trash2 } from 'lucide-react';

export default function RHEquipePage() {
  const projectId = DEFAULT_PROJECT_ID;
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', role: 'Tratador', phone: '', email: '', 
    salary: 2500, hire_date: new Date().toISOString().split('T')[0], status: 'ativo'
  });

  const fetchData = async () => {
    setIsLoading(true);
    const data = await loadEmployees(projectId);
    setEmployees(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp = { ...formData, id: crypto.randomUUID() };
    setEmployees([newEmp, ...employees]);
    setIsModalOpen(false);
    
    await upsertEmployee(projectId, newEmp);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este colaborador? Isso removerá seu acesso.')) return;
    setEmployees(employees.filter(e => e.id !== id));
    await deleteEmployee(id);
  };

  const ativos = employees.filter(e => e.status === 'ativo');
  const totalSalary = ativos.reduce((a, b) => a + Number(b.salary), 0);

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Equipe e Colaboradores</h1>
          <p className="text-gray-400">Gestão de Recursos Humanos da fazenda.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Colaborador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400"><Users size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Total de Funcionários</p>
          <p className="text-4xl font-bold text-white">{employees.length}</p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-400"><UserCheck size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Ativos e Trabalhando</p>
          <p className="text-3xl font-bold text-green-400">{ativos.length}</p>
        </div>
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-400"><UserCog size={80} /></div>
          <p className="text-gray-400 font-medium font-mono text-sm uppercase mb-2">Custo Base (Folha)</p>
           <p className="text-3xl font-bold text-cyan-400">R$ {totalSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês</p>
        </div>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5 text-xs uppercase font-mono text-gray-500">
              <th className="p-4 font-medium">Colaborador</th>
              <th className="p-4 font-medium">Função</th>
              <th className="p-4 font-medium">Data de Admissão</th>
              <th className="p-4 font-medium text-right">Salário Base</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-white font-medium">
                  {emp.name}
                  <div className="text-[10px] text-gray-500 mt-1">{emp.phone}</div>
                </td>
                <td className="p-4 text-gray-400 uppercase font-mono text-xs">{emp.role}</td>
                <td className="p-4 text-gray-400">{emp.hire_date ? new Date(emp.hire_date).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="p-4 text-right font-mono text-cyan-400">
                  R$ {Number(emp.salary).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold 
                    ${emp.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(emp.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Nenhum funcionário cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Novo Colaborador</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Nome Completo</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Função</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                    <option value="Tratador">Tratador</option>
                    <option value="Operador Técnico">Operador Técnico</option>
                    <option value="Gestor">Gestor / Gerente</option>
                    <option value="Serviços Gerais">Serviços Gerais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Telefone</label>
                  <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Data Admissão</label>
                  <input type="date" required value={formData.hire_date} onChange={e => setFormData({ ...formData, hire_date: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Salário R$</label>
                  <input type="number" step="100" required value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

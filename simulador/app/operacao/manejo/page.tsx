"use client";

import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Calendar, CheckCircle, Circle, Plus, Droplets, Thermometer, Flame } from 'lucide-react';
import { loadDailyTasks, upsertDailyTask, deleteDailyTask } from '@/lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '@/lib/supabase';

export default function ManejoPage() {
  const { state } = useProject();
  const projectId = DEFAULT_PROJECT_ID;
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    task_date: todayDate,
    task_type: 'alimentação',
    description: '',
    quantity: 0,
    unit: 'kg'
  });

  const fetchData = async () => {
    setIsLoading(true);
    // load today's tasks
    const data = await loadDailyTasks(projectId, todayDate);
    setTasks(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId]);

  const toggleTask = async (task: any) => {
    const updated = { ...task, completed: !task.completed, completed_at: new Date().toISOString() };
    setTasks(tasks.map(t => t.id === task.id ? updated : t));
    await upsertDailyTask(projectId, updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      ...formData,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
    
    await upsertDailyTask(projectId, newTask);
    fetchData(); 
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'alimentação': return <Flame size={16} />;
      case 'limpeza': return <Droplets size={16} />;
      case 'medição': return <Thermometer size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Manejo Diário</h1>
          <p className="text-gray-400">Checklist e operações de rotina ({new Date(todayDate).toLocaleDateString('pt-BR')})</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-gray-400 font-medium font-mono text-sm uppercase mb-1">Progresso do Dia</h3>
            <p className="text-3xl font-bold text-white">{completedCount} / {tasks.length}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-cyan-400">{progressPercent}% Concluído</span>
          </div>
        </div>
        <div className="h-2 w-full bg-black rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center gap-4 bg-[#0a0f1c] border ${task.completed ? 'border-green-500/30' : 'border-white/10'} rounded-xl p-4 transition-all hover:bg-white/5 cursor-pointer`}
              onClick={() => toggleTask(task)}
            >
              <button className={`${task.completed ? 'text-green-400' : 'text-gray-500 hover:text-cyan-400'} transition-colors`}>
                {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1 flex items-center gap-4">
                <div className={`p-2 rounded-lg ${task.completed ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                  {getTaskIcon(task.task_type)}
                </div>
                <div>
                  <h3 className={`font-semibold ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {task.description || task.task_type.charAt(0).toUpperCase() + task.task_type.slice(1)}
                  </h3>
                  {task.quantity > 0 && (
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {task.quantity} {task.unit}
                    </p>
                  )}
                </div>
              </div>

              {task.completed && task.completed_at && (
                <div className="text-xs text-green-500 font-mono">
                  {new Date(task.completed_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <CheckCircle size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">Nenhuma tarefa para hoje.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Tipo de Tarefa</label>
                <select value={formData.task_type} onChange={e => setFormData({ ...formData, task_type: e.target.value })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none">
                  <option value="alimentação">Alimentação</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="medição">Medição de Água</option>
                  <option value="manutenção">Manutenção</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Descrição</label>
                <input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Ex: Arraçoamento tanque 1" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Quantidade</label>
                  <input type="number" step="0.1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">Unidade</label>
                  <input value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} placeholder="kg, L, unid" className="w-full bg-[#121a2f] border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-500/50 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all">Salvar Tarefa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

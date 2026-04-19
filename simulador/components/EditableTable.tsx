"use client";

import { useState } from 'react';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'status' | 'priority';
}

interface Item {
  id: string;
  [key: string]: any;
}

interface EditableTableProps {
  data: Item[];
  columns: Column[];
  onUpdate: (item: Item) => void;
  onRemove: (id: string) => void;
  onAdd: (item: any) => void;
  defaultNewItem: any;
  categoryName: string;
}

export default function EditableTable({ data, columns, onUpdate, onRemove, onAdd, defaultNewItem, categoryName }: EditableTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  
  const [isAdding, setIsAdding] = useState(false);
  const [addFormData, setAddFormData] = useState<any>(defaultNewItem);

  const handleEditClick = (item: Item) => {
    setEditingId(item.id);
    setEditFormData({ ...item });
  };

  const handleSaveEdit = () => {
    onUpdate(editFormData);
    setEditingId(null);
  };

  const handleSaveNew = () => {
    if (!addFormData.name || (addFormData.cost === 0 && addFormData.monthlyCost === 0)) return;
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${categoryName}_${Date.now()}`;
    onAdd({ ...addFormData, id: newId, category: categoryName });
    setAddFormData(defaultNewItem);
    setIsAdding(false);
  };

  return (
    <div className="bg-[#0a0f1c] border border-white/10 rounded-xl overflow-hidden mb-6">
      <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
        <h3 className="font-bold text-white text-lg">{categoryName}</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              {columns.map(col => <th key={col.key} className="px-4 py-3">{col.label}</th>)}
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="bg-cyan-500/10 border-b border-white/5">
                {columns.map(col => (
                  <td key={`add-${col.key}`} className="px-4 py-2">
                    {col.type === 'status' ? (
                      <select 
                        className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-cyan-500 w-full"
                        value={addFormData[col.key] || 'Planejado'}
                        onChange={(e) => setAddFormData({...addFormData, [col.key]: e.target.value})}
                      >
                        <option>Planejado</option>
                        <option>Comprado</option>
                        <option>Instalado</option>
                      </select>
                    ) : col.type === 'priority' ? (
                      <select 
                        className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-cyan-500 w-full"
                        value={addFormData[col.key] || 'Média'}
                        onChange={(e) => setAddFormData({...addFormData, [col.key]: e.target.value})}
                      >
                        <option>Baixa</option>
                        <option>Média</option>
                        <option>Alta</option>
                        <option>Crítica</option>
                      </select>
                    ) : (
                      <input 
                        type={col.type === 'number' ? 'number' : 'text'}
                        className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-cyan-500 w-full"
                        value={addFormData[col.key] || ''}
                        onChange={(e) => setAddFormData({...addFormData, [col.key]: col.type === 'number' ? Number(e.target.value) : e.target.value})}
                        placeholder={col.label}
                      />
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 flex justify-end gap-2">
                  <button onClick={handleSaveNew} className="text-emerald-400 hover:bg-emerald-400/20 p-1 rounded"><Check size={16}/></button>
                  <button onClick={() => setIsAdding(false)} className="text-red-400 hover:bg-red-400/20 p-1 rounded"><X size={16}/></button>
                </td>
              </tr>
            )}

            {data.map(item => {
              const isEditing = editingId === item.id;
              
              return (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {columns.map(col => (
                    <td key={`${item.id}-${col.key}`} className="px-4 py-3">
                      {isEditing ? (
                        col.type === 'status' ? (
                          <select 
                            className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-cyan-500 w-full"
                            value={editFormData[col.key]}
                            onChange={(e) => setEditFormData({...editFormData, [col.key]: e.target.value})}
                          >
                            <option>Planejado</option>
                            <option>Comprado</option>
                            <option>Instalado</option>
                          </select>
                        ) : col.type === 'priority' ? (
                          <select 
                            className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-cyan-500 w-full"
                            value={editFormData[col.key]}
                            onChange={(e) => setEditFormData({...editFormData, [col.key]: e.target.value})}
                          >
                            <option>Baixa</option>
                            <option>Média</option>
                            <option>Alta</option>
                            <option>Crítica</option>
                          </select>
                        ) : (
                          <input 
                            type={col.type === 'number' ? 'number' : 'text'}
                            className="bg-black/50 border border-cyan-500/50 rounded px-2 py-1 outline-none focus:border-cyan-400 w-full"
                            value={editFormData[col.key]}
                            onChange={(e) => setEditFormData({...editFormData, [col.key]: col.type === 'number' ? Number(e.target.value) : e.target.value})}
                          />
                        )
                      ) : (
                        col.type === 'status' ? (
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            item[col.key] === 'Instalado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            item[col.key] === 'Comprado' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {item[col.key] || 'Planejado'}
                          </span>
                        ) : col.type === 'priority' ? (
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            item[col.key] === 'Crítica' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            item[col.key] === 'Alta' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                            item[col.key] === 'Média' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {item[col.key] || 'Média'}
                          </span>
                        ) : col.type === 'number' ? (
                          <span className="font-mono text-cyan-400">R$ {item[col.key]?.toLocaleString('pt-BR')}</span>
                        ) : (
                          <span className="font-semibold text-white">{item[col.key]}</span>
                        )
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 flex justify-end gap-3">
                    {isEditing ? (
                      <>
                        <button onClick={handleSaveEdit} className="text-emerald-400 hover:text-emerald-300"><Check size={16}/></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white"><X size={16}/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(item)} className="text-gray-500 hover:text-cyan-400"><Edit2 size={16}/></button>
                        <button onClick={() => onRemove(item.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={16}/></button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            
            {data.length === 0 && !isAdding && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  Nenhum item adicionado nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

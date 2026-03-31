import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export function ClienteModal({ cliente, onClose }) {
  const { addCliente, updateCliente } = useStore();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    documento: ''
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        documento: cliente.documento || ''
      });
    }
  }, [cliente]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cliente) {
      updateCliente(cliente.id, formData);
    } else {
      addCliente(formData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="clienteForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo / Razão Social *</label>
              <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="Ex: João da Silva" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ</label>
              <input type="text" name="documento" value={formData.documento} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="000.000.000-00" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / Celular</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="(00) 00000-0000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="exemplo@email.com" />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
          <button type="submit" form="clienteForm" className="px-5 py-2 bg-brand-600 text-white font-medium hover:bg-brand-700 rounded-lg transition-colors">
            {cliente ? 'Salvar Alterações' : 'Cadastrar Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}

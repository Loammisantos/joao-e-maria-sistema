import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Search, Plus, Edit2, Trash2, MessageCircle } from 'lucide-react';
import { ClienteModal } from '../components/clientes/ClienteModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal'; // Reusing generic delete UI

export function Clientes() {
  const { clientes, deleteCliente } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.documento && c.documento.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = () => {
    setClienteToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setClienteToEdit(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = (cliente) => {
    setClienteToDelete(cliente);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (clienteToDelete) {
      deleteCliente(clienteToDelete.id);
    }
  };

  const openWhatsApp = (cliente) => {
    if (!cliente.telefone) return;
    const cleanPhone = cliente.telefone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${cliente.nome}, tudo bem?`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Novo Cliente</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, documento ou email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
            {filteredClientes.length} clientes encontrados
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Cliente</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Documento</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Contato</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm w-32 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClientes.map(cliente => (
                <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{cliente.nome}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {cliente.documento || <span className="text-slate-400 font-normal">Não informado</span>}
                  </td>
                  <td className="px-6 py-4">
                    {cliente.telefone && <div className="text-slate-800 text-sm">{cliente.telefone}</div>}
                    {cliente.email && <div className="text-slate-500 text-xs">{cliente.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {cliente.telefone && (
                        <button 
                          onClick={() => openWhatsApp(cliente)} 
                          className="text-slate-400 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-lg" 
                          title="Falar no WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => handleEdit(cliente)} className="text-slate-400 hover:text-brand-600 transition-colors p-2 hover:bg-brand-50 rounded-lg" title="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(cliente)} className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg" title="Excluir">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClientes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ClienteModal 
          cliente={clienteToEdit} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmModal 
          customMessage={`Tem certeza que deseja excluir o cliente ${clienteToDelete?.nome}?`}
          onConfirm={confirmDelete} 
          onClose={() => setIsDeleteOpen(false)} 
        />
      )}
    </div>
  );
}

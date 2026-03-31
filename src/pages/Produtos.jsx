import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Search, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { ProductModal } from '../components/products/ProductModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';

export function Produtos() {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigoBarras.includes(searchTerm) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Produtos</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, código ou categoria..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {filteredProducts.length} produtos encontrados
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Produto</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Categoria</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Preço</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Estoque</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-sm w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => {
                let statusColor = "bg-green-100 text-green-700";
                let statusText = "OK";
                if (product.estoque === 0) {
                  statusColor = "bg-red-100 text-red-700";
                  statusText = "Esgotado";
                } else if (product.estoque <= product.estoqueMinimo) {
                  statusColor = "bg-yellow-100 text-yellow-700";
                  statusText = "Alerta";
                }

                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{product.nome}</div>
                      <div className="text-slate-500 text-xs mt-1">Cód: {product.codigoBarras}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                        {product.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      R$ {product.preco?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {product.estoque} <span className="text-slate-400 text-xs">/ min: {product.estoqueMinimo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${statusColor}`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEdit(product)} className="text-slate-400 hover:text-brand-600 transition-colors" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product)} className="text-slate-400 hover:text-red-600 transition-colors" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
          product={productToEdit} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmModal 
          product={productToDelete} 
          onClose={() => setIsDeleteOpen(false)} 
        />
      )}
    </div>
  );
}

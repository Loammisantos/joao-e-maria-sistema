import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export function ProductModal({ product, onClose }) {
  const { addProduct, updateProduct } = useStore();
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'Papelaria',
    descricao: '',
    preco: '',
    codigoBarras: '',
    estoque: '',
    estoqueMinimo: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        categoria: product.categoria,
        descricao: product.descricao || '',
        preco: product.preco,
        codigoBarras: product.codigoBarras,
        estoque: product.estoque,
        estoqueMinimo: product.estoqueMinimo
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      preco: parseFloat(formData.preco),
      estoque: parseInt(formData.estoque, 10),
      estoqueMinimo: parseInt(formData.estoqueMinimo, 10),
      vendas30dias: product ? product.vendas30dias : 0
    };

    if (product) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto *</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="Ex: Caderno Universitário" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
                <select required name="categoria" value={formData.categoria} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none">
                  <option value="Papelaria">Papelaria</option>
                  <option value="Livros">Livros</option>
                  <option value="Brinquedos">Brinquedos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código de Barras *</label>
                <input required type="text" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preço de Venda (R$) *</label>
                <input required type="number" step="0.01" min="0" name="preco" value={formData.preco} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estoque *</label>
                  <input required type="number" min="0" name="estoque" value={formData.estoque} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Min. *</label>
                  <input required type="number" min="0" name="estoqueMinimo" value={formData.estoqueMinimo} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea rows="3" name="descricao" value={formData.descricao} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
          <button type="submit" form="productForm" className="px-5 py-2 bg-brand-600 text-white font-medium hover:bg-brand-700 rounded-lg transition-colors">
            {product ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </div>
      </div>
    </div>
  );
}

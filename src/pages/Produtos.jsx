import React, { useState, useMemo } from 'react';
import { useStore } from '../store/StoreContext';
import { Search, Plus, Edit2, Trash2, AlertCircle, Filter, X } from 'lucide-react';
import { ProductModal } from '../components/products/ProductModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';

const getCategoryColor = (category) => {
  const colors = {
    'Papelaria': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Livros': 'bg-sky-50 text-sky-600 border-sky-100',
    'Brinquedos': 'bg-amber-50 text-amber-600 border-amber-100',
    'Informática': 'bg-purple-50 text-purple-600 border-purple-100',
    'Limpeza': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Alimentos': 'bg-rose-50 text-rose-600 border-rose-100',
    'Escolar': 'bg-blue-50 text-blue-600 border-blue-100',
  };
  return colors[category] || 'bg-slate-50 text-slate-600 border-slate-100';
};

export function Produtos() {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // New States for Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [priceRange, setPriceRange] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Categories list
  const categories = useMemo(() => {
    const rawCategories = products.map(p => p.categoria);
    return [...new Set(rawCategories)].sort();
  }, [products]);

  // Combined Filter logic
  const filteredProducts = products.filter(p => {
    // 1. Text Search
    const matchesSearch = 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoBarras.includes(searchTerm) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category Filter
    const matchesCategory = !selectedCategory || p.categoria === selectedCategory;
    
    // 3. Stock Status Filter
    let matchesStock = true;
    if (stockStatus === 'out') matchesStock = p.estoque === 0;
    else if (stockStatus === 'alert') matchesStock = p.estoque > 0 && p.estoque <= p.estoqueMinimo;
    else if (stockStatus === 'ok') matchesStock = p.estoque > p.estoqueMinimo;

    // 4. Price Range Filter
    let matchesPrice = true;
    if (priceRange === 'under50') matchesPrice = p.preco < 50;
    else if (priceRange === '50to100') matchesPrice = p.preco >= 50 && p.preco <= 100;
    else if (priceRange === '100to500') matchesPrice = p.preco > 100 && p.preco <= 500;
    else if (priceRange === 'over500') matchesPrice = p.preco > 500;

    return matchesSearch && matchesCategory && matchesStock && matchesPrice;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setStockStatus('');
    setPriceRange('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || stockStatus || priceRange;

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
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Produtos</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        {/* Filter Bar and Search */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou código..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {filteredProducts.length} produtos encontrados
            </div>
          </div>

          {/* New Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
               <span className="pl-2 pr-1 text-[10px] font-bold text-slate-400 uppercase">Categoria</span>
               <select 
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-white border-none text-xs font-medium text-slate-600 rounded-lg py-1.5 pr-8 focus:ring-0 cursor-pointer shadow-sm"
               >
                 <option value="">Todas</option>
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
               <span className="pl-2 pr-1 text-[10px] font-bold text-slate-400 uppercase">Estoque</span>
               <select 
                value={stockStatus}
                onChange={e => setStockStatus(e.target.value)}
                className="bg-white border-none text-xs font-medium text-slate-600 rounded-lg py-1.5 pr-8 focus:ring-0 cursor-pointer shadow-sm"
               >
                 <option value="">Todos os Status</option>
                 <option value="ok">Disponível</option>
                 <option value="alert">Em Alerta</option>
                 <option value="out">Esgotado</option>
               </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
               <span className="pl-2 pr-1 text-[10px] font-bold text-slate-400 uppercase">Preço</span>
               <select 
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="bg-white border-none text-xs font-medium text-slate-600 rounded-lg py-1.5 pr-8 focus:ring-0 cursor-pointer shadow-sm"
               >
                 <option value="">Todos os Preços</option>
                 <option value="under50">Abaixo de R$ 50</option>
                 <option value="50to100">R$ 50 - R$ 100</option>
                 <option value="100to500">R$ 100 - R$ 500</option>
                 <option value="over500">Acima de R$ 500</option>
               </select>
            </div>

            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase px-3"
              >
                <X size={14} />
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 sticky top-0 border-b border-slate-100 backdrop-blur-sm z-10">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Preço</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Estoque</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map(product => {
                let statusColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                let statusText = "Em Estoque";
                if (product.estoque === 0) {
                  statusColor = "bg-rose-50 text-rose-600 border-rose-100";
                  statusText = "Esgotado";
                } else if (product.estoque <= product.estoqueMinimo) {
                  statusColor = "bg-amber-50 text-amber-600 border-amber-100";
                  statusText = "Alerta";
                }

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700 leading-tight group-hover:text-brand-600 transition-colors">{product.nome}</div>
                      <div className="text-slate-400 text-[10px] mt-1 font-medium italic">Barcode: {product.codigoBarras}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight border ${getCategoryColor(product.categoria)}`}>
                        {product.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      R$ {product.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      <span className="text-slate-700">{product.estoque}</span> <span className="text-[10px] text-slate-300">/ min: {product.estoqueMinimo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-100 hover:shadow-sm transition-all" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product)} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-100 hover:shadow-sm transition-all" title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <Search size={24} />
                      </div>
                      <p className="text-slate-400 text-sm italic">Nenhum produto atende aos filtros selecionados.</p>
                      <button onClick={clearFilters} className="text-brand-600 font-bold text-xs uppercase hover:underline">Limpar Filtros</button>
                    </div>
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

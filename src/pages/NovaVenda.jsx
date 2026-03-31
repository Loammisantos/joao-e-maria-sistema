import React, { useState, useMemo } from 'react';
import { useStore } from '../store/StoreContext';
import { Search, Plus, Minus, Trash2, ShoppingBag, CheckCircle2, X, ScanLine } from 'lucide-react';
import { BarcodeScanner } from '../components/products/BarcodeScanner';

export function NovaVenda() {
  const { products, registerSale } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [discountType, setDiscountType] = useState('percent'); // 'percent' or 'value'
  const [discountInput, setDiscountInput] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'cart' for mobile
  const [isScanning, setIsScanning] = useState(false);

  const maxDiscountPercent = 30; // configurable maximum

  // Filter products that have stock > 0
  const availableProducts = products.filter(p => p.estoque > 0);
  const searchResults = availableProducts.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigoBarras.includes(searchTerm)
  );

  // Cart logic
  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantidade >= product.estoque) return prev; // prevent exceeding stock
        return prev.map(item => item.id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
    setSearchTerm('');
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQtd = item.quantidade + delta;
        if (newQtd <= 0) return null;
        if (newQtd > item.estoque) return item; // limit to stock
        return { ...item, quantidade: newQtd };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0), [cart]);
  
  const calculatedDiscount = useMemo(() => {
    if (!discountInput || discountInput <= 0) return 0;
    
    let amount = 0;
    if (discountType === 'percent') {
      const percent = Math.min(discountInput, maxDiscountPercent);
      amount = subtotal * (percent / 100);
    } else {
      amount = Math.min(discountInput, subtotal * (maxDiscountPercent / 100)); // cap value at max % limit
    }
    return amount;
  }, [subtotal, discountInput, discountType]);

  const total = subtotal - calculatedDiscount;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const saleData = {
      items: cart,
      subtotal,
      desconto: calculatedDiscount,
      total,
    };

    const newSale = registerSale(saleData);
    setLastSale(newSale);
    setShowReceipt(true);
    
    // Reset state
    setCart([]);
    setDiscountInput(0);
    setSearchTerm('');
  };

  if (showReceipt) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm w-full relative">
          <button 
            onClick={() => setShowReceipt(false)} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-1 rounded-full"
            title="Fechar"
          >
            <X size={20} />
          </button>
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Venda Concluída!</h2>
          <p className="text-slate-500 mb-6">A venda foi registrada e o estoque atualizado com sucesso.</p>
          
          <div className="bg-slate-50 p-4 rounded-xl text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Comprovante:</span>
              <span className="font-mono text-slate-700">#{lastSale?.id.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Itens:</span>
              <span className="font-medium text-slate-700">{lastSale?.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Pago:</span>
              <span className="font-bold text-brand-700">R$ {lastSale?.total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => setShowReceipt(false)}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
          >
            Nova Venda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Mobile Tab Toggle */}
      <div className="md:hidden flex bg-white p-2 shrink-0 rounded-xl mb-4 shadow-sm border border-slate-200">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === 'search' ? 'bg-brand-600 text-white' : 'text-slate-500'}`}
        >
          Pesquisa
        </button>
        <button 
          onClick={() => setActiveTab('cart')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === 'cart' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
        >
          Carrinho {cart.length > 0 && <span className="bg-brand-500 px-2 rounded-full text-white">{cart.length}</span>}
        </button>
      </div>

      <div className="flex flex-1 gap-0 md:gap-6 overflow-hidden">
        {/* Left Column: Product Search */}
        <div className={`flex-1 flex-col bg-white md:rounded-xl shadow-sm border border-slate-200 overflow-hidden ${activeTab === 'search' ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar produto ou código de barras..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-lg shadow-sm"
              autoFocus
            />
            <button 
              onClick={() => setIsScanning(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-600 p-2 bg-brand-50 rounded-lg hover:bg-brand-200 transition-colors"
              title="Ler Código de Barras"
            >
              <ScanLine size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map(p => (
              <button 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="text-left p-4 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all group flex flex-col justify-between h-32"
              >
                <div>
                  <div className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-700">{p.nome}</div>
                  <div className="text-xs text-slate-500 mt-1">{p.codigoBarras}</div>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <div className="text-lg font-bold text-slate-800">R$ {p.preco.toFixed(2)}</div>
                  <div className="text-xs font-medium text-brand-600 bg-brand-100 px-2 py-1 rounded-md">
                    Estoque: {p.estoque}
                  </div>
                </div>
              </button>
            ))}
            {searchResults.length === 0 && (
              <div className="col-span-2 text-center text-slate-500 py-12">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Cart */}
      <div className={`w-full md:w-[400px] shrink-0 bg-slate-900 md:rounded-xl shadow-xl flex-col overflow-hidden text-white ${activeTab === 'cart' ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} className="text-brand-500" />
            Carrinho
          </h2>
          <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
            {cart.length} itens
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <ShoppingBag size={48} className="mb-4 text-slate-700" />
              <p>Adicione produtos para iniciar uma venda.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex-1 pr-3">
                    <div className="font-medium text-slate-200 leading-tight">{item.nome}</div>
                    <div className="text-emerald-400 font-bold mt-1">R$ {item.preco.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Minus size={16} /></button>
                    <span className="w-6 text-center font-bold text-slate-200">{item.quantidade}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="ml-3 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Summary */}
        <div className="bg-slate-950 p-5 mt-auto">
          <div className="space-y-3 mb-5">
            <div className="flexjustify-between text-slate-400 font-medium">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium whitespace-nowrap">Desconto</span>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                  <button 
                    onClick={() => setDiscountType('percent')} 
                    className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${discountType === 'percent' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                  >
                    %
                  </button>
                  <button 
                    onClick={() => setDiscountType('value')} 
                    className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${discountType === 'value' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                  >
                    R$
                  </button>
                </div>
                <input 
                  type="number" 
                  min="0" 
                  value={discountInput || ''} 
                  onChange={e => setDiscountInput(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-brand-500 text-right font-medium"
                />
              </div>
            </div>
            
            {calculatedDiscount > 0 && (
              <div className="flex justify-between text-brand-400 font-bold">
                <span>Desconto Aplicado</span>
                <span>- R$ {calculatedDiscount.toFixed(2)}</span>
              </div>
            )}
            
            {discountInput > 0 && calculatedDiscount < (discountType === 'value' ? discountInput : (subtotal * discountInput / 100)) && (
               <div className="text-xs text-orange-400 text-right">
                 *Desconto limitado a {maxDiscountPercent}%
               </div>
            )}
            
            <div className="flex justify-between text-white text-2xl font-black pt-3 border-t border-slate-800">
              <span>Total</span>
              <span className="text-brand-500">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-4 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            Confirmar Venda
            {cart.length > 0 && <span className="ml-2 font-black">- R$ {total.toFixed(2)}</span>}
          </button>
        </div>
      </div>
      </div>

      {isScanning && (
        <BarcodeScanner 
          onScan={(code) => {
            setSearchTerm(code);
            // Optionally, automatically add to cart if exactly one match
            const match = availableProducts.find(p => p.codigoBarras === code);
            if(match) addToCart(match);
          }}
          onClose={() => setIsScanning(false)}
        />
      )}
    </div>
  );
}

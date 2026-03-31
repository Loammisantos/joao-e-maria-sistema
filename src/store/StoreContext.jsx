import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts';
import { mockClientes } from '../data/mockClientes';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('storeos_products');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('storeos_products', JSON.stringify(mockProducts));
    return mockProducts;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('storeos_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [clientes, setClientes] = useState(() => {
    const saved = localStorage.getItem('storeos_clientes');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('storeos_clientes', JSON.stringify(mockClientes));
    return mockClientes;
  });

  // Persist state when it changes
  useEffect(() => {
    localStorage.setItem('storeos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('storeos_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('storeos_clientes', JSON.stringify(clientes));
  }, [clientes]);

  // Product Actions
  const addProduct = (product) => {
    setProducts(prev => [{ ...product, id: crypto.randomUUID() }, ...prev]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Sales Actions
  const registerSale = (saleData) => {
    const newSale = {
      ...saleData,
      id: crypto.randomUUID(),
      data: new Date().toISOString()
    };
    
    // Deduct stock
    setProducts(prev => prev.map(p => {
      const soldItem = saleData.items.find(item => item.id === p.id);
      if (soldItem) {
        return { ...p, estoque: p.estoque - soldItem.quantidade, vendas30dias: p.vendas30dias + soldItem.quantidade };
      }
      return p;
    }));

    setSales(prev => [newSale, ...prev]);
    return newSale;
  };

  // Clientes Actions
  const addCliente = (clienteData) => {
    setClientes(prev => [{ ...clienteData, id: crypto.randomUUID() }, ...prev]);
  };

  const updateCliente = (id, updatedData) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products,
      sales,
      clientes,
      addProduct,
      updateProduct,
      deleteProduct,
      registerSale,
      addCliente,
      updateCliente,
      deleteCliente
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

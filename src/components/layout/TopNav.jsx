import React, { useMemo } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export function TopNav() {
  const { products } = useStore();

  const alertsCount = useMemo(() => {
    return products.filter(p => p.estoque <= p.estoqueMinimo).length;
  }, [products]);

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
      <div className="flex items-center text-slate-800 font-bold gap-2">
        <h2 className="md:hidden">J&M</h2>
        <h2 className="hidden md:block">Ponto de Venda</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
          <Bell size={20} />
          {alertsCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {alertsCount}
            </span>
          )}
        </button>
        <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold border border-brand-200">
          O
        </div>
      </div>
    </header>
  );
}

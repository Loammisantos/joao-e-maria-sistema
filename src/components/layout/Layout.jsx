import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useStore } from '../../store/StoreContext';
import { AlertTriangle } from 'lucide-react';

export function Layout() {
  const { products } = useStore();
  const criticalProducts = products.filter(p => p.estoque === 0);

  return (
    <div className="flex h-[100dvh] bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden pb-16 md:pb-0">
        <TopNav />
        {criticalProducts.length > 0 && (
          <div className="bg-red-50 border-b border-red-200 px-8 py-3 flex items-center gap-3 text-red-800 text-sm">
            <AlertTriangle size={18} className="text-red-500" />
            <span className="font-medium">Alerta Crítico:</span>
            <span>Há {criticalProducts.length} produto(s) com estoque zerado no momento.</span>
          </div>
        )}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

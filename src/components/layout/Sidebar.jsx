import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const routes = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/venda', name: 'Nova Venda', icon: ShoppingCart },
    { path: '/produtos', name: 'Produtos', icon: Package },
    { path: '/clientes', name: 'Clientes', icon: Users },
  ];

  return (
    <>
    {/* Desktop Sidebar */}
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col h-screen shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">J<span className="text-brand-500">&</span>M</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Gestão de Loja</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                isActive 
                  ? "bg-brand-600 text-white" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              {route.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">
        MVP v1.0
      </div>
    </aside>

    {/* Mobile Bottom Bar */}
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 text-slate-400 flex justify-around items-center h-16 border-t border-slate-800 z-50 pb-safe">
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors",
              isActive ? "text-brand-500" : "hover:text-slate-200"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{route.name}</span>
          </NavLink>
        );
      })}
    </nav>
    </>
  );
}

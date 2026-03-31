import React, { useMemo, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, AlertTriangle, Lightbulb } from 'lucide-react';

// Mock Data for charts representing past performance
const mockSalesEvolution = Array.from({ length: 30 }).map((_, i) => ({
  dia: `Dia ${i + 1}`,
  vendas: Math.floor(Math.random() * 5000) + 1000,
}));

const mockCategoryData = [
  { name: 'Papelaria', value: 4500, color: '#3b82f6' },
  { name: 'Livros', value: 3200, color: '#8b5cf6' },
  { name: 'Brinquedos', value: 2800, color: '#ec4899' }
];

const mockInsights = [
  "📦 'Caderno Universitário' está no fim do estoque e é o 2º mais vendido. Hora de repor.",
  "📈 Brinquedos educativos cresceram 40% essa semana. Considere ampliar a vitrine.",
  "⚠️ 3 produtos de Papelaria não têm nenhuma venda nos últimos 30 dias.",
  "💡 Sexta-feira é o dia com maior volume de vendas. Planeje promoções para esse dia."
];

export function Dashboard() {
  const { sales, products } = useStore();
  
  const [selectedMonth, setSelectedMonth] = useState('all');

  const filteredSales = useMemo(() => {
    if (selectedMonth === 'all') return sales;
    const now = new Date();
    return sales.filter(s => {
      const saleDate = new Date(s.data);
      if (selectedMonth === 'current') {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      } else if (selectedMonth === 'last') {
        let lastMonth = now.getMonth() - 1;
        let year = now.getFullYear();
        if (lastMonth < 0) {
          lastMonth = 11;
          year -= 1;
        }
        return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === year;
      }
      return true;
    });
  }, [sales, selectedMonth]);

  const periodSalesTotal = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const periodSalesCount = filteredSales.length;
  const ticketMedio = periodSalesCount > 0 ? (periodSalesTotal / periodSalesCount) : 0;

  const criticalStock = products.filter(p => p.estoque <= p.estoqueMinimo)
                                .sort((a, b) => a.estoque - b.estoque)
                                .slice(0, 5);

  const topProducts = [...products]
    .sort((a, b) => b.vendas30dias - a.vendas30dias)
    .slice(0, 5)
    .map(p => ({ nome: p.nome.length > 20 ? p.nome.substring(0, 20) + '...' : p.nome, vendas: p.vendas30dias }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
        <select 
          value={selectedMonth} 
          onChange={e => setSelectedMonth(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
        >
          <option value="all">Todo o Período</option>
          <option value="current">Mês Atual</option>
          <option value="last">Mês Anterior</option>
        </select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Faturamento</p>
            <p className="text-2xl font-bold text-slate-800">R$ {periodSalesTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pedidos</p>
            <p className="text-2xl font-bold text-slate-800">{periodSalesCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
            <p className="text-2xl font-bold text-slate-800">R$ {ticketMedio.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Alertas de Estoque</p>
            <p className="text-2xl font-bold text-slate-800">{criticalStock.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Evolução de Vendas (30 dias)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSalesEvolution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="dia" tick={{fontSize: 12}} stroke="#94a3b8" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} tick={{fontSize: 12}} stroke="#94a3b8" />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Vendas']} />
                <Line type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-xl shadow-sm text-white flex flex-col">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Lightbulb size={20} className="text-brand-300" />
            Insights J&M
          </h2>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {mockInsights.map((insight, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-lg text-sm leading-relaxed backdrop-blur-sm border border-white/10">
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Vendas por Categoria</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Products Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Top 5 Mais Vendidos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="nome" type="category" tick={{fontSize: 11}} stroke="#64748b" width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="vendas" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Alerts List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            Estoque em Alerta
          </h2>
          <div className="space-y-3">
            {criticalStock.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">Nenhum produto em alerta.</p>
            ) : (
              criticalStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 text-red-900 rounded-lg border border-red-100">
                  <div className="truncate pr-2 flex-1 font-medium text-sm">
                    {p.nome}
                  </div>
                  <div className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs whitespace-nowrap">
                    {p.estoque} un.
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

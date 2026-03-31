import React, { useMemo, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  Lightbulb, 
  Package, 
  Calendar,
  BarChart3,
  CalendarCheck
} from 'lucide-react';

export function Dashboard() {
  const { sales, products } = useStore();
  
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Date formatting for the header
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(today);

  const filteredSales = useMemo(() => {
    const now = new Date();
    if (selectedMonth === 'all') return sales;
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

  // Metric calculations
  const salesToday = sales.filter(s => {
    const saleDate = new Date(s.data);
    return saleDate.toDateString() === today.toDateString();
  });
  const totalToday = salesToday.reduce((sum, s) => sum + s.total, 0);

  const last7DaysSales = sales.filter(s => {
    const saleDate = new Date(s.data);
    const diffTime = Math.abs(today - saleDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  const totalLast7Days = last7DaysSales.reduce((sum, s) => sum + s.total, 0);
  const ticketMedio = last7DaysSales.length > 0 ? (totalLast7Days / last7DaysSales.length) : 0;

  const totalProducts = products.length;
  const criticalProducts = products.filter(p => p.estoque === 0).length;
  const alertProducts = products.filter(p => p.estoque > 0 && p.estoque <= p.estoqueMinimo).length;

  const stockAlerts = products.filter(p => p.estoque <= p.estoqueMinimo)
                                .sort((a, b) => a.estoque - b.estoque)
                                .slice(0, 4);

  const topProducts = [...products]
    .sort((a, b) => b.vendas30dias - a.vendas30dias)
    .slice(0, 5)
    .map(p => ({ 
      nome: p.nome.length > 15 ? p.nome.substring(0, 15) + '...' : p.nome, 
      vendas: p.vendas30dias 
    }));

  const mockCategoryData = [
    { name: 'Brinquedos', value: 2800, color: '#f59e0b' }, // Yellow-orange
    { name: 'Livros', value: 3200, color: '#0ea5e9' }, // Sky-blue
    { name: 'Papelaria', value: 4500, color: '#6366f1' }  // Indigo-blue
  ];

  // Mock data for 30 days evolution to match image
  const evolutionData = Array.from({ length: 30 }).map((_, i) => ({
    dia: `${i + 1}/03`,
    vendas: 1000 + Math.random() * 1200,
  }));

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 capitalize">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="text-slate-400" size={20} />
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)}
            className="bg-white border border-slate-200 text-slate-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium shadow-sm"
          >
            <option value="all">Todo o Período</option>
            <option value="current">Mês Atual</option>
            <option value="last">Mês Anterior</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vendas Hoje */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vendas Hoje</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              R$ {totalToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total acumulado hoje</p>
          </div>
        </div>

        {/* Vendas Semana */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <BarChart3 size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vendas Semana</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              R$ {totalLast7Days.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Últimos 7 dias</p>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CalendarCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Últimos 7 dias</p>
          </div>
        </div>

        {/* Total Produtos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Produtos</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">{totalProducts}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className={criticalProducts > 0 ? "text-red-500 font-medium" : ""}>{criticalProducts} críticos</span>, {alertProducts} alertas
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Best Sellers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-6">Top 5 Mais Vendidos (30 dias)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: -10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="nome" type="category" tick={{fontSize: 11, fill: '#64748b'}} width={100} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="vendas" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-6">Vendas por Categoria</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle" 
                  iconSize={8}
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-6">Evolução 30 Dias</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dia" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="vendas" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Alerts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-800">Alertas de Estoque</h2>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {products.filter(p => p.estoque <= p.estoqueMinimo).length} produtos
            </span>
          </div>
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {stockAlerts.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10 italic">Nenhum alerta de estoque no momento.</p>
            ) : (
              stockAlerts.map(p => (
                <div key={p.id} className="flex items-center justify-between group">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{p.nome}</h3>
                    <p className="text-[11px] text-slate-400">{p.categoria} • Min: {p.estoqueMinimo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{p.estoque} un.</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Alerta</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            Insights Estratégicos
          </h2>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">Fim de Semana Gera 60% a Mais</h4>
                <p className="text-[11px] text-indigo-700/80 leading-relaxed mt-1">
                  As vendas de fim de semana são em média 64% maiores que os dias úteis. Garanta estoque completo às sextas-feiras para maximizar faturamento.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-200">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-900">Brinquedos: Categoria em Alta</h4>
                <p className="text-[11px] text-purple-700/80 leading-relaxed mt-1">
                  Brinquedos representam 45% das vendas em volume. Amplie o mix com jogos de cartas e brinquedos educativos para diversificar e crescer na categoria.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
                <Lightbulb size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">Ticket Médio Pode Aumentar</h4>
                <p className="text-[11px] text-blue-700/80 leading-relaxed mt-1">
                  Crie combos Caderno + Caneta + Marca-texto por R$ 69,90 (vs. R$ 81,50 separados). Essa estratégia pode elevar o ticket médio em 20-30%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

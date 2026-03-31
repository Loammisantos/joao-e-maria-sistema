import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { NovaVenda } from './pages/NovaVenda';
import { Produtos } from './pages/Produtos';
import { Clientes } from './pages/Clientes';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/venda" element={<NovaVenda />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Clientes />} />
      </Route>
    </Routes>
  );
}

export default App;

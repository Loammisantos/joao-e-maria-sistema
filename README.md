# J&M Store - Sistema de Gestão (MVP)

O **J&M Store** é um sistema de PDV (Ponto de Venda) e Gestão para lojas físicas de papelaria, livros e brinquedos. Este projeto é um MVP funcional com dados mockados e persistência local via `localStorage`.

## ✨ Funcionalidades

- **Dashboard:** Métricas de vendas hoje, ticket médio e alertas de estoque.
- **PDV (Nova Venda):** Registro rápido de vendas com suporte a scanner de código de barras (mobile).
- **Checkout:** Cálculo de subtotal e descontos (até 30%).
- **Gestão de Produtos:** CRUD completo com busca em tempo real e controle de estoque.
- **Gestão de Clientes:** Cadastro e listagem de clientes (PF/PJ).
- **Design Responsivo:** Otimizado para desktop e dispositivos móveis (com bottom bar estilo App).

## 🚀 Tecnologias

- React 19
- Vite
- Tailwind CSS v4
- Lucide React (Ícones)
- Recharts (Gráficos)
- HTML5 QR Code (Scanner)

## 📦 Como rodar o projeto

1. Instale as dependências: `npm install`
2. Inicie o servidor de desenvolvimento: `npm run dev`
3. Para gerar a versão de produção: `npm run build`

## 🌐 Publicação

Este projeto está pronto para ser publicado em plataformas como **Vercel** ou **Netlify**. Basta conectar o repositório GitHub e configurar o comando de build como `npm run build` e a pasta de saída como `dist`.

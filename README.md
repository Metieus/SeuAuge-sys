# Meu Auge - Sistema de Bem-estar

Plataforma web desenvolvida em React + TypeScript para gerenciamento de vídeos de saúde e loja de produtos. Utiliza Firebase para autenticação, Firestore e Storage.

## Funcionalidades

- Autenticação de usuários e controle de planos
- Listagem de vídeos com filtros e acesso condicionado ao plano
- Loja com carrinho e favoritos
- Área administrativa (para usuários com permissão)
- Tema claro/escuro e layout responsivo

## Requisitos

- Node.js 18+
- Configurar variáveis de ambiente em um arquivo `.env` conforme o exemplo abaixo:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_EMAIL=admin@seuauge.com
VITE_PAYMENT_URL=https://pagamento.exemplo.com
VITE_BYPASS_PLAN_GUARD=true
```

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

A aplicação será servida em `http://localhost:5173`.

## Build para produção

```bash
npm run build
```

O resultado ficará na pasta `dist/`.

## Licença

Projeto educacional sem fins comerciais.

# Sistema de Gerenciamento de Usuários

Este projeto consiste em uma aplicação web para gerenciamento de usuários com backend em Node.js/Express e frontend em React.

## Estrutura do Projeto

```
.
├── backend/     # Servidor Express + MySQL
├── frontend/    # Aplicação React
```

## Instruções de Instalação

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

O servidor estará rodando em http://localhost:3001

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie a aplicação:
```bash
npm start
```

A aplicação estará disponível em http://localhost:3000

## Planilha

## Configuração do Ambiente

### Variáveis de Ambiente

#### Backend
Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

#### Frontend
Crie um arquivo `.env` na pasta `frontend` com as seguintes variáveis:
```
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Instalação

1. Clone o repositório
2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

4. Configure suas variáveis de ambiente conforme descrito acima

5. Inicie o backend:
```bash
cd backend
npm start
```

6. Inicie o frontend:
```bash
cd frontend
npm start
```

## Banco de Dados

O projeto utiliza o Supabase como banco de dados. Você precisará:

1. Criar uma conta no Supabase (https://supabase.com)
2. Criar um novo projeto
3. Obter as credenciais (URL e Chave Anônima) do seu projeto
4. Configurar as variáveis de ambiente conforme descrito acima

### Estrutura da Tabela

A tabela `user` deve ter a seguinte estrutura no Supabase:

```sql
create table user (
  id bigint primary key generated always as identity,
  id_user text,
  createdat timestamp with time zone default timezone('utc'::text, now()),
  updateat timestamp with time zone default timezone('utc'::text, now()),
  companyid bigint,
  name text,
  "shortName" text,
  email text,
  "phoneNumberFormatted" text,
  profile text,
  "clienteName" text,
  active boolean default true
);
```

## Funcionalidades

- Listagem paginada de usuários
- Filtros por empresa
- Busca por nome ou email
- Filtro por status ativo
- Interface responsiva e intuitiva 
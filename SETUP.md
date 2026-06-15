# Setup Guide - Não Vá Que É Barril

Guia completo para configurar e executar o projeto localmente.

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js v18 ou superior**
   - Download: https://nodejs.org/
   - Verificar: `node --version`

2. **Git** (opcional, mas recomendado)
   - Download: https://git-scm.com/

**Nota:** Este projeto usa **SQLite**, então NÃO precisa instalar PostgreSQL! 🎉

## 📦 Instalação

### Passo 1: Clonar/Acessar o Projeto

```bash
cd c:\Users\ÊXITO-01\Desktop\bdd
```

### Passo 2: Configurar o Backend

```bash
# Navegue para a pasta do servidor
cd server

# Instale as dependências (se não tiver feito)
npm install

# Execute as migrações do banco de dados (cria o arquivo SQLite)
npm run migrate

# O output deve mostrar: "Database migration completed successfully!"
```

### Passo 3: Configurar o Frontend

```bash
# Em outra aba/terminal, navegue para o cliente
cd client

# Instale as dependências (se não tiver feito)
npm install
```

## 🚀 Executar o Projeto

### Terminal 1: Backend (API)

```bash
cd server
npm run dev
```

Você deve ver: `Server running on http://localhost:5000`

### Terminal 2: Frontend (Web)

```bash
cd client
npm start
```

Automaticamente abrirá `http://localhost:3000` no navegador.

## ✅ Verificar a Instalação

### Backend:
- Acesse: `http://localhost:5000`
- Deve retornar um JSON com informações da API

### Frontend:
- Acesse: `http://localhost:3000`
- Deve carregar a Landing Page com os botões de Login e Registro

### Banco de Dados:
- Um arquivo `navaqueebarril.db` será criado em `server/`
- Este é seu banco de dados SQLite

## 🧪 Executar Testes BDD

```bash
# A partir da raiz do projeto (na pasta server)
npm run test:features
```

## 📝 Arquivo .env

O arquivo `.env` já foi criado com valores padrão. Você geralmente não precisa modificar:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=super_secret_jwt_key_change_in_production
INSTITUTION_EMAIL_DOMAIN=ufba.br
```

### Variáveis Importantes:
- `PORT`: Porta do servidor (padrão: 5000)
- `JWT_SECRET`: Chave secreta para tokens JWT (mude em produção!)
- `INSTITUTION_EMAIL_DOMAIN`: Domínio de e-mail permitido (padrão: ufba.br)

## 🐛 Solução de Problemas

### Erro: "Porta 5000 já está em uso"
- Mude a porta em `.env`
- Ou finalize o processo usando a porta: `netstat -ano | findstr :5000`

### Erro: "Module not found"
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

### React não carrega
- Limpe o cache: `Ctrl+Shift+Delete` no navegador
- Ou acesse em modo anônimo

### Banco de dados não criou
- Verifique se `npm run migrate` foi executado com sucesso
- Procure pelo arquivo `navaqueebarril.db` em `server/`

## 📱 Testar Funcionalidades

### 1. Cadastro (Registro)
- Acesse `http://localhost:3000/register`
- Preencha com um e-mail @ufba.br
- Senha com 8+ caracteres
- Clique em "Registrar"

### 2. Login
- Acesse `http://localhost:3000/login`
- Use credenciais cadastradas
- Será redirecionado para o Dashboard

### 3. Token JWT
- No navegador, abra DevTools (F12)
- Console > `localStorage.getItem('token')`
- Deve mostrar um token JWT válido

## 📚 Estrutura do Projeto

```
bdd/
├── server/              # Backend
│   ├── src/
│   │   ├── controllers/ # Lógica da aplicação
│   │   ├── routes/      # Endpoints da API
│   │   ├── middleware/  # Middlewares
│   │   ├── validators/  # Validações
│   │   ├── utils/       # Utilitários
│   │   ├── db/          # Banco de dados (SQLite)
│   │   └── index.js     # Entry point
│   ├── navaqueebarril.db # Arquivo SQLite (criado automaticamente)
│   └── package.json
│
├── client/              # Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # Componentes
│   │   ├── pages/       # Páginas
│   │   ├── services/    # Serviços API
│   │   ├── styles/      # CSS
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── tests/               # Testes BDD
│   ├── features/        # Arquivos .feature
│   └── step_definitions/# Steps
│
└── README.md
```

## 🔐 Segurança

**Nunca:**
- Faça commit do arquivo `.env` com credenciais reais
- Use JWT_SECRET padrão em produção
- Exponha JWT_SECRET em código público

**Sempre:**
- Use `.env.example` como template
- Gere um JWT_SECRET forte em produção
- Use variáveis de ambiente seguras

## 💡 Dicas

1. **Development Tools:** Instale Redux DevTools para debug melhor
2. **API Testing:** Use Postman ou Insomnia para testar endpoints
3. **SQLite GUI:** Use SQLite Browser para visualizar dados (opcional)
4. **VS Code Extensions:** Instale "Rest Client" para testar endpoints

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme que o arquivo `.env` existe em `server/`
3. Revise a porta em `.env`
4. Limpe cache/node_modules e tente novamente

---

**Última atualização:** 2024-06-15
**Banco de Dados:** SQLite (sem instalação necessária!) ✅

# Não Vá Que É Barril

Sistema de Avaliação Contextualizada de Docentes para a UFBA

## 📋 Visão Geral

"Não Vá Que É Barril" é uma plataforma web voltada à comunidade acadêmica que permite avaliações granulares de docentes, com um diferencial arquitetural: o isolamento de contexto na relação Professor-Disciplina. Reconhece-se que a abordagem pedagógica e o nível de exigência de um mesmo docente podem variar significativamente a depender da matéria ministrada.

### Tecnologias Utilizadas

**Backend:**
- Node.js + Express.js
- SQLite (sem instalação necessária!)
- JWT para autenticação
- Bcryptjs para hashing de senhas

**Frontend:**
- React 18
- React Router DOM
- Axios para requisições HTTP
- CSS Responsivo (Mobile-First)

**Testes:**
- Cucumber.js para testes BDD
- Jest para testes unitários
- Supertest para testes de API

## 🚀 Quick Start

### Pré-requisitos

- Node.js v18+
- npm ou yarn

**Nenhuma instalação de banco de dados necessária!** (SQLite funciona out-of-the-box)

### Instalação

1. **Acesse o projeto:**
   ```bash
   cd c:\Users\ÊXITO-01\Desktop\bdd
   ```

2. **Configure o Backend:**
   ```bash
   cd server
   npm run migrate  # Cria banco de dados SQLite automaticamente
   npm run dev
   ```

   O servidor estará rodando em `http://localhost:5000`

3. **Configure o Frontend (em outro terminal):**
   ```bash
   cd client
   npm start
   ```

   O aplicativo estará disponível em `http://localhost:3000`

✅ **Pronto!** Sem instalação de PostgreSQL, sem arquivos .env complexos!

## 📁 Estrutura do Projeto

```
bdd/
├── server/              # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/ # Controllers da aplicação
│   │   ├── routes/      # Rotas da API
│   │   ├── middleware/  # Middlewares (autenticação, validação)
│   │   ├── validators/  # Validadores
│   │   ├── utils/       # Utilitários (JWT, hashing)
│   │   ├── db/          # Conexão e schema do banco
│   │   └── index.js     # Entry point do servidor
│   ├── .env             # Variáveis de ambiente
│   └── package.json
│
├── client/              # Frontend React
│   ├── public/          # Arquivos públicos
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── services/    # Serviços (API calls)
│   │   ├── styles/      # Estilos CSS
│   │   ├── App.js       # Componente raiz
│   │   └── index.js     # Entry point
│   └── package.json
│
├── tests/               # Testes BDD
│   ├── features/        # Arquivos .feature (Gherkin)
│   ├── step_definitions/# Implementação dos steps
│   └── support/         # Suporte para testes
│
└── README.md
```

## 🔐 Segurança

- Autenticação com JWT
- Senhas hasheadas com Bcryptjs
- Validação de e-mail institucional (@ufba.br)
- Suporte a CORS
- Headers de segurança com Helmet

## 📊 Banco de Dados

### Schema Principal

**Tabelas:**
- `usuarios`: Estudantes cadastrados
- `professores`: Professores da instituição
- `disciplinas`: Disciplinas oferecidas
- `professor_disciplina`: Relacionamento Many-to-Many (isolamento de contexto)
- `avaliacoes`: Avaliações dos estudantes (FK para professor_disciplina)

## 🧪 Testes

### Executar testes BDD:
```bash
npm run test:features
```

### Executar testes unitários:
```bash
npm test
```

## 📝 Sprint 1 - Funcionalidades Implementadas

✅ PB01: Lógica de Autenticação com validação de e-mail institucional
✅ PB02: Interfaces de Landing Page, Cadastro e Login (Mobile-First)
✅ PB11: Schema relacional do banco de dados
- Próximas sprints: Busca por disciplina, busca por professor, avaliações

## 🤝 Contribuindo

Siga os padrões de código e sempre crie testes antes de implementar novas funcionalidades.

## 📄 Licença

MIT

## 👥 Autores

- Wellington Miguel - Full-Stack Developer
- UFBA - Instituto de Computação

---

**Nota:** Este projeto utiliza Scrum, BDD (Behavior-Driven Development) e é assistido por LLM para engenharia de prompts.

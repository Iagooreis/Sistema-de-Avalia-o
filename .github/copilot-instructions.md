# Copilot Instructions for "Não Vá Que É Barril"

Este arquivo fornece instruções específicas para o Copilot ao trabalhar com este projeto.

## 📋 Informações do Projeto

- **Nome:** Não Vá Que É Barril
- **Tipo:** Full-Stack Web Application
- **Stack:** Node.js + React + PostgreSQL
- **Metodologia:** Scrum + BDD (Behavior-Driven Development)
- **Status:** Sprint 1 em implementação

## 🎯 Objetivos da Sprint 1

1. Autenticação com validação de e-mail institucional (@ufba.br)
2. Interfaces responsivas (Landing Page, Login, Cadastro)
3. Schema relacional do banco de dados
4. Testes BDD com Cucumber

## 📁 Estrutura de Pastas

- `/server` - Backend Node.js/Express
- `/client` - Frontend React
- `/tests` - Testes BDD/Cucumber

## 🔧 Comandos Importantes

### Backend
```bash
cd server
npm install
npm run migrate  # Executar migrações do BD
npm run dev     # Iniciar servidor em desenvolvimento
npm test        # Executar testes
```

### Frontend
```bash
cd client
npm install
npm start       # Iniciar em modo desenvolvimento
npm build       # Construir para produção
```

### Testes
```bash
npm run test:features  # Executar testes BDD
```

## 📋 Padrões de Código

### Backend
- Usar async/await
- Controllers retornam JSON
- Middleware para validação
- Trate erros adequadamente
- Valide entrada do usuário

### Frontend
- Componentes funcionais com React Hooks
- CSS modular por componente
- Roteamento com React Router
- Axios para requisições HTTP
- Mobile-First Design

## 🔒 Segurança

- Email validation: apenas @ufba.br
- Senha: mínimo 8 caracteres, hashada com Bcryptjs
- JWT para autenticação
- CORS habilitado
- Helmet para headers de segurança

## 📚 Recursos Disponíveis

- Arquivo BDD.feature com especificações
- Schema SQL completo em server/src/db/schema.js
- Exemplos de componentes React em client/src/pages

## 🚨 Avisos Importantes

1. Nunca commite o arquivo `.env` com credenciais reais
2. Use `.env.example` como template
3. PostgreSQL deve estar rodando antes de iniciar o backend
4. Testes BDD requerem a API rodando na porta 5000
5. Token JWT expira em 7 dias

## 🎓 Metodologia

Este projeto utiliza:
- **Scrum:** Sprints de 2 semanas
- **BDD:** Testes escritos em Gherkin (português)
- **LLM-Assisted:** Engenharia de prompts com LLM

---

Última atualização: 2024-06-15

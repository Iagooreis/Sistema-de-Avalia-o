# PostgreSQL Setup - Opções de Instalação

## ⚠️ PostgreSQL não foi detectado no sistema

Você tem 3 opções:

### **Opção 1: Instalar PostgreSQL via Chocolatey** (RECOMENDADO - Mais rápido)

```powershell
# 1. Abra PowerShell como ADMINISTRADOR
# 2. Execute:
choco install postgresql --version=17.0 -y

# 3. Aguarde a instalação
# 4. Reinicie o terminal
# 5. Verifique:
psql --version
```

### **Opção 2: Instalar PostgreSQL Manualmente**

1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe: PostgreSQL 17 (ou versão mais recente)
3. Execute o instalador `.exe`
4. **Importante durante a instalação:**
   - Usuário: `postgres`
   - Senha: `password` (ou anote a senha)
   - Porta: `5432` (padrão)
   - Locale: `Portuguese, Brazil`

5. Clique em "Adicionar ao PATH" ou faça manualmente
6. Reinicie o PowerShell
7. Verifique: `psql --version`

### **Opção 3: Usar Docker** (Se tiver Docker instalado)

```powershell
# Rode um container PostgreSQL:
docker run -d `
  --name postgres_navaqueebarril `
  -e POSTGRES_USER=admin `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=navaqueebarril `
  -p 5432:5432 `
  postgres:17

# Teste conexão:
# (Você precisa ter psql-client instalado no Windows)
```

---

## ✅ Próximos Passos Após Instalar

Uma vez instalado, execute:

```powershell
cd c:\Users\ÊXITO-01\Desktop\bdd\server

# 1. Configure o banco de dados
psql -U postgres -c "CREATE USER admin WITH PASSWORD 'password';"
psql -U postgres -c "CREATE DATABASE navaqueebarril OWNER admin;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE navaqueebarril TO admin;"

# 2. Rode as migrações
npm run migrate

# 3. Inicie o servidor
npm run dev
```

---

## 🆘 Se Estiver Com Dificuldade

**Opção Rápida: Use SQLite para desenvolvimento**

Se quiser pular a configuração do PostgreSQL agora, posso modificar o projeto para usar SQLite (mais simples para desenvolvimento local).

**Quer que eu:**
1. Configure SQLite como banco de dados alternativo?
2. Ou prefere instalar PostgreSQL corretamente?

---

Escolha qual opção funciona melhor para você!

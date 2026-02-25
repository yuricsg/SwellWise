# SwellWise Backend - Guia de Deployment

## 🚀 Guia Completo de Deployment

### 1. Desenvolvimento Local

#### Pré-requisitos
- Docker Desktop instalado
- Git
- (Opcional) Python 3.13+ para desenvolvimento sem Docker

#### Iniciar ambiente
```bash
# Windows
.\scripts\desenvolvimento.bat

# Linux/Mac
chmod +x scripts/desenvolvimento.sh
./scripts/desenvolvimento.sh
```

Isso irá iniciar:
- **API FastAPI**: http://localhost:8000
- **PostgreSQL**: porta 5432
- **pgAdmin4**: http://localhost:5050

#### Acessar pgAdmin4
1. Abra http://localhost:5050
2. Login:
   - Email: `admin@swellwise.com`
   - Senha: `admin123`
3. Adicionar servidor PostgreSQL:
   - Nome: SwellWise
   - Host: `postgres`
   - Porta: `5432`
   - Database: `swellwise`
   - Usuário: `swellwise`
   - Senha: `swellwise123`

### 2. Migrations do Banco de Dados

#### Criar nova migration
```bash
# Windows
.\scripts\migrations.bat "nome_da_migration"

# Linux/Mac
alembic revision --autogenerate -m "nome_da_migration"
```

#### Aplicar migrations
```bash
# Aplicar todas
alembic upgrade head

# Voltar uma versão
alembic downgrade -1

# Ver histórico
alembic history
```

### 3. Produção (Plataformas Gratuitas)

#### Opção 1: Render.com (Recomendado)
**Vantagens**: Gratuito, fácil, PostgreSQL incluso

1. **Criar conta em Render.com**

2. **PostgreSQL:**
   - New → PostgreSQL
   - Nome: `swellwise-db`
   - Copiar `Internal Database URL`

3. **Web Service:**
   - New → Web Service
   - Conectar repositório GitHub
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     ```
     POSTGRES_SERVER=<host-do-render>
     POSTGRES_USER=<user>
     POSTGRES_PASSWORD=<password>
     POSTGRES_DB=<database>
     POSTGRES_PORT=5432
     GROQ_API_KEY=<sua-key>
     DEBUG=False
     ```

#### Opção 2: Railway.app
**Vantagens**: Muito simples, $5 grátis/mês

1. **Criar conta em Railway.app**

2. **New Project:**
   - Add PostgreSQL
   - Deploy from GitHub
   - Conectar repositório

3. **Variáveis de Ambiente:**
   - Railway cria `DATABASE_URL` automaticamente
   - Adicionar outras variáveis necessárias

#### Opção 3: Fly.io
**Vantagens**: Bom free tier, múltiplas regiões

```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly launch
fly deploy
```

#### Opção 4: DigitalOcean App Platform
**Vantagens**: Profissional, $200 crédito inicial

1. Criar App
2. Conectar repositório
3. App Platform detecta Dockerfile automaticamente
4. Adicionar PostgreSQL Database
5. Configurar variáveis de ambiente

### 4. Deploy com Docker (VPS)

Se você tem um VPS (DigitalOcean, Vultr, Linode):

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/swellwise.git
cd swellwise/backend

# 2. Criar arquivo .env
cp .env.example .env
nano .env  # Editar com valores reais

# 3. Iniciar produção
docker-compose -f docker-compose.prod.yml up -d

# 4. Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# 5. Aplicar migrations
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head
```

### 5. Variáveis de Ambiente Produção

Criar arquivo `.env.prod`:

```bash
DEBUG=False

# Database (fornecido pelo provedor)
POSTGRES_USER=seu_user
POSTGRES_PASSWORD=senha_forte_aqui
POSTGRES_SERVER=seu-host.aws.com
POSTGRES_PORT=5432
POSTGRES_DB=swellwise

# Groq AI
GROQ_API_KEY=sua_key_aqui
GROQ_ENABLED=True

# CORS - Adicionar domínio de produção
ALLOWED_ORIGINS=["https://swellwise.com","https://www.swellwise.com"]

# Cache
CACHE_ENABLED=True
CACHE_TTL=1800
```

### 6. Frontend (Next.js)

#### Vercel (Recomendado para Next.js)
1. Conectar repositório no Vercel
2. Configurar variáveis:
   ```
   NEXT_PUBLIC_API_URL=https://sua-api.render.com
   ```
3. Deploy automático

#### Netlify
Similar ao Vercel, suporta Next.js

### 7. Banco de Dados Gratuito

#### Neon.tech
- PostgreSQL serverless
- 1GB gratuito
- Escalável

#### Supabase
- PostgreSQL + várias features
- 500MB gratuito
- Dashboard visual

#### ElephantSQL
- PostgreSQL gerenciado
- 20MB gratuito (suficiente para começar)

### 8. Monitoramento

#### Logs
```bash
# Ver logs em desenvolvimento
docker-compose logs -f api

# Ver logs em produção
docker-compose -f docker-compose.prod.yml logs -f api
```

#### Health Check
```bash
curl https://sua-api.com/health
```

### 9. CI/CD com GitHub Actions

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### 10. Comandos Úteis

```bash
# Parar containers
docker-compose down

# Reiniciar apenas a API
docker-compose restart api

# Ver banco de dados
docker-compose exec postgres psql -U swellwise -d swellwise

# Backup do banco
docker-compose exec postgres pg_dump -U swellwise swellwise > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U swellwise swellwise < backup.sql

# Limpar tudo
docker-compose down -v
```

### 11. Checklist de Produção

- [ ] DEBUG=False
- [ ] Senha forte do PostgreSQL
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente seguras
- [ ] HTTPS configurado
- [ ] Backups automáticos
- [ ] Monitoramento ativo
- [ ] Health checks funcionando

### 12. Custos Estimados (Produção)

**Totalmente Gratuito:**
- Backend: Render.com (free tier)
- Database: Neon.tech ou Supabase (free tier)
- Frontend: Vercel (free tier)
- Total: **$0/mês** ✅

**Para Crescer:**
- Backend: Render ($7/mês)
- Database: Render PostgreSQL ($7/mês)
- Frontend: Vercel (grátis)
- Total: **$14/mês**

### 13. Suporte

- Documentação: `/docs` na API
- Issues: GitHub
- Logs: Sempre checar `docker-compose logs`

---

**Desenvolvido para ser profissional e gratuito! 🌊**

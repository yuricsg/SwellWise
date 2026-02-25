# 🌊 SwellWise API - Backend

API REST profissional para análise de condições de praias do Brasil. Fornece informações em tempo real de ondas, vento, clima e análises inteligentes para surf, banho e pesca.

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## 🚀 Início Rápido com Docker

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/swellwise.git
cd swellwise/backend

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Iniciar ambiente completo (API + PostgreSQL + pgAdmin)
.\scripts\desenvolvimento.bat  # Windows
# ou
./scripts/desenvolvimento.sh   # Linux/Mac

# 4. Acessar
# API:     http://localhost:8000
# Docs:    http://localhost:8000/docs
# pgAdmin: http://localhost:5050
```

## 📦 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM Python
- **Alembic** - Migrations de banco de dados
- **Open-Meteo** - API gratuita para dados meteorológicos e marinhos
- **Groq AI** - IA gratuita para análises e recomendações
- **Docker** - Containerização
- **pgAdmin4** - Interface visual para PostgreSQL

## 🏗️ Arquitetura

```
backend/
├── app/
│   ├── main.py                    # Aplicação FastAPI
│   ├── api/
│   │   └── routes/                # Endpoints da API
│   │       ├── beaches.py         # Rotas de praias
│   │       ├── conditions.py      # Condições meteorológicas
│   │       └── health.py          # Health check
│   ├── models/                    # Modelos SQLAlchemy
│   │   ├── beach.py               # Modelo de praia
│   │   └── user.py                # Modelo de usuário
│   ├── schemas/                   # Schemas Pydantic
│   │   ├── beach.py               # Validação de praias
│   │   └── condition.py           # Validação de condições
│   ├── services/                  # Lógica de negócio
│   │   ├── open_meteo_service.py  # Integração Open-Meteo
│   │   └── ai_service.py          # Análises com IA
│   ├── core/                      # Core da aplicação
│   │   └── database.py            # Configuração do BD
│   ├── config/
│   │   └── settings.py            # Configurações
│   └── scripts/
│       └── populate_beaches.py    # Popular banco
├── alembic/                       # Migrations
├── scripts/                       # Scripts utilitários
├── Dockerfile                     # Container da API
├── docker-compose.yml             # Orquestração (dev)
├── docker-compose.prod.yml        # Orquestração (prod)
└── requirements.txt               # Dependências Python
```

## 📚 Documentação da API

### Endpoints Principais

#### Praias
```http
GET    /api/v1/beaches              # Lista todas as praias
GET    /api/v1/beaches/{id}         # Detalhes de uma praia
GET    /api/v1/beaches/state/{uf}   # Praias por estado
GET    /api/v1/beaches/city/{cidade}# Praias por cidade
```

#### Condições
```http
GET    /api/v1/conditions/{beach_id}          # Condições atuais completas
GET    /api/v1/conditions/{beach_id}/forecast # Previsão 1-16 dias
GET    /api/v1/conditions/{beach_id}/summary  # Resumo rápido
```

#### Health
```http
GET    /health                      # Status da API
```

### Exemplo de Resposta - Condições

```json
{
  "beach_id": "1",
  "beach_name": "Maracaípe",
  "timestamp": "2026-02-25T15:00:00",
  "wave": {
    "height": 1.5,
    "direction": "NE",
    "period": 8.0,
    "swell_height": 1.2
  },
  "wind": {
    "speed": 15.0,
    "direction": "E",
    "gusts": 22.0
  },
  "weather": {
    "temperature": 28.0,
    "condition": "Parcialmente nublado",
    "visibility": 10.0,
    "precipitation": 0.0
  },
  "ratings": {
    "surf_rating": 8,
    "swim_rating": 6,
    "fishing_rating": 7,
    "overall_rating": 7.0
  },
  "ai_review": {
    "review_pt": "Excelentes condições para surf...",
    "recommendations": ["Melhor período: manhã"],
    "warnings": ["Atenção às correntes"]
  }
}
```

## 🗄️ Banco de Dados

### Configuração PostgreSQL

#### Desenvolvimento Local (sem Docker)
```bash
# Instalar PostgreSQL
# Criar banco de dados
createdb swellwise

# Aplicar migrations
alembic upgrade head

# Popular com praias iniciais
python -m app.scripts.populate_beaches
```

#### Com Docker
O Docker Compose já cria e configura tudo automaticamente!

### Acessar PostgreSQL

#### Via pgAdmin (recomendado)
1. http://localhost:5050
2. Login: `admin@swellwise.com` / `admin123`
3. Add Server:
   - Host: `postgres` (no Docker) ou `localhost`
   - Port: `5432`
   - Database: `swellwise`
   - Username: `swellwise`
   - Password: `swellwise123`

#### Via linha de comando
```bash
# Local
psql -U swellwise -d swellwise

# Docker
docker-compose exec postgres psql -U swellwise -d swellwise
```

### Migrations

```bash
# Criar nova migration
alembic revision --autogenerate -m "nome_da_mudanca"

# Aplicar migrations
alembic upgrade head

# Reverter última migration
alembic downgrade -1

# Ver histórico
alembic history

# Ver SQL sem executar
alembic upgrade head --sql
```

## 🔧 Desenvolvimento

### Sem Docker

```bash
# 1. Criar ambiente virtual
python -m venv venv

# 2. Ativar
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Configurar .env
cp .env.example .env
# Editar .env com suas configurações

# 5. Iniciar PostgreSQL localmente

# 6. Aplicar migrations
alembic upgrade head

# 7. Popular banco
python -m app.scripts.populate_beaches

# 8. Iniciar servidor
uvicorn app.main:app --reload
```

### Com Docker (recomendado)

```bash
# Iniciar tudo
.\scripts\desenvolvimento.bat

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Reconstruir
docker-compose build --no-cache
```

## 🌍 Deploy para Produção

Ver guia completo em **[DEPLOYMENT.md](DEPLOYMENT.md)**

### Opções Gratuitas

1. **Render.com** (recomendado)
   - Backend gratuito
   - PostgreSQL incluso
   - Deploy automático via Git

2. **Railway.app**
   - $5 gratuitos/mês
   - Setup muito simples

3. **Fly.io**
   - Bom free tier
   - PostgreSQL gratuito

### Deploy Rápido com Docker

```bash
# Build
docker build -t swellwise-api .

# Run
docker run -p 8000:8000 --env-file .env swellwise-api
```

## 🔑 Variáveis de Ambiente

```bash
# App
DEBUG=True

# PostgreSQL
POSTGRES_USER=swellwise
POSTGRES_PASSWORD=swellwise123
POSTGRES_SERVER=localhost  # "postgres" no Docker
POSTGRES_PORT=5432
POSTGRES_DB=swellwise

# Groq AI (opcional - registre em https://console.groq.com/)
GROQ_API_KEY=sua_key_aqui
GROQ_ENABLED=True

# Cache
CACHE_ENABLED=True
CACHE_TTL=1800  # 30 minutos
```

## 🧪 Testes

```bash
# Instalar dependências de teste
pip install pytest pytest-asyncio httpx

# Executar testes
pytest

# Com coverage
pytest --cov=app --cov-report=html
```

## 📊 Praias Disponíveis

### Pernambuco (PE)
- 🏄 Maracaípe - Surf de classe mundial
- 🏖️ Boa Viagem - Praia urbana
- 🐠 Porto de Galinhas - Piscinas naturais
- 🌴 Carneiros - Paraíso tropical

### Rio de Janeiro (RJ)
- 🏖️ Copacabana - Ícone do Rio
- 🌅 Ipanema - Sofisticada

### Ceará (CE)
- 🪂 Jericoacoara - Kitesurf

### São Paulo (SP)
- 🏄 Maresias - Point de surf

### Bahia (BA)
- 🏄 Itacaré - Ondas poderosas

### Santa Catarina (SC)
- 🏄 Joaquina - Campeonatos

*Mais praias sendo adicionadas!*

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-praia`)
3. Commit suas mudanças (`git commit -am 'Add: Praia X'`)
4. Push para a branch (`git push origin feature/nova-praia`)
5. Abra um Pull Request

## 📝 Licença

MIT License - Veja [LICENSE](LICENSE)

## 👨‍💻 Autor

Desenvolvido com 💙 para estudo e portfólio profissional.

Sistema 100% gratuito para a comunidade de surfistas,pescadores e amantes de praia do Brasil! 🇧🇷

---

## 🆘 Suporte

- 📖 Documentação: http://localhost:8000/docs
- 🐛 Issues: GitHub Issues
- 💬 Discussões: GitHub Discussions

## 🎯 Roadmap

- [x] API REST completa
- [x] Integração Open-Meteo
- [x] Análises com IA
- [x] PostgreSQL + Alembic
- [x] Docker + docker-compose
- [x] Documentação Swagger
- [ ] Autenticação JWT
- [ ] Sistema de favoritos
- [ ] Alertas e notificações
- [ ] Webcams ao vivo
- [ ] Mais praias do Brasil
- [ ] App mobile
- [ ] Histórico de condições

## ⭐ Star o Projeto!

Se este projeto te ajudou, dê uma estrela! ⭐

**Boas ondas! 🌊🏄‍♂️**

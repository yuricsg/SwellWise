# 🌊 SwellWise

## Plataforma inteligente de análise de condições de praias em tempo real

[![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.133-009485?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://swell-wise.vercel.app/)

##  [Acesse o site→ swell-wise.vercel.app](https://swell-wise.vercel.app/)

---

## Sobre o Projeto

SwellWise é uma **plataforma web moderna** que eu decidi criar que fornece análises inteligentes e em tempo real sobre as condições de praias brasileiras. O foco aqui foi criar uma solução para muitos banhistas que desejam ver qual a melhor hora para irem a praia que desejam, e também para surfistas que desejam saber aquele pico ideal para pegar ondas. A plataforma é Integrada com dados meteorológicos e marinhos, a aplicação utiliza IA para gerar recomendações personalizadas para **surf, banho e pesca**. Tudo foi feito de forma gratuita e acessíve, espero que gostem :)

---

### Funcionalidades Principais:
- Consulta de praias com dados em tempo real
- Análise de ondas, vento e clima
- Recomendações inteligentes via IA
- Dashboard interativo e responsivo
- Integração com APIs externas (Open-Meteo)

## Stack Tecnológico

### Backend
- **FastAPI** - Framework web assíncrono e high-performance
- **PostgreSQL** - Banco de dados relacional robusto
- **SQLAlchemy** - ORM Python com suporte completo
- **Alembic** - Versionamento de migrations
- **Groq AI** - IA gratuita para análises

### Frontend
- **Next.js 16** - React framework com SSR e otimizações
- **React 19** - Biblioteca UI moderna
- **TypeScript** - Type safety em todo o código
- **Tailwind CSS** - Estilização utilitária
- **Axios/Fetch** - Consumo de APIs

## Como Começar

### Pré-requisitos
- Docker e Docker Compose
- ou Python 3.13 + Node.js 18+

### Instalação Rápida (Docker Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/swellwise.git
cd swellwise

# Windows
.\backend\scripts\desenvolvimento.bat

# Linux/Mac
./backend/scripts/desenvolvimento.sh

# Acesso local
# Frontend:  http://localhost:3000
# API Docs:  http://localhost:8000/docs
# pgAdmin:   http://localhost:5050
```

### Instalação Manual

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app/main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Estrutura do Projeto

```
SwellWise/
├── backend/
│   ├── app/
│   │   ├── api/routes/          # Endpoints REST
│   │   ├── models/              # Modelos de BD (SQLAlchemy)
│   │   ├── schemas/             # Validação de dados (Pydantic)
│   │   ├── services/            # Lógica de negócio & IA
│   │   └── main.py              # Aplicação FastAPI
│   ├── alembic/                 # Migrations do BD
│   └── requirements.txt          # Dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Pages e layout
│   │   ├── components/          # Componentes React
│   │   ├── services/            # API client
│   │   └── types/               # Tipos TypeScript
│   └── package.json              # Dependências Node
```

## APIs Principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/beaches` | GET | Lista todas as praias |
| `/beaches/{id}` | GET | Detalhes de uma praia |
| `/conditions/{beach_id}` | GET | Condições em tempo real |
| `/health` | GET | Status da API |

## Destaques

- ✅ **Arquitetura moderna** - Seguindo padrões RESTful e clean code
- ✅ **Type-safe** - TypeScript no frontend, Pydantic no backend
- ✅ **Containerizado** - Deploy simplificado com Docker
- ✅ **IA integrada** - Análises inteligentes com Groq
- ✅ **Responsivo** - Adaptado para mobile/tablet/desktop

---

> Desenvolvido por um amante de praias e surfista de final de semana :)

---

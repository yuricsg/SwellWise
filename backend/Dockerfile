# Dockerfile Multi-Stage para produção otimizada
FROM python:3.13-slim as builder

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Imagem final (menor)
FROM python:3.13-slim

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

# Criar usuário não-root
RUN useradd -m -u 1000 swellwise && \
    mkdir -p /app && \
    chown -R swellwise:swellwise /app

# Instalar apenas dependências runtime
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Mudar para usuário não-root
USER swellwise

# Diretório de trabalho
WORKDIR /app

# Copiar dependências do builder
COPY --from=builder --chown=swellwise:swellwise /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder --chown=swellwise:swellwise /usr/local/bin /usr/local/bin

# Copiar código da aplicação
COPY --chown=swellwise:swellwise ./app ./app
COPY --chown=swellwise:swellwise ./alembic ./alembic
COPY --chown=swellwise:swellwise ./alembic.ini .

# Expor porta
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Comando de inicialização
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

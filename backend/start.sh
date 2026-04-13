#!/bin/bash
set -e

echo "🌊 SwellWise API iniciando..."
echo "📦 Executando migrations do banco de dados..."
alembic upgrade head
echo "✅ Migrations concluídas!"

echo "🚀 Iniciando servidor FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1

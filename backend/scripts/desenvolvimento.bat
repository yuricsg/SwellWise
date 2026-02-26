@echo off
REM Script para iniciar ambiente de desenvolvimento

echo ====================================
echo SwellWise - Iniciando Desenvolvimento
echo ====================================
echo.

echo [1/3] Parando containers antigos...
docker-compose down

echo.
echo [2/3] Construindo imagens...
docker-compose build

echo.
echo [3/3] Iniciando containers...
docker-compose up -d

echo.
echo ====================================
echo Ambiente de Desenvolvimento Iniciado!
echo ====================================
echo.
echo Servicos disponiveis:
echo   - API:      http://localhost:8000
echo   - Docs:     http://localhost:8000/docs
echo   - pgAdmin:  http://localhost:5050
echo.
echo pgAdmin Login:
echo   Email:    admin@swellwise.com
echo   Senha:    admin123
echo.
echo PostgreSQL:
echo   Host:     localhost
echo   Porta:    5432
echo   User:     swellwise
echo   Password: swellwise123
echo   Database: swellwise
echo.
echo Para ver logs: docker-compose logs -f
echo Para parar:    docker-compose down
echo.

pause

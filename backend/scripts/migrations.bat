@echo off
REM Script para criar nova migration

echo ====================================
echo SwellWise - Nova Migration
echo ====================================
echo.

if "%1"=="" (
    echo Uso: migrations.bat "nome_da_migration"
    echo Exemplo: migrations.bat "criar_tabela_beaches"
    pause
    exit /b
)

echo Criando migration: %1
echo.

alembic revision --autogenerate -m "%1"

echo.
echo Migration criada com sucesso!
echo.
echo Para aplicar: alembic upgrade head
echo.

pause

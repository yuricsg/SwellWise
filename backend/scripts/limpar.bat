@echo off
REM Script para limpar ambiente Docker

echo ====================================
echo SwellWise - Limpando Ambiente
echo ====================================
echo.
echo ATENCAO: Isso vai remover:
echo   - Todos os containers
echo   - Volumes do banco de dados
echo   - Imagens criadas
echo.
echo Deseja continuar? (S/N)
set /p confirma=

if /i "%confirma%"=="S" (
    echo.
    echo Parando containers...
    docker-compose down -v
    
    echo.
    echo Removendo imagens...
    docker rmi swellwise-backend-api 2>nul
    
    echo.
    echo Ambiente limpo!
) else (
    echo.
    echo Operacao cancelada.
)

echo.
pause

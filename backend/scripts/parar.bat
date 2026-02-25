@echo off
REM Script para parar containers

echo ====================================
echo SwellWise - Parando Containers
echo ====================================
echo.

docker-compose down

echo.
echo Containers parados!
echo.

pause

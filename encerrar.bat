@echo off
chcp 65001 > nul
cls
echo ======================================================================
echo    TABLOIDE SÃO JUDAS - FINALIZADOR LIMPO DE SERVIÇOS
echo ======================================================================
echo.

echo [1/2] Liberando porta 8000 (Backend FastAPI)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Finalizando processo PID %%a na porta 8000...
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/2] Liberando porta 5173 (Frontend Vite)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Finalizando processo PID %%a na porta 5173...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo ======================================================================
echo   Todos os serviços e portas foram liberados com sucesso!
echo ======================================================================
echo.
timeout /t 3 > nul

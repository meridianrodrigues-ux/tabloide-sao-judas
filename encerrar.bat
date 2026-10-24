@echo off
cls
echo ======================================================================
echo    TABLOIDE SAO JUDAS - FINALIZADOR LIMPO DE SERVICOS
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
echo   Todos os servicos e portas foram liberados com sucesso!
echo ======================================================================
echo.

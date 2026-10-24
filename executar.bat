@echo off
chcp 65001 > nul
cls
echo ======================================================================
echo    TABLOIDE SÃO JUDAS - AMBIENTE TURNKEY (1-CLIQUE)
echo    Supermercados São Judas & Google Antigravity
echo ======================================================================
echo.

:: 1. Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python não foi encontrado no PATH do sistema.
    echo Instale o Python 3.10+ para continuar.
    pause
    exit /b 1
)

:: 2. Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js não foi encontrado no PATH do sistema.
    echo Instale o Node.js v18+ para continuar.
    pause
    exit /b 1
)

echo [1/3] Iniciando Backend FastAPI (Porta 8000)...
start "Tabloide API - FastAPI [8000]" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Aguardar 2 segundos para o backend inicializar
timeout /t 2 /nobreak > nul

echo [2/3] Iniciando Frontend React + Vite (Porta 5173)...
start "Tabloide UI - Vite [5173]" cmd /k "cd frontend && npm run dev"

:: Aguardar 3 segundos para o Vite iniciar
timeout /t 3 /nobreak > nul

echo [3/3] Abrindo Workspace de Diagramação no Navegador...
start http://localhost:5173

echo.
echo ======================================================================
echo   SISTEMA ONLINE E PRONTO PARA OPERAÇÃO!
echo   - Interface do Tabloide:  http://localhost:5173
echo   - Documentação Swagger:   http://localhost:8000/docs
echo   - Para encerrar tudo:     Execute encerrar.bat
echo ======================================================================
echo.
pause

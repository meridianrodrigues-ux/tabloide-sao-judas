from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.core.config import PROJECT_NAME, VERSION, API_V1_PREFIX
from backend.app.core.database_offers import init_db
from backend.app.routers import status, offers, images, export

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialização das tabelas e leitura do CSV/DAM
    init_db()
    yield

app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    description="Motor de Automação de Design e Geração de Tabloides - Supermercado São Judas",
    lifespan=lifespan
)

# Habilitar CORS para o frontend Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectar roteadores com prefixo /api
app.include_router(status.router, prefix=API_V1_PREFIX)
app.include_router(offers.router, prefix=API_V1_PREFIX)
app.include_router(images.router, prefix=API_V1_PREFIX)
app.include_router(export.router, prefix=API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "sistema": PROJECT_NAME,
        "versao": VERSION,
        "status": "operacional",
        "docs": "/docs",
        "telemetria": f"{API_V1_PREFIX}/status"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)

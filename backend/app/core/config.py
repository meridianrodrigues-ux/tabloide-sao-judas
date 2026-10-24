import os
from pathlib import Path

# Raiz do projeto
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent

# Diretórios de dados e ativos
DATA_DIR = ROOT_DIR / "data"
DATABASE_DIR = DATA_DIR / "database"
IMAGES_DIR = DATA_DIR / "Imagens" / "IMAGENS"
OFFERS_CSV_PATH = DATA_DIR / "Tabloide ofertas" / "TAB REDE 16 A 18-10.csv"
OUTPUT_DIR = DATA_DIR / "output"

# Banco SQLite
DATABASE_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
SQLITE_DB_PATH = DATABASE_DIR / "ofertas_db.sqlite"

# Configurações do App
PROJECT_NAME = "Tabloide São Judas API"
VERSION = "1.0.0"
API_V1_PREFIX = "/api"

from fastapi import APIRouter, Query, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from typing import List, Optional
from pathlib import Path
import shutil

from backend.app.core.config import IMAGES_DIR
from backend.app.schemas import ImageCatalogItem
from backend.app.core.database_offers import get_db_connection

router = APIRouter(prefix="/images", tags=["DAM Banco de Imagens"])

@router.get("", response_model=List[ImageCatalogItem])
def list_images(termo: Optional[str] = Query(None, description="Filtrar por nome")):
    """Lista as imagens indexadas no catálogo DAM com dados de arquivo."""
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM images_catalog"
    params = []
    if termo:
        query += " WHERE filename LIKE ? OR title LIKE ?"
        params.extend([f"%{termo}%", f"%{termo}%"])
    query += " ORDER BY filename ASC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    return [
        ImageCatalogItem(
            id=str(r["id"]),
            nome_arquivo=r["filename"],
            url=f"/api/images/file/{r['filename']}",
            ean_sugerido=None,
            tamanho_bytes=r["filesize"] or 0,
            formato=r["format"] or "png"
        )
        for r in rows
    ]

@router.get("/file/{filename}")
def serve_image(filename: str):
    """Serve o arquivo estático de imagem com cache e tipos MIME apropriados."""
    # Prevenção de Path Traversal
    safe_name = Path(filename).name
    file_path = IMAGES_DIR / safe_name
    
    if not file_path.exists() or not file_path.is_file():
        # Fallback para placeholder se não existir
        raise HTTPException(status_code=404, detail=f"Arquivo de imagem '{safe_name}' não encontrado no DAM")
        
    ext = file_path.suffix.lower()
    media_types = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp'
    }
    return FileResponse(path=file_path, media_type=media_types.get(ext, 'application/octet-stream'))

@router.post("/upload")
def upload_image(file: UploadFile = File(...)):
    """Permite upload de nova imagem para enriquecer o acervo do DAM."""
    safe_name = Path(file.filename).name
    dest_path = IMAGES_DIR / safe_name
    
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Indexar no banco
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO images_catalog (filename, title, filesize, format)
    VALUES (?, ?, ?, ?)
    """, (safe_name, dest_path.stem, dest_path.stat().st_size, dest_path.suffix.lower().replace('.', '')))
    conn.commit()
    conn.close()
    
    return {
        "sucesso": True,
        "filename": safe_name,
        "url": f"/api/images/file/{safe_name}",
        "mensagem": "Imagem enviada e indexada no DAM com sucesso."
    }

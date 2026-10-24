from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from backend.app.schemas import ExportRequest, ExportResponse
from backend.app.services.pdf_generator import generate_pdf_tabloide, generate_social_image
from backend.app.core.config import OUTPUT_DIR

router = APIRouter(prefix="/export", tags=["Motor de Exportação Gráfica"])

@router.post("/generate", response_model=ExportResponse)
def export_tabloide(req: ExportRequest):
    """Gera o arquivo final do tabloide em PDF 300 DPI ou PNG para mídias sociais."""
    if not req.offers:
        raise HTTPException(status_code=400, detail="Nenhuma oferta selecionada para o tabloide.")
        
    offers_data = [o.model_dump() for o in req.offers]
    
    if req.formato.lower() == "pdf":
        file_path = generate_pdf_tabloide(
            offers=offers_data,
            campaign_title=req.titulo_campanha,
            validity=req.validade,
            template_id=req.template_id
        )
    else:
        file_path = generate_social_image(
            offers=offers_data,
            campaign_title=req.titulo_campanha,
            validity=req.validade,
            format_type="feed" if "feed" in req.template_id else "story"
        )
        
    size_kb = round(file_path.stat().st_size / 1024, 2)
    
    return ExportResponse(
        sucesso=True,
        arquivo_url=f"/api/export/download/{file_path.name}",
        nome_arquivo=file_path.name,
        formato=req.formato.lower(),
        tamanho_kb=size_kb,
        mensagem=f"Arquivo {file_path.name} gerado com sucesso ({size_kb} KB)."
    )

@router.get("/download/{filename}")
def download_export(filename: str):
    """Download do arquivo exportado (PDF ou PNG)."""
    safe_name = Path(filename).name
    file_path = OUTPUT_DIR / safe_name
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Arquivo exportado não encontrado")
        
    media_type = "application/pdf" if file_path.suffix.lower() == ".pdf" else "image/png"
    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=safe_name,
        headers={"Content-Disposition": f"attachment; filename={safe_name}"}
    )

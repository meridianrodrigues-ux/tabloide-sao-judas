from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from backend.app.schemas import OfferBase
from backend.app.core.database_offers import get_all_offers, get_db_connection

router = APIRouter(prefix="/offers", tags=["Ofertas do ERP"])

@router.get("", response_model=List[OfferBase])
def list_offers(
    categoria: Optional[str] = Query(None, description="Filtro por setor"),
    busca: Optional[str] = Query(None, description="Busca por descrição, código ou EAN"),
    apenas_com_imagem: bool = Query(False, description="Exibir apenas ofertas com imagem vinculada")
):
    """Consulta a lista de ofertas ativas no banco de dados com filtros opcionais."""
    offers = get_all_offers(setor=categoria, busca=busca, apenas_com_imagem=apenas_com_imagem)
    return [OfferBase(**dict(o)) for o in offers]

@router.get("/{offer_id}", response_model=OfferBase)
def get_offer_by_id(offer_id: int):
    """Retorna os dados detalhados de uma oferta pelo seu ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM offers WHERE id = ?", (offer_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")
    return OfferBase(**dict(row))

@router.put("/{offer_id}/bind-image")
def bind_image_to_offer(offer_id: int, image_filename: str = Query(..., description="Nome do arquivo no catálogo")):
    """Vincula manualmente uma imagem do DAM a uma oferta."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM offers WHERE id = ?", (offer_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Oferta não encontrada")
        
    img_url = f"/api/images/file/{image_filename}"
    cursor.execute("""
    UPDATE offers 
    SET imagem_nome = ?, imagem_url = ?, tem_imagem = 1 
    WHERE id = ?
    """, (image_filename, img_url, offer_id))
    conn.commit()
    conn.close()
    return {"sucesso": True, "mensagem": f"Imagem {image_filename} vinculada com sucesso à oferta {offer_id}."}

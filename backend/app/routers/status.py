from fastapi import APIRouter
from backend.app.schemas import SystemStatus
from backend.app.core.database_offers import get_stats

router = APIRouter(prefix="/status", tags=["Status e Telemetria"])

@router.get("", response_model=SystemStatus)
def get_system_status():
    """Retorna o status em tempo real da integração do ERP e do DAM de Imagens."""
    stats = get_stats()
    return SystemStatus(**stats)

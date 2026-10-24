from pydantic import BaseModel, Field
from typing import List, Optional

class OfferBase(BaseModel):
    id: int
    gtin: str
    codigo: str
    setor: str
    descricao: str
    preco_oferta: float
    preco_oferta_str: str
    preco_de: Optional[float] = None
    preco_de_str: Optional[str] = None
    preco_clube: Optional[float] = None
    preco_clube_str: Optional[str] = None
    unidade: str = "un"
    vigencia_inicio: str = ""
    vigencia_fim: str = ""
    imagem_url: Optional[str] = None
    imagem_nome: Optional[str] = None
    tem_imagem: bool = False
    destaque: bool = False
    observacao: Optional[str] = None
    selo: Optional[str] = None

class ImageCatalogItem(BaseModel):
    id: str
    nome_arquivo: str
    url: str
    ean_sugerido: Optional[str] = None
    tamanho_bytes: int = 0
    formato: str = "png"

class SystemStatus(BaseModel):
    status: str = "online"
    erp_conectado: bool = True
    dam_conectado: bool = True
    total_ofertas: int = 0
    total_imagens: int = 0
    total_com_imagem: int = 0
    taxa_pareamento: float = 0.0
    vigencia_atual: str = "16/10/2026 a 18/10/2026"

class LayoutSlot(BaseModel):
    slot_id: int
    offer_id: Optional[int] = None
    destaque: bool = False
    ordem: int = 0
    custom_selo: Optional[str] = None

class LayoutPreviewRequest(BaseModel):
    template_id: str = "a4_16" # a4_16, feed_1080x1350, stories_1080x1920
    tema_campanha: str = "carnaval" # carnaval, fim_de_semana, quarta_verde, relampago
    titulo_campanha: str = "Carnaval de Ofertas & Fim de Semana"
    subtitulo_campanha: str = "Bloco da Economia Garantida • Supermercado da Sua Família"
    validade: str = "Válido de 16/10 a 18/10/2026"
    slots: List[LayoutSlot]

class ExportRequest(BaseModel):
    template_id: str = "a4_16"
    formato: str = "pdf" # pdf, png, webp
    resolucao: str = "print" # print (300dpi), digital (72dpi/150dpi)
    tema_campanha: str = "carnaval"
    titulo_campanha: str = "Carnaval de Ofertas São Judas"
    subtitulo_campanha: str = "Supermercado da Sua Família"
    validade: str = "16/10 a 18/10/2026"
    offers: List[OfferBase]

class ExportResponse(BaseModel):
    sucesso: bool
    arquivo_url: str
    nome_arquivo: str
    formato: str
    tamanho_kb: float
    mensagem: str

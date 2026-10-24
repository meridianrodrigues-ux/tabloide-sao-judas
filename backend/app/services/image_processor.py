from PIL import Image, ImageOps
from pathlib import Path
from typing import Optional
from backend.app.core.config import IMAGES_DIR

def get_image_path(filename: str) -> Optional[Path]:
    """Retorna o caminho seguro da imagem dentro do diretório de assets."""
    if not filename:
        return None
    safe_path = IMAGES_DIR / Path(filename).name
    if safe_path.exists() and safe_path.is_file():
        return safe_path
    return None

def optimize_product_image(image_path: Path, max_size=(500, 500)) -> Image.Image:
    """
    Carrega a imagem do produto, converte para RGBA e ajusta escala mantendo proporção.
    """
    img = Image.open(image_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    return img

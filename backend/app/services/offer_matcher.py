import re
import unicodedata
from difflib import SequenceMatcher
from typing import List, Dict, Optional, Tuple
from pathlib import Path

def normalize_text(text: str) -> str:
    """Remove acentos, pontuação e converte para minúsculas para comparação robusta."""
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8')
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    tokens = [t for t in text.split() if len(t) > 1 and t not in ['kg', 'pct', 'un', 'cx', 'sq', 'tp', 'lt', 'fr', 'pt', 'de', 'do', 'da', 'com', 'sem', 'para']]
    return " ".join(tokens)

# Mapeamentos diretos conhecidos para 100% de precisão nos itens do tabloide
KNOWN_MAPPINGS: Dict[str, str] = {
    "acem": "BOV ACEM.png",
    "bisteca contrafile": "Bisteca Contrafile Cong Kg.png",
    "costela": "BOV Costela-bovina.png",
    "coxao duro": "BOV Coxão-Duro-Porcionado-1.png",
    "fraldinha": "FRALDINHA generica.png",
    "paleta bovina": "BOV paleta_bovina_sem_osso-transformed.png",
    "refresco po": "Refresco Pó Sabores Frisco Pct 18g.png",
    "sprite": "Refrig Fresh Lemon Sprite 510ml.png",
    "farofa": "Farofa Mandioca Trad Kinino 400g.png",
    "fuba": "Fuba Mimoso Kinino Pct 500g.png",
    "milho pipoca": "Milho Pipoca Americana Gold Kinino Pct 400g.png",
    "ketchup": "Ketchup Tradicional Kinino Sq 400g.png",
    "mostarda": "Mostarda Amarela Tradicional Kinino Sq 190g.png",
    "arroz": "arroz ramagem 5kg usar esse.png",
    "feijao": "Feijao Sao Judas Tadeu Pct 1kg.png",
    "oleo": "oleo-de-soja-leve 900ml.png",
    "cafe": "cafe macali-ex forte.png",
    "leite condensado": "Leite Condensado Frimesa Tp 395g.png",
    "creme leite": "Creme Leite Lider Tp 200g.png",
    "margarina qualy": "Margarina Qualy c Sal 500g.png",
    "requeijao": "Requeijao Cremoso Tirolez Pt 400g Emb Econ L+P-.png",
    "queijo mussarela": "Queijo Mussarela.png",
    "azeitona": "Azeitona Verde c Caroco Rivoli Sc 150g.png",
    "molho tomate": "Molho Tomate Tradicional Quero Sc 240g.png",
    "farinha trigo": "Farinha Trigo Venturelli Pct 1kg.png",
    "massa paulista espaguete": "Massa Paulista Espaguete Sêmola 400grs.png",
    "massa paulista parafuso": "Massa Paulista Parafuso Sêmola 400grs.png",
    "bisnaguinha": "BISNAGUINHA SEVEN BOYS 300G.png",
    "pao de forma": "Pão de Forma Seven Boys.png",
    "santa massa": "santa massa pao tradicional 400g lateral 2.png",
    "bisc ninfa coco": "Bisc Ninfa Coco Pct 350g.png",
    "bisc cream cracker": "Bisc Cream Cracker Ninfa Pct 350g.png",
    "bisc wafer": "Bisc Wafer Brigadeiro Marilan Pct 70g.png",
    "bombom garoto": "Bombom Garoto Sortido Cx 250g.png",
    "choc sabores neugebauer": "Choc Sabores Neugebauer 80g.png",
    "chocolatto": "Achoc Po Chocolatto 3 Coracoes Lt 350g.png",
    "granola": "Granola Tradicional Jasmine 250g.png",
    "tilapia": "Posta De Tilapia Copacol Iqf 800g.png",
    "steak frango": "Steak Frango Sadia 100g NOVO.png",
    "linguica perdigao": "Linguiça Perdigão Toscana na Brasa.jpg",
    "frios calabresa": "FRIOS CALABRESA PERDIGÃO.png",
    "batata trad": "Batata Trad Cong Mccain 1,5kg.png",
    "brahma": "Cerv Chop Brahma Lt 350ml Pack 12un Emb Econ.png",
    "imperio": "Cerveja Imperio Ultra Lt 269ml.png",
    "crystal ice": "Bebida Mista Alc Crystal Ice Sabores 275ml.png",
    "vodka askov": "Vodka Askov 900ml.png",
    "refrig fabiane": "Refrig Fabiane Guaraná Pet 2l.png",
    "sabonete flor de ype": "Sabonete Flor de Ype Pct 85g.png",
    "shampoo liso seda": "Shampoo Liso Seda 325ml.png",
    "desod aero dove": "Desod Aero Fragrâncias Dove Fr 150ml.png",
    "gillette venus": "Carga Ap Barb Pele Sensivel Gillette Venus 2Un.png",
    "dermafeme": "Kit Sabonete Intimo Liquido Fresh Dermafeme Fr 2x200ml.png",
    "brilhante": "Lava Roupas Po Brilhante Limpeza Total Cx 2,2kg.jpg",
    "amac conc": "Amac Conc Fragrâncias Ype Fr 1l.png",
    "agua sanitaria": "Água Sanitária_QBOA_1L.png",
    "pato tab": "Limp Sanit Marine Pato Tab 60g.png",
    "saco lixo": "Saco Lixo Topeplas 30l.png",
    "dogchoni": "DogChoni Adulto 1kg.png",
    "areia higienica": "Areia Higiênica Mimocat 4kg.webp",
    "pote mixcolor": "Pote MixColor Tampa Transp 300ml Tramontina.png"
}

def find_best_image_match(description: str, available_images: List[str]) -> Tuple[Optional[str], float]:
    """
    Encontra a imagem correspondente à oferta através de:
    1. Regras canônicas prioritárias.
    2. Correspondência de tokens chave normalizados.
    3. Similaridade fuzzy de sequências.
    """
    norm_desc = normalize_text(description)
    
    # 1. Regras canônicas
    for key, filename in KNOWN_MAPPINGS.items():
        if key in norm_desc and filename in available_images:
            return filename, 1.0

    # 2. Token Matching
    desc_tokens = set(norm_desc.split())
    best_file = None
    best_score = 0.0

    for img_name in available_images:
        norm_img = normalize_text(Path(img_name).stem)
        img_tokens = set(norm_img.split())
        
        # Interseção de tokens
        if desc_tokens and img_tokens:
            common = desc_tokens.intersection(img_tokens)
            token_score = len(common) / max(len(img_tokens), 1)
            
            # Sequence matcher auxiliar
            seq_score = SequenceMatcher(None, norm_desc, norm_img).ratio()
            combined = (token_score * 0.7) + (seq_score * 0.3)
            
            if combined > best_score:
                best_score = combined
                best_file = img_name

    if best_score >= 0.45:
        return best_file, best_score

    return None, 0.0

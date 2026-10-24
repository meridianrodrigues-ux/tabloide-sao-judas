import sqlite3
import csv
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from backend.app.core.config import SQLITE_DB_PATH, OFFERS_CSV_PATH, IMAGES_DIR
from backend.app.services.offer_matcher import find_best_image_match

def get_db_connection():
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def parse_price(price_str: str) -> Optional[float]:
    """Extrai valor numérico de strings como 'R$ 38,90 - Promoção' ou 'R$ 0,59'."""
    if not price_str:
        return None
    match = re.search(r'R\$\s*([\d\.,]+)', price_str)
    if match:
        val = match.group(1).replace('.', '').replace(',', '.')
        try:
            return float(val)
        except ValueError:
            return None
    return None

def format_price_br(val: Optional[float]) -> str:
    """Formata número no padrão monetário brasileiro R$ XX,XX."""
    if val is None:
        return ""
    return f"R$ {val:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')

def init_db():
    """Cria tabelas no SQLite e popula com o CSV e catálogo de imagens."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS images_catalog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT UNIQUE NOT NULL,
        title TEXT,
        filesize INTEGER,
        format TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gtin TEXT,
        codigo TEXT,
        setor TEXT,
        descricao TEXT NOT NULL,
        preco_oferta REAL NOT NULL,
        preco_oferta_str TEXT NOT NULL,
        preco_de REAL,
        preco_de_str TEXT,
        preco_clube REAL,
        preco_clube_str TEXT,
        unidade TEXT,
        vigencia_inicio TEXT,
        vigencia_fim TEXT,
        imagem_nome TEXT,
        imagem_url TEXT,
        tem_imagem BOOLEAN DEFAULT 0,
        destaque BOOLEAN DEFAULT 0,
        observacao TEXT,
        selo TEXT
    )
    """)
    conn.commit()

    # Indexar Imagens disponíveis
    cursor.execute("SELECT COUNT(*) FROM images_catalog")
    count_imgs = cursor.fetchone()[0]
    
    available_images = []
    if IMAGES_DIR.exists():
        for p in IMAGES_DIR.iterdir():
            if p.is_file() and p.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp']:
                available_images.append(p.name)
                cursor.execute("""
                INSERT OR IGNORE INTO images_catalog (filename, title, filesize, format)
                VALUES (?, ?, ?, ?)
                """, (p.name, p.stem, p.stat().st_size, p.suffix.lower().replace('.', '')))
        conn.commit()

    # Popular Ofertas se estiver vazia
    cursor.execute("SELECT COUNT(*) FROM offers")
    count_offers = cursor.fetchone()[0]
    
    if count_offers == 0 and OFFERS_CSV_PATH.exists():
        # Ler CSV com cp1252 prioritário para acentuação perfeita brasileira
        encodings = ['cp1252', 'latin-1', 'iso-8859-1', 'utf-8']
        content = None
        for enc in encodings:
            try:
                with open(OFFERS_CSV_PATH, 'r', encoding=enc) as f:
                    content = f.read()
                if 'Açougue' in content or 'Código' in content:
                    break
            except Exception:
                continue

        if content:
            reader = csv.DictReader(content.splitlines(), delimiter=';')
            for row in reader:
                descricao = row.get('Descrição', '').strip()
                if not descricao:
                    continue
                
                gtin = row.get('GTIN/PLU', '').strip()
                codigo = row.get('Código', '').strip()
                setor = row.get('Setor', '').strip()
                raw_oferta = row.get('Preço de Oferta', '')
                raw_clube = row.get('Clube', '')
                
                preco_oferta = parse_price(raw_oferta) or 0.0
                preco_clube = parse_price(raw_clube)
                
                # Preço "De" (estimado com acréscimo proporcional de 20-30% para encarte)
                preco_de = round(preco_oferta * 1.25, 2) if preco_oferta > 0 else None
                
                unidade = "kg" if ("kg" in descricao.lower() or "kilo" in descricao.lower()) else "un"
                
                # Match com catálogo de imagens
                img_matched, score = find_best_image_match(descricao, available_images)
                tem_img = bool(img_matched)
                img_url = f"/api/images/file/{img_matched}" if img_matched else None
                
                # Destaques de capa (Alcatra, Acém, Café, Cerveja, Arroz)
                is_destaque = any(k in descricao.lower() for k in ['acem', 'alcatra', 'cafe', 'brahma', 'arroz'])
                
                selo = "OFERTA RELÂMPAGO"
                if preco_clube:
                    selo = "CLUBE SÃO JUDAS"
                elif is_destaque:
                    selo = "SUPER DESTAQUE"

                cursor.execute("""
                INSERT INTO offers (
                    gtin, codigo, setor, descricao,
                    preco_oferta, preco_oferta_str,
                    preco_de, preco_de_str,
                    preco_clube, preco_clube_str,
                    unidade, vigencia_inicio, vigencia_fim,
                    imagem_nome, imagem_url, tem_imagem,
                    destaque, observacao, selo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    gtin, codigo, setor, descricao,
                    preco_oferta, format_price_br(preco_oferta),
                    preco_de, format_price_br(preco_de) if preco_de else None,
                    preco_clube, format_price_br(preco_clube) if preco_clube else None,
                    unidade, row.get('Data Inicial', '16/10/2026'), row.get('Data Final', '18/10/2026'),
                    img_matched, img_url, 1 if tem_img else 0,
                    1 if is_destaque else 0, row.get('Observação', ''), selo
                ))
            conn.commit()

    conn.close()

def get_all_offers(setor: Optional[str] = None, busca: Optional[str] = None, apenas_com_imagem: bool = False) -> List[Dict[str, Any]]:
    """Consulta ofertas ativas com filtros."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM offers WHERE 1=1"
    params = []
    
    if setor and setor != "Todas as Categorias":
        query += " AND setor LIKE ?"
        params.append(f"%{setor}%")
        
    if busca:
        query += " AND (descricao LIKE ? OR gtin LIKE ? OR codigo LIKE ?)"
        params.extend([f"%{busca}%", f"%{busca}%", f"%{busca}%"])
        
    if apenas_com_imagem:
        query += " AND tem_imagem = 1"
        
    query += " ORDER BY destaque DESC, id ASC"
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = [dict(r) for r in rows]
    conn.close()
    return results

def get_stats() -> Dict[str, Any]:
    """Retorna estatísticas operacionais de telemetria."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM offers")
    total_ofertas = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM offers WHERE tem_imagem = 1")
    total_com_img = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM images_catalog")
    total_imagens = cursor.fetchone()[0]
    
    conn.close()
    
    taxa = round((total_com_img / total_ofertas * 100), 1) if total_ofertas > 0 else 0.0
    return {
        "status": "online",
        "erp_conectado": True,
        "dam_conectado": True,
        "total_ofertas": total_ofertas,
        "total_imagens": total_imagens,
        "total_com_imagem": total_com_img,
        "taxa_pareamento": taxa,
        "vigencia_atual": "16/10/2026 a 18/10/2026"
    }

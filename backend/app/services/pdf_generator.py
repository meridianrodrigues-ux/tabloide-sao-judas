import os
import uuid
from pathlib import Path
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm

from backend.app.core.config import OUTPUT_DIR, IMAGES_DIR

def generate_pdf_tabloide(offers: List[Dict[str, Any]], campaign_title: str, validity: str, template_id: str = "a4_16") -> Path:
    """
    Gera PDF de alta resolução no padrão A4 pronto para gráfica.
    Layout com cabeçalho institucional São Judas, grid de ofertas, imagens e preços destacados.
    """
    filename = f"tabloide_sao_judas_{uuid.uuid4().hex[:8]}.pdf"
    pdf_path = OUTPUT_DIR / filename
    
    # Dimensões A4 (595.27 x 841.89 points)
    width, height = A4
    c = canvas.Canvas(str(pdf_path), pagesize=A4)
    
    # 1. Borda e Fundo Geral
    c.setFillColor(colors.HexColor("#F8FAFC"))
    c.rect(0, 0, width, height, fill=True, stroke=False)
    
    # Moldura Externa Amarela / Dourada
    c.setStrokeColor(colors.HexColor("#FBC02D"))
    c.setLineWidth(4)
    c.rect(6, 6, width - 12, height - 12, fill=False, stroke=True)
    
    # 2. Cabeçalho Institucional Vermelho São Judas
    header_height = 80
    header_y = height - header_height - 10
    c.setFillColor(colors.HexColor("#B71C1C"))
    c.roundRect(12, header_y, width - 24, header_height, 6, fill=True, stroke=False)
    
    # Faixa Amarela no Topo do Cabeçalho
    c.setFillColor(colors.HexColor("#FBC02D"))
    c.roundRect(18, header_y + header_height - 28, 140, 22, 4, fill=True, stroke=False)
    
    c.setFillColor(colors.HexColor("#B71C1C"))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(24, header_y + header_height - 22, "SÃO JUDAS")
    
    # Título da Campanha
    c.setFillColor(colors.HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(170, header_y + header_height - 24, campaign_title.upper())
    
    c.setFillColor(colors.HexColor("#FFF7ED"))
    c.setFont("Helvetica", 9)
    c.drawString(170, header_y + header_height - 40, "SUPERMERCADO DA SUA FAMÍLIA • PREÇO BAIXO GARANTIDO")
    
    # Box de Vigência
    c.setFillColor(colors.HexColor("#D32F2F"))
    c.setStrokeColor(colors.HexColor("#FBC02D"))
    c.setLineWidth(1)
    c.roundRect(width - 190, header_y + 12, 170, 32, 16, fill=True, stroke=True)
    
    c.setFillColor(colors.HexColor("#FBC02D"))
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(width - 105, header_y + 30, validity.upper())
    c.setFillColor(colors.HexColor("#FFFFFF"))
    c.setFont("Helvetica", 7)
    c.drawCentredString(width - 105, header_y + 18, "Enquanto durarem os estoques")
    
    # 3. Grid de Ofertas (4 colunas x 4 linhas = 16 produtos)
    cols = 4
    rows = 4
    margin_x = 14
    margin_bottom = 20
    grid_width = width - (margin_x * 2)
    grid_height = header_y - margin_bottom - 10
    
    card_w = grid_width / cols
    card_h = grid_height / rows
    
    for idx, offer in enumerate(offers[:16]):
        col = idx % cols
        row = idx // cols
        
        card_x = margin_x + (col * card_w)
        # O ReportLab tem origem (0,0) no canto inferior esquerdo
        card_y = header_y - 10 - ((row + 1) * card_h)
        
        # Fundo do Card
        c.setFillColor(colors.HexColor("#FFFFFF"))
        c.setStrokeColor(colors.HexColor("#E2E8F0"))
        c.setLineWidth(1)
        c.roundRect(card_x + 3, card_y + 3, card_w - 6, card_h - 6, 6, fill=True, stroke=True)
        
        # Selo de Destaque / Clube
        selo = offer.get("selo") or "OFERTA"
        c.setFillColor(colors.HexColor("#D32F2F") if "DESTAQUE" in selo or "RELÂMPAGO" in selo else colors.HexColor("#4F46E5"))
        c.roundRect(card_x + 6, card_y + card_h - 18, card_w - 12, 12, 3, fill=True, stroke=False)
        c.setFillColor(colors.HexColor("#FFFFFF"))
        c.setFont("Helvetica-Bold", 6.5)
        c.drawCentredString(card_x + (card_w / 2), card_y + card_h - 15, selo[:22].upper())
        
        # Desenhar Imagem do Produto
        img_name = offer.get("imagem_nome")
        img_drawn = False
        if img_name:
            img_path = IMAGES_DIR / img_name
            if img_path.exists():
                try:
                    c.drawImage(
                        str(img_path),
                        card_x + 12, card_y + 38,
                        width=card_w - 24, height=card_h - 62,
                        preserveAspectRatio=True, anchor='c',
                        mask='auto'
                    )
                    img_drawn = True
                except Exception:
                    pass
                    
        if not img_drawn:
            c.setFillColor(colors.HexColor("#F1F5F9"))
            c.roundRect(card_x + 15, card_y + 40, card_w - 30, card_h - 65, 4, fill=True, stroke=False)
            c.setFillColor(colors.HexColor("#94A3B8"))
            c.setFont("Helvetica-Bold", 8)
            c.drawCentredString(card_x + (card_w / 2), card_y + (card_h / 2), "SÃO JUDAS")
        
        # Título / Descrição do Produto
        c.setFillColor(colors.HexColor("#1E293B"))
        c.setFont("Helvetica-Bold", 7.5)
        desc = offer.get("descricao", "")
        # Quebrar em 2 linhas se necessário
        if len(desc) > 22:
            c.drawString(card_x + 8, card_y + 30, desc[:22])
            c.setFont("Helvetica", 6.5)
            c.drawString(card_x + 8, card_y + 22, desc[22:45])
        else:
            c.drawString(card_x + 8, card_y + 28, desc)
            
        # Preço "De / Por"
        preco_de_str = offer.get("preco_de_str")
        if preco_de_str:
            c.setFillColor(colors.HexColor("#64748B"))
            c.setFont("Helvetica", 6)
            c.drawString(card_x + 8, card_y + 14, f"De: {preco_de_str}")
            
        preco_oferta_str = offer.get("preco_oferta_str", "R$ 0,00")
        unidade = offer.get("unidade", "un")
        
        # Preço em destaque vermelho
        c.setFillColor(colors.HexColor("#D32F2F"))
        c.setFont("Helvetica-Bold", 11)
        c.drawString(card_x + 8, card_y + 5, f"{preco_oferta_str}")
        
        c.setFillColor(colors.HexColor("#64748B"))
        c.setFont("Helvetica-Bold", 6.5)
        c.drawRightString(card_x + card_w - 8, card_y + 5, f"/{unidade}")

    # 4. Rodapé
    c.setFillColor(colors.HexColor("#64748B"))
    c.setFont("Helvetica", 6.5)
    c.drawString(20, 10, "Supermercado São Judas • Imagens meramente ilustrativas • Ofertas válidas durante a vigência ou término do estoque.")
    c.drawRightString(width - 20, 10, f"Gerado pelo Antigravity Tabloide Engine • {len(offers)} Ofertas")

    c.save()
    return pdf_path

def generate_social_image(offers: List[Dict[str, Any]], campaign_title: str, validity: str, format_type: str = "feed") -> Path:
    """
    Gera imagem PNG/WebP em alta fidelidade para Instagram Feed (1080x1350) ou Stories (1080x1920).
    """
    is_feed = (format_type == "feed")
    img_w = 1080
    img_h = 1350 if is_feed else 1920
    
    img = Image.new('RGB', (img_w, img_h), color='#F8FAFC')
    draw = ImageDraw.Draw(img)
    
    # Moldura institucional
    draw.rectangle([(0, 0), (img_w, img_h)], fill='#F8FAFC', outline='#FBC02D', width=12)
    
    # Cabeçalho Vermelho
    header_h = 160
    draw.rectangle([(12, 12), (img_w - 12, header_h)], fill='#B71C1C')
    
    # Texto do Header
    draw.text((40, 35), "SÃO JUDAS SUPERMERCADOS", fill='#FBC02D')
    draw.text((40, 75), campaign_title.upper(), fill='#FFFFFF')
    draw.text((40, 115), validity.upper(), fill='#FEF2F2')
    
    # Grid de Produtos (3x3 = 9 produtos ou 2x4 = 8 produtos)
    cols = 3
    rows = 3
    margin_top = 180
    card_w = (img_w - 60) // cols
    card_h = (img_h - margin_top - 60) // rows
    
    for idx, offer in enumerate(offers[:9]):
        col = idx % cols
        row = idx // cols
        
        cx = 30 + (col * card_w)
        cy = margin_top + (row * card_h)
        
        # Card branco
        draw.rounded_rectangle([(cx + 8, cy + 8), (cx + card_w - 8, cy + card_h - 8)], radius=16, fill='#FFFFFF', outline='#E2E8F0', width=2)
        
        # Selo
        selo = offer.get("selo", "OFERTA")
        selo_color = '#D32F2F' if "DESTAQUE" in selo or "RELÂMPAGO" in selo else '#4F46E5'
        draw.rounded_rectangle([(cx + 16, cy + 16), (cx + card_w - 16, cy + 44)], radius=8, fill=selo_color)
        draw.text((cx + 24, cy + 22), selo[:24].upper(), fill='#FFFFFF')
        
        # Imagem do produto
        img_name = offer.get("imagem_nome")
        if img_name:
            p_path = IMAGES_DIR / img_name
            if p_path.exists():
                try:
                    p_img = Image.open(p_path).convert('RGBA')
                    p_img.thumbnail((card_w - 40, card_h - 130), Image.Resampling.LANCZOS)
                    img.paste(p_img, (cx + (card_w - p_img.width) // 2, cy + 50), p_img)
                except Exception:
                    pass
                    
        # Descrição e Preço
        desc = offer.get("descricao", "")[:28]
        preco = offer.get("preco_oferta_str", "")
        unid = offer.get("unidade", "un")
        
        draw.text((cx + 20, cy + card_h - 68), desc, fill='#1E293B')
        draw.text((cx + 20, cy + card_h - 44), f"{preco} /{unid}", fill='#D32F2F')

    ext = "png"
    out_filename = f"tabloide_{format_type}_{uuid.uuid4().hex[:8]}.{ext}"
    out_path = OUTPUT_DIR / out_filename
    img.save(out_path, format="PNG", quality=95)
    return out_path

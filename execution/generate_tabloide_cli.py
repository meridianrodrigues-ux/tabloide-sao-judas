#!/usr/bin/env python3
"""
Camada 3 (Execução Determinística): Gerador de Tabloide via Linha de Comando (CLI)
Gera automaticamente a lâmina em PDF e imagem para redes sociais fora da interface web.
"""
import sys
import argparse
from pathlib import Path

# Adicionar raiz ao PYTHONPATH e assegurar UTF-8 no stdout
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from backend.app.core.database_offers import init_db, get_all_offers
from backend.app.services.pdf_generator import generate_pdf_tabloide, generate_social_image

def main():
    parser = argparse.ArgumentParser(description="Gerador de Tabloides São Judas (CLI)")
    parser.add_argument("--formato", choices=["pdf", "feed", "story", "all"], default="all", help="Formato de saída")
    parser.add_argument("--titulo", default="Carnaval de Ofertas São Judas", help="Título principal do encarte")
    parser.add_argument("--validade", default="16/10 a 18/10/2026", help="Texto de vigência")
    parser.add_argument("--limite", type=int, default=16, help="Quantidade de ofertas a incluir")
    args = parser.parse_args()
    
    init_db()
    offers = get_all_offers()[:args.limite]
    
    print(f"Gerando tabloide com {len(offers)} ofertas ativas...")
    
    if args.formato in ["pdf", "all"]:
        pdf_file = generate_pdf_tabloide(offers, args.titulo, args.validade)
        print(f"✅ PDF Gráfica 300 DPI gerado em: {pdf_file}")
        
    if args.formato in ["feed", "all"]:
        feed_img = generate_social_image(offers, args.titulo, args.validade, format_type="feed")
        print(f"✅ Imagem Feed Instagram (1080x1350) gerada em: {feed_img}")
        
    if args.formato in ["story", "all"]:
        story_img = generate_social_image(offers, args.titulo, args.validade, format_type="story")
        print(f"✅ Imagem WhatsApp Stories (1080x1920) gerada em: {story_img}")

if __name__ == "__main__":
    main()

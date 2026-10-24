#!/usr/bin/env python3
"""
Camada 3 (Execução Determinística): Validador e Sincronizador de Ofertas sem Imagem
Permite auditar ofertas e reportar produtos sem correspondência no DAM.
"""
import sys
from pathlib import Path

# Adicionar raiz ao PYTHONPATH e assegurar UTF-8 no stdout
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from backend.app.core.database_offers import init_db, get_stats, get_all_offers

def main():
    print("=" * 60)
    print(" [TABLOIDE SÃO JUDAS] - SINCRONIZADOR DE OFERTAS & DAM")
    print("=" * 60)
    
    init_db()
    stats = get_stats()
    
    print(f"Status ERP:           {'CONECTADO' if stats['erp_conectado'] else 'ERRO'}")
    print(f"Status DAM:           {'CONECTADO' if stats['dam_conectado'] else 'ERRO'}")
    print(f"Total de Ofertas:     {stats['total_ofertas']}")
    print(f"Total no Acervo DAM:  {stats['total_imagens']}")
    print(f"Ofertas c/ Imagem:    {stats['total_com_imagem']}")
    print(f"Taxa de Pareamento:   {stats['taxa_pareamento']}%")
    print("-" * 60)
    
    sem_imagem = [o for o in get_all_offers() if not o['tem_imagem']]
    if sem_imagem:
        print(f"⚠️ Alerta: {len(sem_imagem)} oferta(s) requerem atenção:")
        for idx, item in enumerate(sem_imagem, start=1):
            print(f"  {idx}. [GTIN: {item['gtin']}] {item['descricao']} ({item['setor']}) - Preço: {item['preco_oferta_str']}")
    else:
        print("✅ Sucesso: 100% das ofertas ativas possuem imagens correspondentes no DAM!")
    print("=" * 60)

if __name__ == "__main__":
    main()

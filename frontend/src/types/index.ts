export interface Offer {
  id: number;
  gtin: string;
  codigo: string;
  setor: string;
  descricao: string;
  preco_oferta: number;
  preco_oferta_str: string;
  preco_de?: number | null;
  preco_de_str?: string | null;
  preco_clube?: number | null;
  preco_clube_str?: string | null;
  unidade: string;
  vigencia_inicio: string;
  vigencia_fim: string;
  imagem_url?: string | null;
  imagem_nome?: string | null;
  tem_imagem: boolean;
  destaque: boolean;
  observacao?: string | null;
  selo?: string | null;
}

export interface SystemStatus {
  status: string;
  erp_conectado: boolean;
  dam_conectado: boolean;
  total_ofertas: number;
  total_imagens: number;
  total_com_imagem: number;
  taxa_pareamento: number;
  vigencia_atual: string;
}

export interface ImageCatalogItem {
  id: string;
  nome_arquivo: string;
  url: string;
  ean_sugerido?: string | null;
  tamanho_bytes: number;
  formato: string;
}

export type TemplateType = 'a4_16' | 'feed_1080x1350' | 'stories_1080x1920';

export interface CampaignTheme {
  id: string;
  nome: string;
  subtitulo: string;
  badge: string;
  corDestaque: string;
  corFundo: string;
  icone: string;
}

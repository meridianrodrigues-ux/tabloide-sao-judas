import type { Offer, SystemStatus, ImageCatalogItem } from '../types';

const API_BASE = '/api';

export const api = {
  async getStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Falha ao obter status dos bancos');
    return res.json();
  },

  async getOffers(categoria?: string, busca?: string, apenasComImagem?: boolean): Promise<Offer[]> {
    const params = new URLSearchParams();
    if (categoria && categoria !== 'Todas as Categorias') params.append('categoria', categoria);
    if (busca) params.append('busca', busca);
    if (apenasComImagem) params.append('apenas_com_imagem', 'true');

    const res = await fetch(`${API_BASE}/offers?${params.toString()}`);
    if (!res.ok) throw new Error('Falha ao listar ofertas');
    return res.json();
  },

  async bindImage(offerId: number, imageFilename: string): Promise<{ sucesso: boolean; mensagem: string }> {
    const res = await fetch(`${API_BASE}/offers/${offerId}/bind-image?image_filename=${encodeURIComponent(imageFilename)}`, {
      method: 'PUT'
    });
    if (!res.ok) throw new Error('Falha ao vincular imagem à oferta');
    return res.json();
  },

  async getImages(termo?: string): Promise<ImageCatalogItem[]> {
    const params = new URLSearchParams();
    if (termo) params.append('termo', termo);
    const res = await fetch(`${API_BASE}/images?${params.toString()}`);
    if (!res.ok) throw new Error('Falha ao buscar imagens no DAM');
    return res.json();
  },

  async uploadImage(file: File): Promise<{ sucesso: boolean; filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/images/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Falha no upload da imagem');
    return res.json();
  },

  async exportTabloide(payload: {
    template_id: string;
    formato: 'pdf' | 'png' | 'webp';
    resolucao: 'print' | 'digital';
    tema_campanha: string;
    titulo_campanha: string;
    subtitulo_campanha: string;
    validade: string;
    offers: Offer[];
  }): Promise<{ sucesso: boolean; arquivo_url: string; nome_arquivo: string; tamanho_kb: number }> {
    const res = await fetch(`${API_BASE}/export/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Falha ao gerar arquivo de exportação');
    return res.json();
  }
};

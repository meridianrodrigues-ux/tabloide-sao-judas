import { useState, useEffect } from 'react';
import { X, Search, Upload, Check, Image as ImageIcon } from 'lucide-react';
import type { Offer, ImageCatalogItem } from '../types';
import { api } from '../services/api';

interface ImageMatcherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetOffer: Offer | null;
  onImageMatched: (offerId: number, imageFilename: string) => void;
}

export const ImageMatcherDrawer: React.FC<ImageMatcherDrawerProps> = ({
  isOpen,
  onClose,
  targetOffer,
  onImageMatched
}) => {
  const [images, setImages] = useState<ImageCatalogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadImages();
      if (targetOffer) {
        // Pré-preenche busca com a primeira palavra do produto para sugestão imediata
        const firstWord = targetOffer.descricao.split(' ')[0] || '';
        setSearchTerm(firstWord);
      }
    }
  }, [isOpen, targetOffer]);

  const loadImages = async (termo?: string) => {
    setIsLoading(true);
    try {
      const data = await api.getImages(termo);
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadImages(searchTerm);
  };

  const handleSelectImage = async (filename: string) => {
    if (!targetOffer) return;
    try {
      await api.bindImage(targetOffer.id, filename);
      onImageMatched(targetOffer.id, filename);
      setFeedback(`Imagem "${filename}" vinculada com sucesso!`);
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Erro ao vincular imagem.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadImage(file);
      await loadImages();
      if (targetOffer) {
        await handleSelectImage(res.filename);
      }
    } catch (err) {
      console.error(err);
      alert('Falha no upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          {/* Header do Drawer */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-red text-white">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  DAM Image Matcher
                </h3>
                <p className="text-xs text-slate-500">
                  Pareamento inteligente de imagens de produtos
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo do Drawer */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-4">
            {/* Feedback Sucesso */}
            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sync-emerald text-xs font-bold flex items-center gap-2 animate-bounce">
                <Check className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Oferta Alvo */}
            {targetOffer && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-alert-orange">
                    Oferta Selecionada
                  </span>
                  <span className="font-mono text-xs text-slate-600">
                    EAN: {targetOffer.gtin}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {targetOffer.descricao}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{targetOffer.setor}</span>
                  <span className="font-bold text-brand-red">{targetOffer.preco_oferta_str}</span>
                </div>
              </div>
            )}

            {/* Upload Rápido de Foto */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
              <label className="text-xs font-bold text-brand-red hover:underline cursor-pointer">
                <span>Clique para enviar nova foto</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {isUploading ? 'Enviando arquivo...' : 'PNG transparente recomendado (máx. 10MB)'}
              </span>
            </div>

            {/* Barra de Busca no Acervo */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar no acervo de 70 fotos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand-red"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Buscar
              </button>
            </form>

            {/* Grid de Imagens do Catálogo */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700">
                Fotos no DAM ({images.length} disponíveis):
              </span>

              {isLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Carregando acervo DAM...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => handleSelectImage(img.nome_arquivo)}
                      className="group border border-slate-200 hover:border-brand-red rounded-xl p-2 bg-white flex flex-col items-center justify-between cursor-pointer transition-all hover:shadow-xs"
                    >
                      <div className="w-full h-20 flex items-center justify-center p-1 overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.nome_arquivo}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-700 truncate w-full text-center mt-1">
                        {img.nome_arquivo}
                      </span>
                      <button
                        type="button"
                        className="mt-1 w-full py-1 text-[10px] font-bold rounded bg-slate-100 group-hover:bg-brand-red group-hover:text-white transition-colors"
                      >
                        Vincular
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rodapé do Drawer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Sincronização imediata com banco local</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

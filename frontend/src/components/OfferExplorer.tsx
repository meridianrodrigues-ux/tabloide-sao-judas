import { useState } from 'react';
import { Search, Plus, Check, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import type { Offer } from '../types';

interface OfferExplorerProps {
  offers: Offer[];
  selectedOffers: Offer[];
  onAddOffer: (offer: Offer) => void;
  onOpenMatcherForOffer: (offer: Offer) => void;
  maxSlots: number;
}

export const OfferExplorer: React.FC<OfferExplorerProps> = ({
  offers,
  selectedOffers,
  onAddOffer,
  onOpenMatcherForOffer,
  maxSlots
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyWithImage, setOnlyWithImage] = useState(false);

  const selectedIds = new Set(selectedOffers.map((o) => o.id));

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.gtin.includes(searchTerm) ||
      offer.codigo.includes(searchTerm) ||
      offer.setor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesImage = onlyWithImage ? offer.tem_imagem : true;

    return matchesSearch && matchesImage;
  });

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
      {/* Cabeçalho da Seção de Seleção */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900">
            Explorador de Ofertas do ERP
          </h3>
          <p className="text-xs text-slate-500">
            Selecione as ofertas vigentes para compor a lâmina promocional do encarte
          </p>
        </div>

        {/* Controles de Busca e Filtro */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Campo de Busca */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por produto, EAN ou setor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-red w-56 sm:w-72"
            />
          </div>

          {/* Toggle Apenas com Foto */}
          <button
            type="button"
            onClick={() => setOnlyWithImage(!onlyWithImage)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              onlyWithImage
                ? 'bg-emerald-50 border-emerald-300 text-sync-emerald'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Apenas c/ Foto
          </button>
        </div>
      </div>

      {/* Grid de Ofertas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[560px] overflow-y-auto pr-1">
        {filteredOffers.map((offer) => {
          const isSelected = selectedIds.has(offer.id);
          const isFull = selectedOffers.length >= maxSlots;

          return (
            <div
              key={`explorer-offer-${offer.id}`}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-slate-50 border-brand-red/50 opacity-80'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  EAN: {offer.gtin}
                </span>

                {offer.tem_imagem ? (
                  <span className="text-[9px] font-bold text-sync-emerald bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sync-emerald" />
                    DAM OK
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenMatcherForOffer(offer)}
                    className="text-[9px] font-bold text-alert-orange bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 hover:bg-amber-100 cursor-pointer"
                  >
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Vincular Foto
                  </button>
                )}
              </div>

              {/* Foto Thumbnail e Detalhes */}
              <div className="flex items-center gap-3 my-1">
                <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  {offer.imagem_url ? (
                    <img
                      src={offer.imagem_url}
                      alt={offer.descricao}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
                    {offer.descricao}
                  </h4>
                  <span className="text-[10px] text-slate-500 truncate mt-0.5">
                    {offer.setor}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display font-extrabold text-sm text-brand-red">
                      {offer.preco_oferta_str}
                    </span>
                    <span className="text-[10px] text-slate-400">/{offer.unidade}</span>
                  </div>
                </div>
              </div>

              {/* Ação Adicionar à Lâmina */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                {isSelected ? (
                  <span className="text-xs font-bold text-sync-emerald flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Na Lâmina
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isFull}
                    onClick={() => onAddOffer(offer)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold shadow-2xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar à Lâmina</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

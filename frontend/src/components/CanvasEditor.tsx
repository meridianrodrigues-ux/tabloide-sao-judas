import { Download, Share2, X, Plus, AlertCircle } from 'lucide-react';
import type { Offer, CampaignTheme, TemplateType } from '../types';

interface CanvasEditorProps {
  selectedOffers: Offer[];
  theme: CampaignTheme;
  template: TemplateType;
  onRemoveOffer: (index: number) => void;
  onExport: (formato: 'pdf' | 'png', resolucao: 'print' | 'digital') => void;
  isExporting: boolean;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  selectedOffers,
  theme,
  template,
  onRemoveOffer,
  onExport,
  isExporting
}) => {
  const maxSlots = template === 'a4_16' ? 16 : template === 'feed_1080x1350' ? 9 : 8;

  // Formatação com centavos em sobrescrito
  const formatPriceParts = (priceStr: string) => {
    // Ex: "R$ 38,90" -> prefix: "R$", integer: "38", cents: "90"
    const match = priceStr.match(/R\$\s*(\d+)[\.,](\d{2})/);
    if (match) {
      return { prefix: 'R$', integer: match[1], cents: match[2] };
    }
    return { prefix: 'R$', integer: priceStr.replace(/[^\d]/g, '') || '0', cents: '00' };
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Ações de Exportação */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="font-display font-bold text-base text-slate-900">
            Diagramação da Lâmina em Tempo Real
          </h2>
          <p className="text-xs text-slate-500">
            Formato: {template === 'a4_16' ? 'Tabloide A4 Impresso (300 DPI)' : template === 'feed_1080x1350' ? 'Instagram Feed (1080x1350)' : 'WhatsApp Stories (1080x1920)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão Exportar PDF Gráfica */}
          <button
            type="button"
            disabled={isExporting || selectedOffers.length === 0}
            onClick={() => onExport('pdf', 'print')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Processando...' : 'Baixar PDF Gráfica (300 DPI)'}</span>
          </button>

          {/* Botão Exportar PNG Redes */}
          <button
            type="button"
            disabled={isExporting || selectedOffers.length === 0}
            onClick={() => onExport('png', 'digital')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-club-indigo" />
            <span>Exportar Redes (PNG)</span>
          </button>
        </div>
      </div>

      {/* Área da Lâmina (Canvas) */}
      <div className="bg-slate-100 p-3 sm:p-6 rounded-2xl border border-slate-200 flex justify-center overflow-x-auto shadow-inner">
        <div
          className={`w-full bg-white rounded-xl shadow-xl flex flex-col overflow-hidden relative border-4 border-promo-yellow transition-all duration-300 ${
            template === 'a4_16'
              ? 'max-w-[880px]'
              : template === 'feed_1080x1350'
              ? 'max-w-[640px] aspect-[4/5]'
              : 'max-w-[520px] aspect-[9/16]'
          }`}
        >
          {/* CABEÇALHO DO ENCARTE */}
          <div
            className="text-white px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden"
            style={{ backgroundColor: theme.corFundo }}
          >
            <div className="flex items-center gap-3">
              {/* Box Logo São Judas */}
              <div className="bg-promo-yellow text-brand-red-dark px-3 py-1 rounded-lg font-display font-extrabold text-lg tracking-tight shadow-sm flex items-center gap-1">
                <span>{theme.icone}</span>
                <span>SÃO JUDAS</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-sm sm:text-base uppercase tracking-tight text-promo-yellow leading-tight">
                    {theme.nome}
                  </span>
                  <span className="bg-promo-yellow text-brand-red-dark text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {theme.badge}
                  </span>
                </div>
                <span className="text-[11px] text-red-100 tracking-wider font-medium">
                  {theme.subtitulo}
                </span>
              </div>
            </div>

            {/* Box Vigência */}
            <div className="bg-brand-red/80 border border-promo-yellow/60 px-3 py-1 rounded-full text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-promo-yellow block">
                Válido de 16/10 a 18/10/2026
              </span>
              <span className="text-[9px] text-red-100 block">
                Ou até o término dos estoques
              </span>
            </div>
          </div>

          {/* ÁREA DE PRODUTOS E SLOTS */}
          <div className="p-3 sm:p-4 flex flex-col gap-3 bg-white flex-1">
            {/* Grid de Produtos */}
            <div
              className={`grid gap-2.5 ${
                template === 'a4_16'
                  ? 'grid-cols-2 sm:grid-cols-4'
                  : template === 'feed_1080x1350'
                  ? 'grid-cols-3'
                  : 'grid-cols-2'
              }`}
            >
              {Array.from({ length: maxSlots }).map((_, slotIndex) => {
                const offer = selectedOffers[slotIndex];

                if (!offer) {
                  return (
                    <div
                      key={`empty-slot-${slotIndex}`}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center min-h-[160px] text-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-slate-300 mb-1" />
                      <span className="text-xs font-semibold text-slate-400">
                        Slot {slotIndex + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 text-center">
                        Selecione no catálogo abaixo
                      </span>
                    </div>
                  );
                }

                const price = formatPriceParts(offer.preco_oferta_str);
                const isDestaque = offer.destaque || slotIndex < 2;
                const isClube = Boolean(offer.preco_clube);

                return (
                  <div
                    key={`offer-slot-${offer.id}-${slotIndex}`}
                    className={`group relative rounded-xl p-2.5 flex flex-col justify-between border transition-all duration-200 hover:shadow-md ${
                      isClube
                        ? 'bg-club-indigo-surface border-club-indigo-border'
                        : isDestaque
                        ? 'bg-promo-amber-surface border-promo-yellow'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Botão Remover Slot */}
                    <button
                      type="button"
                      onClick={() => onRemoveOffer(slotIndex)}
                      title="Remover produto da lâmina"
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 z-20 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs transition-opacity hover:bg-red-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Selo Promocional do Card */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs ${
                          isClube
                            ? 'bg-club-indigo text-white'
                            : isDestaque
                            ? 'bg-brand-red text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {offer.selo || (isClube ? 'CLUBE SÃO JUDAS' : 'OFERTA')}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400">
                        {offer.gtin}
                      </span>
                    </div>

                    {/* Imagem do Produto */}
                    <div className="h-28 w-full flex items-center justify-center p-1 relative my-1 overflow-hidden">
                      {offer.imagem_url ? (
                        <img
                          src={offer.imagem_url}
                          alt={offer.descricao}
                          className="h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <AlertCircle className="w-6 h-6 text-alert-orange mb-1" />
                          <span className="text-[10px] text-alert-orange font-bold">Sem Foto</span>
                        </div>
                      )}
                    </div>

                    {/* Título e Descrição */}
                    <div className="flex flex-col">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight min-h-[28px]">
                        {offer.descricao}
                      </h4>
                      <span className="text-[10px] text-slate-500 line-clamp-1">
                        {offer.setor}
                      </span>

                      {/* Bloco de Preços no Padrão de Varejo */}
                      <div className="mt-2 pt-1 border-t border-slate-100 flex items-end justify-between">
                        <div className="flex flex-col">
                          {offer.preco_de_str && (
                            <span className="font-mono text-[10px] text-slate-400 line-through leading-none">
                              De {offer.preco_de_str}
                            </span>
                          )}
                          <span className="text-[9px] font-bold uppercase text-brand-red leading-tight">
                            Por apenas
                          </span>
                        </div>

                        {/* Preço com centavos elevados */}
                        <div className="text-right">
                          <div className="flex items-baseline justify-end">
                            <span className="text-xs font-bold text-brand-red mr-0.5">
                              {price.prefix}
                            </span>
                            <span className="font-display font-extrabold text-lg sm:text-xl text-brand-red tracking-tight leading-none tabular-nums">
                              {price.integer}
                            </span>
                            <sup className="text-xs font-bold text-brand-red -top-1 ml-0.5 tabular-nums">
                              ,{price.cents}
                            </sup>
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 block -mt-0.5">
                            /{offer.unidade}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RODAPÉ INSTITUCIONAL */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
            <span>
              Supermercados São Judas • Imagens meramente ilustrativas • Ofertas válidas durante a vigência ou término do estoque.
            </span>
            <span className="font-mono font-bold text-slate-600">
              {selectedOffers.length} de {maxSlots} Ofertas Selecionadas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

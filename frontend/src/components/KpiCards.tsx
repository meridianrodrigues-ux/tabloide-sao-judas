import { LayoutGrid, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { SystemStatus } from '../types';

interface KpiCardsProps {
  currentCount: number;
  maxSlots: number;
  status: SystemStatus | null;
  onOpenMatcher: () => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  currentCount,
  maxSlots,
  status,
  onOpenMatcher
}) => {
  const percentage = Math.min(Math.round((currentCount / maxSlots) * 100), 100);
  const missingCount = status ? status.total_ofertas - status.total_com_imagem : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Ocupação do Grid */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50 text-brand-red">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Ocupação da Lâmina</span>
          </div>
          <span className="font-display font-extrabold text-xl text-brand-red">
            {currentCount} <span className="text-xs text-slate-400 font-sans">/ {maxSlots}</span>
          </span>
        </div>

        <div className="my-3">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Preenchimento do Template</span>
            <span className="font-mono font-bold text-slate-800">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-red h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {maxSlots - currentCount > 0
            ? `${maxSlots - currentCount} slots livres para fechamento da lâmina gráfica.`
            : 'Lâmina completa e pronta para exportação!'}
        </p>
      </div>

      {/* Card 2: Sincronia de Imagens */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-sync-emerald">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Sincronia de Imagens DAM</span>
          </div>
          <span className="text-xs font-bold text-sync-emerald bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
            {status ? `${status.taxa_pareamento}% Calibrado` : '...'}
          </span>
        </div>

        <div className="my-2">
          <span className="font-display font-extrabold text-2xl text-sync-emerald">
            {status ? status.total_com_imagem : 0}
          </span>
          <span className="text-xs text-slate-500 ml-2">
            ofertas com foto em alta resolução mapeadas
          </span>
        </div>

        <p className="text-xs text-sync-emerald font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Pronto para renderização em 300 DPI
        </p>
      </div>

      {/* Card 3: Pendências Críticas */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-alert-orange">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Pendências Críticas</span>
          </div>
          <span className="font-display font-extrabold text-xl text-alert-orange">
            {missingCount}
          </span>
        </div>

        <p className="text-xs text-slate-500 my-2">
          {missingCount > 0
            ? `${missingCount} oferta(s) requerem pareamento visual no DAM antes da impressão.`
            : 'Nenhuma pendência crítica. Todos os itens possuem fotos indexadas.'}
        </p>

        <button
          type="button"
          onClick={onOpenMatcher}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-alert-orange text-xs font-bold transition-colors"
        >
          <span>Resolver Match no DAM</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

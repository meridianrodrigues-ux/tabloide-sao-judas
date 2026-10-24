import { Palette, Sparkles, Check } from 'lucide-react';
import type { CampaignTheme } from '../types';

export const THEMES: CampaignTheme[] = [
  {
    id: 'carnaval',
    nome: '🎊 Carnaval de Ofertas',
    subtitulo: 'Bloco da Economia Garantida • Supermercado da Sua Família',
    badge: 'FOLIA DE PREÇOS',
    corDestaque: '#D32F2F',
    corFundo: '#B71C1C',
    icone: '🎊'
  },
  {
    id: 'fim_de_semana',
    nome: '☀️ Fim de Semana Campeão',
    subtitulo: 'Churrasco, Carnes Nobres e Cervejas com Preço Especial',
    badge: 'SEXTOU C/ ECONOMIA',
    corDestaque: '#F59E0B',
    corFundo: '#B45309',
    icone: '☀️'
  },
  {
    id: 'quarta_verde',
    nome: '🥬 Quarta & Quinta Verde',
    subtitulo: 'Hortifruti Direto do Produtor com Frescor Garantido',
    badge: 'DIRETO DA ROÇA',
    corDestaque: '#059669',
    corFundo: '#065F46',
    icone: '🥬'
  },
  {
    id: 'relampago',
    nome: '⚡ Ofertaço Relâmpago',
    subtitulo: 'Descontos Imbatíveis por Tempo Limitado ou Término de Estoque',
    badge: 'PREÇO BAIXO URGENTE',
    corDestaque: '#D97706',
    corFundo: '#92400E',
    icone: '⚡'
  }
];

interface ThemeCustomizerProps {
  currentTheme: CampaignTheme;
  onSelectTheme: (theme: CampaignTheme) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 text-alert-orange">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Customização de Molduras &amp; Selos Temáticos
            </h3>
            <p className="text-xs text-slate-500">
              Personalize o grafismo do encarte e as chamadas sazonais de cabeçalho
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-sync-emerald font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tema Dinâmico</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {THEMES.map((theme) => {
          const isSelected = currentTheme.id === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-brand-red bg-red-50/50 shadow-xs ring-1 ring-brand-red'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isSelected ? 'text-brand-red' : 'text-slate-800'}`}>
                  {theme.nome}
                </span>
                {isSelected && <Check className="w-4 h-4 text-brand-red" />}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 leading-tight">
                {theme.subtitulo}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

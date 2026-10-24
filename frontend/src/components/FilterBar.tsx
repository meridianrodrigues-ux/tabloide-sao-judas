import { Calendar, Tag, Printer, Camera, Smartphone, Save, Trash2 } from 'lucide-react';
import type { TemplateType } from '../types';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  template: TemplateType;
  onSelectTemplate: (tmpl: TemplateType) => void;
  onClearGrid: () => void;
  savedTime: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
  template,
  onSelectTemplate,
  onClearGrid,
  savedTime
}) => {
  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        {/* Filtros de Campanha e Categoria */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Vigência */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-brand-red" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
                Campanha
              </span>
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                Tabloide Rede 16 a 18/10
              </span>
            </div>
          </div>

          {/* Setor */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Tag className="w-4 h-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
                Departamento
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer pr-4"
              >
                <option value="Todas as Categorias">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seletor de Formato / Template */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onSelectTemplate('a4_16')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              template === 'a4_16'
                ? 'bg-white text-brand-red shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>A4 Impresso (16 Ofertas)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTemplate('feed_1080x1350')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              template === 'feed_1080x1350'
                ? 'bg-white text-brand-red shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Feed (1080x1350)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTemplate('stories_1080x1920')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              template === 'stories_1080x1920'
                ? 'bg-white text-brand-red shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Stories (1080x1920)</span>
          </button>
        </div>

        {/* Indicador de Salvamento e Limpeza */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
            <Save className="w-3.5 h-3.5 text-sync-emerald" />
            <span>Salvo {savedTime}</span>
          </div>

          <button
            type="button"
            onClick={onClearGrid}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-brand-red text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Grid</span>
          </button>
        </div>
      </div>
    </div>
  );
};

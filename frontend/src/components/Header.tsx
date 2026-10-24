import { Database, Image as ImageIcon, CheckCircle, Layers } from 'lucide-react';
import type { SystemStatus } from '../types';

interface HeaderProps {
  status: SystemStatus | null;
}

export const Header: React.FC<HeaderProps> = ({ status }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Identidade Institucional */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-red text-white font-display font-extrabold text-xl shadow-sm tracking-tighter">
            SJ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-brand-red tracking-tight leading-none">
                SÃO JUDAS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-red-surface text-brand-red">
                Estúdio de Tabloides
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Automação de Encartes &amp; Mídias Digitais</p>
          </div>
        </div>

        {/* Telemetria e Status dos Bancos */}
        <div className="hidden md:flex items-center gap-3">
          {/* ERP Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs text-slate-700">
            <Database className="w-3.5 h-3.5 text-brand-red" />
            <span className="font-medium">ERP Ofertas:</span>
            <span className="font-bold text-slate-900">{status ? `${status.total_ofertas} itens` : 'Conectando...'}</span>
            <span className="w-2 h-2 rounded-full bg-sync-emerald animate-pulse ml-1" />
          </div>

          {/* DAM Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs text-slate-700">
            <ImageIcon className="w-3.5 h-3.5 text-club-indigo" />
            <span className="font-medium">DAM Imagens:</span>
            <span className="font-bold text-slate-900">{status ? `${status.total_imagens} fotos` : '...'}</span>
            <span className="text-[10px] font-bold text-sync-emerald bg-sync-emerald-surface px-1.5 py-0.5 rounded">
              {status ? `${status.taxa_pareamento}% OK` : ''}
            </span>
          </div>

          {/* EAN Live Sync */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-sync-emerald-surface text-sync-emerald text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>EAN Live Sync</span>
          </div>
        </div>

        {/* Versão e Ação de Atualização */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 font-mono">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>v2.4 Pro</span>
          </div>
        </div>
      </div>
    </header>
  );
};

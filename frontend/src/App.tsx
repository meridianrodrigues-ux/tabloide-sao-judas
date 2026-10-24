import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { ThemeCustomizer, THEMES } from './components/ThemeCustomizer';
import { CanvasEditor } from './components/CanvasEditor';
import { OfferExplorer } from './components/OfferExplorer';
import { ImageMatcherDrawer } from './components/ImageMatcherDrawer';
import type { Offer, SystemStatus, CampaignTheme, TemplateType } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas as Categorias');
  const [template, setTemplate] = useState<TemplateType>('a4_16');
  const [theme, setTheme] = useState<CampaignTheme>(THEMES[0]);
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const [targetOfferForMatcher, setTargetOfferForMatcher] = useState<Offer | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [savedTime, setSavedTime] = useState('agora');

  const maxSlots = template === 'a4_16' ? 16 : template === 'feed_1080x1350' ? 9 : 8;

  // Carregamento inicial de dados
  useEffect(() => {
    loadInitialData();
  }, []);

  // Persistência automática no LocalStorage
  useEffect(() => {
    if (selectedOffers.length > 0) {
      localStorage.setItem(
        'tabloide_sao_judas_draft_v1',
        JSON.stringify({
          selectedOfferIds: selectedOffers.map((o) => o.id),
          template,
          themeId: theme.id
        })
      );
      setSavedTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }
  }, [selectedOffers, template, theme]);

  const loadInitialData = async () => {
    try {
      const [statusData, offersData] = await Promise.all([
        api.getStatus(),
        api.getOffers()
      ]);

      setStatus(statusData);
      setOffers(offersData);

      // Extrair categorias únicas
      const uniqueCats = Array.from(new Set(offersData.map((o) => o.setor).filter(Boolean)));
      setCategories(uniqueCats);

      // Restaurar do LocalStorage ou preencher primeiros 12 por padrão
      const savedDraft = localStorage.getItem('tabloide_sao_judas_draft_v1');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          const restored = parsed.selectedOfferIds
            .map((id: number) => offersData.find((o) => o.id === id))
            .filter(Boolean);

          if (restored.length > 0) {
            setSelectedOffers(restored);
            if (parsed.template) setTemplate(parsed.template);
            if (parsed.themeId) {
              const foundTheme = THEMES.find((t) => t.id === parsed.themeId);
              if (foundTheme) setTheme(foundTheme);
            }
            return;
          }
        } catch (e) {
          console.error('Falha ao restaurar draft:', e);
        }
      }

      // Fallback padrão: primeiros 12 produtos com foto
      const defaultSelection = offersData.filter((o) => o.tem_imagem).slice(0, 12);
      setSelectedOffers(defaultSelection);
    } catch (err) {
      console.error('Erro ao conectar à API:', err);
    }
  };

  const handleAddOffer = (offer: Offer) => {
    if (selectedOffers.length >= maxSlots) {
      alert(`O template atual suporta no máximo ${maxSlots} ofertas.`);
      return;
    }
    if (selectedOffers.some((o) => o.id === offer.id)) return;
    setSelectedOffers([...selectedOffers, offer]);
  };

  const handleRemoveOffer = (index: number) => {
    const updated = [...selectedOffers];
    updated.splice(index, 1);
    setSelectedOffers(updated);
  };

  const handleClearGrid = () => {
    if (window.confirm('Deseja limpar todos os produtos da lâmina atual?')) {
      setSelectedOffers([]);
      localStorage.removeItem('tabloide_sao_judas_draft_v1');
    }
  };

  const handleOpenMatcher = (offer?: Offer) => {
    if (offer) {
      setTargetOfferForMatcher(offer);
    } else {
      // Buscar primeira oferta sem foto se não especificada
      const missing = offers.find((o) => !o.tem_imagem);
      setTargetOfferForMatcher(missing || offers[0]);
    }
    setIsMatcherOpen(true);
  };

  const handleImageMatched = async (offerId: number, imageFilename: string) => {
    // Atualizar no estado local
    const updatedOffers = offers.map((o) => {
      if (o.id === offerId) {
        return {
          ...o,
          imagem_nome: imageFilename,
          imagem_url: `/api/images/file/${imageFilename}`,
          tem_imagem: true
        };
      }
      return o;
    });

    setOffers(updatedOffers);

    // Atualizar também na lâmina ativa se estiver presente
    setSelectedOffers(
      selectedOffers.map((o) => {
        if (o.id === offerId) {
          return {
            ...o,
            imagem_nome: imageFilename,
            imagem_url: `/api/images/file/${imageFilename}`,
            tem_imagem: true
          };
        }
        return o;
      })
    );

    // Recarregar status de telemetria
    try {
      const newStatus = await api.getStatus();
      setStatus(newStatus);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = async (formato: 'pdf' | 'png', resolucao: 'print' | 'digital') => {
    if (selectedOffers.length === 0) {
      alert('Selecione ao menos 1 produto para gerar a lâmina.');
      return;
    }

    setIsExporting(true);
    try {
      const res = await api.exportTabloide({
        template_id: template,
        formato,
        resolucao,
        tema_campanha: theme.id,
        titulo_campanha: theme.nome.replace(/^[^\s]+\s/, ''),
        subtitulo_campanha: theme.subtitulo,
        validade: 'Válido de 16/10 a 18/10/2026',
        offers: selectedOffers
      });

      // Download automático do arquivo
      const link = document.createElement('a');
      link.href = res.arquivo_url;
      link.download = res.nome_arquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Falha ao exportar arquivo. Verifique se o backend está ativo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-neutral-900">
      {/* Zona 1: Header de Telemetria */}
      <Header status={status} />

      {/* Zona 2: Barra Sticky de Filtros e Templates */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        template={template}
        onSelectTemplate={setTemplate}
        onClearGrid={handleClearGrid}
        savedTime={savedTime}
      />

      {/* Workspace Principal */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Zona 3: Cards KPI de Resumo */}
        <KpiCards
          currentCount={selectedOffers.length}
          maxSlots={maxSlots}
          status={status}
          onOpenMatcher={() => handleOpenMatcher()}
        />

        {/* Zona 4: Customizador de Molduras e Temas Sazonais */}
        <ThemeCustomizer currentTheme={theme} onSelectTheme={setTheme} />

        {/* Zona 5: Canvas Interativo de Preview & Diagramação */}
        <CanvasEditor
          selectedOffers={selectedOffers}
          theme={theme}
          template={template}
          onRemoveOffer={handleRemoveOffer}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {/* Zona 6: Explorador de Ofertas do ERP */}
        <OfferExplorer
          offers={
            selectedCategory === 'Todas as Categorias'
              ? offers
              : offers.filter((o) => o.setor.includes(selectedCategory))
          }
          selectedOffers={selectedOffers}
          onAddOffer={handleAddOffer}
          onOpenMatcherForOffer={(offer) => handleOpenMatcher(offer)}
          maxSlots={maxSlots}
        />
      </main>

      {/* Slide-Over Drawer do Image Matcher */}
      <ImageMatcherDrawer
        isOpen={isMatcherOpen}
        onClose={() => setIsMatcherOpen(false)}
        targetOffer={targetOfferForMatcher}
        onImageMatched={handleImageMatched}
      />
    </div>
  );
};

export default App;

<div align="center">

# 🛒 Tabloide São Judas • Estúdio de Diagramação
### *Automated Retail Promotional Flyer Engine & Digital Media Studio*

[![Antigravity Powered](https://img.shields.io/badge/Developed%20With-Google%20Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google)
[![Python FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React Vite](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20TS-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SENAI Edition](https://img.shields.io/badge/Project-SENAI%20Ourinhos%20Edition-E30613?style=for-the-badge)](https://sp.senai.br)

<p align="center">
  <b>Plataforma de alta performance para diagramação dinâmica, cruzamento de ofertas ERP e catálogo DAM, e exportação multi-canal de lâminas promocionais (PDF 300 DPI para impressão gráfica e PNG/WebP para redes sociais).</b>
</p>

[🇧🇷 Português](#-português) • [🇺🇸 English](#-english) • [🚀 Como Executar](#-inicialização-turnkey-1-clique) • [📐 Arquitetura](#-arquitetura-em-3-camadas)

---

</div>

## 🇧🇷 Português

### 📖 Visão Geral
O **Tabloide São Judas** é uma solução completa desenvolvida para automatizar a produção de encartes, lâminas de ofertas e mídias sociais para a rede de Supermercados São Judas. O sistema integra dados reais de ofertas vigentes do ERP com um catálogo de ativos visuais em alta resolução (DAM), realizando o pareamento automático por EAN/descrição com **taxa de sucesso de 96.7%**.

### ✨ Principais Recursos
- **Single-Page Workspace (5 Zonas Verticais):**
  1. **Header de Telemetria:** Monitoramento em tempo real da conexão com ERP e DAM de imagens.
  2. **Barra Sticky de Filtros:** Seleção de campanha vigente, departamentos (Açougue, Mercearia, Limpeza) e templates.
  3. **Cards KPI de Resumo:** Ocupação fracionada do encarte, calibragem de fotos indexadas e alerta de pendências críticas.
  4. **Customização de Molduras & Selos Sazonais:** Alternância entre temas dinâmicos (*Carnaval de Ofertas 🎊*, *Fim de Semana Campeão ☀️*, *Quarta & Quinta Verde 🥬*, *Ofertaço Relâmpago ⚡*).
  5. **Canvas Interativo de Diagramação:** Visualização fiel do encarte em tempo real com destaque para preços de varejo brasileiro (`R$ 38,90` com centavos em sobrescrito e `tabular-nums`), badges de Clube São Judas e Super Destaque.
- **Slide-Over Drawer (DAM Image Matcher):** Painel lateral deslizante de 440px para pareamento visual rápido, busca no acervo e upload de novas fotos de produtos.
- **Motor Gráfico Multi-Canal:**
  - **Gráfica:** Geração de PDF em alta resolução (300 DPI) via ReportLab.
  - **Redes Sociais:** Geração em PNG de alta definição para Instagram Feed (`1080x1350`) e WhatsApp Stories (`1080x1920`) via Pillow.
- **Persistência Reativa de Rascunho:** Sincronização automática do progresso no `localStorage` do navegador.
- **Inicialização Turnkey:** Scripts nativos para Windows (`executar.bat` e `encerrar.bat`) para operação em 1 clique fora de IDEs.

---

## 🇺🇸 English

### 📖 Overview
**Tabloide São Judas** is a high-performance retail automation platform designed to generate print-ready promotional flyers and social media campaigns for Supermercados São Judas. It seamlessly merges transactional ERP pricing data with high-resolution digital asset management (DAM) imagery, boasting an automated matching accuracy rate of **96.7%**.

### ✨ Key Features
- **5-Zone Single-Page Workspace:** Boundary-to-boundary telemetry header, sticky filter & template controller bar, KPI performance metric cards, seasonal theme customizer, and an interactive WYSIWYG flyer canvas.
- **Retail Monetary Precision:** Strict adherence to Brazilian retail pricing conventions (`R$ 38,90` with superscript cents and `font-variant-numeric: tabular-nums`).
- **Slide-Over DAM Drawer:** 440px side drawer for resolving unmapped items, fuzzy searching 70+ product assets, and dragging-and-dropping new photos.
- **Multi-Channel Compilation:** High-resolution 300 DPI PDF generation for commercial print houses alongside optimized PNG exports for Instagram Feeds (`1080x1350`) and WhatsApp Stories (`1080x1920`).
- **Turnkey Automation:** 1-click startup scripts (`executar.bat` & `encerrar.bat`) for Windows environments.

---

## 🤖 Agentes e Skills do Google Antigravity

Este projeto foi concebido, arquitetado e implementado através do ecossistema **Google Antigravity** utilizando o modelo **Gemini 3.8 Flash**:

| Agente / Skill | Função Operacional no Projeto |
| :--- | :--- |
| **`@agente-orquestrador`** | Orquestração central da esteira em 3 camadas (Diretivas, Decisão e Execução). |
| **`@app-builder`** | Estruturação full-stack dos módulos FastAPI e React 19 com Vite. |
| **`@frontend-design`** | Transposição do protótipo Stitch (`projects/14534029792625779890`) para Tailwind v4. |
| **`@clean-code`** | Padronização pragmática, modularização e tratamento de exceções. |
| **`@brainstorming`** | Refinamento Socratic Gate (`/grill-me`) das decisões de persistência e repositório. |

---

## 📐 Arquitetura em 3 Camadas

```text
tabloide-sao-judas/
├── 📁 directives/                   # [Camada 1: Estratégia] SOPs e Especificações
│   ├── projeto.md                  # Especificação canônica do sistema (SDD)
│   └── design/design.md            # Guia de UI/UX, Design Tokens e Design System
├── 📁 backend/                      # [Camada 2: Inteligência & APIs] FastAPI Engine
│   ├── app/
│   │   ├── core/                   # Configurações e conexão SQLite / ERP
│   │   ├── routers/                # Endpoints (status, offers, images, export)
│   │   ├── services/               # Offer Matcher, Image Processor e PDF Generator
│   │   └── main.py                 # Ponto de entrada FastAPI com CORS
│   └── tests/test_api.py           # Suíte de testes de integração automatizados
├── 📁 frontend/                     # [Camada 2: Workspace de Interface] React + Vite
│   ├── src/
│   │   ├── components/             # Header, FilterBar, KpiCards, CanvasEditor, etc.
│   │   ├── services/api.ts         # Cliente assíncrono tipado
│   │   └── App.tsx                 # Single-Page Workspace unificado
│   └── vite.config.ts              # Configuração Vite com proxy /api
├── 📁 execution/                    # [Camada 3: Ação Determinística] Scripts CLI
│   ├── sync_offers_images.py       # Auditoria de paridade de imagens DAM
│   └── generate_tabloide_cli.py    # Gerador de lâminas via linha de comando
├── 📁 documentation/                # Documentação técnica e histórico de prompts
│   └── promptHistory.md            # Rastreabilidade integral de prompts da sessão
├── 📁 data/                         # CSV de ofertas reais e acervo de imagens
├── executar.bat                     # Inicializador turnkey em 1 clique
└── encerrar.bat                     # Finalizador limpo de serviços e portas TCP
```

---

## 🚀 Inicialização Turnkey (1-Clique)

### Pré-requisitos
- **Python 3.10+** (adicionado ao PATH)
- **Node.js v18+** (adicionado ao PATH)

### Como rodar:
1. Dê um duplo clique no arquivo **`executar.bat`** na raiz do projeto.
2. O script irá:
   - Inicializar o backend FastAPI na porta `8000`.
   - Inicializar o frontend Vite na porta `5173`.
   - Abrir automaticamente seu navegador padrão em: **`http://localhost:5173`**.
3. Para encerrar todos os processos e liberar as portas com segurança, dê um duplo clique em **`encerrar.bat`**.

---

## 📡 Referência da API (FastAPI)

A documentação interativa Swagger está disponível em `http://localhost:8000/docs`:
- `GET /api/status`: Retorna a telemetria do ERP, acervo DAM e saúde das conexões.
- `GET /api/offers`: Consulta ofertas ativas com filtros por setor, busca e presença de imagem.
- `PUT /api/offers/{id}/bind-image`: Vincula manualmente uma foto do DAM à oferta.
- `GET /api/images`: Lista imagens indexadas no catálogo DAM.
- `GET /api/images/file/{filename}`: Entrega estática com cache e proteção de path traversal.
- `POST /api/images/upload`: Upload de fotos de produtos em PNG/JPEG.
- `POST /api/export/generate`: Renderiza e exporta a lâmina em PDF 300 DPI ou PNG.

---

<div align="center">
  <sub>Desenvolvido com excelência por <b>Google Antigravity</b> • SENAI Ourinhos Edition</sub>
</div>

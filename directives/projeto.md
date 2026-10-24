Aqui está o conteúdo formatado em **Markdown puro**, pronto para você copiar e colar diretamente no seu arquivo `projeto.md` (ou salvar na pasta `documentation/directives/projeto.md`):

```markdown
# Especificação Técnica do Sistema (SDD): Tabloide São Judas

> **Documento:** Diretiva de Engenharia e Arquitetura de Software  
> **Classificação:** Camada 1 (Estratégia & Especificação Canônica)  
> **Perfil:** Padrão Antigravity - Desenvolvimento Full-Stack de Alta Performance  
> **Versão:** 1.0 (Especificação Inicial de Geração Automática de Lâminas de Ofertas)

---

## 1. Visão Geral e Propósito

O **Tabloide São Judas** é uma plataforma/sistema de automação de design e geração de lâminas de ofertas para o Supermercado São Judas. O objetivo do sistema é integrar dados de ofertas e ativos visuais (imagens de produtos, selos e marcas) vindos de bancos de dados distintos para montar, previewizar e exportar tabloides promocionais em alta resolução para impressão e mídias digitais.

O projeto combina:
1. **Integração de Múltiplos Bancos de Dados:** Leitura e cruzamento de dados transacionais/ofertas (preços, de/por, datas de validade, regras de encarte) com repositório de ativos e imagens dos produtos (DAM / Banco de Imagens).
2. **Motor de Layout e Diagramação Dinâmica:** Algoritmo para distribuição inteligente e automatizada de produtos na lâmina (grid flexível, destaques de capa, produtos da semana, marcas próprias).
3. **Gerenciador de Imagens & Normalização:** Processamento e otimização dinâmica de imagens (remoção de fundo/fundo transparente, redimensionamento, tratamento WebP/PNG) para adequação ao layout.
4. **Exportação Multi-Canal em Alta Resolução:** Geração em lote de PDF/X para impressão gráfica e PNG/WebP otimizados para redes sociais (Instagram Feed/Stories, WhatsApp e telas do supermercado).
5. **Dashboard de Gestão de Ofertas e Previews:** Interface web interativa para seleção de ofertas, ajuste de diagramação drag-and-drop e pré-visualização em tempo real.
6. **Automação Turnkey:** Scripts nativos para Windows (`executar.bat` e `encerrar.bat`) permitindo inicialização rápida em 1 clique fora de qualquer IDE.

- **Motor de Desenvolvimento:** Google Antigravity + Gemini 3.8 Flash High
- **Princípios de Engenharia:** Clean Code, SOLID, Design Responsivo, Spec-Driven Development (SDD), Zero-Erro em Preços/EAN.

---

## 2. Arquitetura e Stack Tecnológica

### 2.1. Backend (API, Cruzamento de Dados & Engine Gráfico)
- **Linguagem & Framework:** Python 3.10+ com **FastAPI** assíncrono e **Uvicorn**.
- **Banco de Dados de Ofertas:** PostgreSQL / MySQL (ou SQLite local em desenvolvimento) para consulta de produtos em promoção, categorias, vigência de ofertas e preços (De / Por).
- **Banco / Storage de Imagens:** Repositório dedicado (PostgreSQL / MongoDB / Object Storage / Drive / Local File System) contendo o mapeamento de imagens de produtos via EAN / Código Interno.
- **Processamento de Imagens e Documentos:** **Pillow (PIL)** e **CairoSVG** / **PyMuPDF** para composição gráfica, corte, redimensionamento e exportação de templates em PDF/PNG.
- **Mapeador de Layouts (Template Engine):** Jinja2 / SVG Templates para manipulação vetorial e posicionamento dinâmico de ofertas no tabloide.

### 2.2. Frontend (Single-Page Workspace)
- **Framework:** **React 19** com **Vite** e **TypeScript** estruturado.
- **Estilização:** **Tailwind CSS v4** (tema institucional São Judas - vermelho, amarelo e branco).
- **Diagramação & Canvas Interativo:** `react-dnd` ou `Fabric.js` / HTML5 Canvas para pré-visualização e ajuste manual do layout das ofertas.
- **Ícones & UI:** `lucide-react` com badges semânticos (ex.: "Oferta Relâmpago", "Hortifruti", "Açougue").
- **Comunicação com Backend:** Fetch assíncrono tipado com proxy reverso no Vite (`/api -> http://localhost:8000`).
- **Persistência de Estado:** Sincronização automática do rascunho de tabloide via `localStorage`.

---

## 3. Estrutura de Diretórios do Projeto

```text
tabloide-sao-judas/
├── data/
│   ├── database/                   # Dumps/Mocks ou scripts de conexão com bancos
│   │   ├── ofertas_db.sqlite       # Banco com as ofertas ativas (ou conexão ERP/SQL)
│   │   └── imagens_catalog.json    # Mapeamento EAN -> Caminho/URL da imagem do produto
│   ├── assets/
│   │   ├── templates/              # Templates SVG/HTML de lâminas (A4, A3, Feed, Story)
│   │   ├── branding/               # Logos do São Judas, selos de desconto, bandeiras
│   │   └── products/               # Banco local de imagens dos produtos (.png transparentes)
│   └── output/                     # Diretório de arquivos gerados (PDFs, PNGs exportados)
├── backend/
│   ├── app/
│   │   ├── core/                   # Configurações globais e conexões com DBs
│   │   │   ├── database_offers.py  # Conexão com DB de ofertas
│   │   │   └── database_images.py  # Conexão com DB de imagens
│   │   ├── routers/
│   │   │   ├── status.py           # Status da API e saúde das conexões
│   │   │   ├── offers.py           # Busca, filtro e importação de ofertas ativas
│   │   │   ├── images.py           # Upload, busca e vinculação de imagens por EAN
│   │   │   ├── layout.py           # Organização do grid e posições do tabloide
│   │   │   └── export.py           # Renderização e exportação de PDF/PNG
│   │   ├── services/
│   │   │   ├── offer_matcher.py    # Cruzador automático: Ofertas DB <-> Imagens DB por EAN
│   │   │   ├── image_processor.py  # Otimizador de imagens (corte, redimensionamento, fundo)
│   │   │   └── pdf_generator.py    # Engine de composição visual e geração de PDF de alta res
│   │   ├── schemas.py              # Contratos Pydantic sincronizados
│   │   └── main.py                 # Ponto de entrada FastAPI com middlewares de CORS
│   ├── tests/
│   │   └── test_api.py             # Testes de integração automatizados (pytest)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx          # Telemetria do sistema, data do tabloide e status
│   │   │   ├── OfferSelector.tsx   # Painel de seleção das ofertas vindas do banco
│   │   │   ├── CanvasEditor.tsx    # Preview do tabloide em tempo real com grid flexível
│   │   │   ├── ImageMatcher.tsx    # Modal de ajuste de imagem caso o EAN não case
│   │   │   ├── TemplatePicker.tsx  # Seleção do tipo de lâmina (Fim de Semana, Horti, etc.)
│   │   │   └── ExportDrawer.tsx    # Painel de exportação para PDF impresso / Redes Sociais
│   │   ├── services/api.ts         # Camada de comunicação com a API
│   │   ├── types/index.ts          # Tipagens TypeScript compartilhadas
│   │   ├── App.tsx                 # Single-Page Workspace unificado
│   │   ├── main.tsx
│   │   └── index.css               # Design tokens e Tailwind CSS v4 (Tema São Judas)
│   ├── vite.config.ts              # Configuração Vite com proxy /api -> porta 8000
│   └── package.json
├── documentation/
│   ├── directives/                 # Diretivas e especificações
│   │   ├── projeto.md              # Esta especificação técnica
│   │   ├── design/design.md        # Guia visual, cores e dimensões dos tabloides
│   │   └── script-executar-bat.md  # SOP de inicialização turnkey
│   └── promptHistory.md            # Rastreabilidade integral de todos os prompts
├── execution/                      # Scripts determinísticos de processamento em lote
│   ├── sync_offers_images.py       # Validador e sincronizador de ofertas sem imagem
│   └── generate_tabloide_cli.py    # Gerador de tabloide via linha de comando
├── executar.bat                    # Script turnkey de inicialização em 1 clique
├── encerrar.bat                    # Finalizador limpo de serviços e portas TCP
└── README.md                       # Documentação técnica do projeto

```

---

## 4. Regras de Negócio Críticas e Decisões de Arquitetura

### 4.1. Mapeamento e Match Automático: Ofertas vs. Imagens (EAN / Código do Produto)

* **Regra de Cruzamento:** O sistema deve associar automaticamente o item em promoção no **Banco de Ofertas** à sua respectiva imagem no **Banco de Imagens** utilizando a chave **EAN (Código de Barras)** ou **Código Interno (SKU)**.
* **Tratamento para Imagem Ausente:** Caso uma oferta não possua imagem cadastrada no banco:
1. Exibir badge de alerta na interface: `⚠️ Sem Imagem`.
2. Permitir busca manual no banco com autocomplete ou upload rápido no próprio painel.
3. Exibir imagem padrão de fallback (*Placeholder* institucional do São Judas) no layout para não quebrar a geração.



### 4.2. Tratamento de Preços, Fracionamento e Moeda

* **Arredondamento e Formatação:** Todos os valores numéricos de preço devem ser estritamente formatados com padrão monetário brasileiro:
* Exemplo: `R$ 12,99` (com destaque visual para os centavos no design do encarte).
* Produtos vendidos por peso (`/kg` ou `/100g`) devem exibir a unidade de medida clara no rodapé do card de oferta.


* **Destaque do "De / Por" e Descontos Clube:**
* Ofertas com desconto "Clube São Judas" ou "Leve X Pague Y" devem conter selos visuais específicos e destacados.



### 4.3. Diagramação e Templates Flexíveis

* **Tipos de Lâminas Suportadas:**
* **Tabloide Impresso Semana:** Tamanhos A4 ou A3 (frente/verso ou página dupla, de 8 a 16 ofertas por página).
* **Especial Hortifruti / Açougue:** Grid adaptado para produtos sem marca (layout limpo com fotos tratadas).
* **Mídias Digitais:** Formatado em `1080x1350` (Feed Instagram/WhatsApp) e `1080x1920` (Stories/Status).


* **Hierarquia de Destaque:** O layout deve prever espaços diferenciados:
* **Super Destaque de Capa (Top 1 ou Top 2):** Espaço maior no topo para os produtos com maior desconto.
* **Ofertas Secundárias:** Grid regular proporcional.



### 4.4. Resolução e Tratamento Visual

* **Impressão:** Geração de PDF em 300 DPI, modo de cor CMYK (ou compatível com pré-impressão).
* **Digital:** Geração em PNG/WebP em 72/150 DPI, RGB otimizado para carregamento rápido no WhatsApp e Instagram.

### 4.5. Persistência de Filtros e Rascunho

* A montagem atual do tabloide (ofertas selecionadas, posições no grid, template escolhido) deve ser salva no `localStorage` do navegador (`tabloide_sao_judas_draft`), garantindo que o usuário não perca o trabalho ao atualizar a página.

---

## 5. Contratos de API (FastAPI)

### `GET /api/status`

Retorna a saúde dos bancos de dados (Banco de Ofertas e Banco de Imagens) e o total de ofertas ativas e imagens cadastradas no catálogo.

### `GET /api/offers`

Parâmetros: `vigencia`, `categoria`, `busca`, `apenas_com_imagem`.
Retorna a lista de ofertas ativas no banco de dados, prontas para inclusão no tabloide.

### `GET /api/images/search`

Parâmetros: `ean`, `sku`, `termo`.
Busca imagens no banco de ativos por EAN, código interno ou nome do produto.

### `POST /api/layout/preview`

Corpo da requisição: Lista de ofertas com posições no grid, IDs de templates e configurações de selos.
Retorna a estrutura renderizada para o preview dinâmico no React.

### `POST /api/export/generate`

Corpo da requisição: Configuração final do tabloide (`template_id`, `formato: pdf|png|webp`, `resolucao: print|digital`).
Retorna o link de download e preview do arquivo gerado em `data/output/`.

---

## 6. Roteiro Acelerado de Implementação (Fast-Track)

Ao iniciar o desenvolvimento no Antigravity, siga este passo a passo sequencial para construir o sistema do zero:

```
[Etapa 1: Estrutura & Conexão DBs] ──> [Etapa 2: Módulo Match EAN] ──> [Etapa 3: API FastAPI]
                                                                                │
[Etapa 6: Automação .BAT]          <── [Etapa 5: Generator PDF/PNG]  <── [Etapa 4: Frontend React]

```

### Passo 1: Estruturação & Integração de Banco de Dados

* Configurar os conectores do backend para o banco de ofertas e o repositório/banco de imagens.
* Criar a estrutura de mock/dados locais em `data/database/` para testes iniciais de leitura de preços e links de imagens.

### Passo 2: Mapeamento e Matching Automático (Ofertas <-> Imagens)

* Desenvolver o serviço `offer_matcher.py` para cruzar as tabelas por EAN/SKU e reportar inconsistências de imagens ausentes.
* Criar rotina de redimensionamento e transparência em `image_processor.py`.

### Passo 3: Criação dos Endpoints FastAPI

* Desenvolver os roteadores modulares em `backend/app/routers/` (`status`, `offers`, `images`, `export`).
* Validar as respostas tipadas via Pydantic e realizar testes de integração em `backend/tests/test_api.py`.

### Passo 4: Estruturação do Frontend (Vite + React 19 + Tailwind v4)

* Configurar as cores do Supermercado São Judas no Tailwind CSS v4 (`index.css`).
* Criar a barra de status (`Header.tsx`), o seletor de ofertas (`OfferSelector.tsx`) e o quadro visual de montagem do encarte (`CanvasEditor.tsx`).

### Passo 5: Motor de Renderização de Tabloide (PDF e PNG)

* Implementar o `pdf_generator.py` para composição dos templates SVG/HTML convertidos em PDF para gráfica e PNG para mídias sociais.
* Adicionar o drawer de exportação (`ExportDrawer.tsx`).

### Passo 6: Criação dos Scripts Turnkey

* Criar `executar.bat` e `encerrar.bat` na raiz do projeto para subir simultaneamente o backend FastAPI (porta 8000) e o frontend Vite (porta 5173) com 1 clique.

```

```
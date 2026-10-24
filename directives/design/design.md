# Guia de UI/UX e Design System: Tabloide São Judas

> **Documento:** Especificação Visual, Design System e Arquitetura de Interface (SDD)  
> **Classificação:** Camada 2 (Diretiva de Design Canônica)  
> **Perfil:** Padrão Antigravity - High-Performance Retail Design & Mobile-First  
> **Versão:** 1.0 (Especificação Visual do Gerador de Lâminas e Encartes)

---

## 1. Filosofia Visual e Diretrizes Gerais

O **Tabloide São Judas** foi concebido para transmitir agilidade operacional, precisão comercial e forte identidade institucional. Como a plataforma cruza milhares de ofertas do ERP com bancos de imagens em alta resolução, a interface deve equilibrar um ambiente de edição robusto com uma estética limpa, focada em evitar qualquer erro de precificação.

- **Conceito:** *Clean Retail Productivity* (inspirado na fluidez de editores como Canva e Figma, mas focado exclusivamente em produtividade de encartes de supermercado).
- **Tema:** Exclusivamente **Light Mode Moderno** (fundos neutros em ardósia suave, tipografia de alto contraste para leitura de preços, e paleta intencional nas cores da marca: Vermelho e Amarelo).
- **Abordagem:** **Mobile-First** na gestão, adaptativo para Desktop. A seleção de ofertas e filtros funciona perfeitamente em `375px`, enquanto o *Canvas de Edição* se expande organicamente para resoluções Desktop (`1280px+`) para diagramação fina.
- **Arquitetura de Tela:** **Single-Page Workspace** (Interface Única). Elimina telas soltas e modais desconexos; a navegação ocorre por reatividade instantânea, seleção drag-and-drop, painel lateral deslizante (*slide-over drawer*) e preview em tempo real.

---

## 2. Paleta de Cores e Design Tokens (Tailwind CSS v4)

### 2.1. Cores de Superfície e Estrutura
- **Background Global:** `#F8FAFC` (`slate-50`) — tom acinzentado frio que destaca os cards brancos dos produtos.
- **Superfície de Cards e Canvas:** `#FFFFFF` (`white`) com contorno refinado `#E2E8F0` (`slate-200`) e sombra suave `shadow-xs hover:shadow-md`.
- **Texto Primário (Nomes de Produtos, Preços):** `#212121` (`neutral-900`) — contraste visual máximo.
- **Texto Secundário (EAN, SKU, Categorias):** `#64748B` (`slate-500`).
- **Bordas e Divisórias:** `#F1F5F9` (`slate-100`) a `#E2E8F0` (`slate-200`).

### 2.2. Acentos de Marca e Identidade Promocional
- **Cor Primária da Marca (São Judas):** `#D32F2F` (`red-700`) com fundos suaves `#FEF2F2` (`red-50`). Representa a identidade principal e botões de ação primária (Exportar).
- **Cor Secundária (Destaque Promocional):** `#FBC02D` (`yellow-400`) a `#F59E0B` (`amber-500`). Utilizada para selos de "Oferta" e "Clube".
- **Indicadores Semânticos e Alertas:**
  - **Sincronia Perfeita (Com Imagem):** `#059669` (`emerald-600`) — pill de sucesso.
  - **Alerta (Sem Imagem / Falta EAN):** `#EA580C` (`orange-600`) — pill com ícone `⚠️ Sem Imagem`.
- **Badge Promocional (Clube São Judas / Leve X Pague Y):**
  - `#4F46E5` (`indigo-600`) com fundo `#EEF2FF` (`indigo-50`) e borda `#C7D2FE` (`indigo-200`). Ícone: `Tag` ou `Star`.

### 2.3. Tipografia e Formatação Numérica
- **Família Tipográfica:** `Inter` (UI do sistema) e `Montserrat` ou `Poppins` (Títulos e Preços no encarte) para garantir peso visual de varejo.
- **Formatação Numérica Mandatória:**
  - Uso de `font-variant-numeric: tabular-nums` para EAN, SKU e preços, evitando oscilações visuais.
  - **Padrão Monetário Estrito:** Todos os preços devem ser formatados como `R$ 12,99` (nunca `12.9`). No encarte, os centavos devem aparecer em tamanho reduzido (suprescrito) em relação ao valor inteiro, conforme padrão do varejo.

---

## 3. Anatomia da Interface Única (Layout Vertical em 5 Zonas)

A interface única do Tabloide São Judas é organizada em **5 zonas verticais consecutivas**:


```

┌────────────────────────────────────────────────────────────────────────┐
│ ZONA 1: Header & Status dos Bancos (ERP Ofertas & DAM Imagens)         │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 2: Barra Sticky de Filtros, Categorias e Seleção de Template      │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 3: Cards de Resumo da Campanha (Ativos, Imagens OK, Imagens Aus.) │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 4: Canvas Interativo de Preview e Diagramação (Drag & Drop)       │
│  - 4.1: Workspace Central (Lâmina visual renderizada em tempo real)    │
│  - 4.2: Barra Flutuante de Exportação (PDF Impressão / PNG Redes)      │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 5: Explorador de Ofertas e Matcher (Grid + Drawer Lateral Completo)
└────────────────────────────────────────────────────────────────────────┘

```

---

### Zona 1: Header de Telemetria e Status (Topo)
- **Objetivo:** Estabelecer controle operacional imediato sobre a integração de dados e saúde do sistema.
- **Componentes:**
  1. **Logo São Judas:** Identidade visual com badge *Gerador de Tabloides*.
  2. **Contadores de Sincronização:**
    - **Ofertas Ativas (ERP):** `1.240 itens em promoção nesta semana`.
    - **Banco de Imagens:** `14.500 produtos indexados`.
  3. **Pills de Conexão:**
    - `[DB] Conectado ao ERP (PostgreSQL)`
    - `[STORAGE] Imagens Acessíveis (AWS/Drive)`
  4. **Status de Processamento:** Badge pulsante verde `Sincronização EAN concluída com sucesso`.

---

### Zona 2: Barra de Filtros e Templates (Sticky Bar)
- Fixa no topo ao rolar a página (`sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-slate-200/80`).
- **Hierarquia dos Seletores:**
  `Vigência` (Data) ➔ `Categoria` (Hortifruti, Açougue, Mercearia) ➔ `Template` (A4 Impresso, Feed 1080x1350, Stories).
- **Persistência de Estado Automática:** O estado do tabloide em rascunho é salvo no `localStorage` sob a chave `tabloide_draft_v1`, permitindo que o operador não perca o trabalho em andamento.
- **Ação Rápida:** Botão `Limpar Grid` para esvaziar a lâmina e recomeçar a seleção.

---

### Zona 3: Painel Resumo da Lâmina Atual (Cards de Desempenho)
Dispostos lado a lado em Desktop (`grid grid-cols-1 md:grid-cols-3 gap-6`):
1. **Card 1 — Ocupação do Tabloide:**
  - Contador fracionado: `12 / 16 produtos` selecionados para o grid do template atual.
2. **Card 2 — Status de Imagens (Match):**
  - Quantidade de ofertas na lâmina com imagens perfeitas (`text-emerald-600`).
3. **Card 3 — Alertas Críticos (Falta de Imagem):**
  - Produtos na seleção que precisam de upload ou fallback de imagem (`text-orange-600`). Funciona como um atalho para abrir o corretor visual.

---

### Zona 4: Canvas Interativo de Preview (Visual Dashboard)
Esta seção é o coração do projeto, simulando a folha do encarte:

#### 4.1. Workspace Central (Preview em Tempo Real)
- Uma área delimitada por bordas tracejadas exibindo o aspecto real da mídia (ex: proporção A4).
- Grade (Grid) onde os produtos selecionados aparecem formatados.
- **Interatividade:** Capacidade de arrastar ofertas (Drag & Drop) para reorganizar a ordem, definir destaques maiores de capa ou rebaixar itens para o rodapé.
- Renderização visual utilizando HTML/CSS simulando a saída final do Python/CairoSVG.

#### 4.2. Barra Flutuante de Exportação
- Fixa na parte inferior ou direita do Canvas.
- Botões de ação em alto contraste (`bg-red-700 text-white`):
  - `Baixar PDF (Gráfica - 300 DPI)`
  - `Baixar Imagens (PNG/WebP - Digital)`

---

### Zona 5: Explorador de Ofertas e Ajustes (Master-Detail)

#### 5.1. Grid do Banco de Ofertas
- Cabeçalho com busca por descrição, EAN ou SKU.
- **Lista de Produtos (Cards em linha ou grid):** Cada card exibe:
  - Miniatura da imagem do banco (ou placeholder institucional se não houver).
  - Nome do produto destacado e Código EAN discreto.
  - Box de Preço (`De: R$ 14,99` `Por: R$ 9,99`).
  - Botão de ação: `Adicionar à Lâmina` (que envia o produto para a Zona 4).
  - Badge de status de imagem (`✅ OK` ou `⚠️ Faltando`).

#### 5.2. Slide-Over Drawer de Edição de Oferta (Image Matcher)
Ao clicar em qualquer produto no grid ou no canvas, desliza suavemente um painel lateral a partir da direita (Desktop):
1. **Cabeçalho da Oferta:**
  - Nome Oficial e EAN do ERP.
2. **Editor de Preço e Selos:**
  - Campos não-editáveis com os preços vindos do banco (garantia de conformidade).
  - Seletor opcional para adicionar selos extras: *Leve 3 Pague 2*, *Oferta Relâmpago*, *Clube São Judas*.
3. **Gerenciador de Imagem (Upload/Substituição):**
  - Visualização ampliada do ativo fotográfico.
  - Se a imagem estiver ausente ou incorreta, interface de upload rápido (drag and drop de arquivo local) para o banco de imagens, ou busca manual por EAN no acervo para forçar o cruzamento de dados.

---

## 4. Diretrizes de Performance e Acessibilidade

1. **Responsividade Estrita e Adaptação do Canvas:**
  - Em telas menores que `640px`, o Canvas de Preview encolhe utilizando `transform: scale()` para manter a proporção completa na tela sem quebrar a renderização, e o Drawer ocupa 100% da tela mobile.
2. **Prevenção de FADIGA Visual e Prevenção de Erros Financeiros:**
  - Os preços são as informações com maior peso (font-weight) e contraste da interface. Erros em preços geram passivos legais, portanto, não é permitido mascarar dados do banco.
3. **Persistência e Confiabilidade:**
  - Transições suaves com CSS transitions (`duration-200`).
  - Exportação assíncrona com loading spinners globais para prevenir que o usuário feche a página durante o processamento de PDFs pesados.

```
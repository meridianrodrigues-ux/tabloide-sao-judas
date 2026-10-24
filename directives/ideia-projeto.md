# Ideia e Visão Geral do Projeto: Tabloide São Judas

Quero criar um projeto no Antigravity para o meu trablho. Trata-se do **Tabloide do Supermercado São Judas**, uma plataforma web para automação de lâminas de ofertas de supermercado que mescla conhecimentos de integração de dados transacionais (ERP), consumo de APIs, cruzamento de ativos e processamento gráfico.

Como fonte de dados utilizaremos dois ecossistemas que estarão dispostos no nosso projeto na subpasta `data/database`: 
- Em `data/database` temos os arquivos de banco de dados (`ofertas_db.sqlite` / JSONs) contendo as ofertas ativas (preços normais "De", preços promocionais "Por", regras de Clube São Judas, datas de vigência, categoria e chave EAN/SKU).
- Em `data/assets/products` temos o repositório/banco de imagens com os produtos tratados (fundo transparente `.png`/`.webp`), indexados pelo nome do produto.
- Em `data/assets/templates` teremos os modelos e grids (A4, A3, Feed Instagram `1080x1350` e Stories `1080x1920`) para montagem visual do encarte.

Importante frisar a relevância do alinhamento exato entre as ofertas do banco e o catálogo de imagens. Precisamos de uma forma de lê-los rapidamente, realizar o cruzamento automático via EAN e sinalizar divergências.

Nosso objetivo é um sistema web onde teremos uma interface única, que traz a informação dos bancos e arquivos importados (quantidade de ofertas ativas no ERP, total de produtos com e sem imagem vinculada) e exibe o carregamento e a **% de carregamento efetivo e sincronização dos ativos**.

Abaixo teremos a visualização e seleção de ofertas por categoria (Hortifruti, Açougue, Mercearia, Bebidas, Limpeza) e por vigência:
- Ao selecionar uma categoria ou template, teremos a exibição do resumo do encarte, o preview em tempo real do tabloide e a listagem de ofertas no grid.
- Os produtos e os cards de cada oferta aparecem no layout de encarte. Ao clicar em cada um deles, podemos ver e editar os detalhes (nome do produto, EAN/SKU, preço De/Por, selo promocional aplicável como *Clube São Judas* ou *Leve X Pague Y*, e a imagem associada).
- **Importante:** é imprescindível aparecer a foto correta do produto, o nome exato e o preço formatado no padrão monetário brasileiro (`R$ 12,99`), destacando centavos e unidade de medida (`/kg`, `/un`).

Tudo isso deve ser desenvolvido em uma estrutura clean, light, moderna e atraente, além de claro responsiva e utilizar as principais stacks atuais. Utilize clean code e mobile-first.
Quero todo o plano de implementação muito bem desenvolvido.

---

### Instrução para o Agente (SDD)

A partir deste pedido, assuma o papel de um **Engenheiro de IA Sênior** e, utilizando uma visão de **SDD (Spec-Driven Development)**, gere de forma orquestrada, pensando na utilização do **Antigravity com Gemini 3.8 Flash High** como ferramenta de desenvolvimento, o conteúdo de dois arquivos:

1. **`projeto.md`** (localizado em `documentation/directives/projeto.md`): que será o guia técnico oficial da arquitetura, backend FastAPI, banco de dados de ofertas/imagens, algoritmo de match por EAN, rotas e Fast-Track a ser executado no Antigravity.
2. **`design.md`** (localizado em `documentation/directives/design/design.md`): que será o guia visual de UI/UX, design tokens do São Judas (Tailwind CSS v4), grid responsivo de lâminas e layout dos componentes do editor do encarte.
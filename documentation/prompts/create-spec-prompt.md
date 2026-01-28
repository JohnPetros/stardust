# Create Spec Skill

**Objetivo:**
Detalhar a implementação técnica de uma feature, fix ou refatoração, atuando como um Tech Lead Sênior. O documento deve servir como uma ponte estritamente definida entre o PRD (Product Requirements Document) e o código, com nível de detalhe suficiente para que a implementação seja direta e sem ambiguidades.

**Entrada:**
* Esboço da tarefa ou solicitação de mudança.
* PRD associado (nível superior).
* Acesso à codebase atual.

**Diretrizes de Execução:**

1.  **Pesquisa e Contextualização (Chain of Thought):**
    *   **Mapeie o Fluxo:** Antes de escrever, entenda a origem e o destino dos dados (UI -> Store -> Service -> API).
    *   **Verifique a Existência:** Investigue a codebase para identificar recursos existentes (Widgets, DTOs, Services) que devem ser reutilizados ou estendidos. Evite duplicidade.
    *   **Consulte Guidelines:** Aplique os padrões das camadas definidos em `documentation/guidelines/guidelines-rule.md` (core, rest, ui, database, provision, rpc, ai).
    *   **Identifique Referências:** Procure na codebase por exemplos similares ("copy-paste inteligente") para sugerir como referência.

2.  **Estruturação do Documento:**
    Gere o arquivo Markdown da Spec seguindo estritamente o modelo de seções e nível de detalhe abaixo:

    ---
    # Spec: [Título]

    ### Application [server|studio|web] (Obrigatório)
    ### Ultima atualização: DD/MM/AAAA (Obrigatório)
    ### Status: [em desenvolvimento|concluído] (Obrigatório)

    ### 1. Objetivo (Obrigatório)
    [Resumo claro em um parágrafo do que será entregue funcionalmente e tecnicamente.]

    ### 2. O que já existe? (Obrigatório)
    [Liste recursos da codebase que serão utilizados ou impactados.]
    *   **`NomeDaClasse`** (`caminho/relativo/do/arquivo`) - *[Breve descrição do uso (ex: método a chamar, store a consumir).]*

    ### 3. O que deve ser criado? (Depende da tarefa)
    [Descreva novos componentes dividindo por camadas. Para cada arquivo novo, detalhe:]

    #### Camada REST (Controllers)
    *   **Localização:** `caminho/do/arquivo`
    *   **Dependências:** O que deve ser injetado.
    *   **Dados de request:** Liste os valores que devem ser recebidos pelo controller.
    *   **Dados de response:** Liste os valores que devem ser retornados pelo controller.
    *   **Métodos:** Assinatura e responsabilidade.

    #### Camada REST (Services)
    *   **Localização:** `caminho/do/arquivo`
    *   **Dependências:** O que deve ser injetado.
    *   **Métodos:** Assinatura e responsabilidade.

    #### Pacote Validation (Schemas)
    *   **Localização:** `caminho/do/arquivo`
    *   **Atributos:** Dados que devem ser validados com Zod.

    #### Camada RPC (Actions)
    *   **Localização:** `caminho/do/arquivo`
    *   **Dependências:** O que deve ser injetado.
    *   **Dados de request:** Liste os valores que devem ser recebidos pela action.
    *   **Dados de response:** Liste os valores que devem ser retornados pela action.
    *   **Métodos:** Assinatura e responsabilidade.

    #### Camada UI (Widgets)
    *   **Localização:** `caminho/do/arquivo`
    *   **Props:** Parâmetros recebidos.
    *   **Estados (Client Component):** Como se comporta em Loading, Error, Empty, Content.
    *   **View:** Nome e caminho da view do widget.
    *   **Hook (se aplicável):** Nome e caminho do hook do widget.
    *   **Index:** Hooks, actions e stores usadas no index.
    *   **Widgets internos:** Widgets filhos a serem criados.

    #### Camada UI (Stores)
    *   **Localização:** `caminho/do/arquivo`
    *   **Props:** Parâmetros recebidos no construtor.
    *   **Estados:** Estrutura do estado (Loading, Error, Data).
    *   **Actions:** Métodos de mutação.

    #### Camada Hono App (Routes)
    *   **Localização:** `caminho/do/arquivo`
    *   **Middlewares:** Lista de middlewares.
    *   **Caminho da rota:** Relativo à raiz da API.
    *   **Dados de schema:** Zod Schema para validação.

    #### Camada Ingest App (Functions)
    *   **Localização:** `caminho/do/arquivo`
    *   **metodos:** Assinatura e responsabilidade.

    #### Camada Nextjs App (Pages, Layouts)
    *   **Localização:** `caminho/do/arquivo`
    *   **Widgets:** Widget principal da rota.
    *   **Caminho da rota:** Relativo à raiz da aplicação Next.js.

    #### Camada React Router App (Pages, Layouts)
    *   **Localização:** `caminho/do/arquivo`
    *   **Widgets:** Widget principal da rota.
    *   **Caminho da rota:** Relativo à raiz da aplicação React Router.

    #### Camada AI (Workflows)
    *   **Localização:** `caminho/do/arquivo`
    *   **Dependências:** O que deve ser injetado.
    *   **Entrada/Saída:** Dados processados.
    *   **Métodos:** Assinatura e responsabilidade.

    ### 4. O que deve ser modificado? (Depende da tarefa)
    [Alterações em código existente.]
    *   **Arquivo:** `caminho/do/arquivo`
    *   **Mudança:** [Descreva a mudança específica (ex: "Adicionar prop `onTap`", "Injetar novo service")]

    ### 5. O que deve ser removido? (Depende da tarefa)
    [Limpeza de código legado ou refatoração.]

    ### 6. Diagramas e Referências
    *   **Fluxo de Dados:** Gere um diagrama em notação ASCII ou Text-based mostrando a interação entre as camadas.
    *   **Layout:** Use ASCII para representar a hierarquia visual de telas e widgets complexos.
    *   **Referências:** Links para arquivos similares na codebase para servir de exemplo.
    ---
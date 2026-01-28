# Create Spec Skill

**Objetivo:**
Detalhar a implementação técnica de uma feature, fix ou refatoração, atuando como um Tech Lead Sênior. O documento deve servir como uma ponte estritamente definida entre o PRD (Product Requirements Document) e o código, com nível de detalhe suficiente para que a implementação seja direta e sem ambiguidades.

**Entrada:**

* Esboço da tarefa ou solicitação de mudança.
* PRD associado (nível superior).
* Acesso à codebase atual.

**Diretrizes de Execução:**

1. **Pesquisa e Contextualização (Chain of Thought):**
* **Mapeie o Fluxo:** Antes de escrever, entenda a origem e o destino dos dados (UI -> Store -> Service -> API).
* **Verifique a Existência:** Investigue a codebase para identificar recursos existentes (Widgets, DTOs, Services) que devem ser reutilizados ou estendidos. Evite duplicidade.
* **Consulte Guidelines:** Aplique os padrões das camadas (`core`, `rest`, `ui`, `database`, `provision`, `rpc`, `ai`).
* **Identifique Referências:** Procure na codebase por exemplos similares ("copy-paste inteligente") para sugerir como referência.


2. **Estruturação do Documento:**
Gere o arquivo Markdown da Spec seguindo estritamente o modelo de seções e nível de detalhe abaixo:
* ### 1. Título (Obrigatório)


Nome técnico da tarefa ou funcionalidade.
* ### 2. Objetivo (Obrigatório)


Resumo claro em um parágrafo do que será entregue funcionalmente e tecnicamente.
* ### 3. O que já existe? (Obrigatório)


Liste recursos da codebase que serão utilizados ou impactados.
* Formato: **`NomeDaClasse`** (`caminho/relativo/do/arquivo`) - *Breve descrição do uso (ex: método a chamar, store a consumir).*


* ### 4. O que deve ser criado? (Depende da tarefa)


Descreva novos componentes dividindo por camadas. Para cada arquivo novo, detalhe:
* **Camada REST (Controllers):**
* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado.
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller.
* **Dados de response:** Liste os valores que devem ser retornados pelo controller.
* **Métodos:** Assinatura e responsabilidade.

* **Camada REST (Services):**
* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado.
* **Métodos:** Assinatura e responsabilidade.

* **Camada RPC (Actions):**
* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado.
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller.
* **Dados de response:** Liste os valores que devem ser retornados pelo controller.
* **Métodos:** Assinatura e responsabilidade.

* **Camada UI (Widgets):**
* **Localização:** `caminho/do/arquivo`
* **Props:** Parâmetros recebidos.
* **Estados (se for do tipo client component):** Como se comporta em Loading, Error, Empty, Content.
* **View:** Cite o nome e o caminho da view do widget
* **Hook (se aplicável):** Cite o nome e o caminho do hook do widget
* **Index:** liste os hooks, actions e stores que serão usadas no index do widget para serem consumidas pelo hook ou view do widget
* **Widgets internos (se aplicável):** Liste os widgets que serão criados e utilizados dentro do widget pai seguindo a mesma formatação descrita acima.

* **Camada UI (Stores):**
* **Localização:** `caminho/do/arquivo`
* **Props:** Parâmetros recebidos no construtor.
* **Estados se for do tipo client component:** Como se comporta em Loading, Error, Empty, Content.
* **Widgets internos:** Liste os widgets que serão criados e utilizados dentro do widget pai seguindo a mesma formatação descrita acima.

* **Camada Hono App (Routes):**
* **Localização:** `caminho/do/arquivo`
* **Middlewares:** Lista de middlewares a serem aplicados na rota.
* **caminho da rota:** Caminho relativo a partir da rota da API Rest.
* **Dados de schema:** objetos de Zod Schema para validar as rotas.

* **Camada Nextjs App (Pages, Layouts, etc):**
* **Localização:** `caminho/do/arquivo`
* **Widgets:** Widget a ser utilizado na rota.
* **caminho da rota:** Caminho relativo a partir da rota da apicação Nextjs.

* **Camada React Router App (Pages, Layouts, etc):**
* **Localização:** `caminho/do/arquivo`
* **Widgets:** Widget a ser utilizado na rota.
* **caminho da rota:** Caminho relativo a partir da rota da apicação React Router.

* **Camada AI (Workflows):**
* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado.
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller.
* **Dados de response:** Liste os valores que devem ser retornados pelo controller.
* **Métodos:** Assinatura e responsabilidade.


* ### 5. O que deve ser modificado? (Depende da tarefa)


Alterações em código existente.
* Indique o arquivo e descreva a mudança específica (ex: "Adicionar prop `onTap`", "Injetar novo service").


* ### 6. O que deve ser removido? (Depende da tarefa)


Limpeza de código legado ou refatoração.
* ### 7. Usar como referência (Opcional)


3. **Diagramas de Visualização:**
* **Fluxo de Dados:** Gere um diagrama em notação ASCII ou Text-based mostrando a interação entre as camadas.
* **Layout:** Como mencionado acima, use ASCII para representar a hierarquia visual de telas e widgets complexos.
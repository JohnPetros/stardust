---
description: Prompt para criar uma especificação técnica detalhada com base no PRD e na arquitetura do projeto.
---

**Objetivo:** Detalhar a implementação técnica de uma feature, fix ou refatoração, atuando como um Tech Lead Sênior. O documento deve servir como uma ponte estritamente definida entre o PRD (Product Requirements Document) e o código, com nível de detalhe suficiente para que a implementação seja direta e sem ambiguidades.

## Entrada

- Esboço da tarefa ou solicitação de mudança.
- Acesso à codebase atual.

---

## Diretrizes de Execução

### 1. Pesquisa e Contextualização

#### 1.1 PRD
Antes de escrever a spec:
- Leia o PRD associado à spec (localizado um nível acima na árvore de documentos).
- Identifique requisitos relevantes para implementação.
- **Não replique o PRD completo**; resuma apenas o que impacta a execução técnica.

#### 1.2 Identificação de camadas
- Identifique a aplicação e as camadas que serão utilizadas para implementar a feature, conforme descrito em `documentation/rules/rules.md`.

#### 1.3 Delegação para subagentes
Distribua estrategicamente a pesquisa da codebase e das regras específicas por camada para subagentes especializados.

Cada subagente deve retornar, para sua camada:
- Arquivos relevantes encontrados
- Padrões e convenções da camada
- Implementações similares na codebase (com caminhos)
- Dependências envolvidas
- Riscos e pontos de atenção
- Lacunas, inconsistências ou dúvidas

#### 1.4 Síntese
- Consolide as descobertas dos subagentes em um único documento.
- Organize as informações de forma clara e objetiva.
- Priorize consistência com os padrões existentes da codebase.

---

### 2. Uso de Ferramentas Auxiliares

- **MCP Serena:** Utilize para facilitar a busca por arquivos no projeto.
- **MCP Context7:** Caso tenha dúvidas sobre como usar bibliotecas específicas (ex: `shadcn/ui`, `radix-ui`, `inngest`, `supabase`, `hono`, `zod`), utilize para obter documentação e exemplos.
- **Tool `question`:** Use para fazer perguntas ao solicitante quando houver:
  - lacunas no PRD
  - incongruências com a codebase
  - decisões críticas sem evidência suficiente

---

## Estrutura do Documento (Markdown)

Gere o arquivo Markdown da Spec seguindo **estritamente** o modelo de seções abaixo.

### Cabeçalho (Frontmatter)

```md
---
title: <Título claro>
prd: <link para o PRD referente à spec, localizado no nível acima do diretório da spec>
apps: <server|studio|web> lista de apps que serão impactados pela spec, separados por vírgula
status: <em_progresso|concluido>
last_updated_at: <YYYY-MM-DD>
---
```

---

# 1. Objetivo (Obrigatório)

[Resumo claro em um parágrafo do que será entregue funcionalmente e tecnicamente.]

---

# 2. Escopo (Obrigatório)

## 2.1 In-scope

[Liste o que está contemplado por esta spec.]

## 2.2 Out-of-scope

[Liste explicitamente o que não será tratado nesta spec.]

---

# 3. Requisitos (Obrigatório)

## 3.1 Funcionais

[Liste os requisitos funcionais relevantes para implementação, resumidos a partir do PRD.]

## 3.2 Não funcionais

[Liste apenas requisitos técnicos verificáveis/mensuráveis, quando aplicável.]

Exemplos de categorias (usar apenas se aplicável):

* Performance
* Segurança
* Observabilidade
* Resiliência
* Idempotência
* Compatibilidade retroativa
* Acessibilidade
* Latência

> Evite requisitos vagos (ex: “ser rápido”). Prefira critérios verificáveis.

---

# 4. O que já existe? (Obrigatório)

[Liste recursos da codebase que serão utilizados ou impactados.]

## [Nome da Camada]

* **`NomeDaClasseOuModulo`** (`caminho/relativo/do/arquivo`) - *[Breve descrição do uso (ex: método a chamar, store a consumir, widget base, schema similar).]*

---

# 5. O que deve ser criado? (Depende da tarefa)

[Descreva novos componentes dividindo por camadas. Para cada arquivo novo, detalhe e marque explicitamente como **novo arquivo**.]

## Camada REST (Controllers)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Dependências:** O que deve ser injetado
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller
* **Dados de response:** Liste os valores que devem ser retornados pelo controller
* **Métodos:** Assinatura e responsabilidade

## Camada REST (Services)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Dependências:** O que deve ser injetado
* **Métodos:** Assinatura e responsabilidade

## Camada Banco de Dados (Repositories)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Dependências:** O que deve ser injetado
* **Métodos:** Assinatura e responsabilidade

## Camada Banco de Dados (Mappers)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Métodos:** Assinatura e responsabilidade

## Camada Banco de Dados (Types)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **props:** Propriedades do tipo

## Camada Provision (Providers)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Dependências:** O que deve ser injetado
* **Biblioteca:** Nome da biblioteca utilizada pelo provider
* **métodos:** Assinatura e responsabilidade

## Pacote Validation (Schemas)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Atributos:** Dados que devem ser validados com Zod

## Camada RPC (Actions)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Dependências:** O que deve ser injetado
* **Dados de request:** Liste os valores que devem ser recebidos pela action
* **Dados de response:** Liste os valores que devem ser retornados pela action
* **Métodos:** Assinatura e responsabilidade

## Camada UI (Widgets)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Props:** Parâmetros recebidos
* **Estados (Client Component):** Como se comporta em Loading, Error, Empty, Content
* **View:** Nome e caminho da view do widget
* **Hook (se aplicável):** Nome e caminho do hook do widget
* **Index:** Hooks, actions e stores usadas no index
* **Widgets internos:** Widgets filhos a serem criados
* **Estrutura de pastas:** Caso haja widgets internos, escreva a estrutura completa do widget pai

## Camada UI (Stores)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Props:** Parâmetros recebidos no construtor
* **Estados:** Estrutura do estado (Loading, Error, Data)
* **Actions:** Métodos de mutação

## Camada UI (Contexts)

* **Localização:** `caminho/da/pasta` (**novo arquivo** se aplicável)
* **Props:** Parâmetros recebidos via props
* **Hook do provider:** Nome e caminho do hook do provider
* **Responsabilidade:** Lista de responsabilidades do context
* **Value:** Objeto que contém os dados e métodos disponibilizados aos filhos

## Camada AI (Workflows)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Dependências:** O que deve ser injetado
* **Entrada/Saída:** Dados processados
* **Métodos:** Assinatura e responsabilidade

## Camada AI (Tools)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Dependências:** O que deve ser injetado
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller
* **Dados de response:** Liste os valores que devem ser retornados pelo controller
* **Métodos:** Assinatura e responsabilidade

## Camada Hono App (Routes)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Middlewares:** Lista de middlewares
* **Caminho da rota:** Relativo à raiz da API
* **Dados de schema:** Zod Schema para validação

## Camada Inngest App (Functions)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Métodos:** Assinatura e responsabilidade

## Camada Next.js App (Pages, Layouts)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Widget principal:** Widget principal da rota
* **Caminho da rota:** Relativo à raiz da aplicação Next.js

## Camada React Router App (Pages, Layouts)

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Widget principal:** Widget principal da rota
* **Caminho da rota:** Relativo à raiz da aplicação React Router

> Se uma camada não se aplicar, **não inclua ela na spec**.
> Se achar necessário falar sobre um recurso não mapeado na seção acima, sinta-se livre para adicionar uma seção extra para falar sobre ele seguindo o seu próprio padrão mas condizente com o padrão dos outros recursos mapeados.

---

# 6. O que deve ser modificado? (Depende da tarefa)

[Descreva alterações em código existente.]

## [Nome da Camada]

* **Arquivo:** `caminho/do/arquivo`
* **Mudança:** [Descreva a mudança específica (ex: “Adicionar prop `onTap`”, “Injetar novo service”)]
* **Justificativa:** [Explique por que a mudança é necessária]
* **Camada:** `ui` | `core` | `rest` | `provision` | `queue` | `database` | `ai`

> Se não houver alterações em código existente, escrever: **Não aplicável**.

---

# 7. O que deve ser removido? (Depende da tarefa)

[Descreva remoções de código legado, APIs antigas, widgets obsoletos ou limpeza de refatoração.]

## [Nome da Camada]

* **Arquivo:** `caminho/do/arquivo`
* **Motivo da remoção:** [Explique por que pode ser removido]
* **Impacto esperado:** [Explique impacto e dependências, se houver]

> Se não houver remoções, escrever: **Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs (Obrigatório)

[Registre decisões relevantes para revisão futura.]

Para cada decisão importante:

* **Decisão**
* **Alternativas consideradas**
* **Motivo da escolha**
* **Impactos / trade-offs**

---

# 9. Diagramas e Referências (Obrigatório)

* **Fluxo de Dados:** Gere um diagrama em notação ASCII ou text-based mostrando a interação entre camadas.
* **Layout (se aplicável):** Use ASCII para representar a hierarquia visual de telas e widgets complexos.
* **Referências:** Liste links/caminhos de arquivos similares na codebase para servir de exemplo.

---

# 10. Pendências / Dúvidas (Quando aplicável)

[Liste perguntas em aberto, incongruências e pontos que dependem de confirmação.]

Para cada item:

* **Descrição da pendência**
* **Impacto na implementação**
* **Ação sugerida:** (ex: usar tool `question`, validar com produto, validar com arquitetura)

> Se não houver pendências, escrever: **Sem pendências**.

---

## Restrições (Obrigatório)

* **Não inclua testes automatizados na spec.**
* Todos os caminhos citados devem existir no projeto **ou** estar explicitamente marcados como **novo arquivo**.
* **Não invente** arquivos, métodos, contratos, schemas ou integrações sem evidência no PRD/codebase.
* Quando faltar informação suficiente, registrar em **Pendências / Dúvidas** e usar a tool `question` se necessário.
* Toda referência a código existente deve incluir caminho relativo real.
* Se uma seção não se aplicar, preencher explicitamente com **Não aplicável**.
* A spec deve ser consistente com os padrões já existentes na codebase (nomenclatura, organização de pastas, contratos e convenções por camada).



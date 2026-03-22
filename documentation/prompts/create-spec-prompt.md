---
description: Prompt para criar uma especificação técnica detalhada com base no PRD e na arquitetura do projeto.
---

**Objetivo:** Detalhar a implementação técnica de uma feature, fix ou refatoração, atuando como um Tech Lead Sênior. O documento deve servir como uma ponte estritamente definida entre o PRD (Product Requirements Document) e o código, com nível de detalhe suficiente para que a implementação seja direta e sem ambiguidades.

## Entrada

- **PRD:** deve existir e estar finalizado antes de iniciar a spec.
- **Esboço da tarefa:** descrição da feature, fix ou refatoração a implementar.
- **Acesso à codebase:** necessário para pesquisa e validação de padrões.

> Se o PRD estiver ausente ou incompleto, não inicie a spec.
> Registre a lacuna em **Pendências / Dúvidas** e use a tool `question`.

---

## Diretrizes de Execução

### 1. Pesquisa e Contextualização

#### 1.1 PRD

Antes de escrever a spec:
- Leia o PRD associado à spec, sendo que ela é uma milestone do GitHub.
- Identifique requisitos relevantes para implementação.
- **Não replique o PRD completo**; resuma apenas o que impacta a execução técnica.

#### 1.2 Identificação de camadas e apps/pacotes

- Leia `documentation/rules/rules.md` e identifique:
  - Quais apps serão tocados (`server`, `web`, `studio`)
  - Quais camadas serão envolvidas por app (ex: `ui`, `rest`, `database`, `ai` etc)
- Com base nisso, defina:
  - Quantos subagentes serão criados (um por app tocado + um para pacotes compartilhados, quando aplicável)
  - O escopo exato de cada subagente antes de delegar

#### 1.3 Delegação para subagentes

Distribua estrategicamente a pesquisa da codebase por app/pacote para subagentes especializados, conforme o escopo definido em 1.2.

Cada subagente deve **pesquisar e reportar**, sem tomar decisões de implementação. O agente principal é responsável pela síntese e pelas decisões finais.

Cada subagente deve retornar:

**Mapeamento do que existe:**
- Arquivos e módulos diretamente relacionados à feature (com caminhos relativos reais)
- Implementações similares na codebase que devem servir de referência
- Dependências envolvidas (libs, providers, interfaces do core)
- Contratos existentes que a feature deve respeitar (interfaces, schemas, tipos)

**Fluxo de dados:**
- Como dados trafegam nas camadas relevantes para essa feature
- Onde o fluxo atual precisaria ser estendido ou alterado

**Pontos de atenção:**
- Arquivos que provavelmente serão impactados e por quê
- Padrões que devem ser seguidos com base no que foi encontrado
- Riscos, acoplamentos ou inconsistências observadas

**Lacunas:**
- O que não foi encontrado e seria esperado
- Dúvidas que dependem de confirmação antes de implementar

#### 1.4 Síntese

O agente principal consolida as descobertas dos subagentes e, com base nelas, toma as decisões de implementação:

- Resolve conflitos ou sobreposições entre os relatórios dos subagentes
- Define o que será criado, modificado e removido — com justificativa baseada nas evidências coletadas
- Prioriza consistência com os padrões identificados na codebase
- Para features que tocam múltiplos apps, mapeia explicitamente o contrato entre eles: qual app expõe, qual consome e qual o formato de comunicação (REST, RPC, evento). Esse contrato deve aparecer na seção 9 (Diagramas) como fluxo de dados cross-app.
- Registra em **Pendências / Dúvidas** (seção 10) tudo que não teve evidência suficiente para decidir

---

### 2. Uso de Ferramentas Auxiliares

- **MCP Serena:** Use para localizar arquivos e implementações similares na codebase. Acione sempre na fase de pesquisa dos subagentes.
- **MCP Context7:** Use quando houver dúvida sobre uso correto de uma biblioteca específica (ex: `shadcn/ui`, `radix-ui`, `inngest`, `supabase`, `hono`, `zod`). Não use para decisões de arquitetura — essas seguem as regras do projeto.
- **Tool `question`:** Use quando houver lacunas no PRD, incongruências com a codebase ou decisões críticas sem evidência suficiente. Não avance sem resposta quando o impacto for alto.

---

## Estrutura do Documento (Markdown)

Gere o arquivo Markdown da Spec seguindo **estritamente** o modelo de seções abaixo.

### Cabeçalho (Frontmatter)

```md
---
title: <Título claro>
prd: <link para o PRD referente à spec, sendo uma milestone do GitHub>
issue: <link para o issue referente à spec, servindo como esboço para a spec>
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

> Evite requisitos vagos (ex: "ser rápido"). Prefira critérios verificáveis.

---

# 4. O que já existe? (Obrigatório)

[Liste recursos da codebase que serão utilizados ou impactados.]

## [Nome da Camada]

* **`NomeDaClasseOuModulo`** (`caminho/relativo/do/arquivo`) - *[Breve descrição do uso (ex: método a chamar, store a consumir, widget base, schema similar).]*

---

# 5. O que deve ser criado? (Depende da tarefa)

[Descreva novos componentes dividindo por camadas. Para cada arquivo novo, detalhe e marque explicitamente como **novo arquivo**.]

> **Nível de detalhe esperado em métodos:** descreva a assinatura em TypeScript (nome, parâmetros tipados e retorno) e uma linha de responsabilidade. Não escreva implementação — a spec define contratos, não código.
>
> Exemplo: `findByUserId(userId: string): Promise<Challenge | null>` — busca um desafio ativo pelo ID do usuário, retorna `null` se não encontrado.

## Camada Core (Use Cases)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller
* **Dados de response:** Liste os valores que devem ser retornados pelo controller
* **Métodos:** Assinatura e responsabilidade

## Camada REST (Controllers)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller
* **Dados de response:** Liste os valores que devem ser retornados pelo controller
* **Métodos:** Assinatura e responsabilidade

## Camada REST (Services)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Métodos:** Assinatura e responsabilidade

## Camada Banco de Dados (Repositories)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Métodos:** Assinatura e responsabilidade

## Camada Banco de Dados (Mappers)

* **Localização:** `caminho/do/arquivo`
* **Métodos:** Assinatura e responsabilidade

## Camada Banco de Dados (Types)

* **Localização:** `caminho/do/arquivo`
* **props:** Propriedades do tipo

## Camada Provision (Providers)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Biblioteca:** Nome da biblioteca utilizada pelo provider
* **Métodos:** Assinatura e responsabilidade

## Pacote Validation (Schemas)

* **Localização:** `caminho/do/arquivo`
* **Atributos:** Dados que devem ser validados com Zod

## Camada RPC (Actions)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Dados de request:** Liste os valores que devem ser recebidos pela action
* **Dados de response:** Liste os valores que devem ser retornados pela action
* **Métodos:** Assinatura e responsabilidade

## Camada UI (Widgets)

* **Localização:** `caminho/do/arquivo`
* **Props:** Parâmetros recebidos
* **Estados (Client Component):** Como se comporta em Loading, Error, Empty, Content
* **View:** Nome e caminho da view do widget
* **Hook (se aplicável):** Nome e caminho do hook do widget
* **Index:** Hooks, actions e stores usadas no index
* **Widgets internos:** Widgets filhos a serem criados
* **Estrutura de pastas:** Caso haja widgets internos, escreva a estrutura completa do widget pai

## Camada UI (Stores)

* **Localização:** `caminho/do/arquivo`
* **Props:** Parâmetros recebidos no construtor
* **Estados:** Estrutura do estado (Loading, Error, Data)
* **Actions:** Métodos de mutação

## Camada UI (Contexts)

* **Localização:** `caminho/da/pasta`
* **Props:** Parâmetros recebidos via props
* **Hook do provider:** Nome e caminho do hook do provider
* **Responsabilidade:** Lista de responsabilidades do context
* **Value:** Objeto que contém os dados e métodos disponibilizados aos filhos

## Camada AI (Workflows)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Entrada/Saída:** Dados processados
* **Métodos:** Assinatura e responsabilidade

## Camada AI (Tools)

* **Localização:** `caminho/do/arquivo`
* **Dependências:** O que deve ser injetado
* **Dados de request:** Liste os valores que devem ser recebidos pelo controller
* **Dados de response:** Liste os valores que devem ser retornados pelo controller
* **Métodos:** Assinatura e responsabilidade

## Camada Hono App (Routes)

* **Localização:** `caminho/do/arquivo`
* **Middlewares:** Lista de middlewares
* **Caminho da rota:** Relativo à raiz da API
* **Dados de schema:** Zod Schema para validação

## Camada Inngest App (Functions)

* **Localização:** `caminho/do/arquivo`
* **Métodos:** Assinatura e responsabilidade

## Camada Next.js App (Pages, Layouts)

* **Localização:** `caminho/do/arquivo`
* **Widget principal:** Widget principal da rota
* **Caminho da rota:** Relativo à raiz da aplicação Next.js

## Camada React Router App (Pages, Layouts)

* **Localização:** `caminho/do/arquivo`
* **Widget principal:** Widget principal da rota
* **Caminho da rota:** Relativo à raiz da aplicação React Router

> Se uma camada não se aplicar, **não inclua ela na spec**.
> Se achar necessário falar sobre um recurso não mapeado na seção acima, sinta-se livre para adicionar uma seção extra seguindo o padrão condizente com os outros recursos mapeados.

---

# 6. O que deve ser modificado? (Depende da tarefa)

[Descreva alterações em código existente.]

## [Nome da Camada]

* **Arquivo:** `caminho/do/arquivo`
* **Mudança:** [Descreva a mudança específica (ex: "Adicionar prop `onTap`", "Injetar novo service")]
* **Justificativa:** [Explique por que a mudança é necessária]
* **Camada:** `ui` | `core` | `rest` | `provision` | `queue` | `database` | `ai` | `realtime` | `rpc`

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
* **Fluxo Cross-app (se aplicável):** Para features que tocam múltiplos apps, inclua um diagrama explicitando qual app expõe, qual consome e o formato de comunicação (REST, RPC, evento).
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
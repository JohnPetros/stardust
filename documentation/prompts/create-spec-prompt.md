---
description: Prompt para criar especificação técnica a partir de PRD e codebase.
---

# Prompt: Criar Spec

**Objetivo:** Criar a definição normativa de uma feature, fix ou refatoração em
um único documento com duas partes: Contract observável e solução técnica. A
Spec só é considerada pronta depois do Definition Gate e de um
`judge-spec-agent` independente.

## Entrada

- **PRD:** deve existir e estar finalizado (milestone do GitHub). Se ausente, não inicie — registre em Pendências e use `question`.
- **Esboço da tarefa:** descrição da feature, fix ou refatoração.
- **Bug Report (quando aplicável):** `documentation/features/{dominio}/reports/{nome}-bug-report.md` como insumo para specs de correção. O bug report complementa o PRD, mas não o substitui.
- **Acesso à codebase:** necessário para pesquisa e validação.

---

## Regras Aplicáveis

Antes de tomar decisões técnicas, leia:

- `documentation/rules/harness-rules.md` — protocolo de autoria, julgamento e congelamento da Spec.
- `documentation/agents/orchestrator-agent.md` — responsabilidades do agente que conduz o workflow.
- `documentation/agents/judge-spec-agent.md` — contrato do avaliador independente da Spec.
- `documentation/rules/rules.md` — índice para selecionar rules por app e camada.
- `documentation/rules/code-conventions-rules.md` — convenções gerais de nomeação, factories, erros, eventos e barrel files.
- Rules específicas das camadas mapeadas na seção 1.2.
- Rules de teste apenas para decidir cobertura esperada e execução recomendada; a spec não deve incluir implementação de testes.

Quando uma decisão da spec contrariar uma rule existente, pergunte ao usuário antes de finalizar. Quando a spec introduzir padrão novo, registre que a implementação deverá atualizar a rule correspondente.

---

## Princípios Invioláveis

Estas regras aplicam-se a toda a spec. Não as repita nas seções — referencie este bloco.

1. **Caminhos reais.** Todo arquivo citado deve existir no projeto ou estar marcado como **novo arquivo**.
2. **Sem invenção.** Não invente arquivos, métodos, contratos, schemas ou integrações sem evidência no PRD ou codebase.
3. **Sem implementação de testes.** A Spec não descreve código de teste, mas
   define critérios e evidências verificáveis que orientarão Plan, sensores e
   Judges.
4. **Core isolado.** Não proponha acoplamento cross-domain no `core` sem evidência explícita na codebase.
5. **Borda é borda.** Se autenticação, autorização, ownership, montagem de contexto ou adaptação de transporte já vivem em `controller`, `middleware`, `tool` ou `router`, a spec preserva esse padrão — não empurre para `use case`.
6. **Schemas estritos.** Campos controlados pelo servidor (ex: `author`, `userId`, `status`) não entram em schemas de entrada; use schemas derivados na borda.
7. **Authn ≠ Authz ≠ Domínio.** Não funda essas responsabilidades sem evidência de que o projeto já faz isso naquele fluxo.
8. **Migrations canônicas.** Novas migrations vão em `apps/server/supabase/migrations/**`. Só inclua migration quando houver mudança real de schema. Se não houver, declare explicitamente.
9. **Dúvida = Pergunta.** Ao detectar transgressão arquitetural, lacuna no PRD ou falta de evidência com impacto relevante, **pergunte ao usuário** com `question` antes de finalizar a spec (uma pergunta por decisão, opção recomendada primeiro). Não decida por conta própria quando o impacto for alto. Só permanece em Pendências o que o usuário deixou explicitamente em aberto.
10. **Consistência > Criatividade.** Siga os padrões existentes na codebase (nomenclatura, organização, contratos por camada). Se a seção não se aplicar, escreva **Não aplicável**.

---

## Processo de Execução

### 1. Pesquisa

#### 1.1 Leitura do PRD
Leia o PRD (milestone do GitHub). Resuma apenas o que impacta execução técnica — não replique o PRD.

#### 1.2 Identificação de escopo
Leia `documentation/rules/rules.md` e identifique:
- Quais apps serão tocados (`server`, `web`, `studio`)
- Quais camadas por app (ex: `ui`, `rest`, `database`, `ai`)

#### 1.3 Pesquisa da codebase

Se o escopo tocar **múltiplos apps**, use subagentes (um por app + um para pacotes compartilhados). Cada subagente pesquisa e reporta — não toma decisões. Se subagentes não estiverem disponíveis, pesquise sequencialmente por app.

**Despacho — o que enviar ao subagente:**

```
App/pacote: <nome do app ou pacote>
Camadas prováveis: <camadas identificadas em 1.2 para este app>
Regras da(s) camada(s): <caminhos dos arquivos de regra relevantes em documentation/rules/>
Resumo do PRD: <apenas os requisitos que impactam este app — não envie o PRD inteiro>

Instrução: pesquise a codebase deste app e retorne o relatório abaixo. Não tome decisões de implementação.
```

> Não envie o PRD completo, todas as rules, nem o contexto de outros apps ao subagente. Apenas o mínimo necessário para o escopo dele.

**Retorno — o que cada subagente deve devolver (obrigatório):**

| Seção | Detalhe |
|---|---|
| **Mapeamento** | Arquivos relacionados (caminhos reais), implementações similares como referência, dependências e contratos existentes |
| **Fluxo de dados** | Como dados trafegam nas camadas relevantes e onde o fluxo precisa mudar |
| **Atenção** | Arquivos impactados, padrões a seguir, riscos e acoplamentos |
| **Lacunas** | O que não foi encontrado e seria esperado |

#### 1.4 Síntese
Consolide as descobertas e tome as decisões de implementação:
- Resolva conflitos entre relatórios de diferentes apps
- Defina o que será criado, modificado e removido — com justificativa baseada em evidência
- Para features multi-app, mapeie o contrato entre eles: qual app expõe, qual consome e o formato (REST, RPC, evento)
- Liste as decisões em aberto (sem evidência única) para serem perguntadas em 1.5

#### 1.5 Clarificação (perguntar antes de escrever)

Antes de redigir a spec, transforme cada decisão em aberto da síntese em uma **pergunta ao usuário** via `question` — não escreva a pendência direto no documento. Aplica-se a escolhas como path/contrato/transporte, payloads, sequência de entrega, cobertura de testes e qualquer decisão arquitetural sem evidência única na codebase.

- Uma pergunta por decisão; agrupe-as em uma única chamada de `question` quando possível.
- Cada pergunta com 2–4 opções mutuamente exclusivas; a recomendada primeiro, marcada com `(Recomendado)`.
- Incorpore cada resposta como **Decisão Técnica** (seção 9) e ajuste as seções afetadas.
- Só o que o usuário deixar explicitamente em aberto vai para **Pendências** (seção 12).

### 2. Roteamento de Ferramentas

| Situação | Ferramenta | Exemplo |
|---|---|---|
| Localizar arquivos e implementações similares na codebase | MCP Serena ou busca direta no filesystem | Pesquisar controllers de `challenging` |
| Dúvida sobre API/uso de biblioteca específica | MCP Context7 | Como configurar `createSignedUploadUrl` no Supabase |
| Lacuna no PRD, decisão crítica sem evidência | `question` | Confirmar se ownership check deve ficar no middleware |

> Decisões de arquitetura seguem `documentation/rules/` — não use Context7 para isso.

---

## Estrutura do Documento

### Frontmatter

```md
---
title: <Título claro>
prd: <link da milestone GitHub>
issue: <link do issue/esboço>
apps: <server|studio|web> (separados por vírgula)
status: <draft|open|closed>
last_updated_at: <YYYY-MM-DD>
---
```

Use `draft` durante a autoria e o julgamento. Somente depois do Definition Gate
e de `judge-spec-agent: accepted`, altere para `open`. O campo `apps` filtra
quais camadas incluir nas seções técnicas. Se `apps: web`, exclua Hono Routes,
Inngest Functions, etc.

---

### Seções

## Parte I — Contract

Esta parte define o que deve ser comprovado sem prescrever a implementação.

#### 1. Objetivo (Obrigatório)
Resumo em um parágrafo do que será entregue funcional e tecnicamente.

#### 2. Escopo (Obrigatório)
- **2.1 In-scope:** o que está contemplado.
- **2.2 Out-of-scope:** o que não será tratado.

#### 3. Requisitos (Obrigatório)
- **3.1 Funcionais:** resumidos do PRD e identificados como `REQ-01`, `REQ-02`,
  etc. — apenas o que impacta implementação.
- **3.2 Não funcionais:** identificados e verificáveis (performance, segurança,
  latência etc). Se nenhum se aplicar, omita a subseção.

#### 4. Contract de Aceitação (Obrigatório)

Defina:

- **Pré-condições e fixtures:** serviços, usuários, permissões, dados e
  configurações necessários.
- **Interfaces observáveis:** entradas, saídas, erros, eventos e limites.
- **Critérios:** `AC-*` para comportamento e `AR-*` para atributos não
  funcionais ou limites arquiteturais observáveis.

```md
| ID | Requisito | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| AC-01 | REQ-01 | <pré-condição> | <ação> | <resultado observável> | <teste, comando ou browser> |
| AR-01 | REQ-01 | <contexto> | <ação> | <limite mensurável> | <sensor ou inspeção> |
```

Todo `AC-*` e `AR-*` referencia um `REQ-*` na mesma linha. Critérios devem ser
objetivos, suficientes para reprovar uma implementação incorreta e
independentes da abordagem interna.

Escreva os cenários integralmente em pt-BR, usando sempre `Dado`, `Quando` e
`Então` nos títulos e na descrição dos critérios.

Quando houver evidência automatizada estável, declare-a de forma executável:

```md
<!-- harness:evidence {"criterion":"AC-01","command":["npm","run","test:integration","-w","@stardust/server"]} -->
```

Não declare comandos destrutivos, interativos ou dependentes de segredo.

## Parte II — Especificação Técnica

Esta parte define como o projeto cumprirá o Contract.

#### 5. O que já existe? (Obrigatório)
Agrupe por camada. Para cada item:
`**NomeDoModulo** (caminho/relativo) — breve descrição do uso`

#### 6. O que deve ser criado? (Depende da tarefa)

Inclua apenas as camadas tocadas pelo `apps` do frontmatter. Para cada novo arquivo, marque como **(novo arquivo)**. Para métodos, use: `assinatura TypeScript` — responsabilidade em uma linha. Não escreva implementação.

##### Core (Use Cases)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Request/Response:** valores de entrada e saída
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### REST (Controllers)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Request/Response:** valores de entrada e saída
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### REST (Services)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### Database (Repositories)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### Database (Migrations)

- **Localização:** `apps/server/supabase/migrations/<timestamp>_<descricao>.sql`
- **Objetivo:** alteração estrutural (tabela, coluna, índice, view, constraint, grants)
- **Escopo SQL:** o que será criado, alterado ou removido
- **Segurança:** grants e RLS (diga explicitamente se haverá ou não)
- **Reflexos em código:** `Database.ts`, types, mappers, repositories impactados

##### Database (Mappers)

- **Localização:** caminho
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### Database (Types)

- **Localização:** caminho
- **Props:** propriedades do tipo

##### Provision (Providers)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Biblioteca:** nome da lib usada
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### Validation (Schemas)

- **Localização:** caminho
- **Atributos:** dados validados com Zod

##### RPC (Actions)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Request/Response:** valores de entrada e saída
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### UI (Widgets)

- **Localização:** caminho
- **Props:** parâmetros recebidos
- **Estados:** Loading, Error, Empty, Content
- **View:** nome e caminho
- **Hook (se aplicável):** nome e caminho
- **Index:** hooks, actions e stores usadas
- **Widgets internos:** filhos a criar
- **Estrutura de pastas:** se houver filhos, descreva a árvore completa

##### UI (Stores)

- **Localização:** caminho
- **Props:** parâmetros do construtor
- **Estados:** estrutura (Loading, Error, Data)
- **Actions:** métodos de mutação

##### UI (Contexts)

- **Localização:** caminho da pasta
- **Props:** parâmetros via props
- **Hook do provider:** nome e caminho
- **Responsabilidade:** lista de responsabilidades
- **Value:** dados e métodos disponibilizados aos filhos

##### AI (Workflows)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Entrada/Saída:** dados processados
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### AI (Tools)

- **Localização:** caminho
- **Dependências:** o que deve ser injetado
- **Request/Response:** valores de entrada e saída
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### Hono App (Routes) — apenas `apps: server`

- **Localização:** caminho
- **Middlewares:** lista
- **Caminho da rota:** relativo à raiz da API
- **Dados de schema:** Zod Schema

##### Inngest App (Functions) — apenas `apps: server`

- **Localização:** caminho
- **Métodos:** `assinatura TypeScript` — responsabilidade

##### Next.js App (Pages, Layouts) — apenas `apps: web`

- **Localização:** caminho
- **Widget principal:** widget da rota
- **Caminho da rota:** relativo à raiz Next.js

##### React Router App (Pages, Layouts) — apenas `apps: studio`

- **Localização:** caminho
- **Widget principal:** widget da rota
- **Caminho da rota:** relativo à raiz React Router

> Se uma camada não se aplicar, **não a inclua**. Se precisar de uma camada não listada acima, adicione seguindo o mesmo padrão.

#### 7. O que deve ser modificado? (Depende da tarefa)
Para cada alteração:
- **Arquivo:** caminho
- **Mudança:** o que muda
- **Justificativa:** por quê

Se não houver: **Não aplicável**.

#### 8. O que deve ser removido? (Depende da tarefa)
Para cada remoção:
- **Arquivo:** caminho
- **Motivo:** por quê
- **Impacto:** dependências afetadas

Se não houver: **Não aplicável**.

#### 9. Decisões Técnicas (Obrigatório)
Para cada decisão relevante: decisão, alternativas, motivo, trade-offs.

#### 10. Diagramas e Referências (Obrigatório)
- **Fluxo de dados:** diagrama Mermaid mostrando interação entre camadas.
- **Fluxo cross-app (se multi-app):** qual app expõe, qual consome, formato de comunicação.
- **Layout (se UI):** ASCII da hierarquia visual.
- **Referências:** caminhos de arquivos similares na codebase.

#### 11. Gates Aplicáveis (Obrigatório)

Declare os workspaces e sensores condicionais da implementação:

```md
| Sensor | Escopo | Obrigatório | Comando ou configuração |
| --- | --- | --- | --- |
| `quality-ratchet` | server | sim | `npm run quality-ratchet -- --workspace=server` |
| Integração | server | sim | `npm run test:integration -w @stardust/server` |
| Runtime smoke | não aplicável | não | - |
| Dead code | server | sim | `<config ou comando explícito>` |
```

`codecheck`, `typecheck`, `test:unit`, `scope-check`, `architecture-check`,
`migration-check` estático e `contract-check` são padrões do Implementation e
Conclusion Gate. Não os omita por conveniência.

#### 12. Pendências / Dúvidas (Quando aplicável)
Apenas itens que **permanecem em aberto após a etapa de Clarificação (1.5)** — esta seção não substitui perguntar. Decisões já confirmadas com o usuário via `question` vão para Decisões Técnicas (seção 9), não aqui.
Para cada item: descrição, impacto, ação sugerida.
Se não houver: **Sem pendências**.

#### 13. Execução Recomendada (Obrigatório)
Indique qual prompt deve ser usado para implementar a spec:
- Use **`implement-spec`** quando a spec for diretamente implementável, com escopo delimitado e sem necessidade de decomposição prévia em fases.
- Use **`create-plan` + `implement-plan`** quando a spec exigir execução em múltiplas fases, coordenação entre entregas independentes, Workers, alto risco de regressão ou quando for útil quebrar o trabalho por app/pacote antes de alterar código.

Inclua uma justificativa curta. Esta seção é uma recomendação operacional para execução, não uma decisão técnica da solução.

---

## Julgamento Obrigatório da Spec

Não finalize a Spec no mesmo agente que a escreveu.

1. Salve o documento completo com `status: draft`.
2. Execute:
   `npm run harness -- gate definition --spec=<path>`.
3. Corrija findings determinísticos antes de acionar um Judge.
4. Registre o estado do worktree.
5. Inicie um subagente novo, com contexto limpo, e instrua-o a usar
   `judge-spec-agent`, definido em
   `documentation/agents/judge-spec-agent.md`.
6. Envie PRD, draft, bug report quando aplicável, síntese da pesquisa,
   Architecture e Rules relevantes.
7. Não envie justificativas persuasivas do autor além das evidências já
   registradas na Spec.
8. Compare o worktree após o Judge; qualquer edição feita por ele invalida o
   parecer.
9. Se `failed`, corrija somente os findings sustentados por evidência. Decisões
   de produto ou arquitetura retornam ao usuário.
10. Repita Definition Gate e julgamento até `accepted`, respeitando no máximo três tentativas
   pelo mesmo motivo.
11. Após `accepted`, altere o status para `open`, atualize `last_updated_at` e
   calcule a revisão com `git hash-object <spec>`.

Na resposta final, informe o veredito, a revisão congelada e eventuais
observações não bloqueantes. Sem `judge-spec-agent: accepted`, a Spec permanece draft
e não pode seguir para `create-plan` ou implementação.

---
title: Get Next Challenge Source Tool
prd: documentation/features/challenging/challenge-creator-agent/prd.md
apps: server
status: closed
last_updated_at: 2026-03-05
---

# 1. Objetivo

Implementar uma nova tool na camada AI do `server` para recuperar a proxima fonte de desafio disponivel (nao utilizada) a partir do fluxo oficial de dominio (`GetNextChallengeSourceUseCase`), substituindo a dependencia de cache no inicio do workflow de criacao automatica de desafios e mantendo a orquestracao aderente aos contratos do `@stardust/core`.

---

# 2. Escopo

## 2.1 In-scope

- Criar a tool `GetNextChallengeSourceTool` em `apps/server/src/ai/challenging/tools` consumindo `GetNextChallengeSourceUseCase`.
- Registrar a tool no `ChallengingToolset` (Mastra) com `inputSchema`/`outputSchema` explicitos.
- Ajustar o `MastraCreateChallengeWorkflow` para iniciar o fluxo com a nova tool (fonte em banco) no lugar da leitura de problema em cache.
- Propagar `challengeSourceId` ao fluxo de publicacao para marcar a source como utilizada no `PostChallengeUseCase`.
- Adequar `SupabaseChallengeSourcesRepository` para suportar o contrato exigido pelo use case (`findNextNotUsed`) e manter conformidade do contrato (`replace`).
- Atualizar barrels/constantes necessarias para exposicao da tool.

## 2.2 Out-of-scope

- Alteracoes de UI (`web`/`studio`) para exibir ou operar essa tool.
- Alteracoes em cron, configuracao de job ou frequencia de execucao.
- Criacao de endpoints REST/RPC novos para challenge source.

---

# 3. Requisitos

## 3.1 Funcionais

- O fluxo de criacao automatica de desafio deve obter a fonte via banco (`challenge_sources`) por meio do `GetNextChallengeSourceUseCase`.
- A nova tool deve retornar os dados da fonte no formato de DTO de dominio (`ChallengeSourceDto`).
- Caso nao exista source disponivel, o fluxo deve propagar `ChallengeSourceNotFoundError`.
- A source utilizada deve ser marcada como `isUsed = true` na publicacao do desafio quando `challengeSourceId` for informado ao `PostChallengeUseCase`.
- A composicao de dependencias deve ocorrer na borda (`ChallengingToolset`), sem regra de negocio na camada AI.

## 3.2 Nao funcionais

- **Compatibilidade de arquitetura:** manter o padrao `Tool<Input, Output>` + `Mcp<Input>` definido em `packages/core/src/global/interfaces/ai`.
- **Consistencia de dominio:** consulta da proxima source deve respeitar ordenacao deterministica por `position` e filtro de nao uso (`is_used = false`).
- **Boundary validation:** entrada/saida da tool Mastra deve estar validada com `zod` no `toolset`.
- **Compatibilidade retroativa:** nao alterar contratos existentes de rotas REST de `challenge-sources`.

---

# 4. O que já existe?

## Camada AI

* **`GetChallengeProblemTool`** (`apps/server/src/ai/challenging/tools/GetChallengeProblemTool.ts`) - *Tool atual que busca problema via cache (`CACHE.challenging.challengeProblems`).*
* **`PostChallengeTool`** (`apps/server/src/ai/challenging/tools/PostChallengeTool.ts`) - *Persiste desafio gerado via `PostChallengeUseCase`.*
* **`PostChallengeUseCase`** (`packages/core/src/challenging/use-cases/PostChallengeUseCase.ts`) - *Agora aceita `challengeSourceId` opcional e marca source como usada durante a publicacao.*
* **`GetAllChallengeCategoriesTool`** (`apps/server/src/ai/challenging/tools/GetAllChallengeCategoriesTool.ts`) - *Fornece categorias para o agente durante a geracao.*
* **`ChallengingToolset`** (`apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`) - *Composition root das tools Mastra do dominio challenging.*
* **`MastraCreateChallengeWorkflow`** (`apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`) - *Workflow que hoje inicia em `getChallengeProblem` e depois chama agente + persistencia.*
* **`TOOLS_DESCRIPTIONS`** (`apps/server/src/ai/constants/tools-descriptions.ts`) - *Descricoes centralizadas das tools expostas ao runtime.*

## Pacote Core

* **`GetNextChallengeSourceUseCase`** (`packages/core/src/challenging/use-cases/GetNextChallengeSourceUseCase.ts`) - *Caso de uso que busca a proxima source nao utilizada e retorna DTO.*
* **`ChallengeSourcesRepository`** (`packages/core/src/challenging/interfaces/ChallengeSourcesRepository.ts`) - *Contrato com `findNextNotUsed`, `replace` e demais operacoes.*
* **`UseChallengeSourceUseCase`** (`packages/core/src/challenging/use-cases/UseChallengeSourceUseCase.ts`) - *Referencia de fluxo de marcacao de source como usada (fora do escopo desta spec).*
* **`Tool` / `Mcp`** (`packages/core/src/global/interfaces/ai/Tool.ts`, `packages/core/src/global/interfaces/ai/Mcp.ts`) - *Contrato base para implementacao de tools na camada AI.*

## Camada Banco de Dados

* **`SupabaseChallengeSourcesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`) - *Implementacao atual de repositorio de sources; ainda sem `findNextNotUsed` explicito.*
* **`SupabaseChallengeSourceMapper`** (`apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts`) - *Converte row Supabase em entidade de dominio e vice-versa.*
* **`SupabaseChallengeSource`** (`apps/server/src/database/supabase/types/SupabaseChallengeSource.ts`) - *Tipo da row `challenge_sources` com relacionamento opcional `challenges`.*

## Pacote Validation

* **`challengeSourceSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`) - *Schema atual para criacao via REST; nao cobre DTO completo de retorno da nova tool.*

---

# 5. O que deve ser criado?

## Camada AI (Tools)

* **Localizacao:** `apps/server/src/ai/challenging/tools/GetNextChallengeSourceTool.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`
* **Dados de request:** sem payload (`Mcp<void>`)
* **Dados de response:** `id`, `url`, `isUsed`, `position`, `challenge { id, title, slug }`
* **Metodos:**
  - `handle(mcp: Mcp<void>): Promise<ChallengeSourceDto>` — executa `GetNextChallengeSourceUseCase` e retorna a proxima source disponivel.

---

# 6. O que deve ser modificado?

## Camada AI

* **Arquivo:** `apps/server/src/ai/challenging/tools/index.ts`
* **Mudanca:** Exportar `GetNextChallengeSourceTool` no barrel.
* **Justificativa:** Disponibilizar a tool para `toolsets` e demais consumers da camada AI.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/constants/tools-descriptions.ts`
* **Mudanca:** Adicionar chave de descricao para `get-next-challenge-source-tool`.
* **Justificativa:** Manter padrao de catalogo de descricoes centralizadas das tools.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`
* **Mudanca:** Registrar getter `getNextChallengeSourceTool` com `createTool`, instanciar `SupabaseChallengeSourcesRepository` e delegar para `GetNextChallengeSourceTool` via `MastraMcp`.
* **Justificativa:** A composicao de infraestrutura e validacao de boundary ocorre no toolset, conforme padrao da camada AI.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`
* **Mudanca:** Substituir o primeiro step de `getChallengeProblem` por `getNextChallengeSource`, mapear o prompt para `inputData.challenge.title` e carregar `challengeSourceId` para o step de publicacao.
* **Justificativa:** O workflow passa a consumir a fonte oficial de desafio em banco, removendo dependencia operacional do cache para iniciar a geracao.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`
* **Mudanca:** Incluir `challengeSourceId` no input, injetar `ChallengeSourcesRepository` e repassar para `PostChallengeUseCase.execute({ challengeDto, challengeSourceId })`.
* **Justificativa:** Sincronizar a tool com o novo contrato do caso de uso, garantindo marcacao de source usada no fluxo automatico.
* **Camada:** `ai`

## Pacote Core (Use Cases)

* **Arquivo:** `packages/core/src/challenging/use-cases/PostChallengeUseCase.ts`
* **Mudanca:** Manter/considerar o novo contrato `execute({ challengeDto, challengeSourceId })`, com `challengeSourceId` opcional e marcacao de uso via `ChallengeSourcesRepository.replace`.
* **Justificativa:** Evitar reaproveitamento da mesma source e consolidar a regra no dominio.
* **Camada:** `core`

## Camada Banco de Dados (Repositories)

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`
* **Mudanca:** Implementar `findNextNotUsed(): Promise<ChallengeSource | null>` com filtro `is_used = false`, ordenacao por `position ASC` e retorno mapeado para entidade.
* **Justificativa:** Atender o contrato `ChallengeSourcesRepository` consumido por `GetNextChallengeSourceUseCase`.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`
* **Mudanca:** Implementar `replace(challengeSource: ChallengeSource): Promise<void>` para manter aderencia completa ao contrato do repositorio.
* **Justificativa:** O contrato de dominio ja exige `replace`; manter consistencia evita drift entre core e adapter.
* **Camada:** `database`

---

# 7. O que deve ser removido?

**Não aplicável**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao:** Implementar a nova tool delegando para `GetNextChallengeSourceUseCase` (core), em vez de query direta no banco dentro da tool.
* **Alternativas consideradas:** Acessar `SupabaseChallengeSourcesRepository` diretamente na tool sem use case.
* **Motivo da escolha:** Preserva regra de negocio no core e mantem AI como adaptador/orquestrador.
* **Impactos / trade-offs:** Mais uma camada de chamada, em troca de consistencia arquitetural e menor acoplamento.

* **Decisao:** Registrar a tool no `ChallengingToolset` e trocar o primeiro step do workflow para usar source do banco.
* **Alternativas consideradas:** Manter workflow atual (cache) e expor a nova tool apenas para uso eventual do agente.
* **Motivo da escolha:** Garante uso efetivo da feature no fluxo automatico diario.
* **Impactos / trade-offs:** Dependencia direta da disponibilidade de `challenge_sources`; sem source disponivel o job falha por erro de dominio.

* **Decisao:** Usar `url` da source como prompt inicial no workflow (`URL da fonte: ...`).
* **Alternativas consideradas:** Usar `challenge.title` como entrada principal do agente.
* **Motivo da escolha:** Quando a source nao esta previamente vinculada a um desafio, a URL continua sendo o identificador mais confiavel para preservar contexto da origem.
* **Impactos / trade-offs:** Exige que o agente extraia contexto do link de origem; pode demandar refinamento futuro de prompt para melhorar consistencia do conteudo gerado.

* **Decisao:** Marcar `isUsed` durante a publicacao do desafio no `PostChallengeUseCase` quando houver `challengeSourceId`.
* **Alternativas consideradas:** Marcar em um job separado posterior ou manter sem marcacao.
* **Motivo da escolha:** A mudanca ja foi incorporada ao dominio e reduz risco de repeticao da mesma fonte.
* **Impactos / trade-offs:** Aumenta acoplamento do `PostChallengeUseCase` com `ChallengeSourcesRepository`, mas garante consistencia transacional de negocio no mesmo fluxo.

## 8.1 Refinamentos aplicados na implementacao

* **Filtro de proxima source:** o criterio final em repositorio passou a ser `challenge_id IS NULL` com ordenacao por `position ASC`, em vez de `is_used = false`.
* **Marcacao de uso da source:** o dominio passou a considerar source usada quando existe vinculacao com `challenge` (link em `challenge_id`), removendo o campo `isUsed` do DTO.
* **Prompt inicial do workflow:** o passo de criacao usa `URL da fonte: <url>` como prompt de entrada para o agente.
* **Boundary schema da tool Mastra:** o `outputSchema` do toolset valida `id`, `url` e `position`; o objeto `challenge` permanece opcional no DTO de dominio.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```ascii
[Inngest Cron]
      |
      v
[CreateChallengeJob]
      |
      v
[MastraCreateChallengeWorkflow]
      |
      +--> Step: get-next-challenge-source-tool
              |
              v
      [GetNextChallengeSourceTool.handle]
              |
              v
      [GetNextChallengeSourceUseCase.execute]
              |
              v
      [SupabaseChallengeSourcesRepository.findNextNotUsed]
              |
              v
      [challenge_sources (Supabase)]
              |
              v
      source DTO (title/url/...)
              |
              v
      prompt -> [ChallengingSquad Agent]
              |
              v
      [PostChallengeTool] -> [PostChallengeUseCase]
              |
              +--> mark source as used (challenge_sources.is_used = true)
              |
              v
      [challenges + events]
```

* **Fluxo Cross-app (se aplicável):** **Não aplicável** (fluxo restrito ao app `server`, com consumo interno de `packages/core` e `packages/validation`).
* **Layout (se aplicável):** **Não aplicável**.
* **Referencias:**
  - `apps/server/src/ai/challenging/tools/GetChallengeProblemTool.ts`
  - `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`
  - `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`
  - `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`
  - `packages/core/src/challenging/use-cases/GetNextChallengeSourceUseCase.ts`
  - `packages/core/src/challenging/use-cases/UseChallengeSourceUseCase.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`

---

# 10. Pendencias / Duvidas

**Sem pendências bloqueantes**.

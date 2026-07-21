---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

Sem pendencias.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir contratos de dominio, DTOs, estruturas, interfaces, use cases e payloads compartilhados | - | - |
| F2 | Implementar server, banco, validacao REST, controllers, rotas, recompensa e adapters de AI | F1 | F3 |
| F3 | Implementar web, UI, store, REST client, rotas App Router e RPC de recompensa | F1 | F2 |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Assim que o core estiver concluido, as fases de `server` e `web` podem ser executadas em paralelo, pois ambas dependem apenas do contrato definido no core. A app `studio` foi omitida porque a spec nao exige alteracoes nela.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio — entidades, structures, interfaces de repositorio/provider e use cases — sem nenhuma dependencia de infraestrutura. Essa fase desbloqueia F2 e F3 para rodarem em paralelo. Os testes do core funcionam como contrato executavel: quando as fases de app iniciarem, quebras de contrato serao detectadas imediatamente.

### Tarefas

- [x] **T1.1** — Implementar `ChallengeCodeExecutionStatus`
  - **Depende de:** -
  - **Resultado observavel:** `packages/core/src/challenging/domain/structures/ChallengeCodeExecutionStatus.ts` exporta `ChallengeCodeExecutionStatus`, `ChallengeCodeExecutionStatusValue`, factories `createAs...`, getters booleanos e validacao dos status `accepted`, `wrong_answer`, `syntax_error`, `runtime_error` e `internal_error`.
  - **Camada:** `core`

- [x] **T1.1t** — Testar `ChallengeCodeExecutionStatus`
  - **Depende de:** T1.1
  - **Resultado observavel:** testes de `ChallengeCodeExecutionStatus` passando, cobrindo default `internal_error`, criacao de cada status valido, getters booleanos, `isUserMistake` e rejeicao de valor fora do enum.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/domain-objects-testing-rules.md`

- [x] **T1.2** — Implementar `ChallengeCodeExecutionError`
  - **Depende de:** -
  - **Resultado observavel:** `packages/core/src/challenging/domain/structures/ChallengeCodeExecutionError.ts` cria erro imutavel a partir de `ChallengeCodeExecutionErrorDto`, com `message`, `line`, `isInternal` e serializacao `dto`.
  - **Camada:** `core`

- [x] **T1.2t** — Testar `ChallengeCodeExecutionError`
  - **Depende de:** T1.2
  - **Resultado observavel:** testes de `ChallengeCodeExecutionError` passando, cobrindo criacao com linha numerica, criacao com `line = null`, flag de erro interno e serializacao para DTO.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/domain-objects-testing-rules.md`

- [x] **T1.3** — Criar DTOs de execucao de codigo
  - **Depende de:** T1.1, T1.2
  - **Resultado observavel:** os arquivos `ChallengeCodeExecutionDto.ts`, `ChallengeCodeExecutionTestResultDto.ts` e `ChallengeCodeExecutionErrorDto.ts` existem em `packages/core/src/challenging/domain/structures/dtos/`, com props primitivas e sem comportamento.
  - **Camada:** `core`

- [x] **T1.4** — Implementar `ChallengeCodeExecution`
  - **Depende de:** T1.1, T1.2, T1.3
  - **Resultado observavel:** `ChallengeCodeExecution` cria uma structure imutavel por DTO, preserva `code`, `status`, `testResults`, `outputs`, `error` e `createdAt`, calcula `passedTestsCount`, `failedTestsCount`, `isAccepted`, `isUserMistake` e serializa para DTO sem `id`, `userId` ou `challengeId`.
  - **Camada:** `core`

- [x] **T1.4t** — Testar `ChallengeCodeExecution`
  - **Depende de:** T1.4
  - **Resultado observavel:** testes de `ChallengeCodeExecution` passando, cobrindo criacao aceita, contagem de testes corretos/incorretos, identificacao de erro atribuivel ao usuario, preservacao de `outputs` e serializacao completa do DTO.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/domain-objects-testing-rules.md`

- [x] **T1.5** — Criar `ChallengeCodeExecutionsListParams`
  - **Depende de:** T1.4
  - **Resultado observavel:** `packages/core/src/challenging/domain/types/ChallengeCodeExecutionsListParams.ts` define `userId`, `challengeId`, `page` e `itemsPerPage` usando objetos de dominio adequados.
  - **Camada:** `core`

- [x] **T1.6** — Criar contrato `ChallengeCodeExecutionsRepository`
  - **Depende de:** T1.4, T1.5
  - **Resultado observavel:** `packages/core/src/challenging/interfaces/ChallengeCodeExecutionsRepository.ts` expoe `add`, `findManyByUserAndChallenge`, `findLatestByUserAndChallenge` e `countIncorrectByUserAndChallenge` usando `Id`, `Integer`, `ManyItems` e `ChallengeCodeExecution`.
  - **Camada:** `core`

- [x] **T1.7** — Adicionar `isEvaluatedByFunction` ao contrato de `Challenge`
  - **Depende de:** -
  - **Resultado observavel:** `ChallengeDto`, `Challenge`, `ChallengeFactory` e `ChallengesFaker` aceitam e serializam `isEvaluatedByFunction`, com default retrocompativel `true`.
  - **Camada:** `core`

- [x] **T1.7t** — Testar avaliacao de `Challenge` por retorno ou output
  - **Depende de:** T1.7
  - **Resultado observavel:** testes de `Challenge` passando, cobrindo `isEvaluatedByFunction = true` comparando `LspResponse.result`, `isEvaluatedByFunction = false` comparando output aplicavel de `LspResponse.outputs`, e preservacao de `initialCode.hasFunction` apenas para preparacao da execucao.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/domain-objects-testing-rules.md`

- [x] **T1.8** — Atualizar interface `ChallengingService`
  - **Depende de:** T1.4
  - **Resultado observavel:** `packages/core/src/challenging/interfaces/ChallengingService.ts` declara `runChallengeCode`, `fetchChallengeCodeExecutions` e `fetchChallengeCodeExecutionErrorsCount` com tipos de dominio e responses esperados.
  - **Camada:** `core`

- [x] **T1.9** — Implementar `RunChallengeCodeUseCase`
  - **Depende de:** T1.4, T1.6, T1.7
  - **Resultado observavel:** `RunChallengeCodeUseCase` busca o desafio, executa analise sintatica, roda casos de teste pelo `LspProvider`, classifica status, preserva `outputs`, persiste a execucao e retorna `ChallengeCodeExecutionDto`.
  - **Camada:** `core`

- [x] **T1.9t** — Testar `RunChallengeCodeUseCase`
  - **Depende de:** T1.9
  - **Resultado observavel:** testes passando para execucao aceita, resposta incorreta, erro de sintaxe, `LspError`, `InsufficientInputsError`, erro inesperado como `internal_error`, preservacao de outputs brutos e diferenciacao entre avaliacao por funcao e por output.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/use-cases-testing-rules.md`

- [x] **T1.10** — Implementar `ListChallengeCodeExecutionsUseCase`
  - **Depende de:** T1.6
  - **Resultado observavel:** use case recebe `userId`, `challengeId`, `page` e `itemsPerPage`, chama `findManyByUserAndChallenge` e retorna `PaginationResponse<ChallengeCodeExecutionDto>`.
  - **Camada:** `core`

- [x] **T1.10t** — Testar `ListChallengeCodeExecutionsUseCase`
  - **Depende de:** T1.10
  - **Resultado observavel:** testes passando, cobrindo conversao de request primitivo para objetos de dominio, chamada ao repository com paginacao e retorno serializado em `PaginationResponse`.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/use-cases-testing-rules.md`

- [x] **T1.11** — Implementar `GetLatestChallengeCodeExecutionUseCase`
  - **Depende de:** T1.6
  - **Resultado observavel:** use case recebe `userId` e `challengeId`, chama `findLatestByUserAndChallenge` e retorna `ChallengeCodeExecutionDto | null`.
  - **Camada:** `core`

- [x] **T1.11t** — Testar `GetLatestChallengeCodeExecutionUseCase`
  - **Depende de:** T1.11
  - **Resultado observavel:** testes passando, cobrindo retorno da ultima execucao serializada e retorno `null` quando nao houver historico.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/use-cases-testing-rules.md`

- [x] **T1.12** — Implementar `CountChallengeCodeExecutionErrorsUseCase`
  - **Depende de:** T1.6
  - **Resultado observavel:** use case recebe `userId` e `challengeId`, chama `countIncorrectByUserAndChallenge` e retorna a quantidade numerica de erros penalizaveis.
  - **Camada:** `core`

- [x] **T1.12t** — Testar `CountChallengeCodeExecutionErrorsUseCase`
  - **Depende de:** T1.12
  - **Resultado observavel:** testes passando, cobrindo conversao dos IDs, chamada ao repository e retorno do contador sem depender de estado da web.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/use-cases-testing-rules.md`

- [x] **T1.13** — Remover contadores confiados pela web dos payloads de recompensa
  - **Depende de:** -
  - **Resultado observavel:** `ChallengeRewardingPayload` e `StarChallengeRewardingPayload` nao aceitam `incorrectAnswersCount` nem `maximumIncorrectAnswersCount`, preservando `secondsCount`, `challengeId`, `starId` e `nextStarId` quando aplicavel.
  - **Camada:** `core`

- [x] **T1.14** — Atualizar barrels do modulo `challenging`
  - **Depende de:** T1.1, T1.2, T1.3, T1.4, T1.5, T1.6, T1.9, T1.10, T1.11, T1.12
  - **Resultado observavel:** barrels de `structures`, `structures/dtos`, `domain/types`, `interfaces` e `use-cases` exportam todos os novos contratos sem exportar tipos pelo lugar errado.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios, REST e AI

> Pode rodar em paralelo com F3 apos F1 estar concluida.

**Objetivo:** Implementar a camada de infraestrutura e exposicao — migrations, repositories, providers, handlers REST, rotas HTTP e adapters AI — consumindo os contratos definidos no core. Tarefas de repositorio, mapper, provider, schemas e composition roots nao geram tarefa de teste direta; a cobertura e garantida pelos testes dos handlers, use cases e rotas que os consomem.

### Tarefas

- [x] **T2.1** — Criar migration de `challenges.is_evaluated_by_function`
  - **Depende de:** T1.7
  - **Resultado observavel:** migration em `apps/server/supabase/migrations` adiciona `is_evaluated_by_function boolean not null default true` em `public.challenges` e expoe o campo em `challenges_view`.
  - **Camada:** `database`

- [x] **T2.2** — Criar migration de `challenge_code_executions`
  - **Depende de:** T1.4, T1.6
  - **Resultado observavel:** migration cria tabela `public.challenge_code_executions` com colunas, defaults, FKs, checks, RLS, policies e indices definidos na spec, omitindo `id` de qualquer payload de insert da aplicacao.
  - **Camada:** `database`

- [x] **T2.3** — Regenerar types Supabase
  - **Depende de:** T2.1, T2.2
  - **Resultado observavel:** `apps/server/src/database/supabase/types/Database.ts` inclui `challenge_code_executions` e `challenges.is_evaluated_by_function`.
  - **Camada:** `database`

- [x] **T2.4** — Criar type `SupabaseChallengeCodeExecution`
  - **Depende de:** T2.3
  - **Resultado observavel:** `apps/server/src/database/supabase/types/SupabaseChallengeCodeExecution.ts` exporta alias para a row da tabela `challenge_code_executions`.
  - **Camada:** `database`

- [x] **T2.5** — Implementar `SupabaseChallengeCodeExecutionMapper`
  - **Depende de:** T1.4, T2.4
  - **Resultado observavel:** mapper converte row em `ChallengeCodeExecution`, ignora `id/user_id/challenge_id`, e converte structure em insert injetando apenas `user_id` e `challenge_id`.
  - **Camada:** `database`

- [x] **T2.6** — Implementar `SupabaseChallengeCodeExecutionsRepository`
  - **Depende de:** T1.6, T2.5
  - **Resultado observavel:** repository insere execucao, lista historico por usuario/desafio em `created_at desc` com paginacao, busca ultima execucao e conta penalidades de `wrong_answer`, `syntax_error` e `runtime_error` sem contar `internal_error`.
  - **Camada:** `database`

- [x] **T2.7** — Atualizar persistencia de `Challenge.isEvaluatedByFunction`
  - **Depende de:** T1.7, T2.1, T2.3
  - **Resultado observavel:** `SupabaseChallengeMapper` e `SupabaseChallengesRepository` leem e escrevem `is_evaluated_by_function`, preservando default `true` para dados antigos.
  - **Camada:** `database`

- [x] **T2.8** — Exportar adapters de execucao nos barrels de database
  - **Depende de:** T2.4, T2.5, T2.6
  - **Resultado observavel:** barrels de `types`, `mappers/challenging` e `repositories/challenging` exportam type, mapper e repository de execucoes.
  - **Camada:** `database`

- [x] **T2.9** — Adicionar `@stardust/lsp` ao server
  - **Depende de:** T1.9
  - **Resultado observavel:** `apps/server/package.json` referencia `@stardust/lsp` como dependencia workspace e o server consegue instanciar `DeleguaProvedorLsp` na composition root.
  - **Camada:** `provision`

- [x] **T2.10** — Criar schema `challengeCodeExecutionSchema`
  - **Depende de:** T1.8
  - **Resultado observavel:** `packages/validation/src/modules/challenging/schemas/challengeCodeExecutionSchema.ts` valida somente `code` com `stringSchema` para a rota de execucao e fica exportado pelo barrel do modulo.
  - **Camada:** `rest`

- [x] **T2.11** — Criar schema `challengeCodeExecutionsListQuerySchema`
  - **Depende de:** T1.8
  - **Resultado observavel:** `challengeCodeExecutionsListQuerySchema.ts` valida `page` e `itemsPerPage` usando schemas globais e fica exportado pelo barrel do modulo.
  - **Camada:** `rest`

- [x] **T2.12** — Atualizar schemas compartilhados de challenge
  - **Depende de:** T1.7
  - **Resultado observavel:** `challengeSchema` e `challengeDraftSchema` aceitam `isEvaluatedByFunction` opcional com default `true`, sem quebrar payloads antigos.
  - **Camada:** `rest`

- [x] **T2.13** — Implementar `RunChallengeCodeController`
  - **Depende de:** T1.9, T2.6, T2.9, T2.10
  - **Resultado observavel:** controller extrai `challengeId`, `body.code` e `accountId`, chama `RunChallengeCodeUseCase` e responde `201` com `ChallengeCodeExecutionDto`.
  - **Camada:** `rest`

- [x] **T2.13t** — Testar `RunChallengeCodeController`
  - **Depende de:** T2.13
  - **Resultado observavel:** testes do controller passando, cobrindo extracao de params/body/account, chamada ao use case e resposta `statusCreated().send(dto)`.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.14** — Implementar `ListChallengeCodeExecutionsController`
  - **Depende de:** T1.10, T2.6, T2.11
  - **Resultado observavel:** controller extrai `challengeId`, query de paginacao e `accountId`, chama use case de listagem e responde via `http.sendPagination(response)`.
  - **Camada:** `rest`

- [x] **T2.14t** — Testar `ListChallengeCodeExecutionsController`
  - **Depende de:** T2.14
  - **Resultado observavel:** testes passando, cobrindo montagem da request com usuario autenticado, paginacao e envio de resposta paginada.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.15** — Implementar `CountChallengeCodeExecutionErrorsController`
  - **Depende de:** T1.12, T2.6
  - **Resultado observavel:** controller extrai `challengeId` e `accountId`, chama use case de contagem e retorna `{ errorsCount }`.
  - **Camada:** `rest`

- [x] **T2.15t** — Testar `CountChallengeCodeExecutionErrorsController`
  - **Depende de:** T2.15
  - **Resultado observavel:** testes passando, cobrindo chamada ao use case com usuario/desafio e resposta com contador numerico.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.16** — Registrar rotas de execucao em `ChallengesRouter`
  - **Depende de:** T2.10, T2.11, T2.13, T2.14, T2.15
  - **Resultado observavel:** `ChallengesRouter` registra rotas autenticadas `POST /challenging/challenges/:challengeId/code-executions`, `GET /challenging/challenges/:challengeId/code-executions` e `GET /challenging/challenges/:challengeId/code-executions/errors-count` antes de rotas parametrizadas conflitantes.
  - **Camada:** `rest`

- [x] **T2.16t** — Testar rotas HTTP de execucao de codigo
  - **Depende de:** T2.16
  - **Resultado observavel:** testes de integracao de rotas passando, com um arquivo por rota, cobrindo autenticacao, validacao, sucesso, persistencia da tentativa, listagem paginada filtrada por usuario/desafio e contador de erros penalizaveis.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/server-routes-testing-rules.md`

- [x] **T2.17** — Atualizar barrels de controllers challenging
  - **Depende de:** T2.13, T2.14, T2.15
  - **Resultado observavel:** `apps/server/src/rest/controllers/challenging/challenges/index.ts` exporta os tres controllers de execucao.
  - **Camada:** `rest`

- [x] **T2.18** — Atualizar recompensa de desafio comum no server
  - **Depende de:** T1.11, T1.12, T1.13, T2.6
  - **Resultado observavel:** `RewardUserForChallengeCompletionController` valida ultima execucao aceita do usuario/desafio, calcula erros pelo repository, calcula maximo pelo desafio e chama `CalculateRewardForChallengeCompletionUseCase` sem confiar em contadores do body.
  - **Camada:** `rest`

- [x] **T2.18t** — Testar controller de recompensa de desafio comum
  - **Depende de:** T2.18
  - **Resultado observavel:** testes passando, cobrindo bloqueio sem execucao aceita, uso de contagem do repository, ignorar `internal_error` indiretamente pelo contador e chamada ao use case de recompensa com valores calculados no server.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.19** — Atualizar recompensa de star challenge no server
  - **Depende de:** T1.11, T1.12, T1.13, T2.6
  - **Resultado observavel:** `RewardUserForStarChallengeCompletionController` aplica a mesma fonte confiavel de execucao aceita e contagem de erros para star challenges.
  - **Camada:** `rest`

- [x] **T2.19t** — Testar controller de recompensa de star challenge
  - **Depende de:** T2.19
  - **Resultado observavel:** testes passando, cobrindo bloqueio sem execucao aceita, uso de contagem persistida e payload de star challenge sem contadores vindos da web.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.20** — Atualizar rotas de recompensa em `UsersRouter`
  - **Depende de:** T2.18, T2.19
  - **Resultado observavel:** schemas de recompensa removem `incorrectAnswersCount` e `maximumIncorrectAnswersCount`, e `UsersRouter` instancia repositories de desafio e execucao para os controllers.
  - **Camada:** `rest`

- [x] **T2.20t** — Testar rotas HTTP de recompensa sem contadores da web
  - **Depende de:** T2.20
  - **Resultado observavel:** testes de integracao das rotas de recompensa de challenge e star challenge passando, cobrindo rejeicao/ignorancia de contadores enviados pela web, exigencia de execucao aceita persistida e calculo de recompensa a partir do server.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/server-routes-testing-rules.md`

- [x] **T2.21** — Atualizar `PostChallengeTool`
  - **Depende de:** T1.7, T2.12
  - **Resultado observavel:** tool aceita `isEvaluatedByFunction?`, envia default `true` ao criar `ChallengeDto` e preserva a regra de desafio por output quando informada.
  - **Camada:** `ai`

- [x] **T2.21t** — Testar `PostChallengeTool`
  - **Depende de:** T2.21
  - **Resultado observavel:** testes passando, cobrindo criacao com default `true` e criacao com `isEvaluatedByFunction = false` sem exigir metadados de funcao indevidos.
  - **Camada:** `ai`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.22** — Atualizar `UpdateChallengeTool`
  - **Depende de:** T1.7, T2.12
  - **Resultado observavel:** tool aceita `isEvaluatedByFunction?`, preserva valor atual quando ausente e atualiza explicitamente quando informado.
  - **Camada:** `ai`

- [x] **T2.22t** — Testar `UpdateChallengeTool`
  - **Depende de:** T2.22
  - **Resultado observavel:** testes passando, cobrindo preservacao do criterio atual, atualizacao para avaliacao por output e manutencao do default retrocompativel.
  - **Camada:** `ai`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.23** — Atualizar instrucoes de agentes de desafio
  - **Depende de:** T2.21, T2.22
  - **Resultado observavel:** `apps/server/src/ai/challenging/constants/agents-instructions.ts` documenta `isEvaluatedByFunction`, default `true`, uso de `false` para comparacao por console e ausencia permitida de `function` nesse modo.
  - **Camada:** `ai`

---

## F3 — Web: UI, Store, REST e RPC

> Pode rodar em paralelo com F2 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao web — widgets, store, services REST, actions RPC e rotas App Router — consumindo os contratos definidos no core.

### Tarefas

- [x] **T3.1** — Implementar metodos REST de execucoes em `ChallengingService`
  - **Depende de:** T1.8
  - **Resultado observavel:** `apps/web/src/rest/services/ChallengingService.ts` implementa `runChallengeCode`, `fetchChallengeCodeExecutions` e `fetchChallengeCodeExecutionErrorsCount` com URLs relativas, objetos de dominio nos parametros e responses tipadas.
  - **Camada:** `rest`

- [x] **T3.2** — Adicionar rota nomeada de execucoes
  - **Depende de:** -
  - **Resultado observavel:** `apps/web/src/constants/routes.ts` expoe `challengeExecutions(challengeSlug: string)` apontando para a aba `Execucoes`.
  - **Camada:** `web`

- [x] **T3.3** — Criar App Router page/default da aba `Execucoes`
  - **Depende de:** T3.2
  - **Resultado observavel:** `page.tsx` e `default.tsx` em `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/executions/` renderizam `ChallengeCodeExecutionsSlot`.
  - **Camada:** `web`

- [x] **T3.3t** — Testar App Router page/default da aba `Execucoes`
  - **Depende de:** T3.3
  - **Resultado observavel:** testes co-localizados da entrada `executions` passando, cobrindo delegacao para `ChallengeCodeExecutionsSlot` e preservacao do shape de composicao do App Router sem testar detalhes internos do widget.
  - **Camada:** `web`
  - **Rules:** `documentation/rules/web-app-routes-testing-rules.md`

- [x] **T3.4** — Atualizar `challengeFormSchema`
  - **Depende de:** T1.7, T2.12
  - **Resultado observavel:** schema do formulario preserva default `true` para `isEvaluatedByFunction`, permite envio sem `function` quando o desafio for avaliado por output e mantem `function` obrigatoria quando for avaliado por retorno de funcao.
  - **Camada:** `web`

- [x] **T3.5** — Hidratar `Challenge.isEvaluatedByFunction` na pagina de desafio
  - **Depende de:** T1.7
  - **Resultado observavel:** `useChallengePage` cria `Challenge` com `isEvaluatedByFunction` recebido da action/service, preservando default `true` quando ausente.
  - **Camada:** `ui`

- [x] **T3.5t** — Testar hook da pagina de desafio
  - **Depende de:** T3.5
  - **Resultado observavel:** testes do hook passando, cobrindo hidratacao com `isEvaluatedByFunction = false` e default `true` para payload antigo.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.6** — Atualizar hook da pagina de edicao de desafio
  - **Depende de:** T1.7, T3.4
  - **Resultado observavel:** `useChallengeEditorPage` inicializa e submete `isEvaluatedByFunction`, monta payload sem `function` quando a avaliacao for por output e preserva default `true`.
  - **Camada:** `ui`

- [x] **T3.6t** — Testar hook da pagina de edicao de desafio
  - **Depende de:** T3.6
  - **Resultado observavel:** testes passando, cobrindo default por funcao, submissao por output sem `function` e preservacao do valor em edicoes.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.7** — Atualizar view da pagina de edicao de desafio
  - **Depende de:** T3.6
  - **Resultado observavel:** `ChallengeEditorPageView` exibe controle booleano para `isEvaluatedByFunction` e condiciona a configuracao de funcao conforme o valor selecionado.
  - **Camada:** `ui`

- [x] **T3.7t** — Testar view da pagina de edicao de desafio
  - **Depende de:** T3.7
  - **Resultado observavel:** testes da view passando, cobrindo renderizacao do controle, alternancia entre avaliacao por funcao/output e exibicao condicional do campo de funcao.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.8** — Atualizar `ChallengeFunctionField`
  - **Depende de:** T3.7
  - **Resultado observavel:** widget de assinatura de funcao renderiza apenas quando o desafio for avaliado por funcao, ou recebe prop equivalente para ocultacao/desabilitacao.
  - **Camada:** `ui`

- [x] **T3.8t** — Testar `ChallengeFunctionField`
  - **Depende de:** T3.8
  - **Resultado observavel:** testes passando, cobrindo campo visivel para avaliacao por funcao e ausente/desabilitado para avaliacao por output.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.9** — Atualizar contratos e estado inicial do `ChallengeStore`
  - **Depende de:** T1.4
  - **Resultado observavel:** tipos do store incluem `executions` em `ChallengeContent` e novos campos `isCodeRunning`, `latestCodeExecution`, `acceptedCodeExecution`, `codeExecutionErrorsCount`, `currentCode` e `pendingExecutionCode` com estado inicial consistente.
  - **Camada:** `ui`

- [x] **T3.10** — Implementar actions de execucao no `ChallengeStore`
  - **Depende de:** T3.9
  - **Resultado observavel:** facade e Zustand store expoem `setCurrentCode`, `setCodeExecutionErrorsCount`, `replaceCurrentCodeWithExecution`, `startCodeExecution`, `finishCodeExecution`, `failCodeExecution` e `invalidateAcceptedCodeExecution`, sincronizando results/userOutputs e execucao aceita.
  - **Camada:** `ui`

- [x] **T3.11** — Implementar hook `useChallengeCodeExecutionsSlot`
  - **Depende de:** T1.4, T3.1, T3.10
  - **Resultado observavel:** hook busca execucoes com `itemsPerPage = 20`, controla loading/error/empty/content, pagina, abre dialogs, substitui codigo atual por execucao historica e nao cria nova execucao ao restaurar codigo.
  - **Camada:** `ui`

- [x] **T3.11t** — Testar `useChallengeCodeExecutionsSlot`
  - **Depende de:** T3.11
  - **Resultado observavel:** testes passando, cobrindo busca inicial autenticada, paginacao, erro com retry, empty state, abertura de dialogs e `handleUseExecutionCode` chamando o store corretamente.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.12** — Implementar `ChallengeCodeExecutionsSlotView`
  - **Depende de:** T3.11
  - **Resultado observavel:** view renderiza estados Blocked, Loading, Error, Empty e Content, lista execucoes e controles de paginacao sem acessar service/context diretamente.
  - **Camada:** `ui`

- [x] **T3.12t** — Testar `ChallengeCodeExecutionsSlotView`
  - **Depende de:** T3.12
  - **Resultado observavel:** testes da view passando, cobrindo estados visuais, lista com status/data/resumo, botoes de pagina e acoes de codigo/erro.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.13** — Implementar `ChallengeCodeExecutionItem`
  - **Depende de:** T1.4
  - **Resultado observavel:** item exibe status, data/hora, resumo `X/Y testes passaram`, acao de ver codigo e acao condicional de ver erro apenas quando `execution.error` existir.
  - **Camada:** `ui`

- [x] **T3.13t** — Testar `ChallengeCodeExecutionItem`
  - **Depende de:** T3.13
  - **Resultado observavel:** testes passando, cobrindo resumo de testes, status, data, clique em ver codigo e ausencia/presenca da acao de erro.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.14** — Implementar `ChallengeCodeExecutionCodeDialog`
  - **Depende de:** T1.4
  - **Resultado observavel:** dialog renderiza `CodeSnippet` readonly com o codigo da execucao e acao para usar esse codigo no editor atual.
  - **Camada:** `ui`

- [x] **T3.14t** — Testar `ChallengeCodeExecutionCodeDialog`
  - **Depende de:** T3.14
  - **Resultado observavel:** testes passando, cobrindo renderizacao do codigo, fechamento do dialog e chamada de `onUseCode` com a execucao selecionada.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.15** — Implementar `ChallengeCodeExecutionErrorDialog`
  - **Depende de:** T1.4
  - **Resultado observavel:** dialog renderiza mensagem e linha quando disponivel.
  - **Camada:** `ui`

- [x] **T3.15t** — Testar `ChallengeCodeExecutionErrorDialog`
  - **Depende de:** T3.15
  - **Resultado observavel:** testes passando, cobrindo erro de usuario, erro interno, linha nula e fechamento do dialog.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.16** — Implementar entry point `ChallengeCodeExecutionsSlot`
  - **Depende de:** T3.1, T3.11, T3.12, T3.13, T3.14, T3.15
  - **Resultado observavel:** `index.tsx` resolve `challengingService`, autenticacao e `challengeId` na borda do widget, passa dependencias ao hook e delega renderizacao para a view.
  - **Camada:** `ui`

- [x] **T3.17** — Atualizar hook do editor de codigo do desafio
  - **Depende de:** T1.7, T3.1, T3.10
  - **Resultado observavel:** `useChallengeCodeEditorSlot` executa no server para autenticados, preserva execucao local para anonimos, bloqueia concorrencia, ignora resposta obsoleta para verificacao, atualiza results/userOutputs por DTO e sincroniza codigo restaurado do historico.
  - **Camada:** `ui`

- [x] **T3.17t** — Testar hook do editor de codigo do desafio
  - **Depende de:** T3.17
  - **Resultado observavel:** testes passando, cobrindo fluxo autenticado persistido, fluxo anonimo local, loading, bloqueio de concorrencia, resposta obsoleta apos alteracao do codigo e restauracao de codigo historico.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.18** — Atualizar view do editor de codigo do desafio
  - **Depende de:** T3.17
  - **Resultado observavel:** `ChallengeCodeEditorSlotView` passa loading para toolbar, controla permissao de console e renderiza `Console` somente quando `shouldShowConsole` for `true`.
  - **Camada:** `ui`

- [x] **T3.18t** — Testar view do editor de codigo do desafio
  - **Depende de:** T3.18
  - **Resultado observavel:** testes passando, cobrindo loading do botao executar, console oculto para avaliacao por funcao e console visivel para avaliacao por output.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.19** — Atualizar `CodeEditorToolbar`
  - **Depende de:** T3.18
  - **Resultado observavel:** toolbar aceita `isRunCodeLoading?` e `canOpenConsole?`, desabilita `Executar` durante execucao, mostra estado de carregamento e oculta/desabilita abertura de console quando necessario.
  - **Camada:** `ui`

- [x] **T3.19t** — Testar `CodeEditorToolbar`
  - **Depende de:** T3.19
  - **Resultado observavel:** testes passando, cobrindo clique bloqueado durante loading, estado visual de carregamento e ausencia da acao de console quando `canOpenConsole = false`.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.20** — Atualizar hook da aba `Resultado`
  - **Depende de:** T1.13, T3.1, T3.10
  - **Resultado observavel:** `useChallengeResultSlot` calcula bloqueio de verificacao por execucao pendente, execucao aceita, codigo atual e resultados; busca contador autenticado no server; usa contador local para anonimos; grava cookie de recompensa sem contadores.
  - **Camada:** `ui`

- [x] **T3.20t** — Testar hook da aba `Resultado`
  - **Depende de:** T3.20
  - **Resultado observavel:** testes passando, cobrindo bloqueio sem execucao aceita, bloqueio por codigo alterado, bloqueio por testes falhos, contador via server para autenticado, contador local para anonimo e cookie sem contadores de erro.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.21** — Atualizar view da aba `Resultado`
  - **Depende de:** T3.20
  - **Resultado observavel:** `ChallengeResultSlotView` renderiza contador de erros e passa `isBlocked`/motivo ao `VerificationButton`.
  - **Camada:** `ui`

- [x] **T3.21t** — Testar view da aba `Resultado`
  - **Depende de:** T3.21
  - **Resultado observavel:** testes passando, cobrindo exibicao do contador de erros e propagacao do bloqueio/motivo para o botao de verificacao.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.22** — Atualizar hook do `VerificationButton`
  - **Depende de:** T3.20
  - **Resultado observavel:** hook aceita `isBlocked?` e `blockedReason?`, impedindo clique e atalho quando bloqueado sem alterar comportamento padrao de lessons.
  - **Camada:** `ui`

- [x] **T3.22t** — Testar hook do `VerificationButton`
  - **Depende de:** T3.22
  - **Resultado observavel:** testes passando, cobrindo bloqueio por prop, preservacao do comportamento quando `isBlocked` nao for informado e bloqueio por teclado.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.23** — Atualizar view do `VerificationButton`
  - **Depende de:** T3.22
  - **Resultado observavel:** view desabilita botao quando `isBlocked || !isAnswered`, ajusta estado visual e exibe motivo curto de bloqueio quando fornecido.
  - **Camada:** `ui`

- [x] **T3.23t** — Testar view do `VerificationButton`
  - **Depende de:** T3.23
  - **Resultado observavel:** testes passando, cobrindo estado bloqueado, estado nao respondido, motivo exibido e comportamento padrao sem prop nova.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.24** — Atualizar tabs do desafio
  - **Depende de:** T3.2, T3.9
  - **Resultado observavel:** `ChallengeTabsView` inclui aba `Execucoes`; para usuario anonimo, o trigger fica bloqueado e abre `AccountRequirementAlertDialog`.
  - **Camada:** `ui`

- [x] **T3.24t** — Testar tabs do desafio
  - **Depende de:** T3.24
  - **Resultado observavel:** testes passando, cobrindo aba visivel para autenticado, trigger bloqueado para anonimo e rota/active content de `executions`.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.25** — Atualizar slider mobile do desafio
  - **Depende de:** T3.9, T3.16
  - **Resultado observavel:** `ChallengeSliderView` reconhece `activeContent === 'executions'`, exibe label `Execucoes` e renderiza o conteudo correto no slide inicial.
  - **Camada:** `ui`

- [x] **T3.25t** — Testar slider mobile do desafio
  - **Depende de:** T3.25
  - **Resultado observavel:** testes passando, cobrindo label `Execucoes`, conteudo da nova aba e preservacao dos demais conteudos.
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

- [x] **T3.26** — Atualizar schemas RPC de recompensa
  - **Depende de:** T1.13
  - **Resultado observavel:** `apps/web/src/rpc/next-safe-action/rewardingActions.ts` remove `incorrectAnswersCount` e `maximumIncorrectAnswersCount` dos schemas de challenge e star challenge.
  - **Camada:** `rpc`

- [x] **T3.27** — Atualizar `ProfileService` REST de recompensas
  - **Depende de:** T1.13
  - **Resultado observavel:** `apps/web/src/rest/services/ProfileService.ts` envia os payloads de recompensa de challenge e star challenge sem `incorrectAnswersCount` e `maximumIncorrectAnswersCount`, preservando as rotas atuais e os retornos tipados.
  - **Camada:** `rest`

- [x] **T3.28** — Atualizar `AccessChallengeRewardingPageAction`
  - **Depende de:** T1.13, T3.26, T3.27
  - **Resultado observavel:** action le cookie de recompensa sem contadores e chama `ProfileService.rewardUserForChallengeCompletion` com payload confiavel minimo.
  - **Camada:** `rpc`

- [x] **T3.28t** — Testar `AccessChallengeRewardingPageAction`
  - **Depende de:** T3.28
  - **Resultado observavel:** testes passando, cobrindo leitura de cookie sem contadores, chamada ao service com `challengeId`/`secondsCount` e propagacao de falha do service.
  - **Camada:** `rpc`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T3.29** — Atualizar `AccessStarChallengeRewardingPageAction`
  - **Depende de:** T1.13, T3.26, T3.27
  - **Resultado observavel:** action le cookie de recompensa de star challenge sem contadores e chama service com `challengeId`, `starId`, `nextStarId` quando aplicavel e `secondsCount`.
  - **Camada:** `rpc`

- [x] **T3.29t** — Testar `AccessStarChallengeRewardingPageAction`
  - **Depende de:** T3.29
  - **Resultado observavel:** testes passando, cobrindo payload sem contadores, repasse de `starId`/`nextStarId` e propagacao de falha do service.
  - **Camada:** `rpc`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T3.30** — Atualizar entry point `ChallengeCodeEditorSlot`
  - **Depende de:** T3.17, T3.18, T3.19
  - **Resultado observavel:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/index.tsx` resolve `challengingService` e contexto de autenticacao, injeta dependencias no hook, passa `isCodeRunning` para a view e calcula `shouldShowConsole` como falso quando `challenge.isEvaluatedByFunction` for verdadeiro.
  - **Camada:** `ui`

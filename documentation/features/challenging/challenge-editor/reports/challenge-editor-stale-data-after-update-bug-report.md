---
title: Challenge Editor stale data after update
apps: web
prd: https://github.com/JohnPetros/stardust/milestone/4
issue: https://github.com/JohnPetros/stardust/issues/392
status: closed
last_updated_at: 2026-04-22
---

# Bug Report: Challenge Editor stale data after update

## Problema Identificado

Ao editar um desafio existente, a atualizacao e persistida com sucesso, mas a pagina final do desafio continua exibindo os dados antigos quando o titulo permanece inalterado. Na pratica, mudancas em descricao, codigo, casos de teste, categorias e visibilidade nao aparecem apos o redirecionamento, embora o fluxo de submit conclua sem erro.

## Causas

- Estado stale na camada client: a pagina do desafio reutiliza um `challenge` salvo em store compartilhada e nao o substitui quando recebe um `challengeDto` mais recente.
- Hidratacao condicional no hook da pagina do desafio: `setChallenge(...)` so ocorre quando o estado atual esta vazio.
- O redirecionamento pos-update volta para a mesma rota quando a `slug` nao muda, o que aumenta a chance de reaproveitamento do estado antigo sem reinicializacao.
- Cache de leitura na camada RPC/Next: as actions server-side de acesso a pagina de desafio e de acesso ao editor usavam `NextServerRestClient` com `isCacheEnabled: true`, `refetchInterval: 60` e `cacheKey: 'challenging-actions'`, permitindo retorno de snapshot stale por ate 60s apos update.

## Contexto e Analise

### Camada Core (Use Cases)
- **Arquivo:** `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`
- **Diagnostico:** O caso de uso reconstrui a entidade completa, valida duplicidade apenas quando o titulo muda e delega `replace(challenge)` ao repositorio. Nao ha evidencia de regra que descarte alteracoes em campos diferentes de `title`, o que indica que a origem do bug nao esta no core.

### Camada REST (Controllers)
- **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts`
- **Diagnostico:** O controller sobrescreve `challengeDto.id` com o parametro de rota e delega integralmente ao `UpdateChallengeUseCase`. Nao existe filtro condicional por `title`, reforcando que o backend nao aparenta ser o ponto de falha.

### Camada REST (Services)
- **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
- **Diagnostico:** O service envia `PUT /challenging/challenges/:challengeId` com `challenge.dto` completo. O contrato de transporte ja contempla todos os campos editaveis e nao introduz nenhuma restricao ligada ao titulo.

### Camada Banco de Dados (Repositories)
- **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
- **Diagnostico:** `replace(challenge)` atualiza `title`, `code`, `description`, `difficulty_level`, `user_id`, `star_id`, `is_public`, `is_new`, `slug` e `test_cases`, alem de recriar o vinculo em `challenges_categories`. A persistencia cobre os campos afetados pelo bug, entao a inconsistencia observada tende a ocorrer depois do banco.

### Camada RPC (Actions)
- **Arquivo:** `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
- **Diagnostico:** A action busca novamente o desafio por `slug` e retorna `challengeDto` para a pagina. Isso delimita que existe uma fonte fresca de dados chegando na borda do `web`, e que a divergencia aparece na fase client-side de hidratacao/estado.

### Camada RPC (Next Safe Action)
- **Arquivo:** `apps/web/src/rpc/next-safe-action/challengingActions.ts`
- **Diagnostico:** Apesar de `AccessChallengePageAction` buscar dados no backend, as actions `accessChallengePage`, `accessAuthenticatedChallengePage` e `accessChallengeEditorPage` estavam configuradas com cache server-side (`refetchInterval: 60`). Isso introduzia stale data no retorno para a pagina do desafio e para a pagina de edicao logo apos update.

### Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts`
- **Diagnostico:** Apos `updateChallenge(...)`, o hook redireciona para `ROUTES.challenging.challenges.challenge(challengeSlug)`. Quando o titulo nao muda, a `slug` permanece igual e o retorno acontece para a mesma rota logica, sem nenhum passo adicional de invalidacao do estado exibido.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
- **Diagnostico:** O hook da pagina do desafio so chama `setChallenge(...)` quando `challenge` ainda e nulo. Se a store ja contem um desafio da navegacao anterior, o `challengeDto` novo nao substitui o estado antigo, mesmo tendo vindo atualizado da action RPC.

### Camada UI (Stores)
- **Arquivo:** `apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`
- **Diagnostico:** A store expoe `getChallengeSlice()` e `resetStore()`, mas nao possui nenhum mecanismo de sincronizacao automatica com props novas vindas da pagina.
- **Arquivo:** `apps/web/src/ui/challenging/stores/zustand/useZustandChallengeStore.ts`
- **Diagnostico:** O estado global guarda `challenge` entre navegacoes do modulo e oferece `setChallenge(challenge)` sem logica de invalidacao por mudanca de payload. O comportamento atual depende totalmente do widget consumidor decidir quando reidratar o store.

### Camada Next.js App (Pages, Layouts)
- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`
- **Diagnostico:** A page server-side carrega `challengeDto` atualizado via action e o repassa para `ChallengePage`. Isso reforca que o dado fresco chega corretamente ao app Next.js; o problema surge depois, na sincronizacao client-side com a store compartilhada.

## Plano de Correcao (Spec)

### 1. O que ja existe?

Liste recursos existentes da codebase que estao envolvidos no bug, serao reutilizados na correcao ou podem ser impactados indiretamente.

- **web**
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx` - carrega o `challengeDto` atualizado e entrega o snapshot server-side para o widget client.
  - `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts` - refaz a leitura do desafio por `slug` e entrega o payload fresco para a pagina.
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts` - concentra a hidratacao inicial do desafio, o uso da store e o ponto exato onde o estado stale persiste.
  - `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts` - executa o update e faz o redirecionamento para a pagina do desafio.
  - `apps/web/src/ui/challenging/stores/ChallengeStore/index.ts` - fornece acesso ao estado compartilhado e ao `setChallenge`/`resetStore` usados pelo widget.
  - `apps/web/src/ui/challenging/stores/zustand/useZustandChallengeStore.ts` - implementa a persistencia client-side do `challenge` no ciclo de navegacao.
- **rest**
  - `apps/web/src/rest/services/ChallengingService.ts` - envia o payload completo de update para o backend.
  - `apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts` - recebe o update e o encaminha ao core.
- **core**
  - `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts` - aplica a regra de update sem depender da alteracao de campos alem de `title` para persistir a entidade.
- **database**
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts` - persiste todos os campos editaveis e confirma que o problema nao esta na escrita em banco.

### 2. O que deve ser criado?

Descreva novos recursos necessarios **apenas se estritamente necessarios**.

- **web**
  - Nenhum recurso novo e necessario. A correcao pode reutilizar o fluxo existente de fetch server-side e a store atual.

### 3. O que deve ser modificado?

Liste mudancas pontuais em codigo existente, explicando o motivo da alteracao.

- **web**
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts` - ajustar a logica de hidratacao para sincronizar a store com o `challengeDto` recebido quando o snapshot server-side divergir do `challenge` atual, inclusive ao retornar para a mesma `slug` apos editar o desafio.
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts` - preservar o comportamento atual para navegacao normal e estados interativos locais quando nao houver divergencia entre props e store, evitando sobrescrever estado client-side sem necessidade.
  - `apps/web/src/rpc/next-safe-action/challengingActions.ts` - desabilitar cache nas actions de acesso a pagina de desafio (autenticada e publica) e na action de acesso ao editor, garantindo leitura fresca apos atualizacao.

### 4. O que deve ser removido?

Liste codigo redundante, legado ou incorreto que deve ser eliminado como parte da correcao.

- **web**
  - A condicao implicita de hidratacao "so inicializa quando `challenge` e nulo" em `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts` deve deixar de ser a unica regra de sincronizacao, pois e ela que permite manter estado stale apos o update.

## Correcao Aplicada

- **Core**
  - `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts` - retorno padronizado para payload persistido apos `replace(...)` com nova leitura por `id`.
  - `packages/core/src/challenging/use-cases/tests/UpdateChallengeUseCase.test.ts` - cobertura para update sem mudanca de titulo e para contrato de retorno com snapshot persistido.
- **Web (UI)**
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts` - reconciliacao entre `challengeDto` e store atual via comparacao de payload; reidratacao apenas quando houver divergencia real.
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/tests/useChallengePage.test.ts` - testes de estado stale e estado estavel.
- **Web (RPC/Next)**
  - `apps/web/src/rpc/next-safe-action/challengingActions.ts` - `isCacheEnabled: false` em `accessChallengePage`, `accessAuthenticatedChallengePage` e `accessChallengeEditorPage`.

## Validacao

- `npm run codecheck -w @stardust/web` ✅
- `npm run typecheck -w @stardust/web` ✅
- `npm run test -w @stardust/web` ✅
- `npm run codecheck -w @stardust/core` ✅
- `npm run typecheck -w @stardust/core` ✅
- `npm run test -w @stardust/core` ✅

---
title: Desafio Recarrega Estado Antigo Apos Mutacoes
prd: https://github.com/JohnPetros/stardust/milestone/22
issue: https://github.com/JohnPetros/stardust/issues/377
apps: web
status: closed
last_updated_at: 2026-04-02
---

## Problema Identificado

Ao alterar o switch de publicacao do desafio no editor ou registrar like/dislike na descricao do desafio, a UI mostra a mudanca localmente, mas apos recarregar a pagina o estado anterior volta a ser exibido. O comportamento esperado e que a pagina recarregada reflita o estado salvo no servidor para `isPublic` e `userChallengeVote`.

## Causas

- As actions de leitura da pagina de desafio e da pagina do editor usam `NextServerRestClient` com cache habilitado, `revalidate: 60` e tag fixa `challenging-actions`.
- As mutacoes de UI (`updateChallenge` e `voteChallenge`) saem direto do client via `RestContext`, sem nenhuma invalidacao da tag `challenging-actions`.
- No reload, a pagina volta a hidratar a UI com o snapshot cacheado retornado por `accessChallengePage`, `accessAuthenticatedChallengePage` ou `accessChallengeEditorPage`, mascarando o dado mais recente persistido no servidor.
- A mutacao otimista nos hooks da UI reforca a percepcao de sucesso local, mas nao garante que a proxima leitura SSR use dados frescos.

## Contexto e Analise

### Camada UI

- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/useChallengeControl.ts`
- **Diagnóstico:** O toggle de publicacao atualiza `challenge.isPublic` localmente e chama `challengingService.updateChallenge(challenge)` via client REST. Em caso de sucesso, apenas grava o mesmo objeto no store com `setChallenge(challenge)`. Nao existe nenhuma invalidacao da fonte SSR usada no reload da pagina do editor.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeVoteControl/useChallengeVoteControl.ts`
- **Diagnóstico:** O voto e aplicado de forma otimista com `challenge.vote(...)` e enviado por `challengingService.voteChallenge(...)` via client REST. O hook atualiza somente o store local; o reload depende de `userChallengeVote` e `challengeDto` buscados novamente no servidor, que hoje podem vir do cache.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
- **Diagnóstico:** A pagina hidrata o store a partir de `challengeDto` e `userChallengeVote` recebidos do SSR. Quando esses valores chegam stale, o store e reconstruido com estado antigo, revertendo o que a UI havia mostrado antes do reload.

### Camada RPC / SSR

- **Arquivo:** `apps/web/src/rpc/next-safe-action/challengingActions.ts`
- **Diagnóstico:** `accessAuthenticatedChallengePage`, `accessChallengePage` e `accessChallengeEditorPage` instanciam `NextServerRestClient` com `isCacheEnabled: true`, `refetchInterval: 60` e `cacheKey: 'challenging-actions'`. Isso cria uma fonte compartilhada de leitura cacheada para descricao, voto do usuario e dados do editor.

- **Arquivo:** `apps/web/src/rpc/next/NextCall.ts`
- **Diagnóstico:** A infraestrutura ja expoe `call.resetCache(cacheKey)` via `revalidateTag`, mas nenhuma mutacao do dominio `challenging` usa esse mecanismo para invalidar `challenging-actions` apos sucesso.

- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`
- **Diagnóstico:** O reload da tela de desafio sempre reexecuta `accessAuthenticatedChallengePage` ou `accessChallengePage`, portanto qualquer stale cache nessa action reidrata a pagina com `challengeDto` e `userChallengeVote` desatualizados.

- **Arquivo:** `apps/web/src/app/challenging/challenge/[challengeSlug]/page.tsx`
- **Diagnóstico:** O reload do editor depende de `accessChallengeEditorPage`, que compartilha a mesma tag cacheada e pode devolver `isPublic` antigo apos a mutacao client-side.

### Camada REST

- **Arquivo:** `apps/web/src/rest/next/NextRestClient.ts`
- **Diagnóstico:** O client server-side aplica cache por tag nas leituras quando `isCacheEnabled` esta ativo. Como as mutacoes client-side usam outro client (`RestContext`) com `isCacheEnabled: false`, existe assimetria: escreve sem cache, mas relê por uma camada cacheada sem invalidacao.

- **Arquivo:** `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
- **Diagnóstico:** O `RestContext` usa um `NextRestClient` singleton com `isCacheEnabled: false`, entao os writes da UI nao estao falhando por cache local do browser/framework; o problema aparece no proximo fetch SSR cacheado.

### Camada Server

- **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts`
- **Diagnóstico:** O controller recebe o DTO, injeta o `challengeId` da rota e encaminha para `UpdateChallengeUseCase`. Nao ha evidencia de rollback silencioso aqui; a persistencia segue o fluxo esperado de controller para use case.

- **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/VoteChallengeController.ts`
- **Diagnóstico:** O controller extrai `challengeId`, `challengeVote` e `account.id`, e delega para `VoteChallengeUseCase`. A resposta devolve `userChallengeVote`, `upvotesCount` e `downvotesCount`, indicando que a mutacao e tratada como operacao persistente no servidor.

### Camada Core

- **Arquivo:** `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`
- **Diagnóstico:** O caso de uso reconstrui a entidade, valida existencia/slug e chama `repository.replace(challenge)`. Isso reforca que a alteracao de `isPublic` tem caminho de persistencia explicito.

- **Arquivo:** `packages/core/src/challenging/use-cases/VoteChallengeUseCase.ts`
- **Diagnóstico:** O caso de uso consulta o voto atual, decide entre `addVote`, `replaceVote` ou `removeVote` e retorna os novos contadores. O contrato do dominio cobre persistencia de voto e nao depende do store da UI para manter consistencia.

### Camada Banco de Dados

- **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
- **Diagnóstico:** `replace()` atualiza `is_public` na tabela `challenges`; `addVote()`, `replaceVote()` e `removeVote()` persistem em `users_challenge_votes`; `findById()` e `findBySlug()` leem de `challenges_view`; `findVoteByChallengeAndUser()` le o voto separado. O ponto de verdade esta no banco, mas o reload da UI pode consumir um snapshot SSR anterior a essa persistencia.

## Plano de Correção (Spec)

### 1. O que já existe?

Liste recursos existentes da codebase que estao envolvidos no bug, serao reutilizados na correcao ou podem ser impactados indiretamente.

- **Camada RPC / SSR**
  - `NextCall.resetCache` — Infraestrutura ja existente para invalidar tags de cache via `revalidateTag`.
  - `challengingActions` — Fonte atual de leitura SSR da pagina de desafio e do editor, hoje cacheada com a tag `challenging-actions`.

- **Camada UI**
  - `useChallengeControl` — Hook atual do toggle de publicacao com atualizacao otimista/local.
  - `useChallengeVoteControl` — Hook atual da votacao otimista de desafio.
  - `useChallengePage` — Reidrata o store a partir de `challengeDto` e `userChallengeVote` retornados do SSR.

- **Camada Server/Core/DB**
  - `UpdateChallengeController` + `UpdateChallengeUseCase` + `SupabaseChallengesRepository.replace` — Cadeia atual de persistencia do `isPublic`.
  - `VoteChallengeController` + `VoteChallengeUseCase` + `SupabaseChallengesRepository.addVote/replaceVote/removeVote` — Cadeia atual de persistencia do voto.

- **Padrao existente de cache invalidation**
  - `apps/web/src/rpc/actions/auth/DisconnectSocialAccountAction.ts` — Exemplo ja adotado no projeto de mutacao seguida de `call.resetCache(cacheKey)`.

### 2. O que deve ser criado?

Descreva novos recursos necessarios apenas se estritamente necessarios.

- **Camada RPC**
  - `VoteChallengeAction` ou action equivalente — Wrapper server-side para executar a votacao e invalidar `challenging-actions` apos sucesso.
  - `UpdateChallengeVisibilityAction` ou action equivalente — Wrapper server-side para atualizar `isPublic` e invalidar `challenging-actions` apos sucesso.

### 3. O que deve ser modificado?

Liste mudancas pontuais em codigo existente, explicando o motivo da alteracao.

- **Camada UI**
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeVoteControl/index.tsx` — Passar a integrar a mutacao pela borda RPC em vez de chamar diretamente o service REST do client, preservando a regra de integracao no entry point.
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/index.tsx` — Resolver a dependencia da nova action de atualizacao pela borda do widget e nao pelo `challengingService` client-side.
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeVoteControl/useChallengeVoteControl.ts` — Manter a experiencia otimista local, mas delegar a confirmacao para uma mutacao que invalide o cache SSR.
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/useChallengeControl.ts` — Manter o rollback local em erro, mas delegar a persistencia para uma mutacao que invalide o cache SSR.

- **Camada RPC / SSR**
  - `apps/web/src/rpc/next-safe-action/challengingActions.ts` — Registrar as novas actions de mutacao e invalidar `challenging-actions` apos sucesso.
  - `apps/web/src/rpc/actions/challenging/` — Implementar as actions de mutacao reutilizando `ChallengingService` e `NextCall.resetCache`.

- **Camada REST / Cache**
  - `apps/web/src/rpc/next-safe-action/challengingActions.ts` — Como mitigacao imediata, considerar remover cache apenas de `accessChallengePage`, `accessAuthenticatedChallengePage` e `accessChallengeEditorPage` enquanto a invalidacao por tag nao estiver disponivel. Isso e um hotfix possivel, mas menos aderente ao padrao arquitetural do que invalidar a tag corretamente.

### 4. O que deve ser removido?

Liste codigo redundante, legado ou incorreto que deve ser eliminado como parte da correcao.

- **Camada UI**
  - `Chamada direta de mutacao via RestContext` — O caminho atual de `useChallengeControl` e `useChallengeVoteControl` para writes sensiveis a cache deve deixar de ser o fluxo principal, porque contorna a invalidacao da fonte SSR que reidrata a pagina.

---
title: Integridade da Recompensa de Estrela — Contagem de Perguntas Autoritativa no Servidor
prd: documentation/features/lesson/lesson-page/specs/reports/security-report-2026-07-06.md (ISSUE-01)
issue: documentation/features/lesson/lesson-page/specs/reports/security-report-2026-07-06.md
apps: server, web
status: open
last_updated_at: 2026-07-06
---

# 1. Objetivo

Fechar o vetor de abuso ilimitado da ISSUE-01: hoje a recompensa de conclusão de estrela é calculada no servidor a partir de `questionsCount` e `incorrectAnswersCount` vindos de um cookie **controlado pelo cliente**, permitindo forjar `questionsCount` alto e cunhar moedas/XP sem limite. Esta spec deriva `questionsCount` **no servidor** a partir das questões reais da estrela (`stars.questions`), ignorando o valor do cliente, e limita `incorrectAnswersCount` a `[0, questionsCount]`. Com isso, a recompensa fica com teto no **máximo legítimo daquela estrela** — o resíduo aceito é que `incorrectAnswersCount` continua autodeclarado (o aluno ainda pode alegar 0 erros, mas não pode mais inflar além do reward real da estrela). É a correção cirúrgica e de baixo risco; a alternativa completa (quiz autoritativo por resposta) foi avaliada e descartada por custo/benefício.

---

# 2. Escopo

## 2.1 In-scope

- Derivar `questionsCount` no servidor a partir de `QuestionsRepository.findAllByStar(starId)`, injetando-o na rota de reward pelo padrão `appendXToBody` já usado nessa rota.
- Remover `questionsCount` do schema de entrada da rota REST de reward (campo controlado pelo servidor).
- Limitar `incorrectAnswersCount` a `[0, questionsCount]` no cálculo do reward.
- Remover `questionsCount` do fluxo cliente ponta a ponta: cookie `rewardingPayload`, tipo `StarRewardingPayload`, schema RPC e `useLessonPage`.

## 2.2 Out-of-scope

- Tornar `incorrectAnswersCount` autoritativo (exigiria quiz server-side; resíduo aceito — ver seção 8).
- Reward de **star-challenge** e **challenge** (mesmo padrão de payload, fora da ISSUE-01).
- `secondsCount`: permanece autodeclarado (cosmético; não afeta moedas/XP).
- Qualquer mudança no fluxo de resolução do quiz, UI do `QuizStage`, gating `Story → Quiz` ou persistência em Redis/Postgres.

---

# 3. Requisitos

## 3.1 Funcionais

- Ao recompensar a conclusão de uma estrela, `questionsCount` provém das questões reais da estrela, não do cliente.
- `incorrectAnswersCount` recebido do cliente é limitado a `[0, questionsCount]` antes do cálculo.
- O cliente deixa de enviar `questionsCount` no cookie e no payload de rewarding.

## 3.2 Não funcionais

- **Segurança:** o número de perguntas que determina a recompensa não pode originar-se do cliente; a recompensa fica com teto no valor legítimo da estrela.

---

# 4. O que já existe?

## Core (profile)

- **`CalculateRewardForStarCompletionUseCase`** (`packages/core/src/profile/use-cases/CalculateRewardForStarCompletionUseCase.ts`) — calcula moedas/XP/accuracy a partir de `questionsCount`/`incorrectAnswersCount`.
- **`StarRewardingPayload`** (`packages/core/src/profile/domain/types/StarRewardingPayload.ts`) — `{ questionsCount, incorrectAnswersCount, secondsCount, starId }`.

## Core (lesson)

- **`QuestionsRepository`** (`packages/core/src/lesson/interfaces/QuestionsRepository.ts`) — `findAllByStar(starId: Id): Promise<Question[]>`.

## REST (server)

- **`RewardUserForStarCompletionController`** (`apps/server/src/rest/controllers/profile/users/RewardUserForStarCompletionController.ts`) — lê `starId`/`nextStarId`/`questionsCount`/`incorrectAnswersCount` de `http.getBody()` e orquestra os use cases de reward.
- **`AppendNextStarToBodyController`** (`apps/server/src/rest/controllers/space/stars/AppendNextStarToBodyController.ts`) — referência do padrão: middleware que enriquece a rota de reward com dado confiável de **outro domínio** (space) via `http.extendBody(...)`. Prova que anexar dado cross-domain na borda dessa rota é padrão vigente.
- **`AppendUserInfoToBodyController`** (`apps/server/src/rest/controllers/profile/users/AppendUserInfoToBodyController.ts`) — referência de `appendXToBody` que usa `getAccountId()`.
- **`FetchQuestionsController`** (`apps/server/src/rest/controllers/lesson/FetchQuestionsController.ts`) — referência de controller lesson que usa `QuestionsRepository`.
- **`UsersRouter`** (`apps/server/src/app/hono/routers/profile/UsersRouter.ts`) — registra `PUT /:userId/reward/star` com `verifyAuthentication` + `appendUserInfoToBody` + `appendNextStarToBody` + validações (`json` inclui hoje `questionsCount`).
- **`SupabaseQuestionsRepository`** (`apps/server/src/database/supabase/repositories/lesson/SupabaseQuestionsRepository.ts`) — `findAllByStar` lê `stars.questions` (jsonb).
- **`HonoHttp`** (`apps/server/src/app/hono/HonoHttp.ts`) — `getBody()` mescla `req.valid('json')` com `extra-body` (este último tem precedência); `getAccountId()`, `extendBody()`, `pass()`.
- **Middlewares** (`apps/server/src/app/hono/middlewares/index.ts`) — `AuthMiddleware`, `SpaceMiddleware`, `ProfileMiddleware`, `ValidationMiddleware`.

## RPC / UI (web)

- **`rewardingActions.accessRewardForStarCompletionPage`** (`apps/web/src/rpc/next-safe-action/rewardingActions.ts`) — composition root com schema `{ questionsCount, incorrectAnswersCount, secondsCount, starId }`.
- **`AccessStarRewardingPageAction`** (`apps/web/src/rpc/actions/rewarding/AccessStarRewardingPageAction.ts`) — lê o cookie, faz `JSON.parse` e chama `service.rewardUserForStarCompletion`.
- **`useLessonPage`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/useLessonPage.ts`) — monta o `rewardingPayload` (incl. `questionsCount: quiz.questionsCount`) e grava no cookie ao entrar em `rewarding`.

---

# 5. O que deve ser criado?

## REST (Controllers)

### AppendStarQuestionsCountToBodyController **(novo arquivo)**

- **Localização:** `apps/server/src/rest/controllers/lesson/AppendStarQuestionsCountToBodyController.ts`
- **Dependências:** `QuestionsRepository`
- **Request/Response:** lê `starId` de `getBody()`; anexa ao body `{ questionsCount }`
- **Métodos:**
  - `handle(http): Promise<RestResponse>` — `findAllByStar(Id.create(starId))`, calcula `questionsCount = questions.length`, `http.extendBody({ questionsCount })`, `http.pass()`. Espelha `AppendNextStarToBodyController`.

## Hono App (Middleware) — `apps: server`

### LessonMiddleware **(novo arquivo)**

- **Localização:** `apps/server/src/app/hono/middlewares/LessonMiddleware.ts` (exportado em `middlewares/index.ts`)
- **Métodos:**
  - `appendStarQuestionsCountToBody(context, next): Promise<void>` — instancia `SupabaseQuestionsRepository(http.getSupabase())` e `AppendStarQuestionsCountToBodyController`, delega o handle. Espelha `ProfileMiddleware.appendUserInfoToBody`.

> Se preferir minimizar arquivos, a alternativa é injetar `QuestionsRepository` diretamente no `RewardUserForStarCompletionController` e derivar a contagem lá. Optou-se pelo middleware por ser o padrão vigente na própria rota (`appendNextStarToBody` já enriquece com dado de outro domínio) e por manter `questionsCount` fora do schema de entrada.

---

# 6. O que deve ser modificado?

- **Arquivo:** `apps/server/src/app/hono/routers/profile/UsersRouter.ts`
  - **Mudança:** na rota `PUT /:userId/reward/star`, adicionar `lessonMiddleware.appendStarQuestionsCountToBody` e **remover** `questionsCount` do schema `json` (permanece `incorrectAnswersCount` + `starId`, mais os campos anexados por middlewares).
  - **Justificativa:** `questionsCount` passa a ser server-authoritative; campo controlado pelo servidor não entra em schema de entrada (Princípios 5 e 6).

- **Arquivo:** `packages/core/src/profile/use-cases/CalculateRewardForStarCompletionUseCase.ts`
  - **Mudança:** limitar `incorrectAnswersCount` a `[0, questionsCount]` no início de `execute` (ou nos cálculos de coins/xp/accuracy).
  - **Justificativa:** com `questionsCount` confiável, o clamp impede accuracy negativa/reward inconsistente por `incorrectAnswersCount` fora de faixa.

- **Arquivo:** `apps/server/src/app/hono/middlewares/index.ts`
  - **Mudança:** exportar `LessonMiddleware`.
  - **Justificativa:** disponibilizar o novo middleware.

- **Arquivo:** `apps/server/src/rest/controllers/lesson/index.ts`
  - **Mudança:** exportar `AppendStarQuestionsCountToBodyController`.
  - **Justificativa:** barrel do domínio.

- **Arquivo:** `packages/core/src/profile/domain/types/StarRewardingPayload.ts`
  - **Mudança:** remover `questionsCount`; manter `{ incorrectAnswersCount, secondsCount, starId }`.
  - **Justificativa:** o cliente não é mais fonte da contagem de perguntas.

- **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/useLessonPage.ts`
  - **Mudança:** montar `rewardingPayload` sem `questionsCount` (`{ incorrectAnswersCount, secondsCount, starId }`).
  - **Justificativa:** alinhamento com o novo `StarRewardingPayload`.

- **Arquivo:** `apps/web/src/rpc/next-safe-action/rewardingActions.ts`
  - **Mudança:** no schema de `accessRewardForStarCompletionPage`, remover `questionsCount` (manter `incorrectAnswersCount`, `secondsCount`, `starId`).
  - **Justificativa:** o payload do cliente deixa de carregar a contagem de perguntas.

> `AccessStarRewardingPageAction` (`apps/web/src/rpc/actions/rewarding/AccessStarRewardingPageAction.ts`) não precisa de mudança estrutural: ele repassa o payload ao service; o corpo enviado ao servidor apenas deixa de conter `questionsCount`, que o middleware injeta.

---

# 7. O que deve ser removido?

- **Item:** campo `questionsCount` do cookie `rewardingPayload` e do payload RPC de reward de estrela.
  - **Motivo:** substituído pela derivação server-side a partir de `stars.questions`.
  - **Impacto:** `useLessonPage`, `StarRewardingPayload`, schema de `accessRewardForStarCompletionPage` e o schema `json` da rota REST de reward. Sem remoção de arquivos.

---

# 8. Decisões Técnicas

- **Fix leve em vez de quiz autoritativo.** A inflação **ilimitada** (forjar `questionsCount`) é o abuso de fato relevante e é totalmente fechada derivando a contagem no servidor. O resíduo — `incorrectAnswersCount` autodeclarado — tem teto no reward legítimo máximo da estrela e é praticamente indistinguível de um aluno com desempenho perfeito. Fechar esse resíduo exigiria verificação de resposta server-side (multi-app, rework do quiz, latência por resposta), custo desproporcional ao risco de integridade de economia num app de aprendizado. Trade-off aceito conscientemente.
- **Derivação na borda (`appendStarQuestionsCountToBody`).** Mantém o `core` de `profile` isolado do domínio lesson (Princípio 4): o bridging lesson→profile ocorre no middleware/controller, exatamente como `appendNextStarToBody` já faz space→profile na mesma rota (Princípio 5).
- **`secondsCount` permanece client-side.** Apenas exibido na tela de rewarding; não afeta moedas/XP.

---

# 9. Diagramas e Referências

### Fluxo de dados

```mermaid
sequenceDiagram
    participant U as Rewarding page (web)
    participant RW as accessRewardForStarCompletionPage (RPC)
    participant MW1 as appendStarQuestionsCountToBody (novo middleware)
    participant Q as QuestionsRepository (stars.questions)
    participant RC as RewardUserForStarCompletionController
    participant UC as CalculateRewardForStarCompletionUseCase

    Note over U: cookie rewardingPayload = { incorrectAnswersCount, secondsCount, starId }
    U->>RW: payload { incorrectAnswersCount, secondsCount, starId }
    RW->>MW1: PUT /profile/users/:userId/reward/star
    MW1->>Q: findAllByStar(starId)
    MW1->>RC: extendBody({ questionsCount })
    RC->>UC: execute (questionsCount confiável; incorrectAnswersCount clampado)
    UC-->>U: { newCoins, newXp, newLevel, ... }
```

### Fluxo cross-app

- **web** envia o reward (sem `questionsCount`); **server** deriva `questionsCount` das questões reais na borda e calcula a recompensa. Comunicação REST via `PUT /profile/users/:userId/reward/star`.

### Referências

- Padrão de middleware enriquecendo a rota de reward: `apps/server/src/rest/controllers/space/stars/AppendNextStarToBodyController.ts`, `apps/server/src/rest/controllers/profile/users/AppendUserInfoToBodyController.ts`.
- Controller lesson com `QuestionsRepository`: `apps/server/src/rest/controllers/lesson/FetchQuestionsController.ts`.

---

# 10. Pendências / Dúvidas

Sem pendências.

---

# 11. Execução Recomendada

Usar **`implement-spec`**. O escopo é delimitado, de baixo risco e sem fases interdependentes complexas: 1 controller + 1 middleware novos, ajuste do schema/rota de reward, clamp no use case e limpeza de `questionsCount` no cliente. A ordem natural (core/type → server → web) cabe numa única execução direta.

---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
status: closed
---

## Pendencias (quando aplicavel)

- Sem pendencias identificadas no bug report informado.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Consolidar o contrato funcional da correcao no core (sem alterar dominio, use cases ou contratos protegidos) | - | - |
| F3 | Implementar a correcao na web para impedir fetch protegido sem autenticacao no historico do assistente | F1 | - |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Nesta correcao, apos F1 apenas a fase de `web` e necessaria.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato funcional da correcao sem dependencia de infraestrutura, preservando que historico de chats permanece recurso autenticado.

### Tarefas

- [x] **T1.1** — Validar e congelar o contrato autenticado do historico de chats
  - **Depende de:** -
  - **Resultado observavel:** Fica explicitado que `ListChatsUseCase` continua exigindo `userId` autenticado e que `GET /conversation/chats` permanece protegido, sem alteracoes em core/server.
  - **Camada:** `core`
  - **Artefatos:** `packages/core/src/conversation/use-cases/ListChatsUseCase.ts`, `apps/server/src/app/hono/routers/conversation/ChatsRouter.ts`, `apps/server/src/rest/controllers/conversation/FetchChatsController.ts`
  - **Concluido em:** 2026-04-24

- [x] **T1.2** — Definir pre-condicoes funcionais para o consumo do historico na UI
  - **Depende de:** T1.1
  - **Resultado observavel:** Fica definido como criterio de implementacao que `fetchChats` e `refetch` do historico so podem executar quando `isAccountAuthenticated` for `true`.
  - **Camada:** `core`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx`, `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
  - **Concluido em:** 2026-04-24

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a correcao na aplicacao web para impedir chamadas autenticadas indevidas no carregamento inicial da pagina publica do desafio.

### Tarefas

- [x] **T3.1** — Injetar estado de autenticacao no entry point de `AssistantChatsHistory`
  - **Depende de:** T1.2
  - **Resultado observavel:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx` passa `isAccountAuthenticated` para `useAssistantChatsHistory`, mantendo a resolucao de dependencias no entry point do widget.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx`, `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
  - **Concluido em:** 2026-04-24

- [x] **T3.2** — Condicionar o fetch inicial do historico a autenticacao
  - **Depende de:** T3.1
  - **Resultado observavel:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts` passa `isEnabled: isAccountAuthenticated` para `usePaginatedCache` e visitantes anonimos nao disparam `GET /conversation/chats` na montagem.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`, `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/tests/useAssistantChatsHistory.test.ts`, `apps/web/src/ui/global/hooks/usePaginatedCache.ts`
  - **Concluido em:** 2026-04-24

- [x] **T3.3** — Bloquear `refetch` ao abrir historico sem sessao ativa
  - **Depende de:** T3.2
  - **Resultado observavel:** `handleOpenChange` chama `refetch()` apenas quando `isOpen` e `isAccountAuthenticated` forem verdadeiros, evitando `401` esperado para visitante anonimo.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`, `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/tests/useAssistantChatsHistory.test.ts`
  - **Concluido em:** 2026-04-24

- [x] **T3.4** — Validar comportamento final da pagina publica do desafio
  - **Depende de:** T3.3
  - **Resultado observavel:** Ao abrir `/challenging/challenges/[challengeSlug]/challenge` sem sessao, nenhum toast `Conta nao autorizada` aparece no carregamento inicial; com sessao ativa, historico do assistente continua carregando normalmente.
  - **Camada:** `web`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/tests/useAssistantChatsHistory.test.ts`
  - **Concluido em:** 2026-04-24

---

## Divergencias em relacao a Spec

- **T3.2:** Foi necessario corrigir a implementacao de `isEnabled` em `apps/web/src/ui/global/hooks/usePaginatedCache.ts` para que a pre-condicao de autenticacao realmente bloqueie o fetch inicial quando desabilitado.

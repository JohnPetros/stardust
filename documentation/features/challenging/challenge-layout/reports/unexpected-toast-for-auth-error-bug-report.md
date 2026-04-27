---
title: Toast de auth indevido no desafio publico
prd: https://github.com/JohnPetros/stardust/milestone/17
issue: https://github.com/JohnPetros/stardust/issues/384
apps: web
status: closed
last_updated_at: 2026-04-24
---

# Bug Report: Toast de auth indevido no desafio publico

## Problema Identificado

Ao acessar diretamente a pagina de resolucao de desafio (`/challenging/challenges/[slug]/challenge`) sem sessao ativa, um toast vermelho com a mensagem `Error: Conta nao autorizada` era exibido automaticamente durante o carregamento inicial em cenarios de acesso permitido para anonimos. O comportamento correto e: visitantes anonimos podem acessar apenas desafios publicos sem vinculo a estrela (`starId` ausente), sem exibir toast de autenticacao; desafios privados ou vinculados a estrela devem continuar retornando `404`.

## Resolucao Final

- O widget `AssistantChatsHistory` passou a resolver `isAccountAuthenticated` no entry point e repassar essa pre-condicao ao hook, conforme o Widget Pattern da camada UI.
- O hook `useAssistantChatsHistory` agora desabilita o `usePaginatedCache` para visitantes anonimos e evita `refetch()` ao abrir o historico sem autenticacao.
- `AccessChallengePageAction` foi consolidada para permitir acesso anonimo apenas a desafios publicos sem `starId`, mantendo `404` para desafios privados ou vinculados a estrela.
- A causa raiz confirmada permaneceu a mesma do diagnostico inicial: a UI iniciava um fetch protegido durante a montagem do assistente em contexto anonimo.

## Validacao Final

- Testes de regressao adicionados em `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/tests/useAssistantChatsHistory.test.ts` para garantir que visitantes anonimos nao fazem fetch no mount nem ao abrir o dialog.
- Teste adicional em `apps/web/src/rpc/actions/challenging/tests/AccessChallengePageAction.test.ts` para garantir `404` em visitante anonimo acessando desafio privado.
- `npm run test` executado com sucesso apos a consolidacao da correcao.
- Verificacao arquitetural concluida: a mudanca permaneceu na borda `web/ui` e `web/rpc`, sem alterar contratos de `core`, `rest` ou a protecao do backend em `GET /conversation/chats`.

## Causas

- O layout mobile do desafio monta o slide do assistente no carregamento inicial.
- O historico de conversas do assistente dispara `fetchChats` automaticamente via `usePaginatedCache` com `isEnabled` padrao `true`.
- `GET /conversation/chats` e uma rota protegida por `verifyAuthentication`, entao visitantes sem sessao recebem `401` com a mensagem `Conta nao autorizada`.
- `usePaginatedCache` exibe erros do SWR via toast, transformando o erro esperado de rota protegida em notificacao indevida na pagina publica.

## Contexto e Análise

### Camada Core (Use Cases)
- **Arquivo:** `packages/core/src/conversation/use-cases/ListChatsUseCase.ts`
- **Diagnóstico:** O use case lista chats por `userId` e assume identidade autenticada. Nao ha evidencia de bug no core; o historico de conversas e um recurso pessoal e deve continuar exigindo usuario autenticado.

### Camada REST (Controllers)
- **Arquivo:** `apps/server/src/app/hono/routers/conversation/ChatsRouter.ts`
- **Diagnóstico:** A rota `GET /conversation/chats` registra `this.authMiddleware.verifyAuthentication` antes de `FetchChatsController`, portanto a resposta `401` para visitante anonimo e comportamento esperado do backend.
- **Arquivo:** `apps/server/src/rest/controllers/conversation/FetchChatsController.ts`
- **Diagnóstico:** O controller chama `http.getAccountId()` e repassa o valor como `userId` para `ListChatsUseCase`, confirmando que a listagem de chats depende de conta autenticada.

### Camada REST (Services)
- **Arquivo:** `apps/web/src/rest/services/ConversationService.ts`
- **Diagnóstico:** `fetchChats(...)` chama `GET /conversation/chats`. O service apenas transporta o contrato REST protegido; o problema esta no momento em que a UI chama esse metodo sem autenticacao.

### Camada RPC (Actions)
- **Arquivo:** `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
- **Diagnóstico:** A action publica da pagina do desafio evita chamadas autenticadas quando `isAuthenticated` e `false`, retornando `ChallengeVote.createAsNone()` para visitante. Isso indica que o carregamento principal da pagina de desafio nao e a origem do toast.

### Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`
- **Diagnóstico:** O slider mobile renderiza `AssistantChatbot` no quarto slide durante a montagem do layout. Em mobile, isso torna o assistente parte do carregamento inicial mesmo antes do usuario navegar ate o slide.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatbotView.tsx`
- **Diagnóstico:** A view monta `AssistantChatsHistory` junto com os botoes do cabecalho do assistente. Como o componente de historico possui hook de dados proprio, ele pode iniciar fetch mesmo com o dialog fechado.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
- **Diagnóstico:** O hook chama `usePaginatedCache` sem `isEnabled`, usando o valor padrao `true`. Isso dispara `fetchChats` assim que o componente monta, inclusive para usuario anonimo.
- **Arquivo:** `apps/web/src/ui/global/hooks/usePaginatedCache.ts`
- **Diagnóstico:** O hook exibe erros de fetch com `toast.show(error)` no `onError`. Quando `fetchChats` recebe `401`, o erro de autorizacao sobe como toast automatico.

### Camada UI (Contexts)
- **Arquivo:** `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
- **Diagnóstico:** Quando nao ha `accessToken`, o contexto configura `Authorization` como string vazia. Isso nao e a causa principal, mas confirma que chamadas client-side protegidas feitas por visitante nao possuem credencial valida e devem ser evitadas pela UI.

### Camada Next.js App (Pages, Layouts)
- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`
- **Diagnóstico:** A page detecta ausencia de cookie de acesso e executa `accessChallengePage`, a action publica. O fluxo server-side da pagina esta alinhado ao requisito de acesso publico; o erro surge depois, na montagem client-side do assistente/historico.

## Plano de Correção

### 1. O que já existe?

Liste recursos existentes da codebase que estao envolvidos no bug, serao reutilizados na correcao ou podem ser impactados indiretamente.

- **core**
  - `ListChatsUseCase` — Lista chats por usuario autenticado e deve permanecer protegido.
- **rest**
  - `ChatsRouter` — Protege `GET /conversation/chats` com `verifyAuthentication`.
  - `FetchChatsController` — Resolve `accountId` e delega a listagem de chats ao core.
  - `ConversationService` — Expoe `fetchChats(...)` para a UI via REST.
- **rpc**
  - `AccessChallengePageAction` — Carrega a pagina publica sem buscar voto autenticado para visitantes.
- **ui**
  - `ChallengeSliderView` — Monta o assistente no slide mobile durante o carregamento do layout.
  - `AssistantChatsHistory` — Entry point do historico de chats, onde dependencias e contexto de autenticacao devem ser resolvidos.
  - `useAssistantChatsHistory` — Controla fetch, paginacao e handlers do historico de chats.
  - `usePaginatedCache` — Executa fetch paginado e exibe erros como toast.
  - `RestContextProvider` — Fornece `ConversationService` configurado com o token atual quando existe.
- **web**
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx` — Mantem a pagina de desafio publica quando nao ha cookie de acesso.

### 2. O que deve ser criado?

Descreva novos recursos necessarios **apenas se estritamente necessarios**.

- **ui**
  - Nenhum recurso novo e necessario. A correcao pode reutilizar `AuthContext`, `AssistantChatsHistory` e `usePaginatedCache`.

### 3. O que deve ser modificado?

Liste mudancas pontuais em codigo existente, explicando o motivo da alteracao.

- **ui**
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx` — Consumir o estado de autenticacao no entry point e repassar para `useAssistantChatsHistory`, seguindo o Widget Pattern.
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts` — Receber `isAccountAuthenticated` e passar `isEnabled: isAccountAuthenticated` para `usePaginatedCache`, alem de evitar `refetch()` em `handleOpenChange` quando o usuario nao estiver autenticado.

### 4. O que deve ser removido?

Liste codigo redundante, legado ou incorreto que deve ser eliminado como parte da correcao.

- **ui**
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts` — Remover o comportamento implicito de fetch automatico sem checagem de autenticacao para o historico de chats.

# Spec de Correção: Toast de auth indevido no desafio publico

# 1. Objetivo

Corrigir a pagina publica de resolucao de desafio para que visitantes nao autenticados nao recebam toast automatico de `Conta nao autorizada` durante o carregamento inicial. A implementacao deve impedir que o historico de conversas do assistente dispare chamadas protegidas sem conta autenticada, preservando o acesso publico ao desafio e mantendo os contratos protegidos de conversas no backend.

---

# 2. Escopo

## 2.1 In-scope

- Bloquear o fetch automatico de `GET /conversation/chats` quando `AssistantChatsHistory` montar sem usuario autenticado.
- Manter `/challenging/challenges/[slug]/challenge` acessivel para visitantes anonimos apenas quando o desafio for publico e sem `starId`, sem toast de erro no carregamento.
- Preservar a rota protegida `GET /conversation/chats` e o contrato de `ListChatsUseCase` como recursos autenticados.
- Reutilizar `AuthContext` para decidir se o historico de chats pode buscar dados.
- Preservar `usePaginatedCache` como utilitario generico de fetch paginado.

## 2.2 Out-of-scope

- Tornar o historico de conversas disponivel para usuarios anonimos.
- Alterar contratos REST, controllers, use cases ou banco de dados do modulo `conversation`.
- Alterar as regras de autorizacao de desafio privado, desafio com `starId` ou privilegios de `owner/god` em `AccessChallengePageAction`, alem do ajuste necessario para o caso anonimo publico sem `starId`.
- Implementar novo dialog de exigencia de conta para criar chats ou consultar historico.
- Modificar a politica de toast global do `usePaginatedCache`.

---

# 3. Requisitos

## 3.1 Funcionais

- Ao acessar `/challenging/challenges/[slug]/challenge` sem sessao ativa para um desafio publico sem `starId`, nenhum toast `Conta nao autorizada` deve aparecer no carregamento inicial.
- O historico de conversas do assistente so deve buscar chats quando houver conta autenticada.
- O carregamento sem cookie deve seguir as regras de autorizacao: anonimo acessa apenas desafio publico sem `starId`; desafio privado ou com `starId` retorna `404`.
- Usuarios autenticados devem continuar conseguindo abrir o historico de chats do assistente.
- Usuario dono do desafio privado pode acessar normalmente.
- Usuario `god` pode acessar qualquer tipo de desafio.

## 3.2 Nao funcionais

- Compatibilidade retroativa: nenhum contrato REST, RPC ou core deve ser alterado.
- Seguranca: rotas de conversa protegidas devem continuar exigindo `verifyAuthentication`.
- Resiliencia de UI: componentes montados por slides ou paineis ocultos nao devem disparar chamadas protegidas sem pre-condicao de autenticacao.
- Arquitetura: dependencias de contexto devem ser resolvidas no entry point do widget, mantendo hooks recebendo parametros.

---

# 4. O que ja existe?

## Camada Core (Use Cases)

* **`ListChatsUseCase`** (`packages/core/src/conversation/use-cases/ListChatsUseCase.ts`) - *Lista chats por `userId`, reforcando que historico de conversas e recurso pessoal autenticado.*

## Camada REST (Controllers)

* **`ChatsRouter`** (`apps/server/src/app/hono/routers/conversation/ChatsRouter.ts`) - *Protege `GET /conversation/chats` com `verifyAuthentication` antes de chamar o controller.*
* **`FetchChatsController`** (`apps/server/src/rest/controllers/conversation/FetchChatsController.ts`) - *Resolve `accountId` e executa a listagem de chats do usuario autenticado.*

## Camada REST (Services)

* **`ConversationService`** (`apps/web/src/rest/services/ConversationService.ts`) - *Expoe `fetchChats(...)`, que chama `GET /conversation/chats`.*

## Camada RPC (Actions)

* **`AccessChallengePageAction`** (`apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`) - *Controla acesso anonimo/autenticado, incluindo regra de `starId`, ownership e privilegio `god`.*

## Camada UI (Widgets)

* **`ChallengeSliderView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`) - *Renderiza `AssistantChatbot` como quarto slide no mobile, causando montagem do assistente no carregamento inicial.*
* **`AssistantChatbotView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatbotView.tsx`) - *Monta `AssistantChatsHistory` junto ao cabecalho do assistente.*
* **`AssistantChatsHistory`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx`) - *Entry point que resolve `conversationService`, `toastProvider` e deve resolver tambem o estado de autenticacao.*
* **`useAssistantChatsHistory`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`) - *Executa `usePaginatedCache` para carregar chats e hoje nao recebe pre-condicao de autenticacao.*
* **`usePaginatedCache`** (`apps/web/src/ui/global/hooks/usePaginatedCache.ts`) - *Hook generico que suporta `isEnabled` e mostra erros do fetch via toast.*

## Camada UI (Contexts)

* **`AuthContextProvider`** (`apps/web/src/ui/auth/contexts/AuthContext/index.tsx`) - *Disponibiliza `isAccountAuthenticated` via hook de auth.*
* **`RestContextProvider`** (`apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - *Fornece `ConversationService` client-side com token quando existe.*

## Camada Next.js App (Pages, Layouts)

* **`Page`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`) - *Escolhe `accessChallengePage` para visitante sem cookie e entrega `ChallengePage` como pagina publica.*

---

# 5. O que deve ser criado?

**Nao aplicavel**.

---

# 6. O que deve ser modificado?

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx`
* **Mudanca:** Consumir o hook de autenticacao existente e repassar `isAccountAuthenticated` para `useAssistantChatsHistory`.
* **Justificativa:** O entry point do widget ja resolve dependencias externas (`conversationService`, `toastProvider`) e e o local correto para fornecer a pre-condicao de auth ao hook, sem acoplar o hook diretamente ao contexto.
* **Camada:** `ui`

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
* **Mudanca:** Adicionar `isAccountAuthenticated: boolean` aos parametros do hook e passar `isEnabled: isAccountAuthenticated` para `usePaginatedCache`.
* **Justificativa:** `usePaginatedCache` ja possui mecanismo para impedir fetch; usa-lo evita chamada protegida quando o usuario e anonimo e elimina o toast automatico de `Conta nao autorizada`.
* **Camada:** `ui`

## Camada RPC (Actions)

* **Arquivo:** `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
* **Mudanca:** Permitir acesso anonimo apenas para desafio publico sem `starId`; manter `404` para anonimo em desafio privado ou com `starId`; manter acesso para autor de desafio privado e para usuario `god`.
* **Justificativa:** Alinha o comportamento esperado de autorizacao da pagina de desafio com as regras atuais de produto e evita regressao de acesso indevido.
* **Camada:** `rpc`

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
* **Mudanca:** Ajustar `handleOpenChange(isOpen: boolean)` para chamar `refetch()` apenas quando `isOpen` e `isAccountAuthenticated` forem verdadeiros.
* **Justificativa:** Mesmo apos bloquear o fetch inicial, abrir o dialog como visitante nao deve disparar uma chamada protegida que retornaria `401`.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao**
  - Corrigir o bug na borda `web` com duas frentes: pre-condicao de autenticacao no fetch do historico do assistente e consolidacao explicita das regras de autorizacao da pagina em `AccessChallengePageAction`.
* **Alternativas consideradas**
  - Alterar `GET /conversation/chats` para aceitar visitantes anonimos.
  - Silenciar globalmente erros `401` dentro de `usePaginatedCache`.
  - Remover o `AssistantChatbot` do slide mobile ate o usuario navegar para ele.
* **Motivo da escolha**
  - O backend esta correto ao proteger historico de chats pessoais. O problema e a UI chamar um recurso protegido sem autenticacao, portanto a correcao menor e mais segura e condicionar o fetch na origem.
* **Impactos / trade-offs**
  - Visitantes anonimos so acessam desafios publicos sem `starId`; em desafios privados ou com `starId`, a pagina retorna `404`.
  - Visitantes anonimos continuarao vendo o botao de historico apenas nos cenarios de acesso permitido, mas sem fetch automatico. Uma UX explicita de exigencia de conta para historico ou criacao de chat fica fora desta spec.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```ascii
Visitante anonimo
       |
       v
AccessChallengePageAction
       |
       +-- desafio privado ou com starId? --> sim --> call.notFound() (404)
       |
       `-- desafio publico sem starId --> ChallengePage
                                    |
                                    v
                          AssistantChatsHistory
                                    |
                                    v
                          isAccountAuthenticated?
                                    |
                                    +-- nao --> usePaginatedCache desabilitado --> sem GET /conversation/chats --> sem toast
                                    |
                                    `-- sim --> ConversationService.fetchChats --> GET /conversation/chats
```

* **Fluxo Cross-app:**

```ascii
apps/web UI
  AssistantChatsHistory
       |
       | REST somente se usuario autenticado
       v
apps/server REST
  GET /conversation/chats + verifyAuthentication
       |
       v
packages/core
  ListChatsUseCase(userId)
```

* **Layout:**

```ascii
ChallengeLayoutView
`- ChallengeSliderView (mobile)
   `- SwiperSlide: Assistente
      `- AssistantChatbot
         `- AssistantChatsHistory
            `- useAssistantChatsHistory(isAccountAuthenticated)
```

* **Referencias:**
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatbotView.tsx`
  - `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx`
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
  - `apps/web/src/ui/global/hooks/usePaginatedCache.ts`
  - `apps/web/src/rest/services/ConversationService.ts`
  - `apps/server/src/app/hono/routers/conversation/ChatsRouter.ts`
  - `apps/server/src/rest/controllers/conversation/FetchChatsController.ts`
  - `packages/core/src/conversation/use-cases/ListChatsUseCase.ts`

---

# 10. Pendencias / Duvidas

**Sem pendencias**.

---

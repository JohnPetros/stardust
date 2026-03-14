---
title: Retry de Criacao de Usuario na Confirmacao de Conta
prd: ../prd.md
apps: web,server
status: em_progresso
last_updated_at: 2026-03-14
---

# 1. Objetivo

Implementar no `web` um fluxo unico de confirmacao para contas autenticadas cujo perfil interno ainda nao foi criado, centralizando a espera, o retry manual e a liberacao final na pagina `AccountConfirmationPage`. A entrega deve reutilizar o onboarding assincrono que ja existe no `server` e e iniciado por `AccountSignedUpEvent`, manter o retorno social apontando para a confirmacao de conta enquanto o perfil nao existir e fazer com que o `AuthContext` redirecione rotas autenticadas para `/auth/account-confirmation` sempre que houver sessao valida sem `user` carregado.

---

# 2. Escopo

## 2.1 In-scope

- Criar uma action RPC no `web` para republicar `AccountSignedUpEvent` a partir da conta autenticada atual.
- Expor essa action no `AuthContext` para consumo da pagina `AccountConfirmationPage`.
- Evoluir `AccountConfirmationPage` para:
  - aguardar a criacao do perfil via `ProfileChannel`
  - refazer a busca do `user` quando o evento chegar
  - liberar um CTA de retry apos um tempo de espera
  - exibir a mensagem de sucesso e a acao manual de entrada quando o `user` existir
- Manter o fluxo de `SocialAccountConfirmationPage` sem handoff para `AccountConfirmationPage`, adicionando CTA de retry local para contas sociais novas.
- Fazer o `AuthContext` redirecionar rotas autenticadas para `ROUTES.auth.accountConfirmation` quando existir `account` autenticada, mas o `user` ainda nao existir.
- Remover o uso do layout global de espera de criacao de usuario para evitar duplicacao com a pagina de confirmacao.
- Reutilizar, sem alterar contrato, a cadeia atual de onboarding do `server` baseada em `AccountSignedUpEvent` -> `CreateUserJob` -> `UserCreatedEvent`.

## 2.2 Out-of-scope

- Alterar a cadeia de onboarding do `server` (`SpaceFunctions`, `RankingFunctions`, `ShopFunctions`, `ProfileFunctions`) ou seus payloads.
- Criar novo endpoint REST no `server` para retry.
- Alterar o fluxo de login com email e senha alem do redirecionamento para a pagina de confirmacao quando o perfil estiver ausente.
- Substituir `SocialAccountConfirmationPage` como pagina de callback OAuth.
- Substituir `SocialAccountConfirmationPage` como pagina de callback OAuth.
- Alterar `studio` ou adicionar novos providers sociais.
- Incluir testes automatizados nesta spec.

---

# 3. Requisitos

## 3.1 Funcionais

- O sistema deve manter uma pagina dedicada para contas autenticadas cujo perfil interno ainda esta pendente.
- Quando a conta autenticada nao tiver `user` interno, o `web` deve redirecionar rotas autenticadas para `ROUTES.auth.accountConfirmation`.
- `AccountConfirmationPage` deve aguardar a criacao do perfil e atualizar o fluxo quando `ProfileChannel` receber `UserCreatedEvent` correspondente ao email da conta autenticada.
- `AccountConfirmationPage` deve exibir um CTA de retry somente apos um tempo de espera e, ao aciona-lo, deve republicar `AccountSignedUpEvent` usando a conta autenticada atual.
- Quando o `user` passar a existir, `AccountConfirmationPage` deve exibir a mensagem de perfil criado com sucesso e manter a acao manual para seguir para `ROUTES.space`.
- `SocialAccountConfirmationPage` deve manter o comportamento atual de callback OAuth e espera local para contas sociais novas, incluindo um CTA de retry local apos atraso para republicar onboarding quando necessario.
- O fluxo deve continuar permitindo que a sessao autenticada seja reaproveitada sem exigir novo login local.

## 3.2 Nao funcionais

- Compatibilidade retroativa: os contratos existentes de `AccountSignedUpEvent` (`accountId`, `accountName`, `accountEmail`) e `UserCreatedEvent` (`userId`, `userName`, `userEmail`, `userSlug`) nao devem ser alterados.
- Compatibilidade retroativa: nenhuma rota REST existente do `server` deve mudar assinatura, especialmente `/auth/sign-up/social-account`, `/auth/account` e `/profile/users/id/:userId`.
- Resiliencia: o retry deve republicar o evento canonico de onboarding, delegando a idempotencia e as validacoes de unicidade ao fluxo ja existente no `server`.
- Latencia: o CTA de retry nao deve ficar disponivel imediatamente ao abrir `AccountConfirmationPage`; ele deve ser liberado exatamente 7 segundos apos a entrada na tela pendente.
- Consistencia de estado: a busca de `user` no `AuthContext` deve passar a depender do `account` atual em memoria, e nao apenas do `accountDto` inicial vindo da hidratacao server-side.

---

# 4. O que ja existe?

## UI

* **`AccountConfirmationPage`** (`apps/web/src/ui/auth/widgets/pages/AccountConfirmation/index.tsx`) - pagina publica ja usada apos `ConfirmEmailController`, mas hoje apenas mostra loading ate `user` existir.
* **`useAccountConfirmationPage`** (`apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts`) - hook atual da pagina de confirmacao, responsavel apenas pela animacao e navegacao para `ROUTES.space`.
* **`AccountConfirmationPageView`** (`apps/web/src/ui/auth/widgets/pages/AccountConfirmation/AccountConfirmationPageView.tsx`) - view atual com dois estados: loading ou sucesso quando `user` existe.
* **`SocialAccountConfirmationPage`** (`apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/index.tsx`) - pagina de callback do OAuth que hoje dispara `handleSignUpWithSocialAccount` e escuta `ProfileChannel` localmente.
* **`useSocialAccountConfirmationPage`** (`apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts`) - hook que le `access_token` e `refresh_token` do hash, chama a action de signup social e aguarda `UserCreatedEvent`.
* **`UserCreationPendingMessage`** (`apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/UserCreationPendingMessage/index.tsx`) - componente de mensagem pendente ja pronto para reaproveitamento visual na confirmacao de conta.
* **`useAuthContextProvider`** (`apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts`) - composition root do estado autenticado; carrega `account`, busca `user` via `ProfileService` e expoe handlers de auth.
* **`AuthContextValue`** (`apps/web/src/ui/auth/contexts/AuthContext/types/AuthContextValue.ts`) - contrato publico do contexto de autenticacao consumido pela UI.
* **`useProfileSocket`** (`apps/web/src/ui/global/hooks/useProfileSocket.ts`) - hook de assinatura do `ProfileChannel` ja usado por layouts e paginas.
* **`SupabaseProfileChannel`** (`apps/web/src/realtime/supabase/channels/SupabaseProfileChannel.ts`) - adaptador realtime que escuta `INSERT` em `public.users` e transforma o payload em `UserCreatedEvent`.
* **`RealtimeContextProvider`** (`apps/web/src/ui/global/contexts/RealtimeContext/useRealtimeContextProvider.ts`) - injeta `profileChannel` para toda a app cliente.
* **`UserCreationPendingLayout`** (`apps/web/src/ui/global/widgets/layouts/UserCreationPendingLayout/index.tsx`) - layout cliente legado que hoje tenta bloquear a navegacao enquanto o perfil ainda nao foi criado.

## RPC

* **`SignUpWithSocialAccountAction`** (`apps/web/src/rpc/actions/auth/SignUpWithSocialAccountAction.ts`) - action atual do fluxo social, responsavel por buscar a conta autenticada, chamar `/auth/sign-up/social-account` e gravar cookies.
* **`authActions.signUpWithSocialAccount`** (`apps/web/src/rpc/next-safe-action/authActions.ts`) - composition root next-safe-action usada pela UI para concluir o signup social.
* **`InngestBroker`** (`apps/web/src/queue/inngest/InngestBroker.ts`) - adapter `Broker` ja disponivel no `web` para publicar eventos no Inngest.
* **`NextCall`** (`apps/web/src/rpc/next/NextCall.ts`) - adaptador RPC usado para cookies, redirect e leitura do request nas actions do `web`.

## REST / Queue

* **`ConfirmEmailController`** (`apps/web/src/rest/controllers/auth/ConfirmEmailController.ts`) - controller que conclui a confirmacao por email e redireciona para `ROUTES.auth.accountConfirmation`.
* **`SignUpWithSocialAccountController`** (`apps/server/src/rest/controllers/auth/SignUpWithSocialAccountController.ts`) - endpoint do `server` que publica `AccountSignedUpEvent` para novas contas sociais.
* **`SpaceFunctions`** (`apps/server/src/queue/inngest/functions/SpaceFunctions.ts`) - primeiro listener do onboarding a partir de `AccountSignedUpEvent`.
* **`ProfileFunctions`** (`apps/server/src/queue/inngest/functions/ProfileFunctions.ts`) - registra `CreateUserJob` dentro da cadeia de onboarding do `server`.
* **`CreateUserJob`** (`apps/server/src/queue/jobs/profile/CreateUserJob.ts`) - etapa que cria o registro em `public.users`, aplica dados iniciais e publica `UserCreatedEvent` por meio de `FinishUserCreationUseCase`.
* **`SupabaseUsersRepository`** (`apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts`) - repositorio que materializa a criacao e leitura do `user` no banco.

## Core

* **`AccountSignedUpEvent`** (`packages/core/src/auth/domain/events/AccountSignedUpEvent.ts`) - evento canonico de entrada do onboarding de criacao de usuario.
* **`AuthService`** (`packages/core/src/auth/interfaces/AuthService.ts`) - contrato compartilhado que expoe `fetchAccount()` e `signUpWithSocialAccount(...)`.
* **`Broker`** (`packages/core/src/global/interfaces/Broker.ts`) - contrato minimo usado pelas actions e jobs para publicar eventos.
* **`ProfileChannel`** (`packages/core/src/profile/interfaces/ProfileChannel.ts`) - contrato realtime usado pela UI para observar `UserCreatedEvent`.
* **`UserCreatedEvent`** (`packages/core/src/profile/domain/events/UserCreatedEvent.ts`) - evento de criacao de perfil consumido pelo realtime no `web`.
* **`FinishUserCreationUseCase`** (`packages/core/src/profile/use-cases/FinishUserCreationUseCase.ts`) - use case que publica `UserCreatedEvent` ao final do onboarding.

## Validation

* **`accountSchema`** (`packages/validation/src/modules/auth/schemas/accountSchema.ts`) - schema usado hoje pelo `server` em `/auth/sign-up/social-account`.
* **`emailSchema`** (`packages/validation/src/modules/global/schemas/emailSchema.ts`) - validacao base reutilizada pelos schemas de auth e pelos eventos Inngest.
* **`nameSchema`** (`packages/validation/src/modules/global/schemas/nameSchema.ts`) - validacao base reutilizada pelos schemas de auth e pelos eventos Inngest.
* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - validacao base dos ids usados pelos eventos Inngest.

---

# 5. O que deve ser criado?

## Camada RPC (Actions)

* **Localizacao:** `apps/web/src/rpc/actions/auth/RetryUserCreationAction.ts` (**novo arquivo**)
* **Dependencias:** `AuthService`, `Broker`
* **Dados de request:** nenhum; a action deve usar a sessao atual para buscar a conta autenticada via `authService.fetchAccount()`
* **Dados de response:** `void`
* **Metodos:**
  * `RetryUserCreationAction(authService: AuthService, broker: Broker): Action<void, void>` - factory function que constroi a action do modulo `auth` para retry do onboarding.
  * `handle(call: Call<void>): Promise<void>` - carrega a conta autenticada, valida a existencia de `account.id` e publica `AccountSignedUpEvent` com `accountId`, `accountName` e `accountEmail`.

## Camada UI (Hooks)

* **Localizacao:** `apps/web/src/ui/auth/contexts/AuthContext/hooks/useRetryUserCreationAction.ts` (**novo arquivo**)
* **Dependencias:** `authActions.retryUserCreation`
* **Metodos:**
  * `retryUserCreation(): Promise<ActionResponse<void>>` - executa a server action de retry e normaliza o retorno em `ActionResponse` para consumo pelo `AuthContext`.

---

# 6. O que deve ser modificado?

## UI

* **Arquivo:** `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/index.tsx`
* **Mudanca:** Injetar `account`, `user`, `refetchUser`, `handleRetryUserCreation` e `profileChannel` no entry point do widget.
* **Justificativa:** Pelo Widget Pattern, a resolucao de dependencias da pagina deve ficar no entry point, e nao na view ou em hooks globais.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts`
* **Mudanca:** Passar a controlar quatro responsabilidades: assinatura de `ProfileChannel.onCreateUser`, filtro do evento pelo email da conta autenticada, `refetchUser()` quando o evento chegar e exposicao de um estado local de retry (`isRetryVisible`, `isRetryingUserCreation`) com atraso fixo de 7 segundos antes de habilitar o CTA.
* **Justificativa:** O hook e o lugar correto para orquestrar o estado transitorio da pagina, mantendo a view apenas renderizando loading, retry e sucesso.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/AccountConfirmationPageView.tsx`
* **Mudanca:** Renderizar o estado pendente com `Loading` + `UserCreationPendingMessage`, mostrar um botao de retry quando o atraso expirar e manter a mensagem de sucesso com CTA manual para `ROUTES.space` quando `user` existir.
* **Justificativa:** A pagina precisa refletir os tres estados do fluxo descrito pela feature: aguardando, tentando novamente e concluido.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/index.tsx`
* **Mudanca:** Manter composicao atual com `profileChannel` e injetar handler de retry local para a view.
* **Justificativa:** Preserva o fluxo social existente enquanto habilita recuperacao manual no proprio callback.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts`
* **Mudanca:** Manter leitura de tokens, signup social e espera local por criacao de usuario, adicionando estado de retry com atraso de 7 segundos e handler para disparar retry de onboarding.
* **Justificativa:** Evita handoff de pagina e adiciona resiliencia para contas sociais novas quando o onboarding atrasar/falhar.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/SocialAccountConfirmationPageView.tsx`
* **Mudanca:** Exibir botao de retry no estado pendente apos atraso configurado, mantendo os demais comportamentos atuais.
* **Justificativa:** Oferece recuperacao manual no proprio fluxo social sem alterar o callback OAuth.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/UserCreationPendingLayout/index.tsx`
* **Mudanca:** Remover o layout da arvore de uso da autenticacao pendente e encerrar seu uso como mecanismo de bloqueio para usuario sem perfil.
* **Justificativa:** A feature define `AccountConfirmationPage` como ponto unico de espera, retry e sucesso; manter o layout criaria duplicacao de UX e de regra de navegacao.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/UserCreationPendingLayout/useUserCreationPendingLayout.ts`
* **Mudanca:** Remover o hook junto com a desativacao do layout, pois o estado pendente passa a ser controlado exclusivamente por `AccountConfirmationPage`.
* **Justificativa:** Evita manter uma segunda orquestracao cliente baseada em `user` para o mesmo problema.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/UserCreationPendingLayout/UserCreationPendingLayoutView.tsx`
* **Mudanca:** Remover a view junto com a desativacao do layout.
* **Justificativa:** A apresentacao de espera deixa de ser responsabilidade de layout global e passa a ser da pagina de confirmacao.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts`
* **Mudanca:**
  - alterar `useCache({ isEnabled })` para depender de `Boolean(account)`
  - adicionar `handleRetryUserCreation()` usando a nova action do contexto
  - adicionar um efeito de redirect para `ROUTES.auth.accountConfirmation` quando houver `account` autenticada, `user` ausente, `isLoading` falso e a rota atual for autenticada
* **Justificativa:** O provider ja e o ponto central do estado autenticado do cliente e precisa reconhecer o estado "sessao valida sem perfil" sem exigir reload completo.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/contexts/AuthContext/types/AuthContextValue.ts`
* **Mudanca:** Declarar `handleRetryUserCreation(): Promise<boolean>` no contrato do contexto.
* **Justificativa:** A pagina de confirmacao precisa consumir a capacidade de retry sem acessar diretamente a camada RPC.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/contexts/AuthContext/index.tsx`
* **Mudanca:** Instanciar `useRetryUserCreationAction()` e repassar `retryUserCreation` para `useAuthContextProvider`.
* **Justificativa:** Mantem o wiring do contexto alinhado com os outros handlers de auth (`signIn`, `signOut`, `signUpWithSocialAccount`).
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/contexts/AuthContext/hooks/index.ts`
* **Mudanca:** Exportar `useRetryUserCreationAction` no barrel da pasta.
* **Justificativa:** Segue o padrao atual de organizacao dos hooks do contexto.
* **Camada:** `ui`

## RPC

* **Arquivo:** `apps/web/src/rpc/next-safe-action/authActions.ts`
* **Mudanca:** Registrar `retryUserCreation` como nova server action do modulo `auth`, sem payload de entrada, usando `NextServerRestClient`, `AuthService`, `InngestBroker`, `NextCall` e `RetryUserCreationAction`.
* **Justificativa:** A camada next-safe-action e a composition root padrao do `web` para expor actions tipadas a partir da UI.
* **Camada:** `rpc`

* **Arquivo:** `apps/web/src/rpc/next-safe-action/index.ts`
* **Mudanca:** Expor `retryUserCreation` dentro do objeto `authActions`.
* **Justificativa:** O hook `useRetryUserCreationAction` deve consumir a action pelo barrel oficial da camada RPC.
* **Camada:** `rpc`

* **Arquivo:** `apps/web/src/rpc/actions/auth/index.ts`
* **Mudanca:** Exportar `RetryUserCreationAction` no barrel das actions de auth.
* **Justificativa:** Mantem o modulo `auth` consistente com o padrao atual de exportacao.
* **Camada:** `rpc`

---

# 7. O que deve ser removido?

## UI

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/UserCreationPendingLayout/index.tsx`
* **Motivo da remocao:** O layout duplica a regra de "sessao valida sem perfil" que passa a ser centralizada em `AccountConfirmationPage`.
* **Impacto esperado:** A navegacao pendente deixa de ser bloqueada por layout global e passa a ocorrer por redirect do `AuthContext` para a pagina de confirmacao.

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/UserCreationPendingLayout/useUserCreationPendingLayout.ts`
* **Motivo da remocao:** O estado `isUserCreationPending` deixa de existir como preocupacao global de layout.
* **Impacto esperado:** Remove logica cliente redundante e reduz risco de conflito com o novo fluxo de retry.

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/UserCreationPendingLayout/UserCreationPendingLayoutView.tsx`
* **Motivo da remocao:** A UI de espera passa a viver exclusivamente em `AccountConfirmationPageView`.
* **Impacto esperado:** Elimina duplicacao visual e consolida loading, retry e sucesso em um unico widget.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao**: usar `AccountConfirmationPage` como tela dedicada para contas autenticadas sem perfil no fluxo por email/sessao, mantendo `SocialAccountConfirmationPage` intacta no callback OAuth.
* **Alternativas consideradas**: unificar completamente o estado pendente em `AccountConfirmationPage`; reaproveitar `UserCreationPendingLayout` como unico tratamento.
* **Motivo da escolha**: reduz impacto e risco de regressao no fluxo social existente, ao mesmo tempo em que adiciona retry manual e redirecionamento para os casos nao sociais.
* **Impactos / trade-offs**: mantem dois pontos de espera na UX (social e confirmacao), mas preserva estabilidade do callback OAuth e permite evolucao incremental.

* **Decisao**: implementar o retry como uma action RPC no `web` que publica `AccountSignedUpEvent`, sem criar endpoint novo no `server`.
* **Alternativas consideradas**: criar `POST /auth/retry-user-creation` no `server`; disparar retry diretamente da pagina com client SDK.
* **Motivo da escolha**: o `web` ja possui `InngestBroker`, `NextCall` e `AuthService.fetchAccount()`, o que permite republicar o evento usando a sessao atual sem alterar contratos REST existentes.
* **Impactos / trade-offs**: a entrega fica menor e mais aderente ao padrao RPC da app, mas o `web` passa a depender explicitamente da publicacao de um evento de onboarding que sera consumido pelo `server`.

* **Decisao**: manter a cadeia atual do `server` intacta e reutilizar `AccountSignedUpEvent` como gatilho do retry.
* **Alternativas consideradas**: criar evento novo para retry; reiniciar apenas `CreateUserJob`.
* **Motivo da escolha**: a solicitacao da feature e explicita sobre reutilizar `AccountSignedUpEvent`, e a cadeia atual ja concentra o onboarding inicial completo.
* **Impactos / trade-offs**: simplifica a implementacao e preserva contratos do core, mas reexecuta etapas anteriores do onboarding e depende da tolerancia atual do fluxo a reprocessamento.

* **Decisao**: ao receber `UserCreatedEvent`, a UI deve chamar `refetchUser()` e considerar sucesso a partir do `user` do `AuthContext`, em vez de exibir sucesso apenas com um flag local.
* **Alternativas consideradas**: mostrar sucesso imediatamente ao receber o evento; salvar um estado local de "criado" sem refetch.
* **Motivo da escolha**: o restante da app depende do `user` no `AuthContext`, entao o fluxo precisa convergir o contexto global antes de liberar a navegacao final.
* **Impactos / trade-offs**: evita divergencia entre a tela de sucesso e o estado global autenticado, mas adiciona um refetch na transicao final.

* **Decisao**: realizar o redirect para `ROUTES.auth.accountConfirmation` no `useAuthContextProvider`, e nao no middleware.
* **Alternativas consideradas**: mover a verificacao para `VerifyAuthRoutesController`; duplicar a verificacao em layouts autenticados.
* **Motivo da escolha**: o middleware atual conhece sessao, mas nao possui hoje a verificacao de `user` pronta; o provider ja sabe quando `account` e `user` estao divergentes e pode aplicar a regra em um unico ponto cliente.
* **Impactos / trade-offs**: reduz round-trips extras no middleware e cobre todos os consumidores do contexto, mas o redirect acontece apos hidratacao do cliente.

* **Decisao**: manter `SocialAccountConfirmationPage` como callback OAuth, com adicao de CTA de retry local.
* **Alternativas consideradas**: handoff para `AccountConfirmationPage`; manter social sem retry.
* **Motivo da escolha**: preserva o fluxo social existente e melhora resiliencia sem migrar a responsabilidade de espera para outra pagina.
* **Impactos / trade-offs**: introduz duplicacao parcial de UX de retry entre paginas, mas reduz friccao para usuarios que chegam pelo OAuth.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```text
Email confirmation or authenticated route without user
            |
            v
AccountConfirmationPage / AuthContext
            |
            | user ausente + conta autenticada
            v
RetryUserCreationAction (web RPC)
            |
            | Event: auth/account.signed.up
            v
         Inngest
            |
            v
apps/server queue chain
SpaceFunctions
   -> RankingFunctions
   -> ShopFunctions
   -> ProfileFunctions/CreateUserJob
            |
            | INSERT public.users + publish profile/user.created
            v
   Supabase realtime / ProfileChannel
            |
            v
AccountConfirmationPage
   -> refetchUser()
   -> sucesso visual
   -> CTA manual para /space

Social OAuth callback
            |
            v
SocialAccountConfirmationPage (fluxo atual + retry local)
            |
            v
ProfileChannel local -> sucesso social atual
```

* **Fluxo Cross-app (se aplicavel):**

```text
[apps/web]
AccountConfirmationPage
    |
    | RPC (next-safe-action)
    v
RetryUserCreationAction
    |
    | Evento Inngest: auth/account.signed.up
    v
[apps/server]
SpaceFunctions -> RankingFunctions -> ShopFunctions -> ProfileFunctions/CreateUserJob
    |
    | Banco: INSERT public.users
    | Evento: profile/user.created
    v
[Supabase Realtime]
ProfileChannel.onCreateUser(...)
    |
    v
[apps/web]
AuthContext.refetchUser() -> AccountConfirmationPage

[apps/web - fluxo social mantido]
SocialAccountConfirmationPage
    |
    | Retry local (CTA apos atraso)
    v
RetryUserCreationAction
    |
    | Evento Inngest: auth/account.signed.up
    v
apps/server queue chain
    |
    v
ProfileChannel local da pagina social
    |
    v
Sucesso social atual
```

* **Layout (se aplicavel):**

```text
AccountConfirmationPage
|- RocketAnimation
`- main
   |- Pending state
   |  |- Loading
   |  |- UserCreationPendingMessage
   |  `- Retry button (apos atraso configurado)
   `- Success state
      |- AppMessage
      `- Button: Ir para a pagina principal
```

* **Referencias:**
  - `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts`
  - `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts`
  - `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts`
  - `apps/web/src/rpc/actions/auth/SignUpWithSocialAccountAction.ts`
  - `apps/web/src/rpc/next-safe-action/authActions.ts`
  - `apps/web/src/realtime/supabase/channels/SupabaseProfileChannel.ts`
  - `apps/server/src/rest/controllers/auth/SignUpWithSocialAccountController.ts`
  - `apps/server/src/queue/jobs/profile/CreateUserJob.ts`
  - `packages/core/src/auth/domain/events/AccountSignedUpEvent.ts`
  - `packages/core/src/profile/domain/events/UserCreatedEvent.ts`

---

# 10. Pendencias / Duvidas

**Sem pendencias**.

---
title: Permissao de Usuario God no Challenge Editor
application: web
status: concluido
last_updated: 2026-02-24
---

# 1. Objetivo
Implementar o controle de permissao de gerenciamento de desafios para que o fluxo de edicao, exclusao e publicacao aceite `autor OU admin (insignia god)`, com retorno `404` para qualquer usuario nao autorizado (nao autor e nao god), sem vazar a existencia do desafio. A implementacao deve manter o fluxo atual de Challenge Editor/Challenge Page, reutilizando as camadas RPC, REST e Hono existentes, adicionando validacao de permissao no backend e estados de UI para contexto administrativo em desafios de terceiros.

# 2. O que ja existe?

## Camada Nextjs App (Pages, Layouts)
- **`Page`** (`apps/web/src/app/challenging/challenge/[challengeSlug]/page.tsx`) - _Entry point da rota de edicao; chama action RPC para acessar o editor de um desafio existente._
- **`Page`** (`apps/web/src/app/challenging/challenge/page.tsx`) - _Entry point da rota de criacao; busca categorias e abre o ChallengeEditor._
- **`Page`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`) - _Entry point da pagina de execucao; usa action RPC para carregar desafio e voto do usuario._

## Camada RPC (Actions)
- **`AccessChallengeEditorPageAction`** (`apps/web/src/rpc/actions/challenging/AccessChallengeEditorPage.ts`) - _Ja aplica `call.notFound()` para nao autor, mas ainda nao considera insignia `god`._
- **`AccessChallengePageAction`** (`apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`) - _Controla acesso a desafios privados na pagina de execucao, com regra atual baseada apenas em autoria._
- **`accessChallengeEditorPage`** (`apps/web/src/rpc/next-safe-action/challengingActions.ts`) - _Composition root da action de acesso ao editor com `authActionClient`._

## Camada REST (Services)
- **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - _Service cliente usado pela UI para `postChallenge`, `updateChallenge` e `deleteChallenge`._

## Camada UI (Widgets)
- **`ChallengeEditorPage`** (`apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/index.tsx`) - _Compoe view/hook do editor e injeta servicos/contextos._
- **`ChallengeEditorPageView`** (`apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/ChallengeEditorPageView.tsx`) - _Renderiza formulario e dialogo de exclusao do editor._
- **`useChallengeEditorPage`** (`apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts`) - _Orquestra submit de criacao/edicao/exclusao e navegacao pos-acao._
- **`ChallengeDescriptionSlotView`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeDescriptionSlotView.tsx`) - _Renderiza o `ChallengeControl` apenas para autor no estado atual._
- **`useChallengeDescriptionSlot`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/useChallengeDescriptionSlot.ts`) - _Calcula estado de autoria na pagina de execucao._
- **`ChallengeControlView`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/ChallengeControlView.tsx`) - _UI de editar/deletar/publicar na pagina de execucao, com copy focada apenas em autor._

## Camada UI (Stores)
- **`ChallengeStore`** (`apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`) - _Store compartilhada da pagina de desafio; fornece challenge atual usado pelos controles de gerenciamento._

## Camada Hono App (Routes)
- **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - _Define `POST`, `PUT` e `DELETE` de desafios; hoje usa autenticacao + insignia engineer, sem regra author-or-god._

## Camada Hono App (Middlewares)
- **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - _Ja possui `verifyAuthentication` e `verifyGodAccount`._
- **`ProfileMiddleware`** (`apps/server/src/app/hono/middlewares/ProfileMiddleware.ts`) - _Ja valida insignia engineer via `VerifyUserInsigniaController`._
- **`ChallengingMiddleware`** (`apps/server/src/app/hono/middlewares/ChallengingMiddleware.ts`) - _Middleware de dominio desafiador pronto para receber nova verificacao de permissao de gerenciamento._

## Camada REST (Controllers)
- **`VerifyGodAccountController`** (`apps/server/src/rest/controllers/auth/VerifyGodAccountController.ts`) - _Valida conta god via `ENV.godAccountId`._
- **`VerifyUserInsigniaController`** (`apps/server/src/rest/controllers/profile/users/VerifyUserInsigniaController.ts`) - _Valida insignia do usuario autenticado no perfil._
- **`UpdateChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts`) - _Executa update sem checagem explicita author-or-god no estado atual._
- **`DeleteChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/DeleteChallengeController.ts`) - _Executa delete sem checagem explicita author-or-god no estado atual._

## Pacote Validation (Schemas)
- **`challengeSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSchema.ts`) - _Schema Zod de payload do desafio no backend._
- **`challengeFormSchema`** (`packages/validation/src/modules/challenging/schemas/challengeFormSchema.ts`) - _Schema Zod do formulario do editor no frontend._

## Pacote Core (Domain)
- **`Challenge`** (`packages/core/src/challenging/domain/entities/Challenge.ts`) - _Ja possui `isChallengeAuthor(userId)` para regra de autoria._
- **`InsigniaRole`** (`packages/core/src/global/domain/structures/InsigniaRole.ts`) - _Representa papeis `engineer|god` e sera reutilizada para checks de permissao._
- **`ChallengeNotFoundError`** (`packages/core/src/challenging/domain/errors/ChallengeNotFoundError.ts`) - _Erro de negocio alinhado ao requisito de mascarar acesso com 404._

# 3. O que deve ser criado?

## Camada REST (Controllers)
- **Localizacao:** `apps/server/src/rest/controllers/challenging/challenges/VerifyChallengeManagementPermissionController.ts`
- **Dependencias:** `ChallengesRepository`, `UsersRepository`.
- **Dados de request:** `challengeId` (route param), conta autenticada via `http.getAccount()`.
- **Dados de response:** sem body; `http.pass()` quando autorizado; `ChallengeNotFoundError` quando nao autorizado/nao encontrado.
- **Metodos:** `handle(http: Http<Schema>): Promise<RestResponse>` para validar `autor OU insignia god` antes de `PUT/DELETE`.

## Camada REST (Controllers)
- **Localizacao:** `apps/server/src/rest/controllers/challenging/challenges/tests/VerifyChallengeManagementPermissionController.test.ts`
- **Dependencias:** mocks de `Http`, `ChallengesRepository` e `UsersRepository`.
- **Dados de request:** cenarios de autor, god e nao autorizado.
- **Dados de response:** assert de `pass()` para autorizado e erro `ChallengeNotFoundError` para nao autorizado.
- **Metodos:** cobertura de caminho feliz e negacao de acesso (mascarado com 404).

# 4. O que deve ser modificado?

## Camada RPC (Actions)
- **Arquivo:** `apps/web/src/rpc/actions/challenging/AccessChallengeEditorPage.ts`
- **Mudanca:** Atualizar regra de autorizacao para `isAuthor || isGod`; manter `call.notFound()` para nao autorizado.
- **Arquivo:** `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
- **Mudanca:** Permitir acesso de admin `god` a desafio privado de terceiros para suportar editar/excluir/publicar pela pagina de execucao; manter 404 para os demais.

## Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/index.tsx`
- **Mudanca:** Derivar contexto de permissao (`isGod`, `isEditingThirdPartyChallenge`, `isEditingAsAdmin`) e repassar para a view/hook.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts`
- **Mudanca:** Preservar `author.id` original do desafio durante update (evitar transferencia de autoria para admin/editor).
- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/ChallengeEditorPageView.tsx`
- **Mudanca:** Exibir aviso de contexto administrativo quando admin editar desafio de terceiros e reforcar copy do dialogo de exclusao para conteudo de terceiro.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/useChallengeDescriptionSlot.ts`
- **Mudanca:** Expor estado `canManageChallenge` (`autor || god`) e `isManagingAsAdmin` (`god && !autor`).
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeDescriptionSlotView.tsx`
- **Mudanca:** Renderizar `ChallengeControl` com base em `canManageChallenge` e propagar estado administrativo.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/index.tsx`
- **Mudanca:** Aceitar prop de contexto administrativo para ajustar mensagens e confirmacoes.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/useChallengeControl.ts`
- **Mudanca:** Propagar estado administrativo para a view sem alterar contrato com `ChallengingService`.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/ChallengeControlView.tsx`
- **Mudanca:** Ajustar aviso e texto de exclusao para distinguir autor vs admin em desafio de terceiros.

## Camada Hono App (Routes)
- **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
- **Mudanca:**
  - Em `POST /challenging/challenges`, trocar `verifyUserEngineerInsignia` por middleware que aceite `engineer OU god`.
  - Em `PUT /challenging/challenges/:challengeId` e `DELETE /challenging/challenges/:challengeId`, remover dependencia exclusiva de engineer e inserir verificacao `autor OU god` com retorno 404 para negacao.
  - Garantir ordem de middlewares para validar permissao antes da execucao do controller final.

## Camada Hono App (Middlewares)
- **Arquivo:** `apps/server/src/app/hono/middlewares/ChallengingMiddleware.ts`
- **Mudanca:** Adicionar metodo `verifyChallengeManagementPermission(context, next)` usando o novo controller e repositorios.
- **Arquivo:** `apps/server/src/app/hono/middlewares/ProfileMiddleware.ts`
- **Mudanca:** Adicionar metodo `verifyUserEngineerOrGodInsignia(context, next)` para permitir postagem por admin god sem depender de role engineer.
- **Arquivo:** `apps/server/src/app/hono/middlewares/index.ts`
- **Mudanca:** Manter export consistente (se houver novo metodo consumido externamente, sem quebrar contratos atuais).

## Camada REST (Controllers)
- **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/index.ts`
- **Mudanca:** Exportar `VerifyChallengeManagementPermissionController`.
- **Arquivo:** `apps/server/src/rest/controllers/profile/users/VerifyUserInsigniaController.ts`
- **Mudanca:** Permitir validacao por multiplos papeis (lista de `InsigniaRole`) para suportar `engineer OU god` com uma unica controller.

## Pacote Core (Domain Structures)
- **Arquivo:** `packages/core/src/global/domain/structures/InsigniaRole.ts`
- **Mudanca:** Adicionar helper `createAsGod()` (e opcionalmente getter `isGod`) para padronizar checks de permissao nas camadas web/server.

# 5. O que deve ser removido?

## Camada Geral
- **Arquivo:** `N/A` - _Nenhuma remocao obrigatoria para esta entrega._

# 6. Diagramas e Referencias
- **Fluxo de Dados:**

```ascii
[Web UI: ChallengeEditor/ChallengeControl]
                |
                v
      [RPC Action (author || god)]
                |
                v
     [ChallengingService REST client]
                |
                v
 [Hono Route: PUT/DELETE /challenging/challenges/:challengeId]
                |
                +--> verifyAuthentication
                +--> verifyChallengeManagementPermission (author || god)
                |
                v
      [Update/Delete Controller]
                |
                v
          [Use Case (core)]
                |
                v
      [SupabaseChallengesRepository]
                |
                v
              [DB]

Nao autorizado: verifyChallengeManagementPermission -> ChallengeNotFoundError -> HTTP 404
```

- **Layout:**

```ascii
Challenge Page
|- Header
|- ChallengeDescriptionSlot
|  |- ChallengeInfo
|  |- ChallengeVoteControl
|  `- ChallengeControl (renderiza se canManageChallenge)
|     |- Editar desafio (link)
|     |- Deletar (AlertDialog)
|     `- Publico/Privado (Switch)
|        `- Aviso contextual:
|           - Autor: aviso padrao de autoria
|           `- Admin terceiro: "voce esta gerenciando desafio de outro autor"
`- Tabs/Code Editor

Challenge Editor Page
|- ActionButton (postar/atualizar)
|- Delete AlertDialog
|- Admin Notice (quando admin edita terceiro)
`- Campos do formulario (titulo, funcao, testes, descricao, categorias, dificuldade)
```

- **Referencias:**
  - `apps/server/src/app/hono/routers/manual/GuidesRouter.ts`
  - `apps/server/src/app/hono/routers/shop/RocketsRouter.ts`
  - `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`
  - `apps/server/src/rest/controllers/auth/VerifyGodAccountController.ts`
  - `apps/server/src/rest/controllers/profile/users/VerifyUserInsigniaController.ts`
  - `apps/web/src/rpc/actions/challenging/AccessChallengeEditorPage.ts`
  - `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeControl/ChallengeControlView.tsx`

# 7. Entrega realizada

## Resumo da implementacao
- Regra de autorizacao consolidada como `autor OU god` no backend (Hono/REST) e frontend (RPC/UI).
- Negacao de acesso em gerenciamento segue mascaramento com `ChallengeNotFoundError` (404), sem vazamento de existencia.
- Fluxo de edicao administrativa preserva `author.id` original do desafio durante update.
- `apps/server/src/app/hono/middlewares/index.ts` nao precisou de alteracao estrutural, pois o middleware `ChallengingMiddleware` ja era exportado e o novo metodo foi consumido sem quebra de contrato.

## Checklist final
- [x] Criado `VerifyChallengeManagementPermissionController` com validacao `autor || god`.
- [x] Criado teste unitario cobrindo autor, god e nao autorizado (404 mascarado).
- [x] Atualizadas actions RPC de editor e challenge page para considerar insignia god.
- [x] Atualizado `ChallengesRouter` para usar middlewares de permissao corretos em `POST`, `PUT` e `DELETE`.
- [x] Adicionado middleware `verifyChallengeManagementPermission` em `ChallengingMiddleware`.
- [x] Adicionado middleware `verifyUserEngineerOrGodInsignia` em `ProfileMiddleware`.
- [x] Generalizada validacao de `VerifyUserInsigniaController` para multiplos papeis.
- [x] Atualizado `InsigniaRole` com `createAsGod()` e `isGod`.
- [x] Atualizada UI do editor/challenge control com contexto administrativo para desafio de terceiros.

## Validacoes executadas
- [x] `npm run codecheck` (raiz do monorepo)
- [x] `npm run test` (raiz do monorepo)

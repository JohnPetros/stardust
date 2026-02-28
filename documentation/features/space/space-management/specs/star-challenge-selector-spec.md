---
title: Seletor de Desafio por Estrela
prd: documentation/features/space/space-management/prd.md
apps: server
status: concluido
last_updated_at: 2026-02-26
---

# 1. Objetivo

Implementar, no Studio, um widget de selecao de desafio dentro do item de estrela da pagina de planetas, permitindo vincular um desafio a uma estrela com busca por titulo e paginacao; e implementar no Server os endpoints `PATCH /challenging/challenges/:challengeId/star` (vinculo) e `DELETE /challenging/challenges/:challengeId/star` (desvinculo) para atualizar o `starId` do desafio com os use cases do core, mantendo padroes de validacao, permissao e organizacao por camadas da codebase.

---

# 2. Escopo

## 2.1 In-scope

- Adicionar endpoint `PATCH /challenging/challenges/:challengeId/star` no Server.
- Adicionar endpoint `DELETE /challenging/challenges/:challengeId/star` no Server para remover vinculo.
- Adicionar controller REST para executar `EditChallengeStarUseCase`.
- Adicionar schema Zod para payload de vinculo (`starId`).
- Adicionar metodo de client REST para chamar o novo endpoint na interface `ChallengingService`.
- Adicionar widget no Studio (em `StarItem`) com:
  - abertura de seletor,
  - listagem de desafios (incluindo privados) com filtro para selecao elegivel,
  - busca por titulo,
  - paginacao,
  - acao de vinculo desafio -> estrela,
  - troca de desafio ja vinculado na mesma estrela sem bloqueio.

## 2.2 Out-of-scope

- Criar novo endpoint de listagem de desafios (sera reutilizado `GET /challenging/challenges/list`).
- Alterar regras de negocio do `EditChallengeStarUseCase` no core.
- Incluir testes automatizados nesta spec.

---

# 3. Requisitos

## 3.1 Funcionais

- Ao interagir com o seletor no `StarItem`, o Studio deve listar desafios com filtro de busca por titulo e paginacao.
- A lista do seletor deve incluir desafios privados e permitir busca por titulo.
- A selecao deve considerar como elegiveis para novo vinculo os desafios sem `starId`.
- Ao selecionar um desafio da lista, o Studio deve chamar `PATCH /challenging/challenges/:challengeId/star` enviando `starId` no body.
- O endpoint deve atualizar o `starId` do desafio e retornar `ChallengeDto` atualizado.
- Ao mudar a estrela de "desafio" para "trilha normal", o Studio deve chamar `DELETE /challenging/challenges/:challengeId/star` para remover o vinculo (`starId = null`).
- Quando a estrela ja possuir desafio vinculado e o admin selecionar outro desafio, o fluxo deve trocar o vinculo sem bloqueio (remover vinculo atual e aplicar o novo).
- Os endpoints devem exigir autenticacao e permissao de conta god para vinculo e desvinculo.
- O fluxo deve mostrar feedback de sucesso/erro na UI e manter comportamento consistente com widgets existentes.
- O gatilho do seletor deve exibir o titulo do desafio atualmente vinculado na estrela (com truncamento por ellipsis quando exceder o limite visual).
- O dialog do seletor deve exibir o desafio atualmente vinculado e disponibilizar acao explicita de desvinculo.

## 3.2 Nao funcionais

* Seguranca
  - Endpoints protegidos por `AuthMiddleware.verifyAuthentication` e `AuthMiddleware.verifyGodAccount`.
* Validacao
  - Validacao de `challengeId` e `starId` com Zod (`idSchema`) antes do controller.
* Compatibilidade retroativa
  - Mudanca aditiva: nenhum endpoint existente sera removido ou alterado.
* UX e estado de interface
  - Widget deve tratar estados `loading`, `error`, `empty` e `content`.
  - Busca no seletor deve usar debounce (500ms) para reduzir chamadas excessivas.

---

# 4. O que ja existe?

## Camada Core (Use Cases e Dominio)

* **`EditChallengeStarUseCase`** (`packages/core/src/challenging/use-cases/EditChallengeStarUseCase.ts`) - *Use case ja existente para vincular `starId` ao desafio via `replace` no repositorio.*
* **`RemoveChallengeStarUseCase`** (`packages/core/src/challenging/use-cases/RemoveChallengeStarUseCase.ts`) - *Use case para remover o vinculo de estrela (`starId = null`) quando aplicavel.*
* **`ChallengesRepository`** (`packages/core/src/challenging/interfaces/ChallengesRepository.ts`) - *Contrato com `findById`, `findByStar` e `replace` usados no fluxo.*
* **`Challenge`** (`packages/core/src/challenging/domain/entities/Challenge.ts`) - *Entidade com `starId`, `isStarChallenge` e `dto`.*

## Camada Hono App (Routes e Middlewares)

* **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - *Router de desafios com padrao de validacao + controller por rota.*
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - *Fornece `verifyAuthentication` e `verifyGodAccount` para proteger operacoes de vinculo/desvinculo de estrela por desafio.*
* **`ValidationMiddleware`** (`apps/server/src/app/hono/middlewares/ValidationMiddleware.ts`) - *Padroniza validacao Zod de params/query/body.*

## Camada REST (Controllers/Repositories)

* **`UpdateChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts`) - *Referencia de controller com `challengeId` em `routeParams`.*
* **`FetchChallengesListController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`) - *Ja suporta listagem com paginacao e filtro de titulo; usado para alimentar o seletor.*
* **`FetchChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengeController.ts`) - *Ja suporta busca por `starId` para identificar vinculo atual da estrela.*
* **`SupabaseChallengesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`) - *Persistencia de `star_id` em `replace`.*

## Pacote Validation (Schemas)

* **`challengeSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSchema.ts`) - *Schema completo de challenge; nao cobre payload minimo de vinculo de estrela.*
* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - *Schema base para UUID.*

## Camada UI (Widgets e REST client Studio)

* **`StarItem`** (`apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/index.tsx`) - *Entry point do item de estrela onde o seletor sera integrado.*
* **`useStarItem`** (`apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/useStarItem.ts`) - *Hook atual com handlers de toggle e acao de desafio.*
* **`StarItemView`** (`apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarItemView.tsx`) - *View onde sera renderizado o gatilho do seletor e estados visuais.*
* **`ChallengingService`** (`apps/studio/src/rest/services/ChallengingService.ts`) - *Client REST atual para desafios; faltando metodo para patch de star.*
* **`useFetch`** (`apps/studio/src/ui/global/hooks/useFetch.ts`) - *Hook para busca paginada tradicional por dependencias.*
* **`Pagination`** (`apps/studio/src/ui/global/widgets/components/Pagination/PaginationView.tsx`) - *Componente de paginacao reutilizavel para o seletor.*

---

# 5. O que deve ser criado?

## Camada REST (Controllers)

* **Localizacao:** `apps/server/src/rest/controllers/challenging/challenges/EditChallengeStarController.ts` (**novo arquivo**)
* **Dependencias:** `ChallengesRepository`
* **Dados de request:**
  - `challengeId` (route param)
  - `starId` (body)
* **Dados de response:** `ChallengeDto` atualizado
* **Metodos:**
  - `handle(http: Http<Schema>)` - extrai `challengeId` e `starId`, chama `EditChallengeStarUseCase`, retorna `http.send(challengeDto)`

* **Localizacao:** `apps/server/src/rest/controllers/challenging/challenges/RemoveChallengeStarController.ts` (**novo arquivo**)
* **Dependencias:** `ChallengesRepository`
* **Dados de request:**
  - `challengeId` (route param)
* **Dados de response:** `204 No Content`
* **Metodos:**
  - `handle(http: Http<Schema>)` - extrai `challengeId`, chama `RemoveChallengeStarUseCase`, retorna `http.statusNoContent().send()`

## Pacote Validation (Schemas)

* **Localizacao:** `packages/validation/src/modules/challenging/schemas/challengeStarSchema.ts` (**novo arquivo**)
* **Atributos:**
  - `starId: idSchema`

## Camada UI (Widgets)

* **Localizacao:** `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarChallengeSelector/index.tsx` (**novo arquivo**)
* **Props:**
  - `starId: Id`
  - `isStarChallenge: boolean`
  - `challengingService: ChallengingService`
  - `toastProvider: ToastProvider`
  - `onChallengeLinked?: (challengeId: string) => void`
* **Estados (Client Component):**
  - `Loading`: carregando lista paginada ao abrir/filtrar
  - `Error`: falha na listagem ou no vinculo (toast + manter dialog aberto)
  - `Empty`: nenhum desafio elegivel para vinculo
  - `Content`: lista com busca + pagina + acao de selecionar
* **View:** `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarChallengeSelector/StarChallengeSelectorView.tsx` (**novo arquivo**)
* **Hook:** `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarChallengeSelector/useStarChallengeSelector.ts` (**novo arquivo**)
* **Index:** usar `useFetch`, `Pagination`, `Input`, `Dialog`, `ChallengesTable` (`apps/studio/src/ui/global/widgets/components/ChallengesTable`) e `challengingService.editChallengeStar` no fluxo de selecao
* **Widgets internos:** Nao aplicavel
* **Estrutura de pastas:**

```text
apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/
└── StarChallengeSelector/
    ├── index.tsx
    ├── useStarChallengeSelector.ts
    └── StarChallengeSelectorView.tsx
```

---

# 6. O que deve ser modificado?

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
* **Mudanca:** Adicionar `registerEditChallengeStarRoute()` com rota `PATCH /:challengeId/star` (validacao de `param` e `json`) e `registerRemoveChallengeStarRoute()` com rota `DELETE /:challengeId/star` (validacao de `param`), ambos com middlewares de autenticacao e permissao.
* **Justificativa:** Expor contratos REST explicitos para vinculo e desvinculo de challenge-star seguindo padrao do router.
* **Camada:** `rest`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/index.ts`
* **Mudanca:** Exportar `EditChallengeStarController` e `RemoveChallengeStarController`.
* **Justificativa:** Manter barrel file do dominio challenging consistente com os demais controllers.
* **Camada:** `rest`

## Pacote Validation (Schemas)

* **Arquivo:** `packages/validation/src/modules/challenging/schemas/index.ts`
* **Mudanca:** Exportar `challengeStarSchema`.
* **Justificativa:** Permitir reuso padronizado do novo schema no router.
* **Camada:** `core`

## Camada Core (Interfaces)

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengingService.ts`
* **Mudanca:** Adicionar assinaturas `editChallengeStar(challengeId: Id, starId: Id): Promise<RestResponse<ChallengeDto>>` e `removeChallengeStar(challengeId: Id): Promise<RestResponse>`.
* **Justificativa:** Formalizar no contrato REST client as operacoes de vinculo/desvinculo usadas pelo Studio.
* **Camada:** `core`

## Camada REST (Services)

* **Arquivo:** `apps/studio/src/rest/services/ChallengingService.ts`
* **Mudanca:** Implementar `editChallengeStar(challengeId, starId)` e `removeChallengeStar(challengeId)` chamando `PATCH/DELETE /challenging/challenges/:challengeId/star`.
* **Justificativa:** Disponibilizar os novos endpoints para a UI do Studio.
* **Camada:** `rest`

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudanca:** Implementar `editChallengeStar(challengeId, starId)` e `removeChallengeStar(challengeId)` para manter conformidade com a interface compartilhada.
* **Justificativa:** Evitar quebra de tipagem no monorepo ao expandir `ChallengingService` no core.
* **Camada:** `rest`

## Camada UI (Widgets)

* **Arquivo:** `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/index.tsx`
* **Mudanca:** Integrar `StarChallengeSelector` no entry point, injetando `challengingService` e `toastProvider`.
* **Justificativa:** Manter resolucao de dependencias no `index.tsx` conforme regra da camada UI.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/useStarItem.ts`
* **Mudanca:** Ajustar handlers para abrir o seletor (em vez de fluxo unico de abrir link externo), sincronizar estado local apos vinculo, disparar `removeChallengeStar` quando o tipo da estrela for alterado para trilha normal e orquestrar troca de vinculo (buscar challenge atual da estrela -> remover -> vincular novo). Tambem carregar inicialmente o desafio vinculado por estrela via `fetchChallengeByStarId`, manter `selectedChallengeTitle`/`selectedChallengeId` em estado local e expor handler de desvinculo no dialog.
* **Justificativa:** Concentrar logica de estado/handlers no hook do widget.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarItemView.tsx`
* **Mudanca:** Exibir o gatilho do seletor de desafio na mesma linha do botao "Editar desafio" (alinhamento horizontal no bloco de acoes da estrela), com largura fixa e truncamento do titulo selecionado.
* **Justificativa:** Melhorar consistencia visual e reforcar que editar e selecionar desafio fazem parte do mesmo contexto de gerenciamento.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/widgets/components/ChallengesTable/ChallengesTableView.tsx`
* **Mudanca:** Adicionar suporte opcional para acao de selecao por linha no contexto de dialog (ex.: callback `onSelectChallenge?(challengeId: string)` e renderizacao de acao "Selecionar"), sem quebrar os usos atuais.
* **Justificativa:** Reutilizar `ChallengesTable` no dialog do seletor de desafio, conforme padrao de componentes globais compartilhados.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

Nao aplicavel.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao:** Reutilizar `EditChallengeStarUseCase` e `RemoveChallengeStarUseCase` existentes no core.
* **Alternativas consideradas:** Criar novo use case dedicado no server; atualizar challenge via `UpdateChallengeUseCase` (PUT completo).
* **Motivo da escolha:** Ja existem regras de negocio encapsuladas para vincular/desvincular estrela de desafio.
* **Impactos / trade-offs:** Mantem consistencia e reduz duplicacao; exige orquestracao no Studio para troca de vinculo sem bloqueio (remove atual antes de vincular novo).

* **Decisao:** Expor endpoint dedicado `PATCH /challenging/challenges/:challengeId/star`.
* **Alternativas consideradas:** Reusar `PUT /challenging/challenges/:challengeId` com payload completo.
* **Motivo da escolha:** Contrato explicito e minimo para um update parcial de um unico campo.
* **Impactos / trade-offs:** Mais clareza e menor payload, com custo de adicionar novo controller/rota/schema.

* **Decisao:** Adotar `DELETE /challenging/challenges/:challengeId/star` para remover vinculo quando estrela deixar de ser desafio.
* **Alternativas consideradas:** `PATCH` com `{ starId: null }`; manter vinculo e apenas trocar `isChallenge` da estrela.
* **Motivo da escolha:** Semantica REST clara para remocao de relacao e alinhamento com novo `RemoveChallengeStarUseCase`.
* **Impactos / trade-offs:** Fluxo mais explicito e previsivel; exige coordenacao adicional na UI ao alterar tipo da estrela.

* **Decisao:** Reutilizar `GET /challenging/challenges/list` para preencher o seletor (com filtro de titulo, paginacao e desafios privados).
* **Alternativas consideradas:** Criar endpoint novo apenas para seletor de estrela.
* **Motivo da escolha:** Endpoint atual ja cobre paginacao, busca e filtro de star challenge.
* **Impactos / trade-offs:** Menos codigo novo; depende de parametros existentes e da semantica atual de listagem.

* **Decisao:** Exigir permissao de conta `god` no PATCH e no DELETE via `verifyGodAccount`.
* **Alternativas consideradas:** Usar `verifyChallengeManagementPermission`; sem middleware adicional.
* **Motivo da escolha:** Alinha as operacoes de vinculo e desvinculo sob o mesmo nivel de privilegio administrativo.
* **Impactos / trade-offs:** Maior restricao de acesso e menor risco de alteracoes indevidas em vinculos challenge-star.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```ascii
[Studio PlanetsPage]
      |
      v
[StarItem -> StarChallengeSelector]
      | 1) GET /challenging/challenges/list?page&itemsPerPage&title&shouldIncludeStarChallenges=false
      v
[ChallengingService (studio)]
      |
      v
[Server ChallengesRouter]
      |
      v
[FetchChallengesListController -> ListChallengesUseCase -> SupabaseChallengesRepository]

Selecao de item:
[StarChallengeSelector]
      | 2) PATCH /challenging/challenges/:challengeId/star { starId }
      v
[ChallengesRouter]
  -> verifyAuthentication
  -> verifyGodAccount
  -> ValidationMiddleware(param+json)
      v
[EditChallengeStarController]
      v
[EditChallengeStarUseCase]
      v
[SupabaseChallengesRepository.replace]
      v
[PostgreSQL (challenges.star_id)]

Mudanca de tipo da estrela para trilha normal:
[StarItem Toggle "E um desafio?" -> false]
      | 3) DELETE /challenging/challenges/:challengeId/star
      v
[RemoveChallengeStarController -> RemoveChallengeStarUseCase]
      v
[SupabaseChallengesRepository.replace (star_id = null)]

Troca de desafio ja vinculado na estrela:
[StarChallengeSelector]
      | 4.1) GET /challenging/challenges/star/:starId
      | 4.2) DELETE /challenging/challenges/:currentChallengeId/star
      | 4.3) PATCH /challenging/challenges/:newChallengeId/star { starId }
      v
[Vinculo antigo removido + novo vinculo aplicado]
```

* **Layout:**

```ascii
PlanetsPage
└── PlanetCollapsible
    └── StarItem
        ├── Toggle "E um desafio?"
        ├── Linha de acoes de desafio
        │   ├── Botao "Editar desafio"
        │   └── Select/Trigger "Selecionar desafio" (mesma linha)
        │       └── StarChallengeSelector (Dialog)
        │       ├── Search input (titulo)
        │       ├── ChallengesTable
        │       ├── Empty/Error/Loading state
        │       └── Pagination
        └── Acoes existentes (editar nome/disponibilidade/remover)
```

* **Referencias:**
  - `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
  - `apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts`
  - `apps/server/src/app/hono/routers/space/StarsRouter.ts`
  - `packages/core/src/challenging/use-cases/EditChallengeStarUseCase.ts`
  - `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/index.tsx`
  - `apps/studio/src/ui/challenging/Challenges/useChallengesPage.ts`
  - `apps/studio/src/ui/global/widgets/components/Pagination/PaginationView.tsx`

---

# 10. Pendencias / Duvidas

Sem pendencias.

---

# 11. Resultado da Implementacao

- Endpoints `PATCH /:challengeId/star` e `DELETE /:challengeId/star` implementados no `ChallengesRouter` com autenticacao, permissao e validacao.
- Controllers `EditChallengeStarController` e `RemoveChallengeStarController` criados e exportados no barrel de challenging.
- `challengeStarSchema` criado e exportado no pacote de validacao.
- Interface `ChallengingService` expandida e implementacoes atualizadas em Studio e Web.
- Widget `StarChallengeSelector` criado no Studio e integrado ao `StarItem`.
- Trigger do seletor agora mostra o titulo do desafio vinculado (com largura fixa e ellipsis).
- Dialog do seletor exibe o desafio vinculado e inclui acao de desvincular.
- Fluxo de troca de vinculo implementado sem bloqueio (buscar atual -> desvincular -> vincular novo).

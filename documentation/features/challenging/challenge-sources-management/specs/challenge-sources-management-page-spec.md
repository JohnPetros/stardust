---
title: Gerenciamento de Fontes de Desafios no StarDust Studio
prd: documentation/features/challenging/challenge-sources-management/prd.md
apps: studio, server
status: concluido
last_updated_at: 2026-03-04
---

# 1. Objetivo

Implementar no StarDust Studio a pagina de gerenciamento de fontes de desafios (challenge sources), cobrindo listagem paginada com busca por titulo do desafio vinculado, criacao via dialog com URL + selecao de desafio, exclusao com confirmacao e reordenacao por controles de mover para cima/baixo. Tecnicamente, a entrega inclui os contratos e fluxos ponta a ponta entre UI (Studio), servico REST, rotas Hono, controllers, use cases do core, persistencia Supabase e validacao Zod, seguindo os padroes ja existentes no monorepo.

---

# 2. Escopo

## 2.1 In-scope

- Nova rota de pagina no Studio para listar, criar e excluir challenge sources.
- Reordenacao manual da listagem de sources por controles de mover para cima/baixo no Studio.
- Tabela com colunas: URL de origem, URL do desafio, titulo do desafio vinculado, status de uso (`isUsed`) e acoes.
- Busca por titulo do desafio vinculado com debounce e reset de pagina.
- Paginacao no padrao de `Pagination` ja usada no Studio.
- Dialog de criacao com validacao de URL e selecao de challenge por busca de titulo.
- Bloqueio de criacao quando o challenge selecionado ja possuir source (regra 1:1).
- Exclusao com alert dialog de confirmacao e feedback visual de sucesso/erro.
- Endpoints server dedicados para listagem, criacao e exclusao de challenge sources.
- Endpoint server dedicado para reordenacao de challenge sources.
- Camada core com interface de repositorio, use cases e erros de dominio para challenge sources.
- Camada database com repository, mapper e type para o recurso.

## 2.2 Out-of-scope

- Edicao de challenge source existente.
- Suporte a multiplas URLs por source.
- Vinculacao automatica por agente de IA.
- Exposicao da pagina para perfis nao-god.
- Criacao de migration SQL nesta entrega.
- Testes end-to-end para fluxo completo em navegador.

---

# 3. Requisitos

## 3.1 Funcionais

- O admin deve visualizar uma listagem paginada de challenge sources no Studio.
- A listagem deve permitir busca por titulo do challenge vinculado.
- A tabela deve exibir URL clicavel de origem (nova aba), URL clicavel do desafio (nova aba), titulo do challenge e acao de exclusao.
- A URL do desafio deve ser montada na UI com `ENV.stardustWebAppUrl` + slug do challenge (`/challenging/challenges/:slug`).
- Deve existir estado de loading e estado vazio na listagem.
- O admin deve conseguir abrir um dialog para cadastrar source com `url` e `challengeId`.
- O campo URL deve ser obrigatorio e validado como URL valida.
- O challenge deve ser obrigatorio e selecionavel com busca por titulo.
- Se o challenge ja possuir source, a criacao deve falhar com mensagem explicativa dentro do dialog, sem fecha-lo.
- A criacao com sucesso deve fechar o dialog, atualizar a listagem e exibir feedback de sucesso.
- A exclusao deve exigir confirmacao explicita em alert dialog.
- A exclusao bem-sucedida deve atualizar listagem e exibir feedback de sucesso.
- A exclusao com falha deve manter item na lista e exibir feedback de erro.
- A listagem deve refletir o estado de uso da fonte com base no campo `isUsed` do dominio.
- A listagem deve refletir a ordenacao por `position` (crescente).
- O admin deve conseguir reordenar sources por controles de mover para cima/baixo na listagem.
- Ao acionar os controles de reordenacao, a UI deve enviar a nova ordem para um endpoint de reordenacao e atualizar a lista.

## 3.2 Não funcionais

* Seguranca
  - Endpoints de challenge sources protegidos por `verifyAuthentication` + `verifyGodAccount`.
* Validacao
  - `challengeId` e `challengeSourceId` devem ser UUID validos (`idSchema`).
  - `url` deve ser URL valida via schema Zod.
  - `page >= 1` e `itemsPerPage >= 1`.
  - Reordenacao deve receber lista de IDs sem duplicacao (`challengeSourceIds: string[]`).
* Performance
  - Busca textual com debounce de 500ms na UI.
  - Listagem obrigatoriamente paginada (sem carga total de itens).
* Compatibilidade retroativa
  - Mudanca aditiva: nenhuma rota existente sera removida/alterada semanticamente.
* Resiliencia
  - Conflitos de unicidade (challenge ja vinculado) devem retornar erro de conflito e ser tratados na UI sem perda de estado do formulario.
- Reordenacao deve aplicar atualizacao otimista na UI e executar rollback da ordem anterior em caso de falha no endpoint.
* Idempotencia
  - Reenviar a mesma ordem de IDs deve manter a mesma ordenacao final (`position`) sem efeitos colaterais adicionais.

---

# 4. O que já existe?

## Camada UI (Studio)

* **`ChallengesPage`** (`apps/studio/src/ui/challenging/Challenges/index.tsx`) - *Padrao atual de pagina do modulo challenging consumindo `challengingService`.*
* **`useChallengesPage`** (`apps/studio/src/ui/challenging/Challenges/useChallengesPage.ts`) - *Busca, filtros por query string e paginacao no dominio challenging.*
* **`usePaginatedFetch`** (`apps/studio/src/ui/global/hooks/usePaginatedFetch.ts`) - *Hook padrao para listagem paginada com React Query.*
* **`Pagination`** (`apps/studio/src/ui/global/widgets/components/Pagination/PaginationView.tsx`) - *Componente de paginacao reutilizado no Studio.*
* **`ConfirmDialog`** (`apps/studio/src/ui/global/widgets/components/ConfirmDialog/ConfirmDialogView.tsx`) - *Dialog de confirmacao reutilizavel para acoes destrutivas.*
* **`RocketsTable`** (`apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/RocketsTableView.tsx`) - *Referencia de CRUD com tabela, dialog e paginacao.*
* **`StarChallengeSelector`** (`apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarChallengeSelector/useStarChallengeSelector.ts`) - *Referencia de selecao de challenge com busca e paginacao em dialog.*
* **`useGuidesPage`** (`apps/studio/src/ui/manual/widgets/pages/GuidesPage/useGuidesPage.ts`) - *Referencia de fluxo drag and drop + chamada de endpoint de reorder.*
* **`SortableList`** (`apps/studio/src/ui/global/widgets/components/SortableList`) - *Componente base para listas ordenaveis com dnd-kit.*

## Camada REST (Studio)

* **`ChallengingService`** (`apps/studio/src/rest/services/ChallengingService.ts`) - *Servico REST do modulo challenging; ainda sem metodos de challenge sources.*
* **`AxiosRestClient`** (`apps/studio/src/rest/axios/AxiosRestClient.ts`) - *Cliente que interpreta headers de paginacao e retorna `PaginationResponse`.*

## Camada React Router App (Studio)

* **`routes.ts`** (`apps/studio/src/app/routes.ts`) - *Registro central de rotas do app Studio.*
* **`ROUTES`** (`apps/studio/src/constants/routes.ts`) - *Constantes de caminhos de navegacao; modulo challenging ainda possui apenas `challenges`.*
* **`SidebarView`** (`apps/studio/src/ui/global/widgets/layouts/App/Sidebar/SidebarView.tsx`) - *Menu lateral com link atual para Desafios.*

## Camada Hono App (Server)

* **`ChallengingRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengingRouter.ts`) - *Composicao de sub-rotas challenging (`challenges` e `solutions`).*
* **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - *Referencia de padrao de rotas com validacao, auth e controllers por recurso.*
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - *Guarda de autenticacao e conta god.*
* **`ValidationMiddleware`** (`apps/server/src/app/hono/middlewares/ValidationMiddleware.ts`) - *Validacao Zod para `query`, `param` e `json`.*

## Camada REST (Server Controllers)

* **`FetchChallengesListController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`) - *Referencia de listagem paginada.*
* **`PostChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/PostChallengeController.ts`) - *Referencia de criacao no dominio challenging.*
* **`DeleteChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/DeleteChallengeController.ts`) - *Referencia de exclusao com `204 No Content`.*
* **`ReorderAchievementsController`** (`apps/server/src/rest/controllers/profile/achievements/ReorderAchievementsController.ts`) - *Referencia de endpoint de reordenacao por lista de IDs.*

## Camada Banco de Dados (Server)

* **`SupabaseChallengesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`) - *Referencia de filtros, paginacao e joins no dominio challenging.*
* **`SupabaseFeedbackReportsRepository`** (`apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`) - *Referencia de filtro por tabela relacionada (`users.name`) e retorno paginado.*
* **`SupabaseFeedbackReport`** (`apps/server/src/database/supabase/types/SupabaseFeedbackReport.ts`) - *Referencia de type com join tipado para mapper.*

## Pacote Core

* **`ChallengeSource`** (`packages/core/src/challenging/domain/entities/ChallengeSource.ts`) - *Entidade existente de source, ainda sem contrato alinhado ao PRD atual.*
* **`ChallengeSourceDto`** (`packages/core/src/challenging/domain/entities/dtos/ChallengeSourceDto.ts`) - *DTO existente de source, com shape divergente da necessidade da feature.*
* **`ChallengingService`** (`packages/core/src/challenging/interfaces/ChallengingService.ts`) - *Contrato consumido por Web/Studio; ainda sem metodos de source.*
* **`ListChallengesUseCase`** (`packages/core/src/challenging/use-cases/ListChallengesUseCase.ts`) - *Referencia de listagem paginada no core.*
* **`PostChallengeUseCase`** (`packages/core/src/challenging/use-cases/PostChallengeUseCase.ts`) - *Referencia de criacao com validacoes de dominio e erro de conflito.*
* **`DeleteChallengeUseCase`** (`packages/core/src/challenging/use-cases/DeleteChallengeUseCase.ts`) - *Referencia de exclusao com erro de not found.*
* **`ReorderGuidesUseCase`** (`packages/core/src/manual/use-cases/ReorderGuidesUseCase.ts`) - *Referencia de regra de reordenacao por `OrdinalNumber` e `replaceMany`.*

## Pacote Validation

* **`challengeSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSchema.ts`) - *Schema completo de challenge; nao cobre criacao de source.*
* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - *Schema base para UUID.*
* **`pageSchema`** (`packages/validation/src/modules/global/schemas/pageSchema.ts`) - *Schema base para pagina.*
* **`itemsPerPageSchema`** (`packages/validation/src/modules/global/schemas/itemsPerPageSchema.ts`) - *Schema base para limite por pagina.*

---

# 5. O que deve ser criado?

## Pacote Core (Domain, Interfaces e Use Cases)

* **Localizacao:** `packages/core/src/challenging/interfaces/ChallengeSourcesRepository.ts` (**novo arquivo**)
* **Dependencias:** `Id`, `ManyItems`, `ChallengeSource`, `ChallengeSourcesListParams`
* **Metodos:**
  - `findById(challengeSourceId: Id): Promise<ChallengeSource | null>`
  - `findByChallengeId(challengeId: Id): Promise<ChallengeSource | null>`
  - `findMany(params: ChallengeSourcesListParams): Promise<ManyItems<ChallengeSource>>`
  - `add(challengeSource: ChallengeSource): Promise<void>`
  - `findAll(): Promise<ChallengeSource[]>`
  - `replaceMany(challengeSources: ChallengeSource[]): Promise<void>`
  - `remove(challengeSourceId: Id): Promise<void>`

* **Localizacao:** `packages/core/src/challenging/domain/types/ChallengeSourcesListParams.ts` (**novo arquivo**)
* **props:**
  - `title: Text`
  - `page: OrdinalNumber`
  - `itemsPerPage: OrdinalNumber`
  - `positionOrder: ListingOrder` (usar `ascending` como padrao da listagem)

* **Localizacao:** `packages/core/src/challenging/use-cases/ListChallengeSourcesUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`
* **Metodos:**
  - `execute(request): Promise<PaginationResponse<ChallengeSourceDto>>` - lista com pagina e filtro por titulo do challenge vinculado.

* **Localizacao:** `packages/core/src/challenging/use-cases/createChallengeSourceUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`, `ChallengesRepository`
* **Metodos:**
  - `execute({ challengeId, url }): Promise<ChallengeSourceDto>` - valida challenge existente, valida unicidade 1:1, define `position` como ultimo + 1 e persiste source.

* **Localizacao:** `packages/core/src/challenging/use-cases/DeleteChallengeSourceUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`
* **Metodos:**
  - `execute({ challengeSourceId }): Promise<void>` - remove source por id com validacao de existencia.

* **Localizacao:** `packages/core/src/challenging/use-cases/ReorderChallengeSourcesUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`
* **Metodos:**
  - `execute({ challengeSourceIds }): Promise<ChallengeSourceDto[]>` - valida lista de IDs sem duplicacao, reatribui `position` com `OrdinalNumber` e persiste via `replaceMany`.

* **Localizacao:** `packages/core/src/challenging/domain/errors/ChallengeSourceAlreadyExistsError.ts` (**novo arquivo**)
* **Metodos:** classe de erro de conflito para vinculo 1:1 ja existente.

* **Localizacao:** `packages/core/src/challenging/domain/errors/ChallengeSourceNotFoundError.ts` (**novo arquivo**)
* **Metodos:** classe de erro de not found para delecao/listagens especificas.

## Camada Hono App (Routes)

* **Localizacao:** `apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts` (**novo arquivo**)
* **Middlewares:** `AuthMiddleware.verifyAuthentication`, `AuthMiddleware.verifyGodAccount`, `ValidationMiddleware.validate`
* **Caminho da rota:**
  - `GET /challenging/challenge-sources`
  - `POST /challenging/challenge-sources`
  - `DELETE /challenging/challenge-sources/:challengeSourceId`
  - `PATCH /challenging/challenge-sources/order`
* **Dados de schema:**
  - Query: `page`, `itemsPerPage`, `title`
  - Body (POST): `challengeSourceSchema`
  - Body (PATCH order): `z.object({ challengeSourceIds: z.array(idSchema) })`
  - Params (DELETE): `challengeSourceId: idSchema`

## Camada REST (Controllers)

* **Localizacao:** `apps/server/src/rest/controllers/challenging/sources/FetchChallengeSourcesListController.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`
* **Dados de request:** `queryParams { page, itemsPerPage, title }`
* **Dados de response:** `PaginationResponse<ChallengeSourceDto>` (via `http.sendPagination`)
* **Metodos:** `handle(http)` - extrai query, executa `ListChallengeSourcesUseCase` e responde paginado.

* **Localizacao:** `apps/server/src/rest/controllers/challenging/sources/createChallengeSourceController.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`, `ChallengesRepository`
* **Dados de request:** `body { challengeId, url }`
* **Dados de response:** `ChallengeSourceDto`
* **Metodos:** `handle(http)` - executa `createChallengeSourceUseCase` e retorna `http.statusCreated().send(dto)`.

* **Localizacao:** `apps/server/src/rest/controllers/challenging/sources/DeleteChallengeSourceController.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`
* **Dados de request:** `routeParams { challengeSourceId }`
* **Dados de response:** `204 No Content`
* **Metodos:** `handle(http)` - executa `DeleteChallengeSourceUseCase` e retorna `http.statusNoContent().send()`.

* **Localizacao:** `apps/server/src/rest/controllers/challenging/sources/index.ts` (**novo arquivo**)
* **Metodos:** barrel exports dos 4 controllers de sources.

* **Localizacao:** `apps/server/src/rest/controllers/challenging/sources/ReorderChallengeSourcesController.ts` (**novo arquivo**)
* **Dependencias:** `ChallengeSourcesRepository`
* **Dados de request:** `body { challengeSourceIds: string[] }`
* **Dados de response:** `ChallengeSourceDto[]`
* **Metodos:** `handle(http)` - executa `ReorderChallengeSourcesUseCase` e retorna lista reordenada.

## Camada Banco de Dados (Repositories)

* **Localizacao:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts` (**novo arquivo**)
* **Dependencias:** `SupabaseClient<Database>`, `SupabaseRepository`, `SupabaseChallengeSourceMapper`
* **Metodos:**
  - `findById(challengeSourceId: Id): Promise<ChallengeSource | null>`
  - `findByChallengeId(challengeId: Id): Promise<ChallengeSource | null>`
  - `findMany(params: ChallengeSourcesListParams): Promise<ManyItems<ChallengeSource>>`
  - `add(challengeSource: ChallengeSource): Promise<void>`
  - `findAll(): Promise<ChallengeSource[]>`
  - `replaceMany(challengeSources: ChallengeSource[]): Promise<void>`
  - `remove(challengeSourceId: Id): Promise<void>`

## Camada Banco de Dados (Mappers)

* **Localizacao:** `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts` (**novo arquivo**)
* **Metodos:**
  - `toEntity(row: SupabaseChallengeSource): ChallengeSource`
  - `toSupabase(entity: ChallengeSource): { id, url, challenge_id, is_used, position }`

## Camada Banco de Dados (Types)

* **Localizacao:** `apps/server/src/database/supabase/types/SupabaseChallengeSource.ts` (**novo arquivo**)
* **props:**
  - Campos persistidos de `challenge_sources` (`id`, `url`, `challenge_id`, `is_used`, `position`, timestamps se existirem)
  - Join de `challenges` com `id`, `title`, `slug` para suporte a listagem.

## Pacote Validation (Schemas)

* **Localizacao:** `packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts` (**novo arquivo**)
* **Atributos:**
  - `url: z.string().url()`
  - `challengeId: idSchema`

## Camada UI (Widgets)

* **Localizacao:** `apps/studio/src/ui/challenging/ChallengeSources/index.tsx` (**novo arquivo**)
* **Props:** Nenhuma
* **Estados (Client Component):**
  - Loading: lista/carregamento inicial e refresh
  - Error: falhas de fetch e mutacoes
  - Empty: sem registros para filtros atuais
  - Content: tabela com pagina, busca e acoes
  - Reordering: estado de submissao da nova ordem apos interacao de mover item
  - ReorderingOptimistic: atualiza ordem local imediatamente, com rollback se a persistencia falhar
* **View:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourcesPageView.tsx` (**novo arquivo**)
* **Hook (se aplicavel):** `apps/studio/src/ui/challenging/ChallengeSources/useChallengeSourcesPage.ts` (**novo arquivo**)
* **Index:** usa `useRestContext`, `useToastProvider`, `useChallengeSourcesPage`
* **Widgets internos:**
  - `ChallengeSourceForm` (dialog de criacao com URL + selecao de challenge)
  - `DeleteChallengeSourceDialog` (confirmacao de exclusao)
* **Regras de renderizacao da tabela:**
  - Coluna `URL de origem`: link para `source.url` com `target='_blank'` e `rel='noreferrer'`.
  - Coluna `URL do desafio`: link construido com `ENV.stardustWebAppUrl` e `source.challenge.slug`, no formato `${ENV.stardustWebAppUrl}/challenging/challenges/${source.challenge.slug}`.
  - Exibir fallback `-` quando `slug` estiver indisponivel.
  - Permitir reordenar linhas por controles de mover para cima/baixo e aplicar persistencia ao confirmar a acao.
  - Aplicar reorder otimista: ao acionar a reordenacao, refletir nova ordem na tabela antes da resposta da API.
  - Em falha de persistencia, restaurar ordem anterior e exibir `toastProvider.showError`.
* **Estrutura de pastas:**

```text
apps/studio/src/ui/challenging/ChallengeSources/
├── index.tsx
├── useChallengeSourcesPage.ts
├── ChallengeSourcesPageView.tsx
├── ChallengeSourceForm/
│   ├── index.tsx
│   ├── useChallengeSourceForm.ts
│   └── ChallengeSourceFormView.tsx
└── DeleteChallengeSourceDialog/
    ├── index.tsx
    └── DeleteChallengeSourceDialogView.tsx
```

## Camada React Router App (Pages, Layouts)

* **Localizacao:** `apps/studio/src/app/routes/ChallengeSourcesRoute.tsx` (**novo arquivo**)
* **Widget principal:** `ChallengeSourcesPage`
* **Caminho da rota:** `ROUTES.challenging.sources` (`/challenging/sources`)

---

# 6. O que deve ser modificado?

## Core

* **Arquivo:** `packages/core/src/challenging/domain/entities/ChallengeSource.ts`
* **Mudanca:** Alinhar entidade ao PRD (id, url, challenge vinculado com `id/title/slug`, `isUsed: Logical`, `position: OrdinalNumber`), corrigir propriedade `challlenge` para `challenge` e expor `dto`.
* **Justificativa:** O shape atual nao representa o contrato necessario para list/create/delete/reorder da feature.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/entities/dtos/ChallengeSourceDto.ts`
* **Mudanca:** Ajustar DTO para contrato da feature (`id`, `url`, `isUsed`, `position`, `challenge { id, title, slug }`) e remover campos nao usados nesta entrega.
* **Justificativa:** Garantir consistencia entre UI, server e dominio.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/entities/index.ts`
* **Mudanca:** Exportar `ChallengeSource` no barrel de entidades do modulo challenging.
* **Justificativa:** Permitir consumo padronizado por use cases e adapters.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengingService.ts`
* **Mudanca:** Adicionar metodos de challenge sources (`fetchChallengeSourcesList`, `createChallengeSource`, `deleteChallengeSource`, `reorderChallengeSources`).
* **Justificativa:** Expansao do contrato compartilhado de REST client para Web/Studio.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/interfaces/index.ts`
* **Mudanca:** Exportar `ChallengeSourcesRepository`.
* **Justificativa:** Manter padrao de barrel file das interfaces.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/types/index.ts`
* **Mudanca:** Exportar `ChallengeSourcesListParams`.
* **Justificativa:** Padronizar uso do tipo em repositorio/use case/servico.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/errors/index.ts`
* **Mudanca:** Exportar erros de source (already exists / not found).
* **Justificativa:** Disponibilizar erros no contrato publico do modulo.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/index.ts`
* **Mudanca:** Exportar novos use cases de challenge sources, incluindo `ReorderChallengeSourcesUseCase`.
* **Justificativa:** Integracao padronizada por barrel.
* **Camada:** `core`

## Hono App (Server)

* **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengingRouter.ts`
* **Mudanca:** Registrar `ChallengeSourcesRouter` na composicao da base `/challenging`.
* **Justificativa:** Expor novo recurso sem acoplar regras ao `ChallengesRouter` existente.
* **Camada:** `rest`

## REST (Server)

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/index.ts`
* **Mudanca:** Exportar `SupabaseChallengeSourcesRepository`.
* **Justificativa:** Permitir importacao consistente da nova implementacao.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/mappers/challenging/index.ts`
* **Mudanca:** Exportar `SupabaseChallengeSourceMapper`.
* **Justificativa:** Manter padrao de barrel dos mappers challenging.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/index.ts`
* **Mudanca:** Exportar `SupabaseChallengeSource`.
* **Justificativa:** Tornar tipo acessivel para mapper/repository.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudanca:** Atualizar tipo gerado para incluir `challenge_sources` (via processo de geracao ja adotado no projeto, sem edicao manual).
* **Justificativa:** Tipagem do Supabase repository depende do schema atualizado.
* **Camada:** `database`

## REST (Services)

* **Arquivo:** `apps/studio/src/rest/services/ChallengingService.ts`
* **Mudanca:** Implementar metodos REST para list/create/delete/reorder de challenge sources.
* **Justificativa:** Disponibilizar contrato para a nova pagina do Studio.
* **Camada:** `rest`

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudanca:** Implementar os mesmos metodos adicionados na interface compartilhada, incluindo reorder.
* **Justificativa:** Evitar quebra de tipagem no monorepo ao expandir `ChallengingService` do core.
* **Camada:** `rest`

## Validation

* **Arquivo:** `packages/validation/src/modules/challenging/schemas/index.ts`
* **Mudanca:** Exportar `challengeSourceSchema`.
* **Justificativa:** Reuso centralizado dos schemas do modulo challenging.
* **Camada:** `core`

## UI (Studio)

* **Arquivo:** `apps/studio/src/constants/routes.ts`
* **Mudanca:** Adicionar `ROUTES.challenging.sources`.
* **Justificativa:** Criar caminho oficial da pagina no modulo challenging.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/app/routes.ts`
* **Mudanca:** Registrar rota `ROUTES.challenging.sources` apontando para `routes/ChallengeSourcesRoute.tsx`.
* **Justificativa:** Tornar a pagina navegavel no app.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/widgets/layouts/App/Sidebar/SidebarView.tsx`
* **Mudanca:** Adicionar item de menu "Fontes" na secao "Desafios de codigo".
* **Justificativa:** Expor a funcionalidade no fluxo de navegacao principal do Studio.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/constants/cache.ts`
* **Mudanca:** Adicionar chave de cache para a tabela de challenge sources.
* **Justificativa:** Padronizar chaves React Query seguindo convencao atual.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/constants/env.ts`
* **Mudanca:** Adicionar `stardustWebAppUrl` no objeto `ENV` com validacao Zod para uso na composicao da URL publica do desafio na tabela de sources.
* **Justificativa:** A URL do desafio deve ser construida na UI usando slug + base URL do Web App.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

**Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisao:** Criar recurso dedicado `challenge-sources` no server com router proprio.
* **Alternativas consideradas:** Adicionar rotas de source dentro de `ChallengesRouter`.
* **Motivo da escolha:** Mantem separacao de responsabilidade por recurso (padrao ja usado em `challenges` e `solutions`).
* **Impactos / trade-offs:** Mais arquivos e pontos de export, em troca de melhor manutenibilidade.

* **Decisao:** Reutilizar `ChallengingService` compartilhado para expor metodos de source.
* **Alternativas consideradas:** Criar um novo `ChallengeSourcesService` separado no Studio.
* **Motivo da escolha:** Preserva organizacao por dominio (`challenging`) e evita proliferacao de servicos pequenos.
* **Impactos / trade-offs:** Exige atualizar implementacao em Studio e Web para manter contrato da interface.

* **Decisao:** Implementar unicidade 1:1 no use case e repository (`findByChallengeId` + erro de conflito).
* **Alternativas consideradas:** Validar apenas no banco (erro generico) ou apenas no frontend.
* **Motivo da escolha:** Regras de negocio ficam centralizadas no core, com erro de dominio legivel para UI.
* **Impactos / trade-offs:** Uma leitura adicional antes de inserir; em contrapartida melhora a previsibilidade do erro de conflito.

* **Decisao:** Buscar challenges para selecao no dialog usando endpoint ja existente de listagem (`fetchChallengesList`) com filtro por titulo.
* **Alternativas consideradas:** Criar endpoint novo somente para seletor.
* **Motivo da escolha:** Reuso de contrato existente e menor custo de backend.
* **Impactos / trade-offs:** Payload de listagem de challenges e maior que o estritamente necessario para o seletor.

* **Decisao:** Tratar erro de criacao dentro do dialog (mensagem inline) e nao fechar o modal em caso de falha.
* **Alternativas consideradas:** Exibir apenas toast global de erro.
* **Motivo da escolha:** Requisito explicito do PRD para feedback no proprio formulario.
* **Impactos / trade-offs:** Estado adicional no hook/form para controlar erro de submit.

* **Decisao:** Persistir ordenacao por endpoint dedicado de reorder (`PATCH /challenging/challenge-sources/order`) acionado ao final da interacao de reordenacao.
* **Alternativas consideradas:** Atualizar `position` item a item por endpoint de update; recalcular ordem apenas no frontend.
* **Motivo da escolha:** Alinha com padroes existentes de reorder (Guides/Achievements) e reduz round-trips.
* **Impactos / trade-offs:** Exige payload com colecao completa de IDs e lock visual temporario durante persistencia da ordem.

* **Decisao:** Usar atualizacao otimista no reorder da tabela de sources, com rollback em erro.
* **Alternativas consideradas:** Recarregar lista apenas apos sucesso da API sem alterar ordem local antes disso.
* **Motivo da escolha:** Melhora responsividade percebida durante a interacao de reordenacao e reduz sensacao de latencia.
* **Impactos / trade-offs:** Maior complexidade de estado no hook (`snapshot` da ordem anterior) para garantir rollback consistente.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
[Studio ChallengeSourcesPage]
        |
        | GET /challenging/challenge-sources?page&itemsPerPage&title
        v
[ChallengingService (studio)]
        v
[ChallengeSourcesRouter]
  -> verifyAuthentication
  -> verifyGodAccount
  -> validate(query)
        v
[FetchChallengeSourcesListController]
        v
[ListChallengeSourcesUseCase]
        v
[SupabaseChallengeSourcesRepository.findMany]
        v
[Supabase/PostgreSQL]

Criacao:
[ChallengeSourceForm Dialog] -- POST { url, challengeId } --> [createChallengeSourceController]
        v
[createChallengeSourceUseCase]
  -> valida challenge existente
  -> valida unicidade 1:1
  -> add
        v
[201 + ChallengeSourceDto]

Exclusao:
[DeleteChallengeSourceDialog] -- DELETE /:challengeSourceId --> [DeleteChallengeSourceController]
        v
[DeleteChallengeSourceUseCase] -> [Repository.remove] -> [204]

Reordenacao:
[ChallengeSourcesPage (mover item)] -- PATCH /order { challengeSourceIds } --> [ReorderChallengeSourcesController]
        v
[ReorderChallengeSourcesUseCase] -> [Repository.findAll + replaceMany(position)] -> [200]
```

* **Layout (Studio):**

```ascii
ChallengeSourcesPage
┌──────────────────────────────────────────────────────────────────┐
│ Titulo: Fontes de desafios                           [Adicionar] │
│ [Buscar por titulo do desafio...]                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ [::] URL de origem | URL do desafio | Desafio vinculado | Em uso | Acoes │ │
│  │ [::] https://...   | https://...    | Titulo truncado   | Sim/Não | [Lixeira] │ │
│  └────────────────────────────────────────────────────────────┘   │
│                         [Paginacao]                              │
└──────────────────────────────────────────────────────────────────┘

Dialog "Adicionar source"
┌──────────────────────────────────────────────┐
│ URL [_______________________________]        │
│ Buscar desafio [_____________________]       │
│ Lista de desafios (com paginacao)           │
│ Erro de conflito (inline, se houver)        │
│                         [Cancelar] [Salvar]  │
└──────────────────────────────────────────────┘
```

* **Referencias:**
  - `apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/useRocketsTable.ts`
  - `apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/RocketsTableView.tsx`
  - `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/useFeedbackReportsPage.ts`
  - `apps/studio/src/ui/manual/widgets/pages/GuidesPage/useGuidesPage.ts`
  - `apps/studio/src/ui/global/widgets/components/SortableList/SortableContainer/SortableContainerView.tsx`
  - `apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarChallengeSelector/useStarChallengeSelector.ts`
  - `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
  - `apps/server/src/app/hono/routers/profile/AchievementsRouter.ts`
  - `apps/server/src/app/hono/routers/manual/GuidesRouter.ts`
  - `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`
  - `apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
  - `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`

---

# 10. Pendências / Dúvidas

* **Resolvido:** A tipagem de `challenge_sources` foi adicionada em `apps/server/src/database/supabase/types/Database.ts` e o repository foi implementado sobre este contrato.
* **Resolvido:** O tamanho padrao de pagina foi definido em `limit=10`, alinhado ao padrao do Studio.
* **Observacao:** A interacao de reordenacao foi implementada com controles de mover para cima/baixo (sem drag and drop), mantendo endpoint dedicado e comportamento otimista com rollback.

---

# 11. Validacao Final

* `npm run codecheck` executado na raiz do monorepo, sem erros.
* `npm run test` executado na raiz do monorepo, com suites passando em todos os pacotes.

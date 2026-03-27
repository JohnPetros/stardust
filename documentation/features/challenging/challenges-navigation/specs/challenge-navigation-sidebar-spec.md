---
title: Sidebar de Navegacao de Desafios
prd: https://github.com/JohnPetros/stardust/milestone/16
issue: https://github.com/JohnPetros/stardust/issues/374
apps: server, web
status: open
last_updated_at: 2026-03-25
---

# 1. Objetivo

Implementar a sidebar lateral de navegacao de desafios na pagina de execucao de desafios livres da `web`, abrindo por overlay a partir do controle `Desafios` ja existente no header, com listagem paginada de 20 itens, busca, filtros, destaque do desafio ativo e contador `X/Y Resolvidos` para usuarios autenticados. Tecnicamente, a entrega reaproveita a listagem existente de desafios no `server` via `FetchChallengesListController`, adiciona um controller complementar para os totais de progresso da sidebar e cria o widget client-side correspondente na `web`, sem alterar a rota atual da pagina de desafio nem o fluxo ja entregue de `Anterior` e `Proximo`.

---

# 2. Escopo

## 2.1 In-scope

- Abrir a sidebar por overlay a partir do segmento clicavel `Desafios` no widget `ChallengeNavigation`.
- Fechar a sidebar por overlay, botao de fechar e tecla `Esc`.
- Buscar os dados da sidebar on-demand no client quando `isOpen = true`.
- Exibir 20 desafios por pagina com indicador `Exibindo X - Y` e navegacao `Pagina anterior` / `Pagina seguinte`.
- Destacar visualmente o desafio atualmente aberto na lista.
- Exibir status de completude por item apenas para usuarios autenticados.
- Exibir o contador `X/Y Resolvidos` no cabecalho da sidebar apenas para usuarios autenticados.
- Permitir busca por titulo com comparacao case-insensitive e reset da pagina para `1` ao alterar o termo.
- Permitir filtros por status de completude, dificuldade e categorias do desafio.
- Exibir badge com a quantidade de filtros ativos no botao de filtro.
- Reaproveitar a listagem existente de desafios no `server` para os itens da sidebar.
- Adicionar endpoint complementar no `server` para retornar os metadados de progresso da sidebar (`completedChallengesCount` e `totalChallengesCount`).

## 2.2 Out-of-scope

- Navegacao aleatoria de desafios.
- Redesenho dos controles `Anterior` e `Proximo` ja implementados.
- Alteracoes na pagina publica `apps/web/src/app/challenging/challenges/page.tsx`.
- Criacao de um novo modelo de dominio `Tag`; nesta iteracao a taxonomia continua baseada em `ChallengeCategory`.
- Suporte da sidebar para desafios vinculados a estrela (`star_id != null`).
- SSR da listagem da sidebar no payload inicial da pagina de desafio.

---

# 3. Requisitos

## 3.1 Funcionais

- O usuario deve conseguir abrir a sidebar sem sair da pagina atual de desafio.
- A sidebar deve listar desafios livres disponiveis em paginas de 20 itens.
- Cada item deve exibir nome do desafio, nivel de dificuldade e, quando houver usuario autenticado, o icone de completude.
- O desafio atualmente aberto deve ficar destacado na lista.
- O cabecalho da sidebar deve exibir `X/Y Resolvidos` apenas para usuarios autenticados.
- A busca por titulo deve filtrar os desafios de forma case-insensitive e reiniciar a paginacao para a primeira pagina.
- O popover de filtros deve permitir aplicar e limpar filtros em lote.
- O filtro de status deve ficar visivel apenas para usuarios autenticados.
- O filtro de dificuldade deve aceitar uma unica selecao por vez, refletindo o contrato atual reutilizado de `fetchChallengesList(...)`.
- O filtro por categorias deve aceitar multiplas selecoes sobre `ChallengeCategory`.
- Ao aplicar ou limpar filtros, a paginacao deve voltar para a primeira pagina.
- Quando nao houver resultados, a sidebar deve exibir uma mensagem amigavel de lista vazia.
- Ao clicar em um desafio da lista, o sistema deve navegar imediatamente para esse desafio.

## 3.2 Não funcionais

- Compatibilidade retroativa
  - A rota `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx` nao deve mudar.
  - Os botoes `Anterior` e `Proximo` devem manter o comportamento atual.
- Acessibilidade
  - A sidebar deve fechar com `Esc` e clique no overlay.
  - O trigger da sidebar, o botao de filtro e os itens da lista devem ter `aria-label` explicitos.
- Consistencia de dados
  - A ordenacao padrao da lista da sidebar deve seguir a mesma sequencia global por `created_at` usada pela navegacao adjacente.
  - O contador `X/Y Resolvidos` deve ser calculado no mesmo universo de desafios exposto pela sidebar.
- Seguranca
  - O endpoint da sidebar deve expor apenas desafios com `star_id = null` e nao deve expor desafios privados de terceiros.
  - O filtro de completude deve ser ignorado no `server` quando nao houver usuario autenticado.
- Performance
  - O fetch inicial da sidebar deve acontecer apenas quando `isOpen = true`.
  - Os endpoints da sidebar devem devolver dados suficientes para renderizacao imediata da lista e do contador de progresso.

---

# 4. O que já existe?

## Next.js App

* **`Page`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`) - hidrata a pagina de desafio com `challengeDto`, voto do usuario e slugs adjacentes.
* **`ChallengeLayout`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/layout.tsx`) - monta o shell da pagina de desafio.

## Camada UI

* **`ChallengeNavigation`** (`apps/web/src/ui/challenging/widgets/components/ChallengeNavigation/index.tsx`) - widget atual do header com segmento visual `Desafios` e botoes `Anterior` / `Proximo`.
* **`ChallengeNavigationView`** (`apps/web/src/ui/challenging/widgets/components/ChallengeNavigation/ChallengeNavigationView.tsx`) - referencia visual direta do controle que abrira a sidebar.
* **`useChallengePage`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`) - ponto atual de composicao do header e navegacao do desafio.
* **`ChallengesFilters`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/index.tsx`) - referencia de busca e filtros por status, dificuldade e categorias.
* **`ChallengesList`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/useChallengesList.ts`) - referencia de integracao client-side com listagem paginada de desafios.
* **`ChallengeCard`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/index.tsx`) - referencia de como o estado de completude por item e calculado a partir de `user.hasCompletedChallenge(...)`.
* **`Dialog`** (`apps/web/src/ui/global/widgets/components/Dialog/index.tsx`) - base Radix ja existente para overlay, fechamento por `Esc` e portal.
* **`Search`** (`apps/web/src/ui/global/widgets/components/Search/index.tsx`) - componente reutilizavel para busca textual.

## Camada REST

* **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - adapter REST atual do dominio `challenging`, ja consumindo `fetchChallengeNavigation`, `fetchChallengesList`, `fetchAllChallengeCategories` e `fetchCompletedChallengesByDifficultyLevel`.
* **`RestContext`** (`apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - composition root client-side que injeta `challengingService` com header de autenticacao.

## Camada Hono App

* **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - router atual do modulo, com rotas de desafio por slug, listagem, categorias, progresso por dificuldade e navegacao adjacente.

## Camada REST (Controllers)

* **`FetchChallengesListController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`) - controller base a ser reaproveitado para a listagem paginada da sidebar, incluindo filtros e `userCompletedChallengesIds`.
* **`FetchCompletedChallengesCountByDifficultyLevelController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchCompletedChallengesCountByDifficultyLevelController.ts`) - referencia de calculo de progresso para usuarios autenticados.
* **`AppendUserCompletedChallengesIdsToBodyController`** (`apps/server/src/rest/controllers/profile/users/AppendUserCompletedChallengesIdsToBodyController.ts`) - middleware/controller que injeta `userCompletedChallengesIds` no body antes do controller de `challenging`.

## Camada Banco de Dados

* **`SupabaseChallengesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`) - implementacao concreta de `ChallengesRepository`, ja lendo `challenges_view`, categorias, votos e navegacao adjacente.

## Pacote Core

* **`ChallengesRepository`** (`packages/core/src/challenging/interfaces/ChallengesRepository.ts`) - contrato central de persistencia para desafios.
* **`ChallengingService`** (`packages/core/src/challenging/interfaces/ChallengingService.ts`) - contrato compartilhado consumido pela `web`.
* **`ListChallengesUseCase`** (`packages/core/src/challenging/use-cases/ListChallengesUseCase.ts`) - referencia de filtragem e paginacao do modulo.
* **`ChallengeDto`** (`packages/core/src/challenging/domain/entities/dtos/ChallengeDto.ts`) - DTO atual dos itens de desafio.
* **`ChallengeNavigationDto`** (`packages/core/src/challenging/domain/structures/dtos/ChallengeNavigationDto.ts`) - referencia do contrato de navegacao adjacente ja entregue.

## Pacote Validation

* **`challengeCompletionStatusSchema`** (`packages/validation/src/modules/challenging/schemas/challengeCompletionStatusSchema.ts`) - schema atual do filtro de completude, usado como referencia para padronizacao em `all`.
* **`challengeDifficultyLevelSchema`** (`packages/validation/src/modules/challenging/schemas/challengeDifficultyLevelSchema.ts`) - schema atual do nivel de dificuldade.
* **`idsListSchema`** (`packages/validation/src/modules/global/schemas/idsListSchema.ts`) - schema atual para arrays de IDs em query string.

---

# 5. O que deve ser criado?

## Pacote Core (Types)

* **Localização:** `packages/core/src/challenging/domain/types/ChallengesNavigationSidebarParams.ts` (**novo arquivo**)
* **props:**
  - `page: OrdinalNumber`
  - `itemsPerPage: OrdinalNumber`
  - `title: Text`
  - `difficultyLevels: ChallengeDifficultyLevel[]`
  - `categoriesIds: IdsList`
  - `completionStatus: 'all' | ChallengeCompletionStatusValue`

## Pacote Core (Types)

* **Localização:** `packages/core/src/challenging/domain/types/ChallengesNavigationSidebarProgressDto.ts` (**novo arquivo**)
* **props:**
  - `completedChallengesCount: number | null`
  - `totalChallengesCount: number`

## Pacote Core (Use Cases)

* **Localização:** `packages/core/src/challenging/use-cases/GetChallengesNavigationSidebarProgressUseCase.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Métodos:**
  - `execute({ userCompletedChallengesIds }: { userCompletedChallengesIds: string[] }): Promise<ChallengesNavigationSidebarProgressDto>` - calcula os totais `completedChallengesCount` e `totalChallengesCount` considerando apenas desafios sem `star_id` visiveis na sidebar.

## Pacote Validation (Schemas)

* **Localização:** `packages/validation/src/modules/challenging/schemas/challengeDifficultyLevelsSchema.ts` (**novo arquivo**)
* **Atributos:**
  - `difficultyLevels` - array de `easy | medium | hard`, default `[]`.

* **Localização:** `packages/validation/src/modules/challenging/schemas/challengesNavigationSidebarQuerySchema.ts` (**novo arquivo**)
* **Atributos:**
  - `page`
  - `itemsPerPage`
  - `title`
  - `difficultyLevels`
  - `categoriesIds`
  - `completionStatus` (`all | completed | not-completed`)

## Camada REST (Controllers)

* **Localização:** `apps/server/src/rest/controllers/challenging/challenges/FetchChallengesCompletionProgressController.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Dados de request:**
  - `userCompletedChallengesIds` (body estendido pelo middleware de profile)
* **Dados de response:**
  - `completedChallengesCount`
  - `totalChallengesCount`
* **Métodos:**
  - `handle(http: Http<Schema>)` - consome `userCompletedChallengesIds`, chama `GetChallengesNavigationSidebarProgressUseCase` e responde com `http.send(...)`.

## Camada UI (Widgets)

* **Localização:** `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/index.tsx` (**novo arquivo**)
* **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `currentChallengeSlug: string`
  - `onChallengeSelect: (challengeSlug: string) => void`
* **Estados (Client Component):**
  - `Loading`: exibe indicador de carregamento para a lista e desabilita controles de paginacao/filtro dependentes do payload.
  - `Error`: exibe mensagem de falha e CTA para nova tentativa.
  - `Empty`: exibe mensagem amigavel quando nenhum desafio satisfaz busca/filtros.
  - `Content`: renderiza cabecalho com progresso, campo de busca, botao de filtro com badge, lista paginada e destaque do desafio ativo.
* **View:** `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/ChallengesNavigationSidebarView.tsx` (**novo arquivo**)
* **Hook (se aplicável):** `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/useChallengesNavigationSidebar.ts` (**novo arquivo**)
* **Index:** resolve `challengingService` via `useRestContext`, `user` e `isAccountAuthenticated` via `useAuthContext`, chama a listagem via `fetchChallengesList(...)` e os totais via `fetchChallengesNavigationSidebarProgress(...)`, e injeta essas dependencias no hook.
* **Widgets internos:**
  - `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/SidebarFiltersPopover/index.tsx` (**novo arquivo**)
  - `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/SidebarFiltersPopover/SidebarFiltersPopoverView.tsx` (**novo arquivo**)
  - `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/SidebarChallengeItem/index.tsx` (**novo arquivo**)
  - `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/SidebarChallengeItem/SidebarChallengeItemView.tsx` (**novo arquivo**)
* **Estrutura de pastas:**

```text
apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/
  index.tsx
  useChallengesNavigationSidebar.ts
  ChallengesNavigationSidebarView.tsx
  SidebarFiltersPopover/
    index.tsx
    SidebarFiltersPopoverView.tsx
  SidebarChallengeItem/
    index.tsx
    SidebarChallengeItemView.tsx
```

* **Métodos do hook:**
  - `handleSearchChange(value: string): void` - atualiza o termo de busca e reseta a pagina para `1`.
  - `handleApplyFilters(filters: { completionStatus: 'all' | 'completed' | 'not-completed'; difficultyLevels: string[]; categoriesIds: string[] }): void` - confirma os filtros do popover, recalcula o badge e reseta a pagina.
  - `handleClearFilters(): void` - limpa todos os filtros aplicados e reseta a pagina.
  - `handlePreviousPageClick(): void` - avanca para a pagina anterior quando `page > 1`.
  - `handleNextPageClick(): void` - avanca para a proxima pagina quando `page < totalPagesCount`.
  - `handleChallengeClick(challengeSlug: string): void` - fecha a sidebar e delega a troca de rota para `onChallengeSelect`.
  - `refetch(): Promise<void>` - refaz a ultima consulta quando a view estiver em estado de erro.
* **Query params enviados para `fetchChallengesList(...)`:**
  - `page`: pagina atual da sidebar, iniciando em `1`.
  - `itemsPerPage`: valor fixo `20`.
  - `title`: termo de busca atual; string vazia quando nao houver busca.
  - `categoriesIds`: categorias selecionadas no filtro; array vazio quando nao houver selecao.
  - `difficulty`: enviar `all` quando nenhuma dificuldade estiver selecionada; quando houver multisselecao, enviar uma chamada por combinacao consolidada no backend nao e suportado pelo contrato atual, entao a spec passa a restringir a sidebar a selecao de uma unica dificuldade por vez no request de listagem.
  - `completionStatus`: `all | completed | not-completed`.
  - `upvotesCountOrder`: `any`.
  - `downvoteCountOrder`: `any`.
  - `completionCountOrder`: `any`.
  - `postingOrder`: `ascending`, para preservar a mesma ordem global usada pela navegacao adjacente.
  - `shouldIncludeOnlyAuthorChallenges`: `false`.
  - `shouldIncludePrivateChallenges`: `false`.
  - `shouldIncludeStarChallenges`: `false`.
  - `userId`: nao enviar, exceto se o contrato atual do service exigir `undefined` explicitamente.

---

# 6. O que deve ser modificado?

## Camada UI

* **Arquivo:** `apps/web/src/ui/challenging/widgets/components/ChallengeNavigation/index.tsx`
* **Mudança:** Passar a compor o trigger clicavel da sidebar junto dos botoes `Anterior` / `Proximo`, recebendo `onOpenSidebar` e `sidebarSlot`.
* **Justificativa:** O ponto visual `Desafios` ja existe no header e deve virar o gatilho oficial da sidebar, sem criar outro controle concorrente.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/components/ChallengeNavigation/ChallengeNavigationView.tsx`
* **Mudança:** Tornar o segmento esquerdo (`menu + Desafios`) um botao acessivel, mantendo os tooltips e estados atuais da navegacao sequencial.
* **Justificativa:** A abertura da sidebar deve acontecer a partir do controle ja entregue no header.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
* **Mudança:** Gerenciar `isSidebarOpen`, compor `ChallengesNavigationSidebar` e encaminhar `onChallengeSelect` para `goTo(...)` imediato.
* **Justificativa:** Como o codigo ja e salvo automaticamente, a troca de desafio nao precisa de camada extra de confirmacao; o hook da pagina continua sendo o ponto de composicao do header e da navegacao.
* **Camada:** `ui`

## Camada REST (Services)

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudança:** Reaproveitar `fetchChallengesList(...)` para a listagem da sidebar e adicionar `fetchChallengesNavigationSidebarProgress(): Promise<RestResponse<ChallengesNavigationSidebarProgressDto>>` consumindo `GET /challenging/challenges/sidebar/progress`.
* **Justificativa:** A listagem ja existe e deve ser reutilizada; apenas os totais de progresso exigem um contrato complementar para a sidebar.
* **Camada:** `rest`

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
* **Mudança:** Reaproveitar `GET /challenging/challenges/list` como fonte da listagem da sidebar e registrar `GET /challenging/challenges/sidebar/progress`, reaproveitando `ProfileMiddleware.appendUserCompletedChallengesIdsToBody`.
* **Justificativa:** A listagem paginada ja existe; o endpoint novo fica restrito aos totais complementares da sidebar.
* **Camada:** `rest`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/index.ts`
* **Mudança:** Exportar `FetchChallengesCompletionProgressController`.
* **Justificativa:** Manter o barrel file alinhado ao padrao do modulo `challenging`.
* **Camada:** `rest`

## Camada Banco de Dados (Repositories)

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
* **Mudança:** Ajustar `findMany(...)` para garantir o recorte da sidebar sobre desafios sem `star_id`, sem quebrar os consumidores existentes, e adicionar suporte ao calculo de `totalChallengesCount` para o novo controller de progresso.
* **Justificativa:** A listagem da sidebar deve reutilizar o pipeline atual de `FetchChallengesListController`; o repository precisa apenas expor o universo correto para listagem e totais.
* **Camada:** `database`

## Pacote Core

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengesRepository.ts`
* **Mudança:** Reaproveitar `findMany(...)` para a listagem da sidebar e adicionar um metodo especifico para calcular o universo total de desafios elegiveis ao contador de progresso.
* **Justificativa:** A listagem deve usar o mesmo pipeline do controller existente; apenas o contador exige uma consulta complementar dedicada.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengingService.ts`
* **Mudança:** Reaproveitar `fetchChallengesList(params: ChallengesListParams)` para a lista da sidebar e adicionar `fetchChallengesNavigationSidebarProgress(): Promise<RestResponse<ChallengesNavigationSidebarProgressDto>>`.
* **Justificativa:** Mantem a listagem acoplada ao contrato ja existente e introduz apenas o contrato complementar necessario para os totais.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/types/index.ts`
* **Mudança:** Exportar `ChallengesNavigationSidebarParams` e `ChallengesNavigationSidebarProgressDto`.
* **Justificativa:** Tornar os contratos compartilhados disponiveis para `web`, `server` e pacotes consumidores.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/index.ts`
* **Mudança:** Exportar `GetChallengesNavigationSidebarProgressUseCase`.
* **Justificativa:** Manter o barrel file consistente com o padrao atual do modulo.
* **Camada:** `core`

## Pacote Validation (Schemas)

* **Arquivo:** `packages/validation/src/modules/challenging/schemas/index.ts`
* **Mudança:** Exportar `challengeDifficultyLevelsSchema` e `challengesNavigationSidebarQuerySchema`.
* **Justificativa:** Centralizar o contrato de validacao compartilhada em vez de manter schema inline no router.
* **Camada:** `rest`

## Pacote Core

* **Arquivo:** `packages/core/src/challenging/domain/structures/ChallengeCompletionStatus.ts`
* **Mudança:** Padronizar a structure para aceitar `all` como valor neutro, alinhando-a ao schema compartilhado e ao novo endpoint da sidebar.
* **Justificativa:** O projeto passa a ter uma unica convencao para status de completude, evitando normalizacao extra no controller.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/types/ChallengeCompletionStatusValue.ts`
* **Mudança:** Incluir `all` no tipo compartilhado e remover a divergencia com a structure.
* **Justificativa:** O tipo precisa refletir o contrato efetivamente aceito pelo core e pela validacao.
* **Camada:** `core`

## Pacote Validation (Schemas)

* **Arquivo:** `packages/validation/src/modules/challenging/schemas/challengeCompletionStatusSchema.ts`
* **Mudança:** Manter `all` como valor neutro oficial do filtro de completude.
* **Justificativa:** A milestone definiu a padronizacao do contrato em `all`.
* **Camada:** `rest`

---

# 7. O que deve ser removido?

Não aplicável.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Usar apenas a milestone `#16` como fonte de verdade desta spec.
* **Alternativas consideradas:** Seguir `documentation/features/challenging/challenges-navigation/prd.md` ou combinar milestone + PRD local.
* **Motivo da escolha:** O usuario confirmou explicitamente que a milestone deve prevalecer sobre a documentacao local divergente.
* **Impactos / trade-offs:** A spec fica objetiva, mas o PRD local continua precisando ser atualizado para nao induzir leituras erradas futuras.

* **Decisão:** Reaproveitar `FetchChallengesListController` para a listagem da sidebar e criar apenas um endpoint complementar para os totais de progresso.
* **Alternativas consideradas:** Criar um endpoint totalmente dedicado para lista + progresso em payload unico.
* **Motivo da escolha:** A listagem paginada com filtros ja existe e cobre a maior parte do comportamento necessario; apenas `completedChallengesCount` e `totalChallengesCount` exigem um contrato extra.
* **Impactos / trade-offs:** Reduz duplicacao no `server`, mas a `web` passa a depender de duas chamadas para montar completamente a sidebar.

* **Decisão:** Fazer a sidebar sob demanda no client, reutilizando `useRestContext`, sem SSR adicional na `ChallengePage`.
* **Alternativas consideradas:** Hidratar a primeira pagina da sidebar no `page.tsx` ou em `challengingActions`.
* **Motivo da escolha:** A feature e overlay/on-demand, e a `web` ja tem um composition root client-side para services autenticados.
* **Impactos / trade-offs:** A primeira abertura depende de uma requisicao client-side, mas evita inflar o payload SSR da pagina de desafio.

* **Decisão:** Limitar a sidebar aos desafios nao vinculados a estrela nesta iteracao.
* **Alternativas consideradas:** Incluir tambem desafios vinculados a estrela.
* **Motivo da escolha:** Foi definido que apenas desafios sem `star_id` devem ficar visiveis na sidebar.
* **Impactos / trade-offs:** A feature fica consistente com a navegacao adjacente atual, mas nao cobre desafios da trilha espacial.

* **Decisão:** Usar `Categorias` como nomenclatura funcional e tecnica da sidebar.
* **Alternativas consideradas:** Criar um novo conceito de `Tag` ou usar `tags` apenas na copy.
* **Motivo da escolha:** O usuario definiu explicitamente o uso de `Categorias`, que ja e o modelo existente na codebase.
* **Impactos / trade-offs:** Elimina ambiguidade de naming nesta entrega, mas qualquer evolucao futura para `tags` exigira novo contrato de dominio.

* **Decisão:** Aplicar `AND` entre grupos de filtro, manter selecao unica para dificuldade e `AND` dentro de `categoriesIds`.
* **Alternativas consideradas:** Multisselecao de dificuldade com `OR`, `OR` entre todos os filtros ou `OR` tambem entre categorias selecionadas.
* **Motivo da escolha:** A listagem da sidebar reaproveita `FetchChallengesListController`, cujo contrato atual aceita apenas um valor em `difficulty`; restringir a UI a selecao unica evita adaptacoes extras no backend de listagem.
* **Impactos / trade-offs:** Ha menor flexibilidade no filtro de dificuldade, mas o reaproveitamento do contrato existente fica direto e sem ambiguidade.

* **Decisão:** Navegar imediatamente ao clicar em um item da sidebar, sem guard adicional.
* **Alternativas consideradas:** Reaproveitar `useChallengeNavigationGuard` e `ChallengeNavigationAlertDialog` tambem para a sidebar.
* **Motivo da escolha:** Foi confirmado que o codigo e salvo automaticamente, entao nao ha risco funcional que justifique uma camada extra de confirmacao nessa navegacao.
* **Impactos / trade-offs:** O fluxo fica mais simples e rapido, mas a sidebar deixa de reutilizar os artefatos de confirmacao existentes.

* **Decisão:** Padronizar o status de completude neutro em `all` em todo o stack.
* **Alternativas consideradas:** Manter `any` no core e normalizar no controller.
* **Motivo da escolha:** O usuario definiu explicitamente que o contrato deve ser uniformizado em `all`.
* **Impactos / trade-offs:** Exige ajuste coordenado em type, structure e validacao, mas elimina drift contratual entre core e borda HTTP.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
Usuario clica em [Desafios]
  |
  v
ChallengeNavigation -> ChallengesNavigationSidebar
  |
  v
useChallengesNavigationSidebar
  |-- ChallengingService.fetchChallengesList(...)
  |      |
  |      v
  |   GET /challenging/challenges/list
  |      |
  |      v
  |   FetchChallengesListController
  |      |
  |      v
  |   ListChallengesUseCase -> ChallengesRepository.findMany(...) -> challenges_view
  |
  `-- ChallengingService.fetchChallengesNavigationSidebarProgress()
         |
         v
      GET /challenging/challenges/sidebar/progress
         |
         v
      FetchChallengesCompletionProgressController
         |
         v
      GetChallengesNavigationSidebarProgressUseCase
         |
         v
      ChallengesRepository -> SupabaseChallengesRepository -> challenges_view

Usuario clica em um item da sidebar
  |
  v
ChallengesNavigationSidebar.handleChallengeClick(slug)
  |
  v
fecha sidebar -> goTo(route)
```

* **Fluxo Cross-app (se aplicável):**

```ascii
apps/web
  -> HTTP REST
apps/server
  -> use case do packages/core
  -> repository Supabase
  -> PostgreSQL / challenges_view
```

* **Layout (se aplicável):**

```ascii
+--------------------------------------------------------------------+
| [Voltar] [Titulo do desafio] [Desafios v] [<] [>]                  |
+--------------------------------------------------------------------+
| Challenge layout atual                                             |
|                                                                    |
|  +---------------- Sidebar overlay ------------------------------+  |
|  | X/Y Resolvidos        [Buscar...]      [Filtros][badge]      |  |
|  |----------------------------------------------------------------|  |
|  | > Desafio atual                         Medio    [check]       |  |
|  |   Outro desafio                         Facil    [ ]           |  |
|  |   ...                                                    ...  |  |
|  |----------------------------------------------------------------|  |
|  | Exibindo 21 - 40        [Pagina anterior] [Pagina seguinte]   |  |
|  +---------------------------------------------------------------+  |
```

* **Referências:**
  - `apps/web/src/ui/challenging/widgets/components/ChallengeNavigation/ChallengeNavigationView.tsx`
  - `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/ChallengesFiltersView.tsx`
  - `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/useChallengesList.ts`
  - `apps/web/src/ui/global/widgets/components/Dialog/index.tsx`
  - `apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`

---

# 10. Pendências / Dúvidas

Sem pendências.

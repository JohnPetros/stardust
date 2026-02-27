---
title: Expiracao da Flag isNew e Badge Novo em Challenges
prd: documentation/features/challenging/challenge-creator-agent/prd.md
apps: server, web
status: concluido
last_updated_at: 2026-02-27
---

# 1. Objetivo (Obrigatorio)

Implementar o ciclo completo da flag `isNew` no dominio de desafios: expirar automaticamente para `false` em desafios com mais de 1 semana via job diario agendado, refletir esse estado na listagem de desafios da Web com badge visual "Novo" e adicionar filtro de listagem por novidade (`isNew`). A entrega cobre ponta a ponta entre banco, repositorio, core, fila Inngest e UI da pagina `/challenging/challenges`, mantendo os padroes arquiteturais atuais (Queue agnostica + adapters em server + Widget Pattern no web), sem criacao de migrations (banco ja atualizado).

---

# 2. Escopo (Obrigatorio)

## 2.1 In-scope

- Expirar `isNew` (`true` -> `false`) em desafios com mais de 1 semana.
- Registrar function Inngest diaria para expiracao no dominio `challenging`.
- Propagar `isNew` no fluxo de leitura/escrita: DB types -> mapper -> entidade/core DTO -> REST listagem.
- Exibir badge "Novo" no card da listagem quando `challenge.isNew === true`.
- Adicionar filtro de listagem por novidade (todos/novos/antigos) na pagina de desafios.

## 2.2 Out-of-scope

- Criacao ou execucao de migrations SQL nesta entrega.
- Alterar logica de geracao automatica por IA (workflow de criacao do desafio).
- Envio de notificacao ativa para usuario final (push/email/central).
- Mudanca no design geral da pagina de desafios alem do badge e do novo filtro.

---

# 3. Requisitos (Obrigatorio)

## 3.1 Funcionais

- O sistema deve executar diariamente um job de expiracao da novidade.
- O job deve identificar desafios com `createdAt` superior a 1 semana e atualizar `isNew` para `false`.
- A listagem de desafios deve retornar o estado `isNew` por item.
- Cards de desafios com `isNew: true` devem exibir badge "Novo" em destaque visual.
- A listagem deve aceitar filtro de novidade com 3 estados: `all`, `new`, `old`.

## 3.2 Nao funcionais

- Performance: a expiracao deve ser feita em update em lote no banco (sem loop N+1 por desafio).
- Resiliencia: job de expiracao deve executar com `amqp.run(...)` para rastreabilidade no Inngest.
- Observabilidade: falhas da function devem seguir o fluxo padrao de `onFailure` + `handleFailure` em `InngestFunctions`.
- Compatibilidade retroativa: manter contrato da listagem e combinar o novo filtro com filtros existentes sem quebrar query params atuais.
- Consistencia temporal: calculo de expiracao alinhado ao timezone do cron (`America/Sao_Paulo`).

---

# 4. O que ja existe? (Obrigatorio)

## Camada Inngest App (Functions)

* **`CreateChallengeJob`** (`apps/server/src/queue/jobs/challenging/CreateChallengeJob.ts`) - Job diario existente no dominio `challenging`.
* **`ChallengingFunctions`** (`apps/server/src/queue/inngest/functions/ChallengingFunctions.ts`) - Composition root atual do Inngest para o dominio.

## Camada Banco de Dados (Repositories)

* **`SupabaseChallengesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`) - Repositorio principal de desafios (leitura em `challenges_view`, escrita em `challenges`).

## Camada Banco de Dados (Mappers)

* **`SupabaseChallengeMapper`** (`apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts`) - Mapeia shape Supabase para `ChallengeDto`/`Challenge`.

## Camada Banco de Dados (Types)

* **`SupabaseChallenge`** (`apps/server/src/database/supabase/types/SupabaseChallenge.ts`) - Tipo de linha da `challenges_view`.
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - Tipos gerados de tabelas/views do Supabase.

## Camada Core

* **`ChallengesRepository`** (`packages/core/src/challenging/interfaces/ChallengesRepository.ts`) - Contrato de persistencia de desafios.
* **`Challenge`** (`packages/core/src/challenging/domain/entities/Challenge.ts`) - Entidade central usada na listagem e no post.
* **`ChallengeFactory`** (`packages/core/src/challenging/domain/factories/ChallengeFactory.ts`) - Ja produz `isNew` no build de props.
* **`ChallengeDto`** (`packages/core/src/challenging/domain/entities/dtos/ChallengeDto.ts`) - DTO ja possui `isNew?: boolean`.
* **`ListChallengesUseCase`** (`packages/core/src/challenging/use-cases/ListChallengesUseCase.ts`) - Caso de uso da listagem.

## Camada REST (Controllers)

* **`FetchChallengesListController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`) - Entrada da listagem de desafios.

## Camada Hono App (Routes)

* **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - Validacao/registro da rota `GET /challenging/challenges/list`.

## Camada UI (Widgets)

* **`ChallengesFilters`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/index.tsx`) - Entry point do widget de filtros da pagina.
* **`useChallengesFilters`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/useChallengesFilters.ts`) - Logica de estado/query params dos filtros.
* **`ChallengesFiltersView`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/ChallengesFiltersView.tsx`) - Renderizacao dos selects/tags de filtros.
* **`ChallengesListView`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengesListView.tsx`) - Renderiza lista de cards.
* **`ChallengeCard`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/index.tsx`) - Entry point do card.
* **`ChallengeCardView`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/ChallengeCardView.tsx`) - Renderizacao do card.

## Camada REST (Services)

* **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - Cliente REST que envia query params da listagem.

## Camada Next.js App (Pages, Layouts)

* **`/challenging/challenges`** (`apps/web/src/app/challenging/challenges/page.tsx`) - Pagina que compoe o widget principal `ChallengesPage`.

---

# 5. O que deve ser criado? (Depende da tarefa)

## Camada Inngest App (Functions)

* **Localizacao:** `apps/server/src/queue/jobs/challenging/ExpireNewChallengesJob.ts` (**novo arquivo**)
* **Dependencias:** `ChallengesRepository`
* **Metodos:**
  * `handle(amqp: Amqp): Promise<void>` - Executa use case de expiracao via `amqp.run`.
* **Constantes:**
  * `static readonly KEY = 'challenging/expire.new.challenges.job'`
  * `static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 5 0 * * *'`

## Camada Core

* **Localizacao:** `packages/core/src/challenging/use-cases/ExpireNewChallengesUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ChallengesRepository`
* **Metodos:**
  * `execute(): Promise<void>` - Delega ao repositorio a expiracao de desafios novos com idade superior a 7 dias.

---

# 6. O que deve ser modificado? (Depende da tarefa)

## Camada Banco de Dados (Repositories)

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
* **Mudanca:** Incluir persistencia de `is_new` em `add` e `replace`; adicionar operacao de expiracao em lote; aplicar filtro de novidade na query de `findMany`.
* **Justificativa:** Garantir ciclo de vida da flag e suporte ao filtro por novidade com eficiencia.
* **Camada:** `database`

## Camada Banco de Dados (Mappers)

* **Arquivo:** `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts`
* **Mudanca:** Mapear `is_new` -> `ChallengeDto.isNew` em `toDto` e `challenge.dto.isNew` -> `is_new` em `toSupabase`.
* **Justificativa:** Propagar o estado de novidade da persistencia ate o dominio/UI.
* **Camada:** `database`

## Camada Banco de Dados (Types)

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudanca:** Atualizar tipos gerados usados pelo codigo para refletir `is_new` em `public.challenges` e `public.challenges_view` (sem criar migration).
* **Justificativa:** Manter tipagem consistente com schema ja atualizado do banco.
* **Camada:** `database`

## Camada Core

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengesRepository.ts`
* **Mudanca:** Adicionar contrato explicito `expireNewChallengesOlderThanOneWeek(): Promise<void>` e filtro de listagem por novidade.
* **Justificativa:** Formalizar capacidade de ciclo de vida e filtro no port de persistencia.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/entities/Challenge.ts`
* **Mudanca:** Incluir `isNew` em `ChallengeProps`, getter e `dto`.
* **Justificativa:** Hoje o valor e produzido na factory mas nao e exposto integralmente para UI.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/types/ChallengesListParams.ts`
* **Mudanca:** Adicionar propriedade de filtro de novidade no contrato de listagem.
* **Justificativa:** Permitir transporte tipado do novo filtro entre web, controller e repositorio.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/ListChallengesUseCase.ts`
* **Mudanca:** Receber e encaminhar filtro de novidade ao repositorio junto dos filtros existentes; manter chamada de expiracao alinhada ao novo contrato `expireNewChallengesOlderThanOneWeek`.
* **Justificativa:** Integrar filtro sem quebrar semantica atual da listagem.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/index.ts`
* **Mudanca:** Exportar `ExpireNewChallengesUseCase`.
* **Justificativa:** Disponibilizar o novo use case para o job no server.
* **Camada:** `core`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`
* **Mudanca:** Ler query param de novidade e repassar para `ListChallengesUseCase`.
* **Justificativa:** Expor o novo filtro pela entrada REST da listagem.
* **Camada:** `rest`

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
* **Mudanca:** Validar query param do filtro de novidade na rota `GET /challenging/challenges/list`.
* **Justificativa:** Garantir contrato de entrada consistente e validado.
* **Camada:** `rest`

## Camada Inngest App (Functions)

* **Arquivo:** `apps/server/src/queue/jobs/challenging/index.ts`
* **Mudanca:** Exportar `ExpireNewChallengesJob`.
* **Justificativa:** Seguir padrao de barrel do dominio.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/ChallengingFunctions.ts`
* **Mudanca:** Registrar function cron de expiracao e injetar `SupabaseChallengesRepository` na composicao.
* **Justificativa:** Integrar o novo job ao runtime Inngest.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/app/hono/HonoApp.ts`
* **Mudanca:** Ajustar chamada de `challengingFunctions.getFunctions(...)` para receber `supabase` (quando exigido pela composicao).
* **Justificativa:** Garantir injecao de dependencias concretas na borda do app.
* **Camada:** `queue`

## Camada REST (Services)

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudanca:** Enviar query param de novidade em `fetchChallengesList`.
* **Justificativa:** Conectar filtro de UI ao endpoint de listagem.
* **Camada:** `rest`

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/query-params.ts`
* **Mudanca:** Incluir chave de query param para filtro de novidade (ex.: `isNewStatus`).
* **Justificativa:** Padronizar a chave usada no estado da URL.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/filter-select-items.ts`
* **Mudanca:** Incluir opcoes de filtro de novidade (`Todos`, `Novos`, `Antigos`).
* **Justificativa:** Reaproveitar padrao de selects/tags existente na pagina.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/useChallengesFilters.ts`
* **Mudanca:** Controlar query param de novidade, tags e remocao de tag para esse novo filtro.
* **Justificativa:** Manter UX consistente dos filtros com sincronizacao na URL.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/index.tsx`
* **Mudanca:** Expor handler de alteracao do filtro de novidade para a view.
* **Justificativa:** Preservar separacao Entry Point -> View do Widget Pattern.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/ChallengesFiltersView.tsx`
* **Mudanca:** Adicionar select visual para filtro por novidade.
* **Justificativa:** Disponibilizar controle de filtro ao usuario final.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/useChallengesList.ts`
* **Mudanca:** Ler query param de novidade e inclui-lo no request de listagem.
* **Justificativa:** Garantir que a lista respeite o filtro selecionado.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengesListView.tsx`
* **Mudanca:** Passar `isNew={challenge.dto.isNew ?? false}` para `ChallengeCard`.
* **Justificativa:** Expor estado de novidade por item para renderizacao.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/index.tsx`
* **Mudanca:** Incluir `isNew` nas props e repassar para `ChallengeCardView`.
* **Justificativa:** Manter contrato do card alinhado ao dado da listagem.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/ChallengeCardView.tsx`
* **Mudanca:** Renderizar badge textual "Novo" quando `isNew` for verdadeiro.
* **Justificativa:** Atender regra de UX do PRD na listagem.
* **Camada:** `ui`

---

# 7. O que deve ser removido? (Depende da tarefa)

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs (Obrigatorio)

* **Decisao**
* Executar expiracao de `isNew` em job dedicado, diario, no Inngest.
* **Alternativas consideradas**
* Calculo dinamico de novidade no tempo de leitura da listagem.
* **Motivo da escolha**
* Mantem estado persistido unico e permite filtro por novidade com query direta ao banco.
* **Impactos / trade-offs**
* Exige manutencao de cron e operacao diaria de update em lote.

* **Decisao**
* Adotar janela de expiracao de 1 semana.
* **Alternativas consideradas**
* Janela de 3 dias.
* **Motivo da escolha**
* Diretriz explicita do solicitante para esta entrega.
* **Impactos / trade-offs**
* Badge "Novo" permanece por mais tempo, com menor rotatividade de itens destacados.

* **Decisao**
* Nao criar migration nesta entrega.
* **Alternativas consideradas**
* Criar migration para coluna/view relacionadas a `is_new`.
* **Motivo da escolha**
* Banco ja atualizado conforme solicitacao.
* **Impactos / trade-offs**
* Qualquer drift entre schema real e tipos locais deve ser corrigido apenas no codigo da app.

* **Decisao**
* Usar filtro triestado para novidade (`all`, `new`, `old`) via query param.
* **Alternativas consideradas**
* Filtro booleano simples (`isNew=true/false`) ou sem filtro explicito.
* **Motivo da escolha**
* Mantem consistencia com UX atual de filtros que usa opcao "Todos".
* **Impactos / trade-offs**
* Aumenta ligeiramente a complexidade de tipagem e mapeamento de labels/tags.

---

# 9. Diagramas e Referencias (Obrigatorio)

* **Fluxo de Dados:**

```ascii
[Inngest Cron 00:05]
        |
        v
[ChallengingFunctions]
        |
        v
[ExpireNewChallengesJob.handle(amqp)]
        |
        v
[ExpireNewChallengesUseCase.execute]
        |
        v
[ChallengesRepository.expireNewChallengesOlderThanOneWeek()]
        |
        v
[SupabaseChallengesRepository UPDATE challenges SET is_new=false ...]

[Web ChallengesFilters]
        |
        v
[query isNewStatus=all|new|old]
        |
        v
[useChallengesList -> ChallengingService.fetchChallengesList]
        |
        v
[GET /challenging/challenges/list]
        |
        v
[FetchChallengesListController -> ListChallengesUseCase -> Repository.findMany]
        |
        v
[challenges_view(is_new) -> mapper -> ChallengeDto.isNew]
        |
        v
[ChallengesListView -> ChallengeCardView -> Badge "Novo"]
```

* **Layout (se aplicavel):**

```ascii
ChallengesPage
└── ChallengesFilters
    ├── Select Status
    ├── Select Dificuldade
    ├── Select Novidade (novo)
    └── CategoriesFilter

ChallengesList
└── ChallengeCard
    ├── DifficultyBadge
    ├── Badge "Novo" (condicional)
    ├── Link titulo
    └── ChallengeInfo
```

* **Referencias:**

  - `apps/server/src/queue/jobs/challenging/CreateChallengeJob.ts`
  - `apps/server/src/queue/inngest/functions/ChallengingFunctions.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
  - `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts`
  - `apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`
  - `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
  - `packages/core/src/challenging/use-cases/ListChallengesUseCase.ts`
  - `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/useChallengesFilters.ts`
  - `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/useChallengesList.ts`
  - `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/ChallengeCardView.tsx`

---

# 10. Pendencias / Duvidas (Quando aplicavel)

**Sem pendencias**.

---
title: Expiração da Flag isNew e Badge Novo em Challenges
prd: documentation/features/challenging/challenge-creator-agent/prd.md
apps: server, web
status: concluido
last_updated_at: 2026-02-27
---

# 1. Objetivo (Obrigatório)

Implementar o ciclo completo da flag `isNew` no domínio de desafios: expirar automaticamente para `false` em desafios com mais de 1 semana via job diário agendado, refletir esse estado na listagem de desafios da Web com badge visual "Novo" e adicionar filtro de listagem por novidade (`isNew`). A entrega cobre ponta a ponta entre banco, repositório, core, fila Inngest e UI da página `/challenging/challenges`, mantendo os padrões arquiteturais atuais (Queue agnóstica + adapters em server + Widget Pattern no web), sem criação de migrations (banco já atualizado).

---

# 2. Escopo (Obrigatório)

## 2.1 In-scope

- Expirar `isNew` (`true` -> `false`) em desafios com mais de 1 semana.
- Registrar function Inngest diária para expiração no domínio `challenging`.
- Propagar `isNew` no fluxo de leitura/escrita: DB types -> mapper -> entidade/core DTO -> REST listagem.
- Exibir badge "Novo" no card da listagem quando `challenge.isNew === true`.
- Adicionar filtro de listagem por novidade (todos/novos/antigos) na página de desafios.

## 2.2 Out-of-scope

- Criação ou execução de migrations SQL nesta entrega.
- Alterar lógica de geração automática por IA (workflow de criação do desafio).
- Envio de notificação ativa para usuário final (push/email/central).
- Mudança no design geral da página de desafios além do badge e do novo filtro.

---

# 3. Requisitos (Obrigatório)

## 3.1 Funcionais

- O sistema deve executar diariamente um job de expiração da novidade.
- O job deve identificar desafios com `createdAt` superior a 1 semana e atualizar `isNew` para `false`.
- A listagem de desafios deve retornar o estado `isNew` por item.
- Cards de desafios com `isNew: true` devem exibir badge "Novo" em destaque visual.
- A listagem deve aceitar filtro de novidade com 3 estados: `all`, `new`, `old`.

## 3.2 Não funcionais

- Performance: a expiração deve ser feita em update em lote no banco (sem loop N+1 por desafio).
- Resiliência: job de expiração deve executar com `amqp.run(...)` para rastreabilidade no Inngest.
- Observabilidade: falhas da function devem seguir o fluxo padrão de `onFailure` + `handleFailure` em `InngestFunctions`.
- Compatibilidade retroativa: manter contrato da listagem e combinar o novo filtro com filtros existentes sem quebrar query params atuais.
- Consistência temporal: cálculo de expiração alinhado ao timezone do cron (`America/Sao_Paulo`).

---

# 4. O que já existe? (Obrigatório)

## Camada Inngest App (Functions)

* **`CreateChallengeJob`** (`apps/server/src/queue/jobs/challenging/CreateChallengeJob.ts`) - Job diario existente no dominio `challenging`.
* **`ChallengingFunctions`** (`apps/server/src/queue/inngest/functions/ChallengingFunctions.ts`) - Composition root atual do Inngest para o dominio.

## Camada Banco de Dados (Repositories)

* **`SupabaseChallengesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`) - Repositório principal de desafios (leitura em `challenges_view`, escrita em `challenges`).

## Camada Banco de Dados (Mappers)

* **`SupabaseChallengeMapper`** (`apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts`) - Mapeia shape Supabase para `ChallengeDto`/`Challenge`.

## Camada Banco de Dados (Types)

* **`SupabaseChallenge`** (`apps/server/src/database/supabase/types/SupabaseChallenge.ts`) - Tipo de linha da `challenges_view`.
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - Tipos gerados de tabelas/views do Supabase.

## Camada Core

* **`ChallengesRepository`** (`packages/core/src/challenging/interfaces/ChallengesRepository.ts`) - Contrato de persistência de desafios.
* **`Challenge`** (`packages/core/src/challenging/domain/entities/Challenge.ts`) - Entidade central usada na listagem e no post.
* **`ChallengeFactory`** (`packages/core/src/challenging/domain/factories/ChallengeFactory.ts`) - Já produz `isNew` no build de props.
* **`ChallengeDto`** (`packages/core/src/challenging/domain/entities/dtos/ChallengeDto.ts`) - DTO já possui `isNew?: boolean`.
* **`ListChallengesUseCase`** (`packages/core/src/challenging/use-cases/ListChallengesUseCase.ts`) - Caso de uso da listagem.

## Camada REST (Controllers)

* **`FetchChallengesListController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`) - Entrada da listagem de desafios.

## Camada Hono App (Routes)

* **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - Validação/registro da rota `GET /challenging/challenges/list`.

## Camada UI (Widgets)

* **`ChallengesFilters`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/index.tsx`) - Entry point do widget de filtros da página.
* **`useChallengesFilters`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/useChallengesFilters.ts`) - Lógica de estado/query params dos filtros.
* **`ChallengesFiltersView`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/ChallengesFiltersView.tsx`) - Renderização dos selects/tags de filtros.
* **`ChallengesListView`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengesListView.tsx`) - Renderiza lista de cards.
* **`ChallengeCard`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/index.tsx`) - Entry point do card.
* **`ChallengeCardView`** (`apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/ChallengeCardView.tsx`) - Renderização do card.

## Camada REST (Services)

* **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - Cliente REST que envia query params da listagem.

## Camada Next.js App (Pages, Layouts)

* **`/challenging/challenges`** (`apps/web/src/app/challenging/challenges/page.tsx`) - Página que compõe o widget principal `ChallengesPage`.

---

# 5. O que deve ser criado? (Depende da tarefa)

## Camada Inngest App (Functions)

* **Localização:** `apps/server/src/queue/jobs/challenging/ExpireNewChallengesJob.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Métodos:**
  * `handle(amqp: Amqp): Promise<void>` - Executa use case de expiração via `amqp.run`.
* **Constantes:**
  * `static readonly KEY = 'challenging/expire.new.challenges.job'`
  * `static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 5 0 * * *'`

## Camada Core

* **Localização:** `packages/core/src/challenging/use-cases/ExpireNewChallengesUseCase.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Métodos:**
  * `execute(): Promise<void>` - Delega ao repositório a expiração de desafios novos com idade superior a 7 dias.

---

# 6. O que deve ser modificado? (Depende da tarefa)

## Camada Banco de Dados (Repositories)

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
* **Mudança:** Incluir persistência de `is_new` em `add` e `replace`; adicionar operação de expiração em lote; aplicar filtro de novidade na query de `findMany`.
* **Justificativa:** Garantir ciclo de vida da flag e suporte ao filtro por novidade com eficiência.
* **Camada:** `database`

## Camada Banco de Dados (Mappers)

* **Arquivo:** `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts`
* **Mudança:** Mapear `is_new` -> `ChallengeDto.isNew` em `toDto` e `challenge.dto.isNew` -> `is_new` em `toSupabase`.
* **Justificativa:** Propagar o estado de novidade da persistência até o domínio/UI.
* **Camada:** `database`

## Camada Banco de Dados (Types)

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudança:** Atualizar tipos gerados usados pelo código para refletir `is_new` em `public.challenges` e `public.challenges_view` (sem criar migration).
* **Justificativa:** Manter tipagem consistente com schema já atualizado do banco.
* **Camada:** `database`

## Camada Core

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengesRepository.ts`
* **Mudança:** Adicionar contrato explícito `expireNewChallengesOlderThanOneWeek(): Promise<void>` e filtro de listagem por novidade.
* **Justificativa:** Formalizar capacidade de ciclo de vida e filtro no port de persistência.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/entities/Challenge.ts`
* **Mudança:** Incluir `isNew` em `ChallengeProps`, getter e `dto`.
* **Justificativa:** Hoje o valor é produzido na factory mas não é exposto integralmente para UI.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/types/ChallengesListParams.ts`
* **Mudança:** Adicionar propriedade de filtro de novidade no contrato de listagem.
* **Justificativa:** Permitir transporte tipado do novo filtro entre web, controller e repositório.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/ListChallengesUseCase.ts`
* **Mudança:** Receber e encaminhar filtro de novidade ao repositório junto dos filtros existentes; manter chamada de expiração alinhada ao novo contrato `expireNewChallengesOlderThanOneWeek`.
* **Justificativa:** Integrar filtro sem quebrar semântica atual da listagem.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/index.ts`
* **Mudança:** Exportar `ExpireNewChallengesUseCase`.
* **Justificativa:** Disponibilizar o novo use case para o job no server.
* **Camada:** `core`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/FetchChallengesListController.ts`
* **Mudança:** Ler query param de novidade e repassar para `ListChallengesUseCase`.
* **Justificativa:** Expor o novo filtro pela entrada REST da listagem.
* **Camada:** `rest`

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
* **Mudança:** Validar query param do filtro de novidade na rota `GET /challenging/challenges/list`.
* **Justificativa:** Garantir contrato de entrada consistente e validado.
* **Camada:** `rest`

## Camada Inngest App (Functions)

* **Arquivo:** `apps/server/src/queue/jobs/challenging/index.ts`
* **Mudança:** Exportar `ExpireNewChallengesJob`.
* **Justificativa:** Seguir padrão de barrel do domínio.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/ChallengingFunctions.ts`
* **Mudança:** Registrar function cron de expiração e injetar `SupabaseChallengesRepository` na composição.
* **Justificativa:** Integrar o novo job ao runtime Inngest.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/app/hono/HonoApp.ts`
* **Mudança:** Ajustar chamada de `challengingFunctions.getFunctions(...)` para receber `supabase` (quando exigido pela composição).
* **Justificativa:** Garantir injeção de dependências concretas na borda do app.
* **Camada:** `queue`

## Camada REST (Services)

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudança:** Enviar query param de novidade em `fetchChallengesList`.
* **Justificativa:** Conectar filtro de UI ao endpoint de listagem.
* **Camada:** `rest`

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/query-params.ts`
* **Mudança:** Incluir chave de query param para filtro de novidade (ex.: `isNewStatus`).
* **Justificativa:** Padronizar a chave usada no estado da URL.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/filter-select-items.ts`
* **Mudança:** Incluir opções de filtro de novidade (`Todos`, `Novos`, `Antigos`).
* **Justificativa:** Reaproveitar padrão de selects/tags existente na página.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/useChallengesFilters.ts`
* **Mudança:** Controlar query param de novidade, tags e remoção de tag para esse novo filtro.
* **Justificativa:** Manter UX consistente dos filtros com sincronização na URL.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/index.tsx`
* **Mudança:** Expor handler de alteração do filtro de novidade para a view.
* **Justificativa:** Preservar separação Entry Point -> View do Widget Pattern.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesFilters/ChallengesFiltersView.tsx`
* **Mudança:** Adicionar select visual para filtro por novidade.
* **Justificativa:** Disponibilizar controle de filtro ao usuário final.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/useChallengesList.ts`
* **Mudança:** Ler query param de novidade e incluí-lo no request de listagem.
* **Justificativa:** Garantir que a lista respeite o filtro selecionado.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengesListView.tsx`
* **Mudança:** Passar `isNew={challenge.dto.isNew ?? false}` para `ChallengeCard`.
* **Justificativa:** Expor estado de novidade por item para renderização.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/index.tsx`
* **Mudança:** Incluir `isNew` nas props e repassar para `ChallengeCardView`.
* **Justificativa:** Manter contrato do card alinhado ao dado da listagem.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenges/ChallengesList/ChallengeCard/ChallengeCardView.tsx`
* **Mudança:** Renderizar badge textual "Novo" quando `isNew` for verdadeiro.
* **Justificativa:** Atender regra de UX do PRD na listagem.
* **Camada:** `ui`

---

# 7. O que deve ser removido? (Depende da tarefa)

**Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs (Obrigatório)

* **Decisão**
* Executar expiração de `isNew` em job dedicado, diário, no Inngest.
* **Alternativas consideradas**
* Cálculo dinâmico de novidade no tempo de leitura da listagem.
* **Motivo da escolha**
* Mantém estado persistido único e permite filtro por novidade com query direta ao banco.
* **Impactos / trade-offs**
* Exige manutenção de cron e operação diária de update em lote.

* **Decisão**
* Adotar janela de expiração de 1 semana.
* **Alternativas consideradas**
* Janela de 3 dias.
* **Motivo da escolha**
* Diretriz explícita do solicitante para esta entrega.
* **Impactos / trade-offs**
* Badge "Novo" permanece por mais tempo, com menor rotatividade de itens destacados.

* **Decisão**
* Não criar migration nesta entrega.
* **Alternativas consideradas**
* Criar migration para coluna/view relacionadas a `is_new`.
* **Motivo da escolha**
* Banco já atualizado conforme solicitação.
* **Impactos / trade-offs**
* Qualquer drift entre schema real e tipos locais deve ser corrigido apenas no código da app.

* **Decisão**
* Usar filtro triestado para novidade (`all`, `new`, `old`) via query param.
* **Alternativas consideradas**
* Filtro booleano simples (`isNew=true/false`) ou sem filtro explícito.
* **Motivo da escolha**
* Mantém consistência com UX atual de filtros que usa opção "Todos".
* **Impactos / trade-offs**
* Aumenta ligeiramente a complexidade de tipagem e mapeamento de labels/tags.

---

# 9. Diagramas e Referências (Obrigatório)

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

* **Layout (se aplicável):**

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

* **Referências:**

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

# 10. Pendências / Dúvidas (Quando aplicável)

**Sem pendências**.

---
title: Edição de Fontes de Desafio e Criação sem Vinculo Obrigatório
prd: documentation/features/challenging/challenge-sources-management/prd.md
apps: server, studio, web
status: closed
last_updated_at: 2026-03-05
---

# 1. Objetivo

Entregar a edição de `challenge_sources` no Studio por ação direta na tabela (abrindo dialog com URL e desafio vinculado) e permitir criação de nova fonte sem exigir desafio no momento do cadastro. Tecnicamente, a mudança cobre contrato de validação, fluxo REST Studio/Server, caso de uso no core e persistência Supabase, mantendo compatibilidade com os padrões atuais de widget, controllers finos e use cases no core.

---

# 2. Escopo

## 2.1 In-scope

- Adicionar ação de editar por linha na tabela de fontes no Studio.
- Reaproveitar o dialog de formulário de source para modo criação e modo edição.
- Tornar `challengeId` opcional na criação de source.
- Adicionar endpoint e controller de update de source no Server.
- Adicionar use case de update de source no Core.
- Ajustar mapeamento/persistência para suportar `challenge_id` nulo de forma explícita no domínio.
- Garantir regra de unicidade 1:1 (`challenge` -> `challenge_source`) quando houver `challengeId` informado em create/update.
- Manter listagem exibindo fontes sem desafio vinculado.

## 2.2 Out-of-scope

- Alterar navegação/rotas da página de fontes no Studio.
- Alterar fluxo de exclusão e reordenação já entregue.
- Introduzir drag and drop para ordenação.
- Alterar contratos de AI tools/workflows do módulo challenging.
- Alterar schema SQL/migrations nesta spec.

---

# 3. Requisitos

## 3.1 Funcionais

- O admin deve conseguir editar uma source existente pela coluna de ações da tabela.
- O dialog de edição deve permitir alterar `url` e `challengeId` (vínculo opcional).
- O admin deve conseguir criar source com `url` obrigatória e sem selecionar desafio.
- A listagem deve continuar exibindo itens recém-criados mesmo sem `challenge` vinculado.
- A UI deve exibir fallback para campos de desafio ausente (URL pública e título).
- Ao salvar criação/edição com sucesso, a listagem deve ser atualizada e o usuário deve receber feedback visual.
- Ao salvar criação/edição com erro de domínio (conflito 1:1), o dialog deve permanecer aberto com mensagem de erro.

## 3.2 Não funcionais

* Segurança
  - Endpoints de create/update/list/delete/reorder de sources continuam protegidos por `verifyAuthentication` + `verifyGodAccount`.
* Compatibilidade retroativa
  - Endpoint novo de update é aditivo.
  - `challengeId` passa a opcional no payload sem remover campos existentes.
* Validação
  - `url` permanece obrigatória e válida (`z.string().url()`).
  - `challengeId`, quando enviado, deve ser UUID válido (`idSchema`).
* Resiliência
  - Conflitos de unicidade devem continuar retornando erro tratável na UI.

---

# 4. O que já existe?

## Camada UI (Studio)

* **`ChallengeSourcesPageView`** (`apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourcesPageView.tsx`) - *Renderiza tabela de sources, ação de exclusão e controles de reordenação.*
* **`useChallengeSourcesPage`** (`apps/studio/src/ui/challenging/ChallengeSources/useChallengeSourcesPage.ts`) - *Orquestra listagem, criação, exclusão e reorder com `challengingService`.*
* **`ChallengeSourceFormView`** (`apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/ChallengeSourceFormView.tsx`) - *Dialog atual de criação com URL e seleção obrigatória de desafio.*
* **`useChallengeSourceForm`** (`apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/useChallengeSourceForm.ts`) - *Hook do formulário com `react-hook-form` + `challengeSourceSchema`.*
* **`RocketFormView`** (`apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/RocketForm/RocketFormView.tsx`) - *Referência de formulário reutilizado para criar/editar via `initialValues`.*

## Camada REST (Studio/Web)

* **`ChallengingService`** (`apps/studio/src/rest/services/ChallengingService.ts`) - *Implementa `fetchChallengeSourcesList`, `createChallengeSource`, `deleteChallengeSource` e `reorderChallengeSources`.*
* **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - *Implementação paralela da mesma interface compartilhada; precisa acompanhar mudanças contratuais do core.*

## Camada Hono App (Server)

* **`ChallengeSourcesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts`) - *Expõe `GET /`, `POST /`, `DELETE /:challengeSourceId` e `PATCH /order` para sources.*

## Camada REST (Server Controllers)

* **`CreateChallengeSourceController`** (`apps/server/src/rest/controllers/challenging/sources/CreateChallengeSourceController.ts`) - *Controller de criação com `challengeId` obrigatório no schema local.*
* **`FetchChallengeSourcesListController`** (`apps/server/src/rest/controllers/challenging/sources/FetchChallengeSourcesListController.ts`) - *Controller da listagem paginada.*
* **`DeleteChallengeSourceController`** (`apps/server/src/rest/controllers/challenging/sources/DeleteChallengeSourceController.ts`) - *Controller de exclusão por ID.*
* **`ReorderChallengeSourcesController`** (`apps/server/src/rest/controllers/challenging/sources/ReorderChallengeSourcesController.ts`) - *Controller de reordenação por lista de IDs.*

## Pacote Core

* **`ChallengeSource`** (`packages/core/src/challenging/domain/entities/ChallengeSource.ts`) - *Entidade de source com `challenge` obrigatório no estado atual.*
* **`ChallengeSourceDto`** (`packages/core/src/challenging/domain/entities/dtos/ChallengeSourceDto.ts`) - *DTO atual exige `challenge` com `id/title/slug`.*
* **`CreateChallengeSourceUseCase`** (`packages/core/src/challenging/use-cases/CreateChallengeSourceUseCase.ts`) - *Cria source apenas com `challengeId` obrigatório e valida 1:1.*
* **`ChallengeSourcesRepository`** (`packages/core/src/challenging/interfaces/ChallengeSourcesRepository.ts`) - *Já possui `findById`, `findByChallengeId`, `replace` e `replaceMany` para suportar update.*
* **`ChallengingService`** (`packages/core/src/challenging/interfaces/ChallengingService.ts`) - *Contrato compartilhado consumido por Studio/Web.*

## Camada Banco de Dados (Server)

* **`SupabaseChallengeSourcesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`) - *Implementação de persistência de sources.*
* **`SupabaseChallengeSourceMapper`** (`apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts`) - *Mapper DB <-> entidade de source.*
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - *`challenge_sources.challenge_id` já é `string | null` no tipo gerado.*

## Pacote Validation

* **`challengeSourceSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`) - *Schema atual exige `challengeId` obrigatório.*

---

# 5. O que deve ser criado?

## Pacote Core (Use Cases)

* **Localização:** `packages/core/src/challenging/use-cases/UpdateChallengeSourceUseCase.ts` (**novo arquivo**)
* **Dependências:** `ChallengeSourcesRepository`, `ChallengesRepository`
* **Métodos:**
  - `execute(request: { challengeSourceId: string; url: string; challengeId?: string | null }): Promise<ChallengeSourceDto>` — atualiza URL e vínculo de desafio de uma source existente, validando existência e conflito 1:1 quando `challengeId` for informado.

## Camada REST (Controllers)

* **Localização:** `apps/server/src/rest/controllers/challenging/sources/UpdateChallengeSourceController.ts` (**novo arquivo**)
* **Dependências:** `ChallengeSourcesRepository`, `ChallengesRepository`
* **Dados de request:** `routeParams { challengeSourceId }`, `body { url, challengeId? }`
* **Dados de response:** `ChallengeSourceDto`
* **Métodos:**
  - `handle(http: Http<Schema>)` — extrai params/body, executa `UpdateChallengeSourceUseCase` e retorna `200` com DTO atualizado.

---

# 6. O que deve ser modificado?

## Pacote Core

* **Arquivo:** `packages/core/src/challenging/domain/entities/dtos/ChallengeSourceDto.ts`
* **Mudança:** Tornar `challenge` opcional/nulo no DTO (`challenge?: { id: string; title: string; slug: string } | null`).
* **Justificativa:** O banco já permite `challenge_id` nulo e a nova regra de criação sem vínculo exige representar ausência de challenge no contrato de domínio.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/entities/ChallengeSource.ts`
* **Mudança:** Adaptar props/`create`/`dto` para suportar `challenge` ausente e adicionar mutadores necessários para edição (`url` e `challenge`).
* **Justificativa:** O use case de update precisa alterar estado da entidade sem reconstrução insegura e sem violar invariantes.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/CreateChallengeSourceUseCase.ts`
* **Mudança:** Alterar request para `challengeId?: string | null`; validar existência/unicidade apenas quando vínculo for informado.
* **Justificativa:** Permitir criação de source sem desafio obrigatório.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengingService.ts`
* **Mudança:**
  - Ajustar `createChallengeSource` para aceitar `challengeId` opcional.
  - Adicionar `updateChallengeSource(challengeSourceId, url, challengeId?)`.
* **Justificativa:** Expor contrato de atualização para Studio e manter assinatura alinhada à nova regra de criação.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/index.ts`
* **Mudança:** Exportar `UpdateChallengeSourceUseCase` no barrel.
* **Justificativa:** Manter padrão de consumo centralizado dos casos de uso.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/entities/fakers/ChallengeSourcesFaker.ts`
* **Mudança:** Ajustar faker para suportar `challenge` opcional no DTO.
* **Justificativa:** Evitar inconsistência de tipos no pacote core após mudança do contrato da entidade.
* **Camada:** `core`

## Pacote Validation (Schemas)

* **Arquivo:** `packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`
* **Mudança:** Tornar `challengeId` opcional (`idSchema.optional().nullable()`).
* **Justificativa:** Mesmo schema é reutilizado no Server (validação de entrada) e no Studio (formulário), garantindo consistência de contrato.
* **Camada:** `core`

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts`
* **Mudança:** Adicionar rota `PUT /challenging/challenge-sources/:challengeSourceId` com validação de `param` (`idSchema`) e `json` (`challengeSourceSchema`).
* **Justificativa:** Expor endpoint dedicado para atualização de source, seguindo padrão atual de rotas por recurso.
* **Camada:** `rest`

## Camada REST (Server Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/challenging/sources/CreateChallengeSourceController.ts`
* **Mudança:** Atualizar schema local e chamada do use case para `challengeId` opcional.
* **Justificativa:** Alinhar controller ao novo contrato de criação.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/rest/controllers/challenging/sources/index.ts`
* **Mudança:** Exportar `UpdateChallengeSourceController`.
* **Justificativa:** Manter padrão de barrel file na pasta de controllers de sources.
* **Camada:** `rest`

## Camada Banco de Dados (Repositories)

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`
* **Mudança:**
  - Em `findMany`, remover `inner join` para incluir fontes sem vínculo (`challenges(...)` em join não obrigatório).
  - Em `replace`, persistir `challenge_id` como `null` quando source estiver sem challenge.
* **Justificativa:** Sem essa alteração, fontes criadas sem desafio não aparecem na listagem e não podem ser editadas.
* **Camada:** `database`

## Camada Banco de Dados (Mappers)

* **Arquivo:** `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts`
* **Mudança:** Mapear ausência de relação para `challenge: null` (sem gerar challenge sintético) e persistir com `challenge_id` opcional.
* **Justificativa:** Evitar dados artificiais no domínio e manter semântica real do vínculo opcional.
* **Camada:** `database`

## Camada REST (Services)

* **Arquivo:** `apps/studio/src/rest/services/ChallengingService.ts`
* **Mudança:**
  - Ajustar `createChallengeSource` para enviar `challengeId` opcional.
  - Adicionar `updateChallengeSource` para `PUT /challenging/challenge-sources/:challengeSourceId`.
* **Justificativa:** Disponibilizar chamadas REST necessárias para o dialog de edição e para criação sem vínculo obrigatório.
* **Camada:** `rest`

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudança:** Replicar atualização de assinatura/método exigida pelo contrato `ChallengingService` do core.
* **Justificativa:** Evitar quebra de tipagem no monorepo ao expandir interface compartilhada.
* **Camada:** `rest`

## Camada UI (Widgets)

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/useChallengeSourcesPage.ts`
* **Mudança:**
  - Alterar `onCreateChallengeSource` para receber `challengeId?: string`.
  - Adicionar `onUpdateChallengeSource(challengeSourceId: string, url: string, challengeId?: string): Promise<string | null>`.
* **Justificativa:** Hook da página é o ponto de orquestração de mutações da tabela e precisa suportar edição.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourcesPageView.tsx`
* **Mudança:**
  - Adicionar ação `Editar` por linha.
  - Renderizar fallback para `source.challenge` ausente em URL pública e título.
* **Justificativa:** Expor fluxo de edição e suportar visualmente sources sem vínculo.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/index.tsx`
* **Mudança:** Suportar modo create/edit via props `initialValues` e `challengeSourceId`.
* **Justificativa:** Reuso do mesmo widget para os dois fluxos, seguindo padrão já usado no Studio.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/useChallengeSourceForm.ts`
* **Mudança:**
  - Adaptar `FormData` para `challengeId` opcional.
  - Preencher valores iniciais quando em modo edição.
  - Permitir limpar seleção do desafio.
* **Justificativa:** O formulário precisa operar em dois modos e aceitar vínculo opcional.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/ChallengeSourceFormView.tsx`
* **Mudança:**
  - Textos dinâmicos para create/edit.
  - Exibir ação para remover desafio selecionado.
  - Ajustar labels/descrições para indicar que vínculo é opcional.
* **Justificativa:** Evitar ambiguidade de UX e refletir nova regra de negócio no formulário.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

**Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Tratar `challenge` como opcional no DTO/entidade de `ChallengeSource`.
* **Alternativas consideradas:** Manter `challenge` obrigatório com valores sintéticos quando `challenge_id` fosse nulo.
* **Motivo da escolha:** O banco já permite `null` e a feature exige criar sem vínculo; modelar ausência explicitamente evita dados artificiais.
* **Impactos / trade-offs:** Exige ajustes em múltiplas camadas (UI, mapper, service), mas reduz inconsistência semântica.

* **Decisão:** Adicionar endpoint dedicado `PUT /challenging/challenge-sources/:challengeSourceId`.
* **Alternativas consideradas:** Reutilizar `POST` como upsert.
* **Motivo da escolha:** Mantém semântica REST clara e segue padrão do projeto para operações de atualização.
* **Impactos / trade-offs:** Aumenta número de arquivos/controllers, em troca de maior previsibilidade de contrato.

* **Decisão:** Reutilizar `ChallengeSourceForm` para criação e edição.
* **Alternativas consideradas:** Criar segundo dialog exclusivo de edição.
* **Motivo da escolha:** Reduz duplicação e segue referência consolidada do Studio (`RocketForm`).
* **Impactos / trade-offs:** Hook/form fica mais complexo por suportar dois modos.

* **Decisão:** Ajustar listagem de sources no repository para incluir itens sem challenge.
* **Alternativas consideradas:** Manter listagem atual e esconder fontes sem vínculo.
* **Motivo da escolha:** Se a source criada sem vínculo não aparecer, o admin perde capacidade de edição posterior.
* **Impactos / trade-offs:** Busca por título passa a depender de join opcional e exige cuidado na filtragem por `title`.

* **Decisão:** Evoluir `ChallengingService` compartilhado e atualizar implementações de Studio e Web.
* **Alternativas consideradas:** Criar service local no Studio fora do contrato compartilhado.
* **Motivo da escolha:** Preserva padrão de contrato único no core e evita divergência entre apps clientes.
* **Impactos / trade-offs:** Inclui alteração técnica no app Web mesmo sem impacto funcional direto de UI.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
[ChallengeSourcesPageView]
      | (create/edit submit)
      v
[useChallengeSourcesPage]
      |
      | REST (studio)
      v
[apps/studio ChallengingService]
      |
      | PUT/POST /challenging/challenge-sources
      v
[ChallengeSourcesRouter - Hono]
  -> verifyAuthentication
  -> verifyGodAccount
  -> validate(param/json)
      v
[Update/Create ChallengeSource Controller]
      v
[Update/Create ChallengeSource UseCase - core]
  -> valida source/challenge (quando informado)
  -> valida conflito 1:1
      v
[SupabaseChallengeSourcesRepository]
  -> mapper toSupabase/toEntity
      v
[challenge_sources (Supabase/PostgreSQL)]
```

* **Fluxo Cross-app:**

```ascii
Studio (consome) --REST--> Server (expõe)
   |                            |
   |                            +-- Hono route/controller
   |                            +-- Core use case
   |                            +-- Supabase repository

Web (consome contrato compartilhado) --(compilação/interface)--> Core ChallengingService

Formato de comunicação cross-app funcional: REST HTTP (Studio <-> Server)
Formato de comunicação cross-app de contrato: TypeScript interface compartilhada (Core <-> Studio/Web)
```

* **Layout (Studio):**

```ascii
ChallengeSourcesPage
┌──────────────────────────────────────────────────────────────┐
│ Fontes de desafios                               [Adicionar] │
│ [Buscar por título...]                                      │
│                                                              │
│ URL origem | URL desafio | Desafio vinculado | Em uso | Ações│
│ ...        | ...         | ...               | Sim    | [Editar][Excluir]
└──────────────────────────────────────────────────────────────┘

Dialog (create/edit)
┌──────────────────────────────────────────────┐
│ URL de origem [___________________________]  │
│ Buscar desafio [__________________________]  │
│ [lista de desafios]                          │
│ [Remover vínculo] (quando houver seleção)   │
│ erro inline (conflito/validação)            │
│                             [Cancelar][Salvar]
└──────────────────────────────────────────────┘
```

* **Referências:**
  - `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourcesPageView.tsx`
  - `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/useChallengeSourceForm.ts`
  - `apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/RocketForm/RocketFormView.tsx`
  - `apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts`
  - `apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`
  - `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`
  - `packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`

---

# 10. Pendências / Dúvidas

**Sem pendências**.

---

# 11. Consolidação da Implementação

## 11.1 Status final

- **Spec concluída** com entrega nas camadas UI, REST (Studio/Server), Core, Validation e Database.
- **Última atualização:** `2026-03-05`.

## 11.2 Decisões confirmadas na implementação

- `challengeId` foi consolidado como opcional (nullable) no contrato compartilhado de validação e transporte.
- O endpoint de atualização foi entregue como `PUT /challenging/challenge-sources/:challengeSourceId`, mantendo semântica REST explícita.
- O formulário de source foi reutilizado para criação e edição com o mesmo widget, diferenciando fluxo por `challengeSourceId` e `initialValues`.
- A listagem no repositório passou a incluir sources sem vínculo de desafio, preservando visibilidade operacional após criação sem `challengeId`.

## 11.3 Desvios em relação à proposta inicial

- **Nenhum desvio funcional em relação à Spec original.**
- Ajuste de implementação: no contrato de serviço, a ausência de vínculo é trafegada como `null` explícito (além de assinatura opcional em camadas de entrada), mantendo comportamento equivalente ao requisito de opcionalidade.

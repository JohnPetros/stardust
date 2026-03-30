---
title: Campo additionalInstructions no Gerenciamento de Challenge Sources
prd: https://github.com/JohnPetros/stardust/milestone/12
issue: https://github.com/JohnPetros/stardust/issues/373
apps: server, studio, web
status: closed
last_updated_at: 2026-03-25
---

# 1. Objetivo

Adicionar o campo opcional `additionalInstructions` ao fluxo de gerenciamento de `challenge_sources` no Studio, permitindo que administradores cadastrem e editem instrucoes especificas por fonte, exibam esse conteudo na listagem com truncamento e persistam o valor ponta a ponta entre UI, contratos compartilhados, API server e banco. A entrega deve reutilizar os componentes e contratos ja existentes do recurso, sem criar um fluxo paralelo para create/update.

---

# 2. Escopo

## 2.1 In-scope

- Exibir a coluna `Instrucoes de adaptacao` na tabela de challenge sources do Studio.
- Adicionar textarea opcional de `additionalInstructions` no dialog compartilhado de create/edit.
- Propagar `additionalInstructions` nos contratos compartilhados de validation, core e REST services.
- Persistir `additionalInstructions` no fluxo de create e update no server.
- Expor `additionalInstructions` no DTO retornado pela listagem e pelas respostas de create/update.
- Manter compatibilidade com a regra atual de `challengeId` opcional e com o mesmo recurso REST (`challenge-sources`).
- Atualizar o mapeamento Supabase <-> dominio para o campo `additional_instructions`.
- Manter a camada AI consistente com o novo shape de `ChallengeSourceDto` retornado por `get-next-challenge-source-tool`.

## 2.2 Out-of-scope

- Alterar navegacao, rota ou paginacao da pagina `ChallengeSources`.
- Alterar comportamento de exclusao e reordenacao ja entregues.
- Criar um widget separado apenas para edicao de `additionalInstructions`.
- Introduzir novo endpoint ou novo recurso REST para o campo.
- Incluir testes automatizados nesta spec.

---

# 3. Requisitos

## 3.1 Funcionais

- O admin deve visualizar na tabela de challenge sources uma coluna `Instrucoes de adaptacao`.
- Quando `additionalInstructions` estiver preenchido, a tabela deve exibir o texto truncado em uma linha.
- Quando `additionalInstructions` estiver vazio ou nulo, a tabela deve exibir `-`.
- O dialog de create/edit deve incluir um campo textarea opcional para `additionalInstructions`.
- O placeholder do textarea deve orientar que o campo serve para instrucoes especificas de adaptacao da fonte.
- O submit do formulario deve continuar permitido sem preencher `additionalInstructions`.
- O create de challenge source deve enviar e persistir `additionalInstructions` quando informado.
- O update de challenge source deve enviar e persistir `additionalInstructions` quando alterado.
- A listagem, o create e o update devem retornar `ChallengeSourceDto` com `additionalInstructions: string | null`.

## 3.2 Não funcionais

* Compatibilidade retroativa
  - A mudanca deve ser aditiva no payload de create/update, sem remover `url` nem `challengeId`.
  - O endpoint continua sendo `POST/PUT /challenging/challenge-sources`.
* Validacao
  - `additionalInstructions` deve ser aceito como campo opcional/nulo no schema compartilhado `challengeSourceSchema`.
  - `url` continua obrigatoria e valida.
  - `challengeId`, quando enviado, continua sendo UUID valido.
* Consistencia de dados
  - O mapper Supabase deve refletir `additional_instructions` em `ChallengeSource.additionalInstructions` e vice-versa.
  - O DTO retornado pela API nao pode perder o campo ao passar por repository/use case/controller.
* UX
  - A tabela deve preservar legibilidade com truncamento visual, sem expandir a linha.

---

# 4. O que já existe?

## Pacote Core

* **`ChallengeSource`** (`packages/core/src/challenging/domain/entities/ChallengeSource.ts`) - *Entidade ja possui `additionalInstructions: Text | null`, getter/setter e serializacao no `dto`.*
* **`ChallengeSourceDto`** (`packages/core/src/challenging/domain/entities/dtos/ChallengeSourceDto.ts`) - *DTO ja expoe `additionalInstructions: string | null`.*
* **`ChallengingService`** (`packages/core/src/challenging/interfaces/ChallengingService.ts`) - *Contrato compartilhado ainda aceita apenas `challengeId` e `url` em create/update de source.*
* **`CreateChallengeSourceUseCase`** (`packages/core/src/challenging/use-cases/CreateChallengeSourceUseCase.ts`) - *Caso de uso de criacao ainda nao recebe `additionalInstructions`.*
* **`UpdateChallengeSourceUseCase`** (`packages/core/src/challenging/use-cases/UpdateChallengeSourceUseCase.ts`) - *Caso de uso de edicao ainda nao atualiza `additionalInstructions`.*

## Pacote Validation

* **`challengeSourceSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`) - *Schema compartilhado entre Studio e Server; hoje valida apenas `url` e `challengeId`.*

## Camada Hono App (Routes)

* **`ChallengeSourcesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts`) - *Recurso REST existente com `GET`, `POST`, `PUT`, `DELETE` e `PATCH /order`, usando `challengeSourceSchema` no body de create/update.*

## Camada REST (Controllers)

* **`CreateChallengeSourceController`** (`apps/server/src/rest/controllers/challenging/sources/CreateChallengeSourceController.ts`) - *Traduz o body HTTP atual para `CreateChallengeSourceUseCase`.*
* **`UpdateChallengeSourceController`** (`apps/server/src/rest/controllers/challenging/sources/UpdateChallengeSourceController.ts`) - *Traduz o body HTTP atual para `UpdateChallengeSourceUseCase`.*
* **`FetchChallengeSourcesListController`** (`apps/server/src/rest/controllers/challenging/sources/FetchChallengeSourcesListController.ts`) - *Retorna `PaginationResponse<ChallengeSourceDto>`; passara a expor o novo campo assim que o mapper preencher a entidade.*

## Camada Banco de Dados (Repositories)

* **`SupabaseChallengeSourcesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`) - *Implementacao de listagem, criacao, update, reorder e remocao de challenge sources.*

## Camada Banco de Dados (Mappers)

* **`SupabaseChallengeSourceMapper`** (`apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts`) - *Mapper atual ainda ignora `additional_instructions` na leitura e na escrita.*

## Camada Banco de Dados (Types)

* **`SupabaseChallengeSource`** (`apps/server/src/database/supabase/types/SupabaseChallengeSource.ts`) - *Tipo tipado da row de `challenge_sources` com relacao opcional `challenges`.*
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - *Tipagem gerada do Supabase ja contem `challenge_sources.additional_instructions`.*

## Camada REST (Services)

* **`ChallengingService`** (`apps/studio/src/rest/services/ChallengingService.ts`) - *Cliente REST do Studio; create/update de source ainda enviam apenas `url` e `challengeId`.*
* **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - *Implementacao paralela da mesma interface compartilhada; precisa acompanhar a expansao contratual do core.*

## Camada UI (Widgets)

* **`ChallengeSourcesPageView`** (`apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourcesPageView.tsx`) - *Tabela do Studio; hoje nao renderiza coluna para `additionalInstructions`.*
* **`useChallengeSourcesPage`** (`apps/studio/src/ui/challenging/ChallengeSources/useChallengeSourcesPage.ts`) - *Orquestra listagem, create, update, delete e reorder; ainda nao transporta `additionalInstructions`.*
* **`ChallengeSourceForm`** (`apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/index.tsx`) - *Entry point do dialog compartilhado de create/edit.*
* **`useChallengeSourceForm`** (`apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/useChallengeSourceForm.ts`) - *Hook do formulario baseado em `challengeSourceSchema`; ainda sem campo textarea.*
* **`ChallengeSourceFormView`** (`apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/ChallengeSourceFormView.tsx`) - *View do dialog com input de URL e seletor de desafio opcional.*
* **`AchievementFormView`** (`apps/studio/src/ui/profile/widgets/components/AchievementForm/AchievementFormView.tsx`) - *Referencia de uso de `Textarea` com `FormField` no Studio.*

## Camada AI (Tools)

* **`GetNextChallengeSourceTool`** (`apps/server/src/ai/challenging/tools/GetNextChallengeSourceTool.ts`) - *Tool que retorna `ChallengeSourceDto`; pode se beneficiar do enriquecimento do DTO sem mudanca direta nesta spec.*
* **`ChallengingToolset`** (`apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`) - *Toolset que hoje valida a saida de `get-next-challenge-source-tool` apenas com `id`, `url` e `position`.*
* **`MastraCreateChallengeWorkflow`** (`apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`) - *Workflow que consome `get-next-challenge-source-tool` e monta o prompt inicial a partir da source retornada.*
* **`TOOLS_DESCRIPTIONS`** (`apps/server/src/ai/constants/tools-descriptions.ts`) - *Catalogo central das descricoes das tools do runtime de IA.*

---

# 5. O que deve ser criado?

**Não aplicável**.

---

# 6. O que deve ser modificado?

## Core

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengingService.ts`
* **Mudança:** Expandir as assinaturas de `createChallengeSource` e `updateChallengeSource` para aceitar `additionalInstructions` como valor opcional/nulo, mantendo `challengeId` e `url`.
* **Justificativa:** O contrato compartilhado entre Studio/Web e Server precisa transportar o novo campo ponta a ponta.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/CreateChallengeSourceUseCase.ts`
* **Mudança:** Incluir `additionalInstructions?: string | null` no request e repassar o valor para `ChallengeSource.create(...)` ao montar a nova source.
* **Justificativa:** O create precisa persistir o campo desde a primeira gravacao.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/UpdateChallengeSourceUseCase.ts`
* **Mudança:** Incluir `additionalInstructions?: string | null` no request e atualizar `challengeSource.additionalInstructions` antes de `replace(...)`.
* **Justificativa:** O mesmo dialog e o mesmo recurso REST sao usados para create/edit, entao o campo precisa ser editavel de forma consistente.
* **Camada:** `core`

## Validation

* **Arquivo:** `packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`
* **Mudança:** Adicionar `additionalInstructions` como atributo opcional/nulo no schema compartilhado.
* **Justificativa:** O schema e reutilizado no Studio (formulario) e no Server (body validation), evitando drift entre camadas.
* **Camada:** `core`

## REST

* **Arquivo:** `apps/server/src/rest/controllers/challenging/sources/CreateChallengeSourceController.ts`
* **Mudança:** Ler `additionalInstructions` do body e repassar para `CreateChallengeSourceUseCase.execute(...)`.
* **Justificativa:** O controller e a borda de traducao HTTP do create e precisa carregar o novo campo sem regra de negocio adicional.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/rest/controllers/challenging/sources/UpdateChallengeSourceController.ts`
* **Mudança:** Ler `additionalInstructions` do body e repassar para `UpdateChallengeSourceUseCase.execute(...)`.
* **Justificativa:** Mantem o update alinhado ao mesmo contrato do formulario compartilhado.
* **Camada:** `rest`

* **Arquivo:** `apps/studio/src/rest/services/ChallengingService.ts`
* **Mudança:** Enviar `additionalInstructions` no body de `createChallengeSource` e `updateChallengeSource`.
* **Justificativa:** O Studio e o consumidor direto do recurso e precisa transmitir o novo campo para a API.
* **Camada:** `rest`

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudança:** Replicar a expansao contratual de `createChallengeSource` e `updateChallengeSource` para manter conformidade com a interface compartilhada.
* **Justificativa:** Mesmo sem novo fluxo de UI no Web, a implementacao precisa permanecer tipada e coerente com o core.
* **Camada:** `rest`

## Database

* **Arquivo:** `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts`
* **Mudança:** Mapear `additional_instructions` para `additionalInstructions` em `toEntity(...)` e incluir `additional_instructions` em `toSupabase(...)`.
* **Justificativa:** O mapper e o ponto unico de traducao DB <-> dominio e hoje descarta o campo.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`
* **Mudança:** Garantir que `add(...)` persista `additional_instructions` via mapper e que `replace(...)` envie `additional_instructions` no update da row.
* **Justificativa:** Sem isso, o valor seria ignorado em create/edit mesmo com DTO e schema atualizados.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/SupabaseChallengeSource.ts`
* **Mudança:** Refletir no tipo composto de repository/mapper o campo `additional_instructions` ja presente em `Database`.
* **Justificativa:** Garante tipagem explicita do row shape consumido pelo mapper.
* **Camada:** `database`

## UI

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/useChallengeSourcesPage.ts`
* **Mudança:** Expandir `onCreateChallengeSource` e `onUpdateChallengeSource` para receber `additionalInstructions?: string | null` e repassar ao service.
* **Justificativa:** O hook da pagina centraliza as mutacoes do widget e precisa transportar o novo dado do formulario para a camada REST.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourcesPageView.tsx`
* **Mudança:** Adicionar coluna `Instruções adicionais`, exibir texto truncado quando houver valor e `-` quando vazio, e incluir `additionalInstructions` em `initialValues` do dialog de edicao.
* **Justificativa:** O valor precisa ficar visivel na operacao diaria e reutilizavel no modo edit.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/index.tsx`
* **Mudança:** Expandir `initialValues`, `onCreate` e `onUpdate` para incluir `additionalInstructions`.
* **Justificativa:** O entry point do widget concentra a integracao entre o hook/view e o service injetado via context.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/useChallengeSourceForm.ts`
* **Mudança:** Adicionar `additionalInstructions` ao `FormData`, `defaultValues`, `reset`, `initialValues` e submit handler.
* **Justificativa:** O hook precisa controlar o novo campo no ciclo completo do formulario sem quebrar o comportamento atual de create/edit.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/ChallengeSourceFormView.tsx`
* **Mudança:** Renderizar textarea opcional para `additionalInstructions` com placeholder orientativo, usando o padrao `FormField` + `Textarea` do Studio.
* **Justificativa:** O issue exige capturar o conteudo diretamente no dialog e manter consistencia visual com outros formularios do app.
* **Camada:** `ui`

## AI

* **Arquivo:** `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`
* **Mudança:** Expandir o `outputSchema` de `get-next-challenge-source-tool` para refletir `ChallengeSourceDto` com `additionalInstructions: z.string().nullable()` e `challenge` opcional/nulo.
* **Justificativa:** A tool ja retorna `ChallengeSourceDto`; o boundary da camada AI precisa permanecer consistente com o DTO enriquecido retornado pelo core/server.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`
* **Mudança:** Preservar o consumo do resultado de `getNextChallengeSourceStep` com o shape atualizado, mantendo o fluxo atual de `challengeSourceId` e permitindo uso futuro de `additionalInstructions` sem incompatibilidade de schema.
* **Justificativa:** O workflow depende diretamente da resposta validada pelo toolset e nao pode ficar tipado contra um shape antigo.
* **Camada:** `ai`

---

# 7. O que deve ser removido?

**Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Reutilizar o `challengeSourceSchema` e o mesmo dialog compartilhado de create/edit para incluir `additionalInstructions`.
* **Alternativas consideradas:** Criar schema separado para update ou um widget especifico para editar instrucoes.
* **Motivo da escolha:** O recurso ja opera com um formulario unico e um contrato REST comum entre create e update.
* **Impactos / trade-offs:** Menor duplicacao e menor risco de drift; em troca, o issue passa a afetar create e edit ao mesmo tempo.

* **Decisão:** Transportar `additionalInstructions` pelo contrato `ChallengingService` do core, mesmo que o novo uso funcional esteja concentrado no Studio.
* **Alternativas consideradas:** Tipar o campo apenas no service do Studio.
* **Motivo da escolha:** O contrato compartilhado e a fonte de verdade para os services Web/Studio e precisa refletir o payload real da API.
* **Impactos / trade-offs:** Obriga ajuste paralelo em `apps/web/src/rest/services/ChallengingService.ts`, mas evita quebra de tipagem e inconsistencias no monorepo.

* **Decisão:** Persistir o campo exclusivamente no fluxo existente de `challenge-sources`, sem criar endpoint dedicado ou metadata separada.
* **Alternativas consideradas:** Criar rota especifica para instrucoes ou tabela auxiliar.
* **Motivo da escolha:** O dado pertence semanticamente a `ChallengeSource` e ja existe no DTO/entidade de dominio.
* **Impactos / trade-offs:** Mantem a modelagem simples; em troca, qualquer ajuste futuro de IA continua acoplado ao DTO da source.

* **Decisão:** Exibir o valor da tabela em modo truncado com fallback simples `-`.
* **Alternativas consideradas:** Mostrar texto completo em multiplas linhas ou adicionar tooltip/modal especifico.
* **Motivo da escolha:** O issue pede exibicao na listagem, e a tabela atual prioriza densidade de informacao operacional.
* **Impactos / trade-offs:** Melhor legibilidade em listas grandes; em troca, o detalhe completo fica restrito ao dialog de edicao.

* **Decisão:** Atualizar o boundary da camada AI para refletir o novo shape de `ChallengeSourceDto`, sem alterar o comportamento funcional do workflow nesta entrega.
* **Alternativas consideradas:** Deixar `ChallengingToolset` com schema reduzido (`id`, `url`, `position`) e tratar a consistencia da IA em outra spec.
* **Motivo da escolha:** O usuario pediu consistencia da camada AI com as mudancas, e a tool `get-next-challenge-source-tool` ja depende diretamente do DTO retornado pelo core.
* **Impactos / trade-offs:** A entrega fica mais completa e evita drift de schema; em troca, o escopo passa a tocar tambem o boundary de Mastra, mesmo sem mudar a logica principal do workflow.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
[Studio ChallengeSourceForm]
        |
        | POST/PUT { url, challengeId?, additionalInstructions? }
        v
[apps/studio ChallengingService]
        |
        | REST JSON
        v
[ChallengeSourcesRouter]
        |
        +--> validate(challengeSourceSchema)
        v
[Create/UpdateChallengeSourceController]
        v
[Create/UpdateChallengeSourceUseCase]
        v
[SupabaseChallengeSourcesRepository]
        v
[SupabaseChallengeSourceMapper]
        |
        | additionalInstructions <-> additional_instructions
        v
[challenge_sources]

Listagem:
[challenge_sources]
        v
[SupabaseChallengeSourceMapper.toEntity]
        v
[ListChallengeSourcesUseCase -> ChallengeSourceDto]
        v
[Studio ChallengeSourcesPageView]
        |
        +--> coluna "Instrucoes de adaptacao" (truncate / '-')
```

* **Fluxo Cross-app (se aplicável):**

```ascii
[Studio]
  ChallengeSourcesPage / ChallengeSourceForm
        |
        | REST: GET/POST/PUT /challenging/challenge-sources
        v
[Server]
  ChallengeSourcesRouter -> Controllers -> Use Cases -> Repository -> Supabase
        |
        +--> GetNextChallengeSourceTool -> ChallengingToolset -> Mastra workflow

[Web]
  ChallengingService
        |
        +--> somente alinhamento contratual com `@stardust/core`
```

* **Layout:**

```ascii
ChallengeSourcesPage
┌────────────────────────────────────────────────────────────────────────────┐
│ Titulo                                              [Adicionar fonte]     │
│ [Buscar por titulo do desafio...]                                       │
│                                                                            │
│ Posicao | URL de origem | URL do desafio | Desafio | Instrucoes | Acoes   │
│   ^v    | https://...   | https://...    | Titulo  | Texto...    | ...    │
└────────────────────────────────────────────────────────────────────────────┘

ChallengeSourceForm
┌────────────────────────────────────────────────────────────────────────────┐
│ URL de origem [_______________________________________________]           │
│ Instrucoes de adaptacao                                                   │
│ [Textarea opcional com placeholder orientativo.........................]   │
│ Selecionar desafio (opcional)                                             │
│ [Buscar desafio...]                                                       │
│ [Lista paginada de desafios]                                              │
│                                              [Cancelar] [Salvar]          │
└────────────────────────────────────────────────────────────────────────────┘
```

* **Referências:**
  - `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourcesPageView.tsx`
  - `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/useChallengeSourceForm.ts`
  - `apps/studio/src/ui/challenging/ChallengeSources/ChallengeSourceForm/ChallengeSourceFormView.tsx`
  - `apps/studio/src/ui/profile/widgets/components/AchievementForm/AchievementFormView.tsx`
  - `apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts`
  - `apps/server/src/rest/controllers/challenging/sources/CreateChallengeSourceController.ts`
  - `apps/server/src/rest/controllers/challenging/sources/UpdateChallengeSourceController.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`
  - `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts`
  - `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`
  - `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`
  - `packages/core/src/challenging/domain/entities/ChallengeSource.ts`
  - `packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`

---

# 10. Pendências / Dúvidas

**Sem pendências**.

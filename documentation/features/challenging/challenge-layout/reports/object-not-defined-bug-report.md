---
title: Erro interno por codigo inicial indefinido
prd: https://github.com/JohnPetros/stardust/milestone/17
issue: https://github.com/JohnPetros/stardust/issues/483
apps: web
status: open
last_updated_at: 2026-07-14
---

# Bug Report: Erro interno por codigo inicial indefinido

## Problema Identificado

Ao acessar em producao a pagina publica do desafio `veredito-do-painel-estelar` em `/challenging/challenges/veredito-do-painel-estelar/challenge`, a aplicacao renderiza um erro interno durante a montagem da pagina de desafio. O log do browser confirma `TypeError: Cannot read properties of undefined (reading 'match')` em `v.getFunctionName`, acionado pelo bundle da aba de descricao. Isso indica que a UI chamou `lspProvider.getFunctionName(...)` com codigo inicial `undefined`. O comportamento esperado e que a pagina carregue descricao, editor, resultado e navegacao sem erro interno, ou que interrompa o fluxo de forma controlada antes da hidratacao quando o payload remoto estiver invalido.

## Causas

- Contrato inconsistente entre payload remoto de desafio e `ChallengeDto`, com chegada confirmada de codigo inicial `undefined` no fluxo que deveria fornecer `initialCode: string`.
- Ausencia de validacao explicita do `ChallengeDto` recebido pela action da pagina antes de criar a entidade `Challenge` e hidratar a UI.
- Dependencia da UI em `challenge.initialCode.value` para detectar o tipo de desafio na aba de descricao, sem camada anterior garantindo que o contrato foi normalizado.
- Possivel desalinhamento de deploy/migracao da view `challenges_view` em producao, apesar do mapper local ja converter `initial_code` para `initialCode`.

## Contexto e Análise

### Camada Core (Use Cases)
- **Arquivo:** `packages/core/src/challenging/domain/entities/dtos/ChallengeDto.ts`
- **Diagnóstico:** Fato: o contrato canonico exige `initialCode: string`. Payload com `code` ou `initialCode` ausente viola o DTO antes de chegar ao dominio.
- **Arquivo:** `packages/core/src/challenging/domain/factories/ChallengeFactory.ts`
- **Diagnóstico:** Fato: a entidade `Challenge` e produzida com `Text.create(dto.initialCode)`. O core assume DTO valido e nao deve ser usado como camada de compatibilidade para payload legado.

### Camada Banco de Dados (Repositories)
- **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
- **Diagnóstico:** Fato: `findBySlug` busca dados em `challenges_view` e delega a normalizacao para `SupabaseChallengeMapper.toEntity`. Hipotese: se a view ou a API em producao estiverem desatualizadas, o payload pode sair sem `initial_code`, causando a quebra observada na web.

### Camada Banco de Dados (Mappers)
- **Arquivo:** `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts`
- **Diagnóstico:** Fato: o mapper local converte `supabaseChallenge.initial_code ?? ''` para `ChallengeDto.initialCode`. Isso indica que a conversao correta existe no codigo atual, mas a issue mostra que o contrato efetivamente recebido em producao ainda pode estar divergente.

### Camada Banco de Dados (Types)
- **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
- **Diagnóstico:** Fato: `challenges_view` expoe `initial_code: string | null`; tambem existem tipos legados com campo `code` em outras estruturas do schema. O contrato entre view, tipos gerados e mapper precisa ficar explicitamente alinhado para impedir que `code` atravesse a fronteira REST/Web como substituto de `initialCode`.
- **Arquivo:** `apps/server/supabase/migrations/20260619123000_update_challenges_view_and_list_function_to_initial_code.sql`
- **Diagnóstico:** Fato: a migracao recria `challenges_view` e `list_challenges` expondo `initial_code`. A producao deve ser verificada contra essa migracao, porque a issue descreve comportamento compativel com schema/view antigo ou payload nao normalizado.

### Camada RPC (Actions)
- **Arquivo:** `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
- **Diagnóstico:** Fato: a action busca o desafio por slug, cria `Challenge` com o corpo retornado pelo service e retorna `challenge.dto` para a pagina. Ela nao valida explicitamente se o corpo remoto contem `initialCode` como string antes de hidratar o dominio.
- **Arquivo:** `apps/web/src/rpc/next-safe-action/challengingActions.ts`
- **Diagnóstico:** Fato: `accessChallengePage` e `accessAuthenticatedChallengePage` instanciam `ChallengingService` e executam `AccessChallengePageAction`, sem schema de saida para garantir o shape de `ChallengeDto` recebido do backend.

### Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
- **Diagnóstico:** Fato: o hook cria `Challenge.create(challengeDto)` durante a hidratacao e compara payloads usando `challengeDto.initialCode`. Se esse campo vier ausente, o estado do desafio e montado a partir de dados invalidos.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/useChallengeDescriptionSlot.ts`
- **Diagnóstico:** Fato: o hook chama `lspProvider.getFunctionName(challenge.initialCode.value)` para decidir qual alerta MDX anexar a descricao. O log `Cannot read properties of undefined (reading 'match') at v.getFunctionName` confirma que o valor recebido pelo LSP no bundle de producao era `undefined`. A responsabilidade primaria nao e do LSP, mas da falta de garantia de contrato antes da UI usar o codigo inicial.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeLayoutView.tsx`
- **Diagnóstico:** Fato: o layout monta header, abas, editor e assistente. Ele e impactado porque a falha na hidratacao/descricao quebra a experiencia do shell de challenge, mas nao ha evidencia de erro estrutural no layout em si.

### Camada Next.js App (Pages, Layouts)
- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/ChallengePageContent.tsx`
- **Diagnóstico:** Fato: a entrada da pagina escolhe entre `accessChallengePage` e `accessAuthenticatedChallengePage` e entrega `challengeDto` diretamente para `ChallengePage` quando ha dados. Nao existe verificacao local de `challengeDto.initialCode` antes de renderizar a UI cliente.
- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/layout.tsx`
- **Diagnóstico:** Fato: o layout compoe `ChallengeLayout` com slots paralelos `children`, `tabContent` e `codeEditor`. A correcao deve preservar essa composicao e resolver o contrato antes da hidratacao dos slots.

## Plano de Correção

### 1. O que já existe?

Liste recursos existentes da codebase que estão envolvidos no bug, serão reutilizados na correção ou podem ser impactados indiretamente.

- **core**
  - `ChallengeDto` — Define `initialCode` como campo canonico obrigatorio do codigo inicial.
  - `ChallengeFactory` — Converte `ChallengeDto.initialCode` para `Text` ao criar a entidade.
- **database**
  - `SupabaseChallengesRepository` — Busca o desafio por slug em `challenges_view`.
  - `SupabaseChallengeMapper` — Converte `initial_code` do Supabase para `initialCode` no DTO.
  - `20260619123000_update_challenges_view_and_list_function_to_initial_code.sql` — Migra view e funcao de listagem para `initial_code`.
- **rpc**
  - `AccessChallengePageAction` — Orquestra o acesso publico/autenticado a pagina de desafio e retorna `challengeDto` para a web.
  - `challengingActions` — Expõe as actions server-side usadas pela pagina Next.js.
- **ui**
  - `useChallengePage` — Hidrata o store de challenge a partir do `challengeDto`.
  - `useChallengeDescriptionSlot` — Usa o codigo inicial para detectar se o desafio e baseado em funcao ou em entrada.
  - `ChallengeLayoutView` — Mantem o shell visual da pagina de desafio.
- **web**
  - `ChallengePageContent` — Entrada server-side da rota de challenge que entrega os dados para a UI cliente.
  - `challenge/layout.tsx` — Composicao App Router dos slots da pagina de desafio.

### 2. O que deve ser criado?

Descreva novos recursos necessários **apenas se estritamente necessários**.

- **rpc**
  - `ChallengeDto` validation boundary — Validacao ou normalizacao explicita na borda da action/service para garantir `initialCode: string` antes de `Challenge.create(...)`. Pode ser implementada com schema existente/novo apenas se nao houver schema compartilhado apropriado.
- **web**
  - Teste de regressao da rota de challenge — Cobrir acesso a `/challenging/challenges/[challengeSlug]/challenge` com payload contendo `initialCode` valido e, se a decisao tecnica permitir, payload legado/invalido com falha controlada.

### 3. O que deve ser modificado?

Liste mudanças pontuais em código existente, explicando o motivo da alteração.

- **database**
  - `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts` — Confirmar e, se necessario, reforcar a normalizacao de `initial_code` para `initialCode`, sem expor `code` como contrato publico.
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts` — Evitar retorno silencioso de payload incompleto no fluxo `findBySlug`; quando a view nao entregar o campo esperado, falhar de forma rastreavel.
- **rpc**
  - `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts` — Validar o DTO recebido de `fetchChallengeBySlug` antes de criar `Challenge`; em caso invalido, interromper com erro controlado ou normalizar compatibilidade legada na borda correta.
  - `apps/web/src/rpc/next-safe-action/challengingActions.ts` — Garantir que `accessChallengePage` e `accessAuthenticatedChallengePage` nao repassem `challengeDto` invalido para a UI.
- **ui**
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts` — Preservar a hidratacao via `Challenge.create`, mas depender de DTO ja validado; adicionar cobertura para nao hidratar estado com codigo inicial ausente.
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/useChallengeDescriptionSlot.ts` — Manter a chamada ao LSP somente com string valida; se houver fallback visual, ele deve ser tratado como defesa de UI e nao como normalizacao principal do contrato remoto.
- **web**
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/ChallengePageContent.tsx` — Garantir que a pagina nao renderize `ChallengePage` com `challengeDto` incompleto.

### 4. O que deve ser removido?

Liste código redundante, legado ou incorreto que deve ser eliminado como parte da correção.

- **database**
  - Dependencia implicita de campo legado `code` em qualquer fluxo que alimente `ChallengeDto`; o contrato publico deve permanecer `initialCode`.
- **rpc**
  - Passagem silenciosa de payload remoto nao validado para `Challenge.create(...)`.
- **ui**
  - Qualquer fallback que esconda payload invalido tratando `undefined` como codigo inicial vazio sem registrar ou controlar a falha na borda de dados.

---
title: Controles Next e Prev de Desafios
prd: https://github.com/JohnPetros/stardust/milestone/16
apps: server, web
status: closed
last_updated_at: 2026-03-20
---

# 1. Objetivo

Implementar apenas os controles de navegacao sequencial `anterior` e `proximo` na pagina de execucao de desafios da aplicacao `web`, usando a ordem global por data de criacao do desafio, integrando o fluxo com dirty state antes do redirecionamento. A entrega inclui os contratos necessarios no `server` e no `core` para resolver os vizinhos do desafio atual, sem incluir a sidebar, listagem, busca, filtros, contador de progresso ou desafio aleatorio.

---

# 2. Escopo

## 2.1 In-scope

- Exibir botoes `Anterior` e `Proximo` na pagina de desafio da `web` apenas para desafios sem vinculo com estrela.
- Desabilitar `Anterior` quando o desafio atual for o primeiro da ordem global.
- Desabilitar `Proximo` quando o desafio atual for o ultimo da ordem global.
- Exibir tooltips informando que a navegacao ignora filtros e segue a ordem global.
- Aplicar dirty state antes de navegar pelos controles sequenciais.
- Adicionar contrato REST no `server` para buscar os slugs anterior e proximo do desafio atual.
- Hidratar os slugs de navegacao no SSR da pagina de desafio apenas para desafios sem `star_id`.

## 2.2 Out-of-scope

- Sidebar de desafios.
- Lista paginada de desafios.
- Busca por titulo.
- Filtros por status, dificuldade ou tags.
- Contador de progresso `X/Y Resolvidos`.
- Navegacao aleatoria.
- Navegacao sequencial para desafios do tipo `star`.
- Alteracoes na pagina publica `apps/web/src/ui/challenging/widgets/pages/Challenges`.

---

# 3. Requisitos

## 3.1 Funcionais

- O usuario deve conseguir navegar para o desafio anterior pela ordem global de criacao quando o desafio atual nao estiver vinculado a uma estrela.
- O usuario deve conseguir navegar para o proximo desafio pela ordem global de criacao quando o desafio atual nao estiver vinculado a uma estrela.
- Os controles devem ignorar qualquer filtro eventualmente existente em outras telas do modulo `challenging`.
- Quando houver codigo nao salvo no desafio atual, o sistema deve exibir um modal de confirmacao antes de navegar.
- Ao cancelar a confirmacao, o usuario deve permanecer no desafio atual.
- Ao confirmar a navegacao, o rascunho local do desafio atual deve ser descartado antes do redirecionamento.

## 3.2 Não funcionais

- Compatibilidade retroativa
  - A rota atual da pagina de desafio nao deve mudar.
- Consistencia de dados
  - `Anterior` e `Proximo` devem ser resolvidos pela mesma ordenacao global por `created_at`.
- UX e estado de interface
  - Os botoes desabilitados devem manter o comportamento visual esperado de inatividade.
  - Os tooltips devem deixar explicito que a navegacao ignora filtros.
- Seguranca
  - O `server` deve considerar apenas desafios nao vinculados a estrela (`star_id IS NULL`) para este fluxo.
  - O `web` nao deve acionar o endpoint de navegacao quando o desafio atual estiver vinculado a estrela.

---

# 4. O que já existe?

## Next.js App

* **`Page`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`) - busca os dados iniciais da pagina de desafio.

## Camada UI

* **`ChallengePage`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`) - entry point client da pagina de desafio.
* **`useChallengePage`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`) - hidrata o estado do desafio e controla a navegacao do botao de voltar.
* **`ChallengePageView`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/ChallengePageView.tsx`) - header atual da pagina com titulo e acao de saida.
* **`Tooltip`** (`apps/web/src/ui/global/widgets/components/Tooltip/index.tsx`) - componente reutilizavel para explicacao dos controles.
* **`AlertDialog`** (`apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`) - modal reutilizavel para confirmacao.
* **`useChallengeCodeEditorSlot`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts`) - persiste o codigo do desafio em `localStorage`, base concreta do dirty state.

## Camada RPC

* **`challengingActions`** (`apps/web/src/rpc/next-safe-action/challengingActions.ts`) - action entry point da pagina.
* **`AccessChallengePageAction`** (`apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`) - busca o desafio atual por slug.

## Camada REST

* **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - adapter REST atual para os endpoints de desafios.

## Camada Hono App

* **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - router atual das rotas REST de desafios.

## Camada REST (Controllers)

* **`FetchChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengeController.ts`) - referencia de busca por desafio.

## Camada Banco de Dados

* **`SupabaseChallengesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`) - implementacao concreta de persistencia de desafios.

## Pacote Core

* **`ChallengesRepository`** (`packages/core/src/challenging/interfaces/ChallengesRepository.ts`) - contrato atual do repositorio de desafios.
* **`GetChallengeUseCase`** (`packages/core/src/challenging/use-cases/GetChallengeUseCase.ts`) - busca o desafio atual por slug.
* **`ChallengeDto`** (`packages/core/src/challenging/domain/entities/dtos/ChallengeDto.ts`) - dto atual da pagina de desafio.

---

# 5. O que deve ser criado?

## Pacote Core (Structures)

* **Localização:** `packages/core/src/challenging/domain/structures/ChallengeNavigation.ts` (**novo arquivo**)
* **props:**
  - `previousChallengeSlug: string | null`
  - `nextChallengeSlug: string | null`
* **Métodos:**
  - `static create(props: { previousChallengeSlug: string | null; nextChallengeSlug: string | null }): ChallengeNavigation` - cria a structure de navegacao.
  - `get dto(): ChallengeNavigationDto` - retorna o dto serializavel da structure.

## Pacote Core (DTOs)

* **Localização:** `packages/core/src/challenging/domain/structures/dtos/ChallengeNavigationDto.ts` (**novo arquivo**)
* **props:**
  - `previousChallengeSlug: string | null`
  - `nextChallengeSlug: string | null`

## Pacote Core (Use Cases)

* **Localização:** `packages/core/src/challenging/use-cases/GetChallengeNavigationUseCase.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Métodos:**
  - `execute({ challengeSlug }: { challengeSlug: string }): Promise<ChallengeNavigationDto>` - resolve os slugs anterior e proximo do desafio atual na ordem global de criacao e retorna o dto da structure.

## Camada REST (Controllers)

* **Localização:** `apps/server/src/rest/controllers/challenging/challenges/FetchChallengeNavigationController.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Dados de request:**
  - `challengeSlug` (route param)
* **Dados de response:**
  - `previousChallengeSlug`
  - `nextChallengeSlug`
* **Métodos:**
  - `handle(http: Http<Schema>)` - extrai `challengeSlug`, chama `GetChallengeNavigationUseCase` e retorna `http.send(...)`.

## Camada UI (Hooks)

* **Localização:** `apps/web/src/ui/challenging/hooks/useChallengeNavigationGuard.ts` (**novo arquivo**)
* **Dependências:** `Challenge`, `NavigationProvider`, `useLocalStorage`, `STORAGE`, `AlertDialogRef`
* **Métodos:**
  - `requestNavigation(route: string): void` - navega imediatamente quando nao ha dirty state; caso contrario, registra a rota pendente e abre o dialog.
  - `confirmNavigation(): void` - remove o rascunho atual de `localStorage`, fecha o dialog e executa a navegacao pendente.
  - `cancelNavigation(): void` - limpa a navegacao pendente e permanece na pagina atual.
  - `isDirty(): boolean` - compara o codigo salvo em `STORAGE.keys.challengeCode(challenge.id.value)` com `challenge.code`.

## Camada UI (Widgets)

* **Localização:** `apps/web/src/ui/challenging/widgets/components/ChallengeNavigation/index.tsx` (**novo arquivo**)
* **Props:**
  - `previousChallengeSlug: string | null`
  - `nextChallengeSlug: string | null`
  - `onPreviousChallengeClick: () => void`
  - `onNextChallengeClick: () => void`
* **Estados (Client Component):**
  - `Loading`: Não aplicável.
  - `Error`: Não aplicável.
  - `Empty`: Não aplicável.
  - `Content`: renderiza os botoes `Anterior` e `Proximo`, estados desabilitados e `Tooltip` explicativo.
* **View:** `apps/web/src/ui/challenging/widgets/components/ChallengeNavigation/ChallengeNavigationView.tsx` (**novo arquivo**)
* **Hook (se aplicável):** Não aplicável.
* **Index:** Reaproveita `Tooltip`, `Button` e `Icon` globais.
* **Widgets internos:** Não aplicável.

* **Localização:** `apps/web/src/ui/challenging/widgets/components/ChallengeNavigationAlertDialog/index.tsx` (**novo arquivo**)
* **Props:**
  - `dialogRef: RefObject<AlertDialogRef | null>`
  - `onConfirm: () => void`
  - `onCancel: () => void`
* **Estados (Client Component):**
  - `Loading`: Não aplicável.
  - `Error`: Não aplicável.
  - `Empty`: Não aplicável.
  - `Content`: exibe a confirmacao de descarte do codigo nao salvo.
* **View:** Não aplicável.
* **Hook (se aplicável):** Não aplicável.
* **Index:** Reaproveita `AlertDialog` e `Button` globais.
* **Widgets internos:** Não aplicável.

---

# 6. O que deve ser modificado?

## Next.js App

* **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`
* **Mudança:** Passar `previousChallengeSlug` e `nextChallengeSlug` para `ChallengePage`.
* **Justificativa:** Os controles precisam do estado inicial de navegacao no SSR.
* **Camada:** `ui`

## Camada RPC

* **Arquivo:** `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
* **Mudança:** Buscar os slugs de navegacao adjacente e retorná-los junto de `challengeDto` e `userChallengeVote` apenas para desafios sem `star_id`; para desafios de estrela, retornar ambos como `null` sem acionar o endpoint.
* **Justificativa:** Centraliza a composicao server-side da pagina de desafio e evita chamada desnecessaria para um fluxo fora do escopo.
* **Camada:** `rpc`

* **Arquivo:** `apps/web/src/rpc/next-safe-action/challengingActions.ts`
* **Mudança:** Reutilizar o `ChallengingService` para chamar o novo endpoint de navegacao antes de montar o payload da action.
* **Justificativa:** Evitar criar um novo adapter apenas para um unico endpoint nesta iteracao reduzida.
* **Camada:** `rpc`

## Camada UI

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`
* **Mudança:** Compor `useChallengeNavigationGuard`, `ChallengeNavigationAlertDialog` e `ChallengeNavigation`, conectando o widget aos slugs de navegacao e ao guard.
* **Justificativa:** O entry point continua sendo o ponto de composicao entre hook, dependencias de contexto e widgets auxiliares.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
* **Mudança:** Expor `handlePreviousChallengeClick(): void` e `handleNextChallengeClick(): void`, usando `requestNavigation` quando houver slug disponivel, e expor o slot/elemento do widget `ChallengeNavigation` para o header da pagina.
* **Justificativa:** A logica de navegacao do header deve permanecer no hook da pagina.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/ChallengePageView.tsx`
* **Mudança:** Receber e renderizar o widget `ChallengeNavigation` no header da pagina, sem conhecer a logica de navegacao interna.
* **Justificativa:** Mantem a view da pagina mais enxuta e delega a UI dos controles a um widget dedicado.
* **Camada:** `ui`

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
* **Mudança:** Adicionar `GET /challenging/challenges/slug/:challengeSlug/navigation` com validacao de `challengeSlug`.
* **Justificativa:** Expor um contrato REST minimo e explicito para os controles sequenciais.
* **Camada:** `rest`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/challenging/challenges/index.ts`
* **Mudança:** Exportar `FetchChallengeNavigationController`.
* **Justificativa:** Manter o barrel file alinhado com o padrao do modulo.
* **Camada:** `rest`

## Camada REST (Services)

* **Arquivo:** `apps/web/src/rest/services/ChallengingService.ts`
* **Mudança:** Adicionar `fetchChallengeNavigation(challengeSlug: Slug): Promise<RestResponse<ChallengeNavigationDto>>`, consumindo `GET /challenging/challenges/slug/:challengeSlug/navigation`.
* **Justificativa:** Permitir que a action SSR hidrate os controles `Anterior` e `Proximo` sem criar um novo service.
* **Camada:** `rest`

## Camada Banco de Dados (Repositories)

* **Arquivo:** `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
* **Mudança:** Implementar busca do desafio anterior e do proximo pela ordem global de `created_at`, restrita a desafios sem `star_id`.
* **Justificativa:** O `server` hoje nao possui consulta de adjacencia entre desafios.
* **Camada:** `database`

## Pacote Core

* **Arquivo:** `packages/core/src/challenging/interfaces/ChallengesRepository.ts`
* **Mudança:** Adicionar metodo para resolver a navegacao adjacente do desafio atual.
* **Justificativa:** Formalizar no core a nova capacidade exigida pelo `server`.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/structures/index.ts`
* **Mudança:** Exportar `ChallengeNavigation` e `ChallengeNavigationDto`.
* **Justificativa:** Tornar a nova structure e seu dto consumiveis por use case, service e controller.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/index.ts`
* **Mudança:** Exportar `GetChallengeNavigationUseCase`.
* **Justificativa:** Manter o barrel file consistente.
* **Camada:** `core`

---

# 7. O que deve ser removido?

Não aplicável.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Reduzir a entrega para apenas `Anterior` e `Proximo`, sem sidebar.
* **Alternativas consideradas:** Implementar a sidebar completa junto com a navegacao sequencial.
* **Motivo da escolha:** O escopo pedido foi explicitamente reduzido para evitar incluir listagem, filtros e overlay nesta iteracao.
* **Impactos / trade-offs:** A implementacao fica menor e mais direta, mas nao entrega ainda descoberta de desafios pela interface.

* **Decisão:** Reutilizar `ChallengingService` para consumir o novo endpoint de navegacao.
* **Alternativas consideradas:** Criar um `ChallengeNavigatorService` dedicado.
* **Motivo da escolha:** Com apenas um endpoint novo de apoio ao header, um service separado aumentaria a superficie sem ganho proporcional.
* **Impactos / trade-offs:** O adapter `ChallengingService` cresce um pouco, mas o escopo reduzido continua controlado.

* **Decisão:** Tratar dirty state como diferenca entre o rascunho salvo e `challenge.code`.
* **Alternativas consideradas:** Criar estado global novo no `ChallengeStore`.
* **Motivo da escolha:** A codebase ja persiste o rascunho local por desafio e isso fornece evidencia concreta do estado alterado.
* **Impactos / trade-offs:** O guard fica dependente do `localStorage`, mas evita aumentar o store global sem necessidade.

* **Decisão:** Limitar a navegacao sequencial a desafios sem estrela.
* **Alternativas consideradas:** Permitir navegacao tambem em desafios de estrela ou privados.
* **Motivo da escolha:** Esse e o universo definido para esta iteracao de navegacao sequencial no modulo `challenging`.
* **Impactos / trade-offs:** A feature nao cobre outros contextos de desafio nesta iteracao.

* **Decisão:** Nao chamar `fetchChallengeNavigation` quando a pagina estiver exibindo um desafio de estrela.
* **Alternativas consideradas:** Chamar o endpoint e apenas ignorar o retorno `null` no client.
* **Motivo da escolha:** O fluxo de navegacao sequencial nao se aplica a desafios de estrela, entao a chamada seria redundante e aumentaria acoplamento sem valor funcional.
* **Impactos / trade-offs:** O SSR da pagina passa a devolver `previousChallengeSlug` e `nextChallengeSlug` como `null` nesses casos, deixando explicito que a navegacao sequencial esta indisponivel.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
Next.js page
  |
  v
challengingActions.accessChallengePage()
  |
  v
AccessChallengePageAction
  |-- ChallengingService.fetchChallengeBySlug(slug)
  `-- se challenge.starId for null:
        ChallengingService.fetchChallengeNavigation(slug)
          |
          v
        Server REST
          |
          v
        FetchChallengeNavigationController
          |
          v
        GetChallengeNavigationUseCase
          |
          v
        SupabaseChallengesRepository.findChallengeNavigationBySlug()

Usuario clica em Anterior/Proximo
  |
  v
useChallengePage.handlePrevious/NextChallengeClick()
  |
  v
useChallengeNavigationGuard.requestNavigation(route)
   |-- sem dirty -> router.goTo(route)
   `-- com dirty -> AlertDialog
          |-- cancelar -> permanece na pagina
          `-- confirmar -> remove draft local e navega
```

* **Fluxo Cross-app (se aplicável):**

```ascii
apps/web -> HTTP REST -> apps/server -> packages/core -> apps/server database
```

* **Layout (se aplicável):**

```ascii
+--------------------------------------------------------------+
| [Back] [Titulo do desafio] [Anterior] [Proximo]              |
+--------------------------------------------------------------+
| challenge layout atual                                       |
| tabs / result / comments / solutions | code editor           |
+--------------------------------------------------------------+
```

* **Referências:**
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/ChallengePageView.tsx`
  - `apps/web/src/ui/global/widgets/components/Tooltip/index.tsx`
  - `apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`
  - `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
  - `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`

---

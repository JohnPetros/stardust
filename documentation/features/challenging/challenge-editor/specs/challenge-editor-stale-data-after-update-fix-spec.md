---
title: Correcao de stale data na pagina do desafio apos update
prd: documentation/features/challenging/challenge-editor/prd.md
issue: documentation/features/challenging/challenge-editor/reports/challenge-editor-stale-data-after-update-bug-report.md
apps: web
status: open
last_updated_at: 2026-04-24
---

# 1. Objetivo

Corrigir o fluxo de retorno do Challenge Editor para que a pagina do desafio sempre exiba o snapshot mais recente apos um update bem-sucedido, mesmo quando o titulo nao muda e a navegacao retorna para a mesma `slug`. A implementacao deve alinhar `core` e `web`: no `core`, garantir que o payload retornado pelo update reflita o estado persistido mais recente; no `web`, sincronizar hidratacao client-side e desabilitar cache nas actions de acesso afetadas para evitar stale data.

---

# 2. Escopo

## 2.1 In-scope

- Sincronizar a store client-side do desafio com o `challengeDto` recebido pela pagina do desafio quando houver divergencia entre o snapshot server-side e o estado atual.
- Garantir que alteracoes persistidas em descricao, codigo, casos de teste, categorias e visibilidade aparecam apos salvar no Challenge Editor, independentemente de mudanca de `title`/`slug`.
- Garantir no `core` que `UpdateChallengeUseCase` retorne o estado persistido apos `replace(...)`, evitando retornar snapshot potencialmente defasado do pre-update.
- Desabilitar cache de leitura nas actions de acesso da pagina de desafio (publica/autenticada) e no acesso ao editor para reduzir risco de stale data no retorno imediato apos update.
- Manter o fluxo atual de acesso via `AccessChallengePageAction` e a estrutura da pagina `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`.

## 2.2 Out-of-scope

- Alteracoes em contratos REST, controllers, repositories ou banco de dados do modulo `challenging`.
- Mudancas no fluxo de criacao de desafios.
- Mudancas na navegacao do editor para usar hard reload, refresh global da pagina ou invalidacao manual fora do widget da pagina do desafio.

---

# 3. Requisitos

## 3.1 Funcionais

- A pagina do desafio deve refletir o conteudo persistido mais recente apos um update realizado no Challenge Editor.
- A correcao deve funcionar quando o usuario altera apenas campos diferentes de `title`.
- O comportamento de acesso e fetch atual da pagina do desafio deve ser preservado.

## 3.2 Nao funcionais

- Compatibilidade retroativa: a correcao nao deve alterar os contratos existentes entre `web`, `rest`, `core` e `database`.
- Resiliencia de estado: a store compartilhada nao deve permanecer com snapshot stale quando a pagina receber um `challengeDto` mais recente para o mesmo desafio.
- Performance: a sincronizacao deve ocorrer apenas quando houver divergencia real entre props e store, evitando reidratar o desafio sem necessidade a cada render.

---

# 4. O que ja existe?

## Camada REST (Services)

* **`ChallengingService`** (`apps/web/src/rest/services/ChallengingService.ts`) - *Ja envia `updateChallenge(challenge)` com o `challenge.dto` completo para o backend.*

## Camada RPC (Actions)

* **`AccessChallengePageAction`** (`apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`) - *Busca o desafio por `slug` e retorna um `challengeDto` fresco para a pagina de desafio.*

## Camada UI (Widgets)

* **`useChallengeEditorPage`** (`apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts`) - *Executa o update e redireciona para a rota do desafio apos sucesso.*
* **`ChallengePage`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`) - *Recebe `challengeDto` via props e delega a hidratacao para `useChallengePage`.*
* **`useChallengePage`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`) - *Concentra a hidratacao do desafio, o uso da store e a logica que hoje so inicializa o estado quando `challenge` e nulo.*

## Camada UI (Stores)

* **`ChallengeStore`** (`apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`) - *Exibe o slice do desafio e disponibiliza `setChallenge` e `resetStore`.*
* **`useZustandChallengeStore`** (`apps/web/src/ui/challenging/stores/zustand/useZustandChallengeStore.ts`) - *Implementa a store compartilhada com `state.challenge` persistido no ciclo de navegacao do modulo.*

## Camada Next.js App (Pages, Layouts)

* **`Page`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`) - *Carrega `challengeDto` atualizado via action server-side e o repassa ao widget client `ChallengePage`.*

---

# 5. O que deve ser criado?

**Nao aplicavel**.

---

# 6. O que deve ser modificado?

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
* **Mudanca:** Substituir a hidratacao baseada apenas em `!challenge` por uma sincronizacao que compare o `challengeDto` recebido com o `challenge` atual da store e reidrate o estado quando o snapshot server-side estiver mais novo ou divergente.
* **Justificativa:** O `challengeDto` atualizado ja chega na borda do `web`, mas hoje e ignorado se a store ja contem um desafio anterior, o que produz stale data apos editar e voltar para a mesma `slug`.
* **Camada:** `ui`

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
* **Mudanca:** Manter a inicializacao de `userVote`, `craftsVisibility` e demais estados derivados compativeis com o desafio sincronizado, sem resetar indevidamente estados client-side quando props e store representarem o mesmo snapshot.
* **Justificativa:** A correcao precisa atacar apenas a divergencia de snapshot sem degradar o comportamento existente de votacao, navegacao e estados locais do widget.
* **Camada:** `ui`

## Camada RPC (Actions)

* **Arquivo:** `apps/web/src/rpc/next-safe-action/challengingActions.ts`
* **Mudanca:** Desabilitar cache de leitura nas actions `accessChallengePage`, `accessAuthenticatedChallengePage` e `accessChallengeEditorPage` para forcar leitura fresca apos update.
* **Justificativa:** Mesmo com sincronizacao correta no client, respostas cacheadas na borda web podem reintroduzir stale data imediatamente apos salvar no editor.
* **Camada:** `rpc`

## Camada Core (Use Cases)

* **Arquivo:** `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`
* **Mudanca:** Apos persistir com `replace(...)`, reler o desafio por id e retornar o snapshot persistido no payload final do update.
* **Justificativa:** O fluxo de retorno para o `web` deve refletir exatamente o estado que ficou no repositorio, inclusive quando a `slug` permanece igual e apenas campos editaveis sao alterados.
* **Camada:** `core`

---

# 7. O que deve ser removido?

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao**
  - Corrigir o bug com ajuste combinado de `core` + `web`: retorno consistente no `UpdateChallengeUseCase`, cache desabilitado nas actions de acesso e sincronizacao da store em `useChallengePage`.
* **Alternativas consideradas**
  - Forcar `window.location.reload()` apos update.
  - Resetar a store no editor antes do redirecionamento.
  - Alterar contratos de backend para devolver algum mecanismo extra de invalidacao.
* **Motivo da escolha**
  - O dado precisa estar fresco em toda a cadeia de retorno. Apenas ajustar hidratacao client-side nao cobre cenarios em que o payload de update ou a leitura server-side imediata estejam defasados por cache/snapshot anterior.
* **Impactos / trade-offs**
  - A logica de comparacao entre props e store precisa ser cuidadosa para nao sobrescrever estados client-side legitimos quando nao houver divergencia real.
  - A leitura sem cache nas actions prioriza consistencia pos-update em detrimento de possivel reducao marginal de hit de cache nessas rotas.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```ascii
[Challenge Editor]
        |
        v
[useChallengeEditorPage.handleSubmit]
        |
        v
[ChallengingService.updateChallenge]
        |
        v
[UpdateChallengeController]
        |
        v
[UpdateChallengeUseCase]
        |
        v
[SupabaseChallengesRepository.replace]
        |
        v
      [DB]
        |
        v
[Next.js challenge page]
        |
        v
[AccessChallengePageAction -> challengeDto fresco]
        |
        v
[ChallengePage/useChallengePage]
        |
        +--> estado atual == snapshot recebido ? manter store atual
        |
        `--> estado atual diverge do snapshot recebido ? setChallenge(Challenge.create(challengeDto))
```

* **Fluxo Cross-app (se aplicavel):**

**Nao aplicavel**.

* **Layout (se aplicavel):**

```ascii
apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx
`- ChallengePage
   `- useChallengePage
      |- recebe challengeDto da page server-side
      |- le challenge atual da ChallengeStore
      `- sincroniza store quando snapshot divergir
```

* **Referencias:**
  - `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
  - `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts`
  - `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts`
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`
  - `apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`
  - `apps/web/src/ui/challenging/stores/zustand/useZustandChallengeStore.ts`
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
  - `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`

---

# 10. Pendencias / Duvidas

**Sem pendencias**.

---

## Restricoes

* **Nao inclua testes automatizados na spec.**
* Todos os caminhos citados devem existir no projeto **ou** estar explicitamente marcados como **novo arquivo**.
* **Nao invente** arquivos, metodos, contratos, schemas ou integracoes sem evidencia no PRD/codebase.
* **Nao proponha acoplamento cross-domain no `core` sem evidencia explicita na codebase.** Se a necessidade for autenticacao, autorizacao, ownership, montagem de contexto ou adaptacao de transporte, prefira manter isso na borda da app quando esse ja for o padrao encontrado.
* **Nao use o `core` para resolver conveniencias da app.** Se uma responsabilidade pertence a `middleware`, `controller`, `toolset`, `router` ou adapter local, a spec nao deve empurra-la para `use case` apenas para “centralizar”.
* **Nao exponha em schemas de entrada campos controlados pelo servidor** quando o fluxo do PRD exigir que esses valores sejam definidos internamente.
* Quando faltar informacao suficiente, registrar em **Pendencias / Duvidas** e usar a tool `question` se necessario.
* Toda referencia a codigo existente deve incluir caminho relativo real.
* Se uma secao nao se aplicar, preencher explicitamente com **Nao aplicavel**.
* A spec deve ser consistente com os padroes ja existentes na codebase (nomenclatura, organizacao de pastas, contratos e convencoes por camada).

---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
status: closed
---

## Pendencias (quando aplicavel)

- [ ] Nenhuma pendencia bloqueante identificada no bug report de entrada.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Consolidar no core os criterios de integridade do update de desafio para servir como contrato da correcao client-side. | - | - |
| F3 | Corrigir sincronizacao de estado no `web` para sempre refletir o `challengeDto` fresco apos update. | F1 | - |

> **Estratégia de paralelismo:** sempre comece pelo core (domínio, structures e use cases). Assim que o core estiver concluído, a fase `web` pode ser executada, pois depende apenas do contrato definido no core.

---

## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Definir o contrato do domínio — entidades, structures, interfaces de repositório/provider e use cases — sem nenhuma dependência de infraestrutura. Essa fase desbloqueia F3.

### Tarefas

- [x] **T1.1** — Cobrir no core o cenario de update sem mudanca de titulo
  - **Depende de:** -
  - **Resultado observavel:** os testes de `UpdateChallengeUseCase` passam a garantir explicitamente que alteracoes em `description`, `code`, `testCases`, `categories` e `isPublic` sao persistidas mesmo quando `title`/`slug` nao mudam.
  - **Camada:** `core`
  - **Artefatos:** `packages/core/src/challenging/use-cases/tests/UpdateChallengeUseCase.test.ts`
  - **Concluido em:** 2026-04-22

- [x] **T1.2** — Formalizar no core o contrato de payload atualizado apos update
  - **Depende de:** T1.1
  - **Resultado observavel:** o resultado consumido pela borda web para leitura de desafio permanece consistente com o estado persistido apos update no mesmo `slug`, sem perda de campos editaveis.
  - **Camada:** `core`
  - **Artefatos:** `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`, `packages/core/src/challenging/use-cases/tests/UpdateChallengeUseCase.test.ts`
  - **Concluido em:** 2026-04-22

---

## F3 — Web: UI e Integração

> ⚡ Inicia após F1 estar concluída.

**Objetivo:** Implementar a interface e integração client-side na aplicação web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T3.1** — Ajustar hidratacao do `useChallengePage` para reconciliar props com store
  - **Depende de:** T1.2
  - **Resultado observavel:** ao abrir a pagina com `challengeDto` diferente do estado atual em store, o hook atualiza o store com o payload novo, inclusive quando a navegacao retorna para a mesma `slug`.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
  - **Concluido em:** 2026-04-22

- [x] **T3.2** — Preservar estado client-side quando nao houver divergencia de payload
  - **Depende de:** T3.1
  - **Resultado observavel:** em navegacoes sem alteracao real de dados, o hook nao sobrescreve o estado local desnecessariamente e mantem o comportamento atual da pagina.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
  - **Concluido em:** 2026-04-22

- [x] **T3.3** — Cobrir em testes do widget os cenarios de estado stale e estado estavel
  - **Depende de:** T3.1, T3.2
  - **Resultado observavel:** existe teste automatizado validando que (a) dados atualizados apos edicao na mesma `slug` passam a ser exibidos e (b) payload identico nao dispara reidratacao redundante.
  - **Camada:** `web`
  - **Artefatos:** `apps/web/src/ui/challenging/widgets/pages/Challenge/tests/useChallengePage.test.ts`
  - **Concluido em:** 2026-04-22

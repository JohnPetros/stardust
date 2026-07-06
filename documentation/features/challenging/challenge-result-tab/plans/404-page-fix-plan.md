---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

Sem pendencias.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Validar que a correcao nao exige alteracoes em dominio, structures ou use cases e consolidar o contrato reutilizado pelo app `web` | - | - |
| F3 | Implementar a correcao de roteamento no App Router do `web`, reutilizando a mesma composicao server-side da rota base e preservando os slots paralelos existentes | F1 | - |

> **Estratégia de paralelismo:** sempre comece pelo core (domínio, structures e use cases). Nesta spec, F1 apenas confirma que nao ha impacto em `core`, `server`, `studio` ou infraestrutura. Com esse contrato preservado, toda a implementacao segue concentrada em `web`.

---

## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Confirmar que a correcao da rota publica de resultado nao exige novos artefatos nem alteracoes em dominio, structures, interfaces, use cases ou contratos compartilhados. Essa fase formaliza que a implementacao depende apenas da borda de roteamento do App Router no `web`.

### Tarefas

- [x] Nenhuma tarefa de implementacao nesta fase. A spec define explicitamente que nao ha alteracoes em `core`, `server`, `actions`, `services`, `DTOs`, `ChallengeStore`, `ChallengeResultSlot` ou `ChallengeCodeEditorSlot`.

---

## F3 — Web: UI e Integração

**Objetivo:** Corrigir a resolucao de `/challenging/challenges/[challengeSlug]/challenge/result` no App Router do `web`, extraindo o carregamento server-side compartilhado da pagina de challenge e adicionando a rota publica que preserva `ChallengeLayout`, `ChallengePage`, `@tabContent/result` e `@codeEditor/default`.

### Tarefas

- [x] **T3.1** — criar `ChallengePageContent` como composicao server-side compartilhada da pagina de challenge
  - **Depende de:** -
  - **Resultado observavel:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/ChallengePageContent.tsx` concentra a leitura de `params.challengeSlug`, cookie de acesso, escolha entre `accessAuthenticatedChallengePage` e `accessChallengePage`, e renderiza `ChallengePage` com as mesmas props atualmente usadas pela rota base.
  - **Camada:** `web`

- [x] **T3.2** — criar a pagina publica `/challenge/result` no slot implicito `children`
  - **Depende de:** T3.1
  - **Resultado observavel:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/result/page.tsx` passa a existir e renderiza `ChallengePageContent`, permitindo hard navigation e refresh em `/challenging/challenges/[challengeSlug]/challenge/result` sem perder `ChallengeLayout`, `tabContent` e `codeEditor`.
  - **Camada:** `web`

- [x] **T3.3** — delegar a rota base de challenge para `ChallengePageContent`
  - **Depende de:** T3.1
  - **Resultado observavel:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx` deixa de carregar o desafio inline e reaproveita `ChallengePageContent`, garantindo a mesma logica autenticada/publica tanto para `/challenge` quanto para `/challenge/result`.
  - **Camada:** `web`

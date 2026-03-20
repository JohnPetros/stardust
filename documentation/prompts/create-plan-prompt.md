---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

- [ ] <descricao da pendencia ou ambiguidade encontrada na spec>

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | <definir> | - | - |
| F2 | <definir> | F1 | F3, F4 |
| F3 | <definir> | F1 | F2, F4 |
| F4 | <definir> | F1 | F2, F3 |

> **Estratégia de paralelismo:** sempre comece pelo core (domínio, structures e use cases). Assim que o core estiver concluído, as fases de `server`, `web` e `studio` podem ser executadas em paralelo, pois todas dependem apenas do contrato definido no core.

---

## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Definir o contrato do domínio — entidades, structures, interfaces de repositório/provider e use cases — sem nenhuma dependência de infraestrutura. Essa fase desbloqueia F2, F3 e F4 para rodarem em paralelo.

### Tarefas

- [ ] **T1.1** — <nome da tarefa>
  - **Depende de:** -
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core`

- [ ] **T1.2** — <nome da tarefa>
  - **Depende de:** T1.1
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositórios e Handlers

> ⚡ Pode rodar em paralelo com F3 e F4 após F1 estar concluída.

**Objetivo:** Implementar a camada de infraestrutura e exposição — repositórios, providers, jobs e handlers RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **T2.1** — <nome da tarefa>
  - **Depende de:** T1.2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core` | `database` | `rpc` | `rest` | `queue` | `ui`

---

## F3 — Web: UI e Integração

> ⚡ Pode rodar em paralelo com F2 e F4 após F1 estar concluída.

**Objetivo:** Implementar a interface e integração client-side na aplicação web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **T3.1** — <nome da tarefa>
  - **Depende de:** T1.2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core` | `database` | `rpc` | `rest` | `queue` | `ui`

---

## F4 — Studio: UI e Integração

> ⚡ Pode rodar em paralelo com F2 e F3 após F1 estar concluída.

**Objetivo:** Implementar a interface e integração client-side na aplicação studio — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **T4.1** — <nome da tarefa>
  - **Depende de:** T1.2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core` | `database` | `rpc` | `rest` | `queue` | `ui`
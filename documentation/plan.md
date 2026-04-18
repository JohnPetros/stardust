---
title: <titulo descritivo do plano>
feature: <dominio>/<nome-da-feature>
spec: documentation/features/<dominio>/specs/<nome>-spec.md
status: open
last_updated_at: <YYYY-MM-DD>
---

# Plano: <Titulo Descritivo>

## Pendencias (quando aplicavel)

- [ ] <descricao da pendencia ou ambiguidade encontrada na spec>

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Core: dominio, structures e use cases | - | - |
| F2 | Server: infra, repositorios e handlers | F1 | F3, F4 |
| F3 | Web: UI e integracao | F1 | F2, F4 |
| F4 | Studio: UI e integracao | F1 | F2, F3 |

> **Estrategia de paralelismo:** sempre comece pelo core. Assim que F1 estiver concluida, F2, F3 e F4 podem ser executadas em paralelo — todas dependem apenas dos contratos definidos no core.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio — entidades, structures, interfaces de repositorio/provider e use cases — sem nenhuma dependencia de infraestrutura. Essa fase desbloqueia F2, F3 e F4 para rodarem em paralelo.

### Tarefas

- [ ] **F1-T1** — <nome da tarefa>
  - **Depende de:** -
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core`

- [ ] **F1-T2** — <nome da tarefa>
  - **Depende de:** F1-T1
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios e Handlers

> ⚡ Pode rodar em paralelo com F3 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a camada de infraestrutura e exposicao — repositorios, providers, jobs e handlers RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **F2-T1** — <nome da tarefa>
  - **Depende de:** F1-T2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `database` | `rpc` | `rest` | `queue` | `provision`

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **F3-T1** — <nome da tarefa>
  - **Depende de:** F1-T2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `ui` | `rpc` | `rest` | `web`

---

## F4 — Studio: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F3 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao studio — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **F4-T1** — <nome da tarefa>
  - **Depende de:** F1-T2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `ui` | `rpc` | `rest` | `studio`

---

## Divergencias em relacao a Spec

> Registre aqui decisoes tomadas durante a implementacao que divergem do que esta descrito na spec.

- (nenhuma ate o momento)

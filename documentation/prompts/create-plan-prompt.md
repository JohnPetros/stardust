## Pendencias (quando aplicavel)

- [ ] <descricao da pendencia ou ambiguidade encontrada na spec>

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | <definir> | - | - |
| F2 | <definir> | F1 | - |

---

## F1 — <Nome da Fase>

**Objetivo:** <descricao objetiva do que essa fase entrega>

### Tarefas

- [ ] **T1.1** — <nome da tarefa>
  - **Depende de:** -
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core` | `infra` | `rpc` | `rest` | `ui` | `queue` | `database`

- [ ] **T1.2** — <nome da tarefa>
  - **Depende de:** T1.1
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core` | `infra` | `rpc` | `rest` | `ui` | `queue` | `database`

---

## F2 — <Nome da Fase>

**Objetivo:** <descricao objetiva do que essa fase entrega>

### Tarefas

- [ ] **T2.1** — <nome da tarefa>
  - **Depende de:** T1.2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core` | `infra` | `rpc` | `rest` | `ui` | `queue` | `database`
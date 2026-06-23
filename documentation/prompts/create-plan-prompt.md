---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica ou bug report.
---

# Prompt: Criar Plano

**Objetivo:** Transformar uma Spec técnica ou Bug Report em um **plano de implementação estruturado**, dividido em fases e tarefas atômicas, com dependências explícitas e resultados observáveis por tarefa. O plano deve ser diretamente acionável por um desenvolvedor ou agente de implementação.

---

## Entrada

Exatamente um dos seguintes documentos deve ser fornecido:

- **Spec técnica** (`documentation/features/{dominio}/specs/{nome}-spec.md`) — para features, refatorações ou correções com spec prévia.
- **Bug Report** (`documentation/features/{dominio}/reports/{nome}-bug-report.md`) — para correções onde a spec foi derivada diretamente do bug report.

> Se nenhum dos dois for fornecido, ou se o documento estiver incompleto, não inicie o plano. Registre a lacuna em **Pendências** e solicite o documento correto.

---

## Diretrizes de Execução

### 1. Leitura do Documento de Entrada

- Leia integralmente a Spec ou o Bug Report fornecido.
- Identifique:
  - Quais apps serão tocados (`server`, `web`, `studio`)
  - Quais camadas serão envolvidas por app
  - Dependências entre os artefatos a serem criados, modificados ou removidos
  - Pendências ou ambiguidades que impediriam a implementação

### 2. Definição de Fases

- Sempre inicie pelo **core** (F1): domínio, structures e use cases.
- Crie uma fase por app tocado (F2 para `server`, F3 para `web`, F4 para `studio`).
- Omita fases de apps que não forem impactados pelo documento de entrada.
- Fases de app (F2, F3, F4) só podem iniciar após F1 estar concluída e podem rodar em paralelo entre si.

### 3. Definição de Tarefas de Implementação

- Cada tarefa deve ser **atômica** — uma única responsabilidade, um único artefato.
- O **resultado observável** deve ser verificável sem ambiguidade (ex: "rota retorna 200 com payload X", "widget renderiza estado de erro quando Y").
- A **camada** deve usar exclusivamente os valores: `core`, `database`, `rest`, `provision`, `rpc`, `ui`, `ai`, `queue`, `web`, `studio`.
- As dependências entre tarefas devem refletir a ordem real de implementação.

### 4. Definição de Tarefas de Teste

Cada artefato testável implementado em uma tarefa de implementação deve ser imediatamente seguido por uma **tarefa de teste dedicada**. Isso garante validação incremental da spec e cria uma rede de segurança antes que camadas consumidoras sejam implementadas.

#### 4.1 Escopo permitido

No StarDust, **só é permitido criar testes para**:

- Objetos de domínio (`Entity`, `Structure`, `Aggregate`)
- `Use Case`
- `Handler` (`Controller`, `Job`, `Action`, `Tool`)
- `Widget` (`View`, `Hook`)
- Rotas HTTP da app server (`apps/server`) via testes de integração

**Não crie tarefas de teste** para `repository`, `service`, `provider`, `gateway`, `client`, `mapper`, `factory`, `config`, adaptadores de infraestrutura ou arquivos de composição.

#### 4.2 Regras de inclusão

- Toda tarefa que cria ou modifica um artefato testável (conforme escopo acima) **deve** ser seguida por uma tarefa de teste.
- Tarefas que criam artefatos fora do escopo testável (ex: `repository`, `provider`, `mapper`) **não** geram tarefa de teste — a cobertura será indireta, via testes do handler, use case ou widget que os consome.
- A tarefa de teste **depende** da tarefa de implementação correspondente.
- O prefixo da tarefa de teste usa o mesmo ID base com sufixo `t` (ex: `T1.1` implementa → `T1.1t` testa).

#### 4.3 Resultado observável de tarefas de teste

O resultado observável de uma tarefa de teste deve descrever os cenários cobertos, derivados da spec. Exemplo:

```
Resultado observável: testes de `AudioVoice` passando, cobrindo criação com
valor válido, criação com default `panda`, e rejeição de valor fora do enum.
```

#### 4.4 Rules de referência

Cada tarefa de teste deve indicar qual arquivo de regras de teste deve ser consultado antes da execução:

| Tipo de artefato | Arquivo de regras |
|---|---|
| Objetos de domínio | `documentation/rules/domain-objects-testing-rules.md` |
| Use cases | `documentation/rules/use-cases-testing-rules.md` |
| Handlers | `documentation/rules/handlers-testing-rules.md` |
| Rotas HTTP do server | `documentation/rules/server-routes-testing-rules.md` |
| Widgets | `documentation/rules/widget-tests-rules.md` |

### 5. Pendências

- Registre qualquer ambiguidade, informação ausente ou decisão não resolvida que possa bloquear a implementação.
- Cada pendência deve descrever o impacto e a ação necessária para resolvê-la.

---

## Saída

Salve o plano final em `documentation/plan.md`, seguindo **estritamente** o template abaixo.

```md
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

**Objetivo:** Definir o contrato do domínio — entidades, structures, interfaces de repositório/provider e use cases — sem nenhuma dependência de infraestrutura. Essa fase desbloqueia F2, F3 e F4 para rodarem em paralelo. Os testes do core funcionam como contrato executável: quando as fases de app iniciarem, quebras de contrato serão detectadas imediatamente.

### Tarefas

- [ ] **T1.1** — <implementar artefato de domínio>
  - **Depende de:** -
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core`

- [ ] **T1.1t** — <testar artefato de domínio>
  - **Depende de:** T1.1
  - **Resultado observavel:** <cenários cobertos, derivados da spec>
  - **Camada:** `core`
  - **Rules:** `documentation/rules/domain-objects-testing-rules.md`

- [ ] **T1.2** — <implementar use case>
  - **Depende de:** T1.1
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `core`

- [ ] **T1.2t** — <testar use case>
  - **Depende de:** T1.2
  - **Resultado observavel:** <cenários cobertos, derivados da spec>
  - **Camada:** `core`
  - **Rules:** `documentation/rules/use-cases-testing-rules.md`

---

## F2 — Server: Infra, Repositórios e Handlers

> ⚡ Pode rodar em paralelo com F3 e F4 após F1 estar concluída.

**Objetivo:** Implementar a camada de infraestrutura e exposição — repositórios, providers, jobs e handlers RPC/REST — consumindo os contratos definidos no core. Tarefas de repositório e provider não geram tarefa de teste direta; a cobertura é garantida pelos testes dos handlers que os consomem.

### Tarefas

- [ ] **T2.1** — <implementar repositório ou provider>
  - **Depende de:** T1.2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `database` | `provision`

- [ ] **T2.2** — <implementar handler>
  - **Depende de:** T2.1
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `rest` | `rpc` | `queue`

- [ ] **T2.2t** — <testar handler>
  - **Depende de:** T2.2
  - **Resultado observavel:** <cenários cobertos, derivados da spec>
  - **Camada:** `rest` | `rpc` | `queue`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

---

## F3 — Web: UI e Integração

> ⚡ Pode rodar em paralelo com F2 e F4 após F1 estar concluída.

**Objetivo:** Implementar a interface e integração client-side na aplicação web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **T3.1** — <implementar widget>
  - **Depende de:** T1.2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `ui`

- [ ] **T3.1t** — <testar widget>
  - **Depende de:** T3.1
  - **Resultado observavel:** <cenários cobertos, derivados da spec>
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`

---

## F4 — Studio: UI e Integração

> ⚡ Pode rodar em paralelo com F2 e F3 após F1 estar concluída.

**Objetivo:** Implementar a interface e integração client-side na aplicação studio — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [ ] **T4.1** — <implementar widget>
  - **Depende de:** T1.2
  - **Resultado observavel:** <o que deve ser verdadeiro ao concluir>
  - **Camada:** `ui`

- [ ] **T4.1t** — <testar widget>
  - **Depende de:** T4.1
  - **Resultado observavel:** <cenários cobertos, derivados da spec>
  - **Camada:** `ui`
  - **Rules:** `documentation/rules/widget-tests-rules.md`
```
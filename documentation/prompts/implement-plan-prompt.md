---
description: Implementar no codebase um plano de implementacao derivado de uma spec tecnica, seguindo a arquitetura e diretrizes do Stardust.
---

# Prompt: Implementar Plano

**Objetivo principal:** Implementar no codebase um plano de implementacao derivado de uma spec tecnica, seguindo a arquitetura e diretrizes do Stardust, **respeitando rigorosamente a ordem de fases e tarefas definidas no plano para maximizar a paralelizacao e evitar retrabalho.**

## Entrada

- Plano ativo em `documentation/plan.md` — esse e o ponto de entrada padrao.
- Se um caminho alternativo for fornecido explicitamente, use-o no lugar de `documentation/plan.md`.
- Se nao houver plano, use a spec tecnica como entrada e gere o plano antes de implementar.

> O `plan.md` pode estar **novo** (nenhuma tarefa iniciada) ou **em andamento** (execucao anterior parcialmente concluida). O prompt deve lidar com ambos os casos — veja Secao 1.1.

---

## Diretrizes de execucao

### 1. Pre-check (obrigatorio)

**1.1 Leitura do plano e deteccao de estado**

Leia o `plan.md` na integra antes de escrever qualquer linha de codigo. Identifique: escopo, fases, mapa de paralelizacao, gargalos, criterios de aceite, riscos e pendencias. Se o documento estiver incompleto, nao invente: crie uma secao `Pendencias` e avance apenas com defaults seguros.

**Detecte o estado atual do plano** inspecionando os checkboxes e anotações das tarefas:

| Condicao no `plan.md` | Acao |
|---|---|
| Todas as tarefas com `- [ ]` sem anotação | Plano novo — inicialize o tracking e comece pela primeira tarefa. |
| Alguma tarefa com `- [x]` ou `⚠️ bloqueado` | Plano em andamento — **retome a partir da primeira tarefa `- [ ]` nao bloqueada**. |
| Todas as tarefas com `- [x]` | Plano concluido — informe e nao reexecute. |

Ao retomar um plano em andamento:
- Trate tarefas `- [x]` como **ja concluidas** — nao as reimplemente.
- Verifique se os artefatos registrados em tarefas `- [x]` realmente existem na codebase antes de prosseguir; se estiverem ausentes, marque a tarefa como reaberta e reimplemente.
- Tarefas `⚠️ bloqueado` so devem ser retomadas se o bloqueio foi resolvido — confirme antes de avancar.

**1.2 Leitura da codebase existente**

Use **Serena** para localizar implementacoes similares nas mesmas camadas impactadas — use-as como referencia de padrao e nomenclatura.

> Nao assuma que um arquivo existe ou tem determinada assinatura sem verificar na codebase. Implementar com base em suposicoes gera conflitos e retrabalho.

**1.3 Leitura das regras das camadas impactadas**

Antes de implementar qualquer camada, leia as regras correspondentes consultando o indice em `documentation/rules/rules.md`. Em geral, as mais comuns no Stardust sao:

- `documentation/rules/core-package-rules.md` — DTOs, Entidades, Interfaces e Use Cases
- `documentation/rules/database-rules.md` — Repositories, Mappers e persistencia
- `documentation/rules/rpc-layer-rules.md` — Actions e integracao com use cases
- `documentation/rules/rest-layer-rules.md` — Services e Controllers REST
- `documentation/rules/queue-layer-rules.md` — Jobs e processamento assincrono
- `documentation/rules/provision-layer-rules.md` — Providers e integracoes externas
- `documentation/rules/ui-layer-rules.md` — Widgets e paginas (padrao Widget: View + Hook + Index)
- `documentation/rules/web-application-rules.md` — Convencoes especificas do app `web`
- `documentation/rules/server-application-rules.md` — Convencoes especificas do app `server`
- `documentation/rules/studio-appllication-rules.md` — Convencoes especificas do app `studio`
- `documentation/rules/code-conventions-rules.md` — Nomenclatura e organizacao geral

> Leia apenas as regras das camadas que serao tocadas nesta execucao. Nao pule esta etapa — padroes existentes devem ser preservados.

---

### 2. Inicializacao do tracking (obrigatorio)

O `plan.md` e a fonte de verdade do progresso — os checkboxes das tarefas sao o tracking. Nao existe lista separada.

**Se o plano for novo**, use a todo tool para espelhar todas as tarefas do `plan.md` antes de iniciar, com os identificadores exatos (ex: `F1-T1`). A todo
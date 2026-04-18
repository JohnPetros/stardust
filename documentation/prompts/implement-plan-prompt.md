---
description: Implementar no codebase um plano de implementacao derivado de uma spec tecnica, seguindo a arquitetura e diretrizes do Stardust.
---

# Prompt: Implementar Plano

**Objetivo principal:** Implementar no codebase um plano de implementacao derivado de uma spec tecnica, seguindo a arquitetura e diretrizes do Stardust, **respeitando rigorosamente a ordem de fases e tarefas definidas no plano para maximizar a paralelizacao e evitar retrabalho.**

## Entrada

- Caminho do arquivo `plan.md` (Markdown) **ou**, se nao houver plano, caminho da spec tecnica (Markdown).

> O `plan.md` pode estar **novo** (nenhuma tarefa iniciada) ou **em andamento** (execucao anterior parcialmente concluida). O prompt deve lidar com ambos os casos — veja Secao 1.1.

---

## Diretrizes de execucao

### 1. Pre-check (obrigatorio)

**1.1 Leitura do plano e deteccao de estado**

Leia o `plan.md` na integra antes de escrever qualquer linha de codigo. Identifique: escopo, fases, mapa de paralelizacao, gargalos, criterios de aceite, riscos e pendencias. Se o documento estiver incompleto, nao invente: crie uma secao `Pendencias` e avance apenas com defaults seguros.

**Detecte o estado atual do plano** inspecionando os checkboxes e anotacoes das tarefas:

| Condicao no `plan.md` | Acao |
|---|---|
| Todas as tarefas com `- [ ]` sem anotacao | Plano novo — inicialize o tracking e comece pela primeira tarefa. |
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

**Se o plano for novo**, use a todo tool para espelhar todas as tarefas do `plan.md` antes de iniciar, com os identificadores exatos (ex: `F1-T1`). A todo tool e auxiliar — o estado canonico sempre vive no `plan.md`.

**Se o plano estiver em andamento**, sincronize a todo tool com o estado atual do `plan.md`:
- Tarefas `- [x]` → marque como `done` na todo tool.
- Tarefas `⚠️ bloqueado` → marque como `blocked` na todo tool.
- Tarefas `- [ ]` restantes → marque como `pending` na todo tool.

A cada mudanca de estado, atualize **ambos** em sincronia: primeiro o `plan.md`, depois a todo tool.

> Nunca inicie uma nova tarefa sem ter atualizado o `plan.md` e a todo tool com o estado da tarefa atual.

---

### 3. Ordem de execucao e paralelizacao (obrigatorio)

**Respeite o mapa de paralelizacao do plano.** Cada fase so pode ser iniciada quando todas as suas dependencias estiverem concluidas.

Dentro de cada fase, siga a hierarquia bottom-up:

1. **Core (`packages/core`)** — DTOs, Entidades, Interfaces e Use Cases — estes contratos desbloqueiam todas as outras camadas.
2. **Database** — Repositories e Mappers (ex: `Supabase`) — implementam contratos do `core`.
3. **Provision/Queue** — Gateways e Jobs (ex: `Inngest`) — implementam contratos do `core`, independentes do `database`.
4. **API layer** — Actions (`RPC`) ou Controllers (`REST`) — consomem contratos do `core`.
5. **UI** — Widgets e Paginas — consomem contratos do `core` via Actions/Controllers.

> `database` e `provision/queue` sao independentes entre si e podem ser implementados em paralelo apos o `core` estabilizar. Nunca implemente um consumidor (ex: Widget, Action) antes do contrato (interface, DTO) que ele consome.

**Cada fase e implementada por um subagente — sem excecao.**

Independentemente de a fase ser paralela ou sequencial, **cada fase do plano deve ser delegada a um subagente dedicado**. O agente orquestrador nao implementa codigo diretamente — seu papel e coordenar, passar contexto e consolidar resultados.

- **Fases paralelizaveis** (coluna "Pode rodar em paralelo com" preenchida no plano): dispare os subagentes simultaneamente.
- **Fases sequenciais** (sem paralelismo): dispare um subagente por vez, aguardando a conclusao antes de avancar.

**Contexto obrigatorio no prompt de cada subagente:**

1. O escopo exato da fase: lista de tarefas, artefatos esperados e dependencias.
2. Os contratos do `core` que a fase consome (interfaces, DTOs) — mesmo que ainda nao implementados, forneça as assinaturas definidas na spec para que o subagente possa trabalhar.
3. O conteudo das **regras das camadas impactadas** (`documentation/rules/<camada>-rules.md`) — nao assuma que o subagente lera por conta propria.
4. Os arquivos existentes na codebase relevantes para a fase, localizados com Serena no pre-check (Secao 1.2).
5. O estado atual do `plan.md` — para que o subagente saiba o que ja foi concluido e atualize apenas as tarefas da sua fase.
6. Instrucao explicita para: atualizar o `plan.md` (checkboxes + artefatos) e rodar o ciclo de qualidade (`npm run codecheck`, `npm run typecheck`, `npm run test`) ao concluir cada tarefa.

> ⚠️ Subagentes nao compartilham contexto entre si. Todo o conhecimento necessario para executar a fase deve ser passado explicitamente no prompt de despacho. Um subagente sem contexto suficiente vai adivinhar — e adivinhar gera retrabalho.

**Apos a conclusao de cada subagente**, o orquestrador deve:

1. Verificar se o `plan.md` foi atualizado corretamente pelo subagente.
2. Sincronizar a todo tool com o novo estado do `plan.md`.
3. Confirmar que os artefatos declarados pelo subagente existem na codebase antes de disparar a proxima fase.

**Formato de despacho (instrucao ao subagente):**

```
Fase: <ID e nome da fase>
Tarefas: <lista de IDs e nomes>
Camadas impactadas: <lista de camadas>

Contexto necessario:
- Regras das camadas: <caminhos dos arquivos de regras>
- Contratos do core que esta fase consome: <interfaces/DTOs com assinaturas>
- Implementacoes similares na codebase: <paths relevantes localizados com Serena>
- Estado atual do plan.md: <trecho relevante com checkboxes>

Instrucoes:
1. Siga rigorosamente as regras das camadas indicadas.
2. Implemente apenas o escopo desta fase — nada alem.
3. Ao concluir cada tarefa: atualize o plan.md (checkbox + artefatos) e rode o ciclo de qualidade.
4. Ao concluir a fase, reporte: arquivos criados/alterados, resultado observavel atingido e divergencias em relacao a spec.
```

---

### 4. Ciclo de implementacao por tarefa

Para cada tarefa do plano:

1. **Marque como `in_progress`** na todo tool antes de comecar.
2. **Localize codigo existente semelhante** antes de criar algo novo — use Serena.
3. **Implemente a mudanca minima** que entrega o resultado observavel descrito na tarefa.
4. **Nao acople camadas**: UI nao acessa API diretamente; `core` nao conhece frameworks, banco ou HTTP.
5. **Preserve padroes existentes**: nomenclatura, organizacao de pastas, padrao Widget (View + Hook + Index).
6. **Ao concluir a tarefa**, execute o ciclo de qualidade (Secao 5) antes de avancar.
7. **Atualize o `plan.md`** com `- [x]` e os artefatos gerados (Secao 7).
8. **Marque como `done`** na todo tool.

---

### 5. Ciclo de qualidade (obrigatorio por tarefa)

Ao finalizar cada tarefa, rode os checks abaixo no workspace correspondente e corrija falhas **antes de avancar para a proxima tarefa**:

```bash
# Lint e formatacao
npm run codecheck -w <workspace>

# Tipagem
npm run typecheck -w <workspace>

# Testes
npm run test -w <workspace>
```

Workspaces comuns: `@stardust/core`, `@stardust/web`, `@stardust/server`, `@stardust/studio`.

> Nao avance com o projeto quebrado. Erros de lint, typecheck e falhas de teste devem ser corrigidos imediatamente.

---

### 6. Identificacao de bloqueios

Se uma tarefa nao puder ser implementada por dependencia externa, ambiguidade ou lacuna na spec:

- Sinalize `⚠️ bloqueado` na linha da tarefa no `plan.md` e registre o motivo na secao `Pendencias`.
- Marque como `blocked` na todo tool.
- Avance para a proxima tarefa **nao bloqueada** do plano.
- Nao invente contratos ou comportamentos para contornar o bloqueio.

---

### 7. Atualizacao continua do `plan.md` (obrigatorio)

O arquivo `plan.md` e o documento vivo do progresso. Ele deve ser atualizado **a cada mudanca de estado de uma tarefa** — nao apenas ao final da execucao.

**Ao iniciar uma tarefa**, sinalize na linha da tarefa:
```markdown
- [ ] **[em andamento]** F1-T1 — <Descricao>
```

**Ao concluir uma tarefa**, marque o checklist e registre os artefatos gerados:
```markdown
- [x] **F1-T1** — Criar interface `IAuthService`
  - Artefatos: `packages/core/auth/interfaces/IAuthService.ts` *(novo)*
  - Concluido em: <data>
```

**Ao bloquear uma tarefa**, registre o motivo na secao `Pendencias` e sinalize na linha:
```markdown
- [ ] **F2-T3** — Implementar `AuthSupabaseRepository` ⚠️ bloqueado
  - Motivo: interface `IAuthRepository` ainda nao finalizada (F1-T2 pendente)
```

**Ao identificar divergencias** entre a implementacao e a spec (decisoes de design, ajustes de contrato, comportamentos nao previstos), registre em uma secao `Divergencias` no `plan.md`:
```markdown
## Divergencias em relacao a Spec

- **F2-T2:** `AuthMapper` foi separado em dois arquivos para manter SRP — decisao tomada durante a implementacao.
```

**Ao concluir todas as fases**, atualize o status no frontmatter do `plan.md`:
```markdown
status: open → status: closed
```

> O `plan.md` deve ser legivel como um log de progresso. Qualquer pessoa que abrir o arquivo no meio da execucao deve conseguir entender imediatamente o que foi feito, o que esta em andamento e o que esta bloqueado.

---

### 8. Ferramentas auxiliares

- **MCP Serena:** utilize para buscar arquivos e implementacoes similares no projeto antes de criar algo novo.
- **MCP Context7:** utilize quando houver duvida sobre como usar uma biblioteca especifica (ex: `shadcn/ui`, `radix-ui`, `inngest`, `supabase`, `hono`, `zod`).
- **Todo tool:** utilize para espelhar e sincronizar o estado das tarefas do `plan.md`.

---

### 9. Reporte final

Ao concluir todas as tarefas (ou ao ser bloqueado), produza um reporte com:

```markdown
## Reporte de Implementacao

### Tarefas concluidas
- [x] <F1-T1 — Descricao> — arquivos criados/alterados: `packages/core/...`

### Tarefas pendentes / bloqueadas
- [ ] <F2-T3 — Descricao> — motivo: <descricao do bloqueio>

### Divergencias em relacao a spec
- <Descricao da divergencia e decisao tomada> (ou "Nenhuma")

### Proximos passos
- <Lista de acoes necessarias para desbloqueio ou continuidade>
```

---

## Saida esperada

- Implementacao completa (ou parcial, se bloqueada) do plano no codebase.
- `plan.md` atualizado com checkboxes, artefatos gerados, bloqueios e divergencias refletindo o estado real.
- Todo tool sincronizada com o estado final de cada tarefa.
- Reporte final com arquivos reais criados/alterados, bloqueios justificados e proximos passos.

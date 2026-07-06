# Spec-Driven Development (SDD) no Stardust

## O que é

SDD é o modelo de desenvolvimento adotado pelo Stardust em que **nenhum código é escrito antes de existir uma especificação técnica formal derivada de um PRD**. Toda feature, correção ou refatoração percorre uma cadeia documental rastreável antes de virar código:

```
milestone → PRD → spec técnica → plano de implementação → código → revisão
```

O objetivo é eliminar ambiguidade antes da implementação, permitindo que desenvolvedores e agentes de IA executem tarefas dentro de limites bem definidos.

---

## Pipeline

O pipeline é orquestrado por prompts dedicados em `documentation/prompts/`. Cada prompt cobre uma etapa do ciclo de vida e define entradas, saídas e restrições de forma prescritiva.

### 1. PRD — `create-prd-prompt.md`

**Entrada:** milestone do GitHub, esboço da funcionalidade, screenshots ou código existente.
**Saída:** descrição da milestone atualizada no GitHub.

- A **milestone do GitHub é a única fonte de verdade** do PRD — nunca um arquivo local `prd.md`.
- O prompt detecta automaticamente o modo de operação:
  - **Prospectivo:** feature nova → discovery com perguntas antes de redigir.
  - **Retrospectivo:** feature já implementada → auditoria contra a milestone e a codebase.
- Foco exclusivo em comportamento de produto; sem decisões de arquitetura ou código.
- Divergências entre milestone e implementação são registradas explicitamente, nunca reconciliadas por suposição.

### 2. Spec Técnica — `create-spec-prompt.md`

**Entrada:** PRD finalizado (milestone), esboço da tarefa, acesso à codebase.
**Saída:** `documentation/features/<domínio>/specs/<nome>-spec.md`

- Ponte estritamente definida entre o PRD e o código.
- Nível de detalhe suficiente para que a implementação seja direta e sem ambiguidades.
- Define **contratos, não código**: assinaturas TypeScript (nome, parâmetros tipados, retorno) com uma linha de responsabilidade.
- Organizada por camadas (core, REST, RPC, database, UI, queue, provision).
- Decisões de design registradas com:
  - Alternativas consideradas
  - Motivo da escolha
  - Impactos e trade-offs
- Se o PRD estiver ausente ou incompleto, a spec **não pode começar**.
- A pesquisa da codebase é delegada a subagentes por app/pacote; decisões ficam com o agente principal.

### 3. Plano de Implementação — `create-plan-prompt.md`

**Entrada:** spec técnica.
**Saída:** `documentation/plan.md`

- Transforma a spec em fases e tarefas atômicas com dependências explícitas.
- Ordem bottom-up obrigatória:
  - **F1 — Core:** domínio, structures, use cases.
  - **F2, F3, F4 — Apps** (server, web, studio): só iniciam após F1 concluída; podem rodar em paralelo entre si.
- Cada tarefa possui:
  - Camada explícita (`core`, `database`, `rest`, `rpc`, `ui`, `queue`, `provision`, `ai`, `web`, `studio`)
  - Dependências entre tarefas
  - Resultado observável verificável sem ambiguidade
- Apps não impactados são omitidos do plano.

### 4. Implementação — `implement-plan-prompt.md`

**Entrada:** `documentation/plan.md` (ou caminho alternativo).
**Saída:** código implementado na codebase, checkboxes atualizados no `plan.md`.

- **Regra Mestra:** antes de tocar qualquer camada, ler o arquivo de regras correspondente em `documentation/rules/`. Sem exceções.
- Ordem de implementação: core → drivers/infra → API layer → UI.
- Nunca implementar camada consumidora antes da camada que ela consome.
- Verificação obrigatória após cada tarefa:
  - `npm run codecheck` (lint e formatação)
  - `npm run typecheck`
  - `npm run test`
- O progresso é rastreado nos checkboxes do próprio `plan.md`.
- Planos parcialmente concluídos são retomados a partir da primeira tarefa pendente.

### 5. Revisão — `conclude-spec-prompt.md`

**Entrada:** spec técnica que guiou a implementação.
**Saída:** spec fechada, PRD atualizado, resumo estruturado para PR.

Executa três fases sequenciais:

**Fase 1 — Verificação:**
- Testes passando (`npm run test`)
- Cobertura de testes para novos comportamentos
- Validação de requisitos contra a spec
- Validação de limites arquiteturais
- Revisão de qualidade de código

**Fase 2 — Consolidação documental:**
- Spec marcada como `status: closed`
- PRD atualizado na milestone do GitHub
- `documentation/architecture.md` atualizado (se aplicável)
- Rules atualizadas (se novos padrões foram introduzidos)

**Fase 3 — Comunicação:**
- Resumo de revisão com estrutura obrigatória:
  - O que foi feito
  - Por que foi feito assim
  - O que mudou em relação à spec original
  - Pontos de atenção para o revisor (migrations, contratos, decisões irreversíveis, side effects)
  - Checklist final

---

## Fluxo para Bugs — `create-bug-report-prompt.md`

Bugs seguem um caminho em duas etapas documentais antes de entrar no pipeline principal:

```
relato do problema → bug report → spec de correção separada → plano → implementação → revisão
```

- O bug report documenta sintoma, impacto, evidências, diagnóstico e plano inicial de correção.
- A spec de correção é criada depois, em **arquivo próprio** dentro de `documentation/features/<domínio>/specs/`, usando o bug report como insumo.
- Bug report e spec **não** coexistem no mesmo `.md`.

---

## Onde encontrar cada artefato

| Artefato | Localização |
|---|---|
| PRD | Milestone do GitHub (nunca arquivo local) |
| Spec técnica | `documentation/features/<domínio>/specs/<nome>-spec.md` |
| Bug report | `documentation/features/<domínio>/reports/<nome>-bug-report.md` |
| Spec de correção derivada de bug | `documentation/features/<domínio>/specs/<nome>-fix-spec.md` |
| Plano de implementação | `documentation/plan.md` |
| Regras por camada | `documentation/rules/` (índice em `rules.md`) |
| Prompts do pipeline | `documentation/prompts/` |

---

## Princípios

1. **Código é derivado, nunca ponto de partida.** Toda mudança nasce de uma cadeia documental rastreável.
2. **Ambiguidade se resolve antes do código.** Se a spec tem lacunas, registrar em pendências e perguntar — nunca inventar.
3. **Cada camada tem suas regras.** Ler as regras antes de implementar é obrigatório, não opcional.
4. **Bottom-up sempre.** Core antes de infra, infra antes de API, API antes de UI.
5. **Verificação contínua.** Lint, typecheck e testes passam após cada tarefa, não apenas no final.
6. **Documentação acompanha o código.** Spec, PRD, arquitetura e rules são atualizados junto com a implementação, nunca depois.

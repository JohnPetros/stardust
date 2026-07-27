# Spec-Driven Development (SDD) e Harness no StarDust

## O que é

O StarDust usa SDD como camada normativa de um harness de agentes. Nenhum código
é escrito antes de existir uma Spec técnica derivada do PRD e aceita por revisão
independente.

```text
milestone/PRD
→ Spec
  ├── Contract
  └── solução técnica
→ judge-spec-agent
→ implementação direta ou Plan
→ Builder/Workers
→ gates determinísticos
→ judge-implementation-agent por fase ou implementação direta
→ judge-conclusion-agent
→ fechamento e commit
→ PR + @codex review + CI
→ entrega mergeable
```

A parte Contract da Spec define o que deve ser comprovado; a parte técnica
define como construir. O Plan opcional define a ordem e mantém progresso e
handoff. Pareceres ficam no chat dos Judges. Builder e Workers constroem;
sensores produzem evidências; gates controlam transições; Judges verificam; o
Orchestrator coordena uma única Spec.

## Papéis

```text
orchestrator-agent
├── builder-agent
│   ├── worker-agent
│   └── worker-agent
└── judge-*-agent
```

- **Orchestrator:** controla workflow, Plan, sensores, tentativas e handoff.
- **Builder:** implementa, delega unidades independentes e integra resultados.
- **Worker:** executa uma tarefa atômica dentro de paths delimitados.
- **Judge:** avalia de forma independente e read-only.

O Judge nunca é filho do Builder. Ele é acionado pelo Orchestrator depois que a
árvore de implementação termina. As regras completas estão em
`documentation/rules/harness-rules.md`.

Subagentes usam nomes orientados ao papel e ao escopo: `Builder F1`,
`Worker F1 T1.1`, `Judge F1`, `Builder Direct`, `Judge Direct`, `Judge Spec` e
`Judge Conclusion`. No Codex, seus `task_name` equivalentes usam lowercase e
underscore, como `builder_f1` e `judge_f1`.

## Pipeline

### 1. PRD — `create-prd`

**Entrada:** milestone do GitHub, esboço, evidências de produto ou código
existente.
**Saída:** descrição da milestone atualizada.

- A milestone é a única fonte de verdade do PRD.
- Modo prospectivo faz discovery antes da escrita.
- Modo retrospectivo audita milestone e codebase.
- PRD descreve comportamento de produto, não arquitetura.

### 2. Spec — `create-spec` + `judge-spec-agent`

**Entrada:** PRD finalizado, tarefa, codebase e bug report quando aplicável.
**Saída:** `documentation/features/<domínio>/<feature>/specs/<nome>-spec.md`.

- A Spec possui Parte I — Contract e Parte II — Especificação Técnica.
- Requisitos usam IDs `REQ-*`; critérios observáveis usam `AC-*` e `AR-*`.
- O Contract é agnóstico à implementação; a parte técnica deve cobri-lo.
- Paths e contratos são confirmados na codebase.
- `spec-check` valida estrutura, rastreabilidade e paths de forma determinística.
- O Judge avalia PRD × Contract e Contract × solução técnica num único parecer.
- O draft permanece `status: draft` até o Definition Gate e o
  `judge-spec-agent` passarem.
- Depois da aceitação, torna-se `open` e sua revisão é calculada com
  `git hash-object`.

Sem Spec aceita não existe Plan nem implementação.

### 3. Plan — `create-plan`

**Entrada:** Spec aceita.
**Saída:**
`documentation/features/<domínio>/<feature>/plans/<nome>-plan.md`.

Use quando houver múltiplas tarefas, fases, dependências, Workers, handoff,
migration relevante, contrato entre apps ou mudança documental estrutural.

O Plan concentra:

- Fases e dependências.
- Estado global e tarefa atual.
- Revisão da Spec e commit-base.
- Critérios e paths por tarefa.
- Tentativas, estado resumido dos gates e findings ativos.
- Estado e veredito integrado por fase.
- Histórico e próxima ação.

`[x]` significa exclusivamente que a tarefa foi verificada pelo Implementation
Gate. A fase recebe `accepted` pelo `judge-implementation-agent`.

### 4. Implementação direta — `implement-spec`

Use para uma única entrega observável, curta e concluível na mesma sessão.

```text
orchestrator-agent → builder-agent → sensores → judge-implementation-agent
```

- Não cria Plan.
- Builder implementa sem Workers.
- Orchestrator executa Readiness e Implementation Gate.
- Judge recebe Spec, diff, Rules e sensores, sem narrativa do Builder.
- Se surgir paralelismo, handoff, mudança de PRD/Architecture/Rule ou repetição
  de falhas, promova para `create-plan` + `implement-plan`.

### 5. Implementação planejada — `implement-plan`

Para cada tarefa:

```text
orchestrator-agent prepara tarefa
→ builder-agent implementa e pode acionar worker-agents
→ orchestrator-agent integra e executa sensores
└── gate aprovado: orchestrator-agent marca [x] e verified
```

Ao final de cada fase:

```text
orchestrator-agent executa gate agregado da fase
→ judge-implementation-agent avalia o incremento integrado
├── failed: reabre ou cria tarefas corretivas na fase
└── accepted: orchestrator-agent aceita a fase
```

- Ordem bottom-up: core → infra → bordas → UI.
- Builder pode acionar no máximo dois Workers independentes.
- Workers não escrevem nos mesmos paths e não criam outros agentes.
- O Readiness Gate roda antes de cada Builder.
- O Implementation Gate combina escopo, `codecheck`, `typecheck`, `test:unit`,
  arquitetura, migrations e Contract.
- Integração, Playwright, build, runtime e código morto entram quando aplicáveis.
- O `quality-ratchet` roda apenas no CI do PR.
- O Judge antecipado é excepcional para contrato, migration, segurança ou
  fronteira arquitetural crítica e não substitui o julgamento final da fase.
- Máximo de três tentativas pelo mesmo motivo antes de escalar.

### 6. Atualizações durante a implementação

Não existe workflow separado `update-spec`. O Orchestrator trata a mudança no
contexto de `implement-spec` ou `implement-plan`:

- Correção factual: atualização cirúrgica e nova revisão.
- Amendment contratual: pausa, atualiza Spec/Plan, invalida avaliações afetadas
  e reavalia.
- Mudança de produto: PRD primeiro, depois Spec.
- Novo padrão aprovado: tarefa explícita de Architecture/Rule no Plan.
- Revisão humana: reabre fase e tarefa como `changes_requested` e registra
  `HR-*`.

### 7. Conclusão — `conclude-spec` + `judge-conclusion-agent`

`conclude-spec` só começa depois da verificação de todas as tarefas e aceitação
de todas as fases, ou da aceitação da implementação direta.

1. Verifica pré-condições e revisão da Spec.
2. Executa o Conclusion Gate sobre o diff integrado.
3. Consolida PRD, Architecture e Rules sem fechar documentos.
4. Aciona `judge-conclusion-agent` com diff integral e contexto limpo para
   integração entre fases, critérios globais e coerência documental.
5. Se falhar, reabre fases e tarefas; não corrige código dentro da conclusão.
6. Se aceitar, fecha Spec e Plan, marca PRD, cria commits e abre o PR.
7. Solicita `@codex review` e aguarda o CI, incluindo o `quality-ratchet`.
8. Se houver pendência, corrige pelo workflow correspondente, revalida os
   pareceres afetados e repete para o novo `HEAD`.
9. Só encerra quando o Codex Review do `HEAD` atual estiver concluído, o CI
   estiver verde, não houver conversas bloqueantes e o PR estiver mergeable.

## Bugs

```text
relato
→ bug report
→ Spec de correção separada
→ judge-spec-agent
→ implementação direta ou Plan
→ Judges de implementação e conclusão
```

Bug report documenta sintoma, impacto, evidências e diagnóstico. Ele não contém
plano nem substitui a Spec de correção.

## Artefatos

| Artefato | Localização |
| --- | --- |
| PRD | Milestone do GitHub |
| Spec | `documentation/features/**/specs/*-spec.md` |
| Bug report | `documentation/features/**/reports/*-bug-report.md` |
| Plan | `documentation/features/**/plans/*-plan.md` |
| Regras do harness | `documentation/rules/harness-rules.md` |
| Rules por camada | `documentation/rules/` |
| Definições de agentes | `documentation/agents/*-agent.md` |
| Prompts | `documentation/prompts/` |
| Checks determinísticos | `packages/harness/` |
| Catraca de métricas | `packages/harness/src/commands/quality-ratchet/` |

## Princípios

1. Código deriva de uma Spec aceita.
2. Ambiguidade é resolvida antes do código.
3. Contract e solução técnica vivem na mesma Spec sem misturar responsabilidades.
4. Quem constrói não aprova o próprio trabalho.
5. Sensores e gates são executados pelo Orchestrator, não declarados pelo Builder.
6. Judges avaliam evidências e não criam escopo.
7. Documentação acompanha o código no mesmo ciclo.
8. Revisão humana tem precedência e preserva o histórico.
9. Modo direto é promovido assim que deixa de ser simples.

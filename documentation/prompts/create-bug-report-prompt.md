---
name: create-bug-report
description: Diagnosticar uma GitHub bug issue aprovada em um Bug Report factual do Stardust e recomendar correção direta ou Correction Spec.
---

# Criar Bug Report

Transforme uma GitHub bug issue aprovada em um diagnóstico técnico durável. O Bug Report é
input de correção, não Spec: não inclua `CA-*`, validação manual, fases, tasks, assinaturas,
inventário proposto de arquivos ou implementação detalhada.

## Entrada

- GitHub bug issue com problema, comportamento esperado, reprodução e contexto;
- contexto técnico opcional: ambiente, browser/dispositivo, frequência e evidências.

Sem issue existente, pare e encaminhe para `create-bug-issue`; este workflow não cria nem
atualiza a issue.

## Autoridade e Rules

Leia `AGENTS.md`, `documentation/sdd.md`, `documentation/rules/rules.md`,
`documentation/architecture.md`, `documentation/modules.md`, a milestone associada e o PRD
versionado vinculado quando existir. Selecione e leia por inteiro as Rules das camadas e tipos de
teste afetados. Use-as para validar fronteiras, sem transformar o relatório em Spec.

Milestone e PRD definem comportamento esperado. Se a expectativa solicitada mudar o produto,
pare e encaminhe para amendment/feature; não classifique mudança de comportamento como bug.

## Pesquisa diagnóstica

Use `documentation/agents/searcher-agent.md` para lanes read-only delimitadas:

- uma lane para boundary estreito;
- Searchers paralelos quando dois ou mais boundaries independentes forem afetados;
- escolha apenas lanes reais, como Core, Server, Web, Studio, Database ou Integration;
- envie sintoma, expectativa, paths iniciais, Rule Pack e pergunta diagnóstica;
- exija paths/declarations exatos, evidência, causa provável, risco e incerteza.

A task principal une os relatórios, resolve conflitos por inspeção direta e separa fato de
hipótese. Searchers não editam, não escolhem delivery route e não criam agentes.

## Workflow

1. confira a issue real e a reprodução informada;
2. separe falha observada de comportamento esperado;
3. associe milestone, PRD e requisito real quando aplicáveis, sem alterar seu estado;
4. inspecione entry point, estado, transporte, use case, persistência e integração implicados;
5. salve ou atualize
   `documentation/features/<domínio>/<feature>/reports/<slug>-bug-report.md`;
6. recomende no resumo final:
   - **Correção direta:** narrow, bem compreendida, baixo risco e sem Contract durável; ou
   - **Correction Spec:** ambígua, cross-layer, coordenada ou de risco material, exigindo
     `RF-*`, `CA-*`, `MV-*` ou Plan.

Não escreva a delivery route dentro do Bug Report e não crie a Spec neste workflow.

## Estrutura obrigatória

```md
---
title: <título curto>
issue: <GitHub issue URL>
milestone: <URL ou null>
prd: <path/requisito ou null>
apps:
  - <web|server|studio>
status: open
last_updated_at: YYYY-MM-DD
---

# Bug Report: <título>

## Diagnóstico

### Falha observada

<comportamento confirmado e condições>

### Comportamento esperado

<contrato de produto, Spec, Design ou comportamento estabelecido>

### Causa raiz

<explicação sustentada por evidência; hipóteses restantes explicitamente marcadas>

### Áreas afetadas

- `<path relativo>` — <responsabilidade no defeito>

### Risco de regressão

<comportamentos relacionados que a correção deve preservar>

## Limite da correção

<o que deve ser corrigido e o que deve permanecer inalterado>
```

## Restrições

- use GitHub Issues e paths relativos reais;
- não invente execução, causa, método, contrato ou arquivo;
- não inclua acceptance, manual validation, tasks, fases ou file plan;
- não edite Spec, Plan, Evaluation, PRD ou Rule;
- não exponha credenciais, dados privados ou logs sensíveis;
- no fim, reporte issue, path e route recomendada.

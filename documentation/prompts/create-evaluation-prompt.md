---
name: create-evaluation
description: Criar e manter o evaluation.md obrigatório de uma entrega SDD com evidências reais, Judges, preflight, CI, findings, decisões e lições.
---

# Criar Evaluation

O `evaluation.md` é o registro factual da entrega. Ele é criado após a
implementação ou o primeiro julgamento relevante e deve existir antes do PR.
Não substitui `spec.md`, `plan.md` ou os pareceres dos Judges; consolida as
evidências necessárias para fechar a feature.

## Localização

Para uma feature:

```text
documentation/features/<domínio>/<feature>/evaluation.md
```

Para uma mudança posterior:

```text
changes/<nome-da-mudanca>/evaluation.md
```

## Persistência imediata

O Orchestrator atualiza este documento assim que uma evidência, decisão, warning,
finding ou lição for descoberta. Requisitos pertencem à `spec.md`; tarefas e
findings operacionais pertencem ao `plan.md`, quando houver Plan.

## Template

```md
---
title: <título da avaliação>
spec: ./spec.md
spec_revision: <revisão ou sha>
status: in_progress
base_commit: <sha>
evaluated_commit: <sha>
last_updated_at: YYYY-MM-DD
---

# Evaluation — <título>

## Escopo avaliado

- Spec: `./spec.md`
- Plan: `./plan.md` | não aplicável
- Commit-base: `<sha>`
- Commit avaliado: `<sha>`

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| CA-01 | passed | teste, browser, sensor ou diff |

## Judges

### Judge Spec

- Veredito: `accepted` | `failed`
- Revisão: `<revisão>`
- Findings: nenhum | `<IDs e estado>`

### Judge Plan

- Veredito: `accepted` | `failed` | não aplicável
- Plan: `./plan.md` | não aplicável
- Findings: nenhum | `<IDs e estado>`

### Judge Implementation

- Modo: `direct` | `final`
- Veredito: `accepted` | `failed`
- Commit: `<sha>`
- Findings: nenhum | `<IDs e estado>`

Para frontend, registre também:

| Gate | Estado | Evidência |
| --- | --- | --- |
| UI Layer Audit | passed | widget, paths e linhas de Entry Point/View/Hook |
| Pencil/Web comparison | passed | node, viewport, estado, rota, HEAD, anchors, divergência/aprovação e screenshot/diff |

Quando houver referência Pencil, registre uma matriz por node. Ela deve
identificar o `.pen`, Node ID, viewport, estado/variante, rota, dimensão e
anchors da referência, captura Web no mesmo contexto, HEAD avaliado e qualquer
divergência aprovada. `match` e `approved adaptation` são os únicos estados
aceitáveis; node ausente, contradito ou adicionado sem aprovação mantém a
avaliação bloqueada.

## Sensores e preflight

| Comando | Estado | Evidência |
| --- | --- | --- |
| `npm run check:code` | passed | saída resumida |

## Quality Gate e build do CI

| Verificação | Estado | HEAD / evidência |
| --- | --- | --- |
| Quality Gate | pending | PR e workflow |
| Build | pending | workflow |

## Warnings e findings

- Nenhum | `<ID> — descrição, impacto, estado e resolução>`

## Decisões

- `<decisão>` — motivo e impacto.

## Lições aprendidas

- `<lição reutilizável ou confirmação de que não houve>`.

## Alinhamento documental

- Spec: alinhada | `<ação pendente>`
- Plan: alinhado | não aplicável | `<ação pendente>`
- Rules/Architecture/Overview: alinhados | não aplicáveis | `<ação pendente>`

## Conclusão

- Estado: `in_progress` | `accepted` | `completed` | `blocked`
- Próxima ação: `<ação>`
```

Quality Gate ou build com falha devem ser registrados imediatamente aqui. A
Spec permanece `in_progress`; correções de escopo usam `Builder Fix QG-*`, com
novo sensor e novo Judge sempre que o diff ou qualquer evidência de Contract,
Rule, Pencil ou Playwright for invalidada. Qualquer alteração posterior ao
Judge invalida o commit avaliado anterior, inclusive quando afetar a fidelidade
Pencil-to-code.

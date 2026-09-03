---
name: create-evaluation
description: Criar e manter o evaluation.md obrigatório de uma entrega SDD com evidências reais, revisões, preflight, CI, findings, decisões e lições.
---

# Criar Evaluation

O `evaluation.md` é o registro factual da entrega. Ele é criado após a
implementação ou o primeiro julgamento relevante e deve existir antes do PR.
Não substitui `spec.md` ou `plan.md`; consolida as
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

A task principal atualiza este documento assim que uma evidência, decisão, warning,
finding ou lição for descoberta. Requisitos pertencem à `spec.md`; tarefas e
findings operacionais pertencem ao `plan.md`, quando houver Plan.

## Template

Use este formato como a estrutura canônica do Stardust. `evaluation.md` é um
ledger vivo, não um relatório escrito apenas no encerramento: preserve a ordem
das seções e atualize-o após cada mudança de implementação, teste, browser,
migration, artefato, documentação ou validação.

Use IDs estáveis e uma linha por evidência: `EV-*` para sensores/runtime,
`MV-*` para cenários manuais, `VIS-*` para comparações visuais, `FND-*` para
findings e `CI-*` para checks do PR. Marque evidências afetadas como `stale`;
não reutilize uma captura ou resultado anterior à última alteração relevante.
Para cada finding material, mantenha a entrada concreta em `Warnings e findings`
e uma lição/disposição em `Lições aprendidas` ou `Análise preventiva dos findings`.

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

| Critério | Estado | Evidência real                 |
| -------- | ------ | ------------------------------ |
| CA-01    | passed | teste, browser, sensor ou diff |

## Revisões

### Spec Reviewer

- Veredito: `clear` | `blocking_findings`
- Revisão: `<revisão>`
- Escopo: compatibilidade com `architecture.md` e Rules antes do planejamento
- Findings: nenhum | `<IDs e estado>`

### Implementation Reviewer

- Modo: `direct` | `final`
- Veredito: `accepted` | `failed`
- Commit: `<sha>`
- Findings: nenhum | `<IDs e estado>`

Para frontend, registre também:

| Gate                  | Estado | Evidência                                                                            |
| --------------------- | ------ | ------------------------------------------------------------------------------------ |
| UI Layer Audit        | passed | widget, paths e linhas de Entry Point/View/Hook                                      |
| Pencil/Web comparison | passed | node, viewport, estado, rota, HEAD, anchors, divergência/aprovação e screenshot/diff |

Quando houver referência Pencil, registre uma matriz por node. Ela deve
identificar o `.pen`, Node ID, viewport, estado/variante, rota, dimensão e
anchors da referência, captura Web no mesmo contexto, HEAD avaliado e qualquer
divergência aprovada. `match` e `approved adaptation` são os únicos estados
aceitáveis; node ausente, contradito ou adicionado sem aprovação mantém a
avaliação bloqueada.

## Sensores e preflight

| Comando                                 | Estado | Evidência                                 |
| --------------------------------------- | ------ | ----------------------------------------- |
| `npm run check:code`                    | passed | saída resumida                            |
| `npm run test:coverage -w <workspace>`  | passed | resumo por métrica e workspace            |
| `npm run check:coverage -- <workspace>` | passed | baseline comparado e resultado do ratchet |

## Checks e build do CI

| Verificação  | Estado  | HEAD / evidência          |
| ------------ | ------- | ------------------------- |
| Checks do CI | pending | PR e workflows aplicáveis |
| Build        | pending | workflow                  |

## Warnings e findings

- Nenhum | `<ID> — descrição, impacto, estado e resolução>`

## Análise preventiva dos findings

| Finding | Causa | Ação preventiva/documento | Estado |
| ------- | ----- | ------------------------- | ------ |
| `<ID>` | pontual | não aplicável — justificativa | concluído |

Analise findings do Reviewer, sensores, CI e validação manual. Quando um item
revelar uma lacuna recorrente de processo, arquitetura, tooling ou Rule, atualize
o documento normativo correspondente antes da conclusão. Para um anti-padrão de
implementação reutilizável, registre-o na Rule da camada com o workflow
`register-antipattern`. Registre a evidência da decisão ou a pendência de
aprovação do usuário nesta matriz.

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

Checks ou build com falha devem ser registrados imediatamente aqui. A Spec
permanece `in_progress`; correções de escopo usam `Builder Fix CI-*`, com
novo sensor e novo Reviewer sempre que o diff ou qualquer evidência de Contract,
Rule, Pencil ou Playwright for invalidada. Qualquer alteração posterior ao
Reviewer invalida o commit avaliado anterior, inclusive quando afetar a fidelidade
Pencil-to-code.

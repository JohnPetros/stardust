---
name: create-evaluation
description: Criar e manter o evaluation.md obrigatório de uma entrega SDD com evidências reais, revisões, preflight, findings, decisões e lições.
---

# Criar Evaluation

O `evaluation.md` é o registro factual da entrega. Ele é criado após a
implementação ou o primeiro julgamento relevante e deve existir antes do PR.
Não substitui `spec.md`; consolida as
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

A task principal atualiza este documento a cada checkpoint significativo (trabalho de
Builder aceito, execução de sensores, finding ou decisão, lição descoberta), em vez de uma
atualização por edição de arquivo. Evidência é invalidada pela alegação e dependências
afetadas, não pela idade do commit. Requisitos pertencem à `spec.md`; progresso, evidências e
findings operacionais pertencem a este documento.

## Template

Use este formato como a estrutura canônica do Stardust. `evaluation.md` é um
ledger vivo, não um relatório escrito apenas no encerramento: preserve a ordem
das seções e atualize-o após cada mudança de implementação, teste, browser,
migration, artefato, documentação ou validação.

Use IDs estáveis: `EV-*` para cada evidência, `AV-*` para verificações automatizadas, `MV-*` para verificações manuais, `VV-*` para
verificações visuais, e `ACH-*` para achados. O Evaluation não registra resultados de CI do PR (workflows, checks, build); eles ficam no próprio PR. Comparações
visuais também são evidências `EV-*`, com viewport, estado e referência
registrados. Marque evidências afetadas como `stale`;
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
- Commit-base: `<sha>`
- Commit avaliado: `<sha>`

## Evidências dos critérios

Uma linha por `CA-*`. A implementação (`Pending`/`Partial`/`Complete`) e a verificação
(`Pending`/`Partial`/`Passed`/`Failed`/`Blocked`/`Stale`) são registradas separadamente.

| Critério | Implementação | Verificação | Evidência real | Trabalho restante |
| -------- | ------------- | ----------- | -------------- | ----------------- |
| CA-01    | Complete      | Passed      | EV-01 — teste, browser, sensor ou diff | nenhum |

## Revisões

### Spec Reviewer

- Veredito: `clear` | `blocking_findings`
- Revisão: `<revisão>`
- Escopo: compatibilidade com `architecture.md` e Rules antes da implementação
- Findings: nenhum | `<IDs e estado>`

### Implementation Reviewer

- Veredito: `PASS` | `FAIL` | `BLOCKED`
- Commit: `<sha>`
- Findings: nenhum | `<IDs e estado>`

### Visual Reviewer

- Veredito: `PASS` | `FAIL` | `BLOCKED` | não aplicável (sem UI design-backed)
- Commit: `<sha>`
- Disposição por linha do inventário manual/visual: `<VV-* → disposição>`
- Findings: nenhum | `<IDs e estado>`

Os relatórios dos Reviewers são entrada consultiva; a task principal verifica cada
finding e registra os aceitos como `ACH-*` na seção de findings.

Para frontend, registre também:

| Gate                  | Estado | Evidência                                                                            |
| --------------------- | ------ | ------------------------------------------------------------------------------------ |
| UI Layer Audit        | passed | widget, paths e linhas de Entry Point/View/Hook                                      |
| Penpot/Web comparison | passed | frame, viewport, estado, rota, HEAD, anchors, divergência/aprovação e screenshot/diff |

Quando a Spec declarar frames do Penpot `stardust`, inspecione-os pelo Penpot MCP e registre uma matriz por frame. Ela deve
identificar o nome do frame, viewport, estado/variante, rota, dimensão e
anchors da referência, captura Web no mesmo contexto, HEAD avaliado e qualquer
divergência aprovada. `match` e `approved adaptation` são os únicos estados
aceitáveis; frame ausente, contradito ou adicionado sem aprovação mantém a
avaliação bloqueada.

Os boards do Penpot são entradas de design, não evidências de runtime. A Evaluation deve
registrar separadamente a captura da implementação, a comparação visual, as observações de
responsividade/acessibilidade e o `EV-*` correspondente. Se o Design Contract declarar estado,
viewport ou extensão suplementar, a ausência da evidência exigida mantém a Evaluation
`in_progress`.

## Inventário manual e visual

Uma linha por jornada (`MV-*`) ou por estado/viewport renderizado (`VV-*`) exigido pela Spec. Estados
distintos (page, dialog, mobile) são linhas distintas; a evidência de uma não prova outra.

| MV/VV | CA | Superfície/rota | Estado | Viewport | Board Penpot | Candidato | Artefato | Resultado observado | Disposição do Reviewer |
| ----- | ---- | --------------- | ------ | -------- | ------------ | --------- | -------- | ------------------- | ---------------------- |
| VV-01 | CA-01 | `/space` | content | desktop | `<página/board>` | `<sha>` | `test-results/...` | pending | pending |

## Sensores e preflight

| Comando                                 | Estado | Evidência                                 |
| --------------------------------------- | ------ | ----------------------------------------- |
| `npm run check:code`                    | passed | saída resumida                            |
| `npm run test:coverage -w <workspace>`  | passed | resumo por métrica e workspace            |
| `npm run check:coverage -- <workspace>` | passed | baseline comparado e resultado do ratchet |

## Warnings e findings

- Nenhum | `<ID> — descrição, impacto, estado e resolução>`

## Análise preventiva dos findings

| Finding | Causa | Ação preventiva/documento | Estado |
| ------- | ----- | ------------------------- | ------ |
| `<ID>` | pontual | não aplicável — justificativa | concluído |

Analise findings do Reviewer, sensores e verificações manuais. Quando um item
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
- Rules/Architecture/Overview: alinhados | não aplicáveis | `<ação pendente>`

## Handoff

Registro factual e pequeno para quem retomar a entrega; não é um plano de fases nem um
segundo Contract.

- Revisão da Spec e branch/candidato: `<revisão, branch, sha>`
- Critérios concluídos / inacabados: `<IDs>`
- Paths interrompidos ou não commitados e seu ownership: `<paths>`
- Últimos resultados reutilizáveis e evidência stale: `<EV-*>`
- Processos/portas iniciados pela task e cleanup: `nenhum` | `<sessão, porta>`
- Bloqueios específicos: `nenhum` | `<bloqueio e entrada necessária>`
- Próxima ação: `<ação>`

## Conclusão

- Estado: `in_progress` | `accepted` | `completed` | `blocked`
- Próxima ação: `<ação>`
```

Falhas de sensores, builds locais ou verificações devem ser registradas imediatamente aqui como
`EV-*` e, quando houver um problema a corrigir, como `ACH-*`. Resultados do CI do PR não são
registrados no Evaluation. A Spec permanece `in_progress`; correções de escopo usam `Builder Fix ACH-*`, com
novo sensor e novo Reviewer sempre que o diff ou qualquer evidência de Contract,
Rule, Penpot ou Playwright for invalidada. Qualquer alteração posterior ao
Reviewer invalida o commit avaliado anterior, inclusive quando afetar a fidelidade
design-to-code.

---
name: implement-spec
description: Implementar ou retomar qualquer Spec pela estratégia direta ou Plan-backed, com Builders delimitados, evidência viva e validação integrada.
---

# Implementar Spec

Esta é a única entrada de implementação SDD:

```text
sem Plan atual → Builder Direct
Plan da revisão atual → Builders de ownership por wave → Implementation Reviewer único
```

Leia `AGENTS.md`, `documentation/sdd.md`, Spec, Plan quando houver, Architecture, Tooling, Rule
Pack e Design Contract. O Contract de Evaluation definido abaixo é autoridade estrutural:
preserve frontmatter, ordem de seções, colunas, IDs e vocabulário de status. Se o Plan estiver
obsoleto, reconcilie ou marque `superseded`. Se não houver Plan mas o risco exigir ledger,
invoque `create-plan` e continue aqui.

## Gate fail-closed

Antes de editar source, teste, migration ou artefato gerado:

1. confirme Spec `open` ou `in_progress`, revisão atual e ausência de ambiguidade;
2. materialize `evaluation.md` usando a estrutura canônica deste prompt; omita `plan` somente
   na estratégia direta;
3. se `evaluation.md` já existir, reconcilie-o in-place sem apagar evidências,
   findings, lessons ou history; divergência de `spec_revision` bloqueia feature edits até
   amendment/reconciliação;
4. pré-popule a Acceptance matrix com todo `CA-*` da revisão e status `pending`, usando IDs
   estáveis `EV-*`, `MV-*`, `VIS-*`, `FND-*` e `CI-*` nos respectivos registros;
5. registre assignment, revisão, RF/CA, paths permitidos/proibidos, Rules, Design e exits em
   `History` antes da ativação do Builder;
6. mude Spec, Plan quando houver e Evaluation para `in_progress`.

Não substitua o Contract por relatório narrativo, seções de Judge, metadata de commit-base ou
tabelas próprias. A tabela `PR CI quality gate` pertence a `conclude-spec`: durante implementação,
mantenha-a `pending` e não invente HEAD SHA, workflow, resultado ou URL.

## Contract canônico de Evaluation

```md
---
feature: "<domínio>/<feature>"
spec: ./spec.md
plan: ./plan.md # omitir para implementação direta
spec_revision: 1
status: in_progress
updated_at: YYYY-MM-DD
---

# Evaluation

Current result: <resultado atual da validação>.

## Acceptance matrix

| Criterion | Evidence | Status |

## Automated and runtime evidence

| ID | Layer | Command or scenario | Result | Status |

## Manual evidence

| ID | Scenario | Criteria | Expected | Observed | Status |

## Visual evidence

| ID | Surface and state | Viewport | Reference | Implementation | Differences | Status |

## Rule and documentation compliance

| Authority | Reference | Result | Notes |

## Findings

| ID | Classification | Source | Affected evidence | Status | Resolution |

## PR CI quality gate

| ID | Workflow | Head SHA | Result | Run |

## Lessons learned

| Lesson | Source finding | Authority disposition |

## History

| Date/Time | Event |
```

Builder não edita artefatos SDD. Relato não é evidência: o Orchestrator inspeciona o diff,
executa exits e registra resultados.

## Estratégia direta

O Orchestrator assume `Builder Direct` no contexto atual para mudança pequena e coesa. Implemente
somente o assignment registrado, retorne ao papel de Orchestrator, inspecione o diff, execute
sensores focados e atualize Evaluation. Não crie Plan mínimo artificial.

## Estratégia Plan-backed

Por wave dependency-ready:

1. marque fases/tasks `in_progress`;
2. ative ou retome Builders de ownership estável com paths não sobrepostos;
3. limite o padrão a três Builders concorrentes;
4. Orchestrator coordena root config, dependências, lockfiles, generated/shared files;
5. integre e inspecione diffs;
6. execute exits focados e registre Evaluation antes de atualizar o Plan;
7. conclua task/fase somente com exit atual aprovado;
8. em falha, mantenha `in_progress`, retome o Builder responsável e recapture evidência.

Depois da integração, ative exatamente um `implementation-reviewer-agent` read-only. Ele recebe
revisão, Plan, Rule Pack, diff, Design e índice de evidência. A task principal verifica findings,
registra os aceitos, retoma o Builder e depois o mesmo Reviewer.

## Persistência no Evaluation

Após cada mudança, atualize imediatamente as seções canônicas antes do próximo edit ou sensor:

- `Acceptance matrix`: CA → IDs atuais e status agregado;
- `Automated and runtime evidence`: comando/cenário exato, layer, resultado observado e status;
- `Manual evidence`: cenário, CA, expected e observed separados;
- `Visual evidence`: surface/estado, viewport, referência, artifact e diferenças;
- `Rule and documentation compliance`: autoridade, referência, resultado e alinhamento;
- `Findings`: classificação, fonte, evidência afetada, status e resolução;
- `Lessons learned`: princípio reutilizável e disposition documental;
- `History`: mudança, invalidação, rerun, review e transição de estado.

Marque cada evidência afetada como `stale` antes da correção e só retorne a `passed` depois do
rerun no candidato atual. Use apenas `pending`, `passed`, `failed`, `stale` ou `not_applicable`
para evidência; `active`, `resolved`, `accepted_non_blocking` ou `superseded` para findings; e
`in_progress`, `ready` ou `completed` para Evaluation.

Execute `npm run check:code`, `npm run check:types` e `npm run test:unit` após mudanças de
código, mais sensores específicos.

Frontend exige o fluxo manual real de `AGENTS.md`, incluindo autenticação/rota protegida quando
aplicável, estados, teclado, responsividade, console, `pageerror`, `requestfailed`, respostas
HTTP e screenshot atual por referência/estado. Server/banco exige runtime real e Supabase Dev
quando aplicável; transporte mockado não prova persistência ou autorização.

Compare continuamente o candidato com paths, widget tree, contracts, exclusões, estados e
validation exits da Spec. Teste verde não compensa conformance ausente.

## Routing de mudanças

- Correção de implementação: mantenha revisão, registre finding, retome Builder e reexecute exits.
- Mudança de Contract: pause, Spec `draft`, invoque `create-spec`, incremente revisão, reconcilie
  Plan/Design/Evaluation e retome automaticamente.

## Gate de readiness da Evaluation

Antes de marcar Evaluation `ready`, verifique no arquivo materializado:

- frontmatter aponta para a revisão atual e inclui/omite `plan` conforme a estratégia;
- toda linha de `Acceptance matrix` referencia evidência existente e atual;
- nenhum CA obrigatório está `pending`, `failed` ou `stale`;
- evidência manual registra Expected e Observed; visual registra estado, viewport, referência,
  implementação e diferenças;
- Rule/documentation compliance está resolvida;
- nenhum finding bloqueante permanece `active`;
- cada finding material possui lesson/disposition ou `No change` justificado;
- `Current result` e `History` representam o candidato atual;
- a tabela de CI continua reservada para `conclude-spec`.

Quando o gate passar, complete o Plan quando presente, marque Evaluation `ready` e invoque
`conclude-spec` se houver autoridade de publicação.

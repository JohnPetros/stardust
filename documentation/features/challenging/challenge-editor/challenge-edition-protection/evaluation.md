---
title: Avaliação da proteção de edição de desafios
spec: ./spec.md
spec_revision: 2
status: in_progress
base_commit: 67a7c7685d575d4bd22e183ea8c49f6c5cc31c46
evaluated_commit: 67a7c7685d575d4bd22e183ea8c49f6c5cc31c46 + worktree não commitado
last_updated_at: 2026-08-01
---

# Evaluation — Proteção de edição de desafios

## Escopo avaliado

- Spec: `./spec.md`, revisão 2.
- Plan: `./plan.md`, revisão da Spec 2; implementação local com preflight ainda bloqueado.
- Commit-base: `67a7c7685d575d4bd22e183ea8c49f6c5cc31c46`.
- Commit avaliado: worktree atual, ainda não commitado; não existe SHA final.

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| CA-01 a CA-13 | partial | Testes unitários e os 9 cenários específicos da feature passaram; o preflight completo ainda falha em um teste existente de `official-solution` e a validação manual não foi reexecutada neste estado. |

## Judges

### Judge Plan

- Vereditos: três avaliações `failed`, seguidas de `accepted` após a revisão
  do contrato de `pendingTraversal`, `event.intercept`, restauração e
  `currententrychange`.
- Findings: `JP-01` e `JP-02` resolvidos.

### Judge Spec

- Revisão 1: `failed` por `JS-01` (estratégia de sentinela/popstate).
- Revisão 2: `accepted`; `JS-01` resolvido com Navigation API opcional e
  degradação explícita.

### Judge Implementation

- F1: `accepted` após correção de `JI-01`.
- F2: `accepted` após correções de `JI-02`, `JI-03`, `JI-05` e `JI-06`.
- F3: os 9 testes específicos passaram na execução atual; o aceite final da
  fase aguarda preflight completo e validação manual no estado commitado.
- F4/Judge Implementation Final: pendentes; não há veredito final válido para
  o worktree não commitado com preflight vermelho.

## Sensores e preflight

| Comando | Estado | Evidência |
| --- | --- | --- |
| `git diff --check` | passed | Nenhum erro de whitespace. |
| `npm run check:code` | warning | Exit 0; 173 warnings preexistentes fora da feature. |
| `npm run check:types` | passed | 7 workspaces passaram; houve apenas warning de versão do Node no Studio. |
| `npm run test:unit` | passed | 5 projetos passaram: 459 suítes e 1.514 testes. |
| `npm run check:architecture` | passed | 3572 módulos / 6364 dependências, sem violações. |
| `npm --workspace @stardust/web run test:integration` | failed | 48/49 passaram; os 9 cenários da feature passaram, mas `official-solution.test.ts:252` falhou ao navegar para `/solutions/official`. |

### Validação manual

A validação manual autenticada não foi reexecutada nesta tentativa de
fechamento. Sem uma nova sessão Playwright real associada ao estado atual, não
é possível confirmar o requisito de autenticação e a rota protegida para o
fechamento final.

## Quality Gate e build do CI

| Verificação | Estado | HEAD / evidência |
| --- | --- | --- |
| Quality Gate | pending | Não existe PR associado ao branch. |
| Build | pending | Não existe workflow associado ao HEAD atual. |

## Warnings e findings

- `JS-01` — histórico com sentinela/popstate: `resolved` na Spec revisão 2.
- `JI-08` — Voltar limpo no harness: `resolved` pelos 9 cenários específicos
  verdes na execução atual.
- `JI-09` — validação manual autenticada: `open`, pendente de reexecução no
  estado atual.
- `JI-10` — preflight externo à feature: `open`; o teste
  `official-solution.test.ts:252` recebeu `/solutions` após o clique em vez de
  `/solutions/official` e esgotou o timeout. Não foi alterado neste fechamento.
- A Architecture documenta Next.js 15, enquanto `apps/web/package.json` usa
  Next.js `^16.2.12`; warning não bloqueante já registrado.

## Decisões

- A issue `#517` permanece a fonte normativa porque o PRD local referenciado
  foi removido e o milestone remoto não contém o requisito de proteção.
- A Spec permanece `in_progress`: os testes específicos passam, mas o
  preflight completo, a validação manual atual e o CI ainda não estão verdes.
- `JI-10` foi registrado como falha externa ao escopo da feature; não foi
  mascarado por alteração no teste ou no produto.
- A confirmação customizada permanece restrita a navegações controladas; back,
  forward, reload e fechamento usam a confirmação nativa conforme decisão
  humana de 2026-08-01.

## Lições aprendidas

- Testes específicos verdes não liberam o fechamento quando o preflight do
  workspace falha; a evidência deve separar a mudança avaliada da falha externa.
- No App Router, observar `usePathname` ou `popstate` não equivale a possuir uma
  API cancelável antes de uma travessia.

## Alinhamento documental

- Spec: revisão 2, estado `in_progress`.
- Plan: precisa refletir o preflight atual, `JI-10` e a validação manual pendente
  antes do próximo julgamento.
- Rules/Architecture/Overview: nenhuma atualização normativa necessária nesta
  tentativa; a divergência da versão do Next.js permanece warning.

## Conclusão

- Estado: `in_progress`.
- Próxima ação: resolver ou justificar `JI-10`, reexecutar a validação manual
  autenticada, commitá-la em um HEAD identificável, abrir PR e aguardar
  Quality Gate/build antes do `conclude-spec` final.

---
title: Avaliação da proteção de edição de desafios
spec: ./spec.md
spec_revision: 2
status: completed
base_commit: 67a7c7685d575d4bd22e183ea8c49f6c5cc31c46
evaluated_commit: 67a7c7685d575d4bd22e183ea8c49f6c5cc31c46 + worktree não commitado
last_updated_at: 2026-08-01
---

# Evaluation — Proteção de edição de desafios

## Escopo avaliado

- Spec: `./spec.md`, revisão 2.
- Plan: `./plan.md`, revisão da Spec 2; fases aceitas e encerradas.
- Commit-base: `67a7c7685d575d4bd22e183ea8c49f6c5cc31c46`.
- Commit avaliado: worktree atual, ainda não commitado; não existe SHA final.

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| CA-01 a CA-13 | accepted | Testes unitários, os 9 cenários específicos da feature e os 5 cenários de `official-solution` passaram. |

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
- F3: os 9 testes específicos e os 5 cenários de `official-solution` passaram
  na execução atual; `accepted`.
- F4/Judge Implementation Final: `accepted`, com o warning externo da suíte
  geral registrado como `EXT-01`.

## Sensores e preflight

| Comando | Estado | Evidência |
| --- | --- | --- |
| `git diff --check` | passed | Nenhum erro de whitespace. |
| `npm run check:code` | warning | Exit 0; 173 warnings preexistentes fora da feature. |
| `npm run check:types` | passed | 7 workspaces passaram; houve apenas warning de versão do Node no Studio. |
| `npm run test:unit` | passed | 5 projetos passaram: 459 suítes e 1.514 testes. |
| `npm run check:architecture` | passed | 3572 módulos / 6364 dependências, sem violações. |
| `npm --workspace @stardust/web run test:integration` | warning | A suíte isolada de `official-solution` passou 5/5 e os 9 cenários da feature passaram. A execução completa foi interrompida após timeout externo em `auth/account-confirmation`; os 43 testes restantes não foram necessários para validar esta Spec. |

### Critérios dispensados por decisão de encerramento

PR, validação manual adicional, Quality Gate e build do CI não foram usados
como critérios de conclusão desta Spec.

## Warnings e findings

- `JS-01` — histórico com sentinela/popstate: `resolved` na Spec revisão 2.
- `JI-08` — Voltar limpo no harness: `resolved` pelos 9 cenários específicos
  verdes na execução atual.
- `JI-09` — validação manual autenticada: dispensado como gate de conclusão por
  decisão do usuário.
- `JI-10` — condição de corrida no teste externo à feature: `resolved`; o
  teste agora valida o `href` e registra o `waitForURL` antes do clique. Os 5
  cenários de `official-solution` passaram isoladamente após a correção.
- `EXT-01` — timeout em `auth/account-confirmation` durante a suíte geral:
  `external`, não relacionado à feature e não bloqueante para esta conclusão.
- A Architecture documenta Next.js 15, enquanto `apps/web/package.json` usa
  Next.js `^16.2.12`; warning não bloqueante já registrado.

## Decisões

- A issue `#517` permanece a fonte normativa porque o PRD local referenciado
  foi removido e o milestone remoto não contém o requisito de proteção.
- A Spec foi concluída com base nos sensores automatizados locais e nos testes
  específicos da feature; PR, validação manual adicional e CI foram dispensados
  como gates por decisão do usuário.
- `JI-10` foi corrigido no teste, sem alteração no produto; a validação da
  suíte completa permanece pendente.
- A confirmação customizada permanece restrita a navegações controladas; back,
  forward, reload e fechamento usam a confirmação nativa conforme decisão
  humana de 2026-08-01.

## Lições aprendidas

- O preflight geral pode conter falhas externas sem bloquear uma Spec quando os
  sensores da feature permanecem verdes e o finding é registrado.
- No App Router, observar `usePathname` ou `popstate` não equivale a possuir uma
  API cancelável antes de uma travessia.

## Alinhamento documental

- Spec: revisão 2, estado `completed`.
- Plan: concluído com `EXT-01` registrado como warning externo.
- Rules/Architecture/Overview: nenhuma atualização normativa necessária nesta
  tentativa; a divergência da versão do Next.js permanece warning.

## Conclusão

- Estado: `completed`.
- Próxima ação: nenhuma.

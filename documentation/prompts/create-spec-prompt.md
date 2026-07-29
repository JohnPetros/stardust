---
name: create-spec
description: Criar e julgar uma Spec técnica rastreável a partir do PRD e da codebase, usando subagentes na task atual.
---

# Criar Spec

O Orchestrator conduz toda a autoria na task/thread atual. Não crie outra
thread. Quando o escopo tocar múltiplos apps, pode usar subagentes de pesquisa
`Research <app>` com contexto mínimo e sem poder de decisão.

## Fontes

Leia o PRD ou demanda, `documentation/architecture.md`, Rules aplicáveis,
`documentation/sdd.md`, `documentation/rules/sdd-rules.md` e os paths reais da
codebase. Resolva ambiguidades materiais antes da solução técnica.

## Arquivo e Contract

Crie `documentation/features/<domínio>/<feature>/specs/<nome>-spec.md` com
`status: draft` e duas partes:

1. **Contract:** contexto, objetivo, fora de escopo, requisitos `RF-*` e matriz
   de critérios `CA-*`/`RN-*` com evidência esperada.
2. **Solução técnica:** estado atual confirmado, decisões, paths, contratos,
   persistência, erros, segurança, observabilidade e testes.

| ID | Requisito | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| `CA-01` | `RF-01` | pré-condição | ação | resultado observável | teste/comando/browser |
| `RN-01` | `RF-01` | contexto | ação | limite arquitetural ou não funcional | sensor/inspeção |

Não use comentários `harness:evidence`, gates de CLI ou baseline. Declare os
sensores esperados: `check:code`, `check:types`, `check:architecture`,
`check:dead-code`, `test:unit` e `test:integration` quando aplicável. Build é
validação final do CI.

## Judge Spec

Depois da revisão determinística, acione `judge-spec-agent` como subagente
`Judge Spec` dentro da task atual. Envie PRD, Spec, pesquisa, Architecture e
Rules; não envie narrativa persuasiva. O Judge é read-only.

- `failed`: corrija findings e acione novamente, até três tentativas iguais.
- `accepted`: altere a Spec para `status: open` e recomende `implement-spec` ou
  `create-plan` conforme a complexidade.

Nunca crie uma nova thread para pesquisa ou julgamento.

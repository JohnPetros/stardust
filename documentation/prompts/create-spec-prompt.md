---
name: create-spec
description: Criar e julgar uma Spec de feature, compacta ou completa, a partir de PRD, Issue, Report ou demanda direta.
---

# Criar Spec

O Orchestrator conduz a autoria na task atual. Não crie nova thread. Use Spec
somente para uma entrega relacionada a uma feature. Para manutenção transversal
sem Contract de feature, use fluxo direto.

## Classificação

Identifique a origem: `prd`, `issue`, `report` ou `direct-request`. Defina
`scope` com workspaces, diretórios ou arquivos. Use modo compacto para uma
mudança pequena e coesa; use modo completo quando houver múltiplos fluxos,
risco, integrações ou fases.

## Fontes

Leia a origem da demanda, `documentation/architecture.md`, Rules aplicáveis,
`documentation/sdd.md`, `documentation/rules/sdd-rules.md` e os paths reais da
codebase. Use Serena, Context7, Pencil, Playwright ou Supabase quando
aplicáveis.

Resolva ambiguidades materiais antes da solução técnica. Registre premissas e
questões pendentes; antes de `open`, questões pendentes devem estar resolvidas
e premissas críticas confirmadas ou explicitamente aceitas com risco.

## Arquivo e Contract

Crie `documentation/features/<domínio>/<feature>/specs/<nome>-spec.md` com:

```yaml
---
title: <título>
status: draft
revision: 1
source:
  type: <prd|issue|report|direct-request>
  ref: <url>
scope:
  - <workspace|diretório|arquivo>
last_updated_at: YYYY-MM-DD
---
```

O corpo deve conter contexto, escopo, Contract, estado atual, solução técnica,
plano de validação, avaliações, evidências finais, alinhamento documental e
amendments.

Use somente `RF-*` e `CA-*` como IDs obrigatórios:

```md
| CA | RF | Dado | Quando | Então | Evidência esperada |
|---|---|---|---|---|---|
| CA-01 | RF-01 | pré-condição | ação | resultado | teste/browser/sensor |
```

Segurança, performance e arquitetura entram como critérios de aceitação ou
restrições técnicas. Não use `RN-*`, `RNF-*`, `RA-*`, comentários
`harness:evidence`, gates próprios ou baselines.

Declare sensores aplicáveis: `check:code`, `check:types`, `test:unit`,
`check:architecture` e `test:integration`. `check:dead-code` não é oficial.
Build é validação final do CI.

## Judge Spec

Acione `judge-spec-agent` como subagente read-only `Judge Spec` na task atual.
Envie a origem, Spec, pesquisa, Architecture e Rules, sem narrativa persuasiva.

- `failed`: encaminhe findings ao Orchestrator, corrija e avalie novamente;
- `accepted`: altere a Spec para `status: open` e roteie para `implement-spec`
  ou `create-plan`.

Não crie nova thread para pesquisa ou julgamento.

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

`source` é uma lista e pode conter múltiplas referências associadas à mesma
Spec. É permitido associar Issue e PRD simultaneamente, além de Report ou
demanda direta quando aplicável. Detecte todas as fontes informadas ou
associadas, busque e leia cada uma delas. Se um PRD estiver associado à Issue,
sua leitura é obrigatória; a ausência de PRD não bloqueia uma Spec originada
de Issue. Em caso de conflito, registre a divergência e resolva a ambiguidade
antes de abrir a Spec.

Leia todas as fontes da demanda, `documentation/architecture.md`, Rules aplicáveis,
`documentation/sdd.md`, `documentation/rules/sdd-rules.md` e os paths reais da
codebase. Use Serena, Context7, Pencil, Playwright ou Supabase quando
aplicáveis.

Resolva ambiguidades materiais antes da solução técnica. Registre premissas e
questões pendentes; antes de `open`, questões pendentes devem estar resolvidas
e premissas críticas confirmadas ou explicitamente aceitas com risco.

## Arquivo e Contract

Crie `documentation/features/<domínio>/<feature>/spec.md` com:

```yaml
---
title: <título>
status: draft
revision: 1
source:
  - type: <prd|issue|report|direct-request>
    ref: <url>
scope:
  - <workspace|diretório|arquivo>
last_updated_at: YYYY-MM-DD
---
```

O corpo deve conter contexto, escopo, Contract, estado atual, solução técnica,
plano de validação, avaliações previstas, alinhamento documental e amendments.
Não crie um `evaluation.md` vazio nesta etapa; ele será criado após a
implementação ou o primeiro julgamento relevante e deverá existir antes do PR.

Use somente `RF-*` e `CA-*` como IDs obrigatórios:

```md
| CA | RF | Dado | Quando | Então | Evidência esperada |
|---|---|---|---|---|---|
| CA-01 | RF-01 | pré-condição | ação | resultado | teste/browser/sensor |
```

Segurança, performance e arquitetura entram como critérios de aceitação ou
restrições técnicas. Não use `RN-*`, `RNF-*`, `RA-*`, comentários
`harness:evidence`, gates próprios ou baselines.

Declare sensores aplicáveis: `format`, `check:code`, `check:types`, `test:unit`,
`check:architecture` e `test:integration`. `check:dead-code` não é oficial.
Quality Gate e build são validações finais do CI.

## Judge Spec

Acione `judge-spec-agent` como subagente read-only `Judge Spec` na task atual.
Envie a origem, Spec, pesquisa, Architecture e Rules, sem narrativa persuasiva.

- `failed`: encaminhe findings ao Orchestrator, corrija e avalie novamente;
- `accepted`: altere a Spec para `status: open` e roteie para `implement-spec`
  ou `create-plan` conforme tamanho e risco.

Não crie nova thread para pesquisa ou julgamento.

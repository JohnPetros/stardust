---
name: create-plan
description: Criar um Plan SDD opcional como ledger de waves, ownership, progresso, evidência e handoff de uma Spec open.
---

# Criar Plan

Crie `plan.md` ao lado de uma Spec `open` somente quando houver fases dependentes,
múltiplos boundaries, paralelismo útil, migration/integração, risco de segurança ou
concorrência, UI/validação complexa ou necessidade real de recovery ledger.

Leia `AGENTS.md`, `documentation/sdd.md`, Architecture, Tooling, Rule Pack, Spec e Design
Contract. O Plan não redefine comportamento, paths, schemas ou decisões. Ambiguidade material
retorna para amendment via `create-spec`.

## Gate obrigatório de Grilling

Execute o protocolo de Grilling definido em `documentation/sdd.md` antes de criar ou atualizar o
Plan. Monte uma design tree apenas para decisões de execução que a Spec não tenha determinado,
como decomposição em waves, ownership, paralelismo, ordem de migrations/integrações, gates de
ambiente, riscos, recovery e handoff.

Fatos sobre paths, dependências, ferramentas e runtime devem ser pesquisados, não perguntados. Em
cada round, pergunte toda a frontier disponível com uma recomendação; mantenha decisões
dependentes para rounds posteriores. Se a entrevista revelar ambiguidade de produto, Contract,
schema ou arquitetura, interrompa o Plan e encaminhe para amendment via `create-spec`.

Somente salve o Plan quando a frontier estiver vazia e o usuário confirmar o entendimento
compartilhado. Essa confirmação não autoriza implementação.

## Metadata

```yaml
---
title: <feature> — implementation plan
status: pending
spec: ./spec.md
spec_revision: 1
evaluation: ./evaluation.md
updated_at: YYYY-MM-DD
---
```

## Estrutura obrigatória

### 1. Execution status

Registre revisão/status da Spec, motivo do Plan, fase atual, próxima ação, blockers, Builders
ativos/próximos e ownership compartilhado que o Orchestrator deve coordenar.

### 2. Execution ledger

```md
| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| ---- | ------- | ----- | ---- | ---------- | ------------- | ------ | -------------- |
```

Derive dependências apenas do Technical Contract, runtime e paths. Use Builders de ownership
estável, reutilizados entre fases; não crie Builder por tarefa/pacote. Padrão máximo: três
Builders simultâneos, apenas com paths não sobrepostos e contracts estáveis.

Cada task card contém exatamente: status/owner, dependências/paralelismo, paths, RF/CA,
resultado observável, Rules e exit. UI inclui widget-tree, estados, teclado, viewport, console,
requests e screenshot Playwright. Server/banco inclui request/response real, autorização,
tenant e persistência no Supabase Dev quando aplicável.

### 3. Validation and handoff

```md
| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
```

Agende todos os `MV-*`, sensores, runtime e referências visuais separadamente por estado e
viewport. Agende exatamente um `implementation-reviewer-agent` após a integração dos Builders.

### 4. Execution log

Inclua somente depois de finding, retry, blocker ou evento material. O Plan possui status e
próxima ação; detalhes de comandos e resultados pertencem a `evaluation.md`.

Antes de salvar, verifique revisão, DAG acíclico, RF/CA completos, paths não sobrepostos,
Rules válidas, exits executáveis e handoff para `implement-spec`. A task principal executa esse
gate sem ativar um agente separado.

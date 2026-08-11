---
name: create-plan
description: Criar um Plan SDD como ledger de fases, progresso, evidências e handoff para uma Spec de feature.
---

# Criar Plan

Crie `plan.md` somente quando a Spec `open` possuir fases dependentes, múltiplos
workspaces, migration relevante, risco elevado ou necessidade real de ledger.
Para Spec pequena, use `implement-spec` diretamente.

O Orchestrator cria `documentation/features/<domínio>/<feature>/plan.md` na
task atual e mantém a relação com a revisão da Spec:

```yaml
spec: ../specs/<nome>-spec.md
spec_revision: 1
status: pending
```

Inclua:

- objetivo, escopo e fora de escopo;
- fases ordenadas e dependências;
- tarefas com paths, resultado observável e IDs `RF-*`/`CA-*`;
- campo `parallelizable` e motivo quando aplicável;
- sensores e evidências esperados por fase;
- riscos, findings ativos, tentativas, estado e próxima ação;
- veredito do `Judge Plan` antes da implementação;
- modo `Final` e escopo do único `Judge Implementation Final` após a
  integração de todas as fases.

## Design e Pencil

Quando a Spec possuir referências de design, preserve no Plan exatamente o path
do arquivo `.pen`, os Node IDs, os nomes, os estados, as variantes e os
viewports declarados. Cada tarefa de UI deve citar as referências relevantes,
os respectivos `RF-*`/`CA-*` e o resultado observável esperado.

Separe, quando aplicável, tarefas para atualizar o design no Pencil, implementar
a UI e validar o resultado. Não substitua ou crie Node IDs no Plan; uma
referência ausente, divergente ou inválida deve ser registrada como finding e
resolvida por amendment da Spec antes da implementação afetada.

A fase de validação de frontend deve incluir:

- comparação dos nodes finais no Pencil com a fonte visual canônica;
- fluxo real no Playwright para os estados e viewports previstos, incluindo
  loading, error, empty e content quando aplicáveis;
- evidências separadas da inspeção visual, do comportamento em runtime e dos
  testes automatizados.
- auditoria de `ui-layer-rules.md` por widget, com `index.tsx`, `*View.tsx`,
  Hook, paths e linhas avaliadas.

Pencil não substitui a validação no navegador, e Playwright não redefine a
fonte visual especificada.

Estados de tarefa: `pending`, `implementing`, `validating`, `verified`.
Estados de fase: `pending`, `in_progress`, `awaiting_judgment`, `failed`,
`accepted`.

Depois de criar o Plan, acione `judge-plan-agent` como `Judge Plan` read-only.
Somente após `accepted` o Orchestrator deve encaminhar para `implement-plan`.
Em `failed`, persista os findings, corrija o Plan e repita o julgamento antes de
criar Builders.

Somente o Orchestrator atualiza o Plan. Builders implementam; Judges avaliam
read-only. Não crie Judges de implementação por fase: fases passam por sensores
e aguardam o julgamento integrado final. Tarefas, dependências e findings
operacionais devem ser persistidos imediatamente no Plan. Evidências, decisões
e lições da feature pertencem ao `evaluation.md`, criado após implementação ou
julgamento. Todos são subagentes da task atual. Não use nova thread.

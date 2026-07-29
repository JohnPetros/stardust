---
name: implement-plan
description: Orquestrar um Plan com Builder, Workers, sensores e Judges independentes na task atual.
---

# Implementar Plan

Leia Plan, Spec, Architecture, Rules e `sdd-rules.md`. O Orchestrator mantém o
Plan e todo o fluxo ocorre na task/thread atual.

Para cada fase:

1. confirme dependências, revisão da Spec, critérios, paths e evidências;
2. marque fase/tarefa atual como `in_progress`/`implementing`;
3. acione `builder-agent` como `Builder F<n>` dentro da task atual;
4. o Builder pode acionar até dois `worker-agent` para unidades independentes e
   paths sem sobreposição; Workers não criam subagentes;
5. aguarde toda a árvore do Builder, inspecione e integre o diff;
6. execute `format`, `check:code`, `check:types` e `test:unit` no escopo;
   execute `check:architecture`, `check:dead-code` e `test:integration` conforme
   a fase;
7. marque tarefas `verified` somente após os sensores;
8. acione `judge-implementation-agent` como `Judge F<n>`, irmão read-only do
   Builder. Envie Contract, diff agregado, Rules e evidências, sem narrativa;
9. em `failed`, reabra tarefas, devolva findings ao Builder e repita; em
   `accepted`, aceite a fase e avance.

Registre no Plan apenas decisões, evidências resumidas, findings ativos,
tentativas e próxima ação. Mudança de produto volta ao PRD; amendment contratual
atualiza Spec e invalida avaliações afetadas.

Após todas as fases aceitas, execute sensores integrados e encaminhe para
`conclude-spec`. Não crie outra thread para Builder, Judge ou conclusion.

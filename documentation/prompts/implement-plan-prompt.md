---
name: implement-plan
description: Orquestrar um Plan de feature com Builders irmãos, sensores e Judges independentes na task atual.
---

# Implementar Plan

Leia Plan, Spec, Architecture, Rules e `documentation/rules/sdd-rules.md`. O
Orchestrator mantém o Plan e todo o fluxo ocorre na task atual.

Para cada fase:

1. confirme revisão da Spec, dependências, critérios, paths e evidências;
2. marque fase/tarefa como `in_progress`/`implementing`;
3. crie `Builder F<n>` para o escopo principal;
4. identifique tarefas prontas, independentes e sem paths sobrepostos;
5. quando houver paralelismo real, crie até dois `Builder F<n>-T<m>` irmãos;
6. aguarde os Builders, inspecione e integre o diff;
7. execute `format`, `check:code`, `check:types` e `test:unit`; execute
   `check:architecture` e `test:integration` conforme a fase;
8. marque tarefas `verified` somente após os sensores aplicáveis;
9. crie `Judge Implementation` `Phase F<n>` read-only irmão dos Builders;
10. em `failed`, crie Builder Fix, reabra tarefas afetadas e repita; em
    `accepted`, aceite a fase e avance.

Builders não criam subagentes nem editam Plan. Judges não editam arquivos. O
Orchestrator registra no Plan decisões, evidências resumidas, findings,
tentativas e próxima ação; registra na Spec as avaliações formais.

Após todas as fases aceitas, execute sensores integrados. Quando a integração
exigir avaliação adicional, crie `Judge Implementation Final`; depois
encaminhe para `conclude-spec`.

Não crie outro papel de implementação ou Judge de conclusão separado, fork ou
nova thread.

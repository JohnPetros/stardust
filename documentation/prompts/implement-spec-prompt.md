---
name: implement-spec
description: Orquestrar a implementação direta de uma Spec pequena com Builder Direct, sensores e Judge Implementation na task atual.
---

# Implementar Spec diretamente

Use para uma Spec `open`, pequena e coesa:

```text
Orchestrator → Builder Direct → sensores → Judge Implementation Direct
```

1. Leia Spec, Architecture, Rules e `documentation/rules/sdd-rules.md`.
2. Congele a revisão e o commit-base.
3. Crie `Builder Direct` como subagente e envie Contract, resultado observável,
   paths, Rules, Architecture e MCPs aplicáveis.
4. Inspecione o diff; o Builder não atualiza Spec, Plan ou estado.
5. Execute `format`, `check:code`, `check:types` e `test:unit`; execute
   `check:architecture` e `test:integration` quando aplicáveis.
6. Crie `Judge Implementation` read-only irmão do Builder. Envie Spec, revisão,
   diff, critérios, Rules, Architecture e evidências oficiais.
7. Se `failed`, crie `Builder Fix QG-<n>`, reexecute sensores invalidados e
   acione novo Judge quando necessário. Após três falhas iguais, escale ao
   usuário.
8. Se `accepted`, registre avaliação e evidências na Spec e encaminhe para
   `conclude-spec`.

Não crie outro papel de implementação ou Judge de conclusão separado, fork ou
nova task.

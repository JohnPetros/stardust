---
name: implement-spec
description: Orquestrar a implementação direta de uma Spec pequena com Builder, sensores e Judge na task atual.
---

# Implementar Spec diretamente

Use para entrega pequena e coesa. O fluxo inteiro permanece na task atual:

```text
Orchestrator → Builder Direct → sensores → Judge Direct
```

1. Leia Spec `open`, Architecture, Rules e `sdd-rules.md`; congele revisão e
   commit-base.
2. Acione `builder-agent` como subagente `Builder Direct`. Envie Contract,
   resultado observável, paths e Rules. No modo direto não há Workers.
3. Aguarde o Builder e inspecione o diff; ele não atualiza Spec nem estado.
4. Execute `format`, `check:code`, `check:types` e `test:unit` no escopo. Execute
   `check:architecture` e `test:integration` quando aplicáveis.
5. Com os sensores aprovados, acione `judge-implementation-agent` como
   `Judge Direct`, subagente read-only irmão do Builder. Envie Spec/revisão,
   diff, critérios, Rules e resultados dos sensores; não envie narrativa do
   Builder.
6. Se `failed`, devolva apenas findings bloqueantes ao Builder, reexecute os
   sensores invalidados e acione novo Judge. Máximo de três tentativas iguais.
7. Se `accepted`, registre evidências e encaminhe para `conclude-spec`.

Promova para Plan se surgirem fases dependentes, migration relevante, risco alto
ou necessidade de handoff. Não use `create_thread`, fork ou nova task para
implementation ou julgamento.

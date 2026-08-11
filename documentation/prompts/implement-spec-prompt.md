---
name: implement-spec
description: Orquestrar a implementação direta de uma Spec pequena com Builder Direct, sensores e Judge Implementation na task atual.
---

# Implementar Spec diretamente

Use para uma Spec `open`, pequena e coesa:

```text
Orchestrator → Builder Direct → sensores → Judge Implementation Direct
→ preflight → evaluation.md → create-pr
```

1. Leia Spec, Architecture, Rules, `documentation/sdd.md` e
   `documentation/rules/sdd-rules.md`.
2. Congele a revisão e o commit-base.
3. Crie `Builder Direct` como subagente e envie Contract, resultado observável,
   paths, Rules, Architecture e MCPs aplicáveis.
4. Inspecione o diff; o Builder não atualiza Spec, Plan ou estado.
5. Execute `format`, `check:code`, `check:types` e `test:unit`; execute
   `check:architecture` e `test:integration` quando aplicáveis. Para frontend,
   faça também a auditoria de `ui-layer-rules.md` e a comparação dos nodes
   Pencil aplicáveis com a Web real. Build não é necessário neste ciclo.
6. Crie o único `Judge Implementation Direct` read-only irmão do Builder. Envie
   Spec, revisão, Contract, diff, critérios, Rules, Architecture, auditoria UI,
   evidências Pencil/Playwright e resultados oficiais dos sensores.
7. Se `failed`, registre o finding no `evaluation.md` (ou crie um Plan se ele
   exigir tarefas), crie `Builder Fix QG-<n>`, reexecute sensores invalidados e
   repita o Judge quando o diff ou qualquer evidência tiver sido invalidada.
   Qualquer mudança após o veredito invalida o aceite anterior. Após três
   falhas iguais, escale ao usuário.
8. Execute o preflight integrado e crie/atualize `evaluation.md` com evidências
   reais, resultado do Judge, warnings, findings, decisões e lições.
9. Encaminhe para `create-pr` somente com o Judge aceito e o `evaluation.md`
   completo; depois do CI verde, use `conclude-spec`.

Não crie outro papel de implementação, fork ou nova task para o fechamento.

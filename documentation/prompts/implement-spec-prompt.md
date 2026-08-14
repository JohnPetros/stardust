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
3. Crie ou atualize um `plan.md` operacional mínimo para a implementação direta
   (mesmo sem fases), contendo a tarefa, paths, critérios, estado e próxima ação.
   O Plan será mantido durante todo o fluxo para registrar cada mudança.
4. Crie `Builder Direct` como subagente e envie Contract, resultado observável,
   paths, Rules, Architecture, os paths/Node IDs Pencil canônicos, estados,
   viewports e MCPs aplicáveis.
5. Inspecione o diff; o Builder não atualiza Spec, Plan ou estado.
6. Execute `format`, `check:code`, `check:types` e `test:unit`; execute
   `check:architecture` e `test:integration` quando aplicáveis. Para frontend,
   faça também a auditoria de `ui-layer-rules.md` e a comparação independente
   dos nodes Pencil aplicáveis com a Web real, no mesmo viewport e estado.
   Preserve o design canônico; qualquer simplificação, substituição, adição ou
   divergência não aprovada é finding bloqueante. Build não é necessário neste
   ciclo.
7. Crie o único `Judge Implementation Direct` read-only irmão do Builder. Envie
   Spec, revisão, Contract, diff, critérios, Rules, Architecture, auditoria UI,
   evidências Pencil/Playwright, matriz de divergências aprovadas e resultados
   oficiais dos sensores.
7. Se `failed`, registre o finding no `evaluation.md` (ou crie um Plan se ele
   exigir tarefas), crie `Builder Fix QG-<n>`, reexecute sensores invalidados e
   repita o Judge quando o diff ou qualquer evidência tiver sido invalidada.
   Qualquer mudança após o veredito invalida o aceite anterior. Após três
   falhas iguais, escale ao usuário.
8. Execute o preflight integrado e crie/atualize `evaluation.md` com evidências
   reais, resultado do Judge, warnings, findings, decisões e lições.
9. Encaminhe para `create-pr` somente com o Judge aceito e o `evaluation.md`
   completo; depois do CI verde, use `conclude-spec`.

## Persistência obrigatória após cada mudança

Depois de **cada mudança de implementação**, o Orchestrator deve atualizar
imediatamente o `plan.md` e o `evaluation.md`, antes de iniciar outra mudança,
executar o próximo sensor ou criar o Judge. Isso vale individualmente para a
implementação inicial, `Builder Fix`, alterações de seed/fixture/configuração/
ambiente, artefatos gerados ou derivados e testes novos ou alterados — inclusive
mudanças feitas para corrigir review, sensores, Quality Gate ou Judge.

No `plan.md`, registre a tarefa, tentativa, motivo, paths/artefatos afetados,
RF/CA, estado e próxima ação. No `evaluation.md`, registre a mudança como
evidência factual, impacto nos critérios, sensores/evidências invalidados ou
pendentes, commit/HEAD e decisões, warnings ou findings. Para seed/ambiente,
registre escopo, procedimento reproduzível e cleanup sem expor segredos; para
artefatos gerados, fonte, gerador e output; para testes, comportamento protegido
e comando de execução.

Não agrupe mudanças em um registro retrospectivo. Se a mudança alterar o diff
ou qualquer evidência de Contract, Rule, Pencil ou Playwright, invalide o
veredito anterior e registre o novo sensor/Judge necessário. O fluxo não pode
prosseguir enquanto o Plan e o `evaluation.md` não refletirem a mudança mais
recente.

Não crie outro papel de implementação, fork ou nova task para o fechamento.

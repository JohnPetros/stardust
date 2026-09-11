---
name: judge-plan
description: Verificar se um Plan SDD está íntegro e pronto para implementação.
---

# Verificar integridade do Plan

A task principal verifica o `plan.md` depois de sua criação e antes do primeiro
Builder. Não há agente separado para esse gate.

Antes da análise semântica, execute `npm run check:plan-definition -- <plan.md>`.
Esse único gate cobre definição e estado de execução; um resultado diferente de `passed` é
`needs_revision` e deve ser corrigido antes do julgamento.

Envie a Spec `open`, sua revisão, o Plan, Architecture, Rules, pesquisa dos
paths envolvidos, riscos e decisões registradas. Quando houver UI, inclua os
paths/Node IDs Pencil, estados, variantes, viewports e a matriz de divergências
aprovadas. Essa verificação não edita arquivos, não cria tarefas e não resolve
decisões de produto ou arquitetura.

- `ready`: persista o resultado no Plan e encaminhe para `implement-plan`;
- `needs_revision`: persista cada finding bloqueante no Plan, corrija o Plan e
  repita o gate;
- não inicie Builders enquanto o gate estiver pendente ou com findings abertos.

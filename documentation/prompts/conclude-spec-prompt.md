---
name: conclude-spec
description: Fechar uma Spec de feature com evidências finais, CI Quality Gate e build, usando Judge Implementation final quando necessário.
---

# Concluir Spec

O Orchestrator conduz o fechamento na task atual. Não crie nova thread.

## Pré-condições

- Spec `in_progress`;
- implementação direta aceita ou todas as fases aceitas;
- nenhuma tarefa ou finding bloqueante pendente;
- revisão da Spec correspondente ao diff atual.

## Validação final

1. Execute `format` se ainda houver alterações.
2. Execute `check:code`, `check:types` e `test:unit` no escopo integrado.
3. Execute `check:architecture` quando fronteiras ou dependências mudaram.
4. Execute `test:integration` quando declarado pela Spec ou aplicável.
5. Atualize a matriz de evidências na Spec.
6. Crie `Judge Implementation Final` quando houver Plan, múltiplas fases, alto
   risco ou mudança após o último veredito.
7. Registre o veredito e o commit avaliado na Spec.

Em uma Spec pequena, o `Judge Implementation Direct` pode ser o veredito final
e não há segundo Judge.

## Documentação e entrega

Alinhe PRD, Rules, Architecture, modules, tooling e overview conforme os fatos.
Atualizações normativas que alteram produto, Contract, Rules globais ou
fronteiras arquiteturais exigem decisão do usuário.

Crie o commit e PR, solicite Codex Review e aguarde Quality Gate e build do
`HEAD` atual. O Quality Gate repete os sensores oficiais; build é a validação
final do artefato no CI.

Se Quality Gate ou build falhar, mantenha a Spec `in_progress`, registre a
falha na Spec, crie `Builder Fix QG-<n>` quando a correção estiver no escopo,
reexecute sensores invalidados e reavalie se o diff mudar.

Somente depois de CI verde, conversas bloqueantes resolvidas e PR mergeable:

- preencha evidências finais;
- registre alinhamento documental;
- altere a Spec para `completed`;
- conclua o Plan, quando existir.

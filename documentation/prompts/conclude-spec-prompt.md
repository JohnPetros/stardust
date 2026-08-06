---
name: conclude-spec
description: Fechar uma Spec de feature após avaliação, CI Quality Gate e build, atualizando evaluation.md e usando Judge Implementation final quando necessário.
---

# Concluir Spec

O Orchestrator conduz o fechamento na task atual. Não crie nova thread.

## Pré-condições

- Spec `in_progress`;
- implementação direta aceita ou todas as fases aceitas;
- nenhuma tarefa ou finding bloqueante pendente;
- revisão da Spec correspondente ao diff atual;
- `evaluation.md` criado e atualizado até o preflight.

## Validação final

1. Confirme que os sensores locais e o preflight estão registrados em
   `evaluation.md`.
2. Atualize `evaluation.md` com a matriz de evidências reais, status de warnings
   e findings, decisões, lições e o SHA final.
3. Crie `Judge Implementation Final` quando houver Plan, múltiplas fases, alto
   risco ou mudança após o último veredito.
4. Registre o veredito final e o commit avaliado em `evaluation.md`, quando
   houver commit avaliado.

Em uma Spec pequena, o `Judge Implementation Direct` pode ser o veredito final
e não há segundo Judge. O `evaluation.md` continua obrigatório.

## Documentação e entrega

Alinhe PRD, Rules, Architecture, modules, tooling e overview conforme os fatos.
Atualizações normativas que alteram produto, Contract, Rules globais ou
fronteiras arquiteturais exigem decisão do usuário.

`create-pr` cria o commit/PR e solicita Codex Review. O `conclude-spec` não exige
que o Plan, `evaluation.md`, o worktree ou o CI estejam associados ao mesmo
HEAD. Quality Gate e build podem ser registrados como evidência disponível, mas
não são pré-condições adicionais deste fluxo.

Se Quality Gate ou build falhar, mantenha a Spec `in_progress`, registre a
falha imediatamente em `evaluation.md`, crie `Builder Fix QG-<n>` quando a
correção estiver no escopo, reexecute sensores afetados e repita o Judge apenas
se a evidência tiver sido invalidada.

- preencha evidências finais em `evaluation.md`;
- registre alinhamento documental, decisões e lições;
- altere a Spec para `completed`;
- conclua o Plan, quando existir.

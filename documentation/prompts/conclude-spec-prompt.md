---
name: conclude-spec
description: Fechar uma Spec de feature após o único Judge Implementation, CI Quality Gate e build, atualizando evaluation.md.
---

# Concluir Spec

O Orchestrator conduz o fechamento na task atual. Não crie nova thread.

## Pré-condições

- Spec `in_progress`;
- implementação direta aceita ou todas as fases aceitas;
- nenhuma tarefa ou finding bloqueante pendente;
- revisão da Spec correspondente ao diff atual;
- `evaluation.md` criado e atualizado até o preflight;
- Judge Implementation único aceito para o HEAD atual.

## Validação final

1. Confirme que os sensores locais e o preflight estão registrados em
   `evaluation.md`.
2. Atualize `evaluation.md` com a matriz de evidências reais, status de warnings
   e findings, decisões, lições e o SHA final.
3. Não crie um segundo Judge no fechamento. Use o único `Judge Implementation`
   já executado para a implementação inteira; em uma Spec direta, ele é o
   `Judge Implementation Direct`, e em um Plan, o `Judge Implementation Final`.
4. Se houver qualquer alteração depois do veredito, interrompa o fechamento,
   atualize o diff/evidências e repita o Judge único antes de continuar.
5. Registre o veredito e o commit/HEAD avaliado em `evaluation.md`.

Para frontend, confirme no `evaluation.md` a auditoria de
`ui-layer-rules.md` e a matriz independente Pencil/Web antes de marcar a Spec
como concluída. A matriz deve comprovar fidelidade Pencil-to-code no HEAD atual;
node ausente, contradito, adicionado sem aprovação ou divergência sem decisão
rastreável mantém a Spec `in_progress` e exige correção ou amendment.

## Documentação e entrega

Alinhe PRD, Rules, Architecture, modules, tooling e overview conforme os fatos.
Atualizações normativas que alteram produto, Contract, Rules globais ou
fronteiras arquiteturais exigem decisão do usuário.

`create-pr` cria o commit/PR e solicita Codex Review. O Plan, `evaluation.md`, o
worktree, o Judge e o CI devem apontar para o mesmo HEAD final. Quality Gate e
build verdes são pré-condições para concluir a Spec; enquanto o PR estiver
aberto, ficam `pending` no `evaluation.md`.

### Referência para `create-pr`

Ao concluir a Spec, registre o handoff para a skill `create-pr` quando a entrega
ainda não tiver um PR associado. Esta integração é somente por referência:
`conclude-spec` não executa `create-pr`, não cria commit, não faz stage/push e
não abre PR automaticamente. O workflow responsável por agrupar commits,
abrir o PR, solicitar Codex Review e acompanhar o CI é
`.agents/skills/create-pr/SKILL.md`.

Se Quality Gate ou build falhar, mantenha a Spec `in_progress`, registre a
falha imediatamente em `evaluation.md`, crie `Builder Fix QG-<n>` quando a
correção estiver no escopo, reexecute sensores afetados e repita o único Judge
quando o diff ou a evidência tiver sido invalidada.

- preencha evidências finais em `evaluation.md`;
- registre alinhamento documental, decisões e lições;
- altere a Spec para `completed`;
- conclua o Plan, quando existir.

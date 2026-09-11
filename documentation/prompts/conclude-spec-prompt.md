---
name: conclude-spec
description: Fechar uma Spec de feature após os Implementation Reviewers pareados, checks e build do CI, atualizando evaluation.md.
---

# Concluir Spec

A task principal conduz o fechamento na task atual. Não crie nova thread.

## Pré-condições

- Spec `in_progress`;
- implementação direta aceita ou todas as fases aceitas;
- nenhuma tarefa ou finding bloqueante pendente;
- revisão da Spec correspondente ao diff atual;
- `evaluation.md` criado e atualizado até o preflight;
- um Implementation Reviewer aceito para cada Builder e o HEAD correspondente.

## Validação final

1. Confirme que os sensores locais e o preflight estão registrados em
   `evaluation.md`, incluindo `test:coverage` e `check:coverage` para Core,
   Server, Studio ou Web quando aplicável.
2. Execute `npm run check:spec-definition -- <spec>` contra a revisão final. Um
   resultado diferente de `passed` impede a conclusão.
3. Se houver Plan, execute `npm run check:plan-definition -- <plan>` contra a
   definição e o estado final. Um resultado diferente de `passed` impede a conclusão.
4. Execute `npm run check:spec-implementation -- <spec> --base <commit-base>`
   contra o HEAD final e registre a saída em `evaluation.md`. Um resultado
   diferente de `passed` impede a conclusão.
5. Execute `npm run check:test-integrity -- --base <commit-base>` contra o HEAD
   final e registre a saída em `evaluation.md`. Um resultado diferente de
   `passed` impede a conclusão.
6. Atualize `evaluation.md` com a matriz de evidências reais, status de warnings
   e findings, decisões, lições e o SHA final.
7. Não substitua os Reviewers pareados por um veredito único. Confirme um
   `Implementation Reviewer` aceito para cada Builder; em uma Spec direta, há
   um Reviewer Direct, e em um Plan, um Reviewer por fase/tarefa Builder.
8. Se houver qualquer alteração depois de um veredito, interrompa o fechamento,
   atualize o diff/evidências e repita o Reviewer pareado do Builder afetado.
9. Registre o veredito e o commit/HEAD avaliado em `evaluation.md`.

10. Analise todos os findings, warnings e falhas observados durante a Spec
   (Reviewer, sensores, CI e validação manual). Para cada item, determine se a
   causa é pontual ou revela uma lacuna recorrente de processo, arquitetura,
   tooling ou regra de camada.
11. Para cada lacuna recorrente, atualize a documentação normativa relevante
   antes de concluir: `documentation/rules/`, `architecture.md`, `tooling.md`,
   `AGENTS.md` ou os prompts afetados. Quando for um erro de implementação
   reutilizável, use o workflow `register-antipattern` para registrar o
   anti-padrão na Rule da camada correta.
12. Registre em `evaluation.md` uma ação preventiva por finding, com causa,
   documento atualizado (ou `não aplicável` e justificativa), evidência e
   estado. Não marque a Spec como `completed` enquanto uma atualização
   necessária estiver pendente.

Para frontend, confirme no `evaluation.md` a auditoria de
`ui-layer-rules.md` e a matriz independente Pencil/Web antes de marcar a Spec
como concluída. A matriz deve comprovar fidelidade Pencil-to-code no HEAD atual;
node ausente, contradito, adicionado sem aprovação ou divergência sem decisão
rastreável mantém a Spec `in_progress` e exige correção ou amendment.

## Documentação e entrega

Alinhe PRD, Rules, Architecture, modules, tooling e overview conforme os fatos.
Atualizações normativas que alteram produto, Contract, Rules globais ou
fronteiras arquiteturais exigem decisão do usuário.

`create-pr` cria o commit/PR e solicita Codex Review. O Plan, `evaluation.md`, os
Reviewers pareados e o CI devem apontar para o HEAD final correspondente. Todos os checks
obrigatórios e o build verdes são pré-condições para concluir a Spec; enquanto
o PR estiver aberto, ficam `pending` no `evaluation.md`.

### Referência para `create-pr`

Ao concluir a Spec, registre o handoff para a skill `create-pr` quando a entrega
ainda não tiver um PR associado. Esta integração é somente por referência:
`conclude-spec` não executa `create-pr`, não cria commit, não faz stage/push e
não abre PR automaticamente. O workflow responsável por agrupar commits,
abrir o PR, solicitar Codex Review e acompanhar o CI é
`.agents/skills/create-pr/SKILL.md`.

Se um check ou o build falhar, mantenha a Spec `in_progress`, registre a falha
imediatamente em `evaluation.md`, crie `Builder Fix CI-<n>` quando a
correção estiver no escopo, reexecute sensores afetados e repita o Reviewer
pareado do Builder quando o diff ou a evidência tiver sido invalidada.

- preencha evidências finais em `evaluation.md`;
- conclua a análise preventiva dos findings e registre as atualizações
  documentais correspondentes em `evaluation.md`;
- registre alinhamento documental, decisões e lições;
- altere a Spec para `completed`;
- conclua o Plan, quando existir.

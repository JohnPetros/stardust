---
name: resolve-pr-pendencies
description: Resolver checks e conversas de review de um PR aberto, reabrindo e roteando sua entrega SDD quando necessário.
---

# Resolver pendências de PR

Inspecione PR, HEAD, checks, conversas, Spec, Plan, Evaluation e diff. Classifique cada item:

- explicação: responda com evidência, sem reabrir SDD;
- metadata do PR: corrija metadata, sem reabrir Spec;
- correção de implementação: Spec `open` na mesma revisão, Plan/Evaluation `in_progress`,
  finding com URL do comentário, `implement-spec`, depois `conclude-spec`;
- mudança de Contract: Spec `draft`, authority/amendment por `create-spec`, revisão incrementada,
  Plan/Evaluation reconciliados, `implement-spec`, depois `conclude-spec`.

Não corrija feature code diretamente neste workflow e não resolva conversa antes de a ação
existir na branch ou a resposta baseada em evidência estar publicada. Enquanto o PR estiver
aberto, reutilize a mesma Spec e PR. Após merge, use Bug Report para defeito ou change Spec para
novo comportamento.

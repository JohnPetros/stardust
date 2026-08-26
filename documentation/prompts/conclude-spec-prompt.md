---
name: conclude-spec
description: Publicar uma implementação SDD ready, executar o gate final de CI do PR e fechar Spec, Plan e Evaluation.
---

# Concluir Spec

Este workflow possui publicação, CI final e closure. Não implementa correções diretamente.

## Pré-condições

- Spec `in_progress` e revisão igual à Evaluation;
- Evaluation `ready`, com CA/MV/runtime/visual atuais;
- Plan completo quando presente;
- conformance de paths, widget tree, contracts, exclusões e estados atuais;
- validação manual obrigatória de `AGENTS.md` registrada;
- nenhum finding bloqueante.

Commit, push e criação/atualização de PR exigem autorização explícita ou já concedida no escopo.
Não faça merge ou deploy sem pedido explícito.

## Publicação

1. releia Spec, Rule Pack, Tooling, Plan e Evaluation;
2. execute preflight e conformance no candidato atual;
3. revise migrations, generated artifacts, Design e documentação factual;
4. invoque `commit-code` para commits intencionais;
5. invoque obrigatoriamente `create-pr` quando o PR não existir ou metadata/HEAD estiver stale;
6. garanta PR ready-for-review e registre número, URL, base e head SHA.

Discrepância dentro do Contract cria finding, torna evidência `stale`, muda Evaluation para
`in_progress` e invoca imediatamente `implement-spec`. Mudança de Contract volta a Spec para
`draft` e invoca `create-spec`. Retome a conclusão automaticamente quando Evaluation voltar a
`ready`.

## Gate final de CI

Monitore todos os checks aplicáveis anexados ao HEAD atual do PR até estado terminal. Registre
workflow, resultado, URL e SHA em Evaluation. Run de push, SHA anterior, check cancelado ou
workflow esperado ausente não passam o gate.

Em falha determinística: `implement-spec`/amendment → `commit-code` → atualizar o mesmo PR por
`create-pr` → aguardar CI do novo HEAD. Só repita o mesmo SHA quando houver evidência concreta
de falha transitória. Após três falhas materialmente idênticas, escale apenas se faltar decisão
ou mudança externa.

## Closure

Depois de CI verde e sem finding bloqueante:

- confira que cada lição reutilizável possui disposition para PRD, Architecture, Rule, Tooling,
  Overview ou `No change` justificado;
- marque Evaluation `completed`;
- marque Plan `completed` quando presente;
- marque Spec `completed` e mantenha link para Evaluation.

Não crie commit exclusivo apenas para estados operacionais de SDD. Feedback posterior em PR
aberto pode reabrir a mesma Spec; após merge, use Bug Report ou change Spec.

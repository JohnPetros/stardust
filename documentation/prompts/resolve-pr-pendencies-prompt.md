---
name: resolve-pr-pendencies
description: Resolver checks de CI e conversas de review até o PR ficar mergeable.
---

# Resolver pendências de PR

Trabalhe na sessão atual e sempre contra o `HEAD` mais recente.

1. Inspecione status mergeable, checks e conversas não resolvidas.
2. Classifique cada pendência como falha determinística, teste, build, ambiente,
   feedback de review ou conflito com Spec/Architecture.
3. Reproduza localmente usando os mesmos scripts do CI:
   `check:code`, `check:types`, `test:unit`, `check:architecture` e
   `test:integration` quando aplicável.
4. Corrija a causa no menor escopo seguro; não desative regras nem adicione
   exclusões para esconder regressões.
5. Aplique `format`, reexecute os sensores invalidados e faça revisão do diff.
6. Responda e resolva cada conversa de review bloqueante somente após a
   correção existir no branch. Liste as review threads do PR, identifique as
   threads com `isResolved: false`, publique a resposta técnica na própria
   conversa quando necessário e use a mutação de resolução do GitHub para
   marcar a thread como resolvida. Um comentário geral no PR não substitui a
   resolução da thread inline.
7. Depois da resolução, consulte novamente as threads e confirme que não há
   conversas bloqueantes abertas. Diferencie isso de `REVIEW_REQUIRED`: uma
   aprovação humana pendente não pode ser simulada pelo agente e deve ser
   reportada separadamente.
8. Faça push e aguarde novamente os checks, testes e build do novo `HEAD`.

Mudança de produto, Contract, arquitetura ou segurança precisa atualizar as
fontes normativas antes de prosseguir. Antes do handoff, verifique o estado do
`HEAD` atual, os checks, `mergeable`, `mergeStateStatus`, `reviewDecision` e as
review threads. Encerre somente com checks verdes, conversas bloqueantes
resolvidas e PR mergeable; se `REVIEW_REQUIRED` continuar, declare a aprovação
humana como o único bloqueio externo restante.

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
   `check:code`, `check:types`, `check:architecture`, `check:dead-code`,
   `test:unit` e `test:integration` quando aplicável.
4. Corrija a causa no menor escopo seguro; não desative regras nem adicione
   exclusões para esconder regressões.
5. Aplique `format`, reexecute os sensores invalidados e faça revisão do diff.
6. Responda/resolva conversas apenas após a correção existir no branch.
7. Faça push e aguarde novamente Quality Gate, testes e build do novo `HEAD`.

Mudança de produto, Contract, arquitetura ou segurança precisa atualizar as
fontes normativas antes de prosseguir. Encerre somente com checks verdes,
conversas bloqueantes resolvidas e PR mergeable.

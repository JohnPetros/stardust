---
name: implement-plan
description: Orquestrar um Plan de feature com Builders irmãos, sensores e Judges independentes na task atual.
---

# Implementar Plan

Leia `plan.md`, Spec, Architecture, Rules, `documentation/sdd.md` e
`documentation/rules/sdd-rules.md`. O
Orchestrator mantém o Plan e todo o fluxo ocorre na task atual.

Inicie somente com um `Judge Plan` `accepted` para a revisão vigente da Spec e
do Plan. Se o Plan mudou materialmente depois do julgamento, repita o Judge
antes de criar Builders.

Depois do `Judge Plan`, registre no Plan que o julgamento da implementação será
`Final`. O Judge Implementation é único e avalia o diff integrado de todas as
fases; não existem Judges de implementação por fase. Fases podem ser paralelas
e podem aguardar sensores, mas não recebem aceite independente.

Para cada fase, em qualquer modo:

1. confirme revisão da Spec, dependências, critérios, paths e evidências; em UI,
   confirme também os paths/Node IDs Pencil, estados, viewports e divergências
   aprovadas;
2. marque fase/tarefa como `in_progress`/`implementing`;
3. crie `Builder F<n>` para o escopo principal;
4. identifique tarefas prontas, independentes e sem paths sobrepostos;
5. quando houver paralelismo real, crie até dois `Builder F<n>-T<m>` irmãos;
6. aguarde os Builders, inspecione e integre o diff; para UI, compare cada node
   canônico com a Web no mesmo viewport/estado antes de considerar a tarefa
   `verified`;
7. execute `format`, `check:code`, `check:types` e `test:unit`; execute
   `check:architecture` e `test:integration` conforme a fase. Não execute build
   a cada fase ou retry;
8. marque tarefas `verified` somente após os sensores aplicáveis;
9. registre a fase como aguardando a avaliação integrada e avance somente após
   os sensores aplicáveis;
10. registre findings imediatamente, crie Builder Fix, reabra as tarefas
    afetadas e repita os sensores aplicáveis. Não crie um Judge por fase.

Builders não criam subagentes nem editam Plan. Judges não editam arquivos. O
Orchestrator registra no Plan decisões, evidências resumidas, findings,
tentativas e próxima ação; registra na Spec as avaliações formais.

Após todas as fases, execute sensores integrados e o preflight. Crie o único
`Judge Implementation Final` read-only e envie a revisão congelada da Spec, o
Contract, Rules, Architecture, diff integrado, resultados dos sensores,
auditoria UI e evidências Pencil/Playwright. Crie ou atualize `evaluation.md`
com a matriz de evidências reais, veredito, warnings, findings, decisões e
lições.

Antes de encaminhar para `create-pr` ou `conclude-spec`, faça um gate explícito.
Não conclua nem encaminhe enquanto qualquer pré-condição estiver pendente:

- a Spec deve estar no estado de implementação previsto pelo workflow e ter
  passado pelo veredito final; uma Spec ainda `open` não pode ser concluída;
- todas as fases e tarefas devem estar aceitas/verificadas, sem fase `failed`,
  como F3 com JI-08;
- nenhum finding bloqueante pode estar aberto, incluindo findings de validação
  manual como JI-09;
- a validação manual autenticada do frontend deve ter sido executada no
  navegador real, cobrindo login, rota protegida e evidências de console,
  pageerror, requestfailed e respostas `2xx`;
- `evaluation.md` deve registrar as evidências atuais, o Judge final, o
  preflight e o SHA avaliado.
- para frontend, deve existir auditoria de `ui-layer-rules.md` por widget e
  comparação independente dos nodes Pencil aplicáveis com a Web real, com
  dimensões/anchors, divergências aprovadas e evidência no HEAD avaliado; node
  ausente, contradito ou desvio não aprovado bloqueia o encaminhamento;
- o SHA avaliado pelo Judge deve ser o HEAD final do diff; qualquer alteração
  posterior invalida o veredito e exige novo Judge Implementation Final.

Se o gate falhar, registre a pendência no Plan/evaluation, crie o Builder Fix ou
a ação de validação apropriada e permaneça no workflow de implementação. Só
depois do gate atendido encaminhe para `create-pr` e, após o CI verde, para
`conclude-spec`.

Não crie outro papel de implementação, fork ou nova thread para o fechamento.

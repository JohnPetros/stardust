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

Depois do `Judge Plan`, escolha e registre no Plan o modo de julgamento da
implementação:

- `Final` (padrão) para Plans coesos e lineares, de risco baixo ou médio, sem
  contratos intermediários que precisem ser aceitos antes da fase seguinte,
  sem Builders realmente paralelos e sem fases independentemente liberáveis;
  nesse modo há um único `Judge Implementation Final` após a integração.
- `Por fase` quando houver contratos de fase consumidos por fases posteriores,
  risco alto e independente, migração/infraestrutura, Builders em paths
  disjuntos ou fases que possam ser aceitas e reabertas isoladamente.

Não escolha o modo apenas pela quantidade de fases. Registre a justificativa,
os riscos e o custo de coordenação no Plan. Se o escopo mudar materialmente,
reavalie o modo antes de continuar.

Para cada fase, em qualquer modo:

1. confirme revisão da Spec, dependências, critérios, paths e evidências;
2. marque fase/tarefa como `in_progress`/`implementing`;
3. crie `Builder F<n>` para o escopo principal;
4. identifique tarefas prontas, independentes e sem paths sobrepostos;
5. quando houver paralelismo real, crie até dois `Builder F<n>-T<m>` irmãos;
6. aguarde os Builders, inspecione e integre o diff;
7. execute `format`, `check:code`, `check:types` e `test:unit`; execute
   `check:architecture` e `test:integration` conforme a fase. Não execute build
   a cada fase ou retry;
8. marque tarefas `verified` somente após os sensores aplicáveis;
9. no modo `Por fase`, crie `Judge Implementation` `Phase F<n>` read-only
   irmão dos Builders; no modo `Final`, registre a fase como aguardando a
   avaliação integrada e avance após os sensores;
10. em qualquer modo, registre findings imediatamente, crie Builder Fix,
    reabra as tarefas afetadas e repita os sensores e julgamentos aplicáveis;
    no modo `Por fase`, somente avance após `accepted` da fase.

Builders não criam subagentes nem editam Plan. Judges não editam arquivos. O
Orchestrator registra no Plan decisões, evidências resumidas, findings,
tentativas e próxima ação; registra na Spec as avaliações formais.

Após todas as fases, execute sensores integrados e o preflight. No modo `Final`,
crie o único `Judge Implementation Final`; no modo `Por fase`, crie-o somente
quando a integração exigir avaliação adicional. Crie ou atualize
`evaluation.md` com a matriz de evidências reais, vereditos, warnings, findings,
decisões e lições.

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

Se o gate falhar, registre a pendência no Plan/evaluation, crie o Builder Fix ou
a ação de validação apropriada e permaneça no workflow de implementação. Só
depois do gate atendido encaminhe para `create-pr` e, após o CI verde, para
`conclude-spec`.

Não crie outro papel de implementação, fork ou nova thread para o fechamento.

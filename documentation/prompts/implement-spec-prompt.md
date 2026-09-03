---
name: implement-spec
description: Orquestrar uma Spec aberta ou retomada por execução direta ou Plan-backed, mantendo evidências, correções e validação integrada.
---

# Implementar Spec

Use este prompt como a única entrada de implementação para toda Spec `open` ou
`in_progress`. Selecione a estratégia a partir dos artefatos atuais; não peça ao
usuário para escolher outro prompt:

```text
implement-spec
├── sem Plan atual → Builder Direct no contexto atual ───────────────┐
└── Plan atual    → Builders estáveis por ownership e wave ─────────┤
                                                                     ↓
                                                           candidato integrado
                                                                     ↓
                                  check:spec-implementation + sensores + Reviewers pareados
                                                                     ↓
                                                              evaluation.md ready
                                                                     ↓
                                                               conclude-spec
```

Execute tudo na task atual. Não crie outra thread para o usuário.

## Seleção da estratégia

Leia `documentation/sdd.md`, a Spec,
Architecture, Modules, Rules aplicáveis e `documentation/tooling.md`. Inspecione
o `plan.md` colocado ao lado da Spec, quando existir.

| Condição | Estratégia |
| --- | --- |
| Plan atual não superseded referencia a revisão exata da Spec | execução Plan-backed |
| Não há Plan e a Spec recomenda entrega pequena e coesa | Builder Direct |
| Não há Plan, mas dependências, risco ou recovery exigem um | invoque `create-plan` e continue aqui |
| Plan ficou stale após amendment da Spec | reconcilie ou recrie antes de editar |
| Spec revisada não precisa mais de Plan | marque Plan como `superseded` e execute Direct |

O grafo de dependências do PRD é autoridade de produto, não ordem de execução.
Derive ownership, waves e paralelismo somente do Technical Contract da Spec,
paths afetados, dependências de runtime e limites das camadas.

As etapas numeradas abaixo descrevem a execução Direct. Para uma Spec com Plan,
aplique o gate e a sequência de waves descritos em **Execução Plan-backed** e
use os mesmos sensores, persistência e critérios de prontidão.

## Invariantes fail-closed

Se uma destas condições não puder ser verificada, pare antes de editar source,
testes, migrations ou artefatos gerados e registre o blocker:

- `implement-spec` é a única entrada de implementação; não reative workflows
  removidos nem simule papéis antigos;
- nenhuma alteração de feature começa antes de uma assignment com paths,
  revisão, RF/CA, Rules e exits ser registrada no `plan.md`/`evaluation.md`;
- a Spec, seus paths, contratos, exclusões e estados são autoridade; código
  existente, screenshot isolado ou teste passando não os substitui;
- `npm run check:spec-implementation -- <spec> --base <commit-base>` roda antes
  dos sensores integrados e novamente após qualquer correção que altere, crie,
  gere ou remova path contratado;
- `npm run check:spec-definition -- <spec>` e `npm run check:plan-definition -- <plan>`
  devem passar antes de qualquer Builder iniciar;
- qualquer erro de implementação, teste, browser, rede, console, migration,
  CI ou visual dentro do Contract é correção automática: registre, invalide a
  evidência afetada, corrija no escopo e rerode os checks;
- cenários manuais/runtime exigidos são fail-closed. Indisponibilidade,
  timeout ou falha bloqueia a fase afetada; não use mock ou evidência antiga
  como substituto;
- UI exige comportamento automatizado, screenshot Playwright atual e comparação
  inspecionada por viewport/estado; testes passando sozinhos não bastam;
- para Server, confirme comportamento real, autorização, persistência e efeitos
  colaterais conforme AGENTS.md e Supabase Dev quando aplicável;
- os workspaces Core, Server, Studio e Web executam cobertura e o ratchet; LSP,
  Validation, TypeScript Config e Email permanecem excluídos conforme SDD;
- `evaluation.md` é um ledger vivo: toda mudança de código, teste, browser,
  migration, artefato, documentação ou validação atualiza comandos, resultado,
  evidências, freshness, findings e lessons antes do próximo passo.

1. Leia Spec, Architecture, Rules e `documentation/sdd.md`.
2. Congele a revisão e o commit-base.
3. Crie ou atualize um `plan.md` operacional mínimo para a implementação direta
   (mesmo sem fases), contendo a tarefa, paths, critérios, estado e próxima ação.
   O Plan será mantido durante todo o fluxo para registrar cada mudança.
4. Crie `Builder Direct` como subagente e envie Contract, resultado observável,
   paths, Rules, Architecture, os paths/Node IDs Pencil canônicos, estados,
   viewports e MCPs aplicáveis.
5. Inspecione o diff; o Builder não atualiza Spec, Plan ou estado.
6. Execute `npm run check:spec-implementation -- <spec> --base <commit-base>` antes dos sensores.
   Execute também `npm run check:spec-definition -- <spec>` e
   `npm run check:plan-definition -- <plan>` após qualquer alteração documental.
   A verificação exige o mapa canônico `Path | Change | ...` do Technical Contract.
   Depois execute `format`, `check:code`, `check:types`, `test:unit` e
   `check:test-integrity`; para Core, Server, Studio e Web,
   execute também `test:coverage` e `check:coverage`; execute
   `check:architecture` e `test:integration` quando aplicáveis. Para frontend,
   faça também a auditoria de `ui-layer-rules.md` e a comparação independente
   dos nodes Pencil aplicáveis com a Web real, no mesmo viewport e estado.
   Preserve o design canônico; qualquer simplificação, substituição, adição ou
   divergência não aprovada é finding bloqueante. Build não é necessário neste
   ciclo.
7. Crie um `Implementation Reviewer Direct` read-only irmão do Builder, pareado
   exclusivamente com esse Builder. Envie
   Spec, revisão, Contract, diff, critérios, Rules, Architecture, auditoria UI,
   evidências Pencil/Playwright, matriz de divergências aprovadas e resultados
   oficiais dos sensores.
8. Se `failed`, registre o finding no `evaluation.md` (ou crie um Plan se ele
   exigir tarefas), crie `Builder Fix IR-<n>`, reexecute sensores invalidados e
   repita o Reviewer pareado quando o diff ou qualquer evidência tiver sido invalidada.
   Qualquer mudança após o veredito invalida o aceite anterior. Após três
   falhas iguais, escale ao usuário.
9. Execute o preflight integrado e crie/atualize `evaluation.md` com evidências
    reais, resultado do Reviewer, warnings, findings, decisões e lições.
10. Encaminhe para `create-pr` somente com o Reviewer pareado aceito e o `evaluation.md`
    completo; depois do CI verde, use `conclude-spec`.

## Builder activation gate

Antes de qualquer alteração de feature, ative uma assignment delimitada contendo
a revisão exata da Spec, RF/CA e REQ-* mapeados, paths permitidos e proibidos,
Rule Pack, referências de Design, ownership e exits de validação. Registre a
assignment no `plan.md` e no `evaluation.md`. A task principal coordena,
inspeciona e integra; não substitui um Builder de ownership por edição direta
sem escopo.

Use `Builder Direct` para uma entrega pequena e coesa sem Plan. Com Plan,
ative Builders estáveis por boundary (`Builder Core`, `Builder Server`,
`Builder Studio`, `Builder Web` ou equivalente), nunca um Builder por fase,
package ou tarefa quando o trabalho puder permanecer no mesmo contexto. Use no
máximo três Builders concorrentes salvo justificativa concreta no Plan, com
paths não sobrepostos. Shared/generated files, dependências e lockfiles ficam
sob coordenação da task principal.

Para o painel de subagentes, use nomes estáveis em `snake_case` (por exemplo,
`builder_core`, `builder_server`, `builder_studio`, `builder_web` e
`implementation_reviewer`). Retome o mesmo Builder/Reviewer após correções;
crie Builder Fix apenas quando o original não puder ser retomado ou a correção
for genuinamente independente.

## Execução Plan-backed

Quando houver Plan atual, ele controla sequencing, status, tentativas e próxima
ação; o `evaluation.md` controla evidências executadas e findings. Para cada
wave pronta:

1. confirme revisão, dependências, critérios, paths, Rules, assignments e exits;
2. marque a wave e tarefas afetadas como `in_progress`;
3. ative ou retome apenas Builders de ownership com paths independentes;
4. inspecione e integre diffs sem permitir que Builders editem Spec, Plan ou
   Evaluation;
5. execute sensores focados da fase e atualize imediatamente Evaluation e Plan;
6. conclua uma tarefa somente com seus exits aprovados e a fase somente quando
   todos os seus exits passarem;
7. em falha, mantenha o trabalho `in_progress`, invalide evidências afetadas,
   retome o Builder responsável e rerode somente o que mudou.

Cada Builder recebe um `Implementation Reviewer` read-only pareado com seu
escopo. Não crie Reviewer por aplicação adicional, nem aceite relatório de
Builder como evidência oficial. Uma revisão integrada extra só é permitida
quando existir uma interação cross-boundary sem Builder responsável.

## Reinforcement de Rules e findings

Quando um finding revelar guidance ausente, ambígua ou repetidamente violada:

- se a Rule já for clara, corrija a implementação e registre `No change` com a
  justificativa;
- se a convenção reutilizável não estiver clara, pause o trabalho dependente,
  atualize a autoridade pelo workflow apropriado e recompute o Rule Pack;
- para anti-padrão de implementação reutilizável, use `register-antipattern` na
  Rule da camada, com padrão proibido, alternativa obrigatória e prova de
  validação;
- invalide evidências afetadas, registre a alteração em Evaluation e rerode o
  correction path e seus sensores.

Todo finding aceito possui dois registros no `evaluation.md`: o problema
concreto em `Findings` e, quando houver orientação reaproveitável, uma entrada
em `Lessons learned` com a autoridade afetada e sua disposição. Atualize PRD,
Architecture, Design, Tooling, Rules ou prompts quando a lição for durável;
detalhes locais, typo isolado, falha transitória ou regra já documentada recebem
uma disposição explícita de não alteração. Mudanças de produto, Contract,
ownership arquitetural ou política global exigem autoridade do usuário.

## Conformance e prontidão

Antes de cada handoff e depois de cada correção, compare o candidato com a
árvore de arquivos, contratos, comportamentos, estados, exclusões e exits da
Spec. Registre no Evaluation a existência de paths, ownership, RF/CA, testes,
estados de UI, Design, REST-client e comandos executados. Falha estrutural ou
semântica mantém o item `in_progress`; não marque como passed porque outro
sensor passou.

Após integrar o candidato final:

1. execute o `check:spec-implementation` para a revisão exata;
2. execute `format`, `check:code`, `check:types`, `test:unit`,
   `check:test-integrity`, cobertura/ratchet e sensores de Architecture,
   integração, browser e Supabase Dev conforme os paths;
3. confirme evidências manuais autenticadas da Web App/Studio, quando aplicável,
   incluindo console, pageerror, requestfailed e respostas HTTP;
4. execute o Reviewer pareado aplicável e resolva todos os findings bloqueantes;
5. só então marque Evaluation como `ready` e invoque `conclude-spec` quando a
   autoridade de publicação estiver disponível.

Após três falhas materialmente idênticas, peça decisão do usuário somente se a
resolução não puder ser obtida nas autoridades, codebase ou ambiente.

## Persistência obrigatória após cada mudança

Depois de **cada mudança de implementação**, a task principal deve atualizar
imediatamente o `plan.md` e o `evaluation.md`, antes de iniciar outra mudança,
executar o próximo sensor ou criar o Reviewer. Isso vale individualmente para a
implementação inicial, `Builder Fix`, alterações de seed/fixture/configuração/
ambiente, artefatos gerados ou derivados e testes novos ou alterados — inclusive
mudanças feitas para corrigir review, sensores ou CI.

No `plan.md`, registre a tarefa, tentativa, motivo, paths/artefatos afetados,
RF/CA, estado e próxima ação. No `evaluation.md`, registre a mudança como
evidência factual, impacto nos critérios, sensores/evidências invalidados ou
pendentes, commit/HEAD e decisões, warnings ou findings. Para seed/ambiente,
registre escopo, procedimento reproduzível e cleanup sem expor segredos; para
artefatos gerados, fonte, gerador e output; para testes, comportamento protegido
e comando de execução.

Não agrupe mudanças em um registro retrospectivo. Se a mudança alterar o diff
ou qualquer evidência de Contract, Rule, Pencil ou Playwright, invalide o
veredito anterior e registre o novo sensor/Reviewer necessário. O fluxo não pode
prosseguir enquanto o Plan e o `evaluation.md` não refletirem a mudança mais
recente.

Não crie outro papel de implementação, fork ou nova task para o fechamento.

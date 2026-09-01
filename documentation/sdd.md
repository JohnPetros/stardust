# Spec-Driven Development (SDD) no StarDust

## Objetivo

O SDD transforma uma demanda de feature em um Contract implementável, uma execução
rastreável e uma entrega fechada por evidência no PR. Todo o fluxo ocorre na mesma task:

```text
PRD, Issue, Report ou demanda direta
→ create-spec
→ Spec Reviewer
→ implement-spec direto | create-plan → implement-spec Plan-backed
→ sensores integrados + validação manual real
→ Implementation Reviewer único quando houver Plan
→ evaluation.md ready
→ conclude-spec → commit-code → create-pr → CI do HEAD do PR
→ Spec, Plan e Evaluation completed
```

SDD não é obrigatório para manutenção que não precise de Contract de feature. O
Orchestrator classifica a demanda e usa manutenção direta quando uma Spec não acrescenta
autoridade, risco controlado ou rastreabilidade útil.

## Autoridades

Antes de iniciar ou retomar SDD, leia `AGENTS.md`, `documentation/architecture.md`,
`documentation/modules.md`, `documentation/tooling.md`, `documentation/rules/rules.md` e
todas as Rules selecionadas pelos paths e comportamentos afetados. Leia também o PRD canônico,
Issue, Report, Design e código real aplicáveis.

| Autoridade                  | Governa                                                     |
| --------------------------- | ----------------------------------------------------------- |
| `AGENTS.md`                 | segurança, ferramentas, ambientes e validações obrigatórias |
| Architecture e Overview     | fronteiras, dependências e responsabilidades do sistema     |
| Rules selecionadas          | convenções reutilizáveis de implementação e teste           |
| PRD                         | resultado de produto, atores, capacidades e experiência     |
| Design e referências salvas | intenção visual e estados de UI                             |
| Tooling                     | comandos e ambientes reais                                  |
| Spec                        | Contract específico da entrega                              |

### PRD canônico e milestone

Os PRDs de produto ficam em `documentation/prds/<module>/<english-slug>.md`. Cada milestone
de produto no GitHub deve conter somente o link absoluto para o PRD correspondente na branch
`main`. Esse link é o índice oficial entre produto e SDD:

1. descubra o milestone associado à demanda;
2. siga sua descrição e abra o único link para o PRD na `main`;
3. use o conteúdo desse arquivo como autoridade de produto antes de criar a Spec.

Não reconstrua o caminho do PRD a partir do título, label ou path da Issue. Se o milestone não
tiver exatamente um link válido para `documentation/prds/` na `main`, registre a lacuna e resolva
a rastreabilidade antes de iniciar o Contract. O caminho da branch `main` representa a versão
canônica atual; Specs abertas devem registrar o link e a revisão do PRD consultado.

Uma mudança normativa de produto, Architecture, Rule global ou ownership exige aprovação
explícita do usuário e atualização da autoridade antes da Spec. A implementação atual nunca
substitui silenciosamente uma autoridade.

## Papéis

| Papel                   | Responsabilidade                                                                                                    | Restrição                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Orchestrator            | seleciona workflows, mantém artefatos, integra diffs, executa sensores, registra evidência, publica e roteia falhas | não delega o veredito oficial nem usa relato de subagente como prova |
| Spec Reviewer           | revisa a Spec draft completa antes de `open`                                                                        | read-only; não edita a Spec nem decide o status oficial              |
| Builder                 | implementa um escopo de paths contra uma revisão exata                                                              | não edita Spec, Plan, Evaluation, PRD ou Rules                       |
| Implementation Reviewer | revisa o candidato Plan-backed integrado                                                                            | read-only; não corrige nem produz o veredito oficial                 |

Subagentes são irmãos criados pelo Orchestrator na task atual. Nenhum subagente cria outro
agente ou task. `create-spec`, `implement-spec` e `conclude-spec` são workflows, não papéis.

## Artefatos duráveis

```text
documentation/prds/<module>/<english-slug>.md   # autoridade de produto, indexada pelo milestone
documentation/features/<domínio>/<feature>/
├── spec.md
├── plan.md                 # opcional
├── evaluation.md           # criado no kickoff da implementação
└── design/                 # quando houver Design Contract
    ├── manifest.md
    └── <referências>.png
```

Uma mudança de comportamento após conclusão usa
`documentation/features/<domínio>/<feature>/changes/<mudança>/`.

| Artefato             | Possui                                                      | Não possui                              |
| -------------------- | ----------------------------------------------------------- | --------------------------------------- |
| `spec.md`            | comportamento, Design, Technical e Validation Contracts     | tentativas e resultados executados      |
| `plan.md`            | waves, dependências, ownership, status e próxima ação       | segundo Contract técnico                |
| `evaluation.md`      | comandos, evidências, findings, histórico, comparações e CI | autoridade de produto ou arquitetura    |
| `design/manifest.md` | inventário de referência, estado, viewport e surface        | screenshot produzido pela implementação |

Screenshots de implementação ficam em `test-results/` ignorado ou em artifacts de CI; o
identificador e a comparação ficam em `evaluation.md`.

## Estados

| Artefato    | Estados                                                     |
| ----------- | ----------------------------------------------------------- |
| Spec        | `draft`, `open`, `in_progress`, `completed`                 |
| Plan        | `pending`, `in_progress`, `completed`, `superseded`         |
| Fase/tarefa | `pending`, `in_progress`, `completed`                       |
| Evaluation  | `in_progress`, `ready`, `completed`                         |
| Evidência   | `pending`, `passed`, `failed`, `stale`, `not_applicable`    |
| Finding     | `active`, `resolved`, `accepted_non_blocking`, `superseded` |

Falhas não criam estados extras: o item permanece `in_progress`, com finding e próxima ação.

## Protocolo de Grilling

Os workflows de criação de issues, PRDs, Specs e Plans entrevistam o usuário rigorosamente antes
de escrever o artefato. As decisões formam uma **design tree**: cada decisão se ramifica nas
decisões que dependem dela. A **frontier** de um round contém todas as decisões cujos
pré-requisitos já estão resolvidos e que podem ser perguntadas sem adivinhar respostas pendentes.

Em cada round, recompute a árvore, pergunte toda a frontier, numere as perguntas e inclua uma
resposta recomendada para cada uma. Uma pergunta que dependa de outra decisão ainda aberta no
round atual pertence a um round posterior. Depois das respostas, registre decisões, alternativas
descartadas, dependências e contradições e recompute a frontier.

Use este formato:

```yaml
❓ **Q1** - **<título da pergunta>**: <pergunta e alternativas relevantes>

➡️ <resposta recomendada e justificativa concisa>

---

❓ **Q2** - **<título da pergunta>**: <pergunta e alternativas relevantes>

➡️ <resposta recomendada e justificativa concisa>
```

Encontrar fatos é responsabilidade da task, nunca do usuário. A task principal consulta
diretamente filesystem, documentação, codebase, GitHub, design, banco e ferramentas aplicáveis
antes de perguntar. Uma investigação factual ainda aberta adia apenas as perguntas descendentes
dela; o restante da frontier deve ser perguntado. Não crie agentes de pesquisa.

As decisões pertencem ao usuário. Conteste contradições, exponha impactos e recomende uma resposta,
mas não transforme ausência de evidência em escolha implícita. O gate termina apenas quando a
frontier estiver vazia, todos os ramos relevantes tiverem sido visitados e o usuário confirmar o
entendimento compartilhado. Nenhum artefato é criado, alterado ou publicado antes dessa
confirmação. Em workflows com approval de publicação separado, a confirmação do Grilling não
substitui a aprovação da versão exata.

## Intake opcional

GitHub Issue é tracking, não Contract técnico. A Issue pode apontar para um milestone, mas o
PRD só é identificado depois que o link canônico da descrição do milestone for resolvido:

- `create-feat-issue` transforma milestone/PRD ou pedido aprovado em outcome, escopo e critérios
  observáveis; depois da aprovação/publicação, `create-spec` cria o Contract;
- `create-bug-issue` registra sintoma, expectativa, reprodução e contexto sem diagnóstico;
- `create-bug-report` exige a bug issue aprovada, produz diagnóstico durável e recomenda correção
  direta ou Correction Spec conforme risco e coordenação.

Feature e bug issue exigem approval explícito antes de escrita no GitHub. Aprovar issue não
autoriza implementação, branch, commit, PR ou alteração de produto.

Todo workflow de criação de issue executa descoberta de PRD antes do draft. Feature issue exige
um PRD principal; bug e chore registram o PRD/requisito mais relevante ou `None` com evidência da
busca. A associação nunca é inferida apenas por título, label ou path; um milestone só serve como
ponte depois que seu único link para `documentation/prds/` na `main` for validado.

Antes do draft, os workflows de issue executam o Grilling: fatos são pesquisados e decisões são
percorridas em rounds pela frontier da design tree. A confirmação de entendimento compartilhado
encerra a entrevista, mas não substitui o approval explícito da versão exata publicada.

Os dois workflows de PRD, prospectivo ou retrospectivo, também executam o Grilling depois da
pesquisa e antes da escrita. O PRD só é criado ou atualizado após a frontier ficar vazia e o
usuário confirmar o entendimento compartilhado.

## Spec

`create-spec` pesquisa diretamente a codebase antes de escrever. Organize boundaries independentes
como lanes de investigação da própria task, confira as autoridades e resolva conflitos por
inspeção direta, sem criar agentes de pesquisa.

A Spec não é escrita enquanto existir escolha material de produto, técnica, Design ou
validação. Perguntas devem trazer evidência, recomendação, alternativa e impacto. A Spec
possui exatamente:

1. Contexto e escopo;
2. Implementation Contract com `RF-*` e critérios Given/When/Then `CA-*`;
3. Technical Contract com baseline, runtime flow e paths/declarations por camada;
4. Validation Contract com testes reais, comandos e cenários manuais `MV-*`;
5. alinhamento documental, Rule Pack e histórico de revisões.

Depois da pesquisa e antes da escrita, `create-spec` executa o Grilling até esvaziar a frontier e
obter confirmação explícita. Fatos pertencem à pesquisa; somente decisões não resolvidas pelas
autoridades são levadas ao usuário.

Todo `RF-*` mapeia para pelo menos um `CA-*` e vice-versa. Paths são exatos e classificados
como Create, Modify, Generate ou Remove. A Spec não é um Plan e não contém resultados.

Para UI, a Spec registra o widget tree exato, estados loading/empty/success/error/recovery,
teclado, foco, responsividade, referências Pencil/screenshot e viewports. Comportamento
inferido apenas de imagem precisa de clarificação. Uma Spec íntegra passa diretamente de
`draft` para a revisão independente do Spec Reviewer.

Depois do integrity gate, o Orchestrator ativa exatamente um Spec Reviewer read-only com a
revisão, fontes, Rule Pack, pesquisa verificada, paths e Design bundle. O Orchestrator verifica
cada finding, corrige a mesma Spec e retoma o mesmo Reviewer. A Spec só passa para `open` quando
a revisão exata estiver `clear` e nenhum finding bloqueante verificado permanecer. Amendment
posterior invalida o resultado e exige nova revisão. A revision history registra a revisão
avaliada, o resultado e as resoluções verificadas, sem incorporar o relatório bruto.

## Plan opcional

`create-plan` só é usado para fases dependentes, múltiplos boundaries, migração/integração,
risco de segurança ou concorrência, paralelismo útil, UI complexa ou necessidade real de
recovery ledger. O Plan deriva dependências do Technical Contract e dos paths, nunca de um
grafo de dependência de produto.

O Plan contém snapshot de execução, ledger de waves/fases/tarefas, agenda de validação e log
condicional. Builders têm ownership estável (`Builder Core`, `Builder Server`, `Builder Web`
ou boundary equivalente), podem executar várias fases e nunca compartilham paths ativos. O
padrão é no máximo três Builders concorrentes. A integridade do Plan é verificada pela task
principal antes de salvar e antes de cada wave; não há agente separado para esse gate.

Antes de salvar, `create-plan` executa o Grilling sobre decisões de execução ainda abertas. O
interview não pode redefinir a Spec; qualquer ambiguidade de Contract retorna para amendment.

## Implementação e evidência viva

`implement-spec` é a única entrada de implementação:

- sem Plan atual: Builder Direct no contexto principal;
- com Plan da revisão atual: Builders de ownership por wave;
- Plan ausente mas necessário: invoca `create-plan` e continua automaticamente;
- Plan obsoleto: reconcilia ou marca `superseded` antes de editar.

Antes de alterar source ou testes, materialize `evaluation.md` pelo Contract canônico definido
em `implement-spec`, registre revisão, assignment, paths, Rules, critérios e exits, e mude a Spec para
`in_progress`. O Orchestrator inspeciona cada diff, executa os sensores oficiais e atualiza
Evaluation após cada mudança. Relatos de Builder e Reviewer são input, não evidência.

Para frontend, testes automatizados não substituem a validação manual obrigatória definida em
`AGENTS.md`: serviço real, login quando aplicável, rota protegida, estados relevantes,
console, `pageerror`, `requestfailed`, respostas HTTP e screenshots atuais. Para Server e
banco, mocks não substituem request/response real, autorização, tenant e persistência no
Supabase Dev quando aplicável.

Após integrar um Plan, um único Implementation Reviewer revisa o candidato completo e repete
interações de alto risco. O Orchestrator verifica cada finding e retoma o mesmo Builder e o
mesmo Reviewer. Implementação direta não exige Reviewer separado salvo autoridade explícita.

Evidence anterior à última mudança afetada vira `stale`. Evaluation só muda para `ready`
quando todos os `CA-*`, sensores, `MV-*`, comparações visuais e findings bloqueantes estão
atuais e resolvidos.

## Correção versus mudança de Contract

| Classe                    | Ação                                                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Correção de implementação | mantém revisão; registra finding; reabre trabalho/evidência; retoma Builder; reexecuta somente exits invalidados                    |
| Mudança de Contract       | pausa; Spec volta a `draft`; atualiza autoridade; incrementa revisão; reconcilia Design, Plan e Evaluation; retoma `implement-spec` |

Erro de teste, browser, console, runtime, migration, CI ou comparação visual dentro do Contract
é correção automática. Não se pede autorização para tornar a implementação aderente. Pergunte
somente quando faltar decisão de produto, autoridade, ambiente, segurança ou escopo.

## Conclusão, PR e CI

`conclude-spec` exige Spec `in_progress`, Evaluation `ready`, Plan completo quando houver,
conformance atual e nenhuma evidência bloqueante. Com autorização para commit/push/PR:

1. repete preflight e conformance no candidato atual;
2. invoca `commit-code` para commits intencionais;
3. invoca `create-pr` para criar ou atualizar um PR ready-for-review;
4. aguarda cada workflow aplicável no HEAD atual do PR;
5. registra nome, resultado, URL e SHA em Evaluation;
6. em falha, roteia imediatamente para `implement-spec` ou amendment, republica e repete CI;
7. após CI verde, marca Spec, Plan e Evaluation como `completed`.

Não use run de push, SHA antigo, check ausente ou build local como substituto do CI do PR.
Não faça merge ou deploy sem pedido explícito. Feedback posterior em PR aberto pode reabrir a
mesma Spec; após merge, defeito usa Bug Report e comportamento novo usa uma change Spec.

## Sensores oficiais

Após alteração de código, execute os detectores obrigatórios de `AGENTS.md`:
`npm run check:code`, `npm run check:types` e `npm run test:unit`. Acrescente
`check:architecture`, testes de integração, geração, browser, Supabase Dev e build conforme
Rules, Spec, paths e risco. Para `@stardust/core`, `@stardust/server`, `@stardust/studio` e
`@stardust/web`, execute também `npm run test:coverage -w <workspace>` e
`npm run check:coverage -- <workspace>`; o check falha se qualquer métrica ficar abaixo do
baseline versionado em `coverage-baseline.json`. `@stardust/lsp`, `@stardust/validation`,
`@stardust/typescript-config` e `@stardust/email` estão fora desse quality ratchet. `format`
aplica formatação, mas não prova comportamento.

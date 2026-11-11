# Specification-Driven Development (SDD) no StarDust

## Objetivo

O SDD transforma uma demanda de feature em um Contract implementável, uma execução
rastreável e uma entrega fechada por evidência no PR. Todo o fluxo ocorre na mesma task:

```text
PRD, Issue, Report ou demanda direta
→ create-spec
→ Spec Reviewer + revisão do usuário da Spec escrita
→ implement-spec
→ verificação integrada (automatizada + manual + visual)
→ Implementation Reviewer (+ Visual Reviewer em paralelo, quando há UI)
→ check-spec-implementation + check:test-integrity + evaluation.md ready
→ conclude-spec → commit-code → open-pr → CI do HEAD do PR
→ Spec e Evaluation completed
```

SDD não é obrigatório para manutenção que não precise de Contract. A task principal
classifica a demanda e usa manutenção direta quando uma Spec não acrescenta autoridade,
risco controlado ou rastreabilidade útil. Issues `chore` e `refactor` com múltiplos fluxos,
CI/CD, integrações ou migrations podem originar uma Spec, sem PRD nem milestone de produto.

## Convenção de abreviações

Use estas abreviações e namespaces em todo artefato SDD novo ou revisado:

| Abreviação | Significado |
| --- | --- |
| **SDD** | *Specification-Driven Development* — desenvolvimento orientado por especificação |
| **PRD** | *Product Requirements Document* — documento de requisitos de produto |
| **RP-\*** | *Requisito de Produto* — requisito do PRD canônico versionado em `documentation/prds/` |
| **JN-\*** | *Jornada* — jornada do usuário |
| **RF-\*** | *Requisito Funcional* — requisito funcional da Spec local |
| **CA-\*** | *Critério de Aceitação* — critério verificável da Spec |
| **AV-\*** | *Verificação Automatizada* — teste, sensor ou gate automatizado de baseline |
| **MV-\*** | *Verificação Manual* — jornada happy-path executada em navegador ou terminal reais |
| **VV-\*** | *Verificação Visual* — comparação de um board do Penpot com a captura Playwright correspondente |
| **EV-\*** | *Evidência* — evidência de que um critério ou gate foi atendido |
| **ACH-\*** | *Achado de revisão* — finding de revisão, sensor ou verificação |
| **SHI-\*** | chave da issue Jira usada para rastrear uma entrega Shifu |

As relações de rastreabilidade são `RP/JN → RF → CA → EV`; `AV`, `MV` e `VV`
descrevem as verificações que produzem uma `EV` (os IDs são únicos entre os três tipos), e
`ACH` registra problemas encontrados durante revisão ou verificação. O Evaluation não registra resultados
do CI do PR: workflows, checks e build ficam no PR. `SHI-*`
é opcional e só aparece quando houver uma issue Jira Shifu.

Artefatos históricos podem manter identificadores antigos para não quebrar
referências. Ao revisar um artefato antigo, preserve o crosswalk na revisão
histórica e use os namespaces atuais para novos requisitos, validações,
evidências e achados.

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

O PRD canônico de produto é o documento versionado no repositório em
`documentation/prds/<module>/<slug>.md`. Esse arquivo é a autoridade de produto
para resultado, atores, capacidades, experiência, requisitos `RP-*` e jornadas
`JN-*`; não existe exigência de publicação ou espelhamento no Confluence.

Quando houver milestone de produto no GitHub, ela deve apontar para o PRD local
correspondente. Esse link é o índice oficial entre produto e SDD:

1. descubra o milestone associado à demanda;
2. siga sua descrição e abra o link para o PRD canônico em `documentation/prds/`;
3. use o conteúdo desse documento como autoridade de produto antes de criar a Spec.

Não reconstrua o PRD a partir do título, label ou path da Issue. Se o milestone
não tiver um link válido para um PRD local, registre a lacuna e resolva a
rastreabilidade antes de iniciar o Contract. Specs abertas devem registrar o
path e a revisão do PRD consultado, além dos `RP-*` e `JN-*` relevantes.

Uma mudança normativa de produto, Architecture, Rule global ou ownership exige aprovação
explícita do usuário e atualização da autoridade antes da Spec. A implementação atual nunca
substitui silenciosamente uma autoridade.

### Estrutura obrigatória do PRD

Todo PRD novo ou revisado deve seguir a estrutura canônica abaixo, usando os
IDs `RP-*` e `JN-*` definidos nesta documentação:

1. Cabeçalho com título, `Disponibiliza para` e `Navegação`;
2. Resumo Executivo;
3. Problema e Oportunidade, incluindo a base de fontes e autoridade;
4. Público-alvo, contexto de uso e Jobs to Be Done;
5. Objetivos e Métricas de Sucesso, incluindo limites de validação e premissas;
6. Requisitos de Produto, com conceitos/responsabilidades e, para cada `RP-*`,
   necessidades do usuário, resultado, atores, regras de negócio e regras de experiência;
7. Grafo de Dependências do Produto;
8. Jornadas, identificadas como `JN-*`;
9. Fora de Escopo, incluindo decisões descartadas durante a definição.

Análise competitiva, preços e posicionamento são conteúdo de discovery
condicional: só entram quando forem relevantes para uma decisão de produto e
devem ser sustentados por fontes. Não constituem uma seção obrigatória do PRD.
O template canônico e o fluxo de criação devem permanecer alinhados a esta
ordem. PRDs existentes fora desta estrutura são legados e devem ser
normalizados na próxima revisão, sem inventar conteúdo ausente.

## Papéis

| Papel                   | Responsabilidade                                                                                                          | Restrição                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Task principal (Orchestrator) | seleciona workflows, mantém Spec e Evaluation, decide ordem e delegação, integra diffs, executa sensores, registra evidência, publica e roteia falhas | não delega o veredito oficial nem usa relato de subagente como prova |
| Spec Reviewer           | executa um único gate antes da implementação, com retries da mesma revisão quando necessário                              | read-only; só avalia Architecture e Rules                            |
| Builder                 | implementa um escopo delimitado de paths contra uma revisão exata (Direct no contexto principal ou irmãos por ownership)   | não edita Spec, Evaluation, PRD ou Rules; usa o Penpot MCP para UI   |
| Implementation Reviewer | revisa o candidato integrado contra Contract, Architecture, layer rules e a evidência atual                               | read-only; não corrige nem produz o veredito oficial                 |
| Visual Reviewer         | compara, em paralelo, as capturas happy-path exigidas com exports atuais dos boards do Penpot, linha a linha do inventário | não edita nem captura; lê o Penpot só pelo MCP; consultivo           |

Subagentes são irmãos criados pela task principal na task atual. Nenhum subagente cria outro
agente ou task. `create-spec`, `implement-spec` e `conclude-spec` são workflows, não papéis.

## Artefatos duráveis

```text
documentation/prds/<module>/<slug>.md           # PRD canônico versionado do módulo
documentation/features/<domínio>/<feature>/
├── spec.md
└── evaluation.md           # criado no kickoff da implementação
```

Uma mudança de comportamento após conclusão usa
`documentation/features/<domínio>/<feature>/changes/<mudança>/`.

| Artefato             | Possui                                                      | Não possui                              |
| -------------------- | ----------------------------------------------------------- | --------------------------------------- |
| `spec.md`            | comportamento, Design, Technical e Verification Contracts     | tentativas e resultados executados      |
| `evaluation.md`      | comandos, evidências, findings, histórico, comparações e CI | autoridade de produto ou arquitetura    |
O arquivo Penpot `stardust` é a fonte visual canônica e editável, inspecionado diretamente pelo
Penpot MCP. O design não é extraído para artefatos da feature. Screenshots da implementação ficam
em `test-results/` ignorado ou em artifacts de CI; o identificador, a comparação e o resultado
ficam em `evaluation.md`.

Handoffs de design, manifests e imagens de referência extraídas não são mais usados: novas Specs
não os criam nem os referenciam. Ao atualizar materialmente uma Spec legada que os cite,
substitua essas referências por boards do Penpot `stardust` e preserve o histórico da revisão.
`design/stardust.fig` (Open Pencil) é um arquivo legado congelado, mantido só como histórico: não
é mais fonte de verdade e não deve ser aberto ou editado por novas Specs.

## Estados

| Artefato    | Estados                                                     |
| ----------- | ----------------------------------------------------------- |
| Spec        | `draft`, `open`, `in_progress`, `completed`, `superseded`   |
| Evaluation  | `in_progress`, `ready`, `completed`                         |
| Evidência   | `pending`, `passed`, `failed`, `stale`, `not_applicable`    |
| Achado (`ACH-*`) | `active`, `resolved`, `accepted_non_blocking`, `superseded` |

Falhas não criam estados extras: o item permanece `in_progress`, com finding e próxima ação.

## Grilling gate

Depois da pesquisa factual e antes de escrever ou criar o ticket, aplique o protocolo de Grilling
do [`grilling-prompt.md`](prompts/grilling-prompt.md). O protocolo também se aplica, conforme o
artefato, à criação ou atualização de PRDs e Specs. A task constrói a design tree, calcula
a frontier, pergunta todo o round atual no formato `❓`/`➡️` com recomendação e impacto, recompõe a
frontier após cada resposta e não adivinha decisões dependentes.

Para tickets, a frontier deve cobrir ator/outcome, escopo/exclusões, permissões, aceitação/falha,
fronteira técnica, validação, decomposição, sprint e assignee quando ainda não resolvidos. Fatos
pesquisáveis são responsabilidade da task; decisões materiais pertencem ao usuário. Nenhum
artefato ou mutação externa ocorre enquanto houver ramo material aberto. Depois da frontier vazia,
a task apresenta o entendimento compartilhado e obtém confirmação explícita; decisões e premissas
aceitas são registradas no artefato final, não no transcript.

## Intake opcional

GitHub Issue é tracking, não Contract técnico. A Issue pode apontar para um milestone, mas o
PRD só é identificado depois que o path do PRD canônico em `documentation/prds/` for resolvido:

- `open-feat-issue` transforma milestone/PRD ou pedido aprovado em uma issue com Objetivo,
  Escopo da Entrega, Critérios de Aceitação, Validação, Rastreabilidade e Fora de Escopo;
  depois da aprovação/publicação, `create-spec` cria o Contract;
- `open-bug-issue` registra sintoma, expectativa, reprodução e contexto sem diagnóstico;
- `create-bug-report` exige a bug issue aprovada, produz diagnóstico durável e recomenda correção
  direta ou Correction Spec conforme risco e coordenação.

Feature e bug issue exigem approval explícito antes de escrita no GitHub. Aprovar issue não
autoriza implementação, branch, commit, PR ou alteração de produto.

Workflows de feature e bug issue executam descoberta de PRD antes do draft; feature issue exige um
PRD principal, enquanto bug issue registra o PRD/`RP-*` mais relevante ou `None` com evidência
da busca. Chore issue é manutenção técnica independente de produto e não pesquisa, menciona ou
associa PRD, requisito de PRD ou milestone de produto. Refactor issue só consulta um PRD quando
precisa definir a fronteira de comportamento que deve ser preservada. A associação nunca é
inferida apenas por título, label ou path; um milestone só serve como ponte depois que seu único
link para o PRD canônico em `documentation/prds/` for validado.

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
3. Technical Contract com baseline, mapa de paths, `Expected file tree` por app/pacote, runtime flow e declarations por camada;
4. Verification Contract com verificações automatizadas `AV-*`, manuais `MV-*` e visuais `VV-*`;
5. alinhamento documental, Rule Pack e histórico de revisões.

Depois da pesquisa e antes da escrita, `create-spec` executa o Grilling até esvaziar a frontier e
obter confirmação explícita. Fatos pertencem à pesquisa; somente decisões não resolvidas pelas
autoridades são levadas ao usuário.

Todo `RP-*`/`JN-*` relevante deve mapear para `RF-*`; todo `RF-*` mapeia para
pelo menos um `CA-*` e vice-versa. Paths são exatos e classificados
como Create, Modify, Generate ou Remove. A Spec não contém resultados de execução.

Para UI, a Spec registra o widget tree exato, estados loading/empty/success/error/recovery,
teclado, foco, responsividade, frames de referência no Penpot `stardust` e viewports.
Comportamento inferido apenas de imagem precisa de clarificação. O detalhe visual permanece no
o Penpot `stardust`, inspecionado pelo Penpot MCP; a Spec continua sendo a autoridade de
produto, escopo, comportamento e validação. Uma Spec íntegra passa diretamente de `draft` para a revisão
independente do Spec Reviewer, antes de qualquer implementação.

Antes da revisão, `create-spec` faz uma checagem de integridade manual da estrutura, dos IDs, da
rastreabilidade e do mapa canônico de paths; ela não substitui o Spec Reviewer. O formato do
mapa de paths é validado depois, contra o diff, por `check:spec-implementation`.

Depois da checagem de integridade, e antes de `implement-spec`, a task
principal ativa exatamente um Spec Reviewer read-only com a revisão exata, `architecture.md` e o
Rule Pack das camadas afetadas. O Reviewer verifica somente fronteiras, dependências, ownership
e aderência às Rules; não avalia produto, Design, critérios ou validação. A task principal verifica
cada finding, corrige a mesma Spec e retoma o Reviewer antes da implementação. A Spec só passa para
`open` quando essa revisão estiver `clear` e nenhum finding bloqueante verificado permanecer;
então o fluxo segue para `implement-spec`. Amendment posterior invalida o resultado e exige
nova revisão antes de implementar. A revision history registra a revisão, o resultado e as resoluções
verificadas, sem incorporar o relatório bruto.

## Design Contract

Quando a entrega tiver UI, a fonte visual canônica é o arquivo Penpot `stardust`, inspecionado
diretamente pelo Penpot MCP por quem cria, implementa e revisa a Spec. Não há extração do
design: a Spec não cria `design/handoff.md`, não exporta imagens para a feature e não copia
tokens, medidas ou receitas visuais.

O Design Contract da Spec (subseção `## Design Contract` de `Implementation Contract`, só com UI) registra, no mínimo:

1. os frames relevantes, identificados pela página e pelo nome do board ou componente (o nome é o
   contrato; IDs podem mudar se o board for recriado);
2. o estado, a variante e o viewport de cada frame, com os `RF-*`/`CA-*`/`VV-*` relacionados;
3. divergências permitidas, extensões aprovadas, exclusões e estados sem frame canônico;
4. os requisitos de comparação visual vinculados a `CA-*` e `VV-*`.

A precedência padrão é: design system e tokens do repositório; comportamento dos componentes
compartilhados; frames do Penpot `stardust` e os tokens vinculados a eles. Valor visual
sem variável não autoriza cor, medida, componente, ícone ou CSS novo sem token, Rule ou decisão
registrada. Fallbacks semânticos e adaptações acessíveis devem ser declarados na Spec;
divergências materiais sem decisão rastreável mantêm a Spec aberta.

Se o Penpot MCP não estiver disponível, ou o arquivo Penpot `stardust` não estiver conectado a ele, a
inspeção ou comparação que depende do design fica bloqueada e é registrada como tal; não
substitua o frame por suposições.

`evaluation.md` registra screenshots da implementação, comparações, observações, `EV-*`, `ACH-*`
e o estado final. Se uma mudança alterar a intenção visual, isso é uma mudança de Contract:
retorne a Spec para `draft`, incremente a revisão, atualize o Design Contract e invalide as
evidências afetadas.

## Implementação e evidência viva

`implement-spec` é a única entrada de implementação e executa sempre o Builder Direct no
contexto principal. O `evaluation.md` é o único ledger de execução: progresso, evidências,
findings e próxima ação.

Nenhum source, teste, migration ou artefato gerado é alterado antes de uma assignment delimitada
ser registrada no Evaluation com revisão, RF/CA, paths, Rules e exits. A Spec é
comparada com a árvore de arquivos, contratos, estados e exclusões antes de cada handoff e após
cada correção. Falha de conformance, cenário manual/runtime indisponível ou evidência stale mantém
o trabalho `in_progress` e bloqueia o avanço para `ready`.

Antes dos sensores e do Reviewer, execute `pnpm run check:spec-implementation <spec> --base <commit-base>`.
Esse preflight exige o mapa canônico `Path | Change | ...` do `Technical Contract` e
confirma que cada `Create`, `Modify`, `Generate` ou `Remove` corresponde ao diff e ao
filesystem. Ele é estrutural e não substitui testes, sensores, Reviewer ou Evaluation.

Antes de alterar source ou testes, materialize `evaluation.md` pelo Contract canônico definido
em `implement-spec`, registre revisão, assignment, paths, Rules, critérios e exits, e mude a Spec para
`in_progress`. A task principal inspeciona cada diff, executa os sensores oficiais e atualiza
Evaluation após cada mudança de código, teste, browser, migration, artefato ou documentação.
Relatos de Builder e Reviewer são input, não evidência; a task principal verifica o candidato
integrado e registra os comandos, resultados, freshness e IDs de evidência.

Para cada grupo de rotas HTTP afetado, o arquivo `.rest` correspondente em `apps/server/rest-client/`
faz parte do escopo e deve conter exemplos atuais para todas as rotas do controller, sem segredos.
Hooks de comportamento `use-*.ts` sob o escopo devem ter testes colocados em `tests/use-*.test.ts`,
salvo exceção explícita da Rule Pack registrada no Evaluation.

Para frontend, testes automatizados não substituem o smoke manual obrigatório do caminho feliz
real definido em `AGENTS.md`: serviço local, login e rota protegida quando aplicáveis, resultado
principal e status dos endpoints essenciais. Não exercite manualmente estados de erro/loading/recovery.
Registre console, `pageerror`, `requestfailed` e
respostas detalhadas somente para diagnosticar falha inesperada; screenshot é necessário quando a
UI muda ou a comparação visual exige. Após correção, repita apenas o caminho feliz afetado. Para
Server e banco, mocks não substituem request/response real, autorização, tenant e persistência no
Supabase Dev quando aplicável.

Depois da integração, um Implementation Reviewer revisa o candidato integrado. Para UI
design-backed, o Visual Reviewer roda em paralelo sobre o mesmo candidato e as capturas já
existentes, com uma disposição por linha do inventário manual/visual do Evaluation; não há
terceiro Reviewer serial. Os Reviewers consomem os resultados registrados e não reexecutam
suites verdes. A task principal verifica os findings e consolida veredito, `ACH-*` e
evidências no `evaluation.md`.

A evidência é invalidada pela alegação e pelas dependências afetadas, não pela idade do commit:
um novo SHA ou uma edição de ledger, por si só, não invalida prova de comportamento inalterado.
O Evaluation mantém uma seção de Handoff factual (revisão, candidato, critérios inacabados,
paths sujos e ownership, processos e portas iniciados, bloqueios e próxima ação) para que outro
agente retome a partir da Spec, do Evaluation e do diff.

Evidence anterior à última mudança afetada vira `stale`. Evaluation só muda para `ready`
quando todos os `CA-*`, sensores, `AV-*`, `MV-*`, `VV-*`, `EV-*`, comparações visuais e `ACH-*`
bloqueantes estão
atuais e resolvidos.

## Correção versus mudança de Contract

| Classe                    | Ação                                                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Correção de implementação | mantém revisão; registra finding; reabre trabalho/evidência; retoma Builder; reexecuta somente exits invalidados                    |
| Mudança de Contract       | pausa; Spec volta a `draft`; atualiza autoridade; incrementa revisão; reconcilia Design e Evaluation; retoma `implement-spec` |

Erro de teste, browser, console, runtime, migration, CI ou comparação visual dentro do Contract
é correção automática. Não se pede autorização para tornar a implementação aderente. Pergunte
somente quando faltar decisão de produto, autoridade, ambiente, segurança ou escopo.

## Conclusão, PR e CI

`conclude-spec` exige Spec `in_progress`, Evaluation `ready`,
conformance atual e nenhuma evidência bloqueante. Com autorização para commit/push/PR:

1. repete preflight e conformance no candidato atual;
2. invoca `commit-code` para commits intencionais;
3. invoca `open-pr` para criar ou atualizar um PR ready-for-review;
4. aguarda cada workflow aplicável no HEAD atual do PR;
5. registra nome, resultado, URL e SHA em Evaluation;
6. em falha, roteia imediatamente para `implement-spec` ou amendment, republica e repete CI;
7. após CI verde, marca Spec e Evaluation como `completed`.

Antes de marcar os artefatos como `completed`, `conclude-spec` analisa todos os findings,
warnings e falhas da entrega e identifica causas que possam se repetir. Lacunas de processo,
Architecture, tooling ou Rules devem atualizar a documentação normativa correspondente; erros de
implementação reutilizáveis devem ser registrados como anti-padrões na Rule da camada. Cada ação
preventiva, documento alterado ou justificativa de não aplicabilidade fica registrada em
`evaluation.md`. Mudanças normativas que exigem decisão do usuário mantêm a Spec aberta até a
aprovação.

Não use run de push, SHA antigo, check ausente ou build local como substituto do CI do PR.
Não faça merge ou deploy sem pedido explícito. Feedback posterior em PR aberto pode reabrir a
mesma Spec; após merge, defeito usa Bug Report e comportamento novo usa uma change Spec.

## Sensores oficiais

Após alteração de código, execute os detectores de `AGENTS.md` no escopo afetado:
`check:code` e `check:types` nos workspaces alterados e nos consumidores, e `test:unit`
com os arquivos de teste verificados no código. Acrescente `check:architecture`, testes
de integração (somente os arquivos ou cenários afetados), geração, browser, Supabase Dev e
build conforme Rules, Spec, paths e risco. Execute `pnpm run check:test-integrity` depois de
adicionar, mover ou remover testes. O ratchet de cobertura
(`pnpm run test:coverage -w <workspace>` e `pnpm run check:coverage <workspace>`) mede o
workspace inteiro e roda no CI de `@stardust/core`, `@stardust/server`, `@stardust/backoffice` e
`@stardust/web`; execute-o localmente apenas quando o impacto demonstrado abranger o
workspace, quando a Spec o exigir ou quando o usuário pedir. Os checks falham se qualquer
métrica ficar abaixo do baseline versionado em `coverage-baseline.json`. O
`check:test-integrity` exige pareamento
somente para controllers, jobs, use-cases, entidades/structures/aggregates,
hooks, views/widgets, Web routes (`app/page|layout|route`) e Server routes
(`tests/routes`), RPC actions e AI tools; barrels, services/repositories genéricos,
tipos/código gerado, fixtures, mocks e infraestrutura de testes são excluídos e
listados no resultado JSON. Testes devem ficar em `scripts/tests/**` ou em
`tests/` co-localizado com o alvo permitido (domínio, use-case, controller,
job, hook, widget/view, rota Web/Server, RPC action ou AI tool); os demais
falham com `forbiddenTestPaths`. `@stardust/lsp`, `@stardust/validation`,
`@stardust/email` está fora desse quality ratchet.

Registre no `evaluation.md` os comandos exatos, os arquivos e cenários, as contagens, o resultado
e o candidato avaliado. Uma seleção vazia ou ignorada não passa só porque o comando terminou com
sucesso. Revisão, continuação e conclusão reutilizam a evidência não invalidada: um novo commit
ou uma edição do ledger sozinhos não justificam outra execução. Preserve o resultado original de
falhas e de execuções completas; uma correção focada prova apenas o escopo que executou. `format`
aplica formatação, mas não prova comportamento.

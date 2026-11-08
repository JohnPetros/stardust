---
name: implement-spec
description: Implementar de forma autônoma uma Spec aberta ou retomada do Stardust, verificar o candidato integrado e preservar a evidência para continuação.
---

# Implementar Spec

Siga [`documentation/sdd.md`](../sdd.md). A Spec fixa comportamento, contratos,
exclusões e sensores exigidos. Organize a execução diretamente na task atual. Use
delegação focada quando os escopos forem independentes; não existe Plan, sequência
de aprovação por fase/tarefa nem transição para `create-plan`. Este prompt é a única
entrada de implementação: não peça ao usuário para escolher outro prompt e não
crie outra thread.

```text
implement-spec
→ Builder Direct ou Builders delimitados
→ candidato integrado
→ check:spec-implementation + sensores + verificação manual real
→ Implementation Reviewer (+ Visual Reviewer em paralelo, quando há UI)
→ evaluation.md ready
→ conclude-spec
```

## Persistência e regra de parada

Seja dono da implementação e da verificação até o Evaluation ficar `ready`. Não pare
quando um check passar, o código estiver completo ou um Reviewer responder enquanto
houver obrigações exigidas e acionáveis. Uma pergunta sobre um check conduz a Spec em
andamento, salvo se o usuário restringir ou cancelar o objetivo explicitamente.

1. Reconcilie todas as verificações `AV-*`/`MV-*`/`VV-*` e de baseline, o mapeamento dos `CA-*`,
   os `ACH-*` abertos e a revisão independente com o `evaluation.md` antes de
   escolher a próxima ação.
2. Execute os checks pendentes, diagnostique falhas, corrija causas dentro do
   Contract e rerode a verificação afetada. Após cada correção, inspecione todo o
   conjunto de obrigações restantes e preserve a prova atual não afetada.
3. Investigue falhas de setup local dentro da autorização existente: saúde e
   configuração dos serviços, estado de browser expirado, contas/dados definidos na
   fonte e fixtures/seeds desatualizados. Use fixtures isoladas ou ambientes da própria
   task. Uma primeira falha ou setup ausente pede diagnóstico, não handoff imediato.
4. Obtenha as revisões e rechecks exigidos, resolva os findings bloqueantes e
   reconcilie o alinhamento documental. Nunca remova checks nem enfraqueça asserções ou
   limiares só para passar; mudanças materiais passam pela reconciliação do Contract.
5. Antes de ceder o controle, audite cada check/finding restante e continue sempre que
   houver uma ação segura e autorizada que o faça avançar. O handoff descreve uma
   interrupção ou um bloqueio real; não substitui trabalho executável.

Uma fonte de fixture/seed desatualizada é acionável quando os dados pretendidos estão
definidos no Contract. Inspecione seus consumidores e as Rules aplicáveis, corrija a
definição na fonte, valide-a e rerode o check originalmente bloqueado. Distinga
corrigir a fonte de aplicar um seed: inspecione o comportamento real do comando de
reset/seed e use alvos descartáveis ou isolados. Nunca resete/reseed dados
compartilhados (inclusive Supabase Dev) sem autorização explícita. Pergunte apenas
quando os dados pretendidos forem materialmente ambíguos ou quando uma operação
compartilhada necessária não tiver autorização depois de investigadas as alternativas
isoladas.

Pare o trabalho inacabado somente por uma parada/restrição explícita, uma decisão ou
autorização material genuinamente ausente, ou uma dependência externa indisponível
depois do diagnóstico e da recuperação permitidos. Conclua antes o trabalho
independente; registre os IDs afetados, a recuperação e a prova tentadas, por que uma
ação externa é necessária e a entrada ou mudança exata requerida. Não invente
não-aplicabilidade nem marque prova ausente como `passed`. Retome quando o bloqueio
sumir, sem pedir novamente autoridade.

## Estabelecer ou retomar o Contract

Leia `AGENTS.md`, `documentation/sdd.md`, a Spec e o `evaluation.md` atuais,
Architecture, Modules, as Rules selecionadas pelos paths afetados,
`documentation/tooling.md` e o Design Contract com as páginas, boards e componentes do
Penpot `stardust` pelo Penpot MCP. Reutilize fontes completas ainda atuais neste
contexto. Inspecione `git status` e os diffs e preserve trabalho não relacionado. Use o
CodeGraph para cada nova exploração de código, conforme `AGENTS.md`.

A implementação inicial exige Spec `open`; o trabalho retomado exige a mesma revisão e
um Evaluation com critérios ou findings inacabados. Não ative o Spec Reviewer para
evidência de implementação. Uma mudança material de Contract passa por `create-spec`:
preserve o histórico, reconcilie fonte/design/sensores, incremente a revisão e
invalide a prova afetada.

Antes de qualquer edição de feature, crie ou reconcilie o `evaluation.md` pelo
Contract de [`create-evaluation`](create-evaluation-prompt.md) e mude a Spec para
`in_progress`. Registre o Contract atual, a revisão da Spec, o commit-base, o
branch/candidato, os fatos conhecidos de baseline e a assignment (RP/JN, RF/CA e
SHI-* mapeados, paths permitidos e proibidos, Rule Pack, referências de Design e
exits). Inicialize uma linha de Progress por `CA-*`, separando implementação de
verificação, além de Check Results, Findings, Lições, Handoff e Delivery. Leia os
relatórios de falha existentes; não lance suites de integração para um baseline nem
para cumprir o kickoff. A disponibilidade do ambiente pode ser inspecionada sem iniciar
uma suite comportamental.

Na continuação, compare progresso e evidência registrados com a árvore atual. Um
critério concluído permanece concluído somente quando o comportamento coberto e as
provas não mudaram. Inspecione sessões de processo e portas ativas registradas antes de
subir serviços. Recupere o trabalho inacabado a partir do diff e dos findings e escolha
a próxima ação sem reconstruir um ledger de tarefas.

## Invariantes fail-closed

Se uma destas condições não puder ser verificada, pare antes de editar source,
testes, migrations ou artefatos gerados e registre o blocker:

- `implement-spec` é a única entrada de implementação; não reative workflows
  removidos nem simule papéis antigos;
- a Spec, seus paths, contratos, exclusões e estados são autoridade; código existente,
  screenshot isolado ou teste passando não os substitui;
- `npm run check:spec-implementation -- <spec> --base <commit-base>` roda antes dos
  sensores integrados e novamente após qualquer correção que altere, crie, gere ou
  remova path contratado;
- qualquer erro de implementação, teste, browser, rede, console, migration, CI ou
  visual dentro do Contract é correção automática: registre, invalide a evidência
  afetada, corrija no escopo e rerode os checks;
- cenários manuais/runtime exigidos são fail-closed: indisponibilidade, timeout ou
  falha bloqueia o item afetado; não use mock nem evidência antiga como substituto;
- para Server, confirme comportamento real, autorização, persistência e efeitos
  colaterais conforme `AGENTS.md`; o Supabase local é o padrão e o Supabase Dev só entra
  quando a tarefa exigir o projeto remoto;
- a execução local é escopada (ver "Execução local escopada" em `documentation/tooling.md`):
  cobertura/ratchet (`test:coverage`, `check:coverage`) e suítes completas ficam para o CI,
  salvo impacto demonstrado no workspace inteiro, exigência da Spec ou pedido do usuário; LSP,
  Validation, TypeScript Config e Email permanecem excluídos do ratchet.

## Execução autônoma e ownership delimitado

A task principal decide a ordem, a estrutura de implementação, as dependências e a
recuperação dentro do Contract aprovado e das Rules. Resolva escolhas rotineiras e
reversíveis diretamente. Pergunte somente quando uma escolha não resolvida alterar
materialmente comportamento de produto, escopo, ownership, contratos públicos ou
persistentes, ou um compromisso técnico consequente. Árvores internas existentes
orientam o posicionamento; não exigem amendment para cada helper ou widget.

O grafo de dependências do PRD é autoridade de produto, não ordem de execução. Derive
a ordem somente do Technical Contract, dos paths afetados, das dependências de runtime
e dos limites das camadas.

Implemente diretamente quando o trabalho for coeso (`Builder Direct`, no contexto
principal, sem subagente). Para fluxos independentes, atribua Builders irmãos nomeados
por ownership (`builder_core`, `builder_server`, `builder_web` ou equivalente) com:

- caminho e revisão da Spec e os resultados `RF`/`CA` relevantes;
- fronteiras exatas permitidas e proibidas e dependências compartilhadas;
- Rule Pack, referências de design e findings existentes;
- comandos de feedback unit/component/estático e o resultado esperado.

Builders não criam outros subagentes. Mantenha o ownership concorrente disjunto, avise
que não estão sozinhos no worktree e devem preservar edições alheias. Coordene
contratos compartilhados, artefatos gerados, migrations, lockfiles e mudanças
cross-boundary na task principal. Inspecione cada diff devolvido e incorpore só o
trabalho aderente ao Contract. Delegue por ownership/resultado coeso, não por arquivo
nem por fase cerimonial.

Builders escrevem ou atualizam testes a partir das alegações de aceitação, inclusive
falhas, recuperação e estados enumerados, e executam checks focados unit/component e
estáticos durante a implementação. Integração de Server, browser, jobs e migrations
pertence ao ciclo de verificação integrada final, não a cada saída de Builder. Prefira
os comandos reais do CI e configuração reproduzível explícita a segredos de
desenvolvedor.

Siga as Rules de fronteira de teste selecionadas: use-cases mockam ports; controllers
exercitam o app registrado e a persistência reais; jobs exercitam a execução durável
registrada; testes Web usam a fronteira do widget/hook/Page/Layout dono. Mantenha
cobertura e asserções existentes significativas. Não enfraqueça um check, não pule uma
falha, não remova cenários válidos nem invente um comando para reportar verde.

Atualize os exemplos `.rest` do grupo de rotas junto com a implementação dona, em
`apps/server/rest-client/`, com uma requisição rotulada por rota, contrato atual e
variáveis reutilizáveis sem segredos. Cada hook de comportamento `use-*.ts` no escopo
tem `tests/use-*.test.ts`, salvo exceção explícita da Rule Pack registrada no
Evaluation. Gere rotas e outros artefatos com os comandos do repositório.

## Implementação com design

Leia o Design Contract da Spec e inspecione os boards e componentes nomeados do Penpot
`stardust` pelo **Penpot MCP** (o Builder e o Visual Reviewer usam o MCP diretamente),
exportando-os quando precisar de uma referência renderizada.
Mapeie as variáveis vinculadas aos tokens do repositório; não copie valores sem
variável, não invente detalhes ausentes e use primitivos e tokens semânticos
existentes, copy pt-BR acessível e as Rules de UI/roteamento selecionadas. Preserve o
design canônico: qualquer simplificação, substituição, adição ou divergência não
aprovada é finding bloqueante. Não salve exports na pasta da feature nem edite o
arquivo Penpot, salvo se a Spec o incluir no escopo.

A Spec define os estados renderizados happy-path e os viewports exigidos. Cubra
loading, empty, error, recovery, concorrência e desfechos incomuns com testes
automatizados; não transforme cada board em outro cenário manual. A evidência visual
exigida vem do candidato integrado, depois da última edição de UI afetada, com
rota/estado/viewport/fixture e path do artefato. Uma captura anterior de UI inalterada
pode permanecer válida quando suas dependências e o estado renderizado não mudaram;
explique a evidência mantida no Evaluation.

### Inventário de evidência manual e visual

Antes de executar ou delegar a verificação, enumere no Evaluation cada obrigação Manual
e Visual do Contract, com uma linha por jornada ou por estado/viewport renderizado
exigido: IDs `MV`/`VV`/`CA`, superfície/rota, estado, viewport, board do Penpot, candidato,
path do artefato, resultado observado e disposição da revisão. Mantenha o inventário no
Evaluation, sem criar outro artefato de planejamento nem cenários além do Contract.

Page, dialog, estados mobile e demais superfícies são obrigações distintas quando
exigidas: a evidência de uma superfície não estabelece o resultado de outra, mesmo que
compartilhem componentes. Uma captura continua `pending` até ser inspecionada contra um
export atual do board específico. Registre observações concretas sobre as propriedades
visuais exigidas e qualquer desvio aprovado; a mera existência da imagem não é prova.
Comportamento manual e aparência visual têm resultados separados: uma jornada que
funciona não prova correspondência de design, e uma imagem correspondente não prova
autenticação nem persistência reais.

## Verificação integrada e ciclo de falha

Execute as verificações Automatizadas (`AV-*`), Manuais (`MV-*`) e Visuais (`VV-*`) do Verification Contract e todos os gates de
baseline aplicáveis de Rules e Tooling. Para conjuntos finitos contratados, verifique as
combinações definidas; para entradas ilimitadas, use as classes de equivalência e os
limites contratados. Tooling exigido e indisponível deixa o check `blocked`; cobertura
não o substitui. Não instale um runner como ação incidental.

Depois de integrar todos os fluxos de implementação e os artefatos gerados:

1. Compare o diff completo com resultados, fronteiras, contratos públicos, invariantes
   persistentes, exclusões e cobertura de sensores da Spec.
2. Execute `npm run check:spec-implementation -- <spec> --base <commit-base>`. Esse
   preflight exige o mapa canônico `Path | Change | ...` do Technical Contract e
   confirma que cada `Create`, `Modify`, `Generate` ou `Remove` corresponde ao diff e ao
   filesystem. Ele é estrutural e não substitui testes, sensores, Reviewers nem Evaluation.
3. Execute `format`, `check:code` e `check:types` nos workspaces afetados e em seus
   consumidores, `test:unit` com os arquivos de teste afetados, `check:test-integrity` e
   `check:architecture` quando aplicável, conforme "Execução local escopada" em
   `documentation/tooling.md`. Cobertura/ratchet e suítes completas só entram com impacto
   demonstrado no workspace, exigência da Spec ou pedido do usuário (o CI as executa).
   Rode `check:complexity -w <workspace>` quando o escopo exigir. Registre cada categoria
   estática explicitamente. Um runner designado na task principal é dono dos comandos e
   resultados de integração.
4. Execute as seleções de integração contratadas (Server, browser, jobs) contra o
   candidato integrado, com arquivos/cenários exatos e fixtures compatíveis com o CI,
   mostrando que os testes pretendidos rodaram. Selecione testes locais somente para as
   mudanças do escopo e seus consumidores diretamente afetados; amplie apenas diante de
   impacto de dependência demonstrado ou de uma lacuna concreta na prova do escopo. Uma
   suite local completa exige escopo que a abranja ou pedido explícito do usuário.
5. Em falha, registre o comando/resultado e o finding mapeado, corrija dentro do
   Contract e rerode os checks de integração que falharam e os afetados até todas as
   seleções exigidas passarem. Seleções que passaram e não foram afetadas mantêm sua
   evidência; reexecuções mais amplas exigem uma dependência compartilhada alterada ou
   uma lacuna de cobertura concreta. Preserve falhas históricas de execuções completas:
   uma correção focada estabelece resultados focados, não um passe completo inferido.
   Evite repetir testes completos inalterados quando um comando real de cobertura já os
   executa.
6. Execute os cenários manuais happy-path concisos exigidos pela Spec com o Playwright
   em navegador real, seguindo a seção de verificação manual do `AGENTS.md`: serviços
   locais, login e rota protegida quando aplicáveis, resultado principal visível e
   status `2xx` dos endpoints essenciais, além de URL final, persistência,
   teclado/foco, viewport estreito e console/rede conforme aplicável. Capture os visuais
   exigidos durante essas jornadas. Não explore manualmente estados de erro, loading ou
   recovery, nem adicione matrizes negativas ou contas/fixtures repetidas sem uma
   obrigação de aceite.
7. Inspecione as capturas reais contra as referências e registre as diferenças
   concretas e os limites da evidência. Um screenshot não prova persistência nem
   autorização; transporte mockado não substitui uma jornada real exigida.
8. Encerre apenas processos e fixtures descartáveis iniciados por esta task; preserve
   serviços e dados compartilhados conforme `AGENTS.md`.

Serviços, contas ou fixtures exigidos e indisponíveis são bloqueios, nunca checks
aprovados. Continue o trabalho independente útil e reporte a prova indisponível exata.
Repita uma falha transitória de ambiente quando houver indício de que pode ter sucesso.
Uma dispensa explícita do usuário é registrada como `waived`, sem alegação de aprovação
nem remoção das obrigações de aceite automatizadas.

## Revisão paralela e correções

Ative o [Implementation Reviewer](../agents/implementation-reviewer-agent.md)
independente sobre o diff integrado, a Spec atual, as Rules selecionadas e a evidência de
aceite atual. Para UI design-backed, ative o
[Visual Reviewer](../agents/visual-reviewer-agent.md) **em paralelo** sobre o mesmo
candidato e as capturas e referências exigidas já existentes. Não adicione um terceiro
Reviewer serial; especialistas adicionais exigem um risco material distinto, não uma
contagem de pacotes nem uma fronteira de tarefa.

Os Reviewers inspecionam as asserções e o escopo/atualidade da evidência para cada
`CA-*`. Eles consomem os resultados de integração registrados e não rerodam suites
verdes só para ocupar outro papel. Prova ausente, stale ou não sustentada gera um
finding concreto e o sensor específico necessário. A task principal reconcilia os
relatórios, verifica os findings e registra os IDs `ACH-*` e sua disposição.

Entregue ao Visual Reviewer o inventário completo de estados visuais exigidos, inclusive
capturas ausentes, e peça uma disposição para cada linha. Reconcilie você mesmo o
escopo revisado com o inventário: um PASS geral ou a revisão de apenas algumas capturas
não fecha as linhas restantes. Estados exigidos ausentes, não inspecionados, stale ou
divergentes continuam `pending`, `stale` ou `failed` e impedem o check visual de passar.
Conclua o trabalho autorizado que falta e peça a revisão afetada antes de alegar
conclusão.

Corrija findings dentro do Contract de forma autônoma. Rerode apenas os sensores e as
comparações visuais invalidados e retome somente o escopo de revisão afetado. Uma
correção que cruza código e visuais reativa os dois Reviewers em paralelo. Um conflito
de Contract volta a `create-spec`; findings de implementação permanecem neste ciclo de
correção. Não reduza o aceite silenciosamente nem altere PRDs. Crie `Builder Fix ACH-<n>`
somente quando o Builder original não puder ser retomado ou a correção for
genuinamente independente. Após três falhas materialmente idênticas, peça decisão ao
usuário apenas se a resolução não puder ser obtida nas autoridades, na codebase ou no
ambiente.

### Correção versus mudança de Contract

Classifique qualquer pedido ou discrepância contra a revisão vigente antes de alterar
código ou artefatos:

- **Correção de implementação:** mantenha a revisão, registre um `ACH-*`, reabra o
  Evaluation e o trabalho afetado, marque como `stale` somente a evidência afetada,
  retome o Builder e rerode seus exits.
- **Mudança de Contract:** pause, retorne a Spec para `draft`, invoque `create-spec`
  para obter autoridade e atualizar PRD, Architecture, Modules, Design, Tooling ou Rules
  quando necessário; incremente a revisão, reconcilie o Evaluation e só então retome.

Não solicite autorização para corrigir uma discrepância dentro do Contract. Pergunte
somente quando a classificação, o resultado de produto, uma autoridade, segurança ou o
ambiente não puderem ser resolvidos pelas fontes do projeto. Alterações fora da Spec
permanecem fora do candidato e do Evaluation, salvo se afetarem os paths avaliados,
contaminarem a evidência ou causarem regressão.

## Reforço de Rules e findings

Quando um finding revelar guidance ausente, ambígua ou repetidamente violada:

- se a Rule já for clara, corrija a implementação e registre `No change` com a
  justificativa;
- se a convenção reutilizável não estiver clara, pause o trabalho dependente, atualize a
  autoridade pelo workflow apropriado e recompute o Rule Pack;
- para anti-padrão de implementação reutilizável, use `register-antipattern` na Rule da
  camada, com padrão proibido, alternativa obrigatória e prova de validação;
- invalide evidências afetadas, registre a alteração no Evaluation e rerode o caminho
  de correção e seus sensores.

Todo finding aceito tem o problema concreto em `Findings` e, quando houver orientação
reaproveitável, uma entrada em `Lições aprendidas` com a autoridade afetada e sua
disposição. Atualize PRD, Architecture, Design, Tooling, Rules ou prompts quando a
lição for durável; detalhes locais, typo isolado, falha transitória ou regra já
documentada recebem uma disposição explícita de não alteração. Mudanças de produto,
Contract, ownership arquitetural ou política global exigem autoridade do usuário.

## Evidência e prontidão

Siga a estrutura do [Evaluation](create-evaluation-prompt.md). O Progress tem uma linha
por `CA-*` com Implementation (`Pending`/`Partial`/`Complete`) e Verification
(`Pending`/`Partial`/`Passed`/`Failed`/`Blocked`/`Stale`) separados, checks/evidências
mapeados e trabalho restante. Check Results inclui os checks de baseline e usa `Pending`,
`Passed`, `Failed`, `Blocked`, `Stale` ou `Not applicable`, com IDs `EV-*`, procedimentos
exatos, seleção e contagem reais de testes, resultados esperado/observado,
candidato/data, ambiente/fixtures, paths de artefatos e limites. Preserve tentativas falhas ou
interrompidas e limitações. Use IDs estáveis `CA`/`AV`/`MV`/`VV`/`EV`/`ACH`/`CI` e registre
checkpoints significativos (trabalho de Builder aceito, execução de sensores, findings
resolvidos) em vez de uma atualização de ledger por edição de arquivo.

Invalide a evidência pela alegação e dependências afetadas, não pela idade do commit.
Uma mudança de implementação, fixtures, ambiente ou Contract reabre os checks que afeta.
Evidência aprovada inalterada permanece válida entre transições de papel, edições de
ledger, revisão e conclusão; registre a evidência mantida e o motivo. Seed, fixture,
configuração ou ambiente alterados registram escopo, procedimento reproduzível e
cleanup sem segredos; artefatos gerados registram fonte, gerador e output; testes novos
ou alterados registram o comportamento protegido e o comando.

Mantenha um Handoff factual e pequeno: revisão do Contract, branch/candidato, critérios
concluídos e inacabados, paths interrompidos ou não commitados e seu ownership, últimos
resultados, sessões de processo/portas iniciadas pela task e cleanup, bloqueios e a
próxima ação. Mantenha os bloqueios específicos; não converta esta seção em fases,
árvores de tarefas, estimativas nem um segundo Contract.

Registre lições reutilizáveis com referências `ACH`/`EV` de apoio e a ação documental ou
o motivo de nenhuma mudança. Uma correção trivial não precisa virar lição nem política
global. Mantenha o Delivery (verificação de fonte, alinhamento documental, estado de
publicação e limitações) factual, sem resultados de CI do PR.

Quando todos os critérios tiverem prova atual aprovada ou não-aplicabilidade justificada,
os sensores aplicáveis passarem e os findings bloqueantes estiverem resolvidos, marque o
Evaluation como `ready` e continue diretamente para `conclude-spec`. A conclusão reutiliza
esses resultados; não inicia outra execução ampla de integração. Os registros exatos de
automação, manual, revisão, dispensa e limitações devem sustentar cada alegação de
prontidão. Uma dispensa não transforma um check obrigatório `failed`/`blocked`/`stale` em
aprovação nem em prontidão. A publicação ainda exige a autoridade existente, e a conclusão
publicada aguarda o CI do HEAD atual e a resolução das conversas bloqueantes.

Antes de mudar o status de prontidão ou reportar que todas as validações
manuais/visuais passaram, reconcilie o conjunto completo exigido pela Spec com o
inventário, os artefatos reais, os resultados observados e as disposições dos Reviewers.
Cada linha exigida deve ter evidência atual aprovada e sustentada ou não-aplicabilidade
autorizada pelo Contract. Não exclua silenciosamente uma página, viewport ou estado, não
infira cobertura total do resumo de um Reviewer nem apresente verificação parcial como
completa. Se uma alegação anterior de conclusão não era sustentada, preserve-a e corrija-a
no Evaluation, reabra o check afetado e reporte a correção explicitamente.

## Relatório

Devolva links da Spec e do Evaluation, revisão/candidato, resultados implementados,
resultados dos sensores, findings e disposições dos Reviewers, critérios/bloqueios
restantes e a próxima ação. Mantenha explícitas as limitações de runtime e visuais.
Orientação reutilizável revelada por um defeito pode ser registrada como lição
fundamentada; mudanças de autoridade em todo o repositório e escritas externas seguem
suas fronteiras de autorização.

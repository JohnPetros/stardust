---
name: conclude-spec
description: Verificar uma entrega do Stardust, completar seus artefatos SDD e publicar ou atualizar o PR após o Implementation Reviewer, os checks e o CI do HEAD do PR.
---

# Concluir Spec

Feche a entrega atual reconciliando o Contract da Spec, a evidência do Evaluation, os
findings e as referências de publicação. A task principal conduz o fechamento na task
atual; não crie nova thread. Consuma a evidência de implementação válida: a conclusão
não inicia outro ciclo amplo de validação nem de revisão.

Uma invocação explícita de `conclude-spec` autoriza, junto com a autorização de commit,
push e PR já concedida pelo usuário, o encadeamento `commit-code` → `open-pr`. Um
pedido apenas local pula commit e PR. Isto nunca autoriza fazer merge da entrega em
`main`, deploy ou escrita em serviços externos além do PR. A continuação automática a
partir de `implement-spec` não amplia a autorização: sincronize e publique somente quando
o pedido do usuário já conceder isso; caso contrário, conclua localmente e reporte a
publicação como não solicitada.

## Pré-condições e continuidade

Leia `AGENTS.md`, `documentation/sdd.md`, a revisão exata da Spec e seu Verification
Contract (`Validation Contract` em Specs legadas), o Evaluation, as Rules e o tooling relevantes e o diff integrado. Verifique o
PRD canônico em `documentation/prds/` e a revisão registrada; reutilize uma leitura
completa e atual no mesmo contexto e releia se a revisão mudou ou a autoridade for
incerta. Reporte conflitos de autoridade; devolva a Spec afetada a `draft` para
reconciliação por `create-spec` e retome a implementação. Nunca altere silenciosamente a
intenção de produto, o ownership de módulos, a Architecture, as Rules nem o contrato de
aceitação.

Exija:

- a Spec atual está `in_progress` e o Evaluation está `ready` para aquela revisão;
- todo `RF-*`, `CA-*`, verificação `AV-*`, `MV-*` e `VV-*` exigida tem evidência atual aprovada ou uma
  disposição explícita e justificada de não aplicável; o Progress distingue
  implementação `Complete` de verificação `Passed`;
- as revisões independentes de implementação e visuais exigidas cobrem o candidato (um
  Implementation Reviewer aceito para o HEAD correspondente e, com UI design-backed, o
  Visual Reviewer com disposição para cada linha do inventário);
- nenhum finding bloqueante permanece; e
- a rastreabilidade para PRD/Issue/Report, o escopo e as exclusões estão corretos.

Um check exigido que falhou, está ausente, indisponível, pulado, dispensado ou stale não
é um passe e não pode gerar prontidão nem conclusão. Reconcilie Check Results, Progress,
Findings e o candidato real; um status `passed` sem prova observada é insuficiente. Mantenha o
Evaluation `in_progress` enquanto houver evidência ou correção pendente e retenha um
Handoff factual: progresso por critério, candidato atual, resultados reutilizáveis e
stale, trabalho inacabado, bloqueios e a próxima ação concreta.

Para um defeito dentro do Contract, adicione um `ACH-*`, invalide só a evidência afetada e
roteie direto para `implement-spec` na task atual. O Builder responsável corrige; o runner
de verificação designado atualiza os checks afetados até passarem. Retome a conclusão
quando o Evaluation estiver `ready`. Não pare em uma sugestão de próximo passo para uma
correção já autorizada.

## Sincronizar antes da verificação final de integração

Quando a publicação estiver autorizada:

1. Confirme que o branch atual é o branch da entrega (não `main` nem produção) e verifique
   seu remote configurado e o ref real de `main`.
2. Inspecione mudanças staged, unstaged e untracked. Preserve mudanças não relacionadas;
   nunca faça reset, stash, autostash, troca de branch nem sobrescreva trabalho para forçar
   um merge. Pause apenas se o Git não puder preservar o trabalho com segurança.
3. Faça fetch e merge do `main` mais recente daquele remote no branch da entrega; não use
   rebase nem `git pull` sem qualificação. Registre o commit buscado e o candidato resultante
   no Evaluation. Se o ref buscado já estava incorporado, reutilize o resultado.
4. Em conflitos, siga `resolve-merge-conflicts`, preserve as duas intenções, faça stage dos
   paths exatos, conclua o merge pendente e inspecione o diff integrado. Coordene a
   execução de integração com o runner designado.
5. Inspecione o que a sincronização introduziu. Se os checks já passaram e a sincronização
   alterou comportamento coberto, fixtures, dependências ou configuração, reabra apenas os
   checks e o escopo de revisão afetados. Um merge apenas de ancestralidade ou uma mudança
   não afetada não exige reexecução geral.

Se `main` avançar durante a publicação, aplique a mesma regra de invalidação escopada. Fetch
falho, autoridade de remote desconhecida e conflitos não resolvidos impedem a publicação.

## Reconciliar conformance e evidência

Inspecione o worktree e o diff completos da entrega:

```bash
git status --short
git diff --stat
git diff
git diff --cached --stat
git diff --cached
git log -10 --format='%h %s'
```

Classifique os paths exatos da entrega, a documentação factual exigida, as mudanças de
ledger operacional e o trabalho não relacionado. Inclua a documentação factual exigida nos
commits ordinários; preserve e exclua explicitamente o trabalho não relacionado. Leia o
arquivo Penpot apenas pelo Penpot MCP.

Para cada critério selecionado, confirme que a implementação atual satisfaz a Spec e seu
sensor concreto. Testes passando, sozinhos, não estabelecem cobertura completa do
Contract. Registre fronteiras, exclusões, evidência de sensores e limitações conhecidas.
Use identificadores estáveis e preserve falhas e suas resoluções.

Use o Progress e os Check Results do Evaluation, em vez de outra matriz de aceite. O
Progress separa implementação de verificação e mapeia `CA`/`RF` para `AV`/`MV`/`VV` e IDs
`EV`. As verificações Manual (`MV`) e Visual (`VV`) têm condições de aprovação explícitas; os
checks de baseline permanecem no mesmo registro de resultados. Confirme as disposições
atuais separadas de tipos (`check:types`), lint/código (`check:code`) e complexidade para
as mudanças escopadas e os projetos consumidores afetados. Reutilize resultados
aplicáveis; lint de complexidade configurado não prova uma métrica quantitativa, e tooling
exigido ausente bloqueia o fechamento.

A evidência inclui o comando exato e o diretório de trabalho, o resultado, a revisão de
código ou a identidade do worktree, a fixture/configuração relevante e os critérios
cobertos. Os resultados permanecem válidos quando seu Contract, o código e as
dependências cobertos, as fixtures e a configuração não mudaram. Explique o reuso entre
SHAs de candidato; edições de ledger não invalidam resultados. Correções invalidam a
evidência afetada até serem atualizadas; impacto desconhecido exige checar o escopo mais
amplo potencialmente afetado. Não sobrescreva um ID de evidência antigo com um resultado
materialmente diferente.

Para mudanças HTTP, compare cada grupo de rotas de controller afetado com seu
`apps/server/rest-client/<módulo>/<grupo>.rest`: uma requisição rotulada por rota,
parâmetros/headers/body/status/contratos de erro atuais e variáveis reutilizáveis sem
segredos. Cada hook de comportamento `use-*.ts` no escopo tem seu `tests/use-*.test.ts`,
salvo exceção registrada. Esses checks de artefato não substituem a evidência real de
HTTP, autorização e persistência.

Para critérios server-backed, exija evidência pela fronteira real da aplicação
(autorização, persistência, transação, eventos, providers e retries relevantes); transporte
mockado não prova uma alegação de integração real.

Para critérios de UI, consuma as asserções de interação happy-path e as capturas
inspecionadas das rotas/estados/viewports exatos da Spec: teclado/foco, comportamento
responsivo, URL final, resultado de console/rede e efeitos persistidos relevantes.
Screenshots não provam autenticação nem persistência. Cenários negativos, de loading,
empty, error, recovery e incomuns pertencem aos testes automatizados; não adicione
cenários manuais nem capturas durante o fechamento sem um Contract afetado ou uma correção
concreta que os exija. A revisão de código e a visual rodam em paralelo sobre o mesmo
candidato. Confirme também a auditoria de `ui-layer-rules.md` registrada no Evaluation.

Para UI design-backed, confirme que as comparações visuais registradas usaram exports
atuais do Penpot MCP das páginas, boards e componentes do Design Contract, e que a matriz
comprova fidelidade design-to-code no HEAD atual. Frame ausente, contradito, adicionado
sem aprovação ou divergência sem decisão rastreável mantém a Spec `in_progress` e exige
correção ou amendment. Reutilize comparações aceitas e atuais; o fechamento, por si só,
não exige novos exports.

## Propriedade da verificação e ciclo de falha

O runner de verificação designado na task principal é dono das seleções de integração de
Server, browser e jobs depois da integração completa. Selecione testes locais apenas para
mudanças do escopo e consumidores diretamente afetados; a conclusão não adiciona suites
não relacionadas. Seleções mais amplas exigem impacto de dependência demonstrado ou uma
lacuna concreta na prova do escopo; uma suite local completa exige escopo que a abranja ou
pedido explícito do usuário. Corrija falhas e rerode os checks que falharam ou foram
afetados até passarem, mantendo a prova não afetada. O CI do PR executa seus comandos
configurados de forma independente.

Consuma a evidência atual de unit/component, lint, tipos, arquitetura, build, integração e
manual definida pela Spec e pelas Rules. Use apenas comandos que existem em manifests e
tooling; nunca invente um checker genérico. Fechamento, Reviewers, commit e PR reutilizam
essa evidência. Execuções adicionais exigem um resultado ausente, mudança de
comportamento/dependência/fixture/configuração coberta ou um finding concreto não
resolvido. Registre checks pulados ou bloqueados por ambiente como limitações, nunca como
sucessos; repita falhas transitórias de infraestrutura só com evidência concreta.

Antes de chamar `commit-code`, confirme os sensores obrigatórios de `AGENTS.md`
(`check:code` e `check:types` nos workspaces afetados e consumidores, `test:unit` com os
arquivos afetados), `check:spec-implementation -- <spec> --base <commit-base>` e
`check:test-integrity -- --base <commit-base>` contra o HEAD final. Cobertura/ratchet
(`test:coverage`, `check:coverage`) e suítes completas só entram com impacto demonstrado no
workspace, exigência da Spec ou pedido do usuário; o CI as executa. Reutilize os
resultados atuais registrados e execute apenas o que faltar ou estiver stale. O build local
verde é pré-condição para chamar `commit-code`; se não houver evidência atual de build, execute
uma vez. Um resultado diferente de `passed` impede a conclusão.

## Disposição da entrega e lições

Mapeie os requisitos selecionados do PRD, por `RF-*` e `CA-*`, para a evidência aceita:

| RP/JN | Cobertura RF | Cobertura CA | Evidência | Disposição da entrega |
| --- | --- | --- | --- | --- |
| RP-01 / JN-01 | RF-01 | CA-01 | EV-01 | implemented |

Use `implemented`, `partially_implemented`, `not_implemented` ou `not_applicable` com
evidência. Entrega parcial nunca conta como implementação completa. Os requisitos de
produto permanecem canônicos no PRD versionado; não os altere sem um pedido explícito e
o workflow de autoridade aplicável.

Registre findings materiais como `ACH-*` com evidência, severidade, checks afetados, estado
e resolução em Findings. Leia as Lições aprendidas e identifique orientação duradoura para
Architecture, Modules, Design, Infraestrutura, Tooling, Rules ou workflow; mantenha
detalhes específicos da feature locais. Declare um motivo concreto de `No change` quando a
orientação existente for suficiente, em vez de inventar uma lição. Analise todos os
findings, warnings e falhas da entrega (Reviewers, sensores e verificação manual) e
identifique causas que possam se repetir. Lacunas recorrentes de processo, Architecture,
tooling ou Rules atualizam a documentação normativa correspondente; erros de implementação
reutilizáveis usam `register-antipattern` na Rule da camada. Registre no Evaluation uma
ação preventiva por finding (causa, documento atualizado ou `não aplicável` com
justificativa, evidência e estado).

Para atualizações de documentação além do fechamento rotineiro de Spec/Evaluation, reutilize
o escopo e a autorização já concedidos. Caso contrário, prepare o alvo exato, a mudança
proposta, a lição `ACH`/`EV` de apoio e o motivo, e obtenha aprovação antes de aplicar.
Permissão para concluir, sozinha, não autoriza nova política global; uma aprovação parcial
cobre apenas as mudanças aprovadas. Mudanças normativas que alteram produto, Contract, Rules
globais ou fronteiras arquiteturais exigem decisão do usuário e mantêm a Spec aberta até a
aprovação. Registre atualizações propostas/aplicadas/rejeitadas/adiadas em Lições aprendidas
e Delivery. Melhorias opcionais adiadas não bloqueiam o fechamento; alinhamento exigido não
resolvido ou conflito material de autoridade bloqueia. Não promova falhas transitórias a
política global nem enfraqueça Rules silenciosamente.

## Completar artefatos e publicar

Reconcilie todas as seções do Evaluation (estado atual, progresso, resultados de checks,
findings, lições, handoff e delivery) e mantenha o alinhamento documental e a revision
history da Spec corretos, com a prova detalhada e o estado da entrega no Evaluation.
Preserve tentativas falhas, heads anteriores de PR, escopo da evidência e fatos atuais de
processo/paths sujos. Atualizações rotineiras de fechamento/status não incrementam a
revisão. Nenhum `plan.md` é criado, lido ou concluído.

Para fechamento local, quando a publicação não for solicitada ou for explicitamente
local, marque a Spec e o Evaluation como `completed` depois que todos os requisitos locais
passarem; registre a publicação como não solicitada, com o motivo. Para publicação autorizada, mantenha a Spec `in_progress` e o Evaluation `ready`
durante o handoff de commit/PR até a publicação, o CI exigido do HEAD atual e as conversas
de review bloqueantes estarem resolvidos. Uma falha de publicação registra um bloqueio e
não pode ser reportada como entrega concluída. Não crie um commit só para atualizar o
ledger operacional; inclua a documentação factual exigida nos commits normais da entrega.

Para uma publicação explicitamente autorizada:

1. Verifique o branch, o resultado da sincronização, o diff escopado e a evidência atual.
2. Invoque `commit-code` para criar os commits intencionais da entrega, respeitando seus
   gates de staging, agrupamento, mensagem e paths.
3. Invoque `open-pr` para publicar ou atualizar um único PR da entrega, reutilizando os
   commits preparados e a evidência de verificação válida, solicitar o Codex Review e
   acompanhar o CI do HEAD recém-criado.
4. Verifique base, SHA do head, rastreabilidade do título/corpo e o estado da publicação;
   registre branch, hashes de commit e a URL do PR.

`open-pr` e `commit-code` mantêm seus próprios gates de autorização. Sem autorização,
pare antes de qualquer mutação externa e solicite-a. Havendo mudanças staged, mudanças fora
do escopo ou ambiguidade de agrupamento, preserve-as e pare conforme as regras dos
workflows chamados. Não crie PRs duplicados nem use publicação ad hoc para contornar o
workflow. Se a publicação estiver indisponível, reporte o bloqueio e mantenha os estados
prontos para publicação; não alegue publicação nem entrega autorizada concluída.

Para cada head atual do PR da entrega, inspecione os path filters dos workflows de CI
versionados e os checks atuais com o `gh` autenticado e aguarde os resultados terminais. O
resultado do CI fica no PR: não o registre no Evaluation. Inspecione o estado
do repositório em vez de presumir que os workflows existem. CI ausente, pendente,
cancelado ou de um head anterior não é CI atual aprovado; se nenhum workflow aplicável
existir, trate como não aplicável. Uma execução de CI exigida no head atual é distinta de
repetir suites locais.

Para falhas de CI acionáveis, roteie a correção por `implement-spec` (com `Builder Fix`
quando a correção estiver no escopo). Se a correção invalidar evidência já registrada,
reabra o Evaluation e atualize só essa evidência; a falha de CI em si não é registrada. Faça
commit e atualize o PR existente quando autorizado, repetindo o Reviewer quando o diff ou a
evidência tiver sido invalidada. Reexecute o mesmo SHA apenas para uma falha transitória
comprovada. Não mude a disposição de produto, a menos que a falha estabeleça um defeito de
produto.

Marque a Spec e o Evaluation publicados como `completed` somente depois que todo o CI
exigido do head atual passar e as conversas de review bloqueantes tiverem resoluções
verificadas. Não espere indefinidamente por feedback hipotético futuro. Feedback posterior
em PR aberto pode reabrir a mesma Spec (`resolve-pr-feedback`); após o merge, um defeito
usa Bug Report e comportamento novo usa uma change Spec. Não faça merge da entrega em
`main` nem deploy sem autoridade separada.

## Saída

Devolva links clicáveis e concisos da Spec, do Evaluation e do PR; a revisão da Spec e os
estados finais; branch/commits e referências de Issue/PRD; a cobertura de critérios/sensores
e a evidência reutilizada; as disposições da entrega; o estado de CI e publicação; findings
resolvidos, limitações remanescentes, atualizações factuais de documentação e exclusões
preservadas. Afirme apenas resultados realmente observados e registrados.

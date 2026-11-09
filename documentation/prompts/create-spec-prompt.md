---
name: create-spec
description: Criar ou revisar uma Spec implementável, compacta ou completa, a partir de PRD, Issue, Report ou demanda direta.
---

# Criar Spec

Atue como o Orchestrator do SDD. A task principal conduz a autoria na task atual; não
crie nova thread. Traduza uma versão conhecida dos requisitos de produto canônicos em um
Contract de implementação delimitado e testável. A execução (ordem, decomposição,
delegação) pertence à task principal em `implement-spec`: não coloque quebra de tarefas
nem ledger de execução na Spec. Árvores de arquivos esperadas e escopadas
descrevem as fronteiras afetadas; a organização ordinária de helpers permanece flexível.

Use Spec somente para uma entrega relacionada a uma feature. Manutenção direta basta para
formatação, tooling, refactors mecânicos e reparos cobertos por um Contract inalterado. Uma
mudança de comportamento de produto, contratos públicos, semântica de persistência, eventos
entre módulos ou jornadas de usuário exige Spec nova ou emendada. Preserve trabalho não
relacionado.

## Classificação

Identifique a origem: `prd`, `issue`, `report` ou `direct-request`. Defina
`scope` com workspaces, diretórios ou arquivos. Use modo compacto para um
resultado coeso, de fronteiras estáveis e baixo risco; use modo completo quando houver risco
material de segurança, concorrência, migration, persistência, múltiplos módulos/fluxos ou
integrações. Escale o detalhe pelo risco, não pela contagem de arquivos. A Spec compacta
mantém todas as seções, com escopo conciso, apenas os contratos consequentes afetados e
prova focada suficiente; omita detalhe opcional vazio, sem tamanho mínimo. O modo completo
acrescenta detalhe somente para os riscos e garantias identificados.

## Fontes

`source` é uma lista e pode conter múltiplas referências associadas à mesma
Spec. É permitido associar Issue e PRD simultaneamente, além de Report ou
demanda direta quando aplicável. Detecte todas as fontes informadas ou
associadas, busque e leia cada uma delas. Se um PRD estiver associado à Issue,
sua leitura é obrigatória; a ausência de PRD não bloqueia uma Spec originada
de Issue. Em caso de conflito, registre a divergência e resolva a ambiguidade
antes de abrir a Spec.

Leia todas as fontes da demanda, `documentation/architecture.md`, Rules aplicáveis,
`documentation/sdd.md` e os paths reais da codebase. Use CodeGraph, Context7, Penpot, Playwright ou Supabase quando
aplicáveis.

Resolva ambiguidades materiais antes de escrever ou modificar `spec.md`. O gate de
clarificação é um hard stop: não codifique uma decisão material em draft para só depois
perguntar ao usuário. Perguntas devem trazer evidência, recomendação, alternativa e impacto.
Escreva somente quando todas as escolhas estiverem resolvidas pela autoridade ou aceitas
explicitamente como premissa documentada.

## Gate obrigatório de Grilling

Execute o **Grilling gate** definido em [`sdd.md#grilling-gate`](../sdd.md#grilling-gate) depois da pesquisa factual e
antes de escrever ou alterar a Spec. Modele como design tree somente decisões ainda não resolvidas
pelas fontes, Architecture, Rules, Design ou codebase. Pergunte em cada round toda a frontier
disponível, com evidência, alternativas, impacto e resposta recomendada; decisões dependentes
ficam para rounds posteriores.

Quando investigações independentes ainda estiverem em andamento, adie apenas as perguntas que
dependem delas e conduza o restante da frontier. A frontier vazia e a confirmação explícita de
entendimento compartilhado são pré-requisitos para redigir. Se uma nova lacuna material surgir
durante a checagem de integridade ou a revisão, reabra o Grilling antes de continuar.

## Revisão do design em chat

Depois que a frontier do Grilling esvaziar e antes de redigir, valide o design com o
usuário em seções curtas no chat, escaladas ao risco: resultado e escopo; ownership,
componentes e contratos públicos (incluindo a árvore de arquivos esperada das fronteiras
Server/Web afetadas); fluxo de runtime, persistência e tratamento de falhas; composição de UI
e referências de design, quando aplicável; e verificação. Para escolhas arquiteturais
consequentes, compare as alternativas viáveis ancoradas no Stardust (geralmente duas a
quatro) com recomendação e os trade-offs de compatibilidade, ownership, consistência e
recuperação; não invente alternativas quando a autoridade existente já resolve a escolha
nem adicione capacidades especulativas. Use listas e blocos de código, não tabelas, nas
seções de chat. Pergunte explicitamente se cada seção está correta antes de continuar;
responder às perguntas de uma seção não a aprova, e uma seção reaberta por uma decisão
posterior é reapresentada como delta. A aprovação explícita do design completo permite
escrever a Spec; ela não aprova a Spec escrita nem autoriza a implementação. Registre a
abordagem escolhida e a justificativa no Technical Contract existente: a `spec.md` é o
artefato de design escrito, sem segundo documento de design.

## Princípios de evidência e fronteiras

- Todo path citado deve existir; uma criação deve ser declarada como `Create` no
  mapa canônico de paths.
- Toda criação ou alteração deve estar apoiada em fonte, Architecture, Rule,
  implementação similar ou decisão técnica explicitamente registrada.
- Preserve as fronteiras existentes entre autenticação, autorização, ownership,
  transporte e domínio. Dados derivados da sessão não pertencem ao payload do
  client; HTTP, Supabase e SDKs não atravessam para o Core.
- Não introduza acoplamento cross-domain, schema, provider ou integração sem
  precedente ou justificativa arquitetural verificável.
- Quando houver migration, especifique backfill, constraints, índices, FKs,
  comportamento de deleção, RLS/grants e reflexos em tipos/mappers/repositories.

## Protocolo de pesquisa e síntese

Pesquise somente apps, pacotes e camadas alcançados pelo escopo. Antes de redigir
a solução, consolide:

| Seção          | Conteúdo                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| Mapeamento     | paths reais, contratos, dependências e implementações similares          |
| Fluxo de dados | estado atual, produtores, consumidores, transporte e mudança necessária  |
| Atenção        | riscos, autorização, concorrência, segurança, performance e acoplamentos |
| Lacunas        | elementos esperados não encontrados e decisões sem evidência suficiente  |

Em fluxos multi-app, declare quem expõe, quem consome, o transporte e o formato
do contrato. Use ferramentas de codebase para evidência local, documentação
oficial para APIs externas, Penpot para design, Playwright para comportamento de
browser e Supabase para schema/dados quando aplicável. Architecture e Rules do
projeto prevalecem sobre recomendações genéricas de ferramentas externas.

Quando existirem duas ou mais lanes independentes, organize-as como investigações delimitadas da
própria task, com perguntas, paths, limites e formato de síntese explícitos. Pesquise cada boundary
diretamente, resolva conflitos por inspeção direta e verifique afirmações consequenciais. Não crie
agentes de pesquisa.

## Referências de design e Penpot

Quando o escopo envolver frontend ou UI, crie a subseção `## Design Contract` dentro de
`Implementation Contract` (omita-a quando não houver UI) e declare:

- a fonte visual canônica, o arquivo Penpot `stardust`;
- a página e o nome de cada board ou componente relevante. Não use IDs como
  referência: o nome é o contrato e o ID muda se o board for recriado no Penpot;
- o estado, variante e viewport representados, como loading, error, empty,
  content, aberto/fechado, desktop ou mobile;
- o mapeamento entre cada referência visual e os respectivos `RF-*`/`CA-*`;
- divergências entre design, requisitos, Architecture, Rules e comportamento
  atual, indicando a precedência adotada e o alinhamento esperado.

Use esta tabela como núcleo da subseção, uma linha por superfície/estado/viewport exigido:

```md
| Superfície / rota | Estado / viewport | Página / board / componentes do Penpot | CA / VV | Desvios permitidos |
| --- | --- | --- | --- | --- |
| <superfície afetada> | <estado e viewport exato> | <nomes reais> | CA-01 / VV-01 | <diferenças aceitas ou nenhuma> |
```

Mapeie os widgets afetados para tokens semânticos existentes e variantes de primitivos
compartilhados, e identifique a UI preservada fora da mudança.

### Regra design-to-code

Os frames declarados são a fonte visual canônica para o código. A Spec deve
tratar como parte do Contract a preservação da composição, hierarquia,
dimensões, espaçamento, tipografia, cores, bordas, elevação, ícones/assets,
densidade, variantes e estados observáveis de cada frame. HTML semântico,
acessibilidade, interação, dados e reflow responsivo podem adaptar a
implementação, mas não autorizam substituir, simplificar ou reinterpretar o
design.

Toda divergência precisa ser vinculada ao frame e ao `CA-*`, ter motivo
verificável e ser aprovada como decisão ou amendment antes de `open`. Frame
ausente, contradito ou adicionado sem aprovação é bloqueante. Não aceite CSS
genérico como aproximação, nem invente arquivo, frame ou detalhe visual quando
não existir uma fonte canônica; registre a ausência explicitamente.

Inspecione as referências com o Penpot MCP; não deduza detalhes visuais somente de
screenshots ou descrições. Não extraia o design para outros artefatos: não crie
`design/handoff.md`, não exporte imagens para `design/` e não copie tokens, medidas ou receitas
para a Spec. Builders e Reviewers inspecionam os mesmos frames diretamente pelo Penpot MCP.
A Spec registra apenas os frames, estados, variantes e viewports relevantes, seus vínculos com
`RF-*`/`CA-*`/`VV-*` e as divergências aprovadas. Se a solução exigir alteração no design,
inclua o Penpot `stardust` no escopo e especifique os boards afetados. Se não existir fonte
visual canônica, registre isso explicitamente e não invente arquivo ou frame.
Uma divergência material deve ser resolvida antes de a Spec chegar a `open`.

A validação de frontend deve exigir tanto a comparação com os frames no
Penpot quanto o exercício do fluxo real no Playwright, cobrindo os estados e
viewports especificados. O Penpot valida a referência visual; Playwright valida o
comportamento em runtime. Nenhum deles substitui os testes automatizados.

Quando a validação visual em runtime for obrigatória, escreva isso
explicitamente no Contract em um ou mais `CA-*`: declare os viewports, estados,
interações, rota e a evidência exigida (por exemplo, screenshot do dialog
aberto, loading, erro, vazio, conteúdo e fechado, ou comparação visual
equivalente). Para cada frame, declare também a dimensão de referência,
o estado, a variante e a comparação esperada com a Web.
Não use apenas expressões ambíguas como “verificar visualmente”. Diferencie
sempre a evidência da referência no Penpot da evidência do browser real: a primeira
confirma alinhamento com o design canônico; a segunda confirma renderização,
responsividade e comportamento observável em runtime.

## Arquivo e Contract

Crie `documentation/features/<domínio>/<feature>/spec.md` com:

```yaml
---
title: <título>
status: draft
revision: 1
source:
  - type: <prd|issue|report|direct-request>
    ref: <path do PRD canônico em documentation/prds/ ou outra fonte>
    revision: <revisão da fonte quando aplicável>
    requirements: [RP-01]
    journeys: [JN-01]
scope:
  - <workspace|diretório|arquivo>
last_updated_at: YYYY-MM-DD
---
```

O corpo deve conter exatamente cinco seções de primeiro nível (listadas abaixo da tabela).
Algumas têm subseções nomeadas obrigatórias, quando aplicáveis:

| Seção | Subseção nomeada |
| --- | --- |
| `Implementation Contract` | `## Design Contract` — somente com UI |
| `Technical Contract` | `## Expected file tree` — árvore por app/pacote; `## Runtime Flow` — fluxo de runtime (o mapa de paths e o detalhamento por camada ficam na mesma seção) |
| `Verification Contract` | `## Shared setup`, seguido de `## Automated`, `## Manual` e `## Visual` |

As cinco seções de primeiro nível são:

1. `Context and scope`;
2. `Implementation Contract`;
3. `Technical Contract`;
4. `Verification Contract`;
5. `Documentation alignment and revision history`.

Não crie `evaluation.md` nesta etapa; `implement-spec` o materializa no kickoff, antes da
primeira edição de feature. A Spec possui comportamento esperado; a Evaluation possui
execução e resultados reais.

Use `RP-*` e `JN-*` para rastrear a Spec ao PRD canônico versionado e às jornadas do
usuário. Use `RF-*` e `CA-*` como IDs obrigatórios da Spec; registre `AV-*`
para verificações automatizadas, `MV-*` para verificações manuais, `VV-*` para verificações
visuais e `EV-*` para as evidências esperadas. Use `SHI-*`
quando houver uma issue Jira Shifu:

```md
| CA    | RF    | Dado         | Quando | Então     | Evidência esperada   |
| ----- | ----- | ------------ | ------ | --------- | -------------------- |
| CA-01 | RF-01 | pré-condição | ação   | resultado | teste/browser/sensor |
```

Segurança, performance e arquitetura entram como critérios de aceitação ou
restrições técnicas. Não use `RN-*`, `RNF-*`, `RA-*`, comentários
`harness:evidence`, gates próprios ou baselines.

Especifique os métodos de toda interface, port, repository ou service criado ou
alterado pela solução, incluindo nome, entrada e retorno. Não delegue ao Builder
a definição dessas assinaturas.

O `Contract` da Spec é a fonte de verdade para o Builder. Cada requisito,
restrição e critério de aceitação deve ser implementável e verificável sem que o
Builder precise inferir comportamento ausente. O `evaluation.md` registra o resultado
real da evidência de cada `CA-*`, mas não substitui o requisito do Contract.

## Mapa canônico de paths afetados

O `Technical Contract` deve conter um mapa de paths afetados, agrupado por
aplicação e camada. Use uma tabela por combinação de aplicação/camada afetada,
seguindo sempre esta ordem nas duas primeiras colunas:

```md
| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `packages/core/src/...` | Modify | `<símbolo exato>` | `<garantia de runtime>` | `<colaboradores>` | `<fronteira de teste>` |
```

As colunas depois de `Change` podem variar conforme a camada, mas `Path` deve
ser o primeiro campo e `Change` o segundo. Cada path afetado aparece exatamente
uma vez em todo o `Technical Contract` e usa somente `Create`, `Modify`,
`Generate` ou `Remove`. Use `Create` para arquivo novo, nunca `novo arquivo` na
coluna de estado. Escreva o valor de `Change` sem crases (`Modify`, não
`` `Modify` ``): `check:spec-implementation` só reconhece o texto puro e, com
crases, recusa a Spec por não encontrar linhas de paths. Para `Generate`, declare fonte, comando/entrada e saída; não
contrate edição manual de artefato gerado.

Os paths devem ser relativos à raiz do repositório, exatos, normalizados e
verificados no filesystem. Dependências inalteradas são evidência ou
consumidores, não linhas do mapa. O checker
`pnpm run check:spec-implementation <spec>` valida esse mapa contra o diff
Git e falha em duplicidade, classificação inconsistente, path ausente ou
mudança não entregue. Specs legadas com inventário em prosa ou no formato
`Camada | Path e estado` devem ser normalizadas antes de serem implementadas;
o checker não interpreta formatos ambíguos.

## Expected file tree

Todo `Technical Contract` inclui a subseção `## Expected file tree`, nos modos compacto e
completo: uma árvore em bloco `text` **por app/pacote afetado** (`apps/server`, `apps/web`,
`apps/backoffice`, `packages/core` etc.). Uma árvore apenas no chat, ou só o mapa de paths em
tabela, não a substitui. O mapa canônico continua sendo a fonte verificada por
`check:spec-implementation`; a árvore mostra a estrutura e o ownership, e deve conter
exatamente os mesmos paths do mapa.

- Escopo: arquivos criados, modificados, gerados ou removidos e os diretórios que os contêm.
  Use paths relativos à raiz do repositório e alinhe as colunas de marcadores.
- Marcadores: `[N]` (`Create`), `[M]` (`Modify`), `[G]` (`Generate`), `[D]` (`Remove`) e
  `(unchanged)` apenas para um vizinho que esclareça ownership ou composição. Não liste
  helpers privados inalterados nem catálogos exaustivos.
- Camadas Core/Server: entidades, structures, use-cases, ports, controllers, routers, jobs,
  repositórios, mappers, migrations (nunca invente nomes de migration) e os testes permitidos
  em `tests/` colocalizados, além do `.rest` do grupo de rotas em
  `apps/server/rest-client/`.
- UI: a hierarquia real de ownership: page/layout, componentes reutilizados, widgets filhos
  aninhados sob o dono, cada `index.tsx` (Entry Point), `*View.tsx`, o hook `use-*.ts`
  colocalizado e os `tests/` permitidos. Não pare em uma page ou componente de topo quando a
  composição aprovada tem filhos. Componentes reutilizados por mais de um dono ficam na
  fronteira de módulo apropriada. Explique o estado compartilhado e as responsabilidades locais
  de interação sem duplicar estado. Não fabrique hooks ou testes para filhos puramente
  estruturais (View sem comportamento).
- Contexts e hooks de domínio: inclua os contexts afetados com nomes de arquivo concretos
  (entrada do provider, tipo do value, hook do provider, hook consumidor e o teste permitido do
  hook do provider) e os hooks de query/action de domínio, sem um diretório genérico de hooks.
  Explique onde o context é montado, quais ramos compartilham seu estado e a direção entre
  provider, hooks de operação e hooks de widget; evite ciclos e estado duplicado. Hooks de
  query/action não têm arquivos de teste dedicados: aponte o consumidor ou a rota que os cobre
  na `Verification Contract`.
- IA: com composição de IA afetada, mostre agent, structured output, workflow, port do Core,
  adapter de modelo/provider e composição que pertencem ao slice, com os testes permitidos,
  separando as capacidades incluídas das adiadas.
- Reconcilie a árvore com os nomes e a composição aprovados, as declarações, o mapa de paths,
  o Design Contract e os paths da `Verification Contract` antes de apresentar a Spec. Helpers
  privados e a decomposição ordinária permanecem escolhas de implementação: mudá-los, sozinho,
  não exige amendment.

```text
apps/server/
├── rest-client/<módulo>/<grupo>.rest                                  [M]
├── src/<camada>/<módulo>/
│   ├── use-cases/get-example-use-case.ts                              [N]
│   └── tests/get-example-use-case.test.ts                             [N]
apps/web/
└── src/ui/<módulo>/widgets/pages/Example/
    ├── index.tsx                                                      [M]
    ├── ExamplePageView.tsx                                            [M]
    ├── useExamplePage.ts                                              [M]
    └── ExampleList/
        ├── index.tsx                                                  [N]
        └── ExampleListView.tsx                                        [N]
```

## Detalhamento técnico por camada afetada

Inclua apenas camadas realmente afetadas. Para cada linha do mapa canônico,
informe responsabilidade, dependências, assinatura/shape, referência similar e
evidência de teste. Não escreva implementação.

- Core/handlers/services/repositories/providers/jobs: dependências injetadas,
  métodos, request/response, erros e efeitos.
- Validation/routes: schemas, campos derivados no servidor, middlewares,
  autorização e códigos de resposta.
- Database: migration, backfill, constraints, índices, RLS/grants, mappers e
  tipos gerados.
- UI: Entry Point, View, Hook, props, dependências, widgets filhos e estados
  loading/error/empty/content, além de responsividade e acessibilidade.
- Queue/integrações: evento, idempotência, retry, observabilidade, composição na
  borda e separação entre persistência e efeito externo.

## Runtime Flow

Todo `Technical Contract` termina com a subseção `## Runtime Flow`. Explique as interações de
runtime afetadas: pontos de entrada reais, contexto confiável do ator (sessão, não o payload do
client), validação, decisões de domínio, transações, persistência, efeitos colaterais,
resultado visível e cache, e as garantias relevantes de rejeição, concorrência, retry e
recuperação. Em fluxo cross-app complexo, declare quem expõe, quem consome, o transporte e o
formato do contrato. Use o diagrama abaixo somente quando ele reduzir ambiguidade material.

### Diagrama técnico opcional

Inclua um diagrama Mermaid somente quando ele reduzir ambiguidade material em
uma solução que envolva pelo menos uma destas condições:

- três ou mais camadas, aplicações ou sistemas participantes;
- processamento assíncrono, queue, outbox, retry ou efeito externo;
- transação seguida de publicação ou integração não transacional;
- múltiplos atores, caminhos de autorização ou regras de ownership;
- estados, transições ou concorrência difíceis de compreender linearmente.

Escolha o menor tipo de diagrama adequado:

- `sequenceDiagram` para sequência entre apps, API, banco, queue e providers;
- `flowchart` para decisões, bifurcações e processamento;
- `stateDiagram-v2` para ciclo de vida e transições de estado;
- `erDiagram` para relacionamentos persistentes relevantes ao Contract.

Não inclua Mermaid em fluxo simples apenas para preencher o template. O diagrama
complementa o texto e não substitui Contract, métodos, paths, critérios de
aceitação, decisões técnicas ou comportamento de erro. Use nomes coerentes com
os contratos da Spec e mantenha a sintaxe renderizável em Markdown.

Explique por padrão, dentro do Technical Contract, cada conceito novo e consequente do
projeto: um nome na árvore de arquivos ou uma declaração, sozinhos, não bastam. Para cada
um, declare propósito, módulo/camada dono, entradas e saídas, relações com conceitos
existentes, fonte de verdade e ownership de estado, e as garantias aplicáveis de ciclo de
vida, falha/recuperação e autorização, ligando a explicação às declarações, ao fluxo de
runtime e aos sensores sem duplicar esses contratos. Para novos hooks, contexts e componentes
realtime, documente contratos de entrada/retorno, consumidor e direção de dependência,
ownership de conexão/assinatura, validação e ordenação de eventos, reconciliação/reconexão e
limpeza de callbacks obsoletos; distinga estado de transporte de estado de domínio. Defina
termos pouco familiares e use um exemplo concreto pequeno quando ajudar. Essas explicações
esclarecem o design aprovado; não autorizam novo comportamento de produto nem integrações.
Helpers privados ordinários e conceitos inalterados dispensam inventário.

## Verification Contract

O `Verification Contract` (nome de Specs legadas: `Validation Contract`) usa três categorias,
cada uma como subseção `##` com blocos `###` individualmente nomeados, em vez de tabelas longas
de comandos e procedimentos. Cada `CA-*` mapeia para prova concreta suficiente; não precisa usar
as três categorias. Dê a cada resultado observável distinto um bloco próprio (prova
complementar de use-case/controller/widget/job pode sustentar o mesmo resultado). Explique por
que uma categoria é inaplicável em vez de manter blocos vazios.

| Categoria | Prefixo | Conteúdo |
| --- | --- | --- |
| `## Automated` | `AV-*` | testes e gates automatizados: unit/component, integração, estáticos e baseline |
| `## Manual` | `MV-*` | jornada happy-path concisa, executável pelo agente, em navegador ou terminal reais |
| `## Visual` | `VV-*` | comparação de um board do Penpot com a captura Playwright correspondente |

Os IDs `AV`, `MV` e `VV` são únicos entre as três categorias e entre si. Os resultados reais
pertencem ao Evaluation (`EV-*`); O CI do PR não é registrado no Evaluation. Mantenha IDs e
mapeamentos existentes na continuação; divida um grupo antigo apenas com mapeamento explícito e
prova nova onde o resultado histórico não bastar. Bloco no formato abaixo:

```md
## Shared setup

<ambiente/URLs e saúde; atores e resolução de credenciais; dados e estado inicial; isolamento, reruns e cleanup; paths de fonte das fixtures>

## Automated

### AV-01 — <resultado observável>

**Critérios:** CA-01
**Alvo / fronteira:** <arquivo de teste exato e fronteira (use-case, controller, widget, job)>
**Comando:** <comando real, diretório de trabalho e seletor verificado>
**Condição de aprovação:** <asserções, seleção pretendida e limites da evidência>

### AV-02 — Verificações de baseline aplicáveis

**Escopo:** <apps/pacotes afetados e consumidores>
**Verificações:** <sensores exigidos por Tooling e Rules; exceções da feature>
**Condição de aprovação:** <gates exigidos passam, disposições estáticas têm prova real e os testes pretendidos executam>

## Manual

### MV-01 — <happy path conciso e executável pelo agente>

**Critérios:** CA-01
**Ferramenta / setup:** <Playwright ou terminal; setup compartilhado e diferenças>
**Procedimento:** <ações ordenadas e estreitas contra a fronteira de runtime pretendida>
**Condição de aprovação:** <URL final, efeitos visíveis/persistidos, requests `2xx`, console, teclado/foco, viewport estreito e cleanup, conforme aplicável>

## Visual

### VV-01 — <superfície, estado e viewport>

**Critérios:** CA-01
**Referência / setup:** <página, board e componentes do Penpot `stardust`; viewport exato; MV relacionado>
**Captura / comparação:** <export atual do Penpot MCP comparado com a captura Playwright correspondente; reutilize a captura de um MV atual quando possível>
**Condição de aprovação:** <propriedades visuais comparadas e desvios aceitos>
```

Regras de conteúdo:

- Separe os gates de baseline e referencie os checks de Tooling e Rules aplicáveis, inclusive os
  consumidores afetados. Defina obrigações/disposições separadas de tipos (`check:types`),
  lint/código (`check:code`) e complexidade, com caminhos exatos para lint e projetos
  configurados afetados para tipos. Complexidade identifica seu checker e limites reais; uma
  métrica quantitativa exigida e indisponível fica `Blocked`. Marque arquivos/cenários
  inexistentes como planejados e verifique nomes de testes antes de prescrever filtros.
- Declare os sensores aplicáveis: `format`, `check:code`, `check:types`, `test:unit`,
  `check:architecture` e `test:integration`, com os arquivos de teste exatos verificados no
  código (a execução local é escopada; ver `documentation/tooling.md`). `test:coverage` e
  `check:coverage` rodam no CI e só entram na Spec quando o impacto demonstrado abranger o
  workspace; ambos respeitam `coverage-baseline.json`. `check:dead-code` não é oficial. Checks
  e build também são executados pelo CI do PR.
- Registre o setup executável de checks relacionados uma única vez na subseção
  `## Shared setup` (antes de `## Automated`); cada bloco AV/MV/VV referencia o setup e cita só as
  diferenças. Inspecione contas, fixtures,
  seeders, manifests e configuração definidos na fonte antes de prescrever: ambiente/URLs e
  saúde, registro de rotas/funções, serviços reais/mockados/descartáveis; atores, permissões e
  resolução de credenciais privadas a partir de paths exatos (`seed-accounts.json`,
  `export-*-app-e2e-env.mjs --seed`); relações/status de dados necessários, asserções de
  estado inicial e correções planejadas de fixture; isolamento, dependências de rerun e cleanup
  de recursos próprios. Redigir o setup não exige rodar testes nem autoriza resetar/reseedar
  dados compartilhados. Distinga corrigir a fonte da fixture de aplicá-la. Setup executável
  ausente é uma lacuna do Contract.
- Automated cobre autorização, isolamento, persistência, combinações finitas contratadas,
  limites, falha/recuperação e concorrência nas fronteiras permitidas. Para domínios ilimitados,
  especifique classes de equivalência e valores de fronteira. Respeite as Rules de
  test-integrity: teste direto de fonte excluída/indireta ou diretório proibido é defeito
  bloqueante do Contract. Confirme que os testes pretendidos executam; skip e seleção vazia não
  são aprovação. Nunca invente percentuais de cobertura nem um comando agregado genérico.
- Use feedback focado de unit/component e estático durante a construção. Depois da integração,
  rode as seleções de integração afetadas (mudanças, consumidores e dependências) com um runner
  da task principal. Selecione testes apenas para mudanças do escopo e consumidores diretamente
  afetados; amplie somente diante de impacto demonstrado ou lacuna concreta, registrando por
  quê. Uma suite local completa exige escopo que a abranja ou pedido explícito do usuário.
  Revisão e conclusão reutilizam a prova atual não afetada.
- Manual são happy paths concisos; testes automatizados detêm as matrizes sistemáticas
  negativas, de falha/recuperação e de concorrência. Mocks não provam jornadas reais exigidas
  de autenticação e persistência. Siga `AGENTS.md` (verificação manual do Frontend).
- Visual nomeia página, board e componentes relacionados, estado, viewport, propriedades
  comparadas e desvios aceitos. Capture durante os MV vinculados quando possível e inspecione as
  imagens: salvar um screenshot não é uma aprovação visual. Mantenha a evidência de runtime em
  `test-results/` ignorado ou artifacts de CI; registre paths e resultados no Evaluation, sem
  novas pastas de evidência na feature.

Specs legadas com tabelas `VM-*`/`CI-*` e subseções "Testes automatizados", "Comandos" e
"Validações manuais" permanecem válidas como histórico; normalize para este formato na próxima
revisão material.

## Decisões técnicas e clarificação

Registre cada decisão material com evidência, alternativas consideradas, motivo,
trade-offs e impacto no Contract. Não trate ausência de evidência como liberdade
de implementação.

Antes de `open`, leve ao usuário decisões de produto ou arquitetura cujo impacto
material não possa ser resolvido pelas fontes e Rules. Incorpore a resposta como
decisão da Spec. Só permaneça em questões pendentes o que o usuário deixar
explicitamente aberto; uma pendência material impede `open`.

A Spec não contém código de teste, fixtures detalhadas ou implementação de mocks,
mas deve declarar cenários, camada de cobertura, sensores e evidência esperada
para cada `CA-*`.

Antes de `open`, faça uma checagem de integridade manual: o frontmatter e as cinco seções
de primeiro nível estão completos; a `## Expected file tree` existe por app/pacote afetado e
coincide com o mapa canônico de paths; não restam placeholders (`TBD`, `TODO`, `FIXME`); todo
`RF-*` relevante possui `CA-*` e todo `CA-*` aponta para um `RF-*` existente; cada `CA-*` é
coberto por pelo menos uma verificação `AV-*`, `MV-*` ou `VV-*` (IDs únicos, cada bloco sob a
categoria correta e com **Critérios** e **Condição de aprovação**); cada `CA-*` possui resultado
observável, método de verificação,
viewport/estado quando aplicável e path ou camada responsável; cada exigência
visual possui evidência separada para Penpot e Playwright quando ambas forem
necessárias; cada mudança UI declara a estrutura Entry Point/View/Hook; e todos
os sensores aplicáveis estão nomeados. Se uma exigência só aparecer na
Evaluation, mova-a para o Contract antes da revisão.

Para UI, o Contract deve conter uma matriz de referências visuais e uma matriz
de auditoria estrutural. A primeira relaciona frame, viewport, estado, rota,
evidência Penpot/Web, dimensões/anchors relevantes e divergências aprovadas. A
segunda relaciona cada widget alterado a
`index.tsx`, `*View.tsx`, Hook e regra aplicável. A ausência de qualquer uma
dessas matrizes impede o estado `open` quando frontend estiver no escopo.

Após a checagem de integridade, e antes de `implement-spec`, ative exatamente um
`spec-reviewer-agent` read-only com a revisão exata, `architecture.md` e o Rule Pack das camadas
afetadas. O Reviewer verifica somente compatibilidade de fronteiras, dependências, ownership e
Rules; não avalia produto, Design, critérios ou validação. O relatório não é veredito oficial:
verifique cada finding diretamente, corrija a mesma Spec e retome o mesmo Reviewer até não restar
finding arquitetural ou de Rule bloqueante. Qualquer amendment posterior invalida o resultado e
exige nova revisão antes de implementar. Registre na revision history a revisão avaliada, o resultado
`clear` e a resolução concisa dos findings verificados; não cole o relatório bruto na Spec.

Faça uma autorrevisão da Spec escrita: placeholders, contradições internas, requisitos
ambíguos e escopo que exija decomposição; corrija antes de apresentá-la. Verifique que os
conceitos novos e seus contratos consequentes de ciclo de vida estão explicados, e não só
listados na árvore ou nas declarações. Antes de apresentar, confirme: metadados de
autoridade/versão; escopo e rastreabilidade; critérios observáveis; declarações resultantes,
impacto em consumidores/wiring e garantias de runtime; a árvore de arquivos esperada e sua
concordância com a composição de widgets aprovada e os paths dos sensores; referências de
design disponíveis; fronteiras de teste permitidas; comandos reais dos sensores; links de
documentação; viabilidade de setup/fixture reproduzível e cleanup seguro; e resolução dos
findings de compatibilidade verificados. Dependências explícitas de implementação bloqueiam
o trabalho afetado, não a abertura, salvo se deixarem o Contract materialmente ambíguo;
reporte bloqueios concretos em vez de um gate bem-sucedido.

Depois que a revisão independente não tiver findings bloqueantes, entregue ao usuário o
caminho e a revisão da Spec e peça que revise o Contract escrito. Aguarde a aprovação
explícita antes de alterar para `open` ou entregar a `implement-spec`. Se o usuário pedir
mudanças, emende a Spec, repita a autorrevisão e a revisão independente afetadas e apresente
o Contract revisado novamente.

Somente então altere para `open`. Reporte o caminho/revisão/status da Spec, o resultado
delimitado, a fonte/versão canônica, as decisões consequentes, a cobertura de sensores e o
resultado da revisão. O próximo passo é `implement-spec`; a task principal decide a mecânica
de execução.

## Amendments e continuação

Para uma mudança material de Contract, devolva a mesma Spec a `draft`, incremente a revisão,
releia a autoridade afetada, resolva as decisões materiais e atualize o Contract e o
mapeamento de sensores. Preserve a evidência histórica do Evaluation e marque como `stale`
somente os resultados afetados. Repita os checks de integridade e de compatibilidade
afetados antes de voltar a `open`. Reorganização estrutural, mudança de status, reruns,
publicação e conclusão não incrementam a revisão. Uma mudança distinta após a conclusão pode
receber uma Spec nova (`changes/<mudança>/`).

O Evaluation preserva a continuidade: status de aceite, revisão atual do código e escopo não
commitado, resultados válidos de sensores, falhas/bloqueios e o trabalho imediato inacabado.
Um agente que continue lê a Spec, o Evaluation e o diff real, confirma o registro e escolhe
como prosseguir. Não reconstrua um ledger de fases nem um plano de execução em nenhum dos
artefatos.

---
name: create-spec
description: Criar e julgar uma Spec de feature, compacta ou completa, a partir de PRD, Issue, Report ou demanda direta.
---

# Criar Spec

O Orchestrator conduz a autoria na task atual. Não crie nova thread. Use Spec
somente para uma entrega relacionada a uma feature. Para manutenção transversal
sem Contract de feature, use fluxo direto.

## Classificação

Identifique a origem: `prd`, `issue`, `report` ou `direct-request`. Defina
`scope` com workspaces, diretórios ou arquivos. Use modo compacto para uma
mudança pequena e coesa; use modo completo quando houver múltiplos fluxos,
risco, integrações ou fases.

## Fontes

`source` é uma lista e pode conter múltiplas referências associadas à mesma
Spec. É permitido associar Issue e PRD simultaneamente, além de Report ou
demanda direta quando aplicável. Detecte todas as fontes informadas ou
associadas, busque e leia cada uma delas. Se um PRD estiver associado à Issue,
sua leitura é obrigatória; a ausência de PRD não bloqueia uma Spec originada
de Issue. Em caso de conflito, registre a divergência e resolva a ambiguidade
antes de abrir a Spec.

Leia todas as fontes da demanda, `documentation/architecture.md`, Rules aplicáveis,
`documentation/sdd.md`, `documentation/rules/sdd-rules.md` e os paths reais da
codebase. Use Serena, Context7, Pencil, Playwright ou Supabase quando
aplicáveis.

Resolva ambiguidades materiais antes da solução técnica. Registre premissas e
questões pendentes; antes de `open`, questões pendentes devem estar resolvidas
e premissas críticas confirmadas ou explicitamente aceitas com risco.

## Princípios de evidência e fronteiras

- Todo path citado deve existir ou estar marcado como `novo arquivo`.
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

| Seção | Conteúdo |
|---|---|
| Mapeamento | paths reais, contratos, dependências e implementações similares |
| Fluxo de dados | estado atual, produtores, consumidores, transporte e mudança necessária |
| Atenção | riscos, autorização, concorrência, segurança, performance e acoplamentos |
| Lacunas | elementos esperados não encontrados e decisões sem evidência suficiente |

Em fluxos multi-app, declare quem expõe, quem consome, o transporte e o formato
do contrato. Use ferramentas de codebase para evidência local, documentação
oficial para APIs externas, Pencil para design, Playwright para comportamento de
browser e Supabase para schema/dados quando aplicável. Architecture e Rules do
projeto prevalecem sobre recomendações genéricas de ferramentas externas.

## Referências de design e Pencil

Quando o escopo envolver frontend ou UI, crie na Spec uma seção de referências
de design e declare:

- a fonte visual canônica e o path do arquivo `.pen`;
- o Node ID e o nome de cada frame ou componente relevante;
- o estado, variante e viewport representados, como loading, error, empty,
  content, aberto/fechado, desktop ou mobile;
- o mapeamento entre cada referência visual e os respectivos `RF-*`/`CA-*`;
- divergências entre design, requisitos, Architecture, Rules e comportamento
  atual, indicando a precedência adotada e o alinhamento esperado.

### Regra Pencil-to-code

Os nodes declarados são a fonte visual canônica para o código. A Spec deve
tratar como parte do Contract a preservação da composição, hierarquia,
dimensões, espaçamento, tipografia, cores, bordas, elevação, ícones/assets,
densidade, variantes e estados observáveis de cada node. HTML semântico,
acessibilidade, interação, dados e reflow responsivo podem adaptar a
implementação, mas não autorizam substituir, simplificar ou reinterpretar o
design.

Toda divergência precisa ser vinculada ao node e ao `CA-*`, ter motivo
verificável e ser aprovada como decisão ou amendment antes de `open`. Node
ausente, contradito ou adicionado sem aprovação é bloqueante. Não aceite CSS
genérico como aproximação, nem invente arquivo, Node ID ou detalhe visual quando
não existir uma fonte canônica; registre a ausência explicitamente.

Inspecione as referências com Pencil; não deduza detalhes visuais somente de
screenshots ou descrições. Se a solução exigir alteração no design, inclua o
arquivo `.pen` no escopo e especifique os nodes afetados. Se não existir fonte
visual canônica, registre isso explicitamente e não invente arquivo ou Node ID.
Uma divergência material deve ser resolvida antes de a Spec chegar a `open`.

A validação de frontend deve exigir tanto a comparação dos nodes finais no
Pencil quanto o exercício do fluxo real no Playwright, cobrindo os estados e
viewports especificados. Pencil valida a referência visual; Playwright valida o
comportamento em runtime. Nenhum deles substitui os testes automatizados.

Quando a validação visual em runtime for obrigatória, escreva isso
explicitamente no Contract em um ou mais `CA-*`: declare os viewports, estados,
interações, rota e a evidência exigida (por exemplo, screenshot do dialog
aberto, loading, erro, vazio, conteúdo e fechado, ou comparação visual
equivalente). Para cada node Pencil, declare também a dimensão de referência,
o estado, a variante e a comparação esperada com a Web.
Não use apenas expressões ambíguas como “verificar visualmente”. Diferencie
sempre a evidência da referência Pencil da evidência do browser real: a primeira
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
    ref: <url>
scope:
  - <workspace|diretório|arquivo>
last_updated_at: YYYY-MM-DD
---
```

O corpo deve conter contexto, escopo, Contract, estado atual, solução técnica,
plano de validação, avaliações previstas, alinhamento documental e amendments.
Não crie um `evaluation.md` vazio nesta etapa; ele será criado após a
implementação ou o primeiro julgamento relevante e deverá existir antes do PR.

Use somente `RF-*` e `CA-*` como IDs obrigatórios:

```md
| CA | RF | Dado | Quando | Então | Evidência esperada |
|---|---|---|---|---|---|
| CA-01 | RF-01 | pré-condição | ação | resultado | teste/browser/sensor |
```

Segurança, performance e arquitetura entram como critérios de aceitação ou
restrições técnicas. Não use `RN-*`, `RNF-*`, `RA-*`, comentários
`harness:evidence`, gates próprios ou baselines.

Especifique os métodos de toda interface, port, repository ou service criado ou
alterado pela solução, incluindo nome, entrada e retorno. Não delegue ao Builder
ou ao Plan a definição dessas assinaturas.

O `Contract` da Spec é a fonte de verdade para o Builder. Cada requisito,
restrição e critério de aceitação deve ser implementável e verificável sem que o
Builder precise inferir comportamento ausente. O Plan apenas decompõe o
Contract em fases, tarefas, dependências e sensores; não pode criar, remover ou
enfraquecer requisitos. Para cada `CA-*`, o Plan deve apontar a tarefa
responsável e a evidência correspondente. O `evaluation.md` registra o resultado
real dessa evidência, mas não substitui o requisito do Contract.

## Detalhamento técnico por camada afetada

Inclua apenas camadas realmente afetadas. Para cada criação, modificação ou
remoção, informe path, estado (`existente` ou `novo arquivo`), responsabilidade,
dependências, assinatura/shape e referência similar. Não escreva implementação.

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

Para fluxo cross-app complexo, inclua uma tabela ou diagrama somente quando ele
materialmente esclarecer produtor, consumidor, sequência ou ownership.

## Diagrama técnico opcional

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

Declare sensores aplicáveis: `format`, `check:code`, `check:types`, `test:unit`,
`check:architecture` e `test:integration`. `check:dead-code` não é oficial.
Checks e build são validações finais do CI.

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

Antes de `open`, faça uma checagem de rastreabilidade: todo `RF-*` relevante
possui `CA-*`; cada `CA-*` possui resultado observável, método de validação,
viewport/estado quando aplicável e path ou camada responsável; cada exigência
visual possui evidência separada para Pencil e Playwright quando ambas forem
necessárias; cada mudança UI declara a estrutura Entry Point/View/Hook; e todos
os sensores aplicáveis estão nomeados. Se uma exigência só aparecer no Plan ou
no evaluation, mova-a para o Contract antes do julgamento.

Para UI, o Contract deve conter uma matriz de referências visuais e uma matriz
de auditoria estrutural. A primeira relaciona node, viewport, estado, rota,
evidência Pencil/Web, dimensões/anchors relevantes e divergências aprovadas. A
segunda relaciona cada widget alterado a
`index.tsx`, `*View.tsx`, Hook e regra aplicável. A ausência de qualquer uma
dessas matrizes impede o estado `open` quando frontend estiver no escopo.

## Judge Spec

Acione `judge-spec-agent` como subagente read-only `Judge Spec` na task atual.
Envie a origem, Spec, pesquisa, Architecture e Rules, sem narrativa persuasiva.

- `failed`: encaminhe findings ao Orchestrator, corrija e avalie novamente;
- `accepted`: altere a Spec para `status: open` e roteie para `implement-spec`
  ou `create-plan` conforme tamanho e risco.

Não crie nova thread para pesquisa ou julgamento.

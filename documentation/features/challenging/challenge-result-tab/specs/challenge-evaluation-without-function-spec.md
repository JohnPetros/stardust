---
title: Avaliação de desafios sem função pela saída do console
status: in_progress
revision: 2
source:
  type: issue
  ref: https://github.com/JohnPetros/stardust/issues/514
prd: https://github.com/JohnPetros/stardust/milestone/14
issue: https://github.com/JohnPetros/stardust/issues/514
scope:
  - packages/core/src/challenging/domain/entities/Challenge.ts
  - packages/core/src/challenging/use-cases/RunChallengeCodeUseCase.ts
  - packages/core/src/challenging/domain/entities/tests/Challenge.test.ts
  - packages/core/src/challenging/use-cases/tests/RunChallengeCodeUseCase.test.ts
  - packages/lsp/src/DeleguaProvedorLsp.ts
  - packages/lsp/src/tests
  - apps/web/src/ui/challenging/widgets/slots/ChallengeResult
  - apps/web/src/rpc/next-safe-action/cookieActions.ts
  - apps/web/src/rpc/next-safe-action/index.ts
  - apps/web/src/ui/global/hooks/useCookieActions.ts
last_updated_at: 2026-07-29
---

# Contexto e objetivo

Desafios sem função são avaliados pela saída observável de `escreva()`. No fluxo
atual, desafios legados cujo `isEvaluatedByFunction` está ausente ou desafios
com a flag inconsistente recebem `true` por compatibilidade e acabam consumindo
`LspResponse.result`. Para programas sem retorno de função, o interpretador pode
preencher esse campo com sua representação interna de valor vazio, como
`{"tipo":"vazio","tipoExplicito":false}`, embora a saída correta esteja em
`LspResponse.outputs[0]`.

O objetivo é adotar a mesma decisão de avaliação na execução local e na
execução persistida: usar retorno somente quando o desafio estiver configurado
para isso e seu código inicial realmente declarar uma função; nos demais casos,
usar a primeira saída de console normalizada pelo `LspProvider`. A aba
`Resultado` deve exibir o valor normalizado, sem revelar estruturas internas do
interpretador.

Ao continuar após a conclusão, o fluxo de recompensa também deve gravar o
payload e navegar para a página de recompensa na mesma operação de servidor.
Uma gravação de cookie separada seguida de navegação no cliente permite que o
App Router atualize a árvore no intervalo e causa recarregamento ou exige uma
segunda tentativa.

Esta é uma Spec completa porque o comportamento atravessa domínio, execução
persistida, LSP e apresentação web.

# Escopo

## Incluído

- Centralizar no domínio a decisão do modo efetivo de avaliação a partir de
  `isEvaluatedByFunction` e `initialCode.hasFunction`.
- Aplicar a decisão em `Challenge.runCode()` e
  `RunChallengeCodeUseCase.execute()`.
- Alinhar a preparação local do código ao código inicial do desafio, como já
  ocorre no fluxo persistido.
- Para avaliação por console, selecionar `response.outputs[0]`, usar string
  vazia quando não houver saída e normalizar o valor via `LspProvider` antes de
  comparar e armazenar.
- Preservar `response.result` para desafios efetivamente avaliados por função.
- Preservar todas as saídas brutas em `execution.outputs`, em ordem, para o
  console e o histórico; somente `testResults[].userOutput` representa o valor
  do caso de teste.
- Garantir que o DTO persistido e consumido pela web transporte um
  `userOutput` serializável e que `useTestCase()` traduza os valores antes de
  renderizá-los.
- Adicionar regressões automatizadas para os modos por função, por console e
  para dados legados/inconsistentes.
- Gravar o `rewardingPayload` e redirecionar para a rota de recompensa na mesma
  Server Action, sem depender de uma navegação posterior no cliente.

## Fora de escopo

- Alterar o contrato de `LspResponse`, o comportamento interno do interpretador
  ou a coleta de `outputs` por `DeleguaProvedorLsp.run()`.
- Alterar o default compatível de `isEvaluatedByFunction` no
  `ChallengeFactory`, no `SupabaseChallengeMapper`, em migrations ou no banco.
- Alterar criação/edição de desafios, schema de formulário ou metadados da
  função.
- Juntar múltiplas chamadas de `escreva()` em um único resultado; o resultado
  do caso permanece sendo `outputs[0]` e as demais linhas permanecem no
  console/histórico.
- Alterar visibilidade do console, navegação, expansão, bloqueio, ícones ou
  estilos da aba `Resultado`.
- Corrigir o `console.log` diagnóstico existente no LSP, por não ser necessário
  para o Contract desta entrega.

# Contract

## Requisitos funcionais

| RF | Requisito |
| --- | --- |
| RF-01 | O modo efetivo deve usar retorno de função somente quando `isEvaluatedByFunction` for verdadeiro e o código inicial declarar uma função reconhecida pelo `LspProvider`. |
| RF-02 | Quando o modo efetivo não for por função, a execução deve usar `response.outputs[0]` normalizado pelo `LspProvider` como resultado do usuário; na ausência de saída, deve usar string vazia. |
| RF-03 | Quando o modo efetivo for por função, a execução deve continuar usando `response.result`, sem substituí-lo por saída de console. |
| RF-04 | A execução local e a execução persistida devem produzir a mesma seleção, comparação e representação de `userOutput` para o mesmo desafio, código e resposta LSP. |
| RF-05 | A execução persistida deve manter `expectedOutput` inalterado, armazenar em `testResults[].userOutput` apenas o valor selecionado para comparação e preservar todas as saídas brutas em `outputs`. |
| RF-06 | A aba `Resultado` deve traduzir `userOutput` e `expectedOutput` pelo `LspProvider` e exibir o texto produzido por `escreva()` sem expor a representação interna de valor vazio. |
| RF-07 | Estados de correto/incorreto, bloqueio e expansão do caso de teste devem permanecer independentes do modo de avaliação. |
| RF-08 | Ao continuar de um desafio concluído que gera recompensa, o payload deve ser gravado e a navegação para a rota correspondente deve ocorrer na mesma Server Action. |
| RF-09 | O fluxo de recompensa não deve depender de `goTo` executado depois de um `await setCookie`; a primeira tentativa deve navegar corretamente e novas tentativas não devem exigir recarregamento manual. |

## Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| CA-01 | RF-01, RF-02, RF-04 | desafio sem função no código inicial e flag ausente, nula ou normalizada para o default legado `true` | o código usa `escreva()` e o LSP retorna simultaneamente um objeto interno em `result` e texto em `outputs[0]` | os fluxos local e persistido escolhem o texto normalizado de `outputs[0]`, calculam o resultado pelo texto e não armazenam o objeto interno | testes unitários de `Challenge` e `RunChallengeCodeUseCase` com a regressão da issue |
| CA-02 | RF-01, RF-02, RF-04 | desafio com `isEvaluatedByFunction = true`, mas sem função reconhecível no código inicial | um caso é executado | a flag inconsistente não força o uso de `response.result`; a saída de console é usada | testes unitários de domínio e use case |
| CA-03 | RF-01, RF-03, RF-04 | desafio com `isEvaluatedByFunction = true` e função reconhecível no código inicial | `response.result` difere de `outputs[0]` | ambos os fluxos usam `response.result` e preservam o comportamento dos desafios por função | testes unitários de domínio e use case |
| CA-04 | RF-01, RF-02, RF-04 | desafio com `isEvaluatedByFunction = false`, inclusive se o código inicial contiver função | `response.result` difere de `outputs[0]` | ambos os fluxos usam a primeira saída de console normalizada | testes unitários de domínio e use case |
| CA-05 | RF-02, RF-04 | desafio avaliado por console cuja execução não produz saída | o caso é avaliado | `userOutput` é string vazia, o caso é comparado sem lançar erro e o DTO permanece serializável | testes unitários de domínio e use case |
| CA-06 | RF-05 | execução por console com duas ou mais saídas | a execução é persistida | `testResults[].userOutput` contém somente a primeira saída normalizada e `execution.outputs` contém todas as saídas brutas, na ordem original | teste unitário de `RunChallengeCodeUseCase` e teste de serialização do DTO |
| CA-07 | RF-02, RF-06 | saída `Datahon: texto, 53.5: número, falso: lógico` e resultado esperado equivalente | a aba `Resultado` renderiza o caso | `Seu resultado` e `Resultado esperado` usam a representação Delégua equivalente, e o texto `tipoExplicito` não aparece | teste do `useTestCase`/View e validação real no navegador |
| CA-08 | RF-07 | casos bloqueado incorreto, bloqueado correto e desbloqueado | os resultados são renderizados nos dois modos de avaliação | bloqueio, indicador correto/incorreto e expansão mantêm o comportamento vigente | testes existentes e regressão do widget |
| CA-09 | RF-01, RF-04 | código inicial sem função e código submetido que introduz uma função alheia ao desafio | o caso é preparado e executado | a presença de função apenas no código submetido não muda o modo do desafio nem injeta chamada de função; a avaliação continua pela saída de console | testes unitários de domínio e use case |
| CA-10 | RF-08, RF-09 | desafio concluído com recompensa, inclusive `star challenge` | o usuário clica em `Continuar` pela primeira vez e repete o fluxo em novas conclusões | o payload é gravado e a página `star-challenge-rewarding` ou `challenge-rewarding` abre diretamente, sem recarregamento intermediário ou segunda tentativa | testes do `useChallengeResultSlot` e validação real no navegador |

## Restrições técnicas

- A decisão do modo efetivo é regra de domínio e deve ser exposta por
  `Challenge`; o use case apenas a consome.
- `packages/core` não pode importar a implementação de `packages/lsp`; deve
  depender de `Code`/`LspProvider`.
- A UI não deve decidir entre `result` e `outputs`; ela recebe o
  `userOutput` já selecionado e apenas o traduz para apresentação.
- A Server Action de recompensa deve restringir a rota de destino às rotas
  conhecidas em `ROUTES.rewarding` e executar `redirect` somente depois de
  concluir `setCookie`.
- O hook de cookie deve usar a forma de execução que preserva o sinal de
  navegação lançado pelo Next.js; o fluxo de recompensa não deve aguardar uma
  resposta client-side antes de navegar.
- Nenhuma migration ou leitura de Supabase é necessária. O default legado
  `true` permanece para não alterar desafios existentes que realmente possuem
  função.
- Não adicionar logs com código ou resultados do usuário.

## Premissas

- `Code.hasFunction` e `Code.firstFunctionName`, delegados ao `LspProvider`, são
  a fonte vigente para reconhecer função no código inicial.
- O primeiro item de `LspResponse.outputs` continua sendo o resultado aplicável
  de desafios por console, conforme a issue e o contrato já adotado no código.
- `LspProvider.translateToLsp()` é a representação canônica usada tanto na
  comparação quanto na apresentação. A normalização da string é idempotente no
  cenário reproduzido.
- Desafios por função podem emitir logs; esses logs permanecem em `outputs`, mas
  não substituem o retorno usado na avaliação.

## Questões pendentes

Sem questões pendentes. As ambiguidades foram resolvidas pela issue #514, pelo
milestone 14 e pela reprodução com o LSP real.

# Estado atual

## Domínio e execução local

- `Challenge.runCode()` escolhe `response.result` apenas pela flag
  `isEvaluatedByFunction`; com default legado `true`, um desafio sem função pode
  armazenar a estrutura interna de valor vazio.
- A preparação local usa `code.hasFunction`, isto é, o código submetido, para
  decidir entre chamada de função e injeção de inputs. O fluxo persistido usa
  `initialCode.hasFunction`, criando uma divergência.
- O caminho por console já seleciona `outputs[0]`, normaliza via `Code.format()`
  e preserva todas as saídas para o console.

## Execução persistida

- `RunChallengeCodeUseCase` prepara o código usando `initialCode.hasFunction`,
  mas chama `getUserOutput()` com o valor bruto da flag.
- O use case persiste o valor selecionado em `testResults[].userOutput` e todas
  as saídas brutas em `outputs`.
- A proteção contra função renomeada já é limitada a desafios configurados por
  função cujo código inicial contém função.

## LSP

- `DeleguaProvedorLsp.run()` coleta cada `escreva()` em `outputs` e deriva
  separadamente `result` do retorno final do interpretador.
- Na reprodução da issue, o LSP real retornou o texto esperado em `outputs[0]`
  e `{ tipo: 'vazio', tipoExplicito: false }` em `result`.
- A tradução da saída e do resultado esperado produziu a mesma representação
  Delégua: `"Datahon: texto, 53.5: número, falso: lógico"`.

## Web

- `useChallengeResultSlot()` usa `testResults[].userOutput` da execução remota
  ou `challenge.userOutputs` da execução local.
- `useTestCase()` já traduz inputs, `userOutput` e `expectedOutput` com o
  `LspProvider`, remove quebras de linha e preserva expansão/bloqueio.
- A correção principal é upstream. A camada web precisa de cobertura de
  regressão e só deve mudar se essa evidência revelar uma falha de apresentação.

## Navegação para recompensa

- O fluxo anterior aguardava `setCookie()` no cliente e chamava `goTo()` em
  seguida. A atualização do App Router entre essas operações podia recarregar
  a página e deixar o estado de conclusão desatualizado.
- A implementação registrada adiciona `setCookieAndRedirect` como Server
  Action. Ela grava `COOKIES.keys.rewardingPayload` e chama `redirect` na mesma
  execução.
- `useChallengeResultSlot()` agora usa essa operação para as rotas
  `ROUTES.rewarding.challenge` e `ROUTES.rewarding.starChallenge`; a navegação
  para a lista de desafios continua usando `goTo()` porque não depende de
  payload de recompensa.
- A decisão de continuar considera também uma resposta correta/verificada
  recém-obtida, cobrindo o intervalo em que `challenge.isCompleted` ainda não
  foi refletido no store.

# Solução técnica

## Decisão de avaliação no domínio

Adicionar em `Challenge` uma operação que responda se o retorno de função deve
ser usado para um `initialCode: Code`. O resultado deve equivaler a:

```text
isEvaluatedByFunction AND initialCode.hasFunction
```

`Challenge.runCode()` e `RunChallengeCodeUseCase` devem consumir essa mesma
operação. Isso mantém o default legado sem permitir que uma flag ausente ou
inconsistente prevaleça sobre a ausência real de função.

## Preparação e seleção na execução local

- `Challenge.formatCode()` deve decidir pela presença de função no código
  inicial, não por uma função introduzida ou removida no código submetido.
- Se houver função inicial, adicionar a chamada com nome e inputs do caso; caso
  contrário, validar/injetar entradas.
- Depois de `formattedCode.run()`, preservar todos os `response.outputs`.
- Se o modo efetivo for por função, selecionar `response.result`.
- Caso contrário, selecionar e normalizar `response.outputs[0]`; usar `''`
  quando ausente.
- Comparar pela tradução canônica e armazenar exatamente o valor selecionado em
  `challenge.userOutputs`.

## Seleção na execução persistida

- Calcular o modo efetivo uma vez a partir do desafio e do código inicial.
- Reutilizá-lo na validação de integridade da função e em `getUserOutput()`.
- Manter o mesmo algoritmo de normalização e fallback da execução local.
- Persistir `userOutput`, `expectedOutput`, status e `outputs` pelo contrato
  atual de `ChallengeCodeExecutionDto`, sem expandir o DTO.

## Apresentação

- Manter a seleção de fonte fora da UI.
- Manter `useTestCase()` como responsável apenas por traduzir valores já
  selecionados, limpar quebras de linha e controlar a expansão.
- Acrescentar regressão com o texto da issue para demonstrar que a saída
  observável chega à View e que campos da estrutura interna não são exibidos.

# Plano de validação

## Matriz de evidências

| CA | Evidência automatizada | Evidência complementar |
| --- | --- | --- |
| CA-01 | testes de `Challenge` e `RunChallengeCodeUseCase` com `result` interno e `outputs[0]` textual | reprodução local com `DeleguaProvedorLsp` |
| CA-02 | testes de flag `true` + código inicial sem função | nenhuma |
| CA-03 | testes existentes/ajustados de avaliação por função | nenhuma |
| CA-04 | testes existentes/ajustados de avaliação explícita por console | nenhuma |
| CA-05 | testes sem `outputs` | nenhuma |
| CA-06 | teste do DTO persistido com múltiplas saídas | inspeção da resposta do use case |
| CA-07 | teste de `useTestCase`/View com o texto da issue | Playwright no desafio `analise-do-ambiente` |
| CA-08 | testes do widget para bloqueio, resultado e expansão | inspeção no navegador |
| CA-09 | testes com função apenas no código submetido | nenhuma |
| CA-10 | testes do `useChallengeResultSlot` verificando a action com a rota de recompensa e ausência de `goTo` | Playwright no fluxo de conclusão repetido |

## Sensores aplicáveis

- `npm run check:code`
- `npm run check:types`
- `npm run test:unit`
- `npm run check:architecture`, pois o domínio passa a expor uma decisão
  consumida pelo use case e as fronteiras precisam permanecer válidas.
- `npm run test:integration`, pois o comportamento atravessa execução no
  server, transporte do DTO e apresentação web.
- Build no CI após o Quality Gate, conforme o fluxo SDD.

## Validação manual

No ambiente de desenvolvimento, abrir o desafio `analise-do-ambiente`, executar
uma solução com:

```delegua
escreva('Datahon: texto, 53.5: número, falso: lógico')
```

Confirmar na aba `Resultado` que o caso é correto, que `Seu resultado` equivale
ao resultado esperado e que `tipo`, `vazio` e `tipoExplicito` não aparecem.
Repetir autenticado, para o fluxo persistido, e anônimo, para o fluxo local.

Para o fluxo de recompensa, confirmar também que o primeiro clique em
`Continuar` abre diretamente a página correspondente, sem recarregar a página
de resultado. Concluir outro desafio e repetir o clique para verificar que a
navegação continua funcionando sem atualizar manualmente o navegador.

# Avaliações

## Judge Spec

- **Data:** 2026-07-29
- **Revisão avaliada:** 1
- **Veredito:** accepted
- **Findings bloqueantes:** nenhum.
- **Rastreabilidade:** `CA-01` a `CA-09` estão ligados a `RF-*` e possuem
  evidências executáveis.
- **Solução:** aceita por centralizar a decisão no domínio, preservar as
  fronteiras com LSP/UI e manter compatibilidade com o default legado.
- **Roteamento:** `implement-spec` direto, com Judge Implementation cobrindo
  todos os critérios e as evidências de integração/browser declaradas.

## Judge Implementation Direct

- **Data:** 2026-07-29
- **Revisão avaliada:** 1
- **Veredito:** accepted
- **Commit-base:** `b984c591ba5c696299c168d820dfdf66bc56f14e` + diff efetivo do Builder.
- **Critérios:** `CA-01` a `CA-09` passed.
- **Findings bloqueantes:** nenhum.
- **Observação:** alterações preexistentes em `package.json` e
  `scripts/sync-agents.sh` foram excluídas da avaliação do diff da implementação.

## Judge Implementation Final

- **Data:** 2026-07-29
- **Revisão avaliada:** 2
- **Veredito:** blocked
- **Commit avaliado:** `d5f6c2b14` + alterações não commitadas do worktree.
- **Escopo:** reavaliação independente do diff integrado após a inclusão de
  `CA-10`, do redirecionamento atômico de recompensa e dos sensores finais.
- **CA-01 a CA-09:** passed com evidência automatizada suficiente.
- **CA-10:** blocked; a action, a restrição de rota e o uso client-side estão
  implementados, mas não houve validação real de cookie + redirect na primeira
  tentativa e em conclusões subsequentes.
- **JI-01 (bloqueante):** executar Playwright em ambiente limpo para validar a
  navegação real de recompensa e os critérios de apresentação.
- **JI-02 (bloqueante):** isolar as alterações não relacionadas à Spec antes do
  commit/PR final; elas permanecem no worktree sem terem sido incluídas nos
  commits desta entrega.

# Evidências finais

### Implementação direta

- **Commit-base:** `b984c591ba5c696299c168d820dfdf66bc56f14e`
- **Arquivos de produção alterados:** `Challenge.ts` e
  `RunChallengeCodeUseCase.ts`.
- **Cobertura adicionada:** testes de domínio, use case, serialização do DTO e
  `useTestCase`.
- **Resultado:** a decisão efetiva combina a flag com `initialCode.hasFunction`;
  o modo por console usa a primeira saída normalizada ou `''`, o modo por
  função preserva `result`, e todas as saídas brutas continuam no histórico.

### Sensores executados

| Comando | Resultado | Observação |
| --- | --- | --- |
| `npm run format` | passou | Nenhuma alteração de formatação pendente. |
| `npm run check:code` | passou | Warnings preexistentes fora do escopo. |
| `npm run check:types -w @stardust/core` | passou | — |
| `npm run check:types -w @stardust/web` | passou | — |
| `npm run check:types` | falhou fora do escopo | Erros preexistentes de tipos em `apps/studio`; core e web passaram. |
| `npm run test:unit` | passou | Core 621, web 441, server 303, studio 128 e LSP 1 testes; 5 workspaces concluídos. |
| `npm run check:architecture` | passou | Nenhuma violação de dependência. |
| `npm run test:integration` | falhou por ambiente | O web não iniciou por `next dev` existente (PID 10942); o server sofreu timeout de fixture e depois OOM. |

Não foi executada validação manual no navegador nem Quality Gate/build de CI
nesta task. A cobertura de apresentação disponível é unitária; a integração
web não pôde iniciar por causa do servidor de desenvolvimento existente.

### Atualização da revisão 2

- **Correção registrada:** `setCookieAndRedirect` grava o payload de
  recompensa e executa `redirect` na mesma Server Action.
- **Fluxo atualizado:** `useChallengeResultSlot()` usa a rota
  `ROUTES.rewarding.starChallenge` para `star challenge` e
  `ROUTES.rewarding.challenge` para desafios regulares; `goTo()` permanece
  reservado para o retorno à lista de desafios.
- **Regressões cobertas:** o hook considera uma resposta correta/verificada
  mesmo quando `challenge.isCompleted` ainda está desatualizado e também
  permite o fluxo durante a hidratação do usuário.
- **Validação automatizada:** `useChallengeResultSlot.test.ts` passou com 15
  testes; `npm run test:unit` passou nos 5 pacotes executados.
- **Limitação:** a validação manual no navegador e o Quality Gate/build de CI
  ainda estão pendentes para confirmar o primeiro clique e a repetição do
  fluxo sem recarregamento.

### Veredito final da implementação

- **Estado:** bloqueado; a Spec permanece `in_progress`.
- **Motivos:** CA-10 não possui evidência integrada real; a suíte de integração
  local não concluiu por lock/dev server existente e OOM/timeout ambiental; o
  Quality Gate e o build do CI ainda não foram executados.
- **Escopo dos commits da feature:** `54879adcb`, `a5ad464a7`, `784246216` e
  `d5f6c2b14`. Alterações restantes do worktree são preexistentes ou não
  relacionadas e foram deliberadamente excluídas.

# Alinhamento documental

- `documentation/architecture.md`: nenhuma mudança prevista; a solução mantém a
  decisão no core e a UI como adaptador.
- `documentation/rules/core-package-rules.md`: a regra compartilhada fica na
  entidade e o use case apenas orquestra.
- `documentation/rules/lsp-layer-rules.md` e
  `documentation/rules/delegua-rules.md`: os contratos separados de retorno e
  saída observável são preservados.
- Milestone 14: o campo `Seu resultado` continua traduzido pelo LSP e passa a
  receber a fonte correta para desafios sem função.
- Não há atualização normativa necessária antes da implementação.

# Amendments

- **Revisão 2 — 2026-07-29:** incorporado o requisito de persistir o payload de
  recompensa e redirecionar na mesma Server Action, com os critérios `RF-08`,
  `RF-09` e `CA-10`. Registrada também a correção da condição de conclusão
  desatualizada e a cobertura automatizada correspondente. A validação manual
  no navegador permanece pendente.

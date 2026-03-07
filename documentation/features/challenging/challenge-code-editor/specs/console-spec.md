---
title: Console de output do editor de desafios
prd: ../prd.md
apps: web
status: concluido
last_updated_at: 2026-03-07
---

# 1. Objetivo

Implementar o console de output do `Challenge Code Editor` na aplicacao `web`, reaproveitando o widget global de console e estendendo o fluxo atual de execucao do desafio para expor as linhas produzidas por `escreva()`. A entrega deve manter a execucao unica do codigo, abrir o console automaticamente apenas quando houver output, permitir abertura manual via toolbar, preservar o redirecionamento para a aba de resultado e funcionar em desktop e mobile sem criar dependencia de server, database ou novos contratos REST/RPC.

---

# 2. Escopo

## 2.1 In-scope

- Exibir as linhas produzidas por `escreva()` em um console acoplado ao editor de desafio.
- Limpar o output no inicio de cada nova execucao.
- Abrir o console automaticamente ao fim de uma execucao bem-sucedida somente quando houver output.
- Permitir abertura e fechamento manual do console pelo usuario.
- Manter o fluxo atual de validacao do desafio, incluindo redirecionamento para `result` e tratamento de erro via toast/audio.
- Ajustar o runtime compartilhado para nao descartar `outputs` quando o programa nao retornar valor final.
- Garantir comportamento visivel em mobile mesmo quando a navegacao muda o slider para a aba de resultado.

## 2.2 Out-of-scope

- Exibir erros de sintaxe ou execucao dentro do console.
- Persistir historico de outputs entre execucoes, refreshes ou dispositivos.
- Alterar o contrato de rotas Next.js, REST, RPC ou server actions do modulo `challenging`.
- Alterar a logica de avaliacao dos casos de teste alem do necessario para retornar os outputs brutos da execucao.
- Criar atalho de teclado novo para o console.

---

# 3. Requisitos

## 3.1 Funcionais

- Ao executar o codigo do desafio, o sistema deve capturar todas as linhas emitidas por `escreva()` na ordem em que foram produzidas.
- O console deve ser limpo antes de cada nova execucao.
- O console deve abrir automaticamente apenas quando a execucao terminar com sucesso e houver pelo menos uma linha de output.
- Se a execucao terminar sem `escreva()`, o console nao deve abrir automaticamente.
- O usuario deve poder abrir e fechar o console manualmente a qualquer momento pelo editor.
- Erros de sintaxe, runtime e bloqueio de `Leia()` devem continuar sendo exibidos somente via toast, sem popular o console.
- O fluxo atual de redirecionamento para `ROUTES.challenging.challenges.challengeResult(challenge.slug.value)` deve ser preservado.

## 3.2 Não funcionais

- A acao `Executar` deve continuar disparando uma unica execucao do codigo por clique/atalho; o console nao pode introduzir uma segunda rodada de interpretacao.
- A implementacao nao deve adicionar novas chamadas HTTP, RPC ou acesso a server para montar o console.
- O comportamento deve reutilizar o widget global `Console` e o padrao Widget ja adotado em `apps/web/src/ui`.
- Em mobile, o painel deve continuar acessivel apos o redirecionamento para a aba `result`, sem depender de manter o slide do editor visivel.
- A captura de outputs deve respeitar o contrato existente de `LspResponse.outputs` em `packages/core/src/global/responses/LspResponse.ts`.

---

# 4. O que já existe?

## Next.js App

* **`Layout`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/layout.tsx`) - monta o layout persistente do desafio com `header`, `tabContent` e `codeEditor` via rotas paralelas.
* **`Page`** (`apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`) - busca `challengeDto` e injeta a pagina client do desafio.

## Camada UI (Widgets)

* **`ChallengeCodeEditorSlot`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/index.tsx`) - entry point atual do editor de desafio; ja concentra execucao, selecao de codigo e integracao com a toolbar.
* **`useChallengeCodeEditorSlot`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts`) - executa `challenge.runCode(...)`, persiste o codigo em `localStorage`, toca audio de erro e redireciona para a aba de resultado.
* **`ChallengeCodeEditorSlotView`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/ChallengeCodeEditorSlotView.tsx`) - monta `CodeEditorToolbar` + `CodeEditor` dentro de um container relativo com altura calculada.
* **`CodeEditorToolbar`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`) - wrapper atual das acoes do editor; ja recebe `onRunCode` e concentra os botoes de reset, guias, comandos, configuracoes e assistente.
* **`CodeEditorToolbarView`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx`) - layout visual da toolbar onde o gatilho manual do console deve aparecer.
* **`Console`** (`apps/web/src/ui/global/widgets/components/Console/index.tsx`) - widget global com `ref` imperativa (`open`/`close`) e painel arrastavel.
* **`ConsoleView`** (`apps/web/src/ui/global/widgets/components/Console/ConsoleView.tsx`) - renderiza o bottom sheet e a lista de outputs; hoje ja mostra estado vazio com `Sem saída`.
* **`AnimatedPanelView`** (`apps/web/src/ui/global/widgets/components/Console/AnimatedPanel/AnimatedPanelView.tsx`) - implementa o comportamento de drag vertical com `motion`.
* **`PlaygroundCodeEditor`** (`apps/web/src/ui/global/widgets/components/PlaygroundCodeEditor/index.tsx`) - referencia concreta de uso do `Console` apos execucao bem-sucedida.
* **`usePlaygroundCodeEditor`** (`apps/web/src/ui/global/widgets/components/PlaygroundCodeEditor/usePlaygroundCodeEditor.ts`) - referencia concreta para limpar output, abrir console somente no sucesso e manter erros fora do console.
* **`ChallengeLayoutView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeLayoutView.tsx`) - no desktop mantem abas e editor visiveis ao mesmo tempo; isso permite console sobreposto ao editor sem remover o painel de resultado.
* **`ChallengeSliderView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`) - no mobile mantem `ChallengeCodeEditorSlot` montado em um slide separado do slide de resultado.
* **`ChallengeResultSlotView`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeResult/ChallengeResultSlotView.tsx`) - exibe o resultado por caso de teste usando `challenge.userOutputs`, nao o console bruto.

## Camada UI (Stores)

* **`ChallengeStore`** (`apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`) - store atual do modulo `challenging`; hoje guarda `challenge`, `results`, `activeContent`, `tabHandler` e estado do assistente, mas nao guarda output do console.
* **`useZustandChallengeStore`** (`apps/web/src/ui/challenging/stores/zustand/useZustandChallengeStore.ts`) - implementacao atual do store com actions para `results`, `tabHandler` e selecoes do assistente.
* **`ChallengeStoreState`** (`apps/web/src/ui/challenging/stores/ChallengeStore/types/ChallengeStoreState.ts`) - contrato atual do estado; nao possui slice de console.
* **`INITIAL_CHALLENGE_STORE_STATE`** (`apps/web/src/ui/challenging/stores/ChallengeStore/constants/initial-challenge-store-state.ts`) - inicializa o estado do modulo sem output armazenado.

## Camada UI (Contexts)

* **`useEditorContextProvider`** (`apps/web/src/ui/global/contexts/EditorContext/useEditorContextProvider.ts`) - ja persiste configuracoes de editor, incluindo `isCodeCheckerEnabled`, sem depender do fluxo de desafio.

## Pacote Core

* **`Challenge`** (`packages/core/src/challenging/domain/entities/Challenge.ts`) - executa os casos de teste, limpa `results` e `userOutputs` a cada run e hoje consome `response.outputs[0]` apenas para a comparacao de resultado.
* **`Code`** (`packages/core/src/global/domain/structures/Code.ts`) - encapsula o codigo do usuario e delega a execucao para `LspProvider.run()`.
* **`LspResponse`** (`packages/core/src/global/responses/LspResponse.ts`) - contrato compartilhado que ja suporta `outputs: string[]`.
* **`ChallengeFactory`** (`packages/core/src/challenging/domain/factories/ChallengeFactory.ts`) - recria `results` e `userOutputs` sempre vazios, reforcando que o output do console deve continuar efemero na sessao de UI.

## Camada Provision (Providers)

* **`DeleguaLsp`** (`packages/lsp/src/DeleguaLsp.ts`) - adapter que interpreta o codigo Delegua, captura `outputs` em memoria e retorna `LspResponse`.

---

# 5. O que deve ser criado?

**Não aplicável**.

---

# 6. O que deve ser modificado?

## Camada UI

* **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts`
* **Mudanca:** Adicionar estado local `outputs: string[]`, limpar o estado no inicio de `handleRunCode()`, consumir o retorno de `challenge.runCode(userCode.current)` como `executionOutputs`, abrir `consoleRef.current?.open()` somente quando `executionOutputs.length > 0`, fechar/nao reabrir o console em erros e expor `handleOpenConsole(): void` para abertura manual.
* **Justificativa:** O hook ja e a fronteira de execucao do desafio e concentra o tratamento de erro, navegacao e persistencia do codigo; a captura do console deve acontecer ali para evitar uma segunda execucao.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/index.tsx`
* **Mudanca:** Passar `outputs`, `consoleRef`, `handleOpenConsole` e um flag de mobile para a view, mantendo a integracao com selecao de codigo e assistente.
* **Justificativa:** O entry point deve continuar sendo o unico ponto de composicao entre hook, toolbar, editor e console, seguindo o Widget Pattern.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/ChallengeCodeEditorSlotView.tsx`
* **Mudanca:** Renderizar o widget `Console` junto ao editor, passar `outputs`, `height` e o modo de renderizacao mobile, alem de encaminhar `onOpenConsole` para `CodeEditorToolbar`.
* **Justificativa:** A view ja possui o container relativo e a altura do editor, que sao os dados necessarios para posicionar o painel no desktop e manter a composicao do slot consistente.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`
* **Mudanca:** Aceitar a nova dependencia `onOpenConsole: () => void` e repassa-la para a view sem mover a logica atual de execucao/reset.
* **Justificativa:** A abertura manual do console deve acontecer pela toolbar, que e o ponto atual de acoes rapidas do editor.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx`
* **Mudanca:** Adicionar um novo `Toolbar.Button` para abrir o console manualmente, sempre disponivel ao lado das demais acoes do editor.
* **Justificativa:** O PRD exige acesso manual via botao; a toolbar e a localizacao mais consistente com os controles existentes de guias, comandos e configuracoes.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Console/index.tsx`
* **Mudanca:** Adicionar prop opcional `shouldRenderInPortal?: boolean` e, quando `true`, renderizar `ConsoleView` via `createPortal(document.body)` preservando a API imperativa `open(): void` e `close(): void`.
* **Justificativa:** Em mobile, o `ChallengeCodeEditorSlot` permanece montado dentro do `Swiper`, mas o slide de resultado fica ativo apos a execucao; usar portal impede que o console fique preso ao slide oculto e garante visibilidade apos o redirecionamento.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Console/ConsoleView.tsx`
* **Mudanca:** Suportar dois modos de posicionamento do painel (`absolute` inline e `fixed` via portal), manter o estado vazio com `Sem saída` e trocar a chave da lista para uma chave indexada que preserve linhas repetidas.
* **Justificativa:** O mesmo widget precisa atender desktop e mobile sem perder outputs duplicados, que sao validos para `escreva()`.
* **Camada:** `ui`

## Pacote Core

* **Arquivo:** `packages/core/src/challenging/domain/entities/Challenge.ts`
* **Mudanca:** Alterar a assinatura de `runCode` para `runCode(code: Code): Promise<List<string>>`, acumular `response.outputs` de cada `TestCase` em uma lista `executionOutputs` e retornar essa lista ao final, sem alterar a logica existente de `results` e `userOutputs`.
* **Justificativa:** O console precisa do output bruto da execucao real do desafio; retornar esse dado pela propria entidade evita duplicar a interpretacao do codigo na UI e preserva o fluxo de validacao centralizado.
* **Camada:** `core`

## Camada Provision

* **Arquivo:** `packages/lsp/src/DeleguaLsp.ts`
* **Mudanca:** Garantir que `run(code: string)` retorne `new LspResponse({ result: undefined, outputs })` quando o programa nao produzir valor final, mas tiver emitido `escreva()`.
* **Justificativa:** Hoje o adapter descarta os `outputs` quando `resultadoInterpretadorFiltrado.length === 0`; sem esse ajuste, programas baseados apenas em `escreva()` nao abastecem o console.
* **Camada:** `provision`

---

# 7. O que deve ser removido?

**Não aplicável**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao:** Reaproveitar o widget global `Console` em vez de criar um console exclusivo do modulo `challenging`.
* **Alternativas consideradas:** Criar um novo widget especifico para desafios; introduzir um drawer novo baseado em outra biblioteca.
* **Motivo da escolha:** Ja existe um componente reutilizavel com `open/close`, drag vertical e estado vazio, alem de uma referencia concreta no playground.
* **Impactos / trade-offs:** Reduz duplicacao e mantem consistencia visual, mas exige adaptar o componente compartilhado para o caso mobile via portal.

* **Decisao:** Manter `outputs` como estado local do `ChallengeCodeEditorSlot`.
* **Alternativas consideradas:** Criar slice global no `ChallengeStore`; persistir o output no `ChallengeDto`/`ChallengeFactory`.
* **Motivo da escolha:** O output do console e efemero, so e produzido durante a execucao do editor e nao precisa ser reidratado do servidor nem compartilhado com o restante do modulo.
* **Impactos / trade-offs:** A implementacao fica mais simples e evita acoplamento de store, mas o output continua restrito ao ciclo de vida do slot do editor.

* **Decisao:** Fazer `Challenge.runCode(...)` retornar `Promise<List<string>>` com o output bruto acumulado da mesma execucao usada para validar os casos de teste.
* **Alternativas consideradas:** Executar o codigo uma segunda vez apenas para o console; introduzir um campo novo na entidade/DTO para armazenar `consoleOutputs`.
* **Motivo da escolha:** Evita custo dobrado de runtime, elimina divergencia entre correcao e console e nao amplia o contrato de persistencia do desafio.
* **Impactos / trade-offs:** O metodo do dominio passa a expor um dado adicional de execucao, o que exige ajuste no unico caller atual da UI.

* **Decisao:** Usar `createPortal(document.body)` apenas para o console mobile.
* **Alternativas consideradas:** Renderizar o console inline tambem no mobile; mover o console para um layout global do desafio.
* **Motivo da escolha:** O slide do editor continua montado, mas fica fora da area visivel apos o redirecionamento para `result`; o portal preserva a visibilidade do bottom sheet sem reestruturar o layout inteiro do desafio.
* **Impactos / trade-offs:** Introduz uma bifurcacao controlada de renderizacao entre desktop e mobile, mas evita alterar `ChallengeLayout`, `ChallengeSlider` e `ChallengeStore` para sincronizar um overlay global.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```ascii
Usuario
  |
  v
CodeEditorToolbar (Executar / Abrir console)
  |
  v
useChallengeCodeEditorSlot
  |-- limpa outputs locais
  |-- challenge.runCode(userCode)
  |     |
  |     v
|   Challenge.runCode(code): Promise<List<string>>
  |     |-- limpa results/userOutputs
  |     |-- para cada TestCase:
  |     |     |-- Code.addInputs()/addFunctionCall()
  |     |     |-- Code.run()
  |     |     |     |
  |     |     |     v
  |     |     |   DeleguaLsp.run()
  |     |     |     |-- captura outputs de escreva()
  |     |     |     `-- retorna LspResponse(result, outputs)
  |     |     |-- acumula executionOutputs
  |     |     `-- atualiza results/userOutputs
  |     `-- retorna executionOutputs
  |
  |-- sucesso: setResults(...) + setOutputs(executionOutputs)
  |-- sucesso com output: consoleRef.open()
  |-- erro: toast/audio, sem abrir console
  `-- router.goTo(/challenge/result)

Console (desktop inline / mobile via portal)
  `-- exibe cada linha de outputs na ordem recebida
```

* **Fluxo Cross-app (se aplicável):** Não aplicável.

* **Layout (se aplicável):**

```ascii
Desktop
+---------------------------------------------------------------+
| ChallengeLayout                                               |
|  +-------------------------+ +------------------------------+ |
|  | Tabs / Resultado        | | ChallengeCodeEditorSlot      | |
|  |                         | |  +------------------------+  | |
|  |                         | |  | CodeEditorToolbar      |  | |
|  |                         | |  +------------------------+  | |
|  |                         | |  | CodeEditor             |  | |
|  |                         | |  |                        |  | |
|  |                         | |  +------------------------+  | |
|  |                         | |  | Console bottom sheet   |  | |
|  +-------------------------+ +------------------------------+ |
+---------------------------------------------------------------+

Mobile
+--------------------------------------------------+
| ChallengeSlider                                  |
|  [Descricao] [Codigo] [Resultado] [Assistente]   |
|  +--------------------------------------------+  |
|  | Swiper slide ativo                         |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
               |
               v
      Console bottom sheet via portal
      (visivel mesmo apos navegar para Resultado)
```

* **Referencias:**
  - `apps/web/src/ui/global/widgets/components/PlaygroundCodeEditor/usePlaygroundCodeEditor.ts`
  - `apps/web/src/ui/global/widgets/components/Console/index.tsx`
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts`
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`
  - `packages/core/src/challenging/domain/entities/Challenge.ts`
  - `packages/lsp/src/DeleguaLsp.ts`

---

# 10. Pendências / Dúvidas

**Sem pendências**.

---

# 11. Resultado da Implementação

- O `ChallengeCodeEditorSlot` passou a manter `outputs` em estado local, limpar o console antes de cada execução, abrir o painel automaticamente apenas quando há saída e expor abertura manual pela toolbar.
- O `ChallengeCodeEditorSlotView` agora compõe `CodeEditorToolbar`, `CodeEditor` e `Console` no mesmo slot, preservando o padrão Widget e a integração existente com seleção de código e assistente.
- A `CodeEditorToolbar` ganhou o atalho visual de console, mantendo o fluxo de execução único e sem duplicar a interpretação do código.
- O widget global `Console` passou a suportar renderização inline no desktop e via portal no mobile, preservando linhas repetidas e mantendo o estado vazio com `Sem saída`.
- `Challenge.runCode(code)` agora retorna `Promise<List<string>>` com os outputs brutos acumulados de todos os `TestCase`, sem alterar a lógica de correção baseada em `results` e `userOutputs`.
- `DeleguaLsp.run(code)` passou a preservar `outputs` mesmo quando o programa não produz valor final, cobrindo cenários baseados apenas em `escreva()`.

---

# 12. Validacao Final

- `npx turbo codecheck --filter=!@stardust/studio` executado com sucesso, sem warnings ou erros.
- `npm run test -w @stardust/core` executado com sucesso.
- `npm run test -w @stardust/web` executado com sucesso.
- `apps/studio` foi explicitamente desconsiderado nesta conclusão por orientação do solicitante.

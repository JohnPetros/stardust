---
title: Adicionar dialog de snippets de exemplo no editor do Playground
prd: https://github.com/JohnPetros/stardust/milestone/29
issue: https://github.com/JohnPetros/stardust/issues/398
apps: web
status: closed
last_updated_at: 2026-04-29
---

# 1. Objetivo

Adicionar ao editor de snippets do Playground uma acao manual `Exemplos`, fechada por padrao, que abre um dialog com exatamente 10 exemplos iniciais em Delegua, permite aplicar um exemplo no titulo e no codigo do editor localmente, solicita confirmacao antes de substituir conteudo ja alterado e preserva o fluxo atual de executar e salvar manualmente sem persistencia automatica.

---

# 2. Escopo

## 2.1 In-scope

* Criar um catalogo compartilhado de exemplos de Delegua em `packages/lsp`, separado dos snippets de autocomplete existentes.
* Expor o catalogo no app `web` via `useLsp()` sem alterar o contrato atual `snippets` usado pelo Monaco.
* Adicionar uma acao `Exemplos` na toolbar do editor de snippet em `/playground/snippets/new` e `/playground/snippets/:snippetId`.
* Criar um dialog acessivel para listar os 10 exemplos definidos no PRD/issue.
* Aplicar o exemplo selecionado no formulario local do `SnippetPage`, preenchendo titulo e codigo sem chamar create/update.
* Solicitar confirmacao quando titulo ou codigo do snippet ja tiverem sido alterados antes de substituir pelo exemplo.
* Manter as acoes atuais de voltar, executar, salvar, compartilhar e alterar visibilidade.
* Remover da pagina de snippet o acesso ao assistente de IA na toolbar do editor.
* Proteger a rota `/playground/snippets` com autenticacao usando uma action do modulo `playground`.

## 2.2 Out-of-scope

* Persistir automaticamente exemplos aplicados.
* Criar galeria publica, busca, filtros ou curadoria dinamica de exemplos.
* Adicionar exemplos ao autocomplete global do Monaco.
* Alterar contratos REST/RPC de criacao, edicao, exclusao ou listagem de snippets.
* Alterar regras de autenticacao, autorizacao, ownership ou visibilidade de snippets.
* Alterar `apps/studio`, mesmo que o pacote `@stardust/lsp` passe a exportar a nova constante.
* Adicionar novos campos em `SnippetDto` ou novos objetos de dominio no `core`.

---

# 3. Requisitos

## 3.1 Funcionais

* O editor de snippet deve exibir uma acao clara `Exemplos` no fluxo de edicao/criacao.
* O catalogo deve permanecer fechado por padrao e abrir apenas por acao manual do usuario.
* O catalogo inicial deve conter exatamente estes 10 exemplos: `Ola mundo`, `Variaveis e tipos`, `Condicional se/senao`, `Laco para`, `Laco enquanto`, `Funcao com retorno`, `Lista e repeticao`, `Dicionario e acesso por chave`, `Entrada do usuario` e `Mini algoritmo: numero par`.
* Ao selecionar um exemplo, o sistema deve preencher localmente titulo e codigo do editor.
* Selecionar um exemplo nao deve disparar `createSnippet`, `updateSnippet` nem qualquer action de persistencia.
* Se titulo ou codigo ja tiverem alteracoes locais, o sistema deve pedir confirmacao antes de substituir pelo exemplo.
* Depois de aplicar um exemplo, o usuario deve continuar podendo executar o codigo e salvar manualmente pelo fluxo existente.
* A pagina de snippet nao deve exibir o botao `Assistente de codigo` na toolbar.
* A pagina `/playground/snippets` deve validar sessao autenticada via action server-side antes de renderizar `SnippetsPage`.

## 3.2 Não funcionais

* **Acessibilidade:** a acao `Exemplos`, os itens do dialog, o cancelamento e a confirmacao de substituicao devem ser acionaveis por teclado usando os componentes `Dialog`, `AlertDialog`, `Toolbar.Button` e `Button` existentes.
* **Confiabilidade:** falha ou cancelamento na confirmacao nao deve apagar o conteudo atual do editor.
* **Compatibilidade retroativa:** `DELEGUA_SNIPPETS` deve continuar representando apenas snippets de autocomplete para evitar alterar sugestoes do Monaco em `web` e `studio`.
* **Performance:** abrir o catalogo deve ser local, sem requisicao REST/RPC, usando a constante exportada pelo pacote `@stardust/lsp`.

---

# 4. O que já existe?

## Next.js App

* **`SnippetsListPage`** (`apps/web/src/app/playground/snippets/page.tsx`) - renderiza a listagem principal de snippets; agora pode chamar action server-side antes da renderizacao.
* **`NewSnippetPage`** (`apps/web/src/app/playground/snippets/new/page.tsx`) - renderiza `SnippetPage` sem `snippetDto`, iniciando o editor com valores padrao.
* **`SnippetByIdPage`** (`apps/web/src/app/playground/snippets/[snippetId]/page.tsx`) - busca o snippet via `playgroundActions.accessSnippetPage`, bloqueia snippets privados inacessiveis e renderiza `SnippetPage` com `snippetDto` quando permitido.

## Camada RPC (Actions)

* **`AccessSnippetPageAction`** (`apps/web/src/rpc/actions/playground/AccessSnippetPageAction.ts`) - valida acesso a snippet por `snippetId` para rotas de detalhe.
* **`authActionClient`** (`apps/web/src/rpc/next-safe-action/clients/authActionClient.ts`) - middleware de action que resolve sessao e usuario autenticado antes de executar actions protegidas.
* **`playgroundActions`** (`apps/web/src/rpc/next-safe-action/playgroundActions.ts`) - expoe actions do dominio playground no app web.

## Camada UI

* **`SnippetPage`** (`apps/web/src/ui/playground/widgets/pages/Snippet/index.tsx`) - compoe titulo, botoes de voltar/salvar, compartilhamento, visibilidade, `CodeEditorToolbar` e `PlaygroundCodeEditor` controlado por `react-hook-form`.
* **`SnippetPageView`** (`apps/web/src/ui/playground/widgets/pages/Snippet/SnippetPageView.tsx`) - concentra a renderizacao da pagina de snippet no padrao View, recebendo estado e handlers via props.
* **`useSnippetPage`** (`apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`) - controla formulario, estados de salvar, autoria, execucao do codigo e criacao/atualizacao manual via `PlaygroundService`.
* **`CodeEditorToolbar`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`) - resolve dependencias da toolbar e renderiza `CodeEditorToolbarView` com acoes globais do editor.
* **`CodeEditorToolbarView`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx`) - renderiza botao `Executar`, acoes de reset, guias, console, comandos, configuracoes e assistente dentro de `Toolbar.Container`.
* **`GuidesDialog`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/GuidesDialog/index.tsx`) - referencia de dialog acionado por item de toolbar e renderizado fechado por padrao.
* **`GuidesDialogView`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/GuidesDialog/GuidesDialogView.tsx`) - referencia de listagem em dialog usando `Dialog.Container`, `Dialog.Content`, `Dialog.Header` e `Dialog.Trigger`.
* **`ShareSnippetDialog`** (`apps/web/src/ui/playground/widgets/components/ShareSnippetDialog/index.tsx`) - referencia de widget de dialog no dominio `playground` com trigger recebido por `children`.
* **`AlertDialog`** (`apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`) - wrapper de confirmacao baseado em Radix com abertura controlada por trigger ou por `AlertDialogRef`.
* **`AlertDialogRef`** (`apps/web/src/ui/global/widgets/components/AlertDialog/types/AlertDialogRef.ts`) - contrato imperativo `{ open: VoidFunction; close: VoidFunction }` ja usado em `SnippetPage` para login obrigatorio.
* **`PlaygroundCodeEditorRef`** (`apps/web/src/ui/global/widgets/components/PlaygroundCodeEditor/types/PlaygroundCodeEditorRef.ts`) - estende `CodeEditorRef` e adiciona `runCode(): void`.
* **`CodeEditorRef`** (`apps/web/src/ui/global/widgets/components/CodeEditor/types/CodeEditorRef.ts`) - expoe `getValue(): string`, `setValue(value: string): void`, `reloadValue(): void` e demais operacoes imperativas do editor.
* **`useLsp`** (`apps/web/src/ui/global/hooks/useLsp.ts`) - instancia `DeleguaLsp` e expoe `documentations` e `snippets` de `@stardust/lsp` para os editores.

## Pacote LSP

* **`DELEGUA_SNIPPETS`** (`packages/lsp/src/constants/delegua-snippets.ts`) - agrega snippets curtos de autocomplete de metodos de listas, dicionarios, globais e texto.
* **`DELEGUA_REGEX`** (`packages/lsp/src/constants/delegua-regex.ts`) - centraliza regex utilitarias, incluindo os padroes usados para localizar chamadas `leia(...)` no pre-processamento de entradas.
* **`DeleguaLsp.addInputs`** (`packages/lsp/src/DeleguaLsp.ts`) - substitui ocorrencias de `leia(...)` por entradas tipadas em tempo de execucao.
* **`constants barrel`** (`packages/lsp/src/constants/index.ts`) - exporta constantes publicas do pacote, incluindo `DELEGUA_SNIPPETS`.
* **`main export`** (`packages/lsp/src/main.ts`) - exporta `./constants`, `DeleguaLsp`, `DeleguaConfiguracaoParaEditorMonaco` e documentacoes.

## Core Contracts

* **`LspSnippet`** (`packages/core/src/global/domain/types/LspSnippet.ts`) - contrato compartilhado `{ label: string; code: string }` suficiente para representar titulo e codigo dos exemplos.
* **`SnippetDto`** (`packages/core/src/playground/domain/entities/dtos/SnippetDto.ts`) - contrato de snippet persistido; nao deve ser usado para o catalogo local porque contem dados controlados pelo servidor como `author`, `id`, `createdAt` e `isPublic`.
* **`Snippet`** (`packages/core/src/playground/domain/entities/Snippet.ts`) - entidade de snippet persistido usada apenas no fluxo atual de salvar/atualizar.
* **`PlaygroundService`** (`packages/core/src/playground/interfaces/PlaygroundService.ts`) - contrato atual de persistencia de snippets; nao deve ser chamado ao aplicar exemplos.

---

# 5. O que deve ser criado?

## Pacote LSP (Constants)

* **Localização:** `packages/lsp/src/constants/delegua-example-snippets.ts` (**novo arquivo**)
* **Dependências:** `LspSnippet` de `@stardust/core/global/types`.
* **Responsabilidade:** declarar o catalogo curado de exemplos completos de Playground, separado dos snippets de autocomplete.
* **Atributos:** `DELEGUA_EXAMPLE_SNIPPETS: LspSnippet[]` com exatamente 10 itens e labels nesta ordem:
  * `Ola mundo`
  * `Variaveis e tipos`
  * `Condicional se/senao`
  * `Laco para`
  * `Laco enquanto`
  * `Funcao com retorno`
  * `Lista e repeticao`
  * `Dicionario e acesso por chave`
  * `Entrada do usuario`
  * `Mini algoritmo: numero par`
* **Contrato dos itens:** cada item deve usar `{ label: string; code: string }`, sem placeholders de autocomplete Monaco como `${1:...}`, porque o codigo sera aplicado diretamente via `setValue`.

## Camada UI (Widgets)

* **Localização:** `apps/web/src/ui/playground/widgets/components/SnippetExamplesDialog/index.tsx` (**novo arquivo**)
* **Props:** `children: ReactNode`, `snippets: LspSnippet[]`, `onSelectSnippet: (snippet: LspSnippet) => void`.
* **Estados (Client Component):** Loading: nao aplicavel; Error: nao aplicavel; Empty: renderizar mensagem curta caso `snippets.length === 0`, embora o fluxo esperado receba 10 itens; Content: renderizar lista de botoes com os labels dos exemplos.
* **View:** `SnippetExamplesDialogView` em `apps/web/src/ui/playground/widgets/components/SnippetExamplesDialog/SnippetExamplesDialogView.tsx` (**novo arquivo**).
* **Hook (se aplicável):** Nao aplicavel; o widget deve ser puramente composicional, pois a regra de substituicao pertence ao `useSnippetPage`.
* **Index:** recebe os exemplos e repassa para a view; nao deve acessar `useLsp`, `useRestContext`, `useAuthContext` ou services diretamente.
* **Widgets internos:** Nao aplicavel.
* **Estrutura de pastas:**

```text
apps/web/src/ui/playground/widgets/components/SnippetExamplesDialog/
├── index.tsx
└── SnippetExamplesDialogView.tsx
```

## Camada UI (Widgets)

* **Localização:** `apps/web/src/ui/playground/widgets/components/SnippetExamplesDialog/SnippetExamplesDialogView.tsx` (**novo arquivo**)
* **Props:** `children: ReactNode`, `snippets: LspSnippet[]`, `onSelectSnippet: (snippet: LspSnippet) => void`.
* **Estados (Client Component):** Loading: nao aplicavel; Error: nao aplicavel; Empty: texto informando que nenhum exemplo esta disponivel; Content: grade/lista responsiva de botoes.
* **View:** a propria view do widget.
* **Hook (se aplicável):** Nao aplicavel.
* **Index:** Nao aplicavel para a view.
* **Widgets internos:** Nao aplicavel.
* **Estrutura de pastas:** mesma estrutura do widget `SnippetExamplesDialog`.
* **Métodos:** `onSelectSnippet(snippet: LspSnippet): void` — notifica o item escolhido para a pagina decidir se aplica imediatamente ou se pede confirmacao.

## Camada UI (Pages)

* **Localização:** `apps/web/src/ui/playground/widgets/pages/Snippet/SnippetPageView.tsx` (**novo arquivo**)
* **Props:** estado e handlers do `SnippetPage` (formulario, refs de dialogs/editor, callbacks de acao e de exemplos).
* **Responsabilidade:** renderizar a pagina no padrao Widget (View), mantendo `index.tsx` como ponto de composicao e `useSnippetPage.ts` como hook de estado/fluxo.
* **Hook (se aplicável):** Nao aplicavel para a view.
* **Index:** `apps/web/src/ui/playground/widgets/pages/Snippet/index.tsx` resolve dependencias (`useAuthContext`, `useRestContext`, `useLsp`) e repassa para `SnippetPageView`.

## Camada RPC (Actions)

* **Localização:** `apps/web/src/rpc/actions/playground/AccessSnippetsPageAction.ts` (**novo arquivo**)
* **Dependências:** `Call` de `@stardust/core/global/interfaces` e `User` de `@stardust/core/global/entities`.
* **Dados de request:** Nao aplicavel (apenas contexto de usuario autenticado no `call`).
* **Dados de response:** `void`.
* **Métodos:** `handle(call: Call): Promise<void>` — valida que `call.getUser()` resolve um usuario valido (gating de autenticacao para a listagem de snippets).

---

# 6. O que deve ser modificado?

## Pacote LSP

* **Arquivo:** `packages/lsp/src/constants/index.ts`
* **Mudança:** Exportar `DELEGUA_EXAMPLE_SNIPPETS` a partir de `./delegua-example-snippets`.
* **Justificativa:** Tornar o catalogo disponivel pelo export publico `@stardust/lsp` sem misturar exemplos completos em `DELEGUA_SNIPPETS`.
* **Camada:** `provision`

## Camada UI

* **Arquivo:** `apps/web/src/app/playground/snippets/page.tsx`
* **Mudança:** Chamar `await playgroundActions.accessSnippetsPage()` antes de renderizar `SnippetsPage`.
* **Justificativa:** Aplicar autenticacao server-side da rota de listagem usando action do modulo `playground`, consistente com o padrao de outras paginas protegidas.
* **Camada:** `ui`

## Camada RPC

* **Arquivo:** `apps/web/src/rpc/next-safe-action/playgroundActions.ts`
* **Mudança:** Adicionar `accessSnippetsPage` com `authActionClient.action(...)`, construindo `NextCall` com `ctx.user` e delegando para `AccessSnippetsPageAction`.
* **Justificativa:** Centralizar controle de acesso da rota no modulo de actions do playground.
* **Camada:** `rpc`

## Camada RPC

* **Arquivo:** `apps/web/src/rpc/actions/playground/index.ts`
* **Mudança:** Exportar `AccessSnippetsPageAction` no barrel do modulo.
* **Justificativa:** Manter organizacao padrao de exports das actions do dominio.
* **Camada:** `rpc`

## Camada RPC

* **Arquivo:** `apps/web/src/rpc/next-safe-action/index.ts`
* **Mudança:** Incluir `accessSnippetsPage` em `playgroundActions`.
* **Justificativa:** Disponibilizar a action para consumo na rota Next.js `/playground/snippets`.
* **Camada:** `rpc`

## Camada UI

* **Arquivo:** `apps/web/src/ui/global/hooks/useLsp.ts`
* **Mudança:** Importar `DELEGUA_EXAMPLE_SNIPPETS` e retornar `exampleSnippets: DELEGUA_EXAMPLE_SNIPPETS` junto de `lspProvider`, `documentations` e `snippets`.
* **Justificativa:** Reutilizar o ponto central de acesso ao LSP no web mantendo `snippets` dedicado ao autocomplete.
* **Camada:** `ui`

## Camada UI

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`
* **Mudança:** Adicionar uma prop opcional unica, como `options?: { customActions?: ReactNode; shouldHideAssistantButton?: boolean }`, e repassa-la para `CodeEditorToolbarView`.
* **Justificativa:** Permitir que o editor do Playground injete a acao `Exemplos` e oculte o assistente com uma unica configuracao de contexto, sem tornar a toolbar global dependente do dominio `playground`.
* **Camada:** `ui`

## Camada UI

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx`
* **Mudança:** Receber a prop `options` da toolbar, renderizar `options.customActions` dentro de `Toolbar.Container`, preferencialmente antes de `GuidesDialog`, e deixar de renderizar `Toolbar.Button label='Assistente de codigo'` quando `options.shouldHideAssistantButton` for `true`.
* **Justificativa:** Preservar o componente global com um unico ponto explicito de extensao visual e variacao por contexto.
* **Camada:** `ui`

## Camada UI

* **Arquivo:** `apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`
* **Mudança:** Adicionar dependencia `replaceSnippetAlertDialogRef: RefObject<AlertDialogRef | null>` em `UseSnippetPageParams`; importar `LspSnippet`; obter `setValue` e `formState.dirtyFields` de `useForm`; controlar um estado local de exemplo pendente; expor handlers para selecao e confirmacao de substituicao.
* **Justificativa:** A aplicacao do exemplo altera somente estado local do formulario/editor, portanto deve ficar no hook da pagina, sem chamar `PlaygroundService` nem mover regra de UI para o `core`.
* **Camada:** `ui`

## Camada UI

* **Arquivo:** `apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`
* **Mudança:** Adicionar metodo `handleExampleSnippetSelect(snippet: LspSnippet): void`.
* **Justificativa:** Ao receber um exemplo, deve verificar se `dirtyFields.snippetTitle` ou `dirtyFields.snippetCode` indicam conteudo alterado; se houver alteracao, armazenar o exemplo como pendente e abrir `replaceSnippetAlertDialogRef.current?.open()`; caso contrario, aplicar imediatamente.
* **Camada:** `ui`

## Camada UI

* **Arquivo:** `apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`
* **Mudança:** Adicionar metodo `handleExampleSnippetReplaceConfirm(): void`.
* **Justificativa:** Confirmar substituicao do exemplo pendente, atualizar localmente `snippetTitle` com `snippet.label`, `snippetCode` com `snippet.code`, chamar `playgroudCodeEditorRef.current?.setValue(snippet.code)` para manter o Monaco sincronizado, limpar o exemplo pendente e nao persistir.
* **Camada:** `ui`

## Camada UI

* **Arquivo:** `apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`
* **Mudança:** Adicionar funcao interna `applyExampleSnippet(snippet: LspSnippet): void`.
* **Justificativa:** Centralizar a atualizacao local de `snippetTitle` e `snippetCode` com `setValue(..., { shouldDirty: true, shouldValidate: true })`, garantindo que o botao salvar reflita alteracoes pendentes e que erros de formulario sejam recalculados.
* **Camada:** `ui`

## Camada UI

* **Arquivo:** `apps/web/src/ui/playground/widgets/pages/Snippet/index.tsx`
* **Mudança:** Criar `replaceSnippetAlertDialogRef`, obter `exampleSnippets` via `useLsp()`, passar `replaceSnippetAlertDialogRef` para `useSnippetPage`, e delegar a renderizacao para `SnippetPageView`, mantendo em `index.tsx` apenas composicao e injecao de dependencias.
* **Justificativa:** Alinhar a pagina ao padrao Widget (Index + View + Hook), reduzindo acoplamento e mantendo responsabilidades claras sem alterar o comportamento funcional.
* **Camada:** `ui`

## Pacote LSP

* **Arquivo:** `packages/lsp/src/constants/delegua-regex.ts`
* **Mudança:** Ajustar `conteudoDeFuncaoLeia` para casar apenas a chamada `leia(...)` (`/leia\([^)]*\)/`) em vez de capturar de forma gulosa o restante da linha.
* **Justificativa:** Evitar substituicoes incorretas em `DeleguaLsp.addInputs` quando `leia()` estiver dentro de expressoes maiores (ex.: `numero(leia())`), preservando parenteses e o codigo subsequente.
* **Camada:** `provision`

---

# 7. O que deve ser removido?

Não aplicável.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Criar `DELEGUA_EXAMPLE_SNIPPETS` separado de `DELEGUA_SNIPPETS`.
* **Alternativas consideradas:** Adicionar os 10 exemplos diretamente em `DELEGUA_SNIPPETS`; hardcodar exemplos no app `web`.
* **Motivo da escolha:** `DELEGUA_SNIPPETS` hoje alimenta autocomplete do Monaco em `web` e `studio`; exemplos completos apareceriam como sugestoes globais e poderiam afetar fluxos fora do Playground. O pacote `lsp` ja centraliza constantes da linguagem, entao e o local mais consistente para o catalogo.
* **Impactos / trade-offs:** Exige um novo export publico no pacote `lsp`, mas preserva compatibilidade de autocomplete e evita duplicar conteudo no app.

* **Decisão:** Proteger `/playground/snippets` via action autenticada (`accessSnippetsPage`) em vez de mover toda a regra para middleware de rota publica.
* **Alternativas consideradas:** Remover `/playground/snippets/` de `PUBLIC_ROUTE_GROUPS`; validar autenticacao apenas no cliente; deixar rota sem gating explicito.
* **Motivo da escolha:** O projeto ja usa `authActionClient` para gating server-side de paginas, com contexto de usuario resolvido e sem acoplamento da regra ao componente de UI.
* **Impactos / trade-offs:** A rota passa a depender de action RPC no render server-side; mantem consistencia arquitetural com outras paginas protegidas.

* **Decisão:** Aplicar exemplos no `useSnippetPage`, nao no `core`.
* **Alternativas consideradas:** Criar um use case ou entidade de catalogo no `core`; aplicar diretamente dentro do novo dialog.
* **Motivo da escolha:** O fluxo e uma interacao local de UI, sem regra de dominio nem persistencia. O `core` deve continuar representando snippets persistidos e contratos de negocio.
* **Impactos / trade-offs:** A regra de confirmacao fica proxima do formulario e do editor, reduzindo acoplamento, mas o catalogo em si continua compartilhado pelo `lsp`.

* **Decisão:** Adicionar uma unica prop `options` na toolbar global para extensao contextual.
* **Alternativas consideradas:** Usar props separadas como `customActions` e `shouldHideAssistantButton`; renderizar `SnippetExamplesDialog` fora da toolbar; adicionar `Exemplos` diretamente na toolbar para todos os editores.
* **Motivo da escolha:** A issue pede a acao no fluxo do editor de snippet, mas a toolbar e global e usada por outros contextos. Uma unica prop de configuracao reduz a superficie da API do componente e concentra todas as variacoes locais do Playground em um unico ponto.
* **Impactos / trade-offs:** A toolbar continua generica e desacoplada de `playground`, mas passa a aceitar um pequeno objeto de configuracao contextual.

* **Decisão:** Ocultar o botao do assistente de IA apenas no `SnippetPage` via configuracao da toolbar.
* **Alternativas consideradas:** Remover o botao da toolbar global; manter o botao e apenas reposiciona-lo; mover a regra para dentro da toolbar com deteccao do path atual.
* **Motivo da escolha:** O requisito vale apenas para o editor de snippet. Detectar rota dentro da toolbar criaria acoplamento indevido com Next.js e com o dominio `playground`; remover globalmente afetaria outros fluxos que ja usam o assistente.
* **Impactos / trade-offs:** A regra permanece explicita no ponto de composicao da pagina e aproveita a mesma configuracao contextual da toolbar usada para injetar `Exemplos`.

* **Decisão:** Usar `LspSnippet { label, code }` para exemplos.
* **Alternativas consideradas:** Criar tipo novo com `title`, `description`, `category` ou `order`.
* **Motivo da escolha:** O requisito atual precisa apenas de titulo exibido/aplicado e codigo. O contrato existente e suficiente e evita alterar `core` sem necessidade.
* **Impactos / trade-offs:** O dialog inicial nao tera descricao/categoria estruturada; se produto pedir curadoria mais rica depois, uma nova spec deve criar contrato apropriado.

* **Decisão:** Confirmar substituicao quando `snippetTitle` ou `snippetCode` estiverem dirty.
* **Alternativas consideradas:** Confirmar sempre; confirmar apenas quando `snippetCode.trim() !== ''`; confirmar com base em `formState.isDirty` geral.
* **Motivo da escolha:** O requisito fala em conteudo alterado; titulo e codigo sao os campos substituidos pelo exemplo. Usar `formState.isDirty` geral incluiria visibilidade, que nao sera sobrescrita.
* **Impactos / trade-offs:** Se o usuario alterou apenas visibilidade, selecionar exemplo nao pede confirmacao porque a visibilidade sera preservada.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```text
packages/lsp
  DELEGUA_EXAMPLE_SNIPPETS
        |
        v
apps/web useLsp()
  { lspProvider, documentations, snippets, exampleSnippets }
        |
        v
SnippetPage (/playground/snippets/new ou /playground/snippets/:snippetId)
        |
        +--> CodeEditorToolbar.options
        |       |
        |       v
        |   customActions -> SnippetExamplesDialog (fechado por padrao)
        |   shouldHideAssistantButton -> true
        |       |
        |       v
        |   onSelectSnippet(example)
        |
        v
useSnippetPage.handleExampleSnippetSelect(example)
        |
        +--> sem alteracao local: applyExampleSnippet(example)
        |
        +--> titulo/codigo dirty: AlertDialogRef.open()
                    |
                    v
              handleExampleSnippetReplaceConfirm()
                    |
                    v
              setValue('snippetTitle', example.label)
              setValue('snippetCode', example.code)
              PlaygroundCodeEditorRef.setValue(example.code)

Nenhuma chamada a PlaygroundService.createSnippet/updateSnippet ocorre nesse fluxo.
```

```text
/playground/snippets (Next page)
        |
        v
playgroundActions.accessSnippetsPage()
        |
        v
authActionClient (resolve sessao + ctx.user)
        |
        v
AccessSnippetsPageAction.handle(call)
        |
        v
SnippetsPage
```

* **Fluxo Cross-app (se aplicável):** Não aplicável. A feature toca o app `web` e o pacote compartilhado `lsp`, mas nenhum outro app consome ou expoe comunicacao REST, RPC ou evento para este fluxo.

* **Layout:**

```text
SnippetPage
├── Header
│   ├── TitleInput
│   ├── Voltar
│   ├── Salvar
│   ├── ShareSnippetDialog (apenas autor + publico)
│   └── Switch Publico (apenas autor)
├── AlertDialog: login obrigatorio
├── AlertDialog: substituir conteudo atual
└── CodeEditorToolbar
    ├── Executar
    ├── Voltar para codigo inicial
    ├── SnippetExamplesDialog
    │   └── 10 botoes de exemplos
    ├── Guias
    ├── Console (quando aplicavel)
    ├── Comandos
    ├── Configuracoes
    └── PlaygroundCodeEditor
```

* **Referências:**
* `apps/web/src/ui/playground/widgets/pages/Snippet/index.tsx` - composicao atual do editor de snippet.
* `apps/web/src/app/playground/snippets/page.tsx` - rota de listagem de snippets protegida por action server-side.
* `apps/web/src/ui/playground/widgets/pages/Snippet/SnippetPageView.tsx` - renderizacao da pagina de snippet no padrao View.
* `apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts` - estado e handlers atuais de formulario, executar e salvar.
* `apps/web/src/rpc/actions/playground/AccessSnippetsPageAction.ts` - action de autenticacao da listagem de snippets.
* `apps/web/src/rpc/next-safe-action/playgroundActions.ts` - definicao das actions do modulo playground no web.
* `apps/web/src/rpc/next-safe-action/clients/authActionClient.ts` - middleware de autenticacao das actions.
* `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx` - padrao de acoes da toolbar e confirmacao de reset.
* `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/GuidesDialog/GuidesDialogView.tsx` - referencia de catalogo/lista em dialog.
* `apps/web/src/ui/playground/widgets/components/ShareSnippetDialog/ShareSnippetDialogView.tsx` - referencia de dialog no dominio `playground`.
* `apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx` - confirmacao acessivel e controlavel por ref.
* `apps/web/src/ui/global/hooks/useLsp.ts` - ponto central de acesso ao LSP no app `web`.
* `packages/lsp/src/constants/delegua-snippets.ts` - padrao atual de constantes de snippets.
* `packages/lsp/src/constants/delegua-regex.ts` - regex usadas no pre-processamento de `leia(...)`.
* `packages/lsp/src/DeleguaLsp.ts` - implementacao de `addInputs` consumindo `DELEGUA_REGEX.conteudoDeFuncaoLeia`.
* `packages/lsp/src/constants/index.ts` - barrel publico das constantes do pacote.
* `packages/core/src/global/domain/types/LspSnippet.ts` - contrato reutilizado para `{ label, code }`.

---

# 10. Pendências / Dúvidas
 
---

---
title: Configurações de formatter e linter do editor de desafios
prd: https://github.com/JohnPetros/stardust/milestone/13
issue: https://github.com/JohnPetros/stardust/issues/383
apps: web
status: open
last_updated_at: 2026-04-13
---

# 1. Objetivo

Adicionar ao editor de código da aplicação `web` a persistência local de configurações de formatter e linter, expor esses controles no dialog de configurações do editor e disponibilizar a ação `Arrumar código` na toolbar com atalho compatível com macOS. A implementação deve reutilizar o `EditorContext` existente para persistência global, manter a toolbar compartilhada entre `challenging` e `playground`, ampliar o adapter `@stardust/lsp` para aplicar um pipeline de estilização Delegua baseado em `EstilizadorDelegua`, `FormatadorDelegua` e quebra local de linhas, e aplicar esse mesmo pipeline automaticamente ao carregar o código inicial no editor de desafio.

---

# 2. Escopo

## 2.1 In-scope

- Persistir no `EditorContext` as novas configurações de formatter e linter via `localStorage`.
- Adicionar no dialog de configurações do editor os campos de delimitador de texto, máximo de caracteres por linha, toggle mestre do linter, toggle de convenção de nomenclatura e toggle de paradigma consistente.
- Exibir labels dedicadas para cada seletor de convenção de nomenclatura (`Variável`, `Constante`, `Função`).
- Persistir os valores default do novo bloco de configuração com hidratação retrocompatível para estados antigos já salvos no navegador.
- Ao acionar `Restaurar padrão`, refletir imediatamente os valores default na UI do dialog (switches, sliders e selects), sem exigir reabertura do modal.
- Quando o toggle mestre de estilizador estiver desligado, desabilitar e exibir como desligados os toggles de `Convenção de nomenclatura` e `Paradigma consistente`.
- Adicionar o botão `Arrumar código` na `CodeEditorToolbar`.
- Adicionar o atalho `Ctrl + M` / `Cmd + M` para a ação `Arrumar código`.
- Adaptar a exibição de atalhos para `Cmd` e `Option` no macOS.
- Ao carregar o código inicial no editor de desafio (`ChallengeCodeEditor`), aplicar automaticamente o pipeline `lintCode -> formatCode` com a configuração atual do `EditorContext`.
- Ao carregar snippets editáveis no widget `CodeSnippet`, aplicar automaticamente o pipeline `lintCode -> formatCode` com a configuração atual do `EditorContext`.
- Expandir o autocomplete do Monaco para sugerir símbolos locais do código Delégua (funções, variáveis e constantes) sem duplicação de itens.
- Ampliar o contrato `LspProvider` para receber as configurações persistidas do editor ao formatar/lintar código.
- Implementar em `packages/lsp` o pipeline de estilização usando as regras Delegua de convenção de nomenclatura e paradigma consistente antes da formatação final.
- Aplicar `QuebradorDeLinha` do pacote Delegua para respeitar `maxCharsPerLine` após a formatação final.

## 2.2 Out-of-scope

- Criar APIs server-side, rotas Next.js, RPCs, RESTs ou persistência em banco para essas configurações.
- Introduzir lint em tempo real com markers novos no Monaco durante a digitação.
- Alterar o comportamento atual do detector de erros (`isCodeCheckerEnabled`), que continua responsável apenas por análise sintática em tempo real.
- Adicionar a regra `RegraFortalecerTipos` do código-base de referência fornecido; esta milestone cobre apenas convenção de nomenclatura e paradigma consistente.
- Criar configuração por desafio, por snippet ou por usuário autenticado; a configuração continua global ao editor no navegador.
- Alterar a modelagem de domínio de `Challenge`, `Code`, `Snippet` ou contratos de validação em `packages/validation`.

---

# 3. Requisitos

## 3.1 Funcionais

- O usuário deve conseguir configurar o delimitador de texto do formatter com as opções `Preservar`, `Aspas simples` e `Aspas duplas`.
- O usuário deve conseguir configurar o máximo de caracteres por linha por meio de slider.
- O usuário deve conseguir configurar o tamanho de indentação (tab) entre `2` e `8` no dialog, e esse valor deve ser usado pela ação `Arrumar código`.
- O usuário deve conseguir ativar ou desativar todas as regras do linter por um toggle mestre.
- O usuário deve conseguir ativar ou desativar individualmente a regra de convenção de nomenclatura e a regra de paradigma consistente.
- Quando a regra de convenção de nomenclatura estiver ativa, o usuário deve configurar convenções para variável, constante e função.
- O dialog deve renderizar um select com label para cada convenção de nomenclatura (`Variável`, `Constante`, `Função`).
- Quando a regra de paradigma consistente estiver ativa, o usuário deve escolher entre `ambos`, `imperativo` e `infinitivo`.
- Ao desligar o estilizador, os toggles de `Convenção de nomenclatura` e `Paradigma consistente` devem ficar desabilitados e visualmente desligados.
- O botão `Arrumar código` deve aplicar o pipeline de estilização e formatação ao código atual do editor.
- A ação `Arrumar código` deve usar o valor de `tabSize` atual como `indentationSize` ao formatar com Delegua.
- Ao carregar o editor de desafio, o código inicial (vindo de `localStorage` ou `challenge.code`) deve ser processado automaticamente pelo pipeline atual de lint/formatação antes da primeira execução.
- O autocomplete do editor deve sugerir funções locais declaradas no código (incluindo funções atribuídas a variáveis/constantes).
- O autocomplete do editor deve sugerir variáveis locais declaradas com `var` e constantes declaradas com `const|constante|fixo`.
- As sugestões de autocomplete não devem aparecer duplicadas quando houver múltiplas instâncias de editor montadas.
- O botão `Arrumar código` deve ser acionável pelo atalho `Ctrl + M` no Windows/Linux e `Cmd + M` no macOS.
- Os atalhos exibidos no dialog devem adaptar `Ctrl` para `Cmd` e `Alt` para `Option` no macOS.
- Todas as novas configurações devem continuar persistidas em `localStorage` junto do estado atual do editor.

## 3.2 Não funcionais

- A configuração deve permanecer client-side, sem novas chamadas HTTP, RPC, REST ou acesso a banco.
- Estados antigos em `STORAGE.keys.editorState` que ainda não possuem `formatter` e `linter` devem ser hidratados com defaults sem quebrar a leitura do editor.
- A toolbar deve continuar seguindo o Widget Pattern atual, com resolução de dependências no `index.tsx` do widget.
- A ação `Arrumar código` não deve bloquear a toolbar; quando o adapter não conseguir analisar o código, o conteúdo atual deve ser preservado sem crash da UI.
- O adapter deve reutilizar os contratos existentes `LspFormatterConfigurationDto` e `LspLinterConfigurationDto` em vez de introduzir novos tipos equivalentes.
- O adapter deve continuar retornando `Promise<string>` para formatação e lint, mantendo o resultado aplicável diretamente no `CodeEditorRef.setValue()`.
- A implementação de atalhos deve respeitar `metaKey` no macOS e `ctrlKey` nos demais sistemas.
- Componentes controlados do dialog (`Switch`, `RangeInput`, `Select`) devem sincronizar seu estado visual quando o valor externo mudar (ex.: `Restaurar padrão`).
- Se a formatação automática no carregamento falhar, o editor de desafio deve manter o código original carregado e seguir funcional sem crash.
- O editor deve desativar `wordBasedSuggestions` do Monaco para evitar concorrência/duplicação com o provider customizado da linguagem.

---

# 4. O que já existe?

## Camada UI (Contexts)

* **`EditorProvider`** (`apps/web/src/ui/global/contexts/EditorContext/index.tsx`) - injeta o estado global do editor na aplicação `web`.
* **`useEditorContextProvider`** (`apps/web/src/ui/global/contexts/EditorContext/useEditorContextProvider.ts`) - faz a persistência do estado em `localStorage`, possui `getEditorConfig()` interno e já centraliza o reducer do editor.
* **`DEFAULT_EDITOR_STATE`** (`apps/web/src/ui/global/contexts/EditorContext/constants/default-editor-state.ts`) - define os defaults atuais de `themeName`, `fontSize`, `tabSize` e `isCodeCheckerEnabled`.
* **`EditorContextState`** (`apps/web/src/ui/global/contexts/EditorContext/types/EditorContextState.ts`) - contrato atual do estado persistido do editor.
* **`EditorContextAction`** (`apps/web/src/ui/global/contexts/EditorContext/types/EditorContextAction.ts`) - union de actions do reducer atual.
* **`EditorContextValue`** (`apps/web/src/ui/global/contexts/EditorContext/types/EditorContextValue.ts`) - contrato exposto pelo context ao restante da UI.

## Camada UI (Hooks)

* **`useEditorContext`** (`apps/web/src/ui/global/hooks/useEditorContext.ts`) - hook consumidor do `EditorContext`.
* **`useLsp`** (`apps/web/src/ui/global/hooks/useLsp.ts`) - instancia `new DeleguaLsp()` e expõe a provider compartilhada para a UI.
* **`useLocalStorage`** (`apps/web/src/ui/global/hooks/useLocalStorage.ts`) - helper já usado para persistência client-side do editor e do código dos desafios.

## Camada UI (Widgets)

* **`CodeEditorToolbar`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`) - entry point da toolbar compartilhada entre `challenging` e `playground`.
* **`useCodeEditorToolbar`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/useCodeEditorToolbar.ts`) - concentra os atalhos e ações rápidas da toolbar (`Alt+Enter`, `Ctrl+.`, `Ctrl+K`, `Ctrl+Z`).
* **`CodeEditorToolbarView`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx`) - renderiza os botões de executar, reset, guias, console, comandos, configurações e assistente.
* **`CodeEditorSettingsDialog`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorSettingsDialog/index.tsx`) - dialog atual de configurações do editor com slider de fonte, slider de tab e toggle do detector de erros.
* **`useCodeEditorSettingsDialog`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorSettingsDialog/useCodeEditorSettingsDialog.ts`) - traduz o `EditorContext` para o dialog de configurações.
* **`HotkeysDialog`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/HotkeysDialog/index.tsx`) - exibe os atalhos da toolbar.
* **`buildHotkeys`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/HotkeysDialog/hotkeys.ts`) - builder dinâmico de atalhos exibidos conforme sistema operacional.
* **`CodeEditor`** (`apps/web/src/ui/global/widgets/components/CodeEditor/index.tsx`) - integra o Monaco ao `EditorContext`, lê `fontSize`, `tabSize` e `isCodeCheckerEnabled` e expõe a API imperativa via ref.
* **`CodeEditorRef`** (`apps/web/src/ui/global/widgets/components/CodeEditor/types/CodeEditorRef.ts`) - já possui `getValue()` e `setValue()`, suficientes para aplicar código formatado a partir da toolbar.
* **`ChallengeCodeEditorSlotView`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/ChallengeCodeEditorSlotView.tsx`) - consome a toolbar compartilhada no fluxo de desafio.
* **`SnippetPage`** (`apps/web/src/ui/playground/widgets/pages/Snippet/index.tsx`) - consome a mesma toolbar no playground, o que implica impacto compartilhado da nova ação.

## Pacote Core

* **`LspProvider`** (`packages/core/src/global/interfaces/provision/LspProvider.ts`) - contrato central do adapter de linguagem; declara `formatCode(code, formatterConfigurationDto)` e `lintCode(code, linterConfigurationDto)`.
* **`LspFormatterConfiguration`** (`packages/core/src/global/domain/structures/LspFormatterConfiguration.ts`) - structure que encapsula `textDelimiter`, `maxCharsPerLine` e `indentationSize`.
* **`LspLinterConfiguration`** (`packages/core/src/global/domain/structures/LspLinterConfiguration.ts`) - structure que encapsula o toggle mestre e os subblocos de nomenclatura e paradigma.
* **`LspFormatterConfigurationDto`** (`packages/core/src/global/domain/structures/dtos/LspFormatterConfigurationDto.ts`) - DTO compartilhado do formatter com `textDelimiter`, `maxCharsPerLine` e `indentationSize`.
* **`LspLinterConfigurationDto`** (`packages/core/src/global/domain/structures/dtos/LspLinterConfigurationDto.ts`) - DTO compartilhado do linter.
* **`LspLinterNamingConventionConfigurationDto`** (`packages/core/src/global/domain/structures/dtos/LspLinterNamingConventionConfigurationDto.ts`) - DTO compartilhado do subbloco de convenção de nomenclatura.
* **`LspLinterConsistentParadigmConfigurationDto`** (`packages/core/src/global/domain/structures/dtos/LspLinterConsistentParadigmConfigurationDto.ts`) - DTO compartilhado do subbloco de paradigma consistente.
* **`TextDelimiter`** (`packages/core/src/global/domain/structures/TextDelimiter.ts`) - valida os valores `preserve | single | double`.
* **`NamingConvention`** (`packages/core/src/global/domain/structures/NamingConvention.ts`) - valida os valores de convenção já suportados pelo core.
* **`LspParadigm`** (`packages/core/src/global/domain/structures/LspParadigm.ts`) - valida os valores `both | imperative | infinitive`.

## Camada Provision (Providers)

* **`DeleguaLsp`** (`packages/lsp/src/DeleguaLsp.ts`) - adapter compartilhado que já executa código, faz análise sintática e análise semântica, mas ainda não implementa `formatCode()` e `lintCode()`.
* **`DeleguaConfiguracaoParaEditorMonaco`** (`packages/lsp/src/DeleguaConfiguracaoParaEditorMonaco.ts`) - configuração compartilhada da linguagem no Monaco, reforçando que o pacote `@stardust/lsp` já é a borda natural para a feature.

## Referências de biblioteca já disponíveis na stack

* **`FormatadorDelegua`** (`node_modules/@designliquido/delegua/formatadores/formatador-delegua.d.ts`) - formatador base do código Delégua.
* **`EstilizadorDelegua`** (`node_modules/@designliquido/delegua/estilizador/estilizador-delegua.d.ts`) - estilizador AST-based que aplica regras antes da serialização final.
* **`RegraConvencaoNomenclatura`** (`node_modules/@designliquido/delegua/estilizador/regras/convencao-nomenclatura.d.ts`) - regra pronta para variável, constante e função.
* **`RegraParadigmaConsistente`** (`node_modules/@designliquido/delegua/estilizador/regras/paradigma-consistente.d.ts`) - regra pronta para `imperativo | infinitivo | ambos`.

---

# 5. O que deve ser criado?

## Camada UI (Hooks)

* **Localização:** `apps/web/src/ui/global/hooks/useOperatingSystem.ts` - **novo arquivo**
* **Responsabilidade:** Detectar macOS no client e expor labels reutilizáveis para atalhos.
* **Métodos:** `useOperatingSystem(): { isMacOS: boolean; primaryModifierKeyLabel: 'Ctrl' | 'Cmd'; altModifierKeyLabel: 'Alt' | 'Option' }` - detecta o sistema operacional via `navigator.userAgentData?.platform` com fallback para `navigator.platform` e retorna flags/labels consumíveis por toolbar e dialog de atalhos.

---

# 6. O que deve ser modificado?

## Camada UI

* **Arquivo:** `apps/web/src/ui/global/contexts/EditorContext/types/EditorContextState.ts`
* **Mudança:** Adicionar os campos `formatter: LspFormatterConfigurationDto` e `linter: LspLinterConfigurationDto` ao estado persistido do editor.
* **Justificativa:** O `EditorContext` já é a fonte única das preferências do editor no client e deve absorver os novos blocos sem criar store paralela.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/EditorContext/types/EditorContextAction.ts`
* **Mudança:** Adicionar as actions `setFormatter` e `setLinter`, ambas recebendo o DTO completo atualizado.
* **Justificativa:** O reducer já trabalha com updates de alto nível e a atualização por bloco completo evita proliferar actions para cada propriedade aninhada.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/EditorContext/types/EditorContextValue.ts`
* **Mudança:** Expor `getEditorConfig(): EditorContextState` além de `state` e `dispatch`.
* **Justificativa:** A toolbar precisa obter um snapshot hidratado da configuração atual sem violar a regra de resolver dependências no entry point.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/EditorContext/constants/default-editor-state.ts`
* **Mudança:** Definir os defaults dos novos blocos com os valores alinhados ao código-base de referência da Delegua: `formatter.textDelimiter='preserve'`, `formatter.maxCharsPerLine=100`, `formatter.indentationSize=4`, `linter.isEnabled=true`, `linter.namingConvention.isEnabled=false`, `linter.namingConvention.variable='caixaCamelo'`, `linter.namingConvention.constant='CAIXA_ALTA'`, `linter.namingConvention.function='caixaCamelo'`, `linter.consistentParadigm.isEnabled=false`, `linter.consistentParadigm.paradigm='both'`.
* **Justificativa:** A spec precisa definir um estado inicial inequívoco para a hidratação do editor e esses valores vieram do código-base Delegua fornecido como referência para a feature.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/EditorContext/useEditorContextProvider.ts`
* **Mudança:** Hidratar o estado salvo mesclando `DEFAULT_EDITOR_STATE` com o conteúdo antigo do `localStorage`, atualizar o reducer para `setFormatter` e `setLinter`, e retornar `getEditorConfig()` no objeto público do provider.
* **Justificativa:** Usuários que já possuem `editorState` persistido não podem perder compatibilidade ao receber novos campos aninhados; a hidratação precisa completar apenas o que estiver ausente.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/EditorContext/index.tsx`
* **Mudança:** Passar `getEditorConfig` no `EditorContext.Provider`.
* **Justificativa:** O valor do contexto deve refletir o contrato ampliado consumido pelo widget da toolbar.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`
* **Mudança:** Resolver `useEditorContext()`, `useLsp()` e `useOperatingSystem()` no entry point e injetar `getEditorConfig`, `lspProvider` e `isMacOS` em `useCodeEditorToolbar` e `CodeEditorToolbarView`.
* **Justificativa:** O entry point é a borda correta para resolver dependências de context e provider, preservando o Widget Pattern já documentado.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/useCodeEditorToolbar.ts`
* **Mudança:** Adicionar `handleFormatCode(): Promise<void>`, interpretar `metaKey` no macOS como modificador principal, adicionar o atalho `Ctrl/Cmd + M`, chamar `lspProvider.lintCode(currentCode, linter)` quando houver regras ativas e em seguida chamar `lspProvider.formatCode(lintedCode, formatter)` com o snapshot retornado por `getEditorConfig()`, garantindo que `formatter.indentationSize` acompanhe o `tabSize` configurado no editor.
* **Justificativa:** A toolbar já centraliza ações imperativas do editor e é o lugar correto para executar a nova formatação sem introduzir acoplamento direto da view ao provider.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx`
* **Mudança:** Adicionar a ação `Arrumar código` como `Toolbar.Button`, encaminhar `onFormatCode`, substituir o handler do contêiner para `onKeyDown` e passar `isMacOS` para o dialog de atalhos.
* **Justificativa:** O novo atalho precisa disparar no ciclo correto do teclado e a ação precisa estar visível na toolbar compartilhada do editor.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/HotkeysDialog/hotkeys.ts`
* **Mudança:** Substituir a lista estática por um builder que receba os labels de modificadores e inclua `Arrumar código` como `Ctrl/Cmd + M`.
* **Justificativa:** A UI atual está hardcoded em `Ctrl` e `Alt`; a nova compatibilidade com macOS exige geração dinâmica dos textos exibidos.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/HotkeysDialog/index.tsx`
* **Mudança:** Receber `isMacOS` ou os labels derivados do hook e renderizar a lista retornada pelo builder dinâmico.
* **Justificativa:** O dialog é a superfície de exibição dos atalhos e precisa refletir o sistema operacional do usuário.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorSettingsDialog/useCodeEditorSettingsDialog.ts`
* **Mudança:** Expor os novos slices `formatter` e `linter`, handlers específicos para atualizar `textDelimiter`, `maxCharsPerLine`, `linter.isEnabled`, `linter.namingConvention.isEnabled`, `linter.namingConvention.variable`, `linter.namingConvention.constant`, `linter.namingConvention.function`, `linter.consistentParadigm.isEnabled` e `linter.consistentParadigm.paradigm`, além de `handleRestoreDefaults()` para reaplicar `DEFAULT_EDITOR_STATE`; ao alterar `tabSize`, atualizar também `formatter.indentationSize`.
* **Justificativa:** O hook já é o adapter entre `EditorContext` e o dialog de configurações, então deve continuar encapsulando a montagem dos DTOs completos despachados ao reducer.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorSettingsDialog/index.tsx`
* **Mudança:** Adicionar seções `Formatter` e `Linter` usando os componentes já existentes (`Select`, `RangeInput`, `Switch`), com slider `tabSize` em faixa `2..8`, slider `maxCharsPerLine` em faixa `40..240` e `step=10`, manter o toggle atual de detector de erros, incluir labels dos selects de convenção (`Variável`, `Constante`, `Função`), botão `Restaurar padrão` e desabilitar controles dependentes quando seus toggles mestres estiverem desligados.
* **Justificativa:** O dialog atual já é a superfície de configuração do editor e precisa concentrar todas as preferências relacionadas à edição sem abrir outro modal.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts`
* **Mudança:** Ao carregar o `initialCode` do desafio, executar automaticamente o pipeline de `lintCode()` e `formatCode()` usando o snapshot de configuração de `getEditorConfig()`, persistir o resultado formatado no `localStorage` do desafio e atualizar o conteúdo inicial no `CodeEditor` quando houver diferença.
* **Justificativa:** Garante que o editor de desafio já inicie com o código aderente às regras atuais de formatter/linter, sem depender de ação manual do usuário.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/useCodeSnippet.ts`
* **Mudança:** No carregamento inicial do snippet, executar automaticamente o pipeline de `lintCode()` e `formatCode()` com o snapshot de `getEditorConfig()` e atualizar o conteúdo do editor quando o resultado formatado diferir do código de entrada.
* **Justificativa:** Mantém os snippets editáveis alinhados às regras atuais de formatação/lint sem exigir ação manual imediata do usuário.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/index.tsx`
* **Mudança:** Resolver `useLsp()` e `useEditorContext()` no entry point e injetar `lspProvider` e `getEditorConfig` no hook `useCodeSnippet`.
* **Justificativa:** Preserva o Widget Pattern ao concentrar resolução de dependências no `index.tsx`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditor/useCodeEditor.ts`
* **Mudança:** Expandir o `CompletionItemProvider` para sugerir símbolos locais do código Delégua (`função`, `var`, `const|constante|fixo`), aplicar deduplicação por `label+insertText` e registrar o provider em modo singleton para evitar múltiplos registros globais da mesma linguagem.
* **Justificativa:** Melhora a experiência de autocomplete no editor e elimina duplicidades quando há mais de uma instância de Monaco ativa na aplicação.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditor/CodeEditorView.tsx`
* **Mudança:** Desativar `wordBasedSuggestions` nas opções do Monaco.
* **Justificativa:** Evita colisão entre sugestões automáticas por palavra do Monaco e sugestões explícitas fornecidas pelo provider customizado de Delégua.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Switch/useSwitch.ts`
* **Mudança:** Sincronizar `isChecked` com alterações de `defaultCheck` via `useEffect`.
* **Justificativa:** Garante atualização visual imediata do switch quando o estado externo é restaurado por ação global no dialog.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Switch/SwitchView.tsx`
* **Mudança:** Encaminhar `disabled` para `@radix-ui/react-switch` (`Root`) e manter feedback visual de estado desabilitado.
* **Justificativa:** Evita interações em switches dependentes quando o estilizador mestre estiver desligado.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/RadioInput/useRangeInput.ts`
* **Mudança:** Sincronizar `currentValue` com a prop `value` via `useEffect` e tratar corretamente valores `0` em `handleValueChange`/`handleValueCommit`.
* **Justificativa:** Garante que sliders reflitam imediatamente mudanças externas (ex.: restauração de defaults) e evita guard incorreto por falsy-check.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/RadioInput/RangeInputView.tsx`
* **Mudança:** Tornar `Slider.Root` controlado usando `value` no lugar de `defaultValue`.
* **Justificativa:** Mantém consistência visual com o estado persistido do editor após alterações programáticas.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Select/Content.tsx`
* **Mudança:** Corrigir estrutura do Radix Select para renderizar os itens dentro de `Viewport` e elevar `z-index` do dropdown dentro de dialogs.
* **Justificativa:** Garante funcionamento de selects em overlays do dialog e evita dropdown oculto atrás da camada modal.
* **Camada:** `ui`

## Pacote Core

* **Arquivo:** `packages/core/src/global/interfaces/provision/LspProvider.ts`
* **Mudança:** Atualizar as assinaturas para `formatCode(code: string, formatterConfigurationDto: LspFormatterConfigurationDto): Promise<string>` e `lintCode(code: string, linterConfigurationDto: LspLinterConfigurationDto): Promise<string>`.
* **Justificativa:** O adapter precisa receber explicitamente a configuração persistida no editor, mas agora com responsabilidades separadas entre estilização/lint e formatação.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/global/domain/structures/dtos/LspFormatterConfigurationDto.ts`
* **Mudança:** Incluir `indentationSize: number` no DTO de formatter.
* **Justificativa:** A formatação Delegua precisa respeitar a indentação configurada no editor (`tabSize`) durante a ação `Arrumar código`.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/global/domain/structures/LspFormatterConfiguration.ts`
* **Mudança:** Incluir `indentationSize` como `Integer` no contrato de domínio e no mapeamento `create()`/`dto`.
* **Justificativa:** Centraliza a validação e tipagem da indentação junto das demais opções de formatação.
* **Camada:** `core`

## Camada Provision

* **Arquivo:** `packages/lsp/src/DeleguaLsp.ts`
* **Mudança:** Implementar `formatCode()` e `lintCode()` com responsabilidades separadas: `lintCode()` deve instanciar `LspLinterConfiguration.create(dto)`, montar a lista de regras Delegua habilitadas e aplicar `EstilizadorDelegua`; `formatCode()` deve instanciar `LspFormatterConfiguration.create(dto)`, serializar o AST com `FormatadorDelegua` respeitando `indentationSize`, aplicar normalização local de delimitador de texto apenas quando necessário e executar `QuebradorDeLinha` antes do retorno final.
* **Justificativa:** O adapter compartilhado é a única camada que conhece a lib Delegua e precisa encapsular, em etapas independentes, tanto a estilização configurável quanto a formatação final.
* **Camada:** `provision`

* **Arquivo:** `packages/lsp/src/DeleguaLsp.ts`
* **Mudança:** Adicionar helpers privados para mapear os valores do core para a nomenclatura esperada pela Delegua (`single/double/preserve` -> `aspas-simples/aspas-duplas/preservar`, `both/imperative/infinitive` -> `ambos/imperativo/infinitivo`) e para hidratar um fallback local quando a opção de delimitador do `FormatadorDelegua` não produzir o resultado esperado na versão `@designliquido/delegua@1.15.3`.
* **Justificativa:** Há um descompasso entre os enums do core, o código-base Delegua fornecido e o comportamento observado na lib instalada; esse mapeamento deve ficar isolado dentro do adapter.
* **Camada:** `provision`

* **Arquivo:** `packages/lsp/src/DeleguaLsp.ts`
* **Mudança:** Instanciar `QuebradorDeLinha(maxCharsPerLine, indentationSize, '\n')` após `FormatadorDelegua.formatar(...)` para aplicar quebra por limite de colunas no código já formatado.
* **Justificativa:** A versão atual de `@designliquido/delegua` já expõe `QuebradorDeLinha`, então o adapter deve reutilizar o helper oficial em vez de manter lógica própria.
* **Camada:** `provision`

---

# 7. O que deve ser removido?

**Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Manter as novas configurações dentro do `EditorContext` já existente.
* **Alternativas consideradas:** Criar store separada para formatter/linter; persistir as preferências por desafio; mover a configuração para `ChallengeStore`.
* **Motivo da escolha:** O estado do editor já é global, client-side e persistido em `localStorage`; duplicar essa responsabilidade criaria duas fontes de verdade.
* **Impactos / trade-offs:** A configuração passa a valer para `challenging` e `playground`, o que mantém consistência de UX, mas impede personalização por superfície nesta milestone.

* **Decisão:** Resolver `useEditorContext()`, `useLsp()` e `useOperatingSystem()` no `index.tsx` da `CodeEditorToolbar`.
* **Alternativas consideradas:** Ler context/provider dentro de `useCodeEditorToolbar`; instanciar o `DeleguaLsp` diretamente no hook da toolbar.
* **Motivo da escolha:** Segue a regra da camada UI de resolver dependências no entry point e manter o hook isolado da infraestrutura de contexto/provider.
* **Impactos / trade-offs:** O entry point fica ligeiramente mais carregado, mas o hook permanece puro e reutilizável.

* **Decisão:** Respeitar o naming existente do core (`formatCode` / `lintCode`) em vez de introduzir `performFormatting` / `performLinting`.
* **Alternativas consideradas:** Renomear o contrato do core para casar literalmente com o texto do issue.
* **Motivo da escolha:** O código já possui `formatCode()` e `lintCode()` declarados em `LspProvider`; estender o contrato atual é menor, consistente e evita churn desnecessário.
* **Impactos / trade-offs:** A spec se desvia da nomenclatura textual do issue, mas permanece alinhada com a evidência concreta da codebase.

* **Decisão:** Fazer a ação `Arrumar código` aplicar o pipeline `lintCode() -> formatCode()`, separando estilização e formatação conforme o contrato atualizado do `LspProvider`.
* **Alternativas consideradas:** Concentrar tudo em `formatCode()`; usar o linter apenas para persistência futura; criar um serviço de formatação na UI.
* **Motivo da escolha:** O contrato do provider agora separa explicitamente as responsabilidades, e a toolbar pode orquestrar as duas etapas sem alterar o desenho das camadas.
* **Impactos / trade-offs:** A ação `Arrumar código` continua podendo renomear identificadores e converter paradigma quando as regras estiverem ligadas, mas a orquestração passa a existir na UI em vez de ficar toda dentro de um único método do adapter.

* **Decisão:** Aplicar automaticamente o mesmo pipeline de lint/formatação no carregamento do `ChallengeCodeEditor`.
* **Alternativas consideradas:** Manter apenas a ação manual `Arrumar código`; formatar somente quando o usuário clicar em executar; aplicar também no playground no carregamento.
* **Motivo da escolha:** O requisito de desafio pede que o código já carregue aderente às regras atuais, e o hook do slot de desafio já é o ponto responsável por hidratar código inicial de `localStorage`/`challenge.code`.
* **Impactos / trade-offs:** O carregamento do editor passa a executar uma etapa assíncrona adicional; em contrapartida, o usuário entra com o código já padronizado e a persistência local fica alinhada ao resultado formatado.

* **Decisão:** Centralizar o autocomplete local no provider customizado da linguagem, com registro singleton e deduplicação explícita.
* **Alternativas consideradas:** Manter apenas `wordBasedSuggestions` do Monaco; registrar provider por instância de editor; não deduplicar sugestões.
* **Motivo da escolha:** O editor é montado em múltiplos contextos e o provider de linguagem é global no Monaco; sem singleton e dedupe, surgem sugestões repetidas e baixa qualidade de UX.
* **Impactos / trade-offs:** O autocomplete fica mais previsível para Delégua, mas exige manutenção de regexes locais para extração de símbolos (`função`, `var`, `const|constante|fixo`).

* **Decisão:** Reutilizar `QuebradorDeLinha` da própria Delegua e manter fallback local apenas para o caso de o delimitador de texto não refletir o valor configurado.
* **Alternativas consideradas:** Confiar somente no `FormatadorDelegua`; manter também uma implementação própria de quebra de linha no adapter.
* **Motivo da escolha:** A atualização para `@designliquido/delegua@1.16.3` passou a expor `QuebradorDeLinha`, então a spec deve preferir o helper oficial e reduzir código proprietário no adapter.
* **Impactos / trade-offs:** Diminui a complexidade local para `maxCharsPerLine`, mas a spec ainda preserva um ponto de atenção para compatibilização do delimitador de texto com os valores do core.

* **Decisão:** Hidratar `editorState` mesclando defaults aninhados aos dados já persistidos.
* **Alternativas consideradas:** Invalidar o `localStorage` antigo; assumir que todo estado salvo já conterá os novos campos.
* **Motivo da escolha:** O projeto já tem usuários com configuração salva apenas para fonte/tab/checker, e a feature não deve quebrar o editor existente.
* **Impactos / trade-offs:** O provider ganha lógica extra de merge profundo, mas evita regressão de compatibilidade no navegador.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
Usuario
  |
  +--> CodeEditorSettingsDialog
  |      |
  |      v
  |   useCodeEditorSettingsDialog
  |      |
  |      v
  |   EditorContext.dispatch(setFormatter | setLinter)
  |      |
  |      v
  |   useEditorContextProvider.storeEditorState()
  |      |
  |      v
  |   localStorage(STORAGE.keys.editorState)
  |
  +--> CodeEditorToolbar (botao ou Ctrl/Cmd+M)
         |
         v
      useCodeEditorToolbar.handleFormatCode()
         |
         +--> getEditorConfig()
         |
         +--> codeEditorRef.getValue()
         |
         v
      lspProvider.lintCode(code, linter)
         |
         v
      DeleguaLsp.lintCode()
         |
         +--> Lexador + AvaliadorSintatico
         +--> EstilizadorDelegua(regras habilitadas)
         |
         v
      lspProvider.formatCode(lintedCode, formatter)
         |
         v
      DeleguaLsp.formatCode()
         |
         +--> FormatadorDelegua
         +--> fallback delimitador de texto
         +--> QuebradorDeLinha
         |
         v
      string formatada
         |
         v
      codeEditorRef.setValue(formattedCode)
         |
         v
      CodeEditor.onChange()
         |
         +--> ChallengeCodeEditorSlot.handleCodeChange()
         |      ou
         +--> Playground.Snippet.onCodeChange()
```

* **Fluxo Cross-app (se aplicável):** Não aplicável.

* **Layout (se aplicável):** Não aplicável.

* **Referências:**
- `apps/web/src/ui/global/contexts/EditorContext/useEditorContextProvider.ts`
- `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`
- `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/useCodeEditorToolbar.ts`
- `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorSettingsDialog/index.tsx`
- `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts`
- `apps/web/src/ui/global/widgets/components/CodeSnippet/index.tsx`
- `apps/web/src/ui/global/widgets/components/CodeSnippet/useCodeSnippet.ts`
- `apps/web/src/ui/global/widgets/components/CodeEditor/useCodeEditor.ts`
- `apps/web/src/ui/global/widgets/components/CodeEditor/CodeEditorView.tsx`
- `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/ChallengeCodeEditorSlotView.tsx`
- `apps/web/src/ui/playground/widgets/pages/Snippet/index.tsx`
- `packages/core/src/global/interfaces/provision/LspProvider.ts`
- `packages/lsp/src/DeleguaLsp.ts`
- `node_modules/@designliquido/delegua/estilizador/estilizador-delegua.d.ts`
- `node_modules/@designliquido/delegua/estilizador/regras/convencao-nomenclatura.d.ts`
- `node_modules/@designliquido/delegua/estilizador/regras/paradigma-consistente.d.ts`

---

# 10. Pendências / Dúvidas

**Sem pendências**.

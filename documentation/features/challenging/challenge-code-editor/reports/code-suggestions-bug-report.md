---
title: Sugestões de código ausentes no editor
prd: https://github.com/JohnPetros/stardust/milestone/13
issue: https://github.com/JohnPetros/stardust/issues/488
apps: web
status: open
last_updated_at: 2026-07-15
---

# Bug Report: Sugestões de código ausentes no editor

## Problema Identificado

Ao usar o editor Monaco configurado para a linguagem `delegua`, o popup de autocomplete exibe `No suggestions` mesmo quando o usuário aciona `Ctrl + Espaço` sobre prefixos esperados da linguagem, como `ret` para `retorna`, dentro de uma função.

O comportamento esperado é que o `CodeEditor` usado em desafios, playground, snippets e blocos reutilizados apresente sugestões úteis da linguagem durante a digitação e também quando o autocomplete for acionado manualmente. Além do catálogo estático da linguagem, o autocomplete deve sugerir símbolos declarados no código atual, como variáveis, parâmetros e funções criadas pelo usuário à medida que ele digita.

## Causas

- Catálogo de snippets do `@stardust/lsp` incompleto para autocomplete: ele expõe métodos e funções globais, mas não inclui palavras-chave e estruturas da linguagem como `retorna`, `funcao`, `variavel`, condicionais e laços.
- Provider de completion do Monaco usa exclusivamente `lspSnippets`; quando o catálogo não contém um item compatível com o prefixo digitado, o Monaco filtra a lista retornada e exibe `No suggestions`.
- Provider de completion não deriva sugestões dinâmicas a partir de `model.getValue()`, então variáveis, parâmetros e funções declaradas pelo usuário no próprio editor não aparecem no autocomplete enquanto o código é escrito.
- A integração atual não possui cobertura de teste para garantir que prefixos reais da linguagem, como `ret`, `fun`, `enca`, `map`, `tam` e `esc`, retornem sugestões.

## Contexto e Análise

### Camada Core (Use Cases)
- **Arquivo:** `packages/core/src/global/domain/types/LspSnippet.ts`
- **Diagnóstico:** Fato: o contrato compartilhado de snippet possui apenas `label` e `code`. Esse shape é suficiente para alimentar sugestões básicas do Monaco e já é usado pelo `CodeEditor`. Hipótese: se a correção exigir metadados adicionais, como tipo de sugestão ou aliases, o contrato precisará evoluir de forma compatível com os consumidores atuais.

### Camada Provision (Providers)
- **Arquivo:** `packages/lsp/src/constants/delegua-snippets.ts`
- **Diagnóstico:** Fato: `DELEGUA_SNIPPETS` agrega somente snippets de métodos de listas, dicionários, funções globais e textos. O arquivo não inclui um catálogo de palavras-chave ou estruturas sintáticas, embora a milestone do editor de desafios defina autocomplete como requisito da experiência de escrita.
- **Arquivo:** `packages/lsp/src/constants/delegua-snippets-metodos-globais.ts`
- **Diagnóstico:** Fato: funções como `escreva`, `leia`, `mapear`, `tamanho`, `texto` e conversores já existem como snippets. Esses itens não explicam a falha com `ret`, mas devem continuar disponíveis após a correção.
- **Arquivo:** `packages/lsp/src/constants/delegua-snippets-metodos-lista.ts`
- **Diagnóstico:** Fato: métodos como `adicionar`, `encaixar`, `filtrarPor`, `mapear` e `removerUltimo` já existem no catálogo. A correção não deve substituir esse catálogo, apenas ampliar a cobertura de sugestões.
- **Arquivo:** `packages/lsp/src/constants/delegua-snippets-metodos-texto.ts`
- **Diagnóstico:** Fato: métodos de texto como `dividir`, `maiusculo`, `minusculo`, `substituir` e `subtexto` já existem no catálogo.
- **Arquivo:** `packages/lsp/src/constants/delegua-snippets-metodos-dicionarios.ts`
- **Diagnóstico:** Fato: existem variações acentuadas e não acentuadas, como `contem` e `contém`. A correção precisa evitar novas duplicatas que tornem o autocomplete ruidoso.
- **Arquivo:** `packages/lsp/src/constants/delegua-tokens.ts`
- **Diagnóstico:** Fato: tokens como `funcao`, `função`, `retorna`, `se`, `senao`, `senão`, `enquanto`, `para`, `verdadeiro`, `falso` e `var` já existem para sintaxe. Hipótese: esse arquivo pode orientar a cobertura do autocomplete, mas não deve ser convertido automaticamente em suggestions sem curadoria.
- **Arquivo:** `packages/lsp/src/constants/index.ts`
- **Diagnóstico:** Fato: o pacote já expõe `DELEGUA_SNIPPETS`, `DELEGUA_EXAMPLE_SNIPPETS`, `DELEGUA_TOKENS` e `DELEGUA_REGEX`. A fonte pública do catálogo pode continuar concentrada nesse barrel.

### Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/global/hooks/useLsp.ts`
- **Diagnóstico:** Fato: o hook instancia `DeleguaProvedorLsp` e entrega `documentations`, `snippets` e `exampleSnippets` a partir do `@stardust/lsp`. Se `DELEGUA_SNIPPETS` não contém `retorna` ou estruturas da linguagem, nenhum `CodeEditor` que usa esse hook consegue sugerir esses itens.
- **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditor/index.tsx`
- **Diagnóstico:** Fato: o entry point do `CodeEditor` resolve `useLsp()` e passa `snippets` para `useCodeEditor`. Isso confirma que o problema afeta todos os consumidores do componente global, não apenas o editor de desafios.
- **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditor/useCodeEditor.ts`
- **Diagnóstico:** Fato: `provideCompletionItems` transforma `lspSnippets` diretamente em `suggestions` e usa o `range` do prefixo atual. Como a lista recebida não contém keywords estruturais, prefixos como `ret` não têm item compatível. Fato: o provider recebe o `model`, mas não extrai símbolos do código atual via `model.getValue()`, então nomes declarados pelo usuário não entram na lista de sugestões. Fato: `handleEditorDidMount` registra `registerHoverProvider` e `registerCompletionItemProvider` a cada montagem sem armazenar os `IDisposable` retornados pelo Monaco; isso não explica o `No suggestions` inicial, mas pode acumular providers em navegações client-side.
- **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditor/CodeEditorView.tsx`
- **Diagnóstico:** Fato: a view monta `MonacoEditor` com `language={LANGUAGE}` e preserva o mecanismo nativo de autocomplete do Monaco. Não há evidência de erro de renderização nesse ponto.
- **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeEditor/language.ts`
- **Diagnóstico:** Fato: a linguagem registrada é `delegua`, o mesmo identificador usado no `MonacoEditor` e no registro dos providers.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/ChallengeCodeEditorSlotView.tsx`
- **Diagnóstico:** Fato: o editor de desafio usa o componente global `CodeEditor`, logo herda a ausência de sugestões do catálogo global. Não há provider específico de autocomplete no slot.
- **Arquivo:** `apps/web/src/ui/global/widgets/components/PlaygroundCodeEditor/index.tsx`
- **Diagnóstico:** Fato: o playground também usa o componente global `CodeEditor`. Como o bug está no componente compartilhado e no catálogo do LSP, a correção deve cobrir playground, snippets e blocos reutilizados ao mesmo tempo.
- **Arquivo:** `apps/web/src/ui/playground/widgets/pages/Snippet/SnippetPageView.tsx`
- **Diagnóstico:** Fato: a página de snippet monta `PlaygroundCodeEditor`, portanto também é afetada pela mesma falha de autocomplete.

## Direcionamento de Correção

A correção deve atuar principalmente no catálogo de sugestões exposto por `packages/lsp/src/constants/delegua-snippets.ts` e consumido por `apps/web/src/ui/global/hooks/useLsp.ts`, garantindo cobertura explícita para palavras-chave e estruturas da linguagem `delegua` sem remover os snippets de métodos já existentes.

No widget global, `apps/web/src/ui/global/widgets/components/CodeEditor/useCodeEditor.ts` deve continuar sendo o ponto único de registro do provider de completion, mas precisa combinar sugestões estáticas vindas do LSP com sugestões dinâmicas extraídas do `model` atual do Monaco, incluindo variáveis, parâmetros e funções declaradas no código. Essa transformação deve ser testável, usar constantes do Monaco em vez de números mágicos e evitar acúmulo de providers em remounts.

A validação deve cobrir pelo menos um consumidor real do `CodeEditor`, preferencialmente o editor de desafios ou o playground, confirmando que prefixos como `ret`, `fun`, `enca`, `map`, `tam` e `esc` não exibem `No suggestions` quando houver sugestões conhecidas. Também deve cobrir um caso em que o usuário declara um símbolo no próprio código, como `variavel precoFinal` ou um parâmetro de `funcao`, e recebe esse nome como sugestão enquanto continua digitando.

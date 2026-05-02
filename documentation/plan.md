---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
status: closed
---

## Pendencias (quando aplicavel)

Sem pendencias bloqueantes no documento de entrada.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir o contrato compartilhado dos exemplos de Playground no catalogo da linguagem, preservando o contrato atual de autocomplete | - | - |
| F3 | Integrar o catalogo de exemplos ao editor de snippets da web com dialog, confirmacao e toolbar contextual | F1 | - |

> **Estratégia de paralelismo:** sempre comece pelo core (domínio, structures e use cases). Assim que o core estiver concluído, as fases de `server`, `web` e `studio` podem ser executadas em paralelo, pois todas dependem apenas do contrato definido no core.

---

## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Definir o contrato do domínio — entidades, structures, interfaces de repositório/provider e use cases — sem nenhuma dependência de infraestrutura. Essa fase desbloqueia F2, F3 e F4 para rodarem em paralelo.

### Tarefas

- [x] **T1.1** — Declarar o catalogo compartilhado `DELEGUA_EXAMPLE_SNIPPETS` com 10 exemplos completos reutilizando `LspSnippet`
  - **Depende de:** -
  - **Resultado observavel:** existe o arquivo `packages/lsp/src/constants/delegua-example-snippets.ts` exportando `DELEGUA_EXAMPLE_SNIPPETS: LspSnippet[]` com exatamente 10 itens, na ordem da spec, usando apenas `{ label, code }` sem placeholders do Monaco.
  - **Camada:** `core`
  - **Artefatos:** `packages/lsp/src/constants/delegua-example-snippets.ts`
  - **Concluido em:** 2026-04-29

- [x] **T1.2** — Publicar o catalogo novo sem alterar o contrato atual de autocomplete
  - **Depende de:** T1.1
  - **Resultado observavel:** `packages/lsp/src/constants/index.ts` e o export publico do pacote continuam expondo `DELEGUA_SNIPPETS` inalterado e passam a expor `DELEGUA_EXAMPLE_SNIPPETS` como constante distinta para consumo externo.
  - **Camada:** `core`
  - **Artefatos:** `packages/lsp/src/constants/index.ts`
  - **Concluido em:** 2026-04-29

---

## F3 — Web: UI e Integração

> ⚡ Pode rodar em paralelo com F2 e F4 após F1 estar concluída.

**Objetivo:** Implementar a interface e integração client-side na aplicação web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T3.1** — Expor `exampleSnippets` em `useLsp()` sem mudar o retorno atual de `snippets`
  - **Depende de:** T1.2
  - **Resultado observavel:** `apps/web/src/ui/global/hooks/useLsp.ts` retorna `exampleSnippets` com base em `DELEGUA_EXAMPLE_SNIPPETS`, enquanto `snippets` continua alimentando apenas o autocomplete do Monaco.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/global/hooks/useLsp.ts`
  - **Concluido em:** 2026-04-29

- [x] **T3.2** — Criar o widget `SnippetExamplesDialog` para listar e selecionar exemplos
  - **Depende de:** T1.2
  - **Resultado observavel:** existem `apps/web/src/ui/playground/widgets/components/SnippetExamplesDialog/index.tsx` e `SnippetExamplesDialogView.tsx`, com trigger fechado por padrao, lista acessivel de exemplos e mensagem de estado vazio quando `snippets.length === 0`.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/playground/widgets/components/SnippetExamplesDialog/index.tsx`, `apps/web/src/ui/playground/widgets/components/SnippetExamplesDialog/SnippetExamplesDialogView.tsx`
  - **Concluido em:** 2026-04-29

- [x] **T3.3** — Estender `CodeEditorToolbar` para aceitar acao customizada e ocultar o assistente por contexto
  - **Depende de:** T1.2
  - **Resultado observavel:** `CodeEditorToolbar` e `CodeEditorToolbarView` aceitam `options.customActions` e `options.shouldHideAssistantButton`; quando a flag estiver ativa, o botao `Assistente de codigo` nao e renderizado e a acao customizada aparece dentro de `Toolbar.Container`.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`, `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/CodeEditorToolbarView.tsx`
  - **Concluido em:** 2026-04-29

- [x] **T3.4** — Implementar no `useSnippetPage` o fluxo local de aplicar exemplo e confirmar sobrescrita
  - **Depende de:** T1.2
  - **Resultado observavel:** `useSnippetPage` passa a expor handlers para selecionar e confirmar exemplo; se `snippetTitle` ou `snippetCode` estiverem dirty, a confirmacao e aberta antes da substituicao; se nao estiverem dirty, titulo e codigo sao atualizados localmente com `setValue(..., { shouldDirty: true, shouldValidate: true })` e `playgroudCodeEditorRef.current?.setValue(...)`, sem chamar `createSnippet` nem `updateSnippet`.
  - **Camada:** `ui`
  - **Artefatos:** `apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`
  - **Concluido em:** 2026-04-29

- [x] **T3.5** — Integrar dialog de exemplos e confirmacao na composicao de `SnippetPage`
  - **Depende de:** T3.1, T3.2, T3.3, T3.4
  - **Resultado observavel:** em `/playground/snippets/new` e `/playground/snippets/:snippetId`, a toolbar exibe a acao `Exemplos`, abre o dialog local com os 10 itens, pede confirmacao antes de sobrescrever titulo/codigo alterados, nao salva automaticamente e nao mostra o botao `Assistente de codigo`.
  - **Camada:** `web`
  - **Artefatos:** `apps/web/src/ui/playground/widgets/pages/Snippet/index.tsx`
  - **Concluido em:** 2026-04-29

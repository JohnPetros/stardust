title: Drawer de Notas nao fecha no primeiro clique apos selecao
issue: https://github.com/JohnPetros/stardust/issues/444
apps: web
status: closed
last_updated: 2026-07-01

# Bug Report: Drawer de Notas nao fecha no primeiro clique apos selecao

## Problema Identificado

Apos abrir o drawer de notas, acessar a lista de notas, selecionar uma anotacao existente e retornar ao editor, o botao `Fechar anotacoes` nao fecha o drawer no primeiro clique. A interface permanece aberta sem feedback visual de erro, e apenas o segundo clique no `X` encerra o drawer.

O comportamento esperado e que a selecao de uma nota mantenha o drawer aberto para edicao, mas que qualquer fechamento manual posterior seja respeitado imediatamente, ainda passando pela confirmacao de descarte quando houver alteracoes nao salvas.

## Causas

- `handleSelectNote(note)` deixa `shouldIgnoreNextDrawerCloseRef.current` ativo apos selecionar uma nota.
- A flag foi criada para ignorar um fechamento transitorio durante a troca entre dialog de listagem e editor, mas nao ha garantia de que ela seja consumida nesse momento.
- Quando a flag permanece ativa, o proximo `handleDrawerOpenChange(false)` e descartado, mesmo se tiver sido disparado pelo clique explicito no botao `Fechar anotacoes`.
- O fluxo atual nao diferencia o fechamento interno causado pela composicao `Dialog` + `Drawer` do fechamento manual solicitado pelo usuario.

## Contexto e Analise

### Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/global/widgets/components/NotesDrawer/useNotesDrawer.ts`
- **Diagnostico:** O hook e o ponto real do bug. Ele controla `isDrawerOpen`, `isDialogOpen`, selecao da nota ativa, dirty state e fechamento com descarte. A condicao `!isOpen && (isDialogOpen || shouldIgnoreNextDrawerCloseRef.current)` torna o fechamento dependente de uma flag imperativa que pode permanecer armada alem do evento que deveria proteger.

- **Arquivo:** `apps/web/src/ui/global/widgets/components/NotesDrawer/useNotesDrawer.ts`
- **Diagnostico:** Em `handleSelectNote(note)`, a nota selecionada e sincronizada corretamente com o editor (`activeNote`, `title`, `content`, `isDirty=false`) e o dialog e fechado. O problema nao esta na selecao em si, mas no efeito colateral de armar `shouldIgnoreNextDrawerCloseRef.current = true` sem uma janela de validade bem delimitada.

- **Arquivo:** `apps/web/src/ui/global/widgets/components/NotesDrawer/NotesDrawerView.tsx`
- **Diagnostico:** A view apenas encaminha o clique do botao `Fechar anotacoes` para `onDrawerOpenChange(false)`. O componente esta coerente com sua responsabilidade de renderizacao; a falha aparece porque o handler recebido pode ignorar esse fechamento.

- **Arquivo:** `apps/web/src/ui/global/widgets/components/NotesDrawer/NotesListDialog/NotesListDialogView.tsx`
- **Diagnostico:** O dialog de listagem apenas chama `onSelectNote(note)` na selecao. Ele nao altera contratos de dados, cache remoto nem estado global; sua participacao no bug e disparar o fluxo local que deixa a flag residual armada.

- **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/LessonHeader/index.tsx`
- **Diagnostico:** A lesson monta `NotesDrawer` ao redor do atalho visual. Nao ha logica local que altere abertura, selecao ou fechamento de notas.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`
- **Diagnostico:** A challenge page injeta `NotesDrawer` como `notesSlot`. Assim como em lesson, nao ha evidencia de comportamento especifico do fluxo de desafio interferindo no fechamento.

## Direcionamento de Correcao

A correcao deve atuar na camada `ui`, principalmente em `apps/web/src/ui/global/widgets/components/NotesDrawer/useNotesDrawer.ts`, restringindo ou removendo o uso residual de `shouldIgnoreNextDrawerCloseRef`. O fechamento do drawer deve continuar sendo ignorado enquanto o dialog de listagem estiver aberto, mas a selecao de uma nota nao deve deixar uma flag ativa capaz de bloquear o proximo fechamento manual. A regra de descarte via `confirmDiscardChanges()` deve ser preservada.

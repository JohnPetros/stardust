# Página de edição de conteúdo de guia

Status: Concluído

## Objetivo
 
Pensando na melhor UX de edição de conteúdo de uma guia, faz-se necessário criar uma página específica para isso. Esta página deve ser agnóstica a categoria de guide (mdx/lsp).

## Core

- `Guide`, entidade que representa um guide
- `ManualService`, interface para efetuar as requisições REST de guides (incluindo o novo método `fetchGuide`)
- `ToastProvider`, interface para exibir toasts
- `RestResponse`, classe que representa a resposta de uma requisição REST
- `ActionButtonStore`, para gerenciar o estado do botão de salvar

## Camada App

### `GuidePageRoute`

- a rota deve ser acessível pela rota `/manual/guides/:category/:guideId`
- Caso category não seja lsp ou mdx, deve redirecionar para a rota de 404
- faça o fetching do guide a partir do id por meio do `ManualService`
- Caso o guide não exista com o id fornecido, deve redirecionar para a rota de 404
- Deve renderizar o widget `GuidePage`
- Disponibilize os dados do `Guide` ao `GuidePage` via `useLoaderData`

## Camada UI

### `useGuidePage`

- Use um handler que chame o `ManualService` para editar o conteúdo de um guide
- Utilize o `useActionButtonStore` para gerenciar o estado de salvamento (loading, success, error)
- Ao editar o conteúdo de um guide com sucesso faça o refetch do cache
- Exiba um toast de erro caso a requisição falhe

### `GuidePage index`

- Use o useRest hook para importar o `ManualService`
- Use o useToastProvider hook para importar o `ToastProvider`
- Use o useLoaderData hook para importar os dados do `Guide`

### `GuidePageView`

- Deve estar dividido em duas colunas, além do header:
    - Editor de texto (widget `TextEditor`, que já existe)
    - Preview (widget `Mdx`, que já existe)
- Todo texto escrito no editor de texto deve ser refletido na preview como Mdx
- Deve haver no header um botão para salvar o conteúdo do guide. Use o widget `ActionButton`, que já existe para tal.
- Use página `LessonStoryPage` como inspiração para a página de edição de conteúdo de guia
- Tome cuidade com o tamanho do editor, ele deve ser scrollável e não ocupar o espaço que não contenha o header
- O preview deve ser scrollável também e acompanhar a altura do editor
    

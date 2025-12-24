# Grid de Guias LSP

## Objetivo

Criar uma página para fazer o gerenciamento de alto nível de guias do LSP, sendo possível listar, criar, editar e excluir guias.

## Core

- `Guide`, entidade que representa um guide
- `ManualService`, interface para efetuar as requisições REST de guides
- `ToastProvider`, interface para exibir toasts
- `RestResponse`, classe que representa a resposta de uma requisição REST

## Camada REST

- Implemente a interface `ManualService`

## Camada App

### `RestContext`

- Registre o service `ManualService` na context `RestContext`

### Constante `ROUTES`

- Adicione um grupo de rotas para o módulo `manual`
- Adicione a rota `guides/:category` no objeto `routes` do react-router
- Faça a mesma coisa, antes, para a constante `ROUTES`, só como uma função que recebe como parâmetro `category` de guide

### `LspGuidesRoute`

- Crie o componente `LspGuidesRoute.tsx`
- Não precisa de loader ou action
- Com base na route param `category`, renderize o widget `LspGuidesPage` ou `MdxGuidesPage` (não deve existir ainda)
- Rendize a página de not found se `category` não for `lsp` ou `mdx`

## Camada UI

### `useRest`

- Registre o service `ManualService` no hook `useRest`

### `LspGuidesPage`

- Crie o widget `LspGuidesPage`
- Use o widget `AchievementsPage` como inspiração

### `LspGuidesGrid`

- Crie o widget `LspGuidesGrid`
- Para cada guide renderize o widget `LspGuidesCard`
- Deve conter até 3 colunas
- Não deve ter paginação
- Use o widget `SortableGridContainer` para implementar a grid
- O título do card deve ser editável utilizando o widget `ExpandableInput`
- Insira um link no card de guide para a rota `/manual/guides/lsp/:guideId` (Não deve existir ainda esta página)
- Deve renderizar o título e a posição do guide em questão como card para cada guide
- O card deve apresentar um botão para pedir deleção de guide
- A deleção deve ser confirmada pelo usuário por meio de um widget do tipo `AlertDialog`
- Ao reordenar os cards, deve chamar a função `onDragEnd` passando os ids dos cards e então chamar a função `reorderGuides` do `ManualService` no hook de `LspGuidesGrid`
- Atualize e delete um guide por meio dos handlers `handleGuideUpdate` e `handleGuideDelete`, chamando os métodos `updateGuide` e `deleteGuide` do `ManualService` dentro do hook de `LspGuidesPage`
- Caso qualquer `RestResponse` for failure, deve chamar a função `toastProvider.showError`
- O ultimo item da grid devve ser um card com dashed board com um botão no meio que quando clicado deve ser inserido um novo guide com título vazio.


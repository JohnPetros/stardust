# Card de criação de guia LSP

## Objetivo

Adicionar um botão de criação de guia LSP no widget `LspGuidesPage`.

Status: Concluído

módulos de infra: UI
app: studio

## Core

- `Guide`, entidade que representa um guide
- `ManualService`, interface para efetuar as requisições REST de guides
- `ToastProvider`, interface para exibir toasts
- `RestResponse`, classe que representa a resposta de uma requisição REST

## Camada UI

### Hook `useRest`

- Registre o service `ManualService` no hook `useRest`

### Widget `LspGuidesPage`

- Use um handler que chame o `ManualService` para criar um novo guide
- Ao criar um novo guide com sucesso faça o refetch do cache
- Exiba um toast de erro caso a requisição falhe

### Widget `LspGuidesGrid`

- Insira um card placeholder (dashed board) com um botão centralizado que abre um Dialog contendo o `LspGuideForm` para criação do guide via prop `onCreateGuide`

### Widget `LspGuideForm`

- Crie um form para criar um guide
- Deve conter um campo texto para título apenas
- Deve conter um botão de criar e cancelar
- Valide o campo de título com zod e react hook form
- Use dentro do `CreateGuideCard` (via Dialog) e `LspGuidesCard` (para edição)



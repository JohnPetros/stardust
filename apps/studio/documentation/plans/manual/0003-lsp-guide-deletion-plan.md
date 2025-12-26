# Botão de criação de guia LSP

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

### Hook `useLspGuidesPage`

- Use um handler que chame o `ManualService` para deletar um guide
- Ao deletar um guide com sucesso faça o refetch do cache
- Exiba um toast de erro caso a requisição falhe

### Widget `LspGuidesCard`

- Use o botão de delete do widget para deletar um guide via prop `onDeleteGuide`
- Renderize uma mensagem de confirmação antes de efetuar a deleção
- Use o AlertDialog para renderizar a mensagem de confirmação

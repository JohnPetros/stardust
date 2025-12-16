# Deleção de foguete

## Objetivo

Implementar funcionalidade de deleção de foguete no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Em andamento

### Camada Core

- Interface `ShopService` possui o método `deleteRocket` para deletar um
  foguete.
- `Rocket` é a entidade usada para representar um foguete.
- `RocketDto` é o DTO usado para criar uma entidade foguete.
- `UiProvider` é usado para fazer alterações globais a UI da aplicação.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- Implemente o método `deleteRocket` no service `ShopService`.

### Camada UI

- Use widget de botão `DeleteButton` para deletar um foguete.
- Use o service `ShopService` para deletar o foguete no hook do `RocketsTable`.
- Deve haver um dialog de confirmação para deletar o foguete.
- Ao clicar no botão "Cancelar", o dialog é fechado automaticamente pelo `AlertDialog`.
- Ao clicar no botão "Deletar", o método `onDelete` é executado, que por sua vez chama `handleDelete` do hook.
- Use o `UiProvider` para atualizar a ui da página ao deletar o foguete no hook do `RocketsTable`.
- Use o `ToastProvider` para exibir mensagens de sucesso ou erro ao deletar o foguete no hook do `RocketsTable`.
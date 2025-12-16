# Deleção de avatar

## Objetivo

Implementar funcionalidade de deleção de avatar no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Em andamento

### Camada Core

- Interface `ShopService` possui o método `deleteAvatar` para deletar um
  avatar.
- `Avatar` é a entidade usada para representar um avatar.
- `AvatarDto` é o DTO usado para criar uma entidade avatar.
- `UiProvider` é usado para fazer alterações globais a UI da aplicação.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- Implemente o método `deleteAvatar` no service `ShopService`.

### Camada UI

- Use widget de botão `DeleteButton` para deletar um avatar.
- Use o service `ShopService` para deletar o avatar no hook do `AvatarsTable`.
- Deve haver um dialog de confirmação para deletar o avatar.
- Ao clicar no botão "Cancelar", o dialog é fechado automaticamente pelo `AlertDialog`.
- Ao clicar no botão "Deletar", o método `onDelete` é executado, que por sua vez chama `handleDelete` do hook.
- Use o `UiProvider` para atualizar a ui da página ao deletar o avatar no hook do `AvatarsTable`.
- Use o `ToastProvider` para exibir mensagens de sucesso ou erro ao deletar o avatar no hook do `AvatarsTable`.
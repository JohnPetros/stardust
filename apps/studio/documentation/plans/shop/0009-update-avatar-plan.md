# Atualização de avatar

## Objetivo

Implementar funcionalidade de atualização de avatar no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Em andamento

### Camada Core

- Interface `ShopService` possui o método `updateAvatar` para atualizar um
  avatar.
- `AvatarDto` é usado para representar um avatar.
- `UiProvider` é usado para fazer alterações globais a UI da aplicação.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- Implemente o método `updateAvatar` no service `ShopService`.

### Camada UI

- Use widget de formulário `AvatarForm` para atualizar um avatar, que deve ser
  preenchido com os dados do avatar existente.
- Use o service `ShopService` para atualizar o avatar no hook do `AvatarsTable`.
- Use o `UiProvider` para atualizar a ui da página ao atualizar o avatar no hook
  do `AvatarsTable`.
- Use o `ToastProvider` para exibir mensagens de sucesso ou erro ao atualizar o
  avatar no hook do `AvatarsTable`.
- Exiba loading na tabela enquanto o avatar é atualizado.

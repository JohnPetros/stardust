# Atualização de foguete

## Objetivo

Implementar funcionalidade de atualização de foguete no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Em andamento

### Camada Core

- Interface `ShopService` possui o método `updateRocket` para atualizar um
  foguete.
- `RocketDto` é usado para representar um foguete.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- Implemente o método `updateRocket` no service `ShopService`.

### Camada UI

- Use widget de formulário `RocketForm` para atualizar um foguete, que deve ser preenchido com os dados do foguete existente.
- Use o service `ShopService` para atualizar o foguete no hook do `RocketsTable`.
- Use o `UiProvider` para atualizar a ui da página ao atualizar o foguete no hook do `RocketsTable`.
- Use o `ToastProvider` para exibir mensagens de sucesso ou erro ao atualizar o foguete no hook do `RocketsTable`.
- Exiba loading na tabela enquanto o foguete é atualizado.
- Faça o refetch dos dados da tabela ao atualizar o foguete.
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
- Faça o refetch dos dados da tabela ao atualizar o avatar.

## Detalhes de Implementação

1.  **ShopService**: Adicionar método `updateAvatar(avatar: AvatarDto)` que faz um POST ou PUT para `/shop/avatars` (ou endpoint específico de update).
2.  **AvatarFormView**: Adicionar prop `initialValues` e passá-la para `useAvatarForm`.
3.  **useAvatarForm**: Atualizar `useForm` para usar `initialValues` como `defaultValues` quando fornecido.
4.  **AvatarsTableView**:
    - Substituir o botão "Editar" estático por uma instância de `AvatarForm` configurada para edição.
    - Passar o `avatar` da linha atual como `initialValues`.
    - Passar uma nova função `handleUpdateAvatar` como `onSubmit`.
5.  **useAvatarsTable**:
    - Criar `handleUpdateAvatar` que chama `shopService.updateAvatar`.
    - Gerenciar estado de loading (`isCreating`/`isUpdating`).
    - Exibir toast de sucesso/erro.
